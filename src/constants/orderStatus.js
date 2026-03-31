// Order Status Constants
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Chờ xử lý',
  [ORDER_STATUS.CONFIRMED]: 'Đã xác nhận',
  [ORDER_STATUS.PROCESSING]: 'Đang xử lý',
  [ORDER_STATUS.SHIPPED]: 'Đã gửi',
  [ORDER_STATUS.DELIVERED]: 'Đã giao',
  [ORDER_STATUS.CANCELLED]: 'Đã hủy'
};

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.PENDING]: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  [ORDER_STATUS.CONFIRMED]: { bg: 'bg-blue-100', text: 'text-blue-700' },
  [ORDER_STATUS.PROCESSING]: { bg: 'bg-purple-100', text: 'text-purple-700' },
  [ORDER_STATUS.SHIPPED]: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  [ORDER_STATUS.DELIVERED]: { bg: 'bg-green-100', text: 'text-green-700' },
  [ORDER_STATUS.CANCELLED]: { bg: 'bg-red-100', text: 'text-red-700' }
};

export const PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  PAID: 'paid',
  REFUNDED: 'refunded'
};

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.UNPAID]: 'Chưa thanh toán',
  [PAYMENT_STATUS.PAID]: 'Đã thanh toán',
  [PAYMENT_STATUS.REFUNDED]: 'Hoàn tiền'
};

export const PAYMENT_STATUS_COLORS = {
  [PAYMENT_STATUS.UNPAID]: { bg: 'bg-red-100', text: 'text-red-700' },
  [PAYMENT_STATUS.PAID]: { bg: 'bg-green-100', text: 'text-green-700' },
  [PAYMENT_STATUS.REFUNDED]: { bg: 'bg-gray-100', text: 'text-gray-700' }
};
