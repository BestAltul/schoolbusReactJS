import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:8080/api/buses";

export default function EditBusComponent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [busData, setBusData] = useState({
    number: "",
    terminal: "",
    dashCamera: "",
    radio: "",
    version: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusData = async () => {
      try {
        const response = await axios.get(`&{BASE_URL}/&{id}`);
        setBusData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchBusData();
  }, [id]);

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Сохранение изменений с проверкой версии
  const handleSave = async () => {
    try {
      await axios.put(`${BASE_URL}/${id}`, busData); // Использование базового URL
      alert("Bus details updated successfully!");
      navigate("/buses"); // Перенаправление на список автобусов
    } catch (err) {
      if (err.response && err.response.status === 409) {
        alert(
          "The data has been modified by another user. Please reload the page."
        );
      } else {
        alert("Error updating bus details: " + err.message);
      }
    }
  };

  // Отмена изменений
  const handleCancel = () => {
    navigate("/buses"); // Возврат к списку автобусов
  };

  if (loading) return <p>Loading bus data...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="container">
      <h1>Edit Bus</h1>
      <form>
        <div className="mb-3">
          <label htmlFor="number" className="form-label">
            Bus Number
          </label>
          <input
            type="text"
            className="form-control"
            id="number"
            name="number"
            value={busData.number}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="terminal" className="form-label">
            Terminal
          </label>
          <input
            type="text"
            className="form-control"
            id="terminal"
            name="terminal"
            value={busData.terminal}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="dashCamera" className="form-label">
            Dash Camera
          </label>
          <input
            type="text"
            className="form-control"
            id="dashCamera"
            name="dashCamera"
            value={busData.dashCamera}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="radio" className="form-label">
            Radio
          </label>
          <input
            type="text"
            className="form-control"
            id="radio"
            name="radio"
            value={busData.radio}
            onChange={handleChange}
          />
        </div>
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
      </form>
    </div>
  );
}
