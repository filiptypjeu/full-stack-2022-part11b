import { useEffect, useState } from "react";
import Error from "./components/Error";
import Filter from "./components/Filter";
import Notification from "./components/Notification";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import PersonManager from "./services/PersonManager";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    PersonManager.getAll().then(persons => setPersons(persons));
  }, []);

  const handleNotification = (newMessage, isError = false) => {
    const f = isError ? setErrorMessage : setInfoMessage;
    f(newMessage);
    setTimeout(() => f(""), 5000);
  }

  const addPerson = e => {
    e.preventDefault();
    const name = newName.trim();
    const number = newNumber.trim();
    if (!name || !number) return;

    const person = persons.find(p => p.name === name);
    if (person) {
      if (!window.confirm(`${name} is already added to phonebook. Replace the old number with the new one?`)) return;
      PersonManager
        .update({...person, number})
        .then(newPerson => {
          setPersons(persons.map(p => p.id === person.id ? newPerson : p));
          handleNotification(`Updated ${newPerson.name}`);
        })
        .catch(e => {
          let str = `Could not update ${name}`;
          if (e.response?.data?.error) {
            str += ` [[${e.response.data.error}]]`;
          }
          handleNotification(str, true);
        });
    } else {
      PersonManager
        .create({ name, number })
        .then(newPerson => {
          setPersons([...persons, newPerson]);
          handleNotification(`Added ${newPerson.name}`);
        })
        .catch(e => {
          let str = `Could not create ${name}`;
          if (e.response?.data?.error) {
            str += ` [[${e.response.data.error}]]`;
          }
          handleNotification(str, true);
        });
    }
    setNewName("");
    setNewNumber("");
  }

  const removePerson = (i) => {
    const person = persons[i];
    if (!window.confirm(`Delete ${person.name}?`)) return;
    PersonManager
      .remove(person)
      .then(() => {
        setPersons(persons.filter(p => p.id !== person.id));
        handleNotification(`Removed ${person.name}`);
      })
      .catch(() => handleNotification(`Could not remove ${person.name}`, true));
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={infoMessage} />
      <Error message={errorMessage} />
      <Filter search={search} onSearchChange={e => setSearch(e.target.value)} />

      <h2>add a new</h2>
      <PersonForm name={newName} onNameChange={e => setNewName(e.target.value)} number={newNumber} onNumberChange={e => setNewNumber(e.target.value)} onSubmit={addPerson} />

      <h2>Numbers</h2>
      <Persons persons={persons} filter={search} onDeleteClick={removePerson} />
    </div>
  );
}

export default App;
