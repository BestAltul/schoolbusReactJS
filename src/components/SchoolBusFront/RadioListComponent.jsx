import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SchoolBus.css";
const BASE_URL_radio = "http://localhost:8080/api/v3/radios-management";

export default function RadioListComponent() {
  const [selectedRadio, setSelectedRadio] = useState(null);
  const [radiolist, setRadioList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchRadioList = async () => {
    try {
      const response = await axios.get(BASE_URL_radio);
      setRadioList(response.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRadioList();
  }, []);

  const handleAddRadio = () => {
    navigate("/new_radio");
  };

  const handleDeleteRadio = async (imei) => {
    try {
      await axios.patch(`${BASE_URL_radio}/${imei}`);
      alert("Radio marked for deletion!");
      fetchRadioList();
    } catch (err) {
      alert("Error marking radio for deletion: " + err.message);
    }
  };

  return (
    <div className="container">
      <h1>List of radios</h1>

      <div className="panel">
        <button className="btn btn-primary" onClick={handleAddRadio}>
          Add new radio
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            if (selectedRadio) {
              navigate(`/radio-edit/${selectedRadio.imei}`);
            } else {
              alert("Please select a radio to edit.");
            }
          }}
        >
          Edit radio
        </button>
        <button
          className="btn btn-danger"
          onClick={() => {
            if (selectedRadio) {
              handleDeleteBus(selectedRadio.imei);
            } else {
              alert("Please select a radio to delete.");
            }
          }}
        >
          Delete radio
        </button>
      </div>

      <div>
        <table className="table table-hover">
          <thead>
            <tr>
              <td>Name</td>
              <td>IMEI</td>
              <td>SIM CARD</td>
            </tr>
          </thead>
          <tbody>
            {radiolist.map((element) => (
              <tr
                key={element.name}
                onClick={() => {
                  setSelectedRadio(element);
                }}
                className={
                  selectedRadio?.name === element.name
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
                <td>{element.name || "Not available"}</td>
                <td>{element.imei || "Not available"}</td>
                <td>{element.simcardDTO || "Not available"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
