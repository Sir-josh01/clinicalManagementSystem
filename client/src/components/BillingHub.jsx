import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/api.js';
import { CreditCard, Plus, Receipt, Loader2, DollarSign, CheckCircle2, Clock } from 'lucide-react';

export default function InvoiceLedger() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Create Invoice State (Admins/Doctors Only)
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    appointmentId: '',
    amount: '',
    description: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      // Assuming route is standard query parameters or role checks handled dynamically by backend
      const response = await api.get('/invoices/my-invoices');
      setInvoices(response.data);
    } catch (err) {
      setError('Unable to fetch clinical invoice statements.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');

    const payload = {
      patient: formData.patientId,
      appointment: formData.appointmentId || "65f123abc456def789012345", // Fallback placeholder
      amount: Number(formData.amount),
      description: formData.description
    };

    try {
      await api.post('/invoices', payload);
      setIsCreating(false);
      setFormData({ patientId: '', appointmentId: '', amount: '', description: '' });
      fetchInvoices();
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing invoice generation.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-clinical-blue">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 dark:bg-red-950/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* ADMIN/DOCTOR CONTROLS: Create Billing Statement */}
      {user?.role !== 'patient' && (
        <div className="flex justify-end">
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-2 rounded-xl bg-clinical-blue px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-clinical-blue-dark transition-all cursor-pointer"
          >
            {isCreating ? 'Cancel Bill' : (
              <>
                <Plus size={16} /> Generate Invoice
              </>
            )}
          </button>
        </div>
      )}

      {/* Invoice Generator Form Panel */}
      {isCreating && user?.role !== 'patient' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <h3 className="text-lg font-bold tracking-tight mb-4 text-slate-900 dark:text-white">Issue Clinical Billing Statement</h3>
          <form onSubmit={handleCreateInvoice} className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Patient ID / Reference</label>
              <input
                type="text"
                name="patientId"
                required
                value={formData.patientId}
                onChange={handleInputChange}
                placeholder="e.g., 65f123abc456def..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-slate-950 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Linked Appointment Reference (Optional)</label>
              <input
                type="text"
                name="appointmentId"
                value={formData.appointmentId}
                onChange={handleInputChange}
                placeholder="e.g., 65f987fed654cba..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-slate-950 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Billable Amount (₦)</label>
              <input
                type="number"
                name="amount"
                required
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="e.g., 25000"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-slate-950 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Itemized Description / Breakdown</label>
              <input
                type="text"
                name="description"
                required
                value={formData.description}
                onChange={handleInputChange}
                placeholder="e.g., General Consultation Fee + Lab Assay Panels"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-slate-950 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
            <div className="md:col-span-3 flex justify-end">
              <button
                type="submit"
                disabled={submitLoading}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 transition-all cursor-pointer disabled:opacity-70"
              >
                {submitLoading ? <Loader2 size={16} className="animate-spin" /> : 'Emit Statement'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Invoices Ledger Stream */}
      {invoices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800 bg-white dark:bg-slate-800">
          <Receipt className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={40} />
          <p className="text-sm font-medium text-slate-500">No active balance, entries, or billing cards on file.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {invoices.map((invoice) => (
            <div
              key={invoice._id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-800 flex flex-col justify-between transition-all hover:border-slate-300 dark:hover:border-slate-700"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
                    <CreditCard size={18} />
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    invoice.status === 'paid' 
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' 
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
                  }`}>
                    {invoice.status === 'paid' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                    {invoice.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400">Statement Amount</span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white flex items-baseline tracking-tight">
                    <span className="text-sm font-bold mr-0.5">₦</span>
                    {invoice.amount?.toLocaleString()}
                  </div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300 pt-2 line-clamp-2">
                    {invoice.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-50 dark:border-slate-900/60 text-[11px] text-slate-400 flex justify-between items-center">
                <span>Issued: {new Date(invoice.createdAt).toLocaleDateString()}</span>
                {invoice.status !== 'paid' && user?.role === 'patient' && (
                  <button className="text-xs font-bold text-clinical-blue hover:underline cursor-pointer">
                    Pay Bill
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}