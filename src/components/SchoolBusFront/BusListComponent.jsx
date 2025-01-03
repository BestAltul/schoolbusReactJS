import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BusListComponent() {
  // const today = new Date();
  // const targetDate = new Date(
  //   today.getFullYear() + 12,
  //   today.getMonth(),
  //   today.getDay()
  // );

  // const buslist = [
  //   { id: 1, description: "512", done: false, targetDate: targetDate },
  //   { id: 2, description: "513", done: false, targetDate: targetDate },
  //   { id: 3, description: "514", done: false, targetDate: targetDate },
  //   { id: 4, description: "515", done: false, targetDate: targetDate },
  // ];

  const [buslist, setBusList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusList = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v3/schoolbus-management"
        );
        console.log(response.data);
        setBusList(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchBusList();
  }, []);
  return (
    <div className="container">
      <h1>List of buses</h1>
      <div>
        <table className="table smtc-table-hover">
          <thead>
            <tr>
              <td>Number</td>
              <td>Terminal</td>
              <td>Dash camera</td>
              <td>Radio</td>
              <td>Edit</td>
            </tr>
          </thead>
          <tbody>
            {buslist.map((element) => (
              <tr key={element.name}>
                <td>{element.name}</td>
                <td>{element.terminal}</td>
                <td>{element.dashCamDTO.name}</td>
                <td>{element.radioDTO.name}</td>
                <td>
                  <button
                    className="btn btn-warning"
                    onClick={() => navigate(`/edit/${element.name}`)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
