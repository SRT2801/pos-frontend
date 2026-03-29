import { Role } from "../../../../core/enums/role.enum";

export interface SidebarOption {
  label: string;
  icon?: string;
  route?: string;
  children?: SidebarOption[];
  roles?: Role[];
}