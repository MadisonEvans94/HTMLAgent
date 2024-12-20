import React, { ReactNode } from 'react';
import { Button } from './ui/button'; // Assuming your shadcn button is imported here

interface MainLayoutProps {
	children: ReactNode;
	htmlString: string | null;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
	children,
}) => {

	return (
		<div className='w-screen h-screen overscroll-y-contain flex gap-2 px-2 relative'>
			{children}
		</div>
	);
};
