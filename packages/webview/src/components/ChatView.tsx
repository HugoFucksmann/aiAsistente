import React, { useState, useEffect, useRef } from 'react';
import { MessageList } from './MessageList';
import { InputForm } from './InputForm';
import { ModelSelector } from './ModelSelector';
import { vscodeApi } from '../vscode';

export interface Message {
    author: 'user' | 'bot';
    type?: 'thought' | 'tool-start' | 'tool-output' | 'final-answer' | 'error';
    text: string;
}

export const ChatView: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { author: 'bot', text: 'Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte hoy?', type: 'final-answer' }
    ]);
    const [currentModel, setCurrentModel] = useState('gemini');
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const message = event.data; // The JSON data from the extension
            switch (message.command) {
                case 'addMessage':
                    setMessages(prevMessages => [...prevMessages, message.payload]);
                    if (message.payload.type === 'final-answer' || message.payload.type === 'error') {
                        setIsLoading(false);
                    }
                    break;
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    const handleSendMessage = (text: string) => {
        const userMessage: Message = { author: 'user', text };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setIsLoading(true);
        
        vscodeApi.postMessage({
            command: 'sendMessage',
            text: text,
            model: currentModel
        });
    };

    const handleModelChange = (model: string) => {
        setCurrentModel(model);
        vscodeApi.postMessage({
            command: 'modelChange',
            model: model
        });
    }

    return (
        <div className="chat-view">
            <ModelSelector currentModel={currentModel} onModelChange={handleModelChange} />
            <MessageList messages={messages} />
            <div ref={messagesEndRef} />
            <InputForm onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
    );
};
