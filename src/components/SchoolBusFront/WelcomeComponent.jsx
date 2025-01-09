import { useParams, Link } from "react-router-dom";
import schoolBusImage from "../../assets/images/school-bus-button.png";
import cameraButton from "../../assets/images/camera-button.png";

export default function WelcomeComponent() {
  const { username } = useParams();
  return (
    <div className="WelcomeComponent">
      <h1>Welcome {username}</h1>
      <div className="card-container">
        <Link to="/bus_list" className="card">
          <img src={schoolBusImage} alt="Bus" className="card-icon" />
          <p>Manage your bus list</p>
        </Link>
        <Link to="/camera_list" className="card">
          <img src={cameraButton} alt="Camera" className="card-icon" />
          <p>Manage your camera list</p>
        </Link>
      </div>
    </div>
  );
}
