import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import prisma from "../prismaClient";

export const getAllHousing = expressAsyncHandler(
  async (req: Request<{}, {}, {}>, res: Response, next: NextFunction) => {
    try {
      const allHousing = await prisma.housing.findMany();

      res.json({ housing: allHousing });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);
export const getUsersByHousingById = expressAsyncHandler(
  async (
    req: Request<{ id: string }, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const housing = await prisma.housing.findUnique({
        where: { id },
        include: {
          relatedUserPreferences: {
            include: {
              preferences: {
                include: { user: true },
              },
            },
          },
        },
      });

      const users = housing?.relatedUserPreferences.map((p) => p.preferences.user);

      res.json({ users });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

export const getGroupsByHousingById = expressAsyncHandler(
  async (
    req: Request<{ id: string }, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const housing = await prisma.housing.findUnique({
        where: { id },
        include: {
          relatedGroupPreferences: {
            include: {
              preferences: {
                include: { group: true },
              },
            },
          },
        },
      });

      const groups = housing?.relatedGroupPreferences.map((p) => p.preferences.group);

      res.json({ groups });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

export const createGroupHousingPreference = expressAsyncHandler(
  async (
    req: Request<
      { id: string }, // groupId
      {},
      {
        housingId?: string;
      }
    >,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { housingId } = req.body;
      const { id } = req.params;
      if (!housingId) {
        res.status(400).json({ message: "Invalid request body" });
        return;
      }

      const group = await prisma.group.findUnique({
        where: { id: id },
        include: {
          preferences: true,
        },
      });

      console.log("Passed group");

      if (!group) {
        res.status(404).json({ message: "group not found", id });
        return;
      }

      let groupPreferences = group.preferences;
      if (!groupPreferences) {
        groupPreferences = await prisma.groupPreferences.create({
          data: {
            group: {
              connect: { id: id },
            },
          },
        });
      }
      console.log("connection established between groupPrefrences and group"); // ??

      let existingHousing = null;
      if (group?.preferences) {
        existingHousing = await prisma.groupHousingPreferencesRelation.findUnique({
          where: {
            housingID_preferencesID: {
              housingID: housingId,
              preferencesID: groupPreferences.id, // id for the related groupPreferences
            },
          },
        });
      }

      console.log("Passed preference");

      if (existingHousing) {
        res.status(400).json({ message: "Housing already exists" });
        return;
      }

      const newHousing = await prisma.groupHousingPreferencesRelation.create({
        data: {
          housing: {
            connect: { id: housingId },
          },
          preferences: {
            connect: { id: groupPreferences.id },
          },
        },
      });
      console.log("Created new housing preference");

      res.json({ newHousing });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

// route for updating housing preference