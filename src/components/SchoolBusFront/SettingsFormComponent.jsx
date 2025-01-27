import axios from "axios";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import usePostData from "./usePostData";

export default function SettingsFormComponent() {
  const [data, setData] = useState([]);
  const { postData, loading, error } = usePostData();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const binaryData = e.target.result;
        const workbook = XLSX.read(binaryData, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setData(jsonData);
        console.log("Excel Data:", jsonData);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleSend = async () => {
    await postData("http://localhost:8080/api/devices", data);
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
        <pre>{JSON.stringify(data, null, 2)}</pre>{" "}
      </div>
    </div>
  );
}
