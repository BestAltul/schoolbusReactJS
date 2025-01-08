import { useState, useEffect } from "react";
import axios from "axios";

const useFetchTerminals = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTerminals = async () => {
      try {
        const response = await axios.get(`${url}/terminals`);
        setData(response.data);
      } catch (err) {
        setError(err);
        console.error("Error fetching terminals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTerminals();
  }, [url]);
  return { data, loading, error };
};

export default useFetchTerminals;
