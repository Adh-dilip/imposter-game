/* Imposter — pass-the-phone word game. No backend, fully offline.
   Flow: setup -> reveal (pass phone) -> round complete -> next word. */
(function () {
  "use strict";

  /* ---------- Word data (Nepali-friendly) ----------
     Each entry: { word, hints[] }. Crewmates see `word`.
     Each imposter gets a DIFFERENT hint (when possible). 6+ hints each. */
  const CATEGORIES = {
    "Nepali Food": [
      { word: "Momo", hints: ["popular", "share", "craving", "weekend", "favorite", "steamy"] },
      { word: "Dal Bhat", hints: ["everyday", "filling", "home", "energy", "routine", "staple"] },
      { word: "Sel Roti", hints: ["festive", "homemade", "tradition", "gift", "celebration", "treat"] },
      { word: "Chiya", hints: ["break", "warm", "morning", "gossip", "comfort", "shop"] },
      { word: "Sekuwa", hints: ["evening", "smoky", "gathering", "treat", "flavor", "outing"] },
      { word: "Chowmein", hints: ["quick", "stall", "cheap", "takeaway", "popular", "filling"] },
      { word: "Thukpa", hints: ["winter", "warm", "comfort", "hills", "cozy", "soothing"] },
      { word: "Gundruk", hints: ["village", "old", "tangy", "preserved", "grandma", "earthy"] },
      { word: "Pani Puri", hints: ["roadside", "fun", "crunchy", "addictive", "messy", "queue"] },
      { word: "Juju Dhau", hints: ["special", "creamy", "royal", "rich", "dessert", "famous"] },
    ],
    "Places in Nepal": [
      { word: "Pashupatinath", hints: ["sacred", "crowd", "incense", "ancient", "ritual", "devotion"] },
      { word: "Pokhara", hints: ["scenic", "relax", "getaway", "views", "peaceful", "holiday"] },
      { word: "Thamel", hints: ["lively", "crowded", "shopping", "nightlife", "maze", "bustle"] },
      { word: "Boudhanath", hints: ["peaceful", "circle", "spiritual", "monks", "serene", "round"] },
      { word: "Everest", hints: ["extreme", "achievement", "danger", "famous", "heights", "dream"] },
      { word: "Chitwan", hints: ["wild", "nature", "green", "remote", "adventure", "lush"] },
      { word: "Lumbini", hints: ["sacred", "calm", "pilgrims", "ancient", "spiritual", "serene"] },
      { word: "Bhaktapur", hints: ["heritage", "ancient", "craft", "historic", "culture", "old town"] },
      { word: "Phewa Lake", hints: ["calm", "scenic", "reflection", "sunset", "relax", "still"] },
      { word: "Mustang", hints: ["remote", "barren", "windy", "arid", "hidden", "rugged"] },
    ],
    "Festivals": [
      { word: "Dashain", hints: ["family", "biggest", "reunion", "blessing", "holiday", "feast"] },
      { word: "Tihar", hints: ["glow", "sweets", "siblings", "colorful", "worship", "cheer"] },
      { word: "Holi", hints: ["playful", "messy", "spring", "crowd", "vibrant", "wild"] },
      { word: "Teej", hints: ["women", "fasting", "devotion", "dance", "tradition", "vibrant"] },
      { word: "Maghe Sankranti", hints: ["winter", "warmth", "sweets", "ritual", "seasonal", "family"] },
      { word: "Lhosar", hints: ["new year", "mountains", "feast", "community", "dance", "tradition"] },
      { word: "Buddha Jayanti", hints: ["peace", "sacred", "meditation", "calm", "worship", "serene"] },
      { word: "Saraswati Puja", hints: ["students", "learning", "blessing", "spring", "worship", "knowledge"] },
    ],
    "Animals": [
      { word: "Yak", hints: ["highland", "hardy", "cold", "mountain", "sturdy", "thick coat"] },
      { word: "Rhino", hints: ["protected", "heavy", "wild", "rare", "tough", "grassland"] },
      { word: "Tiger", hints: ["fierce", "wild", "majestic", "rare", "powerful", "feared"] },
      { word: "Buffalo", hints: ["sturdy", "village", "heavy", "useful", "calm", "field"] },
      { word: "Monkey", hints: ["clever", "playful", "cheeky", "wild", "quick", "agile"] },
      { word: "Elephant", hints: ["gentle", "huge", "memory", "wild", "strong", "majestic"] },
      { word: "Goat", hints: ["common", "village", "hardy", "useful", "festive", "hill"] },
      { word: "Rooster", hints: ["dawn", "noisy", "proud", "farm", "colorful", "alarm"] },
      { word: "Red Panda", hints: ["shy", "rare", "cute", "forest", "gentle", "endangered"] },
    ],
    "Daily Life": [
      { word: "Dhaka Topi", hints: ["formal", "pride", "traditional", "identity", "cultural", "occasion"] },
      { word: "Khukuri", hints: ["pride", "heritage", "brave", "symbol", "soldier", "legendary"] },
      { word: "Load Shedding", hints: ["frustrating", "dark", "schedule", "common", "backup", "wait"] },
      { word: "Tempo", hints: ["commute", "shared", "cheap", "city", "crowded", "noisy"] },
      { word: "Rickshaw", hints: ["slow", "old", "commute", "narrow", "cheap", "manual"] },
      { word: "Prayer Flag", hints: ["colorful", "windy", "spiritual", "peaceful", "high", "blessing"] },
      { word: "Marigold", hints: ["bright", "festive", "decoration", "fragrant", "worship", "cheerful"] },
      { word: "Rudraksha", hints: ["spiritual", "sacred", "worn", "calm", "faith", "natural"] },
      { word: "Singing Bowl", hints: ["calming", "spiritual", "souvenir", "meditation", "soothing", "resonant"] },
    ],
    "Sports & Games": [
      { word: "Cricket", hints: ["popular", "passion", "stadium", "national", "competitive", "fans"] },
      { word: "Volleyball", hints: ["team", "jumping", "energetic", "outdoor", "popular", "fast"] },
      { word: "Football", hints: ["global", "passion", "team", "stadium", "fans", "thrilling"] },
      { word: "Kabaddi", hints: ["traditional", "physical", "team", "energetic", "rural", "intense"] },
      { word: "Dandi Biyo", hints: ["traditional", "old", "rural", "childhood", "field", "nostalgic"] },
      { word: "Carrom", hints: ["indoor", "family", "skill", "casual", "fun", "relaxed"] },
      { word: "Ludo", hints: ["family", "casual", "luck", "fun", "childhood", "lively"] },
      { word: "Chess", hints: ["strategy", "patience", "mental", "quiet", "focus", "clever"] },
      { word: "Kite", hints: ["sky", "festive", "windy", "childhood", "colorful", "soaring"] },
    ],
  };

  /* ---------- State ---------- */
  const cfg = { imposters: 1, category: "__ALL__", tellCount: 1, impKnows: 1 };
  // Default office roster. Edit/remove on the setup screen as needed.
  const DEFAULT_PLAYERS = [
    "Aastha Sapkota",
    "Anushka Bhattarai",
    "Shanti Joshi",
    "Shreya Dahal",
    "Shreya Tamang",
    "Prastuti Khanal",
    "Prekshya Aryal",
    "Yagya Raj Bogati",
    "Nischal Adhikari",
    "Irish Shilpakar",
    "Prashamsa Tamrakar",
    "Nisha Rajbahak",
    "Sachin chaudhary",
    "Dilip Adhikari",
  ];
  let players = DEFAULT_PLAYERS.slice(); // names; blank => "Player N".
  let round = null; // { word, roles:[{imposter,hint}] }
  let reveal = { idx: 0, shown: false };
  let starterTimer = null; // slot-machine roll for "who goes first"

  /* ---------- Used-word memory (no repeats across games) ---------- */
  const USED_KEY = "imposter_used_words_v1";
  function loadUsed() {
    try { return JSON.parse(localStorage.getItem(USED_KEY)) || []; } catch (e) { return []; }
  }
  function saveUsed(a) {
    try { localStorage.setItem(USED_KEY, JSON.stringify(a)); } catch (e) {}
  }
  let used = loadUsed();

  /* ---------- Helpers ---------- */
  const $ = (id) => document.getElementById(id);
  function playerName(i) {
    const n = players[i] && players[i].trim();
    return n || ("Player " + (i + 1));
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  // Keep the roster arranged A-Z; empty names sort to the bottom.
  function sortPlayers() {
    players.sort((a, b) => {
      const ta = (a || "").trim().toLowerCase();
      const tb = (b || "").trim().toLowerCase();
      if (!ta && !tb) return 0;
      if (!ta) return 1;
      if (!tb) return -1;
      return ta.localeCompare(tb);
    });
  }
  const screens = ["setup", "reveal", "round"];
  function show(name) {
    screens.forEach((s) => $("screen-" + s).classList.toggle("active", s === name));
    $("homeBtn").style.display = name === "setup" ? "none" : "inline-block";
  }
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  /* ---------- Setup screen ---------- */
  function fillCategories() {
    const sel = $("category");
    sel.innerHTML = "";
    const all = document.createElement("option");
    all.value = "__ALL__"; all.textContent = "🎲 Random (all)";
    sel.appendChild(all);
    Object.keys(CATEGORIES).forEach((c) => {
      const o = document.createElement("option");
      o.value = c; o.textContent = c;
      sel.appendChild(o);
    });
    sel.value = cfg.category;
  }

  function syncSetup() {
    const maxImp = Math.max(1, Math.floor(players.length / 2));
    cfg.imposters = clamp(cfg.imposters, 1, maxImp);
    $("v-imposters").textContent = cfg.imposters;
    const note = cfg.imposters > 1 ? "Each gets a different hint" : "Gets a hint instead of the word";
    $("imp-help").textContent = `${note} · max ${maxImp} (half the players)`;
    $("pcount").textContent = players.length;
    $("add-player").disabled = players.length >= 15;
    // Telling the count only makes sense if the imposter knows they're the imposter.
    $("count-row").style.display = cfg.impKnows ? "" : "none";
  }

  function renderNames() {
    const list = $("name-list");
    list.innerHTML = "";
    players.forEach((nm, i) => {
      const row = document.createElement("div");
      row.className = "name-row";

      const seat = document.createElement("span");
      seat.className = "seatnum";
      seat.textContent = i + 1;

      const input = document.createElement("input");
      input.className = "name-input";
      input.type = "text";
      input.value = nm;
      input.placeholder = "Player " + (i + 1);
      input.maxLength = 18;
      input.autocomplete = "off";
      input.addEventListener("input", (e) => { players[i] = e.target.value; });
      // Re-arrange alphabetically once this field is done being edited.
      input.addEventListener("blur", () => { sortPlayers(); renderNames(); });

      row.appendChild(seat);
      row.appendChild(input);

      if (players.length > 3) {
        const rm = document.createElement("button");
        rm.className = "rm";
        rm.type = "button";
        rm.textContent = "×";
        rm.setAttribute("aria-label", "Remove player");
        rm.addEventListener("click", () => {
          players.splice(i, 1);
          renderNames();
          syncSetup();
        });
        row.appendChild(rm);
      }
      list.appendChild(row);
    });
    syncSetup();
  }

  function addPlayer() {
    if (players.length >= 15) return;
    players.push("");
    renderNames();
    const inputs = $("name-list").querySelectorAll(".name-input");
    if (inputs.length) inputs[inputs.length - 1].focus();
  }

  function bindSteppers() {
    document.querySelectorAll(".stepper").forEach((st) => {
      st.querySelectorAll("button").forEach((b) => {
        b.addEventListener("click", () => {
          const key = st.dataset.step;
          const d = parseInt(b.dataset.d, 10);
          if (key === "imposters") cfg.imposters = clamp(cfg.imposters + d, 1, Math.max(1, Math.floor(players.length / 2)));
          syncSetup();
        });
      });
    });
    $("add-player").addEventListener("click", addPlayer);
    $("category").addEventListener("change", (e) => (cfg.category = e.target.value));
    bindToggle("countToggle", "c", (v) => (cfg.tellCount = parseInt(v, 10)));
    bindToggle("knowsToggle", "k", (v) => { cfg.impKnows = parseInt(v, 10); syncSetup(); });
  }
  function bindToggle(id, attr, set) {
    const wrap = $(id);
    wrap.querySelectorAll("button").forEach((b) => {
      b.addEventListener("click", () => {
        wrap.querySelectorAll("button").forEach((x) => x.classList.remove("on"));
        b.classList.add("on");
        set(b.dataset[attr]);
      });
    });
  }

  /* ---------- Build a round (random imposters + distinct hints) ---------- */
  function buildRound() {
    const pool = cfg.category === "__ALL__"
      ? Object.values(CATEGORIES).flat()
      : CATEGORIES[cfg.category];

    // No repeats: exclude already-used words. If the pool is exhausted,
    // reset only this pool's words and start the cycle again.
    let avail = pool.filter((e) => !used.includes(e.word));
    if (avail.length === 0) {
      used = used.filter((w) => !pool.some((e) => e.word === w));
      avail = pool.slice();
    }
    const entry = pick(avail);
    used.push(entry.word);
    saveUsed(used);

    const hints = shuffle(entry.hints.slice());

    const count = players.length;
    // Uniformly random imposter selection: shuffle all seats, take the first N.
    const seats = shuffle(Array.from({ length: count }, (_, i) => i));
    const impSet = new Set(seats.slice(0, cfg.imposters));

    const roles = [];
    let hintCursor = 0;
    for (let i = 0; i < count; i++) {
      if (impSet.has(i)) {
        const hint = hints[hintCursor % hints.length]; // distinct per imposter
        hintCursor++;
        roles.push({ imposter: true, hint });
      } else {
        roles.push({ imposter: false, hint: null });
      }
    }
    // Pass order = players sorted alphabetically by name (case-insensitive).
    const order = Array.from({ length: count }, (_, i) => i)
      .sort((a, b) => playerName(a).toLowerCase().localeCompare(playerName(b).toLowerCase()));

    round = { word: entry.word, roles, order };
    reveal = { idx: 0, shown: false };
  }

  /* ---------- Reveal screen ---------- */
  function renderReveal() {
    const i = reveal.idx;
    $("rv-name").textContent = playerName(round.order[i]);
    const prog = $("rv-progress");
    prog.innerHTML = "";
    for (let p = 0; p < players.length; p++) {
      const pip = document.createElement("div");
      pip.className = "pip" + (p < i ? " done" : p === i ? " cur" : "");
      prog.appendChild(pip);
    }
    reveal.shown = false;
    reveal.peeked = false;
    buildRoleContent();
    $("rv-flip").classList.remove("flipped");
    $("rv-next").style.display = "none";
    // replay the name entrance animation
    const nm = $("rv-name");
    nm.classList.remove("enter");
    void nm.offsetWidth;
    nm.classList.add("enter");
  }

  // Pre-render the current player's role into the (hidden) card.
  function buildRoleContent() {
    const role = round.roles[round.order[reveal.idx]];
    // A blind imposter (impKnows off) is shown a card that looks exactly like a crewmate's,
    // with their hint standing in for the secret word — so they can't tell they're the imposter.
    const showAsImposter = role.imposter && cfg.impKnows;
    const tag = $("rv-roletag");
    const body = $("rv-body");
    const back = document.querySelector(".flip-back");
    if (back) {
      back.classList.toggle("is-imp", showAsImposter);
      back.classList.toggle("is-crew", !showAsImposter);
    }
    if (showAsImposter) {
      tag.textContent = "Imposter";
      tag.className = "roletag imp";
      const count = cfg.tellCount && cfg.imposters > 1
        ? `<div class="imp-count">${cfg.imposters} imposters in play — blend in</div>` : "";
      body.innerHTML =
        `<div class="role-label">Your secret hint</div>` +
        `<div class="theword theword--hint">${escapeHtml(role.hint)}</div>` +
        count +
        `<div class="role-tip">You don't know the word. Bluff using your hint and don't get caught.</div>`;
    } else {
      // Real crewmate sees the word; blind imposter sees their hint in its place.
      const word = role.imposter ? role.hint : round.word;
      tag.textContent = "Crewmate";
      tag.className = "roletag crew";
      body.innerHTML =
        `<div class="role-label">The secret word</div>` +
        `<div class="theword">${escapeHtml(word)}</div>` +
        `<div class="role-tip">Give a clue that proves you know it — without making it too obvious.</div>`;
    }
  }

  // Hold to reveal — flips the card over.
  function showRole() {
    if (reveal.shown) return;
    reveal.shown = true;
    $("rv-flip").classList.add("flipped");
    if (navigator.vibrate) navigator.vibrate(15);
  }

  // Release flips it back automatically; reveal the "next" button after first peek.
  function hideRole() {
    if (!reveal.shown) return;
    reveal.shown = false;
    $("rv-flip").classList.remove("flipped");
    if (!reveal.peeked) {
      reveal.peeked = true;
      const next = $("rv-next");
      next.textContent = reveal.idx === players.length - 1 ? "Done →" : "Next player →";
      next.style.display = "";
    }
  }

  function nextReveal() {
    if (reveal.idx < players.length - 1) {
      reveal.idx++;
      renderReveal();
    } else {
      roundComplete();
    }
  }

  /* ---------- Round complete ---------- */
  function roundComplete() {
    // hide the answer until someone asks for it
    $("round-answer").style.display = "none";
    $("rd-reveal").textContent = "Reveal answer";
    show("round");
    rollStarter();
  }

  // Randomly assign who gives the first clue, with a quick slot-machine roll.
  function rollStarter() {
    if (starterTimer) clearInterval(starterTimer);
    const nameEl = $("rd-starter-name");
    const finalIdx = Math.floor(Math.random() * players.length);
    let ticks = 0;
    const total = 13;
    nameEl.classList.remove("landed");
    nameEl.classList.add("rolling");
    starterTimer = setInterval(() => {
      ticks++;
      if (ticks >= total) {
        clearInterval(starterTimer);
        starterTimer = null;
        nameEl.textContent = playerName(finalIdx);
        nameEl.classList.remove("rolling");
        nameEl.classList.add("landed");
        if (navigator.vibrate) navigator.vibrate(35);
      } else {
        nameEl.textContent = playerName(Math.floor(Math.random() * players.length));
      }
    }, 70);
  }

  function stopStarter() {
    if (starterTimer) { clearInterval(starterTimer); starterTimer = null; }
  }

  function renderAnswer() {
    $("rd-word").textContent = round.word;
    const imps = round.roles
      .map((r, i) => ({ ...r, num: i + 1 }))
      .filter((r) => r.imposter);
    $("rd-imp-title").textContent =
      imps.length > 1 ? `The ${imps.length} imposters were…` : "The imposter was…";
    const list = $("rd-imps");
    list.innerHTML = "";
    imps.forEach((r) => {
      const row = document.createElement("div");
      row.className = "imp-row";
      row.innerHTML =
        `<span class="num">${r.num}</span><span>${escapeHtml(playerName(r.num - 1))}</span>` +
        `<span class="h">hint: ${r.hint}</span>`;
      list.appendChild(row);
    });
  }

  function startRound() {
    stopStarter();
    buildRound();
    renderReveal();
    show("reveal");
  }

  /* ---------- Wire up ---------- */
  function init() {
    const yearEl = $("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
    fillCategories();
    sortPlayers();
    renderNames();
    syncSetup();
    bindSteppers();

    $("startBtn").addEventListener("click", startRound);

    const card = $("rv-card");
    card.addEventListener("pointerdown", (e) => { e.preventDefault(); showRole(); });
    card.addEventListener("pointerup", hideRole);
    card.addEventListener("pointerleave", hideRole);
    card.addEventListener("pointercancel", hideRole);
    // Block the long-press selection/callout menu on mobile while holding.
    card.addEventListener("contextmenu", (e) => e.preventDefault());
    $("rv-next").addEventListener("click", (e) => { e.stopPropagation(); nextReveal(); });

    $("rd-next").addEventListener("click", startRound);
    $("rd-reveal").addEventListener("click", () => {
      const a = $("round-answer");
      const open = a.style.display !== "none";
      if (open) {
        a.style.display = "none";
        $("rd-reveal").textContent = "Reveal answer";
      } else {
        renderAnswer();
        a.style.display = "";
        $("rd-reveal").textContent = "Hide answer";
      }
    });
    $("rd-setup").addEventListener("click", () => { stopStarter(); show("setup"); });
    $("homeBtn").addEventListener("click", () => { stopStarter(); show("setup"); });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
