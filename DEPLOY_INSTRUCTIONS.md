# 🚀 Istruzioni Deploy con Resend

## 📋 Prerequisiti

1. **Account Vercel** - [vercel.com](https://vercel.com)
2. **Account Resend** - [resend.com](https://resend.com) (già configurato)
3. **GitHub Repository** (opzionale, per deploy automatico)

## 🔧 Deploy su Vercel

### Opzione 1: Deploy da GitHub (Raccomandato)

1. **Push su GitHub**:
   ```bash
   git add .
   git commit -m "Add Resend email functionality"
   git push origin main
   ```

2. **Connetti a Vercel**:
   - Vai su [vercel.com](https://vercel.com)
   - Clicca "New Project"
   - Importa il repository GitHub
   - Vercel rileverà automaticamente le configurazioni

3. **Configura Variabili Ambiente**:
   - Nel dashboard Vercel, vai su Settings → Environment Variables
   - Aggiungi: `RESEND_API_KEY` = `re_XbAxcgBZ_v8dtrGz2R2XBmGxBnrbBsMkv`

### Opzione 2: Deploy da CLI

1. **Installa Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Configura Variabili**:
   ```bash
   vercel env add RESEND_API_KEY
   # Inserisci: re_XbAxcgBZ_v8dtrGz2R2XBmGxBnrbBsMkv
   ```

## ✅ Verifica Deploy

Dopo il deploy:

1. **Testa il Form**: Compila e invia il form
2. **Controlla Email**: Verifica che i commerciali ricevano le email
3. **Monitora Logs**: Controlla i log di Vercel per eventuali errori

## 📧 Email Commerciali Configurate

- `jagermorris@gmail.com`
- `vincenzopetronebiz@gmail.com`

## 🔍 Troubleshooting

### Se le email non vengono inviate:

1. **Verifica API Key**: Controlla che `RESEND_API_KEY` sia configurata correttamente
2. **Controlla Logs**: Vai su Vercel Dashboard → Functions → Logs
3. **Testa API**: Usa Postman o curl per testare `/api/send-email`

### Test API Endpoint:
```bash
curl -X POST https://tuo-dominio.vercel.app/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","phoneNumber":"1234567890","restaurantName":"Test Restaurant","restaurantZone":"Test Zone","equipmentType":"Test Equipment","timestamp":"2024-01-01T00:00:00.000Z","source":"Test"}'
```

## 🎯 Funzionalità Complete

✅ **Webhook Make** - Continua a funzionare come prima
✅ **Email Commerciali** - Invio automatico tramite Resend
✅ **Template Professionale** - Email HTML con tutti i dettagli
✅ **Error Handling** - Gestione errori senza bloccare il form
✅ **Logging** - Log completi per debugging

Il sistema è pronto per il deploy! 🚀
