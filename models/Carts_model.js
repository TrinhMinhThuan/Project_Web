
const sql = require("mssql");

const databaseConnection = require('../utils/database');


module.exports = class Carts {
    constructor(CartID, UserID, ProductID, Quantity){
        this.CartID = CartID;
        this.UserID = UserID;
        this.ProductID = ProductID;
        this.Quantity = Quantity;
    }
    static async getAll(){
        let pool = await sql.connect(databaseConnection);
        let Carts = await pool.request()
        .query(`SELECT * FROM Carts`);
        return Carts.recordset;
    }

    static async getByUserID(userID)
    {
        let pool = await sql.connect(databaseConnection);
        let Carts = await pool.request()
        .input('userID', sql.Int, userID)
        .query(`SELECT * FROM Carts WHERE UserID = @userID`);
        return Carts.recordset;
    }
    static async getByUserID(userID)
    {
        let pool = await sql.connect(databaseConnection);
        let Carts = await pool.request()
        .input('userID', sql.Int, userID)
        .query(`SELECT * FROM Carts WHERE UserID = @userID`);
        return Carts.recordset;
    }
    static async deleteByUserID(userID)
    {
        let pool = await sql.connect(databaseConnection);
        let deletee = await pool.request()
        .input('Id', sql.Int, userID)
        .query('DELETE FROM Carts WHERE UserID = @Id');
    }
}


