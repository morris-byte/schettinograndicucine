import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface Step9CatalogProps {
  onAnswer: (answer: boolean) => void;
  onBack: () => void;
}

export const Step9Catalog = ({ onAnswer, onBack }: Step9CatalogProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Catalogo Esclusivo
        </h2>
        <p className="text-text-secondary text-sm mb-6">
          Vuoi ricevere in omaggio il nostro catalogo esclusivo? Potrai vedere con i tuoi occhi tutte le attrezzature che abbiamo a disposizione, in questo modo durante la consulenza sapremo perfettamente come aiutarti!
        </p>
      </div>
      <div className="space-y-4">
        <Button
          onClick={() => onAnswer(true)}
          className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)]"
          size="lg"
        >
          Sì, voglio ricevere il catalogo
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
        <Button
          onClick={() => onAnswer(false)}
          variant="outline"
          className="w-full border-border text-text-primary"
          size="lg"
        >
          No, non mi interessa
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
      <Button onClick={onBack} variant="ghost" className="w-full text-text-secondary hover:text-text-primary transition-[var(--transition-smooth)]">
        <ChevronLeft className="w-4 h-4 mr-2" />
        Torna indietro
      </Button>
    </div>
  );
};

