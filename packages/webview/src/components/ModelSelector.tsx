import React from 'react';

interface ModelSelectorProps {
    currentModel: string;
    onModelChange: (model: string) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ currentModel, onModelChange }) => {
    return (
        <div className="model-selector">
            <label htmlFor="model">Modelo:</label>
            <select id="model" value={currentModel} onChange={(e) => onModelChange(e.target.value)}>
                <option value="gemini">Gemini</option>
                <option value="ollama">Ollama</option>
            </select>
        </div>
    );
};
