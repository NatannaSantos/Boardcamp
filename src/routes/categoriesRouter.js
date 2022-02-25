import { Router } from "express";
import { createCategories } from "../controllers/categoriesController.js";
import {validateCategoriesSchema} from "../middlewares/validateCategoriesSchema.js";
import categoriesSchema from "../schemas/categoriesSchema.js";

const categoriesRouter=Router();

categoriesRouter.post("/categories",validateCategoriesSchema(categoriesSchema),createCategories);

export default categoriesRouter;