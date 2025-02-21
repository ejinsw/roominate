import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import prisma from "../prismaClient";
import { Prisma } from "@prisma/client";

export const getAllPreferences = expressAsyncHandler(
  async (req: Request<{}, {}, {}>, res: Response, next: NextFunction) => {
    try {
      const allPreferences = await prisma.preference.findMany();

      res.json({ preferences: allPreferences });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

export const getUsersByPreferenceById = expressAsyncHandler(
  async (
    req: Request<{ id: string }, { option?: string; importance?: string }, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { option, importance } = req.query;

      const preference = await prisma.preference.findUnique({
        where: { id },
        include: {
          relatedPreferences: {
            include: {
              housingPreferences: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });

      const users = preference?.relatedPreferences
        ?.filter(
          (p) =>
            p.housingPreferences?.userID &&
            (!option || p.option === option) &&
            (!importance || p.importance === importance)
        )
        .map((p) => p.housingPreferences.user);

      res.json({ users });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

export const getGroupsByPreferenceById = expressAsyncHandler(
  async (
    req: Request<{ id: string }, { option?: string; importance?: string }, {}>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { option, importance } = req.query;

      const preference = await prisma.preference.findUnique({
        where: { id },
        include: {
          relatedPreferences: {
            include: { housingPreferences: { include: { group: true } } },
          },
        },
      });

      const groups = preference?.relatedPreferences
        ?.filter(
          (p) =>
            p.housingPreferences?.groupID &&
            (!option || p.option === option) &&
            (!importance || p.importance === importance)
        )
        .map((p) => p.housingPreferences.group);

      res.json({ groups });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);
