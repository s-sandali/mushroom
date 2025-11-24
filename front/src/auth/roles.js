export const ROLES = {
  ADMIN: 'ADMIN',
  INVENTORY: 'INVENTORY',
  LAB: 'LAB',
  SALES: 'SALES'
};

export const ROLE_HOME = {
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.INVENTORY]: '/inventory/dashboard',
  [ROLES.LAB]: '/lab/dashboard',
  [ROLES.SALES]: '/sales/management'
};

export const roleToHome = (role) => ROLE_HOME[role] || '/';