# 🎯 Configurazione Tag in Google Tag Manager

## 📊 Situazione Attuale

Dalla verifica con Google Tag Assistant risulta:

✅ **Funzionante:**
- GTM Container installato correttamente (`GTM-PM7BJ5CS`)
- Eventi inviati al dataLayer (Lead, Confirmed, conversion, form_submit, generate_lead, ecc.)
- GA4 riceve gli eventi correttamente (`G-CWVFE2B6PJ`)
- Google Ads configurato (`AW-17544893918`)

❌ **Da Configurare:**
- **Tag in GTM non configurati**: GTM mostra "Nessun tag è stato valutato in questo contenitore"
- I trigger per gli eventi devono essere creati
- I tag devono essere creati e pubblicati

---

## 🚀 Configurazione Step-by-Step

### STEP 1: Creare i Trigger per gli Eventi

I trigger sono necessari per far scattare i tag quando arrivano gli eventi al dataLayer.

#### 1.1 Trigger per Evento "Lead"
1. Vai su [Google Tag Manager](https://tagmanager.google.com/)
2. Seleziona il container `GTM-PM7BJ5CS`
3. Vai su **Trigger** → **Nuovo**
4. Nome: `Lead Event`
5. Tipo trigger: **Evento personalizzato**
6. Nome evento: `Lead`
7. Questo trigger si attiva su: **Tutti gli eventi personalizzati**
8. Salva

#### 1.2 Trigger per Evento "Confirmed"
1. **Trigger** → **Nuovo**
2. Nome: `Confirmed Event`
3. Tipo: **Evento personalizzato**
4. Nome evento: `Confirmed`
5. Salva

#### 1.3 Trigger per Evento "ClickButton"
1. **Trigger** → **Nuovo**
2. Nome: `ClickButton Event`
3. Tipo: **Evento personalizzato**
4. Nome evento: `ClickButton`
5. Salva

#### 1.4 Trigger per Evento "GoBack"
1. **Trigger** → **Nuovo**
2. Nome: `GoBack Event`
3. Tipo: **Evento personalizzato**
4. Nome evento: `GoBack`
5. Salva

#### 1.5 Trigger per Eventi "Field*"
Per gli eventi dei campi del form, puoi creare un trigger generico:

1. **Trigger** → **Nuovo**
2. Nome: `Field Events`
3. Tipo: **Evento personalizzato**
4. Nome evento: `^Field.*` (regex per tutti gli eventi che iniziano con "Field")
5. Salva

**OPPURE** crea trigger specifici per ogni campo:
- `FieldRestaurateur_Yes`
- `FieldRestaurateur_No`
- `FieldCampania_Yes`
- `FieldCampania_No`
- `FieldZona`
- `FieldNomeRistorante`
- `FieldAttrezzatura`
- `FieldDatiPersonali`
- `FieldTelefono`
- `FieldEmail`
- `FieldCatalogo_Yes`
- `FieldCatalogo_No`
- `FieldprivacyConsent_Yes`

---

### STEP 2: Creare le Variabili DataLayer

Le variabili permettono di usare i parametri degli eventi nei tag.

#### 2.1 Variabili per Evento "Lead"
1. Vai su **Variabili** → **Nuovo**
2. Nome: `content_name`
3. Tipo: **Variabile Data Layer**
4. Nome variabile Data Layer: `content_name`
5. Tipo di dati: **Testo**
6. Salva

Ripeti per:
- `content_category`

#### 2.2 Variabili per Evento "Confirmed"
Crea variabili per:
- `restaurant_name`
- `is_restaurateur`
- `is_in_campania`
- `restaurant_zone`
- `equipment_type`

#### 2.3 Variabili per Evento "ClickButton"
Crea variabili per:
- `button_name`
- `button_location`

#### 2.4 Variabili per Evento "GoBack"
Crea variabili per:
- `from_step`
- `to_step`
- `step_name`

#### 2.5 Variabili per Eventi "Field*"
Crea variabili per:
- `field_name`
- `field_value`
- `step_number`

---

### STEP 3: Creare i Tag

#### 3.1 Tag GA4 per Evento "Lead"

1. Vai su **Tag** → **Nuovo**
2. Nome: `GA4 - Lead`
3. Tipo tag: **Google Analytics: GA4 Event**
4. Measurement ID: `G-CWVFE2B6PJ`
5. Nome evento: `lead` (o `generate_lead` se preferisci)
6. Parametri evento:
   - `content_name`: `{{content_name}}`
   - `content_category`: `{{content_category}}`
7. Trigger: Seleziona `Lead Event`
8. Salva

#### 3.2 Tag GA4 per Evento "Confirmed"

1. **Tag** → **Nuovo**
2. Nome: `GA4 - Confirmed`
3. Tipo: **Google Analytics: GA4 Event**
4. Measurement ID: `G-CWVFE2B6PJ`
5. Nome evento: `confirmed`
6. Parametri evento:
   - `restaurant_name`: `{{restaurant_name}}`
   - `is_restaurateur`: `{{is_restaurateur}}`
   - `is_in_campania`: `{{is_in_campania}}`
   - `restaurant_zone`: `{{restaurant_zone}}`
   - `equipment_type`: `{{equipment_type}}`
7. Trigger: `Confirmed Event`
8. Salva

#### 3.3 Tag GA4 per Evento "ClickButton"

1. **Tag** → **Nuovo**
2. Nome: `GA4 - ClickButton`
3. Tipo: **Google Analytics: GA4 Event**
4. Measurement ID: `G-CWVFE2B6PJ`
5. Nome evento: `button_click`
6. Parametri evento:
   - `button_name`: `{{button_name}}`
   - `button_location`: `{{button_location}}`
7. Trigger: `ClickButton Event`
8. Salva

#### 3.4 Tag Google Ads per Conversione

1. **Tag** → **Nuovo**
2. Nome: `Google Ads - Conversion`
3. Tipo tag: **Google Ads: Conversion Tracking**
4. Conversion ID: `AW-17544893918`
5. Conversion Label: (lascia vuoto se non hai un label specifico)
6. Valore: `1` (o usa una variabile se vuoi passare un valore dinamico)
7. Valuta: `EUR`
8. Trigger: `Confirmed Event` (o `Lead Event`, a seconda di quando vuoi tracciare la conversione)
9. Salva

**NOTA:** Se hai già configurato Google Ads tramite gtag.js direttamente (come nel tuo caso), questo tag potrebbe essere ridondante. Tuttavia, se vuoi gestire tutto tramite GTM, puoi rimuovere la configurazione diretta da `index.html` e gestire tutto tramite GTM.

#### 3.5 Tag Facebook Pixel per Evento "Lead"

1. **Tag** → **Nuovo**
2. Nome: `Facebook Pixel - Lead`
3. Tipo tag: **Facebook Pixel**
4. Pixel ID: `1159186469692428`
5. Tipo evento: **Evento standard**
6. Evento: `Lead`
7. Parametri evento:
   - `content_name`: `{{content_name}}`
   - `content_category`: `{{content_category}}`
8. Trigger: `Lead Event`
9. Salva

#### 3.6 Tag Facebook Pixel per Evento "Confirmed"

1. **Tag** → **Nuovo**
2. Nome: `Facebook Pixel - Confirmed`
3. Tipo: **Facebook Pixel**
4. Pixel ID: `1159186469692428`
5. Tipo evento: **Evento personalizzato**
6. Nome evento: `Confirmed`
7. Parametri evento:
   - `restaurant_name`: `{{restaurant_name}}`
   - `is_restaurateur`: `{{is_restaurateur}}`
   - `is_in_campania`: `{{is_in_campania}}`
   - `restaurant_zone`: `{{restaurant_zone}}`
   - `equipment_type`: `{{equipment_type}}`
8. Trigger: `Confirmed Event`
9. Salva

#### 3.7 Tag Facebook Pixel per Eventi "Field*"

1. **Tag** → **Nuovo**
2. Nome: `Facebook Pixel - Field Events`
3. Tipo: **Facebook Pixel**
4. Pixel ID: `1159186469692428`
5. Tipo evento: **Evento personalizzato**
6. Nome evento: `{{event}}` (usa il nome dell'evento dal dataLayer)
7. Parametri evento:
   - `field_name`: `{{field_name}}`
   - `field_value`: `{{field_value}}`
   - `step_number`: `{{step_number}}`
8. Trigger: `Field Events` (il trigger regex che hai creato)
9. Salva

---

### STEP 4: Test in Preview Mode

Prima di pubblicare, testa tutto in Preview Mode:

1. In GTM, clicca su **Anteprima** (Preview)
2. Inserisci l'URL: `https://schettinograndicucine-ten.vercel.app/`
3. Si aprirà una nuova finestra con il sito in modalità debug
4. Naviga nel form e compi azioni:
   - Compila un campo
   - Clicca un pulsante
   - Invia il form
5. Nella finestra di debug GTM, verifica:
   - ✅ Gli eventi appaiono nella sezione "Eventi"
   - ✅ I tag vengono triggerati (vedrai "Tag attivati")
   - ✅ Le variabili sono popolate correttamente
   - ✅ Non ci sono errori

---

### STEP 5: Pubblicare

Una volta testato tutto:

1. In GTM, vai su **Versione** (in alto)
2. Clicca su **Crea versione**
3. Aggiungi un nome: es. "Configurazione iniziale tag"
4. Aggiungi una descrizione: "Tag per Lead, Confirmed, ClickButton, Field events"
5. Clicca su **Crea**
6. Clicca su **Pubblica** (in alto a destra)
7. Conferma la pubblicazione

---

## 🔍 Verifica Post-Configurazione

Dopo aver pubblicato, verifica:

### 1. Google Tag Assistant
1. Apri il sito
2. Apri Google Tag Assistant
3. Verifica che i tag vengano triggerati quando compi azioni
4. Controlla che non ci siano errori

### 2. GTM Preview Mode
1. Apri GTM Preview Mode
2. Naviga nel form
3. Verifica che i tag si attivino correttamente

### 3. GA4 Realtime
1. Vai su GA4 → **Reports** → **Realtime**
2. Esegui un'azione sul sito
3. Verifica che gli eventi appaiano

### 4. Facebook Events Manager
1. Vai su Facebook Events Manager
2. Seleziona il Pixel `1159186469692428`
3. Vai su **Test Events**
4. Verifica che gli eventi appaiano in tempo reale

---

## ⚠️ Note Importanti

### Doppia Configurazione GA4
Attualmente hai GA4 configurato sia:
- Direttamente tramite `gtag.js` in `index.html`
- (Dovrebbe essere) tramite GTM

**Raccomandazione:**
- **Opzione A**: Mantieni entrambi (eventi duplicati, ma funziona)
- **Opzione B**: Rimuovi la configurazione diretta e gestisci tutto tramite GTM (più pulito)

Se scegli l'Opzione B, rimuovi da `index.html`:
```html
<!-- Rimuovi questo -->
<script>
  gtag('config', 'G-CWVFE2B6PJ', {...});
</script>
<script defer src="https://www.googletagmanager.com/gtag/js?id=G-CWVFE2B6PJ"></script>
```

E configura GA4 completamente tramite GTM con un tag di tipo "Google Analytics: GA4 Configuration".

### Doppia Configurazione Google Ads
Stessa situazione: hai Google Ads configurato sia direttamente che (dovrebbe essere) tramite GTM.

**Raccomandazione:** Scegli un metodo e rimuovi l'altro per evitare duplicazioni.

### Doppia Configurazione Facebook Pixel
Facebook Pixel è configurato direttamente in `index.html`. Se vuoi gestirlo tramite GTM, rimuovi lo script da `index.html` e crea un tag "Facebook Pixel" in GTM con trigger "All Pages".

---

## 📋 Checklist Finale

Prima di considerare tutto configurato:

- [ ] Trigger creati per tutti gli eventi principali (Lead, Confirmed, ClickButton, GoBack, Field*)
- [ ] Variabili dataLayer create per tutti i parametri necessari
- [ ] Tag GA4 creati per gli eventi principali
- [ ] Tag Google Ads creato per le conversioni
- [ ] Tag Facebook Pixel creati per gli eventi principali
- [ ] Testato in GTM Preview Mode
- [ ] Verificato che i tag si attivino correttamente
- [ ] Pubblicato la versione in GTM
- [ ] Verificato con Google Tag Assistant
- [ ] Verificato in GA4 Realtime
- [ ] Verificato in Facebook Events Manager

---

## 🆘 Problemi Comuni

### Problema: "Nessun tag è stato valutato"
**Causa:** I trigger non sono configurati o i tag non sono pubblicati
**Soluzione:** 
1. Verifica che i trigger siano creati correttamente
2. Verifica che i tag siano collegati ai trigger giusti
3. Pubblica la versione in GTM

### Problema: Tag non si attivano
**Causa:** Nome evento nel trigger non corrisponde al nome evento nel dataLayer
**Soluzione:** 
1. Controlla il nome esatto dell'evento nel dataLayer (usa la console: `window.dataLayer`)
2. Assicurati che il trigger usi lo stesso nome esatto

### Problema: Variabili non popolate
**Causa:** Nome variabile dataLayer non corrisponde
**Soluzione:**
1. Verifica il nome esatto della variabile nel dataLayer
2. Assicurati che la variabile in GTM usi lo stesso nome

---

**Ultimo aggiornamento:** Guida creata per risolvere il problema "Nessun tag è stato valutato" in GTM
