import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

function App() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = () => {
    fetch('/api/appointments')
      .then(res => res.json())
      .then(data => setAppointments(data))
      .catch(err => console.error('Erreur RDV:', err));
  };

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
      console.error('Erreur API:', err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a', color: '#fff', fontFamily: 'sans-serif' }}>
        <h2>⏳ Chargement de KAMS Clinic...</h2>
      </div>
    );
  }

  return (
    <Router>
      <div style={{ fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', color: '#334155' }}>
        
        {/* Navigation Topbar */}
        <nav style={{ backgroundColor: '#0f172a', color: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>🏥</span>
            <div>
              <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>KAMS<span style={{ color: '#38bdf8' }}>CLINIC</span></h1>
              <small style={{ color: '#94a3b8', fontSize: '11px' }}>Plateforme Médicale SaaS</small>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', backgroundColor: '#1e293b', padding: '4px', borderRadius: '8px' }}>
            <Link to="/" style={{ padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: '600', fontSize: '13px', color: '#fff', backgroundColor: '#0284c7' }}>
              🌐 Portail Public Patients
            </Link>
            <Link to="/admin" style={{ padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: '600', fontSize: '13px', color: '#94a3b8' }}>
              🔒 Accès Staff / Admin
            </Link>
          </div>
        </nav>

        {/* Routage des vues */}
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
          <Routes>
            <Route path="/" element={<PublicPortal doctors={doctors} onAppointmentCreated={fetchAppointments} />} />
            <Route path="/admin" element={<AdminDashboard doctors={doctors} appointments={appointments} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

{/* VUE PATIENTS : VITRINE + FORMULAIRE */}
function PublicPortal({ doctors, onAppointmentCreated }) {
  const [patientName, setPatientName] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patientName || !doctorId || !reason) return;

    fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patient_name: patientName,
        doctor_id: parseInt(doctorId),
        reason: reason,
        appointment_date: new Date().toISOString()
      })
    })
    .then(res => res.json())
    .then(() => {
      setMessage('✅ Votre rendez-vous a été enregistré avec succès !');
      setPatientName('');
      setDoctorId('');
      setReason('');
      onAppointmentCreated();
    })
    .catch(err => setMessage('❌ Erreur lors de la réservation.'));
  };

  return (
    <div>
      <section style={{ backgroundColor: '#1e293b', color: 'white', padding: '40px', borderRadius: '16px', marginBottom: '32px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', margin: '0 0 8px 0' }}>Prenez Rendez-vous en Ligne</h2>
        <p style={{ color: '#94a3b8', margin: 0 }}>Choisissez un spécialiste et planifiez votre consultation en quelques clics.</p>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        
        {/* Formulaire de réservation */}
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#0f172a' }}>📝 Formulaire de Consultation</h3>
          
          {message && <div style={{ padding: '10px', borderRadius: '6px', marginBottom: '16px', backgroundColor: message.includes('✅') ? '#dcfce7' : '#fee2e2', color: message.includes('✅') ? '#15803d' : '#991b1b', fontSize: '14px' }}>{message}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Nom complet du patient</label>
              <input type="text" required value={patientName} onChange={e => setPatientName(e.target.value)} placeholder="Ex: Jean Dupont" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Sélectionnez le médecin</label>
              <select required value={doctorId} onChange={e => setDoctorId(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                <option value="">-- Choisir un médecin --</option>
                {doctors.map(doc => (
                  <option key={doc.id} value={doc.id}>{doc.full_name} ({doc.specialty})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Motif de la consultation</label>
              <textarea required value={reason} onChange={e => setReason(e.target.value)} placeholder="Ex: Suivi tension artérielle" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', height: '80px' }} />
            </div>

            <button type="submit" style={{ backgroundColor: '#0284c7', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              Confirmer le Rendez-vous
            </button>
          </form>
        </div>

        {/* Annuaire Médecins */}
        <div>
          <h3 style={{ margin: '0 0 16px 0', color: '#0f172a' }}>👨‍⚕️ Médecins Référents</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {doctors.map(doc => (
              <div key={doc.id} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ display: 'block', color: '#0f172a' }}>{doc.full_name}</strong>
                  <span style={{ fontSize: '13px', color: '#0284c7' }}>{doc.specialty}</span>
                </div>
                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{doc.consultation_fee} FCFA</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

{/* VUE ADMIN : DASHBOARD DE GESTION */}
function AdminDashboard({ doctors, appointments }) {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', margin: 0, color: '#0f172a' }}>Espace d'Administration Sécurisé</h2>
        <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px' }}>Planning global et suivi des rendez-vous enregistrés</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '13px' }}>Médecins Disponibles</span>
          <h3 style={{ fontSize: '24px', margin: '4px 0 0 0' }}>{doctors.length}</h3>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '13px' }}>Total Rendez-vous</span>
          <h3 style={{ fontSize: '24px', margin: '4px 0 0 0' }}>{appointments.length}</h3>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <span style={{ color: '#64748b', fontSize: '13px' }}>Statut Système</span>
          <h3 style={{ fontSize: '18px', margin: '4px 0 0 0', color: '#15803d' }}>🟢 Opérationnel</h3>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '12px' }}>
              <th style={{ padding: '12px 24px' }}>Patient</th>
              <th style={{ padding: '12px 24px' }}>Médecin</th>
              <th style={{ padding: '12px 24px' }}>Motif</th>
              <th style={{ padding: '12px 24px' }}>Statut</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(app => (
              <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px 24px', fontWeight: 'bold' }}>{app.patient_name}</td>
                <td style={{ padding: '16px 24px' }}>{app.doctor_name}</td>
                <td style={{ padding: '16px 24px', color: '#64748b' }}>{app.reason}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', backgroundColor: '#dcfce7', color: '#15803d' }}>
                    {app.status ? app.status.toUpperCase() : 'CONFIRMÉ'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;