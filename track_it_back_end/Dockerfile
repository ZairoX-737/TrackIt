# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.17.0

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app

# Устанавливаем зависимости
FROM base AS deps
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Этап сборки
FROM base AS build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Продакшен стадия
FROM base AS production

# Создаем пользователя
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Копируем зависимости и сборку
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
# Копируем сгенерированный Prisma Client
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

# Меняем владельца файлов ПЕРЕД переключением пользователя
RUN chown -R nestjs:nodejs /app

# Переключаемся на пользователя
USER nestjs

EXPOSE 4200

ENV NODE_ENV=production

CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && node dist/main"]
