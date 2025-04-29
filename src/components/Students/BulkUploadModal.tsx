import React, { useState } from 'react';
import axios from '../../api/axios';

const BulkUploadModal: React.FC<{ onSuccess: () => void; onClose: () => void }> = ({ onSuccess, onClose }) => {
  const [errorMessage, setErrorMessage] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('/BulkUpload/students/csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onSuccess();
    } catch {
      setErrorMessage('Failed to upload CSV.');
    }
  };

  return (
    <div>
      <div className="mb-3">
        <input type="file" className="form-control" accept=".csv" onChange={handleFile} />
      </div>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <div className="d-flex justify-content-end">
        <button className="btn btn-secondary" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default BulkUploadModal;
