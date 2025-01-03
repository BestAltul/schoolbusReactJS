import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BASE_URL = "http://localhost:8080/api/v3/schoolbus-management";

export default function EditBusComponent() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [terminals, setTerminals] = useState([]);

  const [busData, setBusData] = useState({
    number: "",
    terminal: "",
    dashCamera: "",
    radio: "",
    version: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/${name}`);
        setBusData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchBusData();
  }, [name]);

  useEffect(() => {
    const fetchTerminals = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/terminals`);
        setTerminals(response.data);
      } catch (err) {
        console.error("Error fetching terminals:", err);
      }
    };
    fetchTerminals();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`${BASE_URL}/${id}`, busData);
      alert("Bus details updated successfully!");
      navigate("/buses");
    } catch (err) {
      if (err.response && err.response.status === 409) {
        alert(
          "The data has been modified by another user. Please reload the page."
        );
      } else {
        alert("Error updating bus details: " + err.message);
      }
    }
  };

  const handleCancel = () => {
    navigate("/buses");
  };

  if (loading) return <p>Loading bus data...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="container">
      <h1>Edit Bus</h1>
      <form>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Bus Number
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={busData.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="terminal" className="form-label">
            Terminal
          </label>
          <select
            className="form-select"
            id="terminal"
            name="terminal"
            value={busData.terminal}
            onChange={handleChange}
          >
            <option value="">Select Terminal</option>
            {terminals.map((terminal) => (
              <option key={terminal.id} value={terminal.name}>
                {terminal.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="dashCamera" className="form-label">
            Dash Camera
          </label>
          <input
            type="text"
            className="form-control"
            id="dashCamera"
            name="dashCamera"
            value={busData.dashCamera}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="radio" className="form-label">
            Radio
          </label>
          <input
            type="text"
            className="form-control"
            id="radio"
            name="radio"
            value={busData.radio}
            onChange={handleChange}
          />
        </div>
        <button
          type="button"
          className="btn btn-primary me-2"
          onClick={handleSave}
        >
          Save
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
