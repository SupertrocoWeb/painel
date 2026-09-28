/* ===================================================================
   Hub de CRMs Supertroco — painel da LP da RD Station
   -------------------------------------------------------------------
   Nao cole este arquivo direto na RD. Rode o gerar_hub.py e cole o
   COLAR_NA_RD.html, que e um carregador curto e busca este arquivo
   publicado no GitHub.

   Duas telas: o Hub (consolidado de todos os parceiros) e o CRM de
   cada parceiro, com o tema da marca dele. Cada tela tem:
     - Visao geral e Visao mes a mes (os meses vem do hub.json: mes
       novo aparece sozinho, sem mexer aqui);
     - modo noturno;
     - os canais E-mail (RD Station) e WhatsApp;
     - o cronograma de disparos do proximo mes, protegido por senha,
       com download em XLSX e PDF.
   =================================================================== */
(function () {
  "use strict";

  var HUB_URL = "https://raw.githubusercontent.com/SupertrocoWeb/painel/main/hub.json";
  var HUB_URL_FALLBACK = "https://cdn.jsdelivr.net/gh/SupertrocoWeb/painel@main/hub.json";

  // Bibliotecas de exportacao: so sao baixadas quando alguem pede o arquivo.
  var LIBS = {
    xlsx: { global: "ExcelJS", urls: [
      "https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js"] },
    pdf: { global: "jspdf", urls: [
      "https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"] }
  };

  // Senha do cronograma: o codigo guarda so um hash (FNV-1a), nao o numero.
  // E uma trava de conveniencia — quem precisa de sigilo de verdade nao
  // deve publicar os dados num JSON aberto.
  var SENHA_HASH = 55505968;

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
  var DOM_SAB = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  var MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho",
               "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  var CSS = `
  :host{ all:initial; display:block; }
  *{box-sizing:border-box;margin:0;padding:0}
  .app{
    --brand:#15B8B6; --brand-lite:#5DD9D7; --deep:#0C3035; --deep2:#0A2429;
    --accent:#F2A93B; --accent-lite:#FFD479; --bg:#EEF4F5; --soft:#F5FBFA;
    --ink:#123A41; --line:#E2ECEE; --card:#fff;
    --ink2:#2C555C; --muted:#5F7C83; --muted2:#7F969C;
    --track:#E9F0F1; --seg:#E7EFF0;
    --r0:#D0F1F0; --r1:#15B8B6; --r2:#119391; --r3:#0D7271; --r4:#0A5352;
    --pos:#12A971; --neg:#D9573A;
    --warn-bg:#FDF6E7; --warn-ink:#865A0C; --warn-line:#F1E1BD;
    --mail:#2A78D6; --wpp:#1BAF7A; --mail-bg:#E3EEFB; --wpp-bg:#DDF3E8;
    --mail-ink:#1B4F8F; --wpp-ink:#11704D;
    --disp:'Plus Jakarta Sans',system-ui,sans-serif; --body:'Inter',system-ui,sans-serif;
    --sh:0 1px 2px rgba(11,45,49,.04), 0 4px 16px rgba(11,45,49,.05);
    --sh-lg:0 10px 30px rgba(11,45,49,.13);
    color-scheme:light;
    display:block;background:var(--bg);color:var(--ink);font-family:var(--body);
    font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased;
    text-align:left;max-width:100%;min-height:100vh;
    transition:background-color .45s ease;
  }
  .app.escuro{
    color-scheme:dark;
    --sh:0 1px 2px rgba(0,0,0,.35), 0 6px 20px rgba(0,0,0,.28);
    --sh-lg:0 14px 36px rgba(0,0,0,.5);
    --warn-bg:rgba(242,169,59,.12); --warn-ink:#F4C675; --warn-line:rgba(242,169,59,.32);
    --mail:#3987E5; --wpp:#199E70; --mail-bg:rgba(57,135,229,.17); --wpp-bg:rgba(25,158,112,.2);
    --mail-ink:#A4C8F4; --wpp-ink:#86DDB8; --pos:#3DD598; --neg:#FF8A6B;
  }
  .app.trocando *, .app.trocando{transition:background-color .4s ease,color .4s ease,
    border-color .4s ease,fill .4s ease,stroke .4s ease !important}
  .wrap{max-width:1500px;margin:0 auto;padding:0 26px 40px;min-width:0}
  button{font:inherit}
  button:focus-visible,input:focus-visible,[tabindex]:focus-visible{outline:2px solid var(--brand);outline-offset:2px}

  /* ---------- transicoes ---------- */
  .tela{opacity:0;transform:translateY(8px);transition:opacity .3s ease,transform .3s ease}
  .tela.on{opacity:1;transform:none}
  .conteudo{transition:opacity .22s ease,transform .22s ease}
  .conteudo.saindo{opacity:0;transform:translateY(6px)}

  /* ---------- topo ---------- */
  .topo{display:flex;align-items:center;gap:16px;padding:22px 0 12px;flex-wrap:wrap}
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
  .btn{border:1px solid var(--line);background:var(--card);font-size:12.5px;
    color:var(--ink2);padding:8px 13px;border-radius:10px;cursor:pointer;display:inline-flex;
    align-items:center;gap:7px;transition:.18s;white-space:nowrap}
  .btn:hover{border-color:var(--brand);color:var(--brand)}
  .btn svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2.2}
  .btn.volta:hover{transform:translateX(-2px)}
  .btn.crono{background:var(--deep);color:#fff;border-color:transparent;font-weight:600}
  .app.escuro .btn.crono{background:var(--brand);color:#06201f}
  .btn.crono:hover{filter:brightness(1.12);color:#fff}
  .app.escuro .btn.crono:hover{color:#06201f}
  .tbtn{width:37px;height:37px;border-radius:10px;border:1px solid var(--line);background:var(--card);
    color:var(--ink2);display:inline-grid;place-items:center;cursor:pointer;box-shadow:var(--sh);transition:.18s}
  .tbtn:hover{border-color:var(--brand);color:var(--brand)}
  .tbtn svg{width:17px;height:17px;stroke:currentColor;fill:none;stroke-width:2}

  /* ---------- navegacao: visao geral / mes a mes ---------- */
  .nav{margin:6px 0 14px}
  .nav-bts{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
  .nv{border:1px solid var(--line);background:var(--card);font-size:13px;color:var(--muted);
    padding:9px 15px;border-radius:11px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;
    transition:background-color .2s,border-color .2s,color .2s;box-shadow:var(--sh)}
  .nv svg{width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2}
  .nv:hover{color:var(--ink);border-color:var(--brand)}
  .nv.on{background:var(--brand);border-color:var(--brand);color:#fff;font-weight:600}
  .nv .chev{transition:transform .3s ease}
  .nv.aberto .chev{transform:rotate(180deg)}
  .nv .sel{font-weight:700;padding-left:9px;margin-left:1px;border-left:1px solid rgba(255,255,255,.45)}
  .nv .ponto{width:7px;height:7px;border-radius:50%;background:var(--accent)}
  .meses{display:flex;gap:7px;flex-wrap:wrap;overflow:hidden;max-height:0;opacity:0;margin-top:0;
    transform:translateY(-6px);pointer-events:none;
    transition:max-height .35s ease,opacity .3s ease,transform .3s ease,margin-top .3s ease}
  .meses.on{max-height:180px;opacity:1;transform:none;pointer-events:auto;margin-top:10px}
  .mes{border:1px solid var(--line);background:var(--card);font-size:12.5px;color:var(--ink2);
    padding:8px 13px;border-radius:10px;cursor:pointer;display:inline-flex;align-items:center;gap:7px;
    transition:.18s}
  .mes:hover{border-color:var(--brand);color:var(--ink)}
  .mes.on{background:var(--soft);border-color:var(--brand);color:var(--ink);font-weight:600;
    box-shadow:inset 0 0 0 1px var(--brand)}
  .mes .tag{font-size:10px;color:var(--muted);background:var(--track);border-radius:999px;padding:1px 7px;font-weight:500}
  .mes .tag.novo{background:var(--accent);color:#3A2600;font-weight:700}
  .meses .vazio-m{font-size:12px;color:var(--muted);padding:8px 2px}

  /* ---------- esteira (ticker) ---------- */
  .ticker{background:var(--deep);border-radius:14px;overflow:hidden;position:relative;
    margin-bottom:16px;transition:background .45s ease}
  .app.escuro .ticker{box-shadow:inset 0 0 0 1px rgba(255,255,255,.07)}
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
  .app.escuro .bn .c.destaque{box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)}
  .bn .c.destaque .r{color:#9FC2C4} .bn .c.destaque .v{color:#fff}
  .bn .c.destaque .s{color:#8DB5B7}
  .bn .r{font-size:11.5px;color:var(--muted);font-weight:500}
  .bn .v{font-family:var(--disp);font-weight:800;letter-spacing:-.025em;
    font-size:clamp(18px,3.2vw,28px);
    margin-top:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .bn .v.nd{color:var(--muted2);font-size:clamp(15px,2.2vw,19px);font-weight:700}
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
  .legenda{font-size:11px;color:var(--muted);display:flex;gap:14px;align-items:center;
    margin-top:12px;flex-wrap:wrap}
  .legenda i{display:inline-block;width:9px;height:9px;border-radius:3px;margin-right:5px;vertical-align:-1px}
  .legenda b{color:var(--ink)}

  /* ---------- cards de parceiro ---------- */
  .parc{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));gap:14px}
  .pc{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:0;
    box-shadow:var(--sh);cursor:pointer;overflow:hidden;transition:transform .2s ease,box-shadow .2s ease;
    display:flex;flex-direction:column;min-width:0;text-align:left;color:inherit}
  .pc:hover{transform:translateY(-3px);box-shadow:var(--sh-lg)}
  .pc.apagado{opacity:.62}
  .pc .faixa{height:5px}
  .pc .corpo{padding:16px 18px 18px;display:flex;flex-direction:column;gap:12px;flex:1}
  .pc .cab{display:flex;align-items:center;gap:11px}
  .pc .cab span{min-width:0}
  .pc .ini{width:38px;height:38px;border-radius:11px;display:grid;place-items:center;
    font-family:var(--disp);font-weight:800;font-size:15px;color:#fff;flex:0 0 auto}
  .pc .nm{display:block;font-family:var(--disp);font-weight:700;font-size:15.5px;letter-spacing:-.01em}
  .pc .sg{font-size:11.5px;color:var(--muted)}
  .pc .modelo{margin-left:auto;font-size:10px;font-weight:600;padding:3px 9px;border-radius:999px;
    background:var(--track);color:var(--ink2);white-space:nowrap}
  .pc .grid{display:grid;grid-template-columns:1fr 1fr;gap:10px 8px;margin-top:2px}
  .pc .gi{min-width:0}
  .pc .gi .r{display:block;font-size:10.5px;color:var(--muted)}
  .pc .gi .v{display:block;font-family:var(--disp);font-weight:700;font-size:16px;margin-top:2px;
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .pc .canais-mini{display:flex;gap:6px;flex-wrap:wrap}
  .cm{display:inline-flex;align-items:center;gap:5px;font-size:10.5px;padding:3px 9px;border-radius:999px;font-weight:500}
  .cm svg{width:11px;height:11px}
  .cm.mail{background:var(--mail-bg);color:var(--mail-ink)}
  .cm.wpp{background:var(--wpp-bg);color:var(--wpp-ink)}
  .cm.off{background:var(--track);color:var(--muted)}
  .pc .rodape{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;
    margin-top:auto;padding-top:12px;border-top:1px solid var(--line);font-size:11.5px;color:var(--muted)}
  .pc .abrir{display:inline-flex;align-items:center;gap:5px;font-weight:600}
  .pc .abrir svg{width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2.4}
  .tag-aviso{display:inline-block;flex:0 0 auto;font-size:9.5px;font-weight:600;padding:3px 9px;
    border-radius:999px;background:var(--warn-bg);color:var(--warn-ink);border:1px solid var(--warn-line);
    white-space:nowrap;line-height:1.4}

  /* ---------- participacao ---------- */
  .part{display:flex;flex-direction:column;gap:13px;margin-top:2px}
  .pl .h{display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:6px;gap:8px}
  .pl .h b{font-family:var(--disp)}
  .pl .t{display:block;height:12px;background:var(--track);border-radius:7px;overflow:hidden}
  .pl .f{display:block;height:100%;border-radius:7px;transition:width .7s cubic-bezier(.3,1,.4,1)}

  /* ---------- KPIs do CRM ---------- */
  .kpis{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;margin-top:4px}
  .kpis.k4{grid-template-columns:repeat(4,minmax(0,1fr))}
  .kpi{background:var(--card);border:1px solid var(--line);border-radius:13px;
    padding:13px 15px;box-shadow:var(--sh);min-width:0}
  .kpi.star{border-color:var(--brand);background:var(--soft)}
  .kpi .top{display:flex;align-items:center;justify-content:space-between;gap:6px}
  .kpi .lbl{font-size:11.5px;color:var(--muted);font-weight:500;overflow:hidden;
    text-overflow:ellipsis;white-space:nowrap}
  .src{width:7px;height:7px;border-radius:50%;flex:0 0 auto;display:inline-block}
  .src.res{background:var(--brand)} .src.rd{background:var(--accent)} .src.wp{background:var(--wpp)}
  .kpi .v{font-family:var(--disp);font-weight:700;font-size:21px;letter-spacing:-.02em;
    margin-top:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .kpi .v.nd{color:var(--muted2)}
  .kpi .sub{font-size:10.5px;color:var(--muted2);margin-top:2px;white-space:normal;line-height:1.4}
  .kpi .alerta{font-size:9.5px;color:var(--warn-ink);background:var(--warn-bg);border:1px solid var(--warn-line);
    border-radius:6px;padding:3px 7px;margin-top:7px;max-width:100%;white-space:normal;line-height:1.35}
  .kleg{display:flex;gap:16px;flex-wrap:wrap;font-size:11px;color:var(--muted);margin-top:10px}
  .kleg span{display:inline-flex;align-items:center;gap:6px}

  .seg{display:inline-flex;background:var(--seg);border-radius:9px;padding:3px;gap:2px;max-width:100%;overflow-x:auto}
  .seg button{border:0;background:transparent;font-size:12px;color:var(--muted);
    padding:6px 11px;border-radius:7px;cursor:pointer;transition:.15s;white-space:nowrap}
  .seg button.on{background:var(--card);color:var(--ink);font-weight:600;box-shadow:0 1px 3px rgba(11,45,49,.12)}

  /* ---------- graficos ---------- */
  .chart{position:relative}
  .chart svg{width:100%;height:auto;display:block;overflow:visible}
  .gline{stroke:var(--line);stroke-width:1}
  .glabel{fill:var(--muted2);font-size:10px;font-family:var(--body)}
  .xlabel{fill:var(--muted);font-size:10px;font-family:var(--body);text-anchor:middle}
  .lpath{fill:none;stroke:var(--brand);stroke-width:2.2;stroke-linejoin:round;stroke-linecap:round}
  .pt{fill:var(--card);stroke:var(--brand);stroke-width:2}
  .pt.hit{fill:var(--accent);stroke:var(--card);stroke-width:2}
  .hitzone{fill:transparent;cursor:pointer}
  .hitzone:hover{fill:var(--brand);fill-opacity:.07}
  .col{fill:var(--brand)} .col.hit{fill:var(--r3)}
  .mk-mail{fill:var(--accent);stroke:var(--card);stroke-width:2}
  .mk-wpp{fill:var(--wpp);stroke:var(--card);stroke-width:2}

  .wbars{display:flex;align-items:flex-end;gap:10px;height:190px;padding-top:10px;min-width:0}
  .wcol{flex:1 1 0;min-width:0;display:flex;flex-direction:column;align-items:center;
    justify-content:flex-end;height:100%;gap:7px;position:relative;padding-top:14px;cursor:default}
  .wcol .wbar{display:block;width:100%;max-width:62px;border-radius:8px 8px 4px 4px;
    background:linear-gradient(180deg,var(--brand-lite),var(--brand));min-height:4px;
    transition:height .6s cubic-bezier(.3,1,.4,1)}
  .wcol:hover .wbar{filter:brightness(1.08)}
  .wcol .wv{font-family:var(--disp);font-weight:700;font-size:12px;white-space:nowrap}
  .wcol .wl{font-size:10px;color:var(--muted);text-align:center;white-space:nowrap;
    overflow:hidden;text-overflow:ellipsis;max-width:100%}
  .wcol .wdot{position:absolute;top:0;width:7px;height:7px;border-radius:50%;
    background:var(--accent);box-shadow:0 0 0 3px rgba(242,169,59,.22)}

  .versus{display:flex;flex-direction:column;gap:14px}
  .vs .h{display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:6px;gap:8px}
  .vs .h b{font-family:var(--disp)}
  .vs .t{display:block;height:11px;background:var(--track);border-radius:6px;overflow:hidden}
  .vs .f{display:block;height:100%;border-radius:6px;transition:width .6s cubic-bezier(.3,1,.4,1)}
  .vs .f.eng{background:linear-gradient(90deg,var(--brand),var(--brand-lite))}
  .vs .f.des{background:var(--neg)}
  .vs .f.pico{background:linear-gradient(90deg,var(--r3),var(--brand))}
  .tagbox{background:var(--soft);border:1px solid var(--line);border-radius:10px;
    padding:11px 13px;font-size:12.5px;color:var(--ink2);line-height:1.55}

  .week{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px;align-items:end;height:140px}
  .week.baixa{height:104px}
  .wd{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;
    height:100%;gap:5px;min-width:0;cursor:default}
  .wd .b{display:block;width:100%;border-radius:6px 6px 3px 3px;background:var(--track);min-height:4px;
    transition:height .6s cubic-bezier(.3,1,.4,1)}
  .wd.has .b{background:linear-gradient(180deg,var(--brand-lite),var(--brand))}
  .wd.best .b{background:linear-gradient(180deg,var(--accent-lite),var(--accent))}
  .wd .v{font-family:var(--disp);font-weight:600;font-size:10.5px;color:var(--ink2);white-space:nowrap}
  .wd .n{font-size:10px;color:var(--muted)}
  .wd.best .n{color:var(--ink);font-weight:700}

  .track{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:5px;height:150px}
  .slot{border-radius:9px;background:var(--track);position:relative;display:flex;flex-direction:column;
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

  /* ---------- argola (funil em anel) ---------- */
  .argola{display:flex;flex-direction:column;align-items:center;gap:10px;margin-top:4px}
  .argola svg{width:100%;max-width:200px;height:auto;display:block;overflow:visible}
  .ar-s{cursor:pointer;transition:opacity .2s ease;outline:none}
  .argola.foco .ar-s{opacity:.25}
  .argola.foco .ar-s.on{opacity:1}
  .ar-v{font-family:var(--disp);font-weight:800;font-size:24px;fill:var(--ink);text-anchor:middle}
  .ar-l{font-family:var(--body);font-size:10.5px;fill:var(--muted);text-anchor:middle}
  .ar-leg{width:100%;display:flex;flex-direction:column}
  .ar-row{display:grid;grid-template-columns:10px minmax(0,1fr) auto auto;gap:9px;align-items:center;
    padding:7px 6px;border-bottom:1px solid var(--line);font-size:12px;border-radius:7px;transition:background .15s}
  .ar-row:last-child{border-bottom:none}
  .ar-row.on{background:var(--soft)}
  .ar-row .sw{width:10px;height:10px;border-radius:3px}
  .ar-row .p{color:var(--muted);font-size:11px;text-align:right;font-variant-numeric:tabular-nums}
  .ar-row .vv{font-family:var(--disp);font-weight:700;text-align:right;min-width:48px;font-variant-numeric:tabular-nums}
  .ar-conv{font-size:11px;color:var(--muted);line-height:1.6;width:100%;padding-top:2px}
  .ar-conv b{color:var(--ink);font-family:var(--disp)}
  .ar-nota{font-size:10px;color:var(--muted2);width:100%}
  .argola.fantasma .ar-s{fill:var(--track)}

  /* ---------- canais ---------- */
  .canais{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
  .canal{text-align:left;color:inherit;background:var(--card);border:1.5px solid var(--line);border-radius:14px;
    padding:14px 16px;cursor:pointer;display:flex;gap:13px;align-items:flex-start;transition:.2s;position:relative;min-width:0}
  .canal:hover{border-color:var(--brand)}
  .canal.on{border-color:var(--brand);background:var(--soft)}
  .canal.on::after{content:"";position:absolute;left:50%;bottom:-9px;width:14px;height:14px;
    background:var(--soft);border-right:1.5px solid var(--brand);border-bottom:1.5px solid var(--brand);
    transform:translateX(-50%) rotate(45deg)}
  .canal .ic{width:40px;height:40px;border-radius:11px;display:grid;place-items:center;flex:0 0 auto}
  .canal .ic svg{width:21px;height:21px}
  .ic.mail{background:var(--mail-bg);color:var(--mail)}
  .ic.wpp{background:var(--wpp-bg);color:var(--wpp)}
  .canal .tx{min-width:0;flex:1}
  .canal .t{display:block;font-family:var(--disp);font-weight:700;font-size:14.5px;padding-right:96px}
  .canal .s{display:block;font-size:11.5px;color:var(--muted);margin-top:2px}
  .canal .ns{display:flex;gap:16px;flex-wrap:wrap;margin-top:9px}
  .canal .ns b{display:block;font-family:var(--disp);font-size:15px}
  .canal .ns span{font-size:10.5px;color:var(--muted)}
  .st{display:inline-block;font-size:10px;font-weight:600;padding:3px 9px;border-radius:999px;white-space:nowrap;line-height:1.4}
  .canal .st{position:absolute;top:13px;right:13px}
  .st.ok{background:var(--wpp-bg);color:var(--wpp-ink)}
  .st.mail{background:var(--mail-bg);color:var(--mail-ink)}
  .st.pronto{background:var(--warn-bg);color:var(--warn-ink);border:1px solid var(--warn-line)}
  .canal-det{margin-top:16px;transition:opacity .22s ease,transform .22s ease}
  .canal-det.saindo{opacity:0;transform:translateY(5px)}
  .fantasma-bloco{position:relative}
  .fantasma-bloco .fx{opacity:.38;filter:grayscale(1);pointer-events:none}
  .fantasma-bloco .selo-f{position:absolute;inset:0;display:grid;place-items:center;text-align:center;
    font-size:12px;color:var(--ink2);font-weight:600;padding:12px}
  .fantasma-bloco .selo-f span{background:var(--card);border:1px dashed var(--line);border-radius:10px;padding:7px 12px;box-shadow:var(--sh)}
  .aviso-canal{display:flex;gap:14px;align-items:flex-start;background:var(--warn-bg);border:1px dashed var(--warn-line);
    border-radius:13px;padding:14px 16px;margin-top:13px;font-size:12.5px;color:var(--ink2);line-height:1.6}
  .aviso-canal svg{width:20px;height:20px;flex:0 0 auto;color:var(--warn-ink);margin-top:1px}
  .aviso-canal b{color:var(--ink)}
  .aviso-canal code{font-family:ui-monospace,Consolas,monospace;font-size:11.5px;background:var(--card);
    border:1px solid var(--line);border-radius:6px;padding:1px 6px;overflow-wrap:anywhere}
  .nota-ia{display:flex;gap:10px;align-items:flex-start;margin-top:13px;font-size:12.5px;color:var(--ink2);
    background:var(--soft);border:1px solid var(--line);border-radius:12px;padding:11px 13px;line-height:1.55}
  .nota-ia svg{width:15px;height:15px;fill:var(--brand);flex:0 0 auto;margin-top:2px}
  .rank{display:flex;flex-direction:column;gap:8px;margin-top:4px}
  .rk{display:grid;grid-template-columns:62px minmax(0,1fr) 74px;gap:9px;align-items:center;font-size:12px}
  .rk .n1{color:var(--muted);white-space:nowrap}
  .rk .n1 b{color:var(--ink);font-family:var(--disp);display:block;font-size:12.5px}
  .rk .bt{display:block;height:18px;background:var(--track);border-radius:6px;overflow:hidden}
  .rk .bf{display:block;height:100%;border-radius:6px;background:linear-gradient(90deg,var(--wpp),#52C99A);min-width:3px}
  .rk .bf.res{background:linear-gradient(90deg,var(--r3),var(--brand))}
  .rk .vv{text-align:right;font-family:var(--disp);font-weight:700;font-size:12px;white-space:nowrap}

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
  .app.escuro .pill.yes{color:var(--brand-lite)}
  .pill.wpp{background:var(--wpp-bg);color:var(--wpp-ink)}
  .pill.no{background:var(--track);color:var(--muted)}
  .cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,164px),1fr));gap:10px}
  .dcard{border:1px solid var(--line);border-radius:12px;padding:11px 12px;background:var(--card);min-width:0}
  .dcard.hit{background:var(--soft)}
  .dcard .d1{display:flex;align-items:center;justify-content:space-between;gap:6px;font-size:11.5px;color:var(--muted)}
  .dcard .dv{font-family:var(--disp);font-weight:700;font-size:18px;margin:5px 0 2px;letter-spacing:-.02em}
  .dcard .d2{font-size:10.5px;color:var(--muted2);display:flex;justify-content:space-between;gap:5px;
    padding-top:6px;margin-top:6px;border-top:1px solid var(--line)}
  .dcard .dot{width:7px;height:7px;border-radius:50%;background:var(--accent);flex:0 0 auto}
  .dcard .dot.w{background:var(--wpp)}
  .bars{display:flex;flex-direction:column;gap:6px}
  .brow{display:grid;grid-template-columns:48px minmax(0,1fr) 96px;gap:9px;align-items:center;font-size:12.5px}
  .brow .bn2{color:var(--muted);white-space:nowrap}
  .brow.hit .bn2{color:var(--ink);font-weight:600}
  .brow .bt{display:block;height:20px;background:var(--track);border-radius:6px;overflow:hidden}
  .brow .bf{display:block;height:100%;border-radius:6px;min-width:2px;
    background:linear-gradient(90deg,var(--brand),var(--brand-lite));transition:width .6s cubic-bezier(.3,1,.4,1)}
  .brow.hit .bf{background:linear-gradient(90deg,var(--accent),var(--accent-lite))}
  .brow .bv{font-family:var(--disp);font-weight:600;text-align:right;color:var(--ink2);font-size:12px;white-space:nowrap}
  .vazio{color:var(--muted);font-size:13px;padding:26px 0;text-align:center;line-height:1.6}

  /* ---------- IA ---------- */
  .ia{background:linear-gradient(155deg,var(--deep),var(--deep2));color:#DCEFEF;border-radius:16px;
    padding:22px 25px;margin-top:13px;box-shadow:var(--sh);transition:background .45s ease}
  .app.escuro .ia{box-shadow:inset 0 0 0 1px rgba(255,255,255,.07)}
  .ia .hd{display:flex;align-items:center;gap:11px;margin-bottom:14px;flex-wrap:wrap}
  .ia .sp{width:27px;height:27px;border-radius:9px;background:var(--brand);display:grid;place-items:center;flex:0 0 auto}
  .ia .sp svg{width:15px;height:15px;fill:#fff}
  .ia h3{font-family:var(--disp);font-weight:700;font-size:15px;color:#fff}
  .ia .mod{margin-left:auto;font-size:10.5px;color:#8DB5B7;border:1px solid rgba(255,255,255,.14);
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
  .rodape-hub{margin-top:26px;padding:18px 0 4px;border-top:1px solid var(--line);
    display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}
  .rodape-hub .p{font-family:var(--disp);font-weight:600;font-size:12px;color:var(--ink2);
    display:inline-flex;align-items:center;gap:8px}
  .rodape-hub .p .d{width:5px;height:5px;border-radius:50%;background:var(--brand)}
  .rodape-hub .f{font-size:11px;color:var(--muted2);line-height:1.7}
  .carregando{color:var(--muted);font-size:13px;padding:60px 0;text-align:center}

  /* ---------- dica flutuante ---------- */
  .tip{position:fixed;z-index:2147483600;pointer-events:none;background:#0B2427;color:#fff;border-radius:9px;
    padding:8px 11px;font-size:11.5px;line-height:1.45;box-shadow:0 8px 24px rgba(0,0,0,.28);
    opacity:0;transform:translateY(4px);transition:opacity .12s ease,transform .12s ease;max-width:270px;
    font-family:var(--body)}
  .tip.on{opacity:1;transform:none}
  .tip b{display:block;font-family:var(--disp);font-size:13.5px;font-weight:700}
  .tip span{display:block;color:#BFDCDD}

  /* ---------- modal do cronograma ---------- */
  .modal{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:18px;
    background:rgba(4,16,19,.58);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);
    opacity:0;visibility:hidden;transition:opacity .25s ease,visibility 0s linear .25s}
  .modal.on{opacity:1;visibility:visible;transition:opacity .25s ease,visibility 0s}
  .mbox{background:var(--card);color:var(--ink);border-radius:18px;box-shadow:0 30px 80px rgba(0,0,0,.35);
    width:min(1200px,100%);max-height:calc(100vh - 36px);overflow:auto;transform:translateY(14px) scale(.985);
    transition:transform .3s cubic-bezier(.3,1,.4,1);border:1px solid var(--line)}
  .modal.on .mbox{transform:none}
  .mbox.estreito{width:min(440px,100%)}
  .mbox.medio{width:min(760px,100%)}
  .mhd{display:flex;align-items:center;gap:12px;padding:16px 20px;border-bottom:1px solid var(--line);
    position:sticky;top:0;background:var(--card);z-index:3}
  .mhd .ic{width:36px;height:36px;border-radius:10px;background:var(--soft);color:var(--brand);display:grid;place-items:center;flex:0 0 auto}
  .mhd .ic svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2}
  .mhd h3{font-family:var(--disp);font-weight:800;font-size:16.5px;letter-spacing:-.01em;line-height:1.2}
  .mhd .sub{font-size:11.5px;color:var(--muted)}
  .mhd .acoes{margin-left:auto;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  .mcorpo{padding:20px 22px 24px}
  .mcorpo.centro{text-align:center}
  .cadeado{width:60px;height:60px;border-radius:17px;background:var(--soft);display:grid;place-items:center;
    margin:2px auto 12px;color:var(--brand)}
  .cadeado svg{width:28px;height:28px;stroke:currentColor;fill:none;stroke-width:2}
  .mcorpo h4{font-family:var(--disp);font-weight:800;font-size:18px}
  .mcorpo .exp{font-size:12.5px;color:var(--muted);margin-top:4px;line-height:1.5}
  .pin{display:flex;gap:10px;justify-content:center;margin:18px 0 8px}
  .pin input{width:54px;height:62px;text-align:center;font-family:var(--disp);font-size:26px;font-weight:700;
    border:1.5px solid var(--line);border-radius:13px;background:var(--bg);color:var(--ink);caret-color:var(--brand)}
  .pin input:focus{outline:none;border-color:var(--brand);background:var(--card)}
  .pin.erro{animation:treme .42s ease}
  .pin.erro input{border-color:var(--neg)}
  @keyframes treme{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(7px)}
    60%{transform:translateX(-5px)}80%{transform:translateX(3px)}}
  .msg-erro{color:var(--neg);font-size:12px;min-height:18px;margin-bottom:8px}
  .btn-pri{background:var(--deep);color:#fff;border:none;font-weight:600;font-size:14px;padding:12px 20px;
    border-radius:12px;cursor:pointer;display:inline-flex;gap:8px;align-items:center;justify-content:center;transition:.18s}
  .app.escuro .btn-pri{background:var(--brand);color:#06201F}
  .btn-pri:hover{filter:brightness(1.07)}
  .btn-pri[disabled]{opacity:.55;cursor:progress}
  .btn-pri svg,.btn-sec svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2.2}
  .btn-sec{background:var(--card);color:var(--ink);border:1px solid var(--line);font-weight:600;font-size:13px;
    padding:10px 15px;border-radius:11px;cursor:pointer;display:inline-flex;gap:7px;align-items:center;transition:.18s}
  .btn-sec:hover{border-color:var(--brand);color:var(--brand)}
  .btn-sec[disabled]{opacity:.55;cursor:progress}
  .passo{font-size:11px;font-weight:700;color:var(--brand);text-transform:uppercase;letter-spacing:.06em}
  .opcoes{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:10px}
  .op{border:1.5px solid var(--line);border-radius:14px;padding:16px;cursor:pointer;background:var(--card);
    text-align:left;color:inherit;display:flex;flex-direction:column;gap:8px;transition:.18s;position:relative}
  .op:hover{border-color:var(--brand)}
  .op.on{border-color:var(--brand);background:var(--soft);box-shadow:inset 0 0 0 1px var(--brand)}
  .op .ok{position:absolute;top:12px;right:12px;width:20px;height:20px;border-radius:50%;border:1.5px solid var(--line);
    display:grid;place-items:center;background:var(--card)}
  .op.on .ok{background:var(--brand);border-color:var(--brand)}
  .op .ok svg{width:11px;height:11px;stroke:#fff;fill:none;stroke-width:3.2;opacity:0}
  .op.on .ok svg{opacity:1}
  .op .ics{display:flex;gap:6px}
  .op .ics span{width:34px;height:34px;border-radius:10px;display:grid;place-items:center}
  .op .ics svg{width:18px;height:18px}
  .op .t{font-family:var(--disp);font-weight:700;font-size:14.5px}
  .op .d{font-size:11.5px;color:var(--muted);line-height:1.45}
  .op .n{font-size:11.5px;color:var(--ink2);margin-top:auto;padding-top:8px;border-top:1px solid var(--line)}
  .op .n b{font-family:var(--disp)}
  .campos{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:16px;
    transition:opacity .25s ease}
  .campos[hidden]{display:none}
  .campo label{display:block;font-size:11.5px;color:var(--muted);margin-bottom:5px;font-weight:500}
  .campo input{width:100%;font:inherit;font-size:14px;padding:10px 12px;border:1px solid var(--line);
    border-radius:10px;background:var(--bg);color:var(--ink)}
  .campo input:focus{outline:none;border-color:var(--brand);background:var(--card)}
  .campo .aj{font-size:10.5px;color:var(--muted2);margin-top:4px;line-height:1.4}
  .rodape-m{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:20px;flex-wrap:wrap}
  .rodape-m .i{font-size:11.5px;color:var(--muted);max-width:60ch;line-height:1.5}
  .cr-res{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
  .cr-res .kpi{box-shadow:none}
  .cr-est{background:linear-gradient(155deg,var(--deep),var(--deep2));color:#E4F4F4;border-radius:14px;
    padding:16px 18px;margin-top:12px;font-size:13px;line-height:1.6}
  .cr-est .hd{display:flex;align-items:center;gap:9px;margin-bottom:8px;font-family:var(--disp);font-weight:700;color:#fff;font-size:13.5px}
  .cr-est .hd svg{width:14px;height:14px;fill:var(--brand-lite)}
  .cr-est .nota{margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,.12);color:#C9E2E3;font-size:12.5px}
  .cr-est ul{list-style:none;margin-top:8px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px 18px}
  .cr-est li{font-size:12px;color:#CFE6E6;padding-left:14px;position:relative;line-height:1.5}
  .cr-est li::before{content:"";position:absolute;left:0;top:8px;width:5px;height:5px;border-radius:2px;background:var(--brand-lite)}
  details.porque{margin-top:10px}
  details.porque summary{cursor:pointer;font-size:12px;color:#BFE3E3;font-weight:600;list-style:none;display:inline-flex;gap:6px;align-items:center}
  details.porque summary::-webkit-details-marker{display:none}
  .cr-grade{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:14px;margin-top:14px;align-items:start}
  .cal-hd{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
  .cal-hd h4{font-family:var(--disp);font-weight:700;font-size:14.5px}
  .leg-c{display:flex;gap:12px;flex-wrap:wrap;font-size:11px;color:var(--muted)}
  .leg-c span{display:inline-flex;align-items:center;gap:6px}
  .leg-c i{width:10px;height:10px;border-radius:3px;display:inline-block}
  .cal{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px;margin-top:10px}
  .cal .cab{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;text-align:center;padding:2px 0;font-weight:600}
  .cal .dia{min-height:112px;border:1px solid var(--line);border-radius:11px;padding:7px;background:var(--card);
    display:flex;flex-direction:column;gap:4px;cursor:pointer;transition:border-color .15s,box-shadow .15s;text-align:left;color:inherit;min-width:0}
  .cal .dia:hover{border-color:var(--brand)}
  .cal .dia.on{border-color:var(--brand);box-shadow:inset 0 0 0 1px var(--brand);background:var(--soft)}
  .cal .dia.fora{background:transparent;border-style:dashed;opacity:.35;cursor:default}
  .cal .dia.livre .dn{color:var(--muted2)}
  .cal .dn{font-family:var(--disp);font-weight:700;font-size:13px;display:flex;justify-content:space-between;align-items:center;gap:4px}
  .cal .dn .fer{font-size:9px;font-weight:600;color:var(--neg)}
  .cal .ft{font-size:9.5px;color:var(--warn-ink);background:var(--warn-bg);border-radius:5px;padding:1px 5px;line-height:1.35;
    overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .cal .tm{font-size:10.5px;font-weight:600;color:var(--ink2);line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;
    -webkit-box-orient:vertical;overflow:hidden}
  .sc{display:flex;align-items:center;gap:5px;font-size:10px;border-radius:6px;padding:3px 6px;line-height:1.25;min-width:0}
  .sc span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .sc.email{background:var(--mail-bg);color:var(--mail-ink);box-shadow:inset 3px 0 0 var(--mail)}
  .sc.whatsapp{background:var(--wpp-bg);color:var(--wpp-ink);box-shadow:inset 3px 0 0 var(--wpp)}
  .sc .pd{width:7px;height:7px;border-radius:50%;flex:0 0 auto}
  .sc svg{width:11px;height:11px;flex:0 0 auto}
  .cr-det{border:1px solid var(--line);border-radius:14px;padding:15px 16px;background:var(--card);position:sticky;top:78px}
  .cr-det h5{font-family:var(--disp);font-weight:800;font-size:15px}
  .cr-det .fts{display:flex;flex-direction:column;gap:4px;margin-top:8px}
  .cr-det .it{border-top:1px solid var(--line);padding-top:10px;margin-top:10px}
  .cr-det .it .cn{display:flex;align-items:center;gap:7px;font-weight:700;font-size:12.5px;font-family:var(--disp)}
  .cr-det .it .cn .bdg{margin-left:auto;font-size:10px;font-weight:600;font-family:var(--body);color:var(--muted)}
  .cr-det .it dl{display:grid;grid-template-columns:auto minmax(0,1fr);gap:4px 10px;font-size:11.5px;margin-top:7px}
  .cr-det .it dt{color:var(--muted)}
  .cr-det .it dd{color:var(--ink);word-break:break-word}
  .cr-det .it .msg{margin-top:7px;font-size:12px;background:var(--bg);border-radius:10px;padding:9px 11px;line-height:1.5;color:var(--ink2)}
  .cr-det .vazio-d{font-size:12.5px;color:var(--muted);line-height:1.6}
  .cr-lista{display:none;margin-top:12px}
  .cr-lista .li{border:1px solid var(--line);border-radius:12px;padding:11px 12px;margin-bottom:8px}
  .cr-lista .li .dn{font-family:var(--disp);font-weight:700;font-size:13px}
  .cr-lista .li .tm{font-size:12px;color:var(--ink2);margin:3px 0 6px}
  .cr-lista .li .sc{margin-top:4px}
  .aviso-inline{font-size:11.5px;color:var(--warn-ink);background:var(--warn-bg);border:1px solid var(--warn-line);
    border-radius:9px;padding:7px 10px;margin-top:10px;line-height:1.45}
  .toast{position:fixed;left:50%;bottom:24px;transform:translate(-50%,16px);background:#0B2427;color:#fff;padding:11px 18px;
    border-radius:12px;font-size:13px;box-shadow:0 12px 30px rgba(0,0,0,.3);opacity:0;transition:opacity .25s,transform .25s;
    z-index:2147483646;pointer-events:none;font-family:var(--body);max-width:calc(100vw - 32px)}
  .toast.on{opacity:1;transform:translate(-50%,0)}
  .gira{width:15px;height:15px;border:2px solid rgba(255,255,255,.35);border-top-color:#fff;border-radius:50%;animation:gira .8s linear infinite}
  .btn-sec .gira{border-color:var(--line);border-top-color:var(--brand)}
  @keyframes gira{to{transform:rotate(360deg)}}

  @media(max-width:1280px){ .kpis{grid-template-columns:repeat(4,minmax(0,1fr))} }
  @media(max-width:1080px){
    .bn{grid-template-columns:repeat(2,minmax(0,1fr))}
    .r-2,.r-3,.r-72-28{grid-template-columns:minmax(0,1fr)}
    .ia .cols{grid-template-columns:minmax(0,1fr)}
    .kpis{grid-template-columns:repeat(3,minmax(0,1fr))}
    .cr-grade{grid-template-columns:minmax(0,1fr)}
    .cr-det{position:static}
    .cr-res{grid-template-columns:repeat(2,minmax(0,1fr))}
  }
  @media(max-width:760px){
    .opcoes{grid-template-columns:minmax(0,1fr)}
    .cal,.cal-cab{display:none}
    .cr-lista{display:block}
    .canais{grid-template-columns:minmax(0,1fr)}
    .canal.on::after{display:none}
    .cr-est ul{grid-template-columns:minmax(0,1fr)}
  }
  @media(max-width:620px){
    .wrap{padding:0 16px 34px}
    .kpis,.kpis.k4{grid-template-columns:repeat(2,minmax(0,1fr))}
    .campos{grid-template-columns:minmax(0,1fr)}
    .week{height:118px} .track{height:120px} .wbars{height:160px}
    .brow{grid-template-columns:42px minmax(0,1fr) 84px}
    .trilho{animation-duration:30s}
    .topo .dir{margin-left:0}
    .mcorpo{padding:16px}
    .mhd{padding:14px 58px 14px 16px;flex-wrap:wrap}
    .mhd .acoes{order:3;width:100%;margin-left:0}
    .mhd .acoes .btn-sec,.mhd .acoes .btn-pri{flex:1 1 auto;justify-content:center;padding:9px 10px;font-size:12.5px}
    .mhd .mfecha{position:absolute;top:12px;right:12px}
  }
  @media(prefers-reduced-motion:reduce){
    .trilho{animation:none} .tela,.conteudo,.meses,.canal-det,.modal,.mbox{transition:none}
    .wcol .wbar,.wd .b,.brow .bf,.vs .f,.pl .f{transition:none}
  }
  `;

  // ---------------------------------------------------------------------
  // Carrega uma biblioteca de exportacao sob demanda (com CDN reserva).
  function carregarLib(nome) {
    var lib = LIBS[nome];
    if (window[lib.global]) return Promise.resolve(window[lib.global]);
    if (lib.promessa) return lib.promessa;
    lib.promessa = new Promise(function (ok, falhou) {
      function tentar(i) {
        if (i >= lib.urls.length) {
          lib.promessa = null;
          falhou(new Error("não foi possível baixar a biblioteca de " + nome.toUpperCase()));
          return;
        }
        // Se a pagina usar AMD (RequireJS), o UMD se registraria como modulo
        // e nao criaria a global. Escondemos o define durante a carga.
        var amd = window.define;
        try { window.define = undefined; } catch (e) { /* somente leitura */ }
        var s = document.createElement("script");
        s.src = lib.urls[i];
        s.async = true;
        s.onload = function () {
          try { window.define = amd; } catch (e) { /* nada */ }
          if (window[lib.global]) ok(window[lib.global]); else tentar(i + 1);
        };
        s.onerror = function () {
          try { window.define = amd; } catch (e) { /* nada */ }
          tentar(i + 1);
        };
        document.head.appendChild(s);
      }
      tentar(0);
    });
    return lib.promessa;
  }

  function hash(s) {
    var h = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h >>> 0;
  }

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
      '<div class="carregando">Carregando hub&hellip;</div></div></div>' +
      '<div class="modal" id="modal" role="dialog" aria-modal="true" aria-hidden="true"></div>' +
      '<div class="tip" id="tip"></div><div class="toast" id="toast" role="status"></div></div>';

    var D = null;
    var estado = { tela: "hub", parceiro: null, aba: "geral", mesesAbertos: false,
                   janela: "tudo", modo: "tabela", gran: "", de: "", ate: "", aberto: true,
                   canal: "email", tema: "claro", temaEscolhido: false };
    var cr = { escopo: null, variante: "ambos", volume: "", valor: "", plano: null, dia: null,
               ocupado: false };

    var $ = function (id) { return root.getElementById(id); };
    var app = root.querySelector(".app");
    var tela = $("tela");
    var modal = $("modal");
    var tip = $("tip");
    var toast = $("toast");

    // ---------- formato ----------
    function nf(n, c) {
      return Number(n || 0).toLocaleString("pt-BR",
        { minimumFractionDigits: c || 0, maximumFractionDigits: c || 0 });
    }
    function moeda(n, c) { return "R$ " + nf(n, c === undefined ? 0 : c); }
    function curto(n) {
      n = Number(n || 0);
      if (n >= 1e6) return nf(n / 1e6, 1) + "M";
      if (n >= 1e3) return nf(n / 1e3, n >= 1e4 ? 0 : 1) + "k";
      return nf(n);
    }
    function mil(n) {
      n = Number(n || 0);
      if (n >= 1e6) return nf(n / 1e6, 1) + " mi";
      if (n >= 1e3) return nf(n / 1e3, 0) + " mil";
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
    function semTags(s) { return String(s || "").replace(/<\/?b>/g, ""); }
    function guardar(c, v) { try { localStorage.setItem("hub-" + c, v); } catch (e) { /* privado */ } }
    function ler(c) { try { return localStorage.getItem("hub-" + c); } catch (e) { return null; } }
    function sessao(c, v) {
      try {
        if (v === undefined) return sessionStorage.getItem("hub-" + c);
        sessionStorage.setItem("hub-" + c, v);
      } catch (e) { return null; }
      return null;
    }
    function dataIso(iso) { var p = iso.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
    function ddmm(iso) { return iso.slice(8, 10) + "/" + iso.slice(5, 7); }
    function avisar(msg) {
      toast.textContent = msg;
      toast.classList.add("on");
      clearTimeout(avisar.t);
      avisar.t = setTimeout(function () { toast.classList.remove("on"); }, 3200);
    }

    function parceiroPorId(id) {
      var achou = null;
      D.parceiros.forEach(function (p) { if (p.id === id) achou = p; });
      return achou;
    }
    function parceiroAtual() { return parceiroPorId(estado.parceiro); }
    function abaDe(lista, id) {
      var achou = null;
      lista.forEach(function (a) { if (a.id === id) achou = a; });
      return achou || lista[0];
    }

    // ---------- icones ----------
    var ESTRELA = '<svg viewBox="0 0 24 24"><path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z"/></svg>';
    var TREVO = '<svg viewBox="0 0 40 40"><g fill="var(--brand-lite)"><circle cx="20" cy="12" r="7"/>' +
      '<circle cx="12" cy="20" r="7"/><circle cx="28" cy="20" r="7"/><circle cx="20" cy="28" r="7"/></g>' +
      '<circle cx="20" cy="20" r="4" fill="var(--deep)"/></svg>';
    var LUA = '<svg viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
    var SOL = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.2M12 19.8V22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2 12h2.2M19.8 12H22M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"/></svg>';
    var CADEADO = '<svg viewBox="0 0 24 24"><rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>';
    var ABERTO = '<svg viewBox="0 0 24 24"><rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 7.6-1.7"/></svg>';
    var CAL = '<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>';
    var GRADE = '<svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.8"/></svg>';
    var CHEV = '<svg class="chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>';
    var SETA = '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    var VOLTA = '<svg viewBox="0 0 24 24"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>';
    var XIS = '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    var BAIXAR = '<svg viewBox="0 0 24 24"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>';
    var CHECK = '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
    var INFO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5v.5"/></svg>';
    var MAIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/></svg>';
    var WPP = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.7l5-1.3A9.7 9.7 0 1 0 12 2.2zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5 5 0 0 0 1.1 2.7 11.5 11.5 0 0 0 4.4 3.9c1.6.7 2.3.8 3.1.6.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2l-.4-.2z"/></svg>';

    function rodape() {
      return '<div class="rodape-hub"><span class="p"><span class="d"></span>' +
        esc(D.rodape || "Powered by Tibério Ferreira for Supertroco") + '</span>' +
        '<span class="f">Dados de RD Station (e-mail), WhatsApp e dos parceiros (resultado) · ' +
        'publicado automaticamente · nenhuma chave de API fica exposta nesta página.</span></div>';
    }

    // =================================================================
    // TEMA (cores da marca + modo noturno)
    // =================================================================
    var CLARO_PADRAO = { card: "#FFFFFF", ink2: "#2C555C", muted: "#5F7C83", muted2: "#7F969C",
                         track: "#E9F0F1", seg: "#E7EFF0" };
    var temaAtivo = null;
    function temaHub() {
      return { cores: D.hub.cores, cores_escuro: D.hub.cores_escuro, rampa: D.hub.rampa };
    }
    function aplicarTema(t) {
      temaAtivo = t || temaHub();
      var escuro = estado.tema === "escuro";
      var c = temaAtivo.cores || {}, e = temaAtivo.cores_escuro || {};
      var mapa = {};
      Object.keys(c).forEach(function (k) { mapa[k] = c[k]; });
      Object.keys(CLARO_PADRAO).forEach(function (k) { mapa[k] = CLARO_PADRAO[k]; });
      if (escuro) Object.keys(e).forEach(function (k) { mapa[k] = e[k]; });
      var r = (temaAtivo.rampa || {})[escuro ? "escuro" : "claro"];
      if (r) r.forEach(function (cor, i) { mapa["r" + i] = cor; });
      Object.keys(mapa).forEach(function (k) {
        app.style.setProperty("--" + k.replace(/_/g, "-"), mapa[k]);
      });
      app.classList.toggle("escuro", escuro);
    }
    function botaoTema() {
      var escuro = estado.tema === "escuro";
      return '<button class="tbtn" id="bt-tema" title="' + (escuro ? "Modo claro" : "Modo noturno") +
        '" aria-label="' + (escuro ? "Ativar modo claro" : "Ativar modo noturno") + '">' +
        (escuro ? SOL : LUA) + '</button>';
    }
    function alternarTema() {
      estado.tema = estado.tema === "escuro" ? "claro" : "escuro";
      estado.temaEscolhido = true;
      guardar("tema", estado.tema);
      app.classList.add("trocando");
      aplicarTema(temaAtivo);
      var b = $("bt-tema");
      if (b) b.outerHTML = botaoTema();
      ligarTema();
      setTimeout(function () { app.classList.remove("trocando"); }, 450);
    }
    function ligarTema() {
      var b = $("bt-tema");
      if (b) b.addEventListener("click", alternarTema);
    }
    function botaoCrono() {
      var livre = sessao("crono") === "1";
      return '<button class="btn crono" id="bt-crono" title="Gerar o cronograma de disparos do próximo mês">' +
        (livre ? ABERTO : CADEADO) + 'Cronograma</button>';
    }

    // ---------- trocas com fade ----------
    function trocar(montar) {
      tela.classList.remove("on");
      setTimeout(function () {
        montar();
        tela.scrollIntoView({ behavior: "smooth", block: "start" });
        requestAnimationFrame(function () { tela.classList.add("on"); });
      }, 300);
    }
    function trocarConteudo(montar) {
      var c = $("conteudo");
      if (!c) { montar(); return; }
      c.classList.add("saindo");
      setTimeout(function () {
        montar();
        var n = $("conteudo");
        if (n) { void n.offsetWidth; n.classList.remove("saindo"); }
      }, 220);
    }

    // ---------- dica flutuante (valor primeiro, rotulo depois) ----------
    function posicionarTip(x, y) {
      var w = tip.offsetWidth, h = tip.offsetHeight;
      var vw = window.innerWidth, vh = window.innerHeight;
      var left = x + 14, top = y + 14;
      if (left + w > vw - 8) left = x - w - 14;
      if (top + h > vh - 8) top = y - h - 14;
      tip.style.left = Math.max(8, left) + "px";
      tip.style.top = Math.max(8, top) + "px";
    }
    function mostrarTip(alvo, x, y) {
      var txt = alvo.getAttribute("data-tip");
      if (!txt) return;
      tip.textContent = "";
      txt.split("\n").forEach(function (linha, i) {
        var e = document.createElement(i === 0 ? "b" : "span");
        e.textContent = linha;
        tip.appendChild(e);
      });
      tip.classList.add("on");
      posicionarTip(x, y);
    }
    app.addEventListener("pointermove", function (ev) {
      var alvo = ev.target.closest ? ev.target.closest("[data-tip]") : null;
      if (!alvo || !app.contains(alvo)) { tip.classList.remove("on"); return; }
      mostrarTip(alvo, ev.clientX, ev.clientY);
    });
    app.addEventListener("pointerleave", function () { tip.classList.remove("on"); });
    app.addEventListener("focusin", function (ev) {
      var alvo = ev.target.closest ? ev.target.closest("[data-tip]") : null;
      if (!alvo) return;
      var r = alvo.getBoundingClientRect();
      mostrarTip(alvo, r.left + r.width / 2, r.bottom);
    });
    app.addEventListener("focusout", function () { tip.classList.remove("on"); });
    window.addEventListener("scroll", function () { tip.classList.remove("on"); }, { passive: true });

    // =================================================================
    // NAVEGACAO — Visao geral / Visao mes a mes
    // =================================================================
    function vistos() {
      try { return JSON.parse(ler("meses-vistos") || "null"); } catch (e) { return null; }
    }
    function marcarVisto(id) {
      var v = vistos() || [];
      if (v.indexOf(id) < 0) { v.push(id); guardar("meses-vistos", JSON.stringify(v)); }
    }
    // Na primeira visita os meses que ja existem contam como vistos: o selo
    // "novo" fica para o mes que aparecer depois (ex.: outubro).
    function inicializarVistos() {
      if (vistos()) return;
      var ids = {};
      D.hub.abas.forEach(function (a) { if (a.id !== "geral") ids[a.id] = 1; });
      D.parceiros.forEach(function (p) {
        p.abas.forEach(function (a) { if (a.id !== "geral") ids[a.id] = 1; });
      });
      guardar("meses-vistos", JSON.stringify(Object.keys(ids)));
    }
    function navAbas(abas) {
      var meses = abas.filter(function (a) { return a.id !== "geral"; });
      var emMes = estado.aba !== "geral";
      var aberto = estado.mesesAbertos || emMes;
      var visto = vistos() || [];
      var algumNovo = meses.some(function (m) { return visto.indexOf(m.id) < 0; });
      var atual = emMes ? abaDe(abas, estado.aba) : null;
      return '<div class="nav"><div class="nav-bts">' +
        '<button class="nv' + (!emMes ? " on" : "") + '" data-nav="geral">' + GRADE + 'Visão geral</button>' +
        '<button class="nv' + (emMes ? " on" : "") + (aberto ? " aberto" : "") +
        '" data-nav="meses" aria-expanded="' + (aberto ? "true" : "false") + '" aria-controls="meses">' +
        CAL + 'Visão mês a mês' + (atual ? '<span class="sel">' + esc(atual.nome) + '</span>' : "") +
        (algumNovo && !emMes ? '<span class="ponto" title="Mês novo disponível"></span>' : "") + CHEV +
        '</button></div><div class="meses' + (aberto ? " on" : "") + '" id="meses">' +
        (meses.length ? meses.map(function (m) {
          var novo = visto.indexOf(m.id) < 0;
          return '<button class="mes' + (m.id === estado.aba ? " on" : "") + '" data-aba="' + esc(m.id) + '">' +
            esc(m.nome) + (m.parcial ? '<span class="tag">até ' + esc(m.ate) + '</span>' : "") +
            (novo ? '<span class="tag novo">novo</span>' : "") + '</button>';
        }).join("") : '<span class="vazio-m">Nenhum mês com dados ainda.</span>') + '</div></div>';
    }
    function ligarNav(abas, redesenhar) {
      var bts = root.querySelectorAll(".nav .nv");
      bts.forEach(function (b) {
        b.addEventListener("click", function () {
          var alvo = b.getAttribute("data-nav");
          var linha = $("meses");
          if (alvo === "geral") {
            estado.mesesAbertos = false;
            if (linha) linha.classList.remove("on");
            if (estado.aba === "geral") return;
            estado.aba = "geral";
            atualizarNav(abas);
            trocarConteudo(redesenhar);
            return;
          }
          estado.mesesAbertos = !(linha && linha.classList.contains("on"));
          if (linha) linha.classList.toggle("on", estado.mesesAbertos);
          b.classList.toggle("aberto", estado.mesesAbertos);
          b.setAttribute("aria-expanded", estado.mesesAbertos ? "true" : "false");
        });
      });
      root.querySelectorAll(".meses .mes").forEach(function (b) {
        b.addEventListener("click", function () {
          var id = b.getAttribute("data-aba");
          marcarVisto(id);
          if (id === estado.aba) return;
          estado.aba = id;
          estado.mesesAbertos = true;
          estado.gran = ""; estado.janela = "tudo"; estado.de = ""; estado.ate = "";
          atualizarNav(abas);
          trocarConteudo(redesenhar);
        });
      });
    }
    // Atualiza os botoes sem recriar a linha de meses (preserva o fade).
    function atualizarNav(abas) {
      var emMes = estado.aba !== "geral";
      var bts = root.querySelectorAll(".nav .nv");
      if (bts[0]) bts[0].classList.toggle("on", !emMes);
      if (bts[1]) {
        bts[1].classList.toggle("on", emMes);
        bts[1].classList.toggle("aberto", emMes || estado.mesesAbertos);
        var sel = bts[1].querySelector(".sel");
        var atual = emMes ? abaDe(abas, estado.aba) : null;
        if (atual) {
          if (!sel) {
            sel = document.createElement("span");
            sel.className = "sel";
            bts[1].insertBefore(sel, bts[1].querySelector(".chev"));
          }
          sel.textContent = atual.nome;
        } else if (sel) { sel.remove(); }
        var ponto = bts[1].querySelector(".ponto");
        if (ponto && emMes) ponto.remove();
      }
      root.querySelectorAll(".meses .mes").forEach(function (b) {
        var id = b.getAttribute("data-aba");
        b.classList.toggle("on", id === estado.aba);
        var novo = b.querySelector(".tag.novo");
        if (novo && (vistos() || []).indexOf(id) >= 0) novo.remove();
      });
      var tp = $("chip-periodo");
      var aba = abaDe(abas, estado.aba);
      if (tp && aba) tp.textContent = aba.periodo;
    }

    // =================================================================
    // ARGOLA — o funil em forma de anel
    // =================================================================
    // Cada fatia e onde o publico parou (particao de 100%), em escala real;
    // so a fatia muito pequena ganha um angulo minimo para ficar visivel.
    function indicesRampa(n) {
      return n <= 1 ? [2] : n === 2 ? [0, 4] : n === 3 ? [0, 2, 4] : n === 4 ? [0, 1, 3, 4] : [0, 1, 2, 3, 4];
    }
    function arco(cx, cy, R, r, a0, a1) {
      var p = function (rad, a) { return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)]; };
      var g = a1 - a0 > Math.PI ? 1 : 0;
      var o0 = p(R, a0), o1 = p(R, a1), i1 = p(r, a1), i0 = p(r, a0);
      return "M" + o0[0].toFixed(2) + "," + o0[1].toFixed(2) + " A" + R + "," + R + " 0 " + g + " 1 " +
        o1[0].toFixed(2) + "," + o1[1].toFixed(2) + " L" + i1[0].toFixed(2) + "," + i1[1].toFixed(2) +
        " A" + r + "," + r + " 0 " + g + " 0 " + i0[0].toFixed(2) + "," + i0[1].toFixed(2) + " Z";
    }
    var contArgola = 0;
    function argola(cfg) {
      // cfg: {etapas:[{n, v}], fatias:[rotulos], total_rotulo, conv:[{n, de}], fantasma}
      var et = cfg.etapas, total = et[0].v || 0;
      var partes = cfg.fatias.map(function (rot, i) {
        var v = i + 1 < et.length ? Math.max(0, (et[i].v || 0) - (et[i + 1].v || 0)) : (et[i].v || 0);
        return { n: rot, v: v, p: total ? v / total * 100 : 0 };
      });
      var id = "ar" + (++contArgola);
      var idx = indicesRampa(partes.length);
      var cx = 100, cy = 100, R = 92, r = 64;
      var soma = partes.reduce(function (a, s) { return a + s.v; }, 0) || 1;
      var minimo = 4 * Math.PI / 180, gap = 2.2 / R;
      var ativos = partes.filter(function (s) { return s.v > 0; }).length;
      var ang = partes.map(function (s) { return s.v > 0 ? Math.max(minimo, s.v / soma * 2 * Math.PI) : 0; });
      var excesso = ang.reduce(function (a, b) { return a + b; }, 0) - 2 * Math.PI;
      var ampliou = partes.some(function (s) { return s.v > 0 && s.v / soma * 2 * Math.PI < minimo; });
      if (excesso > 0) {
        var maior = ang.indexOf(Math.max.apply(null, ang));
        ang[maior] -= excesso;
      }
      var a = -Math.PI / 2, formas = "";
      partes.forEach(function (s, i) {
        if (!ang[i]) return;
        var g = ativos > 1 ? gap : 0;
        var a0 = a + g / 2, a1 = a + ang[i] - g / 2;
        if (ativos === 1) { a0 = -Math.PI / 2; a1 = a0 + 2 * Math.PI - 0.0001; }
        formas += '<path class="ar-s" data-i="' + i + '" tabindex="0" d="' + arco(cx, cy, R, r, a0, a1) +
          '" fill="var(--r' + idx[i] + ')" data-tip="' + esc(nf(s.p, s.p < 1 ? 2 : 1) + "% · " + nf(s.v) +
          "\n" + s.n) + '" aria-label="' + esc(s.n + ": " + nf(s.v) + " (" + nf(s.p, 1) + "%)") + '"></path>';
        a += ang[i];
      });
      if (!ativos) {
        formas = '<circle cx="100" cy="100" r="78" fill="none" stroke="var(--track)" stroke-width="28"/>';
      }
      var leg = partes.map(function (s, i) {
        return '<div class="ar-row" data-i="' + i + '"><span class="sw" style="background:var(--r' + idx[i] +
          ')"></span><span>' + esc(s.n) + '</span><span class="p">' + (total ? nf(s.p, s.p < 1 && s.p > 0 ? 2 : 1) + "%" : "—") +
          '</span><span class="vv">' + (cfg.fantasma ? "—" : esc(curto(s.v))) + '</span></div>';
      }).join("");
      var conv = (cfg.conv || []).filter(function (c) { return c; }).map(function (c) {
        return esc(c.n) + ' <b>' + esc(c.v) + '</b>';
      }).join(" · ");
      return '<div class="argola' + (cfg.fantasma ? " fantasma" : "") + '" id="' + id + '">' +
        '<svg viewBox="0 0 200 200" role="img" aria-label="' + esc(cfg.titulo || "Funil em anel") + '">' +
        formas + '<text class="ar-v" x="100" y="102" data-base="' + esc(cfg.fantasma ? "—" : curto(total)) + '">' +
        (cfg.fantasma ? "—" : esc(curto(total))) + '</text>' +
        '<text class="ar-l" x="100" y="121" data-base="' + esc(cfg.total_rotulo) + '">' + esc(cfg.total_rotulo) +
        '</text></svg><div class="ar-leg">' + leg + '</div>' +
        (conv ? '<div class="ar-conv">' + conv + '</div>' : "") +
        (ampliou ? '<div class="ar-nota">Fatias muito finas ganham um mínimo para ficar visíveis; os percentuais são os reais.</div>' : "") +
        '</div>';
    }
    function ligarArgolas() {
      root.querySelectorAll(".argola").forEach(function (box) {
        if (box.classList.contains("fantasma") || box.__ligada) return;
        box.__ligada = true;
        var v = box.querySelector(".ar-v"), l = box.querySelector(".ar-l");
        function focar(i) {
          box.classList.add("foco");
          box.querySelectorAll(".ar-s").forEach(function (s) { s.classList.toggle("on", s.getAttribute("data-i") === i); });
          box.querySelectorAll(".ar-row").forEach(function (rw) { rw.classList.toggle("on", rw.getAttribute("data-i") === i); });
          var row = box.querySelector('.ar-row[data-i="' + i + '"]');
          if (row) {
            v.textContent = row.querySelector(".p").textContent;
            l.textContent = row.children[1].textContent.toLowerCase();
          }
        }
        function soltar() {
          box.classList.remove("foco");
          box.querySelectorAll(".on").forEach(function (s) { s.classList.remove("on"); });
          v.textContent = v.getAttribute("data-base");
          l.textContent = l.getAttribute("data-base");
        }
        box.querySelectorAll(".ar-s, .ar-row").forEach(function (s) {
          s.addEventListener("pointerenter", function () { focar(s.getAttribute("data-i")); });
          s.addEventListener("pointerleave", soltar);
          s.addEventListener("focus", function () { focar(s.getAttribute("data-i")); });
          s.addEventListener("blur", soltar);
        });
      });
    }
    function argolaEmail(e, fantasma) {
      var f = (e && e.funil) || { entregues: 0, aberturas: 0, cliques: 0 };
      return argola({
        titulo: "Funil de e-mail em anel", total_rotulo: "entregues", fantasma: fantasma,
        etapas: [{ n: "Entregues", v: f.entregues }, { n: "Aberturas", v: f.aberturas }, { n: "Cliques", v: f.cliques }],
        fatias: ["Não abriram", "Abriram, sem clicar", "Clicaram"],
        conv: fantasma ? [] : [
          { n: "Aberturas", v: nf(f.entregues ? f.aberturas / f.entregues * 100 : 0, 1) + "% das entregas" },
          { n: "Cliques", v: nf(f.aberturas ? f.cliques / f.aberturas * 100 : 0, 1) + "% das aberturas" }]
      });
    }
    function argolaWpp(w, fantasma) {
      var f = (w && w.funil) || { disparos: 0, entregues: 0, lidas: 0, cliques: 0, conversoes: 0 };
      // Plataforma que nao informa uma etapa: a etapa herda a anterior (nao cria fatia falsa).
      var entr = f.entregues || f.disparos, lid = f.lidas || entr;
      return argola({
        titulo: "Funil do WhatsApp em anel", total_rotulo: "disparos", fantasma: fantasma,
        etapas: [{ n: "Disparos", v: f.disparos }, { n: "Entregues", v: entr }, { n: "Lidas", v: lid },
                 { n: "Cliques", v: f.cliques }, { n: "Conversões", v: f.conversoes }],
        fatias: ["Não entregues", "Entregues, não lidas", "Lidas, sem clique", "Clicaram, sem converter", "Converteram"],
        conv: fantasma ? [] : [
          { n: "Leitura", v: nf(entr ? lid / entr * 100 : 0, 1) + "%" },
          { n: "Clique", v: nf(lid ? f.cliques / lid * 100 : 0, 1) + "% das lidas" },
          { n: "Conversão", v: nf(f.disparos ? f.conversoes / f.disparos * 100 : 0, 2) + "% dos disparos" }]
      });
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

    function hubNumeros(aba) {
      var k = aba.kpis, g = [];
      if (k.parceiros_vendas) {
        g.push(["Receita gerada", moeda(k.vendas), aba.periodo, true]);
        g.push(["Comissão Supertroco", moeda(k.comissao), "somando as taxas das parcerias de venda", true]);
      }
      if (k.parceiros_leads) {
        g.push(["Leads gerados", nf(k.leads), k.parceiros_leads + (k.parceiros_leads > 1 ? " parcerias" : " parceria") + " medida em leads", true]);
      }
      if (k.parceiros_vendas) {
        g.push(["Aquisições", nf(k.aquisicoes), "novos usuários no período", false]);
        g.push(["CAC médio", moeda(k.cac, 2), "comissão ÷ aquisições", false]);
      }
      g.push(["Campanhas de e-mail", nf(k.campanhas), k.campanhas ? mil(k.entregues) + " e-mails entregues" : "nenhum envio no período", false]);
      g.push(["Abertura média", k.campanhas ? nf(k.abertura, 1) + "%" : "—", k.campanhas ? "CTR de " + nf(k.ctr, 2) + "%" : "sem e-mail no período", false, !k.campanhas]);
      g.push(["WhatsApp", k.wpp_disparos ? nf(k.wpp_disparos) : "Pronto", k.wpp_disparos ? "disparos · " + moeda(k.wpp_investimento) + " investidos" : "aguardando os primeiros disparos", false, !k.wpp_disparos]);
      if (k.parceiros_vendas && g.length < 8) g.push(["Pedidos", nf(k.pedidos), "ticket médio " + moeda(k.tkm, 2), false]);
      if (k.parceiros_vendas && g.length < 8) g.push(["Conversão do site", nf(k.conversao, 2) + "%", "pedidos ÷ sessões", false]);
      return '<div class="bn">' + g.slice(0, 8).map(function (x) {
        return '<div class="c' + (x[3] ? " destaque" : "") + '">' +
          '<div class="r">' + esc(x[0]) + '</div><div class="v' + (x[4] ? " nd" : "") + '">' + esc(x[1]) + '</div>' +
          '<div class="s">' + esc(x[2]) + '</div></div>';
      }).join("") + '</div>';
    }

    function miniCanais(email, wpp) {
      return '<span class="canais-mini">' +
        (email ? '<span class="cm mail">' + MAIL + nf(email.campanhas) + ' e-mails · ' + nf(email.abertura, 1) + '% ab.</span>'
               : '<span class="cm off">' + MAIL + 'sem e-mail no período</span>') +
        (wpp ? '<span class="cm wpp">' + WPP + nf(wpp.disparos) + ' disparos</span>'
             : '<span class="cm wpp">' + WPP + 'WhatsApp pronto</span>') + '</span>';
    }

    function hubCards(aba) {
      var porId = {};
      aba.parceiros.forEach(function (r) { porId[r.id] = r; });
      return '<div class="painel"><h3>Abrir um CRM</h3>' +
        '<div class="cap">Cada parceria tem o painel completo, com o tema da marca</div>' +
        '<div class="parc" style="margin-top:14px">' + D.parceiros.map(function (p) {
          var r = porId[p.id];
          var grid;
          if (!r) {
            grid = '<span class="gi" style="grid-column:1/-1"><span class="r">' +
              (p.sem_dados ? "Aguardando os primeiros dados" : "Sem dados em " + esc(aba.nome)) +
              '</span><span class="v" style="color:var(--muted2)">—</span></span>';
          } else if (p.modelo === "leads") {
            grid = '<span class="gi"><span class="r">Leads</span><span class="v">' + nf(r.leads) + '</span></span>' +
              '<span class="gi"><span class="r">Média por dia</span><span class="v">' + nf(r.media_dia, 1) + '</span></span>' +
              '<span class="gi"><span class="r">Pico</span><span class="v">' + (r.pico ? nf(r.pico.v) + " · " + esc(r.pico.d) : "—") + '</span></span>' +
              '<span class="gi"><span class="r">Dias com lead</span><span class="v">' + nf(r.dias_com_lead) + " de " + nf(r.dias_ativos) + '</span></span>';
          } else {
            grid = '<span class="gi"><span class="r">Receita</span><span class="v">' + moeda(r.vendas) + '</span></span>' +
              '<span class="gi"><span class="r">Comissão</span><span class="v">' + moeda(r.comissao) + '</span></span>' +
              '<span class="gi"><span class="r">Pedidos</span><span class="v">' + nf(r.pedidos) + '</span></span>' +
              '<span class="gi"><span class="r">CAC</span><span class="v">' + moeda(r.cac, 2) + '</span></span>';
          }
          var pe = p.modelo === "leads" ? "mede leads" : (p.taxa_comissao ? nf(p.taxa_comissao * 100, 0) + "% de comissão" : "mede vendas");
          return '<button class="pc' + (r ? "" : " apagado") + '" data-parceiro="' + esc(p.id) + '">' +
            '<span class="faixa" style="background:linear-gradient(90deg,' +
            esc(p.cores.brand) + ',' + esc(p.cores.brand_lite) + ')"></span>' +
            '<span class="corpo"><span class="cab">' +
            '<span class="ini" style="background:' + esc(p.cores.brand) + '">' +
            esc(p.nome.charAt(0)) + '</span><span><span class="nm">' + esc(p.nome) + '</span>' +
            '<span class="sg" style="display:block">' + esc(p.segmento) + '</span></span>' +
            '<span class="modelo">' + (p.modelo === "leads" ? "Leads" : "Vendas") + '</span></span>' +
            '<span class="grid">' + grid + '</span>' +
            (r ? miniCanais(r.email, r.whatsapp) : "") +
            '<span class="rodape">' +
            (p.ficticio ? '<span class="tag-aviso">dados de teste</span>' : '<span>' + esc(pe) + '</span>') +
            '<span class="abrir" style="color:' + esc(p.cores.brand) + '">Abrir' + SETA + '</span>' +
            '</span></span></button>';
        }).join("") + '</div></div>';
    }

    function hubCanais(aba) {
      var e = aba.email, w = aba.whatsapp, k = aba.kpis;
      var vpd = [];
      D.parceiros.forEach(function (p) {
        var v = (p.whatsapp_cfg || {}).valor_por_disparo;
        if (v && vpd.indexOf(v) < 0) vpd.push(v);
      });
      var valorTxt = vpd.length === 1 ? moeda(vpd[0], 2) + " por disparo" : vpd.length ? "valor por parceiro" : "valor a definir";
      return '<div class="row r-2"><div class="painel"><div class="hrow"><div><h3>E-mail · RD Station</h3>' +
        '<div class="cap">Todos os parceiros · ' + esc(aba.nome) + '</div></div>' +
        '<span class="cm mail">' + MAIL + nf(k.campanhas) + ' campanhas</span></div>' +
        (e ? '<div class="r-2" style="display:grid;gap:18px;align-items:center">' + argolaEmail(e) +
          '<div class="rank">' + D.parceiros.map(function (p) {
            var r = null;
            aba.parceiros.forEach(function (x) { if (x.id === p.id) r = x; });
            var em = r && r.email;
            return '<div class="tagbox" style="display:flex;gap:10px;align-items:flex-start">' +
              '<span class="src" style="background:' + esc(p.cores.brand) + ';margin-top:6px"></span><div>' +
              '<b style="font-family:var(--disp)">' + esc(p.nome) + '</b><br>' +
              (em ? nf(em.campanhas) + ' campanhas · ' + mil(em.entregues) + ' entregues<br>abertura <b>' +
                    nf(em.abertura, 1) + '%</b> · CTR <b>' + nf(em.ctr, 2) + '%</b>'
                  : '<span style="color:var(--muted)">sem e-mail neste período' +
                    (p.fontes && !p.fontes.rd ? ' · aguardando o export da RD' : '') + '</span>') + '</div></div>';
          }).join("") + '</div></div>'
           : '<div class="vazio">Nenhum e-mail no período.</div>') +
        '</div><div class="painel"><div class="hrow"><div><h3>WhatsApp</h3>' +
        '<div class="cap">Todos os parceiros · ' + esc(valorTxt) + '</div></div>' +
        (w ? '<span class="cm wpp">' + WPP + nf(w.campanhas) + ' campanhas</span>'
           : '<span class="st pronto">terreno pronto</span>') + '</div>' +
        (w ? argolaWpp(w) + '<div class="legenda">Investido <b>' + moeda(w.investimento) + '</b> · convertido <b>' +
              moeda(w.valor_convertido) + '</b></div>'
           : '<div class="fantasma-bloco"><div class="fx">' + argolaWpp(null, true) + '</div>' +
             '<div class="selo-f"><span>Aguardando os primeiros disparos</span></div></div>' +
             '<div class="aviso-canal">' + INFO + '<div>Todos os parceiros já têm o canal pronto. Assim que a ' +
             'planilha <code>whatsapp.xlsx</code> de cada um receber os disparos, este quadro mostra quantidade, ' +
             'investimento, conversões e valores convertidos — e o cronograma passa a usar o histórico real.</div></div>') +
        '</div></div>';
    }

    function hubParticipacao(aba) {
      if (!aba.participacao || aba.participacao.length < 2) return "";
      var maxF = Math.max.apply(null, aba.participacao.map(function (p) { return p.vendas; })) || 1;
      return '<div class="row"><div class="painel"><h3>Participação na receita</h3>' +
        '<div class="cap">Quanto cada parceria de vendas representa do total gerado no período</div>' +
        '<div class="part">' + aba.participacao.map(function (p) {
          return '<div class="pl"><div class="h"><span>' + esc(p.nome) + '</span>' +
            '<b>' + moeda(p.vendas) + ' · ' + nf(p.fatia, 1) + '%</b></div>' +
            '<span class="t"><span class="f" style="width:' +
            Math.max(1.5, p.vendas / maxF * 100).toFixed(1) + '%;background:' + esc(p.cor) + '"></span></span></div>';
        }).join("") + '</div></div></div>';
    }

    function hubIA(aba) {
      var ia = aba.ia || {};
      if (!ia.destaque && !ia.comparativo) return "";
      var alertas = (ia.alertas || []).map(function (x) { return "<li>" + rich(x) + "</li>"; }).join("");
      return '<div class="ia"><div class="hd"><span class="sp">' + ESTRELA + '</span>' +
        '<h3>Leitura comparativa do agente · ' + esc(aba.nome) + '</h3>' +
        '<span class="mod">Groq · gpt-oss-120b</span></div>' +
        (ia.destaque ? '<p class="t">' + rich(ia.destaque) + '</p>' : '') +
        (ia.comparativo ? '<div class="box b" style="margin-bottom:15px">' + rich(ia.comparativo) + '</div>' : '') +
        '<div class="cols"><div><h4>Pontos de atenção</h4><ul>' + alertas + '</ul></div>' +
        '<div><h4>Onde focar no próximo ciclo</h4>' +
        '<div class="box a">' + rich(ia.prioridade || "") + '</div></div></div></div>';
    }

    function conteudoHub() {
      var aba = abaDe(D.hub.abas, estado.aba);
      return '<div class="conteudo" id="conteudo">' + hubNumeros(aba) +
        '<div class="row">' + hubCards(aba) + '</div>' + hubCanais(aba) + hubParticipacao(aba) +
        hubIA(aba) + '</div>';
    }

    function telaHub() {
      aplicarTema(null);
      var h = D.hub, aba = abaDe(h.abas, estado.aba);
      var topo = '<div class="topo"><div class="marca"><span class="sig">' + TREVO + '</span>' +
        '<div><h1>Hub de Parceiros</h1>' +
        '<div class="sub">Supertroco · ' + h.parceiros + (h.parceiros === 1 ? ' parceria ativa' : ' parcerias ativas') +
        ' · e-mail + WhatsApp</div></div></div>' +
        '<div class="dir"><span class="chip" id="chip-periodo">' + esc(aba.periodo) + '</span>' +
        '<span class="chip live">Atualizado <b style="margin-left:4px">' + esc(D.atualizado) + '</b></span>' +
        botaoCrono() + botaoTema() + '</div></div>';

      tela.innerHTML = topo + navAbas(h.abas) + esteira() + conteudoHub() + rodape();
      ligarHub();
      ligarNav(h.abas, function () {
        var c = $("conteudo");
        if (c) c.outerHTML = conteudoHub();
        ligarHub(true);
      });
      ligarTema();
      $("bt-crono").addEventListener("click", function () { abrirCronograma("hub"); });
    }

    function ligarHub() {
      root.querySelectorAll(".pc").forEach(function (b) {
        b.addEventListener("click", function () {
          estado.parceiro = b.getAttribute("data-parceiro");
          estado.tela = "parceiro";
          estado.aba = "geral"; estado.gran = ""; estado.janela = "tudo";
          estado.de = ""; estado.ate = ""; estado.mesesAbertos = false;
          guardar("tela", estado.parceiro);
          trocar(telaParceiro);
        });
      });
      ligarArgolas();
    }

    // =================================================================
    // TELA 2 — CRM DO PARCEIRO
    // =================================================================
    function kpi(src, lbl, val, sub, star, alerta, nd) {
      return '<div class="kpi' + (star ? " star" : "") + '" title="' +
        esc(lbl + ": " + val + " — " + sub + (alerta ? " (" + alerta + ")" : "")) + '">' +
        '<div class="top"><span class="lbl">' + esc(lbl) + '</span>' +
        '<span class="src ' + src + '"></span></div>' +
        '<div class="v' + (nd ? " nd" : "") + '">' + esc(val) + '</div><div class="sub">' + esc(sub) + '</div>' +
        (alerta ? '<div class="alerta">' + esc(alerta) + '</div>' : '') + '</div>';
    }
    function legendaFontes(p) {
      return '<div class="kleg"><span><i class="src res"></i>' +
        (p.modelo === "leads" ? "leads do parceiro" : "vendas do parceiro") + '</span>' +
        '<span><i class="src rd"></i>e-mail (RD Station)</span><span><i class="src wp"></i>WhatsApp</span></div>';
    }

    function blocoKpis(aba, p) {
      var k = aba.kpis;
      var semRd = !aba.email;
      var camp = aba.email ? aba.email.envios + " campanhas no período" : "aguardando export da RD";
      if (p.modelo === "leads") {
        var pico = k.pico, semana = (k.semana || []).slice().sort(function (a, b) { return b[1] - a[1]; });
        var melhor = semana[0];
        var picos = (k.picos || []).map(function (x) { return x.d; }).join(", ");
        var cards = [
          kpi("res", "Leads", nf(k.leads), aba.periodo, true),
          kpi("res", "Média por dia", nf(k.media_dia, 1), nf(k.leads) + " leads ÷ " + k.dias_ativos + " dias", true),
          kpi("res", "Pico diário", pico ? nf(pico.v) : "—", pico ? pico.d + " · " + pico.dia.toLowerCase() : "sem leads", true),
          k.valor_estimado
            ? kpi("res", "Valor estimado", moeda(k.valor_estimado), nf(k.leads) + " × " + moeda(k.valor_por_lead, 2) + " por lead", true)
            : kpi("res", "Dias com lead", nf(k.dias_com_lead) + " de " + nf(k.dias_ativos), "dias com pelo menos 1 lead", true),
          kpi("res", "Concentração", nf(k.top3_pct, 0) + "%", "dos leads em 3 dias" + (picos ? " (" + picos + ")" : ""), false),
          kpi("res", "Melhor dia da semana", melhor ? melhor[0] : "—", melhor ? "média de " + nf(melhor[1], 1) + " leads por dia" : "", false),
          kpi("rd", "Leads em dia de disparo", k.leads_em_disparo === null ? "—" : nf(k.leads_em_disparo),
              k.leads_em_disparo === null ? "aguardando export da RD" : nf(k.pct_em_disparo, 1) + "% do total", false, null, k.leads_em_disparo === null),
          kpi("rd", "Leads por clique", k.leads_por_clique === null ? "—" : nf(k.leads_por_clique, 2) + "%",
              semRd ? "aguardando export da RD" : "leads ÷ cliques no e-mail", false, null, k.leads_por_clique === null),
          kpi("rd", "Abertura média", k.abertura === null ? "—" : nf(k.abertura, 1) + "%", camp, false, null, k.abertura === null),
          kpi("rd", "CTR médio", k.ctr === null ? "—" : nf(k.ctr, 2) + "%", semRd ? "aguardando export da RD" : "cliques ÷ entregues", false, null, k.ctr === null)
        ];
        return '<div class="kpis">' + cards.join("") + '</div>' + legendaFontes(p);
      }
      var parcial = (k.dias_com_sessao !== undefined && k.dias_com_sessao < k.dias_ativos)
        ? "base parcial: " + k.dias_com_sessao + " de " + k.dias_ativos + " dias com sessão"
        : null;
      // Com base parcial o numerador e MENOR que o card "Pedidos" ao lado.
      // "310 dos 476" deixa a relacao explicita.
      var conta = k.pedidos_com_sessao === undefined ? "pedidos ÷ sessões"
        : parcial ? nf(k.pedidos_com_sessao) + " dos " + nf(k.pedidos) + " pedidos ÷ " + nf(k.sessoes) + " sessões"
                  : nf(k.pedidos_com_sessao) + " pedidos ÷ " + nf(k.sessoes) + " sessões";
      var c2 = [
        kpi("res", "Vendas", moeda(k.vendas), aba.periodo, true),
        kpi("res", "Comissão", moeda(k.comissao), "no período", true),
        kpi("res", "Aquisições", nf(k.aquisicoes), "novos usuários", true),
        kpi("res", "CAC", moeda(k.cac, 2), "comissão ÷ aquisições", true),
        kpi("res", "Pedidos", nf(k.pedidos), "no período", true),
        kpi("res", "Ticket médio", moeda(k.tkm, 2), "vendas ÷ pedidos", false),
        kpi("res", "Conversão", nf(k.conversao, 2) + "%", conta, false, parcial),
        kpi("res", "Sessões", nf(k.sessoes), parcial ? "visitas em " + k.dias_com_sessao + " dos " + k.dias_ativos + " dias"
                                                      : "visitas ao site", false, parcial),
        kpi("rd", "Abertura média", k.abertura === null ? "—" : nf(k.abertura, 1) + "%", camp, false, null, k.abertura === null),
        kpi("rd", "CTR médio", k.ctr === null ? "—" : nf(k.ctr, 2) + "%", "cliques ÷ entregues", false, null, k.ctr === null)
      ];
      return '<div class="kpis">' + c2.join("") + '</div>' + legendaFontes(p);
    }

    // ---------- resultado x disparos ----------
    function cfgResultado(p) {
      return p.modelo === "leads"
        ? { chave: "leads", nome: "Leads", fmt: function (v) { return nf(v); }, eixo: function (v) { return nf(v); }, tipo: "colunas" }
        : { chave: "vendas", nome: "Vendas", fmt: function (v) { return moeda(v); }, eixo: curto, tipo: "linha" };
    }

    function porSemana(dias, chave) {
      var grupos = [], atual = null;
      dias.forEach(function (d) {
        var dt = dataIso(d.iso);
        var seg = new Date(dt);
        seg.setDate(dt.getDate() - ((dt.getDay() + 6) % 7));
        var id = seg.getFullYear() + "-" + (seg.getMonth() + 1) + "-" + seg.getDate();
        if (!atual || atual.id !== id) {
          atual = { id: id, ini: d.d, fim: d.d, valor: 0, pedidos: 0, envios: 0, wpp: 0 };
          grupos.push(atual);
        }
        atual.fim = d.d;
        atual.valor += d[chave] || 0;
        atual.pedidos += d.pedidos || 0;
        if (d.send) atual.envios++;
        if (d.wpp) atual.wpp++;
      });
      return grupos;
    }

    function faixaCurta(a, b) {
      var x = String(a).split("/"), y = String(b).split("/");
      return x[1] === y[1] ? x[0] + "–" + y[0] + "/" + y[1] : a + "–" + b;
    }

    function graficoSemana(dias, cfg) {
      var s = porSemana(dias, cfg.chave);
      var mx = Math.max.apply(null, s.map(function (x) { return x.valor; })) || 1;
      return '<div class="wbars">' + s.map(function (x) {
        var dica = cfg.fmt(x.valor) + "\n" + x.ini + " a " + x.fim +
          (cfg.chave === "vendas" ? " · " + x.pedidos + " pedidos" : "") +
          (x.envios ? "\n" + x.envios + " dia(s) com e-mail" : "") + (x.wpp ? "\n" + x.wpp + " dia(s) com WhatsApp" : "");
        return '<div class="wcol" data-tip="' + esc(dica) + '">' +
          (x.envios || x.wpp ? '<span class="wdot"' + (!x.envios ? ' style="background:var(--wpp)"' : '') + '></span>' : '') +
          '<span class="wv">' + esc(cfg.chave === "vendas" ? curto(x.valor) : nf(x.valor)) + '</span>' +
          '<div class="wbar" style="height:' + Math.max(4, x.valor / mx * 100).toFixed(1) + '%"></div>' +
          '<span class="wl">' + esc(faixaCurta(x.ini, x.fim)) + '</span></div>';
      }).join("") + '</div>';
    }

    function graficoDia(dias, cfg) {
      var W = 760, H = 230, pl = 46, pr = 10, pt = 18, pb = 28;
      var iw = W - pl - pr, ih = H - pt - pb;
      var mx = Math.max.apply(null, dias.map(function (d) { return d[cfg.chave] || 0; })) || 1;
      var n = dias.length;
      var Y = function (v) { return pt + ih * (1 - v / mx); };
      var grade = "";
      [1, 0.5, 0].forEach(function (f) {
        var y = Y(mx * f);
        grade += '<line class="gline" x1="' + pl + '" y1="' + y.toFixed(1) + '" x2="' +
          (W - pr) + '" y2="' + y.toFixed(1) + '"/><text class="glabel" x="' + (pl - 8) +
          '" y="' + (y + 3.5).toFixed(1) + '" text-anchor="end">' + esc(cfg.eixo(mx * f)) + '</text>';
      });
      function dica(d) {
        return cfg.fmt(d[cfg.chave]) + "\n" + d.d + " · " + (d.dow || "") +
          (cfg.chave === "vendas" ? " · " + d.pedidos + " pedidos · " + d.novos + " aquisições" : "") +
          (d.send ? "\nE-mail: " + d.send : "") + (d.wpp ? "\nWhatsApp: " + d.wpp : "");
      }
      var corpo = "";
      var X, passoX = iw / Math.max(1, n);
      if (cfg.tipo === "colunas") {
        X = function (i) { return pl + passoX * i + passoX / 2; };
        var larg = Math.min(24, Math.max(3, passoX - 2));
        dias.forEach(function (d, i) {
          var v = d[cfg.chave] || 0, y = Y(v), x0 = X(i) - larg / 2, h = pt + ih - y;
          var rr = Math.min(4, larg / 2, h);
          corpo += '<path class="col' + (d.send || d.wpp ? " hit" : "") + '" d="M' + x0.toFixed(1) + "," + (pt + ih).toFixed(1) +
            " V" + (y + rr).toFixed(1) + " Q" + x0.toFixed(1) + "," + y.toFixed(1) + " " + (x0 + rr).toFixed(1) + "," + y.toFixed(1) +
            " H" + (x0 + larg - rr).toFixed(1) + " Q" + (x0 + larg).toFixed(1) + "," + y.toFixed(1) + " " + (x0 + larg).toFixed(1) + "," +
            (y + rr).toFixed(1) + " V" + (pt + ih).toFixed(1) + ' Z"/>';
          if (d.send) corpo += '<circle class="mk-mail" cx="' + X(i).toFixed(1) + '" cy="' + (y - 8).toFixed(1) + '" r="4"/>';
          if (d.wpp) corpo += '<circle class="mk-wpp" cx="' + X(i).toFixed(1) + '" cy="' + (y - (d.send ? 18 : 8)).toFixed(1) + '" r="4"/>';
          if (v === mx && v > 0) {
            corpo += '<text class="glabel" x="' + X(i).toFixed(1) + '" y="' + (y - (d.send ? 16 : 6) - (d.wpp ? 10 : 0)).toFixed(1) +
              '" text-anchor="middle" style="font-weight:700;fill:var(--ink)">' + esc(nf(v)) + '</text>';
          }
        });
      } else {
        X = function (i) { return n === 1 ? pl + iw / 2 : pl + iw * i / (n - 1); };
        var pts = dias.map(function (d, i) { return X(i).toFixed(1) + "," + Y(d[cfg.chave] || 0).toFixed(1); });
        var linha = "M" + pts.join(" L");
        var area = linha + " L" + X(n - 1).toFixed(1) + "," + (pt + ih) + " L" + X(0).toFixed(1) + "," + (pt + ih) + " Z";
        corpo += '<path d="' + area + '" fill="var(--brand)" fill-opacity=".1"/><path class="lpath" d="' + linha + '"/>';
        dias.forEach(function (d, i) {
          corpo += '<circle class="pt' + (d.send || d.wpp ? " hit" : "") + '" cx="' + X(i).toFixed(1) + '" cy="' +
            Y(d[cfg.chave] || 0).toFixed(1) + '" r="' + (d.send || d.wpp ? 4.5 : (n > 25 ? 0 : 3)) + '"/>';
        });
      }
      var zonas = "";
      dias.forEach(function (d, i) {
        var cx = cfg.tipo === "colunas" ? X(i) : X(i);
        var w = cfg.tipo === "colunas" ? passoX : Math.max(4, iw / Math.max(1, n - 1));
        zonas += '<rect class="hitzone" x="' + (cx - w / 2).toFixed(1) + '" y="' + pt + '" width="' +
          w.toFixed(1) + '" height="' + ih + '" data-tip="' + esc(dica(d)) + '"/>';
      });
      var passo = Math.max(1, Math.ceil(n / 8)), rot = "";
      dias.forEach(function (d, i) {
        if (i % passo === 0 || i === n - 1) {
          rot += '<text class="xlabel" x="' + X(i).toFixed(1) + '" y="' + (H - 8) + '">' + esc(d.d) + '</text>';
        }
      });
      return '<div class="chart"><svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' +
        esc(cfg.nome) + ' por dia">' + grade + corpo + zonas + rot + '</svg></div>';
    }

    function pintarGrafico(aba, p) {
      var g = $("grafico");
      if (!g) return;
      var cfg = cfgResultado(p);
      g.innerHTML = estado.gran === "dia" ? graficoDia(aba.dias, cfg) : graficoSemana(aba.dias, cfg);
    }

    function blocoResultado(aba, p) {
      if (!aba.dias.length) {
        return '<div class="row"><div class="painel"><h3>' + (p.modelo === "leads" ? "Leads" : "Vendas") +
          ' × disparos</h3><div class="vazio">Sem ' + (p.modelo === "leads" ? "leads" : "vendas") +
          ' registrados neste período ainda.</div></div></div>';
      }
      if (!estado.gran) estado.gran = (p.modelo === "leads" || aba.dias.length <= 14) ? "dia" : "semana";
      var cfg = cfgResultado(p);
      var op = [["semana", "Por semana"], ["dia", "Dia a dia"]];
      return '<div class="row r-72-28"><div class="painel">' +
        '<div class="hrow"><div><h3>' + cfg.nome + ' × disparos</h3>' +
        '<div class="cap">' + (p.modelo === "leads" ? "Leads por dia; dias com disparo marcados acima da coluna"
                                                   : "Receita do parceiro; períodos com disparo marcados em destaque") +
        '</div></div><div class="seg" id="seg-gran">' + op.map(function (o) {
          return '<button data-g="' + o[0] + '"' + (estado.gran === o[0] ? ' class="on"' : '') +
            '>' + esc(o[1]) + '</button>';
        }).join("") + '</div></div><div id="grafico"></div>' +
        '<div class="legenda"><span><i style="background:var(--brand)"></i>' + cfg.nome + '</span>' +
        '<span><i style="background:var(--accent);border-radius:50%"></i>Disparo de e-mail</span>' +
        '<span><i style="background:var(--wpp);border-radius:50%"></i>Disparo de WhatsApp</span>' +
        '<span>' + aba.dias.length + ' dias no período</span></div></div>' +
        (p.modelo === "leads" ? blocoPicos(aba) : blocoMotor(aba)) + '</div>';
    }

    function blocoMotor(aba) {
      var e = aba.email;
      if (!e) return '<div class="painel"><h3>Motor do resultado</h3>' +
        '<div class="cap">Sem campanhas de e-mail neste período</div></div>';
      var mx = Math.max(e.engajado.ab, e.deseng.ab) || 1;
      var txt = (aba.ia && aba.ia.motor) ? rich(aba.ia.motor)
        : !e.deseng.n ? "Sem envio para a base desengajada neste período — só a base engajada foi acionada."
        : "A base engajada abre <b>~" + (e.engajado.ab / (e.deseng.ab || 1)).toFixed(0) + "&times; mais</b> que a base fria.";
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

    function blocoPicos(aba) {
      var k = aba.kpis, picos = k.picos || [];
      var mx = picos.length ? picos[0].v : 1;
      var semana = {};
      (k.semana || []).forEach(function (s) { semana[s[0]] = s; });
      var vals = SEMANA.map(function (d) { return semana[d] ? semana[d][1] : 0; });
      var top = Math.max.apply(null, vals) || 1, melhor = vals.indexOf(top);
      var txt = (aba.ia && aba.ia.motor) ? rich(aba.ia.motor)
        : "Os 3 maiores dias somam <b>" + nf(k.top3_pct, 0) + "%</b> dos leads do período.";
      return '<div class="painel"><h3>Onde estão os leads</h3>' +
        '<div class="cap">Maiores dias e média por dia da semana · ' + esc(aba.periodo) + '</div>' +
        '<div class="rank" style="margin-top:14px">' + picos.map(function (d) {
          return '<div class="rk" data-tip="' + esc(nf(d.v) + " leads · " + nf(d.fatia, 1) + "% do período\n" + d.d + " · " + d.dia) + '">' +
            '<span class="n1"><b>' + esc(d.d) + '</b>' + esc(d.dia) + '</span><span class="bt"><span class="bf res" style="width:' +
            (d.v / mx * 100).toFixed(1) + '%"></span></span><span class="vv">' + nf(d.v) + ' · ' + nf(d.fatia, 0) + '%</span></div>';
        }).join("") + '</div>' +
        '<div class="week baixa" style="margin-top:16px">' + SEMANA.map(function (d, i) {
          var s = semana[d];
          return '<div class="wd ' + (s && s[1] ? "has " : "") + (i === melhor && s ? "best" : "") + '" data-tip="' +
            esc(s ? nf(s[1], 1) + " leads por dia\n" + d + " · " + s[2] + " dia(s), " + s[3] + " leads" : "sem dados\n" + d) + '">' +
            '<span class="v">' + (s ? nf(s[1], 1) : "&mdash;") + '</span>' +
            '<div class="b" style="height:' + (s && s[1] ? Math.max(8, s[1] / top * 100) : 4) + '%"></div>' +
            '<span class="n">' + esc(CURTA[d]) + '</span></div>';
        }).join("") + '</div><div class="tagbox" style="margin-top:12px">' + txt + '</div></div>';
    }

    // ---------- canais ----------
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
            (i === melhor && info.v ? "best" : "") + '" data-tip="' +
            esc((info.v ? nf(info.v, 1) + "% de abertura" : "sem envios") + "\n" + s + (info.n ? " · " + info.n + " envios" : "")) + '">' +
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
      return '<div class="painel" style="display:flex;flex-direction:column"><h3>Melhor horário para clicar</h3>' +
        '<div class="cap">CTR médio por faixa do dia</div>' +
        '<div class="track" style="margin-top:14px">' + ordem.map(function (f) {
          var i = por[f];
          if (!i) return '<div class="slot" data-tip="' + esc("sem envios\n" + f) + '"><span class="v">&mdash;</span>' +
            '<span class="n">' + esc(f) + '</span></div>';
          return '<div class="slot ' + (f === top[0] ? "best" : "") + '" data-tip="' +
            esc(nf(i.v, 2) + "% de CTR\n" + f + " · " + i.n + " envios") + '">' +
            '<div class="fill" style="height:' + Math.max(12, i.v / mx * 100).toFixed(1) + '%"></div>' +
            '<span class="v">' + nf(i.v, 2) + '%</span><span class="n">' + esc(f) + '</span></div>';
        }).join("") + '</div><div class="hbest"><b>' + nf(top[1], 2) + '%</b>' +
        '<span>na faixa ' + esc(top[0]) + ' · ' + esc(top[2]) + ' envios</span></div></div>';
    }

    function cartaoArgolaEmail(e) {
      return '<div class="painel"><h3>Funil de e-mail</h3>' +
        '<div class="cap">Consolidado do período · cada fatia é onde o público parou</div>' + argolaEmail(e) + '</div>';
    }

    function detalheEmail(aba, p) {
      var e = aba.email;
      if (!e) {
        return '<div class="aviso-canal">' + INFO + '<div><b>Sem e-mails deste parceiro no período.</b> ' +
          'Cole o export de e-mails enviados da RD Station em <code>parceiros/' + esc(p.id) +
          '/base_rd_station.xlsx</code> e rode o <code>gerar_hub.py</code>: dia, horário, funil e o cruzamento com ' +
          (p.modelo === "leads" ? "os leads" : "as vendas") + ' aparecem aqui sozinhos.</div></div>' +
          '<div class="row r-3 fantasma-bloco"><div class="painel fx"><h3>Melhor dia para abrir</h3><div class="week" style="margin-top:14px">' +
          SEMANA.map(function (s, i) { return '<div class="wd has"><span class="v">&mdash;</span><div class="b" style="height:' + [45, 60, 72, 55, 48, 34, 26][i] + '%"></div><span class="n">' + CURTA[s] + '</span></div>'; }).join("") +
          '</div></div><div class="painel fx"><h3>Melhor horário para clicar</h3><div class="track" style="margin-top:14px">' +
          ["00h–09h", "09h–12h", "12h–15h", "15h–18h", "18h–24h"].map(function (f) { return '<div class="slot"><span class="v">&mdash;</span><span class="n">' + f + '</span></div>'; }).join("") +
          '</div></div><div class="painel fx"><h3>Funil de e-mail</h3>' + argolaEmail(null, true) + '</div>' +
          '<div class="selo-f"><span>Aguardando o export da RD Station</span></div></div>';
      }
      return '<div class="row r-3" style="margin-top:0">' + cartaoSemana(e) + cartaoHorario(e) + cartaoArgolaEmail(e) + '</div>';
    }

    function detalheWpp(aba, p) {
      var w = aba.whatsapp, cfg = p.whatsapp_cfg || {};
      var ia = (aba.ia && aba.ia.whatsapp) ? '<div class="nota-ia">' + ESTRELA + '<div>' + rich(aba.ia.whatsapp) + '</div></div>' : "";
      if (!w) {
        var fx = function (lbl, val, sub, real) {
          return kpi("wp", lbl, val, sub, false, null, !real);
        };
        return '<div class="kpis k4">' +
          fx("Disparos", "—", "quantidade de disparos") +
          fx("Valor por disparo", cfg.valor_por_disparo ? moeda(cfg.valor_por_disparo, 2) : "a definir",
             cfg.valor_por_disparo ? "tabela de Retail Mídia" : "defina no parceiro.json", !!cfg.valor_por_disparo) +
          fx("Investimento", "—", "disparos × valor por disparo") +
          fx("Custo por disparo", cfg.custo_por_disparo ? moeda(cfg.custo_por_disparo, 2) : "a definir",
             "custo real da mensagem", !!cfg.custo_por_disparo) +
          fx("Conversões", "—", p.modelo === "leads" ? "leads vindos do WhatsApp" : "vendas vindas do WhatsApp") +
          fx("Valores convertidos", "—", "valor das conversões") +
          fx("Custo por conversão", "—", "investimento ÷ conversões") +
          fx("Retorno (ROAS)", "—", "convertido ÷ investido") + '</div>' +
          '<div class="row r-3 fantasma-bloco"><div class="painel fx"><h3>Melhor dia de disparo</h3>' +
          '<div class="week" style="margin-top:14px">' + SEMANA.map(function (s, i) {
            return '<div class="wd has"><span class="v">&mdash;</span><div class="b" style="height:' + [40, 62, 75, 58, 50, 30, 22][i] + '%"></div><span class="n">' + CURTA[s] + '</span></div>';
          }).join("") + '</div></div><div class="painel fx"><h3>Dias com mais cliques</h3><div class="rank" style="margin-top:14px">' +
          [90, 72, 55, 40, 28].map(function (v, i) {
            return '<div class="rk"><span class="n1"><b>—/—</b>—</span><span class="bt"><span class="bf" style="width:' + v + '%"></span></span><span class="vv">—</span></div>';
          }).join("") + '</div></div><div class="painel fx"><h3>Funil do WhatsApp</h3>' + argolaWpp(null, true) + '</div>' +
          '<div class="selo-f"><span>Aguardando os primeiros disparos de WhatsApp</span></div></div>' +
          '<div class="aviso-canal">' + INFO + '<div><b>Terreno pronto.</b> A planilha <code>' + esc(cfg.arquivo || ("parceiros/" + p.id + "/whatsapp.xlsx")) +
          '</code> já existe, com as colunas certas. Cole uma linha por disparo (data, horário, disparos, entregues, lidas, cliques, ' +
          'conversões e valor convertido) e rode o <code>gerar_hub.py</code>: quantidade de disparos, investimento, melhor dia de disparo, ' +
          'dias com mais cliques, custo por conversão e valores convertidos aparecem aqui — e o cronograma passa a usar o histórico real.</div></div>' + ia;
      }
      var ks = [
        kpi("wp", "Disparos", nf(w.disparos), w.campanhas + " campanhas · " + w.periodo, true),
        kpi("wp", "Valor por disparo", w.valor_por_disparo !== null ? moeda(w.valor_por_disparo, 2) : "—", "média ponderada", false),
        kpi("wp", "Investimento", moeda(w.investimento, 2), "disparos × valor por disparo", true),
        kpi("wp", "Custo por disparo", w.custo_por_disparo !== null && w.custo_por_disparo !== undefined ? moeda(w.custo_por_disparo, 2) : "a definir",
            w.custo_total !== null ? "custo total " + moeda(w.custo_total, 2) : "custo real da mensagem", false, null, w.custo_por_disparo === null),
        kpi("wp", "Conversões", nf(w.conversoes), nf(w.tx_conversao, 2) + "% dos disparos", true),
        kpi("wp", "Valores convertidos", moeda(w.valor_convertido, 2), w.receita_por_disparo !== null ? moeda(w.receita_por_disparo, 2) + " por disparo" : "", true),
        kpi("wp", "Custo por conversão", w.custo_por_conversao !== null ? moeda(w.custo_por_conversao, 2) : "—", "investimento ÷ conversões", false),
        kpi("wp", "Retorno (ROAS)", w.roas !== null ? nf(w.roas, 2) + "×" : "—", "convertido ÷ investido", false)
      ];
      var semana = {};
      (w.semana || []).forEach(function (s) { semana[s[0]] = s; });
      var vals = SEMANA.map(function (d) { return semana[d] ? semana[d][1] : 0; });
      var mx = Math.max.apply(null, vals) || 1, melhor = w.melhor_dia ? SEMANA.indexOf(w.melhor_dia[0]) : -1;
      var semanaHtml = '<div class="painel"><h3>Melhor dia de disparo</h3><div class="cap">' + esc(w.criterio_dia) +
        ' por dia da semana</div><div class="week" style="margin-top:14px">' + SEMANA.map(function (d, i) {
          var s = semana[d];
          return '<div class="wd ' + (s ? "has " : "") + (i === melhor ? "best" : "") + '" data-tip="' +
            esc(s ? nf(s[1], 2) + "% · " + d + "\n" + s[2] + " campanha(s) · " + nf(s[5]) + " disparos · " + nf(s[3]) + " conversões · " + nf(s[4]) + " cliques" : "sem disparos\n" + d) + '">' +
            '<span class="v">' + (s ? nf(s[1], 2) + "%" : "&mdash;") + '</span><div class="b" style="height:' +
            (s ? Math.max(8, s[1] / mx * 100) : 4) + '%"></div><span class="n">' + esc(CURTA[d]) + '</span></div>';
        }).join("") + '</div><div class="legenda"><span>Melhor: <b>' + esc(w.melhor_dia ? w.melhor_dia[0] : "—") + '</b></span></div></div>';
      var tops = w.top_cliques || [], mxc = tops.length ? tops[0].cliques : 1;
      var topHtml = '<div class="painel"><h3>Dias com mais cliques</h3><div class="cap">Os 5 dias com mais cliques no período</div>' +
        (tops.length ? '<div class="rank" style="margin-top:14px">' + tops.map(function (t) {
          return '<div class="rk" data-tip="' + esc(nf(t.cliques) + " cliques · CTR " + nf(t.ctr, 2) + "%\n" + t.d + " · " + t.dia + " · " + nf(t.disparos) + " disparos · " + nf(t.conversoes) + " conversões") + '">' +
            '<span class="n1"><b>' + esc(t.d) + '</b>' + esc(t.dia) + '</span><span class="bt"><span class="bf" style="width:' +
            (t.cliques / mxc * 100).toFixed(1) + '%"></span></span><span class="vv">' + nf(t.cliques) + '</span></div>';
        }).join("") + '</div>' : '<div class="vazio">Sem cliques registrados.</div>') + '</div>';
      return '<div class="kpis k4">' + ks.join("") + '</div><div class="row r-3">' + semanaHtml + topHtml +
        '<div class="painel"><h3>Funil do WhatsApp</h3><div class="cap">Consolidado do período · cada fatia é onde o público parou</div>' +
        argolaWpp(w) + '</div></div>' + ia;
    }

    function blocoCanais(aba, p) {
      var e = aba.email, w = aba.whatsapp, cfg = p.whatsapp_cfg || {};
      var cardMail = '<button class="canal' + (estado.canal === "email" ? " on" : "") + '" data-canal="email" role="tab" aria-selected="' +
        (estado.canal === "email") + '">' +
        '<span class="ic mail">' + MAIL + '</span><span class="tx"><span class="t">E-mail · RD Station</span>' +
        '<span class="s">' + (e ? esc(e.periodo) : "sem envios no período") + '</span>' +
        (e ? '<span class="ns"><span><b>' + nf(e.envios) + '</b><span>campanhas</span></span>' +
          '<span><b>' + mil(e.funil.entregues) + '</b><span>entregues</span></span>' +
          '<span><b>' + nf(e.abertura, 1) + '%</b><span>abertura</span></span>' +
          '<span><b>' + nf(e.ctr, 2) + '%</b><span>CTR</span></span></span>' : '') +
        '</span><span class="st ' + (e ? "mail" : "pronto") + '">' + (e ? "ativo" : "aguardando RD") + '</span></button>';
      var cardWpp = '<button class="canal' + (estado.canal === "whatsapp" ? " on" : "") + '" data-canal="whatsapp" role="tab" aria-selected="' +
        (estado.canal === "whatsapp") + '">' +
        '<span class="ic wpp">' + WPP + '</span><span class="tx"><span class="t">WhatsApp</span>' +
        '<span class="s">' + (w ? esc(w.periodo) : "canal pronto · aguardando o 1º disparo") + '</span>' +
        '<span class="ns">' + (w
          ? '<span><b>' + nf(w.disparos) + '</b><span>disparos</span></span><span><b>' + moeda(w.investimento) +
            '</b><span>investido</span></span><span><b>' + nf(w.conversoes) + '</b><span>conversões</span></span>'
          : '<span><b>' + (cfg.valor_por_disparo ? moeda(cfg.valor_por_disparo, 2) : "—") + '</b><span>por disparo</span></span>' +
            '<span><b>0</b><span>disparos</span></span>') + '</span>' +
        '</span><span class="st ' + (w ? "ok" : "pronto") + '">' + (w ? "ativo" : "terreno pronto") + '</span></button>';
      return '<div class="row"><div class="painel"><div class="hrow"><div><h3>Canais de disparo</h3>' +
        '<div class="cap">Toque num canal para ver a análise completa dele</div></div></div>' +
        '<div class="canais" role="tablist">' + cardMail + cardWpp + '</div>' +
        '<div class="canal-det" id="canal-det">' + (estado.canal === "whatsapp" ? detalheWpp(aba, p) : detalheEmail(aba, p)) +
        '</div></div></div>';
    }

    // ---------- cruzamento diario ----------
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
        '<div class="cap">Cada dia de resultado ao lado dos disparos correspondentes</div></div>' +
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

    function pilulas(d) {
      return (d.send ? '<span class="pill yes">' + esc(d.send) + '</span> ' : '') +
        (d.wpp ? '<span class="pill wpp">' + esc(d.wpp) + '</span>' : '') +
        (!d.send && !d.wpp ? '<span class="pill no">sem disparo</span>' : '');
    }

    function pintarCross(aba, p) {
      var alvo = $("cross");
      if (!alvo) return;
      var dias = diasFiltrados(aba);
      if (!dias.length) {
        alvo.innerHTML = '<div class="vazio">Nenhum dia no período selecionado.</div>';
        return;
      }
      var leads = p.modelo === "leads";
      var chave = leads ? "leads" : "vendas";
      var disparos = dias.filter(function (d) { return d.send || d.wpp; }).length;
      var resumo, corpo;
      var mx = Math.max.apply(null, dias.map(function (d) { return d[chave]; })) || 1;
      if (leads) {
        var tot = dias.reduce(function (a, d) { return a + d.leads; }, 0);
        resumo = '<div class="resumo"><b>' + dias.length + '</b> dias · leads <b>' + nf(tot) +
          '</b> · média <b>' + nf(tot / dias.length, 1) + '</b> por dia · <b>' + disparos + '</b> dia(s) com disparo</div>';
      } else {
        var s = dias.reduce(function (a, d) {
          a.v += d.vendas; a.c += d.comissao; a.p += d.pedidos; a.n += d.novos; return a;
        }, { v: 0, c: 0, p: 0, n: 0 });
        resumo = '<div class="resumo"><b>' + dias.length + '</b> dias · vendas <b>' +
          moeda(s.v) + '</b> · comissão <b>' + moeda(s.c, 2) + '</b> · pedidos <b>' + nf(s.p) +
          '</b> · aquisições <b>' + nf(s.n) + '</b> · <b>' + disparos + '</b> dia(s) com disparo</div>';
      }
      if (estado.modo === "tabela") {
        if (leads) {
          corpo = '<div class="tw"><table><thead><tr><th>Dia</th><th>Semana</th><th class="n">Leads</th>' +
            '<th class="n">Acumulado</th><th class="n">% do período</th><th>Disparos no dia</th></tr></thead><tbody>' +
            dias.map(function (d) {
              return '<tr class="' + (d.leads === mx ? "peak" : "") + '"><td>' + esc(d.d) + '</td><td>' + esc(d.dow) + '</td>' +
                '<td class="n">' + nf(d.leads) + '</td><td class="n">' + nf(d.acum) + '</td>' +
                '<td class="n">' + nf(d.pct, 1) + '%</td><td>' + pilulas(d) + '</td></tr>';
            }).join("") + '</tbody></table></div>';
        } else {
          corpo = '<div class="tw"><table><thead><tr><th>Dia</th><th class="n">Vendas (R$)</th>' +
            '<th class="n">Comissão</th><th class="n">Pedidos</th><th class="n">Aquisições</th>' +
            '<th class="n">Ticket</th><th class="n">Conversão</th><th>Disparos no dia</th></tr></thead><tbody>' +
            dias.map(function (d) {
              return '<tr class="' + (d.vendas === mx ? "peak" : "") + '"><td>' + esc(d.d) + '</td>' +
                '<td class="n">' + nf(d.vendas) + '</td><td class="n">' + nf(d.comissao, 2) + '</td>' +
                '<td class="n">' + nf(d.pedidos) + '</td><td class="n">' + nf(d.novos) + '</td>' +
                '<td class="n">' + nf(d.tkm, 2) + '</td>' +
                '<td class="n">' + (d.conv === null ? "&mdash;" : nf(d.conv, 2) + "%") + '</td>' +
                '<td>' + pilulas(d) + '</td></tr>';
            }).join("") + '</tbody></table></div>';
        }
      } else if (estado.modo === "cartoes") {
        corpo = '<div class="cards">' + dias.map(function (d) {
          var marcas = (d.send ? '<span class="dot" title="' + esc(d.send) + '"></span>' : '') +
            (d.wpp ? '<span class="dot w" title="' + esc(d.wpp) + '"></span>' : '');
          return '<div class="dcard ' + (d.send || d.wpp ? "hit" : "") + '">' +
            '<div class="d1"><span>' + esc(d.d) + ' · ' + esc(CURTA[d.dow] || "") + '</span><span style="display:flex;gap:4px">' + marcas + '</span></div>' +
            (leads
              ? '<div class="dv">' + nf(d.leads) + ' leads</div><div class="d1" style="font-size:10.5px">acumulado ' + nf(d.acum) +
                '</div><div class="d2"><span>' + nf(d.pct, 1) + '% do período</span></div>'
              : '<div class="dv">' + moeda(d.vendas) + '</div>' +
                '<div class="d1" style="font-size:10.5px">comissão ' + moeda(d.comissao, 2) + '</div>' +
                '<div class="d2"><span>' + d.pedidos + ' ped.</span><span>' + d.novos + ' aquis.</span>' +
                '<span>' + (d.conv === null ? "&mdash;" : nf(d.conv, 1) + "%") + '</span></div>') + '</div>';
        }).join("") + '</div>';
      } else {
        corpo = '<div class="bars">' + dias.map(function (d) {
          return '<div class="brow ' + (d.send || d.wpp ? "hit" : "") + '" data-tip="' +
            esc((leads ? nf(d.leads) + " leads" : moeda(d.vendas)) + "\n" + d.d + (d.send ? "\nE-mail: " + d.send : "") + (d.wpp ? "\nWhatsApp: " + d.wpp : "")) + '">' +
            '<div class="bn2">' + esc(d.d) + '</div><div class="bt"><div class="bf" style="width:' +
            Math.max(1, d[chave] / mx * 100).toFixed(1) + '%"></div></div>' +
            '<div class="bv">' + (leads ? nf(d.leads) + " leads" : moeda(d.vendas)) + '</div></div>';
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
        (ia.conversao ? '<div class="box b" style="margin-bottom:15px"><b>' +
          (p.modelo === "leads" ? "Abertura, clique e leads:" : "Conversão e abertura:") + '</b> ' +
          rich(ia.conversao) + '</div>' : '') +
        '<div class="cols"><div><h4>O que os dados sustentam</h4><ul>' + sust + '</ul></div>' +
        '<div><h4>Recomendação para o próximo ciclo</h4>' +
        '<div class="box a">' + rich(ia.recomendacao || "") + '</div></div></div></div>';
    }

    function conteudoParceiro(p) {
      var aba = abaDe(p.abas, estado.aba);
      if (p.sem_dados) {
        return '<div class="conteudo" id="conteudo"><div class="painel"><div class="vazio"><b>' + esc(p.nome) +
          ' ainda não tem dados.</b><br>Coloque a planilha de ' + (p.modelo === "leads" ? "leads" : "vendas") +
          ' e o export da RD na pasta <code>parceiros/' + esc(p.id) + '/</code> e rode o gerar_hub.py.</div></div>' +
          blocoCanais(aba, p) + '</div>';
      }
      return '<div class="conteudo" id="conteudo">' + blocoKpis(aba, p) + blocoResultado(aba, p) +
        blocoCanais(aba, p) + blocoCross() + blocoIA(aba, p) + '</div>';
    }

    function telaParceiro() {
      var p = parceiroAtual();
      if (!p) { estado.tela = "hub"; return telaHub(); }
      aplicarTema({ cores: p.cores, cores_escuro: p.cores_escuro, rampa: p.rampa });
      var aba = abaDe(p.abas, estado.aba);
      var sub = esc(p.segmento) + ' · ' + (p.modelo === "leads" ? "resultado medido em leads"
        : nf((p.taxa_comissao || 0) * 100, 0) + '% de comissão') +
        (p.ficticio ? ' · <b style="color:var(--warn-ink)">dados de teste</b>' : '');
      var topo = '<div class="topo"><div class="marca">' +
        '<span class="sig" style="background:' + esc(p.cores.brand) + '">' +
        '<span style="font-family:var(--disp);font-weight:800;font-size:19px;color:#fff">' +
        esc(p.nome.charAt(0)) + '</span></span>' +
        '<div><h1>' + esc(p.nome) + '</h1><div class="sub">' + sub + '</div></div></div>' +
        '<div class="dir"><button class="btn volta" id="voltar">' + VOLTA + 'Todos os parceiros</button>' +
        '<span class="chip" id="chip-periodo">' + esc(aba.periodo) + '</span>' +
        '<span class="chip live">Atualizado <b style="margin-left:4px">' +
        esc(D.atualizado) + '</b></span>' + botaoCrono() + botaoTema() + '</div></div>';

      tela.innerHTML = topo + navAbas(p.abas) + conteudoParceiro(p) + rodape();
      ligarTopoParceiro(p);
      ligarNav(p.abas, function () {
        var c = $("conteudo");
        if (c) c.outerHTML = conteudoParceiro(p);
        ligarParceiro(p);
      });
      ligarParceiro(p);
    }

    function ligarTopoParceiro(p) {
      var v = $("voltar");
      if (v) v.addEventListener("click", function () {
        estado.tela = "hub"; estado.parceiro = null; estado.aba = "geral"; estado.mesesAbertos = false;
        guardar("tela", "hub");
        trocar(telaHub);
      });
      ligarTema();
      $("bt-crono").addEventListener("click", function () { abrirCronograma(p.id); });
    }

    function ligarParceiro(p) {
      var aba = abaDe(p.abas, estado.aba);
      pintarGrafico(aba, p);
      pintarCross(aba, p);
      ligarArgolas();

      root.querySelectorAll("#seg-gran button").forEach(function (b) {
        b.addEventListener("click", function () {
          estado.gran = b.getAttribute("data-g");
          guardar("gran", estado.gran);
          root.querySelectorAll("#seg-gran button").forEach(function (x) { x.classList.remove("on"); });
          b.classList.add("on");
          pintarGrafico(aba, p);
        });
      });

      root.querySelectorAll(".canal").forEach(function (b) {
        b.addEventListener("click", function () {
          var c = b.getAttribute("data-canal");
          if (c === estado.canal) return;
          estado.canal = c;
          guardar("canal", c);
          root.querySelectorAll(".canal").forEach(function (x) {
            x.classList.toggle("on", x === b);
            x.setAttribute("aria-selected", x === b ? "true" : "false");
          });
          var det = $("canal-det");
          det.classList.add("saindo");
          setTimeout(function () {
            det.innerHTML = c === "whatsapp" ? detalheWpp(aba, p) : detalheEmail(aba, p);
            ligarArgolas();
            void det.offsetWidth;
            det.classList.remove("saindo");
          }, 200);
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
          var c = $("conteudo");
          if (c) c.outerHTML = conteudoParceiro(p);
          ligarParceiro(p);
        });
      });

      root.querySelectorAll("#seg-modo button").forEach(function (b) {
        b.addEventListener("click", function () {
          estado.modo = b.getAttribute("data-m");
          guardar("modo", estado.modo);
          root.querySelectorAll("#seg-modo button").forEach(function (x) { x.classList.remove("on"); });
          b.classList.add("on");
          pintarCross(aba, p);
        });
      });

      var de = $("dt-de"), ate = $("dt-ate");
      if (de) de.addEventListener("change", function () { estado.de = de.value; pintarCross(aba, p); });
      if (ate) ate.addEventListener("change", function () { estado.ate = ate.value; pintarCross(aba, p); });
    }

    // =================================================================
    // CRONOGRAMA — senha, opcoes, previa e exportacao
    // =================================================================
    var VARIANTES = {
      ambos: { nome: "E-mail + WhatsApp", curto: "e-mail e WhatsApp", d: "E-mail nos melhores dias e WhatsApp reimpactando quem não abriu.", ics: ["mail", "wpp"] },
      email: { nome: "Só e-mail", curto: "só e-mail", d: "E-mail nos melhores dias e repique por e-mail para quem não abriu.", ics: ["mail"] },
      whatsapp: { nome: "Só WhatsApp", curto: "só WhatsApp", d: "WhatsApp com mais frequência, nos dias em que o público mais responde.", ics: ["wpp"] }
    };
    var TIPO_NOME = { principal: "E-mail", recorrente: "E-mail recorrente", repique: "E-mail repique",
                      reimpacto: "WhatsApp reimpacto", disparo: "WhatsApp" };

    function escopoNome(escopo) {
      return escopo === "hub" ? "Todos os parceiros" : (parceiroPorId(escopo) || {}).nome || "";
    }
    function cronoDe(escopo) {
      return escopo === "hub" ? D.hub.cronograma : (parceiroPorId(escopo) || {}).cronograma;
    }

    function abrirModal(html, largura) {
      modal.innerHTML = '<div class="mbox ' + (largura || "") + '" tabindex="-1">' + html + '</div>';
      modal.classList.add("on");
      modal.setAttribute("aria-hidden", "false");
      var fecha = modal.querySelectorAll("[data-fechar]");
      fecha.forEach(function (b) { b.addEventListener("click", fecharModal); });
      var caixa = modal.querySelector(".mbox");
      if (caixa) caixa.focus({ preventScroll: true });
    }
    function fecharModal() {
      modal.classList.remove("on");
      modal.setAttribute("aria-hidden", "true");
      tip.classList.remove("on");
      setTimeout(function () { if (!modal.classList.contains("on")) modal.innerHTML = ""; }, 300);
      var b = $("bt-crono");
      if (b) b.focus();
    }
    modal.addEventListener("click", function (ev) { if (ev.target === modal) fecharModal(); });
    // No document, e nao no modal: um botao que fica desabilitado durante a
    // exportacao perde o foco, e o Esc deixaria de chegar ao modal.
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && modal.classList.contains("on")) fecharModal();
    });

    function cabecalhoModal(titulo, sub, extra, icone) {
      return '<div class="mhd"><span class="ic">' + (icone || CAL) + '</span><div><h3>' + esc(titulo) +
        '</h3><div class="sub">' + esc(sub) + '</div></div><div class="acoes">' + (extra || "") + '</div>' +
        '<button class="tbtn mfecha" data-fechar aria-label="Fechar">' + XIS + '</button></div>';
    }

    function abrirCronograma(escopo) {
      cr.escopo = escopo;
      var c = cronoDe(escopo);
      if (!c) { avisar("Cronograma ainda não gerado — rode o gerar_hub.py."); return; }
      if (sessao("crono") === "1") { telaOpcoes(); } else { telaSenha(); }
    }

    function telaSenha() {
      abrirModal(cabecalhoModal("Cronograma de disparos", escopoNome(cr.escopo), "", CADEADO) +
        '<div class="mcorpo centro"><div class="cadeado">' + CADEADO + '</div>' +
        '<h4>Área protegida</h4><div class="exp">Digite a senha de 4 dígitos para gerar o cronograma.</div>' +
        '<form id="f-pin" autocomplete="off"><div class="pin" id="pin">' +
        [0, 1, 2, 3].map(function (i) {
          return '<input type="password" inputmode="numeric" maxlength="1" pattern="[0-9]*" aria-label="Dígito ' + (i + 1) + '" data-i="' + i + '">';
        }).join("") + '</div><div class="msg-erro" id="pin-msg" aria-live="polite"></div>' +
        '<button class="btn-pri" type="submit" id="pin-ok">' + ABERTO + 'Liberar</button></form></div>', "estreito");
      var ins = modal.querySelectorAll(".pin input");
      ins[0].focus();
      ins.forEach(function (inp, i) {
        inp.addEventListener("input", function () {
          inp.value = inp.value.replace(/\D/g, "").slice(-1);
          if (inp.value && i < 3) ins[i + 1].focus();
          if (i === 3 && inp.value) conferir();
        });
        inp.addEventListener("keydown", function (ev) {
          if (ev.key === "Backspace" && !inp.value && i > 0) { ins[i - 1].focus(); ins[i - 1].value = ""; }
          if (ev.key === "ArrowLeft" && i > 0) ins[i - 1].focus();
          if (ev.key === "ArrowRight" && i < 3) ins[i + 1].focus();
        });
        inp.addEventListener("paste", function (ev) {
          var t = ((ev.clipboardData || window.clipboardData).getData("text") || "").replace(/\D/g, "").slice(0, 4);
          if (!t) return;
          ev.preventDefault();
          t.split("").forEach(function (ch, j) { if (ins[j]) ins[j].value = ch; });
          if (t.length === 4) conferir(); else ins[t.length].focus();
        });
      });
      modal.querySelector("#f-pin").addEventListener("submit", function (ev) { ev.preventDefault(); conferir(); });
      function conferir() {
        var pin = Array.prototype.map.call(ins, function (x) { return x.value; }).join("");
        var msg = modal.querySelector("#pin-msg"), caixa = modal.querySelector("#pin");
        if (pin.length < 4) { msg.textContent = "Digite os 4 dígitos."; return; }
        if (hash("supertroco|" + pin) === SENHA_HASH) {
          sessao("crono", "1");
          var b = $("bt-crono");
          if (b) b.innerHTML = ABERTO + "Cronograma";
          telaOpcoes();
        } else {
          msg.textContent = "Senha incorreta. Tente de novo.";
          caixa.classList.remove("erro");
          void caixa.offsetWidth;
          caixa.classList.add("erro");
          ins.forEach(function (x) { x.value = ""; });
          ins[0].focus();
        }
      }
    }

    function parceirosDoEscopo() {
      return cr.escopo === "hub" ? D.parceiros.filter(function (p) { return p.cronograma; })
                                 : [parceiroPorId(cr.escopo)].filter(function (p) { return p && p.cronograma; });
    }

    function telaOpcoes() {
      var c = cronoDe(cr.escopo), partes = parceirosDoEscopo();
      var valores = [];
      partes.forEach(function (p) {
        var v = p.cronograma.whatsapp.valor_por_disparo;
        if (v && valores.indexOf(v) < 0) valores.push(v);
      });
      if (cr.valor === "") cr.valor = valores.length ? String(valores[0]).replace(".", ",") : "0,42";
      if (cr.volume === "") {
        var vol = partes.map(function (p) { return p.cronograma.whatsapp.volume_por_disparo; }).filter(Boolean)[0];
        cr.volume = vol ? String(vol) : "";
      }
      var ops = Object.keys(VARIANTES).map(function (k) {
        var v = VARIANTES[k], nE = 0, nW = 0;
        partes.forEach(function (p) {
          p.cronograma.variantes[k].forEach(function (s) { if (s.canal === "email") nE++; else nW++; });
        });
        return '<button class="op' + (cr.variante === k ? " on" : "") + '" data-v="' + k + '" role="radio" aria-checked="' +
          (cr.variante === k) + '"><span class="ok">' + CHECK + '</span><span class="ics">' + v.ics.map(function (i) {
            return '<span class="ic ' + i + '">' + (i === "mail" ? MAIL : WPP) + '</span>';
          }).join("") + '</span><span class="t">' + esc(v.nome) + '</span><span class="d">' + esc(v.d) + '</span>' +
          '<span class="n"><b>' + nE + '</b> e-mails · <b>' + nW + '</b> WhatsApp no mês</span></button>';
      }).join("");
      abrirModal(cabecalhoModal("Cronograma de " + c.nome, escopoNome(cr.escopo) + " · baseado nos dados do hub e na análise do agente") +
        '<div class="mcorpo"><div class="passo">1 · Canais</div>' +
        '<div class="opcoes" role="radiogroup" aria-label="Canais do cronograma">' + ops + '</div>' +
        '<div class="campos" id="campos-wpp"' + (cr.variante === "email" ? " hidden" : "") + '>' +
        '<div class="campo"><label for="in-vol">Volume por disparo de WhatsApp</label>' +
        '<input id="in-vol" inputmode="numeric" placeholder="ex.: 20.000" value="' + esc(cr.volume) + '">' +
        '<div class="aj">Contatos com opt-in por disparo' + (cr.escopo === "hub" ? ", para cada parceiro" : "") +
        '. Deixe em branco para o cronograma sair com "a definir".</div></div>' +
        '<div class="campo"><label for="in-valor">Valor por disparo (R$)</label>' +
        '<input id="in-valor" inputmode="decimal" value="' + esc(cr.valor) + '">' +
        '<div class="aj">Tabela de Retail Mídia' + (valores.length ? " (" + valores.map(function (v) { return moeda(v, 2); }).join(", ") + ")" : "") +
        '. Usado para o investimento do mês.</div></div></div>' +
        '<div class="rodape-m"><div class="i">O motor escolhe dia, canal, horário e volume a partir dos dados de cada parceiro ' +
        '(abertura, cliques e resultado por dia da semana, disparos recorrentes, feriados e datas de pagamento). ' +
        'O agente escreve tema, assunto e mensagem de cada dia.</div>' +
        '<button class="btn-pri" id="bt-gerar">' + CAL + 'Gerar cronograma</button></div></div>', "medio");
      modal.querySelectorAll(".op").forEach(function (b) {
        b.addEventListener("click", function () {
          cr.variante = b.getAttribute("data-v");
          modal.querySelectorAll(".op").forEach(function (x) {
            x.classList.toggle("on", x === b);
            x.setAttribute("aria-checked", x === b ? "true" : "false");
          });
          modal.querySelector("#campos-wpp").hidden = cr.variante === "email";
        });
      });
      modal.querySelector("#bt-gerar").addEventListener("click", function () {
        cr.volume = (modal.querySelector("#in-vol").value || "").trim();
        cr.valor = (modal.querySelector("#in-valor").value || "").trim();
        cr.plano = montarPlano();
        cr.dia = null;
        telaResultado();
      });
    }

    function numeroBr(txt) {
      var s = String(txt || "").replace(/[^\d,.-]/g, "");
      if (!s) return null;
      if (s.indexOf(",") >= 0) s = s.replace(/\./g, "").replace(",", ".");
      else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, "");
      var n = parseFloat(s);
      return isFinite(n) ? n : null;
    }

    function montarPlano() {
      var c = cronoDe(cr.escopo), variante = cr.variante;
      var volW = numeroBr(cr.volume), valW = numeroBr(cr.valor);
      var partes = parceirosDoEscopo().map(function (p) {
        var cc = p.cronograma;
        var valor = valW !== null ? valW : cc.whatsapp.valor_por_disparo;
        var slots = cc.variantes[variante].map(function (s) {
          var t = cc.dias[s.data] || {};
          var o = {};
          Object.keys(s).forEach(function (k) { o[k] = s[k]; });
          o.parceiro = p.id; o.pnome = p.nome; o.cor = p.cores.brand;
          o.tema = t.tema || ""; o.assunto = t.assunto || ""; o.mensagem = t.mensagem || "";
          o.rotulo = TIPO_NOME[s.tipo] || s.canal;
          if (s.canal === "whatsapp") {
            o.volume = s.volume || volW || null;
            o.valor = valor || null;
            o.custo = o.volume && o.valor ? o.volume * o.valor : null;
          } else {
            o.valor = null; o.custo = null;
          }
          return o;
        });
        var pj = cc.projecao[variante];
        return { id: p.id, nome: p.nome, cor: p.cores.brand, deep: p.cores.deep, modelo: p.modelo,
                 segmento: p.segmento, slots: slots, dias: cc.dias, fatos: cc.fatos,
                 evidencias: cc.evidencias, premissas: cc.premissas, estrategia: cc.estrategia,
                 nota: variante === "email" ? cc.notas.email : variante === "whatsapp" ? cc.notas.whatsapp : "",
                 projecao: pj, valor: valor };
      });
      var todos = [];
      partes.forEach(function (p) { todos = todos.concat(p.slots); });
      todos.sort(function (a, b) { return a.data < b.data ? -1 : a.data > b.data ? 1 : a.canal === "email" ? -1 : 1; });
      var tot = { email: 0, wpp: 0, volEmail: 0, volWpp: 0, invest: 0, aberturas: 0, cliques: 0, wppSemVolume: 0, resultado: [] };
      todos.forEach(function (s) {
        if (s.canal === "email") { tot.email++; tot.volEmail += s.volume || 0; }
        else { tot.wpp++; if (s.volume) tot.volWpp += s.volume; else tot.wppSemVolume++; tot.invest += s.custo || 0; }
      });
      partes.forEach(function (p) {
        tot.aberturas += p.projecao.aberturas || 0;
        tot.cliques += p.projecao.cliques || 0;
        if (p.projecao.resultado) tot.resultado.push({ nome: p.nome, r: p.projecao.resultado });
      });
      var fatos = {};
      Object.keys(c.fatos || {}).forEach(function (k) { fatos[k] = c.fatos[k].slice(); });
      return { escopo: cr.escopo, variante: variante, mes: c.mes, nome: c.nome, gerado: c.gerado_em,
               titulo: cr.escopo === "hub" ? "Hub Supertroco" : partes[0].nome,
               partes: partes, slots: todos, fatos: fatos, tot: tot,
               estrategia: cr.escopo === "hub" ? c.estrategia : partes[0].estrategia,
               nota: cr.escopo === "hub" ? "" : partes[0].nota,
               cuidados: cr.escopo === "hub" ? (c.cuidados || []) : [],
               regras: cr.escopo === "hub" ? (c.regras || []) : [],
               evidencias: cr.escopo === "hub" ? [] : partes[0].evidencias,
               premissas: cr.escopo === "hub" ? [] : partes[0].premissas };
    }

    function semanasDoMes(mesIso) {
      var ano = +mesIso.slice(0, 4), m = +mesIso.slice(5, 7) - 1;
      var d = new Date(ano, m, 1), semanas = [], atual = new Array(7).fill(null);
      while (d.getMonth() === m) {
        atual[d.getDay()] = new Date(d);
        if (d.getDay() === 6) { semanas.push(atual); atual = new Array(7).fill(null); }
        d.setDate(d.getDate() + 1);
      }
      if (atual.some(function (x) { return x; })) semanas.push(atual);
      return semanas;
    }
    function iso(d) {
      return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    }
    function slotsDoDia(plano, dia) { return plano.slots.filter(function (s) { return s.data === dia; }); }
    function fatosDoDia(plano, dia) {
      var f = (plano.fatos[dia] || []).slice();
      if (plano.escopo !== "hub") return f;
      plano.partes.forEach(function (p) {
        (p.fatos[dia] || []).forEach(function (x) { if (f.indexOf(x) < 0) f.push(x); });
      });
      return f;
    }
    function temaDoDia(plano, dia) {
      var ts = [];
      plano.partes.forEach(function (p) {
        var t = (p.dias[dia] || {}).tema;
        var tem = plano.slots.some(function (s) { return s.data === dia && s.parceiro === p.id; });
        if (t && tem) ts.push(plano.escopo === "hub" ? p.nome + ": " + t : t);
      });
      return ts;
    }
    function volTxt(s) { return s.volume ? mil(s.volume) : "a definir"; }

    function chipSlot(s, plano) {
      var icone = s.canal === "email" ? MAIL : WPP;
      return '<div class="sc ' + s.canal + '" data-tip="' + esc(s.rotulo + " · " + s.janela + "\n" +
        (plano.escopo === "hub" ? s.pnome + " · " : "") + s.base + " · " + volTxt(s)) + '">' +
        (plano.escopo === "hub" ? '<span class="pd" style="background:' + esc(s.cor) + '"></span>' : icone) +
        '<span>' + esc((s.canal === "email" ? (s.tipo === "repique" ? "Repique" : s.tipo === "recorrente" ? "Recorr." : "E-mail")
                                             : (s.tipo === "reimpacto" ? "Reimp." : "WhatsApp")) + " " + s.janela.split(" | ")[0]) +
        '</span></div>';
    }

    function calendarioHtml(plano) {
      var sem = semanasDoMes(plano.mes);
      var cab = DOM_SAB.map(function (d) { return '<div class="cab">' + esc(d.slice(0, 3)) + '</div>'; }).join("");
      var cel = sem.map(function (w) {
        return w.map(function (d) {
          if (!d) return '<div class="dia fora" aria-hidden="true"></div>';
          var k = iso(d), ss = slotsDoDia(plano, k), fs = fatosDoDia(plano, k);
          var feriado = fs.some(function (f) { return /^Feriado/.test(f); });
          var tema = temaDoDia(plano, k);
          return '<button class="dia' + (ss.length ? "" : " livre") + (cr.dia === k ? " on" : "") + '" data-dia="' + k + '">' +
            '<span class="dn">' + d.getDate() + (feriado ? '<span class="fer">feriado</span>' : "") + '</span>' +
            (fs.length ? '<span class="ft" title="' + esc(fs.join(" · ")) + '">' + esc(fs[0].replace("Feriado nacional: ", "")) + '</span>' : "") +
            (tema.length ? '<span class="tm">' + esc(tema[0]) + '</span>' : "") +
            ss.map(function (s) { return chipSlot(s, plano); }).join("") + '</button>';
        }).join("");
      }).join("");
      var lista = plano.slots.length ? agruparPorDia(plano).map(function (g) {
        return '<div class="li"><div class="dn">' + esc(g.rot) + '</div>' +
          (g.tema.length ? '<div class="tm">' + esc(g.tema.join(" · ")) + '</div>' : "") +
          g.slots.map(function (s) { return chipSlot(s, plano); }).join("") + '</div>';
      }).join("") : '<div class="vazio">Nenhum disparo nesta opção.</div>';
      return '<div class="cal cal-cab">' + cab + '</div><div class="cal">' + cel + '</div><div class="cr-lista">' + lista + '</div>';
    }

    function agruparPorDia(plano) {
      var grupos = [], atual = null;
      plano.slots.forEach(function (s) {
        if (!atual || atual.data !== s.data) {
          var d = dataIso(s.data);
          atual = { data: s.data, rot: ddmm(s.data) + " · " + DOM_SAB[d.getDay()], slots: [], tema: temaDoDia(plano, s.data) };
          grupos.push(atual);
        }
        atual.slots.push(s);
      });
      return grupos;
    }

    function detalheDia(plano, k) {
      if (!k) {
        return '<h5>Detalhe do dia</h5><div class="vazio-d" style="margin-top:6px">Toque num dia do calendário para ver tema, assunto, ' +
          'mensagem de WhatsApp, volume e o motivo da escolha.</div>' +
          (plano.regras.length ? '<div class="it"><div class="cn">Regras de convivência</div><ul style="margin:6px 0 0 16px;font-size:11.5px;color:var(--ink2);line-height:1.6">' +
            plano.regras.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + '</ul></div>' : "");
      }
      var d = dataIso(k), ss = slotsDoDia(plano, k), fs = fatosDoDia(plano, k);
      return '<h5>' + esc(ddmm(k) + " · " + DOM_SAB[d.getDay()]) + '</h5>' +
        (fs.length ? '<div class="fts">' + fs.map(function (f) { return '<span class="ft" style="font-size:11px;color:var(--warn-ink);background:var(--warn-bg);border-radius:6px;padding:3px 8px">' + esc(f) + '</span>'; }).join("") + '</div>' : "") +
        (ss.length ? ss.map(function (s) {
          var cor = s.canal === "email" ? "var(--mail)" : "var(--wpp)";
          return '<div class="it"><div class="cn"><span style="color:' + cor + ';display:inline-flex;width:15px">' + (s.canal === "email" ? MAIL : WPP) + '</span>' +
            esc(s.rotulo) + '<span class="bdg">' + esc(s.janela) + '</span></div><dl>' +
            (plano.escopo === "hub" ? '<dt>Parceiro</dt><dd>' + esc(s.pnome) + '</dd>' : "") +
            '<dt>Tema</dt><dd>' + esc(s.tema || "—") + '</dd><dt>Base</dt><dd>' + esc(s.base) + '</dd>' +
            '<dt>Volume</dt><dd>' + esc(s.volume ? nf(s.volume) + " contatos" : "a definir") + '</dd>' +
            (s.canal === "whatsapp" ? '<dt>Investimento</dt><dd>' + esc(s.custo ? moeda(s.custo, 2) : "defina o volume") + '</dd>' : "") +
            '<dt>Por quê</dt><dd>' + esc(s.motivo) + '</dd></dl>' +
            '<div class="msg">' + esc(s.canal === "email" ? "Assunto: " + (s.assunto || "—") : (s.mensagem || "—")) + '</div></div>';
        }).join("") : '<div class="vazio-d" style="margin-top:8px">Sem disparo neste dia — ' +
          (plano.variante === "whatsapp" ? "o WhatsApp respeita a folga entre envios." : "dia livre para a base descansar.") + '</div>');
    }

    function resumoPlano(plano) {
      var t = plano.tot;
      var res = t.resultado.map(function (x) {
        return x.r.unidade === "vendas" ? x.nome + ": ≈ " + moeda(x.r.valor) + " em vendas" : x.nome + ": ≈ " + nf(x.r.valor) + " leads";
      }).join(" · ");
      var cards = [
        kpi("rd", "E-mails no mês", nf(t.email), t.email ? mil(t.volEmail) + " envios no total" : "sem e-mail nesta opção", t.email > 0, null, !t.email),
        kpi("wp", "WhatsApp no mês", nf(t.wpp), t.wpp ? (t.volWpp ? mil(t.volWpp) + " disparos" : "volume a definir") : "sem WhatsApp nesta opção", t.wpp > 0, null, !t.wpp),
        kpi("wp", "Investimento", t.wpp ? (t.invest ? moeda(t.invest, 2) : "—") : "—",
            t.wpp ? (t.wppSemVolume ? "WhatsApp · informe o volume por disparo" : "WhatsApp · volume × valor por disparo") : "sem WhatsApp nesta opção", false, null, !t.invest),
        kpi("res", "Aberturas projetadas", t.email ? mil(t.aberturas) : "—",
            t.email ? mil(t.cliques) + " cliques" + (res ? " · " + res : "") : "sem histórico de WhatsApp para projetar", false, null, !t.email)
      ];
      return '<div class="cr-res">' + cards.join("") + '</div>';
    }

    function blocoEstrategia(plano) {
      var ev = plano.escopo === "hub" ? [] : plano.evidencias;
      var cuid = plano.cuidados || [];
      if (!plano.estrategia && !ev.length && !cuid.length) return "";
      return '<div class="cr-est"><div class="hd">' + ESTRELA + 'Estratégia do mês · análise do agente</div>' +
        (plano.estrategia ? '<div>' + rich(plano.estrategia) + '</div>' : '<div>Estratégia montada pelo motor a partir dos dados abaixo.</div>') +
        (plano.nota ? '<div class="nota">' + rich(plano.nota) + '</div>' : "") +
        (cuid.length ? '<ul>' + cuid.map(function (x) { return "<li>" + rich(x) + "</li>"; }).join("") + '</ul>' : "") +
        (ev.length ? '<details class="porque"><summary>' + CHEV.replace('class="chev"', 'class="chev" style="width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2"') +
          'Por que esses dias? (o que os dados mostram)</summary><ul>' +
          ev.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul></details>' : "") + '</div>';
    }

    function telaResultado() {
      var plano = cr.plano, v = VARIANTES[plano.variante];
      var acoes = '<button class="btn-sec" id="bt-ajustar">' + VOLTA + 'Ajustar</button>' +
        '<button class="btn-sec" id="bt-xlsx">' + BAIXAR + 'Baixar XLSX</button>' +
        '<button class="btn-pri" id="bt-pdf">' + BAIXAR + 'Baixar PDF</button>';
      var legenda = '<div class="leg-c">' +
        (plano.escopo === "hub" ? plano.partes.map(function (p) {
          return '<span><i style="background:' + esc(p.cor) + ';border-radius:50%"></i>' + esc(p.nome) + '</span>';
        }).join("") : "") +
        '<span><i style="background:var(--mail)"></i>E-mail</span><span><i style="background:var(--wpp)"></i>WhatsApp</span></div>';
      abrirModal(cabecalhoModal("Cronograma de " + plano.nome + " · " + v.nome, escopoNome(plano.escopo) +
        " · gerado a partir do hub.json de " + plano.gerado, acoes) +
        '<div class="mcorpo">' + resumoPlano(plano) + blocoEstrategia(plano) +
        (plano.tot.wpp && plano.tot.wppSemVolume ? '<div class="aviso-inline">WhatsApp sem histórico e sem volume informado: os disparos saem com volume "a definir". ' +
          'Toque em <b>Ajustar</b> para informar o volume por disparo e calcular o investimento.</div>' : "") +
        '<div class="cr-grade"><div><div class="cal-hd"><h4>' + esc(plano.nome) + '</h4>' + legenda + '</div>' +
        calendarioHtml(plano) + '</div><div class="cr-det" id="cr-det">' + detalheDia(plano, cr.dia) + '</div></div></div>');
      modal.querySelector("#bt-ajustar").addEventListener("click", telaOpcoes);
      modal.querySelector("#bt-xlsx").addEventListener("click", function () { exportar("xlsx", this); });
      modal.querySelector("#bt-pdf").addEventListener("click", function () { exportar("pdf", this); });
      modal.querySelectorAll(".cal .dia[data-dia]").forEach(function (b) {
        b.addEventListener("click", function () {
          cr.dia = b.getAttribute("data-dia");
          modal.querySelectorAll(".cal .dia").forEach(function (x) { x.classList.toggle("on", x === b); });
          modal.querySelector("#cr-det").innerHTML = detalheDia(plano, cr.dia);
        });
      });
    }

    function nomeArquivo(plano, ext) {
      var base = (plano.escopo === "hub" ? "Hub_Supertroco" : plano.titulo).normalize("NFD").replace(/[̀-ͯ]/g, "")
        .replace(/[^A-Za-z0-9]+/g, "_");
      var v = { ambos: "Email_WhatsApp", email: "Email", whatsapp: "WhatsApp" }[plano.variante];
      return "Cronograma_" + base + "_" + plano.nome.replace(" ", "_") + "_" + v + "." + ext;
    }

    function baixarBlob(blob, nome) {
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = nome; a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 2000);
    }

    function exportar(tipo, botao) {
      if (cr.ocupado) return;
      cr.ocupado = true;
      var original = botao.innerHTML;
      botao.disabled = true;
      botao.innerHTML = '<span class="gira"></span>Gerando ' + tipo.toUpperCase() + "…";
      var trabalho = tipo === "xlsx" ? gerarXLSX(cr.plano) : gerarPDF(cr.plano);
      trabalho.then(function (nome) {
        avisar("Pronto: " + nome);
      }).catch(function (err) {
        avisar("Não foi possível gerar o " + tipo.toUpperCase() + ": " + err.message);
      }).then(function () {
        cr.ocupado = false;
        botao.disabled = false;
        botao.innerHTML = original;
        if (modal.classList.contains("on")) botao.focus({ preventScroll: true });
      });
    }

    // ---------- cores fixas das exportacoes (impressao clara) ----------
    var XC = {
      mail: { fill: "DCE9F7", bar: "2A78D6", ink: "173E6E" },
      repique: { fill: "EAF1FB", bar: "7FA8E0", ink: "173E6E" },
      recorrente: { fill: "E5ECF5", bar: "5B7FB3", ink: "22395C" },
      wpp: { fill: "DAF2DE", bar: "1BAF7A", ink: "11563B" },
      cab: "3C3C3C", tema: "F2F2F2", fora: "F7F7F7", linha: "D9DEE2"
    };
    function corSlot(s) {
      return s.canal === "whatsapp" ? XC.wpp : s.tipo === "repique" ? XC.repique : s.tipo === "recorrente" ? XC.recorrente : XC.mail;
    }
    function hx(c) { return String(c || "").replace("#", "").toUpperCase(); }
    function misturar(a, b, t) {
      var x = rgb(a), y = rgb(b);
      return x.map(function (v, i) { return Math.round(v + (y[i] - v) * t).toString(16).padStart(2, "0"); }).join("").toUpperCase();
    }
    function luminancia(hex) {
      var c = rgb(hex).map(function (v) { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
      return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    }
    // Cor da marca escurecida ate o texto branco passar de 4,5:1 (faixas, titulos).
    function corForte(hex) {
      var base = hx(hex), c = base, t = 0;
      while (1.05 / (luminancia(c) + 0.05) < 4.6 && t < 0.9) { t += 0.04; c = misturar(base, "000000", t); }
      return c;
    }

    // =================================================================
    // XLSX (ExcelJS) — no espirito do calendario de Retail Midia do time
    // =================================================================
    function gerarXLSX(plano) {
      return carregarLib("xlsx").then(function (ExcelJS) {
        var wb = new ExcelJS.Workbook();
        wb.creator = "Hub Supertroco";
        wb.created = new Date();
        if (plano.escopo === "hub") {
          folhaCalendario(wb, "Calendário geral", plano, plano.slots, "Hub Supertroco", "0E7C7B", true);
          plano.partes.forEach(function (p) {
            folhaCalendario(wb, p.nome.slice(0, 28), plano, p.slots, p.nome, corForte(p.cor), false, p);
          });
        } else {
          folhaCalendario(wb, "Calendário", plano, plano.slots, plano.partes[0].nome, corForte(plano.partes[0].cor), false, plano.partes[0]);
        }
        folhaLista(wb, plano);
        folhaEstrategia(wb, plano);
        return wb.xlsx.writeBuffer();
      }).then(function (buf) {
        var nome = nomeArquivo(plano, "xlsx");
        baixarBlob(new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), nome);
        return nome;
      });
    }

    function estilo(cel, o) {
      if (o.fill) cel.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF" + o.fill } };
      cel.font = { name: "Calibri", size: o.size || 9, bold: !!o.bold, italic: !!o.italic, color: { argb: "FF" + (o.color || "1A1A1A") } };
      cel.alignment = { horizontal: o.h || "center", vertical: o.v || "middle", wrapText: o.wrap !== false };
      if (o.border) {
        var b = { style: "thin", color: { argb: "FF" + XC.linha } };
        cel.border = { top: b, left: b, bottom: b, right: b };
      }
      if (o.fmt) cel.numFmt = o.fmt;
    }

    function folhaCalendario(wb, nome, plano, slots, titulo, cor, geral, parte) {
      var ws = wb.addWorksheet(nome, {
        views: [{ showGridLines: false }],
        pageSetup: { orientation: "landscape", paperSize: 9, fitToPage: true, fitToWidth: 1, fitToHeight: 0,
                     margins: { left: 0.3, right: 0.3, top: 0.4, bottom: 0.4, header: 0.2, footer: 0.2 } }
      });
      ws.getColumn(1).width = 2.5; ws.getColumn(2).width = 1.4;
      for (var k = 0; k < 7; k++) {
        var c0 = 3 + k * 4;
        ws.getColumn(c0).width = 13.5; ws.getColumn(c0 + 1).width = 10; ws.getColumn(c0 + 2).width = 10.5;
        if (k < 6) ws.getColumn(c0 + 3).width = 2.2;
      }
      var ult = 3 + 6 * 4 + 2;           // AC
      var v = VARIANTES[plano.variante];
      ws.mergeCells(1, 3, 1, ult);
      var t = ws.getCell(1, 3);
      t.value = titulo.toUpperCase() + " — Cronograma de Disparos — " + plano.nome.replace(" ", "/");
      estilo(t, { fill: cor, color: "FFFFFF", bold: true, size: 15 });
      ws.getRow(1).height = 32;
      ws.mergeCells(2, 3, 2, ult);
      var st = ws.getCell(2, 3);
      st.value = "Canais: " + v.nome + " · gerado em " + plano.gerado + " a partir dos dados do Hub Supertroco e da análise do agente" +
        (geral ? " · um parceiro por dia na base de e-mail e no WhatsApp" : "");
      estilo(st, { italic: true, color: "5F6B70", size: 9 });
      ws.getRow(2).height = 18;

      // ---- bloco 1: formatos, valores e volumes
      var r0 = 4;
      [["Formato", 3], ["Valor", 4], ["Volume", 5]].forEach(function (h) {
        var c = ws.getCell(r0, h[1]); c.value = h[0]; estilo(c, { fill: "595959", color: "FFFFFF", bold: true });
      });
      var formatos = [];
      var temE = slots.some(function (s) { return s.canal === "email"; });
      var temW = slots.some(function (s) { return s.canal === "whatsapp"; });
      var volE = (slots.filter(function (s) { return s.canal === "email" && s.tipo === "principal"; })[0] || {}).volume;
      var volR = (slots.filter(function (s) { return s.tipo === "repique"; })[0] || {}).volume;
      var volW = (slots.filter(function (s) { return s.canal === "whatsapp"; })[0] || {}).volume;
      var valW = (slots.filter(function (s) { return s.canal === "whatsapp"; })[0] || {}).valor;
      if (temE) formatos.push(["E-mail (engajados)", "—", volE || "a definir", XC.mail]);
      if (slots.some(function (s) { return s.tipo === "recorrente"; })) formatos.push(["E-mail recorrente", "—", (slots.filter(function (s) { return s.tipo === "recorrente"; })[0] || {}).volume, XC.recorrente]);
      if (volR) formatos.push(["E-mail repique", "—", volR, XC.repique]);
      if (temW) formatos.push(["WhatsApp", valW || "a definir", volW || "a definir", XC.wpp]);
      formatos.forEach(function (f, i) {
        var a = ws.getCell(r0 + 1 + i, 3), b = ws.getCell(r0 + 1 + i, 4), c = ws.getCell(r0 + 1 + i, 5);
        a.value = f[0]; b.value = f[1]; c.value = f[2];
        estilo(a, { fill: f[3].fill, bold: true, h: "left", color: f[3].ink, border: true });
        estilo(b, { border: true, fmt: typeof f[1] === "number" ? '"R$" #,##0.00' : undefined });
        estilo(c, { border: true, fmt: typeof f[2] === "number" ? "#,##0" : undefined });
      });

      // ---- bloco 2: resumo do mes
      ws.mergeCells(r0, 7, r0, 13);
      var rh = ws.getCell(r0, 7); rh.value = "Resumo do mês"; estilo(rh, { fill: "595959", color: "FFFFFF", bold: true });
      var nE = slots.filter(function (s) { return s.canal === "email"; }).length;
      var nW = slots.filter(function (s) { return s.canal === "whatsapp"; }).length;
      var vE = slots.reduce(function (a, s) { return a + (s.canal === "email" ? (s.volume || 0) : 0); }, 0);
      var inv = slots.reduce(function (a, s) { return a + (s.custo || 0); }, 0);
      var semVol = slots.some(function (s) { return s.canal === "whatsapp" && !s.volume; });
      var linhasR = [["Disparos de e-mail", nE, "0"], ["Disparos de WhatsApp", nW, "0"],
                     ["Volume total de e-mail", vE, "#,##0"],
                     ["Investimento em WhatsApp", nW ? (semVol ? "defina o volume" : inv) : "—", '"R$" #,##0.00']];
      if (parte && parte.projecao) {
        if (parte.projecao.aberturas) linhasR.push(["Aberturas projetadas", parte.projecao.aberturas, "#,##0"]);
        if (parte.projecao.resultado) linhasR.push([parte.projecao.resultado.unidade === "vendas" ? "Vendas projetadas" : "Leads projetados",
          parte.projecao.resultado.valor, parte.projecao.resultado.unidade === "vendas" ? '"R$" #,##0' : "#,##0"]);
      }
      linhasR.slice(0, 6).forEach(function (l, i) {
        ws.mergeCells(r0 + 1 + i, 7, r0 + 1 + i, 10);
        ws.mergeCells(r0 + 1 + i, 11, r0 + 1 + i, 13);
        var a = ws.getCell(r0 + 1 + i, 7), b = ws.getCell(r0 + 1 + i, 11);
        a.value = l[0]; b.value = l[1];
        estilo(a, { h: "left", fill: "F7F7F7", border: true });
        estilo(b, { bold: true, border: true, fmt: typeof l[1] === "number" ? l[2] : undefined });
      });

      // ---- bloco 3: o que os dados mostram / legenda
      ws.mergeCells(r0, 15, r0, ult);
      var eh = ws.getCell(r0, 15);
      eh.value = geral ? "Legenda de parceiros e canais" : "O que os dados mostram";
      estilo(eh, { fill: "595959", color: "FFFFFF", bold: true });
      var textos = geral ? plano.partes.map(function (p) { return "● " + p.nome + " — " + p.slots.length + " disparos no mês"; })
                              .concat(["E-mail em azul · WhatsApp em verde · recorrente e repique em tons de azul"])
                         : (parte ? parte.evidencias : []).slice(0, 5);
      textos.slice(0, 6).forEach(function (tx, i) {
        ws.mergeCells(r0 + 1 + i, 15, r0 + 1 + i, ult);
        var c = ws.getCell(r0 + 1 + i, 15);
        c.value = tx;
        estilo(c, { h: "left", size: 8.5, border: true, color: geral && i < plano.partes.length ? corForte(plano.partes[i].cor) : "333333", bold: geral && i < plano.partes.length });
        ws.getRow(r0 + 1 + i).height = 24;
      });

      // ---- calendario: semanas de domingo a sabado
      var linha = r0 + 9;
      semanasDoMes(plano.mes).forEach(function (sem) {
        var maxS = 2;
        sem.forEach(function (d) {
          if (d) maxS = Math.max(maxS, slots.filter(function (s) { return s.data === iso(d); }).length);
        });
        sem.forEach(function (d, k) {
          var c0 = 3 + k * 4;
          ws.mergeCells(linha, c0, linha, c0 + 2);
          ws.mergeCells(linha + 1, c0, linha + 1, c0 + 2);
          var h = ws.getCell(linha, c0), tm = ws.getCell(linha + 1, c0);
          if (!d) {
            estilo(h, { fill: XC.fora }); estilo(tm, { fill: XC.fora });
            for (var z = 0; z < maxS + 1; z++) {
              for (var q = 0; q < 3; q++) estilo(ws.getCell(linha + 2 + z, c0 + q), { fill: XC.fora });
            }
            return;
          }
          var k2 = iso(d);
          var fs = geral ? fatosDoDia(plano, k2) : ((parte && parte.fatos[k2]) || []);
          var feriado = fs.some(function (f) { return /^Feriado/.test(f); });
          h.value = String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + " - " + DOM_SAB[d.getDay()].toLowerCase();
          estilo(h, { fill: feriado ? "B5472C" : cor, color: "FFFFFF", bold: true, size: 11 });
          var tema = geral ? temaDoDia(plano, k2) : (slots.some(function (s) { return s.data === k2; }) && parte && parte.dias[k2] ? [parte.dias[k2].tema] : []);
          tm.value = fs.concat(tema).join("\n");
          estilo(tm, { fill: XC.tema, color: cor, bold: true, size: 8.5 });
          ["Formato", "Volume", "Horário"].forEach(function (x, q) {
            var c = ws.getCell(linha + 2, c0 + q); c.value = x; estilo(c, { fill: XC.cab, color: "FFFFFF", bold: true, size: 8 });
          });
          var doDia = slots.filter(function (s) { return s.data === k2; });
          for (var z2 = 0; z2 < maxS; z2++) {
            var s = doDia[z2];
            var a = ws.getCell(linha + 3 + z2, c0), b = ws.getCell(linha + 3 + z2, c0 + 1), c = ws.getCell(linha + 3 + z2, c0 + 2);
            if (!s) { [a, b, c].forEach(function (x) { estilo(x, { border: true }); }); continue; }
            var cs = corSlot(s);
            a.value = (geral ? s.pnome.split(" ")[0] + " · " : "") + s.rotulo;
            b.value = s.volume || "a definir";
            c.value = s.janela;
            estilo(a, { fill: cs.fill, color: cs.ink, bold: true, size: 8, border: true });
            estilo(b, { fill: cs.fill, color: cs.ink, size: 8, border: true, fmt: s.volume ? "#,##0" : undefined });
            estilo(c, { fill: cs.fill, color: cs.ink, size: 8, border: true });
          }
        });
        ws.getRow(linha).height = 22;
        ws.getRow(linha + 1).height = 34;
        ws.getRow(linha + 2).height = 16;
        for (var z3 = 0; z3 < maxS; z3++) ws.getRow(linha + 3 + z3).height = 20;
        linha += 3 + maxS + 1;
      });
      ws.getCell(linha, 3).value = "Gerado pelo Hub Supertroco em " + plano.gerado + ". O motor decide dia, canal, horário e volume a partir dos dados; o agente (Groq) escreve tema, assunto e mensagem.";
      estilo(ws.getCell(linha, 3), { italic: true, color: "7A7A7A", size: 8, h: "left", wrap: false });
    }

    function folhaLista(wb, plano) {
      var ws = wb.addWorksheet("Disparos", { views: [{ state: "frozen", ySplit: 1, showGridLines: false }] });
      var cols = [["Data", 11], ["Dia", 10], ["Parceiro", 14], ["Canal", 11], ["Tipo", 17], ["Base", 26], ["Horário", 11],
                  ["Volume", 12], ["Valor por disparo", 13], ["Custo estimado", 14], ["Tema", 30],
                  ["Assunto do e-mail / mensagem de WhatsApp", 60], ["Por que este dia", 58]];
      ws.columns = cols.map(function (c) { return { header: c[0], width: c[1] }; });
      ws.getRow(1).eachCell(function (c) { estilo(c, { fill: "0C3035", color: "FFFFFF", bold: true, size: 9.5 }); });
      ws.getRow(1).height = 26;
      plano.slots.forEach(function (s) {
        var d = dataIso(s.data);
        var row = ws.addRow([new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())), DOM_SAB[d.getDay()], s.pnome, s.canal === "email" ? "E-mail" : "WhatsApp", s.rotulo, s.base, s.janela,
          s.volume || "a definir", s.valor || (s.canal === "email" ? "—" : "a definir"), s.custo || (s.canal === "email" ? "—" : "a definir"),
          s.tema, s.canal === "email" ? s.assunto : s.mensagem, s.motivo]);
        var cs = corSlot(s);
        row.eachCell({ includeEmpty: true }, function (c, n) {
          estilo(c, { h: n >= 11 ? "left" : "center", v: "top", size: 9, border: true, fill: n === 4 || n === 5 ? cs.fill : undefined,
                      color: n === 4 || n === 5 ? cs.ink : "1A1A1A", bold: n === 4 });
        });
        row.getCell(1).numFmt = "dd/mm/yyyy";
        if (s.volume) row.getCell(8).numFmt = "#,##0";
        if (s.valor) row.getCell(9).numFmt = '"R$" #,##0.00';
        if (s.custo) row.getCell(10).numFmt = '"R$" #,##0.00';
        row.height = 42;
      });
      ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: cols.length } };
    }

    function folhaEstrategia(wb, plano) {
      var ws = wb.addWorksheet("Estratégia", { views: [{ showGridLines: false }] });
      ws.getColumn(1).width = 3; ws.getColumn(2).width = 120;
      var r = 2;
      function titulo(t, tam) {
        var c = ws.getCell(r, 2); c.value = t; estilo(c, { bold: true, size: tam || 12, color: "0C3035", h: "left", wrap: false });
        ws.getRow(r).height = tam ? 26 : 20; r++;
      }
      function texto(t, cor) {
        var c = ws.getCell(r, 2); c.value = t; estilo(c, { size: 10, color: cor || "333333", h: "left", v: "top" });
        ws.getRow(r).height = Math.max(16, Math.ceil(String(t).length / 125) * 15); r++;
      }
      titulo("Cronograma de " + plano.nome + " — " + (plano.escopo === "hub" ? "Todos os parceiros" : plano.titulo) + " — " + VARIANTES[plano.variante].nome, 15);
      texto("Gerado em " + plano.gerado + " pelo Hub Supertroco.", "7A7A7A");
      r++;
      titulo("Leitura do agente");
      texto(semTags(plano.estrategia) || "Sem texto do agente nesta execução (rode o gerar_hub.py sem --sem-ia).");
      if (plano.nota) texto(semTags(plano.nota));
      (plano.cuidados || []).forEach(function (x) { texto("• " + semTags(x)); });
      r++;
      if (plano.escopo === "hub") {
        titulo("Regras de convivência");
        (plano.regras || []).forEach(function (x) { texto("• " + x); });
        r++;
        plano.partes.forEach(function (p) {
          titulo(p.nome);
          if (p.estrategia) texto(semTags(p.estrategia));
          (p.evidencias || []).forEach(function (x) { texto("• " + x); });
          r++;
        });
      } else {
        titulo("O que os dados mostram");
        (plano.evidencias || []).forEach(function (x) { texto("• " + x); });
        r++;
        titulo("Premissas do motor");
        (plano.premissas || []).forEach(function (x) { texto("• " + x); });
      }
      r++;
      titulo("Projeção do mês (estimativa pelo histórico)");
      plano.partes.forEach(function (p) {
        var pj = p.projecao;
        texto(p.nome + ": " + pj.email_envios + " e-mails (" + nf(pj.email_volume) + " envios, ≈ " + nf(pj.aberturas) + " aberturas e " +
          nf(pj.cliques) + " cliques) · " + pj.wpp_envios + " WhatsApp" +
          (pj.resultado ? " · ≈ " + (pj.resultado.unidade === "vendas" ? moeda(pj.resultado.valor) + " em vendas" : nf(pj.resultado.valor) + " leads") +
            " (média de " + (pj.resultado.unidade === "vendas" ? moeda(pj.resultado.por_disparo) : nf(pj.resultado.por_disparo, 1)) + " por dia com disparo)" : ""));
      });
    }

    // =================================================================
    // PDF (jsPDF) — A4 paisagem, vetorial
    // =================================================================
    // Fontes padrao do PDF so falam Latin-1: trocamos o que ficaria quebrado.
    function latin(s) {
      return String(s === null || s === undefined ? "" : s)
        .replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/[–—]/g, "-").replace(/…/g, "...")
        .replace(/[•●]/g, "-").replace(/≈/g, "~").replace(/↺/g, "(reimpacto)").replace(/→/g, "->")
        .replace(/<\/?b>/g, "").replace(/[^\x00-\xFF]/g, "");
    }
    function rgb(hex) { hex = hx(hex); return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)]; }
    // Corta o texto (com "...") ate caber na largura, na fonte ja configurada.
    function caber(doc, txt, largura) {
      if (doc.getTextWidth(txt) <= largura) return txt;
      while (txt.length > 1 && doc.getTextWidth(txt + "...") > largura) txt = txt.slice(0, -1);
      return txt.replace(/[\s·-]+$/, "") + "...";
    }

    function gerarPDF(plano) {
      return carregarLib("pdf").then(function (lib) {
        var doc = new lib.jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
        var paginas = [];
        if (plano.escopo === "hub") {
          paginas.push({ titulo: "Hub Supertroco", cor: "0E7C7B", slots: plano.slots, geral: true, parte: null });
          plano.partes.forEach(function (p) { paginas.push({ titulo: p.nome, cor: corForte(p.cor), slots: p.slots, geral: false, parte: p }); });
        } else {
          paginas.push({ titulo: plano.partes[0].nome, cor: corForte(plano.partes[0].cor), slots: plano.slots, geral: false, parte: plano.partes[0] });
        }
        paginas.forEach(function (pg, i) {
          if (i) doc.addPage();
          paginaCalendario(doc, plano, pg);
        });
        paginasLista(doc, plano);
        paginaEstrategia(doc, plano);
        var total = doc.getNumberOfPages();
        for (var n = 1; n <= total; n++) {
          doc.setPage(n);
          doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(130, 130, 130);
          doc.text(latin("Hub Supertroco · cronograma gerado em " + plano.gerado + " · página " + n + " de " + total), 287, 205, { align: "right" });
        }
        var nome = nomeArquivo(plano, "pdf");
        baixarBlob(doc.output("blob"), nome);
        return nome;
      });
    }

    function cabecalhoPdf(doc, titulo, sub, cor) {
      doc.setFillColor.apply(doc, rgb(cor));
      doc.rect(0, 0, 297, 20, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold"); doc.setFontSize(14.5);
      doc.text(latin(titulo), 10, 9.5);
      doc.setFont("helvetica", "normal"); doc.setFontSize(8.2);
      doc.text(latin(sub), 10, 15.5);
    }

    function paginaCalendario(doc, plano, pg) {
      var v = VARIANTES[plano.variante];
      cabecalhoPdf(doc, pg.titulo + " - Cronograma de Disparos - " + plano.nome,
        "Canais: " + v.nome + " · o motor escolhe dia, canal, horário e volume pelos dados; o agente escreve tema, assunto e mensagem", pg.cor);
      // linha de resumo
      var nE = pg.slots.filter(function (s) { return s.canal === "email"; }).length;
      var nW = pg.slots.filter(function (s) { return s.canal === "whatsapp"; }).length;
      var inv = pg.slots.reduce(function (a, s) { return a + (s.custo || 0); }, 0);
      var semVol = pg.slots.some(function (s) { return s.canal === "whatsapp" && !s.volume; });
      var itens = [["E-mails", nE], ["WhatsApp", nW], ["Investimento WhatsApp", nW ? (semVol ? "a definir" : moeda(inv, 2)) : "-"]];
      if (pg.parte && pg.parte.projecao && pg.parte.projecao.aberturas) itens.push(["Aberturas projetadas", nf(pg.parte.projecao.aberturas)]);
      if (pg.parte && pg.parte.projecao && pg.parte.projecao.resultado) {
        var rr = pg.parte.projecao.resultado;
        itens.push([rr.unidade === "vendas" ? "Vendas projetadas" : "Leads projetados", rr.unidade === "vendas" ? moeda(rr.valor) : nf(rr.valor)]);
      }
      var x = 10;
      itens.forEach(function (it) {
        var txt = latin(it[0] + ": " + it[1]);
        doc.setFont("helvetica", "bold"); doc.setFontSize(8);
        var w = doc.getTextWidth(txt) + 7;
        doc.setFillColor(242, 245, 246); doc.roundedRect(x, 23, w, 6.2, 1.6, 1.6, "F");
        doc.setTextColor(40, 55, 60); doc.text(txt, x + 3.5, 27.3);
        x += w + 3;
      });
      // legenda
      var lx = 287, leg = [["WhatsApp", XC.wpp], ["E-mail", XC.mail]];
      if (pg.geral) leg = plano.partes.map(function (p) { return [p.nome, { fill: hx(p.cor), bar: hx(p.cor) }]; }).reverse().concat(leg);
      doc.setFont("helvetica", "normal"); doc.setFontSize(7.5);
      leg.forEach(function (l) {
        var w = doc.getTextWidth(latin(l[0]));
        lx -= w;
        doc.setTextColor(70, 80, 85); doc.text(latin(l[0]), lx, 27.3);
        lx -= 5;
        doc.setFillColor.apply(doc, rgb(l[1].bar)); doc.roundedRect(lx, 24.6, 3.4, 3.4, 0.8, 0.8, "F");
        lx -= 4;
      });
      // grade
      var sem = semanasDoMes(plano.mes);
      var x0 = 10, y0 = 32, W = 277, colW = W / 7, cabH = 5.5;
      var disp = 198 - y0 - cabH, linhaH = disp / sem.length;
      doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.setTextColor(100, 110, 115);
      DOM_SAB.forEach(function (d, i) { doc.text(latin(d.toUpperCase()), x0 + colW * i + colW / 2, y0 + 3.8, { align: "center" }); });
      sem.forEach(function (w, li) {
        w.forEach(function (d, ci) {
          var cx = x0 + colW * ci + 0.6, cy = y0 + cabH + linhaH * li + 0.6, cw = colW - 1.2, ch = linhaH - 1.2;
          if (!d) {
            doc.setFillColor(248, 249, 250); doc.roundedRect(cx, cy, cw, ch, 1.8, 1.8, "F");
            return;
          }
          var k = iso(d);
          var fs = pg.geral ? fatosDoDia(plano, k) : ((pg.parte && pg.parte.fatos[k]) || []);
          var feriado = fs.some(function (f) { return /^Feriado/.test(f); });
          doc.setDrawColor(220, 226, 229); doc.setLineWidth(0.25);
          doc.setFillColor(255, 255, 255); doc.roundedRect(cx, cy, cw, ch, 1.8, 1.8, "FD");
          doc.setFont("helvetica", "bold"); doc.setFontSize(10);
          if (feriado) doc.setTextColor(181, 71, 44); else doc.setTextColor(25, 45, 50);
          doc.text(String(d.getDate()), cx + 2, cy + 4.6);
          var yy = cy + 5.4;
          if (fs.length) {
            doc.setFont("helvetica", "normal"); doc.setFontSize(5.6); doc.setTextColor(134, 90, 12);
            doc.text(caber(doc, latin(fs[0].replace("Feriado nacional: ", "Feriado: ")), cw - 9.5), cx + 8, cy + 4.3);
          }
          var doDia = pg.slots.filter(function (s) { return s.data === k; });
          var tema = pg.geral ? temaDoDia(plano, k) : (doDia.length && pg.parte && pg.parte.dias[k] ? [pg.parte.dias[k].tema] : []);
          var chipH = 3.9, espaco = ch - (yy - cy) - 1;
          var cabem = Math.max(1, Math.floor(espaco / (chipH + 0.7)));
          if (tema.length && doDia.length < cabem) {
            doc.setFont("helvetica", "bold"); doc.setFontSize(6.2); doc.setTextColor.apply(doc, rgb(pg.cor));
            var linhas = doc.splitTextToSize(latin(tema[0]), cw - 3.5).slice(0, doDia.length + 2 <= cabem ? 2 : 1);
            linhas.forEach(function (l) { yy += 2.6; doc.text(l, cx + 1.8, yy); });
            yy += 1.2;
          } else { yy += 0.8; }
          doDia.forEach(function (s, i) {
            if (yy + chipH > cy + ch - 0.6) return;
            var cs = corSlot(s);
            doc.setFillColor.apply(doc, rgb(cs.fill)); doc.roundedRect(cx + 1.4, yy, cw - 2.8, chipH, 0.9, 0.9, "F");
            doc.setFillColor.apply(doc, rgb(pg.geral ? hx(s.cor) : cs.bar)); doc.rect(cx + 1.4, yy, 0.9, chipH, "F");
            var rot = (pg.geral ? s.pnome.split(" ")[0] + " · " : "") + (s.canal === "email"
              ? (s.tipo === "repique" ? "Repique" : s.tipo === "recorrente" ? "Recorr." : "E-mail")
              : (s.tipo === "reimpacto" ? "WA reimp." : "WhatsApp"));
            var dir = latin(s.janela + (s.volume ? " · " + mil(s.volume) : ""));
            doc.setFontSize(5.6);
            doc.setFont("helvetica", "normal");
            var wDir = doc.getTextWidth(dir);
            doc.setFont("helvetica", "bold"); doc.setTextColor.apply(doc, rgb(cs.ink));
            // O rotulo encolhe ate caber ao lado do horario — nunca por cima dele.
            doc.text(caber(doc, latin(rot), cw - 2.8 - 1.6 - wDir - 2.2), cx + 3, yy + 2.75);
            doc.setFont("helvetica", "normal");
            doc.text(dir, cx + cw - 2.2, yy + 2.75, { align: "right" });
            yy += chipH + 0.7;
          });
        });
      });
    }

    function paginasLista(doc, plano) {
      doc.addPage();
      cabecalhoPdf(doc, "Lista de disparos - " + plano.nome, "Tema, assunto do e-mail ou mensagem de WhatsApp e o motivo de cada escolha", "0C3035");
      var cols = [["Data", 17], ["Canal", 30], ["Horário", 17], ["Volume", 19]];
      if (plano.escopo === "hub") cols.splice(1, 0, ["Parceiro", 24]);
      cols.push(["Tema", 45]);
      var fixo = cols.reduce(function (a, c) { return a + c[1]; }, 0);
      cols.push(["Assunto / mensagem e motivo", 277 - fixo]);
      var y = 27;
      function cab() {
        doc.setFillColor(12, 48, 53); doc.rect(10, y, 277, 6.5, "F");
        doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); doc.setTextColor(255, 255, 255);
        var x = 10;
        cols.forEach(function (c) { doc.text(latin(c[0]), x + 1.8, y + 4.4); x += c[1]; });
        y += 6.5;
      }
      cab();
      plano.slots.forEach(function (s, i) {
        var d = dataIso(s.data);
        var celulas = [ddmm(s.data) + " " + DOM_SAB[d.getDay()].slice(0, 3), s.rotulo, s.janela, s.volume ? nf(s.volume) : "a definir"];
        if (plano.escopo === "hub") celulas.splice(1, 0, s.pnome);
        celulas.push(s.tema || "-");
        celulas.push((s.canal === "email" ? "Assunto: " + (s.assunto || "-") : "Mensagem: " + (s.mensagem || "-")) + "\nMotivo: " + s.motivo);
        doc.setFont("helvetica", "normal"); doc.setFontSize(7);
        var partes = celulas.map(function (t, j) { return doc.splitTextToSize(latin(t), cols[j][1] - 3.6); });
        var alt = Math.max.apply(null, partes.map(function (p) { return p.length; })) * 3.1 + 3;
        if (y + alt > 197) { doc.addPage(); y = 12; cab(); }
        if (i % 2 === 0) { doc.setFillColor(246, 248, 249); doc.rect(10, y, 277, alt, "F"); }
        var cs = corSlot(s);
        var x = 10;
        partes.forEach(function (linhas, j) {
          if (cols[j][0] === "Canal") {
            doc.setFillColor.apply(doc, rgb(cs.fill)); doc.rect(x + 0.8, y + 0.8, cols[j][1] - 1.6, alt - 1.6, "F");
            doc.setTextColor.apply(doc, rgb(cs.ink)); doc.setFont("helvetica", "bold");
          } else { doc.setTextColor(40, 50, 55); doc.setFont("helvetica", "normal"); }
          doc.text(linhas, x + 1.8, y + 3.9);
          x += cols[j][1];
        });
        y += alt;
      });
    }

    function paginaEstrategia(doc, plano) {
      doc.addPage();
      cabecalhoPdf(doc, "Estratégia do mês - " + plano.nome, (plano.escopo === "hub" ? "Todos os parceiros" : plano.titulo) + " · " + VARIANTES[plano.variante].nome, "0C3035");
      var y = 30;
      function bloco(titulo, linhas) {
        if (!linhas.length) return;
        if (y > 185) { doc.addPage(); y = 16; }
        doc.setFont("helvetica", "bold"); doc.setFontSize(10.5); doc.setTextColor(12, 48, 53);
        doc.text(latin(titulo), 12, y); y += 5.5;
        doc.setFont("helvetica", "normal"); doc.setFontSize(8.6); doc.setTextColor(50, 60, 65);
        linhas.forEach(function (l) {
          doc.splitTextToSize(latin(l), 270).forEach(function (t) {
            if (y > 197) { doc.addPage(); y = 16; }
            doc.text(t, 12, y); y += 4.1;
          });
          y += 1.2;
        });
        y += 3.5;
      }
      bloco("Leitura do agente", [plano.estrategia || "Sem texto do agente nesta execução."].concat(plano.nota ? [plano.nota] : [])
        .concat((plano.cuidados || []).map(function (x) { return "- " + x; })));
      if (plano.escopo === "hub") {
        bloco("Regras de convivência", (plano.regras || []).map(function (x) { return "- " + x; }));
        plano.partes.forEach(function (p) {
          bloco(p.nome, [p.estrategia].filter(Boolean).concat((p.evidencias || []).map(function (x) { return "- " + x; })));
        });
      } else {
        bloco("O que os dados mostram", (plano.evidencias || []).map(function (x) { return "- " + x; }));
        bloco("Premissas do motor", (plano.premissas || []).map(function (x) { return "- " + x; }));
      }
      bloco("Projeção do mês (estimativa pelo histórico)", plano.partes.map(function (p) {
        var pj = p.projecao;
        return p.nome + ": " + pj.email_envios + " e-mails (" + nf(pj.email_volume) + " envios, ~" + nf(pj.aberturas) + " aberturas, ~" +
          nf(pj.cliques) + " cliques) · " + pj.wpp_envios + " WhatsApp" +
          (pj.resultado ? " · ~" + (pj.resultado.unidade === "vendas" ? moeda(pj.resultado.valor) + " em vendas" : nf(pj.resultado.valor) + " leads") : "");
      }));
    }

    // =================================================================
    function iniciar(dados) {
      if (!dados || !dados.parceiros || !dados.parceiros.length) {
        throw new Error("hub.json sem parceiros");
      }
      if (!dados.hub || !dados.hub.abas) {
        throw new Error("hub.json no formato antigo — rode o gerar_hub.py novo");
      }
      D = dados;
      inicializarVistos();
      var modo = ler("modo"); if (modo) estado.modo = modo;
      var gran = ler("gran"); if (gran) estado.gran = gran;
      var jan = ler("janela"); if (jan && jan !== "custom") estado.janela = jan;
      var canal = ler("canal"); if (canal === "whatsapp" || canal === "email") estado.canal = canal;
      if (ler("aberto") === "0") estado.aberto = false;
      var tema = ler("tema");
      var escuroSO = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
      if (tema === "escuro" || tema === "claro") { estado.tema = tema; estado.temaEscolhido = true; }
      else if (escuroSO && escuroSO.matches) estado.tema = "escuro";
      if (escuroSO && escuroSO.addEventListener) {
        escuroSO.addEventListener("change", function (ev) {
          if (estado.temaEscolhido) return;
          estado.tema = ev.matches ? "escuro" : "claro";
          aplicarTema(temaAtivo);
          var b = $("bt-tema"); if (b) { b.outerHTML = botaoTema(); ligarTema(); }
        });
      }

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
    // Previa local: se a pagina ja trouxer os dados (window.__hubDados), usa eles.
    if (window.__hubDados) {
      try { render(window.__hubDados); } catch (e) { /* ja exibido */ }
      return;
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
