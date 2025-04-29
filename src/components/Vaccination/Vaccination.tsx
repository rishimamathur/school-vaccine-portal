import React, { useState, useRef } from 'react';
import AddVaccination from './AddVaccination';
import VaccinationList from './VaccinationList';
import EditVaccination from './EditVaccination';

const Vaccination: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editDrive, setEditDrive] = useState<any>(null);

  const listRef = useRef<{ fetchDrives: () => void }>(null); 

  const handleAddSuccess = () => {
    setShowAddModal(false);
    listRef.current?.fetchDrives(); 
  };

  const handleEditSuccess = () => {
    setEditDrive(null);
    listRef.current?.fetchDrives(); 
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Vaccination Drives Management</h2>

      <div className="mb-3">
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          ➕ Add New Vaccination Drive
        </button>
      </div>

      <VaccinationList onEdit={setEditDrive} ref={listRef} />

      {showAddModal && (
        <div className="modal show fade d-block" tabIndex={-1}>
          <div className="modal-dialog" role="document">
            <div className="modal-content p-3">
              <h4>Create New Vaccination Drive</h4>
              <AddVaccination onSuccess={handleAddSuccess} onClose={() => setShowAddModal(false)} />
            </div>
          </div>
        </div>
      )}

      {editDrive && (
        <div className="modal show fade d-block" tabIndex={-1}>
          <div className="modal-dialog" role="document">
            <div className="modal-content p-3">
              <h4>Edit Vaccination Drive</h4>
              <EditVaccination drive={editDrive} onSuccess={handleEditSuccess} onClose={() => setEditDrive(null)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vaccination;
