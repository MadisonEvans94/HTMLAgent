import React from 'react'
import { ScrollArea } from './ui/scroll-area';
import MessageBubble from './MessageBubble';

interface MessagesScrollAreaProps {
	messages: { role: 'user' | 'assistant'; content: string }[];
}

const MessagesScrollArea: React.FC<MessagesScrollAreaProps> = ({
	messages,
}) => {
	return (
		<div className='flex-1 overflow-hidden'>
			<ScrollArea className='h-full w-full p-4'>
				<div className='flex flex-col space-y-4'>
					{messages.map((msg, idx) => (
						<MessageBubble
							key={idx}
							role={msg.role}
							content={msg.content}
						/>
					))}
				</div>
			</ScrollArea>
		</div>
	);
};

export default MessagesScrollArea
