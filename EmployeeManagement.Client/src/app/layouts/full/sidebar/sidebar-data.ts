import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    displayName: 'Dashboard',
    iconName: 'solar:widget-add-line-duotone',
    route: '/dashboard',
  },
  {
    navCap: 'HR',
    divider: true,
  },
  {
    displayName: 'Employees',
    iconName: 'solar:users-group-two-rounded-line-duotone',
    route: '/employee',
  },
  {
    displayName: 'Departments',
    iconName: 'solar:sidebar-minimalistic-line-duotone',
    route: '/department',
  },
  {
    navCap: 'ADMINISTRATION',
    divider: true,
  },
  {
    displayName: 'Users',
    iconName: 'solar:users-group-rounded-line-duotone',
    route: '/user',
  },
  {
    displayName: 'Roles',
    iconName: 'solar:shield-line-duotone',
    route: '/user',
  },
  // {
  //   navCap: 'Ui Components',
  //   divider: true,
  // },
  // {
  //   displayName: 'Forms',
  //   iconName: 'solar:file-text-line-duotone',
  //   route: '/ui-components/forms',
  // },
  // {
  //   divider: true,
  //   navCap: 'Auth',
  // },
  // {
  //   displayName: 'Login',
  //   iconName: 'solar:lock-keyhole-minimalistic-line-duotone',
  //   route: '/auth',
  //   children: [
  //     {
  //       displayName: 'Login',
  //       subItemIcon: true,
  //       iconName: 'solar:round-alt-arrow-right-line-duotone',
  //       route: '/auth/login',
  //     },
  //   ],
  // },
  // {
  //   displayName: 'Register',
  //   iconName: 'solar:user-plus-rounded-line-duotone',
  //   route: '/auth',
  //   children: [
  //     {
  //       displayName: 'Register',
  //       subItemIcon: true,
  //       iconName: 'solar:round-alt-arrow-right-line-duotone',
  //       route: '/auth/register',
  //     },
  //   ],
  // },
];
