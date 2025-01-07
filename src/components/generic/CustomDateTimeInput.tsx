import React, { FC } from "react"

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	id?: string
	label: string
	type: string
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
																	className,
																	helperText, color,
																	disabled,
																	required=false,
																	hidden=false,
																	...rest
																}) => {
	return (
		<div className={hidden ? "hidden" : `relative mt-4 ${className}`}>
			<div>
				<input
					type={type}
					id={id}
					className={`w-full px-2.5 py-2 border rounded-lg focus:border-blue-400 focus:outline-none focus:ring-0 peer 
											${disabled ? "bg-muted" : "bg-transparent"} ${disabled ? "text-gray-400 border-gray-500" : color == "error" ? "text-red-500 border-red-500" : "text-card-foreground border-gray-500"}`}
					disabled={disabled}
					{...rest}
				/>
				<label
					htmlFor={id}
					className={`text-card-foreground absolute text-md duration-300 scale-[0.85] transform -translate-y-5 top-2 z-10 origin-[0] bg-card px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[.85] peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}>
					{label}
					<span className={required ? "absolute text-red-600 text-xl pl-[0.1rem] -translate-y-1" : "hidden"}>*</span>
				</label>
			</div>
			<div className={helperText ? ((color=="error" ? "text-red-500" : "text-sky-500") + " flex mt-1 ml-1 text-sm") : "hidden"}>
				{helperText}
			</div>
		</div>
	)
}

export default CustomDateTimeInput;