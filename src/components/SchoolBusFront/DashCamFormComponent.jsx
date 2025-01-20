import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetchDashCamByDRID from "../hooks/useFetchDashCamByDRID";
import useFetchData from "../hooks/useFetchData";
import cameraButton from "../../assets/images/camera-button.png";
import Select from "react-select";

const BASE_URL_dashcam = "http://localhost:8080/api/v3/dashcam-management";
const BASE_URL_simcard = "http://localhost:8080/api/v3/simcards-management";

export default function DashCamFormComponent({ isEdit = false }) {
  const { drid } = useParams();
  const [formTitle, setFormTitle] = useState(
    isEdit ? "Edit dashcam" : "New dashcam"
  );
  const navigate = useNavigate();

  const [simCards, setSimCards] = useState([]);

  const [originalDashcamData, setOriginalDashcamData] = useState({
    id: "",
    name: "",
    drid: "",
    imei: "",
    simCard: { simCardType: "", simCardCarrier: "", simCardNumber: "" },
  });

  const [dashcam, setDashcam] = useState({
    id: "",
    name: "",
    drid: "",
    imei: "",
    simCardDTO: { simCardType: "", simCardCarrier: "", simCardNumber: "" },
  });

  const {
    data: fetchedDashcam,
    loading,
    error,
  } = useFetchDashCamByDRID(BASE_URL_dashcam, drid);

  useEffect(() => {
    if (isEdit && fetchedDashcam) {
      setDashcam((prevData) => ({
        ...fetchedDashcam,
        simCardDTO: { ...fetchedDashcam.simCard },
      }));

      setOriginalDashcamData(fetchedDashcam);
    }
  }, [fetchedDashcam, isEdit]);

  const {
    data: fetchedSimCard,
    simCardloading,
    simCardError,
  } = useFetchData(BASE_URL_simcard);

  console.log("fetchedSimCard ", fetchedSimCard);

  useEffect(() => {
    if (fetchedSimCard) {
      setSimCards(fetchedSimCard);
    }
  }, [fetchedSimCard]);

  const handleCancel = () => {
    navigate("/camera_list");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDashcam((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (selectedOption) => {
    setDashcam((prevData) => ({
      ...prevData,
      simCardDTO: { ...prevData.simCard, simCardNumber: selectedOption.value },
    }));
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
        console.log(dashcam);
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

  const simCardOptions = simCards?.map((simcard) => ({
    value: simcard.simCardNumber,
    label: `${simcard.simCardNumber}-${simcard.carrier}`,
  }));

  const selectedSimCard = simCardOptions?.find(
    (option) =>
      String(option.value) === String(fetchedDashcam?.simCardDTO?.simCardNumber)
  );

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

          <div className="form-group-row">
            <div className="col-md-6">
              <label htmlFor="simCard" className="form-label text-warning">
                SIM Card
              </label>
              <Select
                id="simCard"
                name="simCard"
                options={simCardOptions}
                value={selectedSimCard}
                onChange={handleSelectChange}
                placeholder="Select a SIM card"
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
