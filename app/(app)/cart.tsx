import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { ScreenContainer } from '@/components/ScreenContainer';
import { useAddToCart } from '@/hooks/useAddToCart';
import { colors, radius, spacing } from '@/theme';
import { formatMoney } from '@/utils/money';

export default function CartScreen() {
  const router = useRouter();
  const { items, updateQuantity, clear } = useAddToCart();

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <ScreenContainer scroll>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← Voltar</Text>
      </Pressable>

      <Text style={styles.title}>Meu carrinho 🛒</Text>
      <Text style={styles.subtitle}>Confira os produtos antes de continuar.</Text>

      {items.length === 0 ? (
        <EmptyState
          title="Seu carrinho está vazio"
          message="Volte às lojas e adicione seus produtos favoritos."
          emoji="🛒"
        />
      ) : (
        <>
          <View style={styles.items}>
            {items.map(({ product, quantity }) => (
              <View key={product.id} style={styles.item}>
                <Text style={styles.emoji}>{product.emoji}</Text>

                <View style={styles.details}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.price}>{formatMoney(product.price)}</Text>

                  <View style={styles.quantityRow}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Diminuir quantidade de ${product.name}`}
                      onPress={() => updateQuantity(product.id, quantity - 1)}
                      style={styles.quantityButton}
                    >
                      <Text style={styles.quantityButtonText}>−</Text>
                    </Pressable>

                    <Text style={styles.quantity}>{quantity}</Text>

                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Aumentar quantidade de ${product.name}`}
                      onPress={() => updateQuantity(product.id, quantity + 1)}
                      style={styles.quantityButton}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={styles.itemEnd}>
                  <Text style={styles.subtotal}>
                    {formatMoney(product.price * quantity)}
                  </Text>

                  <Pressable
                    accessibilityRole="button"
                    onPress={() => updateQuantity(product.id, 0)}
                  >
                    <Text style={styles.remove}>Remover</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.summary}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total dos produtos</Text>
              <Text style={styles.total}>{formatMoney(total)}</Text>
            </View>

            <Text style={styles.note}>
              A taxa de entrega será considerada na finalização do pedido.
            </Text>

            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/(app)/checkout')}
              style={({ pressed }) => [styles.checkoutButton, pressed && styles.pressed]}
            >
              <Text style={styles.checkoutText}>Continuar para o pagamento</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={clear}
              style={styles.clearButton}
            >
              <Text style={styles.clearText}>Limpar carrinho</Text>
            </Pressable>
          </View>
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  back: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  items: {
    gap: spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emoji: {
    fontSize: 30,
  },
  details: {
    flex: 1,
    gap: spacing.xs,
  },
  productName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  price: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  quantityButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quantityButtonText: {
    color: colors.primaryDark,
    fontSize: 20,
    fontWeight: '700',
  },
  quantity: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  itemEnd: {
    alignItems: 'flex-end',
    gap: spacing.md,
  },
  subtotal: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  remove: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '600',
  },
  summary: {
    marginTop: spacing.xl,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    gap: spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  totalLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  total: {
    color: colors.primaryDark,
    fontSize: 20,
    fontWeight: '800',
  },
  note: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  checkoutButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
  },
  checkoutText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '700',
  },
  clearButton: {
    alignItems: 'center',
    padding: spacing.sm,
  },
  clearText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.75,
  },
});
