import { useState, useEffect } from "react";
import axios from "axios";

const useFetchDashCamByDRID = (url, drid) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!drid) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${url}/${drid}`);
        setData(response.data);
      } catch (err) {
        setError(err);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, drid]);

  return { data, loading, error };
};

export default useFetchDashCamByDRID;
