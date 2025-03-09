import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../prismaClient";
import { Group } from "../types";

export const getGroups = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      /* Parse Query Filters */
      const { filters: queryFilters, groupId } = req.query;

      let group : Group | null = null;

      if (groupId) {
        group = await prisma.group.findUnique({
          where: { id: groupId.toString() },
          include: {
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
      }

      // this'll contain the parsed query filters
      let parsedFilters: {
        preferences: string[];
        housing: string[];
        numRoomates: string[];
        // openToJoin: Boolean;
      } = { preferences: [], housing: [], numRoomates: [] };

      // parse out the query filters
      if (queryFilters) {
        try {
          parsedFilters = JSON.parse(queryFilters as string);
          console.log(parsedFilters);
        } catch (error) {
          res.status(400).json({ error: "Invalid filters format" });
          return;
        }
      }

      const filter = {} as Prisma.GroupWhereInput;

      // filter by group name
      if (req.query.name) {
        filter.name = {
          contains: req.query.name.toString(),
          mode: "insensitive",
        };
      }

      // filter by group housing preferences
      if (parsedFilters.housing?.length) {
        filter.preferences = {
          preferredHousing: {
            some: {
              housing: {
                OR: parsedFilters.housing.map((house) => {
                  return {
                    name: {
                      equals: house,
                      mode: "insensitive",
                    },
                  };
                }),
              },
            },
          },
        };
      }

      // filter by group living preferences (Jason)

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

export const updateGroups = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized user" });
        return;
      }

      const { id, name, description, numRoomates, openToJoin } = req.body; // pass in group id as id

      if (req.user.groupID !== id) { // check if user is in the group
        res.status(401).json({ message: "Unauthorized, user is not in group" });
        return;
      }

      // const user: any = req.user;

      const group = await prisma.group.findUnique({
        where: { name },
      });

      const updateData = {} as Prisma.GroupUpdateInput;

      if (name) updateData.name = name; // note: need to check if new name is unique

      if (numRoomates) updateData.numRoomates = numRoomates;

      if (description) updateData.description = description;

      if (openToJoin) updateData.openToJoin = openToJoin;

      const updatedGroup = await prisma.group.update({
        where: { id: id },
        data: updateData,
      });

      res.json(updatedGroup);
    } catch (error) {}
  }
);