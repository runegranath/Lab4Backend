# Laboration 4 - Autentisering och säkerhet
Detta repository innehåller backend-kod för ett enklare REST API byggt med Express. APIet är byggt för att hantera registrering, inloggning, skyddade resurser samt säkerhet med hjälp av hashning och JSON Web Tokens.

# Länk

En liveversion av API:et finns tillgänglig på följande URL: [Lab4](https://lab4frontend.onrender.com/index.html)

# Installation, databas

1. Klona ner källkodsfilerna från GitHub.
2. Kör kommandot `npm install` för att installera nödvändiga npm-paket.
3. Kör installationsskriptet med `node install.js` för att skapa databasfilen och tabellerna.
4. Starta servern med `node server.js` (eller `npm run serve` om nodemon används).

### Databasstruktur
Installations-skriptet skapar en tabell för användare med följande struktur:

| Tabell-namn | Fält | Beskrivning |
| :--- | :--- | :--- |
| **users** | `id` | INTEGER PRIMARY KEY AUTOINCREMENT |
| | `username` | VARCHAR(255) UNIQUE NOT NULL |
| | `password` | VARCHAR(255) NOT NULL (Hashed med Bcrypt) |
| | `created_at` | TIMESTAMP DEFAULT CURRENT_TIMESTAMP |

# Användning

Nedan finns beskrivet hur man når API:ets ändpunkter:

| Metod | Ändpunkt | Beskrivning |
| :--- | :--- | :--- |
| POST | `/api/register` | Registrerar en ny användare. Kräver username och password. |
| POST | `/api/login` | Loggar in användare och returnerar en JWT-token. |
| GET | `/api/protected` | En skyddad rutt som kräver giltig JWT-token i headers. |

### Exempel på JSON-objekt
Vid registrering och inloggning skickas data med följande struktur:

```json
{
    "username": "exempelanvändare",
    "password": "katt"+"restenavlösenordet"
}