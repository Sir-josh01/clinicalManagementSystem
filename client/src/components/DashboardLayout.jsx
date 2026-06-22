import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  Activity, Calendar, FileText, CreditCard, LogOut, Sun, Moon, Menu, X, ShieldAlert 
} from 'lucide-react';

export default function DashboardLayout({ children, currentTab, setCurrentTab }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  // Add these near your other useState definitions at the top of DashboardLayout
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [invoiceTotal, setInvoiceTotal] = useState(0);
  const [recordsCount, setRecordsCount] = useState(0);

  // Sync HTML class name for Tailwind v4 dark mode variant
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Comprehensive list of navigation items linked to access roles
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Activity, roles: ['admin', 'doctor', 'patient'] },
    { id: 'appointments', label: 'Appointments', icon: Calendar, roles: ['admin', 'doctor', 'patient'] },
    { id: 'records', label: 'Medical Records', icon: FileText, roles: ['doctor', 'patient'] },
    { id: 'billing', label: 'Billing & Invoices', icon: CreditCard, roles: ['admin', 'patient'] },
  ];

  // Filter items based on logged-in user's role
  const allowedNavItems = navItems.filter(item => item.roles.includes(user?.role));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50 transition-colors duration-200">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6 shadow-xs dark:border-slate-800 dark:bg-slate-800 transition-colors">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden dark:text-slate-400 dark:hover:bg-slate-700 cursor-pointer"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className="flex items-center gap-2 text-clinical-blue dark:text-blue-400">
            <Activity size={24} className="animate-pulse" />
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">HealSync CMS</span>
          </div>
        </div>


        {/* Action Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-xl bg-slate-100 p-2.5 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-all cursor-pointer"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold leading-none">{user?.firstName} {user?.lastName}</p>
            <span className="text-[10px] font-bold uppercase tracking-wider text-clinical-blue dark:text-blue-400 bg-clinical-blue/5 dark:bg-blue-500/10 px-2 py-0.5 rounded-md mt-1 inline-block">
              {user?.role}
            </span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Backing Panel for Mobile Screens */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* Sidebar Container */}
        <aside className={`fixed top-16 bottom-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white p-4 transition-transform lg:sticky lg:translate-x-0 dark:border-slate-800 dark:bg-slate-800 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <nav className="flex-1 space-y-1.5">
            {allowedNavItems.map((item) => {
            const isActive = currentTab === item.id;
            
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-clinical-blue text-white shadow-md shadow-clinical-blue/10 dark:bg-clinical-blue' 
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700/60'
                  }`}
                >
                  {/* FIX: Render the icon directly using React.createElement */}
                  {React.createElement(item.icon, { size: 18 })}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Logout Action */}
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition-all cursor-pointer mt-auto"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </aside>

        {/* Core Screen View Workspace */}
        <main className="min-w-0 flex-1 p-6 lg:p-8">
          <div className="mx-auto max-w-7xl animate-fade-in">

            {/* DYNAMIC METRIC CARDS LAYER */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          
          {/* CARD 1: Context Metric */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span>Total Consultations</span>
              <span className="text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-lg text-[10px]">+12%</span>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
              {appointmentsCount}
            </div>
            <p className="text-xs text-slate-400 mt-1">Active scheduled queues</p>
          </div>

          {/* CARD 2: Financial Focus */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span>{user?.role === 'patient' ? 'Outstanding Balance' : 'Gross Revenue Engine'}</span>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-2 tracking-tight flex items-baseline">
              <span className="text-base font-bold mr-0.5">₦</span>
              {invoiceTotal.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {user?.role === 'patient' ? 'Pending immediate settlement' : 'Successfully processed via ledger'}
            </p>
          </div>

          {/* CARD 3: Health Progress Tracking */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span>Clinical Records</span>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
              {recordsCount}
            </div>
            <p className="text-xs text-slate-400 mt-1">Encrypted system charts</p>
          </div>

          {/* CARD 4: Live Status Indicator */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span>Gateway Connection</span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-base font-bold text-slate-800 dark:text-slate-200">Live Secure Sync</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">SSL encrypted database channel</p>
          </div>

        </div>

            {children}
          </div>
        </main>
      </div>
    </div>

  );
}