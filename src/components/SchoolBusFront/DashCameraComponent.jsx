import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./SchoolBus.css";

export default function DashCameraComponent() {
  const [simCardHistory, setSimCardHistory] = useState("");
  const [showModal, setShowModal] = useState(false);

  const cameralist = [
    {
      name: 1,
      DRID: "TOM512",
      IMEI: 5555555,
      simCardNumber: 1234,
      simCardHistory: "firstHistory",
    },
    {
      name: 2,
      DRID: "TOM513",
      IMEI: 6666666,
      simCardNumber: 8901260703410,
      simCardHistory: "secondHistory",
    },
    {
      name: 3,
      DRID: "TOM514",
      IMEI: 7777777,
      simCardNumber: 890126070341012,
      simCardHistory: "thirdHistory",
    },
    {
      name: 4,
      DRID: "FB515",
      IMEI: 888888,
      simCardNumber: 890126070341012,
      simCardHistory: "fourthHistory",
    },
  ];

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
            {cameralist.map((element) => (
              <tr key={element.name}>
                <td>{element.name}</td>
                <td>{element.DRID}</td>
                <td>{element.IMEI}</td>
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
