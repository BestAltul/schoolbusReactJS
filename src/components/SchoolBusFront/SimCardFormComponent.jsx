import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetchSimCardByNumber from "../hooks/useFetchSimCardByNumber";
import simcardButton from "../../assets/images/simcard-button.png";
import { API_URLS } from "../../config/config";

const BASE_URL_simcard = API_URLS.SIMCARD;

export default function SimCardFormComponent({ isEdit = false }) {
  const { simCardNumber } = useParams();
  const [formTitle, setFormTitle] = useState(
    isEdit ? "Edit sim card" : "New sim card"
  );
  const navigate = useNavigate();
  const [simCardType, setSimCardType] = useState([]);
  const [simCardCarrier, setCarrier] = useState([]);

  const [originalSimCardData, setOriginalSimCardData] = useState({
    id: "",
    simCardType: "",
    simCardCarrier: "",
    simCardNumber: "",
  });

  const [simCard, setSimCard] = useState({
    id: "",
    simCardType: "",
    simCardCarrier: "",
    simCardNumber: "",
  });

  const {
    data: fetchedSimCard,
    loading,
    error,
  } = useFetchSimCardByNumber(BASE_URL_simcard, simCardNumber);

  useEffect(() => {
    if (isEdit && fetchedSimCard) {
      setSimCard({
        simCardType: fetchedSimCard.simCardType,
        simCardCarrier: fetchedSimCard.simCardCarrier,
        simCardNumber: fetchedSimCard.simCardNumber,
      });
      setOriginalSimCardData(fetchedSimCard);
    }
  }, [fetchedSimCard, isEdit]);

  useEffect(() => {
    const fetchSimCardType = async () => {
      try {
        const responseSimCardType = await axios.get(
          `${BASE_URL_simcard}/simcard-type`
        );
        setSimCardType(responseSimCardType.data);
      } catch (err) {
        console.error("Error fetching SIM card type:", err);
      }
    };
    fetchSimCardType();
  }, []);

  useEffect(() => {
    const fetchCarrier = async () => {
      try {
        const responseCarrier = await axios.get(`${BASE_URL_simcard}/carrier`);
        setCarrier(responseCarrier.data);
      } catch (err) {
        console.error("Error fetching SIM card type:", err);
      }
    };
    fetchCarrier();
  }, []);

  const handleCancel = () => {
    navigate("/simcard-list");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSimCard((prevData) => ({ ...prevData, [name]: value }));
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
        const updatedFields = getUpdatedFields(originalSimCardData, simCard);

        if (Object.keys(updatedFields).length > 0) {
          await axios.patch(
            `${BASE_URL_simcard}/${simCard.simCardNumber}`,
            updatedFields
          );
          alert("Simcard details updated successfully!");
        }
      } else {
        await axios.post(`${BASE_URL_simcard}`, simCard);
        alert("New SIM card added successfully!");
      }
      navigate("/simcard-list");
    } catch (err) {
      alert("Error saving SIM card details: " + err.message);
    }
  };

  if (loading) {
    return <p>Loading SIM card data...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Error: {error.message}</p>;
  }

  return (
    <div className="container">
      <h1>{formTitle}</h1>
      <div className="form-wrapper">
        <form className="form-container">
          <div className="col-md-6">
            <label htmlFor="simCardCarrier" className="form-label text-success">
              Carrier
            </label>
            <select
              className="form-select"
              id="simCardCarrier"
              name="simCardCarrier"
              value={simCard.simCardCarrier}
              onChange={handleChange}
            >
              <option value="">Select carrier</option>
              {simCardCarrier.map((simCardCarrier) => (
                <option key={simCardCarrier.id} value={simCardCarrier.name}>
                  {simCardCarrier}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="simCardType" className="form-label text-success">
              Sim card type
            </label>
            <select
              className="form-select"
              id="simCardType"
              name="simCardType"
              value={simCard.simCardType}
              onChange={handleChange}
            >
              <option value="">Select SIM card type</option>
              {simCardType.map((simCardType) => (
                <option key={simCardType.id} value={simCardType.name}>
                  {simCardType}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group-row">
            <div className="col-md-6">
              <label htmlFor="simCardNumber" className="form-label text-info">
                SIM card number
              </label>
              <input
                type="text"
                className="form-control"
                id="simCardNumber"
                name="simCardNumber"
                value={simCard.simCardNumber || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </form>
        <img src={simcardButton} alt="School Bus" className="camera" />
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
