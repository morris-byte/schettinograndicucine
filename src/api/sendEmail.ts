// API endpoint per inviare email ai commerciali
interface LeadData {
  isRestaurateur: boolean | null;
  isInCampania: boolean | null;
  restaurantZone: string;
  restaurantName: string;
  equipmentType: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  wantsCatalog: boolean | null;
  privacyConsent: boolean;
}

export const sendEmailToCommerciali = async (leadData: LeadData) => {
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
