import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";

export const getHello = expressAsyncHandler(
  async (req: Request<{}, {}, {}>, res: Response, next: NextFunction) => {
    res.json({ message: "Hello World!" });
  }
);
