import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';

const AddStudentModal: React.FC<{ onSuccess: () => void; onClose: () => void }> = ({ onSuccess, onClose }) => {
  const [form, setForm] = useState({
    first_Name: '',
    last_Name: '',
    class: '',
    vaccine_ID: '',
    vaccination_Date: '',
    vaccination_Status: false
  });
  const [vaccines, setVaccines] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    axios.get('/Vaccination')
      .then(res => setVaccines(res.data))
      .catch(() => setErrorMessage('Failed to load vaccines'));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    const { name, value } = e.target;

    if (name === 'vaccine_ID') {
      const selectedVaccine = vaccines.find(v => v.vaccine_ID === parseInt(value));
      if (selectedVaccine) {
        setForm(prevState => ({
          ...prevState,
          vaccination_Date: selectedVaccine.date_of_Drive.slice(0, 10) || '',
          vaccination_Status: true
        }));
      } else {
        setForm(prevState => ({
          ...prevState,
          vaccination_Date: '',
          vaccination_Status: false
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      vaccine_ID: form.vaccine_ID ? parseInt(form.vaccine_ID) : null,
      vaccination_Date: form.vaccination_Date ? form.vaccination_Date : null,
    };
    try {
      await axios.post('/Student', payload);
      onSuccess();
    } catch {
      setErrorMessage('Failed to add student.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">First Name</label>
        <input name="first_Name" className="form-control" value={form.first_Name} onChange={handleChange} required />
      </div>

      <div className="mb-3">
        <label className="form-label">Last Name</label>
        <input name="last_Name" className="form-control" value={form.last_Name} onChange={handleChange} required />
      </div>

      <div className="mb-3">
        <label className="form-label">Class</label>
        <input name="class" className="form-control" value={form.class} onChange={handleChange} required />
      </div>

      <div className="mb-3">
        <label className="form-label">Select Vaccine</label>
        <select name="vaccine_ID" className="form-select" value={form.vaccine_ID} onChange={handleChange}>
          <option value="">-- No Vaccine Selected --</option>
          {vaccines.map(v => (
            <option key={v.vaccine_ID} value={v.vaccine_ID}>
              {v.vaccine_Name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Vaccination Date</label>
        <input name="vaccination_Date" type="date" className="form-control" value={form.vaccination_Date} onChange={handleChange} disabled />
      </div>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <div className="d-flex justify-content-between mt-3">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary">Add Student</button>
      </div>
    </form>
  );
};

export default AddStudentModal;
