import { useNavigate } from "react-router-dom";
import "./InviteCodesPage.css";
import brandWordmark from "../../assets/tuff-ledarskap-wordmark.png";
import { useEffect, useState } from "react";
import InviteCodeService from "../../services/InviteCodeService";
import { FilterHeader } from "../PracticesPage/components/FilterHeader";
import { BottomNav } from "../BottomNav";
import { DesktopAppChrome } from "../DesktopAppChrome/DesktopAppChrome";
import { appDiscoveryPage } from "../../../../shared/practices/practices";

interface InviteCode {
  inviteCode: string;
  available: boolean;
  belongsTo: string;
}

export function InviteCodesPage() {
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>([]);
  const navigate = useNavigate();

  const onGoBackClick = () => {
    navigate("/app");
  };

  useEffect(() => {
    InviteCodeService.getMyInviteCodes()
      .then((res) => setInviteCodes(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="invite-page">
      <DesktopAppChrome />
      <div className="invite-page__inner">
        <FilterHeader />
        <div className="logo-container">
          <img
            src={brandWordmark}
            alt=""
            className="brand-wordmark-img"
            aria-hidden
          />
          <div className="logo-text">{appDiscoveryPage.brand}</div>
        </div>
        <header className="invite-page__header-block">
          <p className="invite-page__eyebrow">Administration</p>
          <h1 className="invite-page__title">Invitation codes</h1>
          <p className="invite-page__lead">
            Codes tied to your account for welcoming new participants.
          </p>
        </header>

        <div className="invite-card">
          <ul className="invite-card__list">
            {inviteCodes.map((inviteCode) => (
              <li key={inviteCode.inviteCode} className="invite-card__item">
                {inviteCode.inviteCode}
              </li>
            ))}
          </ul>
          {inviteCodes.length === 0 && (
            <p className="invite-empty-hint">No invitation codes loaded yet.</p>
          )}
          <button
            type="button"
            className="invite-back-btn"
            onClick={onGoBackClick}
          >
            ← Back to practices
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
