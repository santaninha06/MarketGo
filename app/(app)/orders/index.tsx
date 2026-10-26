import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/ScreenContainer';
import { getOrders } from '@/services/orders';
import { colors } from '@/theme';
import { formatMoney } from '@/utils/format';

interface Order {
  id: string;
  store_name: string;
  status: string;
  total: number;
  created_at: string;
}

const statusLabels: Record<string, string> = {
  received: 'Pedido recebido',
  preparing: 'Em preparação',
  out_for_delivery: 'Saiu para entrega',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function loadOrders() {
        try {
          setLoading(true);
          setError(false);

          const result = await getOrders();

          if (active) {
            setOrders(result as Order[]);
          }
        } catch {
          if (active) {
            setError(true);
          }
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      }

      loadOrders();

      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <ScreenContainer>
      <Text style={styles.title}>Meus pedidos</Text>
      <Text style={styles.subtitle}>Acompanhe suas compras e consulte os detalhes.</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : error ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Não foi possível carregar os pedidos</Text>
          <Text style={styles.emptyText}>Verifique sua conexão e tente novamente.</Text>
          <Pressable
            style={styles.actionButton}
            onPress={() => router.replace('/(app)/orders')}
          >
            <Text style={styles.actionText}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🛍️</Text>
          <Text style={styles.emptyTitle}>Você ainda não fez pedidos</Text>
          <Text style={styles.emptyText}>
            Quando finalizar uma compra, ela aparecerá aqui.
          </Text>
          <Pressable style={styles.actionButton} onPress={() => router.replace('/')}>
            <Text style={styles.actionText}>Explorar lojas</Text>
          </Pressable>
        </View>
      ) : (
        orders.map((order) => (
          <Pressable
            key={order.id}
            style={styles.orderCard}
            onPress={() =>
              router.push({
                pathname: '/(app)/orders/[id]',
                params: { id: order.id },
              })
            }
          >
            <View style={styles.orderHeader}>
              <View style={styles.orderInfo}>
                <Text style={styles.storeName}>{order.store_name}</Text>
                <Text style={styles.orderDate}>
                  {new Date(order.created_at).toLocaleString('pt-BR')}
                </Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </View>

            <View style={styles.orderFooter}>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>
                  {statusLabels[order.status] ?? order.status}
                </Text>
              </View>

              <Text style={styles.total}>{formatMoney(Number(order.total))}</Text>
            </View>

            <Text style={styles.orderNumber}>Pedido #{order.id.slice(0, 8)}</Text>
          </Pressable>
        ))
      )}

      <Pressable style={styles.backButton} onPress={() => router.replace('/')}>
        <Text style={styles.backText}>Voltar às lojas</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 6,
    marginBottom: 22,
  },
  loader: {
    marginTop: 36,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 16,
  },
  emptyEmoji: {
    fontSize: 42,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 18,
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  orderDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 5,
  },
  arrow: {
    fontSize: 28,
    color: colors.textSecondary,
    marginLeft: 12,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  statusBadge: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  total: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  orderNumber: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 12,
  },
  backButton: {
    alignItems: 'center',
    padding: 14,
    marginTop: 4,
  },
  backText: {
    color: colors.primary,
    fontWeight: '700',
  },
});
