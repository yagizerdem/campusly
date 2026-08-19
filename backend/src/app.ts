import cors from "cors";
import express from "express";
import authRoute from "@route/auth-route.js";
import profileRoute from "@route/profile-route.js";
import clubRoute from "@route/club-route.js";
import { globalErrorHandler } from "@src/global-error-handler.js";

const app = express();

/**
 * App Configuration
 */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute);
app.use("/api/club", clubRoute);

app.use(globalErrorHandler);

export { app };
