# System Rezerwacji Stanowisk Wedkarskich

Aplikacja webowa do rezerwacji stanowisk wedkarskich na polskich jeziorach z panelem administratora i uzytkownika.

## Spis tresci
- [Funkcje](#funkcje)
- [Technologie](#technologie)
- [Szybki start](#szybki-start)
- [Konfiguracja](#konfiguracja)
- [Uruchomienie](#uruchomienie)
- [Struktura projektu](#struktura-projektu)
- [API](#api)
- [Bezpieczenstwo](#bezpieczenstwo)
- [Deployment](#deployment)
- [Roadmap](#roadmap)

## Funkcje

### Panel administratora
- Dodawanie i zarzadzanie jeziorami
- Upload zdjec jezior
- Tworzenie stanowisk wedkarskich z interaktywna mapa
- Edytor map (klikanie na obraz jeziora)
- Zarzadzanie rezerwacjami (API)
- Moderacja opinii (API)

### Panel uzytkownika
- Rejestracja i logowanie (JWT)
- Rezerwacje stanowisk na wybrane daty
- Podglad rezerwacji i anulowanie
- Opinie o jeziorach

### System rezerwacji
- Blokowanie terminow (jedno stanowisko = jedna rezerwacja/dzien)
- Zapobieganie podwojnym rezerwacjom (unikalny indeks)
- Publiczne sprawdzanie dostepnosci stanowisk na dany dzien

## Technologie

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (autentykacja)
- Multer + Sharp (upload i przetwarzanie obrazow)

### Frontend
- React + React Router
- Axios
- Context API
- CSS

## Szybki start

Zobacz `START.md` po szybkie uruchomienie krok po kroku.

## Konfiguracja

### Backend - `server/.env`
```env
PORT=5000
MONGODB_URI=mongodb+srv://fishing_user:HASLO@cluster0.xxxxx.mongodb.net/fishing-reservation
JWT_SECRET=zmien-na-losowy-ciag-znakow-12345
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Frontend - `client/.env`
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Uruchomienie

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm start
```

Frontend uruchomi sie pod adresem `http://localhost:3000`.

## Struktura projektu

```
projektwdr/
  client/                 # Frontend React
    public/
    src/
      components/         # Komponenty UI
        auth/             # Logowanie i rejestracja
        admin/            # Panel admina
        user/             # Panel uzytkownika
        common/           # Navbar, ProtectedRoute, itp.
      pages/              # Strony aplikacji
      context/            # AuthContext
      services/           # Warstwa API
    .env
    package.json

  server/                 # Backend Node.js + Express
    config/               # Konfiguracja DB
    controllers/          # Logika biznesowa
    middleware/           # Auth, upload, itp.
    models/               # Mongoose models
    routes/               # API endpoints
    uploads/              # Pliki uploadowane
    .env
    server.js             # Entry point
    package.json
```

## API

Pelny opis endpointow znajdziesz w `docs/API.md`.

## Bezpieczenstwo

W produkcji koniecznie:
1. Ustaw silny `JWT_SECRET`.
2. Ogranicz IP w MongoDB Atlas.
3. Wymuszaj silne hasla i bezpieczne przechowywanie `.env`.

## Deployment

### Backend
- Railway
- Render
- Heroku

### Frontend
- Vercel
- Netlify

### Database
- MongoDB Atlas

## Roadmap

- Panel uzytkownika - przegladanie jezior
- Edytor map - klikanie na obraz jeziora (admin)
- System rezerwacji z kalendarzem
- System opinii
- Filtrowanie jezior po lokalizacji
- Powiadomienia email o rezerwacjach
- Aplikacja mobilna (React Native)
