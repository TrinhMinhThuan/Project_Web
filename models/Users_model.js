const sql = require("mssql");

const databaseConnection = require('../utils/database');

module.exports = class Users {
    constructor(UserID, Username, Password, Email, Role, Balance) {
        this.UserID = UserID;
        this.Username = Username;
        this.Password = Password;
        this.Email = Email;
        this.Role = Role;
        this.Balance = Balance;
    }
    static async getAll() {
        let pool = await sql.connect(databaseConnection);
        let books = await pool.request().query("SELECT * FROM Users");
        return books.recordset;
    }
    static async getUserByUserName(username) {
        let pool = await sql.connect(databaseConnection);
        let user = await pool
            .request()
            .input("Name", sql.NVarChar, username)
            .query("SELECT * FROM Users WHERE Username like @Name");
        return user.recordset[0];
    }
}