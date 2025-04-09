import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideoSlash } from "@fortawesome/free-solid-svg-icons/faVideoSlash";
import { Container, Nav, Navbar, NavLink } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import LogoutService from "../services/LogoutService";
//import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import { Link } from "react-router-dom";

const Header = () => {
  // const navigate = useNavigate();
  const { logout } = useAuth();

  const logOutUser = () => {
    LogoutService.post("")
      .then(() => {
        console.log("Logout successful");
        logout();
        // navigation to "/" is handled by ProtectedRoute
      })
      .catch((err) => {
        console.log("Logout failed");
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
      });
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/" style={{ color: "gold" }}>
          <FontAwesomeIcon icon={faVideoSlash} />
          Gold
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse>
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <NavLink as={Link} className="nav-link" to="/">
              Home
            </NavLink>
            <NavLink as={Link} className="nav-link" to="/loginpage">
              Login Page
            </NavLink>
          </Nav>
          <Button variant="outline-info" className="me-2">
            Login
          </Button>
          <Button variant="outline-info" onClick={logOutUser}>
            Log Out
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
