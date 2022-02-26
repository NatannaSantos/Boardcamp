export function validateGamesSchema(gamesSchema){
    return (req,res,next)=>{
        const validation=gamesSchema.validate(req.body);
        if(validation.error){
            res.sendStatus(400);
            return;
        }
        next();
    }
}