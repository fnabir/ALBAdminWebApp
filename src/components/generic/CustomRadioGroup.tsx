import React, { useState } from 'react';

interface RadioGroupProps {
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  defaultValue?: string;
}

const CustomRadioGroup: React.FC<RadioGroupProps> = ({ options, onChange, defaultValue }) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue || options[0].value);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
    onChange(event.target.value);
  };

  return (
    <div className={"space-x-4 text-center"}>
      {
        options.map((option) => (
          <label key={option.value}>
            <input
                className={"mr-2"}
                type="radio"
                value={option.value}
                checked={selectedValue === option.value}
                onChange={handleChange}
            />
            {option.label}
          </label>
        ))
      }
    </div>
  );
};

export default CustomRadioGroup;