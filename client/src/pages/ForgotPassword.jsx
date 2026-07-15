import { useState } from 'react';
import api from '../utils/api'; //configured - axios instance

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(false);

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message);
    } catch(err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Recover Password</h2>
        <p style={styles.subtext}>Enter your clinic account email to recieve reset validation instructions.</p>

        {message && <div style={styles.successAlert}>{message}</div>}
        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type='email'
            placeholder='Enter your email address'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <button type='submit' style={styles.button} disabled={isSubmitting}>
            {isSubmitting ? 'Processing Subsystem...' : 'Send recovery link'}
          </button>
        </form>
      </div>
    </div>
  );
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


export default ForgotPassword;
