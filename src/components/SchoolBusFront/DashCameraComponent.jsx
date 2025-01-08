import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./SchoolBus.css";
import useFetch from "../hooks/useFetchDashCameras";

const BASE_URL_dashcam = "http://localhost:8080/api/v3/dashcam-management";

export default function DashCameraComponent() {
  const [simCardHistory, setSimCardHistory] = useState("");
  const [showModal, setShowModal] = useState(false);

  const { data: dashCameras, loading, error } = useFetch(BASE_URL_dashcam);

  const handleSimCardHistory = (content) => {
    setSimCardHistory(content);
    setShowModal(true);
  };

  const handleCloseModal = (contest) => {
    setShowModal(false);
  };

  return (
    <div>
      <h1>Dash cameras</h1>
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
              <tr key={element.name}>
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
