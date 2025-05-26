import React, { memo } from 'react';

interface ProbabilityResult {
    cardName: string;
    exactProb: number;
    atLeastProb: number;
}

interface ProbabilityResultsProps {
    individual: ProbabilityResult[];
    combined: { exactProb: number; atLeastProb: number } | null;
}

const ProbabilityResults: React.FC<ProbabilityResultsProps> = ({
    individual,
    combined
}) => {
    if (individual.length === 0) return null;

    return (
        <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Individual Results</h2>
            <div className="space-y-4">
                {individual.map((result, index) => (
                    <div key={index} className="p-4 border rounded">
                        <h3 className="font-semibold text-lg mb-2">{result.cardName || 'Unnamed Card'}</h3>
                        <p className="mb-1">Exact probability: {result.exactProb.toFixed(2)}%</p>
                        <p>At least probability: {result.atLeastProb.toFixed(2)}%</p>
                    </div>
                ))}
            </div>

            {combined && (
                <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-2">Combined Probability (AND)</h2>
                    <div className="p-4 border rounded bg-blue-50">
                        <p className="mb-2">Exact probability of drawing all cards as specified: {combined.exactProb.toFixed(2)}%</p>
                        <p>Probability of drawing at least the specified amounts: {combined.atLeastProb.toFixed(2)}%</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(ProbabilityResults);
export type { ProbabilityResult }; 