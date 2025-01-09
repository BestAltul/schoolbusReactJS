import axios from "axios";
import { useEffect, useSta, useState } from "react";

export default function DashCamFormComponent({ isEdit = false }) {
  const [dashCam, setDashCam] = useState();
  const [formTitle, setformTitle] = useState(
    isEdit ? "Edit dashcam" : "New dashcam"
  );

  const handleCancel = () => {
    Navigate("/camera_list");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDashCam((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="container">
      <h1>{formTitle}</h1>
      <div className="col-md-6">
        <label htmlFor="name" className="form-label-primary">
          Dashcam
        </label>
        <input
          type="text"
          className="from-control"
          id="name"
          name="name"
          value={dashCam}
          onChange={handleChange}
        ></input>
      </div>
    </div>
  );
}
