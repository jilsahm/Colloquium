CREATE TABLE IF NOT EXISTS Administrator (
    AdministratorID SERIAL,
    Nickname VARCHAR(64) NOT NULL,
    Passwordhash VARCHAR(64) NOT NULL,
    PRIMARY KEY (AdministratorID)
);

CREATE TABLE IF NOT EXISTS Competitor (
    CompetitorID SERIAL,
    Lastname VARCHAR(64) NOT NULL,
    Surename VARCHAR(64) NOT NULL,
    PRIMARY KEY (CompetitorID)
);

CREATE TABLE IF NOT EXISTS SessionSize (
    SessionSizeID SERIAL,
    Minutes INTEGER NOT NULL,
    PRIMARY KEY (SessionSizeID)
);

CREATE TABLE IF NOT EXISTS Session (
    SessionID SERIAL,
    Starttime BIGINT,
    Endtime BIGINT,
    CompetitorID INTEGER,
    SessionSizeID INTEGER,
    PRIMARY KEY (SessionID),
    FOREIGN KEY (CompetitorID) REFERENCES Competitor(CompetitorID),
    FOREIGN KEY (SessionSizeID) REFERENCES SessionSize(SessionSizeID)
);

CREATE TABLE IF NOT EXISTS Question (
    QuestionID SERIAL,
    Content TEXT,
    PRIMARY KEY (QuestionID)
);