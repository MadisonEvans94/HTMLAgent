import React from 'react';
import { Pane } from './Pane';

interface GeneratedComponentPaneProps {
	htmlString: string | null;
}

export const GeneratedComponentPane: React.FC<GeneratedComponentPaneProps> = ({
	htmlString,
}) => {
	return (
		<Pane className='grow flex items-center justify-center py-2'>
			<div
				className='border border-white rounded-lg w-full h-full flex items-center justify-center'
				dangerouslySetInnerHTML={{
					__html: htmlString ?? 'content here',
				}}
			/>
		</Pane>
	);
};
