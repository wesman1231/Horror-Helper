-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: movies_shows
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `directorinfo`
--

DROP TABLE IF EXISTS `directorinfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `directorinfo` (
  `tmdbid` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `profilepath` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `movies`
--

DROP TABLE IF EXISTS `movies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movies` (
  `tmdbid` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `poster` varchar(255) DEFAULT NULL,
  `keywords` varchar(9999) DEFAULT NULL,
  `releasedate` varchar(255) NOT NULL,
  `franchise` varchar(255) DEFAULT NULL,
  `director` varchar(999) DEFAULT NULL,
  `synopsis` varchar(999) DEFAULT NULL,
  `cast` text,
  PRIMARY KEY (`tmdbid`),
  FULLTEXT KEY `search_idx` (`title`,`franchise`),
  FULLTEXT KEY `keywords_idx` (`keywords`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `userID` varchar(100) NOT NULL,
  `reviewScore` int DEFAULT NULL,
  `reviewText` text,
  `movieID` int DEFAULT NULL,
  `showID` int DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `reviewID` varchar(36) DEFAULT NULL,
  `dateTime` varchar(35) DEFAULT NULL,
  UNIQUE KEY `reviewID` (`reviewID`),
  CONSTRAINT `reviews_chk_1` CHECK (((`reviewScore` >= 1) and (`reviewScore` <= 5)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `shows`
--

DROP TABLE IF EXISTS `shows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shows` (
  `tmdbid` int NOT NULL AUTO_INCREMENT,
  `title` varchar(999) DEFAULT NULL,
  `poster` varchar(999) DEFAULT NULL,
  `keywords` text,
  `firstairdate` varchar(999) DEFAULT NULL,
  `lastairdate` varchar(999) DEFAULT NULL,
  `seasons` int DEFAULT NULL,
  `episodes` int DEFAULT NULL,
  `creator` varchar(999) DEFAULT NULL,
  `synopsis` text,
  PRIMARY KEY (`tmdbid`),
  FULLTEXT KEY `search_idx` (`title`),
  FULLTEXT KEY `keywords_idx` (`keywords`)
) ENGINE=InnoDB AUTO_INCREMENT=307386 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-05  0:35:44
