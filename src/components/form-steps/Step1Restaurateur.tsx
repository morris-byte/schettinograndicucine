import { Button } from '@/components/ui/button';
import { trackButtonClick } from '@/config/analytics';

interface Step1RestaurateurProps {
  onAnswer: (answer: boolean) => void;
}

export const Step1Restaurateur = ({ onAnswer }: Step1RestaurateurProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-text-primary mb-1 leading-tight">
          Sei un ristoratore?
        </h2>
        <p className="text-text-secondary text-sm -mt-1">
          Prima domanda per comprendere le tue necessità
        </p>
      </div>
      <div className="space-y-3">
        <Button
          onClick={() => {
            trackButtonClick('Sì, sono un ristoratore', 'Step 1');
            onAnswer(true);
          }}
          className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)]"
          size="lg"
        >
          Sì, sono un ristoratore
        </Button>
        <Button
          onClick={() => {
            trackButtonClick('No, non sono un ristoratore', 'Step 1');
            onAnswer(false);
          }}
          variant="outline"
          className="w-full border-border text-white"
          size="lg"
        >
          No, non sono un ristoratore
        </Button>
      </div>
    </div>
  );
};

