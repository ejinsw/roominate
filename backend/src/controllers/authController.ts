import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import prisma from "../prismaClient";
import bcrypt from "bcryptjs";

export const register = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Destructure data from request body
    const { name, email, password } = req.body;

    if (name === undefined || email === undefined || password === undefined) {
      res.status(500).json({ message: "Invalid request body" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Perform the create operation in Prisma
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Return the newly created user as JSON
    res.status(201).json({ id: newUser.id });
  }
);

export const login = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Destructure data from request body
    const { name, email, password } = req.body;

    if (name === undefined || email === undefined || password === undefined) {
      res.status(500).json({ message: "Invalid request body" });
      return;
    }

    // Return the newly created user as JSON
    res.status(201).json({  });
  }
);
