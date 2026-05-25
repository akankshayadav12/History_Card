
import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import Card from '../components/Card';
import SearchBar from '../components/SearchBar';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import DateRange from '../components/DateRange';
import { fmtDate } from '../services/helpers';

export default function Students(){
  const [list, setList] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [q, setQ] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [form, setForm] = useState({ _id:null, name:'', course:'', teacher:'', status:'ongoing' });

const fetchAll = async () => {
  try {
    const [s, c, t] = await Promise.all([
      api.get('/students'),
      api.get('/courses'),
      api.get('/teachers'),
    ]);

    setList(s.data?.students || s.data || []);

    // Ensure courses is always an array
    const fetchedCourses = c.data?.courses ?? c.data ?? [];
    setCourses(Array.isArray(fetchedCourses) ? fetchedCourses : [fetchedCourses]);

    // Ensure teachers is always an array
    const fetchedTeachers = t.data?.teachers ?? t.data ?? [];
    setTeachers(Array.isArray(fetchedTeachers) ? fetchedTeachers : [fetchedTeachers]);

  } catch (e) {
    console.warn('Students API not ready yet. Showing empty list.', e?.message);

    const [c, t] = await Promise.all([api.get('/courses'), api.get('/teachers')]);

    const fetchedCourses = c.data?.courses ?? c.data ?? [];
    setCourses(Array.isArray(fetchedCourses) ? fetchedCourses : [fetchedCourses]);

    const fetchedTeachers = t.data?.teachers ?? t.data ?? [];
    setTeachers(Array.isArray(fetchedTeachers) ? fetchedTeachers : [fetchedTeachers]);

    setList([]);
  }
};

  useEffect(()=>{ fetchAll(); },[]);

  const filtered = useMemo(()=>{
    return list.filter(s => {
      const matchQ = q ? (s.name?.toLowerCase().includes(q.toLowerCase()) || s.status?.toLowerCase().includes(q.toLowerCase())) : true;
      const created = s.createdAt ? new Date(s.createdAt) : null;
      const matchFrom = from ? (created && created >= new Date(from)) : true;
      const matchTo = to ? (created && created <= new Date(to)) : true;
      return matchQ && matchFrom && matchTo;
    });
  },[list,q,from,to]);

  const columns = [
    { key:'name', label:'Name' },
    { key:'course', label:'Course', render: (v)=> (typeof v==='object' && v?.name) ? v.name : (courses.find(c=>c._id===v)?.name || '-') },
    { key:'teacher', label:'Teacher', render: (v)=> (typeof v==='object' && v?.name) ? v.name : (teachers.find(t=>t._id===v)?.name || '-') },
    { key:'status', label:'Status', render: (v)=> <span className="chip">{v}</span> },
    { key:'createdAt', label:'Created', render: v => fmtDate(v) },
  ];
useEffect(() => {
  const fetchHCR = async () => {
    const studentId = localStorage.getItem("userId");
    const res = await api.get(`/hcr/student/${studentId}`);
    setHCR(res.data.hcr);
  };
  // if(role === "student") fetchHCR();
}, []);

  const openNew = () => { setForm({_id:null, name:'', course: courses[0]?._id || '', teacher: teachers[0]?._id || '', status:'ongoing'}); setOpen(true); };
  const save = async (e) => {
    e.preventDefault();
    const payload = { name: form.name, course: form.course, teacher: form.teacher, status: form.status };
    if(form._id){
      await api.put(`/students/${form._id}`, payload);
    } else {
      await api.post('/students', payload);
    }
    setOpen(false); await fetchAll();
  };
  const onEdit = (row)=>{ setForm({...row, course: row.course?._id || row.course, teacher: row.teacher?._id || row.teacher}); setOpen(true); };
  const onDelete = (row)=>{ setForm(row); setConfirm(true); };
  const doDelete = async ()=>{
    await api.delete(`/students/${form._id}`);
    setConfirm(false); await fetchAll();
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between gap-3">
          <SearchBar value={q} onChange={setQ} placeholder="Search students by name or status">
            <DateRange from={from} to={to} setFrom={setFrom} setTo={setTo}/>
            <button className="btn" onClick={openNew}>Add Student</button>
          </SearchBar>
        </div>
      </Card>
      <Card>
        <DataTable columns={columns} rows={filtered} onEdit={onEdit} onDelete={onDelete}/>
      </Card>

      <Modal open={open} onClose={()=>setOpen(false)} title={form._id ? 'Edit Student' : 'Add Student'}>
        <form onSubmit={save} className="space-y-3">
          <div>
            <label className="text-sm opacity-80">Name</label>
            <input className="input mt-1" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required/>
          </div>
          <div>
            <label className="text-sm opacity-80">Course</label>
            <select className="input mt-1" value={form.course} onChange={e=>setForm({...form, course:e.target.value})}>
              {courses.map(c=> <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm opacity-80">Teacher</label>
            <select className="input mt-1" value={form.teacher} onChange={e=>setForm({...form, teacher:e.target.value})}>
              {teachers.map(t=> <option key={t._id} value={t._id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm opacity-80">Status</label>
            <select className="input mt-1" value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="dropped">Dropped</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="px-3 py-2 rounded-xl bg-white/10" onClick={()=>setOpen(false)}>Cancel</button>
            <button className="btn" type="submit">Save</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={confirm} onClose={()=>setConfirm(false)} onConfirm={doDelete}
        title="Delete student?" description={`This will remove ${form.name}.`}/>
    </div>
  )
}
