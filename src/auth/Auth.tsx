import { Outlet, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/auth.context";
import { useEffect } from "react";

const Auth = () => {
  const { isLoggedIn } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return (
    <>
      <Outlet />
    </>
  );
};

export default Auth;
