export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

export function formatPriceRaw(amount: number): string {
  return amount.toLocaleString("en-PK");
}
