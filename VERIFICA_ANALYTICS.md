# 🔍 Guida alla Verifica di Analytics e Tag Manager

Questa guida ti aiuta a verificare che tutti i tag (GTM, GA4, Google Ads, Facebook Pixel) siano configurati correttamente e funzionanti sul sito.

## 🚀 Accesso Rapido

### Pagina di Test Integrata
Visita: **https://schettinograndicucine-ten.vercel.app/analytics-test**

Questa pagina include uno strumento di verifica completo che mostra:
- ✅ Stato di GTM, GA4, Google Ads e Facebook Pixel
- 📊 Contenuto del dataLayer in tempo reale
- 🧪 Test eventi per ogni piattaforma
- 🔗 Link rapidi alle dashboard

## 📋 Metodi di Verifica

### 1. Google Tag Manager (GTM)

#### Verifica Script Installato
1. Apri il sito e premi **F12** (DevTools)
2. Vai alla tab **Elements**
3. Cerca nel `<head>`: `<script src="https://www.googletagmanager.com/gtm.js?id=GTM-PM7BJ5CS">`
4. Verifica che il Container ID sia corretto: `GTM-PM7BJ5CS`

#### Verifica dataLayer
Nella **Console** del browser, digita:
```javascript
window.dataLayer
```
Dovresti vedere un array con eventi. Se è vuoto o undefined, c'è un problema.

#### GTM Preview Mode (Consigliato)
1. Vai su [Google Tag Manager](https://tagmanager.google.com/)
2. Seleziona il container `GTM-PM7BJ5CS`
3. Clicca su **Anteprima** (Preview)
4. Inserisci l'URL: `https://schettinograndicucine-ten.vercel.app/`
5. Naviga nel form e verifica:
   - ✅ Gli eventi appaiono in tempo reale
   - ✅ I tag vengono triggerati
   - ✅ Le variabili sono popolate correttamente

#### Eventi da Verificare in GTM:
- `gtm_init` - All'avvio
- `ClickButton` - Quando si clicca un pulsante
- `GoBack` - Quando si torna indietro
- `Lead` - Quando si invia il form
- `Confirmed` - Conferma invio form
- `FieldRestaurateur_Yes/No` - Completamento campo
- `FieldCampania_Yes/No` - Completamento campo
- Altri eventi `Field*` per ogni campo del form

---

### 2. Google Analytics 4 (GA4)

#### Verifica Script Installato
1. Apri DevTools (F12) → **Network**
2. Ricarica la pagina
3. Cerca richieste a `googletagmanager.com/gtag/js?id=G-CWVFE2B6PJ`
4. Verifica che il Measurement ID sia corretto: `G-CWVFE2B6PJ`

#### Verifica gtag Function
Nella **Console**, digita:
```javascript
typeof window.gtag
```
Dovrebbe restituire: `"function"`

#### Test Evento Manuale
Nella **Console**, esegui:
```javascript
window.gtag('event', 'test_event', {
  event_category: 'Test',
  event_label: 'Manual Test',
  value: 1
});
```

#### GA4 Realtime Reports
1. Vai su [Google Analytics](https://analytics.google.com/)
2. Seleziona la proprietà con ID `G-CWVFE2B6PJ`
3. Vai su **Reports** → **Realtime**
4. Esegui un'azione sul sito (es. clicca un pulsante)
5. Verifica che l'evento appaia entro 30 secondi

#### GA4 DebugView (Consigliato)
1. Installa l'estensione [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) su Chrome
2. Attiva l'estensione
3. Vai su GA4 → **Admin** → **DebugView**
4. Naviga nel sito e verifica gli eventi in tempo reale con tutti i dettagli

#### Eventi da Verificare in GA4:
- `page_view` - Visualizzazione pagina
- `test_event` - Evento di test
- `form_step` - Progressione nel form
- `button_click` - Click su pulsanti
- `generate_lead` - Invio form (conversione)
- `form_submit` - Invio form
- `form_error` - Errori nel form
- `form_abandon` - Abbandono form

---

### 3. Google Ads

#### Verifica Configurazione
Google Ads è configurato tramite gtag insieme a GA4. Verifica:
1. Nel codice `index.html`, cerca: `gtag('config', 'AW-17544893918')`
2. Conversion ID: `AW-17544893918`

#### Test Conversione
Nella **Console**, esegui:
```javascript
window.gtag('event', 'conversion', {
  send_to: 'AW-17544893918',
  value: 1,
  currency: 'EUR'
});
```

#### Verifica in Google Ads
1. Vai su [Google Ads](https://ads.google.com/)
2. Vai su **Tools & Settings** → **Conversions**
3. Cerca la conversione configurata
4. Verifica che gli eventi vengano registrati

#### Eventi di Conversione:
- `conversion` - Invio form (conversione principale)
- Configurato automaticamente quando si invia il form

---

### 4. Facebook Pixel

#### Verifica Script Installato
1. Apri DevTools (F12) → **Network**
2. Ricarica la pagina
3. Cerca richieste a `facebook.net/fbevents.js`
4. Verifica che il Pixel ID sia corretto: `1159186469692428`

#### Verifica fbq Function
Nella **Console**, digita:
```javascript
typeof window.fbq
```
Dovrebbe restituire: `"function"`

#### Test Evento Manuale
Nella **Console**, esegui:
```javascript
window.fbq('track', 'PageView');
window.fbq('trackCustom', 'TestEvent', {
  test: true
});
```

#### Facebook Events Manager
1. Vai su [Facebook Events Manager](https://business.facebook.com/events_manager2/)
2. Seleziona il Pixel ID: `1159186469692428`
3. Vai su **Test Events**
4. Naviga nel sito e verifica gli eventi in tempo reale

#### Eventi da Verificare:
- `PageView` - Visualizzazione pagina
- `Lead` - Invio form
- `Confirmed` - Conferma invio form
- `ClickButton` - Click su pulsanti
- `GoBack` - Torna indietro
- `FieldRestaurateur_Yes/No` - Completamento campi
- Altri eventi `Field*` per ogni campo

---

## 🧪 Test Completo Step-by-Step

### Test 1: Verifica Inizializzazione
1. Apri il sito
2. Apri DevTools (F12) → **Console**
3. Verifica che vedi questi log:
   - `✅ GTM initialized with Container ID: GTM-PM7BJ5CS`
   - `✅ GA4 initialized with ID: G-CWVFE2B6PJ`
   - `✅ Facebook Pixel initialized`

### Test 2: Verifica dataLayer
1. Nella **Console**, digita: `window.dataLayer`
2. Verifica che contenga almeno:
   - Evento `gtm.start`
   - Configurazione GA4
   - Configurazione Google Ads
   - Evento `gtm_init` (se inizializzato)

### Test 3: Test Evento GTM
1. Usa la pagina `/analytics-test`
2. Clicca su **🧪 Test Event** per GTM
3. Verifica nella **Console**: `✅ GTM: test_event event pushed to dataLayer`
4. In GTM Preview Mode, verifica che l'evento appaia

### Test 4: Test Evento GA4
1. Usa la pagina `/analytics-test`
2. Clicca su **🧪 Test Event** per GA4
3. Vai su GA4 → **Realtime** e verifica che l'evento appaia

### Test 5: Test Form Submission
1. Compila il form completo
2. Invia il form
3. Verifica che vengano inviati questi eventi:
   - **GTM**: `Lead`, `Confirmed`
   - **GA4**: `generate_lead`, `form_submit`
   - **Google Ads**: `conversion`
   - **Facebook**: `Lead`, `Confirmed`

### Test 6: Verifica Tracking Campi
1. Compila ogni campo del form
2. Verifica nella **Console** che appaiano eventi:
   - `✅ Facebook Pixel: FieldRestaurateur_Yes event tracked`
   - `✅ GTM: FieldRestaurateur_Yes event pushed to dataLayer`
3. In GTM Preview Mode, verifica che gli eventi appaiano

---

## 🔧 Risoluzione Problemi

### Problema: dataLayer non trovato
**Soluzione:**
- Verifica che GTM sia caricato prima di altri script
- Controlla che non ci siano errori JavaScript che bloccano l'esecuzione
- Verifica la console per errori

### Problema: gtag non disponibile
**Soluzione:**
- Verifica che lo script GA4 sia caricato: `https://www.googletagmanager.com/gtag/js?id=G-CWVFE2B6PJ`
- Controlla che non ci siano errori di rete
- Verifica che lo script non sia bloccato da ad blocker

### Problema: fbq non disponibile
**Soluzione:**
- Verifica che lo script Facebook sia caricato
- Controlla che non sia bloccato da ad blocker o privacy tools
- Verifica la console per errori

### Problema: Eventi non appaiono in GA4
**Soluzione:**
- Usa GA4 DebugView per vedere errori dettagliati
- Verifica che il Measurement ID sia corretto
- Controlla che gli eventi siano inviati con la sintassi corretta
- Attendi fino a 30 secondi (GA4 Realtime ha un delay)

### Problema: Eventi non appaiono in GTM
**Soluzione:**
- Verifica che i trigger siano configurati correttamente in GTM
- Controlla che le variabili dataLayer siano create
- Usa GTM Preview Mode per vedere errori in tempo reale
- Verifica che il container sia pubblicato

---

## 📊 Strumenti Utili

### Browser Extensions
1. **Google Tag Assistant** (deprecato ma ancora utile)
2. **Google Analytics Debugger** - Per GA4 DebugView
3. **Facebook Pixel Helper** - Per verificare Facebook Pixel

### Console Commands
```javascript
// Verifica dataLayer
window.dataLayer

// Verifica gtag
typeof window.gtag
window.gtag('get', 'G-CWVFE2B6PJ', 'client_id')

// Verifica fbq
typeof window.fbq

// Test evento GTM
window.dataLayer.push({event: 'test', test: true})

// Test evento GA4
window.gtag('event', 'test', {test: true})

// Test evento Facebook
window.fbq('track', 'PageView')
```

---

## ✅ Checklist Finale

Prima di considerare tutto configurato, verifica:

- [ ] GTM script caricato e Container ID corretto
- [ ] GA4 script caricato e Measurement ID corretto
- [ ] Google Ads configurato tramite gtag
- [ ] Facebook Pixel script caricato e Pixel ID corretto
- [ ] dataLayer inizializzato e contiene eventi
- [ ] gtag function disponibile
- [ ] fbq function disponibile
- [ ] Eventi di test funzionano in tutte le piattaforme
- [ ] Form submission invia eventi a tutte le piattaforme
- [ ] Tracking campi funziona correttamente
- [ ] GTM Preview Mode mostra eventi in tempo reale
- [ ] GA4 Realtime mostra eventi
- [ ] Facebook Events Manager mostra eventi

---

## 🆘 Supporto

Se hai problemi:
1. Usa la pagina `/analytics-test` per diagnosticare
2. Controlla la console del browser per errori
3. Usa GTM Preview Mode per vedere errori dettagliati
4. Usa GA4 DebugView per vedere errori GA4
5. Verifica che tutti gli ID siano corretti

---

**Ultimo aggiornamento:** Configurazione verificata per https://schettinograndicucine-ten.vercel.app/
