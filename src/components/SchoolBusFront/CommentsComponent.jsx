import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CommentsComponent({ entityId, entityType, apiUrl }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        let url = `${apiUrl}/${entityId}`;

        if (entityType === "dashCamDTO" || entityType === "radioDTO") {
          url += `?deviceType=${entityType}`;
        }

        const response = await axios.get(url);
        console.log("get data ", response.data);
        setComments(response.data);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    if (entityId) {
      fetchComments();
    }
  }, [entityId, apiUrl]);

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;

    try {
      const payload = {
        comment: newComment,
        userId: "admin",
        createdAt: new Date().toISOString(),
      };

      if (entityType === "schoolBus") {
        payload.schoolBus = { name: entityId };
      } else if (entityType === "dashCamDTO") {
        payload.deviceDTO = { type: "dashcam", drid: entityId };
        payload.deviceType = "dashCam";
      } else if (entityType === "radioDTO") {
        payload.deviceDTO = { type: "radio", imei: entityId };
        payload.deviceType = "radio";
      }
      const response = await axios.post(apiUrl, payload);

      setComments((prevComments) => [...prevComments, response.data]);
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  return (
    <div className="comments-section">
      <h2>Comments for {entityType}</h2>
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        rows={3}
        className="form-control"
        placeholder="Type your message..."
      />
      <button
        type="button"
        className="btn btn-primary mt-2"
        onClick={handleAddComment}
      >
        Send
      </button>

      <div className="mt-3">
        {comments
          .slice()
          .reverse()
          .map((comment, index) => (
            <div
              key={index}
              className={`message-bubble ${
                comment.userId === "admin" ? "sent" : "received"
              }`}
            >
              {comment.comment}
              <div className="comment-timestamp">
                {new Date(comment.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
