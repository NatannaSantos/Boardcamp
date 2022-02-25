import db from "../database.js";

export async function createCategories(req, res) {
    try {
        const { name } = req.body;

        const result = await db.query(`SELECT id FROM categories WHERE name=$1`, [name]);
        if (result.rows.length > 0) {
            return res.status(409).send("Categoria já existente");
        }
        await db.query(`
        INSERT INTO categories (name)
            VALUES ($1)
        `, [name]);
        res.sendStatus(201);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);

    }
}

export async function getCategories(req, res) {
    try {
        const {rows:categories}=await db.query(`
        SELECT * FROM categories
        `);
        if(categories.length===0){
            res.sendStatus(404);
        }
        res.send(categories);
    } catch (error) {
        
    }

}