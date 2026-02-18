/**
 * handlers/order.js
 * 
 * Equivalent to: handlers/order.go
 * 
 * Order handlers (checkout & success).
 * Clean business logic tanpa observability code.
 */

const repository = require('../repository/postgres');
const client = require('prom-client');

// Prometheus metrics
const ordersCreatedTotal = new client.Counter({
    name: 'orders_created_total',
    help: 'Total orders created',
});

/**
 * Checkout handler - create order.
 * Equivalent to Checkout() in Go handlers/order.go.
 * 
 * Handler ini TIDAK mengandung kode tracing atau profiling.
 * - HTTP request di-trace otomatis oleh OpenTelemetry
 * - SQL queries di-trace otomatis oleh pg instrumentation
 */
async function Checkout(req, res) {
    try {
        const productId = parseInt(req.body.product_id);
        const quantity = parseInt(req.body.quantity);

        // Simulate CPU work untuk profiling
        simulateCpuWork();

        // Get product
        const product = await repository.GetProduct(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Calculate total
        const total = parseFloat(product.price) * quantity;

        // Create order
        const orderId = await repository.CreateOrder(productId, quantity, total);

        // Increment metric
        ordersCreatedTotal.inc();

        console.log(`Order created: id=${orderId}, product=${product.name}, total=${total}`);

        // Redirect to success page
        res.redirect(`/success?order_id=${orderId}`);
    } catch (error) {
        console.error('Checkout handler error:', error);
        res.status(500).send('Internal Server Error');
    }
}

/**
 * Success handler - show order confirmation.
 * Equivalent to Success() in Go handlers/order.go.
 * 
 * Handler ini TIDAK mengandung kode tracing atau profiling.
 * - HTTP request di-trace otomatis oleh OpenTelemetry
 * - SQL queries di-trace otomatis oleh pg instrumentation
 */
async function Success(req, res) {
    try {
        const orderId = parseInt(req.query.order_id);

        // Get order
        const order = await repository.GetOrder(orderId);
        if (!order) {
            return res.status(404).send('Order not found');
        }

        // Get product
        const product = await repository.GetProduct(order.product_id);

        // Render template
        res.render('success', { order, product });
    } catch (error) {
        console.error('Success handler error:', error);
        res.status(500).send('Internal Server Error');
    }
}

/**
 * Simulate CPU-intensive work untuk profiling visibility.
 * Equivalent to simulateCpuWork() in Go.
 * 
 * Fungsi ini akan terlihat di Pyroscope flamegraph.
 */
function simulateCpuWork() {
    let result = 0;
    for (let i = 0; i < 2000000; i++) {
        result += i * i * i;
    }
    return result;
}

module.exports = { Checkout, Success };
