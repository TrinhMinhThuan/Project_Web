const sql = require("mssql");

const databaseConnection = require('../utils/database_payment');

module.exports = class PaymentAccount {
    constructor(UserID, Balance)
    {
        this.UserID = UserID;
        this.Balance = Balance;
    }

    static async createPaymentAccountByUserID(ID)
    {
        let pool = await sql.connect(databaseConnection);
        let Account = await pool
        .request()
        .input("UserID", sql.Int, ID)
        .input("Balance", sql.Int, 0)
        
        .query("INSERT INTO PaymentAccount VALUES (@UserID, @Balance)");
        return Account.rowsAffected[0];
    } 
    static async getAccountByUserID(ID)
    {
        let pool = await sql.connect(databaseConnection);
        let user = await pool
            .request()
            .input("ID", sql.Int, ID)
            .query("SELECT * FROM PaymentAccount WHERE UserID = @ID");
        return user.recordset[0];
    }
    static async updateBalanceById(ID, Balance) {
        let pool = await sql.connect(databaseConnection);
        let update = await pool
            .request()
            .input("ID", sql.Int, ID)
            .input("Balance", sql.Int, Balance)
            .query(
                "UPDATE PaymentAccount SET Balance = Balance + @Balance WHERE UserID = @ID "
            );
        return update.rowsAffected[0];
    }
    static async setBalanceByUserID(UserID, Balance)
    {
        let pool = await sql.connect(databaseConnection);
        let user = await pool
            .request()
            .input('Balance', sql.Int, Balance)
            .input('ID', sql.Int, UserID)
            .query("update PaymentAccount set Balance = @Balance WHERE UserID = @ID");
        return user.rowsAffected[0];
    }
}