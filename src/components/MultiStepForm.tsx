import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, ChevronLeft, Star, Mail, ExternalLink, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import schettinoLogo from '@/assets/schettino-logo.png';
import confetti from 'canvas-confetti';
import { 
  trackFormSubmission, 
  trackFormStep, 
  trackButtonClick, 
  initGA4,
  trackFormError,
  trackFormAbandon,
  trackFormCompletionTime,
  trackBackButton,
  trackOutboundLink,
  trackScrollDepth,
  trackTimeOnPage,
  trackUTMParameters,
  trackFieldInteraction,
  trackNetworkError,
  trackDeviceInfo,
  trackAutofillUsage,
  trackCoreWebVitals
} from '@/config/analytics';
import CompanyServices from '@/components/CompanyServices';
// import { sendEmailToCommerciali, sendTestEmail } from '../services/sendgridService';
interface FormData {
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
const MultiStepForm = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [maxStepReached, setMaxStepReached] = useState(1); // Track the maximum step reached
  const [formData, setFormData] = useState<FormData>({
    isRestaurateur: null,
    isInCampania: null,
    restaurantZone: '',
    restaurantName: '',
    equipmentType: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    wantsCatalog: null,
    privacyConsent: false
  });
  const [showThankYou, setShowThankYou] = useState(false);
  const [thankYouType, setThankYouType] = useState<'success' | 'not-restaurateur' | 'not-campania'>('success');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Tracking refs for time measurements
  const formStartTimeRef = useRef<number>(Date.now());
  const stepStartTimeRef = useRef<number>(Date.now());
  const hasTrackedAbandonRef = useRef<boolean>(false);
  
  // Advanced tracking refs
  const pageStartTimeRef = useRef<number>(Date.now());
  const scrollDepthsTrackedRef = useRef<Set<number>>(new Set());
  const autofillDetectedRef = useRef<Set<string>>(new Set());
  
  // Ref for phone number input to detect autofill
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const lastDetectedPhoneRef = useRef<string>('');
  const phoneAutofillDetectedRef = useRef<boolean>(false);

  // Initialize GA4 and advanced tracking on component mount
  useEffect(() => {
    initGA4();
    
    // Reset tracking timers
    formStartTimeRef.current = Date.now();
    stepStartTimeRef.current = Date.now();
    pageStartTimeRef.current = Date.now();
    
    // Track UTM parameters
    trackUTMParameters();
    
    // Track device info
    trackDeviceInfo();
    
    // Set up scroll tracking
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / documentHeight) * 100);
      
      // Track scroll depths at 25%, 50%, 75%, 90%
      [25, 50, 75, 90].forEach(depth => {
        if (scrollPercent >= depth && !scrollDepthsTrackedRef.current.has(depth)) {
          trackScrollDepth(depth, 'Home');
          scrollDepthsTrackedRef.current.add(depth);
        }
      });
    };
    
    // Set up time on page tracking (every 30 seconds)
    const timeInterval = setInterval(() => {
      const timeOnPage = (Date.now() - pageStartTimeRef.current) / 1000;
      trackTimeOnPage(timeOnPage, 'Home');
    }, 30000);
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timeInterval);
    };
  }, []);

  // Track form abandonment when user leaves the page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only track abandon if form was started but not completed
      if (!showThankYou && currentStep > 1 && !hasTrackedAbandonRef.current) {
        const timeSpent = (Date.now() - formStartTimeRef.current) / 1000;
        const stepName = getStepName(currentStep);
        trackFormAbandon(currentStep, stepName, timeSpent);
        hasTrackedAbandonRef.current = true;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentStep, showThankYou]);

  // Reset step start time when step changes and update max step reached
  useEffect(() => {
    stepStartTimeRef.current = Date.now();
    // Update max step reached when moving forward
    if (currentStep > maxStepReached) {
      setMaxStepReached(currentStep);
    }
  }, [currentStep, maxStepReached]);

  // Function to check for phone autofill - use a more reliable approach
  const checkPhoneAutofill = useCallback(() => {
    if (currentStep !== 7) return;
    
    // Get the input element directly from DOM
    const inputElement = phoneInputRef.current || document.querySelector('#phoneNumber') as HTMLInputElement;
    if (!inputElement) return;
    
    // Read the actual DOM value - this is what the browser autofilled
    const domValue = inputElement.value || '';
    const currentStateValue = formData.phoneNumber || '';
    
    // Skip if we already processed this exact value
    if (domValue === lastDetectedPhoneRef.current) {
      return;
    }
    
    // Check if DOM has a value that's different from state
    if (domValue.trim().length > 0) {
      const digitCount = domValue.replace(/\D/g, '').length;
      
      // Only process if it looks like a phone number (at least 6 digits)
      if (digitCount >= 6) {
        // Compare digits (ignore formatting differences)
        const stateDigits = currentStateValue.replace(/\D/g, '');
        const domDigits = domValue.replace(/\D/g, '');
        
        // If digits are different or state is empty, it's autofill
        if (stateDigits !== domDigits || !currentStateValue || currentStateValue.trim().length === 0) {
          lastDetectedPhoneRef.current = domValue;
          
          // Track autofill if state was empty
          if (!phoneAutofillDetectedRef.current && (!currentStateValue || currentStateValue.trim().length === 0)) {
            phoneAutofillDetectedRef.current = true;
            trackAutofillUsage(['phoneNumber']);
          }
          
          // Update state with formatted value (+39 prefix)
          setFormData(prev => {
            // Extract digits and format with +39
            const digits = domValue.replace(/\D/g, '');
            const limitedDigits = digits.slice(0, 10);
            const formatted = limitedDigits.length > 0 ? '+39' + limitedDigits : '';
            
            if (prev.phoneNumber !== formatted) {
              return { ...prev, phoneNumber: formatted };
            }
            return prev;
          });
        }
      }
    }
  }, [currentStep, formData.phoneNumber]);

  // Auto-fill form fields using browser autofill
  useEffect(() => {
    
    const autoFillForm = () => {
      // Try to detect if browser has autofill data
      const inputs = document.querySelectorAll('input[type="text"], input[type="tel"], input[type="email"]');
      const autofillFields: string[] = [];
      
      inputs.forEach((input: Element) => {
        const htmlInput = input as HTMLInputElement;
        if (htmlInput.value && htmlInput.value.trim() !== '') {
          const name = htmlInput.getAttribute('name') || htmlInput.getAttribute('id') || htmlInput.getAttribute('placeholder')?.toLowerCase();
          const autoComplete = htmlInput.getAttribute('autocomplete') || '';
          
          if (name?.includes('nome') || htmlInput.placeholder?.toLowerCase().includes('nome') || autoComplete === 'given-name') {
            setFormData(prev => ({ ...prev, firstName: htmlInput.value }));
            autofillFields.push('firstName');
          } else if (name?.includes('cognome') || htmlInput.placeholder?.toLowerCase().includes('cognome') || autoComplete === 'family-name') {
            setFormData(prev => ({ ...prev, lastName: htmlInput.value }));
            autofillFields.push('lastName');
          } else if (name?.includes('phone') || name?.includes('telefono') || htmlInput.type === 'tel' || autoComplete === 'tel') {
            // Handle phone number autofill - extract digits and format with +39
            const phoneValue = htmlInput.value.trim();
            if (phoneValue) {
              const digits = phoneValue.replace(/\D/g, '');
              const limitedDigits = digits.slice(0, 10);
              const formatted = limitedDigits.length > 0 ? '+39' + limitedDigits : '';
              setFormData(prev => ({ ...prev, phoneNumber: formatted }));
              autofillFields.push('phoneNumber');
            }
          } else if (name?.includes('zona') || name?.includes('zone') || htmlInput.placeholder?.toLowerCase().includes('zona') || autoComplete === 'address-level2') {
            setFormData(prev => ({ ...prev, restaurantZone: htmlInput.value }));
            autofillFields.push('restaurantZone');
          } else if (autoComplete === 'email' || htmlInput.type === 'email') {
            setFormData(prev => ({ ...prev, email: htmlInput.value }));
            autofillFields.push('email');
          }
        }
      });
      
      // Track autofill usage if detected
      if (autofillFields.length > 0) {
        trackAutofillUsage(autofillFields);
      }
    };

    // Run autofill detection multiple times to catch browser autofill
    // Some browsers take longer to populate fields
    const timer1 = setTimeout(() => {
      autoFillForm();
      checkPhoneAutofill();
    }, 100);
    const timer2 = setTimeout(() => {
      autoFillForm();
      checkPhoneAutofill();
    }, 300);
    const timer3 = setTimeout(() => {
      autoFillForm();
      checkPhoneAutofill();
    }, 500);
    const timer4 = setTimeout(() => {
      autoFillForm();
      checkPhoneAutofill();
    }, 1000);
    const timer5 = setTimeout(() => {
      checkPhoneAutofill();
    }, 1500);
    const timer6 = setTimeout(() => {
      checkPhoneAutofill();
    }, 2000);
    
    // Reset detection refs when step changes
    if (currentStep !== 7) {
      lastDetectedPhoneRef.current = '';
      phoneAutofillDetectedRef.current = false;
    }
    
    // Periodic check for phone autofill when on step 7
    // Check frequently to catch autofill
    let autofillCheckInterval: NodeJS.Timeout | null = null;
    if (currentStep === 7 && (!formData.phoneNumber || formData.phoneNumber.trim().length === 0)) {
      // Check frequently (every 100ms) for the first 3 seconds when field is empty
      let checkCount = 0;
      const maxChecks = 30; // 3 seconds at 100ms
      autofillCheckInterval = setInterval(() => {
        checkPhoneAutofill();
        checkCount++;
        if (checkCount >= maxChecks) {
          clearInterval(autofillCheckInterval as NodeJS.Timeout);
        }
        // Also stop if field got filled
        if (formData.phoneNumber && formData.phoneNumber.trim().length > 0) {
          clearInterval(autofillCheckInterval as NodeJS.Timeout);
        }
      }, 100);
    }
    
    // Listen for input events on phone field specifically
    const handlePhoneInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target && (target.id === 'phoneNumber' || target.name === 'phoneNumber')) {
        // Small delay to let browser autofill complete
        setTimeout(() => {
          checkPhoneAutofill();
        }, 50);
      }
    };
    
    // Listen for change events (autofill triggers change event)
    const handleChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target && (target.id === 'phoneNumber' || target.name === 'phoneNumber')) {
        checkPhoneAutofill();
      } else {
        autoFillForm();
      }
    };
    
    // Listen for animationstart event (browsers use this for autofill detection)
    const handleAnimationStart = (e: AnimationEvent) => {
      if (e.animationName === 'onAutoFillStart' || (e.target as HTMLElement)?.matches('input:-webkit-autofill')) {
        autoFillForm();
        if ((e.target as HTMLElement)?.id === 'phoneNumber') {
          setTimeout(checkPhoneAutofill, 100);
        }
      }
    };
    
    // For phone input, we need to check periodically because autofill 
    // doesn't trigger standard events reliably
    
    document.addEventListener('input', handlePhoneInput, true);
    document.addEventListener('change', handleChange, true);
    document.addEventListener('animationstart', handleAnimationStart as EventListener, true);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
      if (autofillCheckInterval) {
        clearInterval(autofillCheckInterval);
      }
      document.removeEventListener('input', handlePhoneInput, true);
      document.removeEventListener('change', handleChange, true);
      document.removeEventListener('animationstart', handleAnimationStart as EventListener, true);
    };
  }, [currentStep, checkPhoneAutofill, formData.phoneNumber]);
  const handleAnswer = (answer: boolean, field: 'isRestaurateur' | 'isInCampania') => {
    // Update form data
    setFormData(prev => ({
      ...prev,
      [field]: answer
    }));
    
    // Track form step
    const stepName = field === 'isRestaurateur' ? 'Restaurateur Question' : 'Campania Question';
    trackFormStep(currentStep, stepName);
    
    if (!answer) {
      setThankYouType(field === 'isRestaurateur' ? 'not-restaurateur' : 'not-campania');
      setShowThankYou(true);
      return;
    }
    
    // Navigate directly to next step without validation
    // The step is completed by this action, so we can proceed immediately
    const nextStep = currentStep + 1;
    if (nextStep > maxStepReached) {
      setMaxStepReached(nextStep);
    }
    setCurrentStep(nextStep);
  };

  const handleCatalogAnswer = (answer: boolean) => {
    // Update form data
    setFormData(prev => ({
      ...prev,
      wantsCatalog: answer
    }));
    
    // Track form step
    trackFormStep(currentStep, 'Catalog Question');
    
    // Navigate directly to next step without validation
    // The step is completed by this action, so we can proceed immediately
    const nextStep = currentStep + 1;
    if (nextStep > maxStepReached) {
      setMaxStepReached(nextStep);
    }
    setCurrentStep(nextStep);
  };
  // Helper functions for field tracking
  const handleFieldFocus = (fieldName: string) => {
    trackFieldInteraction(fieldName, 'focus', currentStep);
  };

  const handleFieldBlur = (fieldName: string) => {
    trackFieldInteraction(fieldName, 'blur', currentStep);
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    let processedValue = value;
    
    // Handle boolean values directly
    if (typeof value === 'boolean') {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
      return;
    }
    
    // Process phone number input
    if (field === 'phoneNumber') {
      // Remove all non-numeric characters
      const digitsOnly = value.replace(/\D/g, '');
      
      // Limit to 10 digits (Italian phone numbers)
      const limitedDigits = digitsOnly.slice(0, 10);
      
      // Format with +39 prefix only if there are digits
      if (limitedDigits.length > 0) {
        processedValue = '+39' + limitedDigits;
      } else {
        processedValue = '';
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }));
    
    // Don't validate phone number during typing - only validate on blur or submit
    // This allows user to type freely without interference
    
    // Validate email format on change
    if (field === 'email' && value.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        trackFormError('inline_validation', 'Invalid email format while typing', currentStep);
        toast({
          description: "Formato email non valido. Usa nome@esempio.it",
          duration: 2000,
        });
      }
    }
  };
  // Helper function to get step name
  const getStepName = (step: number): string => {
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

  // Check if a step is completed (has data)
  const isStepCompleted = (step: number): boolean => {
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
      case 7:
        // Check if phone has exactly 10 digits after +39 prefix
        const phone = formData.phoneNumber.trim();
        if (!phone || !phone.startsWith('+39')) return false;
        const phoneDigits = phone.replace(/\D/g, '').slice(2); // Remove +39
        return phoneDigits.length === 10;
      case 8:
        return formData.email.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      case 9:
        return formData.wantsCatalog !== null;
      case 10:
        return formData.privacyConsent === true;
      default:
        return false;
    }
  };

  // Navigate to a specific step (only if already visited or is the next step)
  const goToStep = (targetStep: number) => {
    // Allow navigation to:
    // 1. Current step (no-op)
    // 2. Steps that have been reached (maxStepReached)
    // 3. The next step after maxStepReached (if current step is validated)
    if (targetStep === currentStep) {
      return; // Already on this step
    }

    // Allow going back to any previous step
    if (targetStep < currentStep) {
    const fromStep = currentStep;
      const toStep = targetStep;
    const stepName = getStepName(fromStep);
    trackBackButton(fromStep, toStep, stepName);
      setCurrentStep(targetStep);
      return;
    }

    // Allow going forward only if:
    // - Target step is the next step (currentStep + 1)
    // - Or target step has already been reached (targetStep <= maxStepReached)
    if (targetStep === currentStep + 1 || targetStep <= maxStepReached) {
      // Validate current step before moving forward
      if (targetStep > currentStep && !isStepCompleted(currentStep)) {
        toast({
          description: "Completa questo step prima di procedere",
          duration: 2000,
        });
        return;
      }
      setCurrentStep(targetStep);
    }
  };

  const handleNext = () => {
    // Validate current step before proceeding
    if (!isStepCompleted(currentStep)) {
      toast({
        description: "Completa tutti i campi obbligatori prima di procedere",
        duration: 2000,
      });
      return;
    }
    goToStep(currentStep + 1);
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Prevenire invii multipli
    if (isSubmitting || isSubmitted) {
      return;
    }
    
    // Validate phone number format (must have exactly 10 digits after +39)
    const phone = formData.phoneNumber.trim();
    if (!phone || !phone.startsWith('+39')) {
      trackFormError('validation_error', 'Phone number is required', currentStep);
      toast({
        description: "Il numero di telefono è obbligatorio",
        duration: 3000,
      });
      return;
    }
    
    // Check if we have exactly 10 digits after +39
    const digits = phone.replace(/\D/g, '').slice(2); // Remove +39
    if (digits.length !== 10) {
      trackFormError('validation_error', 'Invalid phone number format', currentStep);
      toast({
        description: "Il numero deve avere esattamente 10 cifre",
        duration: 3000,
      });
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      trackFormError('validation_error', 'Invalid email format', currentStep);
      return; // Invalid email
    }
    
    // Validate privacy consent
    if (!formData.privacyConsent) {
      trackFormError('validation_error', 'Privacy consent not accepted', currentStep);
      toast({
        description: "È necessario accettare la privacy policy per procedere",
        duration: 3000,
      });
      return; // Privacy consent required
    }
    
    setIsSubmitting(true);
    
    // Make webhook URL
    const makeWebhookUrl = "https://hook.eu2.make.com/dbeari9w8c7p9ft1dhizsuvrd2a98gqi";
    
    try {
      
      const payload = {
        ...formData,
        timestamp: new Date().toISOString(),
        source: 'Schettino Form',
        // Campi espliciti per Google Sheets
        catalog_request: formData.wantsCatalog ? 'Sì' : 'No',
        phone_formatted: formData.phoneNumber,
        full_name: `${formData.firstName} ${formData.lastName}`.trim(),
        privacy_consent: formData.privacyConsent ? 'Sì' : 'No'
      };
      
      console.log('Invio dati a Make:', payload);
      console.log('URL webhook:', makeWebhookUrl);
      
      const response = await fetch(makeWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      // Track network error if request failed
      if (!response.ok) {
        trackNetworkError('webhook_failure', makeWebhookUrl, response.status, `HTTP ${response.status}`);
      }
      
      if (response.ok) {
        console.log('Dati inviati a Make con successo.');
        
        // Calculate total completion time
        const totalTimeSeconds = (Date.now() - formStartTimeRef.current) / 1000;
        
        // Send email notification to commerciali
        try {
          const emailResponse = await fetch('https://laxbglhrrcbrxpnpvcob.supabase.co/functions/v1/send-test-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
          
          if (emailResponse.ok) {
            console.log('Email di notifica inviata con successo');
          } else {
            console.log('Errore invio email notifica, ma form completato comunque');
            trackFormError('email_error', 'Failed to send notification email', currentStep);
            trackNetworkError('email_failure', 'supabase-email-endpoint', emailResponse.status, 'Email notification failed');
          }
        } catch (emailError) {
          console.log('Errore invio email notifica:', emailError);
          trackFormError('email_error', String(emailError), currentStep);
          trackNetworkError('email_exception', 'supabase-email-endpoint', undefined, String(emailError));
        }
        
        
        // Fire confetti animation
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        
        
        // Track form submission and completion time
        trackFormSubmission(formData);
        trackFormCompletionTime(totalTimeSeconds, formData);
        
        // Mark that form was completed (don't track abandon)
        hasTrackedAbandonRef.current = true;
        
        setIsSubmitted(true);
        
        toast({
          title: "Preventivo inviato!",
          description: "Ti contatteremo presto per discutere le tue esigenze.",
        });
        setThankYouType('success');
        setShowThankYou(true);
      } else {
        throw new Error('Errore nell\'invio');
      }
      
    } catch (error) {
      console.error('Errore invio form:', error);
      trackFormError('submission_error', String(error), currentStep);
      trackNetworkError('submission_exception', makeWebhookUrl, undefined, String(error));
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova o contattaci direttamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const getThankYouMessage = () => {
    switch (thankYouType) {
      case 'not-restaurateur':
        return "Ci occupiamo di attrezzature professionali per ristoranti e hotel. Non operiamo con privati. Grazie per averci scritto!";
      case 'not-campania':
        return "Operiamo esclusivamente in Campania. Grazie per averci scritto!";
      default:
        return "Grazie per aver compilato il modulo!";
    }
  };
  if (showThankYou) {
    return <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black shadow-[var(--shadow-form)] mx-auto">
          <CardHeader className="text-center px-4 py-6">
            <div className="mb-1">
              <img 
                src={schettinoLogo} 
                alt="Schettino Grandi Cucine" 
                className="h-16 mx-auto mb-1"
              />
            </div>
          </CardHeader>
          <CardContent className="text-center flex flex-col justify-between min-h-[280px] py-4 px-4">
            <div className="space-y-4">
              {/* Header - Main thank you message */}
              <div className="space-y-3">
                <h2 className="text-white leading-relaxed font-bold text-sm md:text-base text-center break-words-safe text-pretty">
                  {getThankYouMessage()}
                </h2>
                {thankYouType === 'success' && (
                  <p className="text-white text-sm text-center">
                    Nel frattempo puoi scoprire di più su di noi
                  </p>
                )}
              </div>
            </div>
            
            {thankYouType === 'success' && (
              <div>
                <Button 
                  onClick={() => {
                    trackOutboundLink('https://www.schettinograndicucine.com/', 'Visita il nostro sito', 'thank-you-page');
                    window.open('https://www.schettinograndicucine.com/', '_blank');
                  }}
                  className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)]"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visita il nostro sito
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>;
  }
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-text-primary mb-1 leading-tight">
                Sei un ristoratore?
              </h2>
              <p className="text-text-secondary text-sm -mt-1">
                Prima domanda per comprendere le tue necessità
              </p>
            </div>
            <div className="space-y-3">
              <Button onClick={() => {
                trackButtonClick('Sì, sono un ristoratore', 'Step 1');
                handleAnswer(true, 'isRestaurateur');
              }} className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)]" size="lg">
                Sì, sono un ristoratore
              </Button>
              <Button onClick={() => {
                trackButtonClick('No, non sono un ristoratore', 'Step 1');
                handleAnswer(false, 'isRestaurateur');
              }} variant="outline" className="w-full border-border text-white" size="lg">
                No, non sono un ristoratore
              </Button>
            </div>
          </div>;
      case 2:
        return <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                Il tuo locale si trova in Campania?
              </h2>
              <p className="text-text-secondary text-sm">
                Operiamo esclusivamente nella regione Campania
              </p>
            </div>
            <div className="space-y-3">
              <Button onClick={() => {
                trackButtonClick('Sì, è in Campania', 'Step 2');
                handleAnswer(true, 'isInCampania');
              }} className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)]" size="lg">
                Sì, è in Campania
              </Button>
              <Button onClick={() => {
                trackButtonClick('No, si trova fuori dalla Campania', 'Step 2');
                handleAnswer(false, 'isInCampania');
              }} variant="outline" className="w-full border-border text-white" size="lg">
                No, si trova fuori dalla Campania
              </Button>
            </div>
            <Button onClick={handleBack} variant="ghost" className="w-full text-text-secondary hover:text-text-primary transition-[var(--transition-smooth)]">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Torna indietro
            </Button>
          </div>;
      case 3:
        return <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                In che zona si trova il tuo ristorante?
              </h2>
              <p className="text-text-secondary text-sm">
                Indica la città o paese in cui operi
              </p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-4">
              <Input 
                id="restaurantZone"
                name="restaurantZone" 
                placeholder="Es. Napoli, Salerno, Caserta..." 
                value={formData.restaurantZone} 
                onChange={e => handleInputChange('restaurantZone', e.target.value)}
                onFocus={() => handleFieldFocus('restaurantZone')}
                onBlur={() => handleFieldBlur('restaurantZone')}
                className="bg-input border-border text-text-primary placeholder:text-text-secondary focus:ring-primary" 
                autoComplete="address-level2" 
              />
              <Button type="submit" disabled={!formData.restaurantZone.trim()} className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] disabled:opacity-50" size="lg">
                Continua
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
            <Button onClick={handleBack} variant="ghost" className="w-full text-text-secondary hover:text-text-primary transition-[var(--transition-smooth)]">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Torna indietro
            </Button>
          </div>;
      case 4:
        return <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                Qual è il nome del tuo ristorante?
              </h2>
              <p className="text-text-secondary text-sm">
                Aiutaci a conoscerti meglio
              </p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-4">
              <Input 
                id="restaurantName"
                name="restaurantName"
                placeholder="Nome del ristorante" 
                value={formData.restaurantName} 
                onChange={e => handleInputChange('restaurantName', e.target.value)} 
                className="bg-input border-border text-text-primary placeholder:text-text-secondary focus:ring-primary" 
                autoComplete="organization"
              />
              <Button type="submit" disabled={!formData.restaurantName.trim()} className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] disabled:opacity-50" size="lg">
                Continua
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
            <Button onClick={handleBack} variant="ghost" className="w-full text-text-secondary hover:text-text-primary transition-[var(--transition-smooth)]">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Torna indietro
            </Button>
          </div>;
      case 5:
        return <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                Di che tipo di attrezzatura hai bisogno?
              </h2>
              <p className="text-text-secondary text-sm">
                Descrivi brevemente le tue necessità
              </p>
            </div>
            <div className="space-y-4">
              <Textarea placeholder="Descrivi il tipo di attrezzatura di cui hai bisogno..." value={formData.equipmentType} onChange={e => handleInputChange('equipmentType', e.target.value)} className="bg-input border-border text-text-primary placeholder:text-text-secondary focus:ring-primary min-h-[100px]" rows={4} />
              <Button onClick={handleNext} disabled={!formData.equipmentType.trim()} className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] disabled:opacity-50" size="lg">
                Continua
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <Button onClick={handleBack} variant="ghost" className="w-full text-text-secondary hover:text-text-primary transition-[var(--transition-smooth)]">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Torna indietro
            </Button>
          </div>;
      case 6:
        return <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                Dati Personali
              </h2>
              <p className="text-text-secondary text-sm">
                Come possiamo chiamarti?
              </p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input 
                  id="firstName"
                  name="firstName" 
                  placeholder="Nome" 
                  value={formData.firstName} 
                  onChange={e => handleInputChange('firstName', e.target.value)} 
                  className="bg-input border-border text-text-primary placeholder:text-text-secondary focus:ring-primary" 
                  autoComplete="given-name"
                />
                <Input 
                  id="lastName"
                  name="lastName" 
                  placeholder="Cognome" 
                  value={formData.lastName} 
                  onChange={e => handleInputChange('lastName', e.target.value)} 
                  className="bg-input border-border text-text-primary placeholder:text-text-secondary focus:ring-primary" 
                  autoComplete="family-name"
                />
              </div>
              <Button type="submit" disabled={!formData.firstName.trim() || !formData.lastName.trim()} className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] disabled:opacity-50" size="lg">
                Continua
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
            <Button onClick={handleBack} variant="ghost" className="w-full text-text-secondary hover:text-text-primary transition-[var(--transition-smooth)]">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Torna indietro
            </Button>
          </div>;
      case 7:
        return <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                Numero di Telefono
              </h2>
              <p className="text-text-secondary text-sm">
                Per essere contattato rapidamente
              </p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-4">
              <div className="relative flex items-center">
                {/* Static +39 prefix */}
                <div className="absolute left-3 z-10 text-text-primary font-medium select-none pointer-events-none">
                  +39
                </div>
                <Input 
                  ref={phoneInputRef}
                  id="phoneNumber"
                  name="phoneNumber" 
                  placeholder="3331234567" 
                  value={formData.phoneNumber ? formData.phoneNumber.replace('+39', '') : ''}
                  onChange={(e) => {
                    // Extract only digits and limit to 10
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                    // Update with +39 prefix
                    handleInputChange('phoneNumber', digits);
                  }}
                  onFocus={() => {
                    handleFieldFocus('phoneNumber');
                    // Check for autofill multiple times - browser autofill can be delayed
                    const checkTimes = [0, 50, 100, 200, 400, 600, 1000, 1500];
                    checkTimes.forEach(delay => {
                      setTimeout(() => checkPhoneAutofill(), delay);
                    });
                  }}
                  onBlur={(e) => {
                    handleFieldBlur('phoneNumber');
                    const inputValue = e.target.value || '';
                    const digits = inputValue.replace(/\D/g, '').slice(0, 10);
                    
                    // Final check for autofill - compare DOM value with state
                    const currentDigits = formData.phoneNumber ? formData.phoneNumber.replace('+39', '') : '';
                    if (digits !== currentDigits) {
                      // Process autofilled value: extract digits and format with +39
                      if (digits.length > 0) {
                        const formatted = '+39' + digits;
                        setFormData(prev => ({ ...prev, phoneNumber: formatted }));
                      } else {
                        setFormData(prev => ({ ...prev, phoneNumber: '' }));
                      }
                    }
                    
                    // Validate phone number format on blur
                    const phone = formData.phoneNumber.trim();
                    if (phone && phone.startsWith('+39')) {
                      const phoneDigits = phone.replace(/\D/g, '').slice(2); // Remove +39
                      if (phoneDigits.length > 0 && phoneDigits.length !== 10) {
                        toast({
                          description: "Il numero deve avere esattamente 10 cifre",
                          duration: 3000,
                        });
                      }
                    }
                  }}
                  onKeyDown={(e) => {
                    // Prevent typing +, -, spaces, and other special chars
                    if (e.key === '+' || e.key === '-' || e.key === ' ' || 
                        (e.key.length === 1 && /[^0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key))) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    const pastedText = e.clipboardData.getData('text');
                    // Extract only digits and limit to 10
                    const digits = pastedText.replace(/\D/g, '').slice(0, 10);
                    if (digits.length > 0) {
                      handleInputChange('phoneNumber', digits);
                    }
                  }}
                  className="bg-input border-border text-text-primary placeholder:text-text-secondary focus:ring-primary pl-12" 
                  type="tel" 
                  autoComplete="tel"
                  inputMode="numeric"
                  maxLength={10}
                />
              </div>
              <Button 
                type="submit" 
                disabled={(() => {
                  const phone = formData.phoneNumber.trim();
                  if (!phone || !phone.startsWith('+39')) return true;
                  // Check if we have exactly 10 digits after +39
                  const digits = phone.replace(/\D/g, '').slice(2); // Remove +39
                  return digits.length !== 10;
                })()}
                className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] disabled:opacity-50" 
                size="lg"
              >
                Continua
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
            <Button onClick={handleBack} variant="ghost" className="w-full text-text-secondary hover:text-text-primary transition-[var(--transition-smooth)]">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Torna indietro
            </Button>
          </div>;
      case 8:
        return <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                Email
              </h2>
              <p className="text-text-secondary text-sm">
                Per ricevere la risposta alla tua richiesta
              </p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-4">
              <Input 
                id="email"
                name="email" 
                placeholder="La tua email (es. nome@esempio.it)" 
                value={formData.email} 
                onChange={e => handleInputChange('email', e.target.value)}
                onFocus={() => handleFieldFocus('email')}
                onBlur={() => handleFieldBlur('email')}
                className="bg-input border-border text-text-primary placeholder:text-text-secondary focus:ring-primary" 
                type="email" 
                autoComplete="email"
              />
              <Button type="submit" disabled={!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)} className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] disabled:opacity-50" size="lg">
                Continua
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
            <Button onClick={handleBack} variant="ghost" className="w-full text-text-secondary hover:text-text-primary transition-[var(--transition-smooth)]">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Torna indietro
            </Button>
          </div>;
      case 9:
        return <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Catalogo Esclusivo
              </h2>
              <p className="text-text-secondary text-sm mb-6">
                Vuoi ricevere in omaggio il nostro catalogo esclusivo? Potrai vedere con i tuoi occhi tutte le attrezzature che abbiamo a disposizione, in questo modo durante la consulenza sapremo perfettamente come aiutarti!
              </p>
            </div>
            <div className="space-y-4">
              <Button 
                onClick={() => handleCatalogAnswer(true)} 
                className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)]" 
                size="lg"
              >
                Sì, voglio ricevere il catalogo
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                onClick={() => handleCatalogAnswer(false)} 
                variant="outline" 
                className="w-full border-border text-text-primary" 
                size="lg"
              >
                No, non mi interessa
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <Button onClick={handleBack} variant="ghost" className="w-full text-text-secondary hover:text-text-primary transition-[var(--transition-smooth)]">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Torna indietro
            </Button>
          </div>;
      case 10:
        return <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                Conferma Invio
              </h2>
              <p className="text-text-secondary text-sm">
                Ultimo passaggio per completare la richiesta
              </p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-input rounded-lg border border-border">
                <button
                  type="button"
                  onClick={() => handleInputChange('privacyConsent', !formData.privacyConsent)}
                  className={`mt-1 w-6 h-6 border-2 rounded-sm flex items-center justify-center transition-all duration-200 touch-manipulation ${
                    formData.privacyConsent 
                      ? 'bg-primary border-primary text-white shadow-sm' 
                      : 'bg-white border-gray-300 hover:border-primary hover:bg-gray-50 active:scale-95'
                  }`}
                  style={{ minWidth: '24px', minHeight: '24px' }}
                >
                  {formData.privacyConsent && <Check className="w-4 h-4" />}
                </button>
                <label 
                  onClick={() => handleInputChange('privacyConsent', !formData.privacyConsent)}
                  className="text-sm text-text-primary leading-relaxed cursor-pointer select-none touch-manipulation"
                  style={{ touchAction: 'manipulation' }}
                >
                  Accetto il trattamento dei dati personali secondo la{' '}
                  <a 
                    href="https://schettinograndicucine-ten.vercel.app/privacy.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary hover:underline underline-offset-2 transition-colors touch-manipulation"
                    onClick={(e) => e.stopPropagation()}
                    style={{ touchAction: 'manipulation' }}
                  >
                    Privacy Policy
                  </a>
                  . I dati saranno utilizzati esclusivamente per rispondere alla tua richiesta e fornire i servizi richiesti.
                </label>
              </div>
              <Button 
                type="submit"
                disabled={!formData.privacyConsent || isSubmitting || isSubmitted}
                className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] disabled:opacity-50" 
                size="lg"
              >
                {isSubmitting ? "Invio in corso..." : isSubmitted ? "Richiesta inviata" : "Invia Richiesta"}
                {!isSubmitting && !isSubmitted && <ChevronRight className="w-4 h-4 ml-2" />}
              </Button>
            </form>
            <Button onClick={handleBack} variant="ghost" className="w-full text-text-secondary hover:text-text-primary transition-[var(--transition-smooth)]">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Torna indietro
            </Button>
          </div>;
      default:
        return null;
    }
  };
  return <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      
      
      <div className="w-full max-w-4xl">

        {/* Form Card */}
        <Card className="w-full max-w-md mx-auto bg-form-background shadow-[var(--shadow-form)] mb-8">
          <CardHeader className="text-center bg-[#1A1A1A] rounded-t-lg mb-6 p-6">
            <img src={schettinoLogo} alt="Schettino Grandi Cucine" className="h-12 mx-auto mb-2" />
            <div className="mb-4">
              <CardTitle className="text-xl font-bold text-white mb-0 leading-tight">
                Richiedi più informazioni
              </CardTitle>
              <p className="text-sm text-text-secondary mt-0">
                Per avere un preventivo personalizzato
              </p>
            </div>
            <div className="flex justify-center space-x-2 mt-4" role="tablist" aria-label="Progresso del form">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(step => {
                const isCompleted = isStepCompleted(step);
                const isReached = step <= maxStepReached;
                const isCurrent = step === currentStep;
                const isNextStep = step === currentStep + 1;
                const canNavigate = step <= maxStepReached || (isNextStep && isStepCompleted(currentStep));
                
                return (
                  <button
                    key={step}
                    type="button"
                    onClick={() => {
                      if (canNavigate || step < currentStep) {
                        goToStep(step);
                      }
                    }}
                    disabled={!canNavigate && step > currentStep}
                    className={`
                      w-2 h-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#1A1A1A]
                      ${isCurrent 
                        ? 'bg-primary scale-125 ring-2 ring-primary ring-offset-2 ring-offset-[#1A1A1A]' 
                        : isCompleted && isReached
                        ? 'bg-green-400 hover:bg-green-300 hover:scale-110 cursor-pointer'
                        : isReached && !isCompleted
                        ? 'bg-white hover:bg-gray-200 hover:scale-110 cursor-pointer'
                        : isNextStep && isStepCompleted(currentStep)
                        ? 'bg-white hover:bg-gray-200 hover:scale-110 cursor-pointer'
                        : 'bg-gray-600 cursor-not-allowed opacity-50'
                      }
                    `}
                    title={`Step ${step}: ${getStepName(step)}${isCompleted ? ' (Completato)' : isReached ? ' (Visitato)' : ' (Non ancora raggiunto)'}`}
                    aria-label={`Vai allo step ${step}${isCompleted ? ', completato' : ''}`}
                    aria-selected={isCurrent}
                    role="tab"
                  />
                );
              })}
            </div>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>

        {/* Reviews Marquee */}
        <div className="relative overflow-hidden bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-6 max-w-md mx-auto">
          <div className="flex animate-[scroll-left_20s_linear_infinite] space-x-8">
            <div className="flex items-center space-x-2 text-xs whitespace-nowrap">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-white font-medium">"Attrezzature di qualità, assistenza impeccabile" - Marco R.</span>
            </div>
            <div className="flex items-center space-x-2 text-xs whitespace-nowrap">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-white font-medium">"Dal 1980 ci affidiamo a Schettino per la nostra pizzeria" - Giuseppe M.</span>
            </div>
            <div className="flex items-center space-x-2 text-xs whitespace-nowrap">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-white font-medium">"Professionalità e competenza, consigliatissimi!" - Anna P.</span>
            </div>
            <div className="flex items-center space-x-2 text-xs whitespace-nowrap">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-white font-medium">"Installazione perfetta, zero problemi da 5 anni" - Roberto C.</span>
            </div>
          </div>
        </div>

        {/* Company Info Section */}
        <CompanyServices />
      </div>
    </div>;
};
export default MultiStepForm;