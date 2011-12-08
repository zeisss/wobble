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
  PRIMARY KEY (`id`),
  KEY `i_notifications_user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=258 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (57,3,'{\"type\":\"post_changed\",\"topic_id\":\"1-1322964504077\",\"post_id\":\"1\"}',1323217847),(64,3,'{\"type\":\"post_changed\",\"topic_id\":\"1-1322964504077\",\"post_id\":\"1\"}',1323219307),(71,3,'{\"type\":\"post_changed\",\"topic_id\":\"1-1322964504077\",\"post_id\":\"1\"}',1323219534),(74,3,'{\"type\":\"post_changed\",\"topic_id\":\"1-1322964504077\",\"post_id\":\"1\"}',1323219553),(89,3,'{\"type\":\"post_changed\",\"topic_id\":\"1-1322964504077\",\"post_id\":\"1\"}',1323251038),(103,3,'{\"type\":\"post_changed\",\"topic_id\":\"1-1322964504077\",\"post_id\":\"1\"}',1323253221),(106,3,'{\"type\":\"post_changed\",\"topic_id\":\"1-1322964504077\",\"post_id\":\"1\"}',1323253229),(109,3,'{\"type\":\"post_changed\",\"topic_id\":\"1-1322964504077\",\"post_id\":\"1\"}',1323253236),(112,3,'{\"type\":\"post_changed\",\"topic_id\":\"1-1322964504077\",\"post_id\":\"1\"}',1323253251),(115,3,'{\"type\":\"post_changed\",\"topic_id\":\"1-1322964504077\",\"post_id\":\"1\"}',1323253310),(118,3,'{\"type\":\"post_changed\",\"topic_id\":\"1-1322964504077\",\"post_id\":\"1\"}',1323253333),(127,3,'{\"type\":\"post_changed\",\"topic_id\":\"1-1322964504077\",\"post_id\":\"1\"}',1323254800),(132,3,'{\"type\":\"post_changed\",\"topic_id\":\"1-1322964504077\",\"post_id\":\"1\"}',1323256700),(143,3,'{\"type\":\"post_changed\",\"topic_id\":\"1-1322964504077\",\"post_id\":\"1\"}',1323258109),(237,3,'{\"type\":\"user_online\",\"user_id\":null}',1323272288),(146,3,'{\"type\":\"post_changed\",\"topic_id\":\"1-1322964504077\",\"post_id\":\"1\"}',1323258114),(251,2,'{\"type\":\"topic_changed\",\"topic_id\":\"1-1322964504077\"}',1323306001),(151,3,'{\"type\":\"topic_changed\",\"topic_id\":\"1-1322964504077\"}',1323260667),(249,2,'{\"type\":\"topic_changed\",\"topic_id\":\"1-1322964504077\"}',1323305893),(155,3,'{\"type\":\"topic_changed\",\"topic_id\":\"1-1322964504077\"}',1323260786),(163,3,'{\"type\":\"topic_changed\",\"topic_id\":\"1-1322964504077\"}',1323260867),(246,2,'{\"type\":\"topic_changed\",\"topic_id\":\"1-1322964504077\"}',1323305878),(159,3,'{\"type\":\"topic_changed\",\"topic_id\":\"1-1322964504077\"}',1323260832),(255,3,'{\"type\":\"topic_changed\",\"topic_id\":\"1-1322964504077\"}',1323306010),(252,3,'{\"type\":\"topic_changed\",\"topic_id\":\"1-1322964504077\"}',1323306001),(178,3,'{\"type\":\"user_online\",\"user_id\":null}',1323265398),(254,2,'{\"type\":\"topic_changed\",\"topic_id\":\"1-1322964504077\"}',1323306010),(187,3,'{\"type\":\"post_changed\",\"topic_id\":\"1-1322964504077\",\"post_id\":\"1\"}',1323267846),(191,3,'{\"type\":\"post_changed\",\"topic_id\":\"1-1322964504077\",\"post_id\":\"1\"}',1323267869),(197,3,'{\"type\":\"user_online\",\"user_id\":null}',1323269198);
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
INSERT INTO `post_editors` VALUES ('1-1322964504077','1',1),('1-1322964504077','1',2),('1-1322965790675','1',1),('1-1322965790675','1',6),('1-1322965790675','1-1323012000260',1),('1-1322965790675','1-1323012069903',1),('1-1322965790675','1-1323012753566',1),('1-1322965790675','1-1323012757071',1),('1-1322965790675','1-1323012761110',1),('1-1322965790675','1-1323012764686',1),('1-1322965790675','1-1323012847942',1),('1-1322965790675','1-1323040026205',1),('1-1322965790675','1-1323040026205',6),('1-1322965790675','1-1323219579392',1),('1-1322965790675','1-1323257882044',1),('1-1322965790675','6-1323217756006',1),('1-1322965790675','6-1323217756006',6),('1-1322965790675','6-1323217797993',6),('1-1323263578609','1',1),('1-1323265662435','1',1),('1-1323265779991','1',1),('1-1323269714366','1',1),('1-1323269718635','1',1),('1-1323269722124','1',1),('1-1323269954948','1',1),('1-1323269955155','1',1),('1-1323269955340','1',1),('1-1323269955530','1',1),('1-1323269955729','1',1),('1-1323269955913','1',1),('1-1323269956111','1',1),('1-1323269956310','1',1),('1-1323269956510','1',1),('1-1323269956701','1',1),('1-1323269956900','1',1),('1-1323269957092','1',1),('1-1323270812469','1',1),('1-1323270820888','1',1),('1-1323271012101','1',1),('1-1323271042226','1',1),('1-1323304609062','1',1),('1-1323304622045','1',1),('1-1323304669057','1',1),('1-1323304770099','1',1),('1-1323304854973','1',1),('1-1323304870864','1',1),('1-1323304887138','1',1),('1-1323306543145','1',1),('1-1323306569941','1',1),('2-1323001994195','1',1),('2-1323001994195','1',2),('2-1323001994195','1-1323013994227',1),('2-1323001994195','1-1323014147165',1),('2-1323001994195','1-1323014185416',1),('2-1323001994195','2-1323013384148',1),('2-1323001994195','2-1323013384148',2),('2-1323001994195','2-1323013384148',6),('2-1323001994195','2-1323013388832',2),('2-1323001994195','2-1323013461885',2),('2-1323001994195','2-1323013466392',2),('2-1323001994195','2-1323013468519',2),('2-1323001994195','2-1323013470160',2),('2-1323001994195','2-1323013471627',2),('2-1323001994195','2-1323013473083',2),('2-1323001994195','2-1323013474549',2),('2-1323001994195','2-1323013492288',2),('2-1323001994195','2-1323013494104',2),('2-1323001994195','2-1323013495411',2),('2-1323001994195','2-1323013578547',2),('2-1323001994195','2-1323013584362',2),('2-1323001994195','2-1323013624612',2),('2-1323001994195','2-1323013669250',2),('2-1323001994195','2-1323013737252',2),('2-1323001994195','2-1323269276800',2),('2-1323001994195','6-1323217270691',1),('2-1323001994195','6-1323217270691',6),('2-1323269443933','1',2),('2-1323269443933','1-1323269508712',1),('2-1323269443933','1-1323269969979',1),('2-1323269443933','2-1323269528179',2),('6-1323268188286','1',6);
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
  `last_touch` int(11) DEFAULT NULL,
  UNIQUE KEY `ui_posts_id` (`topic_id`,`post_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES ('1-1322964504077','1','<div><div><b>Allgemein:</b></div><div><ul><li>Die aktuell ausgewÃ¤hlte Wave sollte sich in der URL wiederspiegeln</li><li>Notifications fÃ¼r user_online und user_signout sollten auch vom Topic beachtet werden</li></ul><div><b>Mobile:</b></div><div><ul><li>Der TextEditor funktioniert unter Android nicht<br></li></ul></div><div><b><br></b></div><div><b><br></b></div><div><b>Posts:</b></div><ul><li>BUG: Beim Editieren sind durch den Blur Handler die Formattierungsbuttons nicht mehr nutzbar</li><li>Beim Starten des Editierens von Posts muss dieser gelockt werden<br></li><li>Der Erste Reply sollte nicht eingerÃ¼ckt dargestellt werden<br></li><li>GeÃ¤nderte / Neue BeitrÃ¤ge mÃ¼ssen als ungelesen angezeigt werden<br></li><li>Anklicken der Posts: Als gelesen markieren<br></li><li>Beim LÃ¶schen eines Posts die Childposts sauber einsortieren (zB. durch behalten des gelÃ¶schten Posts mit Flag deleted=1)</li><li>BUG: wenn A und B zwei Posts in einem Topic editieren, und A speichert/lÃ¶scht, werden die Ã„nderungen bei B durch das neuladen verworfen<br></li><li>TastenkÃ¼rzel Shift+Enter zum Speichern hinzufÃ¼gen</li></ul></div><div><br></div><div><b>Topics:</b></div><div><ul><li>Besseres Erzeugen des Abstracts<br></li><li>Bilder und Links aus dem Abstract entfernen</li></ul></div><div><br></div><div><b>Contacts:</b><br><ul><li>Invite User muss eine Wavigeren Dialog anzeigen<br></li><li>Beim Anklicken eines Users in der Kontaktliste muss ein Dialog auftauchen. Hier besteht die MÃ¶glichkeit zum LÃ¶schen<br></li><li>Online/Offline Anzeige<br></li></ul></div></div><div><br></div><div>Fixed:</div><div>&nbsp;- (Post) Wenn ein User einen Post editiert, muss er automatisch in der User Liste auftauchen (ohne reload)</div><div>- (Post) Wenn man mehrfach Editiert und Speichert kann es zu Synchronisationsfehlern mit der revision_no kommen</div><div>- Notifications (z.B. fÃ¼rs Editieren, Neue BeitrÃ¤ge, LÃ¶schen)<br></div><div>- Post:&nbsp;Buttons zum Editieren der Texte (Fett, Kursiv, Listen usw.)</div>',NULL,34,1323013180,1323267869),('1-1322965790675','1','aasda<a href=\"http://heise.de\">sfasda</a>s<b>dtasda</b>s\n<div><b>fasddd</b></div>\n<div>da<img src=\"http://gravatar.com/avatar/6b24e6790cb03535ea082d8d73d0a235?s=40\"></div><div><br></div><div><br></div><div><br></div><div>Hi there!</div><div>jjj</div><div><br></div><div>Hallo Welt!</div>',NULL,19,1323013180,1323266068),('2-1323001994195','1','Hello World!123124asfasfasdasfasfasd',NULL,9,1323013180,NULL),('2-1323001994195','2-1323013384148','1.1 Hallo Welt!','1',18,1323013383,NULL),('1-1322965790675','1-1323040026205','ycyxcyxcyxcWadde, hadde, du de da!asfasdasfasd','1',6,1323040027,NULL),('2-1323001994195','6-1323217270691','1.1.1 Hallo Welt!','2-1323013384148',9,1323217265,NULL),('1-1322965790675','6-1323217756006','<UL>\r\n<LI><BR></LI>\r\n<LI><BR>asfasdasfasd</LI>\r\n<LI><BR></LI>\r\n<LI><BR></LI>\r\n<LI><BR></LI>\r\n<LI><A href=\"http://heise.de\">asfasdasfasd</A>a<BR></LI></UL>','1-1323040026205',5,1323217751,NULL),('1-1322965790675','6-1323217797993','Hallo Imke!','6-1323217756006',2,1323217793,NULL),('1-1322965790675','1-1323219579392','jaj jaj jaj','6-1323217756006',2,1323219574,NULL),('1-1322965790675','1-1323257882044','asfasdasd','1',2,1323257875,NULL),('1-1323263578609','1','NewWave - asfasfasdWrite some text!',NULL,5,NULL,NULL),('1-1323265662435','1','asfasd',NULL,2,NULL,1323265893),('1-1323265779991','1','asdasfasdasdasfasd',NULL,4,NULL,1323269958),('6-1323268188286','1','asdasdasfasdWrite some text!',NULL,2,NULL,1323268189),('2-1323001994195','2-1323269276800','Hey Ho','1',2,1323269282,1323269319),('2-1323269443933','1','Hi SÃ¼ÃŸer :)',NULL,2,NULL,1323269458),('2-1323269443933','1-1323269508712','Hallo SÃ¼sse!','1',2,1323269503,1323269509),('2-1323269443933','2-1323269528179','*knuuuuutscher*','1-1323269508712',2,1323269534,1323269543),('1-1323269714366','1','',NULL,1,NULL,NULL),('1-1323269718635','1','',NULL,1,NULL,NULL),('1-1323269722124','1','',NULL,1,NULL,NULL),('1-1323269954948','1','',NULL,1,NULL,NULL),('1-1323269955155','1','',NULL,1,NULL,NULL),('1-1323269955340','1','',NULL,1,NULL,NULL),('1-1323269955530','1','',NULL,1,NULL,NULL),('1-1323269955729','1','',NULL,1,NULL,NULL),('1-1323269955913','1','',NULL,1,NULL,NULL),('1-1323269956111','1','',NULL,1,NULL,NULL),('1-1323269956310','1','',NULL,1,NULL,NULL),('1-1323269956510','1','',NULL,1,NULL,NULL),('1-1323269956701','1','',NULL,1,NULL,NULL),('1-1323269956900','1','',NULL,1,NULL,NULL),('1-1323269957092','1','',NULL,1,NULL,NULL),('2-1323269443933','1-1323269969979','Guck guck!','2-1323269528179',2,1323269964,1323269970),('1-1323270812469','1','asfasdasd',NULL,2,NULL,1323270811),('1-1323270820888','1','asfasd',NULL,2,NULL,1323270818),('1-1323271012101','1','asfasdasfasd',NULL,2,NULL,1323271011),('1-1323271042226','1','asfasdasfasd',NULL,2,NULL,1323271039),('1-1323304609062','1','Adam Riese!<div><br></div><div><br></div><div>asd</div><div>asd</div><div>as</div><div>da</div><div>sd</div><div>asd</div>',NULL,6,NULL,1323304937),('1-1323304622045','1','',NULL,1,NULL,NULL),('1-1323304669057','1','',NULL,1,NULL,NULL),('1-1323304770099','1','',NULL,1,NULL,NULL),('1-1323304854973','1','',NULL,1,NULL,NULL),('1-1323304870864','1','asdasfasd',NULL,2,NULL,1323304868),('1-1323304887138','1','',NULL,1,NULL,NULL),('1-1323306543145','1','',NULL,1,NULL,NULL),('1-1323306569941','1','asfasd',NULL,2,NULL,1323306566);
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
) ENGINE=MyISAM AUTO_INCREMENT=63 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `topic_readers`
--

LOCK TABLES `topic_readers` WRITE;
/*!40000 ALTER TABLE `topic_readers` DISABLE KEYS */;
INSERT INTO `topic_readers` VALUES (12,'1-1322964504077',1),(60,'1-1322964504077',6),(13,'1-1322964504077',2),(14,'1-1322965790675',1),(15,'2-1323001994195',2),(17,'2-1323001994195',1),(21,'1-1322965790675',6),(22,'2-1323001994195',6),(59,'1-1322964504077',3),(27,'1-1323263578609',1),(28,'1-1323265662435',1),(29,'1-1323265779991',1),(30,'6-1323268188286',6),(31,'2-1323269443933',2),(32,'2-1323269443933',1),(33,'1-1323269714366',1),(34,'1-1323269718635',1),(35,'1-1323269722124',1),(36,'1-1323269954948',1),(37,'1-1323269955155',1),(38,'1-1323269955340',1),(39,'1-1323269955530',1),(40,'1-1323269955729',1),(41,'1-1323269955913',1),(42,'1-1323269956111',1),(43,'1-1323269956310',1),(44,'1-1323269956510',1),(45,'1-1323269956701',1),(46,'1-1323269956900',1),(47,'1-1323269957092',1),(48,'1-1323270812469',1),(49,'1-1323270820888',1),(50,'1-1323271012101',1),(51,'1-1323271042226',1),(52,'1-1323304609062',1),(53,'1-1323304622045',1),(54,'1-1323304669057',1),(55,'1-1323304770099',1),(56,'1-1323304854973',1),(57,'1-1323304870864',1),(58,'1-1323304887138',1),(61,'1-1323306543145',1),(62,'1-1323306569941',1);
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
INSERT INTO `topics` VALUES ('1-1322964504077'),('1-1322965790675'),('1-1323263578609'),('1-1323265662435'),('1-1323265779991'),('1-1323269714366'),('1-1323269718635'),('1-1323269722124'),('1-1323269954948'),('1-1323269955155'),('1-1323269955340'),('1-1323269955530'),('1-1323269955729'),('1-1323269955913'),('1-1323269956111'),('1-1323269956310'),('1-1323269956510'),('1-1323269956701'),('1-1323269956900'),('1-1323269957092'),('1-1323270812469'),('1-1323270820888'),('1-1323271012101'),('1-1323271042226'),('1-1323304609062'),('1-1323304622045'),('1-1323304669057'),('1-1323304770099'),('1-1323304854973'),('1-1323304870864'),('1-1323304887138'),('1-1323306543145'),('1-1323306569941'),('2-1323001994195'),('2-1323269443933'),('6-1323268188286');
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
  `last_touch` int(11) DEFAULT NULL,
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
INSERT INTO `users` VALUES (1,'Stephan Z.','stephan.zeissler@moinz.de','3de24e9385d0868168bd578beea8cd95',1323306925),(2,'Imke','imke@moinz.de','3de24e9385d0868168bd578beea8cd95',1323272900),(3,'Tiramon','tiramon@gmx.de','3de24e9385d0868168bd578beea8cd95',NULL),(6,'Stephan','stephan@moinz.de','3de24e9385d0868168bd578beea8cd95',1323306922);
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
  PRIMARY KEY (`id`),
  KEY `i_contacts_user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_contacts`
--

LOCK TABLES `users_contacts` WRITE;
/*!40000 ALTER TABLE `users_contacts` DISABLE KEYS */;
INSERT INTO `users_contacts` VALUES (8,1,6),(2,1,3),(10,1,2),(4,2,1),(5,3,1),(7,2,3),(9,6,1);
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

-- Dump completed on 2011-12-07 17:15:27
