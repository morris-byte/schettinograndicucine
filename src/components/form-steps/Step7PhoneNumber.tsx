import { Input } from '@/components/ui/input';
import { FormData } from '@/types/form';
import { FormStepButtons } from './FormStepButtons';
import { validatePhoneNumber, formatPhoneNumber } from '@/utils/formValidation';
import { useToast } from '@/hooks/use-toast';

interface Step7PhoneNumberProps {
  formData: FormData;
  phoneInputRef: React.RefObject<HTMLInputElement>;
  onInputChange: (field: keyof FormData, value: string) => void;
  onFieldFocus: (field: string) => void;
  onFieldBlur: (field: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step7PhoneNumber = ({
  formData,
  phoneInputRef,
  onInputChange,
  onFieldFocus,
  onFieldBlur,
  onNext,
  onBack,
}: Step7PhoneNumberProps) => {
  const { toast } = useToast();

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onFieldBlur('phoneNumber');
    const inputValue = e.target.value || '';
    const digits = inputValue.replace(/\D/g, '').slice(0, 10);
    
    // Format correctly using the utility function
    const formatted = formatPhoneNumber(digits);
    
    // Only update if different from current value
    if (formatted !== formData.phoneNumber) {
      onInputChange('phoneNumber', digits); // Pass digits only, formatPhoneNumber will handle +39
    }
    
    // Validate and show error if invalid
    const phone = formatted.trim();
    if (phone && phone.startsWith('+39')) {
      const phoneDigits = phone.replace(/\D/g, '').slice(2);
      if (phoneDigits.length > 0 && phoneDigits.length !== 10) {
        toast({
          description: "Il numero deve avere esattamente 10 cifre",
          duration: 3000,
        });
      }
    }
  };

  const handleFocus = () => {
    onFieldFocus('phoneNumber');
  };

  const isPhoneValid = validatePhoneNumber(formData.phoneNumber);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Numero di Telefono
        </h2>
        <p className="text-text-secondary text-sm">
          Per essere contattato rapidamente
        </p>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="space-y-4">
        <div className="relative flex items-center">
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
              const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
              onInputChange('phoneNumber', digits);
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === '+' || e.key === '-' || e.key === ' ' ||
                  (e.key.length === 1 && /[^0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key))) {
                e.preventDefault();
              }
            }}
            onPaste={(e) => {
              e.preventDefault();
              const pastedText = e.clipboardData.getData('text');
              const digits = pastedText.replace(/\D/g, '').slice(0, 10);
              if (digits.length > 0) {
                onInputChange('phoneNumber', digits);
              }
            }}
            className="bg-input border-border text-text-primary placeholder:text-text-secondary focus:ring-primary pl-12"
            type="tel"
            autoComplete="tel"
            inputMode="numeric"
            maxLength={10}
          />
        </div>
        <FormStepButtons
          onNext={onNext}
          onBack={onBack}
          canGoNext={isPhoneValid}
        />
      </form>
    </div>
  );
};

