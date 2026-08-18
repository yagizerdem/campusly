import cors from "cors";
import express from "express";
import authRoute from "@route/auth-route.js";

const app = express();

/**
 * App Configuration
 */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);

export { app };
