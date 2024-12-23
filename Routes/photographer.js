import express from "express";
import {
  updatePhotographer,
  deletePhotographer,
  getAllPhotographer,
  getSinglePhotographer,
  getPhotographerProfile,
} from "../Controllers/photographerController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";
import reviewRouter from "./review.js";

const router = express.Router();

const photographerAuth = [authenticate, restrict(["photographer"])];

// Nested routes
router.use("/:photographerId/reviews", reviewRouter);

// Routes
router.route("/").get(getAllPhotographer);

router
  .route("/:id")
  .get(getSinglePhotographer) // Get a single photographer by ID
  .put(photographerAuth, updatePhotographer) // Update photographer details (authentication and restriction required)
  .delete(photographerAuth, deletePhotographer); // Delete photographer (authentication and restriction required)

router.route("/profile/me").get(photographerAuth, getPhotographerProfile); // Get profile of the authenticated photographer

export default router;
