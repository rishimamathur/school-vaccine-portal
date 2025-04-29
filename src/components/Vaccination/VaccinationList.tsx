import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import axios from '../../api/axios';

const VaccinationList = forwardRef(({ onEdit }: { onEdit: (drive: any) => void }, ref) => {
  const [drives, setDrives] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  useImperativeHandle(ref, () => ({ fetchDrives }));

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = () => {
    axios.get('/Vaccination')
      .then((res) => {
        const sorted = res.data.sort((a: any, b: any) =>
          new Date(a.date_of_Drive).getTime() - new Date(b.date_of_Drive).getTime()
        );
        setDrives(sorted);
      })
      .catch(() => setErrorMessage('Failed to fetch vaccination drives'));
  };

  const today = new Date();

  return (
    <div className="row">
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      {drives.length === 0 ? (
        <div className="alert alert-info">No vaccination drives scheduled.</div>
      ) : (
        drives.map((drive) => {
          const driveDate = new Date(drive.date_of_Drive);
          const editable = driveDate >= today;

          return (
            <div className="col-md-4 mb-4" key={drive.vaccine_ID}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{drive.vaccine_Name}</h5>
                  <p className="card-text">📅 Date: { drive.date_of_Drive.slice(0, 10) }</p>
                  <p className="card-text">💉 Doses Available: {drive.available_Doses}</p>
                  <p className="card-text">🎓 Grades: {drive.applicable_Classes}</p>
                  {editable && (
                    <button className="btn btn-warning btn-sm" onClick={() => onEdit(drive)}>
                      ✏️ Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
});

export default VaccinationList;
