import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetchDashCameras from "../hooks/useFetchDashCameras";
import useFetchTerminals from "../hooks/useFetchTerminals";
import schoolBusImage from "../../assets/images/schoolbus.png";

const BASE_URL = "http://localhost:8080/api/v3/schoolbus-management";
const BASE_URL_dashcam = "http://localhost:8080/api/v3/dashcam-management";

export default function BusFormComponent({ isEdit = false }) {
  const { name } = useParams();
  const navigate = useNavigate();
  const [busType, setBusType] = useState([]);
  const [formHeader, setFormHeader] = useState(isEdit ? "Edit bus" : "New bus");

  const [busData, setBusData] = useState({
    name: "",
    terminal: "",
    dashCamera: {
      id: "",
      name: "",
      simCard: "",
      imei: "",
    },
    radio: "",
    version: "",
    markedForDeletion: "",
  });

  const [originalBusData, setOriginalBusData] = useState({
    name: "",
    terminal: "",
    dashCamDTO: "",
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
    const fetchBusType = async () => {
      try {
        const responseBusType = await axios.get(`${BASE_URL}/bus-type`);
        setBusType(responseBusType.data);
      } catch (err) {
        console.error("Error fetching bys type:", err);
      }
    };
    fetchBusType();
  }, []);

  if (isEdit) {
    useEffect(() => {
      const fetchBusData = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/${name}`);
          setBusData(response.data);
          setOriginalBusData(response.data);
          //  setLoading(false);
        } catch (err) {
          //   setError(err.message);
          // setLoading(false);
        }
      };
      fetchBusData();
    }, [name]);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      if (isEdit) {
        const updatedFields = getUpdatedFields(originalBusData, busData);

        if (Object.keys(updatedFields).length === 0) {
          alert("No changes detected.");
        }

        if (updatedFields.terminal) {
          await axios.patch(`${BASE_URL}/${name}`, {
            terminal: updatedFields.terminal,
          });
        }

        if (updatedFields.dashCamera) {
          console.log("name 83", updatedFields.dashCamera);
          await axios.patch(`${BASE_URL}/${name}`, {
            dashCamDTO: { drid: updatedFields.dashCamera },
          });
        }
        alert("Bus details updated successfully!");
      } else {
        await axios.post(`${BASE_URL}`, busData);
        alert("Bus details updated successfully!");
      }
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
      <h1>{formHeader}</h1>
      <div className="form-wrapper">
        <form className="form-container">
          {/* Блок с номером автобуса и типом */}
          <div className="form-group-row">
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="name" className="form-label text-primary">
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
              <div className="col-md-6">
                <label htmlFor="busType" className="form-label text-success">
                  Bus Type
                </label>
                <select
                  className="form-select"
                  id="busType"
                  name="busType"
                  value={busData.busType}
                  onChange={handleChange}
                >
                  <option value="">Select Bus Type</option>
                  {busType.map((busType) => (
                    <option key={busType.id} value={busType.name}>
                      {busType}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Блок с терминалом */}
          <div className="form-group-row">
            <label htmlFor="terminal" className="form-label text-warning">
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

          {/* Блок с камерой и радио */}
          <div className="form-group-row">
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="dashCamDTO" className="form-label text-danger">
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
                      <option key={dashCam.id} value={dashCam.drid}>
                        {dashCam.drid}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="radio" className="form-label text-info">
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
            </div>
          </div>
        </form>

        <img src={schoolBusImage} alt="School Bus" className="bus-image" />
      </div>

      <hr className="divider" />
      <div className="button-group">
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
      </div>
    </div>
  );
}
