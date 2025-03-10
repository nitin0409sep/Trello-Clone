import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthContext } from "./context/auth.context";

const App = () => {
  const { isLoggedIn } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("auth/login");
    }
  }, [isLoggedIn, navigate]);

  return <Outlet />;
};

export default App;
