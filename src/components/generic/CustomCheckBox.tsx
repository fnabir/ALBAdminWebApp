import React from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	id: string;
	label: string;
	disabled?: boolean;
	hidden?: boolean;
}

const CustomCheckbox: React.FC<Props> = ({
																					 id,
																					 label,
																					 disabled = false,
																					 hidden = false,
																					 ...rest
}) => {
	return (
		<label htmlFor={id}
			className={ hidden ? "" : `flex items-center space-x-2 cursor-pointer mt-3 ml-1
			${disabled ? 'cursor-not-allowed' : ''}`}
		>
			<input
				id={id}
				type="checkbox"
				disabled={disabled}
				onMouseDown={(e) => e.currentTarget.blur()}
				className={`${disabled ? "opacity-70" : ""} size-5 rounded-lg transition-colors focus:outline-none`}
				{...rest}
			/>
			<span className={ disabled ? 'text-gray-500' : 'text-primary'}>
        {label}
      </span>
		</label>
	);
};

export default CustomCheckbox;