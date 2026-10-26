import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ScreenContainer } from '@/components/ScreenContainer';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/hooks/useCatalog';
import { getCurrentUser } from '@/services/auth';
import { createOrder } from '@/services/orders';
import { colors, radius, spacing } from '@/theme';
import { formatMoney } from '@/utils/money';
import type { PaymentMethod } from '@/types';

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, total, storeId, clear } = useCart();
  const { data: store, isLoading } = useStore(storeId ?? '');

  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [complement, setComplement] = useState('');
  const [payment, setPayment] = useState<PaymentMethod>('pix');
  const [changeFor, setChangeFor] = useState('');
  const [loading, setLoading] = useState(false);

  const deliveryFee = store?.delivery_fee ?? 0;
  const finalTotal = total + deliveryFee;
  const minimum = store?.min_order ?? 0;

  async function handleConfirm() {
    if (!items.length || !storeId) {
      Alert.alert('Carrinho vazio', 'Adicione produtos antes de continuar.');
      router.replace('/(app)/cart');
      return;
    }

    if (!street.trim() || !number.trim() || !neighborhood.trim()) {
      Alert.alert('Endereço incompleto', 'Preencha rua, número e bairro para continuar.');
      return;
    }

    if (isLoading || !store) {
      Alert.alert('Aguarde', 'Estamos carregando os dados da loja.');
      return;
    }

    if (!store.is_open) {
      Alert.alert('Loja fechada', 'Esta loja não está aceitando pedidos.');
      return;
    }

    if (total < minimum) {
      Alert.alert(
        'Pedido abaixo do mínimo',
        `O valor mínimo desta loja é ${formatMoney(minimum)}.`,
      );
      return;
    }

    let parsedChange: number | null = null;

    if (payment === 'cash') {
      parsedChange = changeFor.trim() ? Number(changeFor.replace(',', '.')) : 0;

      if (!Number.isFinite(parsedChange) || parsedChange < finalTotal) {
        Alert.alert(
          'Troco insuficiente',
          `Informe um valor em dinheiro igual ou superior a ${formatMoney(finalTotal)}.`,
        );
        return;
      }
    }

    setLoading(true);

    try {
      const user = await getCurrentUser();

      if (!user) {
        Alert.alert(
          'Entre na sua conta',
          'Você precisa fazer login para concluir o pedido.',
          [
            {
              text: 'Fazer login',
              onPress: () => router.push('/(app)/auth/login'),
            },
            { text: 'Cancelar', style: 'cancel' },
          ],
        );
        return;
      }

      const orderId = await createOrder({
        storeId,
        items: items.map(({ product, quantity }) => ({
          product_id: product.id,
          quantity,
        })),
        payment,
        changeFor: parsedChange,
        street,
        number,
        neighborhood,
        complement,
      });

      clear();

      Alert.alert('Pedido confirmado! 🎉', 'Seu pedido foi enviado para a loja.', [
        {
          text: 'Ver meus pedidos',
          onPress: () =>
            router.replace({
              pathname: '/(app)/orders/[id]',
              params: { id: orderId },
            }),
        },
        { text: 'Voltar às lojas', onPress: () => router.replace('/') },
      ]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Não foi possível concluir o pedido.';

      Alert.alert('Erro ao finalizar pedido', message);
    } finally {
      setLoading(false);
    }
  }

  if (!items.length) {
    return (
      <ScreenContainer>
        <Text style={styles.title}>Finalizar pedido</Text>
        <Text style={styles.muted}>Seu carrinho está vazio.</Text>
        <Button title="Voltar às lojas" onPress={() => router.replace('/')} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← Voltar ao carrinho</Text>
      </Pressable>

      <Text style={styles.title}>Finalizar pedido</Text>
      <Text style={styles.subtitle}>Confira o endereço e escolha como deseja pagar.</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📍 Endereço de entrega</Text>
        <Input
          label="Rua ou endereço"
          placeholder="Ex.: Rua das Flores"
          value={street}
          onChangeText={setStreet}
          autoCapitalize="words"
        />
        <Input
          label="Número"
          placeholder="Ex.: 123"
          value={number}
          onChangeText={setNumber}
        />
        <Input
          label="Bairro"
          placeholder="Digite seu bairro"
          value={neighborhood}
          onChangeText={setNeighborhood}
          autoCapitalize="words"
        />
        <Input
          label="Complemento (opcional)"
          placeholder="Apartamento, bloco, referência..."
          value={complement}
          onChangeText={setComplement}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💳 Forma de pagamento</Text>

        {(
          [
            ['pix', 'Pix', 'Pague via Pix'],
            ['card', 'Cartão', 'Pagamento com cartão'],
            ['cash', 'Dinheiro', 'Pague na entrega'],
          ] as [PaymentMethod, string, string][]
        ).map(([value, label, description]) => (
          <Pressable
            key={value}
            accessibilityRole="radio"
            accessibilityState={{ checked: payment === value }}
            onPress={() => setPayment(value)}
            style={[styles.paymentOption, payment === value && styles.paymentSelected]}
          >
            <View style={styles.radio}>
              {payment === value && <View style={styles.radioDot} />}
            </View>
            <View style={styles.paymentText}>
              <Text style={styles.paymentLabel}>{label}</Text>
              <Text style={styles.muted}>{description}</Text>
            </View>
          </Pressable>
        ))}

        {payment === 'cash' && (
          <Input
            label="Vai precisar de troco para quanto?"
            placeholder={`Ex.: ${finalTotal.toFixed(2)}`}
            value={changeFor}
            onChangeText={setChangeFor}
            keyboardType="decimal-pad"
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🧾 Resumo do pedido</Text>

        {store && <Text style={styles.muted}>Loja: {store.name}</Text>}

        {isLoading && <Text style={styles.muted}>Carregando dados da loja...</Text>}

        <View style={styles.summaryRow}>
          <Text style={styles.muted}>Produtos</Text>
          <Text style={styles.value}>{formatMoney(total)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.muted}>Entrega</Text>
          <Text style={styles.value}>{formatMoney(deliveryFee)}</Text>
        </View>

        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatMoney(finalTotal)}</Text>
        </View>

        {store && total < minimum && (
          <Text style={styles.warning}>Pedido mínimo: {formatMoney(minimum)}</Text>
        )}
      </View>

      <Button
        title="Confirmar pedido"
        onPress={handleConfirm}
        loading={loading}
        disabled={loading || isLoading || !store}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  back: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '700',
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  section: {
    padding: spacing.md,
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  paymentSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  paymentText: {
    flex: 1,
    gap: 2,
  },
  paymentLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  muted: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  value: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    marginTop: spacing.xs,
  },
  totalLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  totalValue: {
    color: colors.primaryDark,
    fontSize: 20,
    fontWeight: '800',
  },
  warning: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '700',
  },
});
