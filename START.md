# 🚀 SZYBKI START - 5 MINUT

## 📥 Pobierz projekt

```bash
git clone https://github.com/TWOJ_USERNAME/projektwdr.git
cd projektwdr
```

Lub pobierz ZIP i rozpakuj.

---

## ⚙️ Zainstaluj Node.js

**Jeśli NIE masz Node.js:**
1. Pobierz: https://nodejs.org (wersja LTS)
2. Zainstaluj
3. Zrestartuj terminal
4. Sprawdź: `node --version`

---

## 🗄️ Skonfiguruj MongoDB

### OPCJA 1: MongoDB Atlas (chmura - SZYBKO) ⭐

1. Zarejestruj się: https://www.mongodb.com/cloud/atlas/register
2. Utwórz darmowy klaster (Shared, FREE)
3. W zakładce "Network Access" → Dodaj IP: `0.0.0.0/0`
4. W zakładce "Database Access" → Utwórz użytkownika
   - Username: `fishing_user`
   - Password: ustaw swoje (ZAPAMIĘTAJ!)
5. Kliknij "Connect" → "Connect your application"
6. Skopiuj connection string (będzie wyglądał jak):
   ```
   mongodb+srv://fishing_user:<password>@cluster0.xxxxx.mongodb.net/
   ```
7. **ZAMIEŃ `<password>` na swoje hasło!**

---

## 📝 Konfiguracja plików .env

### 1. Backend - server/.env

Utwórz plik `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://fishing_user:TWOJE_HASLO@cluster0.xxxxx.mongodb.net/fishing-reservation
JWT_SECRET=zmien-na-losowy-ciag-znakow-12345
NODE_ENV=development
```

**WAŻNE:**
- Zamień `TWOJE_HASLO` na prawdziwe hasło
- Zamień `cluster0.xxxxx` na swój klaster z MongoDB Atlas

### 2. Frontend - client/.env

Utwórz plik `client/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Jeśli chcesz udostępnić w sieci lokalnej:**
```env
REACT_APP_API_URL=http://TWOJE_IP:5000/api
```
Znajdź IP: `ipconfig` (Windows) → szukaj "IPv4 Address"

---

## 📦 Zainstaluj zależności

### Backend:
```bash
cd server
npm install
```

### Frontend (NOWE OKNO TERMINALA):
```bash
cd client
npm install
```

---

## ▶️ Uruchom aplikację

### Terminal 1 - Backend:
```bash
cd server
npm run dev
```

**Powinieneś zobaczyć:**
```
✓ Połączono z MongoDB
Serwer uruchomiony na porcie 5000
```

### Terminal 2 - Frontend:
```bash
cd client
npm start
```

Aplikacja otworzy się w przeglądarce: **http://localhost:3000**

---

## 👤 Utwórz konto admina

1. **Zarejestruj się** w aplikacji (http://localhost:3000/register)
2. **Zmień rolę na admina** w MongoDB:

### Sposób 1: MongoDB Atlas (www):
   - Zaloguj się: https://cloud.mongodb.com
   - Browse Collections → wybierz bazę → kolekcja `users`
   - Znajdź swoje konto (po email)
   - Zmień `"role": "user"` → `"role": "admin"`
   - **Wyloguj i zaloguj się ponownie** na stronie

### Sposób 2: MongoDB Compass:
   - Otwórz MongoDB Compass
   - Połącz się (użyj connection string)
   - Baza danych → kolekcja `users`
   - Edytuj swój dokument
   - Zmień `role` na `admin`
   - **Wyloguj i zaloguj się ponownie**

---

## ✅ Gotowe!

**Teraz możesz:**
- Zalogować się jako admin
- Dodawać jeziora (Admin → Jeziora)
- Tworzyć stanowiska wędkarskie
- Przeglądać rezerwacje

---

## ❌ Problemy?

### "npm: command not found"
→ Zainstaluj Node.js: https://nodejs.org

### "MongoDB connection failed"
→ Sprawdź `server/.env` czy MONGODB_URI jest prawidłowy

### "Port 5000 already in use"
→ Zakończ proces node.exe w Task Manager

### Inne problemy?
→ Zobacz pełną dokumentację: **README.md**

---

## 🌐 Udostępnianie w sieci lokalnej

Aby koledzy mogli wejść na aplikację z ich komputerów:

1. **Sprawdź swoje IP:**
   ```bash
   ipconfig
   ```
   Szukaj "IPv4 Address", np: `192.168.1.33`

2. **Zmień client/.env:**
   ```env
   REACT_APP_API_URL=http://192.168.1.33:5000/api
   ```

3. **Zrestartuj frontend** (Ctrl+C i `npm start`)

4. **Koledzy wchodzą na:**
   ```
   http://192.168.1.33:3000
   ```

**UWAGA:** Backend i frontend nadal działają na TWOIM komputerze. Koledzy łączą się przez sieć.

---

## 📞 Potrzebujesz pomocy?

Przeczytaj pełną dokumentację: **README.md**

**Powodzenia! 🎣**
