import { Resend } from 'resend';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export const sendTestEmail = async () => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Schettino Grandi Cucine <onboarding@resend.dev>',
      to: ['vincenzopetronebiz@gmail.com'],
      subject: 'Email di prova',
      text: 'Email di prova',
    });

    if (error) {
      console.error('Errore invio email:', error);
      throw error;
    }

    console.log('Email inviata con successo:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Errore nel servizio email:', error);
    throw error;
  }
};
