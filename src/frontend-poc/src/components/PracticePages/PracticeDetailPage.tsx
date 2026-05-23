import { Navigate, useOutletContext, useParams } from "react-router-dom";
import { practices } from "../../../../shared/practices/practices";
import type { PracticeAppOutletContext } from "../../types/practiceAppOutlet";
import { EditorialPracticeDetailView } from "./EditorialPracticeDetailView";

export function PracticeDetailPage() {
  const { practiceSlug } = useParams<{ practiceSlug: string }>();
  const { setShowPopup, setChosenPractice } =
    useOutletContext<PracticeAppOutletContext>();
  const practice = practices.find((p) => p.name === practiceSlug);

  if (!practiceSlug || !practice) {
    return <Navigate to="/app/discover" replace />;
  }

  const scheduleTo = `/app/practice/${practice.name}/schedule`;

  const onJoinNow = () => {
    setChosenPractice(practice.name);
    setShowPopup(true);
  };

  return (
    <EditorialPracticeDetailView
      practice={practice}
      onJoinNow={onJoinNow}
      scheduleTo={scheduleTo}
    />
  );
}
