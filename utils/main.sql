
USE [master]
GO
/****** Object:  Database [Project_Web]    Script Date: 1/27/2024 8:48:33 AM ******/
CREATE DATABASE [Project_Web]
 CONTAINMENT = NONE
GO
ALTER DATABASE [Project_Web] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Project_Web].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Project_Web] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Project_Web] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Project_Web] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Project_Web] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Project_Web] SET ARITHABORT OFF 
GO
ALTER DATABASE [Project_Web] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [Project_Web] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Project_Web] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Project_Web] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Project_Web] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Project_Web] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Project_Web] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Project_Web] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Project_Web] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Project_Web] SET  DISABLE_BROKER 
GO
ALTER DATABASE [Project_Web] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Project_Web] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Project_Web] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Project_Web] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Project_Web] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Project_Web] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Project_Web] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Project_Web] SET RECOVERY FULL 
GO
ALTER DATABASE [Project_Web] SET  MULTI_USER 
GO
ALTER DATABASE [Project_Web] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Project_Web] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Project_Web] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Project_Web] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [Project_Web] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [Project_Web] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [Project_Web] SET QUERY_STORE = ON
GO
ALTER DATABASE [Project_Web] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [Project_Web]
GO
/****** Object:  Table [dbo].[Carts]    Script Date: 1/27/2024 8:48:34 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Carts](
	[CartID] [int] NULL,
	[UserID] [int] NULL,
	[ProductID] [int] NULL,
	[Quantity] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Categories]    Script Date: 1/27/2024 8:48:34 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Categories](
	[CategoryID] [int] NULL,
	[CategoryName] [nvarchar](200) NULL,
	[CategoryQuantity] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Order_Detail]    Script Date: 1/27/2024 8:48:34 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Order_Detail](
	[OrderDetailID] [int] NULL,
	[OrderID] [int] NULL,
	[ProductID] [int] NULL,
	[Quantity] [int] NULL,
	[Price] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Orders]    Script Date: 1/27/2024 8:48:34 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Orders](
	[OrderID] [int] NULL,
	[UserID] [int] NULL,
	[OrderDate] [datetime] NULL,
	[TotalAmount] [int] NULL,
	[Status] [nvarchar](50) NULL

) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PaymentAccount]    Script Date: 1/27/2024 8:48:34 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/****** Object:  Table [dbo].[Products]    Script Date: 1/27/2024 8:48:34 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Products](
	[ProductID] [int] NULL,
	[ProductName] [nvarchar](200) NULL,
	[CategoryID] [int] NULL,
	[StockQuantity] [int] NULL,
	[Author] [nvarchar](200) NULL,
	[PublishedYear] [int] NULL,
	[Image] [nvarchar](200) NULL,
	[Price] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TopUp]    Script Date: 1/27/2024 8:48:34 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TopUp](
	[TopUpID] [int] NULL,
	[UserID] [int] NULL,
	[Amount] [int] NULL,
	[TopUpDay] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 1/27/2024 8:48:34 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[UserID] [int] NULL,
	[GoogleID] [nvarchar](200) NULL,
	[Username] [nvarchar](200) NULL,
	[GoogleName] [nvarchar](200) NULL,
	[Password] [nvarchar](300) NULL,
	[Email] [nvarchar](50) NULL,
	[Role] [nvarchar](50) NULL
) ON [PRIMARY]
GO
INSERT [dbo].[Carts] ([CartID], [UserID], [ProductID], [Quantity]) VALUES (1, 2, 2, 2)
INSERT [dbo].[Carts] ([CartID], [UserID], [ProductID], [Quantity]) VALUES (2, 3, 4, 1)
INSERT [dbo].[Carts] ([CartID], [UserID], [ProductID], [Quantity]) VALUES (3, 2, 50, 3)
INSERT [dbo].[Carts] ([CartID], [UserID], [ProductID], [Quantity]) VALUES (4, 2, 37, 2)
INSERT [dbo].[Carts] ([CartID], [UserID], [ProductID], [Quantity]) VALUES (5, 4, 4, 1)
INSERT [dbo].[Carts] ([CartID], [UserID], [ProductID], [Quantity]) VALUES (6, 5, 5, 3)
INSERT [dbo].[Carts] ([CartID], [UserID], [ProductID], [Quantity]) VALUES (7, 6, 44, 2)
INSERT [dbo].[Carts] ([CartID], [UserID], [ProductID], [Quantity]) VALUES (8, 6, 1, 1)
GO
INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [CategoryQuantity]) VALUES (1, N'Tiểu thuyết', 10)
INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [CategoryQuantity]) VALUES (2, N'Nấu ăn và ẩm thực', 10)
INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [CategoryQuantity]) VALUES (3, N'Khoa học và thiên văn', 10)
INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [CategoryQuantity]) VALUES (4, N'Kinh doanh', 10)
INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [CategoryQuantity]) VALUES (5, N'Tự truyện', 10)
INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [CategoryQuantity]) VALUES (6, N'Phiêu lưu', 10)
INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [CategoryQuantity]) VALUES (7, N'Hài hước', 10)

GO
INSERT [dbo].[Order_Detail] ([OrderDetailID], [OrderID], [ProductID], [Quantity], [Price]) VALUES (1, 1, 2, 2, 273600)
INSERT [dbo].[Order_Detail] ([OrderDetailID], [OrderID], [ProductID], [Quantity], [Price]) VALUES (2, 1, 5, 1, 224000)

INSERT [dbo].[Order_Detail] ([OrderDetailID], [OrderID], [ProductID], [Quantity], [Price]) VALUES (3, 2, 10, 1, 374400)
INSERT [dbo].[Order_Detail] ([OrderDetailID], [OrderID], [ProductID], [Quantity], [Price]) VALUES (4, 3, 19, 3, 363000)
INSERT [dbo].[Order_Detail] ([OrderDetailID], [OrderID], [ProductID], [Quantity], [Price]) VALUES (5, 4, 23, 1, 107900)
INSERT [dbo].[Order_Detail] ([OrderDetailID], [OrderID], [ProductID], [Quantity], [Price]) VALUES (6, 5, 40, 2, 346000)
INSERT [dbo].[Order_Detail] ([OrderDetailID], [OrderID], [ProductID], [Quantity], [Price]) VALUES (7, 6, 50, 1, 161100)
INSERT [dbo].[Order_Detail] ([OrderDetailID], [OrderID], [ProductID], [Quantity], [Price]) VALUES (8, 7, 59, 3, 507450)
INSERT [dbo].[Order_Detail] ([OrderDetailID], [OrderID], [ProductID], [Quantity], [Price]) VALUES (9, 8, 63, 1, 52000)
INSERT [dbo].[Order_Detail] ([OrderDetailID], [OrderID], [ProductID], [Quantity], [Price]) VALUES (10,9, 29, 2, 110000)
INSERT [dbo].[Order_Detail] ([OrderDetailID], [OrderID], [ProductID], [Quantity], [Price]) VALUES (11,10, 3, 1, 246000)

INSERT [dbo].[Order_Detail] ([OrderDetailID], [OrderID], [ProductID], [Quantity], [Price]) VALUES (12,11, 60, 1, 180000)
INSERT [dbo].[Order_Detail] ([OrderDetailID], [OrderID], [ProductID], [Quantity], [Price]) VALUES (13,12, 16, 2, 137200)
INSERT [dbo].[Order_Detail] ([OrderDetailID], [OrderID], [ProductID], [Quantity], [Price]) VALUES (14,13, 29, 1, 55000)
INSERT [dbo].[Order_Detail] ([OrderDetailID], [OrderID], [ProductID], [Quantity], [Price]) VALUES (15,14, 51, 1, 234000)

INSERT [dbo].[Order_Detail] ([OrderDetailID], [OrderID], [ProductID], [Quantity], [Price]) VALUES (16, 15, 2, 2, 273600)
INSERT [dbo].[Order_Detail] ([OrderDetailID], [OrderID], [ProductID], [Quantity], [Price]) VALUES (17, 15, 50, 3, 483300)
INSERT [dbo].[Order_Detail] ([OrderDetailID], [OrderID], [ProductID], [Quantity], [Price]) VALUES (18, 15, 37, 2, 268500)
INSERT [dbo].[Order_Detail] ([OrderDetailID], [OrderID], [ProductID], [Quantity], [Price]) VALUES (19, 16, 3, 2, 492000)
INSERT [dbo].[Order_Detail] ([OrderDetailID], [OrderID], [ProductID], [Quantity], [Price]) VALUES (20, 16, 4, 1, 514000)
INSERT [dbo].[Order_Detail] ([OrderDetailID], [OrderID], [ProductID], [Quantity], [Price]) VALUES (21, 17, 53, 2, 1124800)
INSERT [dbo].[Order_Detail] ([OrderDetailID], [OrderID], [ProductID], [Quantity], [Price]) VALUES (22, 17, 38, 1, 124900)

GO
INSERT [dbo].[Orders] ([OrderID], [UserID], [OrderDate], [TotalAmount], [Status]) VALUES (1, 2,  CAST(N'2022-03-15T14:00:00.000' AS DateTime), 497600, N'Success')
INSERT [dbo].[Orders] ([OrderID], [UserID], [OrderDate], [TotalAmount], [Status]) VALUES (2, 3,  CAST(N'2022-09-25T15:00:22.000' AS DateTime), 374400, N'Success' )
INSERT [dbo].[Orders] ([OrderID], [UserID], [OrderDate], [TotalAmount], [Status]) VALUES (3, 4,  CAST(N'2022-12-23T17:00:00.000' AS DateTime), 363000, N'Success')
INSERT [dbo].[Orders] ([OrderID], [UserID], [OrderDate], [TotalAmount], [Status]) VALUES (4, 5,  CAST(N'2022-12-27T19:00:49.000' AS DateTime), 107900, N'Success')
INSERT [dbo].[Orders] ([OrderID], [UserID], [OrderDate], [TotalAmount], [Status]) VALUES (5, 6,  CAST(N'2023-03-02T12:00:00.000' AS DateTime), 346000, N'Success')
INSERT [dbo].[Orders] ([OrderID], [UserID], [OrderDate], [TotalAmount], [Status]) VALUES (6, 2,  CAST(N'2023-05-10T13:30:51.000' AS DateTime), 161100, N'Success')
INSERT [dbo].[Orders] ([OrderID], [UserID], [OrderDate], [TotalAmount], [Status]) VALUES (7, 3,  CAST(N'2023-07-17T18:10:00.000' AS DateTime), 507450, N'Success')
INSERT [dbo].[Orders] ([OrderID], [UserID], [OrderDate], [TotalAmount], [Status]) VALUES (8, 4,  CAST(N'2023-09-27T17:35:13.000' AS DateTime), 52000, N'Success')
INSERT [dbo].[Orders] ([OrderID], [UserID], [OrderDate], [TotalAmount], [Status]) VALUES (9, 5,  CAST(N'2023-12-16T17:00:59.000' AS DateTime), 110000, N'Success')
INSERT [dbo].[Orders] ([OrderID], [UserID], [OrderDate], [TotalAmount], [Status]) VALUES (10, 6, CAST(N'2024-01-10T13:45:22.000' AS DateTime), 246000, N'Success')
INSERT [dbo].[Orders] ([OrderID], [UserID], [OrderDate], [TotalAmount], [Status]) VALUES (11, 2, CAST(N'2024-01-15T14:00:00.000' AS DateTime), 180000, N'Success')
INSERT [dbo].[Orders] ([OrderID], [UserID], [OrderDate], [TotalAmount], [Status]) VALUES (12, 2, CAST(N'2024-01-20T06:30:19.000' AS DateTime), 137200, N'Failed')
INSERT [dbo].[Orders] ([OrderID], [UserID], [OrderDate], [TotalAmount], [Status]) VALUES (13, 2, CAST(N'2024-01-25T15:00:23.000' AS DateTime), 55000, N'Success')
INSERT [dbo].[Orders] ([OrderID], [UserID], [OrderDate], [TotalAmount], [Status]) VALUES (14, 2, CAST(N'2024-01-27T13:00:35.000' AS DateTime), 234000, N'Success')
INSERT [dbo].[Orders] ([OrderID], [UserID], [OrderDate], [TotalAmount], [Status]) VALUES (15, 2, CAST(N'2024-01-27T13:56:29.027' AS DateTime), 1025400, N'Failed')
INSERT [dbo].[Orders] ([OrderID], [UserID], [OrderDate], [TotalAmount], [Status]) VALUES (16, 2, CAST(N'2024-01-28T07:59:13.967' AS DateTime), 1006000, N'Success')
INSERT [dbo].[Orders] ([OrderID], [UserID], [OrderDate], [TotalAmount], [Status]) VALUES (17, 6, CAST(N'2024-01-28T08:45:47.633' AS DateTime), 1249700, N'Failed')
GO

INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (1, N'Nhà giả kim', 1, 11, N'Paulo Coelho', 1988, N'Image01.jpg', 64000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (2, N'The Diary of a Young Girl', 5, 10, N'Anne Frank', 1947, N'Image02.jpg', 136800)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (3, N'So That Happened', 7, 8, N'Katie Bailey', 2022, N'Image03.jpg', 246000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (4, N'The Hidden Life of Trees', 3, 9, N'Peter Wohlleben', 2015, N'Image04.jpg', 514000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (5, N'Norwegian Wood', 1, 6, N'Haruki Murakami', 1989, N'Image05.jpg', 224000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (6, N'Vietnamese made easy', 2, 21, N'Phạm Thúy Diễm', 2023, N'Image06.jpg', 1055000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (7, N'Đất rừng phương Nam', 6, 9, N'Đoàn Giỏi', 2010, N'Image07.jpg', 162000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (8, N'A Promised Land', 5, 10, N'Barack Obama', 2020, N'Image08.jpg', 459000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (9, N'Khám phá ẩm thực truyền thống Việt Nam ', 2, 20, N'Ngô Đức Thịnh', 2010, N'Image09.jpg', 142800)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (10, N'Becoming', 5, 16, N'Michelle Obama', 2018, N'Image10.jpg', 374400)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (11, N'Colorful', 1, 20, N'Eto Mori', 1998, N'Image11.jpg', 80000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (12, N'Thinking, Fast and Slow', 4, 5, N'Daniel Kahneman', 2011, N'Image12.jpg', 165000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (13, N'Harry Potter and the Sorcerer’s Stone', 1, 10, N'J.K. Rowling', 1997, N'Image13.jpg', 120000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (14, N'The Omnivore''s Dilemma', 2, 21, N'Michael Pollan', 2006, N'Image14.jpg', 39000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (15, N'The Lean Startup', 4, 14, N'Eric Ries', 2011, N'Image15.jpg', 98000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (16, N'Đắc nhân tâm', 4, 12, N'Dale Carnegie', 1936, N'Image16.jpg', 68600)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (17, N'Sapiens: A Brief History of Humankind', 3, 13, N'Yuval Noah Harari', 2014, N'Image17.jpg', 169000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (18, N'The Glass Castle', 5, 15, N'Jeannette Walls', 2005, N'Image18.jpg', 43600)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (19, N'Educated', 5, 19, N'Tara Westover', 2018, N'Image19.jpg', 121000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (20, N'Ngày xưa có một chuyện tình', 1, 20, N'Nguyễn Nhật Ánh', 2016, N'Image20.jpg', 74000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (21, N'Steve Jobs', 5, 23, N'Walter Isaacson', 2011, N'Image21.jpg', 299000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (22, N'Zero to One', 4, 14, N'Peter Thiel', 2014, N'Image22.jpg', 79000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (23, N'Tâm huyết trao đời', 5, 16, N'Nguyễn Ngọc Ký', 2017, N'Image23.jpg', 107900)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (24, N'Astrophysics for Young People in a Hurry', 3, 10, N'Neil deGrasse Tyson', 2019, N'Image24.jpg', 564000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (25, N'A Brief History of Time', 3, 25, N'Stephen Hawking', 1988, N'Image25.jpg', 245090)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (26, N'My Life in France', 2, 12, N'Julia Child', 2006, N'Image26.jpg', 55200)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (27, N'The Gene: An Intimate History', 3, 16, N'Siddhartha Mukherjee', 2016, N'Image27.jpg', 1095495)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (28, N'Start with Why', 4, 17, N'Simon Sinek', 2009, N'Image28.jpg', 195000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (29, N'Tôi là Bêtô', 1, 20, N'Đỗ Bảo', 2007, N'Image29.jpg', 55000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (30, N'The Wright Brothers', 5, 23, N'David McCullough', 2015, N'Image30.jpg', 116000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (31, N'To Kill a Mockingbird', 1, 21, N'Harper Lee', 1930, N'Image31.jpg', 124000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (32, N'The 4-Hour Workweek', 4, 24, N'Timothy Ferriss', 2007, N'Image32.jpg', 622000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (33, N'Món ăn ngon mỗi ngày', 2, 25, N'NXB Hồng Đức', 2023, N'Image33.jpg', 65000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (34, N'The Sixth Extinction', 3, 26, N'Elizabeth Kolbert', 2014, N'Image34.jpg', 127000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (35, N'The Kite Runner', 1, 28, N'Khaled Hosseini', 2003, N'Image35.jpg', 179000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (36, N'Rich Dad Poor Dad', 4, 20, N'Robert T. Kiyosaki', 1997, N'Image36.jpg', 25000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (37, N'Cosmos', 3, 20, N'Carl Sagan', 1980, N'Image37.jpg', 134250)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (38, N'The Food Lab', 2, 15, N'J. Kenji Lopez-Alt', 2015, N'Image38.jpg', 124900)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (39, N'The Immortal Life of Henrietta Lacks', 5, 22, N'Rebecca Skloot', 2010, N'Image39.jpg', 215200)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (40, N'The Old Man and the Sea', 1, 30, N'Ernest Hemingway', 1952, N'Image40.jpg', 173000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (41, N'The Millionaire Next Door', 4, 22, N'Thomas J. Stanley', 1996, N'Image41.jpg', 72740)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (42, N'Salt, Fat, Acid, Heat', 2, 20, N'Samin Nosrat', 2017, N'Image42.jpg', 408000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (43, N'The Selfish Gene', 3, 15, N'Richard Dawkins', 1976, N'Image43.jpg', 330000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (44, N'Đường Ra Biển Lớn', 5, 16, N'Richard Branson', 1998, N'Image44.jpg', 201000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (45, N'The Joy of Cooking', 2, 13, N'Irma S. Rombauer', 1931, N'Image45.jpg', 380000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (46, N'How to Win Friends and Influence People', 4, 5, N'Dale Carnegie', 1936, N'Image46.jpg', 188100)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (47, N'The Great Gatsby', 3, 13, N'F. Scott Fitzgerald', 1925, N'Image47.jpg', 188100)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (48, N'How to Cook Everything', 2, 8, N'Mark Bittman', 1998, N'Image48.jpg', 286000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (49, N'The Alchemist', 1, 9, N'Paulo Coelho', 1988, N'Image49.jpg', 192850)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (50, N'Silent Spring', 3, 10, N'Rachel Carson', 1962, N'Image50.jpg', 161100)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (51, N'Robinson Crusoe', 6, 10, N'Daniel Defoe', 1719, N'Image51.jpg', 234000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (52, N'Cuộc phiêu lưu của Huckleberry Finn', 6, 12, N'Mark Twain', 1884, N'Image52.jpg', 88200)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (53, N'Người Hobbit', 6, 10, N'J.R.R. Tolkien', 1937, N'Image53.jpg', 562400)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (54, N'Cuộc phiêu lưu của Alice trong Wonderland', 6, 10, N'Lewis Carroll', 1865, N'Image54.jpg', 161100)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (55, N'Cuộc phiêu lưu của Tom Sawyer', 6, 9, N'Mark Twain', 1876, N'Image55.jpg', 72000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (56, N'Cuộc phiêu lưu của Sherlock Holmes', 6, 11, N'Arthur Conan Doyle', 1892, N'Image56.jpg', 63200)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (57, N'Đảo giấu vàng', 6, 10, N'Robert Louis Stevenson', 1883, N'Image57.jpg', 60000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (58, N'Cuộc phiêu lưu của Don Quixote', 6, 12, N'Miguel de Cervantes', 1615, N'Image58.jpg', 749000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (59, N'Cuộc phiêu lưu của David Copperfield', 6, 10, N'Charles Dickens', 1850, N'Image59.jpg', 169150)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (60, N'The Intelligent Investor', 4, 15, N'Benjamin Graham', 1949, N'Image60.jpg', 180000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (61, N'Bẫy-22', 7, 13, N'Josheph Heller', 1961, N'Image61.jpg', 129600)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (62, N'Chuyện kể rằng có nàng và tôi', 7, 10, N'Nhiều tác giả', 1900, N'Image62.jpg', 49000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (63, N'Dinh dưỡng theo độ tuổi', 2, 15, N'Lisa Hark,Ph.D & Dr.Darwin Deen ', 2015, N'Image63.jpg', 52000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (64, N'Still Laughing: A Life in Comedy', 7, 10, N'George Schlatter, Jon Macks, Lily Tomlin', 1926, N'Image64.jpg', 588000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (65, N'The comedians', 7, 8, N'Kliph Nesteroff', 1940, N'Image65.jpg', 250000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (66, N'Me Talk Pretty One Day', 7, 11, N'David Sedaris', 2000, N'Image66.jpg', 251790)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (67, N'Poking A Dead Frog', 7, 12, N'Mike Sacks', 2014, N'Image67.jpg', 188790)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (68, N'Cruel Shoes', 7, 14, N' Steve Martin', 1977, N'Image68.jpg', 749000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (69, N'Bossypants', 7, 9, N'Tiny Fey', 2011, N'Image69.jpg', 294000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (70, N'Born a Crime', 7, 13, N'Trevor Noah', 2016, N'Image70.jpg', 314790)
GO

INSERT [dbo].[Users] ([UserID], [GoogleID], [Username], [GoogleName], [Password], [Email], [Role]) VALUES (1, NULL, N'admin', NULL, N'$2b$13$qifQHJCc4vWLL5eGeMxNGuFsYQ0De8/jQGrNfyWyQhqbQmxELlmcW', N'admin@gmail.com', N'Admin')
INSERT [dbo].[Users] ([UserID], [GoogleID], [Username], [GoogleName], [Password], [Email], [Role]) VALUES (2, NULL, N'client', NULL, N'$2b$13$dll5R6KoJozfEfk2ZDpBD.K.htZ/sOcDIrx2tUohe1aqyXieTpJhq', N'client1@gmail.com', N'Client')
INSERT [dbo].[Users] ([UserID], [GoogleID], [Username], [GoogleName], [Password], [Email], [Role]) VALUES (3, NULL, N'client3', NULL, N'$2b$13$dll5R6KoJozfEfk2ZDpBD.K.htZ/sOcDIrx2tUohe1aqyXieTpJhq', N'client3@gmail.com', N'Client')
INSERT [dbo].[Users] ([UserID], [GoogleID], [Username], [GoogleName], [Password], [Email], [Role]) VALUES (4, NULL, N'client4', NULL, N'$2b$13$dll5R6KoJozfEfk2ZDpBD.K.htZ/sOcDIrx2tUohe1aqyXieTpJhq', N'client4@gmail.com', N'Client')
INSERT [dbo].[Users] ([UserID], [GoogleID], [Username], [GoogleName], [Password], [Email], [Role]) VALUES (5, NULL, N'client5', NULL, N'$2b$13$dll5R6KoJozfEfk2ZDpBD.K.htZ/sOcDIrx2tUohe1aqyXieTpJhq', N'client5@gmail.com', N'Client')
INSERT [dbo].[Users] ([UserID], [GoogleID], [Username], [GoogleName], [Password], [Email], [Role]) VALUES (6, N'107013155325234336476', NULL, N'Thien Le', NULL, N'lethanhthien059@gmail.com', N'Client')
GO

INSERT [dbo].[TopUp] ([TopUpID], [UserID], [Amount], [TopUpDay]) VALUES (1, 2, 2000000, CAST(N'2022-05-22T07:20:59.350' AS DateTime))
INSERT [dbo].[TopUp] ([TopUpID], [UserID], [Amount], [TopUpDay]) VALUES (2, 6, 592000, CAST(N'2023-02-24T01:10:39.350' AS DateTime))
INSERT [dbo].[TopUp] ([TopUpID], [UserID], [Amount], [TopUpDay]) VALUES (3, 2, 100000, CAST(N'2023-07-29T07:53:59.350' AS DateTime))
INSERT [dbo].[TopUp] ([TopUpID], [UserID], [Amount], [TopUpDay]) VALUES (4, 3, 500000, CAST(N'2023-09-08T07:19:59.350' AS DateTime))
INSERT [dbo].[TopUp] ([TopUpID], [UserID], [Amount], [TopUpDay]) VALUES (5, 4, 500000, CAST(N'2023-12-19T08:29:00.350' AS DateTime))
INSERT [dbo].[TopUp] ([TopUpID], [UserID], [Amount], [TopUpDay]) VALUES (6, 5, 500000, CAST(N'2023-05-10T03:59:59.350' AS DateTime))
INSERT [dbo].[TopUp] ([TopUpID], [UserID], [Amount], [TopUpDay]) VALUES (7, 6, 500000, CAST(N'2024-01-23T07:29:50.350' AS DateTime))
INSERT [dbo].[TopUp] ([TopUpID], [UserID], [Amount], [TopUpDay]) VALUES (8, 3, 500000, CAST(N'2024-01-25T03:19:46.350' AS DateTime))
INSERT [dbo].[TopUp] ([TopUpID], [UserID], [Amount], [TopUpDay]) VALUES (8, 2, 800000, CAST(N'2024-01-28T00:21:41.350' AS DateTime))


GO
USE [master]
GO
ALTER DATABASE [Project_Web] SET  READ_WRITE  
GO
