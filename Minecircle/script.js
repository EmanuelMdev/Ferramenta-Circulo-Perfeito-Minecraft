(function () {
  const $ = (id) => document.getElementById(id);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fmt = (n) => n.toLocaleString("pt-BR");
  const rfmt = (r) => String(r).replace(".", ",");
  const st = {
    d: 20,
    type: "outline",
    t: 1,
    zoom: 18,
    auto: true,
    hi: -1,
    rows: [],
    total: 0,
  };
  const cv = $("cv"),
    ctx = cv.getContext("2d");
  const L = 30,
    T = 20;

  function build(d, type, t) {
    const r = d / 2,
      rows = [];
    const ins = (x, y, R) => {
      const dx = x + 0.5 - r,
        dy = y + 0.5 - r;
      return dx * dx + dy * dy <= R * R + 1e-9;
    };
    const hole = type === "outline" && r - t > 0;
    for (let y = 0; y < d; y++) {
      const row = [];
      for (let x = 0; x < d; x++) {
        let on = ins(x, y, r);
        if (on && hole && ins(x, y, r - t)) on = false;
        row.push(on);
      }
      rows.push(row);
    }
    return rows;
  }
  const count = (rows) =>
    rows.reduce((a, r) => a + r.reduce((b, v) => b + (v ? 1 : 0), 0), 0);
  function runs(row) {
    const out = [];
    let cur = row[0],
      n = 0;
    for (const v of row) {
      if (v === cur) n++;
      else {
        out.push([cur, n]);
        cur = v;
        n = 1;
      }
    }
    out.push([cur, n]);
    return out;
  }

  function autoZoom() {
    const w = $("scroll").clientWidth - L - 4;
    return clamp(Math.floor(w / st.d), 10, 32);
  }

  function draw() {
    const d = st.d,
      s = st.zoom,
      rows = st.rows,
      dpr = window.devicePixelRatio || 1;
    const W = L + d * s + 2,
      H = T + d * s + 2;
    cv.width = W * dpr;
    cv.height = H * dpr;
    cv.style.width = W + "px";
    cv.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cs = getComputedStyle(document.documentElement);
    const g = (n) => cs.getPropertyValue(n).trim();
    const lo = Math.floor((d - 1) / 2),
      hi = Math.ceil((d - 1) / 2);
    ctx.clearRect(0, 0, W, H);
    for (let y = 0; y < d; y++)
      for (let x = 0; x < d; x++) {
        const c = x >= lo && x <= hi && y >= lo && y <= hi;
        const on = rows[y][x];
        ctx.fillStyle = on
          ? c
            ? g("--block-c")
            : g("--block")
          : c
            ? g("--cen")
            : g("--empty");
        ctx.fillRect(L + x * s, T + y * s, s, s);
      }
    for (let i = 0; i <= d; i++) {
      ctx.strokeStyle = i % 5 === 0 ? g("--grid-s") : g("--grid");
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(L + i * s + 0.5, T);
      ctx.lineTo(L + i * s + 0.5, T + d * s);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(L, T + i * s + 0.5);
      ctx.lineTo(L + d * s, T + i * s + 0.5);
      ctx.stroke();
    }
    if (st.hi >= 0) {
      ctx.strokeStyle = g("--accent");
      ctx.lineWidth = 3;
      ctx.strokeRect(L + 1, T + st.hi * s + 1, d * s - 1, s - 1);
    }
    const step = s >= 16 ? 1 : s >= 10 ? 5 : 10;
    ctx.fillStyle = g("--muted");
    ctx.font = Math.min(12, Math.max(8, s - 4)) + "px system-ui,sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < d; i++) {
      if (step === 1 || (i + 1) % step === 0 || i === 0) {
        ctx.fillText(String(i + 1), L + i * s + s / 2, T / 2);
        ctx.textAlign = "right";
        ctx.fillText(String(i + 1), L - 6, T + i * s + s / 2);
        ctx.textAlign = "center";
      }
    }
  }

  function steps() {
    const d = st.d,
      half = Math.ceil(d / 2);
    let h = "";
    for (let y = 0; y < half; y++) {
      const row = st.rows[y];
      const tot = row.reduce((a, v) => a + (v ? 1 : 0), 0);
      h +=
        '<button class="row' +
        (st.hi === y ? " sel" : "") +
        '" data-y="' +
        y +
        '"><b>Linha ' +
        (y + 1) +
        '</b><span class="chips">' +
        runs(row)
          .map(([v, n]) => '<i class="' + (v ? "b" : "e") + '">' + n + "</i>")
          .join("") +
        "</span><em>" +
        tot +
        (tot === 1 ? " bloco" : " blocos") +
        "</em></button>";
    }
    $("rows").innerHTML = h;
  }

  function stats() {
    const d = st.d,
      n = st.total,
      r = d / 2;
    $("sR").textContent = rfmt(r);
    $("sD").textContent = d + " × " + d;
    $("sT").textContent = fmt(n);
    $("sTs").textContent =
      st.type === "outline"
        ? "só a borda, espessura " + st.t
        : "círculo preenchido";
    const p = Math.floor(n / 64),
      rest = n % 64;
    $("sP").textContent =
      n < 64 ? "0 packs" : p + (p === 1 ? " pack" : " packs");
    $("sPs").textContent =
      n < 64
        ? "faltam menos de 64 blocos"
        : rest
          ? "e mais " + rest + " blocos"
          : "exatamente " + p + " × 64";
  }

  function syncInputs() {
    $("d").value = st.d;
    $("r").value = st.d / 2;
    $("dr").value = Math.min(st.d, 100);
    $("t").value = st.t;
    $("t").max = Math.max(1, Math.ceil(st.d / 2));
    $("tg").style.display = st.type === "outline" ? "" : "none";
    document.querySelectorAll("#seg button").forEach((b) => {
      const on = b.dataset.v === st.type;
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", on);
    });
    document
      .querySelectorAll("#tb tr")
      .forEach((tr) => tr.classList.toggle("cur", +tr.dataset.d === st.d));
  }

  function render() {
    st.t = clamp(st.t, 1, Math.max(1, Math.ceil(st.d / 2)));
    if (st.hi >= Math.ceil(st.d / 2)) st.hi = -1;
    st.rows = build(st.d, st.type, st.t);
    st.total = count(st.rows);
    if (st.auto) st.zoom = autoZoom();
    $("zm").value = st.zoom;
    syncInputs();
    stats();
    draw();
    steps();
  }
  const setD = (v) => {
    st.d = clamp(Math.round(v) || 1, 1, 200);
    st.hi = -1;
    render();
  };

  $("d").addEventListener("input", (e) => {
    if (e.target.value !== "") setD(+e.target.value);
  });
  $("d").addEventListener("change", (e) => setD(+e.target.value));
  $("dm").onclick = () => setD(st.d - 1);
  $("dp").onclick = () => setD(st.d + 1);
  $("dr").addEventListener("input", (e) => setD(+e.target.value));
  $("r").addEventListener("change", (e) =>
    setD(Math.round((+e.target.value || 0.5) * 2)),
  );
  $("t").addEventListener("input", (e) => {
    if (e.target.value !== "") {
      st.t = +e.target.value || 1;
      render();
    }
  });
  $("seg").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    st.type = b.dataset.v;
    render();
  });
  $("zm").addEventListener("input", (e) => {
    st.auto = false;
    st.zoom = +e.target.value;
    draw();
  });
  $("za").onclick = () => {
    st.auto = true;
    render();
  };
  $("rows").addEventListener("click", (e) => {
    const b = e.target.closest(".row");
    if (!b) return;
    const y = +b.dataset.y;
    st.hi = st.hi === y ? -1 : y;
    draw();
    steps();
  });

  function hover(e) {
    const rc = cv.getBoundingClientRect();
    const x = Math.floor((e.clientX - rc.left - L) / st.zoom),
      y = Math.floor((e.clientY - rc.top - T) / st.zoom);
    if (x < 0 || y < 0 || x >= st.d || y >= st.d) {
      $("status").textContent = "Passe o mouse ou o dedo sobre a grade.";
      return;
    }
    $("status").textContent =
      "Coluna " +
      (x + 1) +
      ", linha " +
      (y + 1) +
      ": " +
      (st.rows[y][x] ? "bloco" : "vazio");
  }
  cv.addEventListener("pointermove", hover);
  cv.addEventListener("pointerdown", hover);

  // tabela de referência
  let tb = "";
  for (let d = 1; d <= 100; d++) {
    const o = count(build(d, "outline", 1)),
      f = count(build(d, "filled", 1));
    tb +=
      '<tr data-d="' +
      d +
      '"><td>' +
      d +
      " × " +
      d +
      "</td><td>" +
      rfmt(d / 2) +
      "</td><td>" +
      fmt(o) +
      "</td><td>" +
      fmt(f) +
      "</td></tr>";
  }
  $("tb").innerHTML = tb;
  $("tb").addEventListener("click", (e) => {
    const tr = e.target.closest("tr");
    if (!tr) return;
    setD(+tr.dataset.d);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("resize", () => {
    if (st.auto) {
      st.zoom = autoZoom();
      $("zm").value = st.zoom;
      draw();
    }
  });
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", draw);
  render();
})();
