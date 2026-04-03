import { Role } from '../enums/role.enum';
import { Permission } from '../enums/permission.enum';

export interface StoreContext {
  id: string;
  name?: string;
  slug?: string;
  role: Role;
  permissions: Permission[];
}

export interface UserInfo {
  id: string;
  email: string;
  globalRole: string;
  activeRole?: Role;
  storeId?: string;
  permissions?: Permission[];
}

export interface AuthResponse {
  user: UserInfo;
  currentContext?: StoreContext;
  stores: StoreContext[];
}
