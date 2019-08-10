import React, {useEffect, useState} from 'react';
//import ShortUniqueId from 'short-unique-id';
import List from './list/list';

import {useFormInput} from './custom-hooks';
import {deleteResource, getJson, postJson} from './fetch-util';
import {getSortedValues} from './util';

import './App.scss';

//const uid = new ShortUniqueId();

function handleError(title, error) {
  console.error(title, error);
}

function App() {
  const [dogs, setDogs] = useState({});
  const [people, setPeople] = useState({});
  const [selectedDog, setSelectedDog] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    loadDogs();
    loadPeople();
  }, []);

  ensureSelected(selectedDog, dogs, setSelectedDog);
  ensureSelected(selectedPerson, people, setSelectedPerson);

  const [changeStreet, street] = useFormInput('');
  const [changeCity, city] = useFormInput('');
  const [changeState, state] = useFormInput('');
  const [changeZip, zip] = useFormInput('');

  async function addDog(name) {
    try {
      const id = await postJson('dogs', {name});
      console.log('App.js addDog: id =', id);
      setDogs({...dogs, [id]: {id, name, peopleIds: []}});
    } catch (e) {
      handleError('addDog', e);
    }
  }

  async function addPerson(name) {
    try {
      const id = await postJson('people', {name});
      console.log('App.js addPerson: id =', id);
      setPeople({...people, [id]: {id, name, dogIds: []}});
    } catch (e) {
      handleError('addPerson', e);
    }
  }

  function associate() {
    const {id: dogId, peopleIds} = selectedDog;
    const {id: personId, dogIds} = selectedPerson;
    if (!peopleIds.includes(personId)) {
      peopleIds.push(personId);
      setSelectedDog(selectedDog);
    }
    if (!dogIds.includes(dogId)) {
      dogIds.push(dogId);
      setSelectedPerson(selectedPerson);
    }
  }

  async function deleteDog(dog) {
    const {id} = dog;
    try {
      const res = await deleteResource('dogs/' + id);
      console.log('App.js deleteDog: res =', res);
      delete dogs[id];
      setDogs(dogs);
      setSelectedDog(dogs.length > 1 ? null : dogs[0]);
    } catch (e) {
      handleError('deleteDog', e);
    }
  }

  async function deletePerson(person) {
    console.log('App.js deletePerson: person =', person);
    const {id} = person;
    try {
      const res = await deleteResource('people/' + id);
      console.log('App.js deletePerson: res =', res);
      delete people[id];
      setPeople(people);
      setSelectedPerson(people.length > 1 ? null : people[0]);
    } catch (e) {
      handleError('deletePerson', e);
    }
  }

  function ensureSelected(selectedItem, items, setSelected) {
    if (selectedItem) return;
    const values = getSortedValues(items, 'name');
    if (values.length) setSelected(values[0]);
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

  function getDogs() {
    if (!selectedPerson) return [];
    return selectedPerson.dogIds.map(dogId => dogs[dogId].name).join(', ');
  }

  function getPeople() {
    if (!selectedDog) return [];
    return selectedDog.peopleIds
      .map(personId => people[personId].name)
      .join(', ');
  }

  async function loadDogs() {
    try {
      const dogs = await getJson('dogs');
      const dogMap = dogs.reduce((acc, dog) => {
        dog.peopleIds = [];
        acc[dog.id] = dog;
        return acc;
      }, {});
      setDogs(dogMap);
    } catch (e) {
      handleError('loadDogs', e);
    }
  }

  async function loadPeople() {
    try {
      const people = await getJson('people');
      const personMap = people.reduce((acc, person) => {
        person.dogIds = [];
        acc[person.id] = person;
        return acc;
      }, {});
      setPeople(personMap);
    } catch (e) {
      handleError('loadPeople', e);
    }
  }

  function selectDog(dog) {
    setSelectedDog(dog);
  }

  function selectPerson(person) {
    console.log('App.js selectPerson: person =', person);
    setSelectedPerson(person);
  }

  let report = '';
  if (selectedPerson) {
    report += selectedPerson.name + ' owns ' + getDogs() + '.';
  }
  if (selectedDog) {
    report += selectedDog.name + ' is owned by ' + getPeople() + '.';
  }
  console.log('App.js x: report =', report);

  return (
    <div className="app">
      <div className="top">
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
          <button
            disabled={!selectedDog || !selectedPerson}
            onClick={associate}
          >
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
      <div className="bottom">{report}</div>
    </div>
  );
}

export default App;
