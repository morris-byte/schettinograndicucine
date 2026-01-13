import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Star } from 'lucide-react';
import schettinoLogo from '@/assets/schettino-logo.png';
import confetti from 'canvas-confetti';
import {
  trackFormSubmission,
  trackFormStep,
  trackFormError,
  trackFormCompletionTime,
  trackBackButton,
  trackFieldInteraction,
  trackNetworkError,
  trackFieldCompletion,
} from '@/config/analytics';
import CompanyServices from '@/components/CompanyServices';
import { useFormAutofill } from '@/hooks/useFormAutofill';
import { useFormTracking } from '@/hooks/useFormTracking';
import { FormData, ThankYouType, FormSubmissionPayload } from '@/types/form';
import { isStepCompleted, getStepName, validatePhoneNumber, validateEmail, formatPhoneNumber } from '@/utils/formValidation';
import { logger } from '@/utils/logger';
import { getMakeWebhookUrl, getSupabaseFunctionUrl } from '@/config/env';
import {
  Step1Restaurateur,
  Step2Campania,
  Step3RestaurantZone,
  Step4RestaurantName,
  Step5EquipmentType,
  Step6PersonalData,
  Step7PhoneNumber,
  Step8Email,
  Step9Catalog,
  Step10Confirmation,
  ThankYouPage,
} from './form-steps';

const INITIAL_FORM_DATA: FormData = {
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
  privacyConsent: false,
};

const MultiStepForm = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [maxStepReached, setMaxStepReached] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [showThankYou, setShowThankYou] = useState(false);
  const [thankYouType, setThankYouType] = useState<ThankYouType>('success');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const submitAttemptRef = useRef<number>(0);
  const lastSubmitTimeRef = useRef<number>(0);

  const phoneInputRef = useRef<HTMLInputElement>(null);

  // Use custom hooks
  const { formStartTimeRef, hasTrackedAbandonRef } = useFormTracking({
    currentStep,
    showThankYou,
    getStepName,
  });

  useFormAutofill({
    currentStep,
    formData,
    setFormData,
    phoneInputRef,
  });

  // Handlers
  const handleAnswer = (answer: boolean, field: 'isRestaurateur' | 'isInCampania') => {
    setFormData(prev => ({ ...prev, [field]: answer }));

    const stepName = field === 'isRestaurateur' ? 'Restaurateur Question' : 'Campania Question';
    trackFormStep(currentStep, stepName);
    trackFieldCompletion(field, answer, currentStep);

    if (!answer) {
      setThankYouType(field === 'isRestaurateur' ? 'not-restaurateur' : 'not-campania');
      setShowThankYou(true);
      return;
    }

    const nextStep = currentStep + 1;
    if (nextStep > maxStepReached) {
      setMaxStepReached(nextStep);
    }
    setCurrentStep(nextStep);
  };

  const handleCatalogAnswer = (answer: boolean) => {
    setFormData(prev => ({ ...prev, wantsCatalog: answer }));
    trackFormStep(currentStep, 'Catalog Question');
    trackFieldCompletion('wantsCatalog', answer, currentStep);

    const nextStep = currentStep + 1;
    if (nextStep > maxStepReached) {
      setMaxStepReached(nextStep);
    }
    setCurrentStep(nextStep);
  };

  const handleFieldFocus = (fieldName: string) => {
    trackFieldInteraction(fieldName, 'focus', currentStep);
  };

  const handleFieldBlur = (fieldName: string) => {
    trackFieldInteraction(fieldName, 'blur', currentStep);
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    const previousValue = formData[field];

    if (typeof value === 'boolean') {
      setFormData(prev => ({ ...prev, [field]: value }));
      trackFieldCompletion(field, value, currentStep);
      return;
    }

    let processedValue = value;
    if (field === 'phoneNumber') {
      processedValue = formatPhoneNumber(value);
    }

    setFormData(prev => ({ ...prev, [field]: processedValue }));

    // Track field completion
    if (typeof processedValue === 'string') {
      const wasEmpty = !previousValue || String(previousValue).trim() === '';
      const isNowComplete = processedValue.trim() !== '';

      if (isNowComplete && wasEmpty) {
        if (field === 'restaurantZone' || field === 'restaurantName' || field === 'equipmentType') {
          trackFieldCompletion(field, processedValue, currentStep);
        } else if (field === 'firstName') {
          trackFieldCompletion(field, processedValue, currentStep);
          const lastName = (formData.lastName || '').trim();
          if (lastName !== '') {
            trackFieldCompletion('datiPersonali', `${processedValue} ${lastName}`, currentStep);
          }
        } else if (field === 'lastName') {
          trackFieldCompletion(field, processedValue, currentStep);
          const firstName = (formData.firstName || '').trim();
          if (firstName !== '') {
            trackFieldCompletion('datiPersonali', `${firstName} ${processedValue}`, currentStep);
          }
        } else if (field === 'phoneNumber') {
          const digits = processedValue.replace(/\D/g, '').slice(2);
          const prevDigits = previousValue ? String(previousValue).replace(/\D/g, '').slice(2) : '';
          if (digits.length === 10 && prevDigits.length !== 10) {
            trackFieldCompletion(field, processedValue, currentStep);
          }
        } else if (field === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const wasValidEmail = previousValue ? emailRegex.test(String(previousValue)) : false;
          if (emailRegex.test(processedValue) && !wasValidEmail) {
            trackFieldCompletion(field, processedValue, currentStep);
          }
        }
      }
    }

    // Validate email format on change - solo se l'utente ha finito di digitare (non ad ogni carattere)
    // La validazione completa è gestita in Step8Email con errore visivo
    // Qui evitiamo di mostrare toast ad ogni carattere digitato
  };

  const goToStep = (targetStep: number) => {
    if (targetStep === currentStep) return;

    if (targetStep < currentStep) {
      const fromStep = currentStep;
      const toStep = targetStep;
      const stepName = getStepName(fromStep);
      trackBackButton(fromStep, toStep, stepName);
      setCurrentStep(targetStep);
      return;
    }

    if (targetStep === currentStep + 1 || targetStep <= maxStepReached) {
      if (targetStep > currentStep && !isStepCompleted(currentStep, formData)) {
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
    if (!isStepCompleted(currentStep, formData)) {
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
    // Prevent multiple submissions
    if (isSubmitting || isSubmitted) return;
    
    // Rate limiting: prevent submissions within 2 seconds
    const now = Date.now();
    const timeSinceLastSubmit = now - lastSubmitTimeRef.current;
    if (timeSinceLastSubmit < 2000) {
      toast({
        description: "Attendi un momento prima di inviare di nuovo",
        duration: 2000,
      });
      return;
    }
    
    // Track submission attempt
    submitAttemptRef.current++;
    lastSubmitTimeRef.current = now;

    if (!validatePhoneNumber(formData.phoneNumber || '')) {
      trackFormError('validation_error', 'Invalid phone number format', currentStep);
      toast({
        description: "Il numero deve avere esattamente 10 cifre",
        duration: 3000,
      });
      return;
    }

    if (!validateEmail(formData.email || '')) {
      trackFormError('validation_error', 'Invalid email format', currentStep);
      toast({
        description: "Inserisci un indirizzo email valido (es. nome@esempio.it)",
        duration: 3000,
      });
      return;
    }

    if (!formData.privacyConsent) {
      trackFormError('validation_error', 'Privacy consent not accepted', currentStep);
      toast({
        description: "È necessario accettare la privacy policy per procedere",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    const makeWebhookUrl = getMakeWebhookUrl();

    try {
      const payload: FormSubmissionPayload = {
        ...formData,
        timestamp: new Date().toISOString(),
        source: 'Schettino Form',
        catalog_request: formData.wantsCatalog ? 'Sì' : 'No',
        phone_formatted: formData.phoneNumber || '',
        full_name: `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
        privacy_consent: formData.privacyConsent ? 'Sì' : 'No',
      };

      logger.log('Invio dati a Make:', payload);
      logger.log('URL webhook:', makeWebhookUrl);

      const response = await fetch(makeWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      logger.log('Response status:', response.status);
      logger.log('Response ok:', response.ok);

      if (!response.ok) {
        trackNetworkError('webhook_failure', makeWebhookUrl, response.status, `HTTP ${response.status}`);
      }

      if (response.ok) {
        logger.log('Dati inviati a Make con successo.');

        const totalTimeSeconds = (Date.now() - formStartTimeRef.current) / 1000;

        // Send email notification
        try {
          const emailResponse = await fetch(getSupabaseFunctionUrl(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (emailResponse.ok) {
            logger.log('Email di notifica inviata con successo');
          } else {
            logger.warn('Errore invio email notifica, ma form completato comunque');
            trackFormError('email_error', 'Failed to send notification email', currentStep);
            trackNetworkError('email_failure', 'supabase-email-endpoint', emailResponse.status, 'Email notification failed');
          }
        } catch (emailError) {
          logger.warn('Errore invio email notifica:', emailError);
          trackFormError('email_error', String(emailError), currentStep);
          trackNetworkError('email_exception', 'supabase-email-endpoint', undefined, String(emailError));
        }

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        trackFormSubmission(formData);
        trackFormCompletionTime(totalTimeSeconds, formData);
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
      logger.error('Errore invio form:', error);
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

  if (showThankYou) {
    return <ThankYouPage thankYouType={thankYouType} />;
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Restaurateur onAnswer={(answer) => handleAnswer(answer, 'isRestaurateur')} />;
      case 2:
        return <Step2Campania onAnswer={(answer) => handleAnswer(answer, 'isInCampania')} onBack={handleBack} />;
      case 3:
        return (
          <Step3RestaurantZone
            formData={formData}
            onInputChange={handleInputChange}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <Step4RestaurantName
            formData={formData}
            onInputChange={handleInputChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <Step5EquipmentType
            formData={formData}
            onInputChange={handleInputChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 6:
        return (
          <Step6PersonalData
            formData={formData}
            onInputChange={handleInputChange}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 7:
        return (
          <Step7PhoneNumber
            formData={formData}
            phoneInputRef={phoneInputRef}
            onInputChange={handleInputChange}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 8:
        return (
          <Step8Email
            formData={formData}
            onInputChange={handleInputChange}
            onFieldFocus={handleFieldFocus}
            onFieldBlur={handleFieldBlur}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 9:
        return <Step9Catalog onAnswer={handleCatalogAnswer} onBack={handleBack} />;
      case 10:
        return (
          <Step10Confirmation
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onBack={handleBack}
            isSubmitting={isSubmitting}
            isSubmitted={isSubmitted}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <div className="w-full max-w-4xl">
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
                const isCompleted = isStepCompleted(step, formData);
                const isReached = step <= maxStepReached;
                const isCurrent = step === currentStep;
                const isNextStep = step === currentStep + 1;
                const canNavigate = step <= maxStepReached || (isNextStep && isStepCompleted(currentStep, formData));

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
                        : isNextStep && isStepCompleted(currentStep, formData)
                        ? 'bg-white hover:bg-gray-200 hover:scale-110 cursor-pointer'
                        : 'bg-gray-600 cursor-not-allowed opacity-50'
                      }
                    `}
                    title={`Step ${step}: ${getStepName(step)}${isCompleted ? ' (Completato)' : isReached ? ' (Visitato)' : ' (Non ancora raggiunto)'}`}
                    aria-label={`Vai allo step ${step}: ${getStepName(step)}${isCompleted ? ', completato' : isReached ? ', visitato' : ', non ancora raggiunto'}`}
                    aria-selected={isCurrent}
                    aria-current={isCurrent ? 'step' : undefined}
                    role="tab"
                    aria-controls={`step-${step}-content`}
                  />
                );
              })}
            </div>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>

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

        <CompanyServices />
      </div>
    </div>
  );
};

export default MultiStepForm;

