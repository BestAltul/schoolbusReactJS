import axios from "axios";
import { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useNavigate, useParams } from "react-router-dom";
import useFetchRadio from "../hooks/useFetchData";
import useFetchRadioByIMEI from "../hooks/useFetchRadioByIMEI";
import radioButton from "../../assets/images/radio-button.png";
import useFetchData from "../hooks/useFetchData";
import Select from "react-select";
import CommentsComponent from "./CommentsComponent";

const BASE_URL_radio = "http://localhost:8080/api/v3/radios-management";
const BASE_URL_simcard = "http://localhost:8080/api/v3/simcards-management";

export default function RadioFormComponent({ isEdit = false }) {
  const [formTitle, setFormTitle] = useState(
    isEdit ? "Edit radio" : "New radio"
  );

  const { imei } = useParams();

  const [simCards, setSimCards] = useState([]);

  const navigate = useNavigate();

  const [originalRadio, setOriginalRadio] = useState({
    name: "",
    imei: "",
    type: "",
    simCard: {
      simCardType: "",
      simCardCarrier: "",
      simCardNumber: "",
    },
  });

  const [radio, setRadio] = useState({
    name: "",
    imei: "",
    type: "",
    simCard: { simCardType: "", simCardCarrier: "", simCardNumber: "" },
  });

  const {
    data: fetchedRadio,
    loading,
    error,
  } = useFetchRadioByIMEI(BASE_URL_radio, imei);

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

  useEffect(() => {
    if (isEdit && fetchedRadio) {
      setRadio(fetchedRadio);
      setOriginalRadio(fetchedRadio);
    }
  }, [fetchedRadio, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRadio((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCancel = () => {
    navigate("/radio_list");
  };

  const handleSelectChange = (selectedOption) => {
    setRadio((prevData) => ({
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
        const updatedFields = getUpdatedFields(originalRadio, radio);
        const updatedFieldsWithType = { ...updatedFields, type: "radio" };
        console.log(updatedFieldsWithType);
        if (Object.keys(updatedFields).length > 0) {
          await axios.patch(
            `${BASE_URL_radio}/${radio.imei}`,
            updatedFieldsWithType
          );
          alert("Radio details updated successfully!");
        }
      } else {
        await axios.post(`${BASE_URL_radio}`, radio);
        alert("New radio added successfully!");
      }
      navigate("/radio_list");
    } catch (err) {
      alert("Error saving radio details: " + err.message);
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
    (option) => option.value === radio.simCard.simCardNumber
  );

  return (
    <div className="container">
      <h1>{formTitle}</h1>
      <div className="form-wrapper">
        <form className="form-container">
          <Tabs>
            <TabList>
              <Tab>Radio Details</Tab>
              <Tab>Comments</Tab>
            </TabList>
            <TabPanel>
              <div className="form-group-row">
                <div className="col-md-6">
                  <label htmlFor="name" className="form-label text-primary">
                    Radio Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={radio.name || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="col-md-6">
                  <label htmlFor="imei" className="form-label text-success">
                    IMEI
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="imei"
                    name="imei"
                    value={radio.imei || ""}
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
                entityId={radio.imei}
                entityType="radioDTO"
                apiUrl="http://localhost:8080/api/v3/notes-management"
              />
            </TabPanel>
          </Tabs>
        </form>
        <img src={radioButton} alt="School Bus" className="camera" />
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
