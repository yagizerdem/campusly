import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";

import { app } from "./app.js";

const currentDirectory = dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: [
    join(currentDirectory, "..", ".env.dev"),
    join(currentDirectory, "..", ".env.prod"),
  ],
  override: true,
});

const port = Number(process.env.PORT ?? 3000);

app.listen(port, () => {
  console.info(`server up on port ${port}`);
});
