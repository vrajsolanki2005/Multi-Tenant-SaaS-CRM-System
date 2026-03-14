export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  SERVICES: '/services',
  LEGAL: '/legal',
  ABOUT: '/about',

  // Protected routes
  DASHBOARD: '/dashboard',
  CONTACTS: '/contacts',
  LEADS: '/leads',
  TASKS: '/tasks',
  USERS: '/users',
  AUDIT: '/audit',
  SETTINGS: '/settings',
} as const;

export const PAGE_TITLES: Record<string, string> = {
  [ROUTES.DASHBOARD]: 'Intelligence Overview',
  [ROUTES.LEADS]: 'Capture Pipeline',
  [ROUTES.CONTACTS]: 'Network Nodes',
  [ROUTES.TASKS]: 'Operations',
  [ROUTES.USERS]: 'Team Structure',
  [ROUTES.AUDIT]: 'System Logs',
  [ROUTES.SETTINGS]: 'Account Matrix',
};
