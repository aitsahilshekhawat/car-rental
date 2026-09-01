import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => ({
    folder: "cars",
    format: "png",
    public_id: Date.now() + "-" + file.originalname,
  }),
});

// M2: File upload size limits — 5 MB per file, max 10 files per request
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 10,
  },
});

export default upload;
