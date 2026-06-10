import { FALLBACK_FOOD_IMAGE } from './currency';

export function handleImageError(e) {
  if (e.target.src !== FALLBACK_FOOD_IMAGE) {
    e.target.src = FALLBACK_FOOD_IMAGE;
  }
}
