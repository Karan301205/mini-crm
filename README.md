# Mini CRM System

> A full-stack Customer Relationship Management system built for managing student leads, counselors, follow-ups, analytics, and external lead imports using Google Sheets integration.

---

## Features

### Authentication & Authorization

- JWT-based authentication
- Secure password hashing using bcrypt
- Persistent login sessions
- Role-Based Access Control (RBAC)

#### Roles

**Admin**
- Manage all leads
- View dashboard analytics
- Assign/Reassign counselors
- Import leads from Google Sheets
- Access users management

**Counselor**
- View assigned leads
- Update lead stages
- Add follow-ups

---

### Dashboard Analytics

- Total Leads
- New Leads
- Converted Leads
- Hot Leads
- Lead stage analytics
- Dynamic charts & statistics

---

### Lead Management

- View all leads
- Create new leads
- Edit lead details
- Update lead stage
- Update priority
- Assign/Reassign counselors
- Lead detail drawer UI

---

### Follow-Up System

- Track lead follow-ups
- Follow-up statuses
- Upcoming follow-up reminders

---

### Google Sheets Integration

Supports importing leads directly from Google Sheets.

**Flow**

```
Google Sheets
     ↓
Backend Import API
     ↓
PostgreSQL Database
     ↓
CRM Dashboard & Leads UI
```

**Features**
- CSV parsing
- Redirect handling for Google export URLs
- Bulk insertion using Prisma `createMany`
- Duplicate skipping support

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React | UI Framework |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| React Router | Routing |
| Axios | HTTP Client |
| Lucide React | Icons |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | Web Framework |
| Prisma ORM | Database Layer |
| JWT | Authentication |
| bcryptjs | Password Hashing |

### Infrastructure

| Service | Role |
|---|---|
| PostgreSQL (Neon) | Database |
| Vercel | Frontend Deployment |
| Render | Backend Deployment |

---

## Project Structure

```
mini-crm/
│
├── client/               # React frontend
│   ├── src/
│   │   ├── pages/        # Route-level components
│   │   ├── components/   # Shared UI components
│   │   └── api/          # Axios API calls
│   └── .env
│
├── server/               # Express backend
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── routes/
│   ├── index.js
│   └── .env
│
└── README.md
```

---

## Installation & Setup

### Clone Repository

```bash
git clone <your-repository-url>
cd mini-crm
```

### Setup Backend

```bash
cd server
npm install
```

Create `.env`:

```env
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_secret_key
```

Run migrations:

```bash
npx prisma migrate dev
npx prisma generate
node prisma/seed.js
npm run dev
```

> Backend runs on `http://localhost:5001`

### Setup Frontend

```bash
cd client
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5001
```

Start frontend:

```bash
npm run dev
```

> Frontend runs on `http://localhost:5173`

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@crm.com | password123 |
| Counselor | counselor@crm.com | password123 |

---

## Google Sheets Import Setup

**Step 1** — Create a Google Sheet with these columns:

```
Name | Phone | Email | Course | Stage | Priority
```

**Step 2** — Publish the sheet:

```
File → Share → Publish to Web
Select: Entire Document → CSV → Publish
```

**Step 3** — Copy the Sheet ID from the URL:

```
https://docs.google.com/spreadsheets/d/SHEET_ID/edit
```

**Step 4** — Paste the Sheet ID into the backend import route and trigger import from the Admin panel.

---

## Deployment

### Backend (Render)

| Setting | Value |
|---|---|
| Build Command | `npm install && npx prisma generate` |
| Start Command | `node index.js` |

Environment variables:

```env
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_secret_key
```

Post-deploy:

```bash
npx prisma migrate deploy
node prisma/seed.js
```

### Frontend (Vercel)

Create `.env`:

```env
VITE_API_URL=https://your-render-backend-url.onrender.com
```

Deploy from the `client/` directory.

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | Authenticate user, returns JWT |

### Leads
| Method | Endpoint | Description |
|---|---|---|
| GET | `/leads` | Fetch all / assigned leads |
| POST | `/leads` | Create a new lead |
| PATCH | `/leads/:id` | Update lead details |

### Users
| Method | Endpoint | Description |
|---|---|---|
| GET | `/users` | List all counselors (Admin) |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard-stats` | Aggregate analytics |

### Import
| Method | Endpoint | Description |
|---|---|---|
| POST | `/import-google-sheet` | Import leads from Google Sheets CSV |

---

## Assignment Requirements Covered

- [x] Full-stack CRM system
- [x] Authentication system
- [x] Role-based access control
- [x] PostgreSQL integration
- [x] Dashboard analytics
- [x] Lead management
- [x] Counselor assignment
- [x] Follow-up management
- [x] Google Sheets integration
- [x] Dynamic frontend UI
- [x] Deployment-ready architecture

---

## Author

**Karan Rawat**
