import { useState } from "react";
import apiClient from "../services/api-client";

interface Color {
  color: string;
}
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

  const [colorState, setColorState] = useState<Color>();

  const getColor = () => {
    apiClient
      .get<Color>("/color")
      .then((response) => {
        console.log("getcolor: ", response.data);
        setColorState(response.data);
      })
      .catch((err) => {
        console.error("Error fetching changecolor:", err);
      });
  };

  const changeColor = (chosenColor: string) => {
    apiClient
      .post<Color>("/changecolor", { color: chosenColor })
      .then((response) => {
        console.log("changecolor: ", response.data);
        setColorState(response.data);
      })
      .catch((err) => {
        console.error("Error fetching changecolor:", err);
      });
  };

  return (
    <div
      style={{
        backgroundColor: colorState?.color,
        height: "100vh",
        color: "white",
      }}
    >
      {" "}
      Dashboard
      <button className="btn btn-secondary" onClick={getStudents}>
        GetStudents
      </button>
      <button className="btn btn-primary" onClick={() => changeColor("green")}>
        changeColorToGreen
      </button>{" "}
      <button className="btn btn-primary" onClick={() => changeColor("blue")}>
        changeColorToBlue
      </button>{" "}
      <button className="btn btn-primary" onClick={getColor}>
        GetColor
      </button>
    </div>
  );
};

export default Dashboard;
