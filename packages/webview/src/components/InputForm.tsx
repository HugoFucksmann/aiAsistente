import React, { useState } from 'react';

interface InputFormProps {
    onSendMessage: (text: string) => void;
    isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSendMessage, isLoading }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text.trim() && !isLoading) {
            onSendMessage(text);
            setText('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="input-form">
            {isLoading && <div className="loading-indicator">Thinking...</div>}
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Escribe tu mensaje..."
                disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>Enviar</button>
        </form>
    );
};
