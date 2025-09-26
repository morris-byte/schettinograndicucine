# 🧪 **Test di Tracking - Acquisizioni Contatto**

## 🚨 **Problema Risolto**

**PRIMA**: Manca Google Analytics 4 per tracciare le acquisizioni
**DOPO**: GA4 configurato con eventi `generate_lead` per conversioni

## ✅ **Configurazione Corretta**

### **1. Google Analytics 4**
- **ID**: `G-Y5B86LG05F`
- **Evento**: `generate_lead` (per acquisizioni)
- **Parametri**: Nome ristorante, zona, tipo attrezzatura

### **2. Google Ads**
- **ID**: `AW-17544893918`
- **Conversione**: `preventivo_form`
- **Valore**: 1.0 EUR

### **3. Meta Pixel**
- **ID**: `1073356054528227`
- **Evento**: `Lead`
- **Dati**: Informazioni form complete

## 🧪 **Test da Eseguire**

### **Test 1: Verifica Script Caricamento**
```javascript
// Apri Console Browser e esegui:
console.log('GA4:', typeof window.gtag);
console.log('Meta:', typeof window.fbq);
console.log('DataLayer:', window.dataLayer);
```

### **Test 2: Test Evento Lead**
```javascript
// Simula invio form:
window.gtag('event', 'generate_lead', {
  event_category: 'engagement',
  event_label: 'test_lead',
  value: 1.0,
  currency: 'EUR',
  transaction_id: 'test_' + Date.now()
});
```

### **Test 3: Verifica in GA4**
1. Vai su [Google Analytics](https://analytics.google.com)
2. Seleziona proprietà `G-Y5B86LG05F`
3. **Eventi** > **Tutti gli eventi**
4. Cerca `generate_lead`

### **Test 4: Verifica in Google Ads**
1. Vai su [Google Ads](https://ads.google.com)
2. **Strumenti** > **Conversioni**
3. Verifica `preventivo_form`

### **Test 5: Verifica Meta Pixel**
1. Vai su [Meta Business Manager](https://business.facebook.com)
2. **Eventi** > **Test Eventi**
3. Inserisci URL sito
4. Compila form e verifica eventi

## 🔍 **Debug Console**

### **Comandi per Debug**
```javascript
// Verifica GA4
gtag('event', 'page_view', {page_title: 'Test Page'});

// Verifica Meta Pixel
fbq('track', 'PageView');

// Verifica DataLayer
console.log(window.dataLayer);
```

## 📊 **Eventi Tracciati**

### **Eventi Automatici**
- ✅ `page_view` (GA4)
- ✅ `PageView` (Meta)

### **Eventi Form**
- ✅ `generate_lead` (GA4) - **ACQUISIZIONI**
- ✅ `conversion` (Google Ads)
- ✅ `Lead` (Meta)

### **Eventi Interazione**
- ✅ `form_step` (GA4)
- ✅ `ButtonClick` (Meta)

## 🚀 **Deploy e Test**

### **1. Deploy Aggiornamenti**
```bash
git add .
git commit -m "Fix GA4 tracking for lead generation"
git push origin main
```

### **2. Test Live**
1. Vai su `https://schettinograndicucine.lovable.app`
2. Compila il form completo
3. Verifica eventi in GA4 (5-10 minuti)

### **3. Verifica Acquisizioni**
- **GA4**: Eventi > generate_lead
- **Google Ads**: Conversioni > preventivo_form
- **Meta**: Eventi > Lead

## ✅ **Checklist Test**

- [ ] Script GA4 caricato correttamente
- [ ] Evento `generate_lead` inviato
- [ ] Conversione Google Ads registrata
- [ ] Lead Meta Pixel tracciato
- [ ] Dati form inclusi negli eventi
- [ ] Test su sito live completato

## 🆘 **Se Non Funziona**

### **Problemi Comuni**
1. **GA4 non carica**: Verifica ID `G-Y5B86LG05F`
2. **Eventi non inviati**: Controlla console per errori
3. **Dati mancanti**: Verifica parametri custom_parameters

### **Debug Avanzato**
```javascript
// Forza invio evento
gtag('event', 'generate_lead', {
  event_category: 'engagement',
  event_label: 'manual_test',
  value: 1.0,
  currency: 'EUR'
});
```

---

**Status**: ✅ **RISOLTO** - GA4 configurato per acquisizioni contatto
**Test**: 🧪 **IN CORSO** - Verifica eventi in GA4
