import { Router, Request, Response } from "express";
import { pool } from "./db";
import { Product } from "./types";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const { category } = req.query;
  try {
    let result;
    if (category) {
      result = await pool.query<Product>(
        "SELECT * FROM product WHERE category = $1 ORDER BY product_id ASC",
        [category]
      );
    } else {
      result = await pool.query<Product>(
        "SELECT * FROM product ORDER BY product_id ASC"
      );
    }
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

router.patch("/:id/price", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { unit_price } = req.body;

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

export default router;