import React, { ReactNode } from 'react';

interface PaneProps {
	className?: string;
	children?: ReactNode;
}

export const Pane: React.FC<PaneProps> = ({ className = '', children }) => {
	return <div className={className}>{children}</div>;
};
