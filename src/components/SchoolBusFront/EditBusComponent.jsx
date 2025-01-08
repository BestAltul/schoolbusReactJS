import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetchDashCameras from "../hooks/useFetchDashCameras";
import useFetchTerminals from "../hooks/useFetchTerminals";

const BASE_URL = "http://localhost:8080/api/v3/schoolbus-management";
const BASE_URL_dashcam = "http://localhost:8080/api/v3/dashcam-management";

export default function EditBusComponent() {
  const { name } = useParams();
  const navigate = useNavigate();

  const [busData, setBusData] = useState({
    name: "",
    terminal: "",
    dashCamera: "",
    radio: "",
    version: "",
  });

  const [originalBusData, setOriginalBusData] = useState({
    number: "",
    terminal: "",
    dashCamera: "",
    radio: "",
    version: "",
  });

  const {
    data: dashCameras,
    loading,
    error,
  } = useFetchDashCameras(BASE_URL_dashcam);

  const {
    data: terminals,
    terminalLoading,
    terminalError,
  } = useFetchTerminals(BASE_URL);

  useEffect(() => {
    const fetchBusData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/${name}`);
        console.log(response.data);
        setBusData(response.data);
        setOriginalBusData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        // setLoading(false);
      }
    };
    fetchBusData();
  }, [name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const updatedFields = getUpdatedFields(originalBusData, busData);

      if (Object.keys(updatedFields).length === 0) {
        alert("No changes detected.");
      }

      //      await axios.patch(`${BASE_URL}/${name}`, updatedFields);
      if (updatedFields.terminal) {
        await axios.patch(`${BASE_URL}/${name}`, {
          terminal: updatedFields.terminal,
        });
      }

      if (updatedFields.dashCamera) {
        await axios.patch(`${BASE_URL}/${name}`, {
          dashCamera: updatedFields.dashCamera,
        });
      }

      alert("Bus details updated successfully!");
      navigate("/bus_list");
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

  const getUpdatedFields = (original, updated) => {
    const changes = {};
    for (const key in updated) {
      if (updated[key] !== original[key]) {
        changes[key] = updated[key];
      }
    }
    return changes;
  };

  const handleCancel = () => {
    navigate("/bus_list");
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
                {terminal}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="dashCamera" className="form-label">
            Dashcam
          </label>
          <select
            className="form-select"
            id="dashCamera"
            name="dashCamera"
            value={busData.dashCamera}
            onChange={handleChange}
          >
            <option value="">Select dashcam</option>
            {dashCameras &&
              dashCameras.length > 0 &&
              dashCameras.map((dashCam) => (
                <option key={dashCam.id} value={dashCam.name}>
                  {dashCam.name}
                </option>
              ))}
          </select>
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
