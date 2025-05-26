import { useCallback } from 'react';
import type { CardEntryData } from '../components/CardEntry';
import type { ProbabilityResult } from '../components/ProbabilityResults';

export interface ProbabilityResults {
    individual: ProbabilityResult[];
    combined: { exactProb: number; atLeastProb: number } | null;
}

export const useProbabilityCalculator = () => {
    const calculateHypergeometric = useCallback((population: number, success: number, sample: number, k: number): number => {
        const combinations = (n: number, r: number): number => {
            if (r > n) return 0;
            if (r === 0 || r === n) return 1;
            
            let result = 1;
            for (let i = 1; i <= r; i++) {
                result *= (n - r + i) / i;
            }
            return result;
        };

        const numerator = combinations(success, k) * combinations(population - success, sample - k);
        const denominator = combinations(population, sample);
        return numerator / denominator;
    }, []);

    const calculateMultinomialProbability = useCallback((
        deckSize: number,
        cardsToDraw: number,
        cards: { copies: number; desired: number }[]
    ): number => {
        if (cards.length === 0 || cardsToDraw < 0 || deckSize < 0) return 0;
        if (cards.length === 1) {
            return calculateHypergeometric(deckSize, cards[0].copies, cardsToDraw, cards[0].desired);
        }

        let totalProb = 0;
        const card = cards[0];
        const remainingCards = cards.slice(1);

        for (let i = card.desired; i <= Math.min(card.copies, cardsToDraw); i++) {
            const probFirst = calculateHypergeometric(deckSize, card.copies, cardsToDraw, i);
            const probRest = calculateMultinomialProbability(
                deckSize - card.copies,
                cardsToDraw - i,
                remainingCards
            );
            totalProb += probFirst * probRest;
        }

        return totalProb;
    }, [calculateHypergeometric]);

    const calculateMultinomialAtLeastProbability = useCallback((
        deckSize: number,
        cardsToDraw: number,
        cards: { copies: number; desired: number }[]
    ): number => {
        if (cards.length === 0 || cardsToDraw < 0 || deckSize < 0) return 0;
        if (cards.length === 1) {
            let prob = 0;
            for (let i = cards[0].desired; i <= Math.min(cards[0].copies, cardsToDraw); i++) {
                prob += calculateHypergeometric(deckSize, cards[0].copies, cardsToDraw, i);
            }
            return prob;
        }

        let totalProb = 0;
        const card = cards[0];
        const remainingCards = cards.slice(1);

        for (let i = card.desired; i <= Math.min(card.copies, cardsToDraw); i++) {
            const probFirst = calculateHypergeometric(deckSize, card.copies, cardsToDraw, i);
            const probRest = calculateMultinomialAtLeastProbability(
                deckSize - card.copies,
                cardsToDraw - i,
                remainingCards
            );
            totalProb += probFirst * probRest;
        }

        return totalProb;
    }, [calculateHypergeometric]);

    const calculateProbabilities = useCallback((
        deckSize: number,
        cardsToDraw: number,
        cardEntries: CardEntryData[]
    ): ProbabilityResults => {
        const individualResults = cardEntries.map(entry => {
            let exactProb = calculateHypergeometric(
                deckSize,
                entry.copiesInDeck,
                cardsToDraw,
                entry.desiredCount
            );

            let atLeastProb = 0;
            for (let i = entry.desiredCount; i <= Math.min(entry.copiesInDeck, cardsToDraw); i++) {
                atLeastProb += calculateHypergeometric(deckSize, entry.copiesInDeck, cardsToDraw, i);
            }

            return {
                cardName: entry.cardName,
                exactProb: exactProb * 100,
                atLeastProb: atLeastProb * 100
            };
        });

        const combinedExactProb = calculateMultinomialProbability(
            deckSize,
            cardsToDraw,
            cardEntries.map(entry => ({
                copies: entry.copiesInDeck,
                desired: entry.desiredCount
            }))
        );

        const combinedAtLeastProb = calculateMultinomialAtLeastProbability(
            deckSize,
            cardsToDraw,
            cardEntries.map(entry => ({
                copies: entry.copiesInDeck,
                desired: entry.desiredCount
            }))
        );

        return {
            individual: individualResults,
            combined: cardEntries.length > 1 ? {
                exactProb: combinedExactProb * 100,
                atLeastProb: combinedAtLeastProb * 100
            } : null
        };
    }, [calculateHypergeometric, calculateMultinomialProbability, calculateMultinomialAtLeastProbability]);

    return { calculateProbabilities };
}; 