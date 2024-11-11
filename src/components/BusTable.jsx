import React from "react";
import "./BusTable.css";

const BusTable = ({ buses }) => {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Terminal</th>
            <th>Type</th>
            <th>Dash cam</th>
            <th>Raqio</th>
          </tr>
        </thead>
        <tbody>
          {buses.map((bus) => (
            <tr key={bus.name}>
              <td>{bus.name}</td>
              <td>{bus.terminal}</td>
              <td>{bus.busType}</td>
              <td>{bus.dashCamDTO ? bus.dashCamDTO.name : "No Dash Cam"}</td>
              <td>{bus.radioDTO ? bus.radioDTO.name : "No Radio"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BusTable;
