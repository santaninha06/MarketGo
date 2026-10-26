import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Button } from '@/components/Button';
import { ScreenContainer } from '@/components/ScreenContainer';
import { getOrderById } from '@/services/orders';
import { colors } from '@/theme';
import { formatMoney } from '@/utils/format';

interface OrderItem {
  id: string;
  name: string;
  emoji: string;
  unit_price: number;
  quantity: number;
  total_price: number;
}

interface OrderDetails {
  id: string;
  store_name: string;
  status: string;
  payment_method: string;
  change_for: number | null;
  address_street: string;
  address_number: string;
  address_neighborhood: string;
  address_complement: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  created_at: string;
  order_items: OrderItem[];
}

const statusLabels: Record<string, string> = {
  received: 'Pedido recebido',
  preparing: 'Em preparação',
  out_for_delivery: 'Saiu para entrega',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

const paymentLabels: Record<string, string> = {
  pix: 'Pix',
  card: 'Cartão',
  cash: 'Dinheiro',
};

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadOrder() {
      try {
        setLoading(true);
        setError(false);

        const result = await getOrderById(id);

        if (active) {
          setOrder(result as OrderDetails);
        }
      } catch {
        if (active) {
          setError(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (id) {
      loadOrder();
    } else {
      setError(true);
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <ScreenContainer>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.message}>Carregando pedido...</Text>
      </ScreenContainer>
    );
  }

  if (error || !order) {
    return (
      <ScreenContainer>
        <Text style={styles.title}>Não foi possível carregar o pedido</Text>
        <Text style={styles.message}>Verifique sua conexão ou tente novamente.</Text>
        <Button title="Voltar" onPress={() => router.replace('/')} />
      </ScreenContainer>
    );
  }

  const address = [
    `${order.address_street}, ${order.address_number}`,
    order.address_neighborhood,
    order.address_complement,
  ]
    .filter(Boolean)
    .join(' - ');

  return (
    <ScreenContainer>
      <Text style={styles.title}>Detalhes do pedido</Text>

      <View style={styles.card}>
        <Text style={styles.storeName}>{order.store_name}</Text>
        <Text style={styles.muted}>Pedido #{order.id.slice(0, 8)}</Text>

        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>Status atual</Text>
          <Text style={styles.status}>{statusLabels[order.status] ?? order.status}</Text>
        </View>

        <Text style={styles.muted}>
          Realizado em {new Date(order.created_at).toLocaleString('pt-BR')}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Entrega</Text>
        <Text style={styles.text}>{address}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Pagamento</Text>
        <Text style={styles.text}>
          {paymentLabels[order.payment_method] ?? order.payment_method}
        </Text>

        {order.payment_method === 'cash' && order.change_for != null && (
          <Text style={styles.muted}>
            Troco para: {formatMoney(Number(order.change_for))}
          </Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Produtos</Text>

        {order.order_items?.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={styles.emoji}>{item.emoji}</Text>

            <View style={styles.itemInfo}>
              <Text style={styles.text}>{item.name}</Text>
              <Text style={styles.muted}>
                {item.quantity} × {formatMoney(Number(item.unit_price))}
              </Text>
            </View>

            <Text style={styles.itemPrice}>{formatMoney(Number(item.total_price))}</Text>
          </View>
        ))}

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.muted}>Subtotal</Text>
          <Text style={styles.text}>{formatMoney(Number(order.subtotal))}</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.muted}>Taxa de entrega</Text>
          <Text style={styles.text}>{formatMoney(Number(order.delivery_fee))}</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatMoney(Number(order.total))}</Text>
        </View>
      </View>

      <Button title="Voltar às lojas" onPress={() => router.replace('/')} />

      <View style={styles.bottomSpace} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 14,
  },
  storeName: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    color: colors.text,
  },
  muted: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statusBox: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginVertical: 14,
  },
  statusLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  status: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  emoji: {
    fontSize: 28,
  },
  itemInfo: {
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  bottomSpace: {
    height: 12,
  },
});
