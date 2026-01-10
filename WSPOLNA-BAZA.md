# 🤝 WSPÓŁNA BAZA DANYCH - Instrukcja

## Dla CIEBIE (osoba która już ma MongoDB):

### 1. Znajdź swój connection string

Otwórz plik `server/.env` i skopiuj wartość `MONGODB_URI`:

```env
MONGODB_URI=mongodb+srv://fishing_user:TWOJE_HASLO@cluster0.xxxxx.mongodb.net/fishing-reservation
```

### 2. Udostępnij kolegom

Wyślij im ten connection string (np. przez Discord/WhatsApp):
```
mongodb+srv://fishing_user:TWOJE_HASLO@cluster0.xxxxx.mongodb.net/fishing-reservation
```

**UWAGA:** To hasło daje dostęp do bazy! Udostępniaj tylko zaufanym osobom.

---

## Dla KOLEGÓW (którzy nie mają MongoDB):

### Krok 1: Pobierz projekt

```bash
git clone https://github.com/USERNAME/projektwdr.git
cd projektwdr
```

### Krok 2: Zainstaluj zależności

#### Backend:
```bash
cd server
npm install
```

#### Frontend (NOWE OKNO TERMINALA):
```bash
cd client
npm install
```

### Krok 3: Stwórz pliki .env

#### server/.env
Utwórz plik `server/.env` i wklej:

```env
PORT=5000
MONGODB_URI=CONNECTION_STRING_OD_KOLEGI
JWT_SECRET=nasz-wspolny-klucz-12345
NODE_ENV=development
```

**ZAMIEŃ:** `CONNECTION_STRING_OD_KOLEGI` na connection string który dostałeś!

#### client/.env
Utwórz plik `client/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Krok 4: Uruchom aplikację

#### Terminal 1 - Backend:
```bash
cd server
npm run dev
```

**Powinieneś zobaczyć:**
```
✓ Połączono z MongoDB
Serwer uruchomiony na porcie 5000
```

#### Terminal 2 - Frontend:
```bash
cd client
npm start
```

Aplikacja otworzy się na: **http://localhost:3000**

### Krok 5: Zarejestruj się

1. Wejdź na http://localhost:3000/register
2. Zarejestruj swoje konto
3. **NIE MUSISZ** robić siebie adminem (chyba że potrzebujesz)

---

## ✅ Teraz wszyscy:

- Widzicie te same dane w bazie
- Jeśli jeden doda jezioro → wszyscy to widzą
- Każdy ma swoje konto użytkownika
- Możecie wspólnie testować aplikację

---

## 🛡️ Zasady bezpieczeństwa:

- ⚠️ NIE usuwaj cudzych kont/danych
- ⚠️ NIE udostępniaj connection string obcym
- ⚠️ To tylko do developmentu, w produkcji będzie inaczej

---

## ❓ FAQ:

**Q: Czy muszę mieć MongoDB Atlas?**
A: NIE! Używasz connection string od kolegi.

**Q: Czy widzę dane kolegów?**
A: TAK! Wszyscy widzicie te same jeziora, rezerwacje, konta.

**Q: Co jeśli ktoś coś usunie?**
A: Będzie usunięte dla wszystkich. Bądźcie ostrożni!

**Q: Czy każdy musi uruchamiać backend?**
A: TAK, każdy uruchamia swój backend na swoim komputerze, ale wszyscy łączą się do tej samej bazy danych.

**Q: A co z obrazkami (zdjęcia jezior)?**
A: Obrazki są zapisywane lokalnie w `server/uploads/` - każdy ma swoje. W produkcji będzie to w chmurze.
