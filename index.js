/**
 * index.js
 * 
 * Equivalent to: main.go
 * 
 * Entry point aplikasi Node.js e-commerce.
 * Struktur ini MIRROR aplikasi Golang.
 */

// Initialize tracing FIRST (before any other imports)
require('./observability/tracing').initTracing();

const express = require('express');
const client = require('prom-client');
const observability = require('./observability/init');
const repository = require('./repository/postgres');
const productHandler = require('./handlers/product');
const orderHandler = require('./handlers/order');

// =========================
// INISIALISASI APLIKASI
// =========================
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Template engine (EJS - equivalent to Go html/template)
app.set('view engine', 'ejs');
app.set('views', './templates');

// =========================
// INISIALISASI OBSERVABILITY
// =========================
// Equivalent to observability.Init() in Go main.go
observability.Init();

// =========================
// PROMETHEUS METRICS
// =========================
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

// =========================
// HTTP ROUTES
// =========================
// Equivalent to http.HandleFunc() in Go main.go
app.get('/', productHandler.Home);
app.post('/checkout', orderHandler.Checkout);
app.get('/success', orderHandler.Success);

// =========================
// START SERVER
// =========================
async function main() {
    try {
        // Initialize database
        // Equivalent to repository.Init() in Go main.go
        await repository.Init();

        // Start HTTP server
        app.listen(PORT, () => {
            console.log(`🚀 E-commerce Node.js app starting on :${PORT}`);
        });

        // Graceful shutdown
        process.on('SIGTERM', async () => {
            console.log('SIGTERM received, shutting down gracefully');
            await repository.Close();
            process.exit(0);
        });
    } catch (error) {
        console.error('Failed to start application:', error);
        process.exit(1);
    }
}

// Run main function
// Equivalent to main() in Go
main();
