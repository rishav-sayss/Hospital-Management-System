const TESTIMONIALS = [
  {
    name: "Ananya Verma",
    role: "Patient, Cardiology",
    quote:
      "Booked a same-day slot with Dr. Mehta from my phone during lunch break. No calls, no waiting room chaos — just showed up at my time.",
  },
  {
    name: "Rohit Saxena",
    role: "Patient, Pediatrics",
    quote:
      "My daughter needed a pediatrician urgently on a Sunday. Found one available within the hour through MediCare and got an instant confirmation.",
  },
  {
    name: "Priya Nair",
    role: "Patient, Dermatology",
    quote:
      "The reminder texts actually work — I haven't missed a follow-up in six months. Small thing, but it's changed how I manage my treatment.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">What patients are saying</h2>
          <p className="text-slate-500">Real experiences from people who've booked through MediCare.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-2xl border border-slate-200 p-6 bg-slate-50">
              <div className="flex gap-1 text-amber-400 mb-4" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="text-slate-700 text-sm leading-relaxed mb-6">"{t.quote}"</p>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                <p className="text-slate-500 text-xs">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;