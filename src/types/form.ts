export interface FormData {
  isRestaurateur: boolean | null;
  isInCampania: boolean | null;
  restaurantZone: string;
  restaurantName: string;
  equipmentType: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  wantsCatalog: boolean | null;
  privacyConsent: boolean;
}

export type ThankYouType = 'success' | 'not-restaurateur' | 'not-campania';

export interface FormSubmissionPayload extends FormData {
  timestamp: string;
  source: string;
  catalog_request: string;
  phone_formatted: string;
  full_name: string;
  privacy_consent: string;
}

