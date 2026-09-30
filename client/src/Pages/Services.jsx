import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Stethoscope, ChevronsRight } from "lucide-react";
import api from "../api/axios";

const ServiceCard = ({ service }) => (
  <div className="rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:shadow-teal-900/10 transition-shadow overflow-hidden flex flex-col">
    <div className="h-40 bg-gradient-to-br from-teal-100 to-emerald-50 flex items-center justify-center">
      {service.image?.url ? (
        <img src={service.image.url} alt={service.name} className="h-full w-full object-cover" />
      ) : (
        <Stethoscope className="w-12 h-12 text-teal-500" />
      )}
    </div>

    <div className="p-5 flex-1 flex flex-col">
      {service.category && (
        <span className="self-start rounded-full bg-teal-50 border border-teal-200 px-3 py-0.5 text-xs font-medium text-teal-700 mb-2">
          {service.category}
        </span>
      )}
      <h3 className="text-lg font-bold text-slate-900">{service.name}</h3>
      <p className="text-sm text-slate-500 mt-1 line-clamp-2 flex-1">{service.description}</p>

      <div className="flex items-center justify-between mt-4">
        <span className="text-lg font-bold text-teal-700">₹{service.price}</span>
        <Link
          to={`/services/${service._id}`}
          className="flex items-center gap-1.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 transition-colors"
        >
          Book Now <ChevronsRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  </div>
);

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/services");
        setServices(res.data.services);
      } catch {
        setError("Could not load services. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/70 to-white px-6 py-14">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900">
            Our{" "}
            <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
              Health Services
            </span>
          </h1>
          <p className="text-slate-500 mt-3">Diagnostics and checkups you can book in minutes.</p>
        </div>

        {loading && <p className="text-center text-slate-500 py-16">Loading services...</p>}
        {error && <p className="text-center text-rose-600 py-16">{error}</p>}
        {!loading && !error && services.length === 0 && (
          <p className="text-center text-slate-500 py-16">No services available right now.</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceList;