import React, { useState } from "react";

type ButtonGroupProps = {
	value?: string;
	options: { label?: string; value: string }[];
	onChange: (value: string) => void;
};

const ButtonGroup: React.FC<ButtonGroupProps> = ({ value, options, onChange }) => {
	const [selected, setSelected] = useState<string>(value ? value : options[0]?.value || "");

	const handleClick = (value: string) => {
		setSelected(value);
		onChange(value);
	};

	return (
		<div className={`flex gap-x-2`}>
			{options.map((option) => (
				<button
					key={option.value}
					onClick={() => handleClick(option.value)}
					className={`py-1 px-2 rounded-lg border border-blue-400 hover:bg-blue-800 ${selected === option.value ? "bg-blue-600 text-white" : "bg-transparent text-blue-400 hover:text-white hover:border-transparent"}`}
				>
					{option.label ? option.label : option.value}
				</button>
			))}
		</div>
	);
};

export default ButtonGroup;