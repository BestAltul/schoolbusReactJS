import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SchoolBus.css";
const BASE_URL = "http://localhost:8080/api/v3/schoolbus-management";

export default function BusListComponent() {
  // const today = new Date();
  // const targetDate = new Date(
  //   today.getFullYear() + 12,
  //   today.getMonth(),
  //   today.getDay()
  // );

  const [selectedBus, setSelectedBus] = useState(null);
  const [buslist, setBusList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchBusList = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v3/schoolbus-management"
      );
      console.log(" My data: ", response.data);
      setBusList(response.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusList();
  }, []);

  const handleAddBus = () => {
    navigate("/new_bus");
  };

  // const handleDeleteBus = () => {
  //   alert("Select a bus to delete");
  // };

  const handleDeleteBus = async (name) => {
    try {
      await axios.patch(`${BASE_URL}/${name}/mark-for-deletion`);
      alert("Bus marked for deletion!");
      fetchBusList(); // Обновляет список автобусов после удаления
    } catch (err) {
      alert("Error marking bus for deletion: " + err.message);
    }
  };

  return (
    <div className="container">
      <h1>List of buses</h1>

      <div className="panel">
        <button className="btn btn-primary" onClick={handleAddBus}>
          Add New Bus
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            if (selectedBus) {
              navigate(`/edit/${selectedBus.name}`);
            } else {
              alert("Please select a bus to edit.");
            }
          }}
        >
          Edit Bus
        </button>
        <button
          className="btn btn-danger"
          onClick={() => {
            if (selectedBus) {
              handleDeleteBus(selectedBus.name);
            } else {
              alert("Please select a bus to delete.");
            }
          }}
        >
          Delete Bus
        </button>
      </div>

      <div>
        <table className="table table-hover">
          <thead>
            <tr>
              <td>Number</td>
              <td>Terminal</td>
              <td>Dash camera</td>
              <td>Radio</td>
            </tr>
          </thead>
          <tbody>
            {buslist.map((element) => (
              <tr
                key={element.name}
                onClick={() => {
                  setSelectedBus(element);
                  console.log("Selected row:", element);
                }}
                className={
                  selectedBus?.name === element.name ? "smtc-selected-row" : ""
                }
                style={{
                  cursor: "pointer",
                  textDecoration: element.markedForDeletion
                    ? "line-through"
                    : "none",
                  color: element.markedForDeletion ? "gray" : "inherit",
                }}
              >
                <td>{element.name || "Not available"}</td>
                <td>{element.terminal || "Not available"}</td>
                <td>
                  {(element.dashCamDTO && element.dashCamDTO.name) ||
                    "Not available"}
                </td>
                <td>
                  {(element.radioDTO && element.radioDTO.name) ||
                    "Not available"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
