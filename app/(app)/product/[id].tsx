import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { useAddToCart } from '@/hooks/useAddToCart';
import { useProduct } from '@/hooks/useCatalog';
import { colors, radius, spacing } from '@/theme';
import { formatMoney } from '@/utils/money';

export default function ProductDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: product, isLoading, isError } = useProduct(id ?? '');
  const { add } = useAddToCart();
  const [message, setMessage] = useState('');

  function handleAddToCart() {
    if (!product) return;

    const added = add(product);

    if (added) {
      setMessage('Produto adicionado ao carrinho!');
    } else {
      setMessage(
        'Seu carrinho já tem produtos de outra loja. Limpe-o antes de continuar.',
      );
    }
  }

  return (
    <ScreenContainer scroll>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← Voltar</Text>
      </Pressable>

      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : isError || !product ? (
        <View style={styles.state}>
          <Text style={styles.stateTitle}>Produto não encontrado</Text>
          <Text style={styles.description}>Não foi possível carregar este produto.</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.emoji}>{product.emoji}</Text>
          </View>

          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{formatMoney(product.price)}</Text>

          <Text style={styles.sectionTitle}>Sobre o produto</Text>
          <Text style={styles.description}>
            {product.description || 'Um produto selecionado para você.'}
          </Text>

          <Pressable
            accessibilityRole="button"
            onPress={handleAddToCart}
            style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
          >
            <Text style={styles.addButtonText}>Adicionar ao carrinho</Text>
          </Pressable>

          {message ? <Text style={styles.message}>{message}</Text> : null}

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/(app)/cart')}
            style={styles.cartButton}
          >
            <Text style={styles.cartButtonText}>Ver carrinho</Text>
          </Pressable>
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
    marginBottom: spacing.lg,
  },
  content: {
    gap: spacing.md,
  },
  imagePlaceholder: {
    minHeight: 190,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emoji: {
    fontSize: 76,
  },
  name: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
  },
  price: {
    color: colors.primaryDark,
    fontSize: 23,
    fontWeight: '800',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    marginTop: spacing.md,
  },
  addButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '700',
  },
  message: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '600',
  },
  cartButton: {
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cartButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  state: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  stateTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
  },
});
