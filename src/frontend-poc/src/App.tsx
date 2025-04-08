import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import LoginForm from "./components/LoginForm";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loginpage" element={<LoginForm />} />
      </Routes>
    </div>
  );
}
export default App;
