FROM node:20-alpine AS build
WORKDIR /app

COPY pnpm-lock.yaml package.json ./

RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

EXPOSE 4173
CMD ["pnpm", "preview", "--", "--host", "--port", "4173"]
