USE [master]
GO
/****** Object:  Database [DB_Payment]    Script Date: 1/27/2024 8:48:33 AM ******/
CREATE DATABASE [DB_Payment]
 CONTAINMENT = NONE
GO
ALTER DATABASE [DB_Payment] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [DB_Payment].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [DB_Payment] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [DB_Payment] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [DB_Payment] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [DB_Payment] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [DB_Payment] SET ARITHABORT OFF 
GO
ALTER DATABASE [DB_Payment] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [DB_Payment] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [DB_Payment] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [DB_Payment] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [DB_Payment] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [DB_Payment] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [DB_Payment] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [DB_Payment] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [DB_Payment] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [DB_Payment] SET  DISABLE_BROKER 
GO
ALTER DATABASE [DB_Payment] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [DB_Payment] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [DB_Payment] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [DB_Payment] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [DB_Payment] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [DB_Payment] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [DB_Payment] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [DB_Payment] SET RECOVERY FULL 
GO
ALTER DATABASE [DB_Payment] SET  MULTI_USER 
GO
ALTER DATABASE [DB_Payment] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [DB_Payment] SET DB_CHAINING OFF 
GO
ALTER DATABASE [DB_Payment] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [DB_Payment] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [DB_Payment] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [DB_Payment] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [DB_Payment] SET QUERY_STORE = ON
GO
ALTER DATABASE [DB_Payment] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [DB_Payment]
GO

CREATE TABLE [dbo].[PaymentAccount](
	[UserID] [int] NULL,
	[Balance] [int] NULL
) ON [PRIMARY]
GO
INSERT [dbo].[PaymentAccount] ([UserID], [Balance]) VALUES (1, 500000)
INSERT [dbo].[PaymentAccount] ([UserID], [Balance]) VALUES (2, 500000)
INSERT [dbo].[PaymentAccount] ([UserID], [Balance]) VALUES (3, 500000)
INSERT [dbo].[PaymentAccount] ([UserID], [Balance]) VALUES (4, 500000)
INSERT [dbo].[PaymentAccount] ([UserID], [Balance]) VALUES (5, 500000)
INSERT [dbo].[PaymentAccount] ([UserID], [Balance]) VALUES (6, 500000)
GO