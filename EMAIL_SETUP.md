# Configurazione Sistema Email Commerciali

## 📧 Setup Resend

### 1. Creare Account Resend
- Vai su [resend.com](https://resend.com)
- Crea un account e verifica il tuo dominio
- Ottieni la tua API key

### 2. Configurare Variabili Ambiente
Crea un file `.env.local` nella root del progetto:

```env
# Resend API Configuration
VITE_RESEND_API_KEY=re_your_api_key_here

# Commerciali email addresses (separate by comma)
VITE_COMMERCIALI_EMAILS=commerciale1@example.com,commerciale2@example.com
```

### 3. Configurare Email Commerciali
Modifica il file `src/config/email.ts` e aggiungi le email dei commerciali:

```typescript
export const COMMERCIALI_EMAILS = [
  'commerciale1@tuodominio.com',
  'commerciale2@tuodominio.com',
  'commerciale3@tuodominio.com',
];
```

### 4. Verificare Dominio
- Assicurati che il dominio in `RESEND_CONFIG.fromEmail` sia verificato su Resend
- Modifica `fromEmail` in `src/config/email.ts` se necessario

## 🚀 Funzionalità

### Cosa Succede Quando un Lead Viene Inviato:
1. ✅ I dati vengono inviati al webhook Make (come prima)
2. ✅ **NUOVO**: Viene inviata un'email ai commerciali con tutti i dettagli del lead
3. ✅ L'utente vede il messaggio di conferma

### Template Email:
L'email include:
- 📋 Informazioni complete del cliente
- 🏪 Dettagli del ristorante
- 📞 Contatti (email e telefono)
- ⏰ Timestamp dell'invio
- 📝 Note per i prossimi passi

## 🔧 Troubleshooting

### Se le email non vengono inviate:
1. Verifica che la API key sia corretta
2. Controlla che il dominio sia verificato su Resend
3. Verifica che le email dei commerciali siano configurate
4. Controlla la console del browser per errori

### Log di Debug:
Il sistema logga tutti gli eventi nella console:
- ✅ "Email inviata ai commerciali con successo"
- ⚠️ "Errore nell'invio email ai commerciali"
- ❌ "Resend API key non configurata"

## 📝 Note Importanti

- **Non Blocca il Flusso**: Se l'invio email fallisce, il form continua a funzionare normalmente
- **Webhook Make**: Continua a funzionare come prima
- **Sicurezza**: L'API key è esposta lato client (normale per Vite), ma Resend ha protezioni per evitare abusi
