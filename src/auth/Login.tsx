import { FormEvent, useState } from "react";
import { Button } from "@mui/material";
import { showToast } from "../utility/toast";
import { useAuthContext } from "../context/auth.context";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setIsLoggedIn } = useAuthContext();
  const navigate = useNavigate();

  const handleFormSubmission = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      showToast("error", "Please enter both email and password.");
      return;
    }

    const userData = { email, password };

    if (userData.email === "a@2.com" && password === "12345") {
      localStorage.setItem("token", "123456");
      setIsLoggedIn(true);
      navigate("/todo");
    } else {
      showToast("error", "Invalid Credentials.");
      return;
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <div className="flex flex-col flex-1 items-center justify-center">
        <h1 className="text-4xl mt-4 mb-4 font-bold font-serif text-black">
          Login
        </h1>
        <div>
          <form onSubmit={(e) => handleFormSubmission(e)}>
            <h3 className="text-xl mb-2 ">What's your email?</h3>
            <input
              type="email"
              placeholder="Enter your email... "
              className="bg-[#eeeeee] rounded px-4 py-2 border w-full text-base placeholder:text-sm mb-7"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <h3 className="text-xl mb-2">What's your Password?</h3>
            <input
              type="password"
              placeholder="Enter your password... "
              className="bg-[#eeeeee] rounded px-4 py-2 border w-full text-base placeholder:text-sm mb-7"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              variant="contained"
              color="primary"
              type="submit"
              className="bg-[#111] text-white font-semibold rounded px-4 py-2 border w-full
          text-lg placeholder:text-base"
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
