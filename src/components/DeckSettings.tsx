import React, { memo } from 'react';

interface DeckSettingsProps {
    deckSize: number;
    cardsToDraw: number;
    onDeckSizeChange: (value: number) => void;
    onCardsToDrawChange: (value: number) => void;
}

const DeckSettings: React.FC<DeckSettingsProps> = ({
    deckSize,
    cardsToDraw,
    onDeckSizeChange,
    onCardsToDrawChange
}) => {
    return (
        <div className="mb-4 space-y-4">
            <div className="deck-settings-container">
                <div className="input-group">
                    <label>Cards in Deck:</label>
                    <input
                        type="number"
                        value={deckSize}
                        onChange={(e) => onDeckSizeChange(Math.max(1, parseInt(e.target.value) || 0))}
                        className="border p-2 rounded w-20"
                        min="1"
                    />
                </div>
                <div className="input-group">
                    <label>Cards to Draw:</label>
                    <input
                        type="number"
                        value={cardsToDraw}
                        onChange={(e) => onCardsToDrawChange(Math.max(1, parseInt(e.target.value) || 0))}
                        className="border p-2 rounded w-20"
                        min="1"
                    />
                </div>
            </div>
        </div>
    );
};

export default memo(DeckSettings); 