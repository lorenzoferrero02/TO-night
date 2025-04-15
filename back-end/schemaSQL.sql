-- Create tables
CREATE TABLE ORGANIZZATORE (
                               nomeUtente VARCHAR(255) PRIMARY KEY,
                               password VARCHAR(255)
);

CREATE TABLE EVENTO (
                        data VARCHAR(255),
                        nomeEvento VARCHAR(255),
                        ora varchar(255),
                        prezzotavolo VARCHAR(255),
                        prezzolista VARCHAR(255),
                        imageUrl VARCHAR(255),
                        descrizione varchar(255),
                        PRIMARY KEY (data)
);

CREATE TABLE TAVOLO (
                        id INT,
                        data VARCHAR(255),
                        PRIMARY KEY (id, data),
                        CHECK (id BETWEEN 1 AND 10),
                        FOREIGN KEY (data) REFERENCES EVENTO(data) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE CLIENTE (
                         nomeUtente VARCHAR(255),
                         password VARCHAR(255),
                         PRIMARY KEY (nomeUtente)
);

CREATE TABLE LISTA (
                       nomeLista VARCHAR(255),
                       data varchar(255),
                       cliente VARCHAR(255),
                       PRIMARY KEY (nomeLista, data, cliente),
                       FOREIGN KEY (data) REFERENCES EVENTO(data) ON UPDATE CASCADE ON DELETE CASCADE,
                       FOREIGN KEY (cliente) REFERENCES CLIENTE(nomeUtente) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE PARTECIPA(
                          idtable INT,
                          data varchar(255),
                          cliente VARCHAR(255),
                          PRIMARY KEY (idtable, data, cliente),
                          FOREIGN KEY (idtable, data) REFERENCES TAVOLO(id, data) ON UPDATE CASCADE ON DELETE CASCADE,
                          FOREIGN KEY (cliente) REFERENCES CLIENTE(nomeUtente) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE CREAZIONE (
                           nomeUtente VARCHAR(255),
                           data varchar(255),
                           PRIMARY KEY (nomeUtente, data),
                           FOREIGN KEY (nomeUtente) REFERENCES ORGANIZZATORE(nomeUtente) ON UPDATE CASCADE ON DELETE CASCADE,
                           FOREIGN KEY (data) REFERENCES EVENTO(data) ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO organizzatore (nomeUtente, password) VALUES('admin', 'admin');