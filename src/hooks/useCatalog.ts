import { useQuery } from '@tanstack/react-query';
import { getProductsByStore, getProductById } from '@/services/products';
import { getStores, getStoreById } from '@/services/stores';

export function useStores() {
  return useQuery({
    queryKey: ['stores'],
    queryFn: getStores,
  });
}

export function useStore(id: string) {
  return useQuery({
    queryKey: ['stores', id],
    queryFn: () => getStoreById(id),
    enabled: Boolean(id),
  });
}

export function useProductsByStore(storeId: string) {
  return useQuery({
    queryKey: ['products', 'store', storeId],
    queryFn: () => getProductsByStore(storeId),
    enabled: Boolean(storeId),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => getProductById(id),
    enabled: Boolean(id),
  });
}
