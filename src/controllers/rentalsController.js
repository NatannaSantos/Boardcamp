import dayjs from "dayjs";
import db from "../database.js";

export async function createRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body;
    let rentDate = dayjs().format('{YYYY} MM-DD');
    let delayFee = null;
    let returnDate = null;


    try {
        const result = await db.query(`SELECT id FROM rentals WHERE "customerId"=$1`, [customerId]);
        if (result.rows.length > 0) {
            res.status(409).send("alguel existente");
            return;
        }
        const { rows: price } = await db.query(`
        SELECT "pricePerDay" FROM games WHERE id=$1
        `, [gameId]);

        let originalPrice = daysRented * price[0].pricePerDay;
        
        await db.query(`
        INSERT INTO rentals ("customerId","gameId","rentDate","daysRented","returnDate","originalPrice","delayFee")
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        `, [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]);
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

}

export async function getRentals(req, res) {
    try {
        const { rows: rentals } = await db.query(` 
        SELECT 
        rentals.*,
        customers.name AS "customerName",
        games.name AS "gameName",
        games."categoryId",
        categories.name AS "categoryName"
        FROM rentals
        JOIN customers ON rentals."customerId"=customers.id
        JOIN games ON rentals."gameId"=games.id
        JOIN categories ON games."categoryId"=categories.id
        `);

        /* const {rows:customers}=await db.query(`
         SELECT customers.id, customers.name from customers
         `);
         const {rows: games} = await db.query(`
         SELECT games.id AS id, games.name, games."categoryId", categories.name AS "categoryName" FROM games
         JOIN categories ON games."categoryId"=categories.id;
         `);*/
        if (rentals.length === 0) {
            res.sendStatus(404);
            return;
        }
        const rental = rentals.map(rental => ({
            id: rental.id,
            customeId: rental.customerId,
            gameId: rental.gameId,
            rentDate: rental.rentDate,
            daysRented: rental.daysRented,
            returnDate: rental.returnDate, // troca pra uma data quando já devolvido
            originalPrice: rental.originalPrice,
            delayFee: rental.delayFee,
            customer: {
                id: rental.customerId,
                name: rental.customerName
            },
            game: {
                id: rental.gameId,
                name: rental.gameName,
                categoryId: rental.categoryId,
                categoryName: rental.categoryName
            }
        })
        );

      

        res.send(rental);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);

    }
}