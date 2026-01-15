# ✅ Guida Completa di Verifica - Analytics & Tag Manager

## 🚀 Deploy Completato!

Le modifiche sono state deployate su Vercel. Ora puoi verificare che tutto funzioni correttamente.

---

## 📋 Cosa È Stato Configurato

### ✅ Google Tag Manager (GTM)
- Container ID: `GTM-PM7BJ5CS`
- Script installato in `index.html`
- Inizializzazione nel codice

### ✅ Google Analytics 4 (GA4)
- Measurement ID: `G-CWVFE2B6PJ`
- Configurato tramite gtag.js
- Eventi tracciati: form_submit, generate_lead, form_step, button_click, ecc.

### ✅ Google Ads
- Conversion ID: `AW-17544893918`
- **Conversion Label: `V9gNCO-S6ZcbEN6rh65B`** ⚠️ **AGGIORNATO!**
- Configurato nel codice con label corretto

### ✅ Facebook Pixel
- Pixel ID: `1159186469692428`
- Script installato in `index.html`
- Eventi tracciati: Lead, Confirmed, Field events

---

## 🔍 Verifica Step-by-Step

### STEP 1: Verifica Deploy

1. Visita: **https://schettinograndicucine-ten.vercel.app/**
2. Apri la console del browser (F12)
3. Verifica che vedi questi log:
   ```
   ✅ GTM initialized with Container ID: GTM-PM7BJ5CS
   ✅ GA4 initialized with ID: G-CWVFE2B6PJ
   ✅ Facebook Pixel initialized
   ```

### STEP 2: Verifica Google Ads Conversion Label

1. Apri la console (F12)
2. Naviga nel form e **invia un form completo**
3. Nella console, cerca:
   ```
   🎯 Tracking Google Ads conversion: V9gNCO-S6ZcbEN6rh65B
   ✅ Google Ads conversion tracked successfully
   ```
4. Se vedi questo, il Conversion Label è stato inviato correttamente! ✅

### STEP 3: Test in Google Ads Tag Assistant

1. Vai su [Google Ads](https://ads.google.com/)
2. Vai su **Tools & Settings** → **Conversions**
3. Clicca sulla conversione **"Invio modulo per i lead"**
4. Clicca su **Test conversione** (o usa Tag Assistant)
5. Naviga su: `https://schettinograndicucine-ten.vercel.app/`
6. **Compila e invia il form completo**
7. Attendi 10-30 secondi
8. Verifica che Google Ads rilevi la conversione ✅

**Se funziona, vedrai:**
- ✅ "Conversione rilevata"
- ✅ Il Conversion Label `V9gNCO-S6ZcbEN6rh65B` presente

### STEP 4: Verifica GA4 Realtime

1. Vai su [Google Analytics](https://analytics.google.com/)
2. Seleziona la proprietà `G-CWVFE2B6PJ`
3. Vai su **Reports** → **Realtime**
4. Naviga sul sito e compi azioni:
   - Compila un campo del form
   - Clicca un pulsante
   - Invia il form
5. Verifica che gli eventi appaiano in Realtime entro 30 secondi

**Eventi da verificare:**
- `page_view`
- `form_step`
- `button_click`
- `generate_lead`
- `form_submit`

### STEP 5: Verifica GTM (Se Configurato)

Se hai configurato i tag in GTM:

1. Vai su [Google Tag Manager](https://tagmanager.google.com/)
2. Seleziona il container `GTM-PM7BJ5CS`
3. Clicca su **Anteprima** (Preview)
4. Inserisci l'URL: `https://schettinograndicucine-ten.vercel.app/`
5. Naviga nel form e verifica:
   - ✅ Gli eventi appaiono nella sezione "Eventi"
   - ✅ I tag vengono triggerati
   - ✅ Le variabili sono popolate

### STEP 6: Verifica Facebook Pixel

1. Vai su [Facebook Events Manager](https://business.facebook.com/events_manager2/)
2. Seleziona il Pixel `1159186469692428`
3. Vai su **Test Events**
4. Naviga sul sito e compi azioni
5. Verifica che gli eventi appaiano in tempo reale

**Eventi da verificare:**
- `PageView`
- `Lead`
- `Confirmed`
- `Field*` events

---

## 🛠️ Strumenti di Verifica Integrati

### Pagina di Test Analytics

Visita: **https://schettinograndicucine-ten.vercel.app/analytics-test**

Questa pagina include:
- ✅ Verifica automatica di GTM, GA4, Google Ads, Facebook Pixel
- 📊 Visualizzazione dataLayer in tempo reale
- 🧪 Test eventi per ogni piattaforma
- 🔗 Link rapidi alle dashboard

**Come usare:**
1. Visita la pagina
2. Il sistema verifica automaticamente tutti i tag
3. Clicca "🧪 Test Event" per testare ogni piattaforma
4. Espandi "DataLayer Content" per vedere gli eventi

---

## 🔍 Verifica Console Browser

Apri la console (F12) e usa questi comandi:

### Verifica dataLayer
```javascript
window.dataLayer
```

Dovresti vedere un array con eventi. Filtra solo gli eventi:
```javascript
window.dataLayer.filter(item => item.event)
```

### Verifica gtag
```javascript
typeof window.gtag
// Dovrebbe restituire: "function"
```

### Verifica fbq
```javascript
typeof window.fbq
// Dovrebbe restituire: "function"
```

### Test Evento Manuale GA4
```javascript
window.gtag('event', 'test_event', {
  event_category: 'Test',
  event_label: 'Manual Test',
  value: 1
});
```

### Test Conversione Google Ads
```javascript
window.gtag('event', 'conversion', {
  send_to: 'AW-17544893918/V9gNCO-S6ZcbEN6rh65B',
  value: 1,
  currency: 'EUR'
});
```

### Test Evento Facebook
```javascript
window.fbq('track', 'PageView');
window.fbq('trackCustom', 'TestEvent', { test: true });
```

---

## ✅ Checklist Completa

Prima di considerare tutto configurato, verifica:

### Deploy
- [x] Codice deployato su Vercel
- [ ] Sito accessibile e funzionante
- [ ] Console browser mostra log di inizializzazione

### Google Ads
- [x] Conversion Label aggiunto al codice: `V9gNCO-S6ZcbEN6rh65B`
- [ ] Test invio form mostra log con Conversion Label
- [ ] Google Ads Tag Assistant rileva la conversione
- [ ] Conversione registrata in Google Ads

### Google Analytics 4
- [ ] GA4 Realtime mostra eventi
- [ ] Eventi form_submit, generate_lead visibili
- [ ] Eventi form_step tracciati correttamente

### Google Tag Manager
- [ ] GTM Preview Mode mostra eventi (se configurato)
- [ ] Tag vengono triggerati (se configurato)
- [ ] Variabili popolate correttamente (se configurato)

### Facebook Pixel
- [ ] Facebook Events Manager mostra eventi
- [ ] Eventi Lead, Confirmed visibili
- [ ] Eventi Field* tracciati

---

## 🆘 Risoluzione Problemi

### Problema: "Conversion Label non inviato"
**Verifica:**
1. Apri la console (F12)
2. Invia il form
3. Cerca il log: `🎯 Tracking Google Ads conversion: V9gNCO-S6ZcbEN6rh65B`
4. Se non lo vedi, il deploy potrebbe non essere ancora attivo (attendi 2-3 minuti)

### Problema: "Google Ads non rileva conversione"
**Possibili cause:**
1. Deploy non ancora completato (attendi 2-3 minuti)
2. Conversion Label errato (verifica che sia esattamente `V9gNCO-S6ZcbEN6rh65B`)
3. Google Ads ha un delay (attendi 10-30 secondi dopo l'invio)

**Soluzione:**
1. Verifica nella console che il label venga inviato
2. Controlla la Network tab per vedere la richiesta a Google Ads
3. Attendi e riprova

### Problema: "Eventi non appaiono in GA4"
**Soluzione:**
1. Usa GA4 DebugView (installa estensione Google Analytics Debugger)
2. Verifica che il Measurement ID sia corretto
3. Attendi fino a 30 secondi (GA4 Realtime ha un delay)

### Problema: "GTM non mostra tag"
**Soluzione:**
1. Verifica che i tag siano configurati in GTM
2. Verifica che i trigger siano collegati ai tag
3. Verifica che la versione sia pubblicata
4. Usa GTM Preview Mode per vedere errori in tempo reale

---

## 📊 Eventi Tracciati

Quando un utente interagisce con il form, vengono inviati questi eventi:

### Al dataLayer (GTM)
- `Lead` - Invio form
- `Confirmed` - Conferma invio form
- `ClickButton` - Click su pulsanti
- `GoBack` - Torna indietro
- `FieldRestaurateur_Yes/No` - Completamento campi
- Altri eventi `Field*` per ogni campo

### A GA4
- `page_view` - Visualizzazione pagina
- `form_step` - Progressione nel form
- `button_click` - Click su pulsanti
- `generate_lead` - Invio form (conversione)
- `form_submit` - Invio form
- `form_error` - Errori nel form

### A Google Ads
- `conversion` - Invio form con label `V9gNCO-S6ZcbEN6rh65B`

### A Facebook Pixel
- `PageView` - Visualizzazione pagina
- `Lead` - Invio form
- `Confirmed` - Conferma invio form
- `ClickButton` - Click su pulsanti
- `Field*` events - Completamento campi

---

## 📞 Supporto

Se hai problemi:

1. **Usa la pagina di test:** `/analytics-test`
2. **Controlla la console** del browser per errori
3. **Usa GTM Preview Mode** per vedere errori GTM
4. **Usa GA4 DebugView** per vedere errori GA4
5. **Verifica che tutti gli ID siano corretti**

---

## 📝 Documenti di Riferimento

- `VERIFICA_ANALYTICS.md` - Guida completa verifica analytics
- `GTM_CONFIGURAZIONE_TAG.md` - Guida configurazione tag GTM
- `GOOGLE_ADS_CONVERSION_FIX.md` - Fix Conversion Label Google Ads
- `GTM_FIX_VARIABILI.md` - Fix variabili GTM
- `SITUAZIONE_GTM.md` - Analisi situazione GTM

---

## ✅ Status Finale

- [x] GTM installato e configurato
- [x] GA4 configurato e funzionante
- [x] Google Ads Conversion Label aggiunto
- [x] Facebook Pixel configurato
- [x] Strumenti di verifica creati
- [x] Deploy completato

**Prossimo passo:** Verifica che tutto funzioni usando questa guida!

---

**Ultimo aggiornamento:** Dopo deploy su Vercel
**URL sito:** https://schettinograndicucine-ten.vercel.app/
**URL test analytics:** https://schettinograndicucine-ten.vercel.app/analytics-test
