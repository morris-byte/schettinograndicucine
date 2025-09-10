import { Resend } from 'resend';
import { COMMERCIALI_EMAILS, RESEND_CONFIG } from '@/config/email';

const resend = new Resend(RESEND_CONFIG.apiKey);

export interface LeadData {
  isRestaurateur: boolean | null;
  isInCampania: boolean | null;
  restaurantZone: string;
  restaurantName: string;
  equipmentType: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  timestamp: string;
  source: string;
}

export const sendEmailToCommerciali = async (leadData: LeadData): Promise<boolean> => {
  try {
    // Verifica che ci siano email dei commerciali configurate
    if (COMMERCIALI_EMAILS.length === 0) {
      console.warn('Nessuna email commerciale configurata');
      return false;
    }

    // Verifica che la API key sia configurata
    if (!RESEND_CONFIG.apiKey) {
      console.error('Resend API key non configurata');
      return false;
    }

    const emailContent = generateEmailContent(leadData);

    const result = await resend.emails.send({
      from: RESEND_CONFIG.fromEmail,
      to: COMMERCIALI_EMAILS,
      subject: `Nuovo Lead - ${leadData.restaurantName || 'Cliente Potenziale'}`,
      html: emailContent,
    });

    console.log('Email inviata ai commerciali:', result);
    return true;
  } catch (error) {
    console.error('Errore nell\'invio email ai commerciali:', error);
    return false;
  }
};

const generateEmailContent = (leadData: LeadData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nuovo Lead - Schettino Grandi Cucine</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .lead-info { background-color: #ffffff; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #495057; }
        .value { color: #212529; }
        .highlight { background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🎯 Nuovo Lead Ricevuto</h2>
          <p>Un nuovo potenziale cliente ha compilato il form di contatto.</p>
        </div>
        
        <div class="lead-info">
          <h3>Informazioni Cliente</h3>
          
          <div class="field">
            <span class="label">Nome:</span>
            <span class="value">${leadData.firstName} ${leadData.lastName}</span>
          </div>
          
          <div class="field">
            <span class="label">Email:</span>
            <span class="value">${leadData.email}</span>
          </div>
          
          <div class="field">
            <span class="label">Telefono:</span>
            <span class="value">${leadData.phoneNumber}</span>
          </div>
          
          <div class="highlight">
            <h4>Informazioni Ristorante</h4>
            <div class="field">
              <span class="label">Nome Ristorante:</span>
              <span class="value">${leadData.restaurantName || 'Non specificato'}</span>
            </div>
            
            <div class="field">
              <span class="label">Zona:</span>
              <span class="value">${leadData.restaurantZone || 'Non specificata'}</span>
            </div>
            
            <div class="field">
              <span class="label">Tipo Attrezzatura:</span>
              <span class="value">${leadData.equipmentType || 'Non specificato'}</span>
            </div>
          </div>
          
          <div class="field">
            <span class="label">Data/Ora:</span>
            <span class="value">${new Date(leadData.timestamp).toLocaleString('it-IT')}</span>
          </div>
          
          <div class="field">
            <span class="label">Fonte:</span>
            <span class="value">${leadData.source}</span>
          </div>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
          <p><strong>Prossimi passi:</strong></p>
          <ul>
            <li>Contattare il cliente entro 24 ore</li>
            <li>Verificare le esigenze specifiche</li>
            <li>Programmare una visita o chiamata di approfondimento</li>
          </ul>
        </div>
      </div>
    </body>
    </html>
  `;
};
