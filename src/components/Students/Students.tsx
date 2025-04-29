import React, { useState, useRef } from 'react';
import AddStudentModal from './AddStudentModal';
import BulkUploadModal from './BulkUploadModal';
import StudentList from './StudentList';
import EditStudentModal from './EditStudentModal';

const Students: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [editStudent, setEditStudent] = useState<any>(null);

  const listRef = useRef<{ fetchStudents: () => void }>(null);

  const handleAddSuccess = () => {
    setShowAddModal(false);
    listRef.current?.fetchStudents();
  };

  const handleBulkUploadSuccess = () => {
    setShowBulkUploadModal(false);
    listRef.current?.fetchStudents();
  };

  const handleEditSuccess = () => {
    setEditStudent(null);
    listRef.current?.fetchStudents();
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Student Management</h2>

      <div className="mb-3">
        <button className="btn btn-primary me-2" onClick={() => setShowAddModal(true)}>
          ➕ Add Student
        </button>
        <button className="btn btn-secondary" onClick={() => setShowBulkUploadModal(true)}>
          📂 Bulk Upload Students
        </button>
      </div>

      <StudentList onEdit={setEditStudent} ref={listRef} />

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="modal show fade d-block" tabIndex={-1}>
          <div className="modal-dialog" role="document">
            <div className="modal-content p-3">
              <h4>Add New Student</h4>
              <AddStudentModal onSuccess={handleAddSuccess} onClose={() => setShowAddModal(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkUploadModal && (
        <div className="modal show fade d-block" tabIndex={-1}>
          <div className="modal-dialog" role="document">
            <div className="modal-content p-3">
              <h4>Bulk Upload Students</h4>
              <BulkUploadModal onSuccess={handleBulkUploadSuccess} onClose={() => setShowBulkUploadModal(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editStudent && (
        <div className="modal show fade d-block" tabIndex={-1}>
          <div className="modal-dialog" role="document">
            <div className="modal-content p-3">
              <h4>Edit Student Details</h4>
              <EditStudentModal student={editStudent} onSuccess={handleEditSuccess} onClose={() => setEditStudent(null)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
