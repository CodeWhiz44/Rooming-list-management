# Rooming List Management App

A full-stack application for managing hotel rooming lists for events, built with:

-   **Backend**: Node.js, Express, Prisma ORM, PostgreSQL, JWT Auth
-   **Frontend**: React, Zustand, TailwindCSS
-   **Features**: Grouped & paginated rooming lists, bookings, infinite scroll, protected APIs

---

## Features

-   View, search, filter, sort and group rooming lists by event
-   View bookings for each rooming list
-   JWT-based authentication (simple click login to get token)
-   Insert/seed data from JSON in one click
-   REST API for all operations
-   Infinite scroll & responsive UI

---

## Database Schema

Three tables:

-   **roomingList** (roomingListId, eventId, eventName, hotelId, rfpName, cutOffDate, status, agreement_type)
-   **booking** (bookingId, hotelId, eventId, guestName, guestPhoneNumber, checkInDate, checkOutDate)
-   **roomingListBooking** (id, roomingListId, bookingId, many-to-many relation)

---

## Getting Started

### Prerequisites

-   Node.js (v18+)
-   Docker & Docker Compose (for DB and running everything locally)

---

### 1. Clone and Setup

```bash
git clone git@github.com:CodeWhiz44/Rooming-list-management.git
cd Rooming-list-management
cp ./backend/.env.example ./backend/.env
cp ./frontend/.env.example ./frontend/.env
```

Edit .env files on backend and frontend like Database information

```bash
# To run entire application including frontend, backend
docker compose up --build
```

### 2. Start PostgreSQL with Docker

```bash
docker compose up -d db
```

### 3. Migrate & Generate Prisma Client

```bash

cd backend
npx prisma generate
npx prisma migrate deploy
```

### 4. Start Backend & test

```bash
cd backend
npm install
npm run dev

npm run test ## for test
```

Or with Docker:

```bash
docker compose up --build backend

#for test, after runing the backend in docker
docker compose up --build backend-test
```

The API will be running at http://localhost:5001/api.

### 5. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Or with Docker:

```bash
docker compose up --build frontend
```

Visit http://localhost:5173

### Run application with Docker

```bash
docker compose up --build
```

💡 Notes
All secrets/connection strings are managed via .env.

## Folder Structure

```
backend/
├── src/
│ ├── controllers/
│ ├── routes/
│ ├── middleware/
│ └── ...
├── prisma/
│ └── schema.prisma
├── data/
├── tests/
├── .env.example
└── package.json

frontend/
├── src/
│ ├── components/
│ ├── store/
│ └── pages/
├── .env.example
└── package.json
docker-compose.yml
README.md
```

## API Endpoints

-   All endpoints (except /api/auth/\*) require JWT Authorization header:
    Authorization: Bearer <your_token>

-   Auth
    POST /api/auth/login
    Body: { username, password } → returns { token }

    ( simple login to provide token )

-   Seed
    POST /api/seed
    (JWT required) Inserts sample bookings/rooming lists from JSON.

-   GET /api/rooming-lists/grouped
    Query: search, status, sort, page, pageSize
    Returns paginated lists grouped by event.

-   Rooming Lists
    GET /api/rooming-lists
    Query: search, status, sort, page, pageSize
    Returns paginated rooming lists (flat).

-   GET /api/rooming-lists/:id/bookings
    Returns all bookings for a given rooming list id.

## Key Architectural Decisions

#### Backend

-   Prisma ORM: Used for type-safe PostgreSQL access.

-   API design: RESTful, with clear resource-based endpoints.

-   Authentication: Endpoints (except /api/auth/\*) protected by JWT middleware.

-   Grouping Pagination: /api/rooming-lists/grouped paginates by events, returning groups of rooming lists per event, enabling scalable UI grouping.

#### Frontend

-   React + Zustand: State is managed globally (rooming lists, loading, paging, etc).

-   Infinite Scroll with Grouping: Uses IntersectionObserver to trigger additional fetches without triggering full re-renders or scroll-to-top glitches. Grouping is performed server-side, so new groups simply append without resetting scroll, in terms of UX

-   Minimized Unnecessary Re-Renders:

        - Utilzed the Zustand for global state management

        - Grouping is handled in the backend so frontend doesn’t have to re-compute or re-group after each fetch.

        - Local component state is minimized in favor of store-driven state for smooth UX.

#### Testing

-   Jest + Supertest for backend endpoint testing (unit and integration).

-   Sample test: checks that /api/rooming-lists/grouped returns paginated, grouped lists.
