# 🧪 Test Google Ads - Comandi Console

## Test Immediato nella Console

Apri la console (F12) e esegui questi comandi uno alla volta:

### 1. Verifica Setup Base

```javascript
// Verifica gtag
console.log('gtag disponibile:', typeof window.gtag);
console.log('gtag è function:', typeof window.gtag === 'function');

// Verifica dataLayer
console.log('dataLayer:', window.dataLayer);
console.log('dataLayer length:', window.dataLayer?.length);
```

### 2. Test Conversione Diretta

```javascript
// Test conversione Google Ads
if (window.gtag) {
  window.gtag('event', 'conversion', {
    send_to: 'AW-17544893918/V9gNCO-S6ZcbEN6rh65B',
    value: 1,
    currency: 'EUR',
    transaction_id: 'test_' + Date.now()
  });
  console.log('✅ Test conversione inviata');
  console.log('🔍 Verifica nella Network tab che la richiesta venga inviata');
} else {
  console.error('❌ gtag non disponibile!');
}
```

### 3. Verifica Richiesta nella Network Tab

1. Apri DevTools (F12) → **Network** tab
2. Filtra per: `google` o `gtag`
3. Esegui il test sopra
4. Cerca richieste a `www.google-analytics.com` o `www.googletagmanager.com`
5. Clicca sulla richiesta e verifica:
   - **Payload** contiene `send_to=AW-17544893918%2FV9gNCO-S6ZcbEN6rh65B`
   - **Status** è 200 o 204

### 4. Verifica dataLayer

```javascript
// Vedi tutte le conversioni nel dataLayer
const conversions = window.dataLayer.filter(item => {
  if (Array.isArray(item) && item[0] === 'event' && item[1] === 'conversion') {
    return true;
  }
  if (item.event === 'conversion') {
    return true;
  }
  return false;
});

console.log('Conversioni nel dataLayer:', conversions);
```

### 5. Test Completo con Logging

```javascript
// Test completo con logging dettagliato
console.log('=== TEST GOOGLE ADS CONVERSION ===');
console.log('1. gtag disponibile:', typeof window.gtag);
console.log('2. Conversion ID: AW-17544893918');
console.log('3. Conversion Label: V9gNCO-S6ZcbEN6rh65B');

if (window.gtag) {
  const config = {
    send_to: 'AW-17544893918/V9gNCO-S6ZcbEN6rh65B',
    value: 1,
    currency: 'EUR',
    transaction_id: 'manual_test_' + Date.now()
  };
  
  console.log('4. Config conversione:', config);
  
  window.gtag('event', 'conversion', config);
  
  console.log('5. ✅ Conversione inviata');
  console.log('6. 🔍 Verifica Network tab per richiesta a Google Ads');
  
  // Verifica dopo 1 secondo
  setTimeout(() => {
    const recentEvents = window.dataLayer.slice(-5);
    console.log('7. Ultimi 5 eventi nel dataLayer:', recentEvents);
  }, 1000);
} else {
  console.error('❌ gtag non disponibile - verifica che lo script GA4 sia caricato');
}
```

---

## 🔍 Verifica in Google Ads

Dopo aver eseguito il test:

1. Vai su [Google Ads](https://ads.google.com/)
2. Vai su **Tools & Settings** → **Conversions**
3. Clicca su **"Invio modulo per i lead"**
4. Clicca su **"Test conversione"** (o usa Tag Assistant)
5. Attendi 10-30 secondi
6. Verifica se viene rilevata

---

## ⚠️ Se Non Funziona

### Problema: "gtag non disponibile"

**Soluzione:**
1. Verifica in `index.html` che lo script GA4 sia presente
2. Controlla Network tab che `gtag/js?id=G-CWVFE2B6PJ` venga caricato
3. Disabilita ad blocker
4. Fai hard refresh (Ctrl+F5)

### Problema: "Vedo la richiesta ma Google Ads non la rileva"

**Possibili cause:**
1. Conversion Label errato in Google Ads
2. Conversione non attiva in Google Ads
3. Delay di Google Ads (può richiedere fino a 24 ore)

**Soluzione:**
1. Verifica in Google Ads che il Conversion Label sia esattamente: `V9gNCO-S6ZcbEN6rh65B`
2. Verifica che la conversione sia **attiva** e **pubblicata**
3. Attendi 10-30 minuti e riprova

---

## 📋 Checklist

- [ ] `typeof window.gtag` restituisce `"function"`
- [ ] Test conversione nella console funziona
- [ ] Network tab mostra richiesta a Google Analytics
- [ ] La richiesta contiene `send_to=AW-17544893918%2FV9gNCO-S6ZcbEN6rh65B`
- [ ] Google Ads Tag Assistant rileva la conversione (dopo 10-30 secondi)
