import { Category } from '../../categories/interfaces/category.interface';
import { Store } from '../../stores/interfaces/store.interface';

export interface Product {
  id: number;
  name: string;
  description?: string;
  image?: string;
  price: number;
  inventory: number;
  categoryId: number;
  category?: Category;
  storeId: string;
  isActive: boolean;
  store?: Store;
}
