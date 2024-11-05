import { FC, useState } from "react"

interface Props {
    id?: string,
    label: string
    type: string
    placeholder?: string;
    value?: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    className?: string
    minLength?: number,
    maxLength?: number,
    message?: string,
    result?: string
    resultMessage?: string,
    disabled?: boolean
}

const Input: FC<Props> = ({
    id,
    label,
    type="text",
    value,
    onChange,
    className,
    minLength=0,
    maxLength=64,
    message,
    result,
    resultMessage,
    disabled
  }) => {
    const [inputValue, setInputValue] = useState(value);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        onChange(event);
      };

    return (
        <div className={className}>
            <div className = {"relative mt-5"}>
                <input 
                    type={type}
                    id={id} 
                    className={(disabled ? "text-gray-400 bg-gray-700" : "text-white bg-transparent") + " block px-2.5 pb-2 pt-4 w-full text-md rounded-lg border appearance-none border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 peer" }
                    placeholder=""
                    value={value}
                    onChange={handleInputChange}
                    minLength={minLength}
                    maxLength={maxLength}
                    disabled={disabled}
                />
                <label 
                    htmlFor={id}
                    className="absolute text-md text-gray-400 duration-300 scale-[0.85] transform -translate-y-5 top-2 z-10 origin-[0] bg-gray-950 px-2 peer-focus:px-2 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[.85] peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">
                        {label}
                </label>
            </div>
            <div className={message || resultMessage ? "flex mt-1 ml-1 text-xs" : "hidden"}>
                <span className="text-sky-300">{message}</span>
                <span className={resultMessage ? ((result == "error" ? "text-red-400" : "text-gray-400") + (message ? " ml-2" : "")) : "hidden"}>
                    {`| ${resultMessage}`}
                </span>
            </div>
        </div>
    )
}

export default Input;