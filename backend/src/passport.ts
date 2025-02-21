import passport from "passport";
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  StrategyOptions,
} from "passport-jwt";
import prisma from "./prismaClient";
import { Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || "secret_key_for_jwt",
  algorithms: ["HS256"],
};

passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      // Find the user in the database
      const user = await prisma.user.findUnique({
        where: { id: jwt_payload.sub },
        include: {
          requests: {
            include: {
              group: true,
            },
          },
          invites: {
            include: {
              group: true,
            },
          },
        },
      });

      // If user is found, return the user object
      if (user) {
        return done(null, user);
      } else {
        // If no user is found, return false
        return done(null, false);
      }
    } catch (err) {
      // Handle any errors that occur during the database query
      return done(err, false);
    }
  })
);

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: Error, user?: User | false, info?: any) => {
      if (err) {
        return res
          .status(500)
          .json({
            success: false,
            message: "Server error",
            error: err.message,
          });
      }
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
          error: info?.message || "Invalid token",
        });
      }
      req.user = user;
      next();
    }
  )(req, res, next);
};
export default passport;
