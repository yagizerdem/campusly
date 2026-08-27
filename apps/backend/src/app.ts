import cors from "cors";
import express from "express";
import authRoute from "@route/auth-route.js";
import profileRoute from "@route/profile-route.js";
import clubRoute from "@route/club-route.js";
import postRoute from "@route/post-route.js";
import { globalErrorHandler } from "@src/global-error-handler.js";
import helmet from "helmet";
import compression from "compression";
import likeRoute from "@route/like-route.js";
import commentRoute from "@route/comment-route.js";
import tagRoute from "@route/tag-route.js";
import clubMembershipRoute from "@route/club-membership-route.js";
import auditRoute from "@route/audit-route.js";
import storyRoute from "@route/story-route.js";

const app = express();

/**
 * App Configuration
 */

app.use(compression());
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute);
app.use("/api/club", clubRoute);
app.use("/api/post", postRoute);
app.use("/api/like", likeRoute);
app.use("/api/comment", commentRoute);
app.use("/api/tag", tagRoute);
app.use("/api/club-membership", clubMembershipRoute);
app.use("/api/audit", auditRoute);
app.use("/api/story", storyRoute);

app.use(globalErrorHandler);

export { app };
