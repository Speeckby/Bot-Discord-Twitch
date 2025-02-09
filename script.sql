CREATE DATABASE discordbot IF NOT EXISTS;
USE discordbot;

CREATE TABLE UTILISATEUR_DISCORD(
   idDiscord INT,
   name VARCHAR(32) NOT NULL,
   xp INT,
   hex VARCHAR(6),
   banner VARCHAR(50),
   PRIMARY KEY(idDiscord)
);

CREATE TABLE UTILISATEUR_TWITCH(
   idTwitch INT,
   pseudo VARCHAR(25) NOT NULL,
   uptime INT 0,
   xp INT,
   dateFollow DATETIME,
   message INT,
   estPrincipal BOOLEAN,
   idDiscord INT,
   PRIMARY KEY(idTwitch),
   FOREIGN KEY(idDiscord) REFERENCES UTILISATEUR_DISCORD(idDiscord)
);

CREATE TABLE MOTUS(
   id INT,
   easy INT,
   normal INT,
   hard INT,
   harder INT,
   defaites INT,
   idDiscord INT NOT NULL,
   PRIMARY KEY(id),
   UNIQUE(idDiscord),
   FOREIGN KEY(idDiscord) REFERENCES UTILISATEUR_DISCORD(idDiscord)
);

CREATE TABLE BADGE(
   idBadge INT,
   nomBadge VARCHAR(50),
   PRIMARY KEY(idBadge)
);

CREATE TABLE AFFICHAGE(
   idDiscord INT,
   idBadge INT,
   place INT,
   PRIMARY KEY(idDiscord, idBadge),
   FOREIGN KEY(idDiscord) REFERENCES UTILISATEUR_DISCORD(idDiscord),
   FOREIGN KEY(idBadge) REFERENCES BADGE(idBadge)
);
