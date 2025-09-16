# Nest API (JWT + Roles + Admin-only Register)

## Cómo correr
1) `npm i`
2) `npm run start:dev`
3) Base URL: `http://localhost:3000/api`

## Usuarios seed
- admin: `admin@demo.com` / `admin123`

## Endpoints
- `POST /api/auth/login`
- `POST /api/users` (solo admin)
- `GET /api/users` (autenticado)
- `GET /api/rides` (autenticado)
- `GET /api/rides/me` (autenticado)
- `POST /api/rides` (autenticado)
- `POST /api/rides/:id/accept` (autenticado)
