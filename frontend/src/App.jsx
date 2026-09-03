import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, Clock, DollarSign, Activity, 
  ShieldAlert, CheckCircle2, UserPlus, Building2, Stethoscope, HeartPulse
} from 'lucide-react';
import './index.css';

function App() {
  const [view, setView] = useState('public'); // 'public' ou 'admin'
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
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex items-center space-x-3">
          <Activity className="animate-spin text-sky-400" size={32} />
          <span className="text-xl font-medium">Chargement du système KAMS Clinic...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Navigation Globale */}
      <nav className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-sky-500 p-2 rounded-xl text-white shadow-lg shadow-sky-500/30">
              <HeartPulse size={24} />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-white">KAMS<span className="text-sky-400">CLINIC</span></span>
              <span className="block text-xs text-slate-400">Medical Excellence Center</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
            <button 
              onClick={() => setView('public')} 
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${view === 'public' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              🌐 Site Public (Patients)
            </button>
            <button 
              onClick={() => setView('admin')} 
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${view === 'admin' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              🔒 Dashboard Admin
            </button>
          </div>
        </div>
      </nav>

      {/* Rendu dynamique selon la vue choisie */}
      {view === 'public' ? (
        <PublicPortal doctors={doctors} />
      ) : (
        <AdminDashboard doctors={doctors} appointments={appointments} />
      )}
    </div>
  );
}

{/* PORTAIL PUBLIC PATIENTS */}
function PublicPortal({ doctors }) {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-4 py-1.5 rounded-full text-sm font-medium inline-block">
            Votre Santé, Notre Priorité Absolue
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
            Des soins médicaux d'exception à portée de main.
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Prenez rendez-vous en ligne avec les meilleurs spécialistes de la région. Un suivi personnalisé dans un environnement de pointe.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <a href="#booking" className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-sky-500/25 transition-all">
              Prendre Rendez-vous
            </a>
          </div>
        </div>
      </section>

      {/* Liste des Médecins */}
      <section className="max-w-7xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Nos Médecins Spécialistes</h2>
        <p className="text-slate-500 mb-8">Consultez nos experts médicaux certifiés</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map(doc => (
            <div key={doc.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600">
                  <Stethoscope size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{doc.full_name}</h3>
                  <p className="text-sky-600 font-medium text-sm">{doc.specialty}</p>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-sm">
                <span className="text-slate-500">Consultation</span>
                <span className="font-bold text-slate-900">{doc.consultation_fee} FCFA</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

{/* DASHBOARD ADMINISTRATION */}
function AdminDashboard({ doctors, appointments }) {
  return (
    <div className="max-w-7xl mx-auto py-10 px-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Espace d'Administration</h1>
        <p className="text-slate-500">Vue globale des opérations et planning de KAMS Clinic</p>
      </div>

      {/* Cartes KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard icon={<Users className="text-blue-600" />} title="Médecins Actifs" value={doctors.length} bg="bg-blue-50" />
        <KpiCard icon={<Calendar className="text-emerald-600" />} title="Total Rendez-vous" value={appointments.length} bg="bg-emerald-50" />
        <KpiCard icon={<Clock className="text-amber-600" />} title="En Attente" value={appointments.filter(a => a.status === 'pending').length} bg="bg-amber-50" />
        <KpiCard icon={<DollarSign className="text-indigo-600" />} title="Revenus Est. (FCFA)" value="40 000" bg="bg-indigo-50" />
      </div>

      {/* Tableau des Rendez-vous */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-lg text-slate-900">Planning des consultations</h2>
          <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full">Temps réel</span>
        </div>
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">Patient</th>
              <th className="px-6 py-4">Médecin référent</th>
              <th className="px-6 py-4">Motif</th>
              <th className="px-6 py-4">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {appointments.map(app => (
              <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-900">{app.patient_name}</td>
                <td className="px-6 py-4">{app.doctor_name}</td>
                <td className="px-6 py-4 text-slate-500">{app.reason}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    app.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {app.status === 'confirmed' ? 'Confirmé' : 'En attente'}
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

function KpiCard({ icon, title, value, bg }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center space-x-4">
      <div className={`p-4 rounded-xl ${bg}`}>{icon}</div>
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default App;