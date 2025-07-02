import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Logout() {
  const { logout, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate("/");
    setUser(null);
  }, [logout, navigate]);

  return null;
}
