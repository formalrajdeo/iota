export const regularExp = {
  priceRegex: /^\d+(\.\d{1,2})?$/, // Matches a positive decimal number with up to 2 decimal places
  dateRegex: /^\d{4}-\d{2}-\d{2}$/, // Matches a date in the format YYYY-MM-DD
  productIdRegex: /^\d+$/, // Matches a positive integer
  passwordRegex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/,
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};
