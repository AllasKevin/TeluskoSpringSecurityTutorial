import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./LoginPage.css";
import LoginService, { LoginCredentials } from "../../services/LoginService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import mandala from "../../assets/mandala.png";

/**
 * Login form validation schema using Zod
 */
const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .refine(() => {
      // Basic username validation
      //const usernameRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // Basic phone validation (minimum 10 digits)
      return true; //usernameRegex.test(value);
    }, "Please enter a valid username"),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters")
    .max(50, "Password must not exceed 50 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Interface for the LoginPage component props
 */
interface LoginPageProps {
  /** Optional callback for successful login */
  onLoginSuccess?: (data: LoginFormData) => void;
  /** Optional callback for signup click */
  onSignupClick?: () => void;
}

/**
 * LoginPage Component
 *
 * A mobile-friendly login form with validation and error handling.
 * Features:
 * - Email/Phone and password validation
 * - Responsive design
 * - Error messages
 * - Loading state
 * - Accessibility support
 *
 * @component
 * @example
 * ```tsx
 * <LoginPage
 *   onLoginSuccess={(data) => console.log('Login success:', data)}
 *   onSignupClick={() => navigate('/signup')}
 * />
 * ```
 */
const LoginPage: React.FC<LoginPageProps> = ({
  //onLoginSuccess,
  onSignupClick,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  onSignupClick = () => {
    navigate("/registerpage");
  };

  /**
   * Handles form submission
   * @param data - The form data
   */
  const loginUser = (loginCredentials: LoginCredentials) => {
    LoginService.post(loginCredentials)
      .then(() => {
        console.log("Login successful");
        sessionStorage.setItem("username", loginCredentials.username);
        login();
        navigate("/app");
      })
      .catch((err) => {
        console.log("Login failed");
        console.log(err);
      });
  };

  const onSubmit = (data: FieldValues) => {
    loginUser(data as LoginCredentials);
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=SF+Pro+Text:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

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
                      className={`login-input ${
                        errors.username ? "error" : ""
                      }`}
                      placeholder="Enter your username"
                      {...register("username")}
                      aria-invalid={errors.username ? "true" : "false"}
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
                      className={`login-input ${
                        errors.password ? "error" : ""
                      }`}
                      placeholder="Enter your password"
                      {...register("password")}
                      aria-invalid={errors.password ? "true" : "false"}
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
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
              </form>

              <div className="login-signup-text">
                <span>Don't you have an account? </span>
                <button
                  className="login-signup-link"
                  onClick={onSignupClick}
                  type="submit"
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
