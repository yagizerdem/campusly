import cors from "cors";
import express from "express";

const app = express();

/**
 * App Configuration
 */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export { app };
