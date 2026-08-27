import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const uploadDir = path.resolve("uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const diskStorage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir); // Where files will be saved
  },
  filename: function (_req, file, cb) {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`); // How files will be named
  },
});
const upload = multer({ storage: diskStorage });
export default upload;

export { uploadDir };
