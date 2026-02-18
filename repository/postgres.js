/**
 * repository/postgres.js
 * 
 * Equivalent to: repository/postgres.go
 * 
 * PostgreSQL repository untuk data access.
 * Database queries akan di-trace otomatis oleh OpenTelemetry pg instrumentation.
 */

const { Pool } = require('pg');
const { getEnv } = require('../observability/env');

let pool;

/**
 * Initialize database connection.
 * Equivalent to Init() in Go repository.
 */
async function Init() {
    const connectionString = getEnv(
        'DATABASE_URL',
        'postgresql://postgres:postgres@postgres.app.svc.cluster.local:5432/shop'
    );

    pool = new Pool({ connectionString });

    // Test connection
    await pool.query('SELECT 1');
    console.log('✅ Connected to PostgreSQL');

    // Setup tables
    await setupTables();
}

/**
 * Close database connection.
 * Equivalent to Close() in Go repository.
 */
async function Close() {
    if (pool) {
        await pool.end();
        console.log('Database connection closed');
    }
}

/**
 * Setup database tables.
 * Equivalent to setupTables() in Go.
 */
async function setupTables() {
    // Create products table
    await pool.query(`
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            price DECIMAL(10,2)
        )
    `);

    // Create orders table
    await pool.query(`
        CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            product_id INTEGER,
            quantity INTEGER,
            total DECIMAL(10,2),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Seed products if empty
    const { rows } = await pool.query('SELECT COUNT(*) FROM products');
    const count = parseInt(rows[0].count);

    if (count === 0) {
        await pool.query(
            'INSERT INTO products (name, price) VALUES ($1, $2)',
            ['Gaming Laptop', 15000000]
        );
        await pool.query(
            'INSERT INTO products (name, price) VALUES ($1, $2)',
            ['Wireless Mouse', 300000]
        );
        await pool.query(
            'INSERT INTO products (name, price) VALUES ($1, $2)',
            ['Mechanical Keyboard', 800000]
        );
        await pool.query(
            'INSERT INTO products (name, price) VALUES ($1, $2)',
            ['4K Monitor', 3500000]
        );

        console.log('✅ Sample products inserted');
    }
}

/**
 * Get all products.
 * Equivalent to GetProducts() in Go.
 * Query akan di-trace otomatis oleh OpenTelemetry.
 */
async function GetProducts() {
    const { rows } = await pool.query(
        'SELECT id, name, price FROM products ORDER BY id'
    );
    return rows;
}

/**
 * Get product by ID.
 * Equivalent to GetProduct() in Go.
 * Query akan di-trace otomatis oleh OpenTelemetry.
 */
async function GetProduct(id) {
    const { rows } = await pool.query(
        'SELECT id, name, price FROM products WHERE id = $1',
        [id]
    );
    return rows[0] || null;
}

/**
 * Create new order.
 * Equivalent to CreateOrder() in Go.
 * Query akan di-trace otomatis oleh OpenTelemetry.
 */
async function CreateOrder(productId, quantity, total) {
    const { rows } = await pool.query(
        'INSERT INTO orders (product_id, quantity, total) VALUES ($1, $2, $3) RETURNING id',
        [productId, quantity, total]
    );
    return rows[0].id;
}

/**
 * Get order by ID.
 * Equivalent to GetOrder() in Go.
 * Query akan di-trace otomatis oleh OpenTelemetry.
 */
async function GetOrder(id) {
    const { rows } = await pool.query(
        'SELECT id, product_id, quantity, total, created_at FROM orders WHERE id = $1',
        [id]
    );
    return rows[0] || null;
}

module.exports = {
    Init,
    Close,
    GetProducts,
    GetProduct,
    CreateOrder,
    GetOrder,
};
