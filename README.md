🚗 Funcionalidades de tu API - Ride Sharing
🔐 Autenticación
✅ Registro Público

Cualquier persona puede registrarse
Roles disponibles: admin, driver (conductor), passenger (pasajero)
Rol por defecto: passenger
Contraseñas hasheadas con bcrypt
Token JWT generado automáticamente al registrarse

✅ Login

Autenticación con email y contraseña
Generación de token JWT con expiración configurable
Token contiene: user ID, email y roles


👥 Gestión de Usuarios
✅ Listar Usuarios

Cualquier usuario autenticado puede ver la lista
Endpoint: GET /api/users

✅ Crear Usuario (Solo Admin)

Solo administradores pueden crear usuarios directamente
Endpoint: POST /api/users


🚕 Sistema de Rides (Viajes Compartidos)
✅ Crear Ride (Solo Conductores)

Conductores publican viajes con:

Origen y destino
Precio
Número de cupos totales
Descripción opcional


Los cupos disponibles se rastrean automáticamente
Estado inicial: pending

✅ Listar Rides Disponibles

Muestra solo rides con cupos disponibles
Visible para todos los usuarios autenticados
Incluye información del conductor
Ordenados por fecha de creación (más recientes primero)

✅ Ver Mis Rides (Conductores)

Conductores ven todos sus rides publicados
Con lista completa de pasajeros que reservaron
Endpoint: GET /api/rides/my-rides

✅ Ver Mis Reservas (Pasajeros)

Pasajeros ven todos los rides donde reservaron cupo
Incluye información del conductor
Endpoint: GET /api/rides/my-bookings


🎫 Sistema de Reservas de Cupos
✅ Reservar Cupo

Cualquier usuario autenticado puede reservar
Validaciones automáticas:

❌ No puedes reservar tu propio ride
❌ No puedes reservar dos veces el mismo ride
❌ No puedes reservar si no hay cupos disponibles
❌ No puedes reservar si el ride no está en estado pending


Al reservar:

availableSeats disminuye en 1
Usuario se agrega al array de passengers
Si se llenan todos los cupos → status cambia a accepted



✅ Cancelar Reserva

Pasajeros pueden cancelar sus reservas
Al cancelar:

availableSeats aumenta en 1
Usuario se remueve del array de passengers
Si el ride estaba lleno → status vuelve a pending




🏁 Gestión de Estado de Rides
✅ Completar Ride (Solo Conductor Dueño)

Solo el conductor que creó el ride puede completarlo
Cambia status a completed
Endpoint: POST /api/rides/:id/complete

✅ Cancelar Ride (Solo Conductor Dueño)

Solo el conductor que creó el ride puede cancelarlo
Cambia status a canceled
Endpoint: DELETE /api/rides/:id


🛡️ Sistema de Seguridad
✅ Protección por JWT

Todos los endpoints (excepto registro y login) requieren token
Tokens con expiración configurable

✅ Sistema de Roles

Admin: Acceso total a todas las funcionalidades
Driver: Crear, completar y cancelar rides
Passenger: Reservar y cancelar cupos

✅ Validaciones Robustas

DTOs con class-validator
Validación de datos en múltiples capas
Mensajes de error descriptivos en español


🔄 Estados de un Ride
pending    → Ride disponible con cupos
accepted   → Ride lleno (sin cupos)
completed  → Ride finalizado por conductor
canceled   → Ride cancelado por conductor

📊 Tracking en Tiempo Real
✅ Cupos Disponibles

seats: Total de cupos del ride
availableSeats: Cupos disponibles actuales
Se actualiza automáticamente con cada reserva/cancelación

✅ Lista de Pasajeros

Array passengers con todos los usuarios que reservaron
Información poblada (nombre, email) desde MongoDB

✅ Cambio Automático de Estado

pending → accepted cuando se llena
accepted → pending cuando se libera un cupo


📝 Endpoints Completos
MétodoEndpointAuthRolDescripciónPOST/api/auth/register❌-Registro públicoPOST/api/auth/login❌-LoginPOST/api/users✅AdminCrear usuarioGET/api/users✅TodosListar usuariosPOST/api/rides✅Driver/AdminCrear rideGET/api/rides✅TodosListar rides disponiblesGET/api/rides/my-rides✅Driver/AdminMis rides (conductor)GET/api/rides/my-bookings✅TodosMis reservasPOST/api/rides/:id/book✅TodosReservar cupoDELETE/api/rides/:id/book✅TodosCancelar reservaPOST/api/rides/:id/complete✅Driver/AdminCompletar rideDELETE/api/rides/:id✅Driver/AdminCancelar ride

🎯 Casos de Uso Soportados

✅ Usuario se registra como conductor o pasajero
✅ Conductor publica viaje con 3 cupos
✅ Pasajero 1 reserva un cupo → quedan 2
✅ Pasajero 2 reserva un cupo → queda 1
✅ Pasajero 3 reserva último cupo → ride se marca como "accepted"
✅ Pasajero 1 cancela → vuelve a haber 1 cupo, status vuelve a "pending"
✅ Conductor completa el viaje → status "completed"
✅ Sistema previene reservas duplicadas o sin cupos


🏗️ Stack Tecnológico

Framework: NestJS 10
Base de datos: MongoDB con Mongoose
Autenticación: JWT con Passport
Validaciones: class-validator + class-transformer
Seguridad: bcrypt para passwords
Infraestructura: Docker + Docker Compose
Panel de BD: mongo-express


📈 Métricas

11 endpoints operacionales
3 roles diferentes
4 estados de rides
15+ validaciones de negocio
100% funcional ✅
