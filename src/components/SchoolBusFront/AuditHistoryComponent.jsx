import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URLS } from "../../config/config";

const AuditHistoryComponent = ({ entityId, entityType }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //const BASE_URL_AUDIT = `http://localhost:8080/api/v3/audit-management`;
  const BASE_URL_AUDIT = API_URLS.AUDIT_HISTORY;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL_AUDIT}/${entityType}/${entityId}/history`
        );
        setHistory(response.data);
      } catch (err) {
        setError("Failed to fetch audit history.");
        console.error("Error fetching audit history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [entityId, entityType]);

  if (loading) return <p>Loading history...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h3>Audit History</h3>
      <ul>
        {history.map((record, index) => (
          <li key={index}>
            <strong>Revision:</strong> {record.revisionNumber} |
            <strong> Date:</strong>{" "}
            {new Date(record.revisionDate).toLocaleString()} |
            <strong> User:</strong> {record.revisionUser}
            <ul>
              {Object.entries(record.changes).map(([field, value]) => (
                <li key={field}>
                  <strong>{field}:</strong> {value}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuditHistoryComponent;
