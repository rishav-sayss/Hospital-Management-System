import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Zap,
  GraduationCap,
  MapPin,
  Clock,
  ShieldCheck,
  Info,
  Heart,
  Award,
  Users,
} from "lucide-react";
import api from "../api/axios";
import BookingSection from "../Components/BookingSection";

// 2600 -> "2.6k", 850 -> "850"
const formatCount = (n) =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : `${n}`;

// One of the four rounded info cards (Qualifications, Location, ...)
const InfoCard = ({ icon: Icon, label, value, valueClass = "text-slate-600" }) => (
  <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
    <Icon className="w-5 h-5 text-teal-600 mt-0.5 shrink-0" />
    <div>
      <p className="text-sm font-semibold text-teal-800">{label}</p>
      <p className={`text-sm ${valueClass}`}>{value}</p>
    </div>
  </div>
);

// One of the three small stat tiles under the photo
const StatCard = ({ icon: Icon, iconClass, value, label }) => (
  <div className="flex-1 rounded-2xl bg-white border border-slate-100 shadow-sm py-3 px-2 text-center">
    <Icon className={`w-4 h-4 mx-auto mb-1 ${iconClass}`} />
    <p className="text-base font-bold text-slate-900 leading-tight">{value}</p>
    <p className="text-[11px] text-slate-500">{label}</p>
  </div>
);

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.get(`/doctor/${id}`);
        setDoctor(res.data.doctor);
      } catch (err) {
        setError(err.response?.status === 404 ? "Doctor not found" : "Could not load doctor profile");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  if (loading) return <p className="text-center text-slate-500 py-24">Loading doctor profile...</p>;
  if (error) return <p className="text-center text-rose-600 py-24">{error}</p>;

  const name = doctor.user?.name || "Doctor";
  // "Dr. Rohan Mehta" -> "RM" (used when the doctor has no photo)
  const initials = name.replace(/^Dr\.?\s*/i, "").split(" ").map((w) => w[0]).join("").slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/70 to-white pb-16">
      {/* Top bar: back button, title, rating */}
      <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-full border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-700 hover:bg-teal-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="text-xl font-bold text-teal-700">Doctor Profile</h1>

        <div className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-white px-3 py-1.5 text-sm font-semibold text-amber-600">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          {doctor.rating}
        </div>
      </div>

      {/* Profile card */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="rounded-3xl bg-white shadow-lg shadow-teal-900/5 border border-slate-100 p-8 grid md:grid-cols-[260px_1fr] gap-10">
          {/* Left: photo + stats */}
          <div>
            <div className="mx-auto w-52 h-52 rounded-full bg-teal-200 ring-8 ring-white shadow-[0_0_60px_rgba(45,212,191,0.45)] overflow-hidden flex items-center justify-center">
              {/* The Doctor model has no image field yet, so this falls back to initials.
                  Once you add one (same pattern as Service.image), the photo shows up here. */}
              {doctor.image?.url ? (
                <img src={doctor.image.url} alt={name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl font-bold text-teal-700">{initials}</span>
              )}
            </div>

            <div className="flex gap-3 mt-8">
              <StatCard icon={Heart} iconClass="text-rose-500" value={`${doctor.successRate}%`} label="Success" />
              <StatCard icon={Award} iconClass="text-amber-500" value={`${doctor.experience} Years`} label="Experience" />
              <StatCard icon={Users} iconClass="text-teal-600" value={formatCount(doctor.totalPatients)} label="Patients" />
            </div>
          </div>

          {/* Right: details */}
          <div>
            <h2 className="text-3xl font-bold text-teal-700 mb-3">{name}</h2>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 px-4 py-1.5 text-sm font-semibold text-white shadow-sm">
              <Zap className="w-4 h-4" /> {doctor.specialization}
            </span>

            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              <InfoCard icon={GraduationCap} label="Qualifications" value={doctor.qualifications || "—"} />
              <InfoCard icon={MapPin} label="Location" value={doctor.location || "—"} />
              <InfoCard
                icon={Clock}
                label="Consultation Fee"
                value={`₹${doctor.consultationFee}`}
                valueClass="text-lg font-bold text-slate-900"
              />
              <InfoCard
                icon={ShieldCheck}
                label="Availability"
                value={doctor.isAvailable ? "Available" : "Not available"}
                valueClass={doctor.isAvailable ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"}
              />
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="flex items-center gap-2 text-base font-bold text-teal-800 mb-2">
                <Info className="w-4 h-4 text-teal-600" /> About Doctor
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {doctor.about || "No description added yet."}
              </p>
            </div>

            {/* Jumps down to the booking section below the card */}
            <button
              onClick={() => document.getElementById("book")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-block mt-6 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm px-6 py-3 transition-colors"
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>

      <BookingSection doctor={doctor} />
    </div>
  );
};

export default DoctorProfile;