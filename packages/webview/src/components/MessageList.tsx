import React from 'react';
import type { Message } from './ChatView';

interface MessageListProps {
    messages: Message[];
}

const getMessageClass = (message: Message) => {
    let className = `message ${message.author}`;
    if (message.author === 'bot') {
        switch (message.type) {
            case 'thought':
                className += ' thought';
                break;
            case 'tool-start':
                className += ' tool-start';
                break;
            case 'tool-output':
                className += ' tool-output';
                break;
            case 'error':
                className += ' error';
                break;
        }
    }
    return className;
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
    return (
        <div className="message-list">
            {messages.map((message, index) => (
                <div key={index} className={getMessageClass(message)}>
                    <p>{message.text}</p>
                </div>
            ))}
        </div>
    );
};
