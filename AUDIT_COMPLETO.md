# 🔍 Audit Completo del Sito - Schettino Grandi Cucine

**Data Audit**: $(date)  
**Versione**: 1.0

---

## 🚨 PROBLEMI CRITICI (Priorità ALTA)

### 1. **API Key Hardcoded nel Codice Sorgente**
**File**: `src/config/email.ts:13`  
**Severità**: 🔴 **CRITICA**  
**Problema**: 
```typescript
apiKey: import.meta.env.VITE_RESEND_API_KEY || 're_XbAxcgBZ_v8dtrGz2R2XBmGxBnrbBsMkv',
```
L'API key di Resend è hardcoded come fallback. Se il bundle viene esposto pubblicamente, l'API key è visibile a chiunque.

**Impatto**: 
- Possibile abuso dell'API key
- Costi non autorizzati
- Violazione della sicurezza

**Soluzione**:
- Rimuovere completamente il fallback hardcoded
- Usare solo variabili d'ambiente
- Verificare che non sia nel bundle finale
- Implementare validazione che fallisce se manca la key

---

### 2. **CORS Troppo Permissivo**
**File**: `supabase/functions/send-test-email/index.ts:6-10`  
**Severità**: 🔴 **CRITICA**  
**Problema**:
```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  ...
};
```
CORS configurato per accettare richieste da qualsiasi origine (`*`).

**Impatto**:
- Possibili attacchi CSRF
- Abuso dell'endpoint da siti esterni
- Spam email

**Soluzione**:
- Limitare a domini specifici
- Usare whitelist di domini consentiti
- Implementare validazione origin

---

### 3. **XSS Potenziale nell'Email HTML**
**File**: `supabase/functions/send-test-email/index.ts:66-142`  
**Severità**: 🔴 **CRITICA**  
**Problema**: I dati dell'utente vengono inseriti direttamente nell'HTML senza sanitizzazione:
```typescript
<span>${leadData.firstName} ${leadData.lastName}</span>
<span>${leadData.email}</span>
```

**Impatto**:
- Se un utente malintenzionato inserisce script nell'email, potrebbero essere eseguiti
- Possibile compromissione delle email dei commerciali

**Soluzione**:
- Sanitizzare tutti gli input prima dell'inserimento
- Usare librerie come `DOMPurify` o escape HTML
- Validare e limitare la lunghezza dei campi

---

### 4. **Supabase Client Senza Validazione**
**File**: `src/integrations/supabase/client.ts:10`  
**Severità**: 🟠 **ALTA**  
**Problema**: Il client Supabase viene creato anche se le variabili d'ambiente sono `undefined`:
```typescript
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {...});
```

**Impatto**:
- Errori runtime se le variabili mancano
- Comportamento imprevedibile

**Soluzione**:
- Validare che le variabili esistano prima di creare il client
- Lanciare errori chiari se mancano

---

## ⚠️ PROBLEMI DI SICUREZZA (Priorità MEDIA-ALTA)

### 5. **Webhook URL Hardcoded**
**File**: `src/components/MultiStepForm.tsx:250`  
**Severità**: 🟠 **MEDIA**  
**Problema**: URL webhook Make hardcoded nel codice:
```typescript
const makeWebhookUrl = "https://hook.eu2.make.com/dbeari9w8c7p9ft1dhizsuvrd2a98gqi";
```

**Impatto**:
- Difficile cambiare endpoint senza deploy
- URL esposto nel bundle

**Soluzione**:
- Spostare in variabile d'ambiente
- Usare `import.meta.env.VITE_MAKE_WEBHOOK_URL`

---

### 6. **Mancanza di Rate Limiting**
**File**: `src/components/MultiStepForm.tsx:222`  
**Severità**: 🟠 **MEDIA**  
**Problema**: Nessuna protezione contro invii multipli rapidi del form.

**Impatto**:
- Possibile spam
- Costi non necessari
- Degrado performance

**Soluzione**:
- Implementare debounce sul submit
- Aggiungere rate limiting lato client
- Implementare rate limiting lato server

---

### 7. **Email Addresses Hardcoded**
**File**: `src/config/email.ts:2-9`, `supabase/functions/send-test-email/index.ts:40-46`  
**Severità**: 🟡 **MEDIA-BASSA**  
**Problema**: Email dei commerciali hardcoded in più posti.

**Impatto**:
- Difficile manutenzione
- Duplicazione codice

**Soluzione**:
- Centralizzare in un'unica configurazione
- Usare variabili d'ambiente

---

## 🐛 BUG FUNZIONALI

### 8. **Bug nella Formattazione Telefono**
**File**: `src/components/form-steps/Step7PhoneNumber.tsx:37`  
**Severità**: 🟠 **MEDIA**  
**Problema**: 
```typescript
onInputChange('phoneNumber', formatted.replace('+39', ''));
```
Rimuove `+39` ma poi `formatPhoneNumber` lo riaggiunge, creando inconsistenza.

**Impatto**:
- Possibile confusione nel valore del campo
- Validazione potrebbe fallire

**Soluzione**:
- Correggere la logica di formattazione
- Assicurarsi che il valore sia sempre consistente

---

### 9. **Validazione Email Inline Non Mostra Errore**
**File**: `src/components/MultiStepForm.tsx:169-178`  
**Severità**: 🟡 **BASSA**  
**Problema**: La validazione email mostra un toast ma non impedisce la continuazione se l'email è invalida.

**Impatto**:
- UX confusa
- Possibile invio con email invalida

**Soluzione**:
- Mostrare errore visivo nel campo
- Disabilitare il bottone "Avanti" se email invalida

---

### 10. **Race Condition nel Submit**
**File**: `src/components/MultiStepForm.tsx:222-223`  
**Severità**: 🟡 **BASSA**  
**Problema**: Anche se c'è `isSubmitting`, un utente molto veloce potrebbe cliccare più volte prima che lo stato si aggiorni.

**Impatto**:
- Invii duplicati
- Spam

**Soluzione**:
- Aggiungere debounce
- Disabilitare immediatamente il bottone
- Usare `useRef` per tracking immediato

---

### 11. **Autofill Detection Troppo Aggressivo**
**File**: `src/hooks/useFormAutofill.ts:107-114`  
**Severità**: 🟡 **BASSA**  
**Problema**: Multiple chiamate `setTimeout` e `setInterval` che potrebbero causare performance issues:
```typescript
const timers = [
  setTimeout(() => { autoFillForm(); checkPhoneAutofill(); }, 100),
  setTimeout(() => { autoFillForm(); checkPhoneAutofill(); }, 300),
  setTimeout(() => { autoFillForm(); checkPhoneAutofill(); }, 500),
  setTimeout(() => { autoFillForm(); checkPhoneAutofill(); }, 1000),
  setTimeout(() => checkPhoneAutofill(), 1500),
  setTimeout(() => checkPhoneAutofill(), 2000),
];
```

**Impatto**:
- Performance degradation
- Consumo eccessivo di risorse
- Possibili memory leaks

**Soluzione**:
- Ottimizzare la logica di detection
- Usare un unico interval invece di multiple setTimeout
- Implementare debounce

---

## 📊 PROBLEMI DI PERFORMANCE

### 12. **Troppi Console.log in Produzione**
**File**: `src/config/analytics.ts` (84 occorrenze)  
**Severità**: 🟡 **MEDIA**  
**Problema**: Centinaia di `console.log` che vengono eseguiti anche in produzione.

**Impatto**:
- Performance degradation
- Bundle size più grande
- Console cluttered
- Possibile leak di informazioni

**Soluzione**:
- Usare il logger esistente (`src/utils/logger.ts`)
- Sostituire tutti i `console.log` con `logger.log`
- Verificare che in produzione non vengano eseguiti

---

### 13. **Mancanza di Code Splitting**
**File**: `src/main.tsx`, `vite.config.ts`  
**Severità**: 🟡 **MEDIA**  
**Problema**: Tutto il codice viene caricato in un unico bundle.

**Impatto**:
- Tempo di caricamento iniziale più lungo
- Bundle size grande
- Poor Core Web Vitals

**Soluzione**:
- Implementare lazy loading per route
- Code splitting per componenti pesanti
- Dynamic imports per analytics

---

### 14. **Tracking Script Caricati Sincronamente**
**File**: `index.html:12-34`  
**Severità**: 🟡 **MEDIA**  
**Problema**: Google Tag Manager, GA4, e Facebook Pixel caricati tutti in modo sincrono nel `<head>`.

**Impatto**:
- Blocca il rendering della pagina
- Aumenta Time to Interactive (TTI)
- Poor Lighthouse score

**Soluzione**:
- Caricare script in modo asincrono
- Usare `defer` o `async`
- Implementare lazy loading per tracking

---

### 15. **QueryClient Senza Configurazione**
**File**: `src/App.tsx:9`  
**Severità**: 🟡 **BASSA**  
**Problema**: QueryClient creato senza configurazione:
```typescript
const queryClient = new QueryClient();
```

**Impatto**:
- Nessun retry policy
- Nessun timeout
- Cache non ottimizzata

**Soluzione**:
- Configurare retry, timeout, e cache policy
- Ottimizzare per il caso d'uso

---

## 🔧 PROBLEMI DI QUALITÀ DEL CODICE

### 16. **TypeScript Strict Mode Disabilitato**
**File**: `tsconfig.json:9-14`, `tsconfig.app.json:18-22`  
**Severità**: 🟡 **MEDIA**  
**Problema**:
```json
"strict": false,
"noImplicitAny": false,
"strictNullChecks": false,
"noUnusedLocals": false,
"noUnusedParameters": false
```

**Impatto**:
- Bug nascosti
- Meno type safety
- Refactoring più rischioso
- Codice meno manutenibile

**Soluzione**:
- Abilitare gradualmente strict mode
- Iniziare con `strictNullChecks: true`
- Risolvere i warning uno alla volta

---

### 17. **Mancanza di Error Boundaries**
**File**: `src/App.tsx`  
**Severità**: 🟠 **MEDIA**  
**Problema**: Nessun error boundary React per catturare errori nei componenti.

**Impatto**:
- Se un componente crasha, l'intera app si rompe
- Nessun fallback UI
- Poor UX

**Soluzione**:
- Implementare error boundaries
- Mostrare UI di fallback friendly
- Loggare errori per debugging

---

### 18. **Inconsistenza nella Gestione Errori**
**File**: Vari file  
**Severità**: 🟡 **MEDIA**  
**Problema**: Alcuni errori vengono loggati, altri no. Alcuni mostrano toast, altri no.

**Impatto**:
- UX inconsistente
- Difficile debugging
- Errori silenziosi

**Soluzione**:
- Standardizzare la gestione errori
- Creare un sistema centralizzato
- Assicurarsi che tutti gli errori siano tracciati

---

### 19. **File Non Utilizzato**
**File**: `src/api/sendEmail.ts`  
**Severità**: 🟡 **BASSA**  
**Problema**: Il file `sendEmail.ts` esiste ma non viene utilizzato. Il form usa direttamente il fetch a Supabase.

**Impatto**:
- Codice morto
- Confusione
- Manutenzione inutile

**Soluzione**:
- Rimuovere il file se non serve
- O utilizzarlo se era l'intenzione originale

---

### 20. **Mancanza di Validazione Input Lato Client**
**File**: Vari form steps  
**Severità**: 🟡 **MEDIA**  
**Problema**: Alcuni campi non hanno validazione real-time o validazione insufficiente.

**Impatto**:
- Possibile invio di dati invalidi
- Poor UX
- Errori solo dopo submit

**Soluzione**:
- Aggiungere validazione real-time
- Mostrare errori inline
- Usare schema validation (Zod già presente)

---

## 🌐 PROBLEMI SEO E ACCESSIBILITÀ

### 21. **Language Attribute Errato**
**File**: `index.html:2`  
**Severità**: 🟡 **MEDIA**  
**Problema**: 
```html
<html lang="en">
```
Il sito è in italiano ma il lang è "en".

**Impatto**:
- SEO negativo
- Screen reader potrebbero usare pronuncia sbagliata
- Browser potrebbero suggerire traduzioni errate

**Soluzione**:
- Cambiare in `lang="it"`

---

### 22. **Mancanza di Meta Description Ottimizzata**
**File**: `index.html:40`  
**Severità**: 🟡 **BASSA**  
**Problema**: Meta description generica, potrebbe essere più specifica e keyword-rich.

**Impatto**:
- SEO non ottimale
- CTR più basso nei risultati di ricerca

**Soluzione**:
- Ottimizzare con keyword rilevanti
- Aggiungere location (Campania)
- Rendere più accattivante

---

### 23. **Mancanza di ARIA Labels in Alcuni Posti**
**File**: `src/components/MultiStepForm.tsx:444-480`  
**Severità**: 🟡 **BASSA**  
**Problema**: I bottoni degli step indicator hanno `aria-label` ma potrebbero essere migliorati.

**Impatto**:
- Accessibilità non ottimale
- Screen reader potrebbero non descrivere bene

**Soluzione**:
- Migliorare ARIA labels
- Aggiungere `aria-describedby` dove necessario
- Testare con screen reader

---

## 🔄 PROBLEMI DI ARCHITETTURA

### 24. **Duplicazione Logica Email**
**File**: `src/services/emailService.ts`, `supabase/functions/send-test-email/index.ts`  
**Severità**: 🟡 **MEDIA**  
**Problema**: Logica per inviare email duplicata in due posti diversi.

**Impatto**:
- Manutenzione difficile
- Inconsistenza possibile
- Bug fixing duplicato

**Soluzione**:
- Centralizzare la logica
- Usare un unico endpoint
- Eliminare duplicazione

---

### 25. **Mancanza di Environment Validation**
**File**: Vari file  
**Severità**: 🟡 **MEDIA**  
**Problema**: Le variabili d'ambiente vengono usate senza validazione all'avvio.

**Impatto**:
- Errori runtime se mancano
- Difficile debugging
- Comportamento imprevedibile

**Soluzione**:
- Creare file di validazione env
- Validare all'avvio dell'app
- Mostrare errori chiari se mancano

---

### 26. **Hardcoded Supabase URL**
**File**: `src/components/MultiStepForm.tsx:286`  
**Severità**: 🟡 **MEDIA**  
**Problema**: URL Supabase hardcoded:
```typescript
const emailResponse = await fetch('https://laxbglhrrcbrxpnpvcob.supabase.co/functions/v1/send-test-email', {...});
```

**Impatto**:
- Difficile cambiare endpoint
- URL esposto nel bundle

**Soluzione**:
- Spostare in variabile d'ambiente
- Usare `import.meta.env.VITE_SUPABASE_FUNCTION_URL`

---

## 📝 RACCOMANDAZIONI GENERALI

### 27. **Aggiungere Testing**
**Severità**: 🟡 **MEDIA**  
**Problema**: Nessun test presente nel progetto.

**Impatto**:
- Difficile refactoring sicuro
- Bug potrebbero essere introdotti facilmente
- Nessuna confidence nei cambiamenti

**Soluzione**:
- Aggiungere unit tests per utility functions
- Aggiungere integration tests per form flow
- Aggiungere E2E tests per critical paths

---

### 28. **Documentazione Codice**
**Severità**: 🟡 **BASSA**  
**Problema**: Poca documentazione inline nel codice.

**Impatto**:
- Difficile onboarding nuovi sviluppatori
- Logica complessa non documentata

**Soluzione**:
- Aggiungere JSDoc comments
- Documentare funzioni complesse
- Aggiungere README per setup

---

### 29. **Mancanza di Monitoring/Error Tracking**
**Severità**: 🟡 **MEDIA**  
**Problema**: Nessun servizio di error tracking (Sentry, LogRocket, etc.).

**Impatto**:
- Errori in produzione non tracciati
- Difficile debugging
- Nessuna visibilità su problemi reali

**Soluzione**:
- Integrare Sentry o simile
- Tracciare errori JavaScript
- Monitorare performance

---

### 30. **Ottimizzazione Immagini**
**Severità**: 🟡 **BASSA**  
**Problema**: Immagini potrebbero non essere ottimizzate (non verificato ma comune).

**Impatto**:
- Tempi di caricamento più lunghi
- Consumo bandwidth inutile

**Soluzione**:
- Usare formati moderni (WebP, AVIF)
- Implementare lazy loading
- Ottimizzare dimensioni

---

## 📊 RIEPILOGO PRIORITÀ

### 🔴 CRITICO (Risolvere IMMEDIATAMENTE)
1. API Key hardcoded
2. CORS troppo permissivo
3. XSS potenziale nell'email
4. Supabase client senza validazione

### 🟠 ALTA (Risolvere PRIMA POSSIBILE)
5. Webhook URL hardcoded
6. Rate limiting mancante
7. TypeScript strict mode
8. Error boundaries mancanti
9. Bug formattazione telefono

### 🟡 MEDIA (Risolvere QUANDO POSSIBILE)
10. Console.log in produzione
11. Code splitting
12. Tracking scripts sincroni
13. Duplicazione logica email
14. Environment validation
15. Testing mancante

### 🟢 BASSA (Miglioramenti)
16. Meta description SEO
17. ARIA labels
18. Documentazione codice
19. Monitoring
20. Ottimizzazione immagini

---

## ✅ CHECKLIST DI RISOLUZIONE

- [ ] Rimuovere API key hardcoded
- [ ] Limitare CORS
- [ ] Sanitizzare input email
- [ ] Validare variabili d'ambiente
- [ ] Spostare URL hardcoded in env
- [ ] Implementare rate limiting
- [ ] Correggere bug telefono
- [ ] Sostituire console.log con logger
- [ ] Abilitare TypeScript strict mode gradualmente
- [ ] Aggiungere error boundaries
- [ ] Implementare code splitting
- [ ] Ottimizzare tracking scripts
- [ ] Cambiare lang="it"
- [ ] Aggiungere testing
- [ ] Integrare error tracking

---

**Totale Problemi Trovati**: 30  
**Critici**: 4  
**Alta Priorità**: 5  
**Media Priorità**: 12  
**Bassa Priorità**: 9
