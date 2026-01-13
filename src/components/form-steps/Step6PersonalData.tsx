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
  
  // Controllo continuo AGRESSIVO per intercettare autofill del browser
  // Questo monitora continuamente il DOM e pulisce immediatamente se trova email
  useEffect(() => {
    const isEmail = (value: string): boolean => {
      if (!value || typeof value !== 'string') return false;
      const trimmed = value.trim();
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) || trimmed.includes('@');
    };
    
    const checkAndCleanInputs = () => {
      // IMPORTANTE: Questo controllo serve SOLO per pulire email dal DOM
      // NON aggiorna lo stato quando l'utente sta digitando - quello lo fa onChange
      // Se aggiornassimo lo stato qui, potremmo sovrascrivere l'input manuale dell'utente
      
      // Controlla firstName - SOLO pulizia, NO sincronizzazione stato
      if (firstNameInputRef.current) {
        const domValue = firstNameInputRef.current.value || '';
        if (isEmail(domValue)) {
          // Email trovata! Pulisci IMMEDIATAMENTE DOM e stato
          console.warn('🚫 Email rilevata in firstName DOM, pulizia immediata');
          firstNameInputRef.current.value = '';
          onInputChange('firstName', '');
          // Forza il focus per mostrare all'utente che il campo è stato pulito
          firstNameInputRef.current.focus();
        }
        // NON aggiornare lo stato se il DOM è diverso - l'utente potrebbe stare ancora digitando
        // L'onChange gestisce l'aggiornamento dello stato quando l'utente digita
      }
      
      // Controlla lastName - SOLO pulizia, NO sincronizzazione stato
      if (lastNameInputRef.current) {
        const domValue = lastNameInputRef.current.value || '';
        if (isEmail(domValue)) {
          // Email trovata! Pulisci IMMEDIATAMENTE DOM e stato
          console.warn('🚫 Email rilevata in lastName DOM, pulizia immediata');
          lastNameInputRef.current.value = '';
          onInputChange('lastName', '');
          // Forza il focus per mostrare all'utente che il campo è stato pulito
          lastNameInputRef.current.focus();
        }
        // NON aggiornare lo stato se il DOM è diverso - l'utente potrebbe stare ancora digitando
        // L'onChange gestisce l'aggiornamento dello stato quando l'utente digita
      }
    };
    
    // Controlla ogni 50ms (più frequente) per intercettare autofill aggressivo
    const interval = setInterval(checkAndCleanInputs, 50);
    
    // Controlla anche su TUTTI gli eventi possibili
    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target && (target.id === 'firstName' || target.id === 'lastName')) {
        setTimeout(checkAndCleanInputs, 10); // Controllo immediato
      }
    };
    
    const handleChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target && (target.id === 'firstName' || target.id === 'lastName')) {
        checkAndCleanInputs(); // Controllo sincrono
      }
    };
    
    const handleFocus = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target && (target.id === 'firstName' || target.id === 'lastName')) {
        setTimeout(checkAndCleanInputs, 10);
      }
    };
    
    const handleBlur = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target && (target.id === 'firstName' || target.id === 'lastName')) {
        checkAndCleanInputs(); // Controllo finale quando perde il focus
      }
    };
    
    // Aggiungi listener per TUTTI gli eventi possibili
    document.addEventListener('input', handleInput, true);
    document.addEventListener('change', handleChange, true);
    document.addEventListener('focus', handleFocus, true);
    document.addEventListener('blur', handleBlur, true);
    document.addEventListener('keyup', handleInput, true);
    document.addEventListener('paste', handleInput, true);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('input', handleInput, true);
      document.removeEventListener('change', handleChange, true);
      document.removeEventListener('focus', handleFocus, true);
      document.removeEventListener('blur', handleBlur, true);
      document.removeEventListener('keyup', handleInput, true);
      document.removeEventListener('paste', handleInput, true);
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
      <form 
        onSubmit={(e) => { 
          e.preventDefault(); 
          e.stopPropagation();
          onNext(); 
        }} 
        className="space-y-4"
        noValidate
      >
        <div className="grid grid-cols-2 gap-3">
          <Input
            ref={firstNameInputRef}
            id="firstName"
            name="user_name_field_a"
            placeholder="Nome"
            value={formData.firstName}
            onChange={e => {
              const value = e.target.value;
              // Previeni inserimento di email nel campo nome - controlla anche se contiene @
              const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.includes('@');
              if (!isEmail) {
                console.log('✅ onChange firstName - valore valido:', value);
                onInputChange('firstName', value);
              } else {
                // Se è un'email, pulisci immediatamente
                console.error('❌ onChange firstName - EMAIL RILEVATA, pulizia:', value);
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
            name="user_name_field_b"
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

