import React, { ReactNode } from "react";

const UniqueChildren: React.FC<{children: ReactNode[]}> = ({ children }) => {
	const uniqueChildren = React.Children.toArray(children).filter((child, index, self) => {
		if (React.isValidElement(child) && child.key != null) {
			const firstIndex = self.findIndex(
				(item) => React.isValidElement(item) && item.key === child.key
			);
			return firstIndex === index;
		}
		return true;
	});

	return <>{uniqueChildren}</>;
};

export default UniqueChildren;