import { useState } from "react";

interface Props {
    type: string;
    label: string;
    onClick?: () => void;
    className?: string;
    disabled?:boolean;
  }
  
  const Button: React.FC<Props> = ({
    type,
    label,
    onClick,
    className,
    disabled,
    ...rest
  }) => {

    return (
      <button
        onClick={onClick}
        className={"w-full justify-center rounded-md px-3 py-1.5 font-semibold leading-6 text-white shadow-sm " + 
            (type == "cancel" ? "bg-gray-600 " : "bg-blue-600 ") + 
            className + 
            (disabled? "text-opacity-50 " : "text-opacity-0 hover:bg-opacity-60 ")}
        disabled={disabled}
        {...rest}
      >
        {label}
      </button>
    );
  };
  
  export default Button;