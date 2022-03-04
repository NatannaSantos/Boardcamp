import dayjs from "dayjs";
import db from "../database.js";
import moment from "moment";

export async function createRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body;
    let rentDate = dayjs().format('{YYYY} MM-DD');
    let delayFee = null;
    let returnDate = null;


    try {
        if (daysRented === 0) {
            return res.sendStatus(400);
        }

        const { rows: customer } = await db.query(`
        SELECT id FROM customers
        WHERE customers.id=$1
        `, [customerId]);

        if (customer.length === 0) {
            return res.sendStatus(400);
        }

        const { rows: game } = await db.query(`
        SELECT * FROM games WHERE id=$1
        `, [gameId]);

        if (game.length === 0) {
            return res.sendStatus(400);
        }


        let originalPrice = daysRented * game[0].pricePerDay;

        let stockTotal = game[0].stockTotal;

        if (stockTotal === 0) {
            return res.sendStatus(400);
        }
        stockTotal--;

        await db.query(`
        INSERT INTO rentals ("customerId","gameId","rentDate","daysRented","returnDate","originalPrice","delayFee")
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        `, [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]);

        await db.query(`
        UPDATE games 
        SET "stockTotal"=$1
        WHERE id=$2
        `, [stockTotal, gameId]);

        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

}

export async function getRentals(req, res) {
    const customerIdQuery = req.query.customerId;
    const gameIdQuery = req.query.gameId;

    if (customerIdQuery) {
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
            WHERE CAST("customerId" AS TEXT) LIKE '${customerIdQuery}'
            `);


            if (rentals.length === 0) {
                res.sendStatus(404);
                return;
            }
            const rental = rentals.map(rental => ({
                id: rental.id,
                customerId: rental.customerId,
                gameId: rental.gameId,
                rentDate: rental.rentDate,
                daysRented: rental.daysRented,
                returnDate: rental.returnDate,
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
        return;
    } else if (gameIdQuery) {
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
            WHERE CAST("gameId" AS TEXT) LIKE '${gameIdQuery}'
            `);


            if (rentals.length === 0) {
                res.sendStatus(404);
                return;
            }
            const rental = rentals.map(rental => ({
                id: rental.id,
                customerId: rental.customerId,
                gameId: rental.gameId,
                rentDate: rental.rentDate,
                daysRented: rental.daysRented,
                returnDate: rental.returnDate,
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
        return;
    }

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


        if (rentals.length === 0) {
            res.sendStatus(404);
            return;
        }
        const rental = rentals.map(rental => ({
            id: rental.id,
            customerId: rental.customerId,
            gameId: rental.gameId,
            rentDate: rental.rentDate,
            daysRented: rental.daysRented,
            returnDate: rental.returnDate,
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

export async function finalizeRent(req, res) {
    const { id } = req.params;
    const returnDate = dayjs().format('{YYYY} MM-DD');

    try {

        const { rows: rental } = await db.query(`
        SELECT rentals.*,
        games."pricePerDay",
        games."stockTotal"
        FROM rentals         
        JOIN games ON rentals."gameId"=games.id 
        WHERE rentals.id = $1
        `, [id]);

        if (rental.length === 0) {
            return res.sendStatus(404);
        }
        if (rental[0].returnDate !== null) {
            return res.sendStatus(400);
        }

        const now = moment(new Date());
        const past = moment(rental[0].rentDate);
        const duration = moment.duration(now.diff(past));


        const days = parseInt(duration.asDays());
        const daysRented = rental[0].daysRented;
        const pricePerDay = rental[0].pricePerDay;
        let delayFee = null;

        if (days >= daysRented) {
            let daysOfDelay = days - daysRented;
            delayFee = daysOfDelay * pricePerDay;
        }

        await db.query(`
        UPDATE rentals 
        SET "returnDate"=$1, "delayFee"=$2
        WHERE id=$3
        `, [returnDate, delayFee, id]);

        let stockTotal = rental[0].stockTotal + 1;
        console.log("estoque total Após voltar do aluguel:" + stockTotal);

        await db.query(`
        UPDATE games 
        SET "stockTotal"=$1
        WHERE id=$2
        `, [stockTotal, rental[0].gameId]);


        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);

    }
}

export async function deleteRental(req, res) {
    const { id } = req.params;

    try {

        const { rows: result } = await db.query(`
        SELECT rentals.*,
        games."stockTotal"        
        FROM rentals
        JOIN games ON rentals."gameId"=games.id
        WHERE rentals.id=$1        
        `, [id]);

        if (result.length === 0) {
            console.log("Aluguel não existe");
            return res.sendStatus(404);
        }

        if (result[0].returnDate !== null) {
            console.log("Aluguel Finalizado");
            return res.sendStatus(400);
        }

        await db.query(`
        DELETE FROM rentals WHERE id=$1
        `, [id]);
        console.log("estoque existente:" + result[0].stockTotal)
        let stockTotal = result[0].stockTotal + 1;
        console.log("estoque total Após deletar do aluguel:" + stockTotal);

        await db.query(`
        UPDATE games 
        SET "stockTotal"=$1
        WHERE id=$2
        `, [stockTotal, result[0].gameId]);

        res.sendStatus(200);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}
