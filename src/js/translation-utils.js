(() => {
    const stopWords = new Set([
        "the", "is", "at", "which", "on", "in", "to", "a", "an", "and", "for", "of", "with", "by", "as",
        "it", "that", "this", "be", "are", "or", "not", "if", "then", "there", "such", "can", "has",
        "have", "from", "but", "when", "how", "what", "why", "will", "would", "should", "could", "about",
        "into", "only", "than", "over", "also", "some", "any", "very", "much", "more", "most"
    ]);

    function normalizeKey(value) {
        return String(value || "").trim().toLowerCase();
    }

    function escapeRegExp(value) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function containsTerm(text, term) {
        return new RegExp(`(^|[^a-z0-9])${escapeRegExp(term)}(?=$|[^a-z0-9])`, "i").test(text);
    }

    function extractTerms(text, glossary = [], limit = 10) {
        const source = String(text || "");
        const found = [];
        const usedWords = new Set();
        const knownTerms = new Set();

        [...glossary]
            .filter(item => item && item.term)
            .sort((left, right) => String(right.term).length - String(left.term).length)
            .forEach(item => {
                const term = String(item.term).trim();
                const key = normalizeKey(term);
                if (!key || knownTerms.has(key) || !containsTerm(source, term)) return;

                const termWords = key.match(/[a-z]+/g) || [];
                if (termWords.some(word => usedWords.has(word))) return;

                found.push(term);
                knownTerms.add(key);
                termWords.forEach(word => usedWords.add(word));
            });

        const words = source.toLowerCase().match(/[a-z]+/g) || [];
        words.forEach(word => {
            if (found.length >= limit || word.length <= 3 || stopWords.has(word) || usedWords.has(word) || knownTerms.has(word)) {
                return;
            }
            found.push(word);
            knownTerms.add(word);
        });

        return found.slice(0, limit);
    }

    function createPersistentCache(storage, key) {
        let values = {};

        try {
            const saved = storage?.getItem(key);
            if (saved) {
                const parsed = JSON.parse(saved);
                values = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
            }
        } catch {
            values = {};
        }

        return {
            get(term) {
                return values[normalizeKey(term)];
            },
            set(term, translation) {
                const normalizedTerm = normalizeKey(term);
                if (!normalizedTerm || typeof translation !== "string" || !translation.trim()) return;

                values[normalizedTerm] = translation;
                try {
                    storage?.setItem(key, JSON.stringify(values));
                } catch {
                    // Memory caching still avoids duplicate lookups in this session.
                }
            }
        };
    }

    async function runWithConcurrency(items, limit, worker) {
        const results = new Array(items.length);
        let nextIndex = 0;
        const workerCount = Math.min(items.length, Math.max(1, Number(limit) || 1));

        await Promise.all(Array.from({ length: workerCount }, async () => {
            while (nextIndex < items.length) {
                const index = nextIndex++;
                results[index] = await worker(items[index], index);
            }
        }));

        return results;
    }

    window.TranslationUtils = { extractTerms, createPersistentCache, runWithConcurrency };
})();
