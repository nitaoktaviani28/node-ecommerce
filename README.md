# 🟢 Node.js E-Commerce - Structurally Equivalent to Golang

Aplikasi e-commerce Node.js yang **STRUKTURNYA DAN SEMANTIKNYA MIRROR** aplikasi Golang.

## 📁 Structural Parity

### Golang → Node.js Mapping

| Golang | Node.js | Purpose |
|--------|---------|---------|
| `main.go` | `index.js` | Entry point |
| `handlers/product.go` | `handlers/product.js` | Product handlers |
| `handlers/order.go` | `handlers/order.js` | Order handlers |
| `repository/postgres.go` | `repository/postgres.js` | Database layer |
| `observability/init.go` | `observability/init.js` | Observability entry point |
| `observability/tracing.go` | `observability/tracing.js` | OpenTelemetry setup |
| `observability/profiling.go` | `observability/profiling.js` | Pyroscope setup |
| `observability/env.go` | `observability/env.js` | Environment helpers |
| `templates/index.html` | `templates/index.html` | Product list template |
| `templates/success.html` | `templates/success.html` | Success template |
| `go.mod` | `package.json` | Dependencies |
| `Dockerfile` | `Dockerfile` | Container build |

## 🎯 Semantic Equivalence

### 1. Entry Point (index.js ≈ main.go)

**Golang:**
```go
func main() {
    observability.Init()
    repository.Init()
    http.HandleFunc("/", handlers.Home)
    http.ListenAndServe(":8080", nil)
}
```

**Node.js:**
```javascript
async function main() {
    observability.Init();
    await repository.Init();
    app.get('/', productHandler.Home);
    app.listen(8080);
}
```

### 2. Observability Init (observability/init.js ≈ observability/init.go)

**Golang:**
```go
func Init() {
    initTracing()
    initProfiling()
}
```

**Node.js:**
```javascript
function Init() {
    initTracing();
    initProfiling();
}
```

### 3. Repository (repository/postgres.js ≈ repository/postgres.go)

**Golang:**
```go
func GetProducts() ([]Product, error) {
    rows, err := db.Query("SELECT id, name, price FROM products")
    // ...
}
```

**Node.js:**
```javascript
async function GetProducts() {
    const { rows } = await pool.query('SELECT id, name, price FROM products');
    return rows;
}
```

### 4. Handlers (handlers/*.js ≈ handlers/*.go)

**Golang:**
```go
func Home(w http.ResponseWriter, r *http.Request) {
    products := repository.GetProducts()
    tmpl.Execute(w, products)
}
```

**Node.js:**
```javascript
async function Home(req, res) {
    const products = await repository.GetProducts();
    res.render('index', { products });
}
```

## 🔍 Observability Philosophy (IDENTICAL)

### Golang Approach
- Business logic: **NO** observability code
- Observability: Isolated in `/observability`
- Tracing: Auto-instrumentation (otelsql)
- Profiling: Pyroscope agent

### Node.js Approach
- Business logic: **NO** observability code
- Observability: Isolated in `/observability`
- Tracing: Auto-instrumentation (pg)
- Profiling: Pyroscope agent

**Result:** SAME clean separation!

## 🚀 Usage

### Run Locally

```bash
# Install dependencies
npm install

# Set environment variables
export OTEL_SERVICE_NAME=node-ecommerce
export OTEL_EXPORTER_OTLP_ENDPOINT=http://alloy:4318
export PYROSCOPE_APPLICATION_NAME=node-ecommerce
export PYROSCOPE_SERVER_ADDRESS=http://pyroscope:4040
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/shop

# Run
npm start
```

### Docker

```bash
# Build
docker build -t node-ecommerce .

# Run
docker run -p 8080:8080 node-ecommerce
```

## 📊 Request Flow (IDENTICAL)

### Golang Flow
```
HTTP Request → main.go → handlers/product.go → repository/postgres.go → PostgreSQL
```

### Node.js Flow
```
HTTP Request → index.js → handlers/product.js → repository/postgres.js → PostgreSQL
```

## 🔧 Environment Variables (SAME)

```bash
OTEL_SERVICE_NAME=node-ecommerce
OTEL_EXPORTER_OTLP_ENDPOINT=http://alloy.monitoring.svc.cluster.local:4318
PYROSCOPE_APPLICATION_NAME=node-ecommerce
PYROSCOPE_SERVER_ADDRESS=http://pyroscope-distributor.monitoring.svc.cluster.local:4040
DATABASE_URL=postgresql://postgres:postgres@postgres.app.svc.cluster.local:5432/shop
```

## 🎓 Key Principles

### 1. Folder Structure Parity
- Same folder names
- Same file responsibilities
- Same separation of concerns

### 2. Function Naming Parity
- `Init()` in both
- `GetProducts()` in both
- `CreateOrder()` in both
- `Home()`, `Checkout()`, `Success()` in both

### 3. Observability Isolation
- Both: Single entry point (`observability.Init()`)
- Both: NO tracing code in handlers
- Both: NO tracing code in repository
- Both: Auto-instrumentation for DB

### 4. Template Engine Parity
- Golang: `html/template`
- Node.js: `ejs`
- Both: Server-side rendering
- Both: Same HTML structure

## 🔄 Migration Path

Jika Anda familiar dengan Golang version:

1. **Folder structure** → SAMA
2. **File names** → SAMA (`.go` → `.js`)
3. **Function names** → SAMA
4. **Observability approach** → SAMA
5. **Request flow** → SAMA

**Conclusion:** Node.js version adalah **SEMANTIC EQUIVALENT** dari Golang version!

---

**Aplikasi Node.js ini MIRROR aplikasi Golang untuk memudahkan pemahaman dan migrasi!** 🚀
