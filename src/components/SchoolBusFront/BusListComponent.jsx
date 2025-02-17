import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SchoolBus.css";
import SearchBar from "./SearchBar";

const BASE_URL = "http://localhost:8080/api/v3/schoolbus-management";

export default function BusListComponent() {
  // const today = new Date();
  // const targetDate = new Date(
  //   today.getFullYear() + 12,
  //   today.getMonth(),
  //   today.getDay()
  // );

  const [selectedBus, setSelectedBus] = useState(null);
  const [buslist, setBusList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filteredBusList, setFilteredBusList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const fetchBusList = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v3/schoolbus-management"
      );
      setBusList(response.data);
      setLoading(false);
      setFilteredBusList(response.data);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusList();
  }, []);

  const handleAddBus = () => {
    navigate("/new_bus");
  };

  const handleDeleteBus = async (name) => {
    try {
      await axios.patch(`${BASE_URL}/${name}/mark-for-deletion`);
      alert("Bus marked for deletion!");
      fetchBusList();
    } catch (err) {
      alert("Error marking bus for deletion: " + err.message);
    }
  };

  const handleSearch = (query) => {
    if (!buslist || buslist.length === 0) return;

    if (query) {
      const lowerCaseQuery = query.toLowerCase();

      const filtered = buslist.filter((element) => {
        const matches = [
          element.name?.toLowerCase().includes(lowerCaseQuery),
          element.busType?.toLowerCase().includes(lowerCaseQuery),
          element.dashCamDTO?.drid?.toLowerCase().includes(lowerCaseQuery),
          element.radioDTO?.name?.toLowerCase().includes(lowerCaseQuery),
          element.terminal?.toLowerCase().includes(lowerCaseQuery),
        ];

        return matches.some(Boolean);
      });

      setFilteredBusList(filtered);
    } else {
      setFilteredBusList(buslist);
    }
  };

  return (
    <div className="container">
      <h1>List of buses</h1>

      <div className="panel">
        <button className="btn btn-primary" onClick={handleAddBus}>
          Add New Bus
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            if (selectedBus) {
              navigate(`/edit/${selectedBus.name}`);
            } else {
              alert("Please select a bus to edit.");
            }
          }}
        >
          Edit Bus
        </button>
        <button
          className="btn btn-danger"
          onClick={() => {
            if (selectedBus) {
              handleDeleteBus(selectedBus.name);
            } else {
              alert("Please select a bus to delete.");
            }
          }}
        >
          Delete Bus
        </button>
      </div>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search by..."
        onSearch={handleSearch}
      />
      <div className="table-container">
        <table className="table table-hover">
          <thead>
            <tr>
              <td>Number</td>
              <td>Terminal</td>
              <td>Dash camera</td>
              <td>Radio</td>
            </tr>
          </thead>
          <tbody>
            {filteredBusList.map((element) => (
              <tr
                key={element.name}
                onClick={() => {
                  setSelectedBus(element);
                }}
                onDoubleClick={() => navigate(`/edit/${element.name}`)}
                className={
                  selectedBus?.name === element.name ? "table-active" : ""
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
                <td>{element.terminal || "Not available"}</td>
                <td>
                  {(element.dashCamDTO && element.dashCamDTO.drid) ||
                    "Not available"}
                </td>
                <td>
                  {(element.radioDTO && element.radioDTO.name) ||
                    "Not available"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
