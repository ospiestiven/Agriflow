import { Router } from "express";

export function createHealthRouter({ pool }) {
  const router = Router();

  router.get("/", (req, res) => res.json({ ok: true, db: !!pool.connected }));

  return router;
}
