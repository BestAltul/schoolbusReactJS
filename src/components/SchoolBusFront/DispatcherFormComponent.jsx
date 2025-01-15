import { useParams, Link } from "react-router-dom";
import schoolBusImage from "../../assets/images/school-bus-button.png";
import cameraButton from "../../assets/images/camera-button.png";
import radioButton from "../../assets/images/radio-button.png";
import simcardButton from "../../assets/images/SimCard-button.png";

export default function DispatcherFormComponent() {
  const { username } = useParams();
  return <div className="DispatcherFormComponent"></div>;
}
