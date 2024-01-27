const sql = require("mssql");

const databaseConnection = require('../utils/database');

module.exports = class TopUp {
    constructor(TopUpID, UserID, Amount, TopUpDay) {
        this.TopUpID = TopUpID;
        this.UserID = UserID;
        this.Amount = Amount;
        this.TopUpDay = TopUpDay;
    }
    static async getByUserID(userID) {
        let pool = await sql.connect(databaseConnection);
        let topup = await pool.request()
            .input('userID', sql.Int, userID)
            .query(`SELECT * FROM TopUp WHERE UserID = @userID  ORDER BY TopUpDay DESC, TopUpID DESC`);
        return topup.recordset;
    }
    static async getByUserID_Page(userID, page, limit) {
        let pool = await sql.connect(databaseConnection);
        let topup = await pool.request()
            .input('userID', sql.Int, userID)
            .input("Offset", sql.Int, (page - 1) * limit)
            .input("Limit", sql.Int, limit)
            .query(`SELECT * , count(*) over() as Total FROM TopUp WHERE UserID = @userID  ORDER BY TopUpDay DESC, TopUpID DESC
                OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY`);
        return topup.recordset;
    }
    static async getIDInLastRow() {
        let pool = await sql.connect(databaseConnection);
        let row = await pool
            .request()
            .query("SELECT TOP(1) * FROM TopUp ORDER BY TopUpID DESC");
        if (row.recordset.length > 0)
            return row.recordset[0].TopUpID;
        else
            return undefined;
    }


    static async create(UserID, Amount) {
        const currentDate = new Date();
        
        let pool = await sql.connect(databaseConnection);

        let id = await this.getIDInLastRow();
        if (id != undefined) {
            id += 1;
        }
        else {
            id = 1;
        }


        let topup = await pool
            .request()
            .input("TopUpID", sql.Int, id)
            .input("UserID", sql.Int, UserID)
            .input("Amount", sql.Int, Amount)
            .input("TopUpDay", sql.DateTime, currentDate)
            .query("INSERT INTO TopUp VALUES (@TopUpID, @UserID, @Amount, @TopUpDay)");

        return topup.rowsAffected[0];

    }
}