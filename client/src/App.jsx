import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./Context/Authcontext";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import Appointments from "./Pages/Appointments";
import Doctorlist from "./Pages/Docterlist.jsx";
import DoctorProfile from "./Pages/DoctorProfile.jsx";
import ProtectedRoute from "./Components/ProtectedRoute";
import Services from "./Pages/Services.jsx";
import ServiceDetail from "./Pages/ServicesDetailepage.jsx";
import "./index.css";
import Layout from "./Components/Layout";

const router = createBrowserRouter([
  // Login/Register stay outside Layout — they have their own full-screen branding
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  // Everything else shares the Navbar via Layout
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/doctors", element: <Doctorlist /> },
      { path: "/doctor/:id", element: <DoctorProfile /> },
      // Not logged in, or logged in as anyone other than a patient, gets redirected
      {
        path: "/appointments",
        element: (
          <ProtectedRoute allowedRoles={["patient"]}>
            <Appointments />
          </ProtectedRoute>
        ),
      },
      {
        path: "/services",
        element: (
          <ProtectedRoute allowedRoles={["patient"]}>
            <Services />
          </ProtectedRoute>
        ),
      },
            {
        path: "/services/:id",
        element: (
          <ProtectedRoute allowedRoles={["patient"]}>
            <ServiceDetail />
          </ProtectedRoute>
        ),
      },
      // Example: a doctor-only page — swap <h1> for your real component later.
      {
        path: "/doctor/dashboard",
        element: (
          <ProtectedRoute allowedRoles={["doctor"]}>
            <h1>Doctor Dashboard</h1>
          </ProtectedRoute>
        ),
      },
    ],
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
