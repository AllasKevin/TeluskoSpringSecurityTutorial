import { useNavigate } from 'react-router-dom';
import './InviteCodesPage.css';
import mandala from '../../assets/mandala.png';
import { useEffect, useState } from 'react';
import InviteCodeService from '../../services/InviteCodeService';
import { FilterHeader } from '../PracticesPage/components/FilterHeader';

interface InviteCode {
  inviteCode: string;
  available: boolean;
  belongsTo: string;
}

export function InviteCodesPage() {
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const navigate = useNavigate();

  const onGoBackClick = () => {
    navigate('/app');
  };

  useEffect(() => {
    InviteCodeService.getMyInviteCodes()
      .then((res) => setInviteCodes(res.data))
      .catch(() => {});
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
          <h2>Invite Codes</h2>
          <ul>
            {inviteCodes.map((inviteCode) => (
              <li key={inviteCode.inviteCode}>{inviteCode.inviteCode}</li>
            ))}
          </ul>
          <button
            className="register-signin-link"
            onClick={onGoBackClick}
            type="button"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
