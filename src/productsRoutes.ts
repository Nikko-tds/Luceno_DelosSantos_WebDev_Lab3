import { Router, Request, Response } from "express";
import { pool } from "./db";
import { Product } from "./types";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query<Product>(
      "SELECT * FROM product ORDER BY product_id ASC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query<Product>(
      "SELECT * FROM product WHERE product_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { product_id, product_name, category, unit_price }: Product = req.body;
  try {
    const result = await pool.query<Product>(
      `INSERT INTO product (product_id, product_name, category, unit_price)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [product_id, product_name, category, unit_price]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { product_name, category, unit_price }: Product = req.body;
  try {
    const result = await pool.query<Product>(
      `UPDATE product
      SET product_name = $1, category = $2, unit_price = $3
      WHERE product_id = $4
      RETURNING *`,
      [product_name, category, unit_price, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.patch("/:id/price", async (req: Request<{ id: string }, {}, { unit_price: number }>, res: Response) => {
  const { id } = req.params;
  const { unit_price } = req.body;

  if (typeof unit_price !== 'number' || Number.isNaN(unit_price)) {
    return res.status(400).json({ error: "Field 'unit_price' must be a valid number" });
  }

  if (unit_price < 0) {
    return res.status(400).json({ error: "Price cannot be negative" });
  }

  try {
    const result = await pool.query<Product>(
      `UPDATE product
      SET unit_price = $1
      WHERE product_id = $2
      RETURNING *`,
      [unit_price, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query<Product>(
      `DELETE FROM product
      WHERE product_id = $1
      RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;