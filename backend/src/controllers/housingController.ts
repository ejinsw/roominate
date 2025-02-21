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
