CREATE TABLE utilisateur_discord(
   idDiscord BIGINT,
   name VARCHAR(32) NOT NULL,
   xp INT DEFAULT 0,
   hex VARCHAR(6),
   banner VARCHAR(50),
   PRIMARY KEY(idDiscord)
);

CREATE TABLE utilisateur_twitch(
   idTwitch INT,
   pseudo VARCHAR(25) NOT NULL,
   uptime INT DEFAULT 0,
   xp INT DEFAULT 0,
   dateFollow DATETIME,
   message INT DEFAULT 0,
   estPrincipal BOOLEAN DEFAULT false,
   idDiscord BIGINT,
   PRIMARY KEY(idTwitch),
   FOREIGN KEY(idDiscord) REFERENCES utilisateur_discord(idDiscord)
);

CREATE TABLE motus(
   id INT AUTO_INCREMENT,
   easy INT DEFAULT 0,
   normal INT DEFAULT 0,
   hard INT DEFAULT 0,
   harder INT DEFAULT 0,
   defaites INT DEFAULT 0,
   idDiscord BIGINT NOT NULL,
   PRIMARY KEY(id),
   UNIQUE(idDiscord),
   FOREIGN KEY(idDiscord) REFERENCES utilisateur_discord(idDiscord)
);

CREATE TABLE badge(
   idBadge INT AUTO_INCREMENT,
   nomBadge VARCHAR(50),
   descBadge VARCHAR(200),
   PRIMARY KEY(idBadge)
);

CREATE TABLE affichage(
   idDiscord BIGINT,
   idBadge INT,
   place INT,
   PRIMARY KEY(idDiscord, idBadge),
   FOREIGN KEY(idDiscord) REFERENCES utilisateur_discord(idDiscord),
   FOREIGN KEY(idBadge) REFERENCES badge(idBadge)
);
