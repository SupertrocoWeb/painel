/* ===================================================================
   Hub de CRMs Supertroco — painel da LP da RD Station
   -------------------------------------------------------------------
   Nao cole este arquivo direto na RD. Rode o gerar_hub.py e cole o
   rd_javascript_body.html, que e um carregador curto e busca este
   arquivo publicado no GitHub.

   Duas telas: o Hub (consolidado de todos os parceiros) e o CRM de
   cada parceiro, com o tema da marca dele. A troca e feita com fade.
   =================================================================== */
(function () {
  "use strict";

  var HUB_URL = "https://raw.githubusercontent.com/SupertrocoWeb/painel/main/hub.json";
  var HUB_URL_FALLBACK = "https://cdn.jsdelivr.net/gh/SupertrocoWeb/painel@main/hub.json";

  if (!document.getElementById("pst-fonts")) {
    var lk = document.createElement("link");
    lk.id = "pst-fonts";
    lk.rel = "stylesheet";
    lk.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap";
    document.head.appendChild(lk);
  }

  var SEMANA = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
  var CURTA = { "Segunda": "Seg", "Terça": "Ter", "Quarta": "Qua", "Quinta": "Qui",
                "Sexta": "Sex", "Sábado": "Sáb", "Domingo": "Dom" };

  var CSS = `
  :host{ all:initial; display:block; }
  *{box-sizing:border-box;margin:0;padding:0}
  .app{
    --brand:#15B8B6; --brand-lite:#5DD9D7; --deep:#0C3035; --deep2:#0A2429;
    --accent:#F2A93B; --accent-lite:#FFD479; --bg:#EEF4F5; --soft:#F5FBFA;
    --ink:#123A41; --line:#E2ECEE;
    --ink2:#2C555C; --muted:#6E8A91; --muted2:#95AAAF; --card:#fff;
    --pos:#12A971; --neg:#E86B4C;
    --disp:'Plus Jakarta Sans',system-ui,sans-serif; --body:'Inter',system-ui,sans-serif;
    --sh:0 1px 2px rgba(11,45,49,.04), 0 4px 16px rgba(11,45,49,.05);
    display:block;background:var(--bg);color:var(--ink);font-family:var(--body);
    font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased;
    text-align:left;max-width:100%;min-height:100vh;
    transition:background .45s ease;
  }
  .wrap{max-width:1500px;margin:0 auto;padding:0 26px 40px;min-width:0}

  /* ---------- transicao entre telas ---------- */
  .tela{opacity:0;transform:translateY(8px);transition:opacity .3s ease,transform .3s ease}
  .tela.on{opacity:1;transform:none}

  /* ---------- topo ---------- */
  .topo{display:flex;align-items:center;gap:16px;padding:22px 0 16px;flex-wrap:wrap}
  .marca{display:flex;align-items:center;gap:12px;min-width:0}
  .marca .sig{width:42px;height:42px;border-radius:12px;background:var(--deep);
    display:grid;place-items:center;flex:0 0 auto;transition:background .45s ease}
  .marca .sig svg{width:24px;height:24px}
  .marca h1{font-family:var(--disp);font-weight:800;font-size:20px;letter-spacing:-.02em;line-height:1.15}
  .marca .sub{font-size:12px;color:var(--muted);margin-top:2px}
  .topo .dir{margin-left:auto;display:flex;align-items:center;gap:9px;flex-wrap:wrap}
  .chip{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:8px 13px;
    font-size:12.5px;color:var(--ink2);box-shadow:var(--sh);display:inline-flex;align-items:center;gap:7px}
  .chip.live::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--pos)}
  .btn{border:1px solid var(--line);background:var(--card);font:inherit;font-size:12.5px;
    color:var(--ink2);padding:8px 13px;border-radius:10px;cursor:pointer;display:inline-flex;
    align-items:center;gap:7px;transition:.18s;white-space:nowrap}
  .btn:hover{border-color:var(--brand);color:var(--brand);transform:translateX(-2px)}
  .btn svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2.2}

  /* ---------- esteira (ticker) ---------- */
  .ticker{background:var(--deep);border-radius:14px;overflow:hidden;position:relative;
    margin-bottom:16px;transition:background .45s ease}
  .ticker::after{content:"";position:absolute;inset:0;pointer-events:none;
    background:linear-gradient(90deg,var(--deep) 0,transparent 7%,transparent 93%,var(--deep) 100%)}
  .trilho{display:flex;gap:0;width:max-content;animation:desliza 46s linear infinite}
  .ticker:hover .trilho{animation-play-state:paused}
  @keyframes desliza{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  .tk{display:flex;align-items:baseline;gap:9px;padding:13px 26px;white-space:nowrap;
    border-right:1px solid rgba(255,255,255,.07)}
  .tk .p{width:7px;height:7px;border-radius:50%;flex:0 0 auto;align-self:center}
  .tk .r{font-size:11.5px;color:#9FC2C4;letter-spacing:.01em}
  .tk .v{font-family:var(--disp);font-weight:700;font-size:14px;color:#fff}
  .tk .d{font-size:11.5px;font-weight:600}
  .tk .d.bom{color:#4ADE80} .tk .d.ruim{color:#FF8A6B} .tk .d.neutro{color:#9FC2C4}

  /* ---------- big numbers ---------- */
  .bn{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:13px}
  .bn .c{background:var(--card);border:1px solid var(--line);border-radius:15px;
    padding:17px 19px;box-shadow:var(--sh);min-width:0;position:relative;overflow:hidden}
  .bn .c.destaque{background:linear-gradient(150deg,var(--deep),var(--deep2));border-color:transparent}
  .bn .c.destaque .r{color:#9FC2C4} .bn .c.destaque .v{color:#fff}
  .bn .c.destaque .s{color:#7fa9ab}
  .bn .r{font-size:11.5px;color:var(--muted);font-weight:500}
  .bn .v{font-family:var(--disp);font-weight:800;font-size:28px;letter-spacing:-.025em;
    margin-top:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .bn .s{font-size:10.5px;color:var(--muted2);margin-top:3px}

  /* ---------- blocos ---------- */
  .row{display:grid;gap:13px;margin-top:13px;scroll-margin-top:16px}
  .r-2{grid-template-columns:minmax(0,1.35fr) minmax(0,1fr)}
  .r-3{grid-template-columns:repeat(3,minmax(0,1fr))}
  .r-72-28{grid-template-columns:minmax(0,1.75fr) minmax(0,1fr)}
  .painel{background:var(--card);border:1px solid var(--line);border-radius:15px;
    padding:18px 20px;box-shadow:var(--sh);min-width:0}
  .painel h3{font-family:var(--disp);font-weight:700;font-size:15px;letter-spacing:-.01em}
  .painel .cap{font-size:11.5px;color:var(--muted);margin-top:3px;line-height:1.45}
  .painel .hrow{display:flex;align-items:flex-start;justify-content:space-between;
    gap:12px;flex-wrap:wrap;margin-bottom:14px}
  .legenda{font-size:11px;color:var(--muted2);display:flex;gap:14px;align-items:center;
    margin-top:12px;flex-wrap:wrap}
  .legenda i{display:inline-block;width:9px;height:9px;border-radius:3px;margin-right:5px;vertical-align:-1px}
  .legenda b{color:var(--ink)}

  /* ---------- cards de parceiro ---------- */
  .parc{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,270px),1fr));gap:14px}
  .pc{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:0;
    box-shadow:var(--sh);cursor:pointer;overflow:hidden;transition:transform .2s ease,box-shadow .2s ease;
    display:flex;flex-direction:column;min-width:0;text-align:left;font:inherit;color:inherit}
  .pc:hover{transform:translateY(-3px);box-shadow:0 10px 30px rgba(11,45,49,.13)}
  .pc .faixa{height:5px}
  .pc .corpo{padding:16px 18px 18px;display:flex;flex-direction:column;gap:12px;flex:1}
  .pc .cab{display:flex;align-items:center;gap:11px}
  .pc .ini{width:38px;height:38px;border-radius:11px;display:grid;place-items:center;
    font-family:var(--disp);font-weight:800;font-size:15px;color:#fff;flex:0 0 auto}
  .pc .nm{font-family:var(--disp);font-weight:700;font-size:15.5px;letter-spacing:-.01em}
  .pc .sg{font-size:11.5px;color:var(--muted)}
  .pc .grid{display:grid;grid-template-columns:1fr 1fr;gap:10px 8px;margin-top:2px}
  .pc .gi{min-width:0}
  .pc .gi .r{display:block;font-size:10.5px;color:var(--muted)}
  .pc .gi .v{display:block;font-family:var(--disp);font-weight:700;font-size:16px;margin-top:2px}
  .pc .cab span{min-width:0}
  .pc .nm{display:block}
  .pc .rodape{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;
    margin-top:auto;padding-top:12px;border-top:1px solid var(--line);font-size:11.5px;color:var(--muted)}
  .pc .abrir{display:inline-flex;align-items:center;gap:5px;font-weight:600}
  .pc .abrir svg{width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2.4}
  .selo{display:inline-block;flex:0 0 auto;font-size:9.5px;font-weight:600;padding:3px 9px;
    border-radius:999px;background:#FDF6E7;color:#9A6A12;border:1px solid #F1E1BD;
    white-space:nowrap;line-height:1.4}

  /* ---------- participacao ---------- */
  .part{display:flex;flex-direction:column;gap:13px;margin-top:2px}
  .pl .h{display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:6px;gap:8px}
  .pl .h b{font-family:var(--disp)}
  .pl .t{display:block;height:12px;background:#E9F0F1;border-radius:7px;overflow:hidden}
  .pl .f{display:block;height:100%;border-radius:7px;transition:width .7s cubic-bezier(.3,1,.4,1)}

  /* ---------- KPIs do CRM ---------- */
  .kpis{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;margin-top:4px}
  .kpi{background:var(--card);border:1px solid var(--line);border-radius:13px;
    padding:13px 15px;box-shadow:var(--sh);min-width:0}
  .kpi.star{border-color:var(--brand);background:var(--soft)}
  .kpi .top{display:flex;align-items:center;justify-content:space-between;gap:6px}
  .kpi .lbl{font-size:11.5px;color:var(--muted);font-weight:500;overflow:hidden;
    text-overflow:ellipsis;white-space:nowrap}
  .kpi .src{width:7px;height:7px;border-radius:50%;flex:0 0 auto}
  .kpi .src.so{background:var(--brand)} .kpi .src.rd{background:var(--accent)}
  .kpi .v{font-family:var(--disp);font-weight:700;font-size:21px;letter-spacing:-.02em;
    margin-top:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .kpi .sub{font-size:10.5px;color:var(--muted2);margin-top:2px;white-space:normal;line-height:1.4}
  .kpi .alerta{font-size:9.5px;color:#9A6A12;background:#FDF6E7;border:1px solid #F1E1BD;
    border-radius:6px;padding:3px 7px;margin-top:7px;max-width:100%;white-space:normal;line-height:1.35}

  /* ---------- abas do CRM ---------- */
  .abas{display:flex;gap:7px;flex-wrap:wrap;margin:16px 0 4px}
  .abas button{border:1px solid var(--line);background:var(--card);font:inherit;font-size:12.5px;
    color:var(--muted);padding:8px 14px;border-radius:10px;cursor:pointer;transition:.18s}
  .abas button:hover{color:var(--ink);border-color:var(--brand)}
  .abas button.on{background:var(--brand);border-color:var(--brand);color:#fff;font-weight:600}

  .seg{display:inline-flex;background:#E7EFF0;border-radius:9px;padding:3px;gap:2px;max-width:100%;overflow-x:auto}
  .seg button{border:0;background:transparent;font:inherit;font-size:12px;color:var(--muted);
    padding:6px 11px;border-radius:7px;cursor:pointer;transition:.15s;white-space:nowrap}
  .seg button.on{background:var(--card);color:var(--ink);font-weight:600;box-shadow:0 1px 3px rgba(11,45,49,.12)}

  /* ---------- graficos ---------- */
  .chart svg{width:100%;height:auto;display:block;overflow:visible}
  .gline{stroke:var(--line);stroke-width:1}
  .glabel{fill:var(--muted2);font-size:10px;font-family:var(--body)}
  .xlabel{fill:var(--muted);font-size:10px;font-family:var(--body);text-anchor:middle}
  .lpath{fill:none;stroke:var(--brand);stroke-width:2.2;stroke-linejoin:round;stroke-linecap:round}
  .pt{fill:#fff;stroke:var(--brand);stroke-width:2}
  .pt.hit{fill:var(--accent);stroke:#fff;stroke-width:2}
  .hitzone{fill:transparent;cursor:pointer}

  .wbars{display:flex;align-items:flex-end;gap:10px;height:190px;padding-top:10px;min-width:0}
  .wcol{flex:1 1 0;min-width:0;display:flex;flex-direction:column;align-items:center;
    justify-content:flex-end;height:100%;gap:7px;position:relative;padding-top:14px}
  .wcol .wbar{display:block;width:100%;max-width:62px;border-radius:8px 8px 4px 4px;
    background:linear-gradient(180deg,var(--brand-lite),var(--brand));min-height:4px;
    transition:height .6s cubic-bezier(.3,1,.4,1)}
  .wcol .wv{font-family:var(--disp);font-weight:700;font-size:12px;white-space:nowrap}
  .wcol .wl{font-size:10px;color:var(--muted);text-align:center;white-space:nowrap;
    overflow:hidden;text-overflow:ellipsis;max-width:100%}
  .wcol .wdot{position:absolute;top:0;width:7px;height:7px;border-radius:50%;
    background:var(--accent);box-shadow:0 0 0 3px rgba(242,169,59,.22)}

  .versus{display:flex;flex-direction:column;gap:14px}
  .vs .h{display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:6px;gap:8px}
  .vs .h b{font-family:var(--disp)}
  .vs .t{display:block;height:11px;background:#E9F0F1;border-radius:6px;overflow:hidden}
  .vs .f{display:block;height:100%;border-radius:6px;transition:width .6s cubic-bezier(.3,1,.4,1)}
  .vs .f.eng{background:linear-gradient(90deg,var(--brand),var(--brand-lite))}
  .vs .f.des{background:var(--neg)}
  .tagbox{background:var(--soft);border:1px solid var(--line);border-radius:10px;
    padding:11px 13px;font-size:12.5px;color:var(--ink2);line-height:1.55}

  .week{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px;align-items:end;height:140px}
  .wd{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;
    height:100%;gap:5px;min-width:0}
  .wd .b{display:block;width:100%;border-radius:6px 6px 3px 3px;background:#E4EFF0;min-height:4px;
    transition:height .6s cubic-bezier(.3,1,.4,1)}
  .wd.has .b{background:linear-gradient(180deg,var(--brand-lite),var(--brand))}
  .wd.best .b{background:linear-gradient(180deg,var(--accent-lite),var(--accent))}
  .wd .v{font-family:var(--disp);font-weight:600;font-size:10.5px;color:var(--ink2);white-space:nowrap}
  .wd .n{font-size:10px;color:var(--muted)}
  .wd.best .n{color:var(--ink);font-weight:700}

  .track{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:5px;height:150px}
  .slot{border-radius:9px;background:#EDF3F4;position:relative;display:flex;flex-direction:column;
    justify-content:flex-end;padding:7px 5px;overflow:hidden;min-width:0}
  .slot .fill{display:block;position:absolute;left:0;right:0;bottom:0;
    background:linear-gradient(180deg,var(--brand-lite),var(--brand));opacity:.34}
  .slot.best{outline:2px solid var(--accent);outline-offset:-2px}
  .slot.best .fill{background:linear-gradient(180deg,var(--accent-lite),var(--accent));opacity:.52}
  .slot .v{position:relative;font-family:var(--disp);font-weight:700;font-size:11.5px}
  .slot .n{position:relative;font-size:9px;color:var(--muted);white-space:nowrap}
  .hbest{display:flex;align-items:baseline;gap:8px;margin-top:auto;padding-top:12px;flex-wrap:wrap}
  .hbest b{font-family:var(--disp);font-size:24px;font-weight:700;letter-spacing:-.02em}
  .hbest span{font-size:11.5px;color:var(--muted)}

  .funil{display:flex;justify-content:center;margin:2px 0 12px}
  .funil svg{width:100%;max-width:250px;height:auto;display:block}
  .fstat{display:flex;justify-content:space-between;align-items:baseline;gap:10px;
    font-size:12px;padding:7px 0;border-bottom:1px solid var(--line)}
  .fstat:last-child{border-bottom:none}
  .fstat .fv{font-family:var(--disp);font-weight:700;white-space:nowrap}
  .fstat .fp{color:var(--muted2);font-size:10.5px;margin-left:6px}

  /* ---------- cruzamento ---------- */
  .ctrl{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:14px}
  .ctrl .sep{flex:1 1 auto;min-width:0}
  .datas{display:flex;gap:7px;align-items:center;font-size:12px;color:var(--muted);flex-wrap:wrap}
  .datas input{font:inherit;font-size:12px;padding:6px 9px;border:1px solid var(--line);
    border-radius:8px;color:var(--ink);background:var(--card);max-width:150px}
  .cbody[hidden]{display:none}
  .resumo{font-size:12px;color:var(--muted);margin-bottom:12px;line-height:1.7}
  .resumo b{color:var(--ink);font-family:var(--disp)}
  .tw{overflow-x:auto;max-width:100%}
  table{width:100%;border-collapse:collapse;font-size:13px;min-width:640px}
  th{text-align:left;color:var(--muted);font-weight:500;font-size:10.5px;text-transform:uppercase;
    letter-spacing:.04em;padding:0 10px 9px;border-bottom:1px solid var(--line);white-space:nowrap}
  th.n,td.n{text-align:right;font-variant-numeric:tabular-nums}
  td{padding:10px;border-bottom:1px solid var(--line);white-space:nowrap}
  tr:last-child td{border-bottom:none}
  td.n{font-family:var(--disp);font-weight:600}
  tr.peak td{background:var(--soft)}
  .pill{display:inline-flex;align-items:center;gap:6px;font-size:11px;padding:3px 9px;
    border-radius:999px;white-space:nowrap}
  .pill.yes{background:var(--soft);color:var(--brand);border:1px solid var(--line)}
  .pill.no{background:#F1F5F6;color:var(--muted2)}
  .cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,164px),1fr));gap:10px}
  .dcard{border:1px solid var(--line);border-radius:12px;padding:11px 12px;background:var(--card);min-width:0}
  .dcard.hit{background:var(--soft)}
  .dcard .d1{display:flex;align-items:center;justify-content:space-between;gap:6px;font-size:11.5px;color:var(--muted)}
  .dcard .dv{font-family:var(--disp);font-weight:700;font-size:18px;margin:5px 0 2px;letter-spacing:-.02em}
  .dcard .d2{font-size:10.5px;color:var(--muted2);display:flex;justify-content:space-between;gap:5px;
    padding-top:6px;margin-top:6px;border-top:1px solid var(--line)}
  .dcard .dot{width:7px;height:7px;border-radius:50%;background:var(--accent);flex:0 0 auto}
  .bars{display:flex;flex-direction:column;gap:6px}
  .brow{display:grid;grid-template-columns:48px minmax(0,1fr) 96px;gap:9px;align-items:center;font-size:12.5px}
  .brow .bn2{color:var(--muted);white-space:nowrap}
  .brow.hit .bn2{color:var(--ink);font-weight:600}
  .brow .bt{display:block;height:20px;background:#F0F5F6;border-radius:6px;overflow:hidden}
  .brow .bf{display:block;height:100%;border-radius:6px;min-width:2px;
    background:linear-gradient(90deg,var(--brand),var(--brand-lite));transition:width .6s cubic-bezier(.3,1,.4,1)}
  .brow.hit .bf{background:linear-gradient(90deg,var(--accent),var(--accent-lite))}
  .brow .bv{font-family:var(--disp);font-weight:600;text-align:right;color:var(--ink2);font-size:12px;white-space:nowrap}
  .vazio{color:var(--muted);font-size:13px;padding:26px 0;text-align:center}

  /* ---------- IA ---------- */
  .ia{background:linear-gradient(155deg,var(--deep),var(--deep2));color:#DCEFEF;border-radius:16px;
    padding:22px 25px;margin-top:13px;box-shadow:var(--sh);transition:background .45s ease}
  .ia .hd{display:flex;align-items:center;gap:11px;margin-bottom:14px;flex-wrap:wrap}
  .ia .sp{width:27px;height:27px;border-radius:9px;background:var(--brand);display:grid;place-items:center;flex:0 0 auto}
  .ia .sp svg{width:15px;height:15px;fill:#fff}
  .ia h3{font-family:var(--disp);font-weight:700;font-size:15px;color:#fff}
  .ia .mod{margin-left:auto;font-size:10.5px;color:#7fa9ab;border:1px solid rgba(255,255,255,.14);
    padding:4px 10px;border-radius:999px;white-space:nowrap}
  .ia p.t{font-size:13.5px;color:#eafcfc;max-width:82ch;margin-bottom:15px;line-height:1.65}
  .ia .cols{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}
  .ia h4{font-family:var(--disp);font-weight:600;font-size:11.5px;color:var(--brand-lite);
    text-transform:uppercase;letter-spacing:.05em;margin-bottom:9px}
  .ia ul{list-style:none}
  .ia li{font-size:12.5px;color:#cfe6e6;padding:5px 0 5px 19px;position:relative;line-height:1.55}
  .ia li::before{content:"";position:absolute;left:2px;top:11px;width:6px;height:6px;border-radius:2px;background:var(--brand-lite)}
  .ia .box{font-size:13px;color:#eafcfc;padding:12px 14px;border-radius:0 9px 9px 0;line-height:1.6}
  .ia .box.a{background:rgba(242,169,59,.13);border-left:3px solid var(--accent)}
  .ia .box.b{background:rgba(255,255,255,.07);border-left:3px solid var(--brand)}

  /* ---------- rodape ---------- */
  .selo{margin-top:26px;padding:18px 0 4px;border-top:1px solid var(--line);
    display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}
  .selo .p{font-family:var(--disp);font-weight:600;font-size:12px;color:var(--ink2);
    display:inline-flex;align-items:center;gap:8px}
  .selo .p .d{width:5px;height:5px;border-radius:50%;background:var(--brand)}
  .selo .f{font-size:11px;color:var(--muted2);line-height:1.7}
  .carregando{color:var(--muted);font-size:13px;padding:60px 0;text-align:center}

  @media(max-width:1280px){ .kpis{grid-template-columns:repeat(4,minmax(0,1fr))} }
  @media(max-width:1080px){
    .bn{grid-template-columns:repeat(2,minmax(0,1fr))}
    .r-2,.r-3,.r-72-28{grid-template-columns:minmax(0,1fr)}
    .ia .cols{grid-template-columns:minmax(0,1fr)}
    .kpis{grid-template-columns:repeat(3,minmax(0,1fr))}
  }
  @media(max-width:620px){
    .wrap{padding:0 15px 34px}
    .kpis{grid-template-columns:repeat(2,minmax(0,1fr))}
    .bn .v{font-size:23px}
    .week{height:118px} .track{height:120px} .wbars{height:160px}
    .brow{grid-template-columns:42px minmax(0,1fr) 84px}
    .trilho{animation-duration:30s}
  }
  @media(prefers-reduced-motion:reduce){
    .trilho{animation:none} .tela{transition:none}
    .wcol .wbar,.wd .b,.brow .bf,.vs .f,.pl .f{transition:none}
  }
  `;

  // =====================================================================
  function boot() {
    if (document.getElementById("painel-supertroco-host")) return;
    var host = document.createElement("div");
    host.id = "painel-supertroco-host";
    var slot = document.getElementById("painel-supertroco");
    if (slot) { slot.appendChild(host); } else { document.body.appendChild(host); }
    var root = host.attachShadow({ mode: "open" });
    root.innerHTML = "<style>" + CSS + "</style>" +
      '<div class="app"><div class="wrap"><div class="tela on" id="tela">' +
      '<div class="carregando">Carregando hub&hellip;</div></div></div></div>';

    var D = null;
    var estado = { tela: "hub", parceiro: null, aba: "geral",
                   janela: "tudo", modo: "tabela", gran: "", de: "", ate: "", aberto: true };

    var $ = function (id) { return root.getElementById(id); };
    var app = root.querySelector(".app");
    var tela = $("tela");

    // ---------- formato ----------
    function nf(n, c) {
      return Number(n || 0).toLocaleString("pt-BR",
        { minimumFractionDigits: c || 0, maximumFractionDigits: c || 0 });
    }
    function moeda(n, c) { return "R$ " + nf(n, c === undefined ? 0 : c); }
    function curto(n) {
      n = Number(n || 0);
      if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
      if (n >= 1e3) return (n / 1e3).toFixed(n >= 1e4 ? 0 : 1) + "k";
      return nf(n);
    }
    function esc(s) {
      return String(s === null || s === undefined ? "" : s)
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
    // A IA usa <b> para destacar numeros: escapamos tudo e devolvemos so o <b>.
    function rich(s) {
      return esc(s).replace(/&lt;b&gt;/g, "<b>").replace(/&lt;\/b&gt;/g, "</b>");
    }
    function guardar(c, v) { try { localStorage.setItem("hub-" + c, v); } catch (e) { /* privado */ } }
    function ler(c) { try { return localStorage.getItem("hub-" + c); } catch (e) { return null; } }

    function parceiroAtual() {
      var achou = null;
      D.parceiros.forEach(function (p) { if (p.id === estado.parceiro) achou = p; });
      return achou;
    }
    function abaAtual(p) {
      var achou = null;
      p.abas.forEach(function (a) { if (a.id === estado.aba) achou = a; });
      return achou || p.abas[0];
    }

    // Aplica a paleta da marca. O hub usa a da Supertroco (Sorte Online).
    var TEMA_HUB = { brand: "#15B8B6", "brand-lite": "#5DD9D7", deep: "#0C3035",
                     deep2: "#0A2429", accent: "#F2A93B", "accent-lite": "#FFD479",
                     bg: "#EEF4F5", soft: "#F5FBFA", ink: "#123A41", line: "#E2ECEE" };
    function aplicarTema(cores) {
      var mapa = cores || TEMA_HUB;
      Object.keys(mapa).forEach(function (k) {
        app.style.setProperty("--" + k.replace(/_/g, "-"), mapa[k]);
      });
    }

    // ---------- troca de tela com fade ----------
    function trocar(montar) {
      tela.classList.remove("on");
      setTimeout(function () {
        montar();
        tela.scrollIntoView({ behavior: "smooth", block: "start" });
        requestAnimationFrame(function () { tela.classList.add("on"); });
      }, 300);
    }

    var ESTRELA = '<svg viewBox="0 0 24 24"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z"/></svg>';
    var TREVO = '<svg viewBox="0 0 40 40"><g fill="var(--brand-lite)"><circle cx="20" cy="12" r="7"/>' +
      '<circle cx="12" cy="20" r="7"/><circle cx="28" cy="20" r="7"/><circle cx="20" cy="28" r="7"/></g>' +
      '<circle cx="20" cy="20" r="4" fill="var(--deep)"/></svg>';

    function rodape() {
      return '<div class="selo"><span class="p"><span class="d"></span>' +
        esc(D.rodape || "Powered by Tibério Ferreira for Supertroco") + '</span>' +
        '<span class="f">Dados de RD Station (envios) e dos parceiros (vendas) · ' +
        'publicado automaticamente · nenhuma chave de API fica exposta nesta página.</span></div>';
    }

    // =================================================================
    // TELA 1 — HUB
    // =================================================================
    function esteira() {
      var itens = (D.hub.ticker || []).map(function (t) {
        var d = "";
        if (t.var !== undefined && t.var !== null) {
          var seta = t.var > 0 ? "▲" : t.var < 0 ? "▼" : "•";
          d = '<span class="d ' + esc(t.tipo || "neutro") + '">' + seta + " " +
            nf(Math.abs(t.var), 1) + "%</span>";
        }
        return '<span class="tk">' +
          (t.cor ? '<span class="p" style="background:' + esc(t.cor) + '"></span>' : '') +
          '<span class="r">' + esc(t.rot) + '</span>' +
          '<span class="v">' + esc(t.val) + '</span>' + d + '</span>';
      }).join("");
      // Duplicamos a fila para o laco da animacao nao mostrar emenda.
      return '<div class="ticker"><div class="trilho">' + itens + itens + '</div></div>';
    }

    function telaHub() {
      aplicarTema(null);
      var h = D.hub, k = h.kpis;

      var topo = '<div class="topo"><div class="marca"><span class="sig">' + TREVO + '</span>' +
        '<div><h1>Hub de Parceiros</h1>' +
        '<div class="sub">Supertroco · ' + h.parceiros + ' parcerias ativas</div></div></div>' +
        '<div class="dir"><span class="chip">' + esc(h.periodo) + '</span>' +
        '<span class="chip live">Atualizado <b style="margin-left:4px">' +
        esc(D.atualizado) + '</b></span></div></div>';

      var grandes = [
        ["Receita gerada", moeda(k.vendas), h.periodo, true],
        ["Comissão Supertroco", moeda(k.comissao), "somando as taxas de cada parceria", true],
        ["Aquisições", nf(k.aquisicoes), "novos usuários no período", false],
        ["CAC médio", moeda(k.cac, 2), "comissão ÷ aquisições", false],
        ["Pedidos", nf(k.pedidos), "no período", false],
        ["Ticket médio", moeda(k.tkm, 2), "receita ÷ pedidos", false],
        ["Campanhas", nf(k.campanhas), curto(k.entregues) + " e-mails entregues", false],
        ["Conversão", nf(k.conversao, 2) + "%", "pedidos ÷ sessões", false]
      ];
      var bn = '<div class="bn">' + grandes.map(function (g) {
        return '<div class="c' + (g[3] ? " destaque" : "") + '">' +
          '<div class="r">' + esc(g[0]) + '</div><div class="v">' + esc(g[1]) + '</div>' +
          '<div class="s">' + esc(g[2]) + '</div></div>';
      }).join("") + '</div>';

      var maxF = Math.max.apply(null, h.participacao.map(function (p) { return p.vendas; })) || 1;
      var part = '<div class="painel"><h3>Participação na receita</h3>' +
        '<div class="cap">Quanto cada parceria representa do total gerado no período</div>' +
        '<div class="part">' + h.participacao.map(function (p) {
          return '<div class="pl"><div class="h"><span>' + esc(p.nome) + '</span>' +
            '<b>' + moeda(p.vendas) + ' · ' + nf(p.fatia, 1) + '%</b></div>' +
            '<span class="t"><span class="f" style="width:' +
            Math.max(1.5, p.vendas / maxF * 100).toFixed(1) + '%;background:' +
            esc(p.cor) + '"></span></span></div>';
        }).join("") + '</div></div>';

      var cards = '<div class="painel"><h3>Abrir um CRM</h3>' +
        '<div class="cap">Cada parceria tem o painel completo, com o tema da marca</div>' +
        '<div class="parc" style="margin-top:14px">' + D.parceiros.map(function (p) {
          var g = p.abas[0], kp = g.kpis;
          return '<button class="pc" data-parceiro="' + esc(p.id) + '">' +
            '<span class="faixa" style="background:linear-gradient(90deg,' +
            esc(p.cores.brand) + ',' + esc(p.cores.brand_lite) + ')"></span>' +
            '<span class="corpo"><span class="cab">' +
            '<span class="ini" style="background:' + esc(p.cores.brand) + '">' +
            esc(p.nome.charAt(0)) + '</span><span><span class="nm">' + esc(p.nome) + '</span>' +
            '<span class="sg" style="display:block">' + esc(p.segmento) + '</span></span></span>' +
            '<span class="grid">' +
            '<span class="gi"><span class="r">Receita</span><span class="v">' + moeda(kp.vendas) + '</span></span>' +
            '<span class="gi"><span class="r">Comissão</span><span class="v">' + moeda(kp.comissao) + '</span></span>' +
            '<span class="gi"><span class="r">Pedidos</span><span class="v">' + nf(kp.pedidos) + '</span></span>' +
            '<span class="gi"><span class="r">CAC</span><span class="v">' + moeda(kp.cac, 2) + '</span></span>' +
            '</span><span class="rodape">' +
            (p.ficticio ? '<span class="selo">dados de teste</span>'
                        : '<span>' + nf(p.taxa_comissao * 100, 0) + '% de comissão</span>') +
            '<span class="abrir" style="color:' + esc(p.cores.brand) + '">Abrir' +
            '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>' +
            '</span></span></button>';
        }).join("") + '</div></div>';

      var ia = D.hub.ia || {};
      var alertas = (ia.alertas || []).map(function (x) { return "<li>" + rich(x) + "</li>"; }).join("");
      var blocoIA = ia.destaque || ia.comparativo ? '<div class="ia">' +
        '<div class="hd"><span class="sp">' + ESTRELA + '</span>' +
        '<h3>Leitura comparativa do agente</h3>' +
        '<span class="mod">Groq · gpt-oss-120b</span></div>' +
        (ia.destaque ? '<p class="t">' + rich(ia.destaque) + '</p>' : '') +
        (ia.comparativo ? '<div class="box b" style="margin-bottom:15px">' +
          rich(ia.comparativo) + '</div>' : '') +
        '<div class="cols"><div><h4>Pontos de atenção</h4><ul>' + alertas + '</ul></div>' +
        '<div><h4>Onde focar no próximo ciclo</h4>' +
        '<div class="box a">' + rich(ia.prioridade || "") + '</div></div></div></div>' : '';

      tela.innerHTML = topo + esteira() + bn +
        '<div class="row">' + cards + '</div>' +
        '<div class="row">' + part + '</div>' + blocoIA + rodape();

      root.querySelectorAll(".pc").forEach(function (b) {
        b.addEventListener("click", function () {
          estado.parceiro = b.getAttribute("data-parceiro");
          estado.tela = "parceiro";
          estado.aba = "geral"; estado.gran = ""; estado.janela = "tudo";
          estado.de = ""; estado.ate = "";
          guardar("tela", estado.parceiro);
          trocar(telaParceiro);
        });
      });
    }

    // =================================================================
    // TELA 2 — CRM DO PARCEIRO
    // =================================================================
    function blocoKpis(aba) {
      var k = aba.kpis;
      var parcial = (k.dias_com_sessao !== undefined && k.dias_com_sessao < k.dias_ativos)
        ? "base parcial: " + k.dias_com_sessao + " de " + k.dias_ativos + " dias com sessão"
        : null;
      // Com base parcial o numerador e MENOR que o card "Pedidos" ao lado.
      // "310 dos 476" deixa a relacao explicita.
      var conta = k.pedidos_com_sessao === undefined ? "pedidos ÷ sessões"
        : parcial ? nf(k.pedidos_com_sessao) + " dos " + nf(k.pedidos) + " pedidos ÷ " + nf(k.sessoes) + " sessões"
                  : nf(k.pedidos_com_sessao) + " pedidos ÷ " + nf(k.sessoes) + " sessões";
      var camp = (aba.email && aba.email.envios)
        ? aba.email.envios + " campanhas no período" : "campanhas do parceiro";

      var defs = [
        ["so", "Vendas", moeda(k.vendas), aba.periodo, true],
        ["so", "Comissão", moeda(k.comissao), "no período", true],
        ["so", "Aquisições", nf(k.aquisicoes), "novos usuários", true],
        ["so", "CAC", moeda(k.cac, 2), "comissão ÷ aquisições", true],
        ["so", "Pedidos", nf(k.pedidos), "no período", true],
        ["so", "Ticket médio", moeda(k.tkm, 2), "vendas ÷ pedidos", false],
        ["so", "Conversão", nf(k.conversao, 2) + "%", conta, false, parcial],
        ["so", "Sessões", nf(k.sessoes),
         parcial ? "visitas em " + k.dias_com_sessao + " dos " + k.dias_ativos + " dias"
                 : "visitas ao site", false, parcial],
        ["rd", "Abertura média", nf(k.abertura || 0, 1) + "%", camp, false],
        ["rd", "CTR médio", nf(k.ctr || 0, 2) + "%", "cliques ÷ entregues", false]
      ];
      return '<div class="kpis">' + defs.map(function (d) {
        return '<div class="kpi' + (d[4] ? " star" : "") + '" title="' +
          esc(d[1] + ": " + d[2] + " — " + d[3] + (d[5] ? " (" + d[5] + ")" : "")) + '">' +
          '<div class="top"><span class="lbl">' + esc(d[1]) + '</span>' +
          '<span class="src ' + d[0] + '"></span></div>' +
          '<div class="v">' + esc(d[2]) + '</div><div class="sub">' + esc(d[3]) + '</div>' +
          (d[5] ? '<div class="alerta">' + esc(d[5]) + '</div>' : '') + '</div>';
      }).join("") + '</div>';
    }

    function porSemana(dias) {
      var grupos = [], atual = null;
      dias.forEach(function (d) {
        var dt = new Date(d.iso + "T00:00:00");
        var seg = new Date(dt);
        seg.setDate(dt.getDate() - ((dt.getDay() + 6) % 7));
        var chave = seg.getFullYear() + "-" + (seg.getMonth() + 1) + "-" + seg.getDate();
        if (!atual || atual.chave !== chave) {
          atual = { chave: chave, ini: d.d, fim: d.d, vendas: 0, pedidos: 0, novos: 0, envios: 0 };
          grupos.push(atual);
        }
        atual.fim = d.d;
        atual.vendas += d.vendas; atual.pedidos += d.pedidos; atual.novos += d.novos;
        if (d.send) atual.envios++;
      });
      return grupos;
    }

    function faixaCurta(a, b) {
      var x = String(a).split("/"), y = String(b).split("/");
      return x[1] === y[1] ? x[0] + "–" + y[0] + "/" + y[1] : a + "–" + b;
    }

    function graficoSemana(dias) {
      var s = porSemana(dias);
      var mx = Math.max.apply(null, s.map(function (x) { return x.vendas; })) || 1;
      return '<div class="wbars">' + s.map(function (x) {
        var dica = x.ini + " a " + x.fim + " · " + moeda(x.vendas) + " · " + x.pedidos +
          " pedidos" + (x.envios ? " · " + x.envios + " dia(s) com disparo" : "");
        return '<div class="wcol" title="' + esc(dica) + '">' +
          (x.envios ? '<span class="wdot"></span>' : '') +
          '<span class="wv">' + esc(curto(x.vendas)) + '</span>' +
          '<div class="wbar" style="height:' + Math.max(4, x.vendas / mx * 100).toFixed(1) + '%"></div>' +
          '<span class="wl">' + esc(faixaCurta(x.ini, x.fim)) + '</span></div>';
      }).join("") + '</div>';
    }

    function graficoDia(dias) {
      var W = 760, H = 220, pl = 48, pr = 10, pt = 16, pb = 28;
      var iw = W - pl - pr, ih = H - pt - pb;
      var mx = Math.max.apply(null, dias.map(function (d) { return d.vendas; })) || 1;
      var n = dias.length;
      var X = function (i) { return n === 1 ? pl + iw / 2 : pl + iw * i / (n - 1); };
      var Y = function (v) { return pt + ih * (1 - v / mx); };

      var grade = "";
      [1, 0.5, 0].forEach(function (f) {
        var y = Y(mx * f);
        grade += '<line class="gline" x1="' + pl + '" y1="' + y.toFixed(1) + '" x2="' +
          (W - pr) + '" y2="' + y.toFixed(1) + '"/><text class="glabel" x="' + (pl - 8) +
          '" y="' + (y + 3.5).toFixed(1) + '" text-anchor="end">' + esc(curto(mx * f)) + '</text>';
      });
      var pts = dias.map(function (d, i) { return X(i).toFixed(1) + "," + Y(d.vendas).toFixed(1); });
      var linha = "M" + pts.join(" L");
      var area = linha + " L" + X(n - 1).toFixed(1) + "," + (pt + ih) +
        " L" + X(0).toFixed(1) + "," + (pt + ih) + " Z";

      var zonas = "";
      dias.forEach(function (d, i) {
        var dica = d.d + " · " + moeda(d.vendas) + " · " + d.pedidos + " pedidos · " +
          d.novos + " aquisições" + (d.send ? " · " + d.send : "");
        zonas += '<g><rect class="hitzone" x="' + (X(i) - iw / n / 2).toFixed(1) + '" y="' + pt +
          '" width="' + Math.max(4, iw / n).toFixed(1) + '" height="' + ih +
          '"><title>' + esc(dica) + '</title></rect><circle class="pt' + (d.send ? " hit" : "") +
          '" cx="' + X(i).toFixed(1) + '" cy="' + Y(d.vendas).toFixed(1) + '" r="' +
          (d.send ? 4.5 : (n > 25 ? 0 : 3)) + '"/></g>';
      });
      var passo = Math.max(1, Math.ceil(n / 8)), rot = "";
      dias.forEach(function (d, i) {
        if (i % passo === 0 || i === n - 1) {
          rot += '<text class="xlabel" x="' + X(i).toFixed(1) + '" y="' + (H - 8) + '">' +
            esc(d.d) + '</text>';
        }
      });
      return '<div class="chart"><svg viewBox="0 0 ' + W + " " + H + '" role="img" ' +
        'aria-label="Vendas por dia"><defs><linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="currentColor" stop-opacity="0.28"/>' +
        '<stop offset="100%" stop-color="currentColor" stop-opacity="0.02"/></linearGradient></defs>' +
        grade + '<path d="' + area + '" fill="url(#gA)" style="color:var(--brand)"/>' +
        '<path class="lpath" d="' + linha + '"/>' + zonas + rot + '</svg></div>';
    }

    function blocoVendas(aba) {
      if (!aba.dias.length) return "";
      if (!estado.gran) estado.gran = aba.dias.length > 14 ? "semana" : "dia";
      var op = [["semana", "Por semana"], ["dia", "Dia a dia"]];
      return '<div class="row r-72-28"><div class="painel">' +
        '<div class="hrow"><div><h3>Vendas &times; envios de campanha</h3>' +
        '<div class="cap">Receita do parceiro; períodos com disparo marcados em destaque</div></div>' +
        '<div class="seg" id="seg-gran">' + op.map(function (o) {
          return '<button data-g="' + o[0] + '"' + (estado.gran === o[0] ? ' class="on"' : '') +
            '>' + esc(o[1]) + '</button>';
        }).join("") + '</div></div><div id="grafico"></div>' +
        '<div class="legenda"><span><i style="background:var(--brand)"></i>Vendas</span>' +
        '<span><i style="background:var(--accent);border-radius:50%"></i>Houve disparo</span>' +
        '<span>' + aba.dias.length + ' dias no período</span></div></div>' +
        blocoMotor(aba) + '</div>';
    }

    function blocoMotor(aba) {
      var e = aba.email;
      if (!e) return '<div class="painel"><h3>Motor do resultado</h3>' +
        '<div class="cap">Sem campanhas neste período</div></div>';
      var mx = Math.max(e.engajado.ab, e.deseng.ab) || 1;
      var fator = e.deseng.ab ? (e.engajado.ab / e.deseng.ab).toFixed(0) : "—";
      var txt = (aba.ia && aba.ia.motor) ? rich(aba.ia.motor)
        : "A base engajada abre <b>~" + fator + "&times; mais</b> que a base fria.";
      return '<div class="painel"><h3>Motor do resultado</h3>' +
        '<div class="cap">Abertura média por tipo de base<br>' + esc(e.envios) +
        ' campanhas · ' + esc(e.periodo) + '</div><div class="versus" style="margin-top:14px">' +
        '<div class="vs"><div class="h"><span>Base engajada</span><b>' + nf(e.engajado.ab, 2) +
        '%</b></div><span class="t"><span class="f eng" style="width:' +
        (e.engajado.ab / mx * 100).toFixed(1) + '%"></span></span></div>' +
        '<div class="vs"><div class="h"><span>Base desengajada / total</span><b>' +
        nf(e.deseng.ab, 2) + '%</b></div><span class="t"><span class="f des" style="width:' +
        Math.max(4, e.deseng.ab / mx * 100).toFixed(1) + '%"></span></span></div>' +
        '<div class="tagbox">' + txt + '</div></div></div>';
    }

    function cartaoSemana(e) {
      var por = {};
      (e.dias || []).forEach(function (d) { por[d[0]] = { v: d[1], n: d[2] }; });
      var vals = SEMANA.map(function (s) { return (por[s] || {}).v || 0; });
      var mx = Math.max.apply(null, vals) || 1, melhor = vals.indexOf(mx);
      return '<div class="painel"><h3>Melhor dia para abrir</h3>' +
        '<div class="cap">Abertura média por dia da semana · ' + esc(e.envios) + ' campanhas</div>' +
        '<div class="week" style="margin-top:14px">' + SEMANA.map(function (s, i) {
          var info = por[s] || { v: 0, n: 0 };
          return '<div class="wd ' + (info.v ? "has " : "") +
            (i === melhor && info.v ? "best" : "") + '" title="' +
            esc(s + (info.n ? " · " + info.n + " envios" : " · sem envios")) + '">' +
            '<span class="v">' + (info.v ? nf(info.v, 1) + "%" : "&mdash;") + '</span>' +
            '<div class="b" style="height:' + (info.v ? Math.max(8, info.v / mx * 100) : 4) + '%"></div>' +
            '<span class="n">' + esc(CURTA[s]) + '</span></div>';
        }).join("") + '</div><div class="legenda"><span>Melhor: <b>' +
        esc(vals[melhor] ? SEMANA[melhor] : "—") + '</b></span></div></div>';
    }

    function cartaoHorario(e) {
      var hs = e.horarios || [];
      if (!hs.length) return '<div class="painel"><h3>Melhor horário para clicar</h3>' +
        '<div class="vazio">Sem dados</div></div>';
      var ordem = ["00h–09h", "09h–12h", "12h–15h", "15h–18h", "18h–24h"];
      var por = {}; hs.forEach(function (h) { por[h[0]] = { v: h[1], n: h[2] }; });
      var mx = Math.max.apply(null, hs.map(function (h) { return h[1]; })) || 1;
      var top = hs[0];
      return '<div class="painel"><h3>Melhor horário para clicar</h3>' +
        '<div class="cap">CTR médio por faixa do dia</div>' +
        '<div class="track" style="margin-top:14px">' + ordem.map(function (f) {
          var i = por[f];
          if (!i) return '<div class="slot"><span class="v">&mdash;</span>' +
            '<span class="n">' + esc(f) + '</span></div>';
          return '<div class="slot ' + (f === top[0] ? "best" : "") + '" title="' +
            esc(f + " · " + i.n + " envios") + '">' +
            '<div class="fill" style="height:' + Math.max(12, i.v / mx * 100).toFixed(1) + '%"></div>' +
            '<span class="v">' + nf(i.v, 2) + '%</span><span class="n">' + esc(f) + '</span></div>';
        }).join("") + '</div><div class="hbest"><b>' + nf(top[1], 2) + '%</b>' +
        '<span>na faixa ' + esc(top[0]) + ' · ' + esc(top[2]) + ' envios</span></div></div>';
    }

    function cartaoFunil(e) {
      var f = e.funil, base = f.entregues || 1;
      var et = [{ n: "Entregues", v: f.entregues, p: 100 },
                { n: "Aberturas", v: f.aberturas, p: f.aberturas / base * 100 },
                { n: "Cliques", v: f.cliques, p: f.cliques / base * 100 }];
      // Largura pela raiz da proporcao: na escala crua os dois ultimos estagios
      // batem no mesmo piso e saem identicos.
      var larg = et.map(function (s) { return Math.max(6, Math.sqrt(s.p / 100) * 100); });
      var W = 200, H = 150, faixa = H / et.length, vao = 6;
      var cores = ["var(--brand)", "var(--brand-lite)", "var(--accent)"];
      var formas = et.map(function (s, i) {
        var y0 = i * faixa, y1 = y0 + faixa - vao;
        var w0 = larg[i] / 100 * W, w1 = (i + 1 < larg.length ? larg[i + 1] : larg[i] * 0.8) / 100 * W;
        var x0 = (W - w0) / 2, x1 = (W - w1) / 2;
        return '<polygon points="' + x0.toFixed(1) + "," + y0.toFixed(1) + " " +
          (x0 + w0).toFixed(1) + "," + y0.toFixed(1) + " " + (x1 + w1).toFixed(1) + "," +
          y1.toFixed(1) + " " + x1.toFixed(1) + "," + y1.toFixed(1) + '" fill="' + cores[i] +
          '"><title>' + esc(s.n + ": " + nf(s.v)) + '</title></polygon>';
      }).join("");
      var rot = et.map(function (s, i) {
        var passo = "";
        if (i > 0) {
          var c = s.v / (et[i - 1].v || 1) * 100;
          passo = '<span class="fp">' + nf(c, c < 1 ? 2 : 1) + '% do anterior</span>';
        }
        return '<div class="fstat"><span>' + esc(s.n) + passo + '</span>' +
          '<span class="fv">' + esc(curto(s.v)) + '</span></div>';
      }).join("");
      return '<div class="painel"><h3>Funil de e-mail</h3>' +
        '<div class="cap">Consolidado do período · escala suavizada</div>' +
        '<div class="funil"><svg viewBox="0 0 ' + W + " " + H + '" ' +
        'preserveAspectRatio="xMidYMid meet" role="img" aria-label="Funil de e-mail">' +
        formas + '</svg></div>' + rot + '</div>';
    }

    function diasFiltrados(aba) {
      var dias = aba.dias.slice();
      if (!dias.length) return dias;
      if (estado.janela === "custom") {
        return dias.filter(function (d) {
          return (!estado.de || d.iso >= estado.de) && (!estado.ate || d.iso <= estado.ate);
        });
      }
      var n = parseInt(estado.janela, 10);
      if (!n) return dias;
      return dias.slice(Math.max(0, dias.length - n));   // a partir do ultimo dia COM dado
    }

    function blocoCross() {
      var janelas = [["3", "3 dias"], ["7", "7 dias"], ["30", "30 dias"],
                     ["tudo", "Tudo"], ["custom", "Personalizado"]];
      var modos = [["tabela", "Tabela"], ["cartoes", "Cartões"], ["grafico", "Gráfico"]];
      return '<div class="row"><div class="painel">' +
        '<div class="hrow"><div><h3>Cruzamento diário</h3>' +
        '<div class="cap">Cada dia de venda ao lado do disparo correspondente</div></div>' +
        '<button class="btn" id="bt-toggle"><svg viewBox="0 0 24 24"><path d="' +
        (estado.aberto ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6") + '"/></svg>' +
        (estado.aberto ? "Ocultar" : "Mostrar") + '</button></div>' +
        '<div class="cbody" id="cbody"' + (estado.aberto ? "" : " hidden") + '>' +
        '<div class="ctrl"><div class="seg" id="seg-janela">' + janelas.map(function (j) {
          return '<button data-j="' + j[0] + '"' + (estado.janela === j[0] ? ' class="on"' : '') +
            '>' + esc(j[1]) + '</button>';
        }).join("") + '</div>' +
        (estado.janela === "custom"
          ? '<div class="datas">de <input type="date" id="dt-de" value="' + esc(estado.de) +
            '">até <input type="date" id="dt-ate" value="' + esc(estado.ate) + '"></div>' : '') +
        '<div class="sep"></div><div class="seg" id="seg-modo">' + modos.map(function (m) {
          return '<button data-m="' + m[0] + '"' + (estado.modo === m[0] ? ' class="on"' : '') +
            '>' + esc(m[1]) + '</button>';
        }).join("") + '</div></div><div id="cross"></div></div></div></div>';
    }

    function pintarCross(aba) {
      var alvo = $("cross");
      if (!alvo) return;
      var dias = diasFiltrados(aba);
      if (!dias.length) {
        alvo.innerHTML = '<div class="vazio">Nenhum dia no período selecionado.</div>';
        return;
      }
      var s = dias.reduce(function (a, d) {
        a.v += d.vendas; a.c += d.comissao; a.p += d.pedidos; a.n += d.novos; return a;
      }, { v: 0, c: 0, p: 0, n: 0 });
      var disparos = dias.filter(function (d) { return d.send; }).length;
      var resumo = '<div class="resumo"><b>' + dias.length + '</b> dias · vendas <b>' +
        moeda(s.v) + '</b> · comissão <b>' + moeda(s.c, 2) + '</b> · pedidos <b>' + nf(s.p) +
        '</b> · aquisições <b>' + nf(s.n) + '</b> · <b>' + disparos + '</b> dia(s) com disparo</div>';

      var mx = Math.max.apply(null, dias.map(function (d) { return d.vendas; })) || 1;
      var corpo;
      if (estado.modo === "tabela") {
        corpo = '<div class="tw"><table><thead><tr><th>Dia</th><th class="n">Vendas (R$)</th>' +
          '<th class="n">Comissão</th><th class="n">Pedidos</th><th class="n">Aquisições</th>' +
          '<th class="n">Ticket</th><th class="n">Conversão</th><th>Disparo no dia</th></tr></thead><tbody>' +
          dias.map(function (d) {
            return '<tr class="' + (d.vendas === mx ? "peak" : "") + '"><td>' + esc(d.d) + '</td>' +
              '<td class="n">' + nf(d.vendas) + '</td><td class="n">' + nf(d.comissao, 2) + '</td>' +
              '<td class="n">' + nf(d.pedidos) + '</td><td class="n">' + nf(d.novos) + '</td>' +
              '<td class="n">' + nf(d.tkm, 2) + '</td>' +
              '<td class="n">' + (d.conv === null ? "&mdash;" : nf(d.conv, 2) + "%") + '</td>' +
              '<td>' + (d.send ? '<span class="pill yes">' + esc(d.send) + '</span>'
                               : '<span class="pill no">sem disparo</span>') + '</td></tr>';
          }).join("") + '</tbody></table></div>';
      } else if (estado.modo === "cartoes") {
        corpo = '<div class="cards">' + dias.map(function (d) {
          return '<div class="dcard ' + (d.send ? "hit" : "") + '"' +
            (d.send ? ' title="' + esc(d.send) + '"' : '') + '>' +
            '<div class="d1"><span>' + esc(d.d) + '</span>' +
            (d.send ? '<span class="dot"></span>' : '') + '</div>' +
            '<div class="dv">' + moeda(d.vendas) + '</div>' +
            '<div class="d1" style="font-size:10.5px">comissão ' + moeda(d.comissao, 2) + '</div>' +
            '<div class="d2"><span>' + d.pedidos + ' ped.</span><span>' + d.novos + ' aquis.</span>' +
            '<span>' + (d.conv === null ? "&mdash;" : nf(d.conv, 1) + "%") + '</span></div></div>';
        }).join("") + '</div>';
      } else {
        corpo = '<div class="bars">' + dias.map(function (d) {
          return '<div class="brow ' + (d.send ? "hit" : "") + '"' +
            (d.send ? ' title="' + esc(d.send) + '"' : '') + '>' +
            '<div class="bn2">' + esc(d.d) + '</div><div class="bt"><div class="bf" style="width:' +
            Math.max(1, d.vendas / mx * 100).toFixed(1) + '%"></div></div>' +
            '<div class="bv">' + moeda(d.vendas) + '</div></div>';
        }).join("") + '</div>';
      }
      alvo.innerHTML = resumo + corpo;
    }

    function blocoIA(aba, p) {
      var ia = aba.ia || {};
      if (!ia.diagnostico && !ia.motor) return "";
      var sust = (ia.sustenta || []).map(function (x) { return "<li>" + rich(x) + "</li>"; }).join("");
      return '<div class="ia"><div class="hd"><span class="sp">' + ESTRELA + '</span>' +
        '<h3>Análise do agente — ' + esc(p.nome) + ' · ' + esc(aba.nome) + '</h3>' +
        '<span class="mod">Groq · gpt-oss-120b</span></div>' +
        '<p class="t">' + rich(ia.diagnostico || "") + '</p>' +
        (ia.conversao ? '<div class="box b" style="margin-bottom:15px"><b>Conversão e abertura:</b> ' +
          rich(ia.conversao) + '</div>' : '') +
        '<div class="cols"><div><h4>O que os dados sustentam</h4><ul>' + sust + '</ul></div>' +
        '<div><h4>Recomendação para o próximo ciclo</h4>' +
        '<div class="box a">' + rich(ia.recomendacao || "") + '</div></div></div></div>';
    }

    function telaParceiro() {
      var p = parceiroAtual();
      if (!p) { estado.tela = "hub"; return telaHub(); }
      aplicarTema(p.cores);
      var aba = abaAtual(p);

      var topo = '<div class="topo"><div class="marca">' +
        '<span class="sig" style="background:' + esc(p.cores.brand) + '">' +
        '<span style="font-family:var(--disp);font-weight:800;font-size:19px;color:#fff">' +
        esc(p.nome.charAt(0)) + '</span></span>' +
        '<div><h1>' + esc(p.nome) + '</h1><div class="sub">' + esc(p.segmento) +
        ' · ' + nf(p.taxa_comissao * 100, 0) + '% de comissão' +
        (p.ficticio ? ' · <b style="color:#9A6A12">dados de teste</b>' : '') + '</div></div></div>' +
        '<div class="dir"><button class="btn" id="voltar">' +
        '<svg viewBox="0 0 24 24"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>Todos os parceiros</button>' +
        '<span class="chip">' + esc(aba.periodo) + '</span>' +
        '<span class="chip live">Atualizado <b style="margin-left:4px">' +
        esc(D.atualizado) + '</b></span></div></div>';

      var abas = '<div class="abas">' + p.abas.map(function (a) {
        return '<button data-aba="' + esc(a.id) + '"' + (a.id === estado.aba ? ' class="on"' : '') +
          '>' + esc(a.nome) + '</button>';
      }).join("") + '</div>';

      var campanhas = aba.email
        ? '<div class="row r-3">' + cartaoSemana(aba.email) + cartaoHorario(aba.email) +
          cartaoFunil(aba.email) + '</div>' : "";

      tela.innerHTML = topo + abas + blocoKpis(aba) + blocoVendas(aba) + campanhas +
        blocoCross() + blocoIA(aba, p) + rodape();

      var g = $("grafico");
      if (g) g.innerHTML = estado.gran === "dia" ? graficoDia(aba.dias) : graficoSemana(aba.dias);
      pintarCross(aba);
      ligar(p, aba);
    }

    function ligar(p, aba) {
      var v = $("voltar");
      if (v) v.addEventListener("click", function () {
        estado.tela = "hub"; estado.parceiro = null;
        guardar("tela", "hub");
        trocar(telaHub);
      });

      root.querySelectorAll(".abas button").forEach(function (b) {
        b.addEventListener("click", function () {
          estado.aba = b.getAttribute("data-aba");
          estado.gran = ""; estado.janela = "tudo"; estado.de = ""; estado.ate = "";
          telaParceiro();
        });
      });

      root.querySelectorAll("#seg-gran button").forEach(function (b) {
        b.addEventListener("click", function () {
          estado.gran = b.getAttribute("data-g");
          guardar("gran", estado.gran);
          root.querySelectorAll("#seg-gran button").forEach(function (x) { x.classList.remove("on"); });
          b.classList.add("on");
          $("grafico").innerHTML = estado.gran === "dia" ? graficoDia(aba.dias) : graficoSemana(aba.dias);
        });
      });

      var bt = $("bt-toggle");
      if (bt) bt.addEventListener("click", function () {
        estado.aberto = !estado.aberto;
        guardar("aberto", estado.aberto ? "1" : "0");
        var c = $("cbody");
        if (c) c.hidden = !estado.aberto;
        bt.innerHTML = '<svg viewBox="0 0 24 24"><path d="' +
          (estado.aberto ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6") + '"/></svg>' +
          (estado.aberto ? "Ocultar" : "Mostrar");
      });

      root.querySelectorAll("#seg-janela button").forEach(function (b) {
        b.addEventListener("click", function () {
          estado.janela = b.getAttribute("data-j");
          guardar("janela", estado.janela);
          if (estado.janela === "custom" && !estado.de && aba.dias.length) {
            estado.de = aba.dias[Math.max(0, aba.dias.length - 7)].iso;
            estado.ate = aba.dias[aba.dias.length - 1].iso;
          }
          telaParceiro();
        });
      });

      root.querySelectorAll("#seg-modo button").forEach(function (b) {
        b.addEventListener("click", function () {
          estado.modo = b.getAttribute("data-m");
          guardar("modo", estado.modo);
          root.querySelectorAll("#seg-modo button").forEach(function (x) { x.classList.remove("on"); });
          b.classList.add("on");
          pintarCross(aba);
        });
      });

      var de = $("dt-de"), ate = $("dt-ate");
      if (de) de.addEventListener("change", function () { estado.de = de.value; pintarCross(aba); });
      if (ate) ate.addEventListener("change", function () { estado.ate = ate.value; pintarCross(aba); });
    }

    // =================================================================
    function iniciar(dados) {
      if (!dados || !dados.parceiros || !dados.parceiros.length) {
        throw new Error("hub.json sem parceiros");
      }
      D = dados;
      var modo = ler("modo"); if (modo) estado.modo = modo;
      var gran = ler("gran"); if (gran) estado.gran = gran;
      var jan = ler("janela"); if (jan && jan !== "custom") estado.janela = jan;
      if (ler("aberto") === "0") estado.aberto = false;

      var salva = ler("tela");
      if (salva && salva !== "hub" && D.parceiros.some(function (p) { return p.id === salva; })) {
        estado.tela = "parceiro"; estado.parceiro = salva;
        telaParceiro();
      } else {
        telaHub();
      }
      requestAnimationFrame(function () { tela.classList.add("on"); });
    }

    function falha(msg) {
      tela.innerHTML = '<div class="carregando">' + esc(msg) + '</div>';
      tela.classList.add("on");
    }
    function baixar(url) {
      return fetch(url, { cache: "no-store" }).then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      });
    }
    function render(dados) {
      try {
        iniciar(dados);
      } catch (err) {
        falha("Dados carregados, mas a montagem falhou: " + err.message);
        err.__render = true;
        throw err;
      }
    }
    baixar(HUB_URL).then(render).catch(function (e1) {
      if (e1 && e1.__render) return;
      baixar(HUB_URL_FALLBACK).then(render).catch(function (err) {
        if (err && err.__render) return;
        falha("Não foi possível carregar o hub (" + err.message + ").");
      });
    });
  }

  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", boot); }
  else { boot(); }
})();
