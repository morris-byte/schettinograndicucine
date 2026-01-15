# 🔧 Fix GTM - Variabili Mancanti

## ❌ Problema

GTM segnala errori perché le variabili usate nei tag non sono state create:
- `is_in_campania`
- `button_location`
- `restaurant_zone`
- `button_name`
- `equipment_type`
- `is_restaurateur`
- `restaurant_name`

## ✅ Soluzione Rapida

Devi creare tutte queste variabili in GTM. Ecco come fare:

---

## 🚀 Creazione Variabili - Step by Step

### 1. Apri GTM
1. Vai su [Google Tag Manager](https://tagmanager.google.com/)
2. Seleziona il container `GTM-PM7BJ5CS`
3. Vai su **Variabili** (menu a sinistra)

### 2. Crea le Variabili per "GA4 Confirmed"

Crea queste variabili una alla volta:

#### Variabile: `restaurant_name`
1. Clicca su **Nuovo** (in alto a destra)
2. Nome variabile: `restaurant_name`
3. Tipo variabile: **Variabile Data Layer**
4. Nome variabile Data Layer: `restaurant_name`
5. Tipo di dati: **Testo**
6. Clicca su **Salva**

#### Variabile: `is_restaurateur`
1. Clicca su **Nuovo**
2. Nome variabile: `is_restaurateur`
3. Tipo variabile: **Variabile Data Layer**
4. Nome variabile Data Layer: `is_restaurateur`
5. Tipo di dati: **Testo**
6. Clicca su **Salva**

#### Variabile: `is_in_campania`
1. Clicca su **Nuovo**
2. Nome variabile: `is_in_campania`
3. Tipo variabile: **Variabile Data Layer**
4. Nome variabile Data Layer: `is_in_campania`
5. Tipo di dati: **Testo**
6. Clicca su **Salva**

#### Variabile: `restaurant_zone`
1. Clicca su **Nuovo**
2. Nome variabile: `restaurant_zone`
3. Tipo variabile: **Variabile Data Layer**
4. Nome variabile Data Layer: `restaurant_zone`
5. Tipo di dati: **Testo**
6. Clicca su **Salva**

#### Variabile: `equipment_type`
1. Clicca su **Nuovo**
2. Nome variabile: `equipment_type`
3. Tipo variabile: **Variabile Data Layer**
4. Nome variabile Data Layer: `equipment_type`
5. Tipo di dati: **Testo**
6. Clicca su **Salva**

### 3. Crea le Variabili per "GA4 ClickButton"

#### Variabile: `button_name`
1. Clicca su **Nuovo**
2. Nome variabile: `button_name`
3. Tipo variabile: **Variabile Data Layer**
4. Nome variabile Data Layer: `button_name`
5. Tipo di dati: **Testo**
6. Clicca su **Salva**

#### Variabile: `button_location`
1. Clicca su **Nuovo**
2. Nome variabile: `button_location`
3. Tipo variabile: **Variabile Data Layer**
4. Nome variabile Data Layer: `button_location`
5. Tipo di dati: **Testo**
6. Clicca su **Salva**

---

## 📋 Checklist Variabili da Creare

Copia questa lista e spunta ogni variabile man mano che la crei:

- [ ] `restaurant_name`
- [ ] `is_restaurateur`
- [ ] `is_in_campania`
- [ ] `restaurant_zone`
- [ ] `equipment_type`
- [ ] `button_name`
- [ ] `button_location`

---

## 🔍 Verifica Dopo la Creazione

Dopo aver creato tutte le variabili:

1. Vai su **Versione** (in alto)
2. Clicca su **Convalida contenitore** (o **Validate**)
3. Verifica che non ci siano più errori
4. Se ci sono ancora errori, controlla che i nomi delle variabili corrispondano ESATTAMENTE

---

## ⚠️ Importante: Nomi Esatti

Assicurati che i nomi delle variabili in GTM corrispondano ESATTAMENTE ai nomi usati nei tag:

- Nel tag: `{{restaurant_name}}` → Variabile deve chiamarsi: `restaurant_name`
- Nel tag: `{{button_location}}` → Variabile deve chiamarsi: `button_location`

**NON usare spazi, caratteri speciali o maiuscole diverse!**

---

## 🚀 Dopo Aver Creato le Variabili

1. **Valida il contenitore:**
   - Vai su **Versione** → **Convalida contenitore**
   - Verifica che non ci siano errori

2. **Testa in Preview Mode:**
   - Clicca su **Anteprima**
   - Inserisci l'URL: `https://schettinograndicucine-ten.vercel.app/`
   - Naviga nel form e verifica che le variabili vengano popolate

3. **Pubblica:**
   - Vai su **Versione** → **Crea versione**
   - Aggiungi nome e descrizione
   - Clicca su **Pubblica**

---

## 🆘 Se Ci Sono Ancora Errori

### Errore: "Variabile sconosciuta ancora presente"
**Causa:** Il nome della variabile nel tag non corrisponde al nome della variabile creata

**Soluzione:**
1. Apri il tag che ha l'errore
2. Controlla il nome della variabile usata (es. `{{restaurant_name}}`)
3. Verifica che esista una variabile con quel nome esatto in GTM
4. Se non esiste, creala
5. Se esiste ma ha un nome diverso, rinomina la variabile o modifica il tag

### Errore: "Variabile non popolata in Preview Mode"
**Causa:** Il nome della variabile nel dataLayer non corrisponde

**Soluzione:**
1. Apri la console del browser (F12)
2. Digita: `window.dataLayer`
3. Cerca l'evento che dovrebbe popolare la variabile
4. Verifica il nome esatto della proprietà nel dataLayer
5. Assicurati che la variabile in GTM usi lo stesso nome

---

## 📝 Esempio Completo

Ecco un esempio di come dovrebbe essere configurata una variabile:

**Variabile: `restaurant_name`**
- Tipo: Variabile Data Layer
- Nome variabile Data Layer: `restaurant_name`
- Tipo di dati: Testo
- Valore predefinito: (lascia vuoto)

Quando viene inviato un evento al dataLayer come:
```javascript
{
  event: 'Confirmed',
  restaurant_name: 'Ristorante Test',
  is_restaurateur: 'Yes',
  ...
}
```

La variabile `{{restaurant_name}}` prenderà il valore `'Ristorante Test'`.

---

**Tempo stimato:** 5-10 minuti per creare tutte le variabili

**Dopo questo fix:** GTM dovrebbe validare correttamente e i tag dovrebbero funzionare!
