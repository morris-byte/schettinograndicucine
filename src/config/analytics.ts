// Google Analytics 4 Configuration
// GA4 Measurement ID: G-CWVFE2B6PJ

// Track form submission
export const trackFormSubmission = (formData: any) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'generate_lead', {
      event_category: 'Contact Form',
      event_label: 'Preventivo Request',
      value: 1,
      currency: 'EUR',
      custom_parameters: {
        restaurant_name: formData.restaurantName,
        restaurant_zone: formData.restaurantZone,
        equipment_type: formData.equipmentType,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phoneNumber,
        email: formData.email
      }
    });
  }
};

// Track form step
export const trackFormStep = (step: number, stepName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'form_step', {
      event_category: 'Form Progress',
      event_label: stepName,
      value: step
    });
  }
};

// Track button click
export const trackButtonClick = (buttonName: string, location: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'button_click', {
      event_category: 'User Interaction',
      event_label: buttonName,
      button_location: location
    });
  }
};

// Track page view
export const trackPageView = (pageName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: pageName,
      page_location: window.location.href
    });
  }
};

// Declare global types
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}