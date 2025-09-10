import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, ChevronLeft, Ruler, ShoppingCart, Wrench, FlaskConical, Star } from 'lucide-react';
import schettinoLogo from '@/assets/schettino-logo.png';
interface FormData {
  isRestaurateur: boolean | null;
  isInCampania: boolean | null;
  restaurantName: string;
  equipmentType: string;
  fullName: string;
  phoneNumber: string;
  email: string;
}
const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    isRestaurateur: null,
    isInCampania: null,
    restaurantName: '',
    equipmentType: '',
    fullName: '',
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
  };
  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };
  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };
  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    setThankYouType('success');
    setShowThankYou(true);
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
              <Button onClick={() => handleAnswer(false, 'isRestaurateur')} variant="outline" className="w-full border-border hover:bg-secondary text-text-primary transition-[var(--transition-smooth)]" size="lg">
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
              <Button onClick={() => handleAnswer(false, 'isInCampania')} variant="outline" className="w-full border-border hover:bg-secondary text-text-primary transition-[var(--transition-smooth)]" size="lg">
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
      case 4:
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
      case 5:
        return <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-text-primary mb-2">
                Nome e Cognome
              </h2>
              <p className="text-text-secondary text-sm">
                Come possiamo chiamarti?
              </p>
            </div>
            <div className="space-y-4">
              <Input placeholder="Il tuo nome e cognome" value={formData.fullName} onChange={e => handleInputChange('fullName', e.target.value)} className="bg-input border-border text-text-primary placeholder:text-text-secondary focus:ring-primary" />
              <Button onClick={handleNext} disabled={!formData.fullName.trim()} className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] disabled:opacity-50" size="lg">
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
                Numero di Telefono
              </h2>
              <p className="text-text-secondary text-sm">
                Per essere contattato rapidamente
              </p>
            </div>
            <div className="space-y-4">
              <Input placeholder="Il tuo numero di telefono" value={formData.phoneNumber} onChange={e => handleInputChange('phoneNumber', e.target.value)} className="bg-input border-border text-text-primary placeholder:text-text-secondary focus:ring-primary" type="tel" />
              <Button onClick={handleNext} disabled={!formData.phoneNumber.trim()} className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] disabled:opacity-50" size="lg">
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
                Email
              </h2>
              <p className="text-text-secondary text-sm">
                Ultimo passaggio per completare la richiesta
              </p>
            </div>
            <div className="space-y-4">
              <Input placeholder="La tua email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="bg-input border-border text-text-primary placeholder:text-text-secondary focus:ring-primary" type="email" />
              <Button onClick={handleSubmit} disabled={!formData.email.trim()} className="w-full bg-primary hover:bg-brand-green-hover text-primary-foreground shadow-[var(--shadow-button)] transition-[var(--transition-smooth)] disabled:opacity-50" size="lg">
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
          <CardHeader className="text-center bg-[#1A1A1A] rounded-t-lg -m-6 mb-6 p-6">
            <img src={schettinoLogo} alt="Schettino Grandi Cucine" className="h-12 mx-auto" />
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