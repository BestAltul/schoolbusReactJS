import { useState } from "react";
import axios from "axios";

const usePostData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (url, data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(url, data);
      console.log("Data successfully sent:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error sending data:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { postData, loading, error };
};

export default usePostData;
