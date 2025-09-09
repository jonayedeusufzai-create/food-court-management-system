import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearErrors } from '../../redux/slices/authSlice';
import './auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  const [errors, setErrors] = useState({});
  const { name, email, password, phone } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }

    if (error) {
      // Handle validation errors
      if (error.errors) {
        const validationErrors = {};
        error.errors.forEach(err => {
          validationErrors[err.param] = err.msg;
        });
        setErrors(validationErrors);
      } else {
        alert(error);
      }
      dispatch(clearErrors());
    }
  }, [isAuthenticated, error, navigate, dispatch]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const onAddressChange = (e) => {
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [e.target.name]: e.target.value
      }
    });
    
    // Clear error when user starts typing
    if (errors[`address.${e.target.name}`]) {
      setErrors({ ...errors, [`address.${e.target.name}`]: '' });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    dispatch(registerUser({ 
      name, 
      email, 
      password, 
      phone, 
      address: formData.address 
    }));
  };

  return (
    <div className="register-container" role="main">
      <div className="auth-card" role="form" aria-labelledby="register-heading">
        <div className="auth-header">
          <h2 id="register-heading">Create Account</h2>
          <p>Join our food court community today</p>
        </div>
        
        <form onSubmit={onSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={onChange}
              required
              aria-describedby={errors.name ? "name-error" : undefined}
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && (
              <span id="name-error" className="error-text" role="alert">
                {errors.name}
              </span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <span id="email-error" className="error-text" role="alert">
                {errors.email}
              </span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              minLength="6"
              required
              aria-describedby={errors.password ? "password-error" : undefined}
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.password && (
              <span id="password-error" className="error-text" role="alert">
                {errors.password}
              </span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={phone}
              onChange={onChange}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              aria-invalid={errors.phone ? "true" : "false"}
            />
            {errors.phone && (
              <span id="phone-error" className="error-text" role="alert">
                {errors.phone}
              </span>
            )}
          </div>
          
          <div className="address-section" role="group" aria-labelledby="address-heading">
            <h3 id="address-heading">Delivery Address</h3>
            
            <div className="form-group">
              <label htmlFor="street">Street Address</label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.address.street}
                onChange={onAddressChange}
                required
                aria-describedby={errors['address.street'] ? "street-error" : undefined}
                aria-invalid={errors['address.street'] ? "true" : "false"}
              />
              {errors['address.street'] && (
                <span id="street-error" className="error-text" role="alert">
                  {errors['address.street']}
                </span>
              )}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.address.city}
                  onChange={onAddressChange}
                  required
                  aria-describedby={errors['address.city'] ? "city-error" : undefined}
                  aria-invalid={errors['address.city'] ? "true" : "false"}
                />
                {errors['address.city'] && (
                  <span id="city-error" className="error-text" role="alert">
                    {errors['address.city']}
                  </span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.address.state}
                  onChange={onAddressChange}
                  required
                  aria-describedby={errors['address.state'] ? "state-error" : undefined}
                  aria-invalid={errors['address.state'] ? "true" : "false"}
                />
                {errors['address.state'] && (
                  <span id="state-error" className="error-text" role="alert">
                    {errors['address.state']}
                  </span>
                )}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="zipCode">ZIP Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.address.zipCode}
                  onChange={onAddressChange}
                  required
                  aria-describedby={errors['address.zipCode'] ? "zipCode-error" : undefined}
                  aria-invalid={errors['address.zipCode'] ? "true" : "false"}
                />
                {errors['address.zipCode'] && (
                  <span id="zipCode-error" className="error-text" role="alert">
                    {errors['address.zipCode']}
                  </span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.address.country}
                  onChange={onAddressChange}
                  required
                  aria-describedby={errors['address.country'] ? "country-error" : undefined}
                  aria-invalid={errors['address.country'] ? "true" : "false"}
                />
                {errors['address.country'] && (
                  <span id="country-error" className="error-text" role="alert">
                    {errors['address.country']}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary auth-btn"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;