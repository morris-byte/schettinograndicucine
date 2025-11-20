import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FormStepButtonsProps {
  onNext: () => void;
  onBack: () => void;
  canGoNext: boolean;
  showBack?: boolean;
  nextLabel?: string;
  isSubmitting?: boolean;
}

export const FormStepButtons = ({
  onNext,
  onBack,
  canGoNext,
  showBack = true,
  nextLabel = 'Continua',
  isSubmitting = false,
}: FormStepButtonsProps) => {
  return (
    <>
      <Button
        type="submit"
        onClick={onNext}
        disabled={!canGoNext || isSubmitting}
        className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] disabled:opacity-50"
        size="lg"
      >
        {isSubmitting ? 'Invio in corso...' : nextLabel}
        {!isSubmitting && <ChevronRight className="w-4 h-4 ml-2" />}
      </Button>
      {showBack && (
        <Button
          onClick={onBack}
          variant="ghost"
          className="w-full text-text-secondary hover:text-text-primary transition-[var(--transition-smooth)]"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Torna indietro
        </Button>
      )}
    </>
  );
};

