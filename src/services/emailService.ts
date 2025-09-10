import { Resend } from 'resend';

// Inizializza Resend con la chiave API
const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export const sendTestEmail = async () => {
  try {
    const result = await resend.emails.send({
      from: 'Schettino Grandi Cucine <onboarding@resend.dev>',
      to: 'vincenzopetronebiz@gmail.com',
      subject: 'Email di prova',
      text: 'Email di prova',
    });

    return result;
  } catch (error) {
    console.error('Errore invio email:', error);
    throw error;
  }
};