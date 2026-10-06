# syntax=docker/dockerfile:1

# Stage 1: Build frontend with Node/Vite
FROM node:22-slim AS frontend-build

WORKDIR /app

COPY proj/package*.json ./

RUN npm ci

COPY proj ./

RUN npm run build

# Stage 2: Python FastAPI backend
FROM python:3.14.0-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install build dependencies for numpy
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

# Create non-privileged user
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser

# Install Python dependencies
RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=requirements.txt,target=requirements.txt \
    python -m pip install -r requirements.txt

# Copy backend code
COPY . .

USER appuser

EXPOSE 8000

CMD ["python", "-m", "fastapi", "run", "--host", "0.0.0.0", "--port", "8000"]
