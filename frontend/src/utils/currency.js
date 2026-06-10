export const DELIVERY_FEE_EGP = 50;

export const FALLBACK_FOOD_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800';

export function formatPrice(amount) {
  const value = Math.round(Number(amount) || 0);
  return `${value.toLocaleString('en-EG')} EGP`;
}
