import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { CategoryChip } from '@/components/CategoryChip';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Loading } from '@/components/Loading';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SearchBar } from '@/components/SearchBar';
import { SectionHeader } from '@/components/SectionHeader';
import { StoreCard } from '@/components/StoreCard';
import { STORE_CATEGORIES } from '@/constants/catalog';
import { useStores } from '@/hooks/useCatalog';
import { colors, spacing } from '@/theme';
import type { StoreCategory } from '@/types';
import { filterStores, getOpenStoresFirst } from '@/utils/catalog';

type CategoryFilter = StoreCategory | 'Todas';

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('Todas');

  const { data: stores = [], isLoading, isError, refetch } = useStores();

  const filteredStores = useMemo(() => {
    const filtered = filterStores(stores, search, category);
    return getOpenStoresFirst(filtered);
  }, [stores, search, category]);

  if (isLoading) {
    return <Loading message="Carregando lojas..." />;
  }

  if (isError) {
    return (
      <ScreenContainer>
        <ErrorState
          message="Não conseguimos carregar as lojas. Confira sua conexão."
          onRetry={() => {
            void refetch();
          }}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <View style={styles.header}>
        <View style={styles.brand}>
          <Text style={styles.greeting}>SEU MERCADO, MAIS PERTO</Text>
          <Text style={styles.title}>
            Market<Text style={styles.titleAccent}>Go</Text>
          </Text>
          <Text style={styles.subtitle}>O que você precisa hoje?</Text>
        </View>

        <Text style={styles.headerEmoji}>🛍️</Text>
      </View>

      <Pressable
        style={styles.ordersButton}
        onPress={() => router.push('/(app)/orders')}
        accessibilityRole="button"
        accessibilityLabel="Ver meus pedidos"
      >
        <Text style={styles.ordersEmoji}>📦</Text>
        <View style={styles.ordersTextContainer}>
          <Text style={styles.ordersTitle}>Meus pedidos</Text>
          <Text style={styles.ordersSubtitle}>
            Consulte suas compras e acompanhe as entregas
          </Text>
        </View>
        <Text style={styles.ordersArrow}>›</Text>
      </Pressable>

      <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar lojas..." />

      <View style={styles.categories}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['Todas', ...STORE_CATEGORIES] as CategoryFilter[]}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => (
            <CategoryChip
              label={item}
              selected={category === item}
              onPress={() => setCategory(item)}
            />
          )}
        />
      </View>

      <SectionHeader
        title="Lojas para você"
        subtitle={`${filteredStores.length} estabelecimento(s) encontrado(s)`}
      />

      {filteredStores.length === 0 ? (
        <EmptyState
          title="Nenhuma loja encontrada"
          message="Tente outra busca ou selecione uma categoria diferente."
          emoji="🏪"
        />
      ) : (
        <View style={styles.storeList}>
          {filteredStores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              onPress={() => router.push(`/(app)/store/${store.id}`)}
            />
          ))}
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  brand: {
    flex: 1,
  },
  greeting: {
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '800',
  },
  titleAccent: {
    color: colors.primary,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  headerEmoji: {
    fontSize: 38,
    marginLeft: spacing.sm,
  },
  ordersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  ordersEmoji: {
    fontSize: 28,
  },
  ordersTextContainer: {
    flex: 1,
  },
  ordersTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  ordersSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  ordersArrow: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: '600',
  },
  categories: {
    marginHorizontal: -spacing.md,
  },
  categoryList: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  storeList: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
});
