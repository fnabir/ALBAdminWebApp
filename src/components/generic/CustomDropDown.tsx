import React, { useState } from "react";

type DropdownProps = {
  options: { value: string; label?: string }[];
  id?: string,
  label: string,
  value?: string,
  onChange?: (value: string, label:string) => void,
  helperText?: string,
  color?: string,
  disabled?: boolean,
  required?: boolean,
  pre?: string,
  className?: string
};

const CustomDropDown = ({
                          options, id, label, value="Select", onChange, helperText, color, disabled = false, required = false, pre, className
}: DropdownProps) => {
  const [inputValue, setInputValue] = useState(value);

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const select = e.target;
      setInputValue(select.value);
    if (onChange) {
        onChange(select.value, select.options[select.selectedIndex].text);
    }
  };

  return (
    <div className={className}>
      <div className={"relative mt-5"}>
        <div className={pre ? "absolute text-gray-400 pl-2.5 pb-2.5 pt-2.5 peer-focus:text-blue-400" : "hidden"}>{pre}</div>
        <select id={id}
                className={(disabled ? "bg-gray-700" : "bg-transparent") + " " +
                          (color == "error" ? "text-red-400 border-red-600" : (disabled ? "text-gray-50 border-gray-600" : "text-white border-gray-600")) +
                          (pre ? " pl-9 pr-2.5" : " px-2.5") +
                          " block pb-2.5 pt-2.5 w-full text-md rounded-lg border appearance-none focus:border-blue-400 focus:outline-none focus:ring-0 peer"}
                onChange={handleInputChange}
                value={inputValue}
                disabled={disabled}>
            <option className={"bg-slate-700 text-white"}>
              Select
            </option>
          {options.map((option) => (
            <option className={"bg-slate-700 text-white"} key={option.label? option.label : option.value} value={option.value} aria-label={option.label? option.label : option.value}>
              {option.label? option.label : option.value}
            </option>
          ))}
        </select>
        <label
          htmlFor={id}
          className={(color == "error" ? "text-red-400" : "text-gray-200") + " absolute text-md duration-300 scale-[0.85] transform -translate-y-5 top-2 z-10 origin-[0] bg-gray-950 px-2 peer-focus:px-2 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[.85] peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"}>
          {label}
          <span className={required ? "absolute text-red-600 text-xl pl-[0.1rem] -translate-y-1" : "hidden"}>*</span>
        </label>
      </div>
      <div className={helperText ? ((color == "error" ? "text-red-400" : "text-sky-300") + " flex mt-1 ml-1 text-xs") : "hidden"}>
          {helperText}
      </div>
    </div>
  );
};

export default CustomDropDown;
