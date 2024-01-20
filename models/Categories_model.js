const sql = require("mssql");

const databaseConnection = require('../utils/database');

module.exports = class Users 
{
    constructor(CategoryID, CategoryName, CategoryQuantity)
    {
        this.CategoryID =CategoryID;
        this.CategoryName = CategoryName; 
        this.CategoryQuantity = CategoryQuantity;
    }
    static async getAll()
    {
        let pool = await sql.connect(databaseConnection);
        let Categories = await pool.request().query("SELECT * FROM Categories");
        return Categories.recordset;
    }
    static async search(options)
    {
        let pool = await sql.connect(databaseConnection);
        if(options.Keyword == ""){
           let Categories = await pool.request()
          .input("Offset", sql.Int, (options.Page - 1) * options.Limit)
          .input("Limit", sql.Int, options.Limit)
          .query(
            `SELECT * , count(*) over() as Total  FROM Categories  
            ORDER BY CategoryID
            OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY `
          );
          return Categories.recordsets[0];
        }
        else{
            let Categories = await pool.request()
            .input("Keyword", sql.NVarChar, `%${options.Keyword}%`)
            .input("Offset", sql.Int, (options.Page - 1) * options.Limit)
            .input("Limit", sql.Int, options.Limit)
            .query(
                `SELECT * , count(*) over() as Total  FROM Categories WHERE CategoryName LIKE @Keyword 
                ORDER BY CategoryID
                OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY `
            );
           return Categories.recordsets[0];
        }
    }
    static async delete(categoryId){
        let pool = await sql.connect(databaseConnection);
        let deletee = await pool.request()
        .input('categoryId', sql.Int, categoryId)
        .query('DELETE FROM Categories WHERE CategoryID = @categoryId');
    }
}