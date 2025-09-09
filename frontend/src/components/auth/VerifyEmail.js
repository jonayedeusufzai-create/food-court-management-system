import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import './auth.css';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        setLoading(true);
        const response = await authAPI.verifyEmail(token);
        setMessage(response.data.message);
        setError('');
        
        // Redirect to login after successful verification
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Email verification failed');
        setMessage('');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setError('Invalid verification link');
      setLoading(false);
    }
  }, [token, navigate]);

  return (
    <div className="verify-email-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Email Verification</h2>
        </div>
        
        <div className="verification-content">
          {loading ? (
            <div className="loading">
              <p>Verifying your email...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/login')}
              >
                Go to Login
              </button>
            </div>
          ) : (
            <div className="success-message">
              <p>{message}</p>
              <p>You will be redirected to the login page shortly.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;