const sql = require("mssql");

const databaseConnection = require('../utils/database');

module.exports = class Orders
{
    constructor(OrderID, UserID, OrderDate, TotalAmount)
    {
        this.OrderID = OrderID;
        this.UserID = UserID;
        this.OrderDate = OrderDate;
        this.TotalAmount = TotalAmount;
    }
    static async getIDInLastRow() {
        let pool = await sql.connect(databaseConnection);
        let row = await pool
            .request()
            .query("SELECT TOP(1) * FROM Orders ORDER BY OrderID DESC");
        return row.recordset[0].OrderID;
    }
    
    
    static async create(UserID, TotalAmount)
    {
        const currentDate = new Date();
        let pool = await sql.connect(databaseConnection);

        let id = await this.getIDInLastRow();
        if (id !== undefined)
        {
            id += 1;
        }
        else
        {
            id = 1;
        }
        

        let Order = await pool
            .request()
            .input("OrderId", sql.Int, id)
            .input("UserID", sql.Int, UserID)
            .input("OrderDate", sql.Date, currentDate)
            .input("TotalAmount", sql.Int, TotalAmount)
            .query("INSERT INTO Orders VALUES (@OrderID, @UserID, @OrderDate, @TotalAmount)");
        return id;

    }
    static async getByUserID (UserID)
    {
        let pool = await sql.connect(databaseConnection);
        let Orders = await pool.request()
        .input('userID', sql.Int, UserID)
        .query(`SELECT * FROM Orders WHERE UserID = @userID ORDER BY OrderDate DESC`);
        return Orders.recordset;
    }
}