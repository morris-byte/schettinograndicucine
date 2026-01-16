# 🔍 Debug Google Ads - Conversione Non Rilevata

## ❌ Problema

Google Ads non rileva la conversione anche se il tag dovrebbe essere inviato.

## 🔍 Verifica Step-by-Step

### STEP 1: Verifica nella Console

1. Apri il sito: https://schettinograndicucine-ten.vercel.app/
2. Apri la console (F12)
3. Invia un form completo
4. Cerca questi log:
   ```
   🎯 Tracking Google Ads conversion: V9gNCO-S6ZcbEN6rh65B
   📤 Invio conversione Google Ads con config: {...}
   ✅ Google Ads conversion tracked successfully
   ```

**Se NON vedi questi log:**
- Il deploy potrebbe non essere ancora attivo (attendi 2-3 minuti)
- Oppure c'è un errore JavaScript che blocca l'esecuzione

### STEP 2: Verifica Network Tab

1. Apri DevTools (F12) → **Network** tab
2. Filtra per: `google-analytics` o `googleads`
3. Invia un form completo
4. Cerca richieste a:
   - `www.google-analytics.com/g/collect`
   - `www.googletagmanager.com/gtag/js`
   - `googleads.g.doubleclick.net`

**Cosa verificare:**
- ✅ Le richieste vengono inviate
- ✅ Il `send_to` contiene `AW-17544893918/V9gNCO-S6ZcbEN6rh65B`
- ✅ Status code è 200 o 204

### STEP 3: Test Manuale nella Console

Esegui questo comando nella console per testare direttamente:

```javascript
// Verifica che gtag sia disponibile
console.log('gtag disponibile:', typeof window.gtag);

// Test conversione Google Ads
window.gtag('event', 'conversion', {
  send_to: 'AW-17544893918/V9gNCO-S6ZcbEN6rh65B',
  value: 1,
  currency: 'EUR'
});

console.log('✅ Test conversione inviato');
```

**Poi:**
1. Vai su Google Ads → Conversions
2. Clicca su "Invio modulo per i lead"
3. Usa "Test conversione"
4. Verifica se viene rilevata

### STEP 4: Verifica dataLayer

Nella console, esegui:

```javascript
// Vedi tutti gli eventi nel dataLayer
window.dataLayer

// Filtra solo le conversioni
window.dataLayer.filter(item => 
  item[0] === 'event' && item[1] === 'conversion'
)
```

Dovresti vedere eventi con `send_to: 'AW-17544893918/V9gNCO-S6ZcbEN6rh65B'`

---

## 🆘 Problemi Comuni e Soluzioni

### Problema 1: "Non vedo i log nella console"

**Possibili cause:**
1. Deploy non ancora completato
2. Cache del browser (fai Ctrl+F5 per hard refresh)
3. Errore JavaScript che blocca l'esecuzione

**Soluzione:**
1. Attendi 2-3 minuti dopo il deploy
2. Fai hard refresh (Ctrl+F5)
3. Controlla se ci sono errori JavaScript nella console

### Problema 2: "Vedo i log ma non vedo richieste nella Network tab"

**Possibili cause:**
1. gtag non è ancora caricato quando viene chiamato
2. Ad blocker blocca le richieste
3. Privacy tools del browser bloccano il tracking

**Soluzione:**
1. Disabilita ad blocker temporaneamente
2. Verifica che gtag sia caricato: `typeof window.gtag` deve essere `"function"`
3. Prova in modalità incognito

### Problema 3: "Vedo le richieste ma Google Ads non le rileva"

**Possibili cause:**
1. Conversion Label errato
2. Conversion ID errato
3. Google Ads ha un delay (può richiedere fino a 24 ore)
4. La conversione non è configurata correttamente in Google Ads

**Soluzione:**
1. Verifica che il Conversion Label sia esattamente: `V9gNCO-S6ZcbEN6rh65B`
2. Verifica che il Conversion ID sia: `AW-17544893918`
3. Attendi 10-30 minuti (Google Ads può avere delay)
4. Verifica in Google Ads che la conversione "Invio modulo per i lead" esista e sia attiva

### Problema 4: "gtag non è disponibile"

**Possibili cause:**
1. Script GA4 non caricato
2. Script bloccato da ad blocker
3. Errore nel caricamento dello script

**Soluzione:**
1. Verifica in `index.html` che lo script GA4 sia presente
2. Controlla la Network tab che `gtag/js?id=G-CWVFE2B6PJ` venga caricato
3. Disabilita ad blocker
4. Verifica che non ci siano errori JavaScript

---

## 🧪 Test Completo

Esegui questo test completo nella console:

```javascript
// 1. Verifica gtag
console.log('1. gtag disponibile:', typeof window.gtag);

// 2. Verifica dataLayer
console.log('2. dataLayer:', window.dataLayer);

// 3. Test conversione
if (window.gtag) {
  window.gtag('event', 'conversion', {
    send_to: 'AW-17544893918/V9gNCO-S6ZcbEN6rh65B',
    value: 1,
    currency: 'EUR'
  });
  console.log('3. ✅ Test conversione inviato');
} else {
  console.error('3. ❌ gtag non disponibile');
}

// 4. Verifica dataLayer dopo l'invio
setTimeout(() => {
  console.log('4. dataLayer dopo invio:', window.dataLayer);
  const conversions = window.dataLayer.filter(item => 
    item[0] === 'event' && item[1] === 'conversion'
  );
  console.log('5. Conversioni nel dataLayer:', conversions);
}, 1000);
```

---

## 📊 Verifica in Google Ads

### Metodo 1: Tag Assistant

1. Vai su Google Ads → Conversions
2. Clicca su "Invio modulo per i lead"
3. Clicca su "Test conversione" o usa Tag Assistant
4. Naviga sul sito e invia un form
5. Attendi 10-30 secondi
6. Verifica se viene rilevata

### Metodo 2: Verifica Conversioni

1. Vai su Google Ads → Conversions
2. Clicca su "Invio modulo per i lead"
3. Vai su "Conversioni" tab
4. Verifica se ci sono conversioni registrate (può richiedere fino a 24 ore)

### Metodo 3: Google Ads Editor

1. Apri Google Ads Editor
2. Vai su Tools → Conversions
3. Verifica che la conversione sia attiva e configurata correttamente

---

## ✅ Checklist Debug

Prima di considerare risolto, verifica:

- [ ] Console mostra log: `🎯 Tracking Google Ads conversion: V9gNCO-S6ZcbEN6rh65B`
- [ ] Console mostra log: `✅ Google Ads conversion tracked successfully`
- [ ] Network tab mostra richieste a Google Analytics/Google Ads
- [ ] La richiesta contiene `send_to: 'AW-17544893918/V9gNCO-S6ZcbEN6rh65B'`
- [ ] `typeof window.gtag` restituisce `"function"`
- [ ] dataLayer contiene eventi di conversione
- [ ] Test manuale nella console funziona
- [ ] Google Ads Tag Assistant rileva la conversione (dopo 10-30 secondi)

---

## 🔧 Fix Immediato

Se gli eventi non vengono inviati, prova questo nella console:

```javascript
// Forza invio conversione
if (window.gtag) {
  window.gtag('event', 'conversion', {
    send_to: 'AW-17544893918/V9gNCO-S6ZcbEN6rh65B',
    value: 1,
    currency: 'EUR',
    transaction_id: 'test_' + Date.now()
  });
  console.log('✅ Conversione forzata inviata');
} else {
  console.error('❌ gtag non disponibile');
}
```

Poi verifica in Google Ads se viene rilevata.

---

**Se dopo tutti questi test Google Ads ancora non rileva la conversione, potrebbe essere un problema di configurazione in Google Ads stesso (conversione non attiva, label errato, ecc.)**
