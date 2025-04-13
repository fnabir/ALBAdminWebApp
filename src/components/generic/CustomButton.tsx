import React from "react";

interface Props {
    type?: string;
    label: string;
    onClick?: () => void;
    className?: string;
    disabled?:boolean;
  }
  
  const CustomButton: React.FC<Props> = ({
    type,
    label,
    onClick,
    className,
    disabled,
    ...rest
  }) => {
    let backgroundColour: string;
    switch(type) {
      case "cancel": {
        backgroundColour = "bg-gray-600";
        break;
      }
      case "warning": {
        backgroundColour = "bg-red-600";
        break;
      }
      default: {
        backgroundColour = "bg-blue-600";
        break;
      }

    }
    return (
      <button
        onClick={onClick}
        className={"w-full justify-center rounded-md px-3 py-1.5 font-semibold leading-6 text-white shadow-xs " + 
            backgroundColour + " " +  
            className + 
            (disabled? "text-opacity-50 " : "text-opacity-0 hover:bg-opacity-70 ")}
        disabled={disabled}
        {...rest}
      >
        {label}
      </button>
    );
  };
  
  export default CustomButton;