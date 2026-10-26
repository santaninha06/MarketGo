import {
  canCancelOrder,
  canReorder,
  getOrderProgress,
  getOrderStatusLabel,
} from '@/utils/orders';
import type { OrderStatus } from '@/types';

describe('Regras dos pedidos', () => {
  it('exibe o nome correto do status', () => {
    expect(getOrderStatusLabel('received')).toBe('Pedido recebido');
    expect(getOrderStatusLabel('delivered')).toBe('Entregue');
  });

  it('permite cancelar pedidos recebidos ou em preparação', () => {
    expect(canCancelOrder('received')).toBe(true);
    expect(canCancelOrder('preparing')).toBe(true);
    expect(canCancelOrder('out_for_delivery')).toBe(false);
    expect(canCancelOrder('delivered')).toBe(false);
  });

  it('permite pedir novamente após entrega ou cancelamento', () => {
    expect(canReorder('delivered')).toBe(true);
    expect(canReorder('cancelled')).toBe(true);
    expect(canReorder('preparing')).toBe(false);
  });

  it('calcula o progresso do pedido', () => {
    const cases: [OrderStatus, number][] = [
      ['received', 1],
      ['preparing', 2],
      ['out_for_delivery', 3],
      ['delivered', 4],
      ['cancelled', 0],
    ];

    cases.forEach(([status, expected]) => {
      expect(getOrderProgress(status)).toBe(expected);
    });
  });
});
