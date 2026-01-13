import { useEffect } from 'react';
import MultiStepForm from '@/components/MultiStepForm';
import DebugPanel from '@/components/DebugPanel';
import { trackPageView, trackUTMParameters } from '@/config/analytics';

const Index = () => {
  useEffect(() => {
    // Track page view when component mounts
    trackPageView('Home - Richiesta Preventivo', {
      page_category: 'landing'
    });
    
    // Track UTM parameters on page load
    trackUTMParameters();
  }, []);

  return (
    <>
      <MultiStepForm />
      <DebugPanel />
    </>
  );
};

export default Index;
