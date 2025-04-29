import React, { useState } from 'react';
import axios from '../../api/axios';

const AddVaccination: React.FC<{ onClose: () => void; onSuccess: () => void }> = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    vaccine_Name: '',
    date_of_Drive: '',
    available_Doses: '',
    applicable_Classes: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/Vaccination', form);
      onSuccess(); // Refresh list + close modal
    } catch {
      setErrorMessage('Failed to create vaccination drive');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Vaccine Name</label>
        <input
          name="vaccine_Name"
          className="form-control"
          placeholder="Enter vaccine name"
          value={form.vaccine_Name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Date of Drive</label>
        <input
          name="date_of_Drive"
          type="date"
          className="form-control"
          value={form.date_of_Drive}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Available Doses</label>
        <input
          name="available_Doses"
          type="number"
          className="form-control"
          placeholder="Enter number of doses"
          value={form.available_Doses}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Applicable Grades</label>
        <input
          name="applicable_Classes"
          className="form-control"
          placeholder="Example: 5-7"
          value={form.applicable_Classes}
          onChange={handleChange}
          required
        />
      </div>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <div className="d-flex justify-content-between mt-3">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save Drive
        </button>
      </div>
    </form>
  );
};

export default AddVaccination;
