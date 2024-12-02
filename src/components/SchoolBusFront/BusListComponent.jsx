export default function BusListComponent() {
  const today = new Date();
  const targetDate = new Date(
    today.getFullYear() + 12,
    today.getMonth(),
    today.getDay()
  );

  const buslist = [
    { id: 1, description: "512", done: false, targetDate: targetDate },
    { id: 2, description: "513", done: false, targetDate: targetDate },
    { id: 3, description: "514", done: false, targetDate: targetDate },
    { id: 4, description: "515", done: false, targetDate: targetDate },
  ];
  return (
    <div className="BusListComponent">
      <h1>List of buses</h1>
      <div>
        <table>
          <thead>
            <tr>
              <td>ID</td>
              <td>Description</td>
              <td>Is done</td>
              <td>Target date</td>
            </tr>
          </thead>
          <tbody>
            {buslist.map((element) => (
              <tr key={element.id}>
                <td>{element.id}</td>
                <td>{element.description}</td>
                <td>{element.done.toString()}</td>
                <td>{element.targetDate.toDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
