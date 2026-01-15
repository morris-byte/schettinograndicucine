import AnalyticsVerifier from '@/components/AnalyticsVerifier';

const AnalyticsTest = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Test Analytics & Tag Manager</h1>
        <p className="text-muted-foreground mb-8">
          Usa questo strumento per verificare che tutti i tag (GTM, GA4, Google Ads, Facebook Pixel) 
          siano configurati correttamente e funzionanti.
        </p>
        <AnalyticsVerifier />
      </div>
    </div>
  );
};

export default AnalyticsTest;
