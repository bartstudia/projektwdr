# 🎣 System Rezerwacji Stanowisk Wędkarskich

Aplikacja webowa do rezerwacji stanowisk wędkarskich na polskich jeziorach z panelem administracyjnym i użytkownika.

## 📋 Spis Treści
- [Funkcje](#funkcje)
- [Technologie](#technologie)
- [Instalacja - KROK PO KROKU](#instalacja---krok-po-kroku)
- [Konfiguracja](#konfiguracja)
- [Użytkowanie](#użytkowanie)
- [FAQ - Częste Problemy](#faq---częste-problemy)

## ✨ Funkcje

### Panel Administratora
- ✅ Dodawanie i zarządzanie jeziorami
- ✅ Upload zdjęć jezior (max 10MB)
- ✅ Tworzenie stanowisk wędkarskich z interaktywną mapą
- ✅ Edytor map - klikanie na obraz jeziora
- ⏳ Zarządzanie wszystkimi rezerwacjami (w budowie)
- ⏳ Moderacja opinii (w budowie)

### Panel Użytkownika
- ✅ Rejestracja i logowanie (JWT)
- ⏳ Przeglądanie dostępnych jezior (w budowie)
- ⏳ Interaktywna mapa z stanowiskami (w budowie)
- ⏳ Kalendarz rezerwacji z blokowaniem zajętych terminów (w budowie)
- ⏳ System opinii o jeziorach (w budowie)
- ⏳ Zarządzanie własnymi rezerwacjami (w budowie)

### System Rezerwacji
- ⏳ Blokowanie terminów (jedno stanowisko = jedna rezerwacja/dzień)
- ⏳ Kalendarz z wyróżnieniem zajętych dni
- ⏳ Automatyczne zapobieganie podwójnym rezerwacjom

## 🛠 Technologie

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (JSON Web Tokens) - autentykacja
- Multer - upload obrazów
- bcryptjs - hashowanie haseł
- Sharp - przetwarzanie obrazów

### Frontend
- React 18
- React Router v6
- Axios - API calls
- Context API - zarządzanie stanem
- CSS (jasna kolorystyka)

---

# 📦 INSTALACJA - KROK PO KROKU

## Krok 1: Wymagania

Zanim zaczniesz, upewnij się że masz zainstalowane:

### Node.js (wymagane!)
1. Sprawdź czy masz Node.js:
   ```bash
   node --version
   ```
2. Jeśli NIE MASZ (błąd), pobierz i zainstaluj:
   - Idź na: https://nodejs.org
   - Pobierz wersję **LTS** (np. 18.x.x lub 20.x.x)
   - Zainstaluj
   - **ZRESTARTUJ terminal!**

### MongoDB

**OPCJA A: MongoDB Atlas (POLECANE - darmowe online)** ⭐

1. Idź na: https://www.mongodb.com/cloud/atlas/register
2. Zarejestruj się (możesz użyć konta Google)
3. Kliknij **"Create"** → **"Shared"** (darmowy tier - FREE)
4. Wybierz region najbliżej Polski (np. Frankfurt)
5. Kliknij **"Create Cluster"** i poczekaj 3-5 minut
6. Po utworzeniu kliknij **"Connect"**
7. Kliknij **"Add a connection IP address"**
   - Wpisz: `0.0.0.0/0` (dostęp z wszędzie)
   - Kliknij **"Add Entry"**
8. Utwórz użytkownika bazy:
   - Username: `fishing_user`
   - Password: wygeneruj lub ustaw swoje (ZAPAMIĘTAJ!)
   - Kliknij **"Create User"**
9. Kliknij **"Choose a connection method"** → **"Connect your application"**
10. Skopiuj **connection string** (będzie wyglądał tak):
    ```
    mongodb+srv://fishing_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
    ```
11. **ZAMIEŃ `<password>` na swoje hasło!**

**OPCJA B: MongoDB lokalnie (trudniejsze)**
1. Pobierz MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Zainstaluj
3. Uruchom MongoDB (domyślnie: `mongodb://localhost:27017`)

---

## Krok 2: Pobierz projekt

### Opcja A: Git Clone (jeśli masz gita)
```bash
git clone https://github.com/TWOJ_USERNAME/projektwdr.git
cd projektwdr
```

### Opcja B: Download ZIP
1. Kliknij zielony przycisk **"Code"** → **"Download ZIP"**
2. Rozpakuj ZIP
3. Otwórz folder w terminalu

---

## Krok 3: Instalacja zależności

### Backend (serwer)

1. Otwórz terminal w folderze projektu
2. Przejdź do folderu server:
   ```bash
   cd server
   ```
3. Zainstaluj paczki:
   ```bash
   npm install
   ```
4. Poczekaj aż się zainstaluje (1-2 minuty)

### Frontend (klient)

1. **OTWÓRZ NOWE OKNO TERMINALA** (zostaw pierwsze otwarte!)
2. Przejdź do folderu client:
   ```bash
   cd client
   ```
   Lub pełna ścieżka:
   ```bash
   cd C:\Users\TWOJA_NAZWA\OneDrive\Desktop\projektwdr\client
   ```
3. Zainstaluj paczki:
   ```bash
   npm install
   ```
4. Poczekaj aż się zainstaluje (1-2 minuty)

---

## Krok 4: Konfiguracja

### Konfiguracja Backend

1. Otwórz plik `server/.env` w edytorze tekstu (Notepad++)
2. Zmień `MONGODB_URI` na swój connection string z MongoDB Atlas:
   ```env
   MONGODB_URI=mongodb+srv://fishing_user:TWOJE_HASLO@cluster0.xxxxx.mongodb.net/fishing-spots
   ```
   **WAŻNE**: Zamień `TWOJE_HASLO` i `cluster0.xxxxx` na swoje dane!

3. (Opcjonalnie) Zmień JWT_SECRET na losowy ciąg znaków:
   ```env
   JWT_SECRET=jakis-bardzo-tajny-losowy-klucz-12345
   ```

### Konfiguracja Frontend

Plik `client/.env` już jest skonfigurowany:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

**NIE ZMIENIAJ** tego, chyba że backend działa na innym porcie.

---

## Krok 5: Uruchomienie aplikacji

### Terminal 1 - Backend

```bash
cd server
npm run dev
```

**Powinieneś zobaczyć:**
```
Serwer uruchomiony na porcie 5000 w trybie development
MongoDB połączone: cluster0.xxxxx.mongodb.net
```

✅ **Jeśli widzisz to - SUPER! Backend działa!**

❌ **Jeśli błąd "MongoDB connection failed"**:
- Sprawdź czy MONGODB_URI w `server/.env` jest prawidłowy
- Sprawdź czy hasło jest poprawne (bez znaków specjalnych w < >)

**ZOSTAW TO OKNO TERMINALA OTWARTE!**

### Terminal 2 - Frontend

W **NOWYM OKNIE TERMINALA**:

```bash
cd client
npm start
```

Aplikacja automatycznie otworzy się w przeglądarce na: **http://localhost:3000**

✅ **Jeśli widzisz stronę główną - DZIAŁA!**

**ZOSTAW TEŻ TO OKNO TERMINALA OTWARTE!**

---

# 🎮 UŻYTKOWANIE

## Pierwsza rejestracja

1. Otwórz: http://localhost:3000
2. Kliknij **"Zarejestruj się"**
3. Wypełnij formularz:
   - Imię: `Admin`
   - Email: `admin@test.pl`
   - Hasło: `admin123`
   - Potwierdź hasło: `admin123`
4. Kliknij **"Zarejestruj się"**
5. Zostaniesz automatycznie zalogowany!

## Jak zostać Adminem

Po rejestracji jesteś zwykłym użytkownikiem. Aby zostać adminem:

### Sposób 1: MongoDB Compass (jeśli masz zainstalowany)

1. Otwórz MongoDB Compass
2. Połącz się używając swojego connection string
3. Wybierz bazę (prawdopodobnie `test` lub `fishing-spots`)
4. Kliknij kolekcję `users`
5. Znajdź swój dokument (po email: `admin@test.pl`)
6. Kliknij ikonę **ołówka** (Edit)
7. Zmień `"role": "user"` na `"role": "admin"`
8. Kliknij **Update**
9. **Wyloguj się i zaloguj ponownie** na stronie

### Sposób 2: MongoDB Atlas (WWW)

1. Zaloguj się na: https://cloud.mongodb.com
2. Kliknij **"Browse Collections"**
3. Wybierz swoją bazę danych
4. Kliknij kolekcję `users`
5. Znajdź użytkownika z email `admin@test.pl`
6. Kliknij w pole `role` i zmień `user` → `admin`
7. Kliknij **Update**
8. **Wyloguj się i zaloguj ponownie** na stronie

### Sposób 3: mongosh (dla zaawansowanych)

```bash
mongosh "TWOJ_CONNECTION_STRING"

use test

db.users.updateOne(
  { email: "admin@test.pl" },
  { $set: { role: "admin" } }
)
```

## Panel Administratora

Po zalogowaniu jako admin:

1. Kliknij **"Panel Admina"** w menu
2. Kliknij **"Jeziora"** lub idź na: http://localhost:3000/admin/lakes

### Dodawanie jeziora:

1. Kliknij **"+ Dodaj Jezioro"**
2. Wypełnij formularz:
   - Nazwa: np. "Jezioro Śniardwy"
   - Lokalizacja: np. "województwo warmińsko-mazurskie"
   - Opis: np. "Największe jezioro w Polsce..."
   - Obraz: wybierz plik JPG/PNG (opcjonalne)
3. Kliknij **"Dodaj Jezioro"**
4. Jezioro pojawi się na liście!

### Edycja jeziora:

1. Kliknij przycisk **"Edytuj"** przy jeziorze
2. Zmień dane
3. Kliknij **"Zapisz Zmiany"**

### Usuwanie jeziora:

1. Kliknij **"Usuń"**
2. Potwierdź w oknie dialogowym
3. Jezioro zostanie usunięte (wraz ze wszystkimi stanowiskami!)

---

# ❓ FAQ - Częste Problemy

## Problem: "npm: command not found"

**Rozwiązanie**: Nie masz zainstalowanego Node.js
- Pobierz z: https://nodejs.org
- Zainstaluj wersję LTS
- **ZRESTARTUJ terminal**

## Problem: "MongoDB connection failed"

**Rozwiązanie**:
1. Sprawdź `server/.env` → czy `MONGODB_URI` jest prawidłowy?
2. Czy zastąpiłeś `<password>` swoim prawdziwym hasłem?
3. Czy dodałeś IP `0.0.0.0/0` w MongoDB Atlas?
4. Spróbuj połączyć się przez MongoDB Compass - jeśli działa, to connection string jest OK

## Problem: "Port 3000 is already in use"

**Rozwiązanie**:
- Jakaś inna aplikacja używa portu 3000
- Zamknij inne aplikacje React
- Lub wciśnij `Y` gdy zapyta czy użyć innego portu (3001)

## Problem: "Port 5000 is already in use"

**Rozwiązanie**:
1. Windows: Otwórz Task Manager → Zakładka "Details"
2. Znajdź proces `node.exe` i zakończ go
3. Lub zmień port w `server/.env`: `PORT=5001`

## Problem: "Cannot find module"

**Rozwiązanie**:
1. Usuń foldery `node_modules` w `server` i `client`
2. Usuń pliki `package-lock.json`
3. Uruchom ponownie `npm install` w obu folderach

## Problem: Strona się nie ładuje

**Rozwiązanie**:
1. Sprawdź czy **OBA** terminale działają (backend i frontend)
2. Backend MUSI pokazywać: "MongoDB połączone"
3. Frontend MUSI być na http://localhost:3000
4. Sprawdź konsolę przeglądarki (F12) - czy są błędy?

## Problem: Nie mogę się zalogować

**Rozwiązanie**:
1. Sprawdź czy backend działa (terminal 1)
2. Czy widzisz "MongoDB połączone"?
3. Spróbuj zarejestrować się ponownie z innym emailem
4. Sprawdź czy w MongoDB Atlas masz użytkownika w kolekcji `users`

## Problem: Nie widzę "Panel Admina" w menu

**Rozwiązanie**:
- Twoje konto nie ma roli `admin`
- Zmień rolę w MongoDB (patrz sekcja "Jak zostać Adminem")
- **Wyloguj się i zaloguj ponownie**

---

# 📁 Struktura Projektu

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
- Platnosci online (Stripe/PayPal)
- Aplikacja mobilna (React Native)
