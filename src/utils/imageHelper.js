import { getApiBaseUrl, getFileUrl } from '../config/apiConfig';

/**
 * Xây dựng URL đầy đủ cho ảnh sản phẩm
 * @param {string} imageUrl - URL ảnh từ database
 * @returns {string} URL đầy đủ hoặc placeholder
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return 'https://via.placeholder.com/240?text=No+Image';
  }

  // Nếu là URL từ internet (http/https), trả về ngay
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Nếu là đường dẫn tệp (bắt đầu bằng /), sử dụng getFileUrl
  if (imageUrl.startsWith('/')) {
    return getFileUrl(imageUrl);
  }

  // Nếu là tên tệp, construct đầy đủ path
  return getFileUrl(`/images/products/${imageUrl}`);
};

/**
 * Lấy URL ảnh nhỏ cho admin pages
 */
export const getImageUrlSmall = (imageUrl) => {
  return getImageUrl(imageUrl);
};
