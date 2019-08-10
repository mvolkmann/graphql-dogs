import {arrayOf, func, object, string} from 'prop-types';
import React, {useRef} from 'react';

import {useFormInput} from '../custom-hooks';

import './list.scss';

function List({
  addItem,
  deleteItem,
  displayProp,
  items,
  placeholder,
  selectedItem,
  selectItem
}) {
  const inputRef = useRef();

  const value = selectedItem ? selectedItem[displayProp] : '';

  const [onChange, newValue, setNewValue] = useFormInput('');

  function add(event) {
    event.preventDefault();
    addItem(newValue);
    setNewValue('');
    inputRef.current.focus();
  }

  function onSelect(event) {
    const {value} = event.target;
    const item = items.find(item => item[displayProp] === value);
    selectItem(item);
  }

  return (
    <form className="list" onSubmit={add}>
      <select onChange={onSelect} size="10" value={value}>
        {items.map((item, index) => {
          const display = item[displayProp];
          return <option key={index}>{display}</option>;
        })}
      </select>
      <input
        onChange={onChange}
        placeholder={placeholder}
        ref={inputRef}
        value={newValue}
      />
      <div className="buttons">
        <button disabled={!newValue} type="submit">
          Add
        </button>
        <button
          disabled={!selectedItem}
          onClick={() => deleteItem(selectedItem)}
        >
          Delete
        </button>
      </div>
    </form>
  );
}

List.propTypes = {
  addItem: func.isRequired,
  deleteItem: func.isRequired,
  displayProp: string.isRequired,
  items: arrayOf(object).isRequired,
  placeholder: string,
  selectedItem: object,
  selectItem: func.isRequired
};

export default List;
