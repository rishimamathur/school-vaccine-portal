import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';

const EditStudentModal: React.FC<{ student: any; onSuccess: () => void; onClose: () => void }> = ({ student, onSuccess, onClose }) => {
    const [form, setForm] = useState({
        vaccination_Date: '', 
        vaccine_ID: ''
    });
    const [vaccines, setVaccines] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (student) {
            if (student.studentVaccinations.length > 0 && student.studentVaccinations[0].vaccine_ID) {
                setForm({
                    vaccination_Date: student.vaccination_Date ? student.vaccination_Date.slice(0, 10) : '', 
                    vaccine_ID: student.studentVaccinations[0].vaccine_ID
                });
            }
        }

        axios.get('/Vaccination')
            .then(res => setVaccines(res.data))
            .catch(() => setErrorMessage('Failed to load vaccines'));
    }, [student]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Update form state
        setForm(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (name === 'vaccine_ID') {
            const selectedVaccine = vaccines.find(v => v.vaccine_ID === parseInt(value));
            if (selectedVaccine) {
                setForm(prevState => ({
                    ...prevState,
                    vaccination_Date: selectedVaccine.date_of_Drive.slice(0, 10) || '' 
                }));
            } else {
                setForm(prevState => ({
                    ...prevState,
                    vaccination_Date: ''
                }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { studentVaccinations, ...cleanStudent } = student;

        const updatedStudent = {
            ...cleanStudent,
            vaccine_ID: form.vaccine_ID ? parseInt(form.vaccine_ID) : null,
            vaccination_Date: form.vaccination_Date ? form.vaccination_Date : null,
            vaccination_Status: form.vaccine_ID ? true : false
        };

        try {
            await axios.put(`/Student/${student.student_ID}`, updatedStudent);
            onSuccess();
        } catch (error) {
            console.error("Error Response:", error);
            setErrorMessage('Failed to update student.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Select Vaccine</label>
                <select name="vaccine_ID" className="form-select" value={form.vaccine_ID} onChange={handleChange}>
                    <option value="0">-- No Vaccine Selected --</option>
                    {vaccines.map(v => (
                        <option key={v.vaccine_ID} value={v.vaccine_ID}>
                            {v.vaccine_Name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">Vaccination Date</label>
                <input
                    name="vaccination_Date"
                    type="date"
                    className="form-control"
                    value={form.vaccination_Date}
                    onChange={handleChange}
                    disabled 
                />
            </div>

            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <div className="d-flex justify-content-between mt-3">
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-success">Update</button>
            </div>
        </form>
    );
};

export default EditStudentModal;
