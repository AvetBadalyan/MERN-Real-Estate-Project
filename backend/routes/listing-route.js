import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
} from "../controllers/listing-controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createListing);
router.get("/", getListings);
router.put("/:id([0-9a-fA-F]{24})", verifyToken, updateListing);
router.delete("/:id([0-9a-fA-F]{24})", verifyToken, deleteListing);
router.get("/:id([0-9a-fA-F]{24})", getListing);

export default router;
