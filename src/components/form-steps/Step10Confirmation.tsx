import { Button } from '@/components/ui/button';
import { Check, ChevronLeft } from 'lucide-react';
import { FormData } from '@/types/form';
import { FormStepButtons } from './FormStepButtons';

interface Step10ConfirmationProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: boolean) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

export const Step10Confirmation = ({
  formData,
  onInputChange,
  onSubmit,
  onBack,
  isSubmitting,
  isSubmitted,
}: Step10ConfirmationProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Conferma Invio
        </h2>
        <p className="text-text-secondary text-sm">
          Ultimo passaggio per completare la richiesta
        </p>
      </div>
      <form 
        onSubmit={(e) => { 
          e.preventDefault(); 
          e.stopPropagation();
          onSubmit(); 
        }} 
        className="space-y-4"
        noValidate
      >
        <div className="flex items-start space-x-3 p-4 bg-input rounded-lg border border-border">
          <button
            type="button"
            onClick={() => onInputChange('privacyConsent', !formData.privacyConsent)}
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
            onClick={() => onInputChange('privacyConsent', !formData.privacyConsent)}
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
          {!isSubmitting && !isSubmitted && <ChevronLeft className="w-4 h-4 ml-2 rotate-180" />}
        </Button>
      </form>
      <Button onClick={onBack} variant="ghost" className="w-full text-text-secondary hover:text-text-primary transition-[var(--transition-smooth)]">
        <ChevronLeft className="w-4 h-4 mr-2" />
        Torna indietro
      </Button>
    </div>
  );
};

