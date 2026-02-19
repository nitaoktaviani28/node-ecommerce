/**
 * index.js
 *
 * FULL VERSION
 * - UI aktif
 * - PostgreSQL aktif
 * - Observability tetap aman
 */

// =========================
// OBSERVABILITY (AMAN)
// =========================
try {
    require('./observability/init').Init();
    console.log('✅ Observability initialized');
} catch (err) {
    console.warn('⚠️ Observability skipped:', err.message);
}

// =========================
// DEPENDENCIES
// =========================
const express = require('express');
const client = require('prom-client');
const repository = require('./repository/postgres');

const productHandler = require('./handlers/product');
const orderHandler = require('./handlers/order');

// =========================
// APP SETUP
// =========================
const app = express();
const PORT = process.env.PORT || 8080;

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================
// VIEW ENGINE (EJS)
// =========================
app.set('view engine', 'ejs');
app.set('views', './templates');

// =========================
// PROMETHEUS METRICS
// =========================
const register = new client.Registry();
client.collectDefaultMetrics({ register });

app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.end(await register.metrics());
});

// =========================
// ROUTES
// =========================

// Health check (WAJIB K8S)
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Home (UI)
app.get('/', productHandler.Home);

// Checkout
app.post('/checkout', orderHandler.Checkout);

// Success page
app.get('/success', orderHandler.Success);

// =========================
// START SERVER
// =========================
async function start() {
    try {
        // Init database
        await repository.Init();

        app.listen(PORT, () => {
            console.log(`🚀 Node.js app listening on :${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start application:', error);
        process.exit(1);
    }
}

start();

// =========================
// GRACEFUL SHUTDOWN
// =========================
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down...');
    await repository.Close();
    process.exit(0);
});
