import * as React from 'react';

export function useFormInput<T>(initialState: T) {
  const [value, setValue] = React.useState(initialState);
  const handleChange = (e: { target: { value: React.SetStateAction<T>; }; }) => {
    setValue(e.target.value)
  }
  return {
    value, 
    onChange: handleChange
  }
};
