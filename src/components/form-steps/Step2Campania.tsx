import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { trackButtonClick } from '@/config/analytics';

interface Step2CampaniaProps {
  onAnswer: (answer: boolean) => void;
  onBack: () => void;
}

export const Step2Campania = ({ onAnswer, onBack }: Step2CampaniaProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Il tuo locale si trova in Campania?
        </h2>
        <p className="text-text-secondary text-sm">
          Operiamo esclusivamente nella regione Campania
        </p>
      </div>
      <div className="space-y-3">
        <Button
          onClick={() => {
            trackButtonClick('Sì, è in Campania', 'Step 2');
            onAnswer(true);
          }}
          className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)]"
          size="lg"
        >
          Sì, è in Campania
        </Button>
        <Button
          onClick={() => {
            trackButtonClick('No, si trova fuori dalla Campania', 'Step 2');
            onAnswer(false);
          }}
          variant="outline"
          className="w-full border-border text-white"
          size="lg"
        >
          No, si trova fuori dalla Campania
        </Button>
      </div>
      <Button onClick={onBack} variant="ghost" className="w-full text-text-secondary hover:text-text-primary transition-[var(--transition-smooth)]">
        <ChevronLeft className="w-4 h-4 mr-2" />
        Torna indietro
      </Button>
    </div>
  );
};

