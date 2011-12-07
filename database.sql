-- MySQL dump 10.13  Distrib 5.1.41, for debian-linux-gnu (i486)
--
-- Host: localhost    Database: wooble
-- ------------------------------------------------------
-- Server version	5.1.41-3ubuntu12.10-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
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
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=37 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (23,2,'{\"type\":\"post_changed\",\"topic_id\":\"2-1323001994195\",\"post_id\":\"6-1323217270691\"}',1323217463),(2,2,'{\"type\":\"post_deleted\",\"topic_id\":\"2-1323001994195\",\"post_id\":\"1-1323216556662\"}',1323216609),(26,2,'{\"type\":\"post_changed\",\"topic_id\":\"2-1323001994195\",\"post_id\":\"6-1323217270691\"}',1323217474),(5,2,'{\"type\":\"post_deleted\",\"topic_id\":\"2-1323001994195\",\"post_id\":\"1-1323216862108\"}',1323216859),(20,2,'{\"type\":\"post_changed\",\"topic_id\":\"2-1323001994195\",\"post_id\":\"6-1323217270691\"}',1323217403),(8,2,'{\"type\":\"post_deleted\",\"topic_id\":\"2-1323001994195\",\"post_id\":\"1-1323014269787\"}',1323216891),(14,2,'{\"type\":\"post_changed\",\"topic_id\":\"2-1323001994195\",\"post_id\":\"6-1323217270691\"}',1323217265),(11,2,'{\"type\":\"post_deleted\",\"topic_id\":\"2-1323001994195\",\"post_id\":\"1-1323217134090\"}',1323217136),(17,2,'{\"type\":\"post_changed\",\"topic_id\":\"2-1323001994195\",\"post_id\":\"6-1323217270691\"}',1323217268),(32,2,'{\"type\":\"post_changed\",\"topic_id\":\"2-1323001994195\",\"post_id\":\"6-1323217270691\"}',1323217506),(29,2,'{\"type\":\"post_changed\",\"topic_id\":\"2-1323001994195\",\"post_id\":\"6-1323217270691\"}',1323217501),(35,2,'{\"type\":\"post_changed\",\"topic_id\":\"2-1323001994195\",\"post_id\":\"6-1323217270691\"}',1323217512);
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `post_editors`
--

LOCK TABLES `post_editors` WRITE;
/*!40000 ALTER TABLE `post_editors` DISABLE KEYS */;
INSERT INTO `post_editors` VALUES ('1-1322964504077','1',1),('1-1322964504077','1',2),('1-1322965790675','1',1),('1-1322965790675','1-1323012000260',1),('1-1322965790675','1-1323012069903',1),('1-1322965790675','1-1323012753566',1),('1-1322965790675','1-1323012757071',1),('1-1322965790675','1-1323012761110',1),('1-1322965790675','1-1323012764686',1),('1-1322965790675','1-1323012847942',1),('1-1322965790675','1-1323040026205',1),('1-1322965790675','1-1323040026205',6),('1-1322965790675','1-1323123950503',1),('2-1323001994195','1',1),('2-1323001994195','1',2),('2-1323001994195','1-1323013994227',1),('2-1323001994195','1-1323014147165',1),('2-1323001994195','1-1323014185416',1),('2-1323001994195','2-1323013384148',1),('2-1323001994195','2-1323013384148',2),('2-1323001994195','2-1323013388832',2),('2-1323001994195','2-1323013461885',2),('2-1323001994195','2-1323013466392',2),('2-1323001994195','2-1323013468519',2),('2-1323001994195','2-1323013470160',2),('2-1323001994195','2-1323013471627',2),('2-1323001994195','2-1323013473083',2),('2-1323001994195','2-1323013474549',2),('2-1323001994195','2-1323013492288',2),('2-1323001994195','2-1323013494104',2),('2-1323001994195','2-1323013495411',2),('2-1323001994195','2-1323013578547',2),('2-1323001994195','2-1323013584362',2),('2-1323001994195','2-1323013624612',2),('2-1323001994195','2-1323013669250',2),('2-1323001994195','2-1323013737252',2),('2-1323001994195','6-1323217270691',6);
/*!40000 ALTER TABLE `post_editors` ENABLE KEYS */;
UNLOCK TABLES;

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
  UNIQUE KEY `ui_posts_id` (`topic_id`,`post_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES ('1-1322964504077','1','<div><div><b>Posts:</b></div><div>- Beim Starten des Editierens von Posts muss dieser gelockt werden</div><div>- Der Erste Reply sollte nicht eingerÃ¼ckt dargestellt werden</div><div>- Notifications (z.B. fÃ¼rs Editieren, Neue BeitrÃ¤ge, LÃ¶schen)</div><div>- GeÃ¤nderte / Neue BeitrÃ¤ge mÃ¼ssen als ungelesen angezeigt werden</div><div>- Anklicken der Posts: Als gelesen markieren</div><div>- Beim LÃ¶schen eines Posts die Childposts sauber einsortieren (zB. durch behalten des gelÃ¶schten Posts mit Flag deleted=1)</div><div>- Buttons zum Editieren der Texte (Fett, Kursiv, Listen usw.)</div><div><br></div><div><b>Topics:</b></div><div>- Besseres Erzeugen des Abstracts</div><div><br></div><div><b>Contacts:</b><br>- Invite User muss eine Wavigeren Dialog anzeigen</div><div>- Beim Anklicken eines Users in der Kontaktliste muss ein Dialog auftauchen. Hier besteht die MÃ¶glichkeit zum LÃ¶schen</div><div>- Online/Offline Anzeige</div></div><div><br></div><div>Fixed:</div><div>&nbsp;- (Post) Wenn ein User einen Post editiert, muss er automatisch in der User Liste auftauchen (ohne reload)</div><div>- (Post) Wenn man mehrfach Editiert und Speichert kann es zu Synchronisationsfehlern mit der revision_no kommen</div>',NULL,17,1323013180),('1-1322965790675','1','asdtasdas<div>fas</div><div>da</div>',NULL,8,1323013180),('2-1323001994195','1','Hello World!123124asfasfasdasfasfasd',NULL,9,1323013180),('2-1323001994195','2-1323013384148','1.1 Hallo Welt!','1',15,1323013383),('1-1322965790675','1-1323040026205','<P>Hello World!<BR>kk<BR>jhhh</P>','1',3,1323040027),('2-1323001994195','6-1323217270691','Hallo Welt!','2-1323013384148',8,1323217265),('1-1322965790675','1-1323123950503','asfasda<div>sf</div><div>asf</div><div><br></div><div><b>asd</b></div><div><b>a</b></div><div><b>sf</b></div><div><b>as</b></div><div>d</div><div>asf</div><div><br></div>','1-1323040026205',2,1323123952);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=MyISAM AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `topic_readers`
--

LOCK TABLES `topic_readers` WRITE;
/*!40000 ALTER TABLE `topic_readers` DISABLE KEYS */;
INSERT INTO `topic_readers` VALUES (12,'1-1322964504077',1),(10,'1-1322964504077',3),(13,'1-1322964504077',2),(14,'1-1322965790675',1),(15,'2-1323001994195',2),(17,'2-1323001994195',1),(21,'1-1322965790675',6),(22,'2-1323001994195',6);
/*!40000 ALTER TABLE `topic_readers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `topics`
--

DROP TABLE IF EXISTS `topics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `topics` (
  `id` varchar(255) NOT NULL,
  UNIQUE KEY `topics_id_ui` (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `topics`
--

LOCK TABLES `topics` WRITE;
/*!40000 ALTER TABLE `topics` DISABLE KEYS */;
INSERT INTO `topics` VALUES ('1-1322964504077'),('1-1322965790675'),('2-1323001994195');
/*!40000 ALTER TABLE `topics` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Stephan Z.','stephan.zeissler@moinz.de','3de24e9385d0868168bd578beea8cd95'),(2,'Imke','imke@moinz.de','3de24e9385d0868168bd578beea8cd95'),(3,'Tiramon','tiramon@gmx.de','3de24e9385d0868168bd578beea8cd95'),(6,'Stephan','stephan@moinz.de','3de24e9385d0868168bd578beea8cd95');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

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
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_contacts`
--

LOCK TABLES `users_contacts` WRITE;
/*!40000 ALTER TABLE `users_contacts` DISABLE KEYS */;
INSERT INTO `users_contacts` VALUES (8,1,6),(2,1,3),(3,1,2),(4,2,1),(5,3,1),(7,2,3),(9,6,1);
/*!40000 ALTER TABLE `users_contacts` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2011-12-06 16:26:12
