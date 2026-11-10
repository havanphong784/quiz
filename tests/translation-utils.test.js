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
    assert.deepEqual(
        Array.from(utils.extractTerms(
            "Compare Time Complexity and Space Complexity.",
            [
                { term: "Time Complexity", def: "độ phức tạp thời gian" },
                { term: "Space Complexity", def: "độ phức tạp không gian" }
            ],
            10
        )),
        ["Space Complexity", "Time Complexity", "compare"]
    );

    const storage = createStorage();
    const cache = utils.createPersistentCache(storage, "translations");
    cache.set("Binary Tree", "cây nhị phân");
    assert.equal(cache.get("binary tree"), "cây nhị phân");
    assert.equal(utils.createPersistentCache(storage, "translations").get("binary tree"), "cây nhị phân");
    assert.equal(cache.get("constructor"), undefined);
    assert.equal(utils.createPersistentCache({ getItem: () => '{"bad":42}' }, "translations").get("bad"), undefined);
    assert.equal(utils.createPersistentCache({ getItem: () => "not json" }, "translations").get("tree"), undefined);

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

    const cachedValues = new Map([["cached", "đã lưu"]]);
    const cachedWrites = [];
    const fakeCache = {
        get(term) {
            return cachedValues.get(term);
        },
        set(term, definition) {
            cachedWrites.push([term, definition]);
            cachedValues.set(term, definition);
        }
    };
    let lookupActive = 0;
    let lookupPeak = 0;
    const lookedUp = [];
    const entries = await utils.resolveTranslations(
        ["cached", "fresh", "failed", "second", "third"],
        fakeCache,
        3,
        async term => {
            lookedUp.push(term);
            lookupActive += 1;
            lookupPeak = Math.max(lookupPeak, lookupActive);
            await new Promise(resolve => setTimeout(resolve, 5));
            lookupActive -= 1;
            if (term === "failed") throw new Error("network error");
            return `dịch ${term}`;
        }
    );
    assert.equal(entries[0].state, "ready");
    assert.equal(entries[0].def, "đã lưu");
    assert.deepEqual(lookedUp, ["fresh", "failed", "second", "third"]);
    assert.equal(entries[1].def, "dịch fresh");
    assert.equal(entries[2].state, "error");
    assert.equal(entries[2].def, "Chưa thể tra lúc này");
    assert.deepEqual(cachedWrites, [["fresh", "dịch fresh"], ["second", "dịch second"], ["third", "dịch third"]]);
    assert.ok(lookupPeak <= 3);

    let overlappingActive = 0;
    let overlappingPeak = 0;
    const uncached = { get: () => undefined, set: () => {} };
    await Promise.all([
        utils.resolveTranslations(["one", "two"], uncached, 3, async term => {
            overlappingActive += 1;
            overlappingPeak = Math.max(overlappingPeak, overlappingActive);
            await new Promise(resolve => setTimeout(resolve, 5));
            overlappingActive -= 1;
            return term;
        }),
        utils.resolveTranslations(["three", "four"], uncached, 3, async term => {
            overlappingActive += 1;
            overlappingPeak = Math.max(overlappingPeak, overlappingActive);
            await new Promise(resolve => setTimeout(resolve, 5));
            overlappingActive -= 1;
            return term;
        })
    ]);
    assert.ok(overlappingPeak <= 3);

    console.log("translation-utils tests passed");
}

run().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
