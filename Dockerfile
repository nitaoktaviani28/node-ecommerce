# Dockerfile untuk Node.js E-Commerce
# Equivalent to: Dockerfile (Golang version)

# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Copy dependencies dari build stage
COPY --from=build /app/node_modules ./node_modules

# Copy application code
COPY . .

# Environment variables (akan di-override oleh Kubernetes)
ENV NODE_ENV=production
ENV PORT=8080
ENV OTEL_SERVICE_NAME=node-ecommerce
ENV OTEL_EXPORTER_OTLP_ENDPOINT=http://alloy.monitoring.svc.cluster.local:4318
ENV PYROSCOPE_APPLICATION_NAME=node-ecommerce
ENV PYROSCOPE_SERVER_ADDRESS=http://pyroscope-distributor.monitoring.svc.cluster.local:4040
ENV DATABASE_URL=postgresql://postgres:postgres@postgres.app.svc.cluster.local:5432/shop

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8080/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Run application
CMD ["node", "index.js"]
