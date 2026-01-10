# 🖥️ JEDEN BACKEND - Współdzielony Serwer

## Koncepcja:

- **TY** = HOST (uruchamiasz backend)
- **Koledzy** = KLIENCI (łączą się do Twojego backendu)
- Wszyscy w tej samej sieci WiFi
- Wszyscy widzą te same dane

---

## Dla CIEBIE (HOST):

### 1. Sprawdź swoje IP

```bash
ipconfig
```

Szukaj: **IPv4 Address**, np: `192.168.1.33`

### 2. Twój server/.env pozostaje bez zmian

```env
PORT=5000
MONGODB_URI=mongodb+srv://fishing_user:TWOJE_HASLO@cluster0.xxxxx.mongodb.net/fishing-reservation
JWT_SECRET=nasz-wspolny-klucz-12345
NODE_ENV=development
```

### 3. Uruchom backend

```bash
cd server
npm run dev
```

**ZOSTAW WŁĄCZONE!** Koledzy potrzebują tego aby działało.

### 4. (Opcjonalnie) Uruchom frontend u siebie

Jeśli chcesz też korzystać przez przeglądarkę:

```bash
cd client
npm start
```

### 5. Powiedz kolegom Twoje IP

Wyślij kolegom: **"Moje IP: 192.168.1.33"**

---

## Dla KOLEGÓW (KLIENCI):

### 1. Pobierz projekt

```bash
git clone https://github.com/USERNAME/projektwdr.git
cd projektwdr
```

### 2. Zainstaluj zależności TYLKO dla frontendu

```bash
cd client
npm install
```

**NIE MUSISZ instalować backendu!**

### 3. Stwórz client/.env

Utwórz plik `client/.env` z IP hosta:

```env
REACT_APP_API_URL=http://192.168.1.33:5000/api
```

**ZAMIEŃ** `192.168.1.33` na IP które dostałeś od hosta!

### 4. Uruchom TYLKO frontend

```bash
cd client
npm start
```

Aplikacja otworzy się na: **http://localhost:3000**

(Lub możesz też wejść na: **http://192.168.1.33:3000** jeśli host ma uruchomiony frontend)

---

## ✅ Teraz:

- HOST ma uruchomiony backend i bazę danych
- Wszyscy KLIENCI łączą się do backendu hosta
- Wszyscy widzą te same dane
- Jeśli host wyłączy komputer → aplikacja przestaje działać dla wszystkich

---

## 📋 Wymagania:

- ✅ Wszyscy w tej samej sieci WiFi
- ✅ Host musi mieć komputer włączony
- ✅ Host musi mieć backend uruchomiony (`npm run dev`)
- ✅ Firewall na komputerze hosta nie blokuje port 5000

---

## 🛠️ Troubleshooting:

### "Brak połączenia z serwerem" (u klientów)

**Sprawdź:**
1. Czy host ma backend włączony?
2. Czy IP jest prawidłowe?
3. Czy jesteście w tej samej sieci WiFi?
4. Czy firewall hosta nie blokuje?

**Windows Firewall (HOST):**
```
1. Wyszukaj "Windows Defender Firewall"
2. "Zezwalaj aplikacji przez Zaporę"
3. Znajdź "Node.js" i zaznacz obie opcje (Prywatna i Publiczna)
```

### Jak sprawdzić czy backend jest dostępny?

Koledzy mogą otworzyć w przeglądarce:
```
http://192.168.1.33:5000/api/lakes
```

Jeśli widzą JSON → działa! ✅

---

## ⚡ Zalety tej opcji:

- Koledzy nie muszą konfigurować MongoDB
- Koledzy nie muszą uruchamiać backendu
- Wszyscy widzą te same dane
- Łatwa współpraca

## ⚠️ Wady:

- HOST musi mieć komputer włączony
- Działa tylko w tej samej sieci
- Jeśli host wyłączy backend → nikt nie może korzystać
