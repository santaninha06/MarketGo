import { StyleSheet, Text, View } from 'react-native';
import type { OrderStatus } from '@/types';
import { colors, radius, spacing } from '@/theme';
import { getOrderStatusLabel } from '@/utils/orders';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const STATUS_COLORS: Record<OrderStatus, { background: string; text: string }> = {
  received: {
    background: '#DBEAFE',
    text: '#1D4ED8',
  },
  preparing: {
    background: '#FEF3C7',
    text: '#92400E',
  },
  out_for_delivery: {
    background: '#EDE9FE',
    text: '#6D28D9',
  },
  delivered: {
    background: '#DCFCE7',
    text: '#166534',
  },
  cancelled: {
    background: '#FEE2E2',
    text: '#B91C1C',
  },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const statusColors = STATUS_COLORS[status];

  return (
    <View style={[styles.badge, { backgroundColor: statusColors.background }]}>
      <Text style={[styles.text, { color: statusColors.text }]}>
        {getOrderStatusLabel(status)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});
