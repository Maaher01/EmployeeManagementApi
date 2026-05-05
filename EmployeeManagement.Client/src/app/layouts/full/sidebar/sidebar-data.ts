import { NavItem } from '../../../models/nav-item.interface';

export const navItems: NavItem[] = [
  {
    displayName: 'Dashboard',
    iconName: 'solar:widget-add-line-duotone',
    route: '/dashboard',
  },
  {
    displayName: 'Attendance',
    iconName: 'solar:bill-list-line-duotone',
    chip: true,
    children: [
      {
        displayName: 'My Attendance',
        iconName: 'solar:banknote-line-duotone',
        route: '/attendance/employee',
        roles: ['Employee', 'HR'],
        chip: true,
      },
      {
        displayName: 'Attendance Settings',
        iconName: 'solar:settings-line-duotone',
        route: '/attendance/settings',
        roles: ['Admin', 'HR'],
        chip: true,
      },
      {
        displayName: 'Attendance List',
        iconName: 'solar:list-line-duotone',
        route: '/attendance',
        roles: ['Admin', 'HR'],
        chip: true,
      },
      {
        displayName: 'Monthly User Attendance',
        iconName: 'solar:calendar-date-line-duotone',
        route: '/attendance/employee/month',
        roles: ['Admin', 'HR'],
        chip: true,
      },
    ],
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
