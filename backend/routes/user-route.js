import express from "express";
import {
  deleteUser,
  getUser,
  getUserListings,
  updateUser,
} from "../controllers/user-controller.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/listings/:id([0-9a-fA-F]{24})", verifyToken, getUserListings);
router.put("/:id([0-9a-fA-F]{24})", verifyToken, updateUser);
router.delete("/:id([0-9a-fA-F]{24})", verifyToken, deleteUser);
router.get("/:id([0-9a-fA-F]{24})", verifyToken, getUser);

export default router;
