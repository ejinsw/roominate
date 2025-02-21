import passport from "passport";
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  StrategyOptions,
} from "passport-jwt";
import prisma from "./prismaClient";

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

export const authenticate = passport.authenticate("jwt", { session: false });

export default passport;
