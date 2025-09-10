# Configurazione Resend per Email di Test

## Setup

1. **Crea un account su Resend.dev**
   - Vai su https://resend.dev
   - Registrati e verifica il tuo account

2. **Ottieni la tua API Key**
   - Nel dashboard di Resend, vai su "API Keys"
   - Crea una nuova API key
   - Copia la chiave generata

3. **Configura la variabile d'ambiente**
   - Crea un file `.env` nella root del progetto
   - Aggiungi la seguente riga:
   ```
   VITE_RESEND_API_KEY=la_tua_api_key_qui
   ```

4. **Riavvia il server di sviluppo**
   ```bash
   npm run dev
   ```

## Funzionalità

Il pulsante "Invia mail di test" nell'angolo in alto a destra invierà una email semplice a `vincenzopetronebiz@gmail.com` con:
- **Mittente**: Schettino Grandi Cucine (via Resend)
- **Oggetto**: "Email di prova"
- **Contenuto**: "Email di prova" (testo semplice, senza formattazione)

## Note

- L'email viene inviata tramite il servizio Resend.dev
- Il mittente sarà "Schettino Grandi Cucine <onboarding@resend.dev>"
- La funzionalità include notifiche toast per successo/errore
