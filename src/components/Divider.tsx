import React from "react";

type DividerProps = {
	orientation?: "horizontal" | "vertical";
	className?: string;
};

const Divider: React.FC<DividerProps> = ({
																					 orientation = "horizontal",
																					 className,
																				 }) => {
	return (
		<div className={`${orientation == "horizontal" ? `w-full h-0.5 bg-gradient-to-r` : `self-stretch w-0.5 bg-gradient-to-b`}  from-transparent to-transparent via-gray-300 rounded-full ${className}`}/>
	)};

export default Divider;