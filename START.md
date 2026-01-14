# Szybki start - 5 minut

## 1) Pobierz projekt
```bash
git clone https://github.com/TWOJ_USERNAME/projektwdr.git
cd projektwdr
```
Lub pobierz ZIP i rozpakuj.

## 2) Zainstaluj Node.js
Jesli nie masz Node.js:
1. Pobierz: https://nodejs.org (wersja LTS)
2. Zainstaluj i zrestartuj terminal
3. Sprawdz:
   ```bash
   node --version
   ```

## 3) Skonfiguruj MongoDB

### Opcja A: MongoDB Atlas (szybka)
1. Rejestracja: https://www.mongodb.com/cloud/atlas/register
2. Utworz darmowy klaster (Shared, FREE)
3. Network Access: dodaj IP `0.0.0.0/0`
4. Database Access: utworz uzytkownika
   - Username: `fishing_user`
   - Password: ustaw swoje (zapamietaj)
5. Connect -> Connect your application
6. Skopiuj connection string:
   ```
   mongodb+srv://fishing_user:<password>@cluster0.xxxxx.mongodb.net/
   ```
7. Zamien `<password>` na swoje haslo

### Opcja B: MongoDB lokalnie
1. Pobierz MongoDB Community Server
2. Uruchom usluge
3. Uzyj URI `mongodb://localhost:27017`

## 4) Utworz pliki .env

### Backend - `server/.env`
```env
PORT=5000
MONGODB_URI=mongodb+srv://fishing_user:TWOJE_HASLO@cluster0.xxxxx.mongodb.net/fishing-reservation
JWT_SECRET=zmien-na-losowy-ciag-znakow-12345
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Frontend - `client/.env`
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 5) Instalacja zaleznosci

### Backend
```bash
cd server
npm install
```

### Frontend (nowe okno terminala)
```bash
cd client
npm install
```

## 6) Uruchomienie

### Terminal 1 - Backend
```bash
cd server
npm run dev
```

### Terminal 2 - Frontend
```bash
cd client
npm start
```

Frontend: http://localhost:3000

## 7) Konto admina

Po rejestracji kazdy uzytkownik ma role `user`. Aby nadac `admin`:

### MongoDB Atlas
1. Zaloguj sie na https://cloud.mongodb.com
2. Browse Collections -> baza -> `users`
3. Zmien pole `role` z `user` na `admin`
4. Wyloguj sie i zaloguj ponownie

### MongoDB Compass
1. Polacz sie do bazy
2. `users` -> edytuj dokument
3. Zmien `role` na `admin`

## Problemy

### "npm: command not found"
Zainstaluj Node.js z https://nodejs.org

### "MongoDB connection failed"
Sprawdz `server/.env` i poprawnosc `MONGODB_URI`

### "Port 5000 already in use"
Zakoncz proces `node.exe` lub zmien `PORT` w `server/.env`

## Wiecej informacji

Pelna dokumentacja: `README.md`  
API: `docs/API.md`
