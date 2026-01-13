import { Input } from '@/components/ui/input';
import { FormData } from '@/types/form';
import { FormStepButtons } from './FormStepButtons';
import { useEffect, useRef } from 'react';

interface Step6PersonalDataProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
  onFieldFocus: (field: string) => void;
  onFieldBlur: (field: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step6PersonalData = ({
  formData,
  onInputChange,
  onFieldFocus,
  onFieldBlur,
  onNext,
  onBack,
}: Step6PersonalDataProps) => {
  const firstNameInputRef = useRef<HTMLInputElement>(null);
  const lastNameInputRef = useRef<HTMLInputElement>(null);
  
  // Controllo continuo per intercettare autofill del browser
  useEffect(() => {
    const checkAndCleanInputs = () => {
      const isEmail = (value: string): boolean => {
        if (!value) return false;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || value.includes('@');
      };
      
      // Controlla firstName
      if (firstNameInputRef.current) {
        const domValue = firstNameInputRef.current.value || '';
        if (isEmail(domValue)) {
          // Pulisci il DOM
          firstNameInputRef.current.value = '';
          // Pulisci lo stato
          onInputChange('firstName', '');
        } else if (domValue !== formData.firstName && domValue.trim() !== '') {
          // Se il valore DOM è diverso dallo stato e non è email, aggiorna lo stato
          if (!isEmail(domValue)) {
            onInputChange('firstName', domValue);
          }
        }
      }
      
      // Controlla lastName
      if (lastNameInputRef.current) {
        const domValue = lastNameInputRef.current.value || '';
        if (isEmail(domValue)) {
          // Pulisci il DOM
          lastNameInputRef.current.value = '';
          // Pulisci lo stato
          onInputChange('lastName', '');
        } else if (domValue !== formData.lastName && domValue.trim() !== '') {
          // Se il valore DOM è diverso dallo stato e non è email, aggiorna lo stato
          if (!isEmail(domValue)) {
            onInputChange('lastName', domValue);
          }
        }
      }
    };
    
    // Controlla ogni 100ms per intercettare autofill
    const interval = setInterval(checkAndCleanInputs, 100);
    
    // Controlla anche su eventi
    const handleInput = () => {
      setTimeout(checkAndCleanInputs, 50);
    };
    
    document.addEventListener('input', handleInput, true);
    document.addEventListener('change', handleInput, true);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('input', handleInput, true);
      document.removeEventListener('change', handleInput, true);
    };
  }, [formData.firstName, formData.lastName, onInputChange]);
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Dati Personali
        </h2>
        <p className="text-text-secondary text-sm">
          Come possiamo chiamarti?
        </p>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            ref={firstNameInputRef}
            id="firstName"
            name="firstName"
            placeholder="Nome"
            value={formData.firstName}
            onChange={e => {
              const value = e.target.value;
              // Previeni inserimento di email nel campo nome - controlla anche se contiene @
              const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.includes('@');
              if (!isEmail) {
                onInputChange('firstName', value);
              } else {
                // Se è un'email, pulisci immediatamente
                e.target.value = '';
                onInputChange('firstName', '');
              }
            }}
            onFocus={() => onFieldFocus('firstName')}
            onBlur={(e) => {
              const value = e.target.value;
              // Controllo finale: se contiene @ o è un'email, pulisci il campo
              const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.includes('@');
              if (isEmail) {
                onInputChange('firstName', '');
                e.target.value = '';
              }
              onFieldBlur('firstName');
            }}
            className="bg-input border-border text-text-primary placeholder:text-text-secondary focus:ring-primary"
            autoComplete="off"
            type="text"
            data-form-type="name"
            data-lpignore="true"
            data-1p-ignore="true"
          />
          <Input
            ref={lastNameInputRef}
            id="lastName"
            name="lastName"
            placeholder="Cognome"
            value={formData.lastName}
            onChange={e => {
              const value = e.target.value;
              // Previeni inserimento di email nel campo cognome - controlla anche se contiene @
              const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.includes('@');
              if (!isEmail) {
                onInputChange('lastName', value);
              } else {
                // Se è un'email, pulisci immediatamente
                e.target.value = '';
                onInputChange('lastName', '');
              }
            }}
            onFocus={() => onFieldFocus('lastName')}
            onBlur={(e) => {
              const value = e.target.value;
              // Controllo finale: se contiene @ o è un'email, pulisci il campo
              const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.includes('@');
              if (isEmail) {
                onInputChange('lastName', '');
                e.target.value = '';
              }
              onFieldBlur('lastName');
            }}
            className="bg-input border-border text-text-primary placeholder:text-text-secondary focus:ring-primary"
            autoComplete="off"
            type="text"
            data-form-type="name"
            data-lpignore="true"
            data-1p-ignore="true"
          />
        </div>
        <FormStepButtons
          onNext={onNext}
          onBack={onBack}
          canGoNext={!!formData.firstName.trim() && !!formData.lastName.trim()}
        />
      </form>
    </div>
  );
};

