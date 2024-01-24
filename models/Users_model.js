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
    static async getUserByGoogleID(GoogleID) {
        let pool = await sql.connect(databaseConnection);
        let user = await pool
            .request()
            .input("GoogleID", sql.NVarChar, GoogleID)
            .query("SELECT * FROM Users WHERE GoogleID = @GoogleID");
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
        .input("GoogleID", sql.NVarChar, user.GoogleID)
        .input("Username", sql.NVarChar, user.Username)
        .input("GoogleName", sql.NVarChar, user.GoogleName)
        .input("Password", sql.NVarChar, user.Password)
        .input("Email", sql.NVarChar, user.Email)
        .input("Role", sql.NVarChar, 'Client')
        .input("Balance", sql.Int, 0)
        .query("INSERT INTO Users VALUES (@UserID, @GoogleID, @Username, @GoogleName, @Password, @Email, @Role, @Balance)");
        return User.rowsAffected[0];
    } 
    static async updateBalanceById(ID, Balance) {
        let pool = await sql.connect(databaseConnection);
        let update = await pool
            .request()
            .input("ID", sql.Int, ID)
            .input("Balance", sql.Int, Balance)
            .query(
                "UPDATE Users SET Balance = Balance + @Balance WHERE UserID = @ID "
            );
        return update.recordset;
    }

    static async searchUser(options) {
        let pool = await sql.connect(databaseConnection);

        if(options.Keyword === "") {
            let users = await pool
                .request()
                .input("AdminID", sql.Int, options.AdminID)
                .input("Offset", sql.Int, (options.Page - 1) * options.Limit)
                .input("Limit", sql.Int, options.Limit)
                .query(
                    `SELECT * , count(*) over() as Total FROM Users 
                    WHERE UserID != @AdminID
                    ORDER BY UserID
                    OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY `
                );

            return users.recordset;
         }
         else {
            let users = await pool
                .request()
                .input("AdminID", sql.Int, options.AdminID)
                .input("KeywordName", sql.NVarChar, `%${options.Keyword}%`)
                .input("KeywordID", sql.NVarChar, `${options.Keyword}`)
                .input("Offset", sql.Int, (options.Page - 1) * options.Limit)
                .input("Limit", sql.Int, options.Limit)
                .query(
                    `SELECT * , count(*) over() as Total FROM Users
                    WHERE (UserID != @AdminID) AND (Username LIKE @KeywordName OR UserID LIKE @KeywordID)
                    ORDER BY UserID
                    OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY `
                );

            return users.recordset;
        }

        // let users = await pool
        //     .request()
        //     .input("Role", sql.NVarChar, options.role)
        //     .query("SELECT * FROM Users WHERE Role = @Role");
        // return users.recordset;
    }

    static async updateBalanceById(ID, Balance) {
        let pool = await sql.connect(databaseConnection);
        let update = await pool
            .request()
            .input("ID", sql.Int, ID)
            .input("Balance", sql.Int, Balance)
            .query(
                "UPDATE Users SET Balance = Balance + @Balance WHERE UserID = @ID "
            );
        return update.recordset;
    }

    static async getAdminUser()
    {
        let pool = await sql.connect(databaseConnection);
        let user = await pool
            .request()
            .query("SELECT TOP(1) * FROM Users WHERE Role like '%Admin%'");
        return user.recordset[0];
    }
    static async setBalanceByUserID(UserID, Balance)
    {
        let pool = await sql.connect(databaseConnection);
        let user = await pool
            .request()
            .input('Balance', sql.Int, Balance)
            .input('ID', sql.Int, UserID)
            .query("update Users set Balance = @Balance WHERE UserID = @ID");
        return user.rowsAffected[0];
    }
    
    static async deleteUser(userID){
        let pool = await sql.connect(databaseConnection);
        let row = await pool
            .request()
            .input('UserID', sql.Int, userID)
            .query('DELETE FROM Users WHERE UserID = @UserID');

        return row.recordset;
    }

    // static async addUser(user){
    //     let pool = await sql.connect(databaseConnection);
    //     let add = await pool
    //         .request()
    //         .input('UserID', sql.Int, user.ID)
    //         .input('categoryName', sql.NVarChar, `${Category.Name}`)
    //         .query('INSERT INTO Categories (CategoryID, CategoryName, CategoryQuantity) VALUES (@categoryId, @categoryName, 0);');
    //     if (add.rowsAffected[0] > 0) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    static async editUser(input) {
        let pool = await sql.connect(databaseConnection);

        let update = await pool
            .request()
            .input('oldID', sql.Int, input.userID)
            .input('UserID', sql.Int, input._userID)
            .input('Username', sql.NVarChar, input._username)
            .input('Password', sql.NVarChar, input._password)
            .input('Email', sql.NVarChar, input._email)
            .input('Balance', sql.Int, input._balance)
            .query(`UPDATE Users SET UserID=@UserID,
                                     Username=@Username,
                                     Password=@Password,
                                     Email=@Email,
                                     Balance=@Balance
                            WHERE UserID = @oldID`);

        return update.rowsAffected[0];
    }
}