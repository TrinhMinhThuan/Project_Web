const sql = require("mssql");

const databaseConnection = require('../utils/database');

module.exports = class Orders
{
    constructor(OrderDetailID,  OrderID, ProductID, Quantity, Price)
    {
        this.OrderDetailID = OrderDetailID;
        this.OrderID = OrderID;
        this.ProductID = ProductID;
        this.Quantity = Quantity;
        this.Price = Price;
    }
    static async getIDInLastRow() {
        let pool = await sql.connect(databaseConnection);
        let row = await pool
            .request()
            .query("SELECT TOP(1) * FROM Order_Detail ORDER BY OrderDetailID DESC");
        return row.recordset[0].OrderDetailID;
    }
    
    
    static async create(OrderID, ProductID, Quantity, Price)
    {
        let pool = await sql.connect(databaseConnection);

        let id = await this.getIDInLastRow();
        if (id != undefined)
        {
            id += 1;
        }
        else
        {
            id = 1;
        }
        let OrderDetail = await pool
            .request()
            .input("OrderDetailId", sql.Int, id)
            .input("OrderID", sql.Int, OrderID)
            .input("ProductID", sql.Int, ProductID)
            .input("Quantity", sql.Int, Quantity)
            .input("Price", sql.Int, Price)
            .query("INSERT INTO Order_Detail VALUES (@OrderDetailID, @OrderID, @ProductID, @Quantity, @Price)");
        return OrderDetail.rowsAffected[0];
    }


    static async getByOrderID(orderID)
    {
        let pool = await sql.connect(databaseConnection);
        let user = await pool
            .request()
            .input("ID", sql.Int, orderID)
            .query("SELECT * FROM Order_Detail WHERE OrderID = @ID");
        return user.recordset;
    }

    static async getByOrderID_Page(orderID, page, limit)
    {
        let pool = await sql.connect(databaseConnection);
        let user = await pool
            .request()
            .input("ID", sql.Int, orderID)
            .input("Offset", sql.Int,page - 1 )
            .input("Limit", sql.Int,limit )
            .query(`SELECT * , count(*) over() as Total FROM Order_Detail WHERE OrderID = @ID ORDER BY OrderDetailID
            OFFSET @Offset ROWS FETCH NEXT @Limit ROWS ONLY`);
        return user.recordset;
    }

    // Dữ liệu thống kê sản phẩm bán ra cho khách hàng
    static async getStatisticalData_client(month, year){
        let check;
        let pool = await sql.connect(databaseConnection);
        if (month == undefined) {
            check = await pool.request()
                .input("year", sql.Int, year)
                .query(`select B.ProductName, A.Total
                    from (
                    select order_detail.ProductID, sum(order_detail.quantity) as total from orders join order_detail on orders.orderID = order_detail.OrderID 
                    where Year(orders.OrderDate) = @year
                        GROUP BY order_detail.ProductID
                    )A join Products B on A.productID = B.productID`
                );
        }
        else {
            check = await pool.request()
                .input("month", sql.Int, month)
                .input("year", sql.Int, year)
                .query(`select B.ProductName, A.Total
                    from (
                    select order_detail.ProductID, sum(order_detail.quantity) as total from orders join order_detail on orders.orderID = order_detail.OrderID 
                    where Month(orders.OrderDate) = @month and Year(orders.OrderDate) = @year
                        GROUP BY order_detail.ProductID
                    )A join Products B on A.productID = B.productID`
                );
        }

        return check.recordset;
    }

}