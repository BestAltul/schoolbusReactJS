export default function RouteFormComponent({ isEdit = false }) {
  const [formTitle, setFormTitle] = useState(
    isEdit ? "Edit route" : "New route"
  );

  return <div></div>;
}
