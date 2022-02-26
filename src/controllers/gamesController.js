import db from "../database.js";

export async function createGame(req, res) {
    const games = req.body;
    console.log(games);
    const stockTotal = parseInt(games.stockTotal);
    const pricePerDay = parseInt(games.pricePerDay);

    if (stockTotal < 0 || pricePerDay < 0) {
        res.status(400).send("Quantidade no estoque ou preço deve ser maior que zero");
        return;
    }

    try {
        const result = await db.query(`SELECT id FROM games WHERE name=$1`, [games.name]);
        if (result.rows.length > 0) {
            return res.status(409).send('Jogo já cadastrado')
        }
        const resultCategory= await db.query(`SELECT id FROM categories WHERE id=$1`,[games.categoryId]);
        if(resultCategory.rows.length===0){
            res.status(400).send("Categoria inexistente");
        }

        await db.query(`
        INSERT INTO games (name,image,"stockTotal","categoryId","pricePerDay")
        Values ($1,$2,$3,$4,$5)
        `, [games.name, games.image, stockTotal, games.categoryId, pricePerDay]);
        res.sendStatus(201);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}


export async function getGames(req, res) {
    try {
        const { rows: games } = await db.query(`
        SELECT games.*,categories.name AS "categoryName" FROM games
            JOIN categories ON games."categoryId"=categories.id
        `);
        if (games.length === 0) {
            res.sendStatus(404);
            return;
        }

        res.send(games);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}