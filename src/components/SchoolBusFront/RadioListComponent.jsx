import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import "./SchoolBus.css";
import { API_URLS } from "../../config/config";

//const BASE_URL_radio = "http://localhost:8080/api/v3/radios-management";
const BASE_URL_radio = API_URLS.RADIO;

export default function RadioListComponent() {
  const [selectedRadio, setSelectedRadio] = useState(null);
  const [radiolist, setRadioList] = useState([]);
  const [filteredRadiolist, setFilteredRadioList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchRadioList = async () => {
    try {
      const response = await axios.get(BASE_URL_radio);
      setRadioList(response.data);
      setFilteredRadioList(response.data);
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

  const handleSearch = (query) => {
    if (query) {
      const filtered = radiolist.filter(
        (element) =>
          element.name.toLowerCase().includes(query.toLowerCase()) ||
          element.imei.toLowerCase().includes(query.toLowerCase()) ||
          (element.simCardDTO &&
            element.simCardDTO.simCardNumber
              .toLowerCase()
              .includes(query.toLowerCase()))
      );
      setFilteredRadioList(filtered);
    } else {
      setFilteredRadioList(radiolist);
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
              handleDeleteRadio(selectedRadio.imei);
            } else {
              alert("Please select a radio to delete.");
            }
          }}
        >
          Delete radio
        </button>
      </div>

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search by Name, IMEI, or SIM Card..."
        onSearch={handleSearch}
      />

      <div className="table-container">
        <table className="table table-hover">
          <thead>
            <tr>
              <td>Name</td>
              <td>IMEI</td>
              <td>SIM CARD</td>
            </tr>
          </thead>
          <tbody>
            {filteredRadiolist.map((element) => (
              <tr
                key={element.imei}
                onClick={() => {
                  setSelectedRadio(element);
                }}
                onDoubleClick={() => navigate(`/radio-edit/${element.imei}`)}
                className={
                  selectedRadio?.name === element.name ? "table-active" : ""
                }
                style={{
                  cursor: "pointer",
                  textDecoration: element.markedForDeletion
                    ? "line-through"
                    : "none",
                  color: element.markedForDeletion ? "gray" : "inherit",
                }}
              >
                <td>{element.name ? element.name : "Not available"}</td>
                <td>{element.imei ? element.imei : "Not available"}</td>
                <td>
                  {element.simCardDTO
                    ? element.simCardDTO.simCardNumber
                    : "Not available"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
