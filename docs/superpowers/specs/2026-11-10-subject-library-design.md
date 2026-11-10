# Subject-first Quiz Library Design

## Intent

Replace the flat list of quiz packs with a subject-first library. Learners first choose a subject, then browse only that subject’s packs before opening the existing pack dialog and starting a quiz.

## Goals

- The default library view displays one card per subject, including its pack count.
- Selecting a subject displays only that subject’s packs and a clear “Quay lại môn học” control.
- Search remains on the default view and searches globally across subject names and pack metadata.
- A non-empty global search displays matching packs directly, so a learner can open the result without entering its subject first.
- Imported packs use their `subject` value; packs without one remain in the existing `CTDL&GT` default subject.
- Existing pack selection, deletion of imported packs, statistics, and quiz navigation remain unchanged.

## Non-goals

- No changes to question JSON, pack import format, or quiz data.
- No nested subject hierarchy, tags-as-categories, routing, or persistent URL state.
- No change to the existing quiz-start dialog.

## Approaches

1. **Dedicated two-level library state — chosen.** Track an active subject in the existing browser state; render subject cards by default and render the corresponding pack cards when it is set. It uses the existing `subject` field and gives the requested select-subject-then-select-pack flow.
2. **Expandable subject groups in one flat list.** This requires fewer state changes, but it does not clearly separate the subject-selection step and leaves long groups visible in the library.
3. **Subject popup.** Keeps the initial view compact but adds a modal layer before the already-existing pack dialog, making the flow unnecessarily nested.

## Interaction Design

The panel title remains “Thư viện bộ đề”. In its default state it shows subject cards such as “CTDL&GT”, “Tổ chức & kiến trúc máy tính”, and “Hệ điều hành”, with the number of available packs. Clicking a card replaces the grid with that subject’s pack cards and exposes a back button above the grid.

The search box is visible only in the default subject view. Entering text searches all subjects and all pack titles, descriptions, sources, and tags. Matching pack cards are shown under a “Kết quả tìm kiếm” label; selecting one proceeds to the existing pack dialog. Clearing the search returns to subject cards. A no-match state uses the existing neutral empty copy style.

## Technical Design

- Add an `activeSubject` state value and a back button element to the library panel.
- Split the current `renderPacks` into a dispatcher plus small render functions for subject cards, subject pack cards, and global-search results. Reuse the existing pack-card creation and click behavior to avoid changing selection or import deletion flows.
- Derive subjects from `availablePacks` on each render, so imported and removed packs are reflected immediately.
- Add narrowly scoped CSS classes for subject-card grid layout and the back control, reusing existing card tokens and responsive breakpoints.

## Acceptance Criteria

- With an empty search, only subjects appear initially; no individual pack appears until a subject is selected.
- Clicking a subject shows only its packs, and the back control restores the subject cards.
- Searching for a subject or a pack name from the initial view displays matching packs across every subject.
- Starting a result or subject pack uses the existing dialog and quiz flow.
- Removing an imported pack refreshes the owning subject count or removes that subject card when it has no remaining packs.
