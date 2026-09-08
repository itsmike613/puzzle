const langs = ["en", "es", "ru"];
const rates = { light: .25, medium: .5, heavy: .75, full: 1 };

const state = {
    page: "home",
    lang: "en",
    theme: "light",
    set: { grid: 3, shuffle: "medium", reference: "on", lines: "on" },
    image: images[0].id,
    board: [],
    picture: null,
    selected: null,
    focus: 0,
    moves: 0,
    start: 0,
    elapsed: 0,
    timer: null,
    ready: false,
    done: false,
    run: null,
    last: null,
    load: 0
};

const el = id => document.getElementById(id);
const local = value => value[state.lang];
const text = key => words[state.lang][key] || key;
const fill = (key, vars = {}) => Object.entries(vars).reduce((value, pair) => value.replace(`{${pair[0]}}`, pair[1]), text(key));
const entry = id => images.find(item => item.id === id);
function shuffled(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function clear() {
    if (state.timer !== null) cancelAnimationFrame(state.timer);
    state.timer = null;
}

function reset() {
    clear();
    state.load++;
    state.board = [];
    state.picture = null;
    state.selected = null;
    state.focus = 0;
    state.moves = 0;
    state.start = 0;
    state.elapsed = 0;
    state.ready = false;
    state.done = false;
    state.run = null;
}

function show(page) {
    clear();
    state.page = page;
    document.querySelectorAll(".page").forEach(node => node.classList.toggle("active", node.id === page));
    window.scrollTo({ top: 0, behavior: "auto" });
    paint();
}

function theme() {
    document.documentElement.dataset.theme = state.theme;
    const dark = state.theme === "dark";
    el("theme").querySelector("i").className = dark ? "ph ph-moon" : "ph ph-sun";
    el("theme").querySelector("span").textContent = dark ? "DM" : "LM";
    document.querySelector('meta[name="theme-color"]').content = dark ? "#151715" : "#f4f4f1";
}

function menus() {
    const image = el("image");
    image.innerHTML = images.map(item => `<option value="${item.id}">${local(item.name)}</option>`).join("");
    image.value = state.image;

    const grid = el("grid");
    grid.innerHTML = grids.map(value => `<option value="${value}">${value}×${value}</option>`).join("");
    grid.value = String(state.set.grid);

    const shuffle = el("shuffle");
    shuffle.innerHTML = shuffles.map(value => `<option value="${value}">${text(value)}</option>`).join("");
    shuffle.value = state.set.shuffle;

    const reference = el("referenceset");
    reference.innerHTML = toggles.map(value => `<option value="${value}">${text(value)}</option>`).join("");
    reference.value = state.set.reference;

    const lines = el("lines");
    lines.innerHTML = toggles.map(value => `<option value="${value}">${text(value)}</option>`).join("");
    lines.value = state.set.lines;
}

function translate() {
    document.documentElement.lang = state.lang;
    document.title = game;
    document.querySelectorAll("[data-title]").forEach(node => node.textContent = game);
    document.querySelectorAll("[data-logo]").forEach(node => node.innerHTML = `<span>${game.slice(0, 2)}</span>${game.slice(2)}`);
    document.querySelectorAll("[data-t]").forEach(node => node.textContent = text(node.dataset.t));
    el("lang").querySelector("span").textContent = state.lang.toUpperCase();
    document.querySelectorAll("[data-go='home']").forEach(node => node.setAttribute("aria-label", text("home")));
    el("quit").setAttribute("aria-label", text("home"));
    el("board").setAttribute("aria-label", text("puzzle"));
    menus();
}

function paint() {
    translate();
    theme();
    if (state.page === "setup") setup();
    if (state.page === "play") play();
    if (state.page === "results") scores();
    if (state.page === "help") guide();
}

function setup() {
    const item = entry(state.image);
    const image = el("preview");
    el("setupnote").className = "notice";
    el("setupnote").textContent = "";
    image.alt = local(item.name);
    image.onerror = () => {
        el("setupnote").className = "notice error";
        el("setupnote").textContent = text("asset");
    };
    image.onload = () => {
        el("setupnote").className = "notice";
        el("setupnote").textContent = "";
    };
    image.src = item.file;
}

function target(size, mode) {
    const max = size - 1;
    return Math.max(1, Math.min(max, Math.round(max * rates[mode])));
}

function scramble(size, mode) {
    const value = target(size, mode);
    const board = Array.from({ length: size }, (_, index) => index);
    const max = Math.min(value, size - value);
    const count = 1 + Math.floor(Math.random() * max);
    const cuts = shuffled(Array.from({ length: value - 1 }, (_, index) => index + 1)).slice(0, count - 1).sort((a, b) => a - b);
    const parts = [];
    let last = 0;
    [...cuts, value].forEach(cut => {
        parts.push(cut - last);
        last = cut;
    });
    const pool = shuffled(Array.from({ length: size }, (_, index) => index)).slice(0, value + count);
    let offset = 0;
    parts.forEach(part => {
        const length = part + 1;
        const cycle = pool.slice(offset, offset + length);
        offset += length;
        cycle.forEach((place, index) => {
            board[place] = cycle[(index + 1) % length];
        });
    });
    return board;
}

function distance(board) {
    const seen = new Set();
    let cycles = 0;
    for (let start = 0; start < board.length; start++) {
        if (seen.has(start)) continue;
        cycles++;
        let next = start;
        while (!seen.has(next)) {
            seen.add(next);
            next = board[next];
        }
    }
    return board.length - cycles;
}

function solved() {
    return state.board.every((piece, index) => piece === index);
}

function format(value) {
    const time = Math.max(0, Math.floor(value));
    const min = String(Math.floor(time / 60000)).padStart(2, "0");
    const sec = String(Math.floor(time / 1000) % 60).padStart(2, "0");
    const ms = String(time % 1000).padStart(3, "0");
    return `${min}:${sec}.${ms}`;
}

function tick() {
    if (!state.ready || state.done) return;
    state.elapsed = performance.now() - state.start;
    el("time").textContent = format(state.elapsed);
    state.timer = requestAnimationFrame(tick);
}

function render() {
    const box = el("board");
    if (!state.run || !state.board.length || !state.picture) {
        box.innerHTML = "";
        return;
    }
    const grid = state.run.grid;
    const image = state.picture;
    const width = image.naturalWidth / grid;
    const height = image.naturalHeight / grid;
    box.style.gridTemplateColumns = `repeat(${grid}, 1fr)`;
    box.classList.toggle("lines", state.run.lines === "on" && !state.done);
    box.innerHTML = "";
    state.board.forEach((piece, index) => {
        const x = piece % grid;
        const y = Math.floor(piece / grid);
        const button = document.createElement("button");
        const canvas = document.createElement("canvas");
        const draw = canvas.getContext("2d");
        button.className = `tile${state.selected === index ? " selected" : ""}`;
        button.dataset.index = index;
        button.setAttribute("role", "gridcell");
        button.setAttribute("aria-pressed", state.selected === index ? "true" : "false");
        button.setAttribute("aria-label", `${index + 1}`);
        button.tabIndex = index === state.focus ? 0 : -1;
        canvas.className = "crop";
        canvas.width = Math.ceil(width);
        canvas.height = Math.ceil(height);
        draw.drawImage(image, x * width, y * height, width, height, 0, 0, canvas.width, canvas.height);
        button.append(canvas);
        if (state.selected === index) button.insertAdjacentHTML("beforeend", `<span class="check"><i class="ph ph-check"></i></span>`);
        box.append(button);
    });
}

function rove(index, move = false) {
    const tiles = [...el("board").querySelectorAll("[data-index]")];
    state.focus = Math.max(0, Math.min(tiles.length - 1, index));
    tiles.forEach((tile, place) => tile.tabIndex = place === state.focus ? 0 : -1);
    if (move && tiles[state.focus]) tiles[state.focus].focus();
}

function choose(index, keyboard = false) {
    if (!state.ready || state.done) return;
    state.focus = index;
    if (state.selected === null) {
        state.selected = index;
        render();
    } else if (state.selected === index) {
        state.selected = null;
        render();
    } else {
        [state.board[state.selected], state.board[index]] = [state.board[index], state.board[state.selected]];
        state.selected = null;
        state.moves++;
        el("moves").textContent = state.moves;
        if (solved()) finish();
        else render();
    }
    if (keyboard && !state.done) requestAnimationFrame(() => rove(state.focus, true));
}

function play() {
    if (!state.run) return;
    const item = entry(state.run.image);
    el("gametitle").textContent = local(item.name);
    el("moves").textContent = state.moves;
    el("time").textContent = format(state.elapsed);
    const box = el("reference");
    box.classList.toggle("hidden", state.run.reference !== "on");
    const image = el("referenceimg");
    image.alt = local(item.name);
    image.onerror = () => {
        el("gamenote").className = "notice error";
        el("gamenote").textContent = text("asset");
    };
    image.src = item.file;
    render();
}

function begin(config = null) {
    clear();
    const load = ++state.load;
    const source = config || { image: state.image, grid: state.set.grid, shuffle: state.set.shuffle, reference: state.set.reference, lines: state.set.lines };
    const size = source.grid * source.grid;
    state.run = { image: source.image, grid: source.grid, shuffle: source.shuffle, reference: source.reference, lines: source.lines, pieces: size, optimal: 0, moves: 0, time: 0 };
    state.board = [];
    state.picture = null;
    state.selected = null;
    state.focus = 0;
    state.moves = 0;
    state.elapsed = 0;
    state.ready = false;
    state.done = false;
    show("play");
    el("gamenote").className = "notice";
    el("gamenote").textContent = "";

    const item = entry(source.image);
    const image = new Image();
    image.onload = () => {
        if (load !== state.load || state.page !== "play" || !state.run) return;
        let board = scramble(size, source.shuffle);
        let key = `${source.image}|${source.grid}|${source.shuffle}|${board.join(",")}`;
        for (let pass = 0; pass < 30 && key === state.last; pass++) {
            board = scramble(size, source.shuffle);
            key = `${source.image}|${source.grid}|${source.shuffle}|${board.join(",")}`;
        }
        state.last = key;
        state.picture = image;
        state.board = board;
            state.run.optimal = distance(board);
        play();
        requestAnimationFrame(() => {
            state.ready = true;
            state.start = performance.now();
            state.elapsed = 0;
            el("time").textContent = format(0);
            tick();
        });
    };
    image.onerror = () => {
        if (load !== state.load || state.page !== "play" || !state.run) return;
        state.ready = false;
        el("gamenote").className = "notice error";
        el("gamenote").textContent = text("asset");
    };
    image.src = item.file;
}

function finish() {
    if (state.done) return;
    state.elapsed = performance.now() - state.start;
    clear();
    state.ready = false;
    state.done = true;
    state.selected = null;
    state.run.moves = state.moves;
    state.run.time = state.elapsed;
    el("time").textContent = format(state.elapsed);
    render();
    burst();
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => show("results"), reduce ? 0 : 350);
}

function scores() {
    if (!state.run) return;
    const box = el("scores");
    const run = state.run;
    const item = entry(run.image);
    const efficiency = Math.min(100, Math.round(run.optimal / run.moves * 100));
    const rows = [
        ["completion", format(run.time)],
        ["moves", run.moves],
        ["optimal", run.optimal],
        ["efficiency", `${efficiency}%`]
    ];
    const config = [
        ["image", local(item.name)],
        ["grid", `${run.grid}×${run.grid}`],
        ["pieces", run.pieces],
        ["shuffle", text(run.shuffle)],
        ["reference", text(run.reference)],
        ["lines", text(run.lines)]
    ];
    box.innerHTML = rows.map(row => `<div class="score"><div><b>${text(row[0])}</b></div><strong>${row[1]}</strong></div>`).join("");
    box.innerHTML += `<div class="score config"><div><b>${text("configuration")}</b></div></div>`;
    box.innerHTML += config.map(row => `<div class="score config"><div><b>${text(row[0])}</b></div><strong>${row[1]}</strong></div>`).join("");

    const image = el("resultimg");
    el("resultnote").className = "notice";
    el("resultnote").textContent = "";
    image.alt = local(item.name);
    image.onerror = () => {
        el("resultnote").className = "notice error";
        el("resultnote").textContent = text("asset");
    };
    image.src = item.file;
}

function burst() {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof confetti !== "function") return;
    confetti({ particleCount: 65, angle: 270, spread: 80, startVelocity: 22, gravity: 1.1, ticks: 60, origin: { y: .02 } });
}

function guide() {
    const box = el("helpcopy");
    const steps = howplay.map(step => `<li>${local(step)}</li>`).join("");
    box.innerHTML = `<div class="topic"><p>${fill("helpintro", { game })}</p></div><div class="topic"><h3>${text("how")}</h3><ol>${steps}</ol><p>${text("controls")}</p></div>` + topics.map(topic => `<div class="topic"><h3>${local(topic.title)}</h3><p>${local(topic.text)}</p></div>`).join("");
}

function settings() {
    state.set.grid = Number(el("grid").value);
    state.set.shuffle = el("shuffle").value;
    state.set.reference = el("referenceset").value;
    state.set.lines = el("lines").value;
}

document.addEventListener("click", event => {
    const go = event.target.closest("[data-go]");
    if (go) {
        const page = go.dataset.go;
        if (page === "home" && state.page !== "home") reset();
        show(page);
        return;
    }

    const tile = event.target.closest("#board [data-index]");
    if (tile) {
        choose(Number(tile.dataset.index));
        return;
    }
});

document.addEventListener("keydown", event => {
    const tile = event.target.closest("#board [data-index]");
    if (!tile || !state.ready || state.done) return;
    const index = Number(tile.dataset.index);
    const grid = state.run.grid;
    const row = Math.floor(index / grid);
    const col = index % grid;
    let next = index;
    if (event.key === "ArrowLeft" && col > 0) next--;
    if (event.key === "ArrowRight" && col < grid - 1) next++;
    if (event.key === "ArrowUp" && row > 0) next -= grid;
    if (event.key === "ArrowDown" && row < grid - 1) next += grid;
    if (next !== index) {
        event.preventDefault();
        rove(next, true);
        return;
    }
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        choose(index, true);
    }
});

el("theme").addEventListener("click", () => {
    state.theme = state.theme === "light" ? "dark" : "light";
    theme();
});

el("lang").addEventListener("click", () => {
    state.lang = langs[(langs.indexOf(state.lang) + 1) % langs.length];
    paint();
});

el("image").addEventListener("change", () => {
    state.image = el("image").value;
    setup();
});

["grid", "shuffle", "referenceset", "lines"].forEach(id => {
    el(id).addEventListener("change", settings);
});

el("start").addEventListener("click", () => begin());
el("quit").addEventListener("click", () => { reset(); show("home"); });
el("replay").addEventListener("click", () => {
    const run = state.run;
    begin({ image: run.image, grid: run.grid, shuffle: run.shuffle, reference: run.reference, lines: run.lines });
});

paint();