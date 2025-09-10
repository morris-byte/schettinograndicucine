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
export const RESEND_CONFIG = {
  apiKey: import.meta.env.VITE_RESEND_API_KEY || 're_XbAxcgBZ_v8dtrGz2R2XBmGxBnrbBsMkv',
  fromEmail: 'Grandi Cucine <onboarding@resend.dev>', // Usa il dominio verificato di Resend
};
