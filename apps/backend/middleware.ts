import type { NextFunction, Request, Response } from "express";
import { decode, verify } from "jsonwebtoken";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const headAuth = req.headers["authorization"];
  if (!headAuth) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  if (typeof headAuth === "string" && headAuth.startsWith("Bearer ")) {
    const token = headAuth.split(" ")[1];
    const decoded = decode(token, { complete: true });
    if (decoded?.payload.sub) {
      req.userId = decoded.payload.sub;
      next();
    }
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}
