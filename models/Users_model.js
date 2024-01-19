const sql = require("mssql");

const databaseConnection = require('../utils/database');

module.exports = class Users 
{
    constructor(UserID, Username, Password, Email, Role, AccountID)
    {
        this.UserID =UserID;
        this.Username = Username; 
        this.Password = Password;
        this.Email = Email;
        this.Role = Role;
        this.AccountID  = AccountID;
    }
    static async getAll()
    {
        let pool = await sql.connect(databaseConnection);
        let books = await pool.request().query("SELECT * FROM Users");
        return books.recordset;
    }
}