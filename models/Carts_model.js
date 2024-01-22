
const sql = require("mssql");

const databaseConnection = require('../utils/database');


module.exports = class Carts {
    constructor(CartID, UserID, ProductID, Quantity){
        this.CartID = CartID;
        this.UserID = UserID;
        this.ProductID = ProductID;
        this.Quantity = Quantity;
    }
    static async getByUserID(userID)
    {
        let pool = await sql.connect(databaseConnection);
        let Carts = await pool.request()
        .input('userID', sql.Int, userID)
        .query(`SELECT * FROM Carts WHERE UserID = @userID`);
        return Carts.recordset;
    }
}


