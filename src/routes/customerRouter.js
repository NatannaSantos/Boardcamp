import { Router } from "express";
import { createCustomers } from "../controllers/customersController.js";
import { validateCustomerSchema } from "../middlewares/validateCustomerSchema.js";
import customerSchema from "../schemas/customerSchema.js";

const customerRouter=Router();

customerRouter.post("/customers",validateCustomerSchema(customerSchema),createCustomers);

export default customerRouter;