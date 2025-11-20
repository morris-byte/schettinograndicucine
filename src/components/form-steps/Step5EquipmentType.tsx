import { Textarea } from '@/components/ui/textarea';
import { FormData } from '@/types/form';
import { FormStepButtons } from './FormStepButtons';

interface Step5EquipmentTypeProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step5EquipmentType = ({
  formData,
  onInputChange,
  onNext,
  onBack,
}: Step5EquipmentTypeProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Di che tipo di attrezzatura hai bisogno?
        </h2>
        <p className="text-text-secondary text-sm">
          Descrivi brevemente le tue necessità
        </p>
      </div>
      <div className="space-y-4">
        <Textarea
          placeholder="Descrivi il tipo di attrezzatura di cui hai bisogno..."
          value={formData.equipmentType}
          onChange={e => onInputChange('equipmentType', e.target.value)}
          className="bg-input border-border text-text-primary placeholder:text-text-secondary focus:ring-primary min-h-[100px]"
          rows={4}
        />
        <FormStepButtons
          onNext={onNext}
          onBack={onBack}
          canGoNext={!!formData.equipmentType.trim()}
        />
      </div>
    </div>
  );
};

