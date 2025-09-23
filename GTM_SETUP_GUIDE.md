# 🎯 Guida Configurazione Google Tag Manager

## ✅ **Setup Completato nel Codice**

Il tuo progetto è già configurato con:
- **GTM Container ID**: `GTM-PL5HZX6R`
- **GA4 Measurement ID**: `G-Y5B86LG05F`
- **Google Ads ID**: `570-400-4621`

## 🔧 **Configurazione in GTM**

### 1. **Accedi a GTM**
- Vai su [tagmanager.google.com](https://tagmanager.google.com)
- Seleziona il container `GTM-PL5HZX6R`

### 2. **Crea Tag GA4**
1. **Tags** → **New** → **Tag Configuration** → **Google Analytics: GA4 Configuration**
2. **Measurement ID**: `G-Y5B86LG05F`
3. **Trigger**: All Pages
4. **Nome**: GA4 - Configuration

### 3. **Crea Tag Google Ads**
1. **Tags** → **New** → **Tag Configuration** → **Google Ads: Conversion Tracking**
2. **Conversion ID**: `570-400-4621`
3. **Conversion Label**: `preventivo_form`
4. **Trigger**: Custom Event = `form_submit`
5. **Nome**: Google Ads - Form Conversion

### 4. **Crea Trigger per Form Submission**
1. **Triggers** → **New** → **Trigger Configuration** → **Custom Event**
2. **Event Name**: `form_submit`
3. **Nome**: Form Submit Trigger

### 5. **Crea Trigger per Form Steps**
1. **Triggers** → **New** → **Trigger Configuration** → **Custom Event**
2. **Event Name**: `form_step`
3. **Nome**: Form Step Trigger

### 6. **Crea Trigger per Button Clicks**
1. **Triggers** → **New** → **Trigger Configuration** → **Custom Event**
2. **Event Name**: `button_click`
3. **Nome**: Button Click Trigger

## 📊 **Variabili GTM da Creare**

### 1. **Data Layer Variables**
- `restaurant_name` (Data Layer Variable)
- `restaurant_zone` (Data Layer Variable)
- `equipment_type` (Data Layer Variable)
- `conversion_id` (Data Layer Variable)
- `conversion_label` (Data Layer Variable)
- `transaction_id` (Data Layer Variable)

### 2. **Built-in Variables**
- Page URL
- Page Title
- Click Element
- Click Classes

## 🎯 **Eventi Tracciati**

### **Form Events**
- `form_submit` - Invio form completato
- `form_step` - Completamento step del form
- `button_click` - Click sui pulsanti

### **Page Events**
- `page_view` - Visualizzazione pagine
- `gtm.js` - Caricamento GTM

## 🔍 **Debug e Test**

### 1. **GTM Preview Mode**
1. Clicca **Preview** in GTM
2. Inserisci l'URL del tuo sito
3. Testa il form e verifica gli eventi

### 2. **Google Analytics Debug**
1. Installa "Google Analytics Debugger" per Chrome
2. Apri il sito in modalità incognito
3. Compila il form e controlla la console

### 3. **Google Ads Debug**
1. Vai su Google Ads → Tools → Conversions
2. Controlla le conversioni in tempo reale

## 📈 **Metriche da Monitorare**

### **Conversioni Principali**
- **Form completato**: Evento `form_submit`
- **Step completati**: Evento `form_step`
- **Click pulsanti**: Evento `button_click`

### **Dati Personalizzati**
- Nome ristorante
- Zona ristorante
- Tipo attrezzatura
- ID transazione

## 🚀 **Pubblicazione**

1. **Test** in Preview Mode
2. **Submit** la versione
3. **Publish** in produzione
4. **Verifica** i dati in GA4 e Google Ads

## 🔧 **Configurazioni Avanzate**

### **Enhanced Ecommerce** (Opzionale)
```javascript
// Esempio per tracking ecommerce
dataLayer.push({
  'event': 'purchase',
  'ecommerce': {
    'transaction_id': 'preventivo_123',
    'value': 1.00,
    'currency': 'EUR',
    'items': [{
      'item_name': 'Preventivo Attrezzature',
      'category': 'Lead Generation',
      'quantity': 1,
      'price': 1.00
    }]
  }
});
```

### **Custom Dimensions** (Opzionale)
- Restaurant Name
- Restaurant Zone
- Equipment Type
- Form Step

## 📱 **Mobile Tracking**

Il tracking funziona automaticamente su mobile con:
- Touch events
- Mobile-specific triggers
- Responsive design tracking

## 🔒 **Privacy e GDPR**

### **Cookie Consent**
```javascript
// Esempio per cookie consent
dataLayer.push({
  'event': 'cookie_consent',
  'consent_type': 'analytics',
  'consent_status': 'granted'
});
```

## 📞 **Supporto**

### **Problemi Comuni**
1. **Eventi non tracciati**: Controlla Preview Mode
2. **Conversioni mancanti**: Verifica trigger e tag
3. **Dati duplicati**: Controlla GA4 e GTM insieme

### **Debug Tools**
- GTM Preview Mode
- GA4 Debug View
- Google Ads Conversion Tracking
- Browser Developer Tools

## ✅ **Checklist Finale**

- [ ] GTM container configurato
- [ ] GA4 tag creato e pubblicato
- [ ] Google Ads conversion tag creato
- [ ] Trigger configurati
- [ ] Variabili create
- [ ] Test in Preview Mode
- [ ] Pubblicazione in produzione
- [ ] Verifica dati in GA4
- [ ] Verifica conversioni in Google Ads

## 🎯 **Prossimi Passi**

1. **Configura i tag** in GTM seguendo questa guida
2. **Testa** in Preview Mode
3. **Pubblica** in produzione
4. **Monitora** le performance
5. **Ottimizza** basandoti sui dati

