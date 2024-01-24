const sql = require("mssql");

const databaseConnection = require('../utils/database');

module.exports = class TopUp
{
    constructor(TopUpID, UserID, Amount, TopUpDay)
    {
        this.TopUpID = TopUpID;
        this.UserID = UserID;
        this.Amount = Amount;
        this.TopUpDay = TopUpDay;
    }
    static async getByUserID(userID)
    {
        let pool = await sql.connect(databaseConnection);
        let topup = await pool.request()
        .input('userID', sql.Int, userID)
        .query(`SELECT * FROM TopUp WHERE UserID = @userID`);
        return topup.recordset;
    }
    static async getIDInLastRow() {
        let pool = await sql.connect(databaseConnection);
        let row = await pool
            .request()
            .query("SELECT TOP(1) * FROM TopUp ORDER BY TopUpID DESC");

        return row.recordset[0].TopUpID;


    }
    
    
    static async create(UserID, Amount)
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


        let topup = await pool
            .request()
            .input("TopUpID", sql.Int, id)
            .input("UserID", sql.Int, UserID)
            .input("Amount", sql.Int, Amount)
            .input("TopUpDay", sql.Date, currentDate)
            .query("INSERT INTO TopUp VALUES (@TopUpID, @UserID, @Amount, @TopUpDay)");

        return topup.rowsAffected[0];

    }
}