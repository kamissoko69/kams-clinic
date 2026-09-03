-- Extension pour UUID si besoin
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des Utilisateurs
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('patient', 'doctor', 'admin')) DEFAULT 'patient',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des Médecins
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    specialty VARCHAR(100) NOT NULL,
    consultation_fee DECIMAL(10,2) NOT NULL,
    available_days VARCHAR(100) DEFAULT 'Mon,Tue,Wed,Thu,Fri'
);

-- Table des Rendez-vous
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES users(id) ON DELETE CASCADE,
    doctor_id INT REFERENCES doctors(id) ON DELETE CASCADE,
    appointment_date TIMESTAMP NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Données de test
INSERT INTO users (full_name, email, password_hash, role) VALUES
('Dr. Aminata Diallo', 'a.diallo@kamsclinic.com', '$2b$10$SampleHashDoctor1', 'doctor'),
('Dr. Jean Dupont', 'j.dupont@kamsclinic.com', '$2b$10$SampleHashDoctor2', 'doctor'),
('Moussa Traoré', 'moussa@gmail.com', '$2b$10$SampleHashPatient', 'patient');

INSERT INTO doctors (user_id, specialty, consultation_fee) VALUES
(1, 'Cardiologie', 25000.00),
(2, 'Médecine Générale', 15000.00);

INSERT INTO appointments (patient_id, doctor_id, appointment_date, reason, status) VALUES
(3, 1, '2026-09-10 10:00:00', 'Consultation de suivi cardiaque', 'confirmed');