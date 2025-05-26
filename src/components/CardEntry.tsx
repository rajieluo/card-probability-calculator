import React, { memo } from 'react';

interface CardEntryData {
    id: number;
    cardName: string;
    copiesInDeck: number;
    desiredCount: number;
}

interface CardEntryProps {
    entries: CardEntryData[];
    onAddCard: () => void;
    onRemoveCard: (id: number) => void;
    onUpdateCard: (id: number, field: keyof CardEntryData, value: string | number) => void;
}

const CardEntry: React.FC<CardEntryProps> = ({
    entries,
    onRemoveCard,
    onUpdateCard
}) => {
    return (
        <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-2">Card Entries</h2>
            <div className="space-y-2 w-full">
                {entries.map((entry) => (
                    <div key={entry.id} className="p-3 border rounded">
                        <div className="card-entry-field">
                            <label>Card Name:</label>
                            <input
                                type="text"
                                value={entry.cardName}
                                onChange={(e) => onUpdateCard(entry.id, 'cardName', e.target.value)}
                                className="border p-2 rounded card-name-input"
                            />
                            <label>Copies:</label>
                            <input
                                type="number"
                                value={entry.copiesInDeck}
                                onChange={(e) => onUpdateCard(entry.id, 'copiesInDeck', Math.max(1, parseInt(e.target.value) || 0))}
                                className="border p-2 rounded w-20"
                                min="1"
                            />
                            <label>Desired:</label>
                            <input
                                type="number"
                                value={entry.desiredCount}
                                onChange={(e) => onUpdateCard(entry.id, 'desiredCount', Math.max(0, parseInt(e.target.value) || 0))}
                                className="border p-2 rounded w-20"
                                min="0"
                            />
                            {entries.length > 1 && (
                                <button
                                    onClick={() => onRemoveCard(entry.id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default memo(CardEntry);
export type { CardEntryData }; 