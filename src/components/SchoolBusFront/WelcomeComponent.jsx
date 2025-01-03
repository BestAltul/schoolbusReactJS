import { useParams, Link } from "react-router-dom";
export default function WelcomeComponent() {
  const { username } = useParams();
  return (
    <div className="WelcomeComponent">
      <h1>Welcome {username}</h1>
      <div>
        Manage your bus list -<Link to="/bus_list">Go here</Link>
      </div>
      <div>
        Manage your camera list -<Link to="/camera_list">Go here</Link>
      </div>
    </div>
  );
}
