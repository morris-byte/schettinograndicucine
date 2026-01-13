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
  if (!apiKey) {
    throw new Error('VITE_RESEND_API_KEY environment variable is required');
  }
  return apiKey;
};

export const RESEND_CONFIG = {
  apiKey: getResendApiKey(),
  fromEmail: 'Grandi Cucine <onboarding@resend.dev>', // Usa il dominio verificato di Resend
};
