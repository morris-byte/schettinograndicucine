// Google Analytics 4 and Google Ads Configuration
// Replace these with your actual tracking IDs

export const GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your GA4 Measurement ID
export const GOOGLE_ADS_CONVERSION_ID = 'AW-XXXXXXXXX'; // Replace with your Google Ads Conversion ID
export const GOOGLE_ADS_CONVERSION_LABEL = 'XXXXXXXXX'; // Replace with your conversion label

// Initialize Google Analytics 4
export const initGA4 = () => {
  if (typeof window !== 'undefined' && GA4_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA4_MEASUREMENT_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Track form submission event
export const trackFormSubmission = (formData: any) => {
  if (typeof window !== 'undefined' && window.gtag) {
    // GA4 Event
    window.gtag('event', 'form_submit', {
      event_category: 'engagement',
      event_label: 'preventivo_request',
      value: 1,
      custom_parameters: {
        restaurant_name: formData.restaurantName,
        restaurant_zone: formData.restaurantZone,
        equipment_type: formData.equipmentType,
      }
    });

    // Google Ads Conversion
    if (GOOGLE_ADS_CONVERSION_ID !== 'AW-XXXXXXXXX') {
      window.gtag('event', 'conversion', {
        send_to: `${GOOGLE_ADS_CONVERSION_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`,
        value: 1.0,
        currency: 'EUR',
        transaction_id: `preventivo_${Date.now()}`,
      });
    }
  }
};

// Track page views
export const trackPageView = (pageName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: pageName,
      page_location: window.location.href,
    });
  }
};

// Track form step completion
export const trackFormStep = (step: number, stepName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'form_step', {
      event_category: 'form_progress',
      event_label: stepName,
      value: step,
    });
  }
};

// Track button clicks
export const trackButtonClick = (buttonName: string, location: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'click', {
      event_category: 'button',
      event_label: buttonName,
      custom_parameters: {
        location: location,
      }
    });
  }
};

// Declare global gtag function
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}
