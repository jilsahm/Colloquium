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

CREATE TABLE IF NOT EXISTS Topic (
    TopicID SERIAL,
    Title VARCHAR(128),
    CompetitorID INTEGER,
    SessionSizeID INTEGER,
    PRIMARY KEY (TopicID),
    FOREIGN KEY (CompetitorID) REFERENCES Competitor(CompetitorID),
    FOREIGN KEY (SessionSizeID) REFERENCES SessionSize(SessionSizeID)
);

CREATE TABLE IF NOT EXISTS Session (
    SessionID SERIAL,
    SessionDate VARCHAR(32),
    ElapsedTime BIGINT,
    TopicID INTEGER,    
    PRIMARY KEY (SessionID),
    FOREIGN KEY (TopicID) REFERENCES Topic(TopicID)    
);

CREATE TABLE IF NOT EXISTS Question (
    QuestionID SERIAL,
    Content TEXT,
    TimesAsked INTEGER,
    AnswerRating INTEGER,
    TopicID INTEGER,
    PRIMARY KEY (QuestionID),
    FOREIGN KEY (TopicID) REFERENCES Topic(TopicID)
);

CREATE TABLE IF NOT EXISTS Critique (
    CritiqueID SERIAL,
    Content VARCHAR(256),
    Positive BOOLEAN,
    SessionID INTEGER,
    PRIMARY KEY (CritiqueID),
    FOREIGN KEY (SessionID) REFERENCES Session(SessionID)
);