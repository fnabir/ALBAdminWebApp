import React, { FC, useState } from "react"

interface Props {
	id?: string
	label: string
	type: string
	value?: string
	onChange?: (value: string) => void
	minDate?: string
	maxDate?: string
	helperText?: string
	color?: string
	disabled?: boolean
	required?: boolean
	hidden?: boolean
	className?: string
}

const CustomDateTimeInput: FC<Props> = ({
																	id,
																	label,
																	type="date",
																	value, className,
																	onChange,
																	helperText, color,
																	minDate, maxDate,
																	disabled,
																	required=false,
																	hidden=false,
																	...rest
																}) => {
	const [inputValue, setInputValue] = useState(value);

	const handleInputChange = (e:any) => {
		setInputValue(e.target.value);
		if (onChange) {
			onChange(e.target.value);
		}
	};

	return (
		<div className={`relative mt-4 ${hidden ? "hidden" : ""} ${className}`}>
			<div>
				<input
					type={type}
					id={id}
					className={`w-full px-2.5 py-2 border rounded-lg focus:border-blue-400 focus:outline-none focus:ring-0 peer 
											${disabled ? "bg-gray-700" : "text-white bg-transparent"} ${disabled ? "text-gray-400 border-gray-600" : color == "error" ? "text-red-400 border-red-600" : "text-white border-gray-600"}`}
					value={inputValue}
					onChange={handleInputChange}
					disabled={disabled}
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

export default CustomDateTimeInput;