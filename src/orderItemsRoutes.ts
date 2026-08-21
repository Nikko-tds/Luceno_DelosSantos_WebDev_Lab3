// In this file, we'll be making each RESTful API route
// GET
// POST

import { Router, Request, Response } from "express";
import { pool } from "./db";
import { OrderItem } from "./types";

const router = Router();

// GET (all line items for a specific order)
router.get("/:orderId", async (req: Request, res: Response) => {
  const { orderId } = req.params;
  try {
    const result = await pool.query<OrderItem>(
      "SELECT * FROM order_item WHERE order_id = $1",
      [orderId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST (add an item line to an existing order)
router.post("/", async (req: Request, res: Response) => {
  const { order_id, product_id, quantity, discount }: OrderItem = req.body;
  try {
    const result = await pool.query<OrderItem>(
      `INSERT INTO order_item (order_id, product_id, quantity, discount)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [order_id, product_id, quantity, discount ?? 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;