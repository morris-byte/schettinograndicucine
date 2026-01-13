# 📋 Guida Pratica - Cosa Fare Ora

## 🚀 STEP 1: Configurare le Variabili d'Ambiente

### Per Sviluppo Locale

1. **Crea o modifica il file `.env` nella root del progetto** (nella stessa cartella di `package.json`):

```env
# Variabili OBBLIGATORIE (senza queste l'app non funziona)
VITE_RESEND_API_KEY=re_XbAxcgBZ_v8dtrGz2R2XBmGxBnrbBsMkv
VITE_SUPABASE_URL=https://laxbglhrrcbrxpnpvcob.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=la_tua_chiave_supabase_qui

# Variabili OPZIONALI (hanno valori di default, ma puoi cambiarli)
VITE_MAKE_WEBHOOK_URL=https://hook.eu2.make.com/dbeari9w8c7p9ft1dhizsuvrd2a98gqi
VITE_SUPABASE_FUNCTION_URL=https://laxbglhrrcbrxpnpvcob.supabase.co/functions/v1/send-test-email
VITE_GTM_CONTAINER_ID=GTM-PM7BJ5CS
```

2. **Dove trovare i valori:**
   - `VITE_RESEND_API_KEY`: Vai su [resend.com](https://resend.com) → API Keys
   - `VITE_SUPABASE_URL`: Vai su [supabase.com](https://supabase.com) → Il tuo progetto → Settings → API → Project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: Stesso posto → anon/public key

### Per Produzione (Vercel)

1. **Vai su [vercel.com](https://vercel.com)** e accedi al tuo progetto
2. **Vai su Settings → Environment Variables**
3. **Aggiungi queste variabili** (stesso nome e valori del file `.env`):
   - `VITE_RESEND_API_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_MAKE_WEBHOOK_URL` (opzionale)
   - `VITE_SUPABASE_FUNCTION_URL` (opzionale)
   - `VITE_GTM_CONTAINER_ID` (opzionale)

4. **IMPORTANTE**: Seleziona gli ambienti (Production, Preview, Development) per ogni variabile
5. **Rideploya** il progetto dopo aver aggiunto le variabili

---

## 🔒 STEP 2: Aggiornare CORS in Supabase Function

1. **Apri il file**: `supabase/functions/send-test-email/index.ts`
2. **Trova questa riga** (circa riga 10):
   ```typescript
   const ALLOWED_ORIGINS = [
     "https://schettinograndicucine-ten.vercel.app",
     "https://schettinograndicucine.it",
     "http://localhost:8080",
     "http://localhost:5173",
   ];
   ```
3. **Aggiungi i tuoi domini di produzione** alla lista:
   ```typescript
   const ALLOWED_ORIGINS = [
     "https://schettinograndicucine-ten.vercel.app",
     "https://schettinograndicucine.it",
     "https://www.schettinograndicucine.it",  // Se hai anche www
     "http://localhost:8080",
     "http://localhost:5173",
   ];
   ```
4. **Rideploya la Supabase function**:
   ```bash
   supabase functions deploy send-test-email
   ```

---

## 🧪 STEP 3: Testare in Locale

1. **Installa le dipendenze** (se non l'hai già fatto):
   ```bash
   npm install
   ```

2. **Avvia il server di sviluppo**:
   ```bash
   npm run dev
   ```

3. **Apri il browser** su `http://localhost:8080`

4. **Testa il form**:
   - Compila tutti i campi
   - Verifica che la validazione funzioni (email, telefono)
   - Invia il form
   - Controlla la console del browser (F12) per eventuali errori
   - Verifica che ricevi l'email di notifica

5. **Controlla errori**:
   - Se vedi errori su variabili d'ambiente mancanti, verifica il file `.env`
   - Se il form non si invia, controlla la console per dettagli

---

## 📦 STEP 4: Build e Deploy

### Build Locale (per testare)

```bash
npm run build
```

Questo crea la cartella `dist/` con i file pronti per la produzione.

### Deploy su Vercel

**Opzione A: Deploy Automatico (se hai GitHub connesso)**
1. Fai commit e push:
   ```bash
   git add .
   git commit -m "Fix: Risolti problemi critici e miglioramenti"
   git push origin main
   ```
2. Vercel deployerà automaticamente

**Opzione B: Deploy Manuale**
1. Installa Vercel CLI (se non ce l'hai):
   ```bash
   npm i -g vercel
   ```
2. Deploy:
   ```bash
   vercel --prod
   ```

---

## ✅ STEP 5: Verifiche Post-Deploy

Dopo il deploy, verifica:

1. **Il sito carica correttamente** ✅
2. **Il form funziona** ✅
   - Prova a compilare e inviare
3. **Le email arrivano** ✅
   - Controlla le email dei commerciali configurate
4. **Nessun errore in console** ✅
   - Apri DevTools (F12) → Console
   - Non dovrebbero esserci errori rossi
5. **Analytics funzionano** ✅
   - Verifica su Google Analytics che gli eventi arrivino

---

## 🐛 TROUBLESHOOTING

### Errore: "VITE_RESEND_API_KEY environment variable is required"

**Soluzione**: 
- Verifica che il file `.env` esista nella root
- Verifica che la variabile sia scritta correttamente (senza spazi)
- Riavvia il server di sviluppo dopo aver modificato `.env`

### Errore: "CORS policy" nel browser

**Soluzione**:
- Verifica che il tuo dominio sia nella lista `ALLOWED_ORIGINS` in Supabase function
- Rideploya la function dopo aver modificato

### Le email non arrivano

**Soluzione**:
1. Verifica che `VITE_RESEND_API_KEY` sia corretta
2. Controlla i log di Resend per eventuali errori
3. Verifica che le email dei commerciali siano corrette in `src/config/email.ts`

### Il form non si invia

**Soluzione**:
1. Apri la console del browser (F12)
2. Cerca errori in rosso
3. Verifica che tutte le env vars siano configurate
4. Controlla la rete (tab Network) per vedere se le richieste partono

---

## 📝 CHECKLIST FINALE

Prima di considerare tutto completato:

- [ ] File `.env` creato con tutte le variabili
- [ ] Variabili configurate su Vercel (se usi Vercel)
- [ ] CORS origins aggiornati in Supabase function
- [ ] Supabase function rideployata
- [ ] Test locale completato con successo
- [ ] Build locale funziona (`npm run build`)
- [ ] Deploy su produzione completato
- [ ] Form testato in produzione
- [ ] Email di test ricevute
- [ ] Nessun errore in console produzione

---

## 🆘 SERVE AIUTO?

Se qualcosa non funziona:

1. **Controlla i log**:
   - Console browser (F12)
   - Log Vercel (Dashboard → Deployments → Logs)
   - Log Supabase (Dashboard → Functions → Logs)

2. **Verifica le variabili d'ambiente**:
   - In locale: file `.env`
   - In produzione: Vercel Dashboard → Settings → Environment Variables

3. **Testa passo per passo**:
   - Prima testa in locale
   - Poi testa il build locale
   - Infine deploy in produzione

---

## 📚 FILE IMPORTANTI DA RICORDARE

- `.env` - Variabili d'ambiente (NON committare questo file!)
- `src/config/env.ts` - Gestione centralizzata env vars
- `supabase/functions/send-test-email/index.ts` - Function email con CORS
- `src/config/email.ts` - Configurazione email commerciali

---

**Buon lavoro! 🚀**
