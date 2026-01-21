import express from "express";
import protectedRoute from "../middlewares/protectedRoutes.js";
import {
  getNotes,
  postNote,
  updateNote,
  deleteNote,
} from "../controllers/pages.notes.controller.js";
import {
  MatchGridStats,
  MatchGridStatsUpdate,
} from "../controllers/pages.games.controller.js";

const router = express.Router();

//notes
router.get("/notes", protectedRoute, getNotes);
router.post("/notes", protectedRoute, postNote);
router.put("/notes/:id", protectedRoute, updateNote);
router.delete("/notes/:id", protectedRoute, deleteNote);


//Games

//Match Grid
router.get("/games/match-grid", protectedRoute, MatchGridStats);
router.post("/games/match-grid", protectedRoute, MatchGridStatsUpdate);

export default router;
