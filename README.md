# Prevengo - Generatore di Preventivi Professionali

Prevengo è un'applicazione web moderna per creare preventivi professionali in pochi secondi. Genera PDF eleganti e personalizzabili con il tuo logo aziendale.

## 🚀 Features

- ✨ **Interfaccia moderna e intuitiva**
- 📄 **Generazione PDF professionale**
- 🔐 **Autenticazione sicura**
- 🎨 **Personalizzazione logo aziendale**
- 💰 **Calcolo automatico IVA e totali**
- 📱 **Design responsive**
- 🔒 **Sicurezza e privacy dei dati**

## 🛠️ Tech Stack

### Frontend
- React 19
- React Router
- Tailwind CSS
- Axios
- Lucide React Icons

### Backend
- Node.js
- Express 5
- MongoDB (Mongoose)
- JWT Authentication
- Multer (file upload)
- PDFKit (PDF generation)

## 📦 Installazione Locale

### Prerequisiti
- Node.js 18+ 
- MongoDB (locale o Atlas)
- npm o yarn

### Backend Setup

```bash
cd backend
npm install

# Crea file .env con:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
ALLOWED_ORIGINS=http://localhost:3000

npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install

# Crea file .env con:
REACT_APP_API_URL=http://localhost:5000/api

npm start
```

L'applicazione sarà disponibile su `http://localhost:3000`

## 🚀 Deployment

Per deployare su Vercel (frontend) e Railway (backend), consulta la [guida completa di deployment](./DEPLOYMENT.md).

### Quick Start Deployment

1. **Backend su Railway:**
   - Connetti il repository GitHub
   - Aggiungi variabili d'ambiente (vedi DEPLOYMENT.md)
   - Railway deployerà automaticamente

2. **Frontend su Vercel:**
   - Connetti il repository GitHub
   - Imposta root directory: `frontend`
   - Aggiungi variabile: `REACT_APP_API_URL=https://your-backend.railway.app/api`

## 📁 Struttura Progetto

```
prevengo/
├── backend/
│   ├── src/
│   │   ├── config/       # Configurazione database
│   │   ├── controllers/  # Logica business
│   │   ├── middleware/   # Middleware (auth, etc.)
│   │   ├── models/       # Modelli MongoDB
│   │   ├── routes/       # Route API
│   │   ├── utils/        # Utility (PDF generator)
│   │   ├── app.js        # Configurazione Express
│   │   └── server.js     # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # Componenti React
│   │   ├── context/      # Context API (Auth)
│   │   ├── App.jsx       # App principale
│   │   └── api.js        # Configurazione Axios
│   └── package.json
└── README.md
```

## 🔐 Variabili d'Ambiente

### Backend (.env)
```
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend.railway.app/api
```

## 📝 API Endpoints

### Autenticazione
- `POST /api/auth/register` - Registrazione
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Info utente (protetto)

### Preventivi
- `POST /api/quotes` - Crea preventivo (protetto)
- `GET /api/quotes/:id/pdf` - Scarica PDF (protetto)

## 🤝 Contribuire

1. Fork il progetto
2. Crea un branch (`git checkout -b feature/AmazingFeature`)
3. Commit le modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è sotto licenza MIT.

## 👨‍💻 Autore

Creato con ❤️ per semplificare la creazione di preventivi professionali.

---

Per domande o supporto, consulta la [documentazione di deployment](./DEPLOYMENT.md) o apri una issue.

