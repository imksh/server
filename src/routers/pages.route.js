import express from "express";
import protectedRoute from "../middlewares/protectedRoutes.js";
import {
  getNotes,
  postNote,
  updateNote,
  deleteNote,
} from "../controllers/pages.notes.controller.js";

const router = express.Router();

//notes
router.get("/notes", protectedRoute, getNotes);
router.post("/notes", protectedRoute, postNote);
router.put("/notes/:id", protectedRoute, updateNote);
router.delete("/notes/:id", protectedRoute, deleteNote);

export default router;
