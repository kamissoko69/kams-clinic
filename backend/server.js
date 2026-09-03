const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER || 'kams_admin',
  host: process.env.DB_HOST || 'kams-clinic-db',
  database: process.env.DB_NAME || 'kams_clinic_db',
  password: process.env.DB_PASSWORD || 'kams_secure_pass',
  port: process.env.DB_PORT || 5432,
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'KAMS Clinic Backend OK' });
});

app.get('/doctors', async (req, res) => {
  try {
    const query = `
      SELECT d.id, u.full_name, d.specialty, d.consultation_fee 
      FROM doctors d 
      JOIN users u ON d.user_id = u.id;
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/appointments', async (req, res) => {
  try {
    const query = `
      SELECT a.id, u.full_name as patient_name, doc_u.full_name as doctor_name, 
             a.appointment_date, a.reason, a.status
      FROM appointments a
      JOIN users u ON a.patient_id = u.id
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users doc_u ON d.user_id = doc_u.id;
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend connecté sur le port ${PORT}`));