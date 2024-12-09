import React, { FC, useState } from "react"

interface Props {
    id?: string,
    label: string
    type: string
    placeholder?: string;
    value?: string | number;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    className?: string
    minLength?: number,
    maxLength?: number,
    minNumber?: number,
    maxNumber?: number,
    minDate?: string,
    maxDate?: string,
    helperText?: string,
    color?: string
    disabled?: boolean,
    required?: boolean,
    pre?:string,
}

const CustomInput: FC<Props> = ({
    id,
    label,
    type="text", placeholder="",
    value,
    onChange,
    className,
    minLength=0,
    maxLength=64, helperText, color,
    minNumber, maxNumber, minDate, maxDate,
    disabled,
    required=false,
    pre="",
    ...rest
  }) => {
    const [, setInputValue] = useState(value);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (onChange) {
            onChange(e);
        }
      };

    return (
        <div className={className}>
            <div className={"relative mt-4"}>
                {
                  pre && <div className={"absolute text-gray-400 pl-2.5 pb-2.5 pt-2 peer-focus:text-blue-400"}>
                      {pre}
                  </div>
                }
                <input
                  type={type}
                  id={id}
                  className={`w-full py-2 border rounded-lg focus:border-blue-400 focus:outline-none focus:ring-0 peer 
                              ${pre ? 'pl-9 pr-2.5' : 'px-2.5'} ${disabled ? "bg-gray-700" : "text-white bg-transparent"}
                              ${disabled ? "text-gray-400 border-gray-600" : color == "error" ? 'text-red-400 border-red-600' : 'text-white border-gray-600'}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleInputChange}
                    minLength={minLength}
                    maxLength={maxLength}
                    min={type == "number" ? minNumber : ""}
                    max={type == "number" ? maxNumber : ""}
                    disabled={disabled}
                    required={required}
                    autoComplete={"off"}
                    {...rest}
                />
                <label
                    htmlFor={id}
                    className={(color=="error" ? "text-red-400" : "text-gray-200") + " absolute text-md duration-300 scale-[0.85] transform -translate-y-5 top-2 z-10 origin-[0] bg-gray-950 px-2 peer-focus:px-2 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[.85] peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"}>
                    {label}
                    {
                        required && <span className="absolute text-red-600 text-xl pl-[0.1rem] -translate-y-1">*</span>
                    }
                </label>
            </div>
            {
              helperText && <div className={`m-1 text-xs ${color == "error" ? "text-red-400" : "text-sky-300"}`}>
                  {helperText}
              </div>
            }
        </div>
    )
}

export default CustomInput;