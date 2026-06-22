import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../utils/api.js";
import {
  FileText,
  Plus,
  Clipboard,
  Loader2,
  Activity,
} from "lucide-react";

export default function MedicalRecords() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // New Record Form State (For Doctors/Admins)
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    diagnosis: "",
    treatmentPlan: "",
    prescriptions: "",
    notes: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await api.get(`/records/patient/${user._id}`);
      setRecords(response.data);
    } catch (err) {
      setError("Failed to load electronic health records.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError("");

    const payload = {
      patient: formData.patientId, 
      appointment: "65f123abc456def789012345", // Placeholder until linked directly to your appointments state loop
      vitals: {
        bloodPressure: "120/80", 
        temperature: "37°C",
        pulseRate: "72 bpm",
        weight: "70kg",
      },
      diagnosis: formData.diagnosis,
      treatmentPlan: formData.treatmentPlan,
      prescriptions: [
        {
          medicineName: formData.prescriptions || "Assigned Treatment",
          dosage: "As directed",
          duration: "See clinical notes",
        },
      ],
    };

    try {
      await api.post("/records", payload);
      setIsAdding(false);
      setFormData({
        patientId: "",
        diagnosis: "",
        treatmentPlan: "",
        prescriptions: "",
        notes: "",
      });
      fetchRecords();
    } catch (err) {
      setError(err.response?.data?.message || "Error saving medical record.");
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

      {/* DOCTOR/ADMIN PRIVILEGES */}
      {user?.role !== "patient" && (
        <div className="flex justify-end">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 rounded-xl bg-clinical-blue px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-clinical-blue-dark transition-all cursor-pointer"
          >
            {isAdding ? "Cancel Entry" : (
              <>
                <Plus size={16} /> Add Clinical Log
              </>
            )}
          </button>
        </div>
      )}

      {/* Add Record Form Panel */}
      {isAdding && user?.role !== "patient" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-800">
          <h3 className="text-lg font-bold tracking-tight mb-4 text-slate-900 dark:text-white">
            Create New Clinical Record
          </h3>
          <form onSubmit={handleAddRecord} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Patient ID / Reference
              </label>
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
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Primary Diagnosis
              </label>
              <input
                type="text"
                name="diagnosis"
                required
                value={formData.diagnosis}
                onChange={handleInputChange}
                placeholder="e.g., Acute Hypertension"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-slate-950 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Treatment Plan / Interventions
              </label>
              <textarea
                name="treatmentPlan"
                required
                rows="2"
                value={formData.treatmentPlan}
                onChange={handleInputChange}
                placeholder="Outline clinical directions..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-slate-950 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Prescriptions & Dosages
              </label>
              <textarea
                name="prescriptions"
                rows="2"
                value={formData.prescriptions}
                onChange={handleInputChange}
                placeholder="e.g., Amoxicillin 500mg TDS x7 days"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-slate-950 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Additional Observations / Notes
              </label>
              <textarea
                name="notes"
                rows="2"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Symptoms timeline, etc..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-sm text-slate-950 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white resize-none"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={submitLoading}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 transition-all cursor-pointer disabled:opacity-70"
              >
                {submitLoading ? <Loader2 size={16} className="animate-spin" /> : "Commit to Ledger"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Records Display Block */}
      {records.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800 bg-white dark:bg-slate-800">
          <FileText className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={40} />
          <p className="text-sm font-medium text-slate-500">
            No medical charts or clinical histories found on file.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {records.map((record) => (
            <div key={record._id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-800">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-700">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-clinical-blue dark:bg-blue-950/50 dark:text-blue-400">
                    <Clipboard size={20} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{record.diagnosis}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Logged on {new Date(record.createdAt).toLocaleDateString()} by Dr. {record.doctor?.lastName || "Staff Specialist"}
                    </p>
                  </div>
                </div>
                {user?.role !== "patient" && (
                  <span className="text-xs bg-slate-100 px-2.5 py-1 rounded-lg text-slate-600 font-mono dark:bg-slate-700 dark:text-slate-300">
                    Patient Ref: {record.patient?._id || record.patient}
                  </span>
                )}
              </div>

              {/* Dynamic Vitals Tracking Row */}
              {record.vitals && (
                <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 text-xs md:grid-cols-4 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-600 dark:text-slate-400">🩸 BP: <strong className="text-slate-900 dark:text-white">{record.vitals.bloodPressure || "N/A"}</strong></span>
                  <span className="text-slate-600 dark:text-slate-400">🌡️ Temp: <strong className="text-slate-900 dark:text-white">{record.vitals.temperature || "N/A"}</strong></span>
                  <span className="text-slate-600 dark:text-slate-400">💓 Pulse: <strong className="text-slate-900 dark:text-white">{record.vitals.pulseRate || "N/A"}</strong></span>
                  <span className="text-slate-600 dark:text-slate-400">⚖️ Weight: <strong className="text-slate-900 dark:text-white">{record.vitals.weight || "N/A"}</strong></span>
                </div>
              )}

              <div className="mt-4 grid gap-4 sm:grid-cols-3 text-sm">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Treatment Plan</span>
                  <p className="text-slate-700 dark:text-slate-300">{record.treatmentPlan}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Prescriptions</span>
                  <div className="text-slate-700 dark:text-slate-300 p-2 rounded-lg bg-slate-50/50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
                    {record.prescriptions && record.prescriptions.length > 0 ? (
                      record.prescriptions.map((p, idx) => (
                        <div key={idx} className="text-xs font-medium">
                          💊 {p.medicineName} - {p.dosage} ({p.duration})
                        </div>
                      ))
                    ) : "None assigned."}
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Clinical Notes</span>
                  <p className="text-slate-700 dark:text-slate-300 italic">"{record.notes || "No extra remarks."}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}