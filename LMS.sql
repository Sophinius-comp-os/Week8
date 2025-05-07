-- Create the database
CREATE DATABASE IF NOT EXISTS library_management_system;
USE library_management_system;

-- Table: Authors
CREATE TABLE Authors (
    AuthorID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Biography TEXT
);

-- Table: Publishers
CREATE TABLE Publishers (
    PublisherID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Location VARCHAR(255)
);

-- Table: Books
CREATE TABLE Books (
    BookID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    ISBN VARCHAR(13) UNIQUE NOT NULL,
    PublicationDate DATE,
    AuthorID INT,
    PublisherID INT,
    Genre VARCHAR(50),
    TotalCopies INT NOT NULL DEFAULT 0,
    AvailableCopies INT NOT NULL DEFAULT 0,
    FOREIGN KEY (AuthorID) REFERENCES Authors(AuthorID),
    FOREIGN KEY (PublisherID) REFERENCES Publishers(PublisherID),
    CHECK (TotalCopies >= 0),
    CHECK (AvailableCopies >= 0 AND AvailableCopies <= TotalCopies)
);

-- Table: Members
CREATE TABLE Members (
    MemberID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Address VARCHAR(255),
    Email VARCHAR(100) UNIQUE NOT NULL,
    Phone VARCHAR(20),
    MembershipDate DATE NOT NULL
);

-- Table: Loans (formerly BookLoans)
CREATE TABLE Loans (
    LoanID INT AUTO_INCREMENT PRIMARY KEY,
    MemberID INT,
    BookID INT,
    LoanDate DATE NOT NULL,
    ReturnDate DATE,
    Status ENUM('loaned', 'returned', 'overdue') NOT NULL DEFAULT 'loaned',
    FOREIGN KEY (MemberID) REFERENCES Members(MemberID),
    FOREIGN KEY (BookID) REFERENCES Books(BookID),
    CHECK (LoanDate <= ReturnDate)
);

-- Table: Reservations
CREATE TABLE Reservations (
    ReservationID INT AUTO_INCREMENT PRIMARY KEY,
    MemberID INT,
    BookID INT,
    ReservationDate DATE NOT NULL,
    Status ENUM('pending', 'active', 'cancelled', 'completed') DEFAULT 'pending',
    FOREIGN KEY (MemberID) REFERENCES Members(MemberID),
    FOREIGN KEY (BookID) REFERENCES Books(BookID)
);


-- Table: BookReviews
CREATE TABLE BookReviews (
    ReviewID INT AUTO_INCREMENT PRIMARY KEY,
    BookID INT,
    MemberID INT,
    Rating INT NOT NULL,
    Comment TEXT,
    ReviewDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (BookID) REFERENCES Books(BookID),
    FOREIGN KEY (MemberID) REFERENCES Members(MemberID),
    CHECK (Rating >= 1 AND Rating <= 5)
);
