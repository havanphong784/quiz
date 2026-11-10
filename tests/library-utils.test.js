const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function loadUtils() {
    const source = fs.readFileSync(path.join(__dirname, "../src/js/library-utils.js"), "utf8");
    const sandbox = { window: {} };
    vm.runInNewContext(source, sandbox);
    return sandbox.window.LibraryUtils;
}

const packs = [
    { title: "Danh sách liên kết", desc: "Con trỏ", source: "Có sẵn", subject: "CTDL&GT", tags: ["Linked List"] },
    { title: "Ngăn xếp", desc: "LIFO", source: "Có sẵn", subject: "", tags: ["Stack"] },
    { title: "Tiến trình", desc: "Quản lý process", source: "OS", subject: "Hệ điều hành", tags: ["Process"] }
];

const utils = loadUtils();

assert.deepEqual(
    JSON.parse(JSON.stringify(utils.getSubjectSummaries(packs, "CTDL&GT"))),
    [
        { name: "CTDL&GT", count: 2 },
        { name: "Hệ điều hành", count: 1 }
    ]
);
assert.equal(utils.getLibraryView("", ""), "subjects");
assert.equal(utils.getLibraryView("Hệ điều hành", ""), "packs");
assert.equal(utils.getLibraryView("", "os"), "search");
assert.deepEqual(
    Array.from(utils.searchPacks(packs, "os")),
    [packs[2]]
);
assert.deepEqual(
    Array.from(utils.searchPacks(packs, "linked")),
    [packs[0]]
);
assert.deepEqual(
    Array.from(utils.searchPacks(packs, "")),
    packs
);
assert.deepEqual(
    JSON.parse(JSON.stringify(utils.getSubjectSummaries(packs.filter(pack => pack !== packs[2]), "CTDL&GT"))),
    [{ name: "CTDL&GT", count: 2 }]
);

console.log("library-utils tests passed");
