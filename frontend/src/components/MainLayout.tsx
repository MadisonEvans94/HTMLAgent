import React, { ReactNode } from 'react';
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
