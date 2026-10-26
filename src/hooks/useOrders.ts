import { useQuery } from '@tanstack/react-query';
import { getOrderById, getOrders } from '@/services/orders';

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => getOrderById(id),
    enabled: Boolean(id),
    refetchInterval: 10_000,
  });
}
