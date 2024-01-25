
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
    static async countCartByUserID(UserID)
    {
        let pool = await sql.connect(databaseConnection);
        let Carts = await pool.request()
        .input('UserID', sql.Int, UserID)
        .query(`SELECT count(*) as total FROM Carts Where UserID = @UserID`);
        return Carts.recordset[0].total;
    }
    static async getByUserID(userID)
    {
        let pool = await sql.connect(databaseConnection);
        let Carts = await pool.request()
        .input('userID', sql.Int, userID)
        .query(`SELECT * FROM Carts WHERE UserID = @userID`);
        return Carts.recordset;
    }
    static async updateQuantityByCartID(cartID, Quantity)
    {
        let pool = await sql.connect(databaseConnection);
        let product = await pool
            .request()
            .input('Quantity', sql.Int, Quantity)
            .input('ID', sql.Int, cartID)
            .query("update Carts set Quantity = Quantity + @Quantity WHERE CartID = @ID");
        return product.rowsAffected[0];
    }

    static async getByUserID_Page(userID,page,limit)
    {
        let pool = await sql.connect(databaseConnection);
        let Carts = await pool.request()
        .input('userID', sql.Int, userID)
        .input("Offset", sql.Int, (page - 1) * limit)
        .input("Limit", sql.Int, limit)
        .query(`SELECT *, count(*) over() as Total FROM Carts WHERE UserID = @userID
                ORDER BY CartID
                OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY 
        `);
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
    static async deleteByCartID(cartID)
    {
        let pool = await sql.connect(databaseConnection);
        let deletee = await pool.request()
        .input('Id', sql.Int, cartID)
        .query('DELETE FROM Carts WHERE CartID = @Id');
        return deletee.rowsAffected[0];
    }
    static async addCart(options){
        let pool = await sql.connect(databaseConnection);
        let add = await pool.request()
        .input('CartID', sql.Int, options.maxCartID + 1)
        .input('UserID', sql.Int, options.UserID)
        .input('ProductID', sql.Int, options.BookID)
        .input('Quantity', sql.Int, options.quantity)
        .query('INSERT INTO Carts (CartID, UserID, ProductID, Quantity) VALUES (@CartID, @UserID, @ProductID,@Quantity)');
        if (add.rowsAffected[0] > 0) {
            return true;
        } else {
            return false;
        }
    }        
}


