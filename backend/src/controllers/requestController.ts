import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../prismaClient";

//get the requests that the user has made
export const getRequests = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params; //id is the userID

    // check if user exists
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Get all requests that the user has made
    const requests = await prisma.invite.findMany({
      where: { id },
    });

    res.status(200).json(requests);
  }
);
