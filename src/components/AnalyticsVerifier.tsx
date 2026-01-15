import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertCircle, Loader2, Copy, ExternalLink } from 'lucide-react';
import {
  GA4_MEASUREMENT_ID,
  GOOGLE_ADS_ID,
  GTM_CONTAINER_ID,
  initGTM,
  initGA4,
  initFacebookPixel,
  trackFormSubmission,
  trackButtonClick,
  pushToDataLayer,
} from '@/config/analytics';
import { logger } from '@/utils/logger';

interface VerificationStatus {
  name: string;
  status: 'loading' | 'success' | 'error' | 'warning';
  message: string;
  details?: string;
  testAction?: () => void;
}

const AnalyticsVerifier = () => {
  const [verifications, setVerifications] = useState<VerificationStatus[]>([]);
  const [dataLayerContent, setDataLayerContent] = useState<any[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const checkGTM = (): VerificationStatus => {
    if (typeof window === 'undefined') {
      return {
        name: 'Google Tag Manager',
        status: 'error',
        message: 'Window object non disponibile',
      };
    }

    const hasDataLayer = Array.isArray(window.dataLayer);
    const hasGTMScript = document.querySelector('script[src*="googletagmanager.com/gtm.js"]');
    const containerId = GTM_CONTAINER_ID;

    if (!hasDataLayer) {
      return {
        name: 'Google Tag Manager',
        status: 'error',
        message: 'dataLayer non trovato',
        details: 'Il dataLayer non è stato inizializzato',
      };
    }

    if (!hasGTMScript) {
      return {
        name: 'Google Tag Manager',
        status: 'warning',
        message: 'Script GTM non trovato nel DOM',
        details: 'Verifica che lo script sia presente in index.html',
      };
    }

    if (!containerId) {
      return {
        name: 'Google Tag Manager',
        status: 'warning',
        message: 'Container ID non configurato',
        details: 'Configura VITE_GTM_CONTAINER_ID o usa il fallback',
      };
    }

    return {
      name: 'Google Tag Manager',
      status: 'success',
      message: `Container ID: ${containerId}`,
      details: `dataLayer contiene ${window.dataLayer.length} elementi`,
      testAction: () => {
        pushToDataLayer('test_event', {
          test_name: 'Analytics Verifier Test',
          timestamp: new Date().toISOString(),
        });
        logger.log('✅ Test event inviato a GTM dataLayer');
        refreshDataLayer();
      },
    };
  };

  const checkGA4 = (): VerificationStatus => {
    if (typeof window === 'undefined') {
      return {
        name: 'Google Analytics 4',
        status: 'error',
        message: 'Window object non disponibile',
      };
    }

    const hasGtag = typeof window.gtag === 'function';
    const hasGAScript = document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
    const measurementId = GA4_MEASUREMENT_ID;

    if (!hasGtag) {
      return {
        name: 'Google Analytics 4',
        status: 'error',
        message: 'gtag function non trovata',
        details: 'La funzione gtag non è disponibile',
      };
    }

    if (!hasGAScript) {
      return {
        name: 'Google Analytics 4',
        status: 'warning',
        message: 'Script GA4 non trovato nel DOM',
        details: 'Verifica che lo script sia presente in index.html',
      };
    }

    if (!measurementId) {
      return {
        name: 'Google Analytics 4',
        status: 'error',
        message: 'Measurement ID non configurato',
      };
    }

    return {
      name: 'Google Analytics 4',
      status: 'success',
      message: `Measurement ID: ${measurementId}`,
      details: 'gtag function disponibile e funzionante',
      testAction: () => {
        if (window.gtag) {
          window.gtag('event', 'test_event', {
            event_category: 'Analytics Verifier',
            event_label: 'Test Event',
            value: 1,
          });
          logger.log('✅ Test event inviato a GA4');
        }
      },
    };
  };

  const checkGoogleAds = (): VerificationStatus => {
    if (typeof window === 'undefined') {
      return {
        name: 'Google Ads',
        status: 'error',
        message: 'Window object non disponibile',
      };
    }

    const hasGtag = typeof window.gtag === 'function';
    const conversionId = GOOGLE_ADS_ID;

    if (!hasGtag) {
      return {
        name: 'Google Ads',
        status: 'error',
        message: 'gtag function non trovata',
        details: 'Google Ads richiede gtag per funzionare',
      };
    }

    if (!conversionId) {
      return {
        name: 'Google Ads',
        status: 'error',
        message: 'Conversion ID non configurato',
      };
    }

    return {
      name: 'Google Ads',
      status: 'success',
      message: `Conversion ID: ${conversionId}`,
      details: 'Configurato tramite gtag',
      testAction: () => {
        if (window.gtag) {
          window.gtag('event', 'conversion', {
            send_to: conversionId,
            value: 1,
            currency: 'EUR',
          });
          logger.log('✅ Test conversion inviata a Google Ads');
        }
      },
    };
  };

  const checkFacebookPixel = (): VerificationStatus => {
    if (typeof window === 'undefined') {
      return {
        name: 'Facebook Pixel',
        status: 'error',
        message: 'Window object non disponibile',
      };
    }

    const hasFbq = typeof window.fbq === 'function';
    const hasFBScript = document.querySelector('script[src*="facebook.net"]') || 
                       document.querySelector('script:not([src])')?.textContent?.includes('fbq');

    if (!hasFbq) {
      return {
        name: 'Facebook Pixel',
        status: 'error',
        message: 'fbq function non trovata',
        details: 'Il Facebook Pixel non è stato caricato',
      };
    }

    if (!hasFBScript) {
      return {
        name: 'Facebook Pixel',
        status: 'warning',
        message: 'Script Facebook non trovato nel DOM',
        details: 'Verifica che lo script sia presente in index.html',
      };
    }

    return {
      name: 'Facebook Pixel',
      status: 'success',
      message: 'Pixel ID: 1159186469692428',
      details: 'fbq function disponibile e funzionante',
      testAction: () => {
        if (window.fbq) {
          window.fbq('track', 'PageView');
          window.fbq('trackCustom', 'TestEvent', {
            test_name: 'Analytics Verifier Test',
            timestamp: new Date().toISOString(),
          });
          logger.log('✅ Test event inviato a Facebook Pixel');
        }
      },
    };
  };

  const checkDataLayer = (): VerificationStatus => {
    if (typeof window === 'undefined') {
      return {
        name: 'DataLayer',
        status: 'error',
        message: 'Window object non disponibile',
      };
    }

    const hasDataLayer = Array.isArray(window.dataLayer);
    const dataLayerSize = hasDataLayer ? window.dataLayer.length : 0;

    if (!hasDataLayer) {
      return {
        name: 'DataLayer',
        status: 'error',
        message: 'dataLayer non trovato',
      };
    }

    return {
      name: 'DataLayer',
      status: 'success',
      message: `${dataLayerSize} elementi nel dataLayer`,
      details: 'Il dataLayer è attivo e contiene eventi',
    };
  };

  const verifyAll = () => {
    setVerifications([
      { name: 'Verifica in corso...', status: 'loading', message: '' },
    ]);

    setTimeout(() => {
      const results = [
        checkGTM(),
        checkGA4(),
        checkGoogleAds(),
        checkFacebookPixel(),
        checkDataLayer(),
      ];
      setVerifications(results);
      refreshDataLayer();
    }, 500);
  };

  const refreshDataLayer = () => {
    if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) {
      setDataLayerContent([...window.dataLayer]);
    }
  };

  const copyDataLayer = () => {
    const content = JSON.stringify(window.dataLayer, null, 2);
    navigator.clipboard.writeText(content);
    logger.log('✅ DataLayer copiato negli appunti');
  };

  const getStatusIcon = (status: VerificationStatus['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'loading':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: VerificationStatus['status']) => {
    const variants = {
      success: 'default',
      error: 'destructive',
      warning: 'secondary',
      loading: 'outline',
    } as const;

    const labels = {
      success: 'OK',
      error: 'Errore',
      warning: 'Avviso',
      loading: 'Caricamento...',
    };

    return (
      <Badge variant={variants[status] || 'outline'}>
        {labels[status]}
      </Badge>
    );
  };

  useEffect(() => {
    verifyAll();
    refreshDataLayer();
    
    // Refresh dataLayer ogni 2 secondi quando è espanso
    const interval = setInterval(() => {
      if (isExpanded) {
        refreshDataLayer();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isExpanded]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>🔍 Verifica Analytics & Tag Manager</CardTitle>
            <CardDescription>
              Verifica lo stato di GTM, GA4, Google Ads e Facebook Pixel
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={verifyAll} size="sm" variant="outline">
              🔄 Ricarica
            </Button>
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              size="sm"
              variant="outline"
            >
              {isExpanded ? '📉 Riduci' : '📊 Espandi'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {verifications.map((verification, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(verification.status)}
                  <h3 className="font-semibold">{verification.name}</h3>
                </div>
                {getStatusBadge(verification.status)}
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {verification.message}
              </p>
              {verification.details && (
                <p className="text-xs text-muted-foreground mb-3">
                  {verification.details}
                </p>
              )}
              {verification.testAction && (
                <Button
                  onClick={verification.testAction}
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  🧪 Test Event
                </Button>
              )}
            </Card>
          ))}
        </div>

        {/* DataLayer Viewer */}
        {isExpanded && (
          <Card className="mt-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">DataLayer Content</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={refreshDataLayer} size="sm" variant="outline">
                    🔄 Aggiorna
                  </Button>
                  <Button onClick={copyDataLayer} size="sm" variant="outline">
                    <Copy className="h-4 w-4 mr-1" />
                    Copia
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-96">
                <pre className="text-xs font-mono">
                  {JSON.stringify(dataLayerContent, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Links */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">🔗 Link Utili</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://tagmanager.google.com/', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                GTM
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://analytics.google.com/', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                GA4
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://business.facebook.com/events_manager2/list/pixel/1159186469692428', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Facebook
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const testData = {
                    restaurantName: 'Test Restaurant',
                    isRestaurateur: true,
                    isInCampania: true,
                    restaurantZone: 'Napoli',
                    equipmentType: 'Frigoriferi',
                  };
                  trackFormSubmission(testData);
                  trackButtonClick('Test Button', 'Analytics Verifier');
                  logger.log('✅ Test completo: form submission e button click inviati');
                }}
              >
                🧪 Test Completo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-4 bg-blue-50 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="text-lg">📋 Come Verificare</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>
              <strong>1. Google Tag Manager:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>Apri GTM Preview Mode e inserisci l'URL del sito</li>
                <li>Verifica che gli eventi appaiano in tempo reale</li>
                <li>Controlla che i tag siano triggerati correttamente</li>
              </ul>
            </div>
            <div>
              <strong>2. Google Analytics 4:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>Vai su GA4 → Reports → Realtime</li>
                <li>Esegui un test event e verifica che appaia</li>
                <li>Controlla DebugView per vedere gli eventi in dettaglio</li>
              </ul>
            </div>
            <div>
              <strong>3. Console Browser:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>Apri DevTools (F12) → Console</li>
                <li>Digita: <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">window.dataLayer</code></li>
                <li>Verifica che contenga gli eventi inviati</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default AnalyticsVerifier;
