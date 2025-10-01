// Google Analytics 4 Configuration
export const GA4_MEASUREMENT_ID = 'G-CWVFE2B6PJ';

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Initialize GA4
export const initGA4 = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log('✅ GA4 initialized with ID:', GA4_MEASUREMENT_ID);
    return true;
  }
  console.warn('⚠️ GA4 not available');
  return false;
};

// Track form submission
export const trackFormSubmission = (formData: any) => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log('📊 Tracking form submission:', formData);
    
    // Track lead generation
    window.gtag('event', 'generate_lead', {
      event_category: 'Form',
      event_label: 'Contact Form Submission',
      value: 1,
      custom_parameters: {
        restaurant_name: formData.restaurantName || 'N/A',
        is_restaurateur: formData.isRestaurateur ? 'Yes' : 'No',
        is_in_campania: formData.isInCampania ? 'Yes' : 'No',
        restaurant_zone: formData.restaurantZone || 'N/A',
        equipment_type: formData.equipmentType || 'N/A'
      }
    });

    // Track conversion
    window.gtag('event', 'conversion', {
      send_to: GA4_MEASUREMENT_ID,
      value: 1.0,
      currency: 'EUR'
    });

    console.log('✅ Form submission tracked successfully');
  } else {
    console.warn('⚠️ GA4 not available for form tracking');
  }
};

// Track form step progression
export const trackFormStep = (step: number, stepName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log(`📊 Tracking form step ${step}: ${stepName}`);
    
    window.gtag('event', 'form_step', {
      event_category: 'Form',
      event_label: stepName,
      value: step,
      step_number: step
    });

    console.log('✅ Form step tracked successfully');
  } else {
    console.warn('⚠️ GA4 not available for step tracking');
  }
};

// Track button clicks
export const trackButtonClick = (buttonName: string, location: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log(`📊 Tracking button click: ${buttonName} in ${location}`);
    
    window.gtag('event', 'click', {
      event_category: 'Button',
      event_label: buttonName,
      location: location
    });

    console.log('✅ Button click tracked successfully');
  } else {
    console.warn('⚠️ GA4 not available for button tracking');
  }
};

// Track page views
export const trackPageView = (pageName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log(`📊 Tracking page view: ${pageName}`);
    
    window.gtag('event', 'page_view', {
      page_title: pageName,
      page_location: window.location.href
    });

    console.log('✅ Page view tracked successfully');
  } else {
    console.warn('⚠️ GA4 not available for page view tracking');
  }
};