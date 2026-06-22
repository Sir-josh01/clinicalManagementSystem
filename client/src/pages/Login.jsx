import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../utils/api.js";
import {
  Activity,
  Lock,
  Mail,
  Loader2,
  Eye,
  EyeOff,
  User,
  Phone,
} from "lucide-react";

export default function Login() {
  const { login } = useAuth();

  // View state manager: 'signin' or 'signup'
  const [authMode, setAuthMode] = useState("signin");

  // Form and UI States
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    role: "patient", // Default registration profile is always patient
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const targetEndpoint =
      authMode === "signin" ? "/auth/login" : "/auth/register";

    try {
      const response = await api.post(targetEndpoint, formData);
      login(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Connection failed. Please check your backend server.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin");
    setError("");
    setFormData({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      role: "patient",
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-800 transition-colors">
        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-clinical-blue/10 text-clinical-blue dark:bg-blue-500/10 dark:text-blue-400">
            <Activity size={28} />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {authMode === "signin" ? "Welcome Back" : "Create Patient Account"}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {authMode === "signin"
              ? "Sign in to access your healthcare portal"
              : "Get started with your digital clinical workspace"}
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Core Form Engine */}
        <form onSubmit={handleFormSubmit} className="space-y-5">
          {/* Conditional Fields: Only render when creating a brand new profile */}
          {authMode === "signup" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  First Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <User size={18} />
                  </span>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm focus:text-slate-950 dark:text-white dark:focus:text-white shadow-xs outline-none focus:border-clinical-blue focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:focus:bg-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Last Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <User size={18} />
                  </span>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm focus:text-slate-950 dark:text-white dark:focus:text-white shadow-xs outline-none focus:border-clinical-blue focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:focus:bg-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {authMode === "signup" && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Phone size={18} />
                </span>
                <input
                  type="tel"
                  name="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+234..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm focus:text-slate-950 dark:text-white dark:focus:text-white shadow-xs outline-none focus:border-clinical-blue focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:focus:bg-slate-900"
                />
              </div>
            </div>
          )}

          {/* Shared Credentials Fields */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail size={18} />
              </span>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="name@clinic.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm focus:text-slate-950 dark:text-white dark:focus:text-white shadow-xs outline-none focus:border-clinical-blue focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:focus:bg-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-11 text-sm focus:text-slate-950 dark:text-white dark:focus:text-white shadow-xs outline-none focus:border-clinical-blue focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:focus:bg-slate-900"
              />
              {/* Eye Toggle Trigger Action Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-clinical-blue py-3 text-sm font-semibold text-white shadow-md hover:bg-clinical-blue-dark active:scale-[0.99] disabled:opacity-70 transition-all cursor-pointer dark:bg-clinical-blue dark:hover:bg-blue-700"
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : authMode === "signin" ? (
              "Sign In"
            ) : (
              "Register Account"
            )}
          </button>
        </form>

        {/* View Switcher Controls at Bottom */}
        <div className="mt-6 text-center">
          <button
            onClick={toggleAuthMode}
            className="text-sm font-medium text-clinical-blue hover:underline dark:text-blue-400 cursor-pointer"
          >
            {authMode === "signin"
              ? "Don't have an account? Sign Up as a Patient"
              : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
