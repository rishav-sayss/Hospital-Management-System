import { Link } from "react-router-dom";
import Testimonials from "../Components/Testimonials";
import ContactSection from "../Components/ConectSection";

const Home = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600 text-white">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <pattern id="hero-cross" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M36 20h8v16h16v8H44v16h-8V44H20v-8h16z" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#hero-cross)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center px-6 py-24">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
            Care that fits into your day, not around it.
          </h1>
          <p className="text-teal-50/85 text-lg mb-8">
            Book appointments, find the right doctor, and manage your visits — all from one place.
          </p>
          <div className="flex justify-center gap-4">
            {/* Update these paths once your /doctors and /appointments routes exist */}
            <Link
              to="/doctors"
              className="rounded-lg bg-white text-teal-700 font-medium px-6 py-3 text-sm hover:bg-teal-50 transition-colors"
            >
              Find a Doctor
            </Link>
            <Link
              to="/appointments"
              className="rounded-lg border border-white/40 text-white font-medium px-6 py-3 text-sm hover:bg-white/10 transition-colors"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </section>

      <Testimonials />
      <ContactSection />
    </div>
  );
};

export default Home;