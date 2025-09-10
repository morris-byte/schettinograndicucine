import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, ChevronLeft, Ruler, ShoppingCart, Wrench, FlaskConical, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import schettinoLogo from '@/assets/schettino-logo.png';
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
    email: ''
  });
  const [showThankYou, setShowThankYou] = useState(false);
  const [thankYouType, setThankYouType] = useState<'success' | 'not-restaurateur' | 'not-campania'>('success');
  const handleAnswer = (answer: boolean, field: 'isRestaurateur' | 'isInCampania') => {
    setFormData(prev => ({
      ...prev,
      [field]: answer
    }));
    if (!answer) {
      setThankYouType(field === 'isRestaurateur' ? 'not-restaurateur' : 'not-campania');
      setShowThankYou(true);
      return;
    }
    setCurrentStep(prev => prev + 1);
  };
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Validate phone number format on change
    if (field === 'phoneNumber' && value.length > 3) {
      const phoneRegex = /^(\+39\s?)?((3\d{2}|0\d{1,4})\s?\d{1,8})$/;
      if (!phoneRegex.test(value)) {
        toast({
          description: "Formato telefono non valido. Usa +39 123 456 7890 o 123 456 7890",
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
    // Validate phone number format
    const phoneRegex = /^(\+39\s?)?((3\d{2}|0\d{1,4})\s?\d{1,8})$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      return; // Invalid phone number
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return; // Invalid email
    }
    
    try {
      // Make webhook URL
      const makeWebhookUrl = "https://hook.eu2.make.com/jog4x5m8xjw5gdpemv4ocgc4wwlx2dcm";
      
      const payload = {
        ...formData,
        timestamp: new Date().toISOString(),
        source: 'Schettino Form'
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

      // Send notification email to sales team
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer re_cFhg7cjK_PASgmJRmzsPCYkaBHXjAWvhN',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'noreply@schettinograndi.com',
            to: ['jagermorris@gmail.com'],
            subject: 'Nuovo Lead - Schettino Grandi Cucine',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2c5530; border-bottom: 2px solid #2c5530; padding-bottom: 10px;">
                  Nuovo Lead Ricevuto
                </h2>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #2c5530; margin-top: 0;">Informazioni Contatto</h3>
                  <p><strong>Nome:</strong> ${formData.firstName} ${formData.lastName}</p>
                  <p><strong>Email:</strong> ${formData.email}</p>
                  <p><strong>Telefono:</strong> ${formData.phoneNumber}</p>
                </div>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="color: #2c5530; margin-top: 0;">Dettagli Ristorante</h3>
                  <p><strong>Nome Ristorante:</strong> ${formData.restaurantName}</p>
                  <p><strong>Zona:</strong> ${formData.restaurantZone}</p>
                  <p><strong>Tipo Attrezzatura:</strong> ${formData.equipmentType}</p>
                  <p><strong>È Ristoratore:</strong> ${formData.isRestaurateur ? 'Sì' : 'No'}</p>
                  <p><strong>In Campania:</strong> ${formData.isInCampania ? 'Sì' : 'No'}</p>
                </div>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
                  <p>Email inviata automaticamente dal sistema di lead generation di Schettino Grandi Cucine</p>
                  <p>Data: ${new Date().toLocaleString('it-IT')}</p>
                </div>
              </div>
            `,
          }),
        });
        
        console.log('Email response status:', emailResponse.status);
      } catch (emailError) {
        console.error('Errore invio email:', emailError);
        // Non blocchiamo il processo principale se l'email fallisce
      }
      
      if (response.ok) {
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
        return "Grazie per aver compilato il modulo! Verrai contattato il prima possibile dal nostro team";
    }
  };
  if (showThankYou) {
    return <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-form-background shadow-[var(--shadow-form)]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary mb-2">
              Schettino Grandi Cucine
            </CardTitle>
            <p className="text-sm text-text-secondary mb-4">
              Dal 1963 progettiamo, vendiamo e assistiamo attrezzature professionali per cucine
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                <ChevronRight className="w-8 h-8 text-primary-foreground" />
              </div>
              <p className="text-text-primary leading-relaxed">
                {getThankYouMessage()}
              </p>
            </div>
            {thankYouType === 'success' && <Button onClick={() => window.location.reload()} className="bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)]">
                Invia un altro modulo
              </Button>}
          </CardContent>
        </Card>
      </div>;
  }
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                Sei un ristoratore?
              </h2>
              <p className="text-text-secondary text-sm">
                Prima domanda per comprendere le tue necessità
              </p>
            </div>
            <div className="space-y-3">
              <Button onClick={() => handleAnswer(true, 'isRestaurateur')} className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)]" size="lg">
                Sì, sono un ristoratore
              </Button>
              <Button onClick={() => handleAnswer(false, 'isRestaurateur')} variant="outline" className="w-full border-border hover:bg-secondary text-white transition-[var(--transition-smooth)]" size="lg">
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
              <Button onClick={() => handleAnswer(true, 'isInCampania')} className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)]" size="lg">
                Sì, in Campania
              </Button>
              <Button onClick={() => handleAnswer(false, 'isInCampania')} variant="outline" className="w-full border-border hover:bg-secondary text-white transition-[var(--transition-smooth)]" size="lg">
                No, fuori Campania
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
                Provincia o città principale in Campania
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
                placeholder="Il tuo numero di telefono (es. +39 123 456 7890)" 
                value={formData.phoneNumber} 
                onChange={e => handleInputChange('phoneNumber', e.target.value)} 
                className="bg-input border-border text-text-primary placeholder:text-text-secondary focus:ring-primary" 
                type="tel" 
              />
              <Button onClick={handleNext} disabled={!formData.phoneNumber.trim() || !/^(\+39\s?)?((3\d{2}|0\d{1,4})\s?\d{1,8})$/.test(formData.phoneNumber)} className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] disabled:opacity-50" size="lg">
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
                Ultimo passaggio per completare la richiesta
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
              <Button onClick={handleSubmit} disabled={!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)} className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] disabled:opacity-50" size="lg">
                Invia Richiesta
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
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
  return <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">

        {/* Form Card */}
        <Card className="w-full max-w-md mx-auto bg-form-background shadow-[var(--shadow-form)] mb-8">
          <CardHeader className="text-center bg-[#1A1A1A] rounded-t-lg mb-6 p-6">
            <img src={schettinoLogo} alt="Schettino Grandi Cucine" className="h-12 mx-auto" />
            <CardTitle className="text-xl font-bold text-white mb-2">
              Richiedi un Preventivo
            </CardTitle>
            <p className="text-sm text-text-secondary mb-4">
              Attrezzature professionali per ristoranti in Campania
            </p>
            <div className="flex justify-center space-x-2 mt-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(step => <div key={step} className={`w-2 h-2 rounded-full transition-[var(--transition-smooth)] ${step <= currentStep ? 'bg-white' : 'bg-gray-600'}`} />)}
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