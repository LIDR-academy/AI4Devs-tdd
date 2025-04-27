export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[0-9]{9,15}$/;
  return phoneRegex.test(phone);
};

export const validateAddress = (address: string): boolean => {
  return address.length > 0 && address.length <= 200;
}; 