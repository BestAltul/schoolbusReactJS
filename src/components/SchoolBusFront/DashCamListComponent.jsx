import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./SchoolBus.css";
import useFetch from "../hooks/useFetchDashcams";

const BASE_URL_dashcam = "http://localhost:8080/api/v3/dashcam-management";

export default function DashCameraComponent() {
  const [simCardHistory, setSimCardHistory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [selectedDashcam, setSelectedDashcam] = useState(null);

  const { data: dashCameras, loading, error } = useFetch(BASE_URL_dashcam);

  const handleSimCardHistory = (content) => {
    setSimCardHistory(content);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddDashcam = () => {
    navigate("/new_dashcam");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error occurred: {error.message}</p>;
  }

  return (
    <div>
      <h1>Dash cameras</h1>

      <div className="panel">
        <button className="btn btn-primary" onClick={handleAddDashcam}>
          Add New dashcam
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            if (selectedDashcam) {
              navigate(`/dashcam-edit/${selectedDashcam.name}`);
            } else {
              alert("Please select a dashcam to edit.");
            }
          }}
        >
          Edit Dashcam
        </button>
        <button
          className="btn btn-danger"
          onClick={() => {
            if (selectedDashcam) {
              //handleDeleteDashcam(selectedDashcam.name);
            } else {
              alert("Please select a dashcam to delete.");
            }
          }}
        >
          Delete Dashcam
        </button>
      </div>
      <div>
        <table className="table smtc-table-hover">
          <thead>
            <tr>
              <td>Name</td>
              <td>DRID</td>
              <td>IMEI</td>
              <td>Sim Card number</td>
              <td>Sim Card history</td>
            </tr>
          </thead>
          <tbody>
            {dashCameras.map((element) => (
              <tr
                key={element.drid}
                onClick={() => {
                  setSelectedDashcam(element);
                }}
              >
                <td>{element.name}</td>
                <td>{element.drid}</td>
                <td>{element.imei}</td>
                <td
                  onClick={() =>
                    handleSimCardHistory(`Sim card: ${element.simCardHistory}`)
                  }
                >
                  {element.simCardHistory}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>{simCardHistory}</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
