import { useEffect, useRef } from 'react';
import {
  initGA4,
  initFacebookPixel,
  trackUTMParameters,
  trackDeviceInfo,
  trackScrollDepth,
  trackTimeOnPage,
  trackFormAbandon,
} from '@/config/analytics';
import { ThankYouType } from '@/types/form';

interface UseFormTrackingProps {
  currentStep: number;
  showThankYou: boolean;
  getStepName: (step: number) => string;
}

export const useFormTracking = ({
  currentStep,
  showThankYou,
  getStepName,
}: UseFormTrackingProps) => {
  const formStartTimeRef = useRef<number>(Date.now());
  const stepStartTimeRef = useRef<number>(Date.now());
  const hasTrackedAbandonRef = useRef<boolean>(false);
  const pageStartTimeRef = useRef<number>(Date.now());
  const scrollDepthsTrackedRef = useRef<Set<number>>(new Set());

  // Initialize tracking on mount
  useEffect(() => {
    initGA4();
    initFacebookPixel();
    
    formStartTimeRef.current = Date.now();
    stepStartTimeRef.current = Date.now();
    pageStartTimeRef.current = Date.now();
    
    trackUTMParameters();
    trackDeviceInfo();
    
    // Scroll tracking
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / documentHeight) * 100);
      
      [25, 50, 75, 90].forEach(depth => {
        if (scrollPercent >= depth && !scrollDepthsTrackedRef.current.has(depth)) {
          trackScrollDepth(depth, 'Home');
          scrollDepthsTrackedRef.current.add(depth);
        }
      });
    };
    
    // Time on page tracking - ogni 60 secondi invece di 30 per ridurre overhead
    const timeInterval = setInterval(() => {
      const timeOnPage = (Date.now() - pageStartTimeRef.current) / 1000;
      trackTimeOnPage(timeOnPage, 'Home');
    }, 60000); // Ridotto da 30s a 60s
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timeInterval);
    };
  }, []);

  // Track form abandonment
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!showThankYou && currentStep > 1 && !hasTrackedAbandonRef.current) {
        const timeSpent = (Date.now() - formStartTimeRef.current) / 1000;
        const stepName = getStepName(currentStep);
        trackFormAbandon(currentStep, stepName, timeSpent);
        hasTrackedAbandonRef.current = true;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentStep, showThankYou, getStepName]);

  // Reset step start time when step changes
  useEffect(() => {
    stepStartTimeRef.current = Date.now();
  }, [currentStep]);

  return {
    formStartTimeRef,
    stepStartTimeRef,
    hasTrackedAbandonRef,
  };
};

