/**
 * @module RegisterPage
 * @description A registration page component that allows users to create a new account.
 * Features form validation, error handling, and integration with authentication system.
 */

import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import mandala from "../../assets/mandala.png";
import RegisterService, {
  RegisterRequest,
} from "../../services/RegisterService";
import { useEffect, useState } from "react";
import InviteCodeService from "../../services/InviteCodeService";

/**
 * Zod schema for form validation
 * @constant
 * @description Defines validation rules for registration form fields
 */
const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  inviteCode: z.string().uuid("Invitation code must be a valid UUID"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * RegisterPage component for user registration
 * @component
 * @description Renders a registration form with validation and error handling
 * @example
 * ```tsx
 * <RegisterPage />
 * ```
 */
export function RegisterPage() {
  const [inviteCode, setInviteCode] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  const [registered, setRegistered] = useState(false);
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [noInviteCodeError, setNoInviteCodeError] = useState<string | null>(
    null
  );

  const onSignInClick = () => {
    navigate("/loginpage");
  };

  const getAndSetInviteCode = () => {
    InviteCodeService.getAvailableInviteCode()
      .then((res) => {
        setInviteCode(res.data);
        setValue("inviteCode", res.data); // <--- THIS updates the field
        setNoInviteCodeError(null);
        console.log(res.data);
      })
      .catch((err) => {
        const message =
          err.response?.data ||
          err.message ||
          "Could not generate an invite code.";
        setNoInviteCodeError(message);
        console.error(err);
      });
  };

  useEffect(() => {
    getAndSetInviteCode();
  }, []);

  /**
   * Handles form submission
   * @param data - The form data
   */
  const registerUser = (registerRequest: RegisterRequest) => {
    RegisterService.post(registerRequest)
      .then(() => {
        console.log("Registration successful");
        //sessionStorage.setItem("username", registerRequest.username);
        //login();
        setRegistered(true);
        setServerError(null);
        //navigate("/app");
      })
      .catch((err) => {
        console.log("Registration failed");
        console.log(err);
        if (err.response && err.response.data) {
          // Backend error message (string or JSON)
          setServerError(err.response.data);
        } else {
          setServerError("Registration failed. Please try again.");
        }
      });
  };

  const onSubmit = (data: FieldValues) => {
    registerUser(data as RegisterRequest);
  };

  return (
    <div className="register-container">
      <div className="shape-1" />
      <div className="shape-2" />
      <div className="shape-3" />
      <div className="shape-4" />
      <div className="shape-5" />

      <div className="register-content">
        <div className="logo-container">
          <img src={mandala} alt="Company Logo" className="logo-icon" />
          <div className="logo-text">GrowHub</div>
        </div>

        <div className="form-container">
          {serverError && (
            <div className="login-server-error-message " role="alert">
              {serverError}
            </div>
          )}
          {registered && (
            <div className="register-success-message" role="alert">
              <p>Registration successful!</p>
              <div>
                <button
                  className="register-signin-link"
                  onClick={onSignInClick}
                >
                  Go to Sign In
                </button>
              </div>
            </div>
          )}

          {!registered && (
            <>
              <h1 className="register-title">Create Account</h1>
              <p className="register-subtitle">
                Hello there, please sign up to continue.
              </p>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="register-form-group">
                  <label className="register-label">Username</label>
                  <div className="register-input-wrapper">
                    <input
                      type="text"
                      placeholder="Please enter your username"
                      className="register-input"
                      {...register("username")}
                    />
                  </div>
                  {errors.username && (
                    <span className="error-message">
                      {errors.username.message}
                    </span>
                  )}
                </div>

                <div className="register-form-group">
                  <label className="register-label">Email Address</label>
                  <div className="register-input-wrapper">
                    <input
                      type="email"
                      placeholder="Please enter your email address"
                      className="register-input"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <span className="error-message">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                <div className="register-form-group">
                  <label className="register-label">Password</label>
                  <div className="register-input-wrapper">
                    <input
                      type="password"
                      placeholder="Please enter your password"
                      className="register-input"
                      {...register("password")}
                    />
                  </div>
                  {errors.password && (
                    <span className="error-message">
                      {errors.password.message}
                    </span>
                  )}
                </div>

                <div className="register-form-group">
                  <label className="register-label">Invitation Code</label>
                  <div className="register-input-wrapper">
                    <input
                      type="text"
                      placeholder="Please enter your invitation code"
                      className="register-input"
                      {...register("inviteCode")}
                    />
                  </div>
                  {noInviteCodeError && (
                    <div className="login-server-error-message " role="alert">
                      {noInviteCodeError}
                    </div>
                  )}
                  {errors.inviteCode && (
                    <span className="error-message">
                      {errors.inviteCode.message}
                    </span>
                  )}
                  <button
                    type="button"
                    className="register-signin-link"
                    onClick={getAndSetInviteCode}
                  >
                    Click to generate a new invitation code
                  </button>
                </div>

                <button type="submit" className="purple-button">
                  Register
                </button>

                <div className="register-signin-text">
                  <span> Already have an account? </span>
                  <button
                    className="register-signin-link"
                    onClick={onSignInClick}
                    type="submit"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
