import { Router } from "express";
import { createRentals, deleteRental, finalizeRent, getRentals } from "../controllers/rentalsController.js";
import { validateRentalsSchema } from "../middlewares/validateRentalsSchema.js";
import rentalsSchema from "../schemas/rentalsSchema.js";

const rentalsRouter=Router();

rentalsRouter.post("/rentals",validateRentalsSchema(rentalsSchema),createRentals);
rentalsRouter.get("/rentals",getRentals);
rentalsRouter.post("/rentals/:id/return",finalizeRent);
rentalsRouter.delete("/rentals/:id",deleteRental);

export default rentalsRouter;