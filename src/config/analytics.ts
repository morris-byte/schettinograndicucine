// Google Tag Manager (GTM) Configuration
// GTM ID: GTM-PM7BJ5CS

// Push event to GTM dataLayer
export const pushToDataLayer = (eventData: any) => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(eventData);
  }
};

// Track form submission
export const trackFormSubmission = (formData: any) => {
  pushToDataLayer({
    'event': 'form_submission',
    'event_category': 'Contact Form',
    'event_label': 'Preventivo Request',
    'form_data': {
      restaurant_name: formData.restaurantName,
      restaurant_zone: formData.restaurantZone,
      equipment_type: formData.equipmentType,
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phoneNumber,
      email: formData.email
    }
  });
};

// Track form step
export const trackFormStep = (step: number, stepName: string) => {
  pushToDataLayer({
    'event': 'form_step',
    'event_category': 'Form Progress',
    'event_label': stepName,
    'step_number': step
  });
};

// Track button click
export const trackButtonClick = (buttonName: string, location: string) => {
  pushToDataLayer({
    'event': 'button_click',
    'event_category': 'User Interaction',
    'event_label': buttonName,
    'button_location': location
  });
};

// Track page view
export const trackPageView = (pageName: string) => {
  pushToDataLayer({
    'event': 'page_view',
    'page_title': pageName,
    'page_location': window.location.href
  });
};

// Declare global types
declare global {
  interface Window {
    dataLayer: any[];
  }
}