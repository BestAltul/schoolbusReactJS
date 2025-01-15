import axios from "axios";
import Select from "react-select";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetchData from "../hooks/useFetchData";
import useFetchTerminals from "../hooks/useFetchTerminals";
import schoolBusImage from "../../assets/images/schoolbus.png";

const BASE_URL = "http://localhost:8080/api/v3/schoolbus-management";
const BASE_URL_dashcam = "http://localhost:8080/api/v3/dashcam-management";
const BASE_URL_radio = "http://localhost:8080/api/v3/radios-management";

export default function BusFormComponent({ isEdit = false }) {
  const { name } = useParams();
  const navigate = useNavigate();
  const [busType, setBusType] = useState([]);
  const [formHeader, setFormHeader] = useState(isEdit ? "Edit bus" : "New bus");

  const [busData, setBusData] = useState({
    name: "",
    terminal: "",
    dashCamera: { id: "", name: "", simCard: "", imei: "" },
    radio: { name: "", imei: "" },
    version: "",
    markedForDeletion: "",
  });

  const [originalBusData, setOriginalBusData] = useState({
    name: "",
    terminal: "",
    dashCamDTO: "",
    radio: "",
    version: "",
    markedForDeletion: "",
  });

  const { data: dashcams, loading, error } = useFetchData(BASE_URL_dashcam);

  const {
    data: terminals,
    terminalLoading,
    terminalError,
  } = useFetchTerminals(BASE_URL);

  const {
    data: radios,
    radioLoading: radioLoading,
    radioError: radioError,
  } = useFetchData(BASE_URL_radio);

  useEffect(() => {
    const fetchBusType = async () => {
      try {
        const responseBusType = await axios.get(`${BASE_URL}/bus-type`);
        setBusType(responseBusType.data);
      } catch (err) {
        console.error("Error fetching bus type:", err);
      }
    };
    fetchBusType();
  }, []);

  if (isEdit) {
    useEffect(() => {
      const fetchBusData = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/${name}`);
          const bus = response.data;

          console.log("busData return:", bus);

          setBusData({
            ...bus,
            dashCamera: bus.dashCamDTO
              ? { id: bus.dashCamDTO.drid, name: bus.dashCamDTO.name }
              : { id: "", name: "" },
            radio: bus.radioDTO
              ? { imei: bus.radioDTO.imei, name: bus.radioDTO.name }
              : { imei: "", name: "" },
          });

          setOriginalBusData(bus);
        } catch (err) {
          console.error("Error fetching bus data:", err);
        }
      };

      if (isEdit) {
        fetchBusData();
      }
    }, [name, isEdit]);
  }

  console.log("busData.radio:", busData.radio);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dashCamera") {
      setBusData((prevData) => ({
        ...prevData,
        dashCamera: { ...prevData.dashCamera, id: value },
      }));
    } else if (name === "radio") {
      setBusData((prevData) => ({
        ...prevData,
        radio: { ...prevData.radio, imei: value },
      }));
    } else {
      setBusData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      if (isEdit) {
        const updatedFields = getUpdatedFields(originalBusData, busData);

        if (Object.keys(updatedFields).length === 0) {
          alert("No changes detected.");
          return;
        }

        if (updatedFields.terminal) {
          await axios.patch(`${BASE_URL}/${name}`, {
            terminal: updatedFields.terminal,
          });
        }

        if (updatedFields.radio) {
          console.log("updated ", updatedFields);
          await axios.patch(`${BASE_URL}/${name}`, {
            radioDTO: { imei: updatedFields.radio.imei },
          });
        }

        if (updatedFields.dashCamera) {
          await axios.patch(`${BASE_URL}/${name}`, {
            dashCamDTO: { drid: updatedFields.dashCamera.id },
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
        if (typeof updated[key] === "object" && updated[key] !== null) {
          const nestedChanges = {};

          for (const nestedKey in updated[key]) {
            if (updated[key][nestedKey] !== original[key]?.[nestedKey]) {
              nestedChanges[nestedKey] = updated[key][nestedKey];
            }
          }

          if (Object.keys(nestedChanges).length > 0) {
            changes[key] = nestedChanges;
          }
        } else {
          changes[key] = updated[key];
        }
      }
    }

    return changes;
  };

  const handleCancel = () => {
    navigate("/bus_list");
  };

  if (loading) return <p>Loading bus data...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  const dashcamOptions = dashcams?.map((dashcam) => ({
    value: dashcam.drid,
    label: `${dashcam.drid}-${dashcam.name}`,
  }));

  const selectedDashcam = dashcams?.find(
    (dashCam) => dashCam.drid === busData.dashCamera.id
  );

  const radioOptions = radios?.map((radio) => ({
    value: radio.imei,
    label: `${radio.imei}-${radio.name}`,
  }));

  const selectedRadio = radios?.find(
    (radio) => radio.imei === busData.radio.imei
  );

  return (
    <div className="container">
      <h1>{formHeader}</h1>
      <div className="form-wrapper">
        <form className="form-container">
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

          <div className="form-group-row">
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="dashCamera" className="form-label text-danger">
                  Dashcam
                </label>
                <Select
                  id="dashCamera"
                  name="dashCamera"
                  value={
                    selectedDashcam
                      ? {
                          value: selectedDashcam.drid,
                          label: `${selectedDashcam.drid} - ${selectedDashcam.name}`,
                        }
                      : null
                  }
                  onChange={(selectedOption) =>
                    setBusData((prevData) => ({
                      ...prevData,
                      dashCamera: {
                        ...prevData.dashCamera,
                        id: selectedOption.value,
                      },
                    }))
                  }
                  options={dashcamOptions}
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.value}
                  placeholder="Search Dashcam..."
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="radio" className="form-label text-info">
                  Radio
                </label>

                <Select
                  id="radio"
                  name="radio"
                  value={
                    selectedRadio
                      ? {
                          value: selectedRadio.imei,
                          label: `${selectedRadio.imei} - ${selectedRadio.name}`,
                        }
                      : null
                  }
                  onChange={(selectedOption) =>
                    setBusData((prevData) => ({
                      ...prevData,
                      radio: {
                        ...prevData.radio,
                        imei: selectedOption.value,
                      },
                    }))
                  }
                  options={radioOptions}
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.value}
                  placeholder="Search Radio..."
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
