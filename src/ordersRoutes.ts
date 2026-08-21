// In this file, we'll be making each RESTful API route
// GET
// POST
// DELETE

import { Router, Request, Response } from "express";
import { pool } from "./db";
import { Order } from "./types";

const router = Router();

// GET (all orders)
router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query<Order>(
      "SELECT * FROM orders ORDER BY order_id ASC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// GET (all orders for a specific customer, no join)
router.get("/customer/:customerId", async (req: Request, res: Response) => {
  const { customerId } = req.params;
  try {
    const result = await pool.query<Order>(
      "SELECT * FROM orders WHERE customer_id = $1 ORDER BY order_id ASC",
      [customerId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST
router.post("/", async (req: Request, res: Response) => {
  const { order_id, customer_id, order_date, shipping_city }: Order =
    req.body;
  try {
    const result = await pool.query<Order>(
      `INSERT INTO orders (order_id, customer_id, order_date, shipping_city)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [order_id, customer_id, order_date, shipping_city]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// DELETE
router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query<Order>(
      `DELETE FROM orders
       WHERE order_id = $1
       RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;