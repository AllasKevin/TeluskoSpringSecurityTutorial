import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  function goToLogin() {
    navigate(`/loginpage`);
  }

  return (
    <div>
      <button className="btn btn-primary" onClick={goToLogin}>
        MyButton
      </button>
    </div>
  );
};

export default Home;
