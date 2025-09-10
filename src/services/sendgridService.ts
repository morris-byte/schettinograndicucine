// SendGrid - Servizio professionale per invio email
const SENDGRID_API_KEY = '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';

export const sendEmailToCommerciali = async (leadData: any) => {
  try {
    // In locale, simula l'invio
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('Modalità locale: Simulazione invio email SendGrid');
      console.log('Dati email:', leadData);
      return { success: true, message: 'Simulazione locale' };
    }

    // In produzione, usa SendGrid
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [
              { email: 'jagermorris@gmail.com', name: 'Commerciale 1' },
              { email: 'vincenzopetronebiz@gmail.com', name: 'Commerciale 2' }
            ],
            subject: `Nuovo Lead - ${leadData.restaurantName || 'Cliente Potenziale'}`
          }
        ],
        from: {
          email: 'noreply@grandicucine.com',
          name: 'Grandi Cucine'
        },
        content: [
          {
            type: 'text/html',
            value: `
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
            `
          }
        ]
      })
    });

    if (response.ok) {
      console.log('Email inviata con successo via SendGrid');
      return { success: true, response };
    } else {
      const errorText = await response.text();
      console.error('Errore SendGrid:', response.status, errorText);
      throw new Error(`Errore SendGrid: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error('Errore invio email SendGrid:', error);
    throw error;
  }
};

export const sendTestEmail = async () => {
  const testData = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phoneNumber: '+39 123 456 7890',
    restaurantName: 'Ristorante Test',
    restaurantZone: 'Napoli',
    equipmentType: 'Cucina Professionale',
    timestamp: new Date().toISOString(),
    source: 'Test Email',
  };

  return await sendEmailToCommerciali(testData);
};
