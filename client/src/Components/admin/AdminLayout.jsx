import { Outlet } from "react-router-dom";
import AdminNavbar from "./adminNavbar.jsx";

const AdminLayout = () => (
  <div>
    <AdminNavbar />
    <Outlet />
  </div>
);

export default AdminLayout