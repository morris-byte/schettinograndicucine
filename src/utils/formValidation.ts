import { FormData } from '@/types/form';

export const validatePhoneNumber = (phone: string): boolean => {
  const trimmed = phone.trim();
  if (!trimmed || !trimmed.startsWith('+39')) return false;
  const digits = trimmed.replace(/\D/g, '').slice(2); // Remove +39
  return digits.length === 10;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isStepCompleted = (step: number, formData: FormData): boolean => {
  switch (step) {
    case 1:
      return formData.isRestaurateur !== null;
    case 2:
      return formData.isInCampania !== null;
    case 3:
      return formData.restaurantZone.trim() !== '';
    case 4:
      return formData.restaurantName.trim() !== '';
    case 5:
      return formData.equipmentType.trim() !== '';
    case 6:
      return formData.firstName.trim() !== '' && formData.lastName.trim() !== '';
    case 7: {
      return validatePhoneNumber(formData.phoneNumber);
    }
    case 8:
      return formData.email.trim() !== '' && validateEmail(formData.email);
    case 9:
      return formData.wantsCatalog !== null;
    case 10:
      return formData.privacyConsent === true;
    default:
      return false;
  }
};

export const getStepName = (step: number): string => {
  const stepNames: { [key: number]: string } = {
    1: 'Restaurateur Question',
    2: 'Campania Question',
    3: 'Restaurant Zone',
    4: 'Restaurant Name',
    5: 'Equipment Type',
    6: 'Personal Data',
    7: 'Phone Number',
    8: 'Email',
    9: 'Catalog Question',
    10: 'Confirmation'
  };
  return stepNames[step] || 'Unknown Step';
};

export const formatPhoneNumber = (value: string): string => {
  // Remove all non-numeric characters
  const digitsOnly = value.replace(/\D/g, '');
  
  // Limit to 10 digits (Italian phone numbers)
  const limitedDigits = digitsOnly.slice(0, 10);
  
  // Format with +39 prefix only if there are digits
  if (limitedDigits.length > 0) {
    return '+39' + limitedDigits;
  }
  return '';
};

