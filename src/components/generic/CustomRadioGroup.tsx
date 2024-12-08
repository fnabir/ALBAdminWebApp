import React, { useState } from 'react';

interface RadioGroupProps {
  id: string;
  options: { value: string; label?: string }[];
  onChange: (value: string) => void;
  defaultValue?: string;
  className?: string;
}

const CustomRadioGroup: React.FC<RadioGroupProps> = ({ id, options, onChange, defaultValue, className }) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue || options[0].value);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
    onChange(event.target.value);
  };

  return (
    <div className={`space-x-4 text-center ${className}`}>
      {
        options.map((option) => (
          <label key={option.value} htmlFor={id}>
            <input
              id={id}
                className={"mr-2"}
                type="radio"
                value={option.value}
                checked={selectedValue === option.value}
                onChange={handleChange}
            />
            {option.label ? option.label : option.value}
          </label>
        ))
      }
    </div>
  );
};

export default CustomRadioGroup;