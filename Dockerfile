# syntax=docker/dockerfile:1
# Builder stage
FROM node:20-bookworm AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps --no-audit || npm install --legacy-peer-deps --no-audit
COPY . .
RUN npm run build

# Production stage — sam Node: statyka z dist/ + rejestr Katedr (server/serwer.mjs).
# Dawniej nginx; rejestr potrzebuje odrobiny pamięci, a strona dalej jest statyczna.
# Cloud Run: najlepiej max 1 instancja — lista Katedr online żyje w pamięci jednego procesu.
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY server ./server
COPY katedry-zatwierdzone.json ./
EXPOSE 8080
USER node
CMD ["node", "server/serwer.mjs"]
