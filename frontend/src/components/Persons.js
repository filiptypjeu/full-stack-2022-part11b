const Persons = ({ persons, filter, onDeleteClick }) => {
  const filterArray = filter.trim().toLowerCase().split(" ");

  const showPerson = p => {
    return filterArray.reduce(
      (show, f) =>
        show && (p.name.toLowerCase().includes(f) || p.number.toLowerCase().includes(f)),
      true
    );
  };

  return (
    <ul>
      {persons.filter(p => showPerson(p)).map((p, i) => (
        <li key={p.name}>
          {p.name} {p.number} <button onClick={() => onDeleteClick(i)}>delete</button>
        </li>
      ))}
    </ul>
  );
};

export default Persons;
