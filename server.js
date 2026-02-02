const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('./clearshield.db');

db.run(`
CREATE TABLE IF NOT EXISTS intakes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  phone TEXT,
  email TEXT,
  vin TEXT,
  insurance_type TEXT,
  warning_lights TEXT,
  service TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

app.post('/api/intake', (req, res) => {
  const { name, phone, email, vin, insurance_type, warning_lights, service } = req.body;

  if (!vin || vin.length !== 17) {
    return res.status(400).json({ error: 'Valid VIN required' });
  }

  db.run(
    `INSERT INTO intakes (name, phone, email, vin, insurance_type, warning_lights, service)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, phone, email, vin, insurance_type, warning_lights, service],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ success: true });
    }
  );
});

app.listen(process.env.PORT || 3000, () => {
  console.log('ClearShield Intake server running');
});
