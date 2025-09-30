# PPLATAFORMAS – API (NestJS + JWT + Roles + MongoDB)

Este repositorio contiene una API construida con **NestJS 10** que implementa:
- Autenticación **JWT**.
- Autorización por **roles** (admin/usuario).
- Gestión de **usuarios** (registro solo para admin, listado).
- Módulo de **viajes (rides)** con creación/listado/aceptación.
- Persistencia en **MongoDB** con **Mongoose**.
- Infraestructura con **Docker/Docker Compose** y panel **mongo-express**.

> Prefijo global de rutas: `http://localhost:3000/api` (definido en `src/main.ts`).

---

## Estructura del proyecto

```
.
├── src/
│   ├── app.module.ts             # Módulo raíz: carga .env, conecta a Mongo y ensambla módulos
│   ├── main.ts                   # Bootstrap Nest + setGlobalPrefix('api')
│   ├── auth/                     # Autenticación/Autorización
│   │   ├── auth.controller.ts    # POST /auth/login
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts       # Login: valida credenciales y firma JWT
│   │   ├── jwt-auth.guard.ts     # Guard Passport('jwt')
│   │   └── jwt.strategy.ts       # Extrae y valida el token Bearer
│   ├── common/                   # Utilidades de roles
│   │   ├── roles.decorator.ts    # @Roles(...)
│   │   ├── roles.enum.ts         # enum Role { Admin, User }
│   │   └── roles.guard.ts        # Verifica roles requeridos vs roles en JWT
│   ├── users/                    # Dominio Usuarios
│   │   ├── dto/create-user.dto.ts
│   │   ├── entities/user.entity.ts
│   │   ├── schemas/user.schema.ts# Schema Mongoose (users)
│   │   ├── users.controller.ts   # POST /users (admin), GET /users (auth)
│   │   ├── users.module.ts
│   │   └── users.service.ts      # CRUD + seed de admin si no existe
│   └── rides/                    # Dominio Rides (viajes compartidos)
│       ├── dto/create-ride.dto.ts
│       ├── schemas/ride.schema.ts# Schema Mongoose (rides)
│       ├── rides.controller.ts   # GET /rides, GET /rides/me, POST /rides, POST /rides/:id/accept
│       ├── rides.module.ts
│       └── rides.service.ts      # Lógica de negocio de rides
├── mongo-init/
│   ├── 00_create_database.js     # Crea DB jsrl_project
│   ├── 01_create_user.js         # Crea usuario api_user:api1234
│   └── 02_create_user_collection.js # Índices y seeds de ejemplo (solo demo)
├── Dockerfile                    # Build multi-stage (node:20-alpine)
├── docker-compose.yml            # Servicios: api, mongo, mongo-express
├── .env                          # PORT, JWT_*, MONGODB_URI (para compose)
├── package.json                  # dependencias y scripts
├── tsconfig.json                 # configuración TypeScript
└── README.md                     # guía breve
```

---

## Modelos (Mongoose)

### User (`src/users/schemas/user.schema.ts`)
```ts
name: string;            // requerido
email: string;           // requerido, único, lowercase, trim
password?: string;       // (solo demo) texto plano para seeds de ejemplo
passwordHash?: string;   // hash bcrypt (recomendado)
roles: string[] = [];    // p.ej. ["admin"] o ["user"]
active: boolean = true;
```

> **Nota:** El proyecto admite *temporalmente* contraseñas en texto claro para datos de prueba. En producción usa **passwordHash** con **bcrypt** y elimina el campo `password`.

### Ride (`src/rides/schemas/ride.schema.ts`)
```ts
origin: string;                      // requerido
destination: string;                 // requerido
price: number;                       // ≥ 0
seats: number = 1;                   // ≥ 1
status: 'pending'|'accepted'|'completed'|'canceled' = 'pending'
createdBy: Types.ObjectId;           // ref User (requerido)
acceptedBy?: Types.ObjectId;         // ref User (opcional)
```
Índices:
- `{ status: 1, createdAt: -1 }`
- `{ origin: 1, destination: 1 }`

---

## Autenticación y Roles

- **Login** emite un JWT con `sub`, `email`, `roles`.
- Rutas protegidas usan `JwtAuthGuard` (token Bearer).
- Roles se anotan con `@Roles(Role.Admin)` y se validan con `RolesGuard`.

Seed de usuario admin:
- **email:** `admin@demo.com`
- **password:** `admin123`
> Se crea automáticamente en `UsersService` si no existe.

Variables desde `.env`:
- `JWT_SECRET`, `JWT_EXPIRES`

---

## Endpoints

> Base: `http://localhost:3000/api`

### Auth
- `POST /auth/login`
  - Body: `{ "email": "admin@demo.com", "password": "admin123" }`
  - Respuesta: `{ "access_token": "<jwt>", "user": { id, email, roles } }`

### Users
- `POST /users` (**solo admin, requiere Bearer token**)
  - Body: `{ "name": "...", "email": "...", "password": "...", "roles": ["user"] }`
  - Crea usuario (único por email). Devuelve el usuario sin `passwordHash`.
- `GET /users` (**requiere Bearer token**)
  - Lista todos los usuarios.

### Rides
- `GET /rides`
  - Lista todos los rides.
- `GET /rides/me` (**requiere Bearer token**)
  - Lista los rides del usuario autenticado (creados o aceptados por él).
- `POST /rides` (**requiere Bearer token**)
  - Body ejemplo:
    ```json
    {
      "origin": "Universidad Javeriana, Cali",
      "destination": "Palmira",
      "price": 8000,
      "seats": 3
    }
    ```
  - Crea un ride con `createdBy = <usuario JWT>`.
- `POST /rides/:id/accept` (**requiere Bearer token**)
  - Marca el ride como `accepted` y setea `acceptedBy = <usuario JWT>` si está `pending`.

---

## Ejemplos `curl`

```bash
# Login
curl -sS -X POST http://localhost:3000/api/auth/login   -H "Content-Type: application/json"   -d '{"email":"admin@demo.com","password":"admin123"}'

# Crear usuario (como admin)
curl -sS -X POST http://localhost:3000/api/users   -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json"   -d '{"name":"Juan","email":"juan@demo.com","password":"1234","roles":["user"]}'

# Crear ride
curl -sS -X POST http://localhost:3000/api/rides   -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json"   -d '{"origin":"Cali","destination":"Palmira","price":8000,"seats":2}'

# Aceptar ride
curl -sS -X POST http://localhost:3000/api/rides/64f0.../accept   -H "Authorization: Bearer $TOKEN"
```

---

## Despliegue y ejecución

### Opción A) Docker Compose (recomendada)
1. Asegúrate de tener **Docker** y **Docker Compose**.
2. Copia `.env` (ya incluido con valores por defecto).
3. Ejecuta:
   ```bash
   docker compose up --build
   ```
4. Servicios:
   - API: `http://localhost:3000/api`
   - MongoDB: `localhost:27017`
   - mongo-express: `http://localhost:8081` (panel web)

> Compose levanta **mongo** con scripts `mongo-init/*` que crean DB, usuario `api_user` y seeds de usuarios de prueba.

### Opción B) Local (sin Docker)
1. Tener MongoDB local (`mongodb://localhost:27017/jsrl_project`) o configurar `MONGODB_URI` en `.env`.
2. Instalar dependencias y arrancar:
   ```bash
   npm i
   npm run start:dev
   ```
3. Base URL: `http://localhost:3000/api`.

---

## Seguridad y buenas prácticas

- **No** uses `password` en claro en producción; usa `passwordHash` con **bcrypt**.
- Cambia `JWT_SECRET` en `.env`.
- Revisa CORS si expones la API al frontend.
- Agrega validaciones DTO con `class-validator`/`class-transformer`.
- Considera versionado de API (`/api/v1`) y documentación **OpenAPI/Swagger**.

---

## Licencia
MIT (o la que definas).
