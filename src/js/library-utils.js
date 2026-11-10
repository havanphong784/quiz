(() => {
    function getSubjectName(pack, fallbackSubject) {
        return String(pack?.subject || "").trim() || fallbackSubject;
    }

    function getSubjectSummaries(packs, fallbackSubject) {
        const subjects = new Map();

        packs.forEach(pack => {
            const name = getSubjectName(pack, fallbackSubject);
            const key = name.toLocaleLowerCase("vi");
            const subject = subjects.get(key) || { name, count: 0 };
            subject.count += 1;
            subjects.set(key, subject);
        });

        return [...subjects.values()].sort((left, right) => left.name.localeCompare(right.name, "vi"));
    }

    function searchPacks(packs, query) {
        const normalizedQuery = String(query || "").trim().toLocaleLowerCase("vi");
        if (!normalizedQuery) return [...packs];

        return packs.filter(pack => {
            const haystack = [pack.title, pack.desc, pack.source, pack.subject, ...(pack.tags || [])]
                .filter(Boolean)
                .join(" ")
                .toLocaleLowerCase("vi");
            return haystack.includes(normalizedQuery);
        });
    }

    window.LibraryUtils = { getSubjectSummaries, searchPacks };
})();
