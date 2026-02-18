/**
 * handlers/product.js
 * 
 * Equivalent to: handlers/product.go
 * 
 * Product handler (home page).
 * Clean business logic tanpa observability code.
 */

const repository = require('../repository/postgres');

/**
 * Home handler - menampilkan product list.
 * Equivalent to Home() in Go handlers/product.go.
 * 
 * Handler ini TIDAK mengandung kode tracing atau profiling.
 * - HTTP request di-trace otomatis oleh OpenTelemetry
 * - SQL queries di-trace otomatis oleh pg instrumentation
 */
async function Home(req, res) {
    try {
        // Get products dari repository
        const products = await repository.GetProducts();

        // Render template
        res.render('index', { products });
    } catch (error) {
        console.error('Home handler error:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { Home };
