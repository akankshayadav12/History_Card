
import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import DateRange from '../components/DateRange';
import { fmtDate } from '../services/helpers';

export default function Teachers(){
  const [list, setList] = useState([]);
  const [q, setQ] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [form, setForm] = useState({ _id:null, name:'', status:'active' });

const fetchAll = async () => {
  try {
    const { data } = await api.get('/teachers');
    const fetched = data?.teachers ?? [];
    setList(Array.isArray(fetched) ? fetched : [fetched]);
  } catch (err) {
    console.error('Failed to fetch teachers:', err.message);
    setList([]);
  }
};
useEffect(() => {
  const fetchStudents = async () => {
    const res = await api.get("/students/faculty");
    setStudents(res.data.students);
  };
  // if(role === "faculty") fetchStudents();
}, []);


  useEffect(()=>{ fetchAll(); },[]);

const filtered = useMemo(() => {
  if (!Array.isArray(list)) return [];
  return list.filter(t => {
    const matchQ = q ? (t.name?.toLowerCase().includes(q.toLowerCase()) || t.status?.toLowerCase().includes(q.toLowerCase())) : true;
    const created = t.createdAt ? new Date(t.createdAt) : null;
    const matchFrom = from ? (created && created >= new Date(from)) : true;
    const matchTo = to ? (created && created <= new Date(to)) : true;
    return matchQ && matchFrom && matchTo;
  });
}, [list, q, from, to]);

  const columns = [
    { key:'name', label:'Name' },
    { key:'status', label:'Status', render: (v)=> <span className="chip">{v}</span> },
    { key:'createdAt', label:'Created', render: v => fmtDate(v) },
  ];

  const openNew = () => { setForm({_id:null, name:'', status:'active'}); setOpen(true); };
  const save = async (e) => {
    e.preventDefault();
    if(form._id){
      await api.put(`/teachers/${form._id}`, { name: form.name, status: form.status });
    } else {
      await api.post('/teachers', { name: form.name, status: form.status });
    }
    setOpen(false); await fetchAll();
  };
const onEdit = (row) => {
  // Ensure form gets the original object including status
  setForm({
    _id: row._id,
    name: row.name,
    status: row.status || 'active',
  });
  setOpen(true);
};

  const onDelete = (row)=>{ setForm(row); setConfirm(true); };
  const doDelete = async ()=>{
    await api.delete(`/teachers/${form._id}`);
    setConfirm(false); await fetchAll();
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between gap-3">
          <SearchBar value={q} onChange={setQ} placeholder="Search teachers by name or status">
            <DateRange from={from} to={to} setFrom={setFrom} setTo={setTo}/>
            <button className="btn" onClick={openNew}>Add Teacher</button>
          </SearchBar>
        </div>
      </Card>
      <Card>
        <DataTable columns={columns} rows={filtered} onEdit={onEdit} onDelete={onDelete}/>
      </Card>

      <Modal open={open} onClose={()=>setOpen(false)} title={form._id ? 'Edit Teacher' : 'Add Teacher'}>
        <form onSubmit={save} className="space-y-3">
          <div>
            <label className="text-sm opacity-80">Name</label>
            <input className="input mt-1" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required/>
          </div>
          <div>
            <label className="text-sm opacity-80">Status</label>
           <select
  className="input mt-1"
  value={form.status}
  onChange={e => setForm({ ...form, status: e.target.value })}
>
  <option value="active">Active</option>
  <option value="inactive">Inactive</option>
</select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="px-3 py-2 rounded-xl bg-white/10" onClick={()=>setOpen(false)}>Cancel</button>
            <button className="btn" type="submit">Save</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={confirm} onClose={()=>setConfirm(false)} onConfirm={doDelete}
        title="Delete teacher?" description={`This will remove ${form.name}.`}/>
    </div>
  )
}
