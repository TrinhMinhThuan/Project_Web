const sql = require("mssql");

const databaseConnection = require('../utils/database');

module.exports = class Orders {
    constructor(OrderID, UserID, OrderDate, TotalAmount) {
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


    static async create(UserID, TotalAmount) {

        const currentDate = new Date();
        currentDate.setHours(currentDate.getHours()+7);
        let pool = await sql.connect(databaseConnection);

        let id = await this.getIDInLastRow();
        if (id != undefined) {
            id += 1;
        }
        else {
            id = 1;
        }


        let Order = await pool
            .request()
            .input("OrderId", sql.Int, id)
            .input("UserID", sql.Int, UserID)
            .input("OrderDate", sql.DateTime, currentDate)
            .input("TotalAmount", sql.Int, TotalAmount)
            .query("INSERT INTO Orders VALUES (@OrderID, @UserID, @OrderDate, @TotalAmount)");
        return id;

    }
    static async getByUserID(UserID) {
        let pool = await sql.connect(databaseConnection);
        let Orders = await pool.request()
            .input('userID', sql.Int, UserID)
            .query(`SELECT * FROM Orders WHERE UserID = @userID ORDER BY OrderDate DESC, OrderID DESC`);
        return Orders.recordset;
    }
    static async getByUserID_Page(UserID, page, limit) {
        let pool = await sql.connect(databaseConnection);
        let Orders = await pool.request()
            .input('userID', sql.Int, UserID)
            .input("Offset", sql.Int, (page - 1) * limit)
            .input("Limit", sql.Int, limit)
            .query(`SELECT * , count(*) over() as Total  FROM Orders WHERE UserID = @userID ORDER BY OrderDate DESC, OrderID DESC
                OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY`);
        return Orders.recordset;
    }

    // Dữ liệu Thống kê doanh thu cho admin
    static async getStatisticalData(yearYear, yearMonth) {
        let check;
        let pool = await sql.connect(databaseConnection);
        // Thống kê theo các tháng
        if (yearYear == undefined) {
            check = await pool.request()
                .input("year", sql.Int, yearMonth)
                .query(`SELECT
            MONTH(OrderDate) AS Month,
            SUM(TotalAmount) AS TotalPrice
                FROM
                    orders
                WHERE
                    Year(OrderDate) = @year
                GROUP BY
                    MONTH(OrderDate)
                ORDER BY
                    MONTH(OrderDate);`
                );
        }// Thống kê theo các năm
        else {
            check = await pool.request()
                .input("year", sql.Int, yearYear)
                .query(`SELECT
                YEAR(OrderDate) AS Year,
                SUM(TotalAmount) AS TotalPrice
                    FROM
                        orders
                    WHERE
                        YEAR(OrderDate) >= @year
                    GROUP BY
                        YEAR(OrderDate)
                    ORDER BY
                        YEAR(OrderDate);`
                );
        }
        return check.recordset;
    }

}