import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";

export const getUser = expressAsyncHandler(
    async (req: Request<{}, {}, {}>, res: Response, next: NextFunction) => {
      res.json({ message: "Hello World!" });
    }
  );