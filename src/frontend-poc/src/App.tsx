import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import LoginForm from "./components/LoginForm";
import LoggedIn from "./components/LoggedIn";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loginpage" element={<LoginForm />} />
        <Route
          path="/loggedin"
          element={
            <ProtectedRoute>
              <LoggedIn />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
export default App;
