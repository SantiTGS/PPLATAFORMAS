# ===== Stage 1: Build =====
FROM node:20-alpine AS builder
WORKDIR /app

# Instalar dependencias con caché óptima
COPY package*.json ./
RUN npm ci

# Copiar resto del proyecto y compilar
COPY . .
RUN npm run build

# ===== Stage 2: Runtime =====
FROM node:20-alpine AS runner
WORKDIR /app

# Copiar solo lo necesario para producción
COPY package*.json ./
RUN npm ci --omit=dev

# Copiar build de Nest
COPY --from=builder /app/dist ./dist

# Variables por defecto (se pueden sobreescribir con .env y compose)
ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/main.js"]
