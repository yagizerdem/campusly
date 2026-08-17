import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const currentDirectory = dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: [
    join(currentDirectory, "..", ".env.dev"),
    join(currentDirectory, "..", ".env.prod"),
  ],
  override: true,
});
