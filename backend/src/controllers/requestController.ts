import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import prisma from "../prismaClient";

// Get the requests that the user has made
export const getRequests = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    console.log(id);
    // Check if user exists and include requests
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        requests: true,
      },
    });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const getRequests = await prisma.request.findMany({
      where: {
        userID: id,
      },
    });

    // Return the requests associated with the user
    res.status(200).json(user.requests);
  }
);
