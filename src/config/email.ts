// Configurazione email commerciali
export const COMMERCIALI_EMAILS = [
  'jagermorris@gmail.com',
  'vincenzopetronebiz@gmail.com',
];

// Configurazione Resend
export const RESEND_CONFIG = {
  apiKey: import.meta.env.VITE_RESEND_API_KEY || 're_UJKSyude_Hvdbh5NTAoyGEHNCRNqiPgiy',
  fromEmail: 'noreply@resend.dev', // Usa il dominio di Resend
};
