import React, { useEffect, useState } from "react";
import "./listPages.css";
import axios from "axios";
import BusTable from "../components/BusTable";
export default function BusListPage() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v3/schoolbus-management"
        );
        setBuses(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading buses...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return <BusTable buses={buses} />;
}
