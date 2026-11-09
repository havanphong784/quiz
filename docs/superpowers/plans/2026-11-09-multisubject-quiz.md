# Multi-subject Quiz Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand the existing CTDL&GT quiz into a clean, multi-subject quiz interface without changing its quiz or import behavior.

**Architecture:** Keep the single-page HTML and vanilla JavaScript structure. Update static copy and generated labels to be subject-neutral, then replace the current decorative CSS treatment with a compact navy–teal visual system that uses spacing and soft fills in place of heavy borders and shadows.

**Tech Stack:** HTML, CSS, vanilla JavaScript, existing Motion CDN.

**Spec:** `docs/superpowers/specs/2026-11-09-multisubject-quiz-design.md`

## Global Constraints

- Preserve the JSON format, scoring, local-storage behavior and import flow.
- Do not add dependencies, accounts, a server or new question data.
- Present existing CTDL&GT content as an available subject/collection.
- Use a light, navy–teal, low-border, low-shadow visual treatment.

## Review Focus

- A built-in CTDL&GT collection remains selectable and can start a quiz.
- Imported JSON continues to show in the collection list and can start a quiz.
- Narrow screens keep controls, stat cards and collection cards readable.
- Keyboard focus remains distinct after reducing borders.
- Empty search results and unselected states retain neutral, multi-subject language.

### Task 1: Rebrand the setup experience

**Files:**
- Modify: `index.html:7-155`
- Modify: `src/js/script.js:299-430`

**Interfaces:**
- Consumes: existing element IDs and pack-selection functions.
- Produces: subject-neutral static and generated labels without changing those IDs or function signatures.

- [ ] **Step 1: Add a failing static-copy check**

Run: `rg -n 'Quiz CTDL|Luyện quiz CTDL|Chọn gói câu hỏi' index.html src/js/script.js`
Expected: matches identify CTDL-only product copy before the change.

- [ ] **Step 2: Replace CTDL-only product copy with multi-subject vocabulary**

Keep ID names such as `pack-list` unchanged; change visible terms to “môn học”, “bộ đề”, “thư viện đề”, and explain that CTDL&GT is an existing collection.

- [ ] **Step 3: Run the static-copy check**

Run: `rg -n 'Quiz CTDL|Luyện quiz CTDL|Chọn gói câu hỏi' index.html src/js/script.js`
Expected: no matches.

### Task 2: Simplify the visual design

**Files:**
- Modify: `src/css/styles.css:1-1393`

**Interfaces:**
- Consumes: the classes and IDs emitted by `index.html` and `src/js/script.js`.
- Produces: responsive styling for the setup, quiz, collection, form and dialog states.

- [ ] **Step 1: Add a visual-regression baseline check**

Run: `rg -n 'rotate\(|box-shadow: [2-9]|border: 2px' src/css/styles.css`
Expected: matches show the existing scrapbook-like styling to remove.

- [ ] **Step 2: Replace the stylesheet with the minimal responsive navy–teal system**

Use a neutral canvas, white surfaces, 1px subdued separators, soft status fills, a single primary accent and a clearly visible focus ring. Preserve selectors used by the JavaScript and make the existing two-column layouts collapse to one column at tablet/mobile widths.

- [ ] **Step 3: Run CSS syntax and selector checks**

Run: `node --check src/js/script.js && rg -n 'rotate\(|box-shadow: [2-9]|border: 2px' src/css/styles.css`
Expected: JavaScript is valid and the old heavy styling patterns are absent.

### Task 3: Verify the usable quiz path

**Files:**
- Verify: `index.html`
- Verify: `src/css/styles.css`
- Verify: `src/js/script.js`

**Interfaces:**
- Consumes: the completed static page and existing browser event handlers.
- Produces: evidence that the redesign did not break the core user flow.

- [ ] **Step 1: Serve the static app locally and inspect it at desktop and mobile widths**

Run: `python3 -m http.server 4173`
Expected: the setup screen renders with readable layout and no overflow.

- [ ] **Step 2: Select a built-in collection and start a quiz**

Expected: selection state updates, “Vào quiz” enables, and the quiz session opens.

- [ ] **Step 3: Check repository changes**

Run: `git diff --check && git status --short`
Expected: no whitespace errors and only the design, plan and implementation files changed.
