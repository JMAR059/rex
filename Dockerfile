# Build frontend with Node/Vite
FROM node:22-slim AS frontend-build

WORKDIR /app

COPY app/package*.json ./

RUN npm ci

COPY app ./

RUN npm run build
