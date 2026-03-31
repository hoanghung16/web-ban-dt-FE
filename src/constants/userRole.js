// User Role Constants
export const USER_ROLE = {
  ADMIN: 'admin',
  CUSTOMER: 'customer'
};

export const USER_ROLE_LABELS = {
  [USER_ROLE.ADMIN]: 'Quản trị viên',
  [USER_ROLE.CUSTOMER]: 'Khách hàng'
};

export const USER_ROLE_COLORS = {
  [USER_ROLE.ADMIN]: { bg: 'bg-indigo-50', text: 'text-indigo-700', badge: 'bg-indigo-100' },
  [USER_ROLE.CUSTOMER]: { bg: 'bg-slate-50', text: 'text-slate-600', badge: 'bg-slate-100' }
};

export const isAdmin = (user) => user?.role === USER_ROLE.ADMIN;
export const isCustomer = (user) => user?.role === USER_ROLE.CUSTOMER;
