import React, {useState} from 'react';

interface CustomCheckboxProps {
	id: string;
	label: string;
	checked?: boolean;
	onChange?: (checked: boolean) => void;
	disabled?: boolean;
	hidden?: boolean;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
																												 id,
																												 label,
																												 checked=false,
																												 onChange,
																												 disabled = false,
																												 hidden = false,
																											 }) => {
	const [checkedState, setCheckedState] = useState(checked);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const select = e.target;
		setCheckedState(select.checked);
		if (onChange) {
			onChange(select.checked);
		}
	};

	return (
		<label htmlFor={id}
			className={ hidden ? "" : `flex items-center space-x-3 cursor-pointer ${
				disabled ? 'cursor-not-allowed' : ''
			}`}
		>
			<div className="relative">
				<input
					id={id}
					type="checkbox"
					checked={checkedState}
					onClick={() => setCheckedState(!checkedState)}
					onChange={(e) => handleInputChange((e))}
					disabled={disabled}
					onMouseDown={(e) => e.currentTarget.blur()}
					className={`${disabled ? "opacity-70" : ""} w-5 h-5 rounded-md transition-colors focus:outline-none`}/>
			</div>
			<span className={ disabled ? 'text-gray-500' : 'text-white'}>
        {label}
      </span>
		</label>
	);
};

export default CustomCheckbox;