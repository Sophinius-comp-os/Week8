const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost', // e.g., 'localhost'
    user: 'your_mysql_user',  // Replace with your MySQL username
    password: 'your_mysql_password', // Replace with your MySQL password
    database: 'library_management_system' // Replace with your database name
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Connected to the database');
});

// --- API Endpoints for Books ---

// 1. Get all books
app.get('/books', (req, res) => {
    const sql = 'SELECT * FROM Books';
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching books', details: err.message });
            return;
        }
        res.json(results);
    });
});

// 2. Get a single book by ID
app.get('/books/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM Books WHERE BookID = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching book', details: err.message });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        res.json(result[0]);
    });
});

// 3. Create a new book
app.post('/books', (req, res) => {
    const { Title, ISBN, PublicationDate, AuthorID, PublisherID, Genre, TotalCopies, AvailableCopies } = req.body;
    const sql = 'INSERT INTO Books (Title, ISBN, PublicationDate, AuthorID, PublisherID, Genre, TotalCopies, AvailableCopies) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [Title, ISBN, PublicationDate, AuthorID, PublisherID, Genre, TotalCopies, AvailableCopies];

    db.query(sql, values, (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error creating book', details: err.message });
            return;
        }
        res.status(201).json({ message: 'Book created successfully', insertId: result.insertId });
    });
});

// 4. Update an existing book
app.put('/books/:id', (req, res) => {
    const id = req.params.id;
    const { Title, ISBN, PublicationDate, AuthorID, PublisherID, Genre, TotalCopies, AvailableCopies } = req.body;
    const sql = 'UPDATE Books SET Title = ?, ISBN = ?, PublicationDate = ?, AuthorID = ?, PublisherID = ?, Genre = ?, TotalCopies = ?, AvailableCopies = ? WHERE BookID = ?';
    const values = [Title, ISBN, PublicationDate, AuthorID, PublisherID, Genre, TotalCopies, AvailableCopies, id];

    db.query(sql, values, (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error updating book', details: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        res.json({ message: 'Book updated successfully' });
    });
});

// 5. Delete a book
app.delete('/books/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM Books WHERE BookID = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error deleting book', details: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        res.json({ message: 'Book deleted successfully' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});