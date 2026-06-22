import React, { useState } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';
import AppointmentsHub from './components/AppointmentsHubs.jsx';
import MedicalRecords from './components/MedicalRecords.jsx';
import BillingHub from './components/BillingHub.jsx';

function App() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState('overview');

  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [invoiceTotal, setInvoiceTotal] = useState(0);
  const [recordsCount, setRecordsCount] = useState(0);

  // If no user is logged in, show the Login portal interface
  if (!user) {
    return <Login />;
  }

  return (
    <DashboardLayout 
      currentTab={currentTab} 
      setCurrentTab={setCurrentTab}
      appointmentsCount={appointmentsCount}
      invoiceTotal={invoiceTotal}
      recordsCount={recordsCount}
    >
      
      {/* 1. OVERVIEW SYSTEM TAB */}
      {currentTab === 'overview' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">System Overview</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back to your operational terminal.</p>
          </div>
          <div className="p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-800">
            <p className="text-sm font-medium text-slate-500">Render zone for role-specific analytics and statistics charts.</p>
          </div>
        </div>
      )}

      {/* 2. APPOINTMENTS HUB TAB */}
      {currentTab === 'appointments' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Appointments Hub</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage, book, and review clinical consultations.</p>
          </div>
          <AppointmentsHub setAppointmentsCount={setAppointmentsCount} />
        </div>
      )}

      {/* 3. MEDICAL RECORDS TAB */}
      {currentTab === 'records' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Electronic Health Records</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Encrypted clinical logs and histories dashboard.</p>
          </div>
          <MedicalRecords setRecordsCount={setRecordsCount} />
        </div>
      )}

      {/* 4. BILLING HUB TAB */}
      {currentTab === 'billing' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Financial Ledger</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Track financial invoices and payment tracking receipts.</p>
          </div>
          <BillingHub setInvoiceTotal={setInvoiceTotal} />
        </div>
      )}

    </DashboardLayout>
  );
}

export default App;