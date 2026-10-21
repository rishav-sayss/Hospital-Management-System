import { createBrowserRouter, RouterProvider ,Navigate } from "react-router-dom";
import { AuthProvider } from "./Context/Authcontext.jsx";
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

// Admin panel
import AdminLayout from "./Pages/admin/AdminLayout.jsx";
import AdminDashboard from "./Pages/admin/AdminDashboard.jsx";
import AddDoctor from "./Components/admin/AddDoctor.jsx";
import ListDoctors from "./Components/admin/ListDoctors.jsx";
import AdminAppointments from "./Pages/admin/AdminAppointments.jsx";
import ServiceDashboard from "./Pages/admin/ServiceDashboard.jsx";
import AddService from "./Components/admin/AddService.jsx";
import ListServices from "./Components/admin/ListServices.jsx";
import ServiceAppointments from "./Pages/admin/ServiceAppointments.jsx";

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

   // Admin-only area, URL: /admin/dashboard
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "add-doctor", element: <AddDoctor /> },
      { path: "doctors", element: <ListDoctors /> },
      { path: "appointments", element: <AdminAppointments /> },
      { path: "service-dashboard", element: <ServiceDashboard /> },
      { path: "add-service", element: <AddService /> },
      { path: "services", element: <ListServices /> },
      { path: "service-appointments", element: <ServiceAppointments /> },
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
