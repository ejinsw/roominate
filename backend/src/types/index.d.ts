import { Prisma, User as PrismaUser } from "@prisma/client";

declare global {
  declare namespace Express {
    export interface User
      extends Prisma.UserGetPayload<{
        include: {
          preferences: {
            include: {
              preferences: {
                include: {
                  preference: true;
                };
              };
              preferredHousing: {
                include: {
                  housing: true;
                };
              };
            };
          };
        };
      }> {}
    // TODO: Add the rest of the schema (...or import types from ORM)
    export interface Request {
      user: User;
    }
    export interface Group
    extends Prisma.GroupGetPayload<{
      include: {
        preferences: {
          include: {
            preferences: {
              include: {
                preference: true;
              };
            };
            preferredHousing: {
              include: {
                housing: true;
              };
            };
          };
        };
      };
    }> {}
  }
}

export {};
