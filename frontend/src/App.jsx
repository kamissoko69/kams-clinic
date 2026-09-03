import React, { useState, useEffect } from 'react';

function App() {
  const [view, setView] = useState('admin'); // 'public' ou 'admin'
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
      console.error('Erreur API:', err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a', color: '#fff', fontFamily: 'sans-serif' }}>
        <h2>⏳ Chargement du système KAMS Clinic...</h2>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', color: '#334155' }}>
      {/* Navigation Topbar */}
      <nav style={{ backgroundColor: '#0f172a', color: 'white', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🏥</span>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', tracking: '0.5px' }}>KAMS<span style={{ color: '#38bdf8' }}>CLINIC</span></h1>
            <small style={{ color: '#94a3b8', fontSize: '11px' }}>System Management & Public Portal</small>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', backgroundColor: '#1e293b', padding: '4px', borderRadius: '8px' }}>
          <button 
            onClick={() => setView('public')}
            style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', backgroundColor: view === 'public' ? '#0284c7' : 'transparent', color: view === 'public' ? '#fff' : '#94a3b8' }}>
            🌐 Portail Patient
          </button>
          <button 
            onClick={() => setView('admin')}
            style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', backgroundColor: view === 'admin' ? '#0284c7' : 'transparent', color: view === 'admin' ? '#fff' : '#94a3b8' }}>
            🔒 Dashboard Admin
          </button>
        </div>
      </nav>

      {/* Contenu dynamique */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
        {view === 'public' ? (
          <div>
            <section style={{ backgroundColor: '#1e293b', color: 'white', padding: '48px', borderRadius: '16px', marginBottom: '32px', textAlign: 'center' }}>
              <span style={{ backgroundColor: 'rgba(56,189,248,0.1)', color: '#38bdf8', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>EXCELLENCE MÉDICALE</span>
              <h2 style={{ fontSize: '36px', marginTop: '16px', marginBottom: '12px' }}>Vos Soins Médicaux de Haute Qualité</h2>
              <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0 auto 24px' }}>Prenez rendez-vous directement en ligne avec nos médecins spécialistes certifiés.</p>
            </section>

            <h3 style={{ fontSize: '22px', marginBottom: '16px', color: '#0f172a' }}>👨‍⚕️ Nos Spécialistes Disponibles</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {doctors.map(doc => (
                <div key={doc.id} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#0f172a' }}>{doc.full_name}</h4>
                  <p style={{ margin: '0 0 16px 0', color: '#0284c7', fontWeight: '600', fontSize: '14px' }}>{doc.specialty}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '12px', fontSize: '13px' }}>
                    <span style={{ color: '#64748b' }}>Tarif Consultation:</span>
                    <strong>{doc.consultation_fee} FCFA</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', margin: 0, color: '#0f172a' }}>Tableau de Bord Administratif</h2>
              <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px' }}>Supervision des consultations et état du réseau clinique</p>
            </div>

            {/* Cartes KPI */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <KpiCard title="Médecins Actifs" value={doctors.length} icon="👨‍⚕️" color="#e0f2fe" textColor="#0369a1" />
              <KpiCard title="Rendez-vous Total" value={appointments.length} icon="📅" color="#dcfce7" textColor="#15803d" />
              <KpiCard title="Consultations Confirmées" value={appointments.filter(a => a.status === 'confirmed').length} icon="✅" color="#fef9c3" textColor="#a16207" />
            </div>

            {/* Table des RDV */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Planning des Rendez-vous enregistrés</h3>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 24px' }}>Patient</th>
                    <th style={{ padding: '12px 24px' }}>Médecin</th>
                    <th style={{ padding: '12px 24px' }}>Motif</th>
                    <th style={{ padding: '12px 24px' }}>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(app => (
                    <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 24px', fontWeight: '600', color: '#0f172a' }}>{app.patient_name}</td>
                      <td style={{ padding: '16px 24px' }}>{app.doctor_name}</td>
                      <td style={{ padding: '16px 24px', color: '#64748b' }}>{app.reason}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', backgroundColor: app.status === 'confirmed' ? '#dcfce7' : '#fef9c3', color: app.status === 'confirmed' ? '#15803d' : '#a16207' }}>
                          {app.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function KpiCard({ title, value, icon, color, textColor }) {
  return (
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ backgroundColor: color, width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '20px' }}>
        {icon}
      </div>
      <div>
        <span style={{ color: '#64748b', fontSize: '13px', display: 'block' }}>{title}</span>
        <strong style={{ fontSize: '22px', color: '#0f172a' }}>{value}</strong>
      </div>
    </div>
  );
}

export default App;