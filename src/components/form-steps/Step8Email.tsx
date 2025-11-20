import { Input } from '@/components/ui/input';
import { FormData } from '@/types/form';
import { FormStepButtons } from './FormStepButtons';
import { validateEmail } from '@/utils/formValidation';

interface Step8EmailProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
  onFieldFocus: (field: string) => void;
  onFieldBlur: (field: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step8Email = ({
  formData,
  onInputChange,
  onFieldFocus,
  onFieldBlur,
  onNext,
  onBack,
}: Step8EmailProps) => {
  const isEmailValid = validateEmail(formData.email);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Email
        </h2>
        <p className="text-text-secondary text-sm">
          Per ricevere la risposta alla tua richiesta
        </p>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="space-y-4">
        <Input
          id="email"
          name="email"
          placeholder="La tua email (es. nome@esempio.it)"
          value={formData.email}
          onChange={e => onInputChange('email', e.target.value)}
          onFocus={() => onFieldFocus('email')}
          onBlur={() => onFieldBlur('email')}
          className="bg-input border-border text-text-primary placeholder:text-text-secondary focus:ring-primary"
          type="email"
          autoComplete="email"
        />
        <FormStepButtons
          onNext={onNext}
          onBack={onBack}
          canGoNext={isEmailValid && !!formData.email.trim()}
        />
      </form>
    </div>
  );
};

