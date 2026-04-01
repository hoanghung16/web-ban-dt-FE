/**
 * Extract and format error message from API error
 * @param {Error} error - Error object từ API
 * @returns {Object} { message: string, details: Array, validationErrors: Object }
 */
export const parseApiError = (error) => {
  let message = 'Có lỗi xảy ra. Vui lòng thử lại!';
  let details = [];
  let validationErrors = null;

  // Extract validation errors
  if (error?.validationErrors && typeof error.validationErrors === 'object') {
    validationErrors = error.validationErrors;
    details = Object.entries(validationErrors)
      .map(([field, msgs]) => {
        const msg = Array.isArray(msgs) ? msgs[0] : msgs;
        return `• ${field}: ${msg}`;
      });
  }

  // Get status-specific message
  const status = error?.status;
  if (status === 422) {
    message = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại form.';
  } else if (status === 401) {
    message = 'Bạn cần đăng nhập để tiếp tục';
  } else if (status === 403) {
    message = 'Bạn không có quyền thực hiện hành động này';
  } else if (status === 404) {
    message = 'Không tìm thấy tài nguyên';
  } else if (status === 500) {
    message = 'Lỗi server. Vui lòng thử lại sau';
  } else if (status === 503) {
    message = 'Server bảo trì. Vui lòng thử lại sau';
  } else if (error?.message) {
    message = error.message;
  }

  // Prefer custom message if available
  if (error?.response?.data?.message) {
    message = error.response.data.message;
  }

  return {
    message,
    details: details.length > 0 ? details : null,
    validationErrors,
    status
  };
};

/**
 * Format error message for display (single/multi-line)
 * @param {Error} error - Error object
 * @param {Boolean} includeDetails - Include validation details
 * @returns {String} Formatted error message
 */
export const formatErrorMessage = (error, includeDetails = true) => {
  const parsed = parseApiError(error);
  
  if (includeDetails && parsed.details && parsed.details.length > 0) {
    return `${parsed.message}\n\n${parsed.details.join('\n')}`;
  }
  
  return parsed.message;
};

/**
 * Log error for debugging
 * @param {Error} error - Error object
 * @param {String} context - Context/location string
 */
export const logApiError = (error, context = 'API Error') => {
  const parsed = parseApiError(error);
  console.error(`[${context}]`, {
    message: parsed.message,
    status: parsed.status,
    validationErrors: parsed.validationErrors,
    fullError: error
  });
};

export default {
  parseApiError,
  formatErrorMessage,
  logApiError
};
