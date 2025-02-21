import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import prisma from "../prismaClient";
import { Prisma } from "@prisma/client";

/**
 * GET
 */

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
          relatedUserPreferences: {
            include: {
              userPreferences: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });

      if (!preference) {
        res.status(404).json({ message: "Preference not found" });
        return;
      }

      const users = preference?.relatedUserPreferences
        ?.filter(
          (p) =>
            p.userPreferences?.userID &&
            (!option || p.option === option) &&
            (!importance || p.importance === importance)
        )
        .map((p) => p.userPreferences.user);

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
          relatedGroupPreferences: {
            include: { groupPreferences: { include: { group: true } } },
          },
        },
      });

      if (!preference) {
        res.status(404).json({ message: "Preference not found" });
        return;
      }

      const groups = preference?.relatedGroupPreferences
        ?.filter(
          (p) =>
            p.groupPreferences?.groupID &&
            (!option || p.option === option) &&
            (!importance || p.importance === importance)
        )
        .map((p) => p.groupPreferences.group);

      res.json({ groups });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

/**
 * POST
 */
export const createUserPreference = expressAsyncHandler(
  async (
    req: Request<
      { id: string },
      {},
      {
        preferenceId?: string;
        option?: string;
        importance?: string;
      }
    >,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { preferenceId, option, importance } = req.body;
      const { id } = req.params;
      if (!preferenceId) {
        res.status(400).json({ message: "Invalid request body" });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: id },
        include: {
          preferences: true,
        },
      });

      console.log("Passed user");

      if (!user) {
        res.status(404).json({ message: "User not found", id });
        return;
      }

      let userPreferences = user.preferences;
      if (!userPreferences) {
        userPreferences = await prisma.userPreferences.create({
          data: {
            user: {
              connect: { id: id },
            },
          },
        });
      }
      console.log("Passed housingPreferences");

      let existingPreference = null;
      if (user?.preferences) {
        existingPreference = await prisma.userPreferencesRelation.findUnique({
          where: {
            userPreferencesID_preferenceID: {
              userPreferencesID: userPreferences.id,
              preferenceID: preferenceId,
            },
          },
        });
      }

      console.log("Passed preference");

      if (existingPreference) {
        res.status(400).json({ message: "Preference already exists" });
        return;
      }

      const newPreference = await prisma.userPreferencesRelation.create({
        data: {
          preference: {
            connect: { id: preferenceId },
          },
          userPreferences: {
            connect: { id: userPreferences.id },
          },
          option,
          importance,
        },
      });
      console.log("Passed newPreference");

      res.json({ newPreference });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

export const createGroupPreference = expressAsyncHandler(
  async (
    req: Request<
      { id: string },
      {},
      {
        preferenceId?: string;
        option?: string;
        importance?: string;
      }
    >,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { preferenceId, option, importance } = req.body;
      const { id } = req.params;
      if (!preferenceId) {
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
      console.log("Passed housingPreferences");

      let existingPreference = null;
      if (group?.preferences) {
        existingPreference = await prisma.groupPreferencesRelation.findUnique({
          where: {
            groupPreferencesID_preferenceID: {
              groupPreferencesID: groupPreferences.id,
              preferenceID: preferenceId,
            },
          },
        });
      }

      console.log("Passed preference");

      if (existingPreference) {
        res.status(400).json({ message: "Preference already exists" });
        return;
      }

      const newPreference = await prisma.groupPreferencesRelation.create({
        data: {
          preference: {
            connect: { id: preferenceId },
          },
          groupPreferences: {
            connect: { id: groupPreferences.id },
          },
          option,
          importance,
        },
      });
      console.log("Passed newPreference");

      res.json({ newPreference });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

/**
 * PUT
 */
export const updateUserPreference = expressAsyncHandler(
  async (
    req: Request<
      { id: string },
      {},
      {
        preferenceId?: string;
        option?: string;
        importance?: string;
      }
    >,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { preferenceId, option, importance } = req.body;
      const { id } = req.params;
      if (!preferenceId || option === undefined || importance === undefined) {
        res.status(400).json({ message: "Invalid request body" });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: id },
        include: {
          preferences: true,
        },
      });

      if (!user) {
        res.status(404).json({ message: "User not found", id });
        return;
      }

      let userPreferences = user.preferences;
      if (!userPreferences) {
        res.status(404).json({ message: "User preferences not found" });
        return;
      }

      let existingPreference = await prisma.userPreferencesRelation.findUnique({
        where: {
          userPreferencesID_preferenceID: {
            userPreferencesID: userPreferences.id,
            preferenceID: preferenceId,
          },
        },
      });

      if (!existingPreference) {
        res.status(400).json({ message: "Preference does not exist!" });
        return;
      }

      const updatedPreference = await prisma.userPreferencesRelation.update({
        where: { id: existingPreference.id },
        data: {
          option,
          importance,
        },
      });

      res.json({ updatedPreference });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

export const updateGroupPreference = expressAsyncHandler(
  async (
    req: Request<
      { id: string },
      {},
      {
        preferenceId?: string;
        option?: string;
        importance?: string;
      }
    >,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { preferenceId, option, importance } = req.body;
      const { id } = req.params;
      if (!preferenceId || option === undefined || importance === undefined) {
        res.status(400).json({ message: "Invalid request body" });
        return;
      }

      const group = await prisma.group.findUnique({
        where: { id: id },
        include: {
          preferences: true,
        },
      });

      if (!group) {
        res.status(404).json({ message: "group not found", id });
        return;
      }

      let groupPreferences = group.preferences;
      if (!groupPreferences) {
        res.status(404).json({ message: "group preferences not found" });
        return;
      }

      let existingPreference = await prisma.groupPreferencesRelation.findUnique(
        {
          where: {
            groupPreferencesID_preferenceID: {
              groupPreferencesID: groupPreferences.id,
              preferenceID: preferenceId,
            },
          },
        }
      );

      if (!existingPreference) {
        res.status(400).json({ message: "Preference does not exist!" });
        return;
      }

      const updatedPreference = await prisma.groupPreferencesRelation.update({
        where: { id: existingPreference.id },
        data: {
          option,
          importance,
        },
      });

      res.json({ updatedPreference });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

/**
 * DELETE
 */

export const deleteUserPreference = expressAsyncHandler(
  async (
    req: Request<{ id: string }, {}, { preferenceId?: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { preferenceId } = req.body;
      const { id } = req.params;
      if (!preferenceId) {
        res.status(400).json({ message: "Invalid request body" });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: id },
        include: {
          preferences: true,
        },
      });

      if (!user) {
        res.status(404).json({ message: "User not found", id });
        return;
      }

      let userPreferences = user.preferences;
      if (!userPreferences) {
        res.status(404).json({ message: "User preferences not found" });
        return;
      }

      let existingPreference = await prisma.userPreferencesRelation.findUnique({
        where: {
          userPreferencesID_preferenceID: {
            userPreferencesID: userPreferences.id,
            preferenceID: preferenceId,
          },
        },
      });

      if (!existingPreference) {
        res.status(400).json({ message: "Preference does not exist!" });
        return;
      }

      await prisma.userPreferencesRelation.delete({
        where: { id: existingPreference.id },
      });

      res.json({ message: "Preference deleted" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

export const deleteGroupPreference = expressAsyncHandler(
    async (
      req: Request<{ id: string }, {}, { preferenceId?: string }>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const { preferenceId } = req.body;
        const { id } = req.params;
        if (!preferenceId) {
          res.status(400).json({ message: "Invalid request body" });
          return;
        }
  
        const group = await prisma.group.findUnique({
          where: { id: id },
          include: {
            preferences: true,
          },
        });
  
        if (!group) {
          res.status(404).json({ message: "group not found", id });
          return;
        }
  
        let groupPreferences = group.preferences;
        if (!groupPreferences) {
          res.status(404).json({ message: "group preferences not found" });
          return;
        }
  
        let existingPreference = await prisma.groupPreferencesRelation.findUnique({
          where: {
            groupPreferencesID_preferenceID: {
              groupPreferencesID: groupPreferences.id,
              preferenceID: preferenceId,
            },
          },
        });
  
        if (!existingPreference) {
          res.status(400).json({ message: "Preference does not exist!" });
          return;
        }
  
        await prisma.groupPreferencesRelation.delete({
          where: { id: existingPreference.id },
        });
  
        res.json({ message: "Preference deleted" });
      } catch (error) {
        res.status(500).json({ message: "Server error", error });
      }
    }
  );