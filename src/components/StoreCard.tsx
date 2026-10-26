import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Store } from '@/types';
import { colors, radius, spacing } from '@/theme';

interface StoreCardProps {
  store: Store;
  onPress: () => void;
}

export function StoreCard({ store, onPress }: StoreCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{store.emoji}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{store.name}</Text>
        <Text style={styles.category}>{store.category}</Text>

        <View style={styles.details}>
          <Text style={styles.detail}>★ {store.rating.toFixed(1)}</Text>
          <Text style={styles.separator}>·</Text>
          <Text style={styles.detail}>
            {store.eta_min}–{store.eta_max} min
          </Text>
        </View>

        <Text style={styles.delivery}>
          Entrega:{' '}
          {store.delivery_fee === 0
            ? 'grátis'
            : `R$ ${store.delivery_fee.toFixed(2).replace('.', ',')}`}
        </Text>
      </View>

      <View style={[styles.status, !store.is_open && styles.closedStatus]}>
        <Text style={[styles.statusText, !store.is_open && styles.closedStatusText]}>
          {store.is_open ? 'Aberto' : 'Fechado'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.8,
  },
  emojiContainer: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 16,
    fontWeight: '700',
  },
  category: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detail: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  separator: {
    color: colors.border,
  },
  delivery: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '600',
  },
  status: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: '#DCFCE7',
  },
  closedStatus: {
    backgroundColor: '#F3F4F6',
  },
  statusText: {
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: '700',
  },
  closedStatusText: {
    color: colors.textSecondary,
  },
});
