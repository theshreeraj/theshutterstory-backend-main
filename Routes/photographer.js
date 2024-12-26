import express from "express";
import {
  updatePhotographer,
  deletePhotographer,
  getAllPhotographer,
  getSinglePhotographer,
  getPhotographerProfile,
  uploadWork,
} from "../Controllers/photographerController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";
import reviewRouter from "./review.js";
import multer from "multer";

const router = express.Router();

// multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix+file.originalname)
  }
})

const upload = multer({ storage: storage })

const photographerAuth = [authenticate, restrict(["photographer"])];

// Nested routes
router.use("/:photographerId/reviews", reviewRouter);

// Routes
router.route("/").get(getAllPhotographer);

router
  .route("/:id")
  .get(getSinglePhotographer) 
  .put(photographerAuth, updatePhotographer) 
  .delete(photographerAuth, deletePhotographer); 

router.post('/uploadWork',photographerAuth,upload.single('file1'), uploadWork)

router.route("/profile/me").get(photographerAuth, getPhotographerProfile); 

export default router;
