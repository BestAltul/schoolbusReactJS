import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetchSimCardByNumber from "../hooks/useFetchSimCardByNumber";
import simcardButton from "../../assets/images/simcard-button.png";

const BASE_URL_simcard = "http://localhost:8080/api/v3/simcards-management";

export default function SimCardFormComponent({ isEdit = false }) {
  const { simCardNumber } = useParams();
  const [formTitle, setFormTitle] = useState(
    isEdit ? "Edit sim card" : "New sim card"
  );
  const navigate = useNavigate();

  const [originalSimCardData, setOriginalSimCardData] = useState({
    id: "",
    type: "",
    carrier: "",
    simCardNumber: "",
  });

  const [simCard, setSimCard] = useState({
    id: "",
    type: "",
    carrier: "",
    simCardNumber: "",
  });

  const {
    data: fetchedSimCard,
    loading,
    error,
  } = useFetchSimCardByNumber(BASE_URL_simcard, simCardNumber);

  useEffect(() => {
    if (isEdit && fetchedSimCard) {
      console.log(
        "Fetched SIM card data before setting state:",
        fetchedSimCard
      );
      setSimCard(fetchedSimCard);
      setOriginalSimCardData(fetchedSimCard);
    }
  }, [fetchedSimCard, isEdit]);

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
          <div className="form-group-row">
            <div className="col-md-6">
              <label htmlFor="carrier" className="form-label text-primary">
                SIM card carrier
              </label>
              <input
                type="text"
                className="form-control"
                id="carrier"
                name="carrier"
                value={simCard.carrier || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group-row">
            <div className="col-md-6">
              <label htmlFor="type" className="form-label text-success">
                SIM card type
              </label>
              <input
                type="text"
                className="form-control"
                id="type"
                name="type"
                value={simCard.type || ""}
                onChange={handleChange}
              />
            </div>
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
