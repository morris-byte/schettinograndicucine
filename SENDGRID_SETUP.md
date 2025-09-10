# Setup SendGrid per Grandi Cucine

## 🚀 Configurazione SendGrid

### 1. Crea un Account SendGrid
- Vai su [sendgrid.com](https://sendgrid.com)
- Crea un account gratuito (100 email/giorno)
- Verifica la tua email

### 2. Crea un API Key
- Vai su Settings → API Keys
- Clicca "Create API Key"
- Scegli "Restricted Access"
- Abilita solo "Mail Send" permissions
- Copia l'API Key (inizia con `SG.`)

### 3. Verifica il Dominio (Opzionale ma Raccomandato)
- Vai su Settings → Sender Authentication
- Clicca "Authenticate Your Domain"
- Aggiungi il dominio `grandicucine.com`
- Segui le istruzioni per aggiungere i record DNS

### 4. Configura il Codice
Sostituisci l'API Key nel file `src/services/sendgridService.ts`:

```typescript
const SENDGRID_API_KEY = 'SG.tua_api_key_qui';
```

### 5. Configura l'Email Mittente
Nel file `src/services/sendgridService.ts`, modifica:

```typescript
from: {
  email: 'noreply@grandicucine.com', // O il tuo dominio verificato
  name: 'Grandi Cucine'
}
```

## 📧 Email Destinatari
Le email vengono inviate a:
- `jagermorris@gmail.com`
- `vincenzopetronebiz@gmail.com`

## 🧪 Test
1. Fai il deploy su Lovable
2. Clicca il pulsante "📧 Test Email"
3. Controlla le email dei commerciali

## 🔧 Troubleshooting
- **Errore 401**: API Key non valida
- **Errore 403**: Permessi insufficienti
- **Errore 400**: Formato email non valido
- **Email non arriva**: Controlla spam, verifica dominio

## 💰 Costi
- **Gratuito**: 100 email/giorno
- **Essentials**: $19.95/mese per 50,000 email
- **Pro**: $89.95/mese per 100,000 email
