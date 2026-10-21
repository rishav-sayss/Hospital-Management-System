import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api/axios';

const empty = { title: '', description: '', location: '', date: '', total_seats: '', price: '', img: '' };

// "2026-12-10 10:00:00" <-> "2026-12-10T10:00"
const toInput = (d) => d.replace(' ', 'T').slice(0, 16);
const toMySQL = (d) => d.replace('T', ' ') + (d.length === 16 ? ':00' : '');

export default function EventForm() {
  const { id } = useParams(); // id hai to edit mode
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return setForm(empty);
    api.get(`/events/${id}`).then((r) => setForm({ ...r.data, date: toInput(r.data.date) }));
  }, [id]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = { ...form, date: toMySQL(form.date) };
      if (id) await api.put(`/events/${id}`, payload);
      else await api.post('/events', payload);
      navigate('/admin/events');
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-black text-emerald-950 mb-6">{id ? 'Edit Event' : 'Add New Event'}</h1>

      <form onSubmit={submit} className="a-card p-8 space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input className="a-input" placeholder="Event title" required value={form.title} onChange={set('title')} />
        <textarea className="a-input" rows={4} placeholder="Description" value={form.description || ''} onChange={set('description')} />
        <div className="grid sm:grid-cols-2 gap-4">
          <input className="a-input" placeholder="Location (city)" required value={form.location} onChange={set('location')} />
          <input className="a-input" type="datetime-local" required value={form.date} onChange={set('date')} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <input className="a-input" type="number" min="1" placeholder="Total seats" required value={form.total_seats} onChange={set('total_seats')} />
          <input className="a-input" type="number" min="0" placeholder="Base price (₹)" required value={form.price} onChange={set('price')} />
        </div>
        <input className="a-input" placeholder="Image URL" value={form.img || ''} onChange={set('img')} />

        {form.img && (
          <motion.img
            key={form.img} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            src={form.img} alt="preview" className="h-44 w-full object-cover rounded-xl"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        )}

        <div className="flex gap-3 pt-2">
          <button className="a-btn flex-1" disabled={saving}>
            {saving ? 'Saving...' : id ? 'Update Event' : 'Create Event'}
          </button>
          <button type="button" onClick={() => navigate('/admin/events')}
            className="flex-1 rounded-xl border border-emerald-300 text-emerald-800 hover:bg-emerald-50 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}