import multer from "multer";
import path from "path";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadDir = "./src/covers/";

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const title = req.body.title ? req.body.title.split(" ").join("_") : "book";
        cb(null, `${title}_${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage });

export default upload;
