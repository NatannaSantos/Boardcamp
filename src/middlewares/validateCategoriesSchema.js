export function validateCategoriesSchema(categoriesSchema){
    
    return (req,res,next)=>{
        const validation=categoriesSchema.validate(req.body);
        if(validation.error){
            res.sendStatus(400);
            return;
        }
        next();
    }
}