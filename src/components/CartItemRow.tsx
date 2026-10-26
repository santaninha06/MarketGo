import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { CartItem } from '@/utils/cart';
import { colors, radius, spacing } from '@/theme';
import { formatMoney } from '@/utils/money';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export function CartItemRow({ item, onUpdateQuantity }: CartItemRowProps) {
  const { product, quantity } = item;

  return (
    <View style={styles.container}>
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{product.emoji}</Text>
      </View>

      <View style={styles.details}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{formatMoney(product.price)}</Text>
        <Text style={styles.subtotal}>
          Subtotal: {formatMoney(product.price * quantity)}
        </Text>
      </View>

      <View style={styles.quantityControl}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Diminuir quantidade de ${product.name}`}
          onPress={() => onUpdateQuantity(product.id, quantity - 1)}
          style={styles.quantityButton}
        >
          <Text style={styles.quantityButtonText}>−</Text>
        </Pressable>

        <Text style={styles.quantity}>{quantity}</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Aumentar quantidade de ${product.name}`}
          onPress={() => onUpdateQuantity(product.id, quantity + 1)}
          style={[styles.quantityButton, styles.addButton]}
        >
          <Text style={[styles.quantityButtonText, styles.addButtonText]}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  emojiContainer: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 28,
  },
  details: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  price: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  subtotal: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '700',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: colors.primary,
  },
  quantityButtonText: {
    color: colors.text,
    fontSize: 20,
    lineHeight: 24,
  },
  addButtonText: {
    color: colors.surface,
  },
  quantity: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    minWidth: 16,
    textAlign: 'center',
  },
});
