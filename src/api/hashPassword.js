import CryptoJS from 'crypto-js';

/**
 * Hash a password using MD5
 * @param {string} password - The password to hash
 * @returns {string} - The MD5 hashed password (uppercase to match SQL Server)
 */
export const hashPassword = (password) => {
  return CryptoJS.MD5(password).toString().toUpperCase();
};

/**
 * Verify if a plain password matches the hashed password
 * @param {string} password - The plain password
 * @param {string} hashedPassword - The hashed password from database
 * @returns {boolean} - True if passwords match
 */
export const verifyPassword = (password, hashedPassword) => {
  const hashedInput = hashPassword(password);
  return hashedInput === hashedPassword;
};

export default {
  hashPassword,
  verifyPassword
};