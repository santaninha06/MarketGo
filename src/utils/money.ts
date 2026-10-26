const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatMoney(value: number): string {
  return brl.format(value);
}

// Converte valores digitados pelo usuário em números.
export function parseMoney(text: string): number {
  const clean = text.replace(/[^\d.,]/g, '');
  if (!/\d/.test(clean)) return NaN;

  let normalized = clean;

  if (clean.includes(',')) {
    normalized = clean.replace(/\./g, '').replace(',', '.');
  } else if (/^\d{1,3}(\.\d{3})+$/.test(clean)) {
    normalized = clean.replace(/\./g, '');
  }

  return Number(normalized);
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

// Transforma um número em texto para campos de valores.
export function toInputMoney(value: number): string {
  return value.toFixed(2).replace('.', ',');
}
