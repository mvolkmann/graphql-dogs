import {useState} from 'react';

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);
  const onChange = e => setValue(e.target.value);
  return [onChange, value, setValue];
}
