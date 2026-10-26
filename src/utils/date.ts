const pad = (n: number) => String(n).padStart(2, '0');

// Formata a data e o horário conforme o fuso local do aparelho.
export function formatDateTime(isoDateTime: string): string {
  const date = new Date(isoDateTime);

  if (Number.isNaN(date.getTime())) return '';

  const day = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`;

  return `${day} às ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
