import React from 'react'


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
						? 'bg-gray-700 text-white rounded-tr-none'
						: 'bg-gray-100 text-gray-900 rounded-tl-none border border-gray-700'
				}`}
			>
				{content}
			</div>
		</div>
	);
};

export default MessageBubble