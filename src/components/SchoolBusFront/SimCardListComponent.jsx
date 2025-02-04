import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SchoolBus.css";
import SearchBar from "./SearchBar";

const BASE_URL_simcard = "http://localhost:8080/api/v3/simcards-management";

export default function SimCardListComponent() {
  const [selectedSimCard, setSelectedSimCard] = useState(null);
  const [simCardList, setSimCardList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredSimCardlist, setFilteredSimCardlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchSimCardList = async () => {
    try {
      const response = await axios.get(BASE_URL_simcard);
      setSimCardList(response.data);
      setFilteredSimCardlist(response.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSimCardList();
  }, []);

  const handleAddSimCard = () => {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleSearch = (query) => {
    if (!simCardList || simCardList.length === 0) {
      console.warn("No data to filter");
      return;
    }

    if (query) {
      const lowerQuery = query.toLowerCase();
      const filtered = simCardList.filter((element) => {
        return (
          (element.simCardType &&
            element.simCardType.toLowerCase().includes(lowerQuery)) ||
          (element.simCardCarrier &&
            element.simCardCarrier.toLowerCase().includes(lowerQuery)) ||
          (element.simCardNumber &&
            element.simCardNumber.toLowerCase().includes(lowerQuery))
        );
      });

      console.log("Filtered results:", filtered);
      setFilteredSimCardlist(filtered);
    } else {
      setFilteredSimCardlist(simCardList);
    }
  };

  return (
    <div className="container">
      <h1>List of sim cards</h1>

      <div className="panel">
        <button className="btn btn-primary" onClick={handleAddSimCard}>
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
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search by number, carrier, or type..."
        onSearch={handleSearch}
      />
      <div className="table-container">
        <table className="table table-hover">
          <thead>
            <tr>
              <td>Number</td>
              <td>Carrier</td>
              <td>Type</td>
            </tr>
          </thead>
          <tbody>
            {filteredSimCardlist.map((element) => (
              <tr
                key={element.simCardNumber}
                onClick={() => {
                  setSelectedSimCard(element);
                }}
                className={
                  selectedSimCard?.simCardNumber === element.simCardNumber
                    ? "table-active"
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
                <td>{element.simCardNumber || "Not available"}</td>
                <td>{element.simCardCarrier || "Not available"}</td>
                <td>{element.simCardType || "Not available"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
