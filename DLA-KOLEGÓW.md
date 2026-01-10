# 🎣 INSTRUKCJA DLA KOLEGÓW - Krok po kroku

## ✅ WYMAGANIA

Zanim zaczniesz, zainstaluj:

### Node.js (MUSISZ MIEĆ!)
1. Idź na: https://nodejs.org
2. Pobierz wersję **LTS** (zalecana)
3. Zainstaluj (Next, Next, Finish)
4. **ZRESTARTUJ komputer** (ważne!)
5. Sprawdź czy działa:
   ```bash
   node --version
   ```
   Jeśli widzisz wersję (np. v18.17.0) = ✅ DZIAŁA!

---

## 📥 KROK 1: Pobierz projekt

### Opcja A: Przez Git (jeśli masz)
```bash
git clone https://github.com/TWOJ_USERNAME/projektwdr.git
cd projektwdr
```

### Opcja B: Pobierz ZIP
1. Idź na stronę GitHub projektu
2. Kliknij zielony przycisk **"Code"**
3. Wybierz **"Download ZIP"**
4. Rozpakuj ZIP do wybranego folderu
5. Otwórz folder w terminalu

---

## 📦 KROK 2: Zainstaluj zależności

**Otwórz 2 OKNA TERMINALA!** (Cmd lub PowerShell)

### Terminal 1 - Backend:
```bash
cd server
npm install
```

Poczekaj 1-2 minuty aż się zainstaluje...

### Terminal 2 - Frontend:
```bash
cd client
npm install
```

Poczekaj 1-2 minuty aż się zainstaluje...

---

## ⚙️ KROK 3: Konfiguracja (NAJWAŻNIEJSZE!)

### Plik 1: server/.env

1. W folderze `server` utwórz nowy plik o nazwie **`.env`**
   - Windows: Kliknij prawym → Nowy → Dokument tekstowy
   - Zmień nazwę na `.env` (DOKŁADNIE tak, z kropką!)

2. Otwórz plik w Notatniku
3. **Wklej dokładnie to** (dostaniesz od kolegi):

```env
PORT=5000
MONGODB_URI=CONNECTION_STRING_OD_KOLEGI
JWT_SECRET=nasz-wspolny-klucz-12345
NODE_ENV=development
```

4. **ZAMIEŃ** `CONNECTION_STRING_OD_KOLEGI` na prawdziwy connection string który dostałeś!

Powinno wyglądać tak:
```env
PORT=5000
MONGODB_URI=mongodb+srv://fishing_user:jakies_haslo@cluster0.xxxxx.mongodb.net/fishing-reservation
JWT_SECRET=nasz-wspolny-klucz-12345
NODE_ENV=development
```

5. **ZAPISZ** i zamknij plik

### Plik 2: client/.env

1. W folderze `client` utwórz nowy plik o nazwie **`.env`**
2. Otwórz w Notatniku
3. Wklej:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. **ZAPISZ** i zamknij plik

---

## ▶️ KROK 4: Uruchom aplikację

**WAŻNE:** Potrzebujesz 2 terminali jednocześnie!

### Terminal 1 - Backend:
```bash
cd server
npm run dev
```

**Powinieneś zobaczyć:**
```
✓ Połączono z MongoDB
Serwer uruchomiony na porcie 5000 w trybie development
```

✅ Jeśli widzisz to = SUPER! **ZOSTAW TO OKNO OTWARTE!**

❌ Jeśli błąd:
- Sprawdź czy `server/.env` ma prawidłowy MONGODB_URI
- Sprawdź czy port 5000 nie jest zajęty (zamknij inne aplikacje)

### Terminal 2 - Frontend:
```bash
cd client
npm start
```

Aplikacja automatycznie otworzy się w przeglądarce na:
**http://localhost:3000**

✅ Jeśli widzisz stronę główną = **DZIAŁA!**

**ZOSTAW RÓWNIEŻ TO OKNO OTWARTE!**

---

## 👤 KROK 5: Zarejestruj się

1. Otwórz: http://localhost:3000
2. Kliknij **"Zarejestruj się"**
3. Wypełnij formularz (użyj swojego prawdziwego emaila)
4. Kliknij **"Zarejestruj się"**
5. Zostaniesz zalogowany automatycznie!

---

## ✅ GOTOWE!

Teraz możesz:
- Przeglądać jeziora
- Rezerwować stanowiska
- Dodawać opinie

**Wszyscy widzicie te same dane!** Jeśli ktoś doda jezioro = wszyscy to widzą! 🎉

---

## 📞 Problemy?

### "npm: command not found"
→ Nie masz zainstalowanego Node.js. Idź do KROKU 1.

### "MongoDB connection failed"
→ Sprawdź `server/.env` czy MONGODB_URI jest prawidłowy (czy wkleiłeś connection string od kolegi).

### "Port 5000 already in use"
→ Jakiś inny program używa portu 5000.
- Windows: Otwórz Task Manager → zakończ proces `node.exe`
- Lub zmień port w `server/.env` na `PORT=5001`

### "Cannot find module"
→ Usuń folder `node_modules` i uruchom `npm install` ponownie.

### Strona się nie ładuje
→ Sprawdź czy OBA terminale działają (backend I frontend).

### Nie mogę się zalogować
→ Sprawdź czy backend działa (terminal 1 pokazuje "Połączono z MongoDB").

---

## 💡 WAŻNE!

- **Backend i Frontend muszą być ZAWSZE włączone** gdy korzystasz z aplikacji
- Gdy zamkniesz terminale = aplikacja przestanie działać
- Każdy ma swój backend i frontend na swoim komputerze
- Ale **wszyscy łączycie się do tej samej bazy danych** = widzicie te same dane!

---

## 🎮 Zaawansowane:

### Jak zostać Adminem?

Tylko jeśli potrzebujesz dodawać jeziora/stanowiska:

1. Zaloguj się na: https://cloud.mongodb.com
2. Wybierz "Browse Collections"
3. Znajdź swoją bazę danych
4. Kolekcja `users` → znajdź swój email
5. Zmień `"role": "user"` na `"role": "admin"`
6. **Wyloguj się i zaloguj ponownie** w aplikacji

---

**Powodzenia! 🚀**

Masz pytania? Napisz do kolegi który Ci przesłał link!
