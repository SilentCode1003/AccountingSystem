import { NextFunction, Request, Response } from "express";

export const errorHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(404).json({
    error: "404 Requested resource could not be found",
  });
};
