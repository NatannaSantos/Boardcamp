import db from "../database.js";

export async function createCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        const result = await db.query(`SELECT id FROM customers WHERE cpf=$1`, [cpf]);
        if (result.rows.length > 0) {
            res.status(409).send("Cliente já cadastrado");
            return;
        }

        await db.query(`
        INSERT INTO customers (name,phone,cpf,birthday)
        VALUES($1,$2,$3,$4)
        `, [name, phone, cpf, birthday]);

        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(500);
    }
}