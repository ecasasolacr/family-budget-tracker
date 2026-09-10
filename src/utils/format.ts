export function formatCurrency(amountCents: number): string {
  return (amountCents / 100).toLocaleString('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 2,
  });
}
