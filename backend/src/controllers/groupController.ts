import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../prismaClient";

export const getGroups = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filter = {} as Prisma.GroupWhereInput;

      // filter by group name
      if (req.query.name) {
        filter.name = {
          contains: req.query.name.toString(),
          mode: "insensitive",
        };
      }

      // add other filters here

      const groups = await prisma.group.findMany({ where: filter });
      res.json(groups);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);

export const createGroups = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, description, numRoomates, openToJoin, userID } = req.body;

      console.log(req.body);

      const user = await prisma.user.findUnique({
        where: { id: userID },
      });

      const groupID = user?.groupID;
      if (groupID) {
        res.status(400).json({ message: "User is already in a group!" });
        return;
      }

      if (!name) {
        res.status(500).json({ message: "Invalid request body" });
        return;
      }

      const group = await prisma.group.findUnique({
        where: { name },
      });

      if (group) {
        res.status(400).json({ message: "Group already exists!" });
      } else {
        const newGroup = await prisma.group.create({
          data: {
            name,
            description,
            numRoomates,
            openToJoin,
            users: {
              // Connect existing users by their unique identifier (e.g., id)
              connect: [{ id: userID }],
            },
          },
        });
        res.json(newGroup); // return json of newly created group
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);

export const getGroupById = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;

      if (!id) {
        res.status(400).json({ message: "Invalid request" });
        return;
      }

      const group = await prisma.group.findUnique({
        where: { id: id },
        include: {
          users: true,
          preferences: {
            include: {
              preferences: {
                include: {
                  preference: true,
                },
              },
              preferredHousing: {
                include: {
                  housing: true,
                },
              },
            },
          },
        },
      });

      if (!group) {
        res.status(404).json({ message: "Group not found" });
        return;
      }

      res.json({ group });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);
