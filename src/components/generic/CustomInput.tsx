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
                <div className={pre ? "absolute text-gray-400 pl-2.5 pb-2.5 pt-2 peer-focus:text-blue-400" : "hidden"}>{pre}</div>
                <input
                    type={type}
                    id={id}
                    className={(disabled ? "bg-gray-700" : "text-white bg-transparent") + " " +
                        (color == "error" ? "text-red-400 border-red-600" : (disabled ? "text-gray-400 border-gray-600" : "text-white border-gray-600")) +
                        (pre ? " pl-9 pr-2.5" : " px-2.5") +
                        " block py-2 w-full text-md rounded-lg border appearance-none focus:border-blue-400 focus:outline-none focus:ring-0 peer" }
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
                    <span className={required ? "absolute text-red-600 text-xl pl-[0.1rem] -translate-y-1" : "hidden"}>*</span>
                </label>
            </div>
            <div className={helperText ? ((color=="error" ? "text-red-400" : "text-sky-300") + " flex mt-1 ml-1 text-xs") : "hidden"}>
                {helperText}
            </div>
        </div>
    )
}

export default CustomInput;