import { Router, Request, Response } from "express";
import { pool } from "./db";
import { Supply } from "./types";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query<Supply>(
      "SELECT * FROM supplies ORDER BY vendor_id ASC, product_id ASC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/vendor/:vendor_id", async (req: Request, res: Response) => {
  const { vendor_id } = req.params;
  try {
    const result = await pool.query<Supply>(
      `SELECT * FROM supplies
      WHERE vendor_id = $1
      ORDER BY product_id ASC`,
      [vendor_id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/product/:product_id", async (req: Request, res: Response) => {
  const { product_id } = req.params;
  try {
    const result = await pool.query<Supply>(
      `SELECT * FROM supplies
      WHERE product_id = $1
      ORDER BY vendor_id ASC`,
      [product_id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { vendor_id, product_id, stock_quantity }: Supply = req.body;
  try {
    const result = await pool.query<Supply>(
      `INSERT INTO supplies (vendor_id, product_id, stock_quantity)
      VALUES ($1, $2, $3)
      RETURNING *`,
      [vendor_id, product_id, stock_quantity]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.put("/:vendor_id/:product_id", async (req: Request, res: Response) => {
  const { vendor_id, product_id } = req.params;
  const { stock_quantity }: Supply = req.body;
  try {
    const result = await pool.query<Supply>(
      `UPDATE supplies
      SET stock_quantity = $1
      WHERE vendor_id = $2 AND product_id = $3
      RETURNING *`,
      [stock_quantity, vendor_id, product_id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.delete("/:vendor_id/:product_id", async (req: Request, res: Response) => {
  const { vendor_id, product_id } = req.params;
  try {
    const result = await pool.query<Supply>(
      `DELETE FROM supplies
      WHERE vendor_id = $1 AND product_id = $2
      RETURNING *`,
      [vendor_id, product_id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;