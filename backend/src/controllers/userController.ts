import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../prismaClient";

export const getUsers = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      /* Parse Query Filters */
      const { filters: queryFilters, userId } = req.query;

      let user : Express.User | null = null;

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
      const filter = {} as Prisma.UserWhereInput;

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

      // Preference filters
      if (parsedFilters.preferences?.length && parsedFilters.preferences && user) {
        filter.preferences = {
          preferences: {
            every: {
              AND: parsedFilters.preferences.map((preference) => {
                // this finds the matching user pref
                const userPreference = (req.user as any)?.preferences?.preferences
                  ? (req.user as any)?.preferences.preferences.find(
                      (val: any) => val.preference.value === preference
                    )
                  : null;

                if (!userPreference) return {}; // otherwise skips

                // filters out the users that don't have the same selected option for the preference
                return {
                  preference: {
                    value: {
                      equals: preference,
                      mode: "insensitive",
                    },
                  },
                  option: {
                    equals: userPreference.option,
                  },
                };
              }),
            },
          },
        };
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

      const users = await prisma.user.findMany({ where: filter });
      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);
