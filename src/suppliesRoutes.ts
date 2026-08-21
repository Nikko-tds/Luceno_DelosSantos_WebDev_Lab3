import { Router, Request, Response } from "express";
import { pool } from "./db";
import { Supply } from "./types";

const router = Router();

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
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Supply record not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;