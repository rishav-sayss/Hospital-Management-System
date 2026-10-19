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
import Contact from "./Pages/ContactSection.jsx";
import Profile from "./Pages/UserProfilepage.jsx";
import "./index.css";
import Layout from "./Components/Layout.jsx";

// Doctor panel
import DoctorLayout from "./Components/Docter/DoctorLayout.jsx";
import DoctorDashboard from "./Pages/docter/DocterDashboard.jsx";
import DoctorAppointments from "./Pages/docter/DoctorAppointments.jsx";
import DoctorEditProfile from "./Pages/docter/DoctorEditProfile.jsx";

const router = createBrowserRouter([
  // Login/Register stay outside Layout — they have their own full-screen branding
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  // Doctor-only area — its own navbar (DoctorLayout), separate from the main site's
  {
    element: (
      <ProtectedRoute allowedRoles={["doctor"]}>
        <DoctorLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/doctor/dashboard", element: <DoctorDashboard /> },
      { path: "/doctor/appointments", element: <DoctorAppointments /> },
      { path: "/doctor/profile", element: <DoctorEditProfile /> },
    ],
  },

  // Everything else shares the Navbar via Layout
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/doctors", element: <Doctorlist /> },
      { path: "/doctor/:id", element: <DoctorProfile /> },
      { path: "/contact", element: <Contact /> },
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
      // No allowedRoles here — any logged-in user (patient/doctor/receptionist/admin) can reach this
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
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
