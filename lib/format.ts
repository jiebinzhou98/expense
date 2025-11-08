export function fmtMoney(
  n: number, currency = 'CAD',
  locale: string = 'en-CA'
) {
  return new Intl.NumberFormat(locale, {
    style: 'currency', 
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n || 0)
}