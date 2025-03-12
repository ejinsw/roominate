import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { Prisma, User, UserPreferencesRelation } from "@prisma/client";
import prisma from "../prismaClient";

export const getUsers = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      /* Parse Query Filters */
      const { filters: queryFilters, userId } = req.query;

      let user: Express.User | null = null;

      if (userId) {
        user = await prisma.user.findUnique({
          where: { id: userId.toString() },
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
        gender: string[];
        year: string[];
        housing: string[];
        major: string[];
      } = { preferences: [], gender: [], year: [], housing: [], major: [] };

      // parse out the query filters
      if (queryFilters) {
        try {
          parsedFilters = JSON.parse(queryFilters as string);
        } catch (error) {
          res.status(400).json({ error: "Invalid filters format" });
          return;
        }
      }

      /* Add Filters */
      let filter = {} as Prisma.UserWhereInput;

      // Name filter
      if (req.query.name) {
        filter.name = {
          contains: req.query.name.toString(),
          mode: "insensitive",
        };
      }

      // Email filter
      if (req.query.email) {
        filter.email = {
          contains: req.query.email.toString(),
          mode: "insensitive",
        };
      }

      // Id filter
      if (req.query.id) {
        filter.id = { equals: req.query.id as string };
      }

      // Gender filter
      if (parsedFilters.gender?.length) {
        filter.gender = {
          in: parsedFilters.gender,
          mode: "insensitive",
        };
      }

      // Year filter
      if (parsedFilters.year?.length) {
        filter.year = { in: parsedFilters.year.map((val) => parseInt(val)) };
      }

      // Major filter
      if (parsedFilters.major?.length) {
        filter.major = {
          in: parsedFilters.major,
          mode: "insensitive",
        };
      }

      //COPY FROM HERE
      //Living preferences filter
      type ExtendedUserPreferencesRelation = UserPreferencesRelation & {
        preference: {
          id: string;
          value: string;
          category: string;
          options: string[];
          importance: string[];
        };
      };

      if (parsedFilters.preferences?.length && user) {
        // Get the loggin in user's preferences
        const extendedUser = user as User & {
          preferences?: { preferences: ExtendedUserPreferencesRelation[] };
        };

        // Build an array for each living preference
        const livingPreferenceConditions = parsedFilters.preferences
          .map((filterPref: string) => {
            // Look up the the user's preference for the filter chosen
            const userPref = extendedUser.preferences?.preferences.find(
              (up) =>
                up.preference.value.toLowerCase() === filterPref.toLowerCase()
            );
            if (!userPref) return null;

            // Get the mtching UserPreferencesRelation for the other users
            return {
              preferences: {
                is: {
                  preferences: {
                    some: {
                      preference: {
                        is: {
                          value: {
                            equals: filterPref,
                            mode: "insensitive" as const,
                          },
                        },
                      },
                      option: { equals: userPref.option },
                    },
                  },
                },
              },
            } as Prisma.UserWhereInput;
          })
          // Filter out non matching values
          .filter((cond): cond is Prisma.UserWhereInput => cond !== null);

        // Use spread operator to add to the filter
        if (livingPreferenceConditions.length > 0) {
          filter = {
            AND: [filter, ...livingPreferenceConditions],
          };
        }
      }

      // Housing filter
      if (parsedFilters.housing?.length) {
        filter.preferences = {
          preferredHousing: {
            some: {
              housing: {
                OR: parsedFilters.housing.map((housing) => {
                  return {
                    name: {
                      equals: housing,
                      mode: "insensitive",
                    },
                  };
                }),
              },
            },
          },
        };
      }
      //TO HERE

      const users = await prisma.user.findMany({
        where: filter,
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
      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);

export const updateOnBoarding = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const user: any = req.user;

      if (user.onBoardingComplete) {
        res.status(400).json({ message: "Onboarding already completed" });
        return;
      }

      let finishedOnboarding = true;
      const userPreferences = user.preferences?.preferences.map(
        (val: any) => val.preference.value
      );

      const preferences = await prisma.preference.findMany();

      for (const pref of preferences) {
        if (!userPreferences?.includes(pref.value)) {
          finishedOnboarding = false;
          break;
        }
      }

      await prisma.user.update({
        where: { id: (req.user as any).id },
        data: { onBoardingComplete: finishedOnboarding },
      });

      res.json({ message: "Onboarding updated" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);

export const updateMe = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const user: any = req.user;

      const {
        year,
        gender,
        name,
        major,
        bio,
        interests,
        preferences,
        housing,
      } = req.body;

      const updateData = {} as Prisma.UserUpdateInput;

      if (bio) updateData.bio = bio;

      if (interests) updateData.interests = interests;

      if (year) updateData.year = year;

      if (gender) updateData.gender = gender;

      if (name) updateData.name = name;

      if (major) updateData.major = major;

      if (preferences) {
        await prisma.userPreferences.upsert({
          where: { userID: user.id },
          update: {
            preferences: { deleteMany: {} },
          },
          create: {
            userID: user.id,
            preferences: {
              create: preferences.map(
                (pref: { id: string; option: string; importance: string }) => ({
                  option: pref.option,
                  importance: pref.importance,
                  preference: {
                    connect: { id: pref.id },
                  },
                })
              ),
            },
          },
        });

        await prisma.userPreferences.update({
          where: { userID: user.id },
          data: {
            preferences: {
              create: preferences.map(
                (pref: { id: string; option: string; importance: string }) => ({
                  option: pref.option,
                  importance: pref.importance,
                  preference: {
                    connect: { id: pref.id },
                  },
                })
              ),
            },
          },
        });
      }

      if (housing) {
        await prisma.userPreferences.upsert({
          where: { userID: user.id },
          update: {
            preferredHousing: { deleteMany: {} },
          },
          create: {
            userID: user.id,
            preferredHousing: {
              create: housing.map((house: { id: string }) => ({
                housing: {
                  connect: { id: house.id },
                },
              })),
            },
          },
        });

        await prisma.userPreferences.update({
          where: { userID: user.id },
          data: {
            preferredHousing: {
              create: housing.map((house: { id: string }) => ({
                housing: {
                  connect: { id: house.id },
                },
              })),
            },
          },
        });
      }

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });

      res.json(updatedUser);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);

export const deleteMe = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      await prisma.$transaction([
        // Delete all related UserPreferencesRelation entries first
        prisma.userPreferencesRelation.deleteMany({
          where: {
            userPreferences: {
              userID: (req.user as any).id,
            },
          },
        }),

        // Delete the UserPreferences entry
        prisma.userPreferences.deleteMany({
          where: { userID: (req.user as any).id },
        }),

        // Delete the User entry
        prisma.user.delete({
          where: { id: (req.user as any).id },
        }),
      ]);

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);
