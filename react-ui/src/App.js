import React, {useState} from 'react';
import ShortUniqueId from 'short-unique-id';
import List from './list/list';

import {useFormInput} from './custom-hooks';

import './App.scss';

const uid = new ShortUniqueId();

function App() {
  const [dogs, setDogs] = useState([]);
  const [people, setPeople] = useState([]);
  const [selectedDog, setSelectedDog] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);

  if (!selectedDog && dogs.length) setSelectedDog(dogs[0]);
  if (!selectedPerson && people.length) setSelectedPerson(people[0]);

  const [changeStreet, street] = useFormInput('');
  const [changeCity, city] = useFormInput('');
  const [changeState, state] = useFormInput('');
  const [changeZip, zip] = useFormInput('');

  function addDog(name) {
    const id = uid.sequentialUUID();
    setDogs([...dogs, {id, name, personIds: []}]);
  }

  function addPerson(name) {
    const id = uid.sequentialUUID();
    setPeople([...people, {id, name, dogIds: []}]);
  }

  function associate() {
    const {id: dogId, peopleIds} = selectedDog;
    const {id: personId, dogIds} = selectedPerson;
    if (!peopleIds.includes(personId)) {
      peopleIds.push(personId);
    }
    if (!dogIds.includes(dogId)) {
      dogIds.push(dogId);
    }
  }

  function deleteDog(dog) {
    const {id} = dog;
    setDogs(dogs.filter(dog => dog.id !== id));
    setSelectedDog(dogs.length > 1 ? null : dogs[0]);
  }

  function deletePerson(person) {
    const {id} = person;
    setPeople(people.filter(person => person.id !== id));
    setSelectedPerson(people.length > 1 ? null : people[0]);
  }

  function getAddressForm() {
    return (
      <form className="address-form">
        <div>
          <label>Street</label>
          <input onChange={changeStreet} value={street} />
        </div>
        <div>
          <label>City</label>
          <input onChange={changeCity} value={city} />
        </div>
        <div>
          <label>State</label>
          <input onChange={changeState} value={state} />
        </div>
        <div>
          <label>Zip</label>
          <input onChange={changeZip} value={zip} />
        </div>
      </form>
    );
  }

  function selectDog(dog) {
    setSelectedDog(dog);
    // Select all the associated people.
    for (const personId of dog.personIds) {
      //TODO
    }
  }

  function selectPerson(person) {
    setSelectedPerson(person);
    // Select all the associated dogs.
    for (const dogId of person.dogIds) {
      //TODO
    }
  }

  return (
    <div className="app">
      <List
        addItem={addPerson}
        deleteItem={deletePerson}
        displayProp="name"
        items={people}
        placeholder="new person name"
        selectedItem={selectedPerson}
        selectItem={selectPerson}
      />
      <div className="middle">
        {getAddressForm()}
        <button disabled={!selectedDog || !selectedPerson} onClick={associate}>
          Associate
        </button>
      </div>
      <List
        addItem={addDog}
        deleteItem={deleteDog}
        displayProp="name"
        items={dogs}
        placeholder="new dog name"
        selectedItem={selectedDog}
        selectItem={selectDog}
      />
    </div>
  );
}

export default App;
