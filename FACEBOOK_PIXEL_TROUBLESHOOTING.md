# Facebook Pixel - Risoluzione Problemi

## Problema: Pixel visibile su Meta Pixel Helper ma non su Gestione Inserzioni

### Possibili cause e soluzioni:

#### 1. **Tempo di propagazione**
- Il pixel può richiedere fino a **20-30 minuti** per apparire su Gestione Inserzioni dopo l'installazione
- **Soluzione**: Attendi almeno 30 minuti e ricontrolla

#### 2. **Verifica installazione corretta**
- Apri la console del browser (F12) e verifica che non ci siano errori
- Controlla che `window.fbq` sia disponibile digitando `window.fbq` nella console
- Verifica che il pixel ID sia corretto: `1159186469692428`

#### 3. **Verifica eventi tracciati**
Gli eventi personalizzati implementati sono:
- **ClickButton**: Tracciato quando si clicca un pulsante nel form
- **GoBack**: Tracciato quando si torna indietro nel form
- **Confirmed**: Tracciato quando si invia il lead (form submission)
- **Lead**: Evento standard Facebook tracciato quando si invia il lead

#### 4. **Test degli eventi**
Per verificare che gli eventi vengano inviati:
1. Apri la console del browser (F12)
2. Naviga nel form e compi azioni (clicca pulsanti, torna indietro, invia form)
3. Dovresti vedere messaggi di log come:
   - `✅ Facebook Pixel: ClickButton event tracked`
   - `✅ Facebook Pixel: GoBack event tracked`
   - `✅ Facebook Pixel: Lead and Confirmed events tracked`

#### 5. **Verifica su Meta Pixel Helper**
- Installa l'estensione [Meta Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) per Chrome
- Visita il sito e verifica che il pixel sia rilevato
- Controlla che gli eventi vengano inviati correttamente

#### 6. **Verifica su Gestione Inserzioni**
1. Vai su [Gestione Inserzioni di Facebook](https://business.facebook.com/events_manager2)
2. Seleziona il pixel `1159186469692428`
3. Vai alla sezione "Test Events" per vedere gli eventi in tempo reale
4. Vai alla sezione "Overview" per vedere lo stato del pixel

#### 7. **Se il pixel non appare ancora**
- Verifica che il codice del pixel sia presente in `index.html`
- Controlla che non ci siano errori JavaScript che bloccano il caricamento
- Verifica che il sito non blocchi script di terze parti (ad blocker, privacy settings)
- Prova in modalità incognito per escludere estensioni del browser

#### 8. **Eventi personalizzati su Facebook**
Gli eventi personalizzati (ClickButton, GoBack, Confirmed) possono richiedere fino a 24 ore per apparire su Gestione Inserzioni. Per vederli:
1. Vai su Gestione Inserzioni → Pixel → Test Events
2. Gli eventi personalizzati appariranno con il nome che hai dato loro

### Eventi implementati:

#### ClickButton
- **Quando**: Ogni volta che si clicca un pulsante nel form
- **Parametri**: `button_name`, `button_location`

#### GoBack
- **Quando**: Quando si torna indietro nel form
- **Parametri**: `from_step`, `to_step`, `step_name`

#### Confirmed
- **Quando**: Quando si invia con successo il form (lead)
- **Parametri**: `restaurant_name`, `is_restaurateur`, `is_in_campania`, `restaurant_zone`, `equipment_type`

#### Lead (evento standard)
- **Quando**: Quando si invia con successo il form (lead)
- **Parametri**: `content_name`, `content_category`

### Note importanti:
- Gli eventi vengono tracciati automaticamente quando si usano le funzioni esistenti (`trackButtonClick`, `trackBackButton`, `trackFormSubmission`)
- Il tracking funziona sia per Google Analytics che per Facebook Pixel
- Tutti gli eventi includono logging nella console per il debug




