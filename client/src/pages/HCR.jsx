
import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import DateRange from '../components/DateRange';
import { fmtDate } from '../services/helpers';

export default function HCR(){
  const [list, setList] = useState([]);
  const [students, setStudents] = useState([]);
  const [q, setQ] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [form, setForm] = useState({ _id:null, student:'', topic:'', description:'' });

 const fetchAll = async () => {
  try {
    const [r, s] = await Promise.all([
      api.get('/hcr'),      // GET HCRs
      api.get('/students')  // GET students (optional, for lookup)
    ]);
    setList(r.data?.records || []); // use r.data.records
    setStudents(s.data?.students || []); // optional
  } catch (e) {
    console.warn('HCR or Students API not ready yet.', e?.message);
    setList([]);
    try {
      const s = await api.get('/students'); 
      setStudents(s.data?.students || []);
    } catch {}
  }
};

  useEffect(()=>{ fetchAll(); },[]);

  const filtered = useMemo(()=>{
    return list.filter(r => {
      const matchQ = q ? ((r.topic||'').toLowerCase().includes(q.toLowerCase()) || (r.description||'').toLowerCase().includes(q.toLowerCase())) : true;
      const created = r.createdAt ? new Date(r.createdAt) : null;
      const matchFrom = from ? (created && created >= new Date(from)) : true;
      const matchTo = to ? (created && created <= new Date(to)) : true;
      return matchQ && matchFrom && matchTo;
    });
  },[list,q,from,to]);

const columns = [
  {
    key: 'student',
    label: 'Student',
    render: (v) => {
      if (!v) return '-';
      // Case 1: populated student object
      if (typeof v === 'object') return v.name || '-';
      // Case 2: just an ID string, so lookup in students[]
      return students.find(s => s._id === v)?.name || '-';
    }
  },
  { key: 'topic', label: 'Topic' },
  { key: 'description', label: 'Description' },
  { key: 'createdAt', label: 'Created', render: v => fmtDate(v) },
];


  const openNew = () => { setForm({_id:null, student: students[0]?._id || '', topic:'', description:''}); setOpen(true); };
  const save = async (e) => {
    e.preventDefault();
    const payload = { student: form.student, topic: form.topic, description: form.description };
    if(form._id){
      await api.put(`/hcr/${form._id}`, payload);
    } else {
      await api.post('/hcr', payload);
    }
    setOpen(false); await fetchAll();
  };
  const onEdit = (row)=>{ setForm({...row, student: row.student?._id || row.student}); setOpen(true); };
  const onDelete = (row)=>{ setForm(row); setConfirm(true); };
  const doDelete = async ()=>{
    await api.delete(`/hcr/${form._id}`);
    setConfirm(false); await fetchAll();
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between gap-3">
          <SearchBar value={q} onChange={setQ} placeholder="Search by topic/description">
            <DateRange from={from} to={to} setFrom={setFrom} setTo={setTo}/>
            <button className="btn" onClick={openNew}>Add Record</button>
          </SearchBar>
        </div>
      </Card>
      <Card>
        <DataTable columns={columns} rows={filtered} onEdit={onEdit} onDelete={onDelete}/>
      </Card>

      <Modal open={open} onClose={()=>setOpen(false)} title={form._id ? 'Edit Record' : 'Add Record'}>
        <form onSubmit={save} className="space-y-3">
          <div>
            <label className="text-sm opacity-80">Student</label>
            <select className="input mt-1" value={form.student} onChange={e=>setForm({...form, student:e.target.value})}>
              {students.map(s=> <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm opacity-80">Topic</label>
            <input className="input mt-1" value={form.topic} onChange={e=>setForm({...form, topic:e.target.value})} required/>
          </div>
          <div>
            <label className="text-sm opacity-80">Description</label>
            <textarea className="input mt-1 min-h-[100px]" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} required/>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="px-3 py-2 rounded-xl bg-white/10" onClick={()=>setOpen(false)}>Cancel</button>
            <button className="btn" type="submit">Save</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={confirm} onClose={()=>setConfirm(false)} onConfirm={doDelete}
        title="Delete record?" description={`This will remove ${form.topic}.`}/>
    </div>
  )
}
