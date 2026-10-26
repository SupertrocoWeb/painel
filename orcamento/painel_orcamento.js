/* =====================================================================
   painel_orcamento.js — Orçamento de público SuperAdds (LP da RD Station)
   ---------------------------------------------------------------------
   O anunciante passa o público (gênero, idade, região, renda) e quantas
   pessoas quer atingir; a página responde quem são, onde estão, quantos
   são, em que lojas e varejistas, quanto custa e qual a taxa de sucesso.

   Os números vêm do Power BI (MKT 63 Persona_Enriquecidos e ADS - 01
   Ayumi Porto), só totais, e chegam CIFRADOS em orcamento.json (AES-GCM;
   chave PBKDF2-SHA256 da senha). A senha não está neste arquivo nem no
   JSON: só quem a digita abre os dados, que ficam só na memória da página.
   ===================================================================== */
(function () {
  "use strict";
  if (window.__orcamentoMontado) { return; }
  window.__orcamentoMontado = true;

  var ORC_URL = "https://raw.githubusercontent.com/SupertrocoWeb/painel/main/orcamento/orcamento.json";
  var ORC_URL_FALLBACK = "https://cdn.jsdelivr.net/gh/SupertrocoWeb/painel@main/orcamento/orcamento.json";

  if (!document.getElementById("pst-fonts")) {
    var lk = document.createElement("link");
    lk.id = "pst-fonts";
    lk.rel = "stylesheet";
    lk.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap";
    document.head.appendChild(lk);
  }

  var DIAS = ["", "segunda", "terça", "quarta", "quinta", "sexta", "sábado", "domingo"];
  var DIA_FRASE = { "segunda": "às segundas", "terça": "às terças", "quarta": "às quartas", "quinta": "às quintas",
                    "sexta": "às sextas", "sábado": "aos sábados", "domingo": "aos domingos" };
  var REGIOES = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"];
  var MIN_ENVIOS_PERFIL = 30;          // abaixo disso, a taxa do perfil é ruído: usa a geral
  var MIN_CAIXA_PERFIL = 500;

  var CSS = `
  :host{ all:initial; display:block; }
  [hidden]{display:none !important}
  *{box-sizing:border-box;margin:0;padding:0}
  .app{
    --brand:#15B8B6; --deep:#0C3035; --deep2:#0A2429; --accent:#F2A93B;
    --bg:#EEF4F5; --soft:#F5FBFA; --ink:#123A41; --ink2:#2C555C; --muted:#5F7C83; --muted2:#7F969C;
    --line:#E2ECEE; --card:#fff; --track:#E9F0F1; --pos:#12A971; --neg:#D9573A;
    --warn-bg:#FDF6E7; --warn-ink:#865A0C; --warn-line:#F1E1BD;
    --s1:#2a78d6; --s2:#eb6834;
    --disp:'Plus Jakarta Sans',system-ui,sans-serif; --body:'Inter',system-ui,sans-serif;
    --sh:0 1px 2px rgba(11,45,49,.04), 0 4px 16px rgba(11,45,49,.05);
    color-scheme:light;
    display:block;background:var(--bg);color:var(--ink);font-family:var(--body);
    font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased;text-align:left;
    max-width:100%;min-height:100vh;transition:background-color .4s ease;
  }
  .app.escuro{
    color-scheme:dark;
    --bg:#06161A; --soft:#0F2B30; --ink:#E6F2F2; --ink2:#C2D8DA; --muted:#8FAEB2; --muted2:#6F8E92;
    --line:rgba(255,255,255,.09); --card:#0B2227; --track:rgba(255,255,255,.08); --deep:#0F3A40; --deep2:#0B2E33;
    --pos:#3DD598; --neg:#FF8A6B; --warn-bg:rgba(242,169,59,.12); --warn-ink:#F4C675; --warn-line:rgba(242,169,59,.32);
    --s1:#3987e5; --s2:#d95926;
    --sh:0 1px 2px rgba(0,0,0,.35), 0 6px 20px rgba(0,0,0,.28);
  }
  .wrap{max-width:1440px;margin:0 auto;padding:0 26px 40px;min-width:0}
  button,input,select{font:inherit;color:inherit}
  button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid var(--brand);outline-offset:2px}
  .topo{display:flex;align-items:center;gap:16px;padding:22px 0 14px;flex-wrap:wrap}
  .marca{display:flex;align-items:center;gap:12px;min-width:0}
  .sig{width:42px;height:42px;border-radius:12px;background:var(--deep);display:grid;place-items:center;flex:0 0 auto}
  .sig svg{width:24px;height:24px}
  .marca h1{font-family:var(--disp);font-weight:800;font-size:20px;letter-spacing:-.02em;line-height:1.15}
  .marca .sub{font-size:12px;color:var(--muted);margin-top:2px}
  .dir{margin-left:auto;display:flex;align-items:center;gap:9px;flex-wrap:wrap}
  .chip{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:8px 13px;font-size:12px;
    color:var(--ink2);box-shadow:var(--sh);display:inline-flex;align-items:center;gap:7px}
  .chip.live::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--pos)}
  .btn{border:1px solid var(--line);background:var(--card);font-size:12.5px;color:var(--ink2);padding:8px 13px;
    border-radius:10px;cursor:pointer;display:inline-flex;align-items:center;gap:7px;transition:.18s;white-space:nowrap;box-shadow:var(--sh)}
  .btn:hover{border-color:var(--brand);color:var(--brand)}
  .btn svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2.2}
  .btn.pri{background:var(--deep);color:#fff;border-color:transparent;font-weight:600}
  .app.escuro .btn.pri{background:var(--brand);color:#06201f}
  .btn.pri:hover{filter:brightness(1.12);color:#fff}
  .app.escuro .btn.pri:hover{color:#06201f}
  .tbtn{width:37px;height:37px;border-radius:10px;border:1px solid var(--line);background:var(--card);color:var(--ink2);
    display:inline-grid;place-items:center;cursor:pointer;box-shadow:var(--sh)}
  .tbtn:hover{border-color:var(--brand);color:var(--brand)}
  .tbtn svg{width:17px;height:17px;stroke:currentColor;fill:none;stroke-width:2}
  .carregando{padding:60px 0;text-align:center;color:var(--muted)}

  /* senha */
  .senha{max-width:440px;margin:40px auto;text-align:center;padding:30px 28px}
  .cadeado{width:44px;height:44px;border-radius:12px;background:var(--soft);display:grid;place-items:center;margin:0 auto 14px;color:var(--brand)}
  .cadeado svg{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:2}
  .senha form{display:flex;gap:8px;margin-top:16px;flex-wrap:wrap;justify-content:center}
  .senha input{flex:1;min-width:180px;font-size:14px;padding:11px 13px;border-radius:10px;border:1px solid var(--line);background:var(--card)}
  .msg{margin-top:10px;font-size:12.5px;color:var(--neg);min-height:18px}

  /* blocos */
  .painel{background:var(--card);border:1px solid var(--line);border-radius:15px;padding:18px 20px;box-shadow:var(--sh);min-width:0}
  .painel h3{font-family:var(--disp);font-weight:700;font-size:15px;letter-spacing:-.01em}
  .painel .cap{font-size:11.5px;color:var(--muted);margin-top:3px;line-height:1.45}
  .hrow{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:14px}
  .row{display:grid;gap:13px;margin-top:13px}
  .r-2{grid-template-columns:minmax(0,1.35fr) minmax(0,1fr)}
  .r-3{grid-template-columns:repeat(3,minmax(0,1fr))}
  .sec{font-family:var(--disp);font-weight:800;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin:26px 0 2px}
  .sec small{font-family:var(--body);font-weight:500;letter-spacing:0;text-transform:none;font-size:12px;margin-left:8px}

  /* pedido */
  .pedido{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px 18px}
  .campo{display:flex;flex-direction:column;gap:6px;min-width:0}
  .campo.l2{grid-column:span 2}
  .campo.l4{grid-column:1 / -1}
  .rot{font-size:11.5px;font-weight:600;color:var(--muted);letter-spacing:.02em}
  .campo input[type=text],.campo input[type=number],.campo select{font-size:13px;padding:9px 11px;border-radius:9px;
    border:1px solid var(--line);background:var(--card);min-width:0;width:100%}
  .par{display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center}
  .par span{font-size:12px;color:var(--muted)}
  .chips{display:flex;flex-wrap:wrap;gap:6px}
  .op{border:1px solid var(--line);background:var(--card);border-radius:999px;padding:6px 12px;font-size:12.5px;cursor:pointer;
    color:var(--ink2);transition:.15s}
  .op:hover{border-color:var(--brand)}
  .op[aria-pressed=true]{background:var(--brand);border-color:var(--brand);color:#fff;font-weight:600}
  .app.escuro .op[aria-pressed=true]{color:#06201f}
  .op.uf{padding:5px 9px;font-size:11.5px;min-width:38px}
  .op.cid{background:var(--soft)}
  .op.cid b{margin-left:6px;color:var(--muted)}
  .chk{display:flex;align-items:center;gap:8px;font-size:12.5px;color:var(--ink2);cursor:pointer}
  .acoes{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;align-items:center}

  /* numeros */
  .bn{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:13px}
  .bn .c{background:var(--card);border:1px solid var(--line);border-radius:15px;padding:16px 18px;box-shadow:var(--sh);min-width:0}
  .bn .c.destaque{background:linear-gradient(150deg,var(--deep),var(--deep2));border-color:transparent}
  .bn .c.destaque .r{color:#9FC2C4} .bn .c.destaque .v{color:#fff} .bn .c.destaque .s{color:#8DB5B7}
  .bn .r{font-size:11.5px;color:var(--muted);font-weight:500}
  .bn .v{font-family:var(--disp);font-weight:800;letter-spacing:-.025em;font-size:clamp(18px,3vw,27px);margin-top:7px;
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .bn .v.alerta{color:var(--warn-ink)}
  .bn .s{font-size:10.5px;color:var(--muted2);margin-top:3px;line-height:1.4}

  /* barras */
  .part{display:flex;flex-direction:column;gap:9px}
  .pl .h{display:flex;justify-content:space-between;gap:10px;font-size:12.5px;margin-bottom:4px}
  .pl .h span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .pl .h b{font-family:var(--disp);font-variant-numeric:tabular-nums;white-space:nowrap}
  .pl .h small{font-weight:400;color:var(--muted);margin-left:5px;font-family:var(--body)}
  .pl .t{display:block;height:9px;background:var(--track);border-radius:6px;overflow:hidden}
  .pl .f{display:block;height:100%;border-radius:6px;background:var(--s1);min-width:2px}
  .vazio{color:var(--muted);font-size:13px;padding:20px 0;text-align:center}

  /* tabela */
  .tw{overflow-x:auto;max-width:100%}
  table{width:100%;border-collapse:collapse;font-size:12.5px}
  th{text-align:left;color:var(--muted);font-weight:500;font-size:10.5px;text-transform:uppercase;letter-spacing:.04em;
    padding:0 10px 8px;border-bottom:1px solid var(--line);white-space:nowrap}
  td{padding:8px 10px;border-bottom:1px solid var(--line)}
  tr:last-child td{border-bottom:none}
  th.n,td.n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
  td.n{font-family:var(--disp);font-weight:600}
  td .m{color:var(--muted);font-size:11.5px}

  /* funil e colunas */
  .funil{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
  .etapa{border:1px solid var(--line);border-radius:12px;padding:12px 14px;background:var(--soft)}
  .etapa .r{font-size:11.5px;color:var(--muted)}
  .etapa .v{font-family:var(--disp);font-weight:800;font-size:20px;margin-top:4px}
  .etapa .s{font-size:11px;color:var(--muted2);margin-top:2px}
  .fonte{font-size:11.5px;color:var(--muted);margin-top:10px;line-height:1.5}
  .fonte b{color:var(--ink2)}
  .col svg{width:100%;height:auto;display:block}
  .col rect{transition:opacity .15s}
  .col rect:hover{opacity:.8}
  .grade{stroke:var(--line);stroke-width:1}
  .eixo{font-size:10px;fill:var(--muted)}
  .val{font-size:10.5px;font-weight:600;fill:var(--ink2)}
  .nota{font-size:11.5px;color:var(--muted);line-height:1.6;margin-top:22px;border-top:1px solid var(--line);padding-top:14px}
  .nota b{color:var(--ink2)}
  .aviso{background:var(--warn-bg);border:1px solid var(--warn-line);color:var(--warn-ink);border-radius:10px;padding:9px 12px;font-size:12px;margin-top:12px}
  .tip{position:fixed;z-index:50;pointer-events:none;background:var(--deep);color:#fff;font-size:12px;border-radius:9px;
    padding:7px 10px;box-shadow:0 6px 20px rgba(0,0,0,.25);white-space:pre-line;opacity:0;transition:opacity .12s;max-width:280px}
  .tip.on{opacity:1}
  .toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:var(--deep);color:#fff;padding:10px 16px;
    border-radius:10px;font-size:13px;opacity:0;transition:opacity .2s;pointer-events:none;z-index:60}
  .toast.on{opacity:1}
  @media (max-width:1100px){.pedido{grid-template-columns:repeat(2,minmax(0,1fr))}.r-3{grid-template-columns:minmax(0,1fr)}}
  @media (max-width:900px){.r-2{grid-template-columns:minmax(0,1fr)}.bn{grid-template-columns:repeat(2,minmax(0,1fr))}
    .funil{grid-template-columns:repeat(2,minmax(0,1fr))}}
  @media (max-width:560px){.wrap{padding:0 14px 30px}.pedido{grid-template-columns:minmax(0,1fr)}.campo.l2{grid-column:auto}
    .dir{margin-left:0}}
  `;

  var TREVO = '<svg viewBox="0 0 24 24"><g fill="#5DD9D7"><circle cx="12" cy="6.5" r="4.2"/><circle cx="12" cy="17.5" r="4.2"/>' +
    '<circle cx="6.5" cy="12" r="4.2"/><circle cx="17.5" cy="12" r="4.2"/></g><circle cx="12" cy="12" r="2.3" fill="#0C3035"/></svg>';
  var CADEADO = '<svg viewBox="0 0 24 24"><rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>';
  var LUA = '<svg viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';
  var SOL = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var DOC = '<svg viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>';
  var COPIA = '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>';
  var LIMPA = '<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>';

  function boot() {
    var slot = document.getElementById("orcamento-supertroco");
    var host = document.createElement("div");
    if (slot) { slot.appendChild(host); } else { document.body.appendChild(host); }
    var root = host.attachShadow({ mode: "open" });
    root.innerHTML = "<style>" + CSS + "</style>" +
      '<div class="app"><div class="wrap" id="tela"><div class="carregando">Carregando&hellip;</div></div>' +
      '<div class="tip" id="tip"></div><div class="toast" id="toast" role="status"></div></div>';
    var $ = function (id) { return root.getElementById(id); };
    var app = root.querySelector(".app"), tela = $("tela"), tip = $("tip"), toast = $("toast");

    var PAC = null, D = null, X = null;
    var PED = { anunciante: "", gen: [true, true, false, false], idDe: 0, idAte: 9, ufs: {}, cidades: [], rendaDe: 0,
                rendaAte: 5, base: false, qtd: "" };
    var mostrarTodas = false;

    // ---------- formato ----------
    function nf(n, c) { return Number(n || 0).toLocaleString("pt-BR", { minimumFractionDigits: c || 0, maximumFractionDigits: c || 0 }); }
    function moeda(n, c) { return "R$ " + nf(n, c === undefined ? 2 : c); }
    function pct(v, c) { return v === null || v === undefined || isNaN(v) ? "—" : nf(v * 100, c === undefined ? 1 : c) + "%"; }
    function esc(s) { return String(s === null || s === undefined ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
    function quando(iso) {
      if (!iso) return "—";
      var d = new Date(iso);
      if (isNaN(d)) return String(iso).slice(0, 10);
      return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) + " " +
        d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    }
    function guardar(c, v) { try { localStorage.setItem("orc-" + c, v); } catch (e) { /* privado */ } }
    function ler(c) { try { return localStorage.getItem("orc-" + c); } catch (e) { return null; } }
    function avisar(t) { toast.textContent = t; toast.classList.add("on"); setTimeout(function () { toast.classList.remove("on"); }, 2600); }

    // ---------- tema ----------
    var tema = ler("tema") || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "escuro" : "claro");
    function aplicarTema() { app.classList.toggle("escuro", tema === "escuro"); }
    aplicarTema();

    // ---------- dica ----------
    root.addEventListener("mousemove", function (ev) {
      var alvo = ev.composedPath ? ev.composedPath()[0] : ev.target;
      var el = alvo && alvo.closest ? alvo.closest("[data-tip]") : null;
      if (!el) { tip.classList.remove("on"); return; }
      tip.textContent = el.getAttribute("data-tip");
      tip.classList.add("on");
      var x = ev.clientX + 14, y = ev.clientY + 14;
      if (x + tip.offsetWidth > window.innerWidth - 8) x = ev.clientX - tip.offsetWidth - 14;
      if (y + tip.offsetHeight > window.innerHeight - 8) y = ev.clientY - tip.offsetHeight - 14;
      tip.style.left = x + "px"; tip.style.top = y + "px";
    });

    function topo(sub) {
      return '<div class="topo"><div class="marca"><span class="sig">' + TREVO + '</span><div><h1>Orçamento de público</h1>' +
        '<div class="sub">' + esc(sub) + '</div></div></div><div class="dir">' +
        (D ? '<span class="chip live">MKT 63 de ' + esc(quando(D.info.mkt63_atualizado)) + ' · ADS-01 de ' +
          esc(quando(D.info.ads01_atualizado)) + '</span>' +
          '<button class="btn" id="bt-copiar">' + COPIA + 'Copiar resumo</button>' +
          '<button class="btn pri" id="bt-gerar">' + DOC + 'Gerar orçamento</button>' : '') +
        '<button class="tbtn" id="bt-tema" aria-label="Trocar tema">' + (tema === "escuro" ? SOL : LUA) + '</button></div></div>';
    }
    function ligarTema() {
      var b = $("bt-tema");
      if (b) b.addEventListener("click", function () {
        tema = tema === "escuro" ? "claro" : "escuro"; guardar("tema", tema); aplicarTema();
        b.innerHTML = tema === "escuro" ? SOL : LUA;
      });
    }

    // ---------- senha ----------
    function telaSenha() {
      var sem = !window.crypto || !crypto.subtle || typeof DecompressionStream === "undefined";
      tela.innerHTML = topo("SuperAdds · área da equipe") +
        '<div class="painel senha"><div class="cadeado">' + CADEADO + '</div><h3>Área da equipe</h3>' +
        '<div class="cap">Os números do público chegam cifrados e só abrem com a senha.</div>' +
        (sem ? '<div class="msg">Este navegador não abre a área protegida. Use Chrome, Edge, Safari ou Firefox atualizados.</div>' :
          '<form id="f-senha" autocomplete="off"><input type="password" id="senha" aria-label="Senha" placeholder="Senha">' +
          '<button class="btn pri" type="submit" id="bt-abrir">Abrir</button></form><div class="msg" id="msg" aria-live="polite"></div>') +
        '</div>';
      ligarTema();
      var f = $("f-senha");
      if (!f) return;
      var inp = $("senha");
      inp.focus();
      f.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var msg = $("msg"), bt = $("bt-abrir");
        var s = inp.value.trim();
        if (!s) { msg.textContent = "Digite a senha."; return; }
        bt.disabled = true; msg.style.color = "var(--muted)"; msg.textContent = "Abrindo…";
        decifrar(s).then(function (dados) {
          D = dados; inp.value = "";
          preparar();
          telaOrcamento();
        }).catch(function () {
          bt.disabled = false; msg.style.color = ""; msg.textContent = "Senha incorreta. Tente de novo.";
          inp.value = ""; inp.focus();
        });
      });
    }
    function decifrar(senha) {
      var b64 = function (s) { var bin = atob(s), u = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; };
      return crypto.subtle.importKey("raw", new TextEncoder().encode(senha), "PBKDF2", false, ["deriveKey"])
        .then(function (base) {
          return crypto.subtle.deriveKey({ name: "PBKDF2", salt: b64(PAC.sal), iterations: PAC.iter, hash: "SHA-256" },
            base, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
        })
        .then(function (k) { return crypto.subtle.decrypt({ name: "AES-GCM", iv: b64(PAC.iv) }, k, b64(PAC.dados)); })
        .then(function (buf) { return new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream("gzip"))).text(); })
        .then(function (t) { return JSON.parse(t); });
    }

    // ---------- dados prontos para filtrar ----------
    function preparar() {
      var dic = D.dic;
      X = { regiaoDaUf: {}, ufsDaRegiao: {}, cidadesPorUf: {} };
      dic.uf.forEach(function (u, i) {
        var r = dic.regiao[i];
        X.regiaoDaUf[i] = r;
        (X.ufsDaRegiao[r] = X.ufsDaRegiao[r] || []).push(i);
      });
      // compradores por cidade (para sugerir as maiores primeiro)
      var porCid = new Float64Array(dic.cidade.length);
      for (var k = 0; k < D.seg.n.length; k++) porCid[D.seg.c[k]] += D.seg.n[k];
      X.porCidade = porCid;
      // dias de cada dia da semana no período do caixa (para média por dia)
      X.diasNoCaixa = [0, 0, 0, 0, 0, 0, 0, 0];
      var de = new Date(D.info.caixa_de), ate = new Date(D.info.caixa_ate);
      if (!isNaN(de) && !isNaN(ate)) {
        for (var d = new Date(de.getFullYear(), de.getMonth(), de.getDate()); d <= ate; d.setDate(d.getDate() + 1)) {
          X.diasNoCaixa[((d.getDay() + 6) % 7) + 1]++;
        }
      }
      var ped = ler("pedido");
      if (ped) { try { var p = JSON.parse(ped); if (p && p.gen) PED = Object.assign(PED, p); } catch (e) { /* ignora */ } }
      PED.cidades = PED.cidades.filter(function (c) { return c < dic.cidade.length; });
      var ultIdade = dic.idade.length - 2, ultRenda = dic.renda.length - 1;
      PED.idDe = Math.min(PED.idDe, ultIdade); PED.idAte = Math.min(PED.idAte, ultIdade);
      PED.rendaDe = Math.min(PED.rendaDe, ultRenda); PED.rendaAte = Math.min(PED.rendaAte, ultRenda);
    }

    // ---------- o cálculo ----------
    function calcular() {
      var dic = D.dic, s = D.seg, p = D.loja;
      var ultimaIdade = dic.idade.length - 2;              // a última é "sem cadastro"
      var iOk = dic.idade.map(function (_, i) {
        if (i > ultimaIdade) return PED.idDe === 0 && PED.idAte === ultimaIdade;   // idade desconhecida só sem filtro de idade
        return i >= PED.idDe && i <= PED.idAte;
      });
      var gOk = PED.gen.slice();
      var algumaUf = Object.keys(PED.ufs).some(function (k) { return PED.ufs[k]; });
      var uOk = dic.uf.map(function (_, i) { return !algumaUf || !!PED.ufs[i]; });
      var rOk = dic.renda.map(function (_, i) { return i >= PED.rendaDe && i <= PED.rendaAte; });
      var cSel = PED.cidades.length ? {} : null;
      PED.cidades.forEach(function (c) { cSel[c] = true; });

      var R = { total: 0, compradores: 0, base: 0, porUf: {}, porCid: {}, porIdade: {}, porGen: {}, porRenda: {}, porLoja: {},
                lojas: 0, varejistas: {}, nVarejistas: 0 };
      for (var k = 0; k < s.n.length; k++) {
        if (!gOk[s.g[k]] || !iOk[s.i[k]] || !uOk[s.u[k]] || !rOk[s.r[k]] || (cSel && !cSel[s.c[k]])) continue;
        var v = PED.base ? s.b[k] : s.n[k];
        R.total += v; R.compradores += s.n[k]; R.base += s.b[k];
        R.porUf[s.u[k]] = (R.porUf[s.u[k]] || 0) + v;
        R.porCid[s.c[k]] = (R.porCid[s.c[k]] || 0) + v;
        R.porIdade[s.i[k]] = (R.porIdade[s.i[k]] || 0) + v;
        R.porGen[s.g[k]] = (R.porGen[s.g[k]] || 0) + v;
        R.porRenda[s.r[k]] = (R.porRenda[s.r[k]] || 0) + v;
      }
      // lojas: onde esse público comprou (uma pessoa pode contar em mais de uma loja)
      var cidLoja = null;
      if (cSel) {
        cidLoja = {};
        PED.cidades.forEach(function (c) { cidLoja[chaveCidade(dic.cidade[c][0]) + "|" + dic.uf[dic.cidade[c][1]]] = true; });
      }
      for (k = 0; k < p.n.length; k++) {
        if (!gOk[p.g[k]] || !iOk[p.i[k]] || !uOk[p.u[k]] || !rOk[p.r[k]]) continue;
        R.porLoja[p.l[k]] = (R.porLoja[p.l[k]] || 0) + p.n[k];
      }
      Object.keys(R.porLoja).forEach(function (l) {
        var lj = dic.loja[l];
        if (cidLoja && !cidLoja[chaveCidade(lj[2]) + "|" + lj[3]]) { delete R.porLoja[l]; return; }
        R.lojas++;
        var vj = lj[1] >= 0 ? dic.varejista[lj[1]] : "Sem varejista";
        R.varejistas[vj] = (R.varejistas[vj] || 0) + R.porLoja[l];
      });
      R.nVarejistas = Object.keys(R.varejistas).length;
      R.qtd = PED.qtd ? Math.max(0, parseInt(PED.qtd, 10) || 0) : 0;
      R.mensagens = R.qtd ? Math.min(R.qtd, R.total) : R.total;
      R.custoUnit = D.custo.unitario || 0;
      R.custo = R.mensagens * R.custoUnit;
      R.plus = plus(gOk, iOk, uOk, ultimaIdade);
      R.entregues = R.mensagens * R.plus.taxaEntrega;
      R.lidas = R.entregues * R.plus.taxaLeitura;
      R.cliques = R.entregues * ((D.custo.taxa_clique || 0) / 100);
      return R;
    }
    function chaveCidade(s) {
      return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase().replace(/\s+/g, " ").trim();
    }

    // Plus (ADS-01): campanhas e caixa do perfil; com pouca amostra, o geral
    function plus(gOk, iOk, uOk, ultimaIdade) {
      var dic = D.dic, gIdx = {}, iIdx = {}, uIdx = {};
      dic.genero.forEach(function (g, i) { gIdx[g] = i; });
      dic.idade.forEach(function (f, i) { iIdx[f] = i; });
      dic.uf.forEach(function (u, i) { uIdx[u] = i; });
      var perf = { envios: 0, entregues: 0, lidas: 0, erros: 0, tip: 0, pesoTip: 0 }, geral = { envios: 0, entregues: 0, lidas: 0, erros: 0, tip: 0, pesoTip: 0 };
      D.camp.forEach(function (c) {
        var alvo = [geral];
        var gi = gIdx[c[0]], ii = iIdx[c[1]], ui = uIdx[c[2]];
        var conhecido = c[0] === "Homens" || c[0] === "Mulheres";
        if (conhecido && gOk[gi] && ii !== undefined && ii <= ultimaIdade && iOk[ii] && (ui === undefined || uOk[ui])) alvo.push(perf);
        alvo.forEach(function (a) {
          a.envios += c[3]; a.entregues += c[4]; a.lidas += c[5]; a.erros += c[6];
          if (c[7] !== null && c[5]) { a.tip += c[7] * c[5]; a.pesoTip += c[5]; }
        });
      });
      var usaPerfil = perf.envios >= MIN_ENVIOS_PERFIL, cmp = usaPerfil ? perf : geral;
      // caixa
      var hora = new Float64Array(24), dia = new Float64Array(8), hG = new Float64Array(24), dG = new Float64Array(8);
      var cons = 0, consG = 0, val = 0, comp = 0, valG = 0, compG = 0;
      D.caixa.forEach(function (c) {
        hG[c[3]] += c[4]; dG[c[2]] += c[4]; consG += c[4]; valG += c[6]; compG += c[5];
        if ((c[0] === 0 || c[0] === 1) && gOk[c[0]] && c[1] <= ultimaIdade && iOk[c[1]]) {
          hora[c[3]] += c[4]; dia[c[2]] += c[4]; cons += c[4]; val += c[6]; comp += c[5];
        }
      });
      var cxPerfil = cons >= MIN_CAIXA_PERFIL;
      var H = cxPerfil ? hora : hG, Dd = cxPerfil ? dia : dG, totH = cxPerfil ? cons : consG;
      var pico = 0, picoDia = 1, melhorMedia = -1;
      for (var h = 0; h < 24; h++) if (H[h] > H[pico]) pico = h;
      for (var d = 1; d <= 7; d++) {
        var media = X.diasNoCaixa[d] ? Dd[d] / X.diasNoCaixa[d] : Dd[d];
        if (media > melhorMedia) { melhorMedia = media; picoDia = d; }
      }
      return {
        usaPerfil: usaPerfil, enviosPerfil: perf.envios, envios: cmp.envios,
        taxaEntrega: cmp.envios ? cmp.entregues / cmp.envios : 0,
        taxaLeitura: cmp.entregues ? cmp.lidas / cmp.entregues : 0,
        taxaErro: cmp.envios ? cmp.erros / cmp.envios : 0,
        tipico: cmp.pesoTip ? cmp.tip / cmp.pesoTip : null,
        caixaPerfil: cxPerfil, consultas: totH, porHora: Array.prototype.slice.call(H), pico: pico, picoPct: totH ? H[pico] / totH : 0,
        picoDia: DIAS[picoDia], ticket: cxPerfil ? (comp ? val / comp : null) : (compG ? valG / compG : null)
      };
    }

    // ---------- peças ----------
    function numeros(lista) {
      return '<div class="bn">' + lista.map(function (x) {
        return '<div class="c' + (x[3] ? " destaque" : "") + '"><div class="r">' + esc(x[0]) + '</div><div class="v' +
          (x[4] ? " alerta" : "") + '">' + esc(x[1]) + '</div><div class="s">' + esc(x[2] || "") + '</div></div>';
      }).join("") + '</div>';
    }
    function painel(titulo, cap, corpo) {
      return '<div class="painel"><div class="hrow"><div><h3>' + esc(titulo) + '</h3>' + (cap ? '<div class="cap">' + cap + '</div>' : '') +
        '</div></div>' + corpo + '</div>';
    }
    function barras(itens, total, cor) {
      if (!itens.length) return '<div class="vazio">Nenhuma pessoa com este pedido.</div>';
      var max = Math.max.apply(null, itens.map(function (x) { return x.v; })) || 1;
      return '<div class="part">' + itens.map(function (x) {
        var share = total ? x.v / total : 0;
        return '<div class="pl" data-tip="' + esc(nf(x.v) + " pessoas · " + pct(share) + "\n" + x.r) + '"><div class="h"><span>' + esc(x.r) +
          '</span><b>' + nf(x.v) + '<small>' + pct(share, 0) + '</small></b></div><span class="t"><span class="f" style="width:' +
          Math.max(1.5, x.v / max * 100).toFixed(1) + '%' + (cor ? ';background:' + cor : '') + '"></span></span></div>';
      }).join("") + '</div>';
    }
    function topN(obj, n, rotulo) {
      return Object.keys(obj).map(function (k) { return { r: rotulo(k), v: obj[k] }; })
        .filter(function (x) { return x.v > 0; }).sort(function (a, b) { return b.v - a.v; }).slice(0, n);
    }
    function colunasHora(porHora, pico) {
      var cont = tela.clientWidth || 1200, W = Math.max(300, Math.min(760, cont - 80)), H = 200, mE = 36, mB = 22, mT = 16;
      var horas = []; for (var h = 6; h < 24; h++) horas.push(h);
      var tot = porHora.reduce(function (a, b) { return a + b; }, 0) || 1;
      var vals = horas.map(function (h) { return porHora[h] / tot; });
      var max = Math.max.apply(null, vals.concat([0.01])) * 1.12, larg = (W - mE - 4) / horas.length;
      var y = function (v) { return mT + (H - mT - mB) * (1 - v / max); }, g = "";
      [0, 0.5, 1].forEach(function (f) {
        var yy = y(max / 1.12 * f).toFixed(1);
        g += '<line x1="' + mE + '" x2="' + W + '" y1="' + yy + '" y2="' + yy + '" class="grade"/><text x="' + (mE - 5) + '" y="' +
          (+yy + 3) + '" text-anchor="end" class="eixo">' + nf(max / 1.12 * f * 100, 0) + '%</text>';
      });
      horas.forEach(function (hh, i) {
        var v = vals[i], x0 = mE + i * larg + larg * 0.15, w = larg * 0.7, yy = y(v);
        g += '<rect x="' + x0.toFixed(1) + '" y="' + yy.toFixed(1) + '" width="' + w.toFixed(1) + '" height="' +
          Math.max(0, H - mB - yy).toFixed(1) + '" rx="3" fill="' + (hh === pico ? "var(--accent)" : "var(--s1)") + '" data-tip="' +
          esc(pct(v) + " das consultas do dia\n" + (hh < 10 ? "0" : "") + hh + "h") + '"/>';
        if (i % (larg < 26 ? 2 : 1) === 0) g += '<text x="' + (x0 + w / 2).toFixed(1) + '" y="' + (H - 6) + '" text-anchor="middle" class="eixo">' +
          (hh < 10 ? "0" : "") + hh + 'h</text>';
      });
      return '<div class="col"><svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Movimento no caixa por hora">' + g + '</svg></div>';
    }

    // ---------- tela do orçamento ----------
    function telaOrcamento() {
      tela.innerHTML = topo("SuperAdds · " + nf(D.info.compradores) + " compradores na base enriquecida") +
        '<div class="painel" id="pedido">' + formPedido() + '</div><div id="resultado"></div>' + notas();
      ligarTema();
      $("bt-gerar").addEventListener("click", gerarOrcamento);
      $("bt-copiar").addEventListener("click", copiarResumo);
      ligarPedido();
      desenhar();
    }
    function sel(id, lista, atual) {
      return '<select id="' + id + '">' + lista.map(function (x, i) {
        return '<option value="' + i + '"' + (i === atual ? " selected" : "") + '>' + esc(x) + '</option>';
      }).join("") + '</select>';
    }
    function formPedido() {
      var dic = D.dic, idades = dic.idade.slice(0, dic.idade.length - 1);
      var ufsVisiveis = dic.uf.map(function (u, i) { return i; }).filter(function (i) { return dic.uf[i] && dic.uf[i] !== "EX"; })
        .sort(function (a, b) { return dic.uf[a] < dic.uf[b] ? -1 : 1; });
      return '<div class="hrow"><div><h3>Pedido do anunciante</h3><div class="cap">O orçamento muda na hora, a cada ajuste.</div></div>' +
        '<div class="acoes"><button class="btn" id="bt-limpar">' + LIMPA + 'Limpar</button></div></div>' +
        '<div class="pedido">' +
        '<label class="campo l2"><span class="rot">Anunciante / produto</span><input type="text" id="f-anunciante" maxlength="80" placeholder="Ex.: Porto Bank · consórcio" value="' + esc(PED.anunciante) + '"></label>' +
        '<label class="campo"><span class="rot">Pessoas que quer atingir</span><input type="number" id="f-qtd" min="0" step="100" placeholder="Ex.: 50000" value="' + esc(PED.qtd) + '"></label>' +
        '<div class="campo"><span class="rot">Gênero</span><div class="chips">' +
          ["Homens", "Mulheres"].map(function (g, i) { return '<button class="op" data-gen="' + i + '" aria-pressed="' + !!PED.gen[i] + '">' + g + '</button>'; }).join("") + '</div></div>' +
        '<div class="campo"><span class="rot">Faixa etária</span><div class="par">' + sel("f-id-de", idades, PED.idDe) + '<span>a</span>' + sel("f-id-ate", idades, PED.idAte) + '</div></div>' +
        '<div class="campo"><span class="rot">Renda estimada por mês (bureau)</span><div class="par">' + sel("f-r-de", dic.renda, PED.rendaDe) + '<span>a</span>' + sel("f-r-ate", dic.renda, PED.rendaAte) + '</div></div>' +
        '<div class="campo l2"><span class="rot">Região</span><div class="chips">' + REGIOES.map(function (r) {
          return '<button class="op" data-reg="' + r + '" aria-pressed="' + regiaoInteira(r) + '">' + r + '</button>'; }).join("") + '</div></div>' +
        '<div class="campo l4"><span class="rot">Estados <span style="font-weight:400">(nenhum marcado = Brasil todo)</span></span><div class="chips">' +
          ufsVisiveis.map(function (i) { return '<button class="op uf" data-uf="' + i + '" aria-pressed="' + !!PED.ufs[i] + '">' + esc(dic.uf[i]) + '</button>'; }).join("") + '</div></div>' +
        '<div class="campo l2"><span class="rot">Cidades (opcional)</span><input type="text" id="f-cidade" list="lista-cidades" placeholder="Digite e escolha uma cidade">' +
          '<datalist id="lista-cidades">' + opcoesCidade() + '</datalist><div class="chips" id="cidades">' + chipsCidades() + '</div></div>' +
        '<label class="campo l2 chk" style="flex-direction:row;align-self:end"><input type="checkbox" id="f-base"' + (PED.base ? " checked" : "") +
          '> Incluir quem não compra desde 2025 (sem loja e renda iguais; o padrão é só compradores, como no MKT 63)</label>' +
        '</div>';
    }
    function regiaoInteira(r) {
      var ufs = X.ufsDaRegiao[r] || [];
      return ufs.length > 0 && ufs.every(function (i) { return PED.ufs[i]; });
    }
    function opcoesCidade() {
      var dic = D.dic, algumaUf = Object.keys(PED.ufs).some(function (k) { return PED.ufs[k]; });
      var idx = [];
      for (var c = 0; c < dic.cidade.length; c++) {
        if (!dic.cidade[c][0]) continue;
        if (algumaUf && !PED.ufs[dic.cidade[c][1]]) continue;
        idx.push(c);
      }
      idx.sort(function (a, b) { return X.porCidade[b] - X.porCidade[a]; });
      return idx.slice(0, 1500).map(function (c) { return '<option value="' + esc(dic.cidade[c][0] + " - " + dic.uf[dic.cidade[c][1]]) + '"></option>'; }).join("");
    }
    function chipsCidades() {
      return PED.cidades.map(function (c) {
        var cc = D.dic.cidade[c];
        return '<button class="op cid" data-cid="' + c + '" aria-pressed="true" title="Tirar">' + esc(cc[0] + " - " + D.dic.uf[cc[1]]) + '<b>×</b></button>';
      }).join("");
    }
    var tRecalc = null;
    function mudou(refazerForm) {
      guardar("pedido", JSON.stringify(PED));
      if (refazerForm) {
        var foco = root.activeElement && root.activeElement.id;
        $("pedido").innerHTML = formPedido(); ligarPedido();
        if (foco && $(foco)) $(foco).focus();
      }
      clearTimeout(tRecalc);
      tRecalc = setTimeout(desenhar, 90);
    }
    function ligarPedido() {
      $("f-anunciante").addEventListener("input", function (e) { PED.anunciante = e.target.value; guardar("pedido", JSON.stringify(PED)); });
      $("f-qtd").addEventListener("input", function (e) { PED.qtd = e.target.value; mudou(false); });
      root.querySelectorAll("[data-gen]").forEach(function (b) {
        b.addEventListener("click", function () {
          var i = +b.getAttribute("data-gen"); PED.gen[i] = !PED.gen[i];
          if (!PED.gen[0] && !PED.gen[1]) PED.gen[i] = true;            // pelo menos um gênero
          mudou(true);
        });
      });
      [["f-id-de", "idDe"], ["f-id-ate", "idAte"], ["f-r-de", "rendaDe"], ["f-r-ate", "rendaAte"]].forEach(function (x) {
        $(x[0]).addEventListener("change", function (e) {
          PED[x[1]] = +e.target.value;
          if (PED.idDe > PED.idAte) { if (x[1] === "idDe") PED.idAte = PED.idDe; else PED.idDe = PED.idAte; }
          if (PED.rendaDe > PED.rendaAte) { if (x[1] === "rendaDe") PED.rendaAte = PED.rendaDe; else PED.rendaDe = PED.rendaAte; }
          mudou(true);
        });
      });
      root.querySelectorAll("[data-reg]").forEach(function (b) {
        b.addEventListener("click", function () {
          var r = b.getAttribute("data-reg"), liga = !regiaoInteira(r);
          (X.ufsDaRegiao[r] || []).forEach(function (i) { PED.ufs[i] = liga; });
          mudou(true);
        });
      });
      root.querySelectorAll("[data-uf]").forEach(function (b) {
        b.addEventListener("click", function () { var i = b.getAttribute("data-uf"); PED.ufs[i] = !PED.ufs[i]; mudou(true); });
      });
      root.querySelectorAll("[data-cid]").forEach(function (b) {
        b.addEventListener("click", function () {
          var c = +b.getAttribute("data-cid");
          PED.cidades = PED.cidades.filter(function (x) { return x !== c; }); mudou(true);
        });
      });
      $("f-cidade").addEventListener("change", function (e) {
        var v = e.target.value.trim(), dic = D.dic;
        var m = v.match(/^(.*) - ([A-Z]{2})$/);
        if (!m) return;
        for (var c = 0; c < dic.cidade.length; c++) {
          if (dic.cidade[c][0] === m[1] && dic.uf[dic.cidade[c][1]] === m[2]) {
            if (PED.cidades.indexOf(c) < 0) PED.cidades.push(c);
            break;
          }
        }
        e.target.value = ""; mudou(true);
      });
      $("f-base").addEventListener("change", function (e) { PED.base = e.target.checked; mudou(false); });
      $("bt-limpar").addEventListener("click", function () {
        PED = { anunciante: "", gen: [true, true, false, false], idDe: 0, idAte: D.dic.idade.length - 2, ufs: {}, cidades: [],
                rendaDe: 0, rendaAte: D.dic.renda.length - 1, base: false, qtd: "" };
        mostrarTodas = false; mudou(true);
      });
    }

    var ULTIMO = null;
    function desenhar() {
      var R = calcular(), dic = D.dic;
      ULTIMO = R;
      var P = R.plus, falta = R.qtd && R.qtd > R.total;
      var nums = numeros([
        ["Contatos catalogados", nf(R.total), PED.base ? "base enriquecida, com e sem compra desde 2025" : "compradores da base enriquecida", true],
        R.qtd ? ["Pedido do anunciante", falta ? "faltam " + nf(R.qtd - R.total) : "atende 100%", nf(R.qtd) + " pessoas pedidas", false, falta]
              : ["Pedido do anunciante", "—", "informe quantas pessoas quer atingir", false],
        ["Lojas", nf(R.lojas), "onde esse público compra", false],
        ["Varejistas", nf(R.nVarejistas), "redes dessas lojas", false],
        ["Custo estimado", moeda(R.custo, 2), nf(R.mensagens) + " mensagens × " + moeda(R.custoUnit, 4), true],
        ["Entregas esperadas", nf(R.entregues), pct(P.taxaEntrega) + " das mensagens", false],
        ["Leituras esperadas", nf(R.lidas), pct(P.taxaLeitura) + " das entregues", false],
        ["Custo por leitura", R.lidas ? moeda(R.custo / R.lidas, 2) : "—", "custo ÷ leituras esperadas", false]]);

      var idade = topN(R.porIdade, 20, function (k) { return dic.idade[k]; })
        .sort(function (a, b) { return dic.idade.indexOf(a.r) - dic.idade.indexOf(b.r); });
      var renda = topN(R.porRenda, 20, function (k) { return dic.renda[k]; })
        .sort(function (a, b) { return dic.renda.indexOf(a.r) - dic.renda.indexOf(b.r); });
      var gen = topN(R.porGen, 4, function (k) { return dic.genero[k]; });
      var ufs = topN(R.porUf, 12, function (k) { return dic.uf[k] ? dic.uf[k] + " · " + X.regiaoDaUf[k] : "sem UF"; });
      var cids = topN(R.porCid, 12, function (k) { return dic.cidade[k][0] ? dic.cidade[k][0] + " - " + dic.uf[dic.cidade[k][1]] : "sem cidade"; });
      var vars = topN(R.varejistas, 12, function (k) { return k; });
      var lojas = Object.keys(R.porLoja).map(function (l) { return { l: l, v: R.porLoja[l] }; }).sort(function (a, b) { return b.v - a.v; });
      var limite = mostrarTodas ? 300 : 15;
      var tab = lojas.length ? '<div class="tw"><table><thead><tr><th>Loja</th><th>Varejista</th><th>Cidade</th><th class="n">Pessoas do público</th></tr></thead><tbody>' +
        lojas.slice(0, limite).map(function (x) {
          var lj = dic.loja[x.l];
          return '<tr><td>' + esc(lj[0]) + '</td><td>' + esc(lj[1] >= 0 ? dic.varejista[lj[1]] : "—") + '</td><td><span class="m">' +
            esc(lj[2] + " - " + lj[3]) + '</span></td><td class="n">' + nf(x.v) + '</td></tr>';
        }).join("") + '</tbody></table></div>' +
        (lojas.length > 15 ? '<div style="margin-top:10px"><button class="btn" id="bt-lojas">' + (mostrarTodas ? "Mostrar só as 15 maiores" :
          "Ver as " + nf(Math.min(lojas.length, 300)) + " maiores lojas") + '</button></div>' : '')
        : '<div class="vazio">Nenhuma loja para este pedido.</div>';

      var fonteTaxa = P.usaPerfil ? "taxas do próprio perfil, em <b>" + nf(P.envios) + " envios</b> da campanha Ayumi/Porto"
        : "taxas gerais da campanha Ayumi/Porto (<b>" + nf(P.envios) + " envios</b>): o perfil pedido tem só " + nf(P.enviosPerfil) +
          " envios com cadastro conhecido, pouco para uma taxa própria";
      var funil = '<div class="funil">' +
        etapa("Mensagens", nf(R.mensagens), R.qtd ? "o pedido, até o que existe" : "todo o público catalogado") +
        etapa("Entregues", nf(R.entregues), pct(P.taxaEntrega) + " das mensagens") +
        etapa("Lidas", nf(R.lidas), pct(P.taxaLeitura) + " das entregues") +
        etapa("Cliques", nf(R.cliques), pct((D.custo.taxa_clique || 0) / 100) + " das entregues (Meta)") + '</div>' +
        '<div class="fonte">Base: ' + fonteTaxa + '. Clique: botões dos templates, segundo a Meta (últimos 30 dias).' +
        (P.tipico ? ' Tempo típico até ler: <b>' + nf(P.tipico, 0) + ' min</b>.' : '') + '</div>';
      var caixa = colunasHora(P.porHora, P.pico) +
        '<div class="fonte">' + (P.caixaPerfil ? "Perfil pedido, pelas pessoas com cadastro no app" : "Todos os clientes (o perfil pedido tem pouca amostra com cadastro)") +
        ', nas ' + nf(D.info.caixa_lojas) + ' lojas Ayumi, de ' + esc(String(D.info.caixa_de).slice(8, 10) + "/" + String(D.info.caixa_de).slice(5, 7)) +
        ' a ' + esc(String(D.info.caixa_ate).slice(8, 10) + "/" + String(D.info.caixa_ate).slice(5, 7)) + '. Pico às <b>' + (P.pico < 10 ? "0" : "") + P.pico +
        'h</b> (' + pct(P.picoPct, 0) + ' das consultas do dia) e ' + esc(DIA_FRASE[P.picoDia] || P.picoDia) + '.' +
        (P.ticket ? ' Ticket médio no caixa: <b>' + moeda(P.ticket) + '</b>.' : '') + '</div>';

      $("resultado").innerHTML =
        '<div class="sec">Quantos são e quanto custa</div>' + nums +
        (falta ? '<div class="aviso">O pedido passa do que existe com esse perfil: o orçamento considera os ' + nf(R.total) +
          ' contatos catalogados. Para chegar às ' + nf(R.qtd) + ' pessoas, abra a faixa etária, a renda ou a região.</div>' : '') +
        '<div class="sec">Quem são</div><div class="row r-3">' +
          painel("Faixa etária", "", barras(idade, R.total)) + painel("Renda estimada", "pelo bureau", barras(renda, R.total)) +
          painel("Gênero", "", barras(gen, R.total)) + '</div>' +
        '<div class="sec">Onde estão</div><div class="row r-2">' +
          painel("Estados", "onde moram (cadastro enriquecido)", barras(ufs, R.total)) +
          painel("Cidades", "as 12 maiores", barras(cids, R.total)) + '</div>' +
        '<div class="row r-2">' +
          painel("Lojas onde esse público compra", "pessoas do público que compraram na loja desde 2025 (uma pessoa pode contar em mais de uma)" +
            (PED.cidades.length ? " · só lojas das cidades escolhidas" : ""), tab) +
          painel("Varejistas", "soma das lojas de cada rede", barras(vars, vars.reduce(function (a, b) { return a + b.v; }, 0))) + '</div>' +
        '<div class="sec">Taxa de sucesso <small>Plus · ADS - 01 Ayumi Porto</small></div><div class="row r-2">' +
          painel("O que esperar das mensagens", "a partir do que já enviamos", funil) +
          painel("Quando esse público está na loja", "movimento no caixa por hora (% do dia) · em destaque, o pico", caixa) + '</div>';
      var bl = $("bt-lojas");
      if (bl) bl.addEventListener("click", function () { mostrarTodas = !mostrarTodas; desenhar(); });
    }
    function etapa(r, v, s) { return '<div class="etapa"><div class="r">' + esc(r) + '</div><div class="v">' + esc(v) + '</div><div class="s">' + esc(s) + '</div></div>'; }
    function notas() {
      var c = D.custo, i = D.info;
      return '<div class="nota"><b>Como ler.</b> Contatos catalogados = pessoas da base enriquecida do MKT 63 com compra desde 01/01/2025 ' +
        '(o mesmo critério do painel: ' + nf(i.compradores) + ' de ' + nf(i.base) + ' na base). Renda estimada pelo bureau, em faixas de salário mínimo (R$ ' +
        nf(i.renda_sm) + '). O MKT 63 tem o troco de cada compra, não o valor: por isso o filtro é a renda, e o ticket aparece só no Plus (lojas Ayumi). ' +
        '<b>Custo</b> = só o nosso: preço Meta de marketing (' + moeda(c.preco_meta, 4) + ' por mensagem) + impostos (' + nf(c.impostos_pct, 2) +
        '%, conforme o parametros.xlsx). <b>Plus</b> = campanhas e caixa do ADS - 01; o perfil só aparece para quem tem cadastro no app, ' +
        'e com pouca amostra o orçamento usa o número geral. Dados de ' + esc(quando(i.gerado_em)) + '.</div>';
    }

    // ---------- resumo e orçamento para imprimir ----------
    function descricaoPedido() {
      var dic = D.dic, partes = [];
      var gens = ["Homens", "Mulheres"].filter(function (g, i) { return PED.gen[i]; });
      partes.push(gens.length === 2 ? "homens e mulheres" : gens[0].toLowerCase());
      // faixas "<20", "20-25", ..., ">=61": de onde começa a primeira até onde termina a última
      var ult = dic.idade.length - 2, de = dic.idade[PED.idDe], ate = dic.idade[PED.idAte];
      var lo = de.charAt(0) === "<" ? null : parseInt(de.replace(">=", ""), 10);
      var hi = ate.charAt(0) === ">" ? null : parseInt(ate.split("-").pop().replace("<", ""), 10) - (ate.charAt(0) === "<" ? 1 : 0);
      partes.push(PED.idDe === 0 && PED.idAte === ult ? "todas as idades" : lo === null ? "até " + hi + " anos" :
        hi === null ? "a partir de " + lo + " anos" : "de " + lo + " a " + hi + " anos");
      var ufs = Object.keys(PED.ufs).filter(function (k) { return PED.ufs[k]; }).map(function (k) { return dic.uf[k]; }).sort();
      var regs = REGIOES.filter(regiaoInteira);
      partes.push(!ufs.length ? "Brasil todo" : (regs.length && regs.reduce(function (a, r) { return a + (X.ufsDaRegiao[r] || []).length; }, 0) === ufs.length ?
        "região " + regs.join(", ") : ufs.join(", ")));
      if (PED.cidades.length) partes.push("cidades: " + PED.cidades.map(function (c) { return dic.cidade[c][0]; }).join(", "));
      partes.push(PED.rendaDe === 0 && PED.rendaAte === dic.renda.length - 1 ? "qualquer renda" : "renda " + dic.renda[PED.rendaDe] + " a " + dic.renda[PED.rendaAte]);
      return partes.join(" · ");
    }
    function resumoTexto() {
      var R = ULTIMO, P = R.plus, dic = D.dic;
      var lojas = Object.keys(R.porLoja).sort(function (a, b) { return R.porLoja[b] - R.porLoja[a]; }).slice(0, 5)
        .map(function (l) { return dic.loja[l][0]; });
      var vars = Object.keys(R.varejistas).sort(function (a, b) { return R.varejistas[b] - R.varejistas[a]; });
      return "Orçamento SuperAdds" + (PED.anunciante ? " — " + PED.anunciante : "") + "\n" +
        "Público: " + descricaoPedido() + "\n" +
        "Contatos catalogados: " + nf(R.total) + (R.qtd ? " (pedido: " + nf(R.qtd) + (R.qtd > R.total ? ", faltam " + nf(R.qtd - R.total) : ", atende 100%") + ")" : "") + "\n" +
        "Onde estão: " + nf(R.lojas) + " lojas de " + nf(R.nVarejistas) + " varejistas (" + vars.slice(0, 6).join(", ") + (vars.length > 6 ? "…" : "") + ")\n" +
        "Principais lojas: " + lojas.join("; ") + "\n" +
        "Custo estimado: " + moeda(R.custo) + " (" + nf(R.mensagens) + " mensagens × " + moeda(R.custoUnit, 4) + ", Meta + impostos)\n" +
        "Resultado esperado: " + nf(R.entregues) + " entregues (" + pct(P.taxaEntrega) + "), " + nf(R.lidas) + " lidas (" + pct(P.taxaLeitura) +
        "), " + nf(R.cliques) + " cliques; custo por leitura " + (R.lidas ? moeda(R.custo / R.lidas) : "—") + "\n" +
        "Quando abordar: pico do caixa às " + (P.pico < 10 ? "0" : "") + P.pico + "h, " + (DIA_FRASE[P.picoDia] || P.picoDia) + "\n" +
        "Dados: MKT 63 de " + quando(D.info.mkt63_atualizado) + " e ADS - 01 de " + quando(D.info.ads01_atualizado) + ".";
    }
    function copiarResumo() {
      var t = resumoTexto();
      var ok = function () { avisar("Resumo copiado."); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t).then(ok, function () { copiarVelho(t); ok(); });
      } else { copiarVelho(t); ok(); }
    }
    function copiarVelho(t) {
      var a = document.createElement("textarea"); a.value = t; a.style.position = "fixed"; a.style.opacity = "0";
      document.body.appendChild(a); a.select();
      try { document.execCommand("copy"); } catch (e) { /* sem cópia */ }
      document.body.removeChild(a);
    }
    function gerarOrcamento() {
      var R = ULTIMO, P = R.plus, dic = D.dic;
      var lojas = Object.keys(R.porLoja).sort(function (a, b) { return R.porLoja[b] - R.porLoja[a]; }).slice(0, 25);
      var vars = Object.keys(R.varejistas).sort(function (a, b) { return R.varejistas[b] - R.varejistas[a]; });
      var ufs = Object.keys(R.porUf).sort(function (a, b) { return R.porUf[b] - R.porUf[a]; }).slice(0, 8);
      var linha = function (r, v) { return '<tr><th>' + esc(r) + '</th><td>' + v + '</td></tr>'; };
      var hoje = new Date().toLocaleDateString("pt-BR");
      var html = '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Orçamento SuperAdds' + (PED.anunciante ? " — " + esc(PED.anunciante) : "") +
        '</title><style>body{font:13px/1.5 Inter,system-ui,sans-serif;color:#123A41;margin:32px 40px;max-width:820px}' +
        'h1{font:800 22px "Plus Jakarta Sans",system-ui,sans-serif;margin:0}h2{font:700 14px "Plus Jakarta Sans",system-ui,sans-serif;margin:22px 0 8px;' +
        'text-transform:uppercase;letter-spacing:.05em;color:#5F7C83}.sub{color:#5F7C83;margin-top:4px}table{border-collapse:collapse;width:100%}' +
        'th,td{text-align:left;padding:6px 8px;border-bottom:1px solid #E2ECEE;vertical-align:top}th{width:34%;color:#2C555C;font-weight:600}' +
        '.big{font:800 18px "Plus Jakarta Sans",system-ui,sans-serif}.n{text-align:right;white-space:nowrap}.nota{color:#5F7C83;font-size:11px;margin-top:22px}' +
        '@media print{body{margin:14mm}}</style></head><body>' +
        '<h1>Orçamento de público' + (PED.anunciante ? " — " + esc(PED.anunciante) : "") + '</h1><div class="sub">SuperAdds · ' + hoje + '</div>' +
        '<h2>Pedido</h2><table>' + linha("Público", esc(descricaoPedido())) + (R.qtd ? linha("Pessoas pedidas", nf(R.qtd)) : "") + '</table>' +
        '<h2>Quantos são e quanto custa</h2><table>' +
        linha("Contatos catalogados", '<span class="big">' + nf(R.total) + '</span>' + (R.qtd ? (R.qtd > R.total ? " · faltam " + nf(R.qtd - R.total) : " · atende 100% do pedido") : "")) +
        linha("Mensagens no orçamento", nf(R.mensagens)) +
        linha("Custo estimado", '<span class="big">' + moeda(R.custo) + '</span> (' + moeda(R.custoUnit, 4) + ' por mensagem: Meta + impostos)') +
        linha("Resultado esperado", nf(R.entregues) + " entregues (" + pct(P.taxaEntrega) + ") · " + nf(R.lidas) + " lidas (" + pct(P.taxaLeitura) + ") · " + nf(R.cliques) + " cliques") +
        linha("Custo por leitura", R.lidas ? moeda(R.custo / R.lidas) : "—") + '</table>' +
        '<h2>Onde estão</h2><table>' +
        linha("Estados", ufs.map(function (u) { return esc(dic.uf[u] || "sem UF") + " " + nf(R.porUf[u]); }).join(" · ")) +
        linha("Lojas", nf(R.lojas) + " lojas") + linha("Varejistas", nf(R.nVarejistas) + ": " + esc(vars.join(", "))) + '</table>' +
        '<h2>Principais lojas</h2><table><tr><th>Loja</th><th>Varejista · cidade</th><th class="n">Pessoas</th></tr>' +
        lojas.map(function (l) { var lj = dic.loja[l]; return '<tr><td>' + esc(lj[0]) + '</td><td>' + esc((lj[1] >= 0 ? dic.varejista[lj[1]] : "—") + " · " + lj[2] + " - " + lj[3]) +
          '</td><td class="n">' + nf(R.porLoja[l]) + '</td></tr>'; }).join("") + '</table>' +
        '<h2>Quando abordar</h2><table>' + linha("Pico no caixa", (P.pico < 10 ? "0" : "") + P.pico + "h (" + pct(P.picoPct, 0) + " das consultas do dia), " + esc(DIA_FRASE[P.picoDia] || "")) +
        (P.ticket ? linha("Ticket médio no caixa", moeda(P.ticket) + " (lojas Ayumi)") : "") + '</table>' +
        '<div class="nota">Contatos catalogados: base enriquecida do MKT 63 com compra desde 01/01/2025. Lojas: onde esse público comprou desde 2025 (uma pessoa pode contar em mais de uma). ' +
        'Taxas: ' + (P.usaPerfil ? "do próprio perfil" : "gerais") + ' da campanha Ayumi/Porto (ADS - 01); clique segundo a Meta. Custo: só o custo SuperAdds (Meta + impostos), sem preço de venda. ' +
        'Dados: MKT 63 de ' + esc(quando(D.info.mkt63_atualizado)) + ', ADS - 01 de ' + esc(quando(D.info.ads01_atualizado)) + '.</div>' +
        '<script>window.onload=function(){setTimeout(function(){window.print()},300)}<\/script></body></html>';
      var w = window.open("", "_blank");
      if (!w) { avisar("O navegador bloqueou a janela: libere pop-ups para esta página."); return; }
      w.document.open(); w.document.write(html); w.document.close();
    }

    // ---------- início ----------
    function baixar(url) {
      return fetch(url, { cache: "no-store" }).then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); });
    }
    baixar(ORC_URL).catch(function () { return baixar(ORC_URL_FALLBACK); }).then(function (pac) {
      PAC = pac;
      telaSenha();
    }).catch(function (e) {
      tela.innerHTML = '<div class="carregando">Não foi possível carregar o orçamento (' + esc(e.message) + ').</div>';
    });
  }

  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", boot); }
  else { boot(); }
})();
