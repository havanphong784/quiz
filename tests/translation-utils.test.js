const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

function loadUtils() {
    const source = fs.readFileSync(
        path.join(__dirname, "../src/js/translation-utils.js"),
        "utf8"
    );
    const sandbox = { window: {} };
    vm.runInNewContext(source, sandbox);
    return sandbox.window.TranslationUtils;
}

function createStorage() {
    const values = new Map();
    return {
        getItem(key) {
            return values.has(key) ? values.get(key) : null;
        },
        setItem(key, value) {
            values.set(key, value);
        }
    };
}

async function run() {
    const utils = loadUtils();

    assert.deepEqual(
        Array.from(utils.extractTerms(
            "A binary tree uses tree traversal.",
            [{ term: "binary tree", def: "cây nhị phân" }],
            10
        )),
        ["binary tree", "uses", "traversal"]
    );
    assert.deepEqual(
        Array.from(utils.extractTerms("A C++ program uses C++.", [{ term: "C++", def: "Cộng cộng" }], 10)),
        ["C++", "program", "uses"]
    );

    const cache = utils.createPersistentCache(createStorage(), "translations");
    cache.set("Binary Tree", "cây nhị phân");
    assert.equal(cache.get("binary tree"), "cây nhị phân");

    const brokenStorage = {
        getItem() {
            throw new Error("storage blocked");
        },
        setItem() {
            throw new Error("storage blocked");
        }
    };
    assert.equal(utils.createPersistentCache(brokenStorage, "translations").get("tree"), undefined);

    let active = 0;
    let peakActive = 0;
    const results = await utils.runWithConcurrency([1, 2, 3, 4], 2, async item => {
        active += 1;
        peakActive = Math.max(peakActive, active);
        await new Promise(resolve => setTimeout(resolve, 5));
        active -= 1;
        return item * 2;
    });
    assert.deepEqual(Array.from(results), [2, 4, 6, 8]);
    assert.ok(peakActive <= 2);

    console.log("translation-utils tests passed");
}

run().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
