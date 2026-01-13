import { Input } from '@/components/ui/input';
import { FormData } from '@/types/form';
import { FormStepButtons } from './FormStepButtons';

interface Step3RestaurantZoneProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
  onFieldFocus: (field: string) => void;
  onFieldBlur: (field: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step3RestaurantZone = ({
  formData,
  onInputChange,
  onFieldFocus,
  onFieldBlur,
  onNext,
  onBack,
}: Step3RestaurantZoneProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          In che zona si trova il tuo ristorante?
        </h2>
        <p className="text-text-secondary text-sm">
          Indica la città o paese in cui operi
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
        <Input
          id="restaurantZone"
          name="restaurantZone"
          placeholder="Es. Napoli, Salerno, Caserta..."
          value={formData.restaurantZone}
          onChange={e => onInputChange('restaurantZone', e.target.value)}
          onFocus={() => onFieldFocus('restaurantZone')}
          onBlur={() => onFieldBlur('restaurantZone')}
          className="bg-input border-border text-text-primary placeholder:text-text-secondary focus:ring-primary"
          autoComplete="address-level2"
        />
        <FormStepButtons
          onNext={onNext}
          onBack={onBack}
          canGoNext={!!formData.restaurantZone.trim()}
        />
      </form>
    </div>
  );
};

