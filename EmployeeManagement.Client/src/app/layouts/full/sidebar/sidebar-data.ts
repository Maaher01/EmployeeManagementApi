import { NavItem } from '../../../models/nav-item.interface';

export const navItems: NavItem[] = [
  {
    displayName: 'Dashboard',
    iconName: 'solar:widget-add-line-duotone',
    route: '/dashboard',
  },
  {
    navCap: 'HR',
    divider: true,
    roles: ['Admin', 'HR'],
  },
  {
    displayName: 'Employees',
    iconName: 'solar:users-group-two-rounded-line-duotone',
    route: '/employee',
    roles: ['Admin', 'HR'],
  },
  {
    displayName: 'Departments',
    iconName: 'solar:sidebar-minimalistic-line-duotone',
    route: '/department',
    roles: ['Admin', 'HR'],
  },
  {
    navCap: 'ADMINISTRATION',
    divider: true,
    roles: ['Admin', 'HR'],
  },
  {
    displayName: 'Users',
    iconName: 'solar:users-group-rounded-line-duotone',
    route: '/user',
    roles: ['Admin', 'HR'],
  },
];
