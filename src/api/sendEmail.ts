// API endpoint per inviare email ai commerciali
export const sendEmailToCommerciali = async (leadData: any) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });

    if (!response.ok) {
      throw new Error('Errore nell\'invio email');
    }

    return await response.json();
  } catch (error) {
    console.error('Errore API email:', error);
    throw error;
  }
};
