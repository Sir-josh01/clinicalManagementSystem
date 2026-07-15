import { useState } from 'react';
import api from '../utils/api';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract the raw token string directly from the URL trailing parameter route path
  const getUrlToken = () => {
    const segments = window.location.pathname.split('/');
    return segments[segments.length - 1];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      return setError('Password do not match');
    }

    setIsSubmitting(true);
    const token = getUrlToken();

    try {
      const response = await api.put(`/auth/reset-password/${token}`, { password });
      setMessage(response.data.message);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Token is invalid or has expired');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Reset Password</h2>
        <p style={styles.subtext}>Please enter your new strong security password below</p>

        {message && <div style={styles.successAlert}>{message}</div>}
        {error && <div style={styles.errorAlert}>{error}</div>}

        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            type='password'
            placeholder='New password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <input 
            type='password'
            placeholder='Confirm New Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type='submit' disabled={isSubmitting} style={styles.button}>
            {isSubmitting ? 'Updating database records...' : 'Save New Password'}
          </button>
        </form>
      </div>
    </div>
  )
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f6f9' },
    card: { background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%', textAlign: 'center' },
    heading: { color: '#2c3e50', marginBottom: '10px' },
    subtext: { color: '#7f8c8d', fontSize: '14px', marginBottom: '20px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    input: { padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px', outline: 'none' },
    button: { padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: '#3498db', color: '#fff', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
    successAlert: { padding: '12px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '6px', marginBottom: '15px', fontSize: '14px' },
    errorAlert: { padding: '12px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '6px', marginBottom: '15px', fontSize: '14px' }
};

export default ResetPassword;

