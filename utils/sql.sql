USE [master]
GO
/****** Object:  Database [Project_Web]    Script Date: 1/21/2024 9:30:29 PM ******/
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
/****** Object:  Table [dbo].[Carts]    Script Date: 1/21/2024 9:30:29 PM ******/
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
/****** Object:  Table [dbo].[Categories]    Script Date: 1/21/2024 9:30:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Categories](
	[CategoryID] [int] NULL,
	[CategoryName] [nvarchar](50) NULL,
	[CategoryQuantity] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Order_Detail]    Script Date: 1/21/2024 9:30:29 PM ******/
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
/****** Object:  Table [dbo].[Orders]    Script Date: 1/21/2024 9:30:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Orders](
	[OrderID] [int] NULL,
	[UserID] [int] NULL,
	[OrderDate] [date] NULL,
	[TotalAmount] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PaymentTransactions]    Script Date: 1/21/2024 9:30:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PaymentTransactions](
	[TransactionID] [int] NULL,
	[SenderAccountID] [int] NULL,
	[ReceiverAccountID] [int] NULL,
	[TransactionAmount] [int] NULL,
	[TransactionDay] [date] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Products]    Script Date: 1/21/2024 9:30:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Products](
	[ProductID] [int] NULL,
	[ProductName] [nvarchar](50) NULL,
	[CategoryID] [int] NULL,
	[StockQuantity] [int] NULL,
	[Author] [nvarchar](50) NULL,
	[PublishedYear] [int] NULL,
	[Image] [nvarchar](50) NULL,
	[Price] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TopUp]    Script Date: 1/21/2024 9:30:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TopUp](
	[TopUpID] [int] NULL,
	[UserID] [int] NULL,
	[Amount] [int] NULL,
	[TopUpDay] [date] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 1/21/2024 9:30:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[UserID] [int] NULL,
	[GoogleID] [nvarchar](200) NULL,
	[Username] [nvarchar](50) NULL,
	[GoogleName] [nvarchar](200) NULL,
	[Password] [nvarchar](300) NULL,
	[Email] [nvarchar](50) NULL,
	[Role] [nvarchar](50) NULL,
	[Balance] [int] NULL
) ON [PRIMARY]
GO
INSERT [dbo].[Carts] ([CartID], [UserID], [ProductID], [Quantity]) VALUES (1, 2, 2, 2)
INSERT [dbo].[Carts] ([CartID], [UserID], [ProductID], [Quantity]) VALUES (2, 3, 4, 1)
INSERT [dbo].[Carts] ([CartID], [UserID], [ProductID], [Quantity]) VALUES (3, 3, 5, 3)
GO
INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [CategoryQuantity]) VALUES (13, N'Kinh dị', 300)
INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [CategoryQuantity]) VALUES (2, N'Nấu ăn và ẩm thực', 10)
INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [CategoryQuantity]) VALUES (3, N'Khoa học và thiên văn', 10)
INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [CategoryQuantity]) VALUES (13, N'Kinh dị', 0)
INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [CategoryQuantity]) VALUES (5, N'Tự truyện', 10)
INSERT [dbo].[Categories] ([CategoryID], [CategoryName], [CategoryQuantity]) VALUES (11, N'Mạng', 0)
GO
INSERT [dbo].[Order_Detail] ([OrderDetailID], [OrderID], [ProductID], [Quantity], [Price]) VALUES (1, 1, 2, 2, 52000)
INSERT [dbo].[Order_Detail] ([OrderDetailID], [OrderID], [ProductID], [Quantity], [Price]) VALUES (2, 2, 3, 1, 25000)
INSERT [dbo].[Order_Detail] ([OrderDetailID], [OrderID], [ProductID], [Quantity], [Price]) VALUES (3, 3, 10, 2, 374400)
INSERT [dbo].[Order_Detail] ([OrderDetailID], [OrderID], [ProductID], [Quantity], [Price]) VALUES (4, 2, 5, 3, 380000)
GO
INSERT [dbo].[Orders] ([OrderID], [UserID], [OrderDate], [TotalAmount]) VALUES (1, 2, CAST(N'2024-10-01' AS Date), 104000)
INSERT [dbo].[Orders] ([OrderID], [UserID], [OrderDate], [TotalAmount]) VALUES (2, 3, CAST(N'2024-01-15' AS Date), 1165000)
INSERT [dbo].[Orders] ([OrderID], [UserID], [OrderDate], [TotalAmount]) VALUES (3, 4, CAST(N'2023-12-25' AS Date), 748800)
GO
INSERT [dbo].[PaymentTransactions] ([TransactionID], [SenderAccountID], [ReceiverAccountID], [TransactionAmount], [TransactionDay]) VALUES (1, 2, 1, 104000, CAST(N'2024-10-01' AS Date))
INSERT [dbo].[PaymentTransactions] ([TransactionID], [SenderAccountID], [ReceiverAccountID], [TransactionAmount], [TransactionDay]) VALUES (2, 3, 1, 1165000, CAST(N'2024-01-15' AS Date))
INSERT [dbo].[PaymentTransactions] ([TransactionID], [SenderAccountID], [ReceiverAccountID], [TransactionAmount], [TransactionDay]) VALUES (3, 4, 1, 748800, CAST(N'2023-12-25' AS Date))
GO
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (1, N'Harry Potter and the Sorcerer’s Stone', 1, 10, N'J.K. Rowling', 1997, N'Image01.jpg', 120000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (2, N'Dinh dưỡng theo độ tuổi', 2, 15, N'Lisa Hark,Ph.D & Dr.Darwin Deen ', 2015, N'Image02.jpg', 52000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (3, N'Rich Dad Poor Dad', 4, 20, N'Robert T. Kiyosaki', 1997, N'Image03.jpg', 25000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (4, N'Astrophysics for Young People in a Hurry', 3, 10, N'Neil deGrasse Tyson', 2019, N'Image04.jpg', 564000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (5, N'The Joy of Cooking', 2, 13, N'Irma S. Rombauer', 1931, N'Image05.jpg', 380000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (6, N'The Intelligent Investor', 4, 15, N'Benjamin Graham', 1949, N'Image06.jpg', 180000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (7, N'The Diary of a Young Girl', 5, 12, N'Anne Frank', 1947, N'Image07.jpg', 136800)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (8, N'Nhà giả kim', 1, 13, N'Paulo Coelho', 1988, N'Image08.jpg', 64000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (9, N'Khám phá ẩm thực truyền thống Việt Nam ', 2, 20, N'Ngô Đức Thịnh', 2010, N'Image09.jpg', 142800)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (10, N'Becoming', 5, 16, N'Michelle Obama', 2018, N'Image10.jpg', 374400)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (11, N'Sapiens: Lược sử Loài Người', 1, 20, N'Yuval Noah Harari', 2011, N'Image11.jpg', 150000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (12, N'Thinking, Fast and Slow', 4, 5, N'Daniel Kahneman', 2011, N'Image12.jpg', 165000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (13, N'The Hidden Life of Trees', 3, 9, N'Peter Wohlleben', 2015, N'Image13.jpg', 514000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (14, N'The Omnivore''s Dilemma', 2, 21, N'Michael Pollan', 2006, N'Image14.jpg', 39000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (15, N'The Lean Startup', 4, 14, N'Eric Ries', 2011, N'Image15.jpg', 98000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (16, N'Đắc nhân tâm', 1, 12, N'Dale Carnegie', 1936, N'Image16.jpg', 68600)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (17, N'Sapiens: A Brief History of Humankind', 4, 13, N'Yuval Noah Harari', 2014, N'Image17.jpg', 169000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (18, N'The Glass Castle', 5, 15, N'Jeannette Walls', 2005, N'Image18.jpg', 43600)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (19, N'Educated', 5, 19, N'Tara Westover', 2018, N'Image19.jpg', 121000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (20, N'Ngày xưa có một chuyện tình', 1, 20, N'Nguyễn Nhật Ánh', 2016, N'Image20.jpg', 74000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (21, N'Steve Jobs', 5, 23, N'Walter Isaacson', 2011, N'Image21.jpg', 299000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (22, N'Zero to One', 4, 14, N'Peter Thiel', 2014, N'Image22.jpg', 79000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (23, N'Bossypants', 5, 16, N'Tina Fey', 2011, N'Image23.jpg', 294000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (24, N'Vietnamese made easy', 2, 21, N'Phạm Thúy Diễm', 2023, N'Image24.jpg', 1055000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (25, N'A Brief History of Time', 3, 25, N'Stephen Hawking', 1988, N'Image25.jpg', 245090)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (26, N'My Life in France', 2, 12, N'Julia Child', 2006, N'Image26.jpg', 55200)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (27, N'The Gene: An Intimate History', 3, 16, N'Siddhartha Mukherjee', 2016, N'Image27.jpg', 1095495)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (28, N'Start with Why', 4, 17, N'Simon Sinek', 2009, N'Image28.jpg', 195000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (29, N'Tôi là Bêtô', 1, 20, N'Đỗ Bảo', 2007, N'Image29.jpg', 55000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (30, N'The Wright Brothers', 5, 23, N'David McCullough', 2015, N'Image30.jpg', 116000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (31, N'To Kill a Mockingbird', 3, 21, N'Harper Lee', 1930, N'Image31.jpg', 124000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (32, N'The 4-Hour Workweek', 4, 24, N'Timothy Ferriss', 2007, N'Image32.jpg', 622000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (33, N'Món ăn ngon mỗi ngày', 2, 25, N'NXB Hồng Đức', 2023, N'Image33.jpg', 65000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (34, N'The Sixth Extinction', 3, 26, N'Elizabeth Kolbert', 2014, N'Image34.jpg', 127000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (35, N'The Kite Runner', 1, 28, N'Khaled Hosseini', 2003, N'Image35.jpg', 179000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (36, N'Born a Crime', 5, 10, N'Trevor Noah', 2016, N'Image36.jpg', 522000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (37, N'Cosmos', 3, 20, N'Carl Sagan', 1980, N'Image37.jpg', 134250)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (38, N'The Food Lab', 2, 15, N'J. Kenji Lopez-Alt', 2015, N'Image38.jpg', 124900)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (39, N'The Immortal Life of Henrietta Lacks', 5, 22, N'Rebecca Skloot', 2010, N'Image39.jpg', 215200)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (40, N'The Old Man and the Sea', 1, 30, N'Ernest Hemingway', 1952, N'Image40.jpg', 173000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (41, N'The Millionaire Next Door', 4, 22, N'Thomas J. Stanley', 1996, N'Image41.jpg', 72740)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (42, N'Salt, Fat, Acid, Heat', 2, 20, N'Samin Nosrat', 2017, N'Image42.jpg', 408000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (43, N'The Selfish Gene', 3, 15, N'Richard Dawkins', 1976, N'Image43.jpg', 330000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (44, N'Kẻ sát nhân quỷ quyệt', 5, 16, N'Gregg olsen', 2006, N'Image44.jpg', 94500)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (45, N'Norwegian Wood', 1, 6, N'Haruki Murakami', 1989, N'Image45.jpg', 224000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (46, N'How to Win Friends and Influence People', 4, 5, N'Dale Carnegie', 1936, N'Image46.jpg', 188100)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (47, N'The Great Gatsby', 3, 13, N'F. Scott Fitzgerald', 1925, N'Image47.jpg', 188100)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (48, N'How to Cook Everything', 2, 8, N'Mark Bittman', 1998, N'Image48.jpg', 286000)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (49, N'The Alchemist', 1, 9, N'Paulo Coelho', 1988, N'Image49.jpg', 192850)
INSERT [dbo].[Products] ([ProductID], [ProductName], [CategoryID], [StockQuantity], [Author], [PublishedYear], [Image], [Price]) VALUES (50, N'Silent Spring', 3, 10, N'Rachel Carson', 1962, N'Image50.jpg', 161100)
GO
INSERT [dbo].[Users] ([UserID], [GoogleID], [Username], [GoogleName], [Password], [Email], [Role], [Balance]) VALUES (20, NULL, N'tmk', NULL, N'$2b$13$bJUeD4hf1X5rNKMaGatymuzapk7EyKEIRJYxf.ugbWl7tvcp13TNC', N'aa@mm', N'Admin', 0)
INSERT [dbo].[Users] ([UserID], [GoogleID], [Username], [GoogleName], [Password], [Email], [Role], [Balance]) VALUES (24, NULL, N'client11', NULL, N'$2b$13$WXp4IJMsjI64sKPqwTltLOLXWEFGUQeXZ98nLAuDMjaGLDEDL0.P.', N'aa@mm', N'Client', 0)
INSERT [dbo].[Users] ([UserID], [GoogleID], [Username], [GoogleName], [Password], [Email], [Role], [Balance]) VALUES (25, NULL, N'nnkv', NULL, N'$2b$13$OyqZiOgXmzbnEPN4lXB2Ku6FY.V3sSYKu23dOgpoNeiuvjPcX/z.q', N'aa@mm', N'Client', 0)
INSERT [dbo].[Users] ([UserID], [GoogleID], [Username], [GoogleName], [Password], [Email], [Role], [Balance]) VALUES (14, NULL, N'admin', NULL, N'$2b$13$qifQHJCc4vWLL5eGeMxNGuFsYQ0De8/jQGrNfyWyQhqbQmxELlmcW', N'admin@gmail.com', N'Admin', 0)
GO
USE [master]
GO
ALTER DATABASE [Project_Web] SET  READ_WRITE 
GO
