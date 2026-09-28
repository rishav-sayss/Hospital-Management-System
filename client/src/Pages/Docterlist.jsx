import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Award, ChevronsRight } from "lucide-react";
import BookingSection from "../Components/BookingSection";
import api from "../api/axios";

// One doctor card: photo, name, specialization, experience, Book Now
const DoctorCard = ({ doctor }) => {
  const name = doctor.user?.name || "Doctor";
  // "Dr. Rohan Mehta" -> "RM" (shown when the doctor has no photo)
  const initials = name.replace(/^Dr\.?\s*/i, "").split(" ").map((w) => w[0]).join("").slice(0, 2);

  return (
    <div className="rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:shadow-teal-900/10 transition-shadow p-4 flex flex-col">
      {/* No image field on the Doctor model yet — initials until one is added */}
      <div className="h-48 rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-50 flex items-center justify-center overflow-hidden">
        {doctor.image?.url ? (
          <img src={doctor.image.url} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-5xl font-bold text-teal-600">{initials}</span>
        )}
      </div>

      <div className="px-1 pt-5 flex-1">
        <h3 className="text-lg font-bold text-slate-900">{name}</h3>
        <p className="text-sm font-medium text-teal-700 mt-0.5">{doctor.specialization}</p>

        <span className="inline-flex items-center gap-1.5 mt-3 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800">
          <Award className="w-3.5 h-3.5" />
          {doctor.experience} {doctor.experience === 1 ? "year" : "years"} Experience
        </span>
      </div>

      {/* Goes to the profile page, which already shows availability and fee */}
      <Link
        to={`/doctor/${doctor._id}`}
        className="mt-5 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-sm font-semibold py-3 transition-colors"
      >
        <ChevronsRight className="w-4 h-4" /> Book Now
      </Link>
    </div>
  );
};

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/doctor");
        setDoctors(res.data.doctors);
      } catch {
        setError("Could not load doctors. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/70 to-white px-6 py-14">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900">
            Our{" "}
            <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
              Medical Team
            </span>
          </h1>
          <p className="text-slate-500 mt-3">Book appointments quickly with our verified specialists.</p>
        </div>

        {loading && <p className="text-center text-slate-500 py-16">Loading doctors...</p>}
        {error && <p className="text-center text-rose-600 py-16">{error}</p>}
        {!loading && !error && doctors.length === 0 && (
          <p className="text-center text-slate-500 py-16">No doctors available right now.</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorList;