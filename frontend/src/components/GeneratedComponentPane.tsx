import React from 'react';
import { Pane } from './Pane';
import { Button } from './ui/button';

interface GeneratedComponentPaneProps {
	htmlString: string | null;
}

export const GeneratedComponentPane: React.FC<GeneratedComponentPaneProps> = ({
	htmlString,
}) => {
	const handleCopy = async () => {
		if (htmlString) {
			try {
				await navigator.clipboard.writeText(htmlString);
				console.log('HTML copied to clipboard!');
			} catch (err) {
				console.error('Failed to copy:', err);
			}
		} else {
			console.log('No HTML to copy.');
		}
	};

	return (
		<Pane className='grow flex items-center justify-center py-2 relative'>
			<Button
				className='absolute top-2 right-2 z-10'
				onClick={handleCopy}
			>
				Copy
			</Button>
			<div
				className='border border-white rounded-lg w-full h-full flex items-center justify-center'
				dangerouslySetInnerHTML={{
					__html: htmlString ?? 'content here',
				}}
			/>
		</Pane>
	);
};
