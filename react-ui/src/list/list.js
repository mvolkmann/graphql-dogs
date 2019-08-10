import {func, object, string} from 'prop-types';
import React, {useRef} from 'react';

import {useFormInput} from '../custom-hooks';
import {getSortedValues} from '../util';

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

  const id = selectedItem ? selectedItem.id : '';

  const [onChange, newValue, setNewValue] = useFormInput('');

  function add(event) {
    event.preventDefault();
    addItem(newValue);
    setNewValue('');
    inputRef.current.focus();
  }

  function deleteIt(event, selectedItem) {
    event.preventDefault();
    deleteItem(selectedItem);
  }

  function onSelect(event) {
    const id = event.target.value;
    selectItem(items[id]);
  }

  const itemArray = getSortedValues(items, 'name');

  return (
    <form className="list" onSubmit={add}>
      <select onChange={onSelect} size="10" value={id}>
        {itemArray.map(item => (
          <option key={item.id} value={item.id}>
            {item[displayProp]}
          </option>
        ))}
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
          onClick={e => deleteIt(e, selectedItem)}
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
  items: object.isRequired,
  placeholder: string,
  selectedItem: object,
  selectItem: func.isRequired
};

export default List;
