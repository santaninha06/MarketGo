import type { Store, StoreCategory } from '@/types';

export function filterStores(
  stores: Store[],
  search: string,
  category: StoreCategory | 'Todas' = 'Todas',
): Store[] {
  const term = search.trim().toLocaleLowerCase('pt-BR');

  return stores.filter((store) => {
    const matchesSearch =
      term.length === 0 ||
      store.name.toLocaleLowerCase('pt-BR').includes(term) ||
      store.category.toLocaleLowerCase('pt-BR').includes(term);

    const matchesCategory = category === 'Todas' || store.category === category;

    return matchesSearch && matchesCategory;
  });
}

export function getOpenStoresFirst(stores: Store[]): Store[] {
  return [...stores].sort((a, b) => Number(b.is_open) - Number(a.is_open));
}

export function getStoreById(stores: Store[], storeId: string): Store | undefined {
  return stores.find((store) => store.id === storeId);
}
