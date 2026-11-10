# Subject-first Quiz Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let learners choose a subject before browsing its quiz packs, while retaining global search from the library’s initial view.

**Architecture:** A small browser-global helper derives subject summaries and global search results from the existing pack array. `script.js` holds the active-subject UI state and chooses whether to render subject cards, a subject’s pack cards, or global search results; it reuses the current pack-card selection/delete behavior.

**Tech Stack:** Browser JavaScript, existing HTML/CSS, Node.js built-in `assert` and `vm` for unit tests.

**Spec:** `docs/superpowers/specs/2026-11-10-subject-library-design.md`

## Global Constraints

- Do not change quiz JSON, import format, or the existing pack dialog/quiz flow.
- Search is global only from the default subject view.
- Existing and imported packs without `subject` use `CTDL&GT`.
- Add no framework or dependency.

## Review Focus

- An imported subject’s only pack is removed: its subject card must disappear; test in Task 1.
- Subject and pack searches are case-insensitive and include tags, source, and description; test in Task 1.
- A selected subject with no search keeps imported-pack delete controls working; verify in Task 2.
- Clearing global search restores subject cards rather than a flat pack list; verify in Task 2.
- Small screens retain readable subject cards and a usable back control; verify in Task 2.

---

### Task 1: Subject-library data helper

**Files:**

- Create: `src/js/library-utils.js`
- Create: `tests/library-utils.test.js`
- Modify: `index.html:173-174`

**Interfaces:**

- Produces `window.LibraryUtils` with `getSubjectSummaries(packs, fallbackSubject)` and `searchPacks(packs, query)`.
- Consumes pack objects with `title`, `desc`, `source`, `subject`, and optional `tags` fields.

- [ ] **Step 1: Write failing tests for subject summaries and global search**

```js
assert.deepEqual(utils.getSubjectSummaries(packs, "CTDL&GT"), [
  { name: "CTDL&GT", count: 2 },
  { name: "Hệ điều hành", count: 1 }
]);
assert.deepEqual(utils.searchPacks(packs, "os"), [packs[2]]);
```

Include the regression where removing an imported pack leaves no summary for its subject.

- [ ] **Step 2: Run the test to verify it fails because the helper is missing**

Run: `node tests/library-utils.test.js`

Expected: failure naming missing `library-utils.js` or `LibraryUtils`.

- [ ] **Step 3: Implement the minimal browser-global helper**

Use the fallback only for a missing/blank subject. Subject summaries have one entry per normalized subject, retain their display name, sort alphabetically with `localeCompare("vi")`, and count current packs. Search returns all packs for a blank query; otherwise it performs one case-insensitive includes search over title, description, source, subject, and joined tags.

- [ ] **Step 4: Load `library-utils.js` before `script.js`**

Add one local script tag after `translation-utils.js`.

- [ ] **Step 5: Run the helper test to verify it passes**

Run: `node tests/library-utils.test.js`

Expected: all assertions pass.

- [ ] **Step 6: Commit**

```bash
git add src/js/library-utils.js tests/library-utils.test.js index.html
git commit -m "feat: add subject library helpers"
```

### Task 2: Subject-first library UI

**Files:**

- Modify: `index.html:60-76`
- Modify: `src/js/script.js:271-436, 1379-1440`
- Modify: `src/css/styles-v2.css:406-500, 1039-1045, 1342-1405, 1523-1535`

**Interfaces:**

- Consumes `LibraryUtils.getSubjectSummaries` and `LibraryUtils.searchPacks` from Task 1.
- Produces default subject cards, selected-subject pack cards, and globally searched pack cards in `#pack-list`.

- [ ] **Step 1: Write a failing browser-facing regression check**

Add a small Node/vm check or DOM-free render-state helper test that expects default state `{ activeSubject: "", query: "" }` to select `subjects`, a subject selection to select `packs`, and a non-empty default-view query to select `search`.

- [ ] **Step 2: Run the test to verify it fails for the missing library-view state selector**

Run: `node tests/library-utils.test.js`

Expected: failure naming the missing view-state selector.

- [ ] **Step 3: Add the back control and subject-view state**

Add a hidden `#btn-back-subjects` button near the library heading. In `script.js`, maintain `activeSubject`; clicking a subject sets it, and the back button clears it. Rebuilding the pack list must clear an active subject that no longer exists.

- [ ] **Step 4: Render each library state without changing pack-card behavior**

Dispatch render based on the helper’s state selector: show subject cards by default, only active-subject packs after selection, and global search-result packs when the default search query is non-empty. Factor the existing pack-card creation into one reusable function so selecting/deleting a pack behaves exactly as before.

- [ ] **Step 5: Add scoped responsive styles**

Style the subject grid and subject cards with existing surface, border, text, and responsive grid tokens. Keep the existing pack-card styles intact and ensure the back control remains available at narrow widths.

- [ ] **Step 6: Run automated checks and manually verify the browser flow**

Run: `node tests/library-utils.test.js && node tests/translation-utils.test.js && node --check src/js/library-utils.js && node --check src/js/script.js`

Expected: all commands exit 0.

Run: `python3 -m http.server 8000`

Expected: default view shows subjects; selecting one shows only its packs; back returns to subjects; a default-view search finds packs across subjects; existing pack dialog opens.

- [ ] **Step 7: Commit**

```bash
git add index.html src/js/script.js src/css/styles-v2.css tests/library-utils.test.js
git commit -m "feat: group quiz packs by subject"
```

## Self-Review

- Spec coverage: Task 1 derives live subject/search data; Task 2 supplies the requested two-level interaction, global search, responsive styles, and existing-flow preservation.
- Type consistency: Task 2 uses only the two helper functions Task 1 exposes and the explicit library-view selector it adds.
- Review focus: Every stated data edge case has a Task 1 test; deletion/search-reset/mobile behavior is owned by Task 2 verification.
- Proportion: The plan keeps data derivation independent and minimizes UI changes to the existing setup panel.
