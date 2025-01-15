import { useParams, Link } from "react-router-dom";
import schoolBusImage from "../../assets/images/school-bus-button.png";
import cameraButton from "../../assets/images/camera-button.png";
import radioButton from "../../assets/images/radio-button.png";
import simcardButton from "../../assets/images/SimCard-button.png";
import dotButton from "../../assets/images/dot-inspection.png";
import dispatcherButton from "../../assets/images/dispatcher-button.png";

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
        <Link to="/radio_list" className="card">
          <img src={radioButton} alt="Radio" className="card-icon" />
          <p>Manage your radio list</p>
        </Link>
        <Link to="/simcard-list" className="card">
          <img src={simcardButton} alt="Radio" className="card-icon" />
          <p>Manage your SIM card list</p>
        </Link>
        <Link to="/dot-list" className="card">
          <img src={dotButton} alt="Radio" className="card-icon" />
          <p>Manage your DOT inspections</p>
        </Link>
        <Link to="/dispatcher" className="card">
          <img src={dispatcherButton} alt="dispatcher" className="card-icon" />
          <p>Dispatcher</p>
        </Link>
      </div>
    </div>
  );
}
