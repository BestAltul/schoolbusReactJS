import axios from "axios";
import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useNavigate, useParams } from "react-router-dom";
import useFetchDashCamByDRID from "../hooks/useFetchDashCamByDRID";
import useFetchData from "../hooks/useFetchData";
import cameraButton from "../../assets/images/camera-button.png";
import Select from "react-select";
import CommentsComponent from "./CommentsComponent";
import AuditHistoryComponent from "./AuditHistoryComponent";
import { API_URLS } from "../../config/config";

const BASE_URL_dashcam = API_URLS.DASHCAM;
const BASE_URL_simcard = API_URLS.SIMCARD;

export default function DashCamFormComponent({ isEdit = false }) {
  const { drid } = useParams();
  const [formTitle, setFormTitle] = useState(
    isEdit ? "Edit dashcam" : "New dashcam"
  );
  const navigate = useNavigate();

  const [simCards, setSimCards] = useState([]);

  const [originalDashcamData, setOriginalDashcamData] = useState({
    name: "",
    drid: "",
    imei: "",
    type: "",
    simCard: { simCardNumber: "" },
  });

  const [dashcam, setDashcam] = useState({
    name: "",
    drid: "",
    imei: "",
    type: "dashcam",
    simCard: { simCardNumber: "" },
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
        simCard: { ...fetchedDashcam.simCard },
      }));

      setOriginalDashcamData(fetchedDashcam);
    }
  }, [fetchedDashcam, isEdit]);

  const {
    data: fetchedSimCard,
    simCardloading,
    simCardError,
  } = useFetchData(BASE_URL_simcard);

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
      simCard: { ...prevData.simCard, simCardNumber: selectedOption.value },
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
        const updatedFieldsWithType = { ...updatedFields, type: "dashcam" };
        if (Object.keys(updatedFieldsWithType).length > 0) {
          await axios.patch(
            `${BASE_URL_dashcam}/${dashcam.drid}`,
            updatedFieldsWithType
          );
          alert("Dashcam details updated successfully!");
        }
      } else {
        console.log("pered", dashcam);
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
      String(option.value) === String(fetchedDashcam?.simCard?.simCardNumber)
  );

  return (
    <div className="container">
      <h1>{formTitle}</h1>
      <div className="form-wrapper">
        <form className="form-container">
          <Tabs>
            <TabList>
              <Tab>DashCam Details</Tab>
              <Tab>Comments</Tab>
              <Tab>History</Tab>
            </TabList>
            <TabPanel>
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
            </TabPanel>
            <TabPanel>
              <CommentsComponent
                entityId={dashcam.drid}
                entityType="dashCamDTO"
                // apiUrl="http://localhost:8080/api/v3/notes-management"
                apiUrl="http://192.168.21.147:8080/api/v3/notes-management"
              />
            </TabPanel>
            <TabPanel>
              <AuditHistoryComponent
                entityId={dashcam.drid}
                entityType="dashcam"
              />
            </TabPanel>
          </Tabs>
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
