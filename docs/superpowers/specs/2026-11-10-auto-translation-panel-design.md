# Automatic Vocabulary Panel Design

## Intent

Make the right-hand English–Vietnamese panel useful during a quiz by automatically showing translations for the meaningful English terms and technical phrases in the current question. The site remains a static, browser-only application: no backend or secret API key is introduced.

## Goals

- Extract relevant technical phrases first, then useful individual English words from the question, answer choices, and explanation.
- Reuse known glossary entries before making any network request.
- Persist successful word and phrase translations in `localStorage` so future questions and reloads avoid repeat requests.
- Request only uncached terms, with at most three translation requests in flight at once.
- Render the panel incrementally with a loading state for unresolved entries.
- Prevent responses started for an older question from altering the panel after navigation.

## Non-goals

- No backend, proxy, authentication, paid provider, or API secret.
- No attempt to translate the entire question or all answer choices in the vocabulary panel.
- No caching of failed translations; users should be able to retry on a later question visit.
- No linguistic parser or new dependency. Extraction remains deterministic and browser-native.

## Constraints

- Continue to use the existing public translation fallback function for uncached lookups.
- Keep the existing manual dictionary-search behavior.
- Limit the automatic panel to ten entries per question to control public API usage and visual density.
- The existing built-in glossary remains the authority for domain phrases it already contains.

## Approaches

1. **Call public translation APIs for every token.** Simple to build, but it creates many duplicate requests, floods the panel with function words, and is fragile under rate limits. Rejected.
2. **Use a backend and a supported provider.** Most reliable, but it adds hosting, key management, and ongoing provider cost. Rejected at the user's request.
3. **Static-browser extraction plus persistent local cache.** Match glossary phrases, then select non-stop-word terms; use `localStorage` and call the existing fallback only for cache misses. Chosen because it improves the feature without backend work and curbs repeat calls.

## Interaction Design

On a new question, the panel lists up to ten entries under “Từ vựng trong câu hiện tại”. Cached definitions appear immediately. Cache misses initially read “Đang tra…”, then update in place as translations finish. If a lookup fails, it reads “Chưa thể tra lúc này”; that result is deliberately not persisted.

The extraction order is: glossary phrases found in the current text, then unique English words longer than three letters after punctuation and stop words are removed. Terms already covered by a selected phrase are not repeated as standalone words.

## Technical Design

- Add a small browser helper file responsible only for normalizing keys, extracting a capped term list, reading/writing the persistent cache, and running asynchronous lookups with bounded concurrency.
- `script.js` supplies the current question text and existing glossary, renders returned entries, and maintains a monotonically increasing request token. Render callbacks only update the panel when their token still matches the active question.
- Store a versioned JSON object in `localStorage`; malformed or unavailable stored data falls back safely to an empty cache.

## Acceptance Criteria

- A technical glossary phrase appears as one entry and is not decomposed into duplicate constituent terms.
- A known translation is reused after reload without a translation request.
- Only uncached entries invoke the translator; no more than three requests run concurrently.
- Leaving a question while its lookups are pending cannot show old-question results in the new panel.
- A failed request is visible but does not block a later retry.
