# 🔧 FIX: MongoDB Connection Error

## Problem:
Widzisz błąd: **"MongoDB connection failed"** lub **"MongoServerError"**

## Powód:
MongoDB Atlas blokuje Twoje IP. Admin musi dodać Twoje IP do whitelist.

---

## ✅ ROZWIĄZANIE:

### Krok 1: Sprawdź swoje IP

Wejdź na: **https://whatismyipaddress.com**

Skopiuj **IPv4 Address** (np. `82.123.45.67`)

### Krok 2: Wyślij IP do admina

Napisz do osoby która udostępnia Ci connection string:

```
Hej! Mam błąd połączenia z MongoDB.
Moje IP to: 82.123.45.67
Czy możesz dodać je do whitelist?
```

### Krok 3: Poczekaj aż admin doda IP

Admin musi:
1. Zalogować się do MongoDB Atlas
2. Network Access → Add IP Address
3. Dodać Twoje IP

### Krok 4: Spróbuj ponownie

Po 1-2 minutach:

1. **Zatrzymaj backend** (Ctrl+C w terminalu)
2. **Uruchom ponownie:**
   ```bash
   cd server
   npm run dev
   ```
3. Sprawdź czy widzisz: **"✓ Połączono z MongoDB"**

---

## ✅ Jeśli działa:

Powinieneś zobaczyć:
```
✓ Połączono z MongoDB
Serwer uruchomiony na porcie 5000 w trybie development
```

Teraz uruchom frontend (w drugim terminalu):
```bash
cd client
npm start
```

---

## ❌ Jeśli nadal nie działa:

### Sprawdź 1: Czy masz prawidłowy connection string?

Otwórz `server/.env` i sprawdź:
```env
MONGODB_URI=mongodb+srv://fishing_user:HASLO@cluster0.xxxxx.mongodb.net/fishing-reservation
```

- Czy `<password>` został zamieniony na prawdziwe hasło?
- Czy NIE MA znaków `< >` w środku?

### Sprawdź 2: Czy admin dodał IP?

Zapytaj admina:
- Czy dodał Twoje IP w MongoDB Atlas?
- Czy wybrał opcję "ALLOW ACCESS FROM ANYWHERE" (0.0.0.0/0)?

### Sprawdź 3: Test połączenia

Spróbuj ręcznie połączyć się przez MongoDB Compass:
1. Pobierz MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Otwórz i wklej connection string
3. Kliknij "Connect"
4. Jeśli połączy się = problem jest gdzie indziej
5. Jeśli nie = IP nie jest dodany w whitelist

---

## 🔄 Inne możliwe problemy:

### "Network timeout"
→ Twoja sieć/firewall blokuje połączenie. Sprawdź VPN/firewall.

### "Bad auth: Authentication failed"
→ Złe hasło w connection string. Sprawdź czy `<password>` został zamieniony.

### "Invalid connection string"
→ Źle skopiowany connection string. Poproś admina o nowy.

---

## 💡 Pro Tip:

Admin może raz na zawsze ustawić:
```
IP: 0.0.0.0/0 (ALLOW ACCESS FROM ANYWHERE)
```

To pozwala połączyć się z każdego IP - dobre dla development!

---

**Powodzenia! 🚀**
