import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";
import { useState } from "react";
import mandala from "../assets/mandala.png";

const GoogleIcon = () => (
  <svg
    width="27"
    height="27"
    viewBox="0 0 27 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M26.46 13.8068C26.46 12.8495 26.3741 11.9291 26.2145 11.0455H13.5V16.2675H20.7655C20.4525 17.955 19.5014 19.3848 18.0716 20.342V23.7293H22.4345C24.9873 21.3791 26.46 17.9182 26.46 13.8068V13.8068Z"
      fill="#4285F4"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.5 27C17.145 27 20.2009 25.7911 22.4345 23.7293L18.0716 20.342C16.8627 21.152 15.3164 21.6307 13.5 21.6307C9.98387 21.6307 7.00773 19.2559 5.94614 16.065H1.43591V19.5627C3.65728 23.9748 8.22273 27 13.5 27V27Z"
      fill="#34A853"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.94614 16.065C5.67614 15.255 5.52273 14.3898 5.52273 13.5C5.52273 12.6102 5.67614 11.745 5.94614 10.935V7.43727H1.43591C0.521591 9.25977 0 11.3216 0 13.5C0 15.6784 0.521591 17.7402 1.43591 19.5627L5.94614 16.065V16.065Z"
      fill="#FBBC05"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.5 5.36932C15.482 5.36932 17.2616 6.05045 18.6607 7.38818L22.5327 3.51614C20.1948 1.33773 17.1389 0 13.5 0C8.22273 0 3.65728 3.02523 1.43591 7.43727L5.94614 10.935C7.00773 7.74409 9.98387 5.36932 13.5 5.36932V5.36932Z"
      fill="#EA4335"
    />
  </svg>
);

const LandingPage = () => {
  const [attemptedGoogleSign, setAttemptedGoogleSign] = useState(false);

  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    // Implement Google Sign In logic
    console.log("Google Sign In clicked");
    setAttemptedGoogleSign(true);
  };

  const handleCreateAccount = () => {
    navigate("/registerpage");
  };

  const handleSignIn = () => {
    navigate("/loginpage");
  };

  return (
    <div className="landing-container">
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

        <div className="auth-container">
          {attemptedGoogleSign && (
            <p className="error-message" role="alert">
              Google Sign In is not implemented yet.
            </p>
          )}

          <button
            className="google-button"
            onClick={handleGoogleSignIn}
            aria-label="Continue with Google"
          >
            <GoogleIcon />
            <span className="google-text">Continue with Google</span>
          </button>

          <button
            className="create-account-button"
            onClick={handleCreateAccount}
            aria-label="Create Account"
          >
            Create Account
          </button>

          <div className="signup-container">
            <span className="signup-text">Already have an account?</span>
            <button
              className="signup-link"
              onClick={handleSignIn}
              aria-label="Sign In"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
