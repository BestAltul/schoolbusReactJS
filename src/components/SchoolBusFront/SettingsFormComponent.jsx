import axios from "axios";
import { useState } from "react";
import * as XLSX from "xlsx";

export default function SettingsFormComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
          type: "array",
        });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setData(jsonData);
        console.log("Parsed Data:", jsonData);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleSend = async () => {
    setLoading(true);
    setError(null);

    try {
      const buses = data.map((item) => ({
        name: item.name,
        fleet: item.Fleet,
        busType: "BIGBUS",
        dashCamDTO: {
          drid: item.drid,
          imei: item.imei,
          // drid: "test",
          // imei: "12345678",

          simCardDTO: {
            simCardNumber: item.solidSimCard
              ? item.solidSimCard
              : item.dashCamSim,
          },
        },
        radioDTO: {
          imei: item.RadioIMEI,
          name: item.RadioSerialNumber,
          simCardDTO: {
            simCardNumber: item.RadioSim,
          },
        },
      }));

      await axios.post("http://localhost:8080/api/v3/upload-management", buses);

      alert("Data sent successfully!");
    } catch (err) {
      console.error("Error sending data:", err);
      setError(err);
    } finally {
      setLoading(false);
      console.log(buses);
    }
  };

  return (
    <div>
      <h2>Upload Excel File</h2>

      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      <button onClick={handleSend} disabled={loading || data.length === 0}>
        {loading ? "Sending..." : "Send Data"}
      </button>

      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}

      <div>
        <h3>Uploaded Data Preview:</h3>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}
