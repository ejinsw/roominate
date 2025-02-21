import { User as PrismaUser } from "@prisma/client";

declare global {
  declare namespace Express {
    export interface User extends PrismaUser {}
    // TODO: Add the rest of the schema (...or import types from ORM)
    export interface Request {
      user: User;
    }
  }
}

export {};
