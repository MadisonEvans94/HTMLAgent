import React, { useState } from 'react';
import { Pane } from './Pane';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface ChatPaneProps {
	onHTMLReceived: (html: string | null) => void;
}

export const ChatPane: React.FC<ChatPaneProps> = ({ onHTMLReceived }) => {
	type Message = {
		role: 'assistant' | 'user';
		content: string;
	};

	const [messages, setMessages] = useState<Message[]>([]);
	const [inputValue, setInputValue] = useState('');

	const handleSend = async () => {
		if (!inputValue.trim()) return;

		// Add user's message
		setMessages((prev) => [...prev, { role: 'user', content: inputValue }]);

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
			// data: { AIResponse: string, HTMLString: string|null }

			// Add assistant message(s)
			if (data.HTMLString) {
				// Update parent's state with the HTML
				onHTMLReceived(data.HTMLString);

				// Show AIResponse as a normal assistant message
				if (data.AIResponse) {
					setMessages((prev) => [
						...prev,
						{ role: 'assistant', content: data.AIResponse },
					]);
				}
			} else {
				// Normal text response
				setMessages((prev) => [
					...prev,
					{ role: 'assistant', content: data.AIResponse },
				]);

				// No HTML to render, reset or set to null if needed
				onHTMLReceived(null);
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

const Header: React.FC = () => {
	return (
		<div className='p-3 flex items-center justify-between border-b'>
			<h2 className='text-sm font-semibold text-gray-800'>Assistant</h2>
		</div>
	);
};

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

interface MessageBubbleProps {
	role: 'user' | 'assistant';
	content: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content }) => {
	const isUser = role === 'user';

	return (
		<div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
			<div
				className={`max-w-[80%] rounded-lg p-3 text-sm leading-relaxed ${
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
