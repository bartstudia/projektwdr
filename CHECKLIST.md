# ✅ CHECKLIST - Przygotowanie projektu na GitHub

## Przed wrzuceniem na GitHub:

- [ ] Upewnij się że **NIE** wrzucasz plików .env na GitHub
  - Sprawdź czy `.gitignore` zawiera `.env`
  - Sprawdź: `git status` - nie powinno być .env w listach

- [ ] Dodałeś pliki .env.example (wzorce dla innych)
  - [x] `server/.env.example` - jest
  - [x] `client/.env.example` - jest

- [ ] Dokumentacja jest kompletna
  - [x] `README.md` - główna dokumentacja
  - [x] `START.md` - szybki start

- [ ] Zmienna IP w client/.env jest ustawiona na localhost
  ```env
  REACT_APP_API_URL=http://localhost:5000/api
  ```
  (Nie wrzucaj swojego lokalnego IP!)

- [ ] Sprawdź czy MongoDB Atlas jest gotowy
  - IP 0.0.0.0/0 dodany do whitelist
  - Użytkownik bazy danych utworzony
  - Connection string działa

---

## Dla kolegów - Co muszą zrobić:

### 1️⃣ WYMAGANIA
- [ ] Zainstalować Node.js (https://nodejs.org)
- [ ] Zarejestrować się na MongoDB Atlas (https://www.mongodb.com/cloud/atlas)

### 2️⃣ POBRANIE
- [ ] Sklonować/pobrać repozytorium
  ```bash
  git clone https://github.com/TWOJ_USERNAME/projektwdr.git
  ```

### 3️⃣ KONFIGURACJA MONGODB
- [ ] Utworzyć darmowy klaster na MongoDB Atlas
- [ ] Dodać IP `0.0.0.0/0` do whitelist
- [ ] Utworzyć użytkownika bazy danych
- [ ] Skopiować connection string

### 4️⃣ PLIKI .ENV
- [ ] Utworzyć `server/.env` (wzorując się na `.env.example`)
- [ ] Wkleić swój MONGODB_URI
- [ ] Zmienić JWT_SECRET na losowy ciąg
- [ ] Utworzyć `client/.env` (wzorując się na `.env.example`)
- [ ] Ustawić REACT_APP_API_URL na `http://localhost:5000/api`

### 5️⃣ INSTALACJA
- [ ] Backend:
  ```bash
  cd server
  npm install
  ```
- [ ] Frontend:
  ```bash
  cd client
  npm install
  ```

### 6️⃣ URUCHOMIENIE
- [ ] Terminal 1 - Backend:
  ```bash
  cd server
  npm run dev
  ```
- [ ] Terminal 2 - Frontend:
  ```bash
  cd client
  npm start
  ```

### 7️⃣ ADMIN
- [ ] Zarejestrować się w aplikacji
- [ ] Zmienić `role` na `admin` w MongoDB
- [ ] Wylogować i zalogować się ponownie

---

## ⚠️ UWAGA - Bezpieczeństwo:

### NIGDY nie wrzucaj na GitHub:
- ❌ Plików `.env` (z prawdziwymi hasłami)
- ❌ `node_modules/` (za duże)
- ❌ `server/uploads/` (obrazy użytkowników)
- ❌ Prawdziwych haseł MongoDB
- ❌ Prawdziwego JWT_SECRET

### ✅ Możesz wrzucić:
- ✅ Pliki `.env.example` (wzorce bez haseł)
- ✅ Kod źródłowy (src, models, routes, etc.)
- ✅ Dokumentację (README.md, START.md)
- ✅ package.json i package-lock.json

---

## 📋 Komenda do wrzucenia na GitHub:

```bash
# Dodaj wszystkie pliki (oprócz tych w .gitignore)
git add .

# Sprawdź co zostanie dodane (upewnij się że NIE MA .env!)
git status

# Jeśli OK, commit
git commit -m "Initial commit: System rezerwacji stanowisk wędkarskich"

# Wrzuć na GitHub
git push origin main
```

---

## 🌐 Udostępnianie w sieci lokalnej (opcjonalne):

Jeśli koledzy chcą pracować na tym samym backendzie (TWÓJ komputer jako serwer):

1. **Sprawdź swoje IP:**
   ```bash
   ipconfig       # Windows
   ifconfig       # Linux/Mac
   ```
   Szukaj: IPv4 Address, np. `192.168.1.33`

2. **Koledzy zmieniają swoje `client/.env`:**
   ```env
   REACT_APP_API_URL=http://192.168.1.33:5000/api
   ```

3. **Koledzy restartują frontend** (Ctrl+C → `npm start`)

4. **Koledzy wchodzą na:**
   ```
   http://192.168.1.33:3000
   ```

**UWAGA:** Backend działa TYLKO na TWOIM komputerze. Musisz go mieć włączonego!

---

## ✅ GOTOWE!

Jeśli wszystko przeszło - projekt jest gotowy do współpracy! 🎉

**W razie problemów:** Zobacz `README.md` → sekcja FAQ
