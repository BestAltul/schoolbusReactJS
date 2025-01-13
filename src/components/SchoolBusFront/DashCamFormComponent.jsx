import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetchDashCamByDRID from "../hooks/useFetchDashCamByDRID";
import cameraButton from "../../assets/images/camera-button.png";

const BASE_URL_dashcam = "http://localhost:8080/api/v3/dashcam-management";

export default function DashCamFormComponent({ isEdit = false }) {
  const { drid } = useParams();
  const [formTitle, setFormTitle] = useState(
    isEdit ? "Edit dashcam" : "New dashcam"
  );
  const navigate = useNavigate();

  const [originalDashcamData, setOriginalDashcamData] = useState({
    id: "",
    name: "",
    drid: "",
    imei: "",
  });

  const [dashcam, setDashcam] = useState({
    id: "",
    name: "",
    drid: "",
    imei: "",
  });

  const {
    data: fetchedDashcam,
    loading,
    error,
  } = useFetchDashCamByDRID(BASE_URL_dashcam, drid);

  useEffect(() => {
    if (isEdit && fetchedDashcam) {
      console.log("Fetched dashcam data before setting state:", fetchedDashcam);
      setDashcam(fetchedDashcam);
      setOriginalDashcamData(fetchedDashcam);
    }
  }, [fetchedDashcam, isEdit]);

  const handleCancel = () => {
    navigate("/camera_list");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDashcam((prevData) => ({ ...prevData, [name]: value }));
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

  const handleSave = async () => {
    try {
      if (isEdit) {
        const updatedFields = getUpdatedFields(originalDashcamData, dashcam);

        if (Object.keys(updatedFields).length > 0) {
          await axios.patch(
            `${BASE_URL_dashcam}/${dashcam.drid}`,
            updatedFields
          );
          alert("Dashcam details updated successfully!");
        }
      } else {
        console.log("Перед сохранением ", dashcam);
        await axios.post(`${BASE_URL_dashcam}`, dashcam);
        alert("New dashcam added successfully!");
      }
      navigate("/camera_list");
    } catch (err) {
      alert("Error saving dashcam details: " + err.message);
    }
  };

  if (loading) {
    return <p>Loading dashcam data...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Error: {error.message}</p>;
  }

  return (
    <div className="container">
      <h1>{formTitle}</h1>
      <div className="form-wrapper">
        <form className="form-container">
          <div className="form-group-row">
            <div className="col-md-6">
              <label htmlFor="name" className="form-label text-primary">
                Dashcam Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={dashcam.name || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group-row">
            <div className="col-md-6">
              <label htmlFor="drid" className="form-label text-success">
                DRID
              </label>
              <input
                type="text"
                className="form-control"
                id="drid"
                name="drid"
                value={dashcam.drid || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group-row">
            <div className="col-md-6">
              <label htmlFor="imei" className="form-label text-info">
                IMEI
              </label>
              <input
                type="text"
                className="form-control"
                id="imei"
                name="imei"
                value={dashcam.imei || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </form>
        <img src={cameraButton} alt="School Bus" className="camera" />
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
