import { StoreUser } from './store-user.interface';

export interface Store {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  plan: string;
  createdAt: Date;
  updatedAt: Date;
  storeUsers?: StoreUser[];
}
