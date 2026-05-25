
import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { fmtDate } from '../services/helpers';

export default function Courses(){
  const [list, setList] = useState([]);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [form, setForm] = useState({ _id:null, name:'', topics:'' });

  const fetchAll = async () => {
    const { data } = await api.get('/courses');
    setList(data?.courses || data || []);
  };
  useEffect(()=>{ fetchAll(); },[]);

const filtered = useMemo(() => {
  return list.filter(c => {
    if (!q) return true;

    const query = q.toLowerCase();

    const nameMatch = c.name?.toLowerCase().includes(query);

    // if topics is array, join them; if string, just use it
    const topicsStr = Array.isArray(c.topics) ? c.topics.join(', ') : (c.topics || '');
    const topicsMatch = topicsStr.toLowerCase().includes(query);

    return nameMatch || topicsMatch;
  });
}, [list, q]);


  const columns = [
    { key:'name', label:'Name' },
    { key:'topics', label:'Topics' },
    { key:'createdAt', label:'Created', render: v => fmtDate(v) },
  ];

  const openNew = () => { setForm({_id:null, name:'', topics:''}); setOpen(true); };
  const save = async (e) => {
    e.preventDefault();
    const payload = { name: form.name, topics: form.topics };
    if(form._id){
      await api.put(`/courses/${form._id}`, payload);
    } else {
      await api.post('/courses', payload);
    }
    setOpen(false); await fetchAll();
  };
  const onEdit = (row)=>{ setForm(row); setOpen(true); };
  const onDelete = (row)=>{ setForm(row); setConfirm(true); };
  const doDelete = async ()=>{
    await api.delete(`/courses/${form._id}`);
    setConfirm(false); await fetchAll();
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between gap-3">
          <SearchBar value={q} onChange={setQ} placeholder="Search courses by name or topic">
            <button className="btn" onClick={openNew}>Add Course</button>
          </SearchBar>
        </div>
      </Card>
      <Card>
        <DataTable columns={columns} rows={filtered} onEdit={onEdit} onDelete={onDelete}/>
      </Card>

      <Modal open={open} onClose={()=>setOpen(false)} title={form._id ? 'Edit Course' : 'Add Course'}>
        <form onSubmit={save} className="space-y-3">
          <div>
            <label className="text-sm opacity-80">Name</label>
            <input className="input mt-1" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required/>
          </div>
          <div>
            <label className="text-sm opacity-80">Topics (comma separated)</label>
            <input className="input mt-1" value={form.topics} onChange={e=>setForm({...form, topics:e.target.value})}/>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="px-3 py-2 rounded-xl bg-white/10" onClick={()=>setOpen(false)}>Cancel</button>
            <button className="btn" type="submit">Save</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={confirm} onClose={()=>setConfirm(false)} onConfirm={doDelete}
        title="Delete course?" description={`This will remove ${form.name}.`}/>
    </div>
  )
}
