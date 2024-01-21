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
    static async getUserByUserID(ID) {
        let pool = await sql.connect(databaseConnection);
        let user = await pool
            .request()
            .input("ID", sql.Int, ID)
            .query("SELECT * FROM Users WHERE UserID = @ID");
        return user.recordset[0];
    }
    static async getIDInLastRow() {
        let pool = await sql.connect(databaseConnection);
        let user = await pool
            .request()
            .query("SELECT TOP(1) * FROM Users ORDER BY UserID DESC");
        return user.recordset[0].UserID;
    }
    static async createAccount(user) {
        
        let pool = await sql.connect(databaseConnection);

        let id = await this.getIDInLastRow();
        id += 1;

        let User = await pool
        .request()
        .input("UserID", sql.Int, id)
        .input("Username", sql.NVarChar, user.Username)
        .input("Password", sql.NVarChar, user.Password)
        .input("Email", sql.NVarChar, user.Email)
        .input("Role", sql.NVarChar, 'Admin')
        .input("Balance", sql.Int, 0)
        .query("INSERT INTO Users VALUES (@UserID, @Username, @Password, @Email, @Role, @Balance)");
        return User.rowsAffected[0];
    }
}