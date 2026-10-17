import { memo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Award, ChevronsRight } from "lucide-react";
import api from "../api/axios";

// Cloudinary par chhoti photo mangao (poori badi photo nahi). Cloudinary URL na ho to wahi URL chalega.
const thumb = (url) => url?.replace("/upload/", "/upload/w_400,h_300,c_fill,g_face,f_auto,q_auto/");

// memo: list dobara render hone par har card dobara nahi banta
const DoctorCard = memo(function DoctorCard({ doctor }) {
  const name = doctor.user?.name || "Doctor";
  // "Dr. Rohan Mehta" -> "RM" (shown when the doctor has no photo)
  const initials = name.replace(/^Dr\.?\s*/i, "").split(" ").map((w) => w[0]).join("").slice(0, 2);

  return (
    <div className="flex flex-col rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-lg hover:shadow-teal-900/10">
      <div className="flex h-48 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-50">
        {doctor.image?.url ? (
          <img
            src={thumb(doctor.image.url)}
            alt={name}
            loading="lazy"
            decoding="async"
            width="400"
            height="300"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-5xl font-bold text-teal-600">{initials}</span>
        )}
      </div>

      <div className="flex-1 px-1 pt-5">
        <h3 className="text-lg font-bold text-slate-900">{name}</h3>
        <p className="mt-0.5 text-sm font-medium text-teal-700">{doctor.specialization}</p>

        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800">
          <Award className="h-3.5 w-3.5" />
          {doctor.experience} {doctor.experience === 1 ? "year" : "years"} Experience
        </span>
      </div>

      <Link
        to={`/doctor/${doctor._id}`}
        className="mt-5 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 py-3 text-sm font-semibold text-white transition-colors hover:from-teal-600 hover:to-emerald-600"
      >
        <ChevronsRight className="h-4 w-4" /> Book Now
      </Link>
    </div>
  );
});

const DoctorList = () => {
  // Public list kam badalti hai, isliye 5 minute cache. Dobara aane par turant dikhegi.
  const {
    data: doctors = [],
    isLoading: loading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => (await api.get("/doctor")).data.doctors,
    staleTime: 1 * 60 * 1000,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/70 to-white px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center sm:mb-12">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Our{" "}
            <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
              Medical Team
            </span>
          </h1>
          <p className="mt-3 text-slate-500">Book appointments quickly with our verified specialists.</p>
        </div>

        {loading && <p className="py-16 text-center text-slate-500">Loading doctors...</p>}
        {isError && (
          <div className="py-16 text-center">
            <p className="text-rose-600">Could not load doctors. Please try again.</p>
            <button onClick={() => refetch()} className="mt-3 rounded-full border border-teal-200 px-5 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-50">
              Retry
            </button>
          </div>
        )}
        {!loading && !isError && doctors.length === 0 && (
          <p className="py-16 text-center text-slate-500">No doctors available right now.</p>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorList;