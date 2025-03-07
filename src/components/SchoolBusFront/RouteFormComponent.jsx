import { API_URLS } from "../../config/config";

const BASE_URL_ROUTE = API_URLS.ROUTE;

export default function RouteFormComponent({ isEdit = false }) {
  const [formTitle, setFormTitle] = useState(
    isEdit ? "Edit route" : "New route"
  );

  const {
    data: fetchedRoute,
    routeloading,
    routrError,
  } = useFetchData(BASE_URL_simcard);

  return <div></div>;
}
