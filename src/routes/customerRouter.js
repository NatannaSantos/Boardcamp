import { Router } from "express";
import { createCustomers, getCustomerById, getCustomers, putCustomer } from "../controllers/customersController.js";
import { validateCustomerSchema } from "../middlewares/validateCustomerSchema.js";
import customerSchema from "../schemas/customerSchema.js";

const customerRouter=Router();

customerRouter.post("/customers",validateCustomerSchema(customerSchema),createCustomers);
customerRouter.get("/customers",getCustomers);
customerRouter.get("/customers/:id",getCustomerById);
customerRouter.put("/customers/:id",validateCustomerSchema(customerSchema),putCustomer);

export default customerRouter;