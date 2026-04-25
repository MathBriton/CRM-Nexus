# ── Build ──────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci --frozen-lockfile

COPY . .
RUN npm run build

# ── Serve ──────────────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html

# Template processado pelo entrypoint do nginx (envsubst automático)
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Valor padrão: nome do serviço no docker-compose
ENV API_UPSTREAM=http://api:8080

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
