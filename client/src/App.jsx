import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./Context/Authcontext";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import ProtectedRoute from "./Components/ProtectedRoute";
import "./index.css";
const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/", element: <Home /> },
  // Example: a doctor-only page — swap <h1> for your real component later.
  // Anyone not logged in, or logged in with a different role, gets redirected.
  {
    path: "/doctor/dashboard",
    element: (
      <ProtectedRoute allowedRoles={["doctor"]}>
        <h1>Doctor Dashboard</h1>
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
