DROP database IF EXISTS `chat_app`;
CREATE DATABASE  IF NOT EXISTS `chat_app`;
USE `chat_app`;

--
-- Table structure for table `client`
--

DROP TABLE IF EXISTS `clients`;
CREATE TABLE `clients` (
  `client_id` int(11) NOT NULL auto_increment,
  `username` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL,
  `nickname` varchar(45) NOT NULL,
  PRIMARY KEY (`client_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
INSERT INTO `clients` (username, password, nickname)
VALUES ("ducdonhu", "123456", "Duc");
INSERT INTO `clients` (username, password, nickname)
VALUES ("chuc", "123456", "Chuc");
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
CREATE TABLE `rooms` (
  `room_id` int(11) NOT NULL auto_increment,
  `name` varchar(50),
  PRIMARY KEY (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `rooms` (name)
VALUES ("");

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `mess_id` int(10) NOT NULL auto_increment,
  `client_from` int(11) NOT NULL,
  `mess` nvarchar(200) NOT NULL,
  `date_send` date NOT NULL,
  `room_to` int(11) not null,
  PRIMARY KEY (`mess_id`),
  FOREIGN KEY (`client_from`) REFERENCES `clients` (`client_id`),
  FOREIGN KEY (`room_to`) REFERENCES `rooms` (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `messages` (client_from, mess, date_send, room_to)
VALUES (1, "hello","2022-10-20", 1);

--
-- Table structure for table `client_room`
--

DROP TABLE IF EXISTS `client_room`;
CREATE TABLE `client_room` (
  `client` int(11) NOT NULL,
  `room` int(11) not null,
  FOREIGN KEY (`client`) REFERENCES `clients` (`client_id`),
  FOREIGN KEY (`room`) REFERENCES `rooms` (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `client_room` (client, room)
VALUES (1, 1);
INSERT INTO `client_room` (client, room)
VALUES (2, 1);
