 
import { Outlet } from "react-router-dom";
import DoctorNavbar from "./DoctorNavbar";
import { DoctorProvider } from "../../Context/DoctorContext.jsx";

const DoctorLayout = () => {
  return (
    <DoctorProvider>
      <div className="min-h-screen bg-slate-50 text-slate-800">
        {/* Navbar */}
        <DoctorNavbar />

        {/* Main Content */}
        <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="min-h-[calc(100vh-120px)]">
            <Outlet />
          </div>
        </main>
      </div>
    </DoctorProvider>
  );
};

export default DoctorLayout;
 