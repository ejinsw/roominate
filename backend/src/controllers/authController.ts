import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import prisma from "../prismaClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Destructure data from request body
      const { name, email, password, year } = req.body;

      console.log(req.body);

      if (!name || !email || !password || !year) {
        res.status(500).json({ message: "Invalid request body" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        res.status(400).json({ message: "Account already exists!" });
      } else {
        // Perform the create operation in Prisma
        const newUser = await prisma.user.create({
          data: {
            year,
            name,
            email,
            password: hashedPassword,
          },
        });

        const payload = {
          sub: newUser.id,
        };

        const token = jwt.sign(
          payload,
          process.env.JWT_SECRET || "secret_key_for_jwt",
          {
            expiresIn: "24h",
          }
        );

        res.json({ token });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);

export const login = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Destructure data from request body
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(500).json({ message: "Invalid request body" });
        return;
      }

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        res.status(401).json({ message: "Invalid username or password!" });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        res.status(401).json({ message: "Invalid username or password!" });
        return;
      }

      const payload = {
        sub: user.id,
      };

      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || "secret_key_for_jwt",
        {
          expiresIn: "24h",
        }
      );

      // Return the newly created user as JSON
      res.status(201).json({ token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);

export const me = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    res.json({ user: req.user });
  }
);
