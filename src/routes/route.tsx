import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from "react-router-dom";
import App from "../App";
import Cards from "../components/Card";
import Login from "../auth/Login";
import Auth from "../auth/Auth";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Private Routes */}
      <Route path="/" element={<App />}>
        <Route path="todo" element={<Cards />} />
        <Route index element={<Navigate to="/todo" />} />
      </Route>

      {/* Public Routes */}
      <Route path="auth" element={<Auth />  }>
        <Route path="login" element={<Login />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </>
  )
);
