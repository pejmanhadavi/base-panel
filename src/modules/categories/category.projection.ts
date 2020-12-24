import { CategoryDocument } from './schemas/category.schema';

export const category_projection: Partial<CategoryDocument> = {
  name: 1 as any,
  thumbnail: 1 as any,
  picture: 1 as any,
};
