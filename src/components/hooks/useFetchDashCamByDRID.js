import { useState, useEffect } from "react";
import axios from "axios";

const useFetchDashCamByDRID = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
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
  }, [url]);

  return { data, loading, error };
};

export default useFetchDashCamByDRID;
