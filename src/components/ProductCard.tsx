import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Product } from '@/types';
import { colors, radius, spacing } from '@/theme';
import { formatMoney } from '@/utils/money';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onAdd: () => void;
}

export function ProductCard({ product, onPress, onAdd }: ProductCardProps) {
  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Ver detalhes de ${product.name}`}
        onPress={onPress}
        style={({ pressed }) => [styles.product, pressed && styles.pressed]}
      >
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{product.emoji}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{product.name}</Text>

          <Text style={styles.description} numberOfLines={2}>
            {product.description}
          </Text>

          <Text style={styles.price}>{formatMoney(product.price)}</Text>
        </View>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Adicionar ${product.name} ao carrinho`}
        onPress={onAdd}
        style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
      >
        <Text style={styles.addText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
  },
  product: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  pressed: {
    opacity: 0.75,
  },
  emojiContainer: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  emoji: {
    fontSize: 32,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  description: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  price: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: '700',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    color: colors.surface,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '600',
  },
});
