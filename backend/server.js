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

// Récupérer la liste des médecins
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

// Récupérer les rendez-vous
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

// Créer un nouveau rendez-vous
app.post('/appointments', async (req, res) => {
  const { patient_name, doctor_id, reason } = req.body;

  try {
    // 1. Chercher le patient ou le créer automatiquement s'il est nouveau
    let userResult = await pool.query('SELECT id FROM users WHERE full_name = $1', [patient_name]);
    let patient_id;

    if (userResult.rows.length === 0) {
      const emailPlaceholder = `${patient_name.toLowerCase().replace(/\s+/g, '.')}@clinic.local`;
      const newUser = await pool.query(
        'INSERT INTO users (full_name, email, role) VALUES ($1, $2, $3) RETURNING id',
        [patient_name, emailPlaceholder, 'patient']
      );
      patient_id = newUser.rows[0].id;
    } else {
      patient_id = userResult.rows[0].id;
    }

    // 2. Insérer le rendez-vous
    const appointmentDate = new Date();
    appointmentDate.setDate(appointmentDate.getDate() + 1);

    const newAppointment = await pool.query(
      `INSERT INTO appointments (patient_id, doctor_id, appointment_date, reason, status) 
       VALUES ($1, $2, $3, $4, 'pending') RETURNING *`,
      [patient_id, doctor_id, appointmentDate, reason]
    );

    res.status(201).json(newAppointment.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la réservation' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend connecté sur le port ${PORT}`));