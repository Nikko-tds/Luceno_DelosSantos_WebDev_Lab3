# E-Commerce & Logistics Backend REST API

A Node.js/TypeScript backend using Express and PostgreSQL (`pg`) to manage customers, products, orders, order items, vendors, and supplies.

## Tech Stack

- TypeScript
- Express
- PostgreSQL (via `pg`)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up the database**
   - Create a PostgreSQL database (e.g. `ecommerce`) using pgAdmin or any client.
   - Run the SQL setup script from the lab spec to create and populate the tables.

3. **Create a `.env` file** in the project root:

   ```
   PGUSER=your_postgres_username
   PGHOST=localhost
   PGDATABASE=ecommerce
   PGPASSWORD=your_postgres_password
   PGPORT=5432
   PORT=3000
   ```

4. **Run the server**
   ```bash
   npm run dev
   ```
   Server runs at `http://localhost:3000`.

## API Routes

All routes are prefixed with `/api/v1`.

- **Customers** — `/customers` (GET, GET/:id, POST, PUT/:id, DELETE/:id)
- **Products** — `/products` (GET, GET/:id, POST, PATCH/:id/price)
- **Orders** — `/orders` (GET, GET/customer/:customerId, POST, DELETE/:id)
- **Order Items** — `/order-items` (GET/:orderId, POST)
- **Vendors** — `/vendors` (GET)
- **Supplies** — `/supplies` (GET/vendor/:vendorId, PUT/:vendorId/:productId)

## Notes

- All queries use parameterized values (`$1`, `$2`, ...) — no string interpolation.
- No ORM or query builder — raw SQL only.
- No multi-table joins, per lab constraints.
