/**
 * @module InviteCodesPage
 * @description A registration page component that allows users to create a new account.
 * Features form validation, error handling, and integration with authentication system.
 */

import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import "./InviteCodesPage.css";
import mandala from "../../assets/mandala.png";
import RegisterService, {
  RegisterRequest,
} from "../../services/RegisterService";
import { useEffect, useState } from "react";
import InviteCodeService from "../../services/InviteCodeService";
import { FilterHeader } from "../PracticesPage/components/FilterHeader";

/**
 * InviteCodesPage component for user registration
 * @component
 * @description
 * @example
 * ```tsx
 * <InviteCodesPage />
 * ```
 */
export function InviteCodesPage() {
  const [inviteCodes, setInviteCodes] = useState<
    { inviteCode: string; available: boolean; belongsTo: string }[]
  >([]);
  const navigate = useNavigate();

  const onGoBackClick = () => {
    navigate("/app");
  };

  useEffect(() => {
    InviteCodeService.getMyInviteCodes()
      .then((res) => {
        setInviteCodes(res.data);
        console.log(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="register-container">
      <div className="shape-1" />
      <div className="shape-2" />
      <div className="shape-3" />
      <div className="shape-4" />
      <div className="shape-5" />

      <div className="register-content">
        <FilterHeader />
        <div className="logo-container">
          <img src={mandala} alt="Company Logo" className="logo-icon" />
          <div className="logo-text">GrowHub</div>
        </div>

        <div className="form-container">
          <form>
            Invite Codes
            {inviteCodes.map((inviteCode, index) => (
              <li key={index}>{inviteCode.inviteCode}</li>
            ))}
            <button
              className="register-signin-link"
              onClick={onGoBackClick}
              type="submit"
            >
              Go Back
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
