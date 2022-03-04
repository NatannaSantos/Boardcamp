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

export async function getCustomers(req, res) {
    const cpfQuery = req.query.cpf;

    if (cpfQuery) {
        try {
            const { rows: customers } = await db.query(`
            SELECT * FROM customers WHERE cpf LIKE '${cpfQuery}%'
            `);
            if (customers.length === 0) {
                res.sendStatus(404);
                return;
            }

            res.send(customers);
        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
        return;
    }

    try {
        const { rows: customers } = await db.query(`
        SELECT * FROM customers
        `);
        if (customers.length === 0) {
            res.sendStatus(404);
            return;
        }

        res.send(customers);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);

    }
}

export async function getCustomerById(req, res) {
    const { id } = req.params;
    try {
        const { rows: customer } = await db.query(`
         SELECT * FROM customers
         WHERE id=$1
         `, [id]);
        if (customer.length === 0) {
            res.sendStatus(404);
            return;
        }
        res.send(customer[0]);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function putCustomer(req, res) {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;
    try {
        const result = await db.query(`
        UPDATE customers 
        SET name=$1,phone=$2,cpf=$3,birthday=$4
        WHERE id = $5
        `, [name, phone, cpf, birthday, id]);

        if (result.rowCount === 0) {
            return res.sendStatus(404);
        }
        res.sendStatus(200);
        
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}