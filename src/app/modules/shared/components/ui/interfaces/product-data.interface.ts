export interface ProductCardData {
  id?: number;
  name: string;
  description?: string;
  price: number;
  image: string | string[];
  inventory: number;
  categoryId: number;

  badge?: string;
  badgeType?: 'premium' | 'new' | 'popular' | 'sale';
  rating?: number;
  reviewCount?: number;
  bgColor?: string;
  originalPrice?: number;
}
