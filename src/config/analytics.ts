// Google Analytics 4, Google Ads and Meta Pixel Configuration
// GTM + GA4 + Google Ads + Meta Pixel Hybrid Setup

export const GOOGLE_ADS_ACCOUNT_ID = 'AW-17544893918'; // Your Google Ads Account ID
export const GOOGLE_ADS_CONVERSION_ID = '570-400-4621'; // Your Google Ads Conversion ID
export const GOOGLE_ADS_CONVERSION_LABEL = 'preventivo_form'; // Conversion label for form submission

export const META_PIXEL_ID = '1073356054528227'; // Your Meta Pixel ID

// Initialize GA4 (simplified)
export const initGA4Simple = () => {
  if (typeof window !== 'undefined') {
    // GA4 is already loaded via HTML, just initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    
    // Push initial page view
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }
};

// Initialize Google Analytics 4 (backup method)
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
  if (typeof window !== 'undefined') {
    // Push to dataLayer
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'form_submit',
      'event_category': 'engagement',
      'event_label': 'preventivo_request',
      'value': 1,
      'restaurant_name': formData.restaurantName,
      'restaurant_zone': formData.restaurantZone,
      'equipment_type': formData.equipmentType,
      'transaction_id': `preventivo_${Date.now()}`,
      'currency': 'EUR',
    });

    // Send Google Ads conversion
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: `${GOOGLE_ADS_CONVERSION_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`,
        value: 1.0,
        currency: 'EUR',
        transaction_id: `preventivo_${Date.now()}`,
      });
    }

    // Send Meta Pixel Lead event
    if (window.fbq) {
      window.fbq('track', 'Lead', {
        content_name: 'Preventivo Richiesto',
        content_category: 'Form Submission',
        value: 1.0,
        currency: 'EUR',
        custom_data: {
          restaurant_name: formData.restaurantName,
          restaurant_zone: formData.restaurantZone,
          equipment_type: formData.equipmentType,
        }
      });
    }
  }
};

// Track page views
export const trackPageView = (pageName: string) => {
  if (typeof window !== 'undefined') {
    // Push to GTM dataLayer
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'page_view',
      'page_title': pageName,
      'page_location': window.location.href,
    });

    // Also send via gtag
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: pageName,
        page_location: window.location.href,
      });
    }

    // Send Meta Pixel PageView (already handled by base script)
    // No need to call fbq('track', 'PageView') as it's automatic
  }
};

// Track form step completion
export const trackFormStep = (step: number, stepName: string) => {
  if (typeof window !== 'undefined') {
    // Push to GTM dataLayer
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'form_step',
      'event_category': 'form_progress',
      'event_label': stepName,
      'value': step,
    });

    // Also send via gtag
    if (window.gtag) {
      window.gtag('event', 'form_step', {
        event_category: 'form_progress',
        event_label: stepName,
        value: step,
      });
    }

    // Send Meta Pixel Custom Event for form progress
    if (window.fbq) {
      window.fbq('trackCustom', 'FormStep', {
        step_number: step,
        step_name: stepName,
        content_category: 'Form Progress',
      });
    }
  }
};

// Track button clicks
export const trackButtonClick = (buttonName: string, location: string) => {
  if (typeof window !== 'undefined') {
    // Push to GTM dataLayer
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'button_click',
      'event_category': 'button',
      'event_label': buttonName,
      'location': location,
    });

    // Also send via gtag
    if (window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'button',
        event_label: buttonName,
        custom_parameters: {
          location: location,
        }
      });
    }

    // Send Meta Pixel Custom Event for button clicks
    if (window.fbq) {
      window.fbq('trackCustom', 'ButtonClick', {
        button_name: buttonName,
        location: location,
        content_category: 'Button Interaction',
      });
    }
  }
};

// Declare global functions
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    fbq: (...args: any[]) => void;
  }
}
