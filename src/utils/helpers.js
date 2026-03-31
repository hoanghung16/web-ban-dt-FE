// Date formatting utilities
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('vi-VN');
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('vi-VN');
};

export const formatTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString('vi-VN');
};

// Number formatting utilities
export const formatPrice = (price) => {
  if (!price) return '0đ';
  return Number(price).toLocaleString('vi-VN') + 'đ';
};

export const formatCurrency = (amount) => {
  return Number(amount).toLocaleString('vi-VN');
};

export const parsePrice = (priceString) => {
  if (!priceString) return 0;
  return parseInt(priceString.replace(/[^\d]/g, ''), 10);
};

// String utilities
export const truncate = (text, length = 50) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

export const capitalizeFirstLetter = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Validation utilities
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const isValidPhone = (phone) => {
  const re = /^(\+\d{1,3}[- ]?)?\d{10}$/;
  return re.test(phone.replace(/[- ]/g, ''));
};

export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Array utilities
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

// Object utilities
export const omit = (obj, keys) => {
  return Object.keys(obj)
    .filter(key => !keys.includes(key))
    .reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {});
};

export const pick = (obj, keys) => {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {});
};

// Error handling
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'Có lỗi xảy ra. Vui lòng thử lại.';
};
