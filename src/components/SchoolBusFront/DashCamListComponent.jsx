import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import useFetch from "../hooks/useFetchData";
import axios from "axios";
import { API_URLS } from "../../config/config";

const BASE_URL_dashcam = API_URLS.DASHCAM;

export default function DashCameraComponent() {
  const [selectedDashcam, setSelectedDashcam] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDashcams, setFilteredDashcams] = useState([]);
  const { data: dashCameras, loading, error } = useFetch(BASE_URL_dashcam);
  const navigate = useNavigate();

  const handleSearchDashcams = (query) => {
    if (!dashCameras || dashCameras.length === 0) return;

    if (query) {
      const lowerCaseQuery = query.toLowerCase();

      const filtered = dashCameras.filter((camera) => {
        return (
          (camera.name && camera.name.toLowerCase().includes(lowerCaseQuery)) ||
          (camera.drid && camera.drid.toLowerCase().includes(lowerCaseQuery)) ||
          (camera.imei && camera.imei.toLowerCase().includes(lowerCaseQuery)) ||
          (camera.simCardDTO &&
            camera.simCardDTO.simCardNumber &&
            camera.simCardDTO.simCardNumber
              .toLowerCase()
              .includes(lowerCaseQuery))
        );
      });

      setFilteredDashcams(filtered);
    } else {
      setFilteredDashcams(dashCameras);
    }
  };

  useEffect(() => {
    if (dashCameras) {
      setFilteredDashcams(dashCameras);
    }
  }, [dashCameras]);

  const handleAddDashcam = () => {
    navigate("/new_dashcam");
  };

  const handleEditDashcam = () => {
    if (selectedDashcam) {
      navigate(`/dashcam-edit/${selectedDashcam.drid}`);
    } else {
      alert("Please select a Dashcam to edit.");
    }
  };

  const handleDeleteDashcam = async () => {
    if (selectedDashcam) {
      try {
        await axios.delete(`${BASE_URL_dashcam}/${selectedDashcam.drid}`);
        alert("Dashcam deleted successfully.");
        setFilteredDashcams(
          filteredDashcams.filter((d) => d.drid !== selectedDashcam.drid)
        );
      } catch (error) {
        alert("Error deleting Dashcam: " + error.message);
      }
    } else {
      alert("Please select a Dashcam to delete.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error occurred: {error.message}</p>;
  }

  return (
    <div>
      <h1>Dash Cameras</h1>

      <div className="panel">
        <button className="btn btn-primary" onClick={handleAddDashcam}>
          Add New Dashcam
        </button>
        <button className="btn btn-secondary" onClick={handleEditDashcam}>
          Edit Dashcam
        </button>
        <button className="btn btn-danger" onClick={handleDeleteDashcam}>
          Delete Dashcam
        </button>
      </div>

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search ..."
        onSearch={handleSearchDashcams}
      />
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>DRID</th>
              <th>IMEI</th>
              <th>Sim Card number</th>
            </tr>
          </thead>
          <tbody>
            {filteredDashcams.map((camera) => (
              <tr
                key={camera.drid}
                onClick={() => setSelectedDashcam(camera)}
                onDoubleClick={() => navigate(`/dashcam-edit/${camera.drid}`)}
                className={
                  selectedDashcam?.drid === camera.drid ? "table-active" : ""
                }
              >
                <td>{camera.name}</td>
                <td>{camera.drid}</td>
                <td>{camera.imei}</td>
                <td>
                  {camera.simCardDTO
                    ? camera.simCardDTO.simCardNumber
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
