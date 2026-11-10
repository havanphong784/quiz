// Safe fallback if Motion library fails to load (e.g., offline or CDN error)
const motionLib = window.Motion || {
    animate: (selector, keyframes, options) => {
        return { finished: Promise.resolve(), stop: () => {} };
    },
    spring: () => "ease-out",
    stagger: () => 0
};
const { animate, spring, stagger } = motionLib;

const glossary = [
    { term: "Algorithm", def: "Thuật toán" },
    { term: "Data Structure", def: "Cấu trúc dữ liệu" },
    { term: "Time Complexity", def: "Độ phức tạp thời gian" },
    { term: "Space Complexity", def: "Độ phức tạp không gian" },
    { term: "Array", def: "Mảng" },
    { term: "Linked List", def: "Danh sách liên kết" },
    { term: "Stack", def: "Ngăn xếp" },
    { term: "Queue", def: "Hàng đợi" },
    { term: "Tree", def: "Cây" },
    { term: "Graph", def: "Đồ thị" },
    { term: "Node", def: "Nút / đỉnh" },
    { term: "Edge", def: "Cạnh" },
    { term: "Sorting", def: "Sắp xếp" },
    { term: "Searching", def: "Tìm kiếm" },
    { term: "Recursion", def: "Đệ quy" },
    { term: "Dynamic Programming", def: "Quy hoạch động" },
    { term: "Greedy Algorithm", def: "Thuật toán tham lam" },
    { term: "Divide and Conquer", def: "Chia để trị" },
    { term: "Hash Table", def: "Bảng băm" },
    { term: "Binary Search", def: "Tìm kiếm nhị phân" },
    { term: "Upper Bound", def: "Cận trên" },
    { term: "Lower Bound", def: "Cận dưới" },
    { term: "Tight Bound", def: "Cận chặt" },
    { term: "Constant Time", def: "Thời gian hằng số" },
    { term: "Linear Time", def: "Thời gian tuyến tính" },
    { term: "Quadratic Time", def: "Thời gian bậc hai" },
    { term: "Asymptotic Notation", def: "Ký pháp tiệm cận" }
];

const builtInPacks = [
    {
        id: "algo_analysis",
        title: "Phân tích thuật toán",
        desc: "Độ phức tạp, Big O, Omega, Theta và tốc độ tăng trưởng.",
        file: "./src/data/Algorithm_Analysis.json",
        source: "Có sẵn"
    },
    {
        id: "linked_lists",
        title: "Danh sách liên kết",
        desc: "Singly, doubly, circular linked lists và các thao tác cơ bản.",
        file: "./src/data/Linked_Lists.json",
        source: "Có sẵn"
    },
    {
        id: "stacks_queues",
        title: "Ngăn xếp & hàng đợi",
        desc: "LIFO, FIFO, cài đặt bằng mảng và danh sách liên kết.",
        file: "./src/data/Stacks-Queues.json",
        source: "Có sẵn"
    },
    {
        id: "search_sort",
        title: "Tìm kiếm & sắp xếp",
        desc: "Sequential search, binary search và các thuật toán sort nền tảng.",
        file: "./src/data/Searching_Sorting.json",
        source: "Có sẵn"
    },
    {
        id: "trees",
        title: "Cây",
        desc: "Binary tree, binary search tree, forest và duyệt cây.",
        file: "./src/data/Trees.json",
        source: "Có sẵn"
    },
    {
        id: "heaps",
        title: "Heap",
        desc: "Max heap, min heap, priority queue và heap sort.",
        file: "./src/data/Heaps.json",
        source: "Có sẵn"
    },
    {
        id: "graphs",
        title: "Đồ thị",
        desc: "Biểu diễn đồ thị, BFS, DFS và thuật ngữ liên quan.",
        file: "./src/data/Graphs.json",
        source: "Có sẵn"
    },
    {
        id: "hash_table",
        title: "Bảng băm",
        desc: "Hashing tĩnh, hashing động và xử lý xung đột.",
        file: "./src/data/Hash_Table.json",
        source: "Có sẵn"
    }
];

const packEnhancements = {
    algo_analysis: { tags: ["Foundation", "Big-O", "Theory"] },
    linked_lists: { tags: ["Structure", "Linked List", "Pointer"] },
    stacks_queues: { tags: ["Structure", "Stack", "Queue"] },
    search_sort: { tags: ["Algorithm", "Search", "Sort"] },
    trees: { tags: ["Structure", "Tree", "Traversal"] },
    heaps: { tags: ["Structure", "Heap", "Priority Queue"] },
    graphs: { tags: ["Structure", "Graph", "BFS/DFS"] },
    hash_table: { tags: ["Structure", "Hashing", "Collision"] }
};

builtInPacks.forEach(pack => Object.assign(pack, packEnhancements[pack.id] || {}));

builtInPacks.push(
    {
        id: "dsa_easy_50",
        title: "DSA Easy - 50 Questions",
        desc: "Entry-level DSA review questions for core concepts and basic operations.",
        file: "./src/data/dsa_easy_50_questions.json",
        source: "Built-in",
        count: 50,
        tags: ["Easy", "50 questions", "Review"]
    },
    {
        id: "dsa_medium_50",
        title: "DSA Medium - 50 Questions",
        desc: "Medium DSA questions focused on analysis and practical algorithm use.",
        file: "./src/data/dsa_medium_50_questions.json",
        source: "Built-in",
        count: 50,
        tags: ["Medium", "50 questions", "Practice"]
    },
    {
        id: "dsa_hard_50",
        title: "DSA Hard - 50 Questions",
        desc: "Advanced DSA questions for complexity analysis and deeper reasoning.",
        file: "./src/data/dsa_hard_50_questions.json",
        source: "Built-in",
        count: 50,
        tags: ["Hard", "50 questions", "Advanced"]
    },
    {
        id: "coa_ch01",
        title: "COA · Chương 1: Khái niệm cơ bản",
        desc: "Kiến trúc, tổ chức máy tính và quá trình phát triển máy tính.",
        file: "./src/data/CH01-Basic_Concepts_and_Computer_Evolution.json",
        source: "Có sẵn",
        subject: "Tổ chức & kiến trúc máy tính",
        count: 30,
        tags: ["COA", "Chương 1"]
    },
    {
        id: "coa_ch02",
        title: "COA · Chương 2: Hiệu năng",
        desc: "Các thước đo, công thức và yếu tố ảnh hưởng đến hiệu năng máy tính.",
        file: "./src/data/CH02-Performance_Issues.json",
        source: "Có sẵn",
        subject: "Tổ chức & kiến trúc máy tính",
        count: 30,
        tags: ["COA", "Chương 2"]
    },
    {
        id: "coa_ch03",
        title: "COA · Chương 3: Chức năng & liên kết",
        desc: "Chu kỳ lệnh, bus hệ thống và sự liên kết giữa các thành phần máy tính.",
        file: "./src/data/CH03-Computer_Function_and_Interconnection.json",
        source: "Có sẵn",
        subject: "Tổ chức & kiến trúc máy tính",
        count: 30,
        tags: ["COA", "Chương 3"]
    },
    {
        id: "coa_ch04",
        title: "COA · Chương 4: Bộ nhớ đệm",
        desc: "Cache memory, ánh xạ cache và các chính sách thay thế.",
        file: "./src/data/CH04-Cache_Memory.json",
        source: "Có sẵn",
        subject: "Tổ chức & kiến trúc máy tính",
        count: 30,
        tags: ["COA", "Chương 4"]
    },
    {
        id: "coa_ch05",
        title: "COA · Chương 5: Bộ nhớ trong",
        desc: "Bộ nhớ bán dẫn, mã sửa lỗi và tổ chức bộ nhớ trong.",
        file: "./src/data/CH05-Internal_Memory.json",
        source: "Có sẵn",
        subject: "Tổ chức & kiến trúc máy tính",
        count: 30,
        tags: ["COA", "Chương 5"]
    },
    {
        id: "coa_cache_40",
        title: "COA · Chương 4: Cache nâng cao",
        desc: "Phân cấp bộ nhớ, locality và các kỹ thuật tối ưu cache.",
        file: "./src/data/coa_chapter4_cache_mcq_40_questions.json",
        source: "Có sẵn",
        subject: "Tổ chức & kiến trúc máy tính",
        count: 40,
        tags: ["COA", "Cache"]
    },
    {
        id: "os_ch01",
        title: "Hệ điều hành · Chương 1: Tổng quan",
        desc: "Vai trò, cấu trúc và các khái niệm nền tảng của hệ điều hành.",
        file: "./src/data/chapter1_mcq_40_questions.json",
        source: "Có sẵn",
        subject: "Hệ điều hành",
        count: 40,
        tags: ["OS", "Chương 1"]
    },
    {
        id: "os_ch02",
        title: "Hệ điều hành · Chương 2: Tiến trình",
        desc: "Tiến trình, luồng, lập lịch và đồng bộ hóa.",
        file: "./src/data/chapter2_mcq_40_questions.json",
        source: "Có sẵn",
        subject: "Hệ điều hành",
        count: 40,
        tags: ["OS", "Chương 2"]
    },
    {
        id: "os_ch03",
        title: "Hệ điều hành · Chương 3: Quản lý bộ nhớ",
        desc: "Không gian địa chỉ, phân trang và bộ nhớ ảo.",
        file: "./src/data/chapter3_mcq_40_questions.json",
        source: "Có sẵn",
        subject: "Hệ điều hành",
        count: 40,
        tags: ["OS", "Chương 3"]
    },
    {
        id: "os_ch04",
        title: "Hệ điều hành · Chương 4: Hệ thống tệp",
        desc: "Tệp, thư mục, lưu trữ lâu dài và các hệ thống tệp.",
        file: "./src/data/chapter4_mcq_40_questions.json",
        source: "Có sẵn",
        subject: "Hệ điều hành",
        count: 40,
        tags: ["OS", "Chương 4"]
    },
    {
        id: "os_advanced_tanenbaum",
        title: "Hệ điều hành nâng cao · Tanenbaum",
        desc: "MINIX, bảo vệ hệ thống, real-time và các chủ đề hệ điều hành nâng cao.",
        file: "./src/data/tanenbaum_advanced_os_mcq_40_questions.json",
        source: "Có sẵn",
        subject: "Hệ điều hành",
        count: 40,
        tags: ["OS", "Nâng cao"]
    }
);

builtInPacks.forEach(pack => {
    pack.subject ||= "CTDL&GT";
});

const STORAGE_STATS_KEY = "ctdlgt_quiz_stats_v2";
const STORAGE_PROGRESS_PREFIX = "ctdlgt_progress_";
const STORAGE_IMPORTED_KEY = "ctdlgt_imported_packs_v1";
const STORAGE_TRANSLATION_CACHE_KEY = "ctdlgt_translation_cache_v1";
const sentenceCache = new Map();
const glossaryDefinitions = new Map(glossary.map(item => [item.term.toLowerCase(), item.def]));
const persistentTranslationCache = TranslationUtils.createPersistentCache(getLocalStorage(), STORAGE_TRANSLATION_CACHE_KEY);

let importedPacks = [];
let availablePacks = [];
let selectedPack = null;
let baseQuestions = [];
let currentQuestions = [];
let currentPackId = null;
let activePack = null;
let currentQuestionIndex = 0;
let userAnswers = {};
let score = 0;
let studyMode = "practice";
let isWrongPractice = false;
let quizFinished = false;
let sessionRecorded = false;
let sessionStarted = false;
let sessionStartedAt = null;
let dictionaryRequestToken = 0;
let activeSubject = "";

function getLocalStorage() {
    try {
        return window.localStorage;
    } catch {
        return undefined;
    }
}

const els = {
    setupView: document.getElementById("setup-view"),
    quizView: document.getElementById("quiz-view"),
    selectedPackSummary: document.getElementById("selected-pack-summary"),
    packList: document.getElementById("pack-list"),
    packCount: document.getElementById("pack-count"),
    packSearch: document.getElementById("pack-search"),
    btnBackSubjects: document.getElementById("btn-back-subjects"),
    packDialog: document.getElementById("pack-dialog"),
    packDialogTitle: document.getElementById("pack-dialog-title"),
    packDialogDescription: document.getElementById("pack-dialog-description"),
    quizContainer: document.getElementById("quiz-container"),
    emptyState: document.getElementById("empty-state"),
    activePackLabel: document.getElementById("active-pack-label"),
    quizTitle: document.getElementById("quiz-title"),
    questionText: document.getElementById("question-text"),
    questionTranslation: document.getElementById("question-translation"),
    btnTranslateQuestion: document.getElementById("btn-translate-question"),
    btnTranslateExplanation: document.getElementById("btn-translate-explanation"),
    optionsContainer: document.getElementById("options-container"),
    explanationCard: document.getElementById("explanation-card"),
    explanationText: document.getElementById("explanation-text"),
    explanationTranslated: document.getElementById("explanation-translated"),
    resultCard: document.getElementById("result-card"),
    btnPrev: document.getElementById("btn-prev"),
    btnNext: document.getElementById("btn-next"),
    btnBackSetup: document.getElementById("btn-back-setup"),
    btnOpenQuiz: document.getElementById("btn-open-quiz"),
    questionCounter: document.getElementById("question-counter"),
    scoreDisplay: document.getElementById("score-display"),
    progressBar: document.getElementById("overall-progress-bar"),
    progressText: document.getElementById("progress-text"),
    btnPracticeWrong: document.getElementById("btn-practice-wrong"),
    metricSessions: document.getElementById("metric-sessions"),
    metricAccuracy: document.getElementById("metric-accuracy"),
    metricBest: document.getElementById("metric-best"),
    metricWrong: document.getElementById("metric-wrong"),
    statAccuracyLabel: document.getElementById("stat-accuracy-label"),
    statBestLabel: document.getElementById("stat-best-label"),
    statWrongLabel: document.getElementById("stat-wrong-label"),
    statAccuracyBar: document.getElementById("stat-accuracy-bar"),
    statBestBar: document.getElementById("stat-best-bar"),
    statWrongBar: document.getElementById("stat-wrong-bar"),
    dictList: document.getElementById("dict-list"),
    dictSearch: document.getElementById("dict-search")
};

function init() {
    importedPacks = readImportedPacks();
    rebuildPackList();
    renderDictionary(glossary);
    updateStatsDisplay();
    bindEvents();
    showSetupView();
}

function bindEvents() {
    els.packSearch.addEventListener("input", renderPacks);
    els.btnBackSubjects.addEventListener("click", () => { activeSubject = ""; renderPacks(); });
    els.dictSearch.addEventListener("input", handleDictionarySearch);
    els.btnNext.addEventListener("click", handleNext);
    els.btnPrev.addEventListener("click", handlePrev);
    els.btnBackSetup.addEventListener("click", showSetupView);
    els.btnOpenQuiz.addEventListener("click", () => openQuizFromSelection(false));
    els.btnPracticeWrong.addEventListener("click", startWrongPractice);
    els.btnTranslateQuestion.addEventListener("click", translateCurrentQuestion);
    els.btnTranslateExplanation.addEventListener("click", translateCurrentExplanation);
}

function rebuildPackList() {
    availablePacks = [...builtInPacks, ...importedPacks];
    availablePacks.forEach(pack => { pack.subject ||= "CTDL&GT"; });
    if (activeSubject && !availablePacks.some(pack => pack.subject === activeSubject)) activeSubject = "";
    els.packCount.textContent = `${availablePacks.length} bộ đề`;
    renderPacks();
}

function renderPacks() {
    const query = els.packSearch.value.trim().toLowerCase();
    const view = LibraryUtils.getLibraryView(activeSubject, query);
    els.btnBackSubjects.hidden = view !== "packs";
    els.packSearch.closest("label").hidden = view === "packs";

    els.packList.innerHTML = "";

    if (view === "subjects") {
        LibraryUtils.getSubjectSummaries(availablePacks, "CTDL&GT").forEach(subject => {
            const item = document.createElement("button");
            item.type = "button";
            item.className = "subject-item";
            item.innerHTML = `<strong>${escapeHtml(subject.name)}</strong><span>${subject.count} bộ đề</span>`;
            item.addEventListener("click", () => { activeSubject = subject.name; renderPacks(); });
            els.packList.appendChild(item);
        });
        return;
    }

    const packs = view === "packs"
        ? availablePacks.filter(pack => pack.subject === activeSubject)
        : LibraryUtils.searchPacks(availablePacks, query);

    if (packs.length === 0) {
        els.packList.innerHTML = '<p class="muted-empty">Không tìm thấy bộ đề phù hợp.</p>';
        return;
    }

    packs.forEach(pack => els.packList.appendChild(createPackItem(pack)));
}

function createPackItem(pack) {
        const item = document.createElement("button");
        item.type = "button";
        item.className = `pack-item ${selectedPack?.id === pack.id ? "active" : ""}`;
        const tagMarkup = renderPackTags(pack.tags);
        const source = [pack.source || "Tự thêm", pack.subject].filter(Boolean).join(" · ");
        item.innerHTML = `
            <div class="pack-topline">
                <h3>${escapeHtml(pack.title)}</h3>
                <span class="pack-source">${escapeHtml(source)}</span>
            </div>
            <p>${escapeHtml(pack.desc || "Bộ đề đã được thêm.")}</p>
            ${tagMarkup}
            <div class="pack-meta">
                <span>${pack.count ? `${pack.count} câu` : "Sẵn sàng tải"}</span>
                ${pack.imported ? '<span class="text-button" data-delete-pack>Gỡ</span>' : ""}
            </div>
        `;

        item.addEventListener("click", event => {
            if (event.target.closest("[data-delete-pack]")) {
                removeImportedPack(pack.id);
                return;
            }
            selectPack(pack);
        });

        return item;
}

function renderPackTags(tags = []) {
    if (!Array.isArray(tags) || tags.length === 0) {
        return "";
    }

    return `
        <div class="pack-tags">
            ${tags.map(tag => `<span class="pack-tag">${escapeHtml(tag)}</span>`).join("")}
        </div>
    `;
}

function selectPack(pack) {
    selectedPack = pack;
    currentPackId = pack.id;
    renderPacks();
    updateSelectedPackSummary(pack);
    updateStatsDisplay(pack.id);
    openPackDialog(pack);
}

function openPackDialog(pack) {
    const packStats = getPackStats(pack.id);
    const questionCount = pack.count ? `${pack.count} câu hỏi` : "Sẵn sàng tải câu hỏi";

    els.packDialogTitle.textContent = pack.title;
    els.packDialogDescription.textContent = `${pack.desc || "Bộ đề đã được thêm."} ${questionCount}.`;
    els.btnOpenQuiz.disabled = false;
    els.btnPracticeWrong.disabled = packStats.wrongQuestionIds.length === 0;

    if (!els.packDialog.open) {
        els.packDialog.showModal();
    }
}

function updateSelectedPackSummary(pack) {
    const packStats = getPackStats(pack.id);
    const wrongCount = packStats.wrongQuestionIds.length;
    els.selectedPackSummary.innerHTML = `
        <span>Bộ đề đang chọn</span>
        <strong>${escapeHtml(pack.title)}</strong>
        <small>${escapeHtml(pack.desc || "Bộ đề đã được thêm.")}</small>
        <small>${wrongCount > 0 ? `${wrongCount} câu sai có thể ôn lại` : "Chưa có câu sai trong bộ đề này"}</small>
    `;

    animate(
        els.selectedPackSummary,
        { opacity: [0, 1], scale: [0.9, 1], rotate: [-1, 0] },
        { type: "spring", stiffness: 400, damping: 15 }
    );
}

async function openQuizFromSelection(wrongPractice) {
    if (!selectedPack) {
        setImportStatus("Chọn một bộ đề trước khi vào quiz.", "error");
        return;
    }
    if (els.packDialog.open) {
        els.packDialog.close();
    }
    await loadPack(selectedPack, wrongPractice);
}

async function loadPack(pack, wrongPractice = false) {
    try {
        const data = pack.imported ? pack.questions : await fetchPackFile(pack.file);
        const questions = normalizeQuestions(data);

        activePack = { ...pack, count: questions.length };
        currentPackId = pack.id;
        baseQuestions = questions.map((question, index) => ({ ...question, __originalIndex: index }));

        let sessionQuestions = baseQuestions;
        if (wrongPractice) {
            const wrongIds = new Set(getPackStats(currentPackId).wrongQuestionIds || []);
            sessionQuestions = baseQuestions.filter(question => wrongIds.has(question.__originalIndex));
            if (sessionQuestions.length === 0) {
                setImportStatus("Bộ đề này chưa có câu sai để ôn lại.", "success");
                return;
            }
        }

        startSession(sessionQuestions, wrongPractice);
        showQuizView();
        renderPacks();
        updateStatsDisplay(pack.id);
    } catch (error) {
        console.error("Không thể tải bộ đề:", error);
        setImportStatus("Không thể tải bộ đề. Kiểm tra lại file dữ liệu.", "error");
    }
}

async function fetchPackFile(file) {
    const response = await fetch(file);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
}

function normalizeQuestions(data) {
    let questionsArray = data;
    if (!Array.isArray(data) && data && typeof data === "object") {
        if (Array.isArray(data.questions)) {
            questionsArray = data.questions;
        } else if (Array.isArray(data.data)) {
            questionsArray = data.data;
        } else if (Array.isArray(data.quiz)) {
            questionsArray = data.quiz;
        }
    }

    if (!Array.isArray(questionsArray)) {
        throw new Error("Dữ liệu phải là một mảng câu hỏi hoặc chứa mảng câu hỏi (ví dụ: { questions: [...] }).");
    }

    const normalized = questionsArray.map((item, index) => {
        const question = String(item.question || item.title || item.text || "").trim();
        
        let options = [];
        if (Array.isArray(item.options)) {
            options = item.options.map(option => String(option).trim()).filter(Boolean);
        } else if (Array.isArray(item.answers)) {
            options = item.answers.map(option => String(option).trim()).filter(Boolean);
        } else if (Array.isArray(item.choices)) {
            options = item.choices.map(option => String(option).trim()).filter(Boolean);
        }

        let rawAnswer = item.answer !== undefined ? item.answer : (item.correctAnswer !== undefined ? item.correctAnswer : item.correct_answer);
        let answer = "";
        
        if (rawAnswer !== undefined && rawAnswer !== null) {
            let strAnswer = String(rawAnswer).trim();
            
            // Case 1: Answer is index-based (e.g. 0, 1, 2)
            if (/^\d+$/.test(strAnswer)) {
                const idx = parseInt(strAnswer, 10);
                if (idx >= 0 && idx < options.length) {
                    answer = String.fromCharCode(65 + idx);
                }
            }
            
            // Case 2: Answer starts with choice letter (e.g. "A.", "A)", "A ")
            if (!answer) {
                const matchLetter = strAnswer.match(/^([A-Z])([\.\)\s]|$)/i);
                if (matchLetter) {
                    answer = matchLetter[1].toUpperCase();
                }
            }
            
            // Case 3: Answer is option text string matching one of options
            if (!answer) {
                const matchIdx = options.findIndex(opt => {
                    const optStr = opt.toLowerCase();
                    const ansStr = strAnswer.toLowerCase();
                    if (optStr === ansStr) return true;
                    const parsed = parseOption(opt, 0);
                    return parsed.text.toLowerCase() === ansStr;
                });
                if (matchIdx !== -1) {
                    answer = String.fromCharCode(65 + matchIdx);
                }
            }
            
            // Default: Single letter matching A-Z
            if (!answer && /^[A-Za-z]$/.test(strAnswer)) {
                answer = strAnswer.toUpperCase();
            }
        }

        const explanation = String(item.explanation || item.explain || item.desc || "").trim();

        if (!question) {
            throw new Error(`Câu ${index + 1} bị thiếu nội dung câu hỏi (question).`);
        }
        if (options.length < 2) {
            throw new Error(`Câu ${index + 1} phải có ít nhất 2 phương án lựa chọn (options).`);
        }
        if (!answer || !/^[A-Z]$/.test(answer)) {
            throw new Error(`Câu ${index + 1} thiếu đáp án đúng hoặc đáp án không hợp lệ ("${rawAnswer}").`);
        }

        const answerIdx = answer.charCodeAt(0) - 65;
        if (answerIdx >= options.length) {
            throw new Error(`Câu ${index + 1} có đáp án "${answer}" vượt quá số lượng phương án (${options.length}).`);
        }

        return { question, options, answer, explanation };
    });

    if (normalized.length === 0) {
        throw new Error("File JSON không chứa câu hỏi nào.");
    }

    return normalized;
}

function startSession(questions, wrongPractice) {
    isWrongPractice = wrongPractice;
    currentQuestions = questions;
    currentQuestionIndex = 0;
    userAnswers = {};
    score = 0;
    quizFinished = false;
    sessionRecorded = false;
    sessionStarted = true;
    sessionStartedAt = Date.now();
    if (studyMode === "practice" && !wrongPractice) {
        loadProgress(currentPackId);
    }

    els.activePackLabel.textContent = wrongPractice ? "Ôn lại câu sai" : activePack.source || "Bộ đề";
    els.quizTitle.textContent = `${activePack.title}${wrongPractice ? " - câu sai" : ""}`;
    els.emptyState.hidden = true;
    els.quizContainer.hidden = false;
    els.resultCard.hidden = true;
    updateOverallProgress();
    showQuestion();
}

function resetActiveSession({ clearSavedProgress = false, autoStart = false } = {}) {
    if (!activePack || baseQuestions.length === 0) return;

    if (clearSavedProgress && currentPackId) {
        localStorage.removeItem(`${STORAGE_PROGRESS_PREFIX}${currentPackId}`);
    }

    startSession(isWrongPractice ? currentQuestions : baseQuestions, isWrongPractice);

}

function showSetupView() {
    els.setupView.hidden = false;
    els.quizView.hidden = true;
    els.btnBackSetup.hidden = true;
    document.documentElement.scrollTop = 0;

    animate(
        els.setupView,
        { opacity: [0, 1] },
        { duration: 0.3, easing: "ease-out" }
    );
    
    animate(".setup-hero", { opacity: [0, 1], scale: [0.95, 1], y: [20, 0] }, { duration: 0.5, type: "spring", stiffness: 300, damping: 20 });
    animate(".metric-card", { opacity: [0, 1], scale: [0.8, 1], y: [30, 0] }, { delay: stagger(0.08), type: "spring", stiffness: 400, damping: 18 });
}

function showQuizView() {
    els.setupView.hidden = true;
    els.quizView.hidden = false;
    els.btnBackSetup.hidden = false;
    document.documentElement.scrollTop = 0;

    animate(
        els.quizView,
        { opacity: [0, 1] },
        { duration: 0.3, easing: "ease-out" }
    );
    
    animate(".quiz-stage", { opacity: [0, 1], scale: [0.98, 1], y: [20, 0] }, { duration: 0.4, type: "spring", stiffness: 300, damping: 20 });
    animate(".assist-panel", { opacity: [0, 1], x: [30, 0] }, { duration: 0.4, type: "spring", stiffness: 300, damping: 20 });
}

function startWrongPractice() {
    openQuizFromSelection(true);
}

function showQuestion() {
    if (currentQuestions.length === 0) return;

    calculateScore();
    const question = currentQuestions[currentQuestionIndex];
    const hasAnswered = userAnswers[currentQuestionIndex] !== undefined;
    const showAnswers = studyMode === "practice" || quizFinished;
    const canInteract = sessionStarted && !quizFinished;

    els.questionCounter.textContent = `${currentQuestionIndex + 1} / ${currentQuestions.length}`;
    els.scoreDisplay.textContent = showAnswers ? `Đúng: ${score}` : `Đã trả lời: ${Object.keys(userAnswers).length}`;
    els.questionText.textContent = question.question;
    els.questionTranslation.textContent = "";
    els.optionsContainer.innerHTML = "";
    els.explanationCard.hidden = true;
    els.explanationCard.className = "explanation-card";
    els.explanationTranslated.textContent = "";

    question.options.forEach((option, index) => {
        const parsed = parseOption(option, index);
        const button = document.createElement("button");
        button.type = "button";
        button.className = "option-btn";
        button.innerHTML = `
            <span class="option-key">${escapeHtml(parsed.key)}</span>
            <span class="option-text">${escapeHtml(parsed.text)}</span>
        `;

        const isSelected = userAnswers[currentQuestionIndex] === index;
        const isCorrect = getOptionLetter(option, index) === question.answer;

        if (!canInteract && !quizFinished) {
            button.disabled = true;
        } else if (showAnswers && hasAnswered) {
            button.disabled = true;
            if (isCorrect) button.classList.add("correct");
            if (isSelected && !isCorrect) button.classList.add("wrong");
        } else if (quizFinished) {
            button.disabled = true;
            if (isCorrect) button.classList.add("correct");
        } else {
            if (isSelected) button.classList.add("selected");
            button.addEventListener("click", () => handleOptionSelect(index));
        }

        els.optionsContainer.appendChild(button);
    });

    animate(
        ".option-btn",
        { opacity: [0, 1], x: [-30, 0], scale: [0.95, 1] },
        { delay: stagger(0.08), type: "spring", stiffness: 450, damping: 18 }
    );

    animate(
        els.questionText,
        { opacity: [0, 1], scale: [0.95, 1], y: [15, 0] },
        { duration: 0.4, type: "spring", stiffness: 300, damping: 15 }
    );
    
    if (showAnswers && hasAnswered) {
        showFeedback(question, userAnswers[currentQuestionIndex]);
    }

    updateNavigation(canInteract);
    updateDictionaryForCurrentQuestion(question);
}

function updateNavigation(canInteract) {
    els.btnPrev.disabled = quizFinished
        ? currentQuestionIndex === 0
        : !canInteract || currentQuestionIndex === 0;
    els.btnNext.textContent = currentQuestionIndex === currentQuestions.length - 1 ? "Kết thúc" : "Câu tiếp theo";
    els.btnNext.disabled = quizFinished
        ? currentQuestionIndex === currentQuestions.length - 1
        : !canInteract;
}

function handleOptionSelect(optionIndex) {
    if (!sessionStarted || quizFinished) return;

    userAnswers[currentQuestionIndex] = optionIndex;
    calculateScore();
    saveProgress();
    updateOverallProgress();
    showQuestion();
}

function handleNext() {
    if (!sessionStarted && !quizFinished) return;

    if (currentQuestionIndex < currentQuestions.length - 1) {
        currentQuestionIndex += 1;
        if (!quizFinished) saveProgress();
        showQuestion();
        return;
    }

    if (!quizFinished) {
        finishQuiz(false);
    }
}

function handlePrev() {
    if (!sessionStarted && !quizFinished) return;

    if (currentQuestionIndex > 0) {
        currentQuestionIndex -= 1;
        if (!quizFinished) saveProgress();
        showQuestion();
    }
}

function finishQuiz(autoSubmitted) {
    if (!sessionStarted) return;
    if (quizFinished && sessionRecorded) return;

    quizFinished = true;
    calculateScore();
    recordSession();
    updateOverallProgress();
    updateStatsDisplay(currentPackId);
    showResult(autoSubmitted);
    showQuestion();
}

function showFeedback(question, selectedIndex) {
    const correct = isAnswerCorrect(question, selectedIndex);
    els.explanationCard.hidden = false;
    els.explanationCard.classList.add(correct ? "correct" : "wrong");
    els.explanationText.innerHTML = `<strong>${correct ? "Chính xác." : "Chưa đúng."}</strong> ${escapeHtml(question.explanation || "Chưa có giải thích chi tiết cho câu này.")}`;
    els.btnTranslateExplanation.hidden = !question.explanation;
    els.explanationTranslated.textContent = "";

    animate(
        els.explanationCard,
        { opacity: [0, 1], y: [30, 0], scale: [0.8, 1], rotate: [-2, 0] },
        { type: "spring", stiffness: 450, damping: 15 }
    );
}

function showResult(autoSubmitted) {
    const total = currentQuestions.length;
    const answered = Object.keys(userAnswers).length;
    const wrong = total - score;
    const percent = total ? Math.round((score / total) * 100) : 0;

    // Find next pack
    const currentIdx = availablePacks.findIndex(p => p.id === currentPackId);
    const nextPack = (currentIdx !== -1 && currentIdx + 1 < availablePacks.length)
        ? availablePacks[currentIdx + 1]
        : null;

    els.resultCard.hidden = false;
    els.resultCard.innerHTML = `
        <h2>Kết quả phiên học</h2>
        <p>${escapeHtml(getResultMessage(percent))}</p>
        <div class="result-grid">
            <div class="result-stat"><strong>${score}/${total}</strong><span>Điểm</span></div>
            <div class="result-stat"><strong>${percent}%</strong><span>Độ chính xác</span></div>
            <div class="result-stat"><strong>${answered}</strong><span>Đã trả lời</span></div>
            <div class="result-stat"><strong>${wrong}</strong><span>Cần ôn lại</span></div>
        </div>
        <div class="result-actions" style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: flex-end; margin-top: 18px; border-top: 1.5px dashed var(--line); padding-top: 18px;">
            <button class="btn btn-secondary" id="btn-result-back" type="button">Đổi lựa chọn</button>
            <button class="btn btn-secondary" id="btn-result-retry" type="button">Học lại</button>
            ${nextPack ? `<button class="btn btn-primary" id="btn-result-next-pack" type="button" data-next-id="${nextPack.id}">Phần tiếp theo: ${escapeHtml(nextPack.title)}</button>` : ''}
        </div>
    `;

    // Dynamic bindings
    const btnRetry = els.resultCard.querySelector("#btn-result-retry");
    const btnNextPack = els.resultCard.querySelector("#btn-result-next-pack");
    const btnBack = els.resultCard.querySelector("#btn-result-back");

    const exitAnimation = () => {
        const promise = animate(
            els.resultCard,
            { opacity: 0, scale: 0.9, y: [0, 20] },
            { duration: 0.2 }
        );
        return promise.finished || Promise.resolve();
    };

    if (btnRetry) {
        btnRetry.addEventListener("click", async () => {
            await exitAnimation();
            els.resultCard.hidden = true;
            resetActiveSession({ clearSavedProgress: true, autoStart: true });
        });
    }
    if (btnNextPack) {
        btnNextPack.addEventListener("click", async () => {
            const nextPackObj = availablePacks.find(p => p.id === nextPack.id);
            if (nextPackObj) {
                await exitAnimation();
                els.resultCard.hidden = true;
                selectPack(nextPackObj);
                openQuizFromSelection(false);
            }
        });
    }
    if (btnBack) {
        btnBack.addEventListener("click", async () => {
            await exitAnimation();
            els.resultCard.hidden = true;
            showSetupView();
        });
    }

    animate(
        els.resultCard,
        { opacity: [0, 1], scale: [0.8, 1], y: [40, 0], rotate: [1, 0] },
        { type: "spring", stiffness: 300, damping: 15 }
    );

    animate(
        ".result-stat",
        { opacity: [0, 1], scale: [0.6, 1], rotate: [-3, 0] },
        { delay: stagger(0.1, { startDelay: 0.2 }), type: "spring", stiffness: 400, damping: 12 }
    );

    animate(
        ".result-actions .btn",
        { opacity: [0, 1], y: [15, 0], scale: [0.9, 1] },
        { delay: stagger(0.08, { startDelay: 0.4 }), type: "spring", stiffness: 300, damping: 15 }
    );
}

function getResultMessage(percent) {
    if (percent >= 85) return "Bạn đang nắm chắc chủ đề này. Hãy luyện lại câu sai để giữ nhịp.";
    if (percent >= 60) return "Kết quả ổn. Nên xem lại các câu sai trước khi chuyển gói khác.";
    return "Nên ôn lại phần lý thuyết, sau đó dùng chế độ luyện câu sai để củng cố.";
}

function calculateScore() {
    score = currentQuestions.reduce((total, question, index) => {
        return total + (isAnswerCorrect(question, userAnswers[index]) ? 1 : 0);
    }, 0);
}

function isAnswerCorrect(question, selectedIndex) {
    if (selectedIndex === undefined) return false;
    const selectedOption = question.options[selectedIndex];
    return getOptionLetter(selectedOption, selectedIndex) === question.answer;
}

function getOptionLetter(option, index) {
    const match = String(option || "").trim().match(/^([A-Z])[\.\)]\s*/i);
    return match ? match[1].toUpperCase() : String.fromCharCode(65 + index);
}

function parseOption(option, index) {
    const raw = String(option || "").trim();
    const match = raw.match(/^([A-Z])[\.\)]\s*(.*)$/i);
    return match
        ? { key: match[1].toUpperCase(), text: match[2] || raw }
        : { key: String.fromCharCode(65 + index), text: raw };
}

function updateOverallProgress() {
    const total = currentQuestions.length;
    const answered = Object.keys(userAnswers).length;
    const percentage = total > 0 ? (answered / total) * 100 : 0;

    els.progressBar.style.width = `${percentage}%`;
    els.progressText.textContent = `${answered} / ${total} câu đã trả lời`;
}

function loadProgress(packId) {
    const saved = localStorage.getItem(`${STORAGE_PROGRESS_PREFIX}${packId}`);
    if (!saved) return;

    try {
        const parsed = JSON.parse(saved);
        userAnswers = parsed.answers || {};
        currentQuestionIndex = Math.min(parsed.currentIndex || 0, currentQuestions.length - 1);
        calculateScore();
    } catch {
        userAnswers = {};
        currentQuestionIndex = 0;
        score = 0;
    }
}

function saveProgress() {
    if (!currentPackId || studyMode !== "practice" || isWrongPractice) return;

    localStorage.setItem(`${STORAGE_PROGRESS_PREFIX}${currentPackId}`, JSON.stringify({
        answers: userAnswers,
        currentIndex: currentQuestionIndex
    }));
}

function recordSession() {
    if (sessionRecorded || !currentPackId) return;
    sessionRecorded = true;

    const stats = readStats();
    const packStats = stats.packs[currentPackId] || createEmptyPackStats();
    const wrongSet = new Set(packStats.wrongQuestionIds || []);
    const total = currentQuestions.length;

    currentQuestions.forEach((question, index) => {
        const originalIndex = question.__originalIndex;
        if (isAnswerCorrect(question, userAnswers[index])) {
            wrongSet.delete(originalIndex);
        } else {
            wrongSet.add(originalIndex);
        }
    });

    const duration = getSessionDuration();
    packStats.sessions += 1;
    packStats.totalQuestions += total;
    packStats.totalCorrect += score;
    packStats.totalTime += duration;
    packStats.lastScore = total ? Math.round((score / total) * 100) : 0;
    packStats.bestScore = Math.max(packStats.bestScore, packStats.lastScore);
    packStats.wrongQuestionIds = [...wrongSet].sort((a, b) => a - b);

    stats.totalSessions += 1;
    stats.totalQuestions += total;
    stats.totalCorrect += score;
    stats.totalTime += duration;
    stats.packs[currentPackId] = packStats;

    localStorage.setItem(STORAGE_STATS_KEY, JSON.stringify(stats));
    els.btnPracticeWrong.disabled = packStats.wrongQuestionIds.length === 0;
}

function createEmptyPackStats() {
    return {
        sessions: 0,
        totalQuestions: 0,
        totalCorrect: 0,
        totalTime: 0,
        lastScore: 0,
        bestScore: 0,
        wrongQuestionIds: []
    };
}

function readStats() {
    const fallback = {
        totalSessions: 0,
        totalQuestions: 0,
        totalCorrect: 0,
        totalTime: 0,
        packs: {}
    };

    try {
        return JSON.parse(localStorage.getItem(STORAGE_STATS_KEY)) || fallback;
    } catch {
        return fallback;
    }
}

function getPackStats(packId) {
    const stats = readStats();
    return stats.packs[packId] || createEmptyPackStats();
}

function updateStatsDisplay(packId = currentPackId) {
    const stats = readStats();
    const packStats = packId ? getPackStats(packId) : null;
    const totalQuestions = stats.totalQuestions || 0;
    const totalCorrect = stats.totalCorrect || 0;
    const globalAccuracy = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const packTotal = packStats?.totalQuestions || 0;
    const packAccuracy = packTotal ? Math.round((packStats.totalCorrect / packTotal) * 100) : 0;
    const bestScore = packStats ? packStats.bestScore : 0;
    const wrongTotal = packStats ? packStats.wrongQuestionIds.length : 0;
    const wrongBase = packStats && baseQuestions.length > 0 ? baseQuestions.length : packTotal;
    const wrongPercent = wrongBase ? Math.round((wrongTotal / wrongBase) * 100) : 0;

    els.metricSessions.textContent = String(stats.totalSessions || 0);
    els.metricAccuracy.textContent = `${globalAccuracy}%`;
    els.metricBest.textContent = `${bestScore}%`;
    els.metricWrong.textContent = String(wrongTotal);
    els.statAccuracyLabel.textContent = `${packAccuracy}%`;
    els.statBestLabel.textContent = `${bestScore}%`;
    els.statWrongLabel.textContent = `${wrongPercent}%`;
    els.statAccuracyBar.style.width = `${packAccuracy}%`;
    els.statBestBar.style.width = `${bestScore}%`;
    els.statWrongBar.style.width = `${Math.min(wrongPercent, 100)}%`;
    els.btnPracticeWrong.disabled = !packStats || wrongTotal === 0;
}

function getSessionDuration() {
    if (!sessionStartedAt) return 0;
    return Math.max(0, Math.round((Date.now() - sessionStartedAt) / 1000));
}

function handleDictionarySearch(event) {
    const query = event.target.value.trim().toLowerCase();

    if (!query) {
        if (currentQuestions.length > 0) {
            updateDictionaryForCurrentQuestion(currentQuestions[currentQuestionIndex]);
        } else {
            renderDictionary(glossary);
        }
        return;
    }

    const filtered = glossary.filter(item =>
        item.term.toLowerCase().includes(query) ||
        item.def.toLowerCase().includes(query)
    );
    renderDictionary(filtered);
}

function renderDictionary(items) {
    els.dictList.innerHTML = "";

    if (items.length === 0) {
        els.dictList.innerHTML = '<p class="muted-empty">Không tìm thấy từ vựng.</p>';
        return;
    }

    items.forEach(item => els.dictList.appendChild(createDictItem(item)));

    animate(
        ".dict-item",
        { opacity: [0, 1], x: [20, 0], scale: [0.9, 1] },
        { delay: stagger(0.04), type: "spring", stiffness: 400, damping: 20 }
    );
}

function createDictItem(item, relevant = false) {
    const el = document.createElement("div");
    el.className = `dict-item ${relevant ? "relevant" : ""}`;
    const definitionClass = item.state === "loading" || item.state === "error"
        ? "dict-def muted-empty"
        : "dict-def";
    el.innerHTML = `
        <div class="dict-term">${escapeHtml(item.term)}</div>
        <div class="${definitionClass}">${escapeHtml(item.def)}</div>
    `;
    return el;
}

async function updateDictionaryForCurrentQuestion(question) {
    if (els.dictSearch.value.trim()) return;

    const requestToken = ++dictionaryRequestToken;
    const fullText = `${question.question} ${(question.options || []).join(" ")} ${question.explanation || ""}`;
    const terms = TranslationUtils.extractTerms(fullText, glossary, 10);
    const currentQuestionCache = {
        get(term) {
            return glossaryDefinitions.get(term.toLowerCase()) || persistentTranslationCache.get(term);
        },
        set(term, definition) {
            persistentTranslationCache.set(term, definition);
        }
    };

    const initialEntries = terms.map(term => ({
        term,
        def: currentQuestionCache.get(term) || "Đang tra…",
        state: currentQuestionCache.get(term) ? "ready" : "loading"
    }));
    renderDictionaryForQuestion(initialEntries);

    await TranslationUtils.resolveTranslations(
        terms,
        currentQuestionCache,
        3,
        translateTextWithFallback,
        (entry, index) => {
            initialEntries[index] = entry;
            if (requestToken === dictionaryRequestToken && !els.dictSearch.value.trim()) {
                renderDictionaryForQuestion(initialEntries);
            }
        },
        () => requestToken === dictionaryRequestToken && !els.dictSearch.value.trim()
    );
}

function renderDictionaryForQuestion(relevantTerms) {
    els.dictList.innerHTML = "";
    els.dictList.setAttribute("aria-live", "polite");

    if (relevantTerms.length > 0) {
        const title = document.createElement("div");
        title.className = "dict-section-title";
        title.textContent = "Từ vựng trong câu hiện tại";
        els.dictList.appendChild(title);
        relevantTerms.forEach(item => els.dictList.appendChild(createDictItem(item, true)));
    } else {
        const empty = document.createElement("p");
        empty.className = "muted-empty";
        empty.textContent = "Không tìm thấy từ cần tra trong câu này.";
        els.dictList.appendChild(empty);
    }

    const title = document.createElement("div");
    title.className = "dict-section-title";
    title.textContent = relevantTerms.length > 0 ? "Từ điển nhanh" : "Từ điển nhanh";
    els.dictList.appendChild(title);

    const relevantKeys = new Set(relevantTerms.map(item => item.term.toLowerCase()));
    glossary
        .filter(item => !relevantKeys.has(item.term.toLowerCase()))
        .slice(0, 12)
        .forEach(item => els.dictList.appendChild(createDictItem(item)));

    animate(
        ".dict-item",
        { opacity: [0, 1], x: [20, 0], scale: [0.9, 1] },
        { delay: stagger(0.04), type: "spring", stiffness: 400, damping: 20 }
    );
}

const TRANSLATION_APIS = [
    {
        name: "Google Translate (GTX API)",
        fetch: async (text) => {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(text)}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("HTTP error " + response.status);
            const data = await response.json();
            if (data && data[0]) {
                return data[0].map(item => item[0]).join("");
            }
            throw new Error("Invalid format");
        }
    },
    {
        name: "MyMemory API",
        fetch: async (text) => {
            const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|vi`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("HTTP error " + response.status);
            const data = await response.json();
            const translated = data?.responseData?.translatedText;
            if (translated && !translated.includes("MYMEMORY WARNING")) {
                return translated;
            }
            throw new Error("MyMemory translation failed or rate limited");
        }
    },
    {
        name: "Google Translate (Web API)",
        fetch: async (text) => {
            const url = `https://translate.google.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(text)}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("HTTP error " + response.status);
            const data = await response.json();
            if (data && data[0]) {
                return data[0].map(item => item[0]).join("");
            }
            throw new Error("Invalid format");
        }
    },
    {
        name: "Lingva (lunes.host Instance)",
        fetch: async (text) => {
            const url = `https://lingva.lunes.host/api/v1/en/vi/${encodeURIComponent(text)}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("HTTP error " + response.status);
            const data = await response.json();
            if (data && data.translation) {
                return data.translation;
            }
            throw new Error("Invalid format");
        }
    },
    {
        name: "Lingva (lingva.ml Instance)",
        fetch: async (text) => {
            const url = `https://lingva.ml/api/v1/en/vi/${encodeURIComponent(text)}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("HTTP error " + response.status);
            const data = await response.json();
            if (data && data.translation) {
                return data.translation;
            }
            throw new Error("Invalid format");
        }
    }
];

function isValidTranslation(translated, originalText) {
    if (!translated || typeof translated !== "string") return false;
    const lower = translated.toLowerCase();
    
    const blockList = [
        "mymemory warning",
        "you used all available free translations",
        "quota exceeded",
        "too many requests",
        "rate limit",
        "limit exceeded",
        "daily limit",
        "request limit",
        "soft limit",
        "http error",
        "too many request"
    ];

    if (blockList.some(keyword => lower.includes(keyword))) {
        return false;
    }
    
    if (translated.trim().startsWith("<") || lower.includes("<!doctype html>") || lower.includes("<html>") || lower.includes("<div>")) {
        return false;
    }
    
    if (translated.trim().startsWith("{") && lower.includes("error") && lower.includes("message")) {
        return false;
    }
    
    if (originalText && originalText.trim().length > 15) {
        if (translated.trim().toLowerCase() === originalText.trim().toLowerCase()) {
            return false;
        }
    }
    
    return true;
}

async function translateTextWithFallback(text) {
    let lastError = null;
    for (const api of TRANSLATION_APIS) {
        try {
            console.log(`Trying translation using ${api.name}...`);
            const translated = await api.fetch(text);
            if (isValidTranslation(translated, text)) {
                return translated;
            } else {
                console.warn(`Translation API ${api.name} returned quota limit or invalid text:`, translated);
                lastError = new Error(`API returned rate-limit message or invalid translation`);
            }
        } catch (error) {
            console.warn(`Translation API ${api.name} failed:`, error);
            lastError = error;
        }
    }
    throw lastError || new Error("Tất cả các API dịch đều không hoạt động hoặc bị giới hạn.");
}

function translateCurrentQuestion() {
    if (!currentQuestions.length) return;
    translateText(currentQuestions[currentQuestionIndex].question, els.questionTranslation, "Đang dịch câu hỏi...");
}

function translateCurrentExplanation() {
    if (!currentQuestions.length) return;
    const explanation = currentQuestions[currentQuestionIndex].explanation;
    translateText(explanation, els.explanationTranslated, "Đang dịch giải thích...");
}

async function translateText(text, targetEl, loadingText) {
    if (!text) return;

    if (sentenceCache.has(text)) {
        targetEl.textContent = sentenceCache.get(text);
        return;
    }

    targetEl.textContent = loadingText;

    try {
        const translated = await translateTextWithFallback(text);
        sentenceCache.set(text, translated);
        targetEl.textContent = translated || "Không có bản dịch phù hợp.";
    } catch (error) {
        targetEl.textContent = "Không thể tải bản dịch lúc này.";
    }
}

async function handleImportFile(eventOrFile) {
    let file;
    if (eventOrFile instanceof File) {
        file = eventOrFile;
    } else {
        file = eventOrFile?.target?.files?.[0];
    }
    if (!file) return;

    try {
        const text = await file.text();
        const data = JSON.parse(text);
        const questions = normalizeQuestions(data);
        const title = cleanTitle(file.name.replace(/\.json$/i, ""));
        const id = `import_${Date.now()}`;
        const importedPack = {
            id,
            title,
            desc: `Gói import từ ${file.name}`,
            source: "Import",
            imported: true,
            count: questions.length,
            questions
        };

        importedPacks.unshift(importedPack);
        saveImportedPacks();
        rebuildPackList();
        setImportStatus(`Đã import "${title}" với ${questions.length} câu.`, "success");
        selectPack(importedPack);
    } catch (error) {
        console.error("Import thất bại:", error);
        setImportStatus(error.message || "File JSON không hợp lệ.", "error");
    } finally {
        if (eventOrFile?.target) {
            eventOrFile.target.value = "";
        }
    }
}

function readImportedPacks() {
    try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_IMPORTED_KEY)) || [];
        return parsed.filter(pack => pack.imported && Array.isArray(pack.questions));
    } catch {
        return [];
    }
}

function saveImportedPacks() {
    localStorage.setItem(STORAGE_IMPORTED_KEY, JSON.stringify(importedPacks));
}

function removeImportedPack(packId) {
    importedPacks = importedPacks.filter(pack => pack.id !== packId);
    saveImportedPacks();

    if (selectedPack?.id === packId) {
        selectedPack = null;
        els.btnOpenQuiz.disabled = true;
        els.selectedPackSummary.innerHTML = `
            <span>Bộ đề đang chọn</span>
            <strong>Chưa chọn bộ đề</strong>
            <small>Chọn một môn học hoặc bộ đề để tiếp tục.</small>
        `;
    }

    if (currentPackId === packId) {
        activePack = null;
        currentPackId = null;
        baseQuestions = [];
        currentQuestions = [];
        userAnswers = {};
        score = 0;
        els.quizContainer.hidden = true;
        els.emptyState.hidden = false;
        els.quizTitle.textContent = "Chọn một bộ đề để bắt đầu";
        els.activePackLabel.textContent = "Chưa chọn bộ đề";
        showSetupView();
        updateOverallProgress();
        updateStatsDisplay();
    }

    rebuildPackList();
    setImportStatus("Đã gỡ bộ đề khỏi trình duyệt.", "success");
}

function setImportStatus(message, type) {
    if (!els.importStatus) return;
    els.importStatus.textContent = message;
    els.importStatus.className = `status-text ${type || ""}`;
}

function cleanTitle(value) {
    return value
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, char => char.toUpperCase()) || "Gói import";
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

document.addEventListener("DOMContentLoaded", init);
