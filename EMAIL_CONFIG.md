# Configurazione Email di Test

## Setup Rapido

1. **Ottieni la chiave API da Resend.dev**
   - Vai su https://resend.dev
   - Crea account e ottieni la tua API key

2. **Crea il file .env**
   ```bash
   # Nella root del progetto
   echo "VITE_RESEND_API_KEY=la_tua_api_key_qui" > .env
   ```

3. **Riavvia il server**
   ```bash
   npm run dev
   ```

## Funzionalità

- **Pulsante**: "Invia mail di test" (angolo in alto a destra)
- **Destinatario**: vincenzopetronebiz@gmail.com
- **Mittente**: Schettino Grandi Cucine <onboarding@resend.dev>
- **Oggetto**: "Email di prova"
- **Contenuto**: "Email di prova" (testo semplice)
- **Feedback**: Notifica toast di successo/errore
