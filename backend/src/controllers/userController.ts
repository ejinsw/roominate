import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { Prisma } from '@prisma/client';
import prisma from "../prismaClient";

export const getUsers = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filter = {} as Prisma.UserWhereInput;

      if (req.query.name) {
        filter.name = { contains: req.query.name.toString(), mode: 'insensitive' };
      }
      if (req.query.email) {
        filter.email = { contains: req.query.email.toString(), mode: 'insensitive' };
      }
      if (req.query.id) {
        filter.id = { contains: req.query.id.toString(), mode: 'insensitive' }; // check if this works
      }
  
      const users = await prisma.user.findMany({ where: filter });
      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);