FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000
COPY --from=build /app ./
EXPOSE 3000
# Apply pending DB migrations, seed destinations (idempotent), then start
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npm start"]
