import React from 'react';
import { Pane } from './Pane';

export const GeneratedComponentPane: React.FC = () => {
	return (
		<Pane className='grow flex items-center justify-center py-2'>
			<div className='border border-white rounded-lg w-full h-full'>
				<div className='w-40 h-20 flex items-center justify-center border-black border rounded'>
					Content here
				</div>
			</div>
		</Pane>
	);
};
