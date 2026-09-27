import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/Authcontext";

// Wrap any route element with this to require login (and optionally specific roles).
// Usage:
//   <Route path="/doctor/dashboard" element={
//     <ProtectedRoute allowedRoles={["doctor"]}><DoctorDashboard /></ProtectedRoute>
//   } />
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // wait for the session check before deciding anything

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;