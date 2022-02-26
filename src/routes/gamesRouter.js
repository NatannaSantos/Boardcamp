import { Router } from "express";
import { createGame, getGames } from "../controllers/gamesController.js";
import { validateGamesSchema } from "../middlewares/validateGamesSchema.js";
import gamesSchema from "../schemas/gamesSchema.js";

const gamesRouter=Router();

gamesRouter.post("/games",validateGamesSchema(gamesSchema), createGame);
gamesRouter.get("/games",getGames);

export default gamesRouter;