// Google Analytics 4 Configuration
export const GA4_MEASUREMENT_ID = 'G-CWVFE2B6PJ';

// Google Ads Conversion ID
export const GOOGLE_ADS_ID = 'AW-17544893918';

// Google Tag Manager Container ID (da configurare)
// Esempio: 'GTM-XXXXXXX'
export const GTM_CONTAINER_ID = process.env.VITE_GTM_CONTAINER_ID || '';

// Declare gtag function for TypeScript
// gtag has a flexible signature: gtag(command, targetId?, config?)
declare global {
  interface Window {
    gtag: (command: string, targetId?: string | Record<string, unknown>, config?: Record<string, unknown>) => void;
    dataLayer: Array<Record<string, unknown>>;
    fbq: (command: string, eventName: string, params?: Record<string, unknown>) => void;
  }
}

// Helper function to push events to GTM dataLayer
const pushToDataLayer = (eventName: string, eventData?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventData
    });
    console.log(`✅ GTM: ${eventName} event pushed to dataLayer`, eventData);
  }
};

// Initialize GA4
export const initGA4 = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log('✅ GA4 initialized with ID:', GA4_MEASUREMENT_ID);
    console.log('🔍 window.gtag function:', typeof window.gtag);
    console.log('🔍 window.dataLayer:', window.dataLayer);
    
    // Test event to verify GA4 is working
    window.gtag('event', 'test_event', {
      test_parameter: 'GA4 is working!'
    });
    console.log('🧪 Test event sent to GA4');
    
    return true;
  }
  console.warn('⚠️ GA4 not available');
  console.warn('🔍 window object:', typeof window);
  console.warn('🔍 window.gtag:', typeof window?.gtag);
  return false;
};

// Initialize and verify Facebook Pixel
export const initFacebookPixel = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    console.log('✅ Facebook Pixel initialized');
    console.log('🔍 window.fbq function:', typeof window.fbq);
    
    // Verify pixel is loaded by checking if fbq is a function
    if (typeof window.fbq === 'function') {
      console.log('✅ Facebook Pixel is ready');
      return true;
    }
  }
  console.warn('⚠️ Facebook Pixel not available');
  console.warn('🔍 window.fbq:', typeof window?.fbq);
  return false;
};

// Track Google Ads Conversion
export const trackGoogleAdsConversion = (conversionLabel?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log('🎯 Tracking Google Ads conversion:', conversionLabel);
    
    const conversionConfig: Record<string, string | number> = {
      send_to: GOOGLE_ADS_ID
    };
    
    if (conversionLabel) {
      conversionConfig.send_to = `${GOOGLE_ADS_ID}/${conversionLabel}`;
    }
    
    if (value !== undefined) {
      conversionConfig.value = value;
      conversionConfig.currency = 'EUR';
    }
    
    window.gtag('event', 'conversion', conversionConfig);
    
    console.log('✅ Google Ads conversion tracked successfully');
  } else {
    console.warn('⚠️ gtag not available for Google Ads conversion tracking');
  }
};

// Track form submission
interface FormSubmissionData {
  restaurantName?: string;
  isRestaurateur?: boolean | null;
  isInCampania?: boolean | null;
  restaurantZone?: string;
  equipmentType?: string;
}

export const trackFormSubmission = (formData: FormSubmissionData) => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log('📊 Tracking form submission:', formData);
    
    // Track lead generation with correct GA4 syntax
    window.gtag('event', 'generate_lead', {
      currency: 'EUR',
      value: 1,
      restaurant_name: formData.restaurantName || 'N/A',
      is_restaurateur: formData.isRestaurateur ? 'Yes' : 'No',
      is_in_campania: formData.isInCampania ? 'Yes' : 'No',
      restaurant_zone: formData.restaurantZone || 'N/A',
      equipment_type: formData.equipmentType || 'N/A'
    });

    // Track custom event for form submission
    window.gtag('event', 'form_submit', {
      event_category: 'Form',
      event_label: 'Contact Form Submission',
      value: 1
    });
    
    // Track Google Ads conversion for form submission
    trackGoogleAdsConversion(undefined, 1);

    console.log('✅ Form submission tracked successfully');
  } else {
    console.warn('⚠️ GA4 not available for form tracking');
  }
  
  // Track Facebook Pixel events
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      // Track Lead event (standard Facebook event)
      window.fbq('track', 'Lead', {
        content_name: formData.restaurantName || 'Contact Form',
        content_category: 'Form Submission'
      });
      
      // Track custom Confirmed event
      window.fbq('trackCustom', 'Confirmed', {
        restaurant_name: formData.restaurantName || 'N/A',
        is_restaurateur: formData.isRestaurateur ? 'Yes' : 'No',
        is_in_campania: formData.isInCampania ? 'Yes' : 'No',
        restaurant_zone: formData.restaurantZone || 'N/A',
        equipment_type: formData.equipmentType || 'N/A'
      });
      
      console.log('✅ Facebook Pixel: Lead and Confirmed events tracked');
    } catch (error) {
      console.warn('⚠️ Facebook Pixel not available for form submission tracking:', error);
    }
  }
  
  // Track GTM events
  pushToDataLayer('Lead', {
    content_name: formData.restaurantName || 'Contact Form',
    content_category: 'Form Submission'
  });
  
  pushToDataLayer('Confirmed', {
    restaurant_name: formData.restaurantName || 'N/A',
    is_restaurateur: formData.isRestaurateur ? 'Yes' : 'No',
    is_in_campania: formData.isInCampania ? 'Yes' : 'No',
    restaurant_zone: formData.restaurantZone || 'N/A',
    equipment_type: formData.equipmentType || 'N/A'
  });
};

// Track form step progression
export const trackFormStep = (step: number, stepName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log(`📊 Tracking form step ${step}: ${stepName}`);
    
    window.gtag('event', 'form_step', {
      step_number: step,
      step_name: stepName,
      event_category: 'Form'
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
    
    window.gtag('event', 'button_click', {
      button_name: buttonName,
      button_location: location,
      event_category: 'Button'
    });

    console.log('✅ Button click tracked successfully');
  } else {
    console.warn('⚠️ GA4 not available for button tracking');
  }
  
  // Track Facebook Pixel event
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      window.fbq('trackCustom', 'ClickButton', {
        button_name: buttonName,
        button_location: location
      });
      console.log('✅ Facebook Pixel: ClickButton event tracked');
    } catch (error) {
      console.warn('⚠️ Facebook Pixel not available for button tracking:', error);
    }
  }
  
  // Track GTM event
  pushToDataLayer('ClickButton', {
    button_name: buttonName,
    button_location: location
  });
};

// Track page views
export const trackPageView = (pageName: string, additionalParams?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log(`📊 Tracking page view: ${pageName}`);
    
    window.gtag('event', 'page_view', {
      page_title: pageName,
      page_location: window.location.href,
      page_path: window.location.pathname,
      ...additionalParams
    });

    console.log('✅ Page view tracked successfully');
  } else {
    console.warn('⚠️ GA4 not available for page view tracking');
  }
};

// Track form errors
export const trackFormError = (errorType: string, errorMessage: string, step?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log(`❌ Tracking form error: ${errorType} - ${errorMessage}`);
    
    window.gtag('event', 'form_error', {
      error_type: errorType,
      error_message: errorMessage,
      step_number: step || 'unknown',
      event_category: 'Form',
      non_interaction: true
    });

    console.log('✅ Form error tracked successfully');
  } else {
    console.warn('⚠️ GA4 not available for error tracking');
  }
};

// Track form abandonment
export const trackFormAbandon = (step: number, stepName: string, timeSpent: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log(`🚪 Tracking form abandon at step ${step}: ${stepName} after ${timeSpent}s`);
    
    window.gtag('event', 'form_abandon', {
      step_number: step,
      step_name: stepName,
      time_spent_seconds: Math.round(timeSpent),
      event_category: 'Form',
      non_interaction: true
    });

    console.log('✅ Form abandon tracked successfully');
  } else {
    console.warn('⚠️ GA4 not available for abandon tracking');
  }
};

// Track form completion time
export const trackFormCompletionTime = (totalTimeSeconds: number, formData?: FormSubmissionData) => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log(`⏱️ Tracking form completion time: ${totalTimeSeconds}s`);
    
    window.gtag('event', 'form_completion_time', {
      completion_time_seconds: Math.round(totalTimeSeconds),
      completion_time_minutes: Math.round(totalTimeSeconds / 60 * 10) / 10, // 1 decimal
      event_category: 'Form',
      value: Math.round(totalTimeSeconds)
    });

    console.log('✅ Form completion time tracked successfully');
  } else {
    console.warn('⚠️ GA4 not available for completion time tracking');
  }
};

// Track back button clicks
export const trackBackButton = (fromStep: number, toStep: number, stepName: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log(`⬅️ Tracking back button: from step ${fromStep} to step ${toStep}`);
    
    window.gtag('event', 'form_back', {
      from_step: fromStep,
      to_step: toStep,
      step_name: stepName,
      event_category: 'Form',
      event_label: 'Back Button Click'
    });

    console.log('✅ Back button tracked successfully');
  } else {
    console.warn('⚠️ GA4 not available for back button tracking');
  }
  
  // Track Facebook Pixel event
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      window.fbq('trackCustom', 'GoBack', {
        from_step: fromStep,
        to_step: toStep,
        step_name: stepName
      });
      console.log('✅ Facebook Pixel: GoBack event tracked');
    } catch (error) {
      console.warn('⚠️ Facebook Pixel not available for back button tracking:', error);
    }
  }
  
  // Track GTM event
  pushToDataLayer('GoBack', {
    from_step: fromStep,
    to_step: toStep,
    step_name: stepName
  });
};

// Track outbound link clicks
export const trackOutboundLink = (url: string, linkText: string, location?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log(`🔗 Tracking outbound link: ${url}`);
    
    window.gtag('event', 'click_outbound_link', {
      link_url: url,
      link_text: linkText,
      link_location: location || 'unknown',
      event_category: 'Outbound',
      event_label: 'External Link Click'
    });

    console.log('✅ Outbound link tracked successfully');
  } else {
    console.warn('⚠️ GA4 not available for outbound link tracking');
  }
};

// Track scroll depth
export const trackScrollDepth = (depth: number, page?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log(`📜 Tracking scroll depth: ${depth}%`);
    
    window.gtag('event', 'scroll_depth', {
      scroll_depth_percent: depth,
      page_name: page || 'unknown',
      event_category: 'Engagement'
    });

    console.log('✅ Scroll depth tracked successfully');
  } else {
    console.warn('⚠️ GA4 not available for scroll tracking');
  }
};

// Track time on page
export const trackTimeOnPage = (timeSeconds: number, page?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log(`⏰ Tracking time on page: ${timeSeconds}s`);
    
    window.gtag('event', 'time_on_page', {
      time_seconds: Math.round(timeSeconds),
      time_minutes: Math.round(timeSeconds / 60 * 10) / 10,
      page_name: page || 'unknown',
      event_category: 'Engagement'
    });

    console.log('✅ Time on page tracked successfully');
  } else {
    console.warn('⚠️ GA4 not available for time tracking');
  }
};

// Track UTM parameters
export const trackUTMParameters = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams: { [key: string]: string } = {};
    
    // Common UTM parameters
    const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    
    utmKeys.forEach(key => {
      const value = urlParams.get(key);
      if (value) {
        utmParams[key] = value;
      }
    });

    if (Object.keys(utmParams).length > 0) {
      console.log('📊 Tracking UTM parameters:', utmParams);
      
      window.gtag('event', 'utm_tracking', {
        ...utmParams,
        referrer: document.referrer,
        landing_page: window.location.href,
        event_category: 'Marketing'
      });

      console.log('✅ UTM parameters tracked successfully');
    }
  } else {
    console.warn('⚠️ GA4 not available for UTM tracking');
  }
};

// Track field interactions
export const trackFieldInteraction = (fieldName: string, action: 'focus' | 'blur' | 'error', step?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log(`📝 Tracking field ${action}: ${fieldName}`);
    
    window.gtag('event', 'field_interaction', {
      field_name: fieldName,
      field_action: action,
      step_number: step || 'unknown',
      event_category: 'Form'
    });

    console.log('✅ Field interaction tracked successfully');
  } else {
    console.warn('⚠️ GA4 not available for field tracking');
  }
};

// Track network errors
export const trackNetworkError = (errorType: string, endpoint: string, statusCode?: number, errorMessage?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log(`🌐 Tracking network error: ${errorType} on ${endpoint}`);
    
    window.gtag('event', 'network_error', {
      error_type: errorType,
      endpoint: endpoint,
      status_code: statusCode || 'unknown',
      error_message: errorMessage || 'unknown',
      event_category: 'Error',
      non_interaction: true
    });

    console.log('✅ Network error tracked successfully');
  } else {
    console.warn('⚠️ GA4 not available for network error tracking');
  }
};

// Track device and browser info
export const trackDeviceInfo = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android(?=.*\bMobile\b)/i.test(userAgent);
    
    console.log('📱 Tracking device info');
    
    window.gtag('event', 'device_info', {
      device_type: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
      user_agent: userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      event_category: 'Technical'
    });

    console.log('✅ Device info tracked successfully');
  } else {
    console.warn('⚠️ GA4 not available for device tracking');
  }
};

// Track autofill detection
export const trackAutofillUsage = (fieldsDetected: string[]) => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log('🤖 Tracking autofill usage:', fieldsDetected);
    
    window.gtag('event', 'autofill_detected', {
      autofill_fields: fieldsDetected.join(','),
      autofill_count: fieldsDetected.length,
      event_category: 'UX'
    });

    console.log('✅ Autofill usage tracked successfully');
  } else {
    console.warn('⚠️ GA4 not available for autofill tracking');
  }
};

// Track Core Web Vitals (simplified)
export const trackCoreWebVitals = (metric: string, value: number, id: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    console.log(`⚡ Tracking Core Web Vital: ${metric} = ${value}`);
    
    window.gtag('event', 'core_web_vital', {
      metric_name: metric,
      metric_value: Math.round(value * 100) / 100,
      metric_id: id,
      event_category: 'Performance'
    });

    console.log('✅ Core Web Vital tracked successfully');
  } else {
    console.warn('⚠️ GA4 not available for Core Web Vitals tracking');
  }
};

// Track field completion for Facebook Pixel
export const trackFieldCompletion = (fieldName: string, fieldValue: string | boolean | null, step?: number) => {
  // Map field names to readable event names
  const fieldEventMap: { [key: string]: string } = {
    'isRestaurateur': 'FieldRestaurateur',
    'isInCampania': 'FieldCampania',
    'restaurantZone': 'FieldZona',
    'restaurantName': 'FieldNomeRistorante',
    'equipmentType': 'FieldAttrezzatura',
    'firstName': 'FieldNome',
    'lastName': 'FieldCognome',
    'datiPersonali': 'FieldDatiPersonali',
    'phoneNumber': 'FieldTelefono',
    'email': 'FieldEmail',
    'wantsCatalog': 'FieldCatalogo'
  };

  let eventName = fieldEventMap[fieldName] || `Field${fieldName}`;
  
  // For boolean fields (isRestaurateur, isInCampania, wantsCatalog), create separate events for Yes/No
  if (typeof fieldValue === 'boolean') {
    const suffix = fieldValue ? '_Yes' : '_No';
    
    // Map to specific event names
    if (fieldName === 'isRestaurateur') {
      eventName = `FieldRestaurateur${suffix}`;
    } else if (fieldName === 'isInCampania') {
      eventName = `FieldCampania${suffix}`;
    } else if (fieldName === 'wantsCatalog') {
      eventName = `FieldCatalogo${suffix}`;
    } else {
      // For other boolean fields, use default naming
      eventName = `${eventName}${suffix}`;
    }
  }
  
  // Format value for tracking
  let valueToTrack: string;
  if (typeof fieldValue === 'boolean') {
    valueToTrack = fieldValue ? 'Sì' : 'No';
  } else if (fieldValue === null) {
    valueToTrack = 'Non specificato';
  } else {
    valueToTrack = String(fieldValue);
  }

  if (typeof window !== 'undefined' && window.fbq) {
    try {
      window.fbq('trackCustom', eventName, {
        field_name: fieldName,
        field_value: valueToTrack,
        step_number: step || 'unknown'
      });
      
      console.log(`✅ Facebook Pixel: ${eventName} event tracked (${fieldName} = ${valueToTrack})`);
    } catch (error) {
      console.warn('⚠️ Facebook Pixel not available for field completion tracking:', error);
    }
  }
  
  // Track GTM event
  pushToDataLayer(eventName, {
    field_name: fieldName,
    field_value: valueToTrack,
    step_number: step || 'unknown'
  });
};