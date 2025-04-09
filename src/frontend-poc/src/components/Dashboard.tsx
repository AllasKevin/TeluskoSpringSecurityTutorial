import apiClient from "../services/api-client";

const Dashboard = () => {
  const getStudents = () => {
    apiClient
      .get("/students", {
        withCredentials: true,
      })
      .then((response) => {
        console.log("Students: ", response.data);
      })
      .catch((err) => {
        console.error("Error fetching students:", err);
      });
  };

  return (
    <div>
      Dashboard
      <button className="btn btn-secondary" onClick={getStudents}>
        GetStudents
      </button>
    </div>
  );
};

export default Dashboard;
