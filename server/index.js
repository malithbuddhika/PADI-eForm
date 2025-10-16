const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // change as needed
  password: '', // change as needed
  database: 'padi_eform'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

app.post('/api/users', (req, res) => {
  const { name, email, birthday, language } = req.body;
  if (!name || !email || !birthday || !language) {
    return res.status(400).json({ error: 'All fields required.' });
  }
  const sql = 'INSERT INTO users (name, email, birthday, language) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, birthday, language], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, name, email, birthday, language });
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
