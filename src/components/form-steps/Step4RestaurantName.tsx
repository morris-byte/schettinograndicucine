import { Input } from '@/components/ui/input';
import { FormData } from '@/types/form';
import { FormStepButtons } from './FormStepButtons';

interface Step4RestaurantNameProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step4RestaurantName = ({
  formData,
  onInputChange,
  onNext,
  onBack,
}: Step4RestaurantNameProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Qual è il nome del tuo ristorante?
        </h2>
        <p className="text-text-secondary text-sm">
          Aiutaci a conoscerti meglio
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
          id="restaurantName"
          name="restaurantName"
          placeholder="Nome del ristorante"
          value={formData.restaurantName}
          onChange={e => onInputChange('restaurantName', e.target.value)}
          className="bg-input border-border text-text-primary placeholder:text-text-secondary focus:ring-primary"
          autoComplete="organization"
        />
        <FormStepButtons
          onNext={onNext}
          onBack={onBack}
          canGoNext={!!formData.restaurantName.trim()}
        />
      </form>
    </div>
  );
};

