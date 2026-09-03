import React, { useState, useEffect } from 'react';

function App() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/doctors').then(res => res.json()),
      fetch('/api/appointments').then(res => res.json())
    ])
    .then(([doctorsData, appointmentsData]) => {
      setDoctors(doctorsData);
      setAppointments(appointmentsData);
      setLoading(false);
    })
    .catch(err => {
      console.error('Erreur:', err);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '30px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <header style={{ borderBottom: '2px solid #0056b3', paddingBottom: '10px', marginBottom: '30px' }}>
        <h1 style={{ color: '#0056b3', margin: 0 }}>🏥 KAMS Clinic — Gestion Médicale</h1>
        <p style={{ color: '#666', marginTop: '5px' }}>Portail d'administration et de consultation</p>
      </header>

      {loading ? (
        <p>Chargement des données...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
            <h2>👨‍⚕️ Médecins Disponibles</h2>
            <ul>
              {doctors.map(doc => (
                <li key={doc.id} style={{ marginBottom: '10px' }}>
                  <strong>{doc.full_name}</strong> — {doc.specialty} ({doc.consultation_fee} FCFA)
                </li>
              ))}
            </ul>
          </div>

          <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
            <h2>📅 Planning Rendez-vous</h2>
            <ul>
              {appointments.map(app => (
                <li key={app.id} style={{ marginBottom: '10px' }}>
                  <strong>Patient :</strong> {app.patient_name} | <strong>Dr :</strong> {app.doctor_name}<br />
                  <small>Motif : {app.reason}</small>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;