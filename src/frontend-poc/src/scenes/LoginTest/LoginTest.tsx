import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./LoginTest.css";
import LoginService, { LoginCredentials } from "../../services/LoginService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/auth/AuthContext";

/**
 * Login form validation schema using Zod
 */
const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Email is required")
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
 * Interface for the LoginTest component props
 */
interface LoginTestProps {
  /** Optional callback for successful login */
  onLoginSuccess?: (data: LoginFormData) => void;
  /** Optional callback for signup click */
  onSignupClick?: () => void;
}

/**
 * LoginTest Component
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
 * <LoginTest
 *   onLoginSuccess={(data) => console.log('Login success:', data)}
 *   onSignupClick={() => navigate('/signup')}
 * />
 * ```
 */
const LoginTest: React.FC<LoginTestProps> = ({
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
      <div className="login-test-container">
        <div className="login-background">
          <div className="login-background-rect" />
          <div className="login-background-rect" />
          <div className="login-shape-1" />
          <div className="login-shape-2" />
          <div className="login-shape-3" />
          <div className="login-shape-4" />
          <div className="login-shape-5" />
        </div>

        <div className="login-logo-container">
          <div className="login-logo-icon">
            <div>
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    '<svg id="I0:98;0:222;0:218" class="logo-icon" style="width: 100%; height: 100%; fill: #FFF"></svg>',
                }}
              />
            </div>
          </div>
          <div className="login-logo-type">
            <div>
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    '<svg id="I0:98;0:223;0:227" class="logo-type" style="width: 100%; height: 100%; fill: #FFF"></svg>',
                }}
              />
            </div>
          </div>
        </div>

        <div className="login-form-container">
          <div className="login-form-content">
            <h1 className="login-title">Sign in to your account</h1>
            <p className="login-subtitle">
              Hello there, please sign in to continue.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="login-input-group">
                <label htmlFor="username" className="login-input-label">
                  Email
                </label>
                <div>
                  <input
                    id="username"
                    type="text"
                    className={`login-input ${errors.username ? "error" : ""}`}
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
                    className={`login-input ${errors.password ? "error" : ""}`}
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
                className="login-button"
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
    </>
  );
};

export default LoginTest;
