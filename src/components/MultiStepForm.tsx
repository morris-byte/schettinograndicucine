import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, ChevronLeft, Ruler, ShoppingCart, Wrench, FlaskConical, Star, Mail, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import schettinoLogo from '@/assets/schettino-logo.png';
import confetti from 'canvas-confetti';
import { trackFormSubmission, trackFormStep, trackButtonClick, initGA4 } from '@/config/analytics';
// import { sendEmailToCommerciali, sendTestEmail } from '../services/sendgridService';
interface FormData {
  isRestaurateur: boolean | null;
  isInCampania: boolean | null;
  restaurantZone: string;
  restaurantName: string;
  equipmentType: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  wantsCatalog: boolean | null;
  privacyConsent: boolean;
}
const MultiStepForm = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    isRestaurateur: null,
    isInCampania: null,
    restaurantZone: '',
    restaurantName: '',
    equipmentType: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    wantsCatalog: null,
    privacyConsent: false
  });
  const [showThankYou, setShowThankYou] = useState(false);
  const [thankYouType, setThankYouType] = useState<'success' | 'not-restaurateur' | 'not-campania'>('success');

  // Initialize GA4 on component mount
  useEffect(() => {
    initGA4();
  }, []);
  const handleAnswer = (answer: boolean, field: 'isRestaurateur' | 'isInCampania') => {
    setFormData(prev => ({
      ...prev,
      [field]: answer
    }));
    
    // Track form step
    const stepName = field === 'isRestaurateur' ? 'Restaurateur Question' : 'Campania Question';
    trackFormStep(currentStep, stepName);
    
    if (!answer) {
      setThankYouType(field === 'isRestaurateur' ? 'not-restaurateur' : 'not-campania');
      setShowThankYou(true);
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleCatalogAnswer = (answer: boolean) => {
    setFormData(prev => ({
      ...prev,
      wantsCatalog: answer
    }));
    
    // Track form step
    trackFormStep(currentStep, 'Catalog Question');
    
    setCurrentStep(prev => prev + 1);
  };
  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    let processedValue = value;
    
    // Handle boolean values directly
    if (typeof value === 'boolean') {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
      return;
    }
    
    // Process phone number input
    if (field === 'phoneNumber') {
      // Remove all non-numeric characters except +
      const cleaned = value.replace(/[^\d+]/g, '');
      
      // If it doesn't start with +39, add it
      if (!cleaned.startsWith('+39')) {
        // If it starts with +, replace with +39
        if (cleaned.startsWith('+')) {
          processedValue = '+39' + cleaned.substring(1);
        } else {
          // If it's just numbers, add +39
          processedValue = '+39' + cleaned;
        }
      } else {
        processedValue = cleaned;
      }
      
      // Limit to 13 characters total (+39 + 10 digits)
      if (processedValue.length > 13) {
        processedValue = processedValue.substring(0, 13);
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }));
    
    // Validate phone number format on change
    if (field === 'phoneNumber' && processedValue.length >= 6) {
      const isValidPhone = (raw: string) => {
        const compact = raw.replace(/\s+/g, '');
        // Must start with +39 and have exactly 10 more digits
        const phoneRegex = /^\+39\d{10}$/;
        return phoneRegex.test(compact);
      };
      if (!isValidPhone(processedValue)) {
        toast({
          description: "Il numero deve avere esattamente 10 cifre dopo +39",
          duration: 2000,
        });
      }
    }
    
    // Validate email format on change
    if (field === 'email' && value.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        toast({
          description: "Formato email non valido. Usa nome@esempio.it",
          duration: 2000,
        });
      }
    }
  };
  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };
  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    // Validate phone number format (must be +39 followed by exactly 10 digits)
    const isValidPhone = (raw: string) => {
      const compact = raw.replace(/\s+/g, '');
      const phoneRegex = /^\+39\d{10}$/;
      return phoneRegex.test(compact);
    };
    if (!isValidPhone(formData.phoneNumber)) {
      toast({
        description: "Il numero deve avere esattamente 10 cifre dopo +39",
        duration: 3000,
      });
      return; // Invalid phone number
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return; // Invalid email
    }
    
    // Validate privacy consent
    if (!formData.privacyConsent) {
      toast({
        description: "È necessario accettare la privacy policy per procedere",
        duration: 3000,
      });
      return; // Privacy consent required
    }
    
    try {
      // Make webhook URL
      const makeWebhookUrl = "https://hook.eu2.make.com/dbeari9w8c7p9ft1dhizsuvrd2a98gqi";
      
      const payload = {
        ...formData,
        timestamp: new Date().toISOString(),
        source: 'Schettino Form',
        // Campi espliciti per Google Sheets
        catalog_request: formData.wantsCatalog ? 'Sì' : 'No',
        phone_formatted: formData.phoneNumber,
        full_name: `${formData.firstName} ${formData.lastName}`.trim(),
        privacy_consent: formData.privacyConsent ? 'Sì' : 'No'
      };
      
      console.log('Invio dati a Make:', payload);
      console.log('URL webhook:', makeWebhookUrl);
      
      const response = await fetch(makeWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (response.ok) {
        console.log('Dati inviati a Make con successo.');
        
        // Send email notification to commerciali
        try {
          const emailResponse = await fetch('https://laxbglhrrcbrxpnpvcob.supabase.co/functions/v1/send-test-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
          
          if (emailResponse.ok) {
            console.log('Email di notifica inviata con successo');
          } else {
            console.log('Errore invio email notifica, ma form completato comunque');
          }
        } catch (emailError) {
          console.log('Errore invio email notifica:', emailError);
        }
        
        
        // Fire confetti animation
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        
        
        // Track form submission
        trackFormSubmission(formData);
        
        toast({
          title: "Preventivo inviato!",
          description: "Ti contatteremo presto per discutere le tue esigenze.",
        });
        setThankYouType('success');
        setShowThankYou(true);
      } else {
        throw new Error('Errore nell\'invio');
      }
      
    } catch (error) {
      console.error('Errore invio form:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova o contattaci direttamente.",
        variant: "destructive",
      });
    }
  };
  const getThankYouMessage = () => {
    switch (thankYouType) {
      case 'not-restaurateur':
        return "Schettino Grandi Cucine si occupa della distribuzione di attrezzatura da cucina professionale per ristoranti e hotel. Tuttavia, non ci interfacciamo con i privati e per questo motivo non possiamo aiutarti con la tua richiesta. Grazie per averci scritto!";
      case 'not-campania':
        return "Schettino Grandi Cucine si occupa della distribuzione di attrezzatura da cucina professionale per ristoranti e hotel in Campania e non opera al di fuori della regione. Grazie per averci scritto!";
      default:
        return "Grazie per aver compilato il modulo!";
    }
  };
  if (showThankYou) {
    return <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black shadow-[var(--shadow-form)]">
          <CardHeader className="text-center">
            <div className="mb-1">
              <img 
                src={schettinoLogo} 
                alt="Schettino Grandi Cucine" 
                className="h-16 mx-auto mb-1"
              />
            </div>
          </CardHeader>
          <CardContent className="text-center flex flex-col justify-center min-h-[300px]">
            <div className="space-y-4">
              <div className="space-y-3">
                <p className="text-white leading-relaxed font-bold text-lg">
                  {getThankYouMessage()}
                </p>
                <p className="text-white text-sm">
                  Verrai contattato il prima possibile dal nostro team
                </p>
              </div>
              {thankYouType === 'success' && (
                <div className="space-y-4 pt-4">
                  <p className="text-white text-sm">
                    Nel frattempo puoi scoprire di più su di noi
                  </p>
                  <Button 
                    onClick={() => window.open('https://www.schettinograndicucine.com/', '_blank')}
                    className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)]"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visita il nostro sito
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>;
  }
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-text-primary mb-1 leading-tight">
                Sei un ristoratore?
              </h2>
              <p className="text-text-secondary text-sm -mt-1">
                Prima domanda per comprendere le tue necessità
              </p>
            </div>
            <div className="space-y-3">
              <Button onClick={() => {
                trackButtonClick('Sì, sono un ristoratore', 'Step 1');
                handleAnswer(true, 'isRestaurateur');
              }} className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)]" size="lg">
                Sì, sono un ristoratore
              </Button>
              <Button onClick={() => {
                trackButtonClick('No, non sono un ristoratore', 'Step 1');
                handleAnswer(false, 'isRestaurateur');
              }} variant="outline" className="w-full border-border text-white" size="lg">
                No, non sono un ristoratore
              </Button>
            </div>
          </div>;
      case 2:
        return <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                Il tuo locale si trova in Campania?
              </h2>
              <p className="text-text-secondary text-sm">
                Operiamo esclusivamente nella regione Campania
              </p>
            </div>
            <div className="space-y-3">
              <Button onClick={() => {
                trackButtonClick('Sì, è in Campania', 'Step 2');
                handleAnswer(true, 'isInCampania');
              }} className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)]" size="lg">
                Sì, è in Campania
              </Button>
              <Button onClick={() => {
                trackButtonClick('No, si trova fuori dalla Campania', 'Step 2');
                handleAnswer(false, 'isInCampania');
              }} variant="outline" className="w-full border-border text-white" size="lg">
                No, si trova fuori dalla Campania
              </Button>
            </div>
            <Button onClick={handleBack} variant="ghost" className="w-full text-text-secondary hover:text-text-primary transition-[var(--transition-smooth)]">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Torna indietro
            </Button>
          </div>;
      case 3:
        return <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                In che zona si trova il tuo ristorante?
              </h2>
              <p className="text-text-secondary text-sm">
                Indica la città o paese in cui operi
              </p>
            </div>
            <div className="space-y-4">
              <Input placeholder="Es. Napoli, Salerno, Caserta..." value={formData.restaurantZone} onChange={e => handleInputChange('restaurantZone', e.target.value)} className="bg-input border-border text-text-primary placeholder:text-text-secondary focus:ring-primary" />
              <Button onClick={handleNext} disabled={!formData.restaurantZone.trim()} className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] disabled:opacity-50" size="lg">
                Continua
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <Button onClick={handleBack} variant="ghost" className="w-full text-text-secondary hover:text-text-primary transition-[var(--transition-smooth)]">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Torna indietro
            </Button>
          </div>;
      case 4:
        return <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                Qual è il nome del tuo ristorante?
              </h2>
              <p className="text-text-secondary text-sm">
                Aiutaci a conoscerti meglio
              </p>
            </div>
            <div className="space-y-4">
              <Input placeholder="Nome del ristorante" value={formData.restaurantName} onChange={e => handleInputChange('restaurantName', e.target.value)} className="bg-input border-border text-text-primary placeholder:text-text-secondary focus:ring-primary" />
              <Button onClick={handleNext} disabled={!formData.restaurantName.trim()} className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] disabled:opacity-50" size="lg">
                Continua
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <Button onClick={handleBack} variant="ghost" className="w-full text-text-secondary hover:text-text-primary transition-[var(--transition-smooth)]">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Torna indietro
            </Button>
          </div>;
      case 5:
        return <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                Di che tipo di attrezzatura hai bisogno?
              </h2>
              <p className="text-text-secondary text-sm">
                Descrivi brevemente le tue necessità
              </p>
            </div>
            <div className="space-y-4">
              <Textarea placeholder="Descrivi il tipo di attrezzatura di cui hai bisogno..." value={formData.equipmentType} onChange={e => handleInputChange('equipmentType', e.target.value)} className="bg-input border-border text-text-primary placeholder:text-text-secondary focus:ring-primary min-h-[100px]" rows={4} />
              <Button onClick={handleNext} disabled={!formData.equipmentType.trim()} className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] disabled:opacity-50" size="lg">
                Continua
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <Button onClick={handleBack} variant="ghost" className="w-full text-text-secondary hover:text-text-primary transition-[var(--transition-smooth)]">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Torna indietro
            </Button>
          </div>;
      case 6:
        return <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                Dati Personali
              </h2>
              <p className="text-text-secondary text-sm">
                Come possiamo chiamarti?
              </p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Nome" value={formData.firstName} onChange={e => handleInputChange('firstName', e.target.value)} className="bg-input border-border text-text-primary placeholder:text-text-secondary focus:ring-primary" />
                <Input placeholder="Cognome" value={formData.lastName} onChange={e => handleInputChange('lastName', e.target.value)} className="bg-input border-border text-text-primary placeholder:text-text-secondary focus:ring-primary" />
              </div>
              <Button onClick={handleNext} disabled={!formData.firstName.trim() || !formData.lastName.trim()} className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] disabled:opacity-50" size="lg">
                Continua
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <Button onClick={handleBack} variant="ghost" className="w-full text-text-secondary hover:text-text-primary transition-[var(--transition-smooth)]">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Torna indietro
            </Button>
          </div>;
      case 7:
        return <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                Numero di Telefono
              </h2>
              <p className="text-text-secondary text-sm">
                Per essere contattato rapidamente
              </p>
            </div>
            <div className="space-y-4">
              <Input 
                placeholder="Il tuo numero di telefono" 
                value={formData.phoneNumber} 
                onChange={e => handleInputChange('phoneNumber', e.target.value)} 
                className="bg-input border-border text-text-primary placeholder:text-text-secondary focus:ring-primary" 
                type="tel" 
              />
              <Button onClick={handleNext} disabled={!formData.phoneNumber.trim() || !(() => { const compact = formData.phoneNumber.replace(/\s+/g, ''); return /^\+39\d{10}$/.test(compact); })()} className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] disabled:opacity-50" size="lg">
                Continua
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <Button onClick={handleBack} variant="ghost" className="w-full text-text-secondary hover:text-text-primary transition-[var(--transition-smooth)]">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Torna indietro
            </Button>
          </div>;
      case 8:
        return <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                Email
              </h2>
              <p className="text-text-secondary text-sm">
                Per ricevere la risposta alla tua richiesta
              </p>
            </div>
            <div className="space-y-4">
              <Input 
                placeholder="La tua email (es. nome@esempio.it)" 
                value={formData.email} 
                onChange={e => handleInputChange('email', e.target.value)} 
                className="bg-input border-border text-text-primary placeholder:text-text-secondary focus:ring-primary" 
                type="email" 
              />
              <Button onClick={handleNext} disabled={!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)} className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] disabled:opacity-50" size="lg">
                Continua
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <Button onClick={handleBack} variant="ghost" className="w-full text-text-secondary hover:text-text-primary transition-[var(--transition-smooth)]">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Torna indietro
            </Button>
          </div>;
      case 9:
        return <div className="space-y-6">
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
                onClick={() => handleCatalogAnswer(true)} 
                className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)]" 
                size="lg"
              >
                Sì, voglio ricevere il catalogo
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                onClick={() => handleCatalogAnswer(false)} 
                variant="outline" 
                className="w-full border-border text-text-primary" 
                size="lg"
              >
                No, non mi interessa
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <Button onClick={handleBack} variant="ghost" className="w-full text-text-secondary hover:text-text-primary transition-[var(--transition-smooth)]">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Torna indietro
            </Button>
          </div>;
      case 10:
        return <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                Conferma Invio
              </h2>
              <p className="text-text-secondary text-sm">
                Ultimo passaggio per completare la richiesta
              </p>
            </div>
            <div className="space-y-4">
              <Button 
                onClick={handleSubmit} 
                disabled={!formData.privacyConsent}
                className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] disabled:opacity-50" 
                size="lg"
              >
                Invia Richiesta
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
              
              <div className="flex items-start space-x-3 p-4 bg-input rounded-lg border border-border">
                <input
                  type="checkbox"
                  id="privacyConsent"
                  checked={formData.privacyConsent}
                  onChange={(e) => handleInputChange('privacyConsent', e.target.checked)}
                  className="mt-1 w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary"
                />
                <label htmlFor="privacyConsent" className="text-sm text-text-primary leading-relaxed">
                  Accetto il trattamento dei dati personali secondo la{' '}
                  <a 
                    href="https://schettinograndicucine-ten.vercel.app/privacy.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary hover:underline underline-offset-2 transition-colors"
                  >
                    Privacy Policy
                  </a>
                  . I dati saranno utilizzati esclusivamente per rispondere alla tua richiesta e fornire i servizi richiesti.
                </label>
              </div>
            </div>
            <Button onClick={handleBack} variant="ghost" className="w-full text-text-secondary hover:text-text-primary transition-[var(--transition-smooth)]">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Torna indietro
            </Button>
          </div>;
      default:
        return null;
    }
  };
  return <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      
      
      <div className="w-full max-w-4xl">

        {/* Form Card */}
        <Card className="w-full max-w-md mx-auto bg-form-background shadow-[var(--shadow-form)] mb-8">
          <CardHeader className="text-center bg-[#1A1A1A] rounded-t-lg mb-6 p-6">
            <img src={schettinoLogo} alt="Schettino Grandi Cucine" className="h-12 mx-auto mb-2" />
            <div className="mb-4">
              <CardTitle className="text-xl font-bold text-white mb-0 leading-tight">
                Richiedi più informazioni
              </CardTitle>
              <p className="text-sm text-text-secondary mt-0">
                Per avere un preventivo personalizzato
              </p>
            </div>
            <div className="flex justify-center space-x-2 mt-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(step => <div key={step} className={`w-2 h-2 rounded-full transition-[var(--transition-smooth)] ${step <= currentStep ? 'bg-white' : 'bg-gray-600'}`} />)}
            </div>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>

        {/* Reviews Marquee */}
        <div className="relative overflow-hidden bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-6 max-w-md mx-auto">
          <div className="flex animate-[scroll-left_20s_linear_infinite] space-x-8">
            <div className="flex items-center space-x-2 text-xs whitespace-nowrap">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-white font-medium">"Attrezzature di qualità, assistenza impeccabile" - Marco R.</span>
            </div>
            <div className="flex items-center space-x-2 text-xs whitespace-nowrap">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-white font-medium">"Dal 1980 ci affidiamo a Schettino per la nostra pizzeria" - Giuseppe M.</span>
            </div>
            <div className="flex items-center space-x-2 text-xs whitespace-nowrap">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-white font-medium">"Professionalità e competenza, consigliatissimi!" - Anna P.</span>
            </div>
            <div className="flex items-center space-x-2 text-xs whitespace-nowrap">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-white font-medium">"Installazione perfetta, zero problemi da 5 anni" - Roberto C.</span>
            </div>
          </div>
        </div>

        {/* Company Info Section */}
        <div className="text-center">
          <p className="text-white mb-4 text-lg font-semibold">
            Dal 1963 progettiamo, vendiamo e assistiamo attrezzature professionali per cucine
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-card border-2 border-primary rounded-lg mx-auto mb-2 flex items-center justify-center">
                <Ruler className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-white font-medium">Progettazione</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-card border-2 border-primary rounded-lg mx-auto mb-2 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-white font-medium">Vendita</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-card border-2 border-primary rounded-lg mx-auto mb-2 flex items-center justify-center">
                <Wrench className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-white font-medium">Assistenza</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-card border-2 border-primary rounded-lg mx-auto mb-2 flex items-center justify-center">
                <FlaskConical className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-white font-medium">SchettinoLab</p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default MultiStepForm;