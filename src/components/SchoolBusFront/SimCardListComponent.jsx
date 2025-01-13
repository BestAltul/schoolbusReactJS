import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SchoolBus.css";
const BASE_URL_simcard = "http://localhost:8080/api/v3/simcards-management";

export default function SimCardListComponent() {
  const [selectedSimCard, setSelectedSimCard] = useState(null);
  const [simCardlist, setSimCardList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchSimCardList = async () => {
    try {
      const response = await axios.get(BASE_URL_simcard);
      setRadioList(response.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSimCardList();
  }, []);

  const handleAddRadio = () => {
    navigate("/new-simcard");
  };

  const handleDeleteSimCard = async (simCardNumber) => {
    try {
      await axios.patch(`${BASE_URL_simcard}/${simCardNumber}`);
      alert("SimCard marked for deletion!");
      fetchSimCardList();
    } catch (err) {
      alert("Error marking simCard for deletion: " + err.message);
    }
  };

  return (
    <div className="container">
      <h1>List of sim cards</h1>

      <div className="panel">
        <button className="btn btn-primary" onClick={handleAddRadio}>
          Add new sim card
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            if (selectedSimCard) {
              navigate(`/simcard-edit/${selectedSimCard.simCardNumber}`);
            } else {
              alert("Please select a SIM card to edit.");
            }
          }}
        >
          Edit SIM card
        </button>
        <button
          className="btn btn-danger"
          onClick={() => {
            if (selectedSimCard) {
              handleDeleteBus(selectedSimCard.simCardNumber);
            } else {
              alert("Please select a SIM card to delete.");
            }
          }}
        >
          Delete SIM card
        </button>
      </div>

      <div>
        <table className="table table-hover">
          <thead>
            <tr>
              <td>Carrier</td>
              <td>Number</td>
              <td>Type</td>
            </tr>
          </thead>
          <tbody>
            {simCardlistlist.map((element) => (
              <tr
                key={element.Number}
                onClick={() => {
                  setSelectedSimCard(element);
                }}
                className={
                  setSelectedSimCard?.Number === element.Number
                    ? "smtc-selected-row"
                    : ""
                }
                style={{
                  cursor: "pointer",
                  textDecoration: element.markedForDeletion
                    ? "line-through"
                    : "none",
                  color: element.markedForDeletion ? "gray" : "inherit",
                }}
              >
                <td>{element.Number || "Not available"}</td>
                <td>{element.Carrier || "Not available"}</td>
                <td>{element.Type || "Not available"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
