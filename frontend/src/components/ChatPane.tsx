import React, { useState } from 'react';
import { Pane } from './Pane';
import { Separator } from './ui/separator';

import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import MessagesScrollArea from './MessagesScrollArea';

interface ChatPaneProps {
	onHTMLReceived: (html: string | null) => void;
}

const Header: React.FC = () => {
	return (
		<div className='p-3 flex items-center justify-between'>
			<h2 className='text-sm font-semibold text-gray-800'>Assistant</h2>
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
						className='h-60 bg-white'
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
					/>
				</div>
				<Button className='bg-gray-700' onClick={onSend}>
					Send
				</Button>
			</div>
		</div>
	);
};



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
		<Pane className='w-1/4 h-full flex flex-col border-l bg-gray-300'>
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



