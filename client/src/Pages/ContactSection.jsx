import { useState } from "react";

const DEPARTMENTS = ["Cardiology", "ENT", "Pediatrics", "Orthopedics", "Dermatology", "General Medicine"];
const SERVICES = ["Echocardiography", "Blood Pressure Check", "X-Ray", "Blood Test", "General Consultation"];

// Country code + number — update to your actual clinic WhatsApp number
const CLINIC_WHATSAPP_NUMBER = "918299431275";

const ContactSection = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: DEPARTMENTS[0],
    service: SERVICES[0],
    message: "",
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // Builds a pre-filled WhatsApp message from the form and opens it in a new tab —
  // no backend call needed, WhatsApp itself becomes the "submit" destination
  const handleSubmit = (e) => {
    e.preventDefault();

    const text = encodeURIComponent(
      `Hi, I'd like to get in touch.\n\nName: ${form.fullName}\nEmail: ${form.email}\nPhone: ${form.phone}\nDepartment: ${form.department}\nService: ${form.service}\nMessage: ${form.message}`
    );

    window.open(`https://wa.me/${CLINIC_WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  return (
    <section id="contact" className="py-20 px-6 bg-gradient-to-b from-emerald-50/60 to-white">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8">
        {/* Form card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Contact Our Clinic</h2>
          <p className="text-teal-700 text-sm italic mb-6">
            Fill the form — we'll open WhatsApp so you can connect with us instantly.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={handleChange("fullName")}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange("email")}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={handleChange("phone")}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
                <select
                  value={form.department}
                  onChange={handleChange("department")}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Service</label>
              <select
                value={form.service}
                onChange={handleChange("service")}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                {SERVICES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
              <textarea
                rows={4}
                placeholder="Describe your concern briefly..."
                value={form.message}
                onChange={handleChange("message")}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm py-2.5 transition-colors"
            >
              Send via WhatsApp
            </button>
          </form>
        </div>

        {/* Info column */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Visit Our Clinic</h3>
            <div className="space-y-2 text-sm text-slate-600">
              <p>Gole ka Mandir ,  Gwalior, MadhyePradesh Pradesh</p>
              <p>829991034</p>
              <p>satiyamShrivas@gmail.com</p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200 h-64">
            <iframe
              title="Clinic location"
              src="https://www.google.com/maps?q=Gomti+Nagar+Lucknow&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
            />
          </div>

          <div className="bg-emerald-100/60 rounded-2xl p-5">
            <h3 className="font-bold text-slate-900 mb-1">Clinic Hours</h3>
            <p className="text-sm text-slate-600">Mon - Sat: 9:00 AM - 6:00 PM</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;