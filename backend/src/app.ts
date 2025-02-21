import express, { Application, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
// import serverless from "serverless-http";

import userRouter from "./routes/userRouter";
import authRouter from "./routes/authRouter";
import preferenceRouter from "./routes/preferenceRouter";
import groupRouter from "./routes/groupRouter";
import housingRouter from "./routes/housingRouter";

dotenv.config();

const app: Application = express();

/**
 * Middleware
 */
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(passport.initialize());

// Token validator
app.get(
  "/api/validate-token",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ user: req.user, valid: true });
  }
);

/**
 * Routes
 */
// TODO: Add routes... i.e. app.use("/<route>", <router>)
app.use("/api", userRouter);
app.use("/api", authRouter);
app.use("/api", preferenceRouter);
app.use("/api", housingRouter);
app.use("/api", groupRouter);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

/**
 * FOR SERVER
 */
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

// FOR SERVERLESS
// If we decide to deploy on AWS Lambda
// replace
// ```
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
// ```
// with
// ```
// export const handler = serverless(app);
// ```
