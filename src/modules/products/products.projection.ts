import { ProductDocument } from './schemas/product.schema';

export const products_projection: Partial<ProductDocument> = {
  _id: 0 as any,
  title: 1 as any,
  thumbnail: 1 as any,
  category: 1 as any,
  brand: 1 as any,
  stars: 1 as any,
  specialOfferExpires: 1 as any,
  forWholeCountry: 1 as any,
  maxDeliveryDays: 1 as any,
  colors: 1 as any,
  sizes: 1 as any,
  remainingNumber: 1 as any,
  review: 1 as any,
  price: 1 as any,
  discount: 1 as any,
  visits: 1 as any,
  weight: 1 as any,
};
