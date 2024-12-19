import React from 'react';
import { Pane } from './Pane';

import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

// This is the main ChatPane component.
// It uses a vertical layout: a header, a scrollable message area, and a footer input area.
// Messages are rendered using the MessageBubble subcomponent.
export const ChatPane: React.FC = () => {
	type Message = {
		role: 'assistant' | 'user';
		content: string;
	};

	const messages: Message[] = [
		{ role: 'assistant', content: 'Hello! How can I help you today?' },
		{ role: 'user', content: 'What is the capital of France?' },
		{ role: 'assistant', content: 'The capital of France is Paris.' },
	];


	return (
		<Pane className='w-1/4 h-full flex flex-col border-l border-gray-300 bg-white'>
			<Header />
			<Separator />
			<MessagesScrollArea messages={messages} />
			<Separator />
			<FooterInput />
		</Pane>
	);
};

/** Header: A simple top header bar for the chat pane. */
const Header: React.FC = () => {
	return (
		<div className='p-3 flex items-center justify-between bg-gray-50 border-b border-gray-200'>
			<h2 className='text-sm font-semibold text-gray-800'>Assistant</h2>
		</div>
	);
};

/** MessagesScrollArea: A scrollable area containing the message list. */
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

/** MessageBubble: Displays a message bubble aligned depending on the role.
 *  - Assistant messages: left-aligned, lighter background.
 *  - User messages: right-aligned, highlighted background.
 */
interface MessageBubbleProps {
	role: 'user' | 'assistant';
	content: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content }) => {
	const isUser = role === 'user';

	return (
		<div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
			<div
				className={`max-w-[80%] rounded-lg p-3 text-sm leading-relaxed
          ${
				isUser
					? 'bg-blue-500 text-white rounded-tr-none'
					: 'bg-gray-100 text-gray-800 rounded-tl-none'
			}`}
			>
				{content}
			</div>
		</div>
	);
};

/** FooterInput: Displays a textarea for input and a send button.
 *  For a GPT-like chat, typically just a large textarea and a send button.
 */
const FooterInput: React.FC = () => {
	return (
		<div className='p-3 bg-gray-50'>
			<div className='flex items-start space-x-2'>
				<div className='flex-1'>
					<Textarea
						placeholder='Type your message here...'
						className='resize-none'
					/>
				</div>
				<Button variant='default'>Send</Button>
			</div>
		</div>
	);
};
