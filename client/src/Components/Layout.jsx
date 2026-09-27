import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

// Wraps every "main site" page with the shared Navbar.
// Login/Register deliberately stay OUTSIDE this layout — they already have
// their own full-screen AuthLayout branding, so adding this Navbar on top
// would just duplicate the header.
const Layout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;