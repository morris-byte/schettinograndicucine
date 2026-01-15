# 🔧 Fix CORS - Deploy Funzione Supabase

## ❌ Problema

L'errore CORS nella console indica che la funzione Supabase `send-test-email` non risponde correttamente alle richieste dal dominio Vercel.

**Errore:**
```
Access to fetch at 'https://zflhbbftpasyfqusoibs.supabase.co/functions/v1/send-test-email' 
from origin 'https://schettinograndicucine-ten.vercel.app' 
has been blocked by CORS policy
```

## ✅ Soluzione

La funzione esiste già nel progetto e ha i CORS headers configurati. Deve essere **deployata** su Supabase.

---

## 🚀 Deploy della Funzione Supabase

### Opzione 1: Deploy da Terminale (Consigliato)

1. **Installa Supabase CLI** (se non l'hai già):
   ```bash
   npm install -g supabase
   ```

2. **Login a Supabase**:
   ```bash
   supabase login
   ```

3. **Collega il progetto**:
   ```bash
   supabase link --project-ref zflhbbftpasyfqusoibs
   ```

4. **Deploy della funzione**:
   ```bash
   supabase functions deploy send-test-email
   ```

### Opzione 2: Deploy da Supabase Dashboard

1. Vai su [Supabase Dashboard](https://supabase.com/dashboard)
2. Seleziona il progetto `zflhbbftpasyfqusoibs`
3. Vai su **Edge Functions** (NON Database Functions!)
4. Clicca su **Create a new function**
5. Nome: `send-test-email`
6. Copia il contenuto da `supabase/functions/send-test-email/index.ts`
7. Incolla nel codice della funzione
8. Clicca su **Deploy**

---

## 🔍 Verifica CORS Headers

La funzione ha già i CORS headers configurati correttamente:

```typescript
const ALLOWED_ORIGINS = [
  "https://schettinograndicucine-ten.vercel.app",
  "https://schettinograndicucine.it",
  "http://localhost:8080",
  "http://localhost:5173",
];
```

Se dopo il deploy il problema persiste, verifica che:
1. Il dominio `https://schettinograndicucine-ten.vercel.app` sia nella lista `ALLOWED_ORIGINS` ✅ (già presente)
2. La funzione gestisca le richieste OPTIONS (preflight) ✅ (già configurato)

---

## 📋 Checklist

- [ ] Funzione `send-test-email` deployata su Supabase
- [ ] CORS headers configurati correttamente
- [ ] Dominio Vercel nella lista ALLOWED_ORIGINS
- [ ] Test invio form funziona senza errori CORS
- [ ] Email di notifica ricevuta correttamente

---

## 🆘 Se il Problema Persiste

### Verifica che la funzione sia deployata:

1. Vai su Supabase Dashboard → Edge Functions
2. Verifica che `send-test-email` sia presente
3. Clicca sulla funzione e verifica il codice

### Test manuale della funzione:

Apri la console del browser e esegui:
```javascript
fetch('https://zflhbbftpasyfqusoibs.supabase.co/functions/v1/send-test-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({})
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

Se vedi un errore CORS, la funzione non è deployata correttamente o i CORS headers non sono configurati.

---

## ⚠️ Nota Importante

**Gli eventi analytics vengono ora inviati PRIMA dell'invio del form**, quindi anche se c'è un errore CORS:
- ✅ Google Ads riceverà la conversione
- ✅ GA4 riceverà gli eventi
- ✅ Facebook Pixel riceverà gli eventi

Il problema CORS riguarda solo l'invio dell'email di notifica, non il tracking analytics.

---

**Tempo stimato:** 5-10 minuti per deployare la funzione
