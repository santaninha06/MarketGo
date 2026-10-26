import { filterStores, getOpenStoresFirst, getStoreById } from '@/utils/catalog';
import type { Store } from '@/types';

const stores: Store[] = [
  {
    id: '1',
    name: 'Mercado Central',
    category: 'Mercado',
    emoji: '🛒',
    description: 'Mercado do bairro',
    rating: 4.8,
    delivery_fee: 5,
    eta_min: 20,
    eta_max: 35,
    min_order: 15,
    is_open: true,
  },
  {
    id: '2',
    name: 'Padaria Pão Quente',
    category: 'Padaria',
    emoji: '🥖',
    description: 'Pães fresquinhos',
    rating: 4.5,
    delivery_fee: 3,
    eta_min: 15,
    eta_max: 25,
    min_order: 10,
    is_open: false,
  },
];

describe('Regras do catálogo', () => {
  it('busca lojas pelo nome sem diferenciar maiúsculas', () => {
    expect(filterStores(stores, 'mercado')).toHaveLength(1);
  });

  it('filtra lojas por categoria', () => {
    expect(filterStores(stores, '', 'Padaria')[0].id).toBe('2');
  });

  it('prioriza lojas abertas', () => {
    expect(getOpenStoresFirst(stores)[0].id).toBe('1');
  });

  it('encontra uma loja pelo ID', () => {
    expect(getStoreById(stores, '2')?.name).toBe('Padaria Pão Quente');
  });

  it('retorna undefined quando a loja não existe', () => {
    expect(getStoreById(stores, 'inexistente')).toBeUndefined();
  });
});
