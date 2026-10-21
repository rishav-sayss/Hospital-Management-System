import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axios';
import { formatINR } from '../../utils/pricing';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/bookings').then((r) => setBookings(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    if (!confirm('Is booking ko cancel karna hai? Seats wapas release ho jayengi.')) return;
    try {
      await api.patch(`/bookings/${id}/cancel`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Cancel nahi ho paya');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-black text-emerald-950 mb-6">All Bookings</h1>

      <div className="a-card overflow-x-auto">
        {loading ? (
          <p className="p-8 text-slate-500">Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="p-8 text-slate-500">Abhi tak koi booking nahi.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-emerald-50 text-emerald-900">
              <tr>
                {['ID', 'Event', 'Customer', 'Contact', 'Qty', 'Amount', 'Status', ''].map((h) => (
                  <th key={h} className="p-4 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => (
                <motion.tr
                  key={b.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="border-t border-emerald-100 hover:bg-emerald-50/40"
                >
                  <td className="p-4">#{b.id}</td>
                  <td className="p-4 font-semibold">{b.event_title}</td>
                  <td className="p-4">{b.name}</td>
                  <td className="p-4 text-slate-500">{b.email}<br />{b.mobile}</td>
                  <td className="p-4">{b.quantity}</td>
                  <td className="p-4 font-semibold">{formatINR(b.total_amount)}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                    }`}>{b.status}</span>
                  </td>
                  <td className="p-4">
                    {b.status === 'confirmed' && (
                      <button onClick={() => cancel(b.id)} className="text-red-500 hover:underline">Cancel</button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}