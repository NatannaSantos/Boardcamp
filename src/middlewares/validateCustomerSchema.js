export function validateCustomerSchema(customerSchema) {
    return (req, res, next) => {
        const validation = customerSchema.validate(req.body);
        if (validation.error) {
            res.sendStatus(400);
            return;
        }
        next();
    }
}
