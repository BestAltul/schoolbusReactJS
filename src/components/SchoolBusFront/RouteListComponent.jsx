import axios from "axios";
import { API_URLS } from "../../config/config";
import { useState } from "react";

const BASE_URL_ROUTE = API_URLS.ROUTE;

export default function RouteListComponent() {
  const [routeList, setRouteList] = useState([]);
  const [error, setError] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [filteredRoutelist, setFilteredRouteList] = useState([]);

  const fetchRouteList = async () => {
    try {
      const response = await axios.get(BASE_URL_ROUTE);
      setRouteList(response.data);
      setFilteredRouteList(response.data);
    } catch (err) {
      setError(err);
    }
  };

  const handleAddRoute = () => {
    navigate("/new_route");
  };

  return (
    <div>
      <h1>Route list</h1>
      <div className="panel">
        <button className="btn btn-primary" onClick={handleAddRoute}>
          Add new route
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            if (selectedRoute) {
              navigate(`/route-edit/${selectedRoute.id}`);
            } else {
              alert("Please select a route to edit.");
            }
          }}
        >
          Edit route
        </button>
        {/* <button
          className="btn btn-danger"
          onClick={() => {
            if (selectedRoute) {
              handleDeleteRadio(selectedRoute.id);
            } else {
              alert("Please select a radio to delete.");
            }
          }}
        >
          Delete route
        </button> */}
      </div>

      <div className="table-container">
        <table className="table table-hover">
          <thead>
            <tr>
              <td>Route</td>
              <td>Bus</td>
              <td>Driver</td>
              <td>Monitor</td>
              <td>Radio check</td>
              <td>Dispatch time</td>
              <td>Arrive time</td>
              <td>AM/PM</td>
              <td>Notes</td>
            </tr>
          </thead>
          <tbody>
            {filteredRoutelist.map((element) => (
              <tr
                key={element.id}
                onClick={() => {
                  setSelectedRoute(element);
                }}
                onDoubleClick={() => navigate(`/route-edit/${element.id}`)}
                className={
                  selectedRoute?.name === element.name ? "table-active" : ""
                }
                style={
                  {
                    //   cursor: "pointer",
                    //   textDecoration: element.markedForDeletion
                    //     ? "line-through"
                    //     : "none",
                    //   color: element.markedForDeletion ? "gray" : "inherit",
                  }
                }
              >
                <td>{element.name ? element.name : "Not available"}</td>
                <td>{element.driver ? element.driver : "Not available"}</td>
                <td>{element.monitor ? element.monitor : "Not available"}</td>
                <td>
                  {element.radioCheck ? element.radioCheck : "Not available"}
                </td>
                <td>
                  {element.dispatchTime
                    ? element.dispatchTime
                    : "Not available"}
                </td>
                <td>
                  {element.arriveTime ? element.arriveTime : "Not available"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
