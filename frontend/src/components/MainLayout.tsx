import React, { ReactNode } from 'react';

interface MainLayoutProps {
	children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
	return (
		<div className='bg-gray-600 w-screen h-screen overscroll-y-contain flex gap-2 px-2'>
			{children}
		</div>
	);
};
