# 📊 Configurazione Google Analytics 4 e Google Ads

## 🎯 Setup Google Analytics 4

### 1. Crea un account GA4
1. Vai su [Google Analytics](https://analytics.google.com/)
2. Clicca "Start measuring"
3. Crea una proprietà per il sito web
4. Copia il **Measurement ID** (formato: G-XXXXXXXXXX)

### 2. Configura il tracking
1. Apri `src/config/analytics.ts`
2. Sostituisci `G-XXXXXXXXXX` con il tuo Measurement ID:
```typescript
export const GA4_MEASUREMENT_ID = 'G-ILTUOMEASUREMENTID';
```

3. Apri `index.html`
4. Sostituisci `G-XXXXXXXXXX` con il tuo Measurement ID:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ILTUOMEASUREMENTID"></script>
```

## 🎯 Setup Google Ads

### 1. Crea una campagna Google Ads
1. Vai su [Google Ads](https://ads.google.com/)
2. Crea una nuova campagna
3. Vai su "Tools & Settings" > "Conversions"
4. Clicca "+" per aggiungere una conversione
5. Scegli "Website" come tipo di conversione
6. Inserisci i dettagli della conversione

### 2. Configura il tracking delle conversioni
1. Copia il **Conversion ID** (formato: AW-XXXXXXXXX)
2. Copia il **Conversion Label** (formato: XXXXXXXXX)
3. Apri `src/config/analytics.ts`
4. Sostituisci i valori:
```typescript
export const GOOGLE_ADS_CONVERSION_ID = 'AW-ILTUOCONVERSIONID';
export const GOOGLE_ADS_CONVERSION_LABEL = 'ILTUOCONVERSIONLABEL';
```

## 📈 Eventi Tracciati

### Eventi GA4
- **form_submit**: Invio del form completato
- **form_step**: Completamento di ogni step del form
- **click**: Click sui pulsanti
- **page_view**: Visualizzazione delle pagine

### Conversioni Google Ads
- **conversion**: Invio del form (conversione principale)

## 🔧 Personalizzazione Eventi

### Aggiungere nuovi eventi
```typescript
// In src/config/analytics.ts
export const trackCustomEvent = (eventName: string, parameters: any) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};
```

### Esempio di utilizzo
```typescript
// Track un evento personalizzato
trackCustomEvent('button_click', {
  event_category: 'engagement',
  event_label: 'contact_button',
  value: 1
});
```

## 🚀 Test del Tracking

### 1. Test in modalità debug
1. Installa l'estensione "Google Analytics Debugger" per Chrome
2. Apri il sito in modalità incognito
3. Compila e invia il form
4. Controlla la console per i messaggi di debug

### 2. Verifica in GA4
1. Vai su Google Analytics
2. Sezione "Reports" > "Realtime"
3. Dovresti vedere gli eventi in tempo reale

### 3. Verifica in Google Ads
1. Vai su Google Ads
2. Sezione "Tools & Settings" > "Conversions"
3. Controlla le conversioni registrate

## 📊 Metriche Importanti

### Conversioni da monitorare
- **Tasso di completamento form**: % utenti che completano il form
- **Abbandono per step**: In quale step gli utenti abbandonano
- **Fonte traffico**: Da dove arrivano i lead
- **ROI campagne**: Costo per lead acquisito

### Setup Conversioni Google Ads
1. **Conversione principale**: Invio form completato
2. **Conversione secondaria**: Click su "Visita il nostro sito"
3. **Conversione micro**: Compilazione step 1 (interesse iniziale)

## 🔒 Privacy e GDPR

### Cookie Banner
Aggiungi un cookie banner per conformità GDPR:
```typescript
// Esempio di implementazione
const acceptCookies = () => {
  // Inizializza GA4 solo dopo consenso
  initGA4();
  // Salva consenso nel localStorage
  localStorage.setItem('cookies_accepted', 'true');
};
```

## 📱 Mobile Tracking

Il tracking funziona automaticamente su mobile. Gli eventi includono:
- Tipo di dispositivo
- Sistema operativo
- Risoluzione schermo
- Connessione (WiFi/Mobile)

## 🎯 Prossimi Passi

1. **Configura i tracking ID** nei file indicati
2. **Testa il tracking** in modalità debug
3. **Verifica i dati** in GA4 e Google Ads
4. **Imposta conversioni** per campagne specifiche
5. **Monitora le performance** e ottimizza

## 📞 Supporto

Per problemi con il tracking:
1. Controlla la console del browser per errori
2. Verifica che i tracking ID siano corretti
3. Testa in modalità incognito
4. Controlla i filtri in GA4
