import { Permission } from '../../core/enums/permission.enum';
import { Role } from '../../core/enums/role.enum';
import { Store } from './store.interface';

export interface StoreUser {
  id: number;
  userId: string;
  storeId: string;
  role: Role;
  permissions: Permission[];
  store?: Store;
}
