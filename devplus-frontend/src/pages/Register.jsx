import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'MEMBER',
    githubUsername: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      const result = await register(registerData);
      
      if (result.success) {
        toast.success('Account created successfully!');
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <span role="img" aria-label="logo">⚡</span>
        </div>
        <h2>Create Account</h2>
        <p className="subtitle">Join DevPlus and start tracking your team's progress</p>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">Full Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              className="form-control-custom"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              className="form-control-custom"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">GitHub Username</Form.Label>
            <Form.Control
              type="text"
              name="githubUsername"
              className="form-control-custom"
              placeholder="Enter your GitHub username"
              value={formData.githubUsername}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">Role</Form.Label>
            <Form.Select
              name="role"
              className="form-select-custom"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="MEMBER">Member (Developer)</option>
              <option value="TEAM_LEAD">Team Lead</option>
              <option value="MANAGER">Manager</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              className="form-control-custom"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="form-label-custom">Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              className="form-control-custom"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button
            type="submit"
            className="btn-primary-custom w-100"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </Form>

        <div className="text-center mt-4">
          <p style={{ color: '#8b949e' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#7c3aed' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;