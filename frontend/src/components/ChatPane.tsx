import React, { useState } from 'react';
import { Pane } from './Pane';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

// This is the main ChatPane component.
// Now we manage messages in state and send input to the backend.
export const ChatPane: React.FC = () => {
	type Message = {
		role: 'assistant' | 'user';
		content: string;
	};

	const [messages, setMessages] = useState<Message[]>([]);
	const [inputValue, setInputValue] = useState('');

	const handleSend = async () => {
		if (!inputValue.trim()) return;

		// Add user's message to the list
		const userMessage: Message = { role: 'user', content: inputValue };
		setMessages((prev) => [...prev, userMessage]);

		try {
			const response = await fetch('http://localhost:8000/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: inputValue }),
			});

			if (!response.ok) {
				console.error('Error from backend:', response.statusText);
				return;
			}

			const data = await response.json();
			// data should look like: { AIResponse: string, HTMLString: string|null }

			// Add assistant message(s) based on the response
			if (data.HTMLString) {
				// If HTMLString is not null, show the AIResponse as a preceding message (if needed),
				// and then the HTML content
				if (data.AIResponse) {
					setMessages((prev) => [
						...prev,
						{ role: 'assistant', content: data.AIResponse },
						{ role: 'assistant', content: data.HTMLString },
					]);
				} else {
					setMessages((prev) => [
						...prev,
						{ role: 'assistant', content: data.HTMLString },
					]);
				}
			} else {
				// Just a normal response
				setMessages((prev) => [
					...prev,
					{ role: 'assistant', content: data.AIResponse },
				]);
			}
		} catch (error) {
			console.error('Error sending message:', error);
		} finally {
			setInputValue('');
		}
	};

	return (
		<Pane className='w-1/4 h-full flex flex-col border-l'>
			<Header />
			<Separator />
			<MessagesScrollArea messages={messages} />
			<Separator />
			<FooterInput
				inputValue={inputValue}
				setInputValue={setInputValue}
				onSend={handleSend}
			/>
		</Pane>
	);
};

/** Header: A simple top header bar for the chat pane. */
const Header: React.FC = () => {
	return (
		<div className='p-3 flex items-center justify-between border-b'>
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
					? 'bg-gray-600 text-white rounded-tr-none'
					: 'bg-gray-100 text-gray-800 rounded-tl-none'
			}`}
			>
				{content}
			</div>
		</div>
	);
};

interface FooterInputProps {
	inputValue: string;
	setInputValue: React.Dispatch<React.SetStateAction<string>>;
	onSend: () => void;
}

/** FooterInput: Displays a textarea for input and a send button.
 */
const FooterInput: React.FC<FooterInputProps> = ({
	inputValue,
	setInputValue,
	onSend,
}) => {
	return (
		<div className='p-3'>
			<div className='flex items-start space-x-2'>
				<div className='flex-1'>
					<Textarea
						placeholder='Type your message here...'
						className='resize-none'
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
					/>
				</div>
				<Button variant='default' onClick={onSend}>
					Send
				</Button>
			</div>
		</div>
	);
};
