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
        const matchedPhrases = [];

        [...glossary]
            .filter(item => item && item.term)
            .sort((left, right) => String(right.term).length - String(left.term).length)
            .forEach(item => {
                const term = String(item.term).trim();
                const key = normalizeKey(term);
                if (!key || knownTerms.has(key) || !containsTerm(source, term)) return;

                const termWords = key.match(/[a-z]+/g) || [];
                const isPhrase = termWords.length > 1;
                if (isPhrase && matchedPhrases.some(words => termWords.every(word => words.has(word)))) return;
                if (!isPhrase && termWords.some(word => usedWords.has(word))) return;

                found.push(term);
                knownTerms.add(key);
                termWords.forEach(word => usedWords.add(word));
                if (isPhrase) matchedPhrases.push(new Set(termWords));
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
        let values = Object.create(null);

        try {
            const saved = storage?.getItem(key);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                    Object.entries(parsed).forEach(([term, definition]) => {
                        if (typeof definition === "string" && definition.trim()) {
                            values[normalizeKey(term)] = definition;
                        }
                    });
                }
            }
        } catch {
            values = Object.create(null);
        }

        return {
            get(term) {
                const normalizedTerm = normalizeKey(term);
                return Object.hasOwn(values, normalizedTerm) ? values[normalizedTerm] : undefined;
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

    const sharedQueues = new Map();

    function getSharedQueue(limit) {
        const queueLimit = Math.max(1, Number(limit) || 1);
        if (sharedQueues.has(queueLimit)) return sharedQueues.get(queueLimit);

        const pending = [];
        let active = 0;
        const runNext = () => {
            while (active < queueLimit && pending.length > 0) {
                const task = pending.shift();
                active += 1;
                Promise.resolve()
                    .then(task.worker)
                    .then(task.resolve, task.reject)
                    .finally(() => {
                        active -= 1;
                        runNext();
                    });
            }
        };
        const queue = worker => new Promise((resolve, reject) => {
            pending.push({ worker, resolve, reject });
            runNext();
        });

        sharedQueues.set(queueLimit, queue);
        return queue;
    }

    async function resolveTranslations(terms, cache, limit, translate, onUpdate, isCurrent) {
        const entries = terms.map(term => {
            const definition = cache.get(term);
            return definition
                ? { term, def: definition, state: "ready" }
                : { term, def: "Đang tra…", state: "loading" };
        });
        const pending = entries
            .map((entry, index) => ({ entry, index }))
            .filter(({ entry }) => entry.state === "loading");

        const queue = getSharedQueue(limit);
        await Promise.all(pending.map(({ entry, index }) => queue(async () => {
            if (isCurrent && !isCurrent()) return;
            try {
                const definition = await translate(entry.term);
                if (!definition || typeof definition !== "string") throw new Error("Missing translation");

                entry.def = definition;
                entry.state = "ready";
                cache.set(entry.term, definition);
            } catch {
                entry.def = "Chưa thể tra lúc này";
                entry.state = "error";
            }
            onUpdate?.(entry, index);
        })));

        return entries;
    }

    window.TranslationUtils = { extractTerms, createPersistentCache, runWithConcurrency, resolveTranslations };
})();
