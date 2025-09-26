# Meta Pixel Setup Guide

## 🎯 **Configurazione Completata**

Il Pixel Meta è stato configurato con successo nel progetto con ID: `1073356054528227`

## 📊 **Eventi Tracciati**

### **Eventi Automatici**
- **PageView**: Tracciato automaticamente su ogni caricamento pagina

### **Eventi Personalizzati**
- **Lead**: Quando l'utente completa il modulo preventivo
- **FormStep**: Ogni step del modulo completato
- **ButtonClick**: Click sui bottoni del form

## 🔧 **Configurazione in Meta Business Manager**

### **1. Verifica del Pixel**
1. Vai su [Meta Business Manager](https://business.facebook.com)
2. Seleziona il tuo account business
3. Vai su **Eventi** > **Pixel**
4. Verifica che il pixel `1073356054528227` sia attivo

### **2. Test degli Eventi**
1. Vai su **Eventi** > **Test Eventi**
2. Inserisci l'URL del sito: `https://schettinograndicucine.lovable.app`
3. Testa il modulo per verificare gli eventi

### **3. Configurazione Conversioni**
1. Vai su **Eventi** > **Conversioni**
2. Crea una nuova conversione per l'evento **Lead**
3. Configura il valore e la finestra di attribuzione

## 📈 **Eventi Disponibili**

### **Lead Event**
```javascript
fbq('track', 'Lead', {
  content_name: 'Preventivo Richiesto',
  content_category: 'Form Submission',
  value: 1.0,
  currency: 'EUR',
  custom_data: {
    restaurant_name: 'Nome Ristorante',
    restaurant_zone: 'Zona',
    equipment_type: 'Tipo Attrezzatura'
  }
});
```

### **FormStep Event**
```javascript
fbq('trackCustom', 'FormStep', {
  step_number: 1,
  step_name: 'Step Name',
  content_category: 'Form Progress'
});
```

### **ButtonClick Event**
```javascript
fbq('trackCustom', 'ButtonClick', {
  button_name: 'Button Name',
  location: 'Location',
  content_category: 'Button Interaction'
});
```

## 🚀 **Deploy e Test**

### **1. Deploy del Sito**
Il sito deve essere deployato online per testare il pixel:
- GitHub Pages: `https://schettinograndicucine.lovable.app`
- Netlify: Deploy automatico da GitHub

### **2. Test Locale**
Per testare localmente:
1. Apri il browser con `localhost:8080`
2. Apri Developer Tools > Console
3. Verifica che `fbq` sia disponibile: `console.log(window.fbq)`

### **3. Verifica Eventi**
1. Usa l'estensione **Meta Pixel Helper** per Chrome
2. Verifica che gli eventi vengano inviati correttamente
3. Controlla in Meta Business Manager > Test Eventi

## 🔍 **Debug e Troubleshooting**

### **Problemi Comuni**
1. **Pixel non caricato**: Verifica che il sito sia online
2. **Eventi non inviati**: Controlla la console per errori
3. **Conversioni non rilevate**: Verifica la configurazione in Meta Business Manager

### **Console Commands per Debug**
```javascript
// Verifica se fbq è caricato
console.log(typeof window.fbq);

// Test manuale evento Lead
fbq('track', 'Lead', {content_name: 'Test Lead'});

// Verifica eventi inviati
fbq('track', 'PageView');
```

## 📱 **Configurazione Campagne Facebook**

### **1. Creazione Audience**
1. Vai su **Pubblico** > **Crea Pubblico**
2. Seleziona **Pubblico personalizzato**
3. Scegli **Tutti i visitatori del sito web**
4. Configura i parametri (es. ultimi 30 giorni)

### **2. Lookalike Audience**
1. Crea un pubblico lookalike basato sui Lead
2. Seleziona la percentuale di somiglianza (1-10%)
3. Scegli la fonte (Lead del pixel)

### **3. Conversioni per Campagne**
1. Crea una campagna per **Conversioni**
2. Seleziona l'evento **Lead** come obiettivo
3. Configura il budget e il targeting

## ✅ **Checklist Finale**

- [x] Pixel Meta installato nel sito
- [x] Eventi personalizzati configurati
- [x] Sito deployato online
- [x] Test eventi completato
- [x] Conversioni configurate in Meta Business Manager
- [x] Audience create per campagne
- [x] Campagne configurate per conversioni

## 🆘 **Supporto**

Per problemi o domande:
1. Controlla la console del browser per errori
2. Verifica la configurazione in Meta Business Manager
3. Usa Meta Pixel Helper per debug
4. Consulta la documentazione Meta per sviluppatori

---

**Pixel ID**: `1073356054528227`  
**Sito**: `https://schettinograndicucine.lovable.app`  
**Ultimo aggiornamento**: $(date)

