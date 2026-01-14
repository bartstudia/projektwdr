# API

Base URL: `http://localhost:5000/api`

## Auth

### POST /auth/register
Rejestracja uzytkownika.

Request body:
```json
{
  "email": "user@example.com",
  "password": "secret123",
  "name": "Jan"
}
```

Response (201):
```json
{
  "message": "Rejestracja przebiegla pomyslnie",
  "token": "JWT",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "user"
  }
}
```

### POST /auth/login
Logowanie uzytkownika.

Request body:
```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

Response (200):
```json
{
  "message": "Logowanie pomyslne",
  "token": "JWT",
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "user"
  }
}
```

### GET /auth/me
Zwraca dane zalogowanego uzytkownika.

Headers:
```
Authorization: Bearer <token>
```

## Lakes

### GET /lakes
Lista jezior.

### GET /lakes/:id
Szczegoly jeziora oraz lista stanowisk.

### POST /lakes
Tworzenie jeziora (admin).

Headers:
```
Authorization: Bearer <token>
```

Request body:
```json
{
  "name": "Jezioro X",
  "description": "Opis",
  "location": "Wojewodztwo"
}
```

### PUT /lakes/:id
Aktualizacja jeziora (admin).

### DELETE /lakes/:id
Usuniecie jeziora (admin).

### POST /lakes/:id/image
Upload obrazu jeziora (admin).

Form-data:
- `image` (file)

## Spots

### GET /spots/lake/:lakeId
Lista stanowisk dla jeziora.

### GET /spots/:id
Szczegoly stanowiska.

### GET /spots
Lista wszystkich stanowisk (admin).

### POST /spots
Tworzenie stanowiska (admin).

Request body:
```json
{
  "lakeId": "string",
  "name": "Stanowisko 1",
  "description": "Opcjonalny opis",
  "mapCoordinates": {
    "shape": "circle",
    "coords": [100, 120, 10]
  }
}
```

### PUT /spots/:id
Aktualizacja stanowiska (admin).

### DELETE /spots/:id
Usuniecie stanowiska (admin).

## Reservations

### GET /reservations/lake/:lakeId/date/:date
Publiczne sprawdzenie zajetych stanowisk w danym dniu.

Param `date`: ISO lub `YYYY-MM-DD`.

### POST /reservations
Utworzenie rezerwacji.

Headers:
```
Authorization: Bearer <token>
```

Request body:
```json
{
  "spotId": "string",
  "lakeId": "string",
  "date": "2026-01-14",
  "notes": "Opcjonalnie"
}
```

### GET /reservations/my
Lista rezerwacji uzytkownika.

Query:
- `status` (opcjonalnie): pending | confirmed | cancelled
- `upcoming` (opcjonalnie): true | false

### GET /reservations/:id
Szczegoly rezerwacji (wlasciciel lub admin).

### PUT /reservations/:id/cancel
Anulowanie rezerwacji (wlasciciel lub admin).

### GET /reservations/spot/:spotId/reserved-dates
Zajete daty dla stanowiska.

Query:
- `startDate` (wymagane)
- `endDate` (wymagane)

### GET /reservations/admin/all
Lista wszystkich rezerwacji (admin).

Query:
- `status`
- `lakeId`
- `startDate`
- `endDate`

## Reviews

### GET /reviews/lake/:lakeId
Opinie o jeziorze.

### POST /reviews
Dodanie opinii (wymaga wczesniejszej rezerwacji).

Headers:
```
Authorization: Bearer <token>
```

Request body:
```json
{
  "lakeId": "string",
  "rating": 5,
  "comment": "Super miejsce!"
}
```

### GET /reviews/my
Opinie zalogowanego uzytkownika.

### PUT /reviews/:id
Aktualizacja opinii (wlasciciel).

### DELETE /reviews/:id
Usuniecie opinii (wlasciciel lub admin).

### GET /reviews/admin/all
Lista wszystkich opinii (admin).
