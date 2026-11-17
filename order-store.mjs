import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";

const productSlug = "elsewhere-white-tee";
const productName = "Elsewhere White T-shirt";

export function createOrderStore(databasePath) {
  const database = new DatabaseSync(databasePath);
  database.exec("PRAGMA foreign_keys = ON");
  database.exec(`
    CREATE TABLE IF NOT EXISTS products (
      slug TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price_cents INTEGER NOT NULL CHECK (price_cents > 0)
    ) STRICT;
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY,
      reference TEXT NOT NULL UNIQUE,
      total_cents INTEGER NOT NULL CHECK (total_cents > 0),
      created_at TEXT NOT NULL
    ) STRICT;
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_slug TEXT NOT NULL REFERENCES products(slug),
      size TEXT NOT NULL CHECK (size IN ('S', 'M', 'L', 'XL')),
      quantity INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 5),
      unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents > 0)
    ) STRICT;
    INSERT INTO products (slug, name, price_cents)
    VALUES ('${productSlug}', '${productName}', 1500)
    ON CONFLICT(slug) DO UPDATE SET
      name = excluded.name,
      price_cents = excluded.price_cents;
  `);

  const productQuery = database.prepare(
    "SELECT name, price_cents FROM products WHERE slug = ?",
  );
  const insertOrder = database.prepare(
    "INSERT INTO orders (reference, total_cents, created_at) VALUES (?, ?, ?)",
  );
  const insertItem = database.prepare(
    `INSERT INTO order_items
      (order_id, product_slug, size, quantity, unit_price_cents)
     VALUES (?, ?, ?, ?, ?)`,
  );
  const listOrders = database.prepare(
    "SELECT id, reference, total_cents, created_at FROM orders ORDER BY id DESC LIMIT ?",
  );
  const listItems = database.prepare(
    `SELECT size, quantity, unit_price_cents
     FROM order_items WHERE order_id = ? ORDER BY id`,
  );

  return {
    createOrder(items) {
      const product = productQuery.get(productSlug);
      const totalCents = items.reduce(
        (sum, item) => sum + product.price_cents * item.quantity,
        0,
      );
      const reference = `DEMO-${randomUUID().slice(0, 8).toUpperCase()}`;
      const createdAt = new Date().toISOString();
      database.exec("BEGIN IMMEDIATE");
      try {
        const orderResult = insertOrder.run(reference, totalCents, createdAt);
        for (const item of items) {
          insertItem.run(
            orderResult.lastInsertRowid,
            productSlug,
            item.size,
            item.quantity,
            product.price_cents,
          );
        }
        database.exec("COMMIT");
      } catch (error) {
        database.exec("ROLLBACK");
        throw error;
      }
      return {
        reference,
        name: product.name,
        items,
        totalCents,
        createdAt,
      };
    },
    getOrders(limit = 30) {
      return listOrders.all(limit).map((order) => ({
        reference: order.reference,
        items: listItems.all(order.id).map((item) => ({
          size: item.size,
          quantity: item.quantity,
          unitPriceCents: item.unit_price_cents,
        })),
        totalCents: order.total_cents,
        createdAt: order.created_at,
      }));
    },
    close() {
      database.close();
    },
  };
}
