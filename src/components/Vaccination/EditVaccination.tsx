import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';

const EditVaccination: React.FC<{ drive: any; onClose: () => void; onSuccess: () => void }> = ({ drive, onClose, onSuccess }) => {
    const [form, setForm] = useState({
        date_of_Drive: '',
        available_Doses: ''
    });

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (drive) {
            setForm({
                date_of_Drive: drive.date_of_Drive ? drive.date_of_Drive.slice(0, 10) : '',
                available_Doses: drive.available_Doses
            });
        }
    }, [drive]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.put(`/Vaccination/${drive.vaccine_ID}`, {
                vaccine_ID: drive.vaccine_ID,
                vaccine_Name: drive.vaccine_Name,
                date_of_Drive: form.date_of_Drive,
                available_Doses: form.available_Doses,
                applicable_Classes: drive.applicable_Classes
            });
            onSuccess();
        } catch {
            setErrorMessage('Failed to update vaccination drive');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
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
                    value={form.available_Doses}
                    onChange={handleChange}
                    required
                />
            </div>

            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <div className="d-flex justify-content-between mt-3">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-success">
                    Update Drive
                </button>
            </div>
        </form>
    );
};

export default EditVaccination;
