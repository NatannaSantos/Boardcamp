import { Router } from "express";
import { createRentals, getRentals } from "../controllers/rentalsController.js";

const rentalsRouter=Router();

rentalsRouter.post("/rentals",createRentals);
rentalsRouter.get("/rentals",getRentals);

export default rentalsRouter;