import type { OrderStatus } from '@/types';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  received: 'Pedido recebido',
  preparing: 'Em preparação',
  out_for_delivery: 'Saiu para entrega',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

export const ORDER_STATUS_STEPS: OrderStatus[] = [
  'received',
  'preparing',
  'out_for_delivery',
  'delivered',
];

export function getOrderStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status];
}

export function canCancelOrder(status: OrderStatus): boolean {
  return status === 'received' || status === 'preparing';
}

export function canReorder(status: OrderStatus): boolean {
  return status === 'delivered' || status === 'cancelled';
}

export function getOrderProgress(status: OrderStatus): number {
  if (status === 'cancelled') return 0;

  return ORDER_STATUS_STEPS.indexOf(status) + 1;
}
