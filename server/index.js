import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // change as needed
  password: '12345678', // change as needed
  database: 'padi'
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err.message);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

app.post('/api/users', (req, res) => {
  const { name, email, birthday, language } = req.body;
  if (!name || !email || !birthday || !language) {
    return res.status(400).json({ error: 'All fields required.' });
  }
  // Ensure email uniqueness: return existing user id if email is already registered
  db.query('SELECT id FROM `user` WHERE email = ?', [email], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length) {
      // Existing user found - return its id
      return res.json({ id: rows[0].id, existing: true });
    }
    const sql = 'INSERT INTO `user` (name, email, birthday, language) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, birthday, language], (err2, result) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ id: result.insertId, name, email, birthday, language, existing: false });
    });
  });
});

app.get('/api/users/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT id, name, email, birthday, language FROM `user` WHERE id = ?', [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  });
});

import fs from 'fs';
import path from 'path';

const sigDir = path.join(process.cwd(), 'server', 'signatures');
if (!fs.existsSync(sigDir)) fs.mkdirSync(sigDir, { recursive: true });
const previewDir = path.join(process.cwd(), 'server', 'previews');
if (!fs.existsSync(previewDir)) fs.mkdirSync(previewDir, { recursive: true });

// Serve signature images
app.use('/signatures', express.static(sigDir));
// Serve previews
app.use('/previews', express.static(previewDir));

app.post('/api/forms', (req, res) => {
  const { userId, title, signature } = req.body;
  if (!userId || !title || !signature) return res.status(400).json({ error: 'Missing fields' });
  // signature is expected as data URL
  const matches = signature.match(/^data:image\/(png|jpeg);base64,(.+)$/);
  if (!matches) return res.status(400).json({ error: 'Invalid signature format' });
  const ext = matches[1] === 'png' ? 'png' : 'jpg';
  const data = matches[2];
  const buffer = Buffer.from(data, 'base64');
  const filename = `${Date.now()}_${userId}_${title.replace(/\s+/g, '_')}.${ext}`;
  const filePath = path.join(sigDir, filename);
  fs.writeFile(filePath, buffer, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    // save record in DB
    const sql = 'INSERT INTO forms (user_id, title, signature_path) VALUES (?, ?, ?)';
    db.query(sql, [userId, title, filename], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, userId, title, signature: filename });
    });
  });
});

// Helper to save form data into dedicated table
const saveFormData = (table, userId, data, signatureFilename, res) => {
  const sql = `INSERT INTO ${table} (user_id, data, signature_path) VALUES (?, ?, ?)`;
  db.query(sql, [userId, JSON.stringify(data), signatureFilename || null], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId });
  });
};

app.post('/api/form/:step', (req, res) => {
  const step = req.params.step; // expected '1','2','3'
  const { userId, data, signature } = req.body;
  if (!userId || !data) return res.status(400).json({ error: 'Missing fields' });
  const table = step === '1' ? 'form1_data' : step === '2' ? 'form2_data' : 'form3_data';
  if (!table) return res.status(400).json({ error: 'Invalid step' });

  if (signature) {
    const matches = signature.match(/^data:image\/(png|jpeg);base64,(.+)$/);
    if (!matches) return res.status(400).json({ error: 'Invalid signature format' });
    const ext = matches[1] === 'png' ? 'png' : 'jpg';
    const buffer = Buffer.from(matches[2], 'base64');
    const filename = `${Date.now()}_${userId}_form${step}.${ext}`;
    const filePath = path.join(sigDir, filename);
    fs.writeFile(filePath, buffer, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      saveFormData(table, userId, data, filename, res);
    });
  } else {
    saveFormData(table, userId, data, null, res);
  }
});

// Endpoint to get completion status for user
app.get('/api/form-status/:userId', (req, res) => {
  const userId = req.params.userId;
  const queries = [
    'SELECT COUNT(*) AS c FROM form1_data WHERE user_id = ?',
    'SELECT COUNT(*) AS c FROM form2_data WHERE user_id = ?',
    'SELECT COUNT(*) AS c FROM form3_data WHERE user_id = ?',
  ];
  db.query(queries.join(';'), [userId, userId, userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    // mysql2 returns results differently for multiple statements; run sequentially instead
    db.query(queries[0], [userId], (e1, r1) => {
      if (e1) return res.status(500).json({ error: e1.message });
      db.query(queries[1], [userId], (e2, r2) => {
        if (e2) return res.status(500).json({ error: e2.message });
        db.query(queries[2], [userId], (e3, r3) => {
          if (e3) return res.status(500).json({ error: e3.message });
          res.json({ form1: r1[0].c > 0, form2: r2[0].c > 0, form3: r3[0].c > 0 });
        });
      });
    });
  });
});

// Templates listing (reads server/templates directory)
app.get('/api/templates', (req, res) => {
  const templatesDir = path.join(process.cwd(), 'server', 'templates');
  if (!fs.existsSync(templatesDir)) return res.json([]);
  const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.pdf'));
  const rows = files.map((f, i) => ({ id: i + 1, name: f, file_path: path.join('server', 'templates', f) }));
  res.json(rows);
});

// Serve template file
app.get('/api/template/:name', (req, res) => {
  const templatesDir = path.join(process.cwd(), 'server', 'templates');
  const name = req.params.name;
  const filePath = path.join(templatesDir, name);
  if (!fs.existsSync(filePath)) return res.status(404).send('Not found');
  res.sendFile(filePath);
});

// Save/update draft
app.post('/api/draft', (req, res) => {
  const { userId, form_step, data, signature } = req.body;
  if (!userId || !form_step || !data) return res.status(400).json({ error: 'Missing' });
  // handle signature save
  const saveSignature = (cb) => {
    if (!signature) return cb(null, null);
    const matches = signature.match(/^data:image\/(png|jpeg);base64,(.+)$/);
    if (!matches) return cb(new Error('Invalid signature'));
    const ext = matches[1] === 'png' ? 'png' : 'jpg';
    const buffer = Buffer.from(matches[2], 'base64');
    const filename = `${Date.now()}_${userId}_draft${form_step}.${ext}`;
    const filePath = path.join(sigDir, filename);
    fs.writeFile(filePath, buffer, (err) => cb(err, filename));
  };
  saveSignature((err, filename) => {
    if (err) return res.status(400).json({ error: err.message });
    // upsert draft
    db.query('SELECT id FROM drafts WHERE user_id = ? AND form_step = ?', [userId, form_step], (e, rows) => {
      if (e) return res.status(500).json({ error: e.message });
      if (rows.length) {
        const sql = 'UPDATE drafts SET data = ?, signature_path = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        db.query(sql, [JSON.stringify(data), filename || null, rows[0].id], (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json({ updated: true });
        });
      } else {
        const sql = 'INSERT INTO drafts (user_id, form_step, data, signature_path) VALUES (?, ?, ?, ?)';
        db.query(sql, [userId, form_step, JSON.stringify(data), filename || null], (err3) => {
          if (err3) return res.status(500).json({ error: err3.message });
          res.json({ created: true });
        });
      }
    });
  });
});

// Load draft
app.get('/api/draft/:userId/:step', (req, res) => {
  const { userId, step } = req.params;
  db.query('SELECT data, signature_path FROM drafts WHERE user_id = ? AND form_step = ? ORDER BY updated_at DESC LIMIT 1', [userId, step], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows.length) return res.json(null);
    res.json({ data: JSON.parse(rows[0].data), signature: rows[0].signature_path });
  });
});

// Preview filled form as a simple PDF (generates a very basic PDF from JSON data)
import PDFDocument from 'pdfkit';
app.get('/api/preview/:userId/:step', (req, res) => {
  const { userId, step } = req.params;
  db.query('SELECT data FROM drafts WHERE user_id = ? AND form_step = ? ORDER BY updated_at DESC LIMIT 1', [userId, step], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!rows.length) return res.status(404).json({ error: 'No draft' });
    const data = JSON.parse(rows[0].data);
    const doc = new PDFDocument();
    const filename = `preview_${userId}_${step}_${Date.now()}.pdf`;
    const filePath = path.join(previewDir, filename);
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    doc.fontSize(18).text(`Preview - Form ${step}`, { align: 'center' });
    doc.moveDown();
    Object.entries(data).forEach(([k, v]) => {
      doc.fontSize(12).text(`${k}: ${v}`);
      doc.moveDown(0.2);
    });
    doc.end();
    stream.on('finish', () => {
      res.sendFile(filePath);
    });
  });
});

// History - returns saved form submissions across the three form tables
app.get('/api/history/:userId', (req, res) => {
  const { userId } = req.params;
  const q1 = 'SELECT id, data, signature_path, created_at, "form1" as form FROM form1_data WHERE user_id = ?';
  const q2 = 'SELECT id, data, signature_path, created_at, "form2" as form FROM form2_data WHERE user_id = ?';
  const q3 = 'SELECT id, data, signature_path, created_at, "form3" as form FROM form3_data WHERE user_id = ?';
  db.query(q1, [userId], (e1, r1) => {
    if (e1) return res.status(500).json({ error: e1.message });
    db.query(q2, [userId], (e2, r2) => {
      if (e2) return res.status(500).json({ error: e2.message });
      db.query(q3, [userId], (e3, r3) => {
        if (e3) return res.status(500).json({ error: e3.message });
        const all = [...r1, ...r2, ...r3].map(r => ({ ...r, data: JSON.parse(r.data) }));
        res.json(all.sort((a,b) => new Date(b.created_at) - new Date(a.created_at)));
      });
    });
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
