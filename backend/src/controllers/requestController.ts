import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import prisma from "../prismaClient";

export const sendRequest = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userID, groupID, message } = req.body;
      console.log(req.body);

      const user = await prisma.user.findUnique({
        where: { id: userID },
      });
      if (!user) {
        res.status(404);
        throw new Error("User not found");
      }

      const group = await prisma.group.findUnique({
        where: { id: groupID },
      });
      if (!group) {
        res.status(404);
        throw new Error("Group not found");
      }

      const newRequest = await prisma.request.create({
        data: {
          userID,
          groupID,
          status: "pending", // Maybe: default to 'pending'
          message, // optional message
        },
      });

      res.status(201).json(newRequest);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);

export const acceptRequest = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Destructure data from request parameters
    const { id } = req.params; // id is the request id

    // check if request exists
    const request = await prisma.request.findUnique({
      where: { id },
    });
    if (!request) {
      res.status(404);
      throw new Error("Request not found");
    }

    const userID = request.userID;
    const groupID = request.groupID;

    // If the user is already in a group, update user's groupID in the database to the new groupID
    const updatedUser = await prisma.user.update({
      where: { id: userID },
      data: { groupID },
    });

    // Delete request from database
    const updatedRequest = await prisma.request.update({
      where: { id: id },
      data: { status: "accepted" },
    });

    res.status(200).json({
      message: "Request accepted successfully",
      user: updatedUser,
      request: updatedRequest,
    });
  }
);

export const rejectRequest = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Destructure data from request parameters
    const { id } = req.params;

    // check if request exists
    const request = await prisma.request.findUnique({
      where: { id },
    });
    if (!request) {
      res.status(404);
      throw new Error("Request not found");
    }

    // Delete request from database
    const updateRequest = await prisma.request.update({
      where: { id: id },
      data: { status: "rejected" },
    });

    res.status(200).json({
      message: "Request rejected successfully",
    });
  }
);

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

export const updateGroups = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {}
);
