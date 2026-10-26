import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Loading } from '@/components/Loading';
import { ProductCard } from '@/components/ProductCard';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SearchBar } from '@/components/SearchBar';
import { SectionHeader } from '@/components/SectionHeader';
import { useAddToCart } from '@/hooks/useAddToCart';
import { useProductsByStore, useStore } from '@/hooks/useCatalog';
import { colors, spacing } from '@/theme';

export default function StoreDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { add } = useAddToCart();

  const storeId = Array.isArray(id) ? id[0] : id;
  const [search, setSearch] = useState('');

  const {
    data: store,
    isLoading: loadingStore,
    isError: storeError,
    refetch: refetchStore,
  } = useStore(storeId ?? '');

  const {
    data: products = [],
    isLoading: loadingProducts,
    isError: productsError,
    refetch: refetchProducts,
  } = useProductsByStore(storeId ?? '');

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('pt-BR');

    return products.filter((product) =>
      product.name.toLocaleLowerCase('pt-BR').includes(term),
    );
  }, [products, search]);

  if (loadingStore || loadingProducts) {
    return <Loading message="Carregando loja e produtos..." />;
  }

  if (storeError || productsError || !store) {
    return (
      <ScreenContainer>
        <ErrorState
          message="Não foi possível carregar esta loja."
          onRetry={() => {
            void refetchStore();
            void refetchProducts();
          }}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <Text style={styles.back} onPress={() => router.back()}>
        ← Voltar às lojas
      </Text>

      <View style={styles.header}>
        <Text style={styles.emoji}>{store.emoji}</Text>
        <Text style={styles.title}>{store.name}</Text>
        <Text style={styles.description}>{store.description}</Text>

        <Text style={styles.meta}>
          {store.category} · ⭐ {Number(store.rating).toFixed(1)}
        </Text>

        <Text style={styles.meta}>
          {store.is_open ? '🟢 Aberta' : '🔴 Fechada'} · Entrega: R${' '}
          {Number(store.delivery_fee).toFixed(2).replace('.', ',')}
        </Text>
      </View>

      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Buscar produtos nesta loja..."
      />

      <SectionHeader
        title="Produtos"
        subtitle={`${filteredProducts.length} produto(s) encontrado(s)`}
      />

      {filteredProducts.length === 0 ? (
        <EmptyState
          title="Nenhum produto encontrado"
          message="Tente pesquisar por outro nome."
          emoji="🛒"
        />
      ) : (
        <View style={styles.products}>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => {
                router.push(`/(app)/product/${product.id}`);
              }}
              onAdd={() => {
                const added = add(product);

                if (!added) {
                  console.warn('O carrinho já contém produtos de outra loja.');
                }
              }}
            />
          ))}
        </View>
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
  header: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.xs,
  },
  emoji: {
    fontSize: 56,
  },
  title: {
    color: colors.text,
    fontSize: 25,
    fontWeight: '800',
    textAlign: 'center',
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  meta: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  products: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
});
