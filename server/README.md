BookMe är en robust bokningsplattform för coworking-spaces byggd med Node.js. Systemet är designat med fokus på säkerhet, prestanda och användarupplevelse genom realtidsuppdateringar och intelligent caching.

Projektstruktur
server.js – Applikationens entry-point. Konfigurerar Express, Middleware och startar servrar.
config/ – Centraliserad konfiguration för MongoDB (Mongoose) och Redis.
controllers/ – Orkesrerar logiken för API-endpoints och hanterar HTTP-svar.
services/ – Innehåller den faktiska affärslogiken (t.ex. krock-kontroll vid bokning).
models/ – Databasmodeller (User, Booking, Room) med Mongoose.
routes/ – Definitioner av API-strukturen och koppling till controllers.
middlewares/ – Skyddslager: JWT-validering, rollbaserad behörighet (RBAC), Rate Limiting och centraliserad felhantering.
constants/ – Centraliserade strängar för roller, behörigheter och Socket-events för att minimera buggar.

Teknikstack
Backend: Node.js med Express.js
Databas: MongoDB med Mongoose
Caching: Redis (används för rumsoptimering och prestanda)
Realtid: Socket.io (direkta kalenderuppdateringar utan omladdning)
Säkerhet: JWT (Access & Refresh Tokens) samt bcrypt för lösenordshashning
Loggning: Winston (Audit logs, säkerhetsvarningar och felhantering)

Installation & Lokal körning

Förutsättningar
Node.js & npm installerat
MongoDB (Lokalt eller Atlas)
Redis (Lokalt eller Upstash)

Steg för steg
Klona repot: git clone <repo-url> && cd BookMe
Installera beroenden: npm install
Konfigurera miljövariabler: Skapa en .env (se .env.example):

Starta: npm run dev

API & Behörigheter

Autentisering & Profil (/api/auth)
Metod Rutt Beskrivning Behörighet
POST /register Skapa nytt konto Publik
POST /login Inloggning & sätta session Publik
POST /refresh Förnya Access Token Inloggad
GET /me Hämta profil för inloggad Inloggad
POST /logout Logga ut & rensa cookies Inloggad
PATCH /update-profile Ändra namn/e-post Inloggad
PATCH /update-password Ändra lösenord Inloggad
DELETE /delete-account Radera eget konto & bokningar Inloggad

Rumshantering (/api/rooms)
Metod Rutt Beskrivning Behörighet (Permission)
GET / Hämtar alla rum (Redis-optimerat) ROOM_READ (Inloggad)
GET /:id Hämtar detaljer för ett specifikt rum ROOM_READ (Inloggad)
POST / Skapar ett nytt rum i systemet ROOM_CREATE (Admin)
PUT /:id Uppdaterar samtliga fält för ett rum ROOM_UPDATE (Admin)
DELETE /:id Tar bort ett rum permanent ROOM_DELETE (Admin)

Bokningshantering (/api/bookings)
Metod Rutt Beskrivning Behörighet (Permissions)
GET / Hämtar kalendervyn (maskerad för users) BOOKING_READ_OWN / ALL
GET /:id Hämtar detaljer för en specifik bokning BOOKING_READ_OWN / ALL
POST / Skapar ny bokning (Rate Limited & Validerad) BOOKING_CREATE
PUT /:id Uppdaterar befintlig bokning (Validerad) BOOKING_UPDATE_OWN
DELETE /:id Avbokar (Ej tillåtet för historik) BOOKING_DELETE_OWN / ALL

Användaradministration (/api/users)
Metod Rutt Beskrivning Behörighet (Permissions)
GET / Hämtar en lista över samtliga registrerade användare USER_READ_ALL (Admin)
PATCH /:id Uppdaterar en användares roll (t.ex. från User till Admin) USER_UPDATE_ALL (Admin)
DELETE /:id Raderar en användare permanent från systemet USER_DELETE_ALL (Admin)

Socket.io - Event Dokumentation
Systemet använder ett rumsbaserat system (Rooms) för att separera publik och känslig data.

Inkommande (Från klient)
join: Användare går med i sitt personliga rum för notiser.
join-admin: Administratörer går med i admins-rummet för fullständig dataexponering.

Utgående (Från server)
admin_calendar_update: Skickar fullständigt objekt inkl. användarnamn till admins.
public_calendar_update: Skickar anonymiserad data ("Upptaget") till alla klienter.
admin_calendar_delete / public_calendar_delete: Synkar radering omedelbart i vyer.
booking_success: Personlig bekräftelse till användaren.

Arkitektoniska beslut
Säkerhet (RBAC & JWT): Implementerat ett dubbelt tokensystem (Access/Refresh). En central authorize-middleware kontrollerar roller (Admin/User).
Referensintegritet: Vid radering av konto utförs en Cascading Delete i backend som rensar alla tillhörande bokningar för att undvika korrupt data i kalendern.
Tidszoner: Applikationen sparar all data i UTC i MongoDB för konsistens, men mappar till lokal tid (Europe/Stockholm) i frontend för användarvänlighet.
Prestanda (Redis): Rumslistan cachas i Redis. Vid varje bokningsändring sker Cache Invalidation (DEL rooms) för att garantera att lediga tider stämmer vid nästa sökning.
Robust Felhantering:
Frontend: Interceptor som hanterar 401 Unauthorized och tvingar utloggning om sessionen dör (t.ex. vid cookie-krock).
Backend: Global error-middleware som loggar stack trace via Winston men döljer interna fel för användaren.

Verifiering (Postman & Manuellt)
Konflikttest: Verifierat att dubbelbokning av samma rum/tid ger 400 Bad Request.
Behörighetstest: Testat att ändra roller via /api/users som vanlig User (Blockeras med 403).
Realtidstest: Verifierat simultan uppdatering i två olika webbläsare vid bokning.
