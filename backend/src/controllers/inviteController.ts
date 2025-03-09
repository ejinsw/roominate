import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../prismaClient";

export const sendInvite = expressAsyncHandler(
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

      // Maybe add: if invite from group to user already exists, don't create new invite

      const newInvite = await prisma.invite.create({
        data: {
          userID,
          groupID,
          status: "pending", // Maybe: default to 'pending'
          message, // optional message
        },
      });

      res.status(201).json(newInvite);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);

export const acceptInvite = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Destructure data from request parameters
    const { id } = req.params; // id is the invite id

    // check if invite exists
    const invite = await prisma.invite.findUnique({
      where: { id },
    });
    if (!invite) {
      res.status(404);
      throw new Error("Invite not found");
    }

    const userID = invite.userID;
    const groupID = invite.groupID;

    // If the user is already in a group, update user's groupID in the database to the new groupID
    const updatedUser = await prisma.user.update({
      where: { id: userID },
      data: { groupID },
    });

    // Delete invite from database
    const updatedInvite = await prisma.invite.update({
      where: { id: id },
      data: { status: "accepted" },
    });

    res.status(200).json({
      message: "Invite accepted successfully",
      user: updatedUser,
      invite: updatedInvite,
    });
  }
);

export const rejectInvite = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Destructure data from request parameters
    const { id } = req.params;

    // check if invite exists
    const invite = await prisma.invite.findUnique({
      where: { id },
    });
    if (!invite) {
      res.status(404);
      throw new Error("Invite not found");
    }

    // Delete invite from database
    const updatedInvite = await prisma.invite.update({
      where: { id: id },
      data: { status: "rejected" },
    });

    res.status(200).json({
      message: "Invite rejected successfully",
    });
  }
);

//add a route for get invites from the group side
export const getInvites = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params; // id is the group id

    // check if group exists
    const group = await prisma.group.findUnique({
      where: { id: id },
      include: {
        invitations: true,
      },
    });

    if (!group) {
      res.status(404);
      throw new Error("Group not found");
    }

    // Get all invites for the group
    const invites = await prisma.invite.findMany({
      where: { groupID: id },
    });
    res.status(200).json(invites);
  }
);
