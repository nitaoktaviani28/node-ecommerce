# ===============================
# Build stage (dengan build tools)
# ===============================
FROM node:18-slim AS build

WORKDIR /app

# Install build dependencies (WAJIB untuk pprof)
RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json ./
RUN npm install --omit=dev

COPY . .

# ===============================
# Runtime stage (TANPA build tools)
# ===============================
FROM node:18-slim

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app ./

ENV NODE_ENV=production
ENV PORT=8080

ENV OTEL_SERVICE_NAME=node-ecommerce
ENV OTEL_EXPORTER_OTLP_ENDPOINT=http://alloy.monitoring.svc.cluster.local:4318

ENV PYROSCOPE_APPLICATION_NAME=node-ecommerce
ENV PYROSCOPE_SERVER_ADDRESS=http://pyroscope-distributor.monitoring.svc.cluster.local:4040

ENV DATABASE_URL=postgresql://postgres:postgres@postgres.app.svc.cluster.local:5432/shop

EXPOSE 8080
CMD ["node", "index.js"]
