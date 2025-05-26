import React, { useState, useCallback, memo } from 'react';
import DeckSettings from './DeckSettings';
import CardEntry from './CardEntry';
import type { CardEntryData } from './CardEntry';
import ProbabilityResults from './ProbabilityResults';
import type { ProbabilityResult } from './ProbabilityResults';
import { useProbabilityCalculator } from '../hooks/useProbabilityCalculator';

const CardProbabilityCalculator: React.FC = () => {
    const [deckSize, setDeckSize] = useState<number>(50);
    const [cardsToDraw, setCardsToDraw] = useState<number>(5);
    const [cardEntries, setCardEntries] = useState<CardEntryData[]>([
        { id: 1, cardName: '', copiesInDeck: 1, desiredCount: 1 }
    ]);
    const [results, setResults] = useState<{
        individual: ProbabilityResult[];
        combined: { exactProb: number; atLeastProb: number } | null;
    }>({ individual: [], combined: null });

    const { calculateProbabilities } = useProbabilityCalculator();

    const addCardEntry = useCallback(() => {
        const newId = Math.max(...cardEntries.map(entry => entry.id), 0) + 1;
        setCardEntries(prev => [...prev, { id: newId, cardName: '', copiesInDeck: 1, desiredCount: 1 }]);
    }, [cardEntries]);

    const removeCardEntry = useCallback((id: number) => {
        setCardEntries(prev => prev.filter(entry => entry.id !== id));
    }, []);

    const updateCardEntry = useCallback((id: number, field: keyof CardEntryData, value: string | number) => {
        setCardEntries(prev => prev.map(entry =>
            entry.id === id ? { ...entry, [field]: value } : entry
        ));
    }, []);

    const handleCalculate = useCallback(() => {
        const newResults = calculateProbabilities(deckSize, cardsToDraw, cardEntries);
        setResults(newResults);
    }, [calculateProbabilities, deckSize, cardsToDraw, cardEntries]);

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">One Piece TCG Probability Calculator</h1>
            <p className="text-lg mb-6 text-blue-300">Set sail for victory by calculating your perfect hand!</p>
            <p className="text-lg mb-6 text-blue-300">This application is a completely written by AI with prompting.</p>

            <DeckSettings
                deckSize={deckSize}
                cardsToDraw={cardsToDraw}
                onDeckSizeChange={setDeckSize}
                onCardsToDrawChange={setCardsToDraw}
            />

            <CardEntry
                entries={cardEntries}
                onAddCard={addCardEntry}
                onRemoveCard={removeCardEntry}
                onUpdateCard={updateCardEntry}
            />

            <div className="button-container mt-12">
                <button
                    onClick={addCardEntry}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-48"
                >
                    Add Another Card
                </button>
                <button
                    onClick={handleCalculate}
                    className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 w-48"
                >
                    Calculate Probabilities
                </button>
            </div>

            <ProbabilityResults
                individual={results.individual}
                combined={results.combined}
            />
        </div>
    );
};

export default memo(CardProbabilityCalculator); 