import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ExternalLink, Star } from 'lucide-react';
import { trackOutboundLink } from '@/config/analytics';
import { ThankYouType } from '@/types/form';
import schettinoLogo from '@/assets/schettino-logo.png';

interface ThankYouPageProps {
  thankYouType: ThankYouType;
}

const getThankYouMessage = (type: ThankYouType): string => {
  switch (type) {
    case 'not-restaurateur':
      return "Ci occupiamo di attrezzature professionali per ristoranti e hotel. Non operiamo con privati. Grazie per averci scritto!";
    case 'not-campania':
      return "Operiamo esclusivamente in Campania. Grazie per averci scritto!";
    default:
      return "Grazie per aver compilato il modulo!";
  }
};

export const ThankYouPage = ({ thankYouType }: ThankYouPageProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black shadow-[var(--shadow-form)] mx-auto">
        <CardHeader className="text-center px-4 py-6">
          <div className="mb-1">
            <img
              src={schettinoLogo}
              alt="Schettino Grandi Cucine"
              className="h-16 mx-auto mb-1"
            />
          </div>
        </CardHeader>
        <CardContent className="text-center flex flex-col justify-between min-h-[280px] py-4 px-4">
          <div className="space-y-4">
            <div className="space-y-3">
              <h2 className="text-white leading-relaxed font-bold text-sm md:text-base text-center break-words-safe text-pretty">
                {getThankYouMessage(thankYouType)}
              </h2>
              {thankYouType === 'success' && (
                <p className="text-white text-sm text-center">
                  Nel frattempo puoi scoprire di più su di noi
                </p>
              )}
            </div>
          </div>

          {thankYouType === 'success' && (
            <div>
              <Button
                onClick={() => {
                  trackOutboundLink('https://www.schettinograndicucine.com/', 'Visita il nostro sito', 'thank-you-page');
                  window.open('https://www.schettinograndicucine.com/', '_blank');
                }}
                className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)]"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visita il nostro sito
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

