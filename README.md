# Ticket System (MERN)

Two modes:
- **Visitor**: raise a ticket (name, message, date/time), view own tickets, delete own tickets.
- **Admin**: login (username/password), see all tickets, resolve tickets.

## 1) Prereqs
- Node.js 18+ recommended
- MongoDB (local or Atlas)

## 2) Environment variables
Copy examples and fill values:
- `server/.env.example` -> `server/.env`
- `client/.env.example` -> `client/.env`

## 3) Install
From `ticket-system/`:

```bash
npm run install:all
```

## 4) Seed default admin (creates/updates admin in MongoDB)
```bash
npm run seed
```

## 5) Run dev
```bash
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:5000

## Notes
- Visitor ownership is tracked via a `visitorKey` stored in the browser (localStorage) and saved on the ticket. Only the same browser can delete/list those tickets.
- Admin auth uses JWT.
