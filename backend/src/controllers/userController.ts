import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import prisma from '../prismaClient';

export const createUser = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
    // Destructure data from request body
    const { name, email } = req.body;

    if (name === undefined || email === undefined) {}

    // Perform the create operation in Prisma
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
      },
    });


    
    // Return the newly created user as JSON
    res.status(201).json(newUser);
    }
  );