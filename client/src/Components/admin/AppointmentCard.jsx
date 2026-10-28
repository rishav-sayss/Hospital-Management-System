import { CalendarDays } from "lucide-react";

const AppointmentCard = ({ appointment }) => {
  const patient = appointment.patient;
  const details = appointment.patientDetails;

  const patientName =
    patient?.name || details?.name || "Unknown Patient";

  const status = appointment.status || "PENDING";

  return (
    <article className="flex min-w-0 flex-col rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <h3 className="mb-3 break-words text-lg font-medium text-emerald-950">
        {patientName}
      </h3>

      <p className="mb-1 break-words text-sm text-teal-700">
        {details?.age ? `${details.age} yrs` : ""}
        {details?.gender ? ` : ${details.gender}` : ""}
        {details?.phone ? ` : ${details.phone}` : ""}
      </p>

      <p className="break-words text-sm text-teal-800">
        {appointment.doctor?.user?.name
          ? `${appointment.doctor.user.name} : `
          : ""}
        {appointment.doctor?.specialization || ""}
      </p>

      <div className="mt-4">
        <p className="text-sm font-semibold text-emerald-900">
          Fees
        </p>

        <p className="mt-1 text-xl font-bold text-emerald-950">
          ₹ {appointment.fee ?? 0}
        </p>
      </div>

      <div className="mt-4 flex w-fit max-w-full items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs text-teal-700">
        <CalendarDays size={15} className="shrink-0" />

        <span className="break-words">
          {appointment.date} — {appointment.time}
        </span>
      </div>

      <div className="mt-4">
        <span
          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-medium ${
            status.toLowerCase() === "cancelled" ||
            status.toLowerCase() === "canceled"
              ? "bg-rose-50 text-rose-700"
              : status.toLowerCase() === "completed"
                ? "bg-emerald-50 text-emerald-800"
                : "bg-amber-50 text-amber-800"
          }`}
        >
          {status.toUpperCase()}
        </span>
      </div>
    </article>
  );
};

export default AppointmentCard;