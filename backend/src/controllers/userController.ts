import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import prisma from "../prismaClient";

export const getUsers = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, group } = req.query;
      const filter = {};
  
      // Build filter object using Prisma's query syntax
      if (name) {
        filter.name = { contains: name.toString(), mode: 'insensitive' };
      }
      if (email) {
        filter.email = { contains: email.toString(), mode: 'insensitive' };
      }
      if (group) {
        filter.group = group.toString();
      }
  
      const users = await prisma.user.findMany({ where: filter });
      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);