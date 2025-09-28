import DialogueOptions from '@/cedar/components/chatMessages/DialogueOptions';
import MarkdownRenderer from '@/cedar/components/chatMessages/MarkdownRenderer';
import MultipleChoice from '@/cedar/components/chatMessages/MultipleChoice';
import TodoList from '@/cedar/components/chatMessages/TodoList';
import Flat3dContainer from '@/cedar/components/containers/Flat3dContainer';
import MessageActions from '@/cedar/components/MessageActions';
import {
	DialogueOptionsMessage,
	Message,
	MessageRenderer,
	MultipleChoiceMessage,
	TickerMessage,
	TodoListMessage,
	useCedarStore,
} from 'cedar-os';
import { Ticker } from 'motion-plus-react';
import React from 'react';

interface ChatRendererProps {
	message: Message;
	onAddToContentStream?: (content: string) => void;
}

export const ChatRenderer: React.FC<ChatRendererProps> = ({ message, onAddToContentStream }) => {
	const getMessageRenderers = useCedarStore(
		(state) => state.getMessageRenderers
	);

	// Check if there is a registered renderer for this message type
	const renderer = getMessageRenderers(message.type) as
		| MessageRenderer<Message>
		| undefined;

	if (renderer) {
		// If renderer has validation, ensure compatibility
		if (!renderer.validateMessage || renderer.validateMessage(message)) {
			return <>{renderer.render(message)}</>;
		}
	}

	// Gradient mask for ticker edges
	const mask =
		'linear-gradient(to right, transparent 5%, black 15%, black 85%, transparent 95%)';
	// Get common message styling
	const getMessageStyles = (role: string) => {
		const commonClasses =
			'prose prose-sm inline-block rounded-xl py-2 relative text-sm w-fit [&>*+*]:mt-3 [&>ol>li+li]:mt-2 [&>ul>li+li]:mt-2 [&>ol>li>p]:mb-1 [&>ul>li>p]:mb-1';
		const roleClasses =
			role === 'bot' || role === 'assistant'
				? `font-serif dark:text-gray-100 text-[#141413] w-full`
				: 'text-[white] px-3';

		const style =
			role === 'bot' || role === 'assistant'
				? {
						fontSize: '0.95rem',
						lineHeight: '1.5em',
				  }
				: {
						boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
						backgroundColor: '#3b82f6',
						color: '#ffffff',
				  };

		return {
			className: `${commonClasses} ${roleClasses}`,
			style,
		};
	};

	// Render different message types based on the message.type
	switch (message.type) {
		case 'dialogue_options':
			return (
				<div className='w-full'>
					<div
						{...getMessageStyles(message.role)}
						className={`${getMessageStyles(message.role).className} w-full`}>
						<DialogueOptions message={message as DialogueOptionsMessage} />
					</div>
				</div>
			);

		case 'multiple_choice':
			return (
				<div className='w-full'>
					<div
						{...getMessageStyles(message.role)}
						className={`${getMessageStyles(message.role).className} w-full`}>
						<MultipleChoice message={message as MultipleChoiceMessage} />
					</div>
				</div>
			);

		case 'todolist':
			const messageStyles = getMessageStyles(message.role);
			return (
				<div className='w-full'>
					<div
						{...messageStyles.style}
						className={`${messageStyles.className} w-full`}>
						<TodoList message={message as TodoListMessage} />
					</div>
				</div>
			);

		case 'ticker': {
			const buttons = (message as TickerMessage).buttons;
			const items = buttons.map((button, bidx) => (
				<Flat3dContainer
					key={bidx}
					whileHover={{ scale: 1.05 }}
					className='w-48 my-3 flex flex-col items-center justify-start p-4'
					// Apply custom background colour if provided
					style={
						button.colour
							? { backgroundColor: button.colour, willChange: 'transform' }
							: undefined
					}>
					{/* Render icon above title at larger size */}
					{button.icon && <div className='mb-2 text-2xl'>{button.icon}</div>}
					<p className='text-sm font-medium text-center truncate'>
						{button.title}
					</p>
					<p className='mt-1 text-center text-xs'>{button.description}</p>
				</Flat3dContainer>
			));
			return (
				<div className='w-full'>
					<div className='mb-2'>
						<Ticker hoverFactor={0} items={items} style={{ maskImage: mask }} />
					</div>
				</div>
			);
		}

		default:
			const isAssistantMessage = message.role === 'bot' || message.role === 'assistant';
			const isSystemMessage = message.content?.startsWith('✅') || message.content?.startsWith('❌') || message.content?.startsWith('📝');
			
			return (
				<div
					className={`${
						isAssistantMessage
							? 'max-w-[100%] w-full'
							: 'max-w-[80%] w-fit'
					}`}>
					<div {...getMessageStyles(message.role)}>
						<MarkdownRenderer
							content={
								message.content ??
								` \`\`\`json\n${JSON.stringify(message, null, 2)}\n\`\`\``
							}
						/>
					</div>
					
					{/* Add approve/reject/edit actions for assistant messages */}
					{isAssistantMessage && !isSystemMessage && message.content && (
						<MessageActions 
							message={message}
							onApprove={() => {
								console.log('Response approved:', message.content)
							}}
							onReject={() => {
								console.log('Response rejected:', message.content)
							}}
							onEdit={(newContent: string) => {
								console.log('Response edited from:', message.content, 'to:', newContent)
							}}
							onAddToStream={(content: string) => {
								onAddToContentStream?.(content)
							}}
						/>
					)}
				</div>
			);
	}
};

export default ChatRenderer;
