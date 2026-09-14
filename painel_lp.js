/* ===================================================================
   Painel Supertroco x Sorte Online  —  bloco para a LP da RD Station
   -------------------------------------------------------------------
   ONDE COLAR: nao cole este arquivo direto. Rode o gerar_painel.py e
   cole o conteudo de rd_javascript_body.html na aba "Javascript em
   BODY" da Edicao Avancada — la o codigo ja vai envolvido pelas tags de
   script, que e o que a RD exige.

   No modulo HTML da LP deve existir apenas: <div id="painel-supertroco"></div>

   O painel roda isolado (Shadow DOM) e le o dados.json publicado no
   GitHub pelo gerar_painel.py. Tudo e dinamico: abas de mes, periodos e
   datas nascem do arquivo de dados, sem nada fixo no codigo.
   =================================================================== */
(function () {
  "use strict";

  var DADOS_URL = "https://raw.githubusercontent.com/SupertrocoWeb/painel/main/dados.json";
  var DADOS_URL_FALLBACK = "https://cdn.jsdelivr.net/gh/SupertrocoWeb/painel@main/dados.json";

  if (!document.getElementById("pst-fonts")) {
    var lk = document.createElement("link");
    lk.id = "pst-fonts";
    lk.rel = "stylesheet";
    lk.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap";
    document.head.appendChild(lk);
  }

  var SEMANA = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
  var SEMANA_CURTA = { "Segunda": "Seg", "Terça": "Ter", "Quarta": "Qua", "Quinta": "Qui",
                       "Sexta": "Sex", "Sábado": "Sáb", "Domingo": "Dom" };

  var CSS = `
  :host{ all:initial; display:block; }
  *{box-sizing:border-box;margin:0;padding:0}
  .app{
    --brand:#15B8B6; --brand-lite:#5DD9D7; --brand-ink:#0B2D31; --brand-deep:#0C3035;
    --gold:#F2A93B; --gold-lite:#ffd479; --pos:#12A971; --neg:#E86B4C;
    --bg:#EEF4F5; --card:#FFFFFF; --ink:#123A41; --ink2:#2C555C;
    --muted:#6E8A91; --muted2:#95AAAF; --line:#E2ECEE; --soft:#F5FBFA;
    --disp:'Plus Jakarta Sans',system-ui,sans-serif; --body:'Inter',system-ui,sans-serif;
    --sh:0 1px 2px rgba(11,45,49,.04), 0 4px 16px rgba(11,45,49,.05);
    display:grid;grid-template-columns:236px minmax(0,1fr);
    background:var(--bg);color:var(--ink);font-family:var(--body);font-size:14px;line-height:1.5;
    -webkit-font-smoothing:antialiased;text-align:left;max-width:100%;
  }

  /* ---------------- lateral ---------------- */
  .app aside{background:linear-gradient(185deg,var(--brand-deep),#0A2429);color:#CFE6E7;
    padding:20px 14px;position:sticky;top:0;height:100vh;display:flex;flex-direction:column;
    overflow-y:auto;min-width:0}
  .logo{display:flex;align-items:center;gap:11px;padding:4px 8px 18px}
  .logo .clover{width:29px;height:29px;flex:0 0 auto}
  .logo b{font-family:var(--disp);font-weight:800;font-size:15px;color:#fff;letter-spacing:-.01em;line-height:1.15}
  .logo span{display:block;font-size:10.5px;color:var(--brand-lite);font-weight:500}
  nav{display:flex;flex-direction:column;gap:2px;min-width:0}
  nav a{display:flex;align-items:center;gap:10px;padding:9px 11px;border-radius:9px;
    color:#9FC2C4;font-size:13.5px;font-weight:500;text-decoration:none;
    transition:background .15s,color .15s;cursor:pointer;min-width:0}
  nav a svg{width:17px;height:17px;stroke:currentColor;fill:none;stroke-width:1.9;flex:0 0 auto}
  nav a span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  nav a:hover{background:rgba(255,255,255,.07);color:#fff}
  nav a.on{background:var(--brand);color:#04252a;font-weight:600}
  nav .grp{font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:#5b8286;
    padding:15px 11px 6px;font-weight:600}
  .side-foot{margin-top:auto;font-size:11px;color:#5b8286;padding:14px 11px 0;
    border-top:1px solid rgba(255,255,255,.07);line-height:1.6}
  .side-foot b{color:#8fb3b5}

  /* ---------------- topo ---------------- */
  main{padding:0 26px 46px;min-width:0;max-width:100%;overflow:hidden}
  .topbar{display:flex;align-items:flex-end;gap:14px;padding:20px 0 14px;position:sticky;top:0;
    background:var(--bg);z-index:20;flex-wrap:wrap;
    box-shadow:0 10px 16px -12px rgba(11,45,49,.28)}
  .topbar h1{font-family:var(--disp);font-weight:700;font-size:21px;letter-spacing:-.015em;line-height:1.2}
  .topbar .crumb{color:var(--muted);font-size:12.5px;margin-top:3px}
  .topbar .right{margin-left:auto;display:flex;align-items:center;gap:9px;flex-wrap:wrap}
  .chip{background:var(--card);border:1px solid var(--line);border-radius:9px;padding:7px 12px;
    font-size:12.5px;color:var(--ink2);box-shadow:var(--sh);display:inline-flex;align-items:center;gap:7px}
  .chip svg{width:14px;height:14px;stroke:var(--brand);fill:none;stroke-width:2;flex:0 0 auto}
  .chip.live::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--pos);flex:0 0 auto}

  /* ---------------- kpis ---------------- */
  .kpis{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;margin-top:4px}
  .kpi{background:var(--card);border:1px solid var(--line);border-radius:13px;
    padding:13px 15px;box-shadow:var(--sh);min-width:0}
  .kpi.star{border-color:#CFEAE8;background:linear-gradient(160deg,#fff,#F6FDFC)}
  .kpi .top{display:flex;align-items:center;justify-content:space-between;gap:6px}
  .kpi .lbl{font-size:11.5px;color:var(--muted);font-weight:500;overflow:hidden;
    text-overflow:ellipsis;white-space:nowrap}
  .kpi .src{width:7px;height:7px;border-radius:50%;flex:0 0 auto}
  .kpi .src.so{background:var(--brand)} .kpi .src.rd{background:var(--gold)}
  .kpi .v{font-family:var(--disp);font-weight:700;font-size:21px;letter-spacing:-.02em;
    margin-top:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  /* Pode quebrar em duas linhas: a legenda da conversao e longa de proposito
     ("310 dos 476 pedidos ÷ 4.760 sessoes") e cortar escondia a explicacao. */
  .kpi .sub{font-size:10.5px;color:var(--muted2);margin-top:2px;
    white-space:normal;line-height:1.4}
  /* Deixa quebrar em duas linhas: cortar com reticencias escondia justamente a
     informacao que o aviso existe para dar. */
  .kpi .alerta{font-size:9.5px;color:#9A6A12;background:#FDF6E7;border:1px solid #F1E1BD;
    border-radius:6px;padding:3px 7px;margin-top:7px;max-width:100%;
    white-space:normal;line-height:1.35}

  /* ---------------- blocos ---------------- */
  .row{display:grid;gap:13px;margin-top:13px;scroll-margin-top:80px}
  .r-72-28{grid-template-columns:minmax(0,1.75fr) minmax(0,1fr)}
  .r-3{grid-template-columns:repeat(3,minmax(0,1fr))}
  /* Os tres cartoes ficam da mesma altura; sem isto o mais curto sobrava
     espaco morto no rodape. O grafico de cada um estica para preencher. */
  .r-3 .panel{display:flex;flex-direction:column}
  .r-3 .panel .week{flex:1 1 auto;min-height:120px}
  .r-3 .panel .track{flex:0 0 auto;height:150px}
  .r-3 .panel .hbest{margin-top:auto}
  .panel{background:var(--card);border:1px solid var(--line);border-radius:14px;
    padding:17px 19px;box-shadow:var(--sh);scroll-margin-top:80px;min-width:0}
  .panel h3{font-family:var(--disp);font-weight:700;font-size:14.5px;letter-spacing:-.01em}
  .panel .cap{font-size:11.5px;color:var(--muted);margin-top:3px;line-height:1.45}
  .panel .hrow{display:flex;align-items:flex-start;justify-content:space-between;
    gap:12px;flex-wrap:wrap;margin-bottom:14px}
  .legend{font-size:11px;color:var(--muted2);display:flex;gap:14px;align-items:center;
    margin-top:12px;flex-wrap:wrap}
  .legend i{display:inline-block;width:9px;height:9px;border-radius:3px;margin-right:5px;vertical-align:-1px}
  .legend b{color:var(--ink)}

  /* ---------------- controles ---------------- */
  .seg{display:inline-flex;background:#E7EFF0;border-radius:9px;padding:3px;gap:2px;max-width:100%;overflow-x:auto}
  .seg button{border:0;background:transparent;font:inherit;font-size:12px;color:var(--muted);
    padding:6px 11px;border-radius:7px;cursor:pointer;transition:.15s;white-space:nowrap}
  .seg button:hover{color:var(--ink)}
  .seg button.on{background:var(--card);color:var(--ink);font-weight:600;box-shadow:0 1px 3px rgba(11,45,49,.12)}
  .btn{border:1px solid var(--line);background:var(--card);font:inherit;font-size:12px;
    color:var(--ink2);padding:7px 12px;border-radius:9px;cursor:pointer;display:inline-flex;
    align-items:center;gap:7px;transition:.15s;white-space:nowrap}
  .btn:hover{border-color:var(--brand);color:var(--brand-ink)}
  .btn svg{width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2.2;flex:0 0 auto}

  /* ---------------- grafico de vendas ---------------- */
  .chart{width:100%}
  .chart svg{width:100%;height:auto;display:block;overflow:visible}
  .gline{stroke:#E6EEF0;stroke-width:1}
  .glabel{fill:var(--muted2);font-size:10px;font-family:var(--body)}
  .xlabel{fill:var(--muted);font-size:10px;font-family:var(--body);text-anchor:middle}
  .apath{fill:url(#gArea)}
  .lpath{fill:none;stroke:var(--brand);stroke-width:2.2;stroke-linejoin:round;stroke-linecap:round}
  .pt{fill:#fff;stroke:var(--brand);stroke-width:2}
  .pt.hit{fill:var(--gold);stroke:#fff;stroke-width:2}
  .hitzone{fill:transparent;cursor:pointer}
  .hitzone:hover + .pt{r:5.5}

  .wbars{display:flex;align-items:flex-end;gap:10px;height:186px;padding-top:10px;min-width:0}
  .wcol{flex:1 1 0;min-width:0;display:flex;flex-direction:column;align-items:center;
    justify-content:flex-end;height:100%;gap:7px;position:relative;padding-top:14px}
  .wcol .wbar{display:block;width:100%;max-width:62px;border-radius:8px 8px 4px 4px;
    background:linear-gradient(180deg,var(--brand-lite),var(--brand));min-height:4px;
    transition:height .5s cubic-bezier(.3,1,.4,1)}
  /* A barra guarda a cor de "vendas"; o disparo e sinalizado so pelo ponto.
     Quase toda semana tem campanha, entao pintar a barra inteira apagava o sinal. */
  .wcol .wv{font-family:var(--disp);font-weight:700;font-size:12px;color:var(--ink);white-space:nowrap}
  .wcol .wl{font-size:10px;color:var(--muted);text-align:center;line-height:1.35;
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
  .wcol .wl .w-mini{display:none}
  /* O ponto fica na faixa de padding do topo: assim nunca encosta no valor,
     nem quando a barra vai a 100%. */
  .wcol .wdot{position:absolute;top:0;width:7px;height:7px;border-radius:50%;
    background:var(--gold);box-shadow:0 0 0 3px rgba(242,169,59,.22)}

  /* ---------------- motor ---------------- */
  .versus{display:flex;flex-direction:column;gap:14px}
  .vs-row .vs-h{display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:6px;gap:8px}
  .vs-row .vs-h b{font-family:var(--disp)}
  .vs-track{display:block;height:11px;background:#E9F0F1;border-radius:6px;overflow:hidden}
  .vs-fill{display:block;height:100%;border-radius:6px;transition:width .6s cubic-bezier(.3,1,.4,1)}
  .vs-fill.eng{background:linear-gradient(90deg,var(--brand),var(--brand-lite))}
  .vs-fill.des{background:var(--neg)}
  .versus .tag{background:var(--soft);border:1px solid #DCEFED;border-radius:10px;
    padding:11px 13px;font-size:12.5px;color:var(--ink2);line-height:1.55}
  .versus .tag b{color:var(--brand-ink)}

  /* ---------------- melhor dia ---------------- */
  .week{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px;align-items:end;height:140px}
  .wd{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;
    height:100%;gap:5px;position:relative;min-width:0}
  .wd .wbar2{display:block;width:100%;border-radius:6px 6px 3px 3px;background:#E4EFF0;
    min-height:4px;transition:height .5s cubic-bezier(.3,1,.4,1)}
  .wd.has .wbar2{background:linear-gradient(180deg,var(--brand-lite),var(--brand))}
  .wd.best .wbar2{background:linear-gradient(180deg,var(--gold-lite),var(--gold))}
  .wd .wv2{font-family:var(--disp);font-weight:600;font-size:10.5px;color:var(--ink2);white-space:nowrap}
  .wd .wn2{font-size:10px;color:var(--muted)}
  .wd.best .wn2{color:var(--ink);font-weight:700}

  /* ---------------- melhor horario ---------------- */
  .track{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:5px;height:96px}
  .slot{border-radius:9px;background:#EDF3F4;position:relative;display:flex;
    flex-direction:column;justify-content:flex-end;padding:7px 5px;overflow:hidden;min-width:0}
  .slot .fillbg{display:block;position:absolute;left:0;right:0;bottom:0;
    background:linear-gradient(180deg,var(--brand-lite),var(--brand));opacity:.34}
  .slot.best{outline:2px solid var(--gold);outline-offset:-2px}
  .slot.best .fillbg{background:linear-gradient(180deg,var(--gold-lite),var(--gold));opacity:.52}
  .slot .sv{position:relative;font-family:var(--disp);font-weight:700;font-size:11.5px;color:var(--ink)}
  .slot .sn{position:relative;font-size:9px;color:var(--muted);white-space:nowrap}
  .hbest{display:flex;align-items:baseline;gap:8px;margin-top:12px;flex-wrap:wrap}
  .hbest b{font-family:var(--disp);font-size:24px;font-weight:700;letter-spacing:-.02em}
  .hbest span{font-size:11.5px;color:var(--muted)}

  /* ---------------- funil ---------------- */
  .funil{display:flex;justify-content:center;margin:2px 0 12px}
  .funil svg{width:100%;max-width:260px;height:auto;display:block}
  .fstat{display:flex;justify-content:space-between;align-items:baseline;gap:10px;
    font-size:12px;padding:7px 0;border-bottom:1px solid #F0F5F6}
  .fstat:last-child{border-bottom:none}
  .fstat .fn{color:var(--ink2);min-width:0}
  .fstat .fv{font-family:var(--disp);font-weight:700;white-space:nowrap}
  .fstat .fp{color:var(--muted2);font-size:10.5px;margin-left:6px}

  /* ---------------- cruzamento ---------------- */
  .ctrl{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:14px}
  .ctrl .sep{flex:1 1 auto;min-width:0}
  .datas{display:flex;gap:7px;align-items:center;font-size:12px;color:var(--muted);flex-wrap:wrap}
  .datas input{font:inherit;font-size:12px;padding:6px 9px;border:1px solid var(--line);
    border-radius:8px;color:var(--ink);background:var(--card);max-width:150px}
  .cbody[hidden]{display:none}
  .resumo-sel{font-size:12px;color:var(--muted);margin-bottom:12px;line-height:1.7}
  .resumo-sel b{color:var(--ink);font-family:var(--disp)}

  .tw{overflow-x:auto;max-width:100%}
  table{width:100%;border-collapse:collapse;font-size:13px;min-width:640px}
  th{text-align:left;color:var(--muted);font-weight:500;font-size:10.5px;text-transform:uppercase;
    letter-spacing:.04em;padding:0 10px 9px;border-bottom:1px solid var(--line);white-space:nowrap}
  th.n,td.n{text-align:right;font-variant-numeric:tabular-nums}
  td{padding:10px;border-bottom:1px solid #F0F5F6;color:var(--ink);white-space:nowrap}
  tr:last-child td{border-bottom:none}
  td.n{font-family:var(--disp);font-weight:600}
  tr.peak td{background:#FCF6E9}
  .pill{display:inline-flex;align-items:center;gap:6px;font-size:11px;padding:3px 9px;
    border-radius:999px;white-space:nowrap}
  .pill.yes{background:rgba(21,184,182,.13);color:#0d7a78}
  .pill.no{background:#F1F5F6;color:var(--muted2)}
  .pill.yes::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--brand);flex:0 0 auto}

  .cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,164px),1fr));gap:10px}
  .dcard{border:1px solid var(--line);border-radius:12px;padding:11px 12px;background:var(--card);
    transition:.15s;min-width:0}
  .dcard:hover{border-color:var(--brand-lite);transform:translateY(-1px)}
  .dcard.hit{background:linear-gradient(160deg,#FFFCF5,#fff);border-color:#F0DFBE}
  .dcard .dd{display:flex;align-items:center;justify-content:space-between;gap:6px;
    font-size:11.5px;color:var(--muted)}
  .dcard .dv{font-family:var(--disp);font-weight:700;font-size:18px;margin:5px 0 2px;letter-spacing:-.02em}
  .dcard .dl{font-size:10.5px;color:var(--muted2);display:flex;justify-content:space-between;
    gap:5px;padding-top:6px;margin-top:6px;border-top:1px solid #F0F5F6}
  .dcard .dot{width:7px;height:7px;border-radius:50%;background:var(--gold);flex:0 0 auto}

  .bars{display:flex;flex-direction:column;gap:6px}
  .brow{display:grid;grid-template-columns:48px minmax(0,1fr) 92px;gap:9px;align-items:center;font-size:12.5px}
  .brow .bn{color:var(--muted);white-space:nowrap}
  .brow.hit .bn{color:var(--ink);font-weight:600}
  .brow .bt{display:block;height:20px;background:#F0F5F6;border-radius:6px;overflow:hidden}
  .brow .bf{display:block;height:100%;border-radius:6px;min-width:2px;
    background:linear-gradient(90deg,var(--brand),var(--brand-lite));
    transition:width .5s cubic-bezier(.3,1,.4,1)}
  .brow.hit .bf{background:linear-gradient(90deg,var(--gold),var(--gold-lite))}
  .brow .bv{font-family:var(--disp);font-weight:600;text-align:right;color:var(--ink2);
    font-size:12px;white-space:nowrap}
  .vazio{color:var(--muted);font-size:13px;padding:26px 0;text-align:center}

  /* ---------------- IA ---------------- */
  .ai{background:linear-gradient(160deg,var(--brand-deep),#0A2429);color:#DCEFEF;border-radius:15px;
    padding:21px 24px;margin-top:13px;box-shadow:var(--sh);scroll-margin-top:80px}
  .ai .hd{display:flex;align-items:center;gap:11px;margin-bottom:13px;flex-wrap:wrap}
  .ai .spark{width:26px;height:26px;border-radius:8px;background:var(--brand);
    display:grid;place-items:center;flex:0 0 auto}
  .ai .spark svg{width:15px;height:15px;fill:#04252a}
  .ai h3{font-family:var(--disp);font-weight:700;font-size:15px;color:#fff}
  .ai .model{margin-left:auto;font-size:10.5px;color:#7fa9ab;border:1px solid rgba(255,255,255,.13);
    padding:4px 10px;border-radius:999px;white-space:nowrap}
  .ai .diag{font-size:13.5px;color:#eafcfc;max-width:80ch;margin-bottom:15px;line-height:1.65}
  .ai .cols{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}
  .ai h4{font-family:var(--disp);font-weight:600;font-size:11.5px;color:var(--brand-lite);
    text-transform:uppercase;letter-spacing:.05em;margin-bottom:9px}
  .ai ul{list-style:none}
  .ai li{font-size:12.5px;color:#cfe6e6;padding:5px 0 5px 19px;position:relative;line-height:1.55}
  .ai li::before{content:"";position:absolute;left:2px;top:11px;width:6px;height:6px;
    border-radius:2px;background:var(--brand-lite)}
  .ai .rec{font-size:13px;color:#eafcfc;background:rgba(242,169,59,.12);
    border-left:3px solid var(--gold);padding:12px 14px;border-radius:0 9px 9px 0;line-height:1.6}
  .ai .conv{font-size:13px;color:#eafcfc;background:rgba(21,184,182,.12);
    border-left:3px solid var(--brand);padding:12px 14px;border-radius:0 9px 9px 0;
    margin-bottom:15px;line-height:1.6}
  .ai .stub{font-size:10.5px;color:var(--gold);margin-bottom:10px}

  .foot{color:var(--muted2);font-size:11px;margin-top:18px;line-height:1.7}
  .loading{color:var(--muted);font-size:13px;padding:44px 0;text-align:center}

  /* ---------------- responsivo ---------------- */
  @media(max-width:1280px){ .kpis{grid-template-columns:repeat(4,minmax(0,1fr))} }
  @media(max-width:1080px){
    .r-72-28{grid-template-columns:minmax(0,1fr)}
    .r-3{grid-template-columns:minmax(0,1fr)}
    .ai .cols{grid-template-columns:minmax(0,1fr)}
    .kpis{grid-template-columns:repeat(3,minmax(0,1fr))}
  }
  @media(max-width:860px){
    .app{grid-template-columns:minmax(0,1fr)}
    .app aside{position:static;height:auto;overflow:visible;padding:16px 14px}
    .app aside .grp{padding:12px 4px 6px}
    .app aside nav{flex-direction:row;flex-wrap:nowrap;overflow-x:auto;gap:6px;padding-bottom:4px}
    .app aside nav a{flex:0 0 auto}
    .side-foot{display:none}
    main{padding:0 16px 36px}
    .topbar{padding:16px 0 12px}
    .topbar h1{font-size:19px}
  }
  @media(max-width:620px){
    .kpis{grid-template-columns:repeat(2,minmax(0,1fr))}
    .wcol .wl .w-full{display:none}
    .wcol .wl .w-mini{display:inline}
    .wcol{gap:5px;padding-top:12px}
    nav a{padding:8px 9px;font-size:12.5px;gap:8px}
    nav a svg{width:15px;height:15px}
    .week{height:118px}
    .track{height:84px;grid-template-columns:repeat(5,minmax(0,1fr))}
    .slot .sn{font-size:8px}
    .wbars{height:158px}
    .topbar .right{width:100%;margin-left:0}
    .brow{grid-template-columns:42px minmax(0,1fr) 78px}
  }
  @media(prefers-reduced-motion:reduce){
    .wcol .wbar,.wd .wbar2,.brow .bf,.vs-fill{transition:none}
  }
  `;

  var HTML = `
  <div class="app">
    <aside>
      <div class="logo">
        <svg class="clover" viewBox="0 0 40 40" aria-hidden="true">
          <g fill="var(--brand-lite)"><circle cx="20" cy="12" r="7"/><circle cx="12" cy="20" r="7"/><circle cx="28" cy="20" r="7"/><circle cx="20" cy="28" r="7"/></g>
          <circle cx="20" cy="20" r="4" fill="#0A2429"/>
        </svg>
        <div><b>Supertroco</b><span>&times; Sorte Online</span></div>
      </div>
      <div class="grp">Per&iacute;odo</div>
      <nav id="nav-abas"></nav>
      <div class="grp">Se&ccedil;&otilde;es</div>
      <nav id="nav-secoes"></nav>
      <div class="side-foot"><b>Fontes</b><br>RD Station &middot; envios<br>Sorte Online &middot; vendas</div>
    </aside>
    <main>
      <div class="topbar">
        <div><h1 id="titulo">Vis&atilde;o geral da parceria</h1><div class="crumb" id="subtitulo">&mdash;</div></div>
        <div class="right">
          <span class="chip"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/></svg><span id="periodo">&mdash;</span></span>
          <span class="chip live">Atualizado <b style="margin-left:4px" id="atualizado">&mdash;</b></span>
        </div>
      </div>
      <div id="corpo"><div class="loading">Carregando dados&hellip;</div></div>
      <div class="foot">Painel alimentado por gerar_painel.py (RD Station + Acompanhamento Sorte Online) e publicado automaticamente. Nenhuma chave de API fica exposta nesta p&aacute;gina.</div>
    </main>
  </div>`;

  // =====================================================================
  function boot() {
    if (document.getElementById("painel-supertroco-host")) return;
    var host = document.createElement("div");
    host.id = "painel-supertroco-host";
    var slot = document.getElementById("painel-supertroco");
    if (slot) { slot.appendChild(host); } else { document.body.appendChild(host); }
    var root = host.attachShadow({ mode: "open" });
    root.innerHTML = "<style>" + CSS + "</style>" + HTML;

    var $ = function (id) { return root.getElementById(id); };
    var DADOS = null;
    var estado = { aba: "geral", janela: "tudo", modo: "tabela", gran: "", de: "", ate: "", aberto: true };

    // ---------------- formato ----------------
    function nf(n, casas) {
      return Number(n || 0).toLocaleString("pt-BR", {
        minimumFractionDigits: casas || 0, maximumFractionDigits: casas || 0
      });
    }
    function moeda(n, casas) { return "R$ " + nf(n, casas === undefined ? 0 : casas); }
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
    // A IA devolve texto com <b> para destacar numeros. Escapamos tudo e entao
    // devolvemos apenas <b>/</b>: o negrito funciona sem abrir brecha de HTML.
    function rich(s) {
      return esc(s).replace(/&lt;b&gt;/g, "<b>").replace(/&lt;\/b&gt;/g, "</b>");
    }
    function guardar(c, v) { try { localStorage.setItem("pst-" + c, v); } catch (e) { /* privado */ } }
    function ler(c) { try { return localStorage.getItem("pst-" + c); } catch (e) { return null; } }

    function abaAtiva() {
      var achou = null;
      DADOS.abas.forEach(function (a) { if (a.id === estado.aba) achou = a; });
      return achou || DADOS.abas[0];
    }

    // ---------------- lateral ----------------
    var SECOES = [
      ["resumo", "Resumo", '<path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/>'],
      ["sec-vendas", "Vendas por dia", '<rect x="3" y="10" width="4" height="11" rx="1"/><rect x="10" y="4" width="4" height="17" rx="1"/><rect x="17" y="14" width="4" height="7" rx="1"/>'],
      ["sec-campanhas", "Campanhas", '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 8l9 5 9-5"/>'],
      ["sec-cross", "Cruzamento diário", '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/>'],
      ["sec-ia", "Análise da IA", '<path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z"/>']
    ];

    function pintarNav() {
      $("nav-abas").innerHTML = DADOS.abas.map(function (a) {
        var ic = a.id === "geral"
          ? '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>'
          : '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/>';
        return '<a data-aba="' + esc(a.id) + '"' + (a.id === estado.aba ? ' class="on"' : '') + '>' +
          '<svg viewBox="0 0 24 24">' + ic + '</svg><span>' + esc(a.nome) + '</span></a>';
      }).join("");

      $("nav-secoes").innerHTML = SECOES.map(function (s) {
        return '<a data-ir="' + s[0] + '"><svg viewBox="0 0 24 24">' + s[2] + '</svg><span>' +
          esc(s[1]) + '</span></a>';
      }).join("");

      root.querySelectorAll("#nav-abas a").forEach(function (a) {
        a.addEventListener("click", function () {
          estado.aba = a.getAttribute("data-aba");
          estado.janela = "tudo"; estado.de = ""; estado.ate = ""; estado.gran = "";
          guardar("aba", estado.aba);
          root.querySelectorAll("#nav-abas a").forEach(function (x) { x.classList.remove("on"); });
          a.classList.add("on");
          pintarAba();
        });
      });
      root.querySelectorAll("#nav-secoes a").forEach(function (a) {
        a.addEventListener("click", function () {
          var alvo = $(a.getAttribute("data-ir"));
          if (alvo) alvo.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    }

    // ---------------- KPIs ----------------
    function blocoKpis(aba) {
      var k = aba.kpis;
      // A conversao mostra a propria conta no cartao, e avisa quando nem todo dia
      // tem sessao registrada — senao o numero pareceria cobrir o periodo inteiro.
      var parcial = (k.dias_com_sessao !== undefined && k.dias_com_sessao < k.dias_ativos)
        ? "base parcial: " + k.dias_com_sessao + " de " + k.dias_ativos + " dias com sessão"
        : null;
      // Quando a base e parcial, o numerador da conversao e MENOR que o card
      // "Pedidos" ao lado (os dias sem sessao ficam de fora). Dizer "310 dos 476"
      // deixa a relacao explicita, em vez de parecerem dois numeros brigando.
      var contaConv;
      if (k.pedidos_com_sessao === undefined) {
        contaConv = "pedidos ÷ sessões";
      } else if (parcial) {
        contaConv = nf(k.pedidos_com_sessao) + " dos " + nf(k.pedidos) +
          " pedidos ÷ " + nf(k.sessoes) + " sessões";
      } else {
        contaConv = nf(k.pedidos_com_sessao) + " pedidos ÷ " + nf(k.sessoes) + " sessões";
      }
      // Abertura e CTR agora cobrem a mesma janela das vendas, entao a legenda
      // pode dizer quantas campanhas do periodo entraram na conta.
      var campanhas = (aba.email && aba.email.envios)
        ? aba.email.envios + " campanhas no período"
        : "campanhas Sorte Online";
      var defs = [
        ["so", "Vendas", moeda(k.vendas), aba.periodo, true],
        ["so", "Comissão", moeda(k.comissao), "10% das vendas", true],
        ["so", "Aquisições", nf(k.aquisicoes), "novos usuários", true],
        ["so", "CAC", moeda(k.cac, 2), "comissão ÷ aquisições", true],
        ["so", "Pedidos", nf(k.pedidos), "no período", true],
        ["so", "Ticket médio", moeda(k.tkm, 2), "vendas ÷ pedidos", false],
        ["so", "Conversão", nf(k.conversao, 2) + "%", contaConv, false, parcial],
        ["so", "Sessões", nf(k.sessoes),
         parcial ? "visitas em " + k.dias_com_sessao + " dos " + k.dias_ativos + " dias"
                 : "visitas ao site da Sorte Online", false, parcial],
        ["rd", "Abertura média", nf(k.abertura || 0, 1) + "%", campanhas, false],
        ["rd", "CTR médio", nf(k.ctr || 0, 2) + "%", "cliques ÷ entregues", false]
      ];
      return '<div class="kpis" id="resumo">' + defs.map(function (d) {
        return '<div class="kpi' + (d[4] ? ' star' : '') + '" title="' +
          esc(d[1] + ": " + d[2] + " — " + d[3] + (d[5] ? " (" + d[5] + ")" : "")) + '">' +
          '<div class="top"><span class="lbl">' + esc(d[1]) + '</span><span class="src ' + d[0] + '"></span></div>' +
          '<div class="v">' + esc(d[2]) + '</div><div class="sub">' + esc(d[3]) + '</div>' +
          (d[5] ? '<div class="alerta">' + esc(d[5]) + '</div>' : '') + '</div>';
      }).join("") + '</div>';
    }

    // ---------------- vendas: agregacao ----------------
    function porSemana(dias) {
      var grupos = [], atual = null;
      dias.forEach(function (d) {
        var dt = new Date(d.iso + "T00:00:00");
        var seg = new Date(dt);
        seg.setDate(dt.getDate() - ((dt.getDay() + 6) % 7));   // segunda da semana
        var chave = seg.getFullYear() + "-" + (seg.getMonth() + 1) + "-" + seg.getDate();
        if (!atual || atual.chave !== chave) {
          atual = { chave: chave, ini: d.d, fim: d.d, vendas: 0, comissao: 0,
                    pedidos: 0, novos: 0, envios: 0, ndias: 0 };
          grupos.push(atual);
        }
        atual.fim = d.d; atual.ndias++;
        atual.vendas += d.vendas; atual.comissao += d.comissao;
        atual.pedidos += d.pedidos; atual.novos += d.novos;
        if (d.send) atual.envios++;
      });
      return grupos;
    }

    // Grafico de area: aguenta 40+ dias sem apertar nem precisar de rolagem.
    function graficoDia(dias) {
      var W = 760, H = 220, pl = 44, pr = 10, pt = 16, pb = 28;
      var iw = W - pl - pr, ih = H - pt - pb;
      var mx = Math.max.apply(null, dias.map(function (d) { return d.vendas; })) || 1;
      var n = dias.length;
      var X = function (i) { return n === 1 ? pl + iw / 2 : pl + iw * i / (n - 1); };
      var Y = function (v) { return pt + ih * (1 - v / mx); };

      var grade = "", niveis = [1, 0.5, 0];
      niveis.forEach(function (f) {
        var y = Y(mx * f);
        grade += '<line class="gline" x1="' + pl + '" y1="' + y.toFixed(1) + '" x2="' + (W - pr) + '" y2="' + y.toFixed(1) + '"/>' +
          '<text class="glabel" x="' + (pl - 8) + '" y="' + (y + 3.5).toFixed(1) + '" text-anchor="end">' +
          esc(curto(mx * f)) + '</text>';
      });

      var pts = dias.map(function (d, i) { return X(i).toFixed(1) + "," + Y(d.vendas).toFixed(1); });
      var linha = "M" + pts.join(" L");
      var area = linha + " L" + X(n - 1).toFixed(1) + "," + (pt + ih) +
        " L" + X(0).toFixed(1) + "," + (pt + ih) + " Z";

      var marcas = "", zonas = "";
      dias.forEach(function (d, i) {
        var cx = X(i), cy = Y(d.vendas);
        var dica = d.d + " · " + moeda(d.vendas) + " · " + d.pedidos + " pedidos · " +
          d.novos + " aquisições" + (d.send ? " · " + d.send : "");
        zonas += '<g><rect class="hitzone" x="' + (cx - iw / n / 2).toFixed(1) + '" y="' + pt +
          '" width="' + Math.max(4, iw / n).toFixed(1) + '" height="' + ih + '"><title>' + esc(dica) + '</title></rect>' +
          '<circle class="pt' + (d.send ? " hit" : "") + '" cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) +
          '" r="' + (d.send ? 4.5 : (n > 25 ? 0 : 3)) + '"/></g>';
      });

      var passo = Math.max(1, Math.ceil(n / 8)), rotulos = "";
      dias.forEach(function (d, i) {
        if (i % passo === 0 || i === n - 1) {
          rotulos += '<text class="xlabel" x="' + X(i).toFixed(1) + '" y="' + (H - 8) + '">' + esc(d.d) + '</text>';
        }
      });

      return '<div class="chart"><svg viewBox="0 0 ' + W + ' ' + H + '" role="img" ' +
        'aria-label="Vendas por dia no periodo"><defs>' +
        '<linearGradient id="gArea" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="#15B8B6" stop-opacity="0.28"/>' +
        '<stop offset="100%" stop-color="#15B8B6" stop-opacity="0.02"/></linearGradient></defs>' +
        grade + '<path class="apath" d="' + area + '"/><path class="lpath" d="' + linha + '"/>' +
        marcas + zonas + rotulos + '</svg></div>';
    }

    // "01/08" + "02/08" -> "01–02/08"; meses diferentes -> "31/08–06/09".
    function faixaCurta(ini, fim) {
      var a = String(ini).split("/"), b = String(fim).split("/");
      return a[1] === b[1] ? a[0] + "–" + b[0] + "/" + b[1] : ini + "–" + fim;
    }

    function graficoSemana(dias) {
      var semanas = porSemana(dias);
      var mx = Math.max.apply(null, semanas.map(function (s) { return s.vendas; })) || 1;
      var cols = semanas.map(function (s) {
        var h = Math.max(4, s.vendas / mx * 100);
        var dica = s.ini + " a " + s.fim + " · " + moeda(s.vendas) + " · " +
          s.pedidos + " pedidos · " + s.novos + " aquisições" +
          (s.envios ? " · " + s.envios + " dia(s) com disparo" : "");
        return '<div class="wcol ' + (s.envios ? "hit" : "") + '" title="' + esc(dica) + '">' +
          (s.envios ? '<span class="wdot"></span>' : '') +
          '<span class="wv">' + esc(curto(s.vendas)) + '</span>' +
          '<div class="wbar" style="height:' + h.toFixed(1) + '%"></div>' +
          // Em telas estreitas nao cabe "03–09/08": o CSS troca pelo dia inicial.
          '<span class="wl"><span class="w-full">' + esc(faixaCurta(s.ini, s.fim)) +
          '</span><span class="w-mini">' + esc(s.ini) + '</span></span></div>';
      }).join("");
      return '<div class="wbars">' + cols + '</div>';
    }

    function pintarGrafico(aba) {
      var alvo = $("vendas-chart");
      if (!alvo) return;
      alvo.innerHTML = estado.gran === "dia" ? graficoDia(aba.dias) : graficoSemana(aba.dias);
    }

    function blocoVendas(aba) {
      if (!aba.dias.length) return "";
      // Mes inteiro em barras diarias fica ilegivel: o padrao agrupa por semana e
      // o usuario abre o detalhe diario quando quiser.
      if (!estado.gran) estado.gran = aba.dias.length > 14 ? "semana" : "dia";
      var opcoes = [["semana", "Por semana"], ["dia", "Dia a dia"]];
      return '<div class="row r-72-28" id="sec-vendas"><div class="panel">' +
        '<div class="hrow"><div><h3>Vendas &times; envios de campanha</h3>' +
        '<div class="cap">Receita da Sorte Online; per&iacute;odos com disparo de base ampla em dourado</div></div>' +
        '<div class="seg" id="seg-gran">' + opcoes.map(function (o) {
          return '<button data-g="' + o[0] + '"' + (estado.gran === o[0] ? ' class="on"' : '') + '>' +
            esc(o[1]) + '</button>';
        }).join("") + '</div></div>' +
        '<div id="vendas-chart"></div>' +
        '<div class="legend"><span><i style="background:var(--brand)"></i>Vendas</span>' +
        '<span><i style="background:var(--gold);border-radius:50%"></i>Houve disparo de campanha</span>' +
        '<span>' + aba.dias.length + ' dias no per&iacute;odo</span></div></div>' +
        blocoMotor(aba) + '</div>';
    }

    function blocoMotor(aba) {
      var e = aba.email;
      if (!e) return '<div class="panel" id="sec-bases"><h3>Motor do resultado</h3>' +
        '<div class="cap">Sem campanhas da RD neste per&iacute;odo</div></div>';
      var eng = e.engajado, des = e.deseng;
      var mx = Math.max(eng.ab, des.ab) || 1;
      var fator = des.ab ? (eng.ab / des.ab).toFixed(0) : "—";
      var motor = (aba.ia && aba.ia.motor)
        ? rich(aba.ia.motor)
        : ("A base engajada abre <b>~" + fator + "&times; mais</b> que a base fria.");
      return '<div class="panel" id="sec-bases"><div class="hrow" style="margin-bottom:12px"><div>' +
        '<h3>Motor do resultado</h3>' +
        '<div class="cap">Abertura m&eacute;dia por tipo de base<br>' + esc(e.envios) +
        ' campanhas &middot; ' + esc(e.periodo) + '</div></div></div>' +
        '<div class="versus">' +
        '<div class="vs-row"><div class="vs-h"><span>Base engajada</span><b>' + nf(eng.ab, 2) + '%</b></div>' +
        '<div class="vs-track"><div class="vs-fill eng" style="width:' + (eng.ab / mx * 100).toFixed(1) + '%"></div></div></div>' +
        '<div class="vs-row"><div class="vs-h"><span>Base desengajada / total</span><b>' + nf(des.ab, 2) + '%</b></div>' +
        '<div class="vs-track"><div class="vs-fill des" style="width:' + Math.max(4, des.ab / mx * 100).toFixed(1) + '%"></div></div></div>' +
        '<div class="tag">' + motor + '</div></div></div>';
    }

    // ---------------- os tres cartoes ----------------
    function cartaoSemana(e) {
      var porNome = {};
      (e.dias || []).forEach(function (d) { porNome[d[0]] = { v: d[1], n: d[2] }; });
      var valores = SEMANA.map(function (s) { return (porNome[s] || {}).v || 0; });
      var mx = Math.max.apply(null, valores) || 1;
      var melhor = valores.indexOf(mx);
      var cols = SEMANA.map(function (s, i) {
        var info = porNome[s] || { v: 0, n: 0 };
        var h = info.v ? Math.max(8, info.v / mx * 100) : 4;
        return '<div class="wd ' + (info.v ? "has " : "") + (i === melhor && info.v ? "best" : "") +
          '" title="' + esc(s + (info.n ? " · " + info.n + " envios" : " · sem envios")) + '">' +
          '<span class="wv2">' + (info.v ? nf(info.v, 1) + "%" : "&mdash;") + '</span>' +
          '<div class="wbar2" style="height:' + h + '%"></div>' +
          '<span class="wn2">' + esc(SEMANA_CURTA[s]) + '</span></div>';
      }).join("");
      var nomeMelhor = valores[melhor] ? SEMANA[melhor] : "—";
      return '<div class="panel"><h3>Melhor dia para abrir</h3>' +
        '<div class="cap">Abertura m&eacute;dia por dia da semana &middot; ' + esc(e.envios) + ' campanhas</div>' +
        '<div class="week" style="margin-top:14px">' + cols + '</div>' +
        '<div class="legend"><span>Melhor: <b>' + esc(nomeMelhor) + '</b></span></div></div>';
    }

    function cartaoHorario(e) {
      var hs = e.horarios || [];
      if (!hs.length) return '<div class="panel"><h3>Melhor hor&aacute;rio para clicar</h3>' +
        '<div class="vazio">Sem dados</div></div>';
      var ordem = ["00h–09h", "09h–12h", "12h–15h", "15h–18h", "18h–24h"];
      var por = {}; hs.forEach(function (h) { por[h[0]] = { v: h[1], n: h[2] }; });
      var mx = Math.max.apply(null, hs.map(function (h) { return h[1]; })) || 1;
      var campeao = hs[0];
      var slots = ordem.map(function (f) {
        var info = por[f];
        if (!info) return '<div class="slot"><span class="sv">&mdash;</span><span class="sn">' + esc(f) + '</span></div>';
        return '<div class="slot ' + (f === campeao[0] ? "best" : "") + '" title="' +
          esc(f + " · " + info.n + " envios") + '">' +
          '<div class="fillbg" style="height:' + Math.max(12, info.v / mx * 100).toFixed(1) + '%"></div>' +
          '<span class="sv">' + nf(info.v, 2) + '%</span><span class="sn">' + esc(f) + '</span></div>';
      }).join("");
      return '<div class="panel"><h3>Melhor hor&aacute;rio para clicar</h3>' +
        '<div class="cap">CTR m&eacute;dio por faixa do dia</div>' +
        '<div class="track" style="margin-top:14px">' + slots + '</div>' +
        '<div class="hbest"><b>' + nf(campeao[1], 2) + '%</b>' +
        '<span>na faixa ' + esc(campeao[0]) + ' &middot; ' + esc(campeao[2]) + ' envios</span></div></div>';
    }

    function cartaoFunil(e) {
      var f = e.funil, base = f.entregues || 1;
      var etapas = [
        { n: "Entregues", v: f.entregues, p: 100 },
        { n: "Aberturas", v: f.aberturas, p: f.aberturas / base * 100 },
        { n: "Cliques", v: f.cliques, p: f.cliques / base * 100 }
      ];
      // Largura pela raiz da proporcao. Na escala crua, 12,4% e 0,4% batiam no
      // mesmo piso e os dois estagios saiam identicos; assim a ordem continua
      // honesta e visivel. Os valores exatos vao logo abaixo do desenho.
      var larg = etapas.map(function (s) { return Math.max(6, Math.sqrt(s.p / 100) * 100); });
      var W = 200, H = 150, faixa = H / etapas.length, vao = 6;
      var cores = ["#15B8B6", "#5DD9D7", "#F2A93B"];
      var formas = etapas.map(function (s, i) {
        var y0 = i * faixa, y1 = y0 + faixa - vao;
        var w0 = larg[i] / 100 * W;
        var w1 = (i + 1 < larg.length ? larg[i + 1] : larg[i] * 0.8) / 100 * W;
        var x0 = (W - w0) / 2, x1 = (W - w1) / 2;
        return '<polygon points="' + x0.toFixed(1) + ',' + y0.toFixed(1) + ' ' +
          (x0 + w0).toFixed(1) + ',' + y0.toFixed(1) + ' ' +
          (x1 + w1).toFixed(1) + ',' + y1.toFixed(1) + ' ' +
          x1.toFixed(1) + ',' + y1.toFixed(1) + '" fill="' + cores[i] + '" rx="2">' +
          '<title>' + esc(s.n + ": " + nf(s.v)) + '</title></polygon>';
      }).join("");
      var rotulos = etapas.map(function (s, i) {
        var passo = "";
        if (i > 0) {
          var conv = s.v / (etapas[i - 1].v || 1) * 100;
          passo = '<span class="fp">' + nf(conv, conv < 1 ? 2 : 1) + '% do anterior</span>';
        }
        return '<div class="fstat"><span class="fn">' + esc(s.n) + passo + '</span>' +
          '<span class="fv">' + esc(curto(s.v)) + '</span></div>';
      }).join("");
      return '<div class="panel"><h3>Funil de e-mail</h3>' +
        '<div class="cap">Consolidado do per&iacute;odo &middot; escala suavizada</div>' +
        '<div class="funil"><svg viewBox="0 0 ' + W + ' ' + H + '" ' +
        'preserveAspectRatio="xMidYMid meet" role="img" aria-label="Funil de e-mail">' +
        formas + '</svg></div>' + rotulos + '</div>';
    }

    function blocoCampanhas(aba) {
      var e = aba.email;
      if (!e) return "";
      return '<div class="row r-3" id="sec-campanhas">' +
        cartaoSemana(e) + cartaoHorario(e) + cartaoFunil(e) + '</div>';
    }

    // ---------------- cruzamento ----------------
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
      // Conta a partir do ultimo dia COM dados, nao de hoje.
      return dias.slice(Math.max(0, dias.length - n));
    }

    function blocoCross(aba) {
      var janelas = [["3", "3 dias"], ["7", "7 dias"], ["30", "30 dias"],
                     ["tudo", "Tudo"], ["custom", "Personalizado"]];
      var modos = [["tabela", "Tabela"], ["cartoes", "Cartões"], ["grafico", "Gráfico"]];
      var ctrl = '<div class="ctrl">' +
        '<div class="seg" id="seg-janela">' + janelas.map(function (j) {
          return '<button data-j="' + j[0] + '"' + (estado.janela === j[0] ? ' class="on"' : '') + '>' +
            esc(j[1]) + '</button>';
        }).join("") + '</div>' +
        (estado.janela === "custom"
          ? '<div class="datas">de <input type="date" id="dt-de" value="' + esc(estado.de) + '">' +
            'até <input type="date" id="dt-ate" value="' + esc(estado.ate) + '"></div>'
          : '') +
        '<div class="sep"></div>' +
        '<div class="seg" id="seg-modo">' + modos.map(function (m) {
          return '<button data-m="' + m[0] + '"' + (estado.modo === m[0] ? ' class="on"' : '') + '>' +
            esc(m[1]) + '</button>';
        }).join("") + '</div></div>';

      return '<div class="row" id="sec-cross"><div class="panel">' +
        '<div class="hrow"><div><h3>Cruzamento di&aacute;rio</h3>' +
        '<div class="cap">Cada dia de venda ao lado do disparo de campanha correspondente</div></div>' +
        '<button class="btn" id="bt-toggle"><svg viewBox="0 0 24 24"><path d="' +
        (estado.aberto ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6") + '"/></svg>' +
        (estado.aberto ? "Ocultar" : "Mostrar") + '</button></div>' +
        '<div class="cbody" id="cbody"' + (estado.aberto ? '' : ' hidden') + '>' +
        ctrl + '<div id="cross-conteudo"></div></div></div></div>';
    }

    function pintarCross(aba) {
      var alvo = $("cross-conteudo");
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
      var resumo = '<div class="resumo-sel"><b>' + dias.length + '</b> dias &middot; ' +
        'vendas <b>' + moeda(s.v) + '</b> &middot; comiss&atilde;o <b>' + moeda(s.c, 2) + '</b> &middot; ' +
        'pedidos <b>' + nf(s.p) + '</b> &middot; aquisi&ccedil;&otilde;es <b>' + nf(s.n) + '</b> &middot; ' +
        '<b>' + disparos + '</b> dia(s) com disparo</div>';
      alvo.innerHTML = resumo + (
        estado.modo === "tabela" ? vistaTabela(dias)
        : estado.modo === "cartoes" ? vistaCartoes(dias)
        : vistaGrafico(dias));
    }

    function vistaTabela(dias) {
      var mx = Math.max.apply(null, dias.map(function (d) { return d.vendas; })) || 1;
      var linhas = dias.map(function (d) {
        return '<tr class="' + (d.vendas === mx ? "peak" : "") + '">' +
          '<td>' + esc(d.d) + '</td>' +
          '<td class="n">' + nf(d.vendas) + '</td>' +
          '<td class="n">' + nf(d.comissao, 2) + '</td>' +
          '<td class="n">' + nf(d.pedidos) + '</td>' +
          '<td class="n">' + nf(d.novos) + '</td>' +
          '<td class="n">' + nf(d.tkm, 2) + '</td>' +
          '<td class="n">' + (d.conv === null ? '&mdash;' : nf(d.conv, 2) + '%') + '</td>' +
          '<td>' + (d.send ? '<span class="pill yes">' + esc(d.send) + '</span>'
                           : '<span class="pill no">sem disparo</span>') + '</td></tr>';
      }).join("");
      return '<div class="tw"><table><thead><tr><th>Dia</th><th class="n">Vendas (R$)</th>' +
        '<th class="n">Comiss&atilde;o</th><th class="n">Pedidos</th><th class="n">Aquisi&ccedil;&otilde;es</th>' +
        '<th class="n">Ticket</th><th class="n">Convers&atilde;o</th><th>Disparo no dia</th></tr></thead>' +
        '<tbody>' + linhas + '</tbody></table></div>';
    }

    function vistaCartoes(dias) {
      return '<div class="cards">' + dias.map(function (d) {
        return '<div class="dcard ' + (d.send ? "hit" : "") + '"' +
          (d.send ? ' title="' + esc(d.send) + '"' : '') + '>' +
          '<div class="dd"><span>' + esc(d.d) + '</span>' +
          (d.send ? '<span class="dot"></span>' : '') + '</div>' +
          '<div class="dv">' + moeda(d.vendas) + '</div>' +
          '<div class="dd" style="font-size:10.5px">comiss&atilde;o ' + moeda(d.comissao, 2) + '</div>' +
          '<div class="dl"><span>' + d.pedidos + ' ped.</span><span>' + d.novos + ' aquis.</span>' +
          '<span>' + (d.conv === null ? '&mdash;' : nf(d.conv, 1) + '%') + '</span></div></div>';
      }).join("") + '</div>';
    }

    function vistaGrafico(dias) {
      var mx = Math.max.apply(null, dias.map(function (d) { return d.vendas; })) || 1;
      return '<div class="bars">' + dias.map(function (d) {
        return '<div class="brow ' + (d.send ? "hit" : "") + '"' +
          (d.send ? ' title="' + esc(d.send) + '"' : '') + '>' +
          '<div class="bn">' + esc(d.d) + '</div>' +
          '<div class="bt"><div class="bf" style="width:' +
            Math.max(1, d.vendas / mx * 100).toFixed(1) + '%"></div></div>' +
          '<div class="bv">' + moeda(d.vendas) + '</div></div>';
      }).join("") + '</div>' +
      '<div class="legend"><span><i style="background:var(--brand)"></i>Vendas do dia</span>' +
      '<span><i style="background:var(--gold)"></i>Dia com disparo</span></div>';
    }

    // ---------------- IA ----------------
    function blocoIA(aba) {
      var ia = aba.ia || {};
      var sustenta = (ia.sustenta || []).map(function (x) { return "<li>" + rich(x) + "</li>"; }).join("");
      var stub = (ia.diagnostico && ia.diagnostico.charAt(0) === "[")
        ? "" : "Gerado automaticamente a partir dos dados desta aba";
      return '<div class="ai" id="sec-ia">' +
        '<div class="hd"><span class="spark"><svg viewBox="0 0 24 24"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z"/></svg></span>' +
        '<h3>An&aacute;lise do agente &mdash; ' + esc(aba.nome) + '</h3>' +
        '<span class="model">Groq &middot; gpt-oss-120b</span></div>' +
        (stub ? '<div class="stub">' + esc(stub) + '</div>' : '') +
        '<p class="diag">' + rich(ia.diagnostico || "") + '</p>' +
        (ia.conversao ? '<div class="conv"><b>Convers&atilde;o e abertura:</b> ' + rich(ia.conversao) + '</div>' : '') +
        '<div class="cols"><div><h4>O que os dados sustentam</h4><ul>' + sustenta + '</ul></div>' +
        '<div><h4>Recomenda&ccedil;&atilde;o para o pr&oacute;ximo ciclo</h4>' +
        '<div class="rec">' + rich(ia.recomendacao || "") + '</div></div></div></div>';
    }

    // ---------------- montagem ----------------
    function pintarAba() {
      var aba = abaAtiva();
      $("titulo").textContent = aba.id === "geral" ? "Visão geral da parceria" : aba.nome;
      $("subtitulo").textContent = aba.id === "geral"
        ? "Resultados de venda cruzados com o desempenho dos disparos"
        : "Recorte mensal · " + aba.sub;
      $("periodo").textContent = aba.periodo;
      $("atualizado").textContent = DADOS.atualizado;

      $("corpo").innerHTML = blocoKpis(aba) + blocoVendas(aba) +
        blocoCampanhas(aba) + blocoCross(aba) + blocoIA(aba);

      pintarGrafico(aba);
      ligarEventos(aba);
      pintarCross(aba);
    }

    function ligarEventos(aba) {
      root.querySelectorAll("#seg-gran button").forEach(function (b) {
        b.addEventListener("click", function () {
          estado.gran = b.getAttribute("data-g");
          guardar("gran", estado.gran);
          root.querySelectorAll("#seg-gran button").forEach(function (x) { x.classList.remove("on"); });
          b.classList.add("on");
          pintarGrafico(aba);
        });
      });

      var bt = $("bt-toggle");
      if (bt) bt.addEventListener("click", function () {
        estado.aberto = !estado.aberto;
        guardar("aberto", estado.aberto ? "1" : "0");
        var corpo = $("cbody");
        if (corpo) corpo.hidden = !estado.aberto;
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
          pintarAba();
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

    // ---------------- carga ----------------
    function iniciar(D) {
      if (!D || !D.abas || !D.abas.length) throw new Error("dados.json sem abas");
      DADOS = D;
      var salva = ler("aba");
      if (salva && D.abas.some(function (a) { return a.id === salva; })) estado.aba = salva;
      var modo = ler("modo"); if (modo) estado.modo = modo;
      var gran = ler("gran"); if (gran) estado.gran = gran;
      var janela = ler("janela"); if (janela && janela !== "custom") estado.janela = janela;
      if (ler("aberto") === "0") estado.aberto = false;
      pintarNav();
      pintarAba();
    }

    function falha(msg) { $("corpo").innerHTML = '<div class="loading">' + esc(msg) + '</div>'; }

    function baixar(url) {
      return fetch(url, { cache: "no-store" }).then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      });
    }
    function render(D) {
      try {
        iniciar(D);
      } catch (err) {
        falha("Dados carregados, mas a montagem falhou: " + err.message);
        err.__render = true;
        throw err;
      }
    }
    baixar(DADOS_URL).then(render).catch(function (e1) {
      if (e1 && e1.__render) return;
      baixar(DADOS_URL_FALLBACK).then(render).catch(function (err) {
        if (err && err.__render) return;
        falha("Não foi possível carregar os dados (" + err.message + ").");
      });
    });
  }

  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", boot); }
  else { boot(); }
})();
