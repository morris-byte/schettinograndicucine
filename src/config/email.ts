// Configurazione email commerciali
export const COMMERCIALI_EMAILS = [
  'commerciale@schettinograndicucine.it',
  'segreteria@schettinograndicucine.it',
  'andrea@schettinograndicucine.it',
  'jagermorris@gmail.com',
  'vincenzopetronebiz@gmail.com',
  'vincenzopetrone3000@gmail.com',
];

// Configurazione Resend
const getResendApiKey = () => {
  const apiKey = import.meta.env.VITE_RESEND_API_KEY;
  // Fallback temporaneo per permettere deploy - TODO: configurare su Vercel
  if (!apiKey) {
    console.warn('⚠️ VITE_RESEND_API_KEY non configurata, usando fallback. Configura su Vercel!');
    return 're_XbAxcgBZ_v8dtrGz2R2XBmGxBnrbBsMkv'; // Fallback temporaneo
  }
  return apiKey;
};

export const RESEND_CONFIG = {
  apiKey: getResendApiKey(),
  fromEmail: 'Grandi Cucine <onboarding@resend.dev>', // Usa il dominio verificato di Resend
};
