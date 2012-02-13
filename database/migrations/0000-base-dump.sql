-- MySQL dump 10.13  Distrib 5.1.41, for debian-linux-gnu (i486)
--
-- Host: localhost    Database: wooble
-- ------------------------------------------------------
-- Server version	5.1.41-3ubuntu12.10-log
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO,NO_TABLE_OPTIONS' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `data` text,
  `time` int(11) NOT NULL,
  `session_id` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `i_notifications_user_id` (`user_id`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `post_editors`
--

DROP TABLE IF EXISTS `post_editors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post_editors` (
  `topic_id` varchar(255) DEFAULT NULL,
  `post_id` varchar(255) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  UNIQUE KEY `ui_post_editors` (`topic_id`,`post_id`,`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `post_users_read`
--

DROP TABLE IF EXISTS `post_users_read`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post_users_read` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `topic_id` varchar(255) NOT NULL,
  `post_id` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ui_post_users_read` (`topic_id`,`post_id`,`user_id`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `posts` (
  `topic_id` varchar(255) NOT NULL,
  `post_id` varchar(255) NOT NULL,
  `content` text,
  `parent_post_id` varchar(255) DEFAULT NULL,
  `revision_no` int(11) NOT NULL DEFAULT '1',
  `created_at` int(11) DEFAULT NULL,
  `last_touch` int(11) DEFAULT NULL,
  `deleted` int(11) NOT NULL DEFAULT '0',
  UNIQUE KEY `ui_posts_id` (`topic_id`,`post_id`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `user_id` int(11) NOT NULL,
  `session_id` varchar(255) NOT NULL,
  `last_touch` int(11) DEFAULT NULL,
  PRIMARY KEY (`user_id`,`session_id`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `topic_readers`
--

DROP TABLE IF EXISTS `topic_readers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `topic_readers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `topic_id` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ui_topic_readers` (`topic_id`,`user_id`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `topics`
--

DROP TABLE IF EXISTS `topics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `topics` (
  `id` varchar(255) NOT NULL,
  UNIQUE KEY `topics_id_ui` (`id`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hashed` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `i_user_name` (`name`),
  KEY `ui_users_email` (`email`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users_contacts`
--

DROP TABLE IF EXISTS `users_contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_contacts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `contact_user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `i_contacts_user_id` (`user_id`),
  KEY `ui_contacts_user_contact` (`user_id`,`contact_user_id`)
);
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2012-01-04 16:40:05
