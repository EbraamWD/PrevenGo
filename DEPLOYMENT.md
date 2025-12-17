# Deployment Guide - Prevengo

Questa guida ti aiuterà a deployare Prevengo su Vercel (frontend) e Railway (backend).

## 📋 Prerequisiti

- Account Vercel (gratuito): https://vercel.com
- Account Railway (gratuito): https://railway.app
- Account MongoDB Atlas (gratuito): https://www.mongodb.com/cloud/atlas
- Git repository (GitHub, GitLab, o Bitbucket)

---

## 🚀 Backend Deployment su Railway

### 1. Preparazione

1. Assicurati che il backend sia pronto:
   ```bash
   cd backend
   npm install
   ```

### 2. Setup MongoDB Atlas

1. Crea un account su MongoDB Atlas
2. Crea un nuovo cluster (gratuito)
3. Crea un database user
4. Whitelist l'IP `0.0.0.0/0` (per permettere connessioni da qualsiasi IP)
5. Copia la connection string (es: `mongodb+srv://user:password@cluster.mongodb.net/dbname`)

### 3. Deploy su Railway

1. Vai su https://railway.app e accedi con GitHub
2. Clicca su **"New Project"**
3. Seleziona **"Deploy from GitHub repo"**
4. Seleziona il repository del progetto
5. Railway rileverà automaticamente il backend

### 4. Configurazione Variabili d'Ambiente su Railway

Nella dashboard di Railway, vai su **Variables** e aggiungi:

```
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
JWT_SECRET=your_super_secret_random_string_here
ALLOWED_ORIGINS=https://your-app.vercel.app
```

**Nota importante:**
- Sostituisci `your_super_secret_random_string_here` con una stringa casuale sicura (usa `openssl rand -base64 32`)
- Sostituisci `https://your-app.vercel.app` con l'URL del tuo frontend Vercel (lo aggiungerai dopo il deploy del frontend)

### 5. Verifica Deployment

1. Railway genererà automaticamente un URL (es: `https://your-backend.up.railway.app`)
2. Testa l'endpoint: `https://your-backend.up.railway.app/api/auth/register`
3. Copia l'URL del backend - ti servirà per il frontend

---

## 🎨 Frontend Deployment su Vercel

### 1. Preparazione

1. Assicurati che il frontend sia pronto:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

### 2. Deploy su Vercel

#### Opzione A: Via Dashboard Vercel

1. Vai su https://vercel.com e accedi con GitHub
2. Clicca su **"Add New Project"**
3. Importa il repository del progetto
4. Configura il progetto:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

#### Opzione B: Via CLI Vercel

```bash
cd frontend
npm install -g vercel
vercel login
vercel
```

### 3. Configurazione Variabili d'Ambiente su Vercel

Nella dashboard di Vercel, vai su **Settings > Environment Variables** e aggiungi:

```
REACT_APP_API_URL=https://your-backend.up.railway.app/api
```

**Nota:** Sostituisci `https://your-backend.up.railway.app` con l'URL del tuo backend Railway.

### 4. Aggiorna CORS nel Backend

Torna su Railway e aggiorna la variabile `ALLOWED_ORIGINS`:

```
ALLOWED_ORIGINS=https://your-app.vercel.app
```

Sostituisci `https://your-app.vercel.app` con l'URL del tuo frontend Vercel.

### 5. Redeploy

Dopo aver aggiunto le variabili d'ambiente:
- **Vercel**: Il deploy si aggiornerà automaticamente
- **Railway**: Clicca su **"Redeploy"** per applicare le nuove variabili CORS

---

## ✅ Verifica Finale

1. **Frontend**: Visita `https://your-app.vercel.app`
2. **Backend**: Testa `https://your-backend.up.railway.app/api/auth/register`
3. **Test completo**: 
   - Registra un nuovo account dal frontend
   - Crea un preventivo
   - Scarica il PDF

---

## 🔧 Troubleshooting

### CORS Errors

Se vedi errori CORS:
1. Verifica che `ALLOWED_ORIGINS` nel backend includa l'URL esatto del frontend (con `https://`)
2. Assicurati che non ci siano spazi nella variabile
3. Redeploy il backend dopo aver modificato le variabili

### MongoDB Connection Errors

Se vedi errori di connessione MongoDB:
1. Verifica che l'IP `0.0.0.0/0` sia nella whitelist di MongoDB Atlas
2. Controlla che la connection string sia corretta
3. Verifica che il database user abbia i permessi corretti

### Build Errors

Se il build fallisce:
1. Testa il build localmente: `npm run build`
2. Verifica che tutte le dipendenze siano nel `package.json`
3. Controlla i log di Vercel/Railway per errori specifici

### Environment Variables Not Working

- Vercel: Le variabili devono iniziare con `REACT_APP_` per essere accessibili nel frontend
- Railway: Riavvia il servizio dopo aver aggiunto nuove variabili

---

## 📝 File di Configurazione

I seguenti file sono già configurati:

- `frontend/vercel.json` - Configurazione Vercel
- `backend/railway.json` - Configurazione Railway
- `.env.example` - Template per variabili d'ambiente

---

## 🎉 Completato!

Il tuo progetto è ora live! 

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.up.railway.app

Ricorda di aggiornare le variabili d'ambiente se cambi domini o configurazioni.

