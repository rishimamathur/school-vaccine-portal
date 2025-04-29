import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import axios from '../../api/axios';

const StudentList = forwardRef(({ onEdit }: { onEdit: (student: any) => void }, ref) => {
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useImperativeHandle(ref, () => ({ fetchStudents }));

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    axios.get('/Student')
      .then(res => setStudents(res.data))
      .catch(console.error);
  };

  const filteredStudents = students.filter(s =>
    s.first_Name.toLowerCase().includes(search.toLowerCase()) ||
    s.last_Name.toLowerCase().includes(search.toLowerCase()) ||
    (s.class?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (s.student_ID?.toString() || '').includes(search)
  );

  return (
    <div className="mt-4">
      <input
        className="form-control mb-3"
        placeholder="Search by Name, Class, ID, or Vaccination Status"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Class</th>
              <th>Vaccinated</th>
              <th>Vaccination Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s) => (
              <tr key={s.student_ID}>
                <td>{s.student_ID}</td>
                <td>{s.first_Name} {s.last_Name}</td>
                <td>{s.class}</td>
                <td>
                  <span className={`badge ${s.vaccination_Status ? 'bg-success' : 'bg-danger'}`}>
                    {s.vaccination_Status ? 'Yes' : 'No'}
                  </span>
                </td>
                <td>{s.vaccination_Date ? s.vaccination_Date.slice(0, 10) : '-'}</td>
                <td>
                  <button className="btn btn-warning btn-sm" onClick={() => onEdit(s)}>
                    ✏️ Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default StudentList;
