import { Router, Request, Response } from "express";
import { pool } from "./db";
import { Vendor } from "./types";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query<Vendor>(
      "SELECT * FROM vendor ORDER BY vendor_id ASC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query<Vendor>(
      "SELECT * FROM vendor WHERE vendor_id = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Vendor not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { vendor_id, vendor_name, city }: Vendor = req.body;
  try {
    const result = await pool.query<Vendor>(
      `INSERT INTO vendor (vendor_id, vendor_name, city)
      VALUES ($1, $2, $3)
      RETURNING *`
, [vendor_id, vendor_name, city]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { vendor_name, city }: Vendor = req.body;
  try {
    const result = await pool.query<Vendor>(
      `UPDATE vendor
      SET vendor_name = $1, city = $2
      WHERE vendor_id = $3
      RETURNING *`,
      [vendor_name, city, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Vendor not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query<Vendor>(
      `DELETE FROM vendor
      WHERE vendor_id = $1
      RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Vendor not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
