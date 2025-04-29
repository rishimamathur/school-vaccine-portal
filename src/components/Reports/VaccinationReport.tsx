import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { Spinner, Table, Button, Form } from 'react-bootstrap';

interface VaccinationEntry {
  studentId: number;
  studentName: string;
  class: string;
  vaccine: string;
  date: string;
}

interface VaccinationMaster {
  vaccine_ID: number;
  vaccine_Name: string;
}

const VaccinationReport: React.FC = () => {
  const [entries, setEntries] = useState<VaccinationEntry[]>([]);
  const [vaccines, setVaccines] = useState<VaccinationMaster[]>([]);
  const [filterVaccine, setFilterVaccine] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;
  const [loading, setLoading] = useState(false);

  const fetchVaccines = async () => {
    try {
      const res = await axios.get('/vaccination');
      setVaccines(res.data);
    } catch (err) {
      console.error('Failed to fetch vaccines');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/report/vaccinations', {
        params: {
          vaccineName: filterVaccine,
          page,
          pageSize,
        },
      });

      const result = res.data.results.map((entry: any) => ({
        studentId: entry.student_ID,
        studentName: `${entry.first_Name} ${entry.last_Name}`,
        class: entry.class,
        vaccine: entry.vaccine_Name,
        date: new Date(entry.vaccinated_On).toLocaleDateString(),
      }));

      setEntries(result);
      setTotalCount(res.data.totalCount);
    } catch {
      console.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format: string) => {
    try {
      const response = await axios.get(`/report/vaccinations/download?format=${format}`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `VaccinationReport.${format === 'excel' ? 'xlsx' : format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  useEffect(() => {
    fetchVaccines();
  }, []);

  useEffect(() => {
    fetchData();
  }, [filterVaccine, page]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">📄 Vaccination Report</h2>

      <div className="row mb-4">
        <div className="col-md-4">
          <Form.Select value={filterVaccine} onChange={(e) => setFilterVaccine(e.target.value)}>
            <option value="">Filter by Vaccine</option>
            {vaccines.map((v) => (
              <option key={v.vaccine_ID} value={v.vaccine_Name}>
                {v.vaccine_Name}
              </option>
            ))}
          </Form.Select>
        </div>

        <div className="col-md-8 text-end">
          <button className="me-2 btn btn-outline-primary" onClick={() => handleDownload('csv')}>Download CSV</button>
          <button className="me-2 btn btn-outline-success" onClick={() => handleDownload('excel')}>Download Excel</button>
          <button className="btn btn-outline-danger" onClick={() => handleDownload('pdf')}>Download PDF</button>
        </div>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : entries.length === 0 ? (
        <div className="alert alert-info">No records found.</div>
      ) : (
        <>
          <Table bordered striped hover>
            <thead className="table-primary">
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Class</th>
                <th>Vaccine</th>
                <th>Vaccination Date</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, idx) => (
                <tr key={idx}>
                  <td>{e.studentId}</td>
                  <td>{e.studentName}</td>
                  <td>{e.class}</td>
                  <td>{e.vaccine}</td>
                  <td>{e.date}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center">
            <span>
              Page {page} of {Math.ceil(totalCount / pageSize)}
            </span>
            <div>
              <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="me-2">
                Previous
              </Button>
              <Button disabled={page >= totalCount / pageSize} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VaccinationReport;
