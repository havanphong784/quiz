# Automatic Vocabulary Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Automatically populate the right-side vocabulary panel with cached translations of useful English terms and phrases from the current quiz question.

**Architecture:** A standalone browser helper owns deterministic term extraction, a versioned persistent cache, and bounded-concurrency lookup scheduling. The existing quiz script passes current-question text and glossary data to that helper, renders entry state in the existing panel, and guards asynchronous updates with a question request token.

**Tech Stack:** Browser JavaScript, `localStorage`, existing public translation fallback APIs, Node.js built-in `assert` and `vm` for unit tests.

**Spec:** `docs/superpowers/specs/2026-11-10-auto-translation-panel-design.md`

## Global Constraints

- Keep the application browser-only; do not add a backend, dependency, API key, or provider account.
- Preserve manual dictionary search.
- Show no more than ten automatic vocabulary entries for one question.
- Persist only successful translations; failed lookups remain retryable.
- Use at most three concurrent API requests.

## Review Focus

- Glossary phrases containing regex characters or punctuation: extraction must remain literal and safe; test in Task 1.
- A phrase and one of its component words: the word must not duplicate the phrase; test in Task 1.
- Corrupt or unavailable `localStorage`: cache must safely behave as empty; test in Task 1.
- A failed lookup: render an error state without persisting it; test in Task 2.
- Navigation during requests: old callbacks must never mutate the active panel; test in Task 2.

---

### Task 1: Translation helper and unit tests

**Files:**

- Create: `src/js/translation-utils.js`
- Create: `tests/translation-utils.test.js`
- Modify: `index.html:173-174`

**Interfaces:**

- Produces `window.TranslationUtils` with `extractTerms(text, glossary, limit)`, `createPersistentCache(storage, key)`, and `runWithConcurrency(items, limit, worker)`.
- Consumes an array of glossary objects shaped as `{ term, def }`.

- [ ] **Step 1: Write failing tests for phrase-first extraction, de-duplication, and safe persistent-cache fallback**

```js
assert.deepEqual(
  utils.extractTerms('A binary tree uses tree traversal.', [{ term: 'binary tree', def: 'cây nhị phân' }], 10),
  ['binary tree', 'uses', 'traversal']
);
assert.equal(utils.createPersistentCache(brokenStorage, 'cache').get('tree'), undefined);
```

- [ ] **Step 2: Run the helper test to verify it fails because the helper is missing**

Run: `node tests/translation-utils.test.js`

Expected: failure naming the missing `translation-utils.js` or `TranslationUtils` interface.

- [ ] **Step 3: Implement the smallest browser-global helper in `src/js/translation-utils.js`**

Expose only the three interfaces above. Normalize keys using trim and lowercase; match glossary phrases before deriving words; exclude words contained in matched phrases; keep the first `limit` unique entries. Persist a JSON object only after a successful `set` call and treat parse/storage errors as cache misses. `runWithConcurrency` must schedule no more than `limit` active workers and preserve input order in its resolved array.

- [ ] **Step 4: Load the helper before `script.js` in `index.html`**

Add one local script tag immediately before the existing `script.js` tag.

- [ ] **Step 5: Run the helper test to verify it passes**

Run: `node tests/translation-utils.test.js`

Expected: all assertions pass.

- [ ] **Step 6: Commit**

```bash
git add src/js/translation-utils.js tests/translation-utils.test.js index.html
git commit -m "feat: add cached translation helpers"
```

### Task 2: Current-question panel integration

**Files:**

- Modify: `src/js/script.js:257-261, 679-695, 1120-1166, 1207-1323`
- Modify: `tests/translation-utils.test.js`

**Interfaces:**

- Consumes `TranslationUtils.extractTerms`, `createPersistentCache`, and `runWithConcurrency` from Task 1.
- Produces an auto-updating current-question vocabulary panel while retaining the manual dictionary-search path.

- [ ] **Step 1: Write failing tests for the UI lookup policy**

Use a fake worker and fake cache to prove that cached definitions skip the worker, a rejection produces an in-memory error result without a cache write, and concurrency never exceeds three.

- [ ] **Step 2: Run the test to verify it fails for the missing lookup policy**

Run: `node tests/translation-utils.test.js`

Expected: failure naming the missing current-question lookup policy.

- [ ] **Step 3: Integrate automatic vocabulary loading in `src/js/script.js`**

Create one persistent cache using a new versioned storage key. On every `showQuestion`, increment an active request token and call a replacement for `updateDictionaryForCurrentQuestion`. It must collect question, option, and explanation text; render cached entries and loading cache misses; execute uncached work through `runWithConcurrency(..., 3, ...)`; persist only successful translations; and update an entry only if its token is still active and manual search is blank.

- [ ] **Step 4: Preserve the manual search behavior and render empty/error states accessibly**

Keep `handleDictionarySearch` as the authority while the search box has text. Add the existing `muted-empty` styling to loading/error copy rather than adding new visual dependencies.

- [ ] **Step 5: Run the test suite to verify it passes**

Run: `node tests/translation-utils.test.js`

Expected: all assertions pass, including cached, failure, and maximum-concurrency cases.

- [ ] **Step 6: Manually verify the browser flow**

Run: `python3 -m http.server 8000`

Expected: selecting a quiz shows relevant vocabulary; revisiting a term reuses cache; moving immediately to another question never displays stale terms.

- [ ] **Step 7: Commit**

```bash
git add src/js/script.js tests/translation-utils.test.js
git commit -m "feat: auto translate current question vocabulary"
```

## Self-Review

- Spec coverage: Task 1 implements extraction, cache persistence, and the concurrency primitive; Task 2 applies them to the panel and protects navigation. All goals and acceptance criteria are covered.
- Type consistency: Task 2 consumes exactly the three browser-global helper interfaces Task 1 produces.
- Review focus: Each listed risk has a named test in Task 1 or Task 2.
- Proportion: Two independently testable tasks cover the helper and its quiz integration without a new framework or backend.
