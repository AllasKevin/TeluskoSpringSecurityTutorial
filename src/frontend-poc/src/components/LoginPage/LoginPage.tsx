import React from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import './LoginPage.css';
import LoginService, { LoginCredentials } from '../../services/LoginService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import mandala from '../../assets/mandala.png';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z
    .string()
    .min(4, 'Password must be at least 4 characters')
    .max(50, 'Password must not exceed 50 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignupClick = () => {
    navigate('/registerpage');
  };

  const loginUser = (loginCredentials: LoginCredentials) => {
    LoginService.post(loginCredentials)
      .then(() => {
        sessionStorage.setItem('username', loginCredentials.username);
        login();
        navigate('/app');
      })
      .catch(() => {});
  };

  const onSubmit = (data: FieldValues) => {
    loginUser(data as LoginCredentials);
  };

  return (
    <div className="login-container">
      <div className="shape-1" />
      <div className="shape-2" />
      <div className="shape-3" />
      <div className="shape-4" />
      <div className="shape-5" />

      <div className="content-wrapper">
        <div className="logo-container">
          <img src={mandala} alt="Company Logo" className="logo-icon" />
          <div className="logo-text">GrowHub</div>
        </div>

        <div className="form-container">
          <div className="login-form-content">
            <h1 className="login-title">Sign in to your account</h1>
            <p className="login-subtitle">
              Hello there, please sign in to continue.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="login-input-group">
                <label htmlFor="username" className="login-input-label">
                  Username
                </label>
                <div>
                  <input
                    id="username"
                    type="text"
                    className={`login-input ${errors.username ? 'error' : ''}`}
                    placeholder="Enter your username"
                    {...register('username')}
                    aria-invalid={errors.username ? 'true' : 'false'}
                  />
                  {errors.username && (
                    <p className="login-error-message" role="alert">
                      {errors.username.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="login-input-group">
                <label htmlFor="password" className="login-input-label">
                  Password
                </label>
                <div>
                  <input
                    id="password"
                    type="password"
                    className={`login-input ${errors.password ? 'error' : ''}`}
                    placeholder="Enter your password"
                    {...register('password')}
                    aria-invalid={errors.password ? 'true' : 'false'}
                  />
                  {errors.password && (
                    <p className="login-error-message" role="alert">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="purple-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="login-signup-text">
              <span>Don't you have an account? </span>
              <button
                className="login-signup-link"
                onClick={handleSignupClick}
                type="button"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
