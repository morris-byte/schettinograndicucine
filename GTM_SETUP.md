# Google Tag Manager - Setup e Configurazione

## 1. Installazione del codice GTM nel sito

### Opzione A: Sostituire gtag.js con GTM (Consigliato)

Se vuoi usare solo GTM per gestire tutti i tag (GA4, Google Ads, Facebook Pixel, ecc.), sostituisci il codice in `index.html`:

**Sostituisci questo:**
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-CWVFE2B6PJ"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-CWVFE2B6PJ');
  gtag('config', 'AW-17544893918');
</script>
```

**Con questo (sostituisci GTM-XXXXXXX con il tuo Container ID):**
```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- End Google Tag Manager -->
```

E aggiungi questo nel `<body>` (subito dopo l'apertura del tag `<body>`):
```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

### Opzione B: Usare GTM insieme a gtag.js (Attuale)

Se vuoi mantenere gtag.js e aggiungere GTM, aggiungi il codice GTM prima del codice gtag.js esistente.

## 2. Ottenere il Container ID GTM

1. Vai su [Google Tag Manager](https://tagmanager.google.com/)
2. Crea un nuovo container o seleziona uno esistente
3. Copia il Container ID (formato: `GTM-XXXXXXX`)
4. Aggiungilo nel file `.env` come variabile d'ambiente:
   ```
   VITE_GTM_CONTAINER_ID=GTM-XXXXXXX
   ```

## 3. Configurazione dei Tag in GTM

Una volta installato GTM, devi configurare i tag per ricevere gli eventi. Gli eventi vengono inviati automaticamente al `dataLayer` con questi nomi:

### Eventi disponibili:

#### Eventi di interazione:
- **ClickButton** - Quando si clicca un pulsante
  - Parametri: `button_name`, `button_location`
  
- **GoBack** - Quando si torna indietro nel form
  - Parametri: `from_step`, `to_step`, `step_name`

#### Eventi di completamento form:
- **Lead** - Quando si invia il form (evento standard)
  - Parametri: `content_name`, `content_category`
  
- **Confirmed** - Quando si conferma l'invio del form
  - Parametri: `restaurant_name`, `is_restaurateur`, `is_in_campania`, `restaurant_zone`, `equipment_type`

#### Eventi di compilazione campi:
- **FieldRestaurateur_Yes** / **FieldRestaurateur_No**
  - Parametri: `field_name`, `field_value`, `step_number`

- **FieldCampania_Yes** / **FieldCampania_No**
  - Parametri: `field_name`, `field_value`, `step_number`

- **FieldZona**
  - Parametri: `field_name`, `field_value`, `step_number`

- **FieldNomeRistorante**
  - Parametri: `field_name`, `field_value`, `step_number`

- **FieldAttrezzatura**
  - Parametri: `field_name`, `field_value`, `step_number`

- **FieldDatiPersonali**
  - Parametri: `field_name`, `field_value`, `step_number`

- **FieldTelefono**
  - Parametri: `field_name`, `field_value`, `step_number`

- **FieldEmail**
  - Parametri: `field_name`, `field_value`, `step_number`

- **FieldCatalogo_Yes** / **FieldCatalogo_No**
  - Parametri: `field_name`, `field_value`, `step_number`

## 4. Creare Trigger in GTM

Per ogni evento, crea un trigger in GTM:

1. Vai su **Trigger** → **Nuovo**
2. Nome: es. "ClickButton Event"
3. Tipo: **Evento personalizzato**
4. Nome evento: `ClickButton` (o il nome dell'evento che vuoi tracciare)
5. Salva

Ripeti per tutti gli eventi che vuoi tracciare.

## 5. Creare Tag in GTM

### Esempio: Tag per Facebook Pixel

1. Vai su **Tag** → **Nuovo**
2. Nome: "Facebook Pixel - ClickButton"
3. Tipo: **Facebook Pixel**
4. Pixel ID: `1159186469692428`
5. Evento: **Evento personalizzato**
6. Nome evento: `ClickButton`
7. Trigger: Seleziona il trigger "ClickButton Event" creato prima
8. Salva

### Esempio: Tag per Google Analytics 4

1. Vai su **Tag** → **Nuovo**
2. Nome: "GA4 - ClickButton"
3. Tipo: **Google Analytics: GA4 Event**
4. Measurement ID: `G-CWVFE2B6PJ`
5. Nome evento: `ClickButton`
6. Parametri evento:
   - `button_name`: `{{button_name}}` (variabile dataLayer)
   - `button_location`: `{{button_location}}` (variabile dataLayer)
7. Trigger: Seleziona il trigger "ClickButton Event"
8. Salva

## 6. Creare Variabili DataLayer

Per usare i parametri degli eventi nei tag, crea variabili:

1. Vai su **Variabili** → **Nuovo**
2. Nome: es. "button_name"
3. Tipo: **Variabile Data Layer**
4. Nome variabile Data Layer: `button_name`
5. Salva

Ripeti per tutti i parametri che vuoi usare:
- `button_name`, `button_location`
- `from_step`, `to_step`, `step_name`
- `restaurant_name`, `is_restaurateur`, ecc.
- `field_name`, `field_value`, `step_number`

## 7. Test degli eventi

### In GTM Preview Mode:
1. Clicca su **Anteprima** in GTM
2. Inserisci l'URL del tuo sito
3. Naviga nel form e compi azioni
4. Verifica che gli eventi appaiano in tempo reale

### Nella console del browser:
1. Apri la console (F12)
2. Naviga nel form
3. Dovresti vedere messaggi come:
   - `✅ GTM: ClickButton event pushed to dataLayer`
   - `✅ GTM: FieldRestaurateur_Yes event pushed to dataLayer`
   - ecc.

### Verifica dataLayer:
Nella console del browser, digita:
```javascript
window.dataLayer
```
Dovresti vedere tutti gli eventi inviati.

## 8. Pubblicare le modifiche

Una volta testato tutto:
1. Vai su **Versione** in GTM
2. Clicca su **Crea versione**
3. Aggiungi un nome e descrizione
4. Clicca su **Pubblica**

## Note importanti:

- Gli eventi vengono inviati automaticamente al `dataLayer` quando vengono tracciati
- Non è necessario modificare il codice JavaScript, tutto è già implementato
- GTM funziona in parallelo con Facebook Pixel e GA4 (non li sostituisce)
- Puoi configurare GTM per inviare eventi a qualsiasi piattaforma (Facebook, Google Ads, LinkedIn, ecc.)

## Vantaggi di usare GTM:

1. **Gestione centralizzata**: Tutti i tag in un unico posto
2. **Nessuna modifica al codice**: Aggiungi/modifica tag senza toccare il codice
3. **Test facile**: Preview mode per testare prima di pubblicare
4. **Versioning**: Gestione delle versioni dei tag
5. **Flessibilità**: Aggiungi nuovi tag senza deploy



