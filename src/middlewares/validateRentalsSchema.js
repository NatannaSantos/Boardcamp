export function validateRentalsSchema(rentalsSchema){
    return (req,res,next)=>{
        const validation=rentalsSchema.validate(req.body);
        if(validation.error){
            console.log(validation.error);
            res.sendStatus(400);
            return;
        }
        next();
    }
}