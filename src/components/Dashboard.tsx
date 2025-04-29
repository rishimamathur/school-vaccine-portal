import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Spinner } from 'react-bootstrap';

interface VaccinationDrive {
  id: number;
  vaccineName: string;
  date: string;
}

interface DashboardSummary {
  totalStudents: number;
  vaccinatedCount: number;
  vaccinatedPercent: number;
  upcomingDrives: VaccinationDrive[];
}

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/dashboard')
      .then((res) => setSummary(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">📊 Dashboard</h2>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card border-primary shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title text-primary">
                <i className="bi bi-people-fill me-2"></i>Total Students
              </h5>
              <h3>{summary?.totalStudents ?? 0}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-success shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title text-success">
                <i className="bi bi-shield-check me-2"></i>Vaccinated
              </h5>
              <h3>
                {summary?.vaccinatedCount ?? 0}{' '}
                <span className="badge bg-success ms-2">
                  {summary?.vaccinatedPercent ?? 0}%
                </span>
              </h3>
            </div>
          </div>
        </div>
      </div>

      <h4 className="mb-3">
        <i className="bi bi-calendar-event me-2"></i>Upcoming Vaccination Drives
      </h4>
      {summary?.upcomingDrives?.length === 0 ? (
        <div className="alert alert-info">No upcoming drives</div>
      ) : (
        <div className="list-group">
          {summary?.upcomingDrives?.map((drive) => (
            <div key={drive.id} className="list-group-item list-group-item-action">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">{drive.vaccineName}</h6>
                  <small className="text-muted">
                    Scheduled on {new Date(drive.date).toLocaleDateString()}
                  </small>
                </div>
                <span className="badge bg-primary">Drive #{drive.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
