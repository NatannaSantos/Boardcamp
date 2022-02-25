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
        `,[name]);
        res.sendStatus(201);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);

    }
}