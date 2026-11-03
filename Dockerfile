FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
# .env (with real EXPO_PUBLIC_SUPABASE_URL/ANON_KEY) must exist on the host
# at build time -- it's baked into the client bundle here, not read at
# runtime. Deliberately not excluded by .dockerignore for that reason.
COPY . .
RUN npx expo export --platform web

FROM caddy:2-alpine
COPY --from=build /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile
