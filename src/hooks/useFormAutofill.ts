import { useEffect, useRef, useCallback } from 'react';
import { FormData } from '@/types/form';
import { trackAutofillUsage } from '@/config/analytics';
import { formatPhoneNumber } from '@/utils/formValidation';

interface UseFormAutofillProps {
  currentStep: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  phoneInputRef: React.RefObject<HTMLInputElement>;
}

export const useFormAutofill = ({
  currentStep,
  formData,
  setFormData,
  phoneInputRef
}: UseFormAutofillProps) => {
  const lastDetectedPhoneRef = useRef<string>('');
  const phoneAutofillDetectedRef = useRef<boolean>(false);

  // Function to check for phone autofill
  const checkPhoneAutofill = useCallback(() => {
    if (currentStep !== 7) return;
    
    const inputElement = phoneInputRef.current || document.querySelector('#phoneNumber') as HTMLInputElement;
    if (!inputElement) return;
    
    const domValue = inputElement.value || '';
    const currentStateValue = formData.phoneNumber || '';
    
    if (domValue === lastDetectedPhoneRef.current) {
      return;
    }
    
    if (domValue.trim().length > 0) {
      const digitCount = domValue.replace(/\D/g, '').length;
      
      if (digitCount >= 6) {
        const stateDigits = currentStateValue.replace(/\D/g, '');
        const domDigits = domValue.replace(/\D/g, '');
        
        if (stateDigits !== domDigits || !currentStateValue || currentStateValue.trim().length === 0) {
          lastDetectedPhoneRef.current = domValue;
          
          if (!phoneAutofillDetectedRef.current && (!currentStateValue || currentStateValue.trim().length === 0)) {
            phoneAutofillDetectedRef.current = true;
            trackAutofillUsage(['phoneNumber']);
          }
          
          const digits = domValue.replace(/\D/g, '');
          const limitedDigits = digits.slice(0, 10);
          const formatted = limitedDigits.length > 0 ? '+39' + limitedDigits : '';
          
          setFormData(prev => {
            if (prev.phoneNumber !== formatted) {
              return { ...prev, phoneNumber: formatted };
            }
            return prev;
          });
        }
      }
    }
  }, [currentStep, formData.phoneNumber, phoneInputRef, setFormData]);

  // Auto-fill form fields using browser autofill
  useEffect(() => {
    const autoFillForm = () => {
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
            const phoneValue = htmlInput.value.trim();
            if (phoneValue) {
              const formatted = formatPhoneNumber(phoneValue);
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
      
      if (autofillFields.length > 0) {
        trackAutofillUsage(autofillFields);
      }
    };

    // Run autofill detection at intervals
    const timers = [
      setTimeout(() => { autoFillForm(); checkPhoneAutofill(); }, 100),
      setTimeout(() => { autoFillForm(); checkPhoneAutofill(); }, 300),
      setTimeout(() => { autoFillForm(); checkPhoneAutofill(); }, 500),
      setTimeout(() => { autoFillForm(); checkPhoneAutofill(); }, 1000),
      setTimeout(() => checkPhoneAutofill(), 1500),
      setTimeout(() => checkPhoneAutofill(), 2000),
    ];
    
    // Reset detection refs when step changes
    if (currentStep !== 7) {
      lastDetectedPhoneRef.current = '';
      phoneAutofillDetectedRef.current = false;
    }
    
    // Periodic check for phone autofill when on step 7
    let autofillCheckInterval: NodeJS.Timeout | null = null;
    if (currentStep === 7 && (!formData.phoneNumber || formData.phoneNumber.trim().length === 0)) {
      let checkCount = 0;
      const maxChecks = 30;
      autofillCheckInterval = setInterval(() => {
        checkPhoneAutofill();
        checkCount++;
        if (checkCount >= maxChecks || (formData.phoneNumber && formData.phoneNumber.trim().length > 0)) {
          if (autofillCheckInterval) {
            clearInterval(autofillCheckInterval);
          }
        }
      }, 100);
    }
    
    // Event listeners
    const handlePhoneInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target && (target.id === 'phoneNumber' || target.name === 'phoneNumber')) {
        setTimeout(() => checkPhoneAutofill(), 50);
      }
    };
    
    const handleChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target && (target.id === 'phoneNumber' || target.name === 'phoneNumber')) {
        checkPhoneAutofill();
      } else {
        autoFillForm();
      }
    };
    
    const handleAnimationStart = (e: AnimationEvent) => {
      if (e.animationName === 'onAutoFillStart' || (e.target as HTMLElement)?.matches('input:-webkit-autofill')) {
        autoFillForm();
        if ((e.target as HTMLElement)?.id === 'phoneNumber') {
          setTimeout(checkPhoneAutofill, 100);
        }
      }
    };
    
    document.addEventListener('input', handlePhoneInput, true);
    document.addEventListener('change', handleChange, true);
    document.addEventListener('animationstart', handleAnimationStart as EventListener, true);
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
      if (autofillCheckInterval) {
        clearInterval(autofillCheckInterval);
      }
      document.removeEventListener('input', handlePhoneInput, true);
      document.removeEventListener('change', handleChange, true);
      document.removeEventListener('animationstart', handleAnimationStart as EventListener, true);
    };
  }, [currentStep, checkPhoneAutofill, formData.phoneNumber, setFormData]);
};

