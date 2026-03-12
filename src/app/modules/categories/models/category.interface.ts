import { Product } from '../../products/models/product.interface';
import { Store } from '../../stores/models/store.interface';

export interface Category {
  id: number;
  name: string;
  storeId: string;
  store?: Store;
  products?: Product[];
}
