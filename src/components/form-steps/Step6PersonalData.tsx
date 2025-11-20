import { Input } from '@/components/ui/input';
import { FormData } from '@/types/form';
import { FormStepButtons } from './FormStepButtons';

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
            id="firstName"
            name="firstName"
            placeholder="Nome"
            value={formData.firstName}
            onChange={e => onInputChange('firstName', e.target.value)}
            onFocus={() => onFieldFocus('firstName')}
            onBlur={() => onFieldBlur('firstName')}
            className="bg-input border-border text-text-primary placeholder:text-text-secondary focus:ring-primary"
            autoComplete="given-name"
          />
          <Input
            id="lastName"
            name="lastName"
            placeholder="Cognome"
            value={formData.lastName}
            onChange={e => onInputChange('lastName', e.target.value)}
            onFocus={() => onFieldFocus('lastName')}
            onBlur={() => onFieldBlur('lastName')}
            className="bg-input border-border text-text-primary placeholder:text-text-secondary focus:ring-primary"
            autoComplete="family-name"
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

