/* ===================================================================
   Hub de CRMs Supertroco — painel da LP da RD Station
   -------------------------------------------------------------------
   Nao cole este arquivo direto na RD. Rode o gerar_hub.py e cole o
   COLAR_NA_RD.html, que e um carregador curto e busca este arquivo
   publicado no GitHub.

   Telas: o Hub (consolidado de todos os parceiros), o CRM de cada
   parceiro (com o tema da marca dele) e duas areas do estudo do Power BI
   "Personas SuperAdds":
     - WhatsApp: disparos, disparador x Meta e financeiro (so numeros
       agregados);
     - Personas: comportamento e pessoas. Esses dados chegam CIFRADOS no
       hub.json e so abrem com a senha, que nao esta neste arquivo.
   Cada tela tem Visao geral e Visao mes a mes (os meses vem do hub.json),
   modo noturno e o cronograma de disparos do proximo mes.
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

  // Modulo do bot de WhatsApp. Mesmo esquema do cronograma: so o hash
  // (FNV-1a) fica aqui, com outro sal.
  var BOT_HASH = 308924309;
  var BOT_STATUS_URL = "https://raw.githubusercontent.com/SupertrocoWeb/painel/main/status_bot.json";
  var BOT_STATUS_FALLBACK = "https://cdn.jsdelivr.net/gh/SupertrocoWeb/painel@main/status_bot.json";

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
  [hidden]{display:none !important}
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

  /* ---------- remuneracao (comissao x por aquisicao) ---------- */
  .mix{display:flex;gap:2px;height:7px;border-radius:4px;overflow:hidden;margin-top:9px}
  .mix span{display:block;height:100%;cursor:default}
  .mix span:first-child{border-radius:4px 0 0 4px} .mix span:last-child{border-radius:0 4px 4px 0}
  .mix-leg{display:flex;gap:6px 14px;flex-wrap:wrap;font-size:11px;color:var(--muted);margin-top:7px}
  .mix-leg span{display:inline-flex;align-items:center;gap:6px}
  .mix-leg i{width:9px;height:9px;border-radius:3px;display:inline-block}
  .rm{display:flex;align-items:stretch;gap:10px;flex-wrap:wrap;margin-bottom:14px}
  .rm-p{flex:1 1 220px;min-width:0;border:1px solid var(--line);border-radius:13px;padding:13px 15px;background:var(--soft)}
  .rm-p:last-child{box-shadow:inset 0 0 0 1px var(--brand)}
  .rm-h{display:flex;align-items:center;gap:8px;font-size:11.5px;color:var(--muted);flex-wrap:wrap}
  .rm-h i{width:9px;height:9px;border-radius:3px;display:inline-block}
  .rm-h .st{margin-left:auto}
  .rm-regra{font-family:var(--disp);font-weight:700;font-size:14px;margin-top:6px}
  .rm-v{font-family:var(--disp);font-weight:800;font-size:22px;letter-spacing:-.02em;margin-top:4px}
  .rm-s{font-size:11.5px;color:var(--muted);margin-top:2px}
  .rm-s b{color:var(--ink);font-family:var(--disp)}
  .rm-seta{display:grid;place-items:center;color:var(--muted2);flex:0 0 auto}
  .rm-seta svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:2}
  .rm-tot{text-align:right}
  .rm-tot span{display:block;font-size:11px;color:var(--muted)}
  .rm-tot b{font-family:var(--disp);font-weight:800;font-size:19px}
  @media(max-width:620px){ .rm-seta{display:none} .rm-tot{text-align:left} }

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
  .wcol.marcada{box-shadow:inset 1.5px 0 0 var(--accent)}
  .wtag{position:absolute;top:-14px;left:4px;font-size:9.5px;font-weight:700;color:var(--warn-ink);
    background:var(--warn-bg);border:1px solid var(--warn-line);border-radius:999px;padding:1px 7px;
    white-space:nowrap;z-index:1}
  .wtag.dir{left:auto;right:2px}
  .pt-vazio{fill:var(--card);stroke:var(--muted2);stroke-width:1.5}
  .marco{stroke:var(--accent);stroke-width:1.5}
  .marco-t{fill:var(--warn-ink);font-size:10px;font-weight:700;font-family:var(--body)}
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

  /* ---------- catalogo de campanhas e tabelas de cruzamento ---------- */
  table.cat{min-width:720px}
  table.cat th{padding-bottom:7px}
  button.ord{all:unset;cursor:pointer;color:inherit;font:inherit;letter-spacing:inherit;text-transform:inherit;
    border-radius:5px;padding:2px 3px;margin:-2px -3px}
  button.ord:hover{color:var(--ink)}
  button.ord.on{color:var(--brand);font-weight:700}
  .app.escuro button.ord.on{color:var(--brand-lite)}
  button.ord:focus-visible{outline:2px solid var(--brand)}
  table.cat td{padding:9px 10px}
  table.cat td.cn{white-space:normal;min-width:220px;line-height:1.45}
  table.cat td.cn .pill{margin-left:2px;padding:1px 8px;font-size:10.5px}
  table.cat .hr{color:var(--muted2);font-size:11.5px}
  table.cat tbody tr:hover td{background:var(--soft)}
  table.cat tfoot td{border-top:2px solid var(--line);border-bottom:none;font-weight:700;color:var(--ink);
    padding-top:11px;font-size:12.5px}

  /* ---------- funil do relatorio mensal (lead -> contrato) ---------- */
  .fc{display:flex;flex-direction:column;gap:9px;margin-top:14px}
  .fc-sec{display:flex;align-items:center;gap:7px;font-size:10.5px;font-weight:700;color:var(--muted);
    text-transform:uppercase;letter-spacing:.05em;margin-top:6px}
  .fc-sec:first-child{margin-top:0}
  .fc-l{display:grid;grid-template-columns:minmax(0,150px) 84px minmax(0,1fr) minmax(0,190px);gap:12px;
    align-items:center;font-size:12.5px;cursor:default}
  .fc-n{display:flex;align-items:center;gap:7px;color:var(--ink2);min-width:0}
  .fc-v{font-family:var(--disp);font-weight:700;text-align:right;font-variant-numeric:tabular-nums}
  .fc-t{display:block;height:12px;background:var(--track);border-radius:6px;overflow:hidden}
  .fc-f{display:block;height:100%;border-radius:6px;transition:width .6s cubic-bezier(.3,1,.4,1)}
  .fc-f.res{background:linear-gradient(90deg,var(--brand),var(--brand-lite))}
  .fc-f.rd{background:linear-gradient(90deg,var(--accent),var(--accent-lite))}
  .fc-p{font-size:11.5px;color:var(--muted)}
  .fc-p b{color:var(--ink);font-family:var(--disp)}
  .fc-fim{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}
  .vs .t.ref{margin-top:4px;height:7px}
  .vs .t.ref .f{background:var(--muted2)}

  /* ---------- crescimento da receita (hub) ---------- */
  .rc-res{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:14px}
  .rc-fig{border:1px solid var(--line);border-radius:12px;padding:11px 14px;background:var(--soft);min-width:0}
  .rc-fig .r{font-size:11.5px;color:var(--muted)}
  .rc-fig .v{font-family:var(--disp);font-weight:800;font-size:21px;letter-spacing:-.02em;margin-top:3px}
  .rc-fig .s{font-size:11.5px;color:var(--muted);margin-top:2px;line-height:1.45}
  .rc-fig .s b{color:var(--ink);font-family:var(--disp)}
  .rc-d{font-family:var(--disp);font-weight:700;white-space:nowrap}
  .rc-d.up{color:var(--pos)} .rc-d.down{color:var(--neg)}
  .rc-leg{display:flex;flex-wrap:wrap;gap:6px 8px;align-items:center;margin:14px 0 4px}
  .rc-chip{display:inline-flex;align-items:center;gap:7px;font:inherit;font-size:12px;color:var(--ink2);
    background:var(--card);border:1px solid var(--line);border-radius:999px;padding:5px 11px;cursor:pointer}
  .rc-chip i{width:10px;height:10px;border-radius:3px;display:inline-block}
  .rc-chip[aria-pressed="false"]{color:var(--muted2);background:transparent}
  .rc-chip[aria-pressed="false"] i{background:transparent !important;box-shadow:inset 0 0 0 1.5px var(--muted2)}
  .rc-chip:focus-visible{outline:2px solid var(--brand);outline-offset:1px}
  .rc-k{display:inline-flex;align-items:center;gap:7px;font-size:11.5px;color:var(--muted);margin-left:4px}
  .rc-k i{display:inline-block;width:10px;height:10px;border-radius:3px}
  .rc-k i.gh{background:var(--muted2);opacity:.28}
  .rc-k i.ln{height:2px;width:14px;border-radius:2px;background:var(--ink)}
  .rc-graf{margin-top:6px}
  .rc-corpo{display:grid;grid-template-columns:minmax(0,1fr) 270px;gap:24px;align-items:start}
  .rc-corpo.so{grid-template-columns:minmax(0,1fr)} .rc-corpo.so .rc-lado{display:none}
  .rc-main{min-width:0}
  .rc-lado{margin-top:14px;border-left:1px solid var(--line);padding-left:22px;min-width:0}
  .rc-h{font-family:var(--disp);font-weight:700;font-size:13.5px}
  .rc-p{margin-top:14px;cursor:default}
  .rc-p .h{display:flex;justify-content:space-between;gap:8px;font-size:12.5px;align-items:center}
  .rc-p .h b{font-family:var(--disp)}
  .rc-p .t{display:block;height:8px;background:var(--track);border-radius:5px;overflow:hidden;margin-top:6px}
  .rc-p .f{display:block;height:100%;border-radius:5px}
  .rc-p .s{font-size:11px;color:var(--muted);margin-top:4px;line-height:1.4}
  .rc-p .pend{color:var(--warn-ink)} .rc-p .h b.pend{font-family:var(--body);font-weight:600;font-size:12px}
  .rc-mini{margin-top:16px;padding-top:12px;border-top:1px solid var(--line);display:flex;flex-direction:column;gap:7px}
  .rc-mini div{display:flex;justify-content:space-between;gap:8px;font-size:12px;color:var(--muted)}
  .rc-mini b{color:var(--ink);font-family:var(--disp);white-space:nowrap}
  .rc-graf svg{width:100%;height:auto;display:block;overflow:visible}
  .rc-ghost{fill:var(--muted2);fill-opacity:.24}
  .rc-col.apagado{opacity:.38}
  .rc-tot{fill:var(--ink);font-family:var(--disp);font-weight:700;font-size:12px;text-anchor:middle}
  .rc-sub{fill:var(--muted);font-size:10.5px;font-family:var(--body);text-anchor:middle}
  .rc-sub.up{fill:var(--pos);font-weight:700} .rc-sub.down{fill:var(--neg);font-weight:700}
  .rc-x{font-size:11px;fill:var(--ink2);font-weight:600}
  .rc-x2{fill:var(--muted2);font-size:9.5px;font-family:var(--body);text-anchor:middle}
  .rc-x2.pend{fill:var(--warn-ink)}
  .rc-hit{outline:none}
  .rc-hit:focus-visible{fill:var(--brand);fill-opacity:.09;stroke:var(--brand);stroke-width:1.5}
  .rc-area{fill:var(--ink);fill-opacity:.05}
  .rc-lin{fill:none;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}
  .rc-lin.tot{stroke:var(--ink)}
  .rc-fim{fill:var(--ink);font-family:var(--disp);font-weight:700;font-size:11.5px}
  .rc-fim.n{fill:var(--muted);font-family:var(--body);font-weight:400;font-size:10px}
  .rc-cross{stroke:var(--muted2);stroke-width:1}
  .rc-dot{stroke:var(--card);stroke-width:2}
  .rc-dot.tot{fill:var(--ink)}
  .rc-ov{fill:transparent;cursor:crosshair;outline:none}
  .rc-ov:focus-visible{stroke:var(--brand);stroke-width:1.5}
  .rc-faixa{fill:var(--brand);fill-opacity:.06}
  .rc-sw{display:inline-block;width:9px;height:9px;border-radius:3px;margin-right:6px;vertical-align:-1px}

  /* ---------- WhatsApp oficial (Meta) ao vivo ---------- */
  .wa-dir{display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:flex-end}
  .wa-st{display:inline-flex;align-items:center;gap:7px;font-size:11.5px;font-weight:600;padding:5px 11px;border-radius:999px;
    border:1px solid var(--line);color:var(--ink2);background:var(--card);white-space:nowrap;cursor:default}
  .wa-st i{width:8px;height:8px;border-radius:50%;background:var(--muted2);position:relative}
  .wa-st.vivo i{background:var(--pos)}
  .wa-st.vivo i::after{content:"";position:absolute;inset:-4px;border-radius:50%;border:2px solid var(--pos);opacity:0;animation:wa-pulso 2s ease-out infinite}
  .wa-st.copia{background:var(--warn-bg);border-color:var(--warn-line);color:var(--warn-ink)}
  .wa-st.copia i{background:var(--warn-ink)}
  @keyframes wa-pulso{0%{transform:scale(.6);opacity:.9}100%{transform:scale(1.6);opacity:0}}
  .wa .kpis.wa-k{margin-top:14px}
  .wa-meter{height:6px;border-radius:4px;background:var(--track);overflow:hidden;margin-top:9px}
  .wa-meter i{display:block;height:100%;border-radius:4px;background:var(--pos);transition:width .6s cubic-bezier(.3,1,.4,1)}
  .wa-meter.alto i{background:var(--warn-ink)} .wa-meter.cheio i{background:var(--neg)}
  .wa-g2{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(0,1fr);gap:22px;margin-top:18px;align-items:start}
  .wa-sub h4{font-family:var(--disp);font-size:14px;font-weight:700;margin:0}
  .wa-sub code,.wa code{font-size:11.5px;background:var(--soft);border:1px solid var(--line);border-radius:5px;padding:0 5px}
  .wa-graf{margin-top:8px}
  .wa-graf svg{width:100%;height:auto;display:block;overflow:visible}
  .wa-av{list-style:none;margin:12px 0 0;padding:0;display:flex;flex-direction:column;gap:8px}
  .wa-av li{display:grid;grid-template-columns:24px minmax(0,1fr);gap:10px;align-items:start;padding:10px 12px;border-radius:12px;
    border:1px solid var(--line);background:var(--card)}
  .wa-av .ic{width:22px;height:22px;border-radius:50%;display:grid;place-items:center;font-size:11px;font-weight:800;color:#fff;background:var(--muted2)}
  .wa-av li.alta{border-color:rgba(217,87,58,.45);background:linear-gradient(0deg,rgba(217,87,58,.06),rgba(217,87,58,.06)),var(--card)}
  .wa-av li.alta .ic{background:var(--neg)}
  .wa-av li.media{border-color:var(--warn-line)}
  .wa-av li.media .ic{background:var(--warn-ink)}
  .wa-av .gv{display:block;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
  .wa-av li.alta .gv{color:var(--neg)} .wa-av li.media .gv{color:var(--warn-ink)}
  .wa-av b{display:block;font-size:13px;line-height:1.35;margin-top:1px}
  .wa-av div > span:not(.gv){display:block;font-size:12px;color:var(--muted);line-height:1.45;margin-top:2px}
  .wa-av small{display:block;font-size:10.5px;color:var(--muted2);margin-top:3px}
  .wa-tag{display:inline-block;font-size:10.5px;font-weight:700;padding:1px 8px;border-radius:999px;white-space:nowrap;
    background:var(--track);color:var(--muted)}
  .wa-tag.ok{background:var(--wpp-bg);color:var(--wpp-ink)}
  .wa-tag.aviso{background:var(--warn-bg);color:var(--warn-ink)}
  .wa-tag.erro{background:rgba(217,87,58,.12);color:var(--neg)}
  .app.escuro .wa-av li.alta{background:linear-gradient(0deg,rgba(255,138,107,.08),rgba(255,138,107,.08)),var(--card)}

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

  /* ---------- pagina enxuta: 4 numeros, o resto sob demanda ---------- */
  .kpis.enx .kpi{padding:16px 18px}
  .kpis.enx .kpi .v{font-size:26px}
  .kpis.k-mais{margin-top:12px}
  .mais-bar{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:10px}
  .mais-bar .kleg{margin-top:0}
  .btn.mini{padding:6px 11px;font-size:12px;box-shadow:none}
  .btn.mini .chev{width:13px;height:13px;transition:transform .25s ease}
  .btn.mini[aria-expanded="true"] .chev{transform:rotate(180deg)}
  .secs{margin-top:24px;border-top:1px solid var(--line)}
  .sec{border-bottom:1px solid var(--line)}
  .sec > summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:12px;padding:16px 4px}
  .sec > summary::-webkit-details-marker{display:none}
  .sec-t{display:flex;align-items:baseline;gap:6px 12px;flex-wrap:wrap;min-width:0}
  .sec-t b{font-family:var(--disp);font-weight:700;font-size:15px;letter-spacing:-.01em;transition:color .15s}
  .sec-t small{font-size:12px;color:var(--muted)}
  .sec > summary > .chev{width:17px;height:17px;margin-left:auto;flex:0 0 auto;stroke:var(--muted);fill:none;stroke-width:2;transition:transform .25s ease}
  .sec[open] > summary > .chev{transform:rotate(180deg)}
  .sec > summary:hover .sec-t b{color:var(--brand)}
  .sec-c{padding:0 0 20px}
  .sec-c > .row:first-child,.sec-c > .ia:first-child{margin-top:0}
  .alerta-s{color:var(--neg);font-weight:600}

  /* ---------- tracking por produto ---------- */
  .trk-fun{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin:2px 0 12px}
  .trk-p{border:1px solid var(--line);border-radius:12px;padding:12px 14px;background:var(--soft);min-width:0}
  .trk-p .r{display:flex;align-items:center;gap:6px;font-size:11.5px;color:var(--muted)}
  .trk-p .v{font-family:var(--disp);font-weight:800;font-size:22px;letter-spacing:-.02em;margin-top:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .trk-p .s{font-size:11px;color:var(--muted2);margin-top:1px}
  .trk td small{display:block;font-size:10.5px;color:var(--muted2)}
  .trk .jan{font-size:12px;white-space:nowrap}
  .trk tr.trk-parc td{background:var(--warn-bg)}
  .trk .flag{display:inline-block;font-size:9.5px;font-weight:700;padding:0 6px;border-radius:999px;margin-left:5px;
    background:var(--warn-bg);color:var(--warn-ink);border:1px solid var(--warn-line);vertical-align:1px;cursor:default}
  .trk .hr{color:var(--muted2)}
  .trk-base{font-size:12px;color:var(--ink2);margin:0 0 12px}
  .trk-base b{font-family:var(--disp)}
  .trk-nota{font-size:11px;color:var(--muted);margin-top:10px;line-height:1.55}
  @media(max-width:1080px){ .trk-fun{grid-template-columns:repeat(2,minmax(0,1fr))} }

  /* ---------- modo exibicao (telao) ---------- */
  .tv{position:fixed;inset:0;z-index:2147483000;display:flex;flex-direction:column;overflow:hidden;
    background:radial-gradient(120% 90% at 0% 0%,var(--deep2),#041417 72%);color:#EAF7F7;font-family:var(--body);
    --tvc:var(--brand);--tvl:var(--brand-lite)}
  .tv::before{content:"";position:absolute;inset:0;pointer-events:none;
    background:radial-gradient(55% 50% at 100% 0%,color-mix(in srgb,var(--tvc) 30%,transparent),transparent 70%)}
  .tv.ocioso{cursor:none}
  .tv-top{position:relative;display:flex;align-items:center;gap:clamp(12px,1.4vw,28px);
    padding:clamp(14px,2.4vh,30px) clamp(20px,3.2vw,64px) 0}
  .tv-marca{display:flex;align-items:center;gap:10px;font-family:var(--disp);font-weight:700;font-size:clamp(12px,1vw,19px);
    color:#9FC2C4;white-space:nowrap}
  .tv-marca svg{width:clamp(22px,1.9vw,36px);height:auto}
  .tv-tit{font-family:var(--disp);font-weight:800;font-size:clamp(18px,1.8vw,36px);color:#fff;letter-spacing:-.015em;
    padding-left:clamp(12px,1.4vw,28px);border-left:1px solid rgba(255,255,255,.14);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .tv-dir{margin-left:auto;display:flex;align-items:center;gap:clamp(12px,1.4vw,26px);font-size:clamp(12px,.95vw,18px);
    color:#9FC2C4;white-space:nowrap}
  .tv-hora{font-family:var(--disp);font-weight:700;color:#fff;font-size:clamp(16px,1.4vw,28px)}
  .tv-live{display:inline-flex;align-items:center;gap:8px}
  .tv-live i{width:.7em;height:.7em;border-radius:50%;background:#3DD598;animation:tv-pulso 2s infinite}
  .tv-live.copia i{background:#F4C675;animation:none}
  @keyframes tv-pulso{0%{box-shadow:0 0 0 0 rgba(61,213,152,.55)}100%{box-shadow:0 0 0 .8em rgba(61,213,152,0)}}
  .tv-palco{position:relative;flex:1;min-height:0;display:flex;
    padding:clamp(14px,3vh,44px) clamp(20px,3.2vw,64px) clamp(74px,10vh,116px)}
  .tv-slide{flex:1;min-width:0;min-height:0;display:flex;flex-direction:column;gap:clamp(12px,2.4vh,34px);
    animation:tv-entra .7s cubic-bezier(.2,.8,.2,1)}
  .tv-slide.fixo{animation:none}
  @keyframes tv-entra{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
  .tv-k{font-size:clamp(12px,.95vw,19px);color:#9FC2C4;font-weight:600;letter-spacing:.07em;text-transform:uppercase}
  .tv-hero{font-family:var(--disp);font-weight:800;letter-spacing:-.04em;line-height:.95;color:#fff;font-size:clamp(52px,8.4vw,176px)}
  .tv-hero small{font-size:.42em;color:#9FC2C4;letter-spacing:-.01em}
  .tv-sub{font-size:clamp(13px,1.1vw,22px);color:#BFD9DA}
  .tv-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(10px,1.3vw,26px)}
  .tv-grid.g3{grid-template-columns:repeat(3,minmax(0,1fr))}
  .tv-c{background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.09);border-radius:clamp(12px,1.1vw,22px);
    padding:clamp(14px,1.5vw,30px);min-width:0}
  .tv-c.forte{background:linear-gradient(150deg,var(--tvc),color-mix(in srgb,var(--tvc) 55%,#041417));border-color:transparent}
  .tv-c .r{font-size:clamp(12px,.95vw,19px);color:#A9CBCD}
  .tv-c.forte .r{color:rgba(255,255,255,.85)}
  .tv-c .v{font-family:var(--disp);font-weight:800;letter-spacing:-.03em;color:#fff;font-size:clamp(26px,3.3vw,68px);
    margin-top:.2em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .tv-c .s{font-size:clamp(11px,.85vw,17px);color:#8DB5B7;margin-top:.35em}
  .tv-c.forte .s{color:rgba(255,255,255,.78)}
  .tv-pc{display:flex;align-items:center;gap:clamp(12px,1.3vw,26px)}
  .tv-ini{width:clamp(48px,4.4vw,90px);height:clamp(48px,4.4vw,90px);border-radius:22%;display:grid;place-items:center;
    font-family:var(--disp);font-weight:800;color:#fff;font-size:clamp(22px,2.2vw,44px);flex:0 0 auto}
  .tv-nome{font-family:var(--disp);font-weight:800;color:#fff;letter-spacing:-.02em;font-size:clamp(28px,3.3vw,68px);line-height:1.05}
  .tv-barras{flex:1;min-height:clamp(100px,16vh,300px);display:flex;align-items:flex-end;gap:clamp(4px,.6vw,14px)}
  .tv-b{flex:1 1 0;min-width:0;height:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:6px}
  .tv-bb,.tv-pilha{width:100%;max-width:120px;border-radius:8px 8px 3px 3px;min-height:3px;display:flex;
    flex-direction:column-reverse;overflow:hidden;background:var(--tvl)}
  .tv-pilha{background:transparent}
  .tv-pilha i{display:block;width:100%;flex:0 0 auto}
  .tv-bv{font-family:var(--disp);font-weight:700;color:#fff;font-size:clamp(11px,.9vw,18px);white-space:nowrap;min-height:1.2em}
  .tv-bl{font-size:clamp(10px,.8vw,16px);color:#9FC2C4;white-space:nowrap;min-height:1.2em}
  .tv-leg{display:flex;gap:18px;flex-wrap:wrap;font-size:clamp(11px,.85vw,17px);color:#BFD9DA}
  .tv-leg i{display:inline-block;width:.8em;height:.8em;border-radius:3px;margin-right:6px;vertical-align:-1px}
  .tv-wa{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2fr);gap:clamp(14px,2vw,40px);align-items:stretch}
  .tv-lim{display:flex;flex-direction:column;justify-content:center;gap:clamp(8px,1.2vh,16px)}
  .tv-meter{height:clamp(10px,1.2vh,18px);border-radius:999px;background:rgba(255,255,255,.1);overflow:hidden}
  .tv-meter i{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,#3DD598,#F4C675)}
  .tv-av{display:grid;gap:10px}
  .tv-av div{border-left:4px solid #FF8A6B;background:rgba(255,138,107,.1);border-radius:0 12px 12px 0;
    padding:clamp(10px,1vw,18px) clamp(14px,1.2vw,22px)}
  .tv-av b{display:block;color:#fff;font-size:clamp(13px,1.05vw,21px)}
  .tv-av span{display:block;color:#F3C9BD;font-size:clamp(11px,.85vw,16px);margin-top:4px}
  .tv-trk{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(14px,2vw,40px)}
  .tv-fun{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(8px,1vw,18px);margin-top:clamp(8px,1.4vh,18px)}
  .tv-fun .tv-c .v{font-size:clamp(22px,2.5vw,52px)}
  .tv-fun .tv-c:last-child{grid-column:1/-1}
  .tv-lista{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(8px,1vw,18px)}
  .tv-lista div{background:rgba(255,255,255,.045);border-radius:14px;padding:clamp(10px,1vw,18px) clamp(14px,1.2vw,22px)}
  .tv-lista b{display:block;color:#fff;font-family:var(--disp);font-size:clamp(14px,1.2vw,24px)}
  .tv-lista span{display:block;color:#A9CBCD;font-size:clamp(11px,.9vw,17px);margin-top:3px}
  .tv-ctrl{position:absolute;left:50%;bottom:clamp(16px,2.6vh,30px);transform:translateX(-50%);display:flex;align-items:center;gap:4px;
    background:rgba(4,20,23,.8);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:6px;
    -webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);transition:opacity .4s ease;z-index:2}
  .tv.ocioso .tv-ctrl{opacity:0;pointer-events:none}
  .tv-ctrl button{border:0;background:transparent;color:#DCEFEF;border-radius:10px;padding:8px 11px;cursor:pointer;
    display:inline-flex;align-items:center;gap:6px;font-size:13px;font-family:var(--body)}
  .tv-ctrl button:hover{background:rgba(255,255,255,.1)}
  .tv-ctrl button:focus-visible{outline:2px solid var(--tvl);outline-offset:1px}
  .tv-ctrl svg{width:17px;height:17px;stroke:currentColor;fill:none;stroke-width:2.2}
  .tv-dots{display:flex;align-items:center;gap:6px;padding:0 8px}
  .tv-dots i{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.25);transition:width .3s ease}
  .tv-dots i.on{background:#fff;width:22px;border-radius:999px}
  .tv-vel{display:inline-flex;gap:2px;padding:0 6px;border-left:1px solid rgba(255,255,255,.12);border-right:1px solid rgba(255,255,255,.12)}
  .tv-vel button{padding:6px 8px;font-size:12px;color:#9FC2C4}
  .tv-vel button.on{background:rgba(255,255,255,.14);color:#fff;font-weight:600}
  .tv-prog{position:absolute;left:0;right:0;bottom:0;height:4px;background:rgba(255,255,255,.06)}
  .tv-prog i{display:block;height:100%;width:0;background:var(--tvl)}
  .tv-dica{position:absolute;top:clamp(70px,11vh,130px);left:50%;transform:translateX(-50%);z-index:3;
    background:rgba(4,20,23,.88);border:1px solid rgba(255,255,255,.16);color:#fff;padding:10px 16px;border-radius:12px;font-size:14px}
  @media(max-width:900px){ .tv-grid{grid-template-columns:repeat(2,minmax(0,1fr))} .tv-wa,.tv-trk{grid-template-columns:minmax(0,1fr)} }
  @media(prefers-reduced-motion:reduce){ .tv-slide{animation:none} .tv-live i{animation:none} .tv-prog i{transition:none !important} }

  @media(max-width:1280px){ .kpis{grid-template-columns:repeat(4,minmax(0,1fr))} }
  @media(max-width:1080px){
    .bn{grid-template-columns:repeat(2,minmax(0,1fr))}
    .r-2,.r-3,.r-72-28{grid-template-columns:minmax(0,1fr)}
    .rc-corpo{grid-template-columns:minmax(0,1fr);gap:6px}
    .wa-g2{grid-template-columns:minmax(0,1fr)}
    .wa-dir{justify-content:flex-start}
    .rc-lado{border-left:0;padding-left:0;border-top:1px solid var(--line);padding-top:14px}
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
    .rc-res{grid-template-columns:minmax(0,1fr)}
    .fc-l{grid-template-columns:minmax(0,1fr) auto;row-gap:5px}
    .fc-t,.fc-p{grid-column:1/-1}
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
    .wcol .wbar,.wd .b,.brow .bf,.vs .f,.pl .f,.fc-f,.rc-col,.wa-meter i{transition:none}
    .wa-st.vivo i::after{animation:none}
    .bot-ponto.vivo::after{animation:none}
  }

  /* ---------- modulo do bot de WhatsApp ---------- */
  .bot-topo{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:18px}
  .bot-sit{display:inline-flex;align-items:center;gap:8px;padding:6px 13px;border-radius:999px;
    font-size:12.5px;font-weight:700;border:1px solid var(--linha);background:var(--sub-bg)}
  .bot-ponto{width:9px;height:9px;border-radius:50%;background:var(--fraco);flex:none;position:relative}
  .bot-ponto.vivo{background:#16a34a}
  .bot-ponto.vivo::after{content:"";position:absolute;inset:-4px;border-radius:50%;
    border:2px solid #16a34a;opacity:.45;animation:bot-pulso 2s ease-out infinite}
  .bot-ponto.alerta{background:#f59e0b}
  .bot-ponto.morto{background:#dc2626}
  @keyframes bot-pulso{0%{transform:scale(.7);opacity:.6}100%{transform:scale(1.5);opacity:0}}

  .bot-grade{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));margin-bottom:18px}
  .bot-cel{border:1px solid var(--linha);border-radius:14px;padding:13px 15px;background:var(--sub-bg)}
  .bot-cel .r{font-size:10.5px;text-transform:uppercase;letter-spacing:.6px;font-weight:800;
    color:var(--fraco);margin-bottom:5px}
  .bot-cel .v{font-family:var(--disp);font-weight:800;font-size:23px;line-height:1.1}
  .bot-cel .s{font-size:11.5px;color:var(--fraco);margin-top:3px}
  .bot-cel.bom .v{color:#16a34a} .bot-cel.ruim .v{color:#dc2626} .bot-cel.meio .v{color:#f59e0b}

  .bot-barra{height:7px;border-radius:99px;background:var(--linha);overflow:hidden;margin-top:8px}
  .bot-barra i{display:block;height:100%;border-radius:99px;background:var(--brand);transition:width .5s}

  .bot-sec{margin-top:20px}
  .bot-sec h5{font-family:var(--disp);font-weight:800;font-size:13px;margin-bottom:10px;
    text-transform:uppercase;letter-spacing:.5px;color:var(--fraco)}

  .bot-dias{display:flex;align-items:flex-end;gap:5px;height:76px;padding:4px 0}
  /* max-width: com poucos dias de historico a barra viraria um bloco gigante */
  .bot-dia{flex:1 1 0;max-width:52px;display:flex;flex-direction:column;align-items:center;gap:5px;min-width:0}
  .bot-dia .cl{width:100%;background:var(--brand);border-radius:4px 4px 2px 2px;min-height:3px;
    transition:height .4s}
  .bot-dia .cl.zero{background:var(--linha)}
  .bot-dia .dt{font-size:9.5px;color:var(--fraco);white-space:nowrap}

  .bot-aviso{display:flex;gap:9px;padding:11px 14px;border-radius:11px;font-size:13px;
    margin-bottom:10px;align-items:flex-start}
  .bot-aviso.ok{background:rgba(22,163,74,.09);border:1px solid rgba(22,163,74,.26);color:#15803d}
  .bot-aviso.at{background:rgba(245,158,11,.09);border:1px solid rgba(245,158,11,.26);color:#b45309}
  .bot-aviso.er{background:rgba(220,38,38,.09);border:1px solid rgba(220,38,38,.26);color:#b91c1c}

  .bot-msg{border:1px solid var(--linha);border-radius:14px;padding:15px;background:var(--sub-bg);
    white-space:pre-wrap;word-break:break-word;font-size:13.5px;line-height:1.62;max-height:270px;
    overflow:auto}
  .bot-msg b{font-weight:700}
  .bot-meta{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
  .bot-meta span{font-size:11px;padding:3px 9px;border-radius:7px;background:var(--linha);
    color:var(--fraco);font-weight:600}

  .bot-nota{font-size:12px;color:var(--fraco);margin-top:16px;padding-top:14px;
    border-top:1px solid var(--linha);line-height:1.6}
  .bot-carregando{text-align:center;padding:42px;color:var(--fraco);font-size:13.5px}

  /* atalho para o painel local: o endereco mora no localStorage de quem
     usa, nunca neste arquivo — ele e publico. */
  .bot-painel{display:flex;gap:9px;align-items:center;flex-wrap:wrap;margin-top:16px;
    padding-top:15px;border-top:1px solid var(--linha)}
  .bot-painel .lk{display:inline-flex;align-items:center;gap:7px;padding:8px 15px;border-radius:10px;
    background:var(--brand);color:var(--deep);font-weight:700;font-size:13px;text-decoration:none;
    border:none;cursor:pointer}
  .bot-painel .lk:hover{filter:brightness(1.07)}
  .bot-painel .lk svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:2.2;
    stroke-linecap:round;stroke-linejoin:round}
  .bot-painel .mini{font-size:11.5px;color:var(--fraco);background:none;border:none;
    cursor:pointer;text-decoration:underline;padding:0}
  .bot-painel .end{font-size:11.5px;color:var(--fraco);font-family:var(--mono,monospace)}
  .bot-cfg{display:flex;gap:8px;flex-wrap:wrap;align-items:flex-start;width:100%}
  .bot-cfg input{flex:1;min-width:210px;padding:9px 12px;border-radius:10px;
    border:1px solid var(--linha);background:var(--sub-bg);color:inherit;font-size:13px;
    font-family:var(--mono,monospace)}
  .bot-cfg input:focus{outline:none;border-color:var(--brand)}
  .bot-cfg .err{width:100%;font-size:11.5px;color:#dc2626}
  .bot-cfg .dica{width:100%;font-size:11.5px;color:var(--fraco);line-height:1.55}

  /* ---------- areas WhatsApp e Personas (estudo do Power BI) ---------- */
  /* Cores validadas no validador de paleta (daltonismo), passo proprio no escuro */
  .app{--s1:#2a78d6;--s2:#eb6834;--s3:#1baf7a;
    --st-resp:#1baf7a;--st-leu:#2a78d6;--st-nleu:#eb6834;--st-sem:#6250d6;--st-nent:#eda100;--st-saiu:#e87ba4;
    --cf-padrao:#184f95;--cf-pista:#3987e5;--cf-sem:#86b6ef}
  .app.escuro{--s1:#3987e5;--s2:#d95926;--s3:#199e70;
    --st-resp:#199e70;--st-leu:#3987e5;--st-nleu:#d95926;--st-sem:#9085e9;--st-nent:#c98500;--st-saiu:#d55181;
    --cf-padrao:#5598e7;--cf-pista:#2a78d6;--cf-sem:#184f95}
  .bi-cab{display:flex;align-items:center;gap:10px 16px;flex-wrap:wrap;margin:2px 0 14px}
  .bi-fonte{font-size:11.5px;color:var(--muted)}
  .bi-3{grid-template-columns:repeat(3,minmax(0,1fr))}
  .bi-filtro{display:inline-flex;align-items:center;gap:8px;font-size:12.5px;color:var(--muted)}
  .bi-filtro select,.bi-fps select,.bi-fps input{font:inherit;font-size:12.5px;color:var(--ink);background:var(--card);
    border:1px solid var(--line);border-radius:9px;padding:7px 10px;max-width:100%}
  .bi-filtro select:focus,.bi-fps select:focus,.bi-fps input:focus{outline:none;border-color:var(--brand)}
  .bi-rosca{display:grid;grid-template-columns:minmax(150px,200px) minmax(0,1fr);gap:18px;align-items:center;margin-top:8px}
  .bi-rosca svg{width:100%;height:auto}
  .bi-rosca path{stroke:var(--card);stroke-width:2;transition:opacity .15s}
  .bi-rosca path:hover{opacity:.82}
  .bi-rv{font-family:var(--disp);font-weight:800;font-size:22px;fill:var(--ink)}
  .bi-rr{font-size:10.5px;fill:var(--muted)}
  .bi-leg{list-style:none;display:flex;flex-direction:column;gap:8px}
  .bi-leg li{display:grid;grid-template-columns:12px minmax(0,1fr) auto auto;gap:8px;align-items:center;font-size:12.5px}
  .bi-leg i{width:11px;height:11px;border-radius:3px}
  .bi-leg b{font-family:var(--disp);font-variant-numeric:tabular-nums}
  .bi-leg small{color:var(--muted);min-width:44px;text-align:right;font-variant-numeric:tabular-nums}
  .bi-col svg{width:100%;height:auto;display:block;margin-top:6px}
  .bi-col rect{transition:opacity .15s}
  .bi-col rect:hover{opacity:.8}
  .bi-grade{stroke:var(--line);stroke-width:1}
  .bi-eixo{font-size:10px;fill:var(--muted)}
  .bi-val{font-size:10.5px;font-weight:600;fill:var(--ink2)}
  .bi-col .legenda{margin-top:8px;flex-wrap:wrap}
  .pl .h small{font-weight:400;color:var(--muted);font-family:var(--body);margin-left:4px}
  .bi-pilha{display:flex !important;gap:2px;background:transparent !important}
  .bi-pilha .f{border-radius:0 !important}
  .bi-pilha .f:first-child{border-radius:7px 0 0 7px !important}
  .bi-pilha .f:last-child{border-radius:0 7px 7px 0 !important}
  .bi-pilha .f:only-child{border-radius:7px !important}
  .bi-saude{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:10px}
  .bi-saude > div{border:1px solid var(--line);border-radius:12px;padding:12px 14px;background:var(--soft)}
  .bi-saude .r{font-size:11.5px;color:var(--muted)}
  .bi-saude .v{font-family:var(--disp);font-weight:800;font-size:20px;margin-top:3px}
  .bi-saude .alerta-v{color:var(--warn-ink)}
  .bi-travas{margin-top:10px;font-size:12px;color:var(--warn-ink);background:var(--warn-bg);border:1px solid var(--warn-line);
    border-radius:10px;padding:9px 12px;line-height:1.55}
  .bi-nota{font-size:11.5px;color:var(--muted);margin-top:10px;line-height:1.55}
  .bi-retrato .bi-sec{padding:14px 0;border-top:1px solid var(--line)}
  .bi-retrato .bi-sec:first-of-type{border-top:none;padding-top:6px}
  .bi-retrato h4{font-family:var(--disp);font-size:13.5px;font-weight:700;margin-bottom:5px;color:var(--ink)}
  .bi-retrato p,.bi-retrato li{font-size:13.5px;line-height:1.65;color:var(--ink2);max-width:110ch}
  .bi-retrato ul{padding-left:18px;display:flex;flex-direction:column;gap:5px}
  table.cat.bi-t{min-width:0}
  table.cat.bi-t td:first-child{white-space:normal;overflow-wrap:anywhere;min-width:110px}
  table.cat.bi-t.largo{min-width:1320px}
  table.cat.bi-t.largo td{white-space:normal;line-height:1.4}
  table.cat.bi-t.largo td:nth-child(n+2):nth-child(-n+4),table.cat.bi-t.largo td:nth-child(10){min-width:128px}
  table.cat.bi-t.largo td:nth-child(5){min-width:175px}
  table.cat.bi-t.largo td:first-child,table.cat.bi-t.largo td:nth-child(6),table.cat.bi-t.largo td:nth-child(8),
  table.cat.bi-t.largo td:nth-child(9),table.cat.bi-t.largo td.n{white-space:nowrap;overflow-wrap:normal;min-width:0}
  .bi-sub{font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);margin:14px 0 8px}
  .bi-sub:first-of-type{margin-top:6px}
  .bi-mat{min-width:0 !important}
  .bi-mat td.n{text-align:center}
  .bi-senha{max-width:440px;margin:34px auto;text-align:center;padding:30px 28px}
  .bi-senha .cadeado{margin:0 auto 14px}
  .bi-senha form{display:flex;gap:8px;margin-top:16px;flex-wrap:wrap;justify-content:center}
  .bi-senha input{flex:1;min-width:180px;font:inherit;font-size:14px;padding:11px 13px;border-radius:10px;
    border:1px solid var(--line);background:var(--card);color:var(--ink)}
  .bi-senha input:focus{outline:none;border-color:var(--brand)}
  .bi-senha .msg-erro{margin-top:10px}
  .bi-fps{display:flex;gap:8px 12px;flex-wrap:wrap;align-items:center;margin:12px 0 4px}
  .bi-fps label{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--muted)}
  .bi-fps input{min-width:190px}
  .bi-n{margin-left:auto;font-size:12px;color:var(--muted)}
  .bi-pq{display:block;min-width:220px;white-space:normal;font-size:11.5px;color:var(--muted);line-height:1.45}
  .bi-pag{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:12px;font-size:12px;color:var(--muted)}
  @media (max-width:1100px){.bi-3{grid-template-columns:minmax(0,1fr)}}
  @media (max-width:640px){.bi-rosca{grid-template-columns:minmax(0,1fr)}.bi-rosca svg{max-width:200px;margin:0 auto}
    .bi-saude{grid-template-columns:minmax(0,1fr)}.bi-n{margin-left:0}}
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
    var ABRIR_EXT = '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9"/>' +
      '<path d="M18 14v5a1.8 1.8 0 0 1-1.8 1.8H5A1.8 1.8 0 0 1 3.2 19V7.8A1.8 1.8 0 0 1 5 6h5"/></svg>';
    var CHECK = '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
    var INFO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5v.5"/></svg>';
    var MAIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/></svg>';
    var WPP = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.7l5-1.3A9.7 9.7 0 1 0 12 2.2zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5 5 0 0 0 1.1 2.7 11.5 11.5 0 0 0 4.4 3.9c1.6.7 2.3.8 3.1.6.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2l-.4-.2z"/></svg>';

    function rodape() {
      return '<div class="rodape-hub"><span class="p"><span class="d"></span>' +
        esc(D.rodape || "Powered by Tibério Ferreira for Supertroco") + '</span>' +
        '<span class="f">Dados de RD Station (e-mail), do disparador e da Meta (WhatsApp) e dos parceiros (resultado) · ' +
        'publicado automaticamente · nenhuma chave de API ou senha fica exposta nesta página.</span></div>';
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
      // As cores das series dos graficos (receita e WhatsApp) tem degrau proprio no escuro.
      if ($("graf-rec")) pintarReceita();
      if ($("wa-vivo")) pintarWA();
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
    function botaoBot() {
      var livre = sessao("bot") === "1";
      return '<button class="btn crono" id="bt-bot" title="Situação do disparador de WhatsApp">' +
        (livre ? WPP : CADEADO) + 'Bot</button>';
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
    // O grafico de receita e desenhado na largura real (texto nitido no celular).
    var largRec = 0, tRec = null;
    window.addEventListener("resize", function () {
      clearTimeout(tRec);
      tRec = setTimeout(function () {
        var g = $("graf-rec");
        if (g && Math.abs(g.clientWidth - largRec) > 8) { largRec = g.clientWidth; pintarReceita(); }
        var wg = $("wa-graf"), wv = $("wa-vivo");
        if (wg && wv) desenharWAGrafico(wv.getAttribute("data-parceiro") || null);
      }, 150);
    });

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
    // extra: botoes a mais na mesma linha (no Hub, as areas WhatsApp e Personas)
    function navAbas(abas, extra) {
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
        '</button>' + (extra || "") + '</div><div class="meses' + (aberto ? " on" : "") + '" id="meses">' +
        (meses.length ? meses.map(function (m) {
          var novo = visto.indexOf(m.id) < 0;
          return '<button class="mes' + (m.id === estado.aba ? " on" : "") + '" data-aba="' + esc(m.id) + '">' +
            esc(m.nome) + (m.parcial ? '<span class="tag">até ' + esc(m.ate) + '</span>' : "") +
            (novo ? '<span class="tag novo">novo</span>' : "") + '</button>';
        }).join("") : '<span class="vazio-m">Nenhum mês com dados ainda.</span>') + '</div></div>';
    }
    function ligarNav(abas, redesenhar) {
      var bts = root.querySelectorAll(".nav .nv[data-nav]");
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
      var bts = root.querySelectorAll(".nav .nv[data-nav]");
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
      // "Vendas geradas" e o faturamento do parceiro; "Receita Supertroco" e o que a
      // Supertroco ganha somando TODOS os parceiros, cada um pela sua regra
      // (Sorte Online: comissao/aquisicao; Crefaz: volume pago do relatorio).
      var porP = (k.receita_por_parceiro || []).filter(function (x) { return x.receita > 0; });
      var S = serieRec(), mesS = null;
      if (S) S.meses.forEach(function (m) { if (m.id === aba.id) mesS = m; });
      var pend = mesS ? S.parceiros.filter(function (p) { return (mesS.pendentes || []).indexOf(p.id) >= 0; }) : [];
      var subRec = porP.length > 1 ? porP.map(function (x) { return x.nome + " " + moeda(x.receita); }).join(" + ")
        : porP.length === 1 ? porP[0].nome + " · " + (porP[0].regra || "receita")
        : k.remuneracao === "misto" ? moeda(k.receita_comissao) + " comissão + " + moeda(k.receita_aquisicao) + " por aquisição"
        : k.remuneracao === "aquisicao" ? "valor pago por aquisição" : "comissão sobre as vendas";
      if (pend.length) subRec += " · " + pend.map(function (p) { return p.nome; }).join(", ") + ": relatório pendente";
      if (k.parceiros_vendas) g.push(["Vendas geradas", moeda(k.vendas), aba.periodo, true]);
      if (k.parceiros_vendas || porP.length) g.push(["Receita Supertroco", moeda(receitaDe(k)), subRec, true]);
      if (k.parceiros_leads) {
        g.push(["Leads gerados", nf(k.leads), k.leads_pagos
          ? nf(k.leads_pagos) + (k.leads_pagos > 1 ? " contratos pagos · " : " contrato pago · ") + moeda(k.leads_volume)
          : k.parceiros_leads + (k.parceiros_leads > 1 ? " parcerias" : " parceria") + " medida em leads", true]);
      }
      if (k.parceiros_vendas) {
        g.push(["Aquisições", nf(k.aquisicoes), "novos usuários no período", false]);
        var pv = (k.receita_por_parceiro || []).filter(function (x) { return x.modelo === "vendas"; });
        g.push(["Receita por aquisição", moeda(k.cac, 2), pv.length === 1 ? "receita da " + pv[0].nome + " ÷ aquisições"
          : k.receita_vendas !== undefined ? "receita de vendas ÷ aquisições" : "receita Supertroco ÷ aquisições", false]);
      }
      g.push(["Campanhas de e-mail", nf(k.campanhas), k.campanhas ? mil(k.entregues) + " e-mails entregues" : "nenhum envio no período", false]);
      g.push(["Abertura média", k.campanhas ? nf(k.abertura, 1) + "%" : "—", k.campanhas ? "CTR de " + nf(k.ctr, 2) + "%" : "sem e-mail no período", false, !k.campanhas]);
      if (wppNoHub()) {
        g.push(["WhatsApp", k.wpp_disparos ? nf(k.wpp_disparos) : "Pronto", !k.wpp_disparos ? "aguardando os primeiros disparos"
          : k.wpp_custo_meta ? "disparos · " + moeda(k.wpp_custo_meta, 2) + " de custo na Meta" + (WA.vivo ? " · ao vivo" : "")
          : "disparos · " + moeda(k.wpp_investimento) + " investidos", false, !k.wpp_disparos]);
      } else if (wbi() && wbi().disparos) {
        var kd = wbi().disparos.kpis;
        g.push(["WhatsApp · leitura", pctTxt(kd.taxa_leitura, 0), "de " + nf(kd.entregues) + " entregues · detalhes na área WhatsApp", false]);
      }
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
        (!wppNoHub() ? '' : wpp ? '<span class="cm wpp">' + WPP + nf(wpp.disparos) + ' disparos</span>'
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
          // Parceiro so de WhatsApp com Tracking (Porto Bank): sem o canal no hub, o cartao mostra o
          // resultado do relatorio do parceiro.
          var trk = !wppNoHub() && p.tracking && p.tracking.produtos && p.tracking.produtos.length ? trkResumo(p) : null;
          if (trk) {
            grid = '<span class="gi"><span class="r">Acessos SuperTroco*</span><span class="v">' + nf(trk.lead) + '</span></span>' +
              '<span class="gi"><span class="r">Contratos</span><span class="v">' + nf(trk.conv) + '</span></span>' +
              '<span class="gi"><span class="r">Produção</span><span class="v">' + moeda(trk.prod, 2) + '</span></span>' +
              '<span class="gi"><span class="r">Desde</span><span class="v">' + esc(ddmm(p.tracking.inicio)) + '</span></span>';
          } else if (!r) {
            grid = '<span class="gi" style="grid-column:1/-1"><span class="r">' +
              (p.sem_dados ? "Aguardando os primeiros dados" : "Sem dados em " + esc(aba.nome)) +
              '</span><span class="v" style="color:var(--muted2)">—</span></span>';
          } else if (p.modelo === "midia") {
            grid = '<span class="gi"><span class="r">Disparos</span><span class="v">' + nf(r.disparos) + '</span></span>' +
              '<span class="gi"><span class="r">Receita</span><span class="v">' + moeda(r.receita, 2) + '</span></span>' +
              '<span class="gi"><span class="r">Custo Meta</span><span class="v">' + moeda(r.custo_meta, 2) + '</span></span>' +
              '<span class="gi"><span class="r">Margem</span><span class="v">' + moeda(r.margem, 2) + '</span></span>';
          } else if (p.modelo === "leads" && r.fonte === "funil") {
            grid = '<span class="gi"><span class="r">Leads</span><span class="v">' + nf(r.leads) + '</span></span>' +
              '<span class="gi"><span class="r">Digitados</span><span class="v">' + nf(r.digitados) + '</span></span>' +
              '<span class="gi"><span class="r">Pagos</span><span class="v">' + nf(r.pagos) + '</span></span>' +
              '<span class="gi"><span class="r">Receita · volume pago</span><span class="v">' + moeda(r.volume) + '</span></span>';
          } else if (p.modelo === "leads") {
            grid = '<span class="gi"><span class="r">Leads</span><span class="v">' + nf(r.leads) + '</span></span>' +
              '<span class="gi"><span class="r">Média por dia</span><span class="v">' + nf(r.media_dia, 1) + '</span></span>' +
              '<span class="gi"><span class="r">Pico</span><span class="v">' + (r.pico ? nf(r.pico.v) + " · " + esc(r.pico.d) : "—") + '</span></span>' +
              '<span class="gi"><span class="r">Dias com lead</span><span class="v">' + nf(r.dias_com_lead) + " de " + nf(r.dias_ativos) + '</span></span>';
          } else {
            grid = '<span class="gi"><span class="r">Vendas</span><span class="v">' + moeda(r.vendas) + '</span></span>' +
              '<span class="gi"><span class="r">' + (r.remuneracao === "comissao" || !r.remuneracao ? "Comissão" : "Receita Supertroco") +
              '</span><span class="v">' + moeda(receitaDe(r)) + '</span></span>' +
              '<span class="gi"><span class="r">Aquisições</span><span class="v">' + nf(r.aquisicoes) + '</span></span>' +
              '<span class="gi"><span class="r">Por aquisição</span><span class="v">' + moeda(r.cac, 2) + '</span></span>';
          }
          var pe = trk ? "acessos e contratos · relatório da " + p.nome
            : p.modelo === "midia" ? (p.valor_por_disparo ? moeda(p.valor_por_disparo, 2) + " por disparo · Meta" : "mídia no WhatsApp")
            : p.modelo === "leads" ? (p.fonte_resultado === "funil" ? "leads e contratos · relatório mensal" : "mede leads")
            : p.remuneracao_atual ? p.remuneracao_atual
            : (p.taxa_comissao ? nf(p.taxa_comissao * 100, 0) + "% de comissão" : "mede vendas");
          return '<button class="pc' + (r || trk ? "" : " apagado") + '" data-parceiro="' + esc(p.id) + '">' +
            '<span class="faixa" style="background:linear-gradient(90deg,' +
            esc(p.cores.brand) + ',' + esc(p.cores.brand_lite) + ')"></span>' +
            '<span class="corpo"><span class="cab">' +
            '<span class="ini" style="background:' + esc(p.cores.brand) + '">' +
            esc(p.nome.charAt(0)) + '</span><span><span class="nm">' + esc(p.nome) + '</span>' +
            '<span class="sg" style="display:block">' + esc(p.segmento) + '</span></span>' +
            '<span class="modelo">' + (trk ? "Tracking" : p.modelo === "leads" ? "Leads" : p.modelo === "midia" ? "Mídia" : "Vendas") + '</span></span>' +
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

    // Os 4 numeros da RD (entregues, bounce, aberturas, cliques) de todos os parceiros.
    function hubTabelaEmail(aba) {
      var k = aba.kpis;
      if (!k.campanhas) return "";
      var porId = {};
      aba.parceiros.forEach(function (r) { porId[r.id] = r; });
      var linhas = D.parceiros.map(function (p) {
        var r = porId[p.id], em = r && r.email;
        return '<tr><td><span class="src" style="background:' + esc(p.cores.brand) + ';margin-right:8px"></span>' +
          esc(p.nome) + '</td>' + (em
            ? '<td class="n">' + nf(em.campanhas) + '</td><td class="n">' + nf(em.entregues) + '</td><td class="n">' +
              nfOu(em.bounce) + '</td><td class="n">' + nfOu(em.aberturas) + '</td><td class="n">' + nfOu(em.cliques) +
              '</td><td class="n">' + nf(em.abertura, 1) + '%</td><td class="n">' + nf(em.ctr, 2) + '%</td>'
            : '<td colspan="7" style="color:var(--muted)">sem e-mail neste período</td>') + '</tr>';
      }).join("");
      return '<div class="row"><div class="painel"><div class="hrow"><div><h3>E-mail por parceiro</h3>' +
        '<div class="cap">Entregues, bounce, aberturas e cliques únicos da RD Station · ' + esc(aba.nome) + '</div></div>' +
        (k.bounce_pct !== undefined ? '<span class="cm mail">' + MAIL + 'bounce ' + nf(k.bounce_pct, 2) + '%</span>' : '') +
        '</div><div class="tw"><table class="cat"><thead><tr><th>Parceiro</th><th class="n">Campanhas</th>' +
        '<th class="n">Entregues</th><th class="n">Bounce</th><th class="n">Aberturas</th><th class="n">Cliques</th>' +
        '<th class="n">Abertura</th><th class="n">CTR</th></tr></thead><tbody>' + linhas + '</tbody>' +
        '<tfoot><tr><td>Total</td><td class="n">' + nf(k.campanhas) + '</td><td class="n">' + nf(k.entregues) +
        '</td><td class="n">' + nfOu(k.bounce) + '</td><td class="n">' + nfOu(k.aberturas) + '</td><td class="n">' +
        nfOu(k.cliques) + '</td><td class="n">' + nf(k.abertura, 1) + '%</td><td class="n">' + nf(k.ctr, 2) +
        '%</td></tr></tfoot></table></div></div></div>';
    }

    function hubParticipacao(aba) {
      if (!aba.participacao || aba.participacao.length < 2) return "";
      var maxF = Math.max.apply(null, aba.participacao.map(function (p) { return p.vendas; })) || 1;
      return '<div class="row"><div class="painel"><h3>Participação nas vendas</h3>' +
        '<div class="cap">Quanto cada parceria de vendas representa do total gerado no período</div>' +
        '<div class="part">' + aba.participacao.map(function (p) {
          return '<div class="pl"><div class="h"><span>' + esc(p.nome) + '</span>' +
            '<b>' + moeda(p.vendas) + ' · ' + nf(p.fatia, 1) + '%</b></div>' +
            '<span class="t"><span class="f" style="width:' +
            Math.max(1.5, p.vendas / maxF * 100).toFixed(1) + '%;background:' + esc(p.cor) + '"></span></span></div>';
        }).join("") + '</div></div></div>';
    }

    // ---------- crescimento da receita Supertroco (todos os parceiros) ----------
    // Mensal: colunas empilhadas por parceiro (cor do parceiro), com o ritmo do mes
    // corrente atras; Acumulado: linhas dia a dia com mira; Tabela: os mesmos numeros.
    // A legenda liga/desliga parceiros e tudo (resumo, colunas, tabela) recalcula.
    var rec = { modo: ler("rec-modo") || "mensal", ocultos: {}, idx: -1 };
    var REC_MODOS = [["mensal", "Mensal"], ["acumulado", "Acumulado"], ["tabela", "Tabela"]];
    function serieRec() { return D.hub && D.hub.receita_serie; }
    function recVisiveis(S) { return S.parceiros.filter(function (p) { return !rec.ocultos[p.id]; }); }
    function corRec(p) { return app.classList.contains("escuro") ? (p.cor_escuro || p.cor) : p.cor; }
    function moedaCurta(v) {
      v = Number(v || 0);
      var a = Math.abs(v);
      if (a >= 1e6) return "R$ " + nf(v / 1e6, 1) + " mi";
      if (a >= 1e3) return "R$ " + nf(v / 1e3, a >= 1e4 ? 0 : 1) + " mil";
      return "R$ " + nf(v);
    }
    function tetoBonito(v) {
      if (!(v > 0)) return 1;
      var e = Math.pow(10, Math.floor(Math.log(v) / Math.LN10)), f = v / e;
      var passos = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
      for (var i = 0; i < passos.length; i++) if (f <= passos[i] + 1e-9) return passos[i] * e;
      return 10 * e;
    }
    function totalMes(m, vis) {
      return vis.reduce(function (a, p) { var v = m.valores[p.id]; return a + (v ? v : 0); }, 0);
    }
    function ritmoMes(m, vis) {
      var tem = false, t = vis.reduce(function (a, p) {
        var pr = m.projecao && m.projecao[p.id];
        if (pr) tem = true;
        var v = m.valores[p.id];
        return a + (pr || (v ? v : 0));
      }, 0);
      return tem ? t : null;
    }
    function pendentesMes(m, vis) {
      return vis.filter(function (p) { return (m.pendentes || []).indexOf(p.id) >= 0; });
    }
    // Crescimento so entre meses fechados: mes parcial contra mes cheio pareceria queda.
    function crescMes(S, i, vis) {
      var m = S.meses[i], ant = S.meses[i - 1];
      if (!ant || m.parcial || ant.parcial) return null;
      var a = totalMes(ant, vis), b = totalMes(m, vis);
      return a > 0 ? { pct: (b - a) / a * 100, ant: ant } : null;
    }
    function deltaTxt(c) {
      return (c.pct >= 0 ? "▲ " : "▼ ") + nf(Math.abs(c.pct), Math.abs(c.pct) >= 100 ? 0 : 1) + "%";
    }
    function dicaMes(S, i, vis) {
      var m = S.meses[i], t = totalMes(m, vis), c = crescMes(S, i, vis), r = ritmoMes(m, vis);
      var linhas = [moeda(t, 2) + " de receita", m.nome + (m.parcial ? " · parcial, até " + m.ate : "")];
      vis.forEach(function (p) {
        if (!(p.id in m.valores)) return;
        var v = m.valores[p.id];
        linhas.push(p.nome + ": " + (v === null ? "relatório pendente" : moeda(v, 2) +
          (t ? " (" + nf(v / t * 100, 0) + "%)" : "")));
      });
      if (c) linhas.push(deltaTxt(c) + " vs " + c.ant.nome.split(" ")[0].toLowerCase());
      if (r) linhas.push("Ritmo do mês: " + moeda(r, 0) + " (estimativa linear)");
      linhas.push(estado.aba === m.id ? "Mês aberto no hub" : "Toque para abrir o mês");
      return linhas.join("\n");
    }

    function hubReceita(aba) {
      var S = serieRec();
      if (!S || !S.meses || !S.meses.length) return "";
      var notas = [];
      S.parceiros.forEach(function (p) {
        if (p.fonte === "mensal") notas.push(p.nome + " entra no fechamento de cada mês (relatório mensal)");
      });
      var ult = S.meses[S.meses.length - 1];
      if (ult.parcial && Object.keys(ult.projecao || {}).length) {
        notas.push("ritmo do mês = receita até " + ult.ate + " ÷ dias decorridos × dias do mês — estimativa, não resultado");
      }
      return '<div class="row"><div class="painel" id="pn-rec"><div class="hrow"><div>' +
        '<h3>Crescimento da receita Supertroco</h3>' +
        '<div class="cap">Soma de todos os parceiros, cada um pela sua regra · ' +
        esc(S.parceiros.map(function (p) { return p.nome + ": " + (p.regra || "receita"); }).join(" · ")) +
        '</div></div><div class="seg" id="seg-rec">' + REC_MODOS.map(function (o) {
          return '<button data-r="' + o[0] + '"' + (rec.modo === o[0] ? ' class="on"' : '') + '>' + esc(o[1]) + '</button>';
        }).join("") + '</div></div>' +
        '<div id="rc-res" class="rc-res"></div>' +
        '<div class="rc-corpo' + (rec.modo === "tabela" ? " so" : "") + '" id="rc-corpo"><div class="rc-main">' +
        '<div class="rc-leg" id="rc-leg"></div><div id="graf-rec" class="chart rc-graf"></div></div>' +
        '<div class="rc-lado" id="rc-lado"></div></div>' +
        (notas.length ? '<div class="ar-nota" style="margin-top:8px">' + esc(notas.join(" · ")) + '</div>' : '') +
        '</div></div>';
    }

    function pintarReceita() {
      var S = serieRec(), alvo = $("graf-rec");
      if (!S || !alvo) return;
      var vis = recVisiveis(S);
      // Resumo: total do periodo (ou do mes aberto), ultimo mes fechado, mes em andamento.
      var res = $("rc-res");
      if (res) {
        var iAba = -1;
        S.meses.forEach(function (m, i) { if (m.id === estado.aba) iAba = i; });
        var tot = iAba >= 0 ? totalMes(S.meses[iAba], vis)
          : S.meses.reduce(function (a, m) { return a + totalMes(m, vis); }, 0);
        var escopo = iAba >= 0 ? [S.meses[iAba]] : S.meses;
        var comV = vis.filter(function (p) { return escopo.some(function (m) { return m.valores[p.id] > 0; }); });
        var pendE = iAba >= 0 ? pendentesMes(S.meses[iAba], vis) : [];
        var figs = ['<div class="rc-fig"><div class="r">' + (iAba >= 0 ? "Receita em " + esc(S.meses[iAba].nome) : "Receita no período") +
          '</div><div class="v">' + moeda(tot, 2) + '</div><div class="s">' +
          esc((comV.map(function (p) { return p.nome; }).join(" + ") || "nenhum parceiro com receita") +
            (pendE.length ? " · " + pendE.map(function (p) { return p.nome; }).join(", ") + " pendente" : "")) + '</div></div>'];
        var iF = -1;
        S.meses.forEach(function (m, i) { if (!m.parcial) iF = i; });
        if (iF >= 0) {
          var c = crescMes(S, iF, vis);
          figs.push('<div class="rc-fig"><div class="r">Último mês fechado · ' + esc(S.meses[iF].nome) + '</div>' +
            '<div class="v">' + moeda(totalMes(S.meses[iF], vis), 2) + '</div><div class="s">' +
            (c ? '<span class="rc-d ' + (c.pct >= 0 ? "up" : "down") + '">' + esc(deltaTxt(c)) + '</span> vs ' +
              esc(c.ant.nome.split(" ")[0].toLowerCase()) + ' (' + moeda(totalMes(c.ant, vis), 0) + ')'
              : 'primeiro mês da série') + '</div></div>');
        }
        var u = S.meses[S.meses.length - 1];
        if (u.parcial) {
          var r = ritmoMes(u, vis), pend = pendentesMes(u, vis);
          figs.push('<div class="rc-fig"><div class="r">' + esc(u.nome.split(" ")[0]) + ' até ' + esc(u.ate) + ' · em andamento</div>' +
            '<div class="v">' + moeda(totalMes(u, vis), 2) + '</div><div class="s">' +
            (r ? 'ritmo de <b>' + moeda(r, 0) + '</b> no mês' : 'sem ritmo diário') +
            (pend.length ? ' · ' + esc(pend.map(function (p) { return p.nome; }).join(", ")) + ': relatório pendente' : '') +
            '</div></div>');
        }
        res.innerHTML = figs.join("");
      }
      var leg = $("rc-leg");
      if (leg) {
        leg.innerHTML = S.parceiros.map(function (p) {
          var on = !rec.ocultos[p.id];
          return '<button class="rc-chip" data-id="' + esc(p.id) + '" aria-pressed="' + (on ? "true" : "false") +
            '" title="' + (on ? "Ocultar " : "Mostrar ") + esc(p.nome) + '"><i style="background:' + esc(corRec(p)) + '"></i>' +
            esc(p.nome) + '</button>';
        }).join("") +
          (rec.modo === "mensal" && S.meses.some(function (m) { return ritmoMes(m, vis); })
            ? '<span class="rc-k"><i class="gh"></i>Ritmo do mês (estimativa)</span>' : '') +
          (rec.modo === "acumulado" && vis.length > 1 ? '<span class="rc-k"><i class="ln"></i>Total</span>' : '');
        leg.querySelectorAll(".rc-chip").forEach(function (b) {
          b.addEventListener("click", function () {
            var id = b.getAttribute("data-id");
            rec.ocultos[id] = !rec.ocultos[id];
            pintarReceita();
          });
        });
      }
      var corpo = $("rc-corpo");
      if (corpo) corpo.classList.toggle("so", rec.modo === "tabela");
      ladoReceita(S, vis);
      if (!vis.length) {
        alvo.innerHTML = '<div class="vazio">Escolha ao menos um parceiro na legenda.</div>';
        return;
      }
      if (rec.modo === "tabela") alvo.innerHTML = tabelaReceita(S, vis);
      else if (rec.modo === "acumulado") desenharAcumulado(S, vis, alvo);
      else desenharMensal(S, vis, alvo);
    }

    // Coluna lateral: de onde vem a receita (periodo ou mes aberto), media e melhor mes.
    function ladoReceita(S, vis) {
      var lado = $("rc-lado");
      if (!lado) return;
      var mesA = null;
      S.meses.forEach(function (m) { if (m.id === estado.aba) mesA = m; });
      var meses = mesA ? [mesA] : S.meses;
      var porP = vis.map(function (p) {
        return { p: p, v: meses.reduce(function (a, m) { return a + (m.valores[p.id] || 0); }, 0),
                 pend: meses.some(function (m) { return (m.pendentes || []).indexOf(p.id) >= 0; }) };
      });
      var tot = porP.reduce(function (a, x) { return a + x.v; }, 0) || 0;
      var fechados = S.meses.filter(function (m) { return !m.parcial; });
      var melhor = null;
      fechados.forEach(function (m) { if (!melhor || totalMes(m, vis) > totalMes(melhor, vis)) melhor = m; });
      var media = fechados.length ? fechados.reduce(function (a, m) { return a + totalMes(m, vis); }, 0) / fechados.length : 0;
      lado.innerHTML = '<div class="rc-h">De onde vem a receita</div><div class="cap">' +
        esc(mesA ? mesA.nome + (mesA.parcial ? " · até " + mesA.ate : "") : "Todo o período") + '</div>' +
        (porP.length ? porP.map(function (x) {
          var f = tot ? x.v / tot * 100 : 0;
          return '<div class="rc-p" data-tip="' + esc(moeda(x.v, 2) + "\n" + x.p.nome + " · " + nf(f, 1) + "% da receita\n" +
              (x.p.regra || "")) + '"><div class="h"><span><i class="rc-sw" style="background:' + esc(corRec(x.p)) + '"></i>' +
            esc(x.p.nome) + '</span>' + (x.pend && !x.v ? '<b class="pend">pendente</b>' : '<b>' + moeda(x.v, 0) + '</b>') + '</div>' +
            '<span class="t"><span class="f" style="width:' + Math.max(x.v ? 1.5 : 0, f).toFixed(1) + '%;background:' +
            esc(corRec(x.p)) + '"></span></span><div class="s">' + (x.pend && !x.v ? '' : nf(f, 1) + '% · ') +
            esc(x.p.regra || "receita") + (x.pend ? ' · <span class="pend">relatório pendente</span>' : '') + '</div></div>';
        }).join("") : '<div class="vazio" style="padding:14px 0">Nenhum parceiro selecionado.</div>') +
        (fechados.length ? '<div class="rc-mini"><div><span>Média por mês fechado</span><b>' + moeda(media, 0) + '</b></div>' +
          (melhor ? '<div><span>Melhor mês</span><b>' + esc(melhor.nome.split(" ")[0]) + ' · ' + moeda(totalMes(melhor, vis), 0) +
            '</b></div>' : '') + '</div>' : '');
    }

    function desenharMensal(S, vis, alvo) {
      var W = Math.max(320, Math.round(alvo.clientWidth || 760)), H = W < 560 ? 250 : 280;
      var pl = 62, pr = 12, pt = 44, pb = 52, iw = W - pl - pr, ih = H - pt - pb;
      var n = S.meses.length, banda = iw / n;
      var mx = tetoBonito(Math.max.apply(null, S.meses.map(function (m) {
        return Math.max(totalMes(m, vis), ritmoMes(m, vis) || 0);
      })));
      var Y = function (v) { return pt + ih * (1 - v / mx); };
      var larg = Math.min(24, Math.max(10, banda * 0.5)), base = pt + ih;
      var anos = {};
      S.meses.forEach(function (m) { anos[m.id.slice(0, 4)] = 1; });
      var variosAnos = Object.keys(anos).length > 1;
      var s = "";
      [0, 0.5, 1].forEach(function (f) {
        var y = Y(mx * f);
        s += '<line class="gline" x1="' + pl + '" y1="' + y.toFixed(1) + '" x2="' + (W - pr) + '" y2="' + y.toFixed(1) + '"/>' +
          '<text class="glabel" x="' + (pl - 8) + '" y="' + (y + 3.5).toFixed(1) + '" text-anchor="end">' + esc(moedaCurta(mx * f)) + '</text>';
      });
      var rotular = n <= 8;
      S.meses.forEach(function (m, i) {
        var cx = pl + banda * i + banda / 2, x0 = cx - larg / 2;
        var apagado = estado.aba !== "geral" && estado.aba !== m.id;
        var g = '<g class="rc-col' + (apagado ? " apagado" : "") + '">';
        var r = ritmoMes(m, vis), tot = totalMes(m, vis);
        if (r && r > tot) g += barraTopo(x0, Y(r), larg, base - Y(r), "rc-ghost", "");
        var segs = vis.filter(function (p) { return m.valores[p.id] > 0; });
        var yb = base;
        segs.forEach(function (p, k) {
          var h = m.valores[p.id] / mx * ih, topo = k === segs.length - 1;
          var y1 = yb - h, alto = Math.max(1, h - (topo ? 0 : 2));
          g += topo ? barraTopo(x0, y1, larg, yb - y1, "", corRec(p))
                    : '<rect x="' + x0.toFixed(1) + '" y="' + (y1 + 2).toFixed(1) + '" width="' + larg.toFixed(1) +
                      '" height="' + alto.toFixed(1) + '" fill="' + esc(corRec(p)) + '"/>';
          yb = y1;
        });
        // Rotulos seletivos: total no topo e crescimento (ou "parcial") logo acima.
        if (rotular || i === n - 1) {
          var topoY = Math.min(Y(tot), r ? Y(r) : base);
          var c = crescMes(S, i, vis);
          g += '<text class="rc-tot" x="' + cx.toFixed(1) + '" y="' + (topoY - 8).toFixed(1) + '">' + esc(moedaCurta(tot)) + '</text>';
          var sub = c ? deltaTxt(c) : m.parcial ? (r ? "ritmo " + moedaCurta(r) : "parcial") : "";
          if (sub) {
            g += '<text class="rc-sub' + (c ? (c.pct >= 0 ? " up" : " down") : "") + '" x="' + cx.toFixed(1) + '" y="' +
              (topoY - 22).toFixed(1) + '">' + esc(sub) + '</text>';
          }
        }
        g += '<text class="xlabel rc-x" x="' + cx.toFixed(1) + '" y="' + (base + 17) + '">' +
          esc(m.curto + (variosAnos ? "/" + m.id.slice(2, 4) : "")) + '</text>';
        var nota = (m.parcial ? "até " + m.ate : "");
        var pend = pendentesMes(m, vis);
        if (nota) g += '<text class="rc-x2" x="' + cx.toFixed(1) + '" y="' + (base + 31) + '">' + esc(nota) + '</text>';
        if (pend.length) {
          g += '<text class="rc-x2 pend" x="' + cx.toFixed(1) + '" y="' + (base + (nota ? 44 : 31)) + '">' +
            esc(pend.length === 1 ? pend[0].nome + " pendente" : pend.length + " pendentes") + '</text>';
        }
        g += '<rect class="hitzone rc-hit" x="' + (pl + banda * i).toFixed(1) + '" y="' + (pt - 34) + '" width="' + banda.toFixed(1) +
          '" height="' + (ih + 34) + '" data-mes="' + esc(m.id) + '" tabindex="0" role="button" aria-label="' +
          esc(dicaMes(S, i, vis).split("\n").slice(0, -1).join(", ")) + '" data-tip="' + esc(dicaMes(S, i, vis)) + '"/></g>';
        s += g;
      });
      alvo.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" role="img" aria-label="' +
        'Receita Supertroco por mês e por parceiro">' + s + '</svg>';
      alvo.querySelectorAll(".rc-hit").forEach(function (z) {
        var abrir = function () {
          var id = z.getAttribute("data-mes");
          if (id === estado.aba) return;
          var bt = root.querySelector('.meses .mes[data-aba="' + id + '"]');
          if (bt) { var l = $("meses"); if (l) l.classList.add("on"); tip.classList.remove("on"); bt.click(); }
        };
        z.addEventListener("click", abrir);
        z.addEventListener("keydown", function (ev) { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); abrir(); } });
      });
    }
    // Coluna com cantos de 4px so na ponta de dado; a base fica reta.
    function barraTopo(x, y, w, h, cls, cor) {
      var rr = Math.min(4, w / 2, Math.max(0, h));
      return '<path' + (cls ? ' class="' + cls + '"' : '') + (cor ? ' fill="' + esc(cor) + '"' : '') + ' d="M' + x.toFixed(1) + "," + (y + h).toFixed(1) +
        " V" + (y + rr).toFixed(1) + " Q" + x.toFixed(1) + "," + y.toFixed(1) + " " + (x + rr).toFixed(1) + "," + y.toFixed(1) +
        " H" + (x + w - rr).toFixed(1) + " Q" + (x + w).toFixed(1) + "," + y.toFixed(1) + " " + (x + w).toFixed(1) + "," + (y + rr).toFixed(1) +
        " V" + (y + h).toFixed(1) + ' Z"/>';
    }

    function desenharAcumulado(S, vis, alvo) {
      var W = Math.max(320, Math.round(alvo.clientWidth || 760)), H = W < 560 ? 250 : 280;
      var pl = 62, pr = W < 560 ? 14 : 78, pt = 18, pb = 30, iw = W - pl - pr, ih = H - pt - pb;
      var datas = S.datas || [], n = datas.length;
      if (!n) { alvo.innerHTML = '<div class="vazio">Sem dias com receita ainda.</div>'; return; }
      var acum = {}, total = [];
      vis.forEach(function (p) {
        var a = 0, arr = S.por_dia[p.id] || [];
        acum[p.id] = datas.map(function (_, i) { a += arr[i] || 0; return a; });
      });
      for (var i = 0; i < n; i++) {
        total.push(vis.reduce(function (t, p) { return t + acum[p.id][i]; }, 0));
      }
      var mx = tetoBonito(total[n - 1] || 1);
      var X = function (i) { return n === 1 ? pl + iw / 2 : pl + iw * i / (n - 1); };
      var Y = function (v) { return pt + ih * (1 - v / mx); };
      var linha = function (arr) {
        return "M" + arr.map(function (v, i) { return X(i).toFixed(1) + "," + Y(v).toFixed(1); }).join(" L");
      };
      var s = "";
      [0, 0.5, 1].forEach(function (f) {
        var y = Y(mx * f);
        s += '<line class="gline" x1="' + pl + '" y1="' + y.toFixed(1) + '" x2="' + (W - pr) + '" y2="' + y.toFixed(1) + '"/>' +
          '<text class="glabel" x="' + (pl - 8) + '" y="' + (y + 3.5).toFixed(1) + '" text-anchor="end">' + esc(moedaCurta(mx * f)) + '</text>';
      });
      // Viradas de mes: linha fina + nome do mes; o mes aberto no hub ganha uma faixa.
      datas.forEach(function (iso, i) {
        if (iso.slice(8) !== "01" && i !== 0) return;
        var m = null;
        S.meses.forEach(function (x) { if (x.id === iso.slice(0, 7)) m = x; });
        if (i > 0) s += '<line class="gline" x1="' + X(i).toFixed(1) + '" y1="' + pt + '" x2="' + X(i).toFixed(1) + '" y2="' + (pt + ih) + '"/>';
        if (m && estado.aba === m.id) {
          var fimI = i;
          datas.forEach(function (d, j) { if (d.slice(0, 7) === m.id) fimI = j; });
          s += '<rect class="rc-faixa" x="' + X(i).toFixed(1) + '" y="' + pt + '" width="' + Math.max(2, X(fimI) - X(i)).toFixed(1) +
            '" height="' + ih + '"/>';
        }
        s += '<text class="xlabel" x="' + (X(i) + 4).toFixed(1) + '" y="' + (H - 9) + '" style="text-anchor:start">' +
          esc(m ? m.curto : iso.slice(5, 7)) + '</text>';
      });
      var multi = vis.length > 1;
      if (multi) s += '<path class="rc-area" d="' + linha(total) + " L" + X(n - 1).toFixed(1) + "," + (pt + ih) + " L" + X(0).toFixed(1) + "," + (pt + ih) + ' Z"/>';
      vis.forEach(function (p) {
        s += '<path class="rc-lin" stroke="' + esc(corRec(p)) + '" d="' + linha(acum[p.id]) + '"/>';
      });
      if (multi) s += '<path class="rc-lin tot" d="' + linha(total) + '"/>';
      // Rotulo so no fim das linhas, e so quando nao encostam umas nas outras.
      if (W >= 560) {
        var fins = vis.map(function (p) { return { y: Y(acum[p.id][n - 1]), v: acum[p.id][n - 1], nome: p.nome }; });
        if (multi) fins.push({ y: Y(total[n - 1]), v: total[n - 1], nome: "Total", tot: true });
        fins.sort(function (a, b) { return a.y - b.y; });
        fins.forEach(function (f, k) {
          var perto = (k > 0 && f.y - fins[k - 1].y < 26) || (k < fins.length - 1 && fins[k + 1].y - f.y < 26);
          if (perto && !f.tot) return;
          s += '<text class="rc-fim" x="' + (X(n - 1) + 8).toFixed(1) + '" y="' + (f.y - 2).toFixed(1) + '">' + esc(moedaCurta(f.v)) + '</text>' +
            '<text class="rc-fim n" x="' + (X(n - 1) + 8).toFixed(1) + '" y="' + (f.y + 10).toFixed(1) + '">' + esc(f.nome) + '</text>';
        });
      }
      s += '<g id="rc-mira" style="display:none"><line class="rc-cross" x1="0" y1="' + pt + '" x2="0" y2="' + (pt + ih) + '"/>' +
        vis.map(function (p) { return '<circle class="rc-dot" r="4" fill="' + esc(corRec(p)) + '" data-s="' + esc(p.id) + '"/>'; }).join("") +
        (multi ? '<circle class="rc-dot tot" r="4" data-s="__tot"/>' : '') + '</g>' +
        '<rect class="rc-ov" id="rc-ov" x="' + pl + '" y="' + pt + '" width="' + iw + '" height="' + ih +
        '" tabindex="0" role="img" aria-label="Receita acumulada dia a dia; use as setas para percorrer os dias"/>';
      alvo.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" role="img" aria-label="' +
        'Receita Supertroco acumulada por dia">' + s + '</svg>';

      var svg = alvo.querySelector("svg"), ov = $("rc-ov"), mira = $("rc-mira");
      function marcar(i) {
        i = Math.max(0, Math.min(n - 1, i));
        rec.idx = i;
        var x = X(i);
        mira.style.display = "";
        var ln = mira.querySelector("line");
        ln.setAttribute("x1", x.toFixed(1)); ln.setAttribute("x2", x.toFixed(1));
        mira.querySelectorAll("circle").forEach(function (c) {
          var id = c.getAttribute("data-s"), v = id === "__tot" ? total[i] : acum[id][i];
          c.setAttribute("cx", x.toFixed(1)); c.setAttribute("cy", Y(v).toFixed(1));
        });
        var iso = datas[i], dia = vis.reduce(function (t, p) { return t + ((S.por_dia[p.id] || [])[i] || 0); }, 0);
        var linhas = [moeda(total[i], 2) + " acumulados", iso.slice(8) + "/" + iso.slice(5, 7) + "/" + iso.slice(0, 4)];
        if (multi) vis.forEach(function (p) { linhas.push(p.nome + ": " + moeda(acum[p.id][i], 2)); });
        linhas.push(dia ? "Entrou no dia: " + moeda(dia, 2) : "Nada entrou neste dia");
        vis.forEach(function (p) {
          var v = (S.por_dia[p.id] || [])[i] || 0;
          if (p.fonte === "mensal" && v) linhas.push(p.nome + ": fechamento do mês (relatório)");
        });
        ov.setAttribute("data-tip", linhas.join("\n"));
        return x;
      }
      function indiceDe(ev) {
        var r = svg.getBoundingClientRect();
        var x = (ev.clientX - r.left) * W / (r.width || W);
        return Math.round((x - pl) / (iw || 1) * (n - 1));
      }
      ov.addEventListener("pointermove", function (ev) { marcar(indiceDe(ev)); });
      ov.addEventListener("pointerdown", function (ev) { marcar(indiceDe(ev)); });
      ov.addEventListener("pointerleave", function () { mira.style.display = "none"; });
      ov.addEventListener("focus", function () { marcar(rec.idx >= 0 ? rec.idx : n - 1); });
      ov.addEventListener("blur", function () { mira.style.display = "none"; });
      ov.addEventListener("keydown", function (ev) {
        var passo = ev.key === "ArrowLeft" ? -1 : ev.key === "ArrowRight" ? 1 : ev.key === "Home" ? -n : ev.key === "End" ? n : 0;
        if (!passo) return;
        ev.preventDefault();
        var x = marcar((rec.idx >= 0 ? rec.idx : n - 1) + passo);
        var r = svg.getBoundingClientRect();
        mostrarTip(ov, r.left + x * (r.width / W), r.top + pt * (r.height / H));
      });
      if (ov && rec.idx >= 0 && document.activeElement === ov) marcar(rec.idx);
    }

    function tabelaReceita(S, vis) {
      var linhas = S.meses.map(function (m, i) {
        var c = crescMes(S, i, vis), r = ritmoMes(m, vis), t = totalMes(m, vis), pend = pendentesMes(m, vis);
        var obs = [];
        if (m.parcial) obs.push("parcial até " + m.ate);
        if (r) obs.push("ritmo " + moeda(r, 0));
        if (pend.length) obs.push(pend.map(function (p) { return p.nome; }).join(", ") + " pendente");
        return '<tr' + (estado.aba === m.id ? ' class="peak"' : '') + '><td>' + esc(m.nome) + '</td>' + vis.map(function (p) {
            var v = m.valores[p.id];
            return '<td class="n">' + (!(p.id in m.valores) ? '<span style="color:var(--muted2)">—</span>'
              : v === null ? '<span class="pill no">pendente</span>' : moeda(v, 2)) + '</td>';
          }).join("") + '<td class="n"><b>' + moeda(t, 2) + '</b></td><td class="n">' +
          (c ? '<span class="rc-d ' + (c.pct >= 0 ? "up" : "down") + '">' + esc(deltaTxt(c)) + '</span>' : '<span style="color:var(--muted2)">—</span>') +
          '</td><td style="white-space:normal;color:var(--muted);font-size:12px">' + esc(obs.join(" · ")) + '</td></tr>';
      }).join("");
      var somaP = vis.map(function (p) {
        return S.meses.reduce(function (a, m) { return a + (m.valores[p.id] || 0); }, 0);
      });
      return '<div class="tw"><table class="cat"><thead><tr><th>Mês</th>' + vis.map(function (p) {
          return '<th class="n"><i class="rc-sw" style="background:' + esc(corRec(p)) + '"></i>' + esc(p.nome) + '</th>';
        }).join("") + '<th class="n">Total</th><th class="n">vs mês anterior</th><th>Observação</th></tr></thead><tbody>' + linhas +
        '</tbody><tfoot><tr><td>Período</td>' + somaP.map(function (v) { return '<td class="n">' + moeda(v, 2) + '</td>'; }).join("") +
        '<td class="n">' + moeda(somaP.reduce(function (a, b) { return a + b; }, 0), 2) + '</td><td></td><td></td></tr></tfoot></table></div>';
    }

    function ligarReceita() {
      root.querySelectorAll("#seg-rec button").forEach(function (b) {
        b.addEventListener("click", function () {
          rec.modo = b.getAttribute("data-r");
          guardar("rec-modo", rec.modo);
          root.querySelectorAll("#seg-rec button").forEach(function (x) { x.classList.toggle("on", x === b); });
          pintarReceita();
        });
      });
      pintarReceita();
    }

    // =================================================================
    // WHATSAPP OFICIAL (Meta) — ao vivo pelo Worker superadds-painel
    // =================================================================
    // O Worker guarda o token da Meta; o painel so le o JSON agregado (sem telefone de
    // cliente). Enquanto ele nao responde, vale a copia que veio no hub.json.
    var WA = { vivo: null, quando: 0, erro: null, timer: null, todos: false, carregando: false,
               periodo: ler("wa-periodo") || "30" };
    var WA_PERIODOS = [["hoje", "Hoje"], ["7", "7 dias"], ["30", "30 dias"], ["89", "90 dias"]];
    var WA_REFRESCO = 180000;
    var RX_T_PADRAO = /^[a-z0-9]+(_[a-z0-9]+)+$/, RX_T_TESTE = /(^|_)(teste|test|sample|hello_world)(_|$)/i;
    var WA_STATUS = { APPROVED: "aprovado", PENDING: "em análise", REJECTED: "rejeitado", PAUSED: "pausado",
                      DISABLED: "desativado", IN_APPEAL: "em recurso", PENDING_DELETION: "excluído",
                      LIMIT_EXCEEDED: "limite excedido", ARCHIVED: "arquivado" };
    var WA_QUAL = { GREEN: "Alta", YELLOW: "Média", RED: "Baixa", UNKNOWN: "Sem nota" };
    var WA_CAT = { MARKETING: "marketing", UTILITY: "utilidade", AUTHENTICATION: "autenticação", SERVICE: "serviço" };
    var WA_GRAV = { alta: ["Importante", 0], media: ["Atenção", 1], info: ["Para saber", 2] };

    function waCfg() { return (D && D.hub && D.hub.whatsapp_meta) || null; }
    function waDados() { return WA.vivo || (waCfg() || {}).copia || null; }
    function p2(n) { return (n < 10 ? "0" : "") + n; }
    function isoDe(d) { return d.getFullYear() + "-" + p2(d.getMonth() + 1) + "-" + p2(d.getDate()); }
    function waDesde() {
      var d = new Date();
      if (WA.periodo !== "hoje") d.setDate(d.getDate() - (parseInt(WA.periodo, 10) - 1));
      return isoDe(d);
    }
    function waPeriodoTxt() {
      return WA.periodo === "hoje" ? "hoje" : "últimos " + (WA.periodo === "89" ? "90" : WA.periodo) + " dias";
    }
    function waHora(iso) {
      if (!iso) return "";
      var d = new Date(iso);
      return isNaN(d) ? "" : p2(d.getDate()) + "/" + p2(d.getMonth() + 1) + " " + p2(d.getHours()) + ":" + p2(d.getMinutes());
    }
    // Mesma regra do gerar_hub.py: lista de excecoes do parceiro, depois o prefixo.
    function waDono(nome) {
      var n = String(nome || "").trim().toLowerCase(), mapa = (waCfg() || {}).mapa || [], i, j;
      for (i = 0; i < mapa.length; i++) if ((mapa[i].nomes || []).indexOf(n) >= 0) return [mapa[i].parceiro, "excecao"];
      for (i = 0; i < mapa.length; i++) {
        for (j = 0; j < (mapa[i].prefixos || []).length; j++) {
          if (n.indexOf(mapa[i].prefixos[j]) === 0) return [mapa[i].parceiro, RX_T_PADRAO.test(n) ? "padrao" : "excecao"];
        }
      }
      if (RX_T_TESTE.test(n)) return ["teste", "teste"];
      return [null, "sem_dono"];
    }
    // Envio anterior ao "desde" do parceiro (testes de validacao) conta como teste.
    function waDonoNaData(nome, data) {
      var dono = waDono(nome)[0];
      var r = ((waCfg() || {}).mapa || []).filter(function (m) { return m.parceiro === dono; })[0];
      return r && r.desde && data < r.desde ? "teste" : dono;
    }
    function waCor(pid) {
      var c = ((waCfg() || {}).cores || {})[pid];
      if (!c) return pid === "teste" ? "var(--muted2)" : "var(--track2, var(--muted2))";
      return app.classList.contains("escuro") ? c.escuro : c.claro;
    }
    function waNome(pid) {
      if (pid === "teste") return "Testes";
      if (!pid) return "Sem parceiro";
      var c = ((waCfg() || {}).cores || {})[pid];
      return c ? c.nome : pid;
    }
    function waPrefixo(pid) {
      var r = ((waCfg() || {}).mapa || []).filter(function (m) { return m.parceiro === pid; })[0];
      return r && r.prefixos && r.prefixos[0] ? r.prefixos[0] : "parceiro_";
    }
    function waMoeda(v, c, moedaConta) {
      var m = moedaConta && moedaConta !== "BRL" ? moedaConta + " " : "R$ ";
      return m + nf(v, c === undefined ? 2 : c);
    }

    function waCarregar() {
      var c = waCfg();
      if (!c || !c.url || WA.carregando) return;
      WA.carregando = true;
      fetch(c.url + "?dias=89").then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      }).then(function (j) {
        var mudou = !WA.vivo || WA.vivo.atualizado !== j.atualizado;
        WA.vivo = j; WA.erro = null; WA.quando = Date.now();
        if (mudou) { aplicarVivo(); WA.pendente = true; }
      }).catch(function (e) {
        WA.erro = e.message || "sem resposta";
      }).then(function () {
        WA.carregando = false;
        if (WA.aoCarregar) { var f = WA.aoCarregar; WA.aoCarregar = null; WA.pendente = false; f(); return; }
        if (WA.pendente) { WA.pendente = false; redesenhar(); }
        else { pintarWA(); if (TV.on) tvAtualizar(); }
      });
    }
    function waRelogio() {
      if (WA.timer) return;
      WA.timer = setInterval(function () { if (!document.hidden) waCarregar(); }, WA_REFRESCO);
      document.addEventListener("visibilitychange", function () {
        if (!document.hidden && Date.now() - WA.quando > WA_REFRESCO) waCarregar();
      });
    }

    // Totais do periodo escolhido: por template, por parceiro e por dia.
    function waAgregar(d, pid, desdeFixo) {
      var desde = desdeFixo || waDesde(), nomes = {}, porT = {}, porP = {}, porDia = {};
      var zero = function () { return { enviadas: 0, entregues: 0, lidas: 0, cliques: 0, custo: 0 }; };
      var soma = function (alvo, x) {
        alvo.enviadas += x.enviadas || 0; alvo.entregues += x.entregues || 0; alvo.lidas += x.lidas || 0;
        alvo.cliques += x.cliques || 0; alvo.custo += x.custo || 0;
      };
      (d.templates || []).forEach(function (t) { nomes[t.id] = t.nome; });
      var tot = zero();
      (d.por_dia_template || []).forEach(function (x) {
        if (x.data < desde) return;
        var nome = nomes[x.template_id] || x.template_id, dono = waDonoNaData(nome, x.data) || "";
        if (pid && dono !== pid) return;
        var t = porT[x.template_id] = porT[x.template_id] || Object.assign({ id: x.template_id, nome: nome, dono: dono }, zero());
        soma(t, x);
        var pp = porP[dono] = porP[dono] || Object.assign({ id: dono, templates: {} }, zero());
        soma(pp, x); pp.templates[nome] = 1;
        soma(tot, x);
        if (x.estimado) { t.estimado = true; pp.estimado = true; tot.estimado = true; }
        var dd = porDia[x.data] = porDia[x.data] || { data: x.data, por: {}, tpl: {} };
        dd.por[dono] = (dd.por[dono] || 0) + (x.enviadas || 0);
        dd.tpl[nome] = (dd.tpl[nome] || 0) + (x.enviadas || 0);
      });
      var valores = (waCfg() || {}).valores || {};
      Object.keys(porP).forEach(function (k) {
        var v = valores[k], pp = porP[k];
        pp.receita = v && v.valor ? (v.base === "entregues" ? pp.entregues : pp.enviadas) * v.valor : null;
        pp.n_templates = Object.keys(pp.templates).length;
      });
      var g = { custo: 0, volume: 0, pagas: 0 };
      ((d.gastos || {}).por_dia || []).forEach(function (x) {
        if (x.data < desde) return;
        g.custo += x.custo || 0; g.volume += x.volume || 0; g.pagas += x.pagas || 0;
      });
      // Sem metricas de template (ainda nao ligadas), o volume da conta substitui.
      var vol = { enviadas: 0, entregues: 0 };
      ((d.volume || {}).por_dia || []).forEach(function (x) {
        if (x.data < desde) return;
        vol.enviadas += x.enviadas || 0; vol.entregues += x.entregues || 0;
      });
      var falhas = 0;
      (((d.webhook || {}).status_por_dia) || []).forEach(function (x) { if (x.data >= desde) falhas += x.failed || 0; });
      return { desde: desde, porT: porT, porP: porP, porDia: porDia, tot: tot, gasto: g, vol: vol, falhas: falhas };
    }

    // [singular, plural, o que fazer, proporcional?] — proporcional: depende de cada destinatario.
    var WA_ERRO_TXT = {
      131048: ["envio barrado por excesso de bloqueios recentes", "envios barrados por excesso de bloqueios recentes",
        "A Meta não entregou porque, nos últimos envios, algumas pessoas bloquearam ou denunciaram o número. O termômetro é a qualidade do número: se ela segue Alta, foi pontual. Se esse número crescer, reduza o volume e revise a lista.", true],
      131049: ["pessoa não recebeu por excesso de marketing", "pessoas não receberam por excesso de marketing",
        "A Meta segura o marketing de quem já recebeu muitas mensagens de empresas. Não é bloqueio do número; só não reenvie para elas antes de 24h.", true],
      131026: ["número sem WhatsApp ou inválido", "números sem WhatsApp ou inválidos",
        "Tire esses números da lista antes do próximo envio.", true],
      130472: ["número em teste da própria Meta", "números em teste da própria Meta",
        "A Meta não entrega marketing para uma pequena parte das pessoas, num experimento dela. Não é falha nossa; não reenvie.", true],
      131050: ["pessoa pediu para não receber marketing", "pessoas pediram para não receber marketing",
        "Tire da lista e não envie mais para elas.", true],
      131056: ["envio rápido demais para a mesma pessoa", "envios rápidos demais para a mesma pessoa",
        "Espaçar os envios para o mesmo número resolve.", true],
      130429: ["envio acima da velocidade permitida", "envios acima da velocidade permitida",
        "O disparador mandou rápido demais; ele deve esperar e tentar de novo.", true],
      131053: ["mensagem com imagem ou mídia inválida", "mensagens com imagem ou mídia inválida",
        "Confira a arte (JPG, RGB, até 5 MB) e suba de novo pelo curl.", false],
      131042: ["mensagem não enviada por problema de pagamento", "mensagens não enviadas por problema de pagamento",
        "Confira o cartão na conta do WhatsApp (Gerenciador do WhatsApp > Configurações > Pagamentos).", false],
      132015: ["envio com template pausado", "envios com template pausado", "Use o template reserva e revise o texto pausado.", false],
      132016: ["envio com template desativado", "envios com template desativado", "Crie um template novo; o desativado não volta.", false],
      132001: ["envio com template não encontrado", "envios com template não encontrado", "Confira o nome e o idioma exatos do template no disparador.", false],
      132000: ["envio com variáveis erradas no template", "envios com variáveis erradas no template", "Confira as variáveis que o disparador manda.", false],
    };

    // Avisos: do Worker (leitura), do limite, do numero, dos templates, do webhook e da Meta.
    function waAvisos(d, pid) {
      var av = [];
      var add = function (g, t, det, quando) { av.push({ g: g, t: t, det: det || "", quando: quando || "" }); };
      var meus = function (nome) { return !pid || waDono(nome)[0] === pid; };
      (d.erros || []).forEach(function (e) {
        if (e.fonte === "metricas_templates") {
          add("alta", "Métricas por template desligadas na Meta",
            "Sem elas não há enviadas, cliques e custo por template (nem por parceiro). Ligue uma vez: veja o LEIA-ME do Worker. (" + e.mensagem + ")");
        } else if (String(e.codigo) === "190") {
          add("alta", "Token da Meta inválido ou vencido", "Gere um token novo de Usuário do Sistema e troque o segredo WA_TOKEN no Worker.");
        } else {
          add(e.fonte === "configuração" ? "alta" : "media", "Leitura da Meta falhou: " + e.fonte, e.mensagem);
        }
      });
      var lim = d.limite_24h || {};
      if (lim.pct !== null && lim.pct !== undefined) {
        if (lim.pct >= 100) add("info", "Cota do dia usada: " + nf(lim.usados) + " de " + nf(lim.limite) + " pessoas",
          "Normal depois de uma campanha que usa a cota toda. Novos envios de marketing quando a janela de 24h liberar: as vagas voltam 24h depois de cada envio.");
        else if (lim.pct >= 80) add("info", "Cota do dia quase no fim: restam " + nf(lim.restantes) + " pessoas",
          nf(lim.usados) + " de " + nf(lim.limite) + " (" + nf(lim.pct, 0) + "%). A cota é da BM inteira, somando todos os parceiros.");
      }
      var num_ = d.numero || {};
      if (num_.qualidade === "RED" || num_.qualidade === "YELLOW") {
        add(num_.qualidade === "RED" ? "alta" : "media", "Qualidade do número: " + WA_QUAL[num_.qualidade].toLowerCase(),
          "A Meta reduz o limite e pode pausar templates se a qualidade cair. Diminua o volume e revise público e frequência.");
      }
      // Travas de envio: limite de 24h e verificacao ja tem aviso proprio; o resto aparece aqui.
      var outras = [], vistas = {};
      [num_.saude, (d.conta || {}).saude].forEach(function (s) {
        if (!s || !s.envio || s.envio === "AVAILABLE") return;
        (s.travas || []).forEach(function (t) {
          if (t.tipo === "limite" || t.tipo === "verificacao" || vistas[t.codigo]) return;
          vistas[t.codigo] = 1;
          outras.push(t.descricao + (t.solucao ? " — " + t.solucao : ""));
        });
        if (outras.length && !vistas._dito) {
          vistas._dito = 1;
          add(s.envio === "BLOCKED" ? "alta" : "media", "Envio " + (s.envio === "BLOCKED" ? "bloqueado" : "limitado") + " pela Meta", "");
        }
      });
      if (outras.length) av[av.length - 1].det = outras.join(" · ");
      var conta = d.conta || {};
      if (conta.verificacao && conta.verificacao !== "verified" && !pid) {
        add("info", conta.verificacao === "pending" ? "Verificação da empresa em análise na Meta" : "Empresa ainda não verificada na Meta",
          "Sem verificação o limite fica em 250 pessoas por 24h; verificada, sobe para 2.000.");
      }
      (d.templates || []).forEach(function (t) {
        if (!meus(t.nome)) return;
        var dono = waDono(t.nome), st = String(t.status || "").toUpperCase(), nomeT = "“" + t.nome + "”";
        if (["REJECTED", "PAUSED", "DISABLED"].indexOf(st) >= 0) {
          add("alta", "Template " + nomeT + " " + (WA_STATUS[st] || st.toLowerCase()), t.motivo ? "Motivo: " + t.motivo : "Use o template reserva enquanto isso.");
        } else if (st === "PENDING" || st === "IN_APPEAL") {
          add("info", "Template " + nomeT + " " + WA_STATUS[st], "Ainda não pode ser enviado.");
        }
        if (t.qualidade === "RED" || t.qualidade === "YELLOW") {
          add(t.qualidade === "RED" ? "alta" : "media", "Qualidade do template " + nomeT + ": " + WA_QUAL[t.qualidade].toLowerCase(),
            "Muitas pessoas bloquearam ou denunciaram. Pause, revise o texto e o público.");
        }
        if (dono[1] === "excecao") {
          add("info", "Template " + nomeT + " fora do padrão de nome",
            "Atribuído a " + waNome(dono[0]) + " pela lista de exceções. O nome de um template não muda: no próximo, crie com o prefixo " + waPrefixo(dono[0]) + ".");
        } else if (dono[1] === "sem_dono" && !pid) {
          add("media", "Template " + nomeT + " sem parceiro",
            "Os envios dele não entram em nenhum CRM. Recrie com o prefixo do parceiro ou inclua o nome na lista 'templates' do parceiro.json.");
        }
        if (t.categoria === "MARKETING" && !t.opt_out && st === "APPROVED") {
          add("media", "Template " + nomeT + " sem botão de parar de receber",
            "O manual exige a opção de saída nos templates de marketing; inclua no próximo.");
        }
      });
      var est = (d.por_dia_template || []).filter(function (x) {
        return x.estimado && (!pid || waDonoNaData((d.templates || []).filter(function (t) { return t.id === x.template_id; }).map(function (t) { return t.nome; })[0], x.data) === pid);
      });
      if (est.length) {
        add("info", "Parte dos envios é estimada pelo custo",
          "Envios feitos antes de ligar as métricas por template (" + est.map(function (x) { return x.data.slice(8) + "/" + x.data.slice(5, 7); })
            .filter(function (v, i, a) { return a.indexOf(v) === i; }).join(", ") +
          "): a Meta informa só o custo; enviadas e entregues = custo ÷ preço por mensagem do dia. Leituras e cliques desses dias não existem.");
      }
      var wh = d.webhook || {};
      // Erros de entrega em linguagem simples e com a proporcao: 1 em 250 nao e o mesmo
      // que 100 em 250. Os que dependem de cada destinatario ficam mais brandos quando sao
      // pontuais; pagamento, conta, token e template continuam graves com 1 ocorrencia.
      var enviados = ((wh.status_por_dia) || []).reduce(function (a, x) { return a + (x.sent || 0); }, 0);
      (wh.erros || []).forEach(function (e) {
        var tx = WA_ERRO_TXT[e.codigo], n = e.total, share = enviados ? n / enviados * 100 : null;
        var g = e.gravidade || "media";
        if (tx && tx[3] && share !== null) {
          if (e.codigo === 131048) g = share < 1 || n <= 2 ? "info" : share < 5 ? "media" : "alta";
          else g = share < 2 ? "info" : g === "info" ? "info" : "media";
        }
        var titulo = tx ? nf(n) + " " + (n === 1 ? tx[0] : tx[1])
          : nf(n) + (n === 1 ? " mensagem não entregue" : " mensagens não entregues") + (e.titulo ? " (" + e.titulo + ")" : "");
        var det = (share !== null ? nf(share, share < 1 ? 1 : 0) + "% dos " + nf(enviados) + " envios do período. " : "") +
          (tx ? tx[2] : (e.explicacao || "")) + " (código " + e.codigo + (e.h24 ? "; " + nf(e.h24) + " nas últimas 24h" : "") + ")";
        add(g, titulo, det, e.ultima);
      });
      if (wh.pedidos_de_saida) {
        add("info", nf(wh.pedidos_de_saida) + (wh.pedidos_de_saida > 1 ? " pedidos" : " pedido") + " para parar de receber",
          "Respostas como “SAIR” ou “parar” no período: tire esses contatos das próximas listas.");
      }
      (wh.eventos || []).forEach(function (ev) {
        var m = /“([^”]+)”/.exec(ev.titulo || "");
        if (m && !meus(m[1])) return;
        add(ev.gravidade || "info", ev.titulo, ev.detalhe, ev.quando);
      });
      av.sort(function (a, b) {
        return (WA_GRAV[a.g] || WA_GRAV.info)[1] - (WA_GRAV[b.g] || WA_GRAV.info)[1] || (b.quando > a.quando ? 1 : b.quando < a.quando ? -1 : 0);
      });
      return av;
    }

    function waStatusChip() {
      var d = waDados();
      if (WA.vivo) {
        return '<span class="wa-st vivo" data-tip="' + esc("Ao vivo · Meta + webhook\nAtualiza sozinho a cada 3 minutos (o Worker guarda 5 min de cache)") +
          '"><i></i>ao vivo · ' + esc(waHora(WA.vivo.atualizado)) + '</span>';
      }
      if (d) {
        return '<span class="wa-st copia" data-tip="' + esc((WA.erro ? "O Worker não respondeu (" + WA.erro + ")" : "Conectando ao Worker…") +
          "\nMostrando a cópia do último gerar_hub.py") + '"><i></i>' + (WA.carregando ? "conectando… · " : "") + 'cópia de ' + esc(waHora(d.atualizado)) + '</span>';
      }
      return '<span class="wa-st off"><i></i>' + (WA.carregando ? "conectando…" : "aguardando o Worker") + '</span>';
    }

    function blocoWA(p) {
      if (!waCfg()) return "";
      return '<div class="row"><div class="painel wa" id="wa-vivo" data-parceiro="' + (p ? esc(p.id) : "") + '">' + conteudoWA(p) + '</div></div>';
    }

    function conteudoWA(p) {
      var d = waDados(), pid = p ? p.id : null;
      var cab = '<div class="hrow"><div><h3>' + (p ? "WhatsApp ao vivo · " + esc(p.nome) : "WhatsApp oficial · Meta") + '</h3>' +
        '<div class="cap">' + (p ? "Templates " + esc(waPrefixo(pid)) + "… · números direto da BM e do webhook"
          : "Limite, gastos, templates e alertas direto da BM e do webhook · cada disparo vai para o parceiro pelo nome do template") +
        '</div></div><div class="wa-dir">' + waStatusChip() + '<div class="seg" id="seg-wa">' + WA_PERIODOS.map(function (o) {
          return '<button data-wp="' + o[0] + '"' + (WA.periodo === o[0] ? ' class="on"' : '') + '>' + esc(o[1]) + '</button>';
        }).join("") + '</div></div></div>';
      if (!d) {
        return cab + '<div class="aviso-canal">' + INFO + '<div><b>Falta publicar o Worker <code>superadds-painel</code>.</b> ' +
          'Ele busca na Meta o limite, os gastos e os templates, e no webhook os erros e avisos. O passo a passo está em ' +
          '<code>hub/worker_painel/LEIA-ME.md</code>. Depois de publicado, este bloco se atualiza sozinho.</div></div>';
      }
      var ag = waAgregar(d, pid), lim = d.limite_24h || {}, num_ = d.numero || {}, moeda_ = (d.conta || {}).moeda;
      var semMetricas = d.metricas_templates_ativas === false;
      var env = semMetricas && !pid ? ag.vol.enviadas : ag.tot.enviadas;
      var entr = semMetricas && !pid ? ag.vol.entregues : ag.tot.entregues;
      var meter = function (pct) {
        return '<div class="wa-meter' + (pct >= 80 ? " alto" : "") + '"><i style="width:' + Math.min(100, Math.max(0, pct || 0)).toFixed(1) + '%"></i></div>';
      };
      var tLim = kpi("wp", "Limite de 24h", lim.limite ? nf(lim.usados) + " / " + nf(lim.limite) : lim.ilimitado ? "sem teto" : "—",
        lim.limite ? "pessoas únicas · restam " + nf(lim.restantes) + (p ? " · dividido entre os parceiros" : " · faixa " + (lim.faixa || "")) : "faixa da BM ainda não lida",
        true, lim.pct >= 80 ? (lim.pct >= 100 ? "cota do dia usada" : nf(lim.pct, 0) + "% usado") : null, !lim.limite, lim.limite ? meter(lim.pct) : "");
      var tiles;
      if (p) {
        var pp = ag.porP[pid] || { enviadas: 0, entregues: 0, lidas: 0, cliques: 0, custo: 0, receita: 0 };
        var rec = pp.receita || 0, custoP = pp.custo || 0;
        tiles = [tLim,
          kpi("res", "Receita (" + waPeriodoTxt() + ")", moeda(rec, 2), (p.valor_por_disparo ? moeda(p.valor_por_disparo, 2) + " × " : "") + nf(p.receita_base === "entregues" ? pp.entregues : pp.enviadas) + " " + (p.receita_base === "entregues" ? "entregues" : "disparos"), true),
          kpi("wp", "Custo na Meta", waMoeda(custoP, 2, moeda_), pp.entregues ? waMoeda(custoP / pp.entregues, 2, moeda_) + " por mensagem entregue" : "cobrado por mensagem entregue", false),
          kpi("res", "Margem", moeda(rec - custoP, 2), rec ? nf((rec - custoP) / rec * 100, 1) + "% da receita" : "receita − custo na Meta", true),
          kpi("wp", "Mensagens", nf(pp.enviadas), "entregues " + nf(pp.enviadas ? pp.entregues / pp.enviadas * 100 : 0, 1) + "% · cliques " + nf(pp.cliques), false)];
      } else {
        var cobradas = ag.gasto.pagas || ag.gasto.volume;
        tiles = [tLim,
          kpi("wp", "Gasto na Meta", waMoeda(ag.gasto.custo, 2, moeda_), waPeriodoTxt() + " · " + nf(ag.gasto.volume) + " mensagens", true, null, !d.gastos),
          kpi("wp", "Custo médio", cobradas ? waMoeda(ag.gasto.custo / cobradas, 3, moeda_) : "—", "gasto ÷ mensagens cobradas (entregues)", false, null, !cobradas),
          kpi("wp", "Mensagens", (ag.tot.estimado ? "≈ " : "") + nf(env), "entregues " + nf(env ? entr / env * 100 : 0, 1) + "%" +
            (semMetricas ? "" : ag.tot.estimado && !ag.tot.lidas && !ag.tot.cliques ? " · leituras e cliques só nos envios feitos depois de ligar as métricas"
              : " · lidas " + nf(entr ? ag.tot.lidas / entr * 100 : 0, 1) + "% · " + nf(ag.tot.cliques) + " cliques"), true),
          kpi("wp", "Qualidade", WA_QUAL[num_.qualidade] || "—", (num_.numero || "") + (num_.vazao ? " · vazão " + String(num_.vazao).toLowerCase() : ""), false,
            num_.qualidade === "RED" || num_.qualidade === "YELLOW" ? "qualidade em queda" : null, !num_.qualidade)];
      }
      var avisos = waAvisos(d, pid), mostra = WA.todos ? avisos : avisos.slice(0, 4);
      var cnt = { alta: 0, media: 0, info: 0 };
      avisos.forEach(function (a) { cnt[a.g] = (cnt[a.g] || 0) + 1; });
      var listaAv = avisos.length ? '<ul class="wa-av">' + mostra.map(function (a) {
          var g = WA_GRAV[a.g] || WA_GRAV.info;
          return '<li class="' + esc(a.g) + '"><span class="ic" aria-hidden="true">' + (a.g === "alta" ? "!" : a.g === "media" ? "▲" : "i") +
            '</span><div><span class="gv">' + esc(g[0]) + '</span><b>' + esc(a.t) + '</b>' + (a.det ? '<span>' + esc(a.det) + '</span>' : '') +
            (a.quando ? '<small>' + esc(waHora(a.quando)) + '</small>' : '') + '</div></li>';
        }).join("") + '</ul>' + (avisos.length > 4 ? '<button class="btn" id="wa-todos" style="margin-top:10px">' +
          (WA.todos ? "Mostrar só os 4 primeiros" : "Ver todos os " + avisos.length + " avisos") + '</button>' : '')
        : '<div class="vazio" style="padding:18px 0">Nenhum aviso: limite, qualidade e templates em dia.</div>';
      var serie = waSeries(ag, pid);
      var legenda = serie.length > 1 ? '<div class="legenda" style="margin:10px 0 0">' + serie.map(function (s) {
        return '<span><i style="background:' + esc(waCor(s.id)) + '"></i>' + esc(s.nome) + '</span>';
      }).join("") + '</div>' : '';
      var corpo = '<div class="kpis wa-k">' + tiles.join("") + '</div>' +
        '<div class="wa-g2"><div class="wa-sub"><h4>Disparos por dia' + (p ? "" : ", por parceiro") + '</h4>' +
        '<div class="cap">Mensagens enviadas pelos templates · ' + waPeriodoTxt() + (semMetricas ? " · ligue as métricas de template para ver por parceiro" : "") + '</div>' +
        legenda + '<div id="wa-graf" class="chart wa-graf"></div></div>' +
        '<div class="wa-sub"><h4>Avisos e alertas</h4><div class="cap">' + (avisos.length
          ? (cnt.alta ? nf(cnt.alta) + (cnt.alta > 1 ? " importantes · " : " importante · ") : "") + nf(cnt.media) + " de atenção · " + nf(cnt.info) + " para saber" : "Meta, webhook e templates") +
        '</div>' + listaAv + '</div></div>';
      if (!p) corpo += waTabelaParceiros(ag);
      corpo += waTabelaTemplates(d, ag, pid);
      return cab + corpo;
    }

    // Series do grafico: parceiros na ordem do hub, depois testes e sem parceiro.
    function waSeries(ag, pid) {
      if (pid) return [{ id: pid, nome: waNome(pid) }];
      var ids = Object.keys(ag.porP), ordem = D.parceiros.map(function (p) { return p.id; }).concat(["teste", ""]);
      return ordem.filter(function (id) { return ids.indexOf(id) >= 0; }).map(function (id) { return { id: id, nome: waNome(id) }; });
    }

    function waTabelaParceiros(ag) {
      var linhas = waSeries(ag, null).map(function (s) {
        var x = ag.porP[s.id], rec = x.receita;
        return '<tr><td><span class="src" style="background:' + esc(waCor(s.id)) + ';margin-right:8px"></span>' + esc(s.nome) + '</td>' +
          '<td class="n">' + nf(x.n_templates) + '</td><td class="n">' + (x.estimado ? '<span class="hr" data-tip="parte estimada pelo custo">≈ </span>' : '') +
          nf(x.enviadas) + '</td><td class="n">' + nf(x.entregues) +
          ' <span class="hr">' + nf(x.enviadas ? x.entregues / x.enviadas * 100 : 0, 0) + '%</span></td><td class="n">' + nf(x.lidas) +
          '</td><td class="n">' + nf(x.cliques) + '</td><td class="n">' + moeda(x.custo, 2) + '</td><td class="n">' +
          (rec === null ? '<span class="hr">—</span>' : moeda(rec, 2)) + '</td><td class="n">' +
          (rec === null ? '<span class="hr">—</span>' : moeda(rec - x.custo, 2)) + '</td></tr>';
      }).join("");
      if (!linhas) return "";
      var t = ag.tot, recT = 0, temRec = false;
      Object.keys(ag.porP).forEach(function (k) { if (ag.porP[k].receita !== null) { recT += ag.porP[k].receita; temRec = true; } });
      return '<div class="wa-sub" style="margin-top:16px"><h4>Por parceiro</h4><div class="cap">Disparos atribuídos pelo nome do template · ' +
        'receita = valor por disparo do parceiro.json · ' + waPeriodoTxt() + '</div><div class="tw"><table class="cat"><thead><tr>' +
        '<th>Parceiro</th><th class="n">Templates</th><th class="n">Enviadas</th><th class="n">Entregues</th><th class="n">Lidas</th>' +
        '<th class="n">Cliques</th><th class="n">Custo Meta</th><th class="n">Receita</th><th class="n">Margem</th></tr></thead><tbody>' + linhas +
        '</tbody><tfoot><tr><td>Total</td><td></td><td class="n">' + nf(t.enviadas) + '</td><td class="n">' + nf(t.entregues) + '</td><td class="n">' +
        nf(t.lidas) + '</td><td class="n">' + nf(t.cliques) + '</td><td class="n">' + moeda(t.custo, 2) + '</td><td class="n">' +
        (temRec ? moeda(recT, 2) : "—") + '</td><td class="n">' + (temRec ? moeda(recT - t.custo, 2) : "—") + '</td></tr></tfoot></table></div></div>';
    }

    function waTabelaTemplates(d, ag, pid) {
      var ts = (d.templates || []).filter(function (t) { return !pid || waDono(t.nome)[0] === pid; });
      if (!ts.length) return '<div class="wa-sub" style="margin-top:16px"><h4>Templates</h4><div class="vazio" style="padding:14px 0">Nenhum template ' +
        (pid ? "com o prefixo " + esc(waPrefixo(pid)) + " ou na lista do parceiro.json." : "na conta.") + '</div></div>';
      var SIT = { padrao: ["ok", "no padrão"], excecao: ["aviso", "exceção"], teste: ["neutro", "teste"], sem_dono: ["erro", "sem parceiro"] };
      var linhas = ts.map(function (t) {
        var dono = waDono(t.nome), x = ag.porT[t.id] || { enviadas: 0, entregues: 0, cliques: 0, custo: 0 }, sit = SIT[dono[1]];
        var st = String(t.status || "").toUpperCase();
        return '<tr><td class="cn"><span data-tip="' + esc(t.nome + "\n" + (t.resumo || "")) + '"><b>' + esc(t.nome) + '</b></span> ' +
          '<span class="wa-tag ' + sit[0] + '">' + esc(sit[1]) + '</span></td>' +
          (pid ? '' : '<td><span class="src" style="background:' + esc(waCor(dono[0] || "")) + ';margin-right:6px"></span>' + esc(waNome(dono[0])) + '</td>') +
          '<td><span class="wa-tag ' + (st === "APPROVED" ? "ok" : ["REJECTED", "PAUSED", "DISABLED"].indexOf(st) >= 0 ? "erro" : "neutro") + '">' +
          esc(WA_STATUS[st] || st.toLowerCase()) + '</span></td><td>' + esc(WA_CAT[t.categoria] || String(t.categoria || "").toLowerCase()) +
          '</td><td>' + esc(WA_QUAL[t.qualidade] || "—") + '</td><td>' + (t.opt_out ? "sim" : '<span class="hr">não</span>') + '</td>' +
          '<td class="n">' + (x.estimado ? '<span class="hr" data-tip="parte estimada pelo custo">≈ </span>' : '') + nf(x.enviadas) +
          '</td><td class="n">' + nf(x.entregues) + '</td><td class="n">' + nf(x.cliques) +
          '</td><td class="n">' + moeda(x.custo, 2) + '</td></tr>';
      }).join("");
      return '<div class="wa-sub" style="margin-top:16px"><h4>Templates</h4><div class="cap">Padrão de nome: <code>' +
        esc(pid ? waPrefixo(pid) : "parceiro_") + 'varejo_campanha_v1</code> · o prefixo decide o parceiro · ' + waPeriodoTxt() +
        '</div><div class="tw"><table class="cat"><thead><tr><th>Template</th>' + (pid ? '' : '<th>Parceiro</th>') +
        '<th>Status</th><th>Categoria</th><th>Qualidade</th><th>Botão de saída</th><th class="n">Enviadas</th>' +
        '<th class="n">Entregues</th><th class="n">Cliques</th><th class="n">Custo Meta</th></tr></thead><tbody>' + linhas +
        '</tbody></table></div></div>';
    }

    function desenharWAGrafico(pid) {
      var el = $("wa-graf"), d = waDados();
      if (!el || !d) return;
      var ag = waAgregar(d, pid), serie = waSeries(ag, pid);
      var dias = [], ini = new Date(waDesde() + "T12:00:00"), hoje = isoDe(new Date());
      for (var dt0 = ini; isoDe(dt0) <= hoje; dt0 = new Date(dt0.getTime() + 86400000)) dias.push(isoDe(dt0));
      if (!serie.length || !Object.keys(ag.porDia).length) {
        el.innerHTML = '<div class="vazio" style="padding:30px 0">' + (d.metricas_templates_ativas === false
          ? "As métricas por template ainda não estão ligadas na Meta." : "Nenhum disparo de template " + waPeriodoTxt() + ".") + '</div>';
        return;
      }
      var W = Math.max(300, Math.round(el.clientWidth || 640)), H = 210, pl = 40, pr = 8, pt = 14, pb = 26;
      var iw = W - pl - pr, ih = H - pt - pb, n = dias.length, banda = iw / n;
      var totDia = dias.map(function (iso) {
        var x = ag.porDia[iso];
        return x ? serie.reduce(function (a, s) { return a + (x.por[s.id] || 0); }, 0) : 0;
      });
      var mx = tetoBonito(Math.max.apply(null, totDia) || 1), Y = function (v) { return pt + ih * (1 - v / mx); };
      var larg = Math.min(24, Math.max(2, banda * 0.62)), base = pt + ih, s = "";
      [0, 0.5, 1].forEach(function (f) {
        var y = Y(mx * f);
        s += '<line class="gline" x1="' + pl + '" y1="' + y.toFixed(1) + '" x2="' + (W - pr) + '" y2="' + y.toFixed(1) + '"/>' +
          '<text class="glabel" x="' + (pl - 6) + '" y="' + (y + 3.5).toFixed(1) + '" text-anchor="end">' + esc(curto(mx * f)) + '</text>';
      });
      var passo = Math.max(1, Math.ceil(n / (W < 500 ? 5 : 9)));
      dias.forEach(function (iso, i) {
        var cx = pl + banda * i + banda / 2, x0 = cx - larg / 2, x = ag.porDia[iso], yb = base;
        if (x) {
          var segs = serie.filter(function (sr) { return x.por[sr.id] > 0; });
          segs.forEach(function (sr, k) {
            var h = x.por[sr.id] / mx * ih, topo = k === segs.length - 1, y1 = yb - h;
            s += topo ? barraTopo(x0, y1, larg, yb - y1, "", waCor(sr.id))
              : '<rect x="' + x0.toFixed(1) + '" y="' + (y1 + (h > 3 ? 2 : 0)).toFixed(1) + '" width="' + larg.toFixed(1) + '" height="' +
                Math.max(1, h - (h > 3 ? 2 : 0)).toFixed(1) + '" fill="' + esc(waCor(sr.id)) + '"/>';
            yb = y1;
          });
        }
        var dm = iso.slice(8) + "/" + iso.slice(5, 7);
        if (i === n - 1 || (i % passo === 0 && n - 1 - i > passo / 2)) {
          s += '<text class="xlabel" x="' + cx.toFixed(1) + '" y="' + (H - 8) + '">' + esc(dm) + '</text>';
        }
        var dica = [nf(totDia[i]) + " mensagens enviadas", dm];
        if (x) {
          serie.forEach(function (sr) { if (x.por[sr.id]) dica.push(sr.nome + ": " + nf(x.por[sr.id])); });
          Object.keys(x.tpl).forEach(function (t) { dica.push("· " + t + ": " + nf(x.tpl[t])); });
        } else dica.push("sem disparo de template");
        s += '<rect class="hitzone" x="' + (pl + banda * i).toFixed(1) + '" y="' + pt + '" width="' + banda.toFixed(1) + '" height="' + ih +
          '" data-tip="' + esc(dica.join("\n")) + '"/>';
      });
      el.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" role="img" aria-label="Disparos de WhatsApp por dia">' + s + '</svg>';
    }

    function pintarWA() {
      var el = $("wa-vivo");
      if (!el) return;
      var pid = el.getAttribute("data-parceiro") || null;
      var p = pid ? D.parceiros.filter(function (x) { return x.id === pid; })[0] : null;
      el.innerHTML = conteudoWA(p);
      desenharWAGrafico(pid);
      root.querySelectorAll("#seg-wa button").forEach(function (b) {
        b.addEventListener("click", function () {
          WA.periodo = b.getAttribute("data-wp");
          guardar("wa-periodo", WA.periodo);
          pintarWA();
        });
      });
      var t = $("wa-todos");
      if (t) t.addEventListener("click", function () { WA.todos = !WA.todos; pintarWA(); });
    }

    // =================================================================
    // META SO AO VIVO
    // Parceiro de midia (paga por disparo de WhatsApp): os numeros saem do Worker.
    // O hub.json traz a copia do momento em que o gerar_hub.py rodou; quando o Worker
    // responde, o painel refaz o parceiro e as somas do hub (receita, WhatsApp,
    // grafico de receita e esteira) com os dados ao vivo e a copia sai da tela.
    // Dias mais antigos que a janela do Worker (90 dias) ficam com a copia: ja fecharam.
    // =================================================================
    var D0 = null, PRONTO = false;
    function clone(x) { return JSON.parse(JSON.stringify(x)); }
    function hojeIso() { return isoDe(new Date()); }
    function brData(iso) { return iso.slice(8, 10) + "/" + iso.slice(5, 7) + "/" + iso.slice(0, 4); }
    function r2(v) { return Math.round((v || 0) * 100) / 100; }
    function pctJs(a, b, c) { var f = Math.pow(10, c); return b ? Math.round(a / b * 100 * f) / f : 0; }
    function dowDe(iso) { return DOM_SAB[dataIso(iso).getDay()]; }

    // Disparos do parceiro por dia, somando os templates dele (mesma regra de dono do gerar_hub.py).
    function diasMidiaVivo(p, d) {
      var nomes = {}, por = {};
      (d.templates || []).forEach(function (t) { nomes[t.id] = t.nome; });
      (d.por_dia_template || []).forEach(function (x) {
        var nome = nomes[x.template_id] || x.template_id;
        if (waDonoNaData(nome, x.data) !== p.id) return;
        var r = por[x.data] = por[x.data] || { disparos: 0, entregues: 0, lidas: 0, cliques: 0, custo: 0, templates: {}, estimado: false };
        r.disparos += x.enviadas || 0; r.entregues += x.entregues || 0; r.lidas += x.lidas || 0;
        r.cliques += x.cliques || 0; r.custo += x.custo || 0; r.templates[nome] = 1;
        if (x.estimado) r.estimado = true;
      });
      return por;
    }
    function diaMidia(iso, r, p) {
      r = r || { disparos: 0, entregues: 0, lidas: 0, cliques: 0, custo: 0, templates: {} };
      var base = p.receita_base === "entregues" ? r.entregues : r.disparos;
      var receita = r2(base * (p.valor_por_disparo || 0));
      return { iso: iso, d: ddmm(iso), dow: dowDe(iso), send: "", n_env: 0, wpp: "", n_wpp: 0,
        disparos: r.disparos, entregues: r.entregues, lidas: r.lidas, cliques: r.cliques,
        receita: receita, custo: r2(r.custo), margem: r2(receita - r.custo),
        templates: Object.keys(r.templates).sort(), estimado: !!r.estimado };
    }
    // Mesmas contas do kpis_midia do gerar_hub.py.
    function kpisMidiaJs(dias, antigo) {
      var s = { disparos: 0, entregues: 0, lidas: 0, cliques: 0, receita: 0, custo: 0 }, ativos = [], tpls = {}, est = false;
      dias.forEach(function (d) {
        s.disparos += d.disparos; s.entregues += d.entregues; s.lidas += d.lidas; s.cliques += d.cliques;
        s.receita += d.receita; s.custo += d.custo;
        if (d.disparos) ativos.push(d);
        (d.templates || []).forEach(function (t) { tpls[t] = 1; });
        if (d.estimado) est = true;
      });
      var pico = ativos.reduce(function (m, d) { return !m || d.disparos > m.disparos ? d : m; }, null);
      return Object.assign({}, antigo, {
        fonte: "meta", disparos: s.disparos, entregues: s.entregues, lidas: s.lidas, cliques: s.cliques,
        tx_entrega: pctJs(s.entregues, s.disparos, 1), tx_leitura: pctJs(s.lidas, s.entregues, 1),
        ctr_wpp: pctJs(s.cliques, s.entregues, 2), receita: r2(s.receita), custo_meta: r2(s.custo),
        margem: r2(s.receita - s.custo), margem_pct: s.receita ? pctJs(s.receita - s.custo, s.receita, 1) : null,
        custo_por_entregue: s.entregues ? Math.round(s.custo / s.entregues * 10000) / 10000 : null,
        dias_ativos: ativos.length, media_dia: ativos.length ? Math.round(s.disparos / ativos.length * 10) / 10 : 0,
        pico: pico ? { d: pico.d, iso: pico.iso, v: pico.disparos, dia: pico.dow } : null,
        templates: Object.keys(tpls).sort(), estimado: est,
        receita_supertroco: r2(s.receita), wpp_disparos: s.disparos
      });
    }

    function aplicarVivo() {
      if (!D0) return;
      D = clone(D0);
      var d = WA.vivo;
      if (!d) return;
      var janela = (d.periodo || {}).inicio || "0000-00-00", hoje = hojeIso(), delta = {};
      D.parceiros.forEach(function (p) {
        if (p.modelo !== "midia" || p.sem_dados) return;
        var vivo = diasMidiaVivo(p, d), copia = {};
        (abaDe(p.abas, "geral").dias || []).forEach(function (x) { copia[x.iso] = x; });
        var isos = Object.keys(vivo).concat(Object.keys(copia)).sort();
        if (!isos.length) return;
        var todos = [];
        for (var dia = dataIso(isos[0]); isoDe(dia) <= hoje; dia.setDate(dia.getDate() + 1)) {
          var iso = isoDe(dia), x;
          if (iso < janela && copia[iso]) x = copia[iso];
          else {
            x = diaMidia(iso, vivo[iso], p);
            if (copia[iso]) { x.send = copia[iso].send || ""; x.n_env = copia[iso].n_env || 0; }
          }
          todos.push(x);
        }
        p.abas.forEach(function (a) {
          var antes = a.kpis;
          var dias = a.id === "geral" ? todos : todos.filter(function (x) { return x.iso.slice(0, 7) === a.id; });
          a.dias = dias;
          a.kpis = kpisMidiaJs(dias, antes);
          if (dias.length) {
            a.ini = dias[0].iso; a.fim = dias[dias.length - 1].iso;
            a.periodo = brData(a.ini) + " a " + brData(a.fim);
            if (a.id !== "geral") a.ate = ddmm(a.fim);
          }
          var k = a.kpis, dl = delta[a.id] = delta[a.id] || { rec: 0, disp: 0, entr: 0, cl: 0, receita: 0, custo: 0, p: {} };
          dl.rec += k.receita_supertroco - (antes.receita_supertroco || 0);
          dl.disp += k.disparos - (antes.disparos || 0);
          dl.entr += k.entregues - (antes.entregues || 0);
          dl.cl += k.cliques - (antes.cliques || 0);
          dl.receita += k.receita - (antes.receita || 0);
          dl.custo += k.custo_meta - (antes.custo_meta || 0);
          dl.p[p.id] = k;
        });
      });
      D.hub.abas.forEach(function (a) {
        var dl = delta[a.id], k = a.kpis;
        if (!dl) return;
        k.receita = r2(k.receita + dl.rec);
        (k.receita_por_parceiro || []).forEach(function (x) { if (dl.p[x.id]) x.receita = dl.p[x.id].receita_supertroco; });
        k.midia_disparos = (k.midia_disparos || 0) + dl.disp;
        k.midia_entregues = (k.midia_entregues || 0) + dl.entr;
        k.midia_cliques = (k.midia_cliques || 0) + dl.cl;
        k.midia_receita = r2((k.midia_receita || 0) + dl.receita);
        k.midia_custo = r2((k.midia_custo || 0) + dl.custo);
        k.midia_margem = r2(k.midia_receita - k.midia_custo);
        k.wpp_disparos = (k.wpp_disparos || 0) + dl.disp;
        k.wpp_custo_meta = r2((k.wpp_custo_meta || 0) + dl.custo);
        (a.parceiros || []).forEach(function (r) {
          var pk = dl.p[r.id];
          if (!pk) return;
          Object.assign(r, { disparos: pk.disparos, entregues: pk.entregues, lidas: pk.lidas, cliques: pk.cliques,
            receita: pk.receita, custo_meta: pk.custo_meta, margem: pk.margem, tx_entrega: pk.tx_entrega,
            ctr_wpp: pk.ctr_wpp, receita_supertroco: pk.receita_supertroco });
          if (r.whatsapp) r.whatsapp.disparos = pk.disparos;
        });
      });
      D.hub.kpis = D.hub.abas[0].kpis;
      vivoNaSerie(hoje);
      vivoNaEsteira();
    }

    // Grafico de crescimento da receita: mes a mes, ritmo do mes corrente e dia a dia.
    function vivoNaSerie(hoje) {
      var S = D.hub.receita_serie;
      if (!S) return;
      D.parceiros.forEach(function (p) {
        if (p.modelo !== "midia" || p.sem_dados) return;
        var info = S.parceiros.filter(function (x) { return x.id === p.id; })[0];
        if (!info) return;
        S.meses.forEach(function (m) {
          if (!info.desde || m.id < info.desde) return;
          var a = p.abas.filter(function (x) { return x.id === m.id; })[0];
          if (!a) return;
          var v = a.kpis.receita_supertroco || 0;
          m.valores[p.id] = v;
          m.pendentes = (m.pendentes || []).filter(function (id) { return id !== p.id; });
          m.projecao = m.projecao || {};
          var ultimo = new Date(+m.id.slice(0, 4), +m.id.slice(5, 7), 0).getDate();
          var ate = m.id === hoje.slice(0, 7) ? +hoje.slice(8, 10) : (a.ate ? +a.ate.slice(0, 2) : ultimo);
          if (ate > 0 && ate < ultimo) m.projecao[p.id] = r2(v / ate * ultimo); else delete m.projecao[p.id];
          var t = 0;
          Object.keys(m.valores).forEach(function (id) { t += m.valores[id] || 0; });
          m.total = r2(t);
        });
        var dias = abaDe(p.abas, "geral").dias || [], fimP = dias.length ? dias[dias.length - 1].iso : null;
        if (fimP && S.datas.length && fimP > S.datas[S.datas.length - 1]) {
          var extra = [], dd = dataIso(S.datas[S.datas.length - 1]);
          for (;;) { dd.setDate(dd.getDate() + 1); var iso = isoDe(dd); if (iso > fimP) break; extra.push(iso); }
          S.datas = S.datas.concat(extra);
          Object.keys(S.por_dia).forEach(function (id) { S.por_dia[id] = S.por_dia[id].concat(extra.map(function () { return 0; })); });
        }
        var porIso = {};
        dias.forEach(function (x) { porIso[x.iso] = x.receita || 0; });
        S.por_dia[p.id] = S.datas.map(function (iso) { return porIso[iso] || 0; });
      });
    }

    function vivoNaEsteira() {
      var k = D.hub.abas[0].kpis;
      (D.hub.ticker || []).forEach(function (t) {
        if (t.rot === "Receita Supertroco") t.val = moeda(k.receita);
        else if (t.rot === "WhatsApp" && k.wpp_disparos) t.val = nf(k.wpp_disparos) + " disparos";
        D.parceiros.forEach(function (p) {
          if (p.modelo !== "midia" || p.sem_dados) return;
          var g = abaDe(p.abas, "geral").kpis;
          if (t.rot === p.nome + " · disparos") t.val = nf(g.disparos);
          else if (t.rot === p.nome + " · receita") { t.val = moeda(g.receita, 2); t.tipo = g.receita ? "bom" : "neutro"; }
        });
      });
    }

    // Refaz a tela atual com os dados novos (ao vivo ou hub.json relido no telao).
    function redesenhar() {
      if (!PRONTO) return;
      if (estado.tela === "wpp" || estado.tela === "personas") return;   // areas sem dado ao vivo
      var c = $("conteudo");
      if (estado.tela === "parceiro") {
        var p = parceiroAtual();
        if (p && c) { c.outerHTML = conteudoParceiro(p); ligarParceiro(p); }
      } else if (c) {
        c.outerHTML = conteudoHub();
        ligarHub();
        var tk = root.querySelector(".ticker");
        if (tk) tk.outerHTML = esteira();
      }
      if (TV.on) tvAtualizar();
    }

    // ---------- pagina enxuta: secoes recolhiveis e os 4 numeros principais ----------
    function secAberta(id, padrao) { var v = ler("sec-" + id); return v === null ? !!padrao : v === "1"; }
    function secao(id, titulo, resumo, html, padrao) {
      if (!html) return "";
      return '<details class="sec" data-sec="' + esc(id) + '"' + (secAberta(id, padrao) ? " open" : "") + '>' +
        '<summary><span class="sec-t"><b>' + esc(titulo) + '</b>' + (resumo ? '<small>' + resumo + '</small>' : '') + '</span>' + CHEV +
        '</summary><div class="sec-c">' + html + '</div></details>';
    }
    function ligarSecoes() {
      root.querySelectorAll("details.sec").forEach(function (s) {
        s.addEventListener("toggle", function () {
          guardar("sec-" + s.getAttribute("data-sec"), s.open ? "1" : "0");
          var w = s.querySelector("#wa-vivo");
          if (s.open && w) desenharWAGrafico(w.getAttribute("data-parceiro") || null);
        });
      });
    }
    function kpisEnxutos(cards, p) {
      var mais = ler("kpis-mais") === "1", resto = cards.slice(4);
      return '<div class="kpis k4 enx">' + cards.slice(0, 4).join("") + '</div>' +
        (resto.length ? '<div class="kpis k-mais"' + (mais ? '' : ' hidden') + '>' + resto.join("") + '</div>' +
          '<div class="mais-bar"><button class="btn mini" id="bt-kpis" aria-expanded="' + mais + '">' + CHEV +
          (mais ? "Menos indicadores" : "Mais " + resto.length + " indicadores") + '</button>' + (mais ? legendaFontes(p) : '') + '</div>' : '');
    }
    function resumoWA(pid) {
      var d = waDados();
      if (!d) return "aguardando o Worker da Meta";
      var av = waAvisos(d, pid), alta = 0, media = 0, lim = d.limite_24h || {};
      av.forEach(function (a) { if (a.g === "alta") alta++; else if (a.g === "media") media++; });
      return (WA.vivo ? "ao vivo" : "cópia de " + esc(waHora(d.atualizado))) +
        (lim.limite ? " · limite " + nf(lim.usados) + " de " + nf(lim.limite) : "") +
        (alta ? ' · <span class="alerta-s">' + nf(alta) + (alta > 1 ? " avisos importantes" : " aviso importante") + '</span>'
          : media ? " · " + nf(media) + " de atenção" : " · nenhum aviso importante");
    }
    function resumoCanais(aba) {
      return (aba.email ? nf(aba.email.envios) + " e-mails · abertura " + nf(aba.email.abertura, 1) + "%" : "sem e-mail no período") +
        (!wppNoHub() ? "" : " · " + (aba.whatsapp ? nf(aba.whatsapp.disparos) + " disparos de WhatsApp" : "WhatsApp pronto"));
    }
    function hubEmail(aba) {
      var e = aba.email, k = aba.kpis;
      if (!e) return '<div class="row"><div class="painel"><div class="vazio">Nenhum e-mail no período.</div></div></div>';
      return '<div class="row"><div class="painel"><div class="hrow"><div><h3>E-mail · RD Station</h3>' +
        '<div class="cap">Todos os parceiros · ' + esc(aba.nome) + '</div></div>' +
        '<span class="cm mail">' + MAIL + nf(k.campanhas) + ' campanhas</span></div>' + argolaEmail(e) + '</div></div>' + hubTabelaEmail(aba);
    }

    function hubIA(aba) {
      var ia = aba.ia || {};
      if (!ia.destaque && !ia.comparativo) return "";
      var alertas = [].concat(ia.alertas || []).map(function (x) { return "<li>" + rich(x) + "</li>"; }).join("");
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
      var aba = abaDe(D.hub.abas, estado.aba), k = aba.kpis;
      return '<div class="conteudo" id="conteudo">' + hubNumeros(aba) + hubReceita(aba) +
        '<div class="row">' + hubCards(aba) + '</div><div class="secs">' +
        (wppNoHub() ? secao("hub-wa", "WhatsApp ao vivo", resumoWA(null), blocoWA(null)) : "") +
        secao("hub-email", "E-mail · RD Station", k.campanhas ? nf(k.campanhas) + " campanhas · abertura " + nf(k.abertura, 1) + "% · CTR " + nf(k.ctr, 2) + "%"
          : "sem e-mail no período", hubEmail(aba)) +
        secao("hub-part", "Participação nas vendas", "quanto cada parceria de vendas representa", hubParticipacao(aba)) +
        secao("hub-ia", "Leitura comparativa do agente", "Groq · leitura feita em " + esc(D.atualizado), hubIA(aba)) +
        '</div></div>';
    }

    // O topo do Hub vale tambem para as areas WhatsApp e Personas
    function subHub() {
      var h = D.hub;
      return 'Supertroco · ' + h.parceiros + (h.parceiros === 1 ? ' parceria ativa' : ' parcerias ativas') +
        (wppNoHub() ? ' · e-mail + WhatsApp' : ' · e-mail, WhatsApp e personas');
    }
    function topoHub(chip) {
      return '<div class="topo"><div class="marca"><span class="sig">' + TREVO + '</span>' +
        '<div><h1>Hub de Parceiros</h1><div class="sub">' + esc(subHub()) + '</div></div></div>' +
        '<div class="dir"><span class="chip" id="chip-periodo">' + esc(chip) + '</span>' +
        '<span class="chip live">Atualizado <b style="margin-left:4px">' + esc(D.atualizado) + '</b></span>' +
        botaoTV() + botaoCrono() + botaoBot() + botaoTema() + '</div></div>';
    }
    function ligarTopoHub() {
      ligarTema();
      $("bt-crono").addEventListener("click", function () { abrirCronograma("hub"); });
      $("bt-bot").addEventListener("click", abrirBot);
      $("bt-tv").addEventListener("click", function () { tvAbrir(true); });
    }

    function telaHub() {
      aplicarTema(null);
      var h = D.hub, aba = abaDe(h.abas, estado.aba);
      tela.innerHTML = topoHub(aba.periodo) + navAbas(h.abas, botoesArea(null)) + esteira() + conteudoHub() + rodape();
      ligarHub();
      ligarNav(h.abas, function () {
        var c = $("conteudo");
        if (c) c.outerHTML = conteudoHub();
        ligarHub(true);
      });
      ligarBotoesArea();
      ligarTopoHub();
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
      ligarReceita();
      pintarWA();
      ligarSecoes();
    }

    // =================================================================
    // TELA 2 — CRM DO PARCEIRO
    // =================================================================
    function kpi(src, lbl, val, sub, star, alerta, nd, extra) {
      return '<div class="kpi' + (star ? " star" : "") + '" title="' +
        esc(lbl + ": " + val + " — " + sub + (alerta ? " (" + alerta + ")" : "")) + '">' +
        '<div class="top"><span class="lbl">' + esc(lbl) + '</span>' +
        '<span class="src ' + src + '"></span></div>' +
        '<div class="v' + (nd ? " nd" : "") + '">' + esc(val) + '</div><div class="sub">' + esc(sub) + '</div>' +
        (extra || "") + (alerta ? '<div class="alerta">' + esc(alerta) + '</div>' : '') + '</div>';
    }

    // ---------- remuneracao: comissao sobre vendas x valor por aquisicao ----------
    // A Supertroco ganhava 10% de comissao; desde 01/10/2026 a Sorte Online paga
    // R$ 30 por aquisicao. O hub.json traz o modelo de cada aba ("comissao",
    // "aquisicao" ou "misto", quando a aba cobre os dois) e os periodos.
    var COR_PERIODO = ["var(--brand)", "var(--accent)", "var(--r3)", "var(--r1)"];
    function receitaDe(k) { return k.receita !== undefined ? k.receita : k.comissao; }
    function remunInfo(k) {
      var per = k.periodos_remuneracao || [], ult = per[per.length - 1], pri = per[0];
      if (k.remuneracao === "aquisicao") {
        return { rotulo: "Receita", curto: "receita",
                 sub: (ult ? ult.regra : "valor por aquisição") + " · " + nf(k.aquisicoes) + " aquisições",
                 cac: "Receita por aquisição", cacSub: "receita ÷ aquisições" };
      }
      if (k.remuneracao === "misto") {
        return { rotulo: "Receita Supertroco", curto: "receita",
                 sub: moeda(k.receita_comissao) + " em comissão + " + moeda(k.receita_aquisicao) + " por aquisição",
                 cac: "Receita por aquisição",
                 cacSub: pri && ult ? moeda(pri.por_aquisicao, 2) + " na comissão → " + moeda(ult.por_aquisicao, 2) + " agora"
                                    : "receita ÷ aquisições" };
      }
      return { rotulo: "Comissão", curto: "comissão", sub: "no período", cac: "CAC", cacSub: "comissão ÷ aquisições" };
    }
    function periodoTxt(x) {
      var a = x.ini.slice(0, 5), b = x.fim.slice(0, 5), ano = x.fim.slice(6);
      return a === b ? a + "/" + ano : a + " a " + b + "/" + ano;
    }
    function barraMix(per, total) {
      var t = total || 1;
      return '<div class="mix" role="img" aria-label="' + esc(per.map(function (x) {
          return x.regra + ": " + moeda(x.receita);
        }).join(" · ")) + '">' + per.map(function (x, i) {
          return '<span style="width:' + Math.max(1.5, x.receita / t * 100).toFixed(1) + '%;background:' +
            COR_PERIODO[i % 4] + '" data-tip="' + esc(moeda(x.receita, 2) + " · " + nf(x.receita / t * 100, 0) + "%\n" +
            x.regra + " · " + periodoTxt(x)) + '"></span>';
        }).join("") + '</div>';
    }
    function regraNaData(p, iso) {
      var r = null;
      (p.remuneracao || []).forEach(function (x) { if (x.desde <= iso) r = x; });
      return r;
    }
    function blocoRemuneracao(aba, p) {
      var k = aba.kpis, per = k.periodos_remuneracao || [];
      if (per.length < 2) return "";
      var pri = per[0], ult = per[per.length - 1];
      var fator = pri.por_aquisicao ? ult.por_aquisicao / pri.por_aquisicao : 0;
      var cards = per.map(function (x, i) {
        return (i ? '<div class="rm-seta" aria-hidden="true">' + SETA + '</div>' : '') +
          '<div class="rm-p"><div class="rm-h"><i style="background:' + COR_PERIODO[i % 4] + '"></i>' +
          esc(periodoTxt(x)) + (i === per.length - 1 ? '<span class="st ok">modelo atual</span>' : '') + '</div>' +
          '<div class="rm-regra">' + esc(x.regra) + '</div>' +
          '<div class="rm-v">' + moeda(x.receita, 2) + '</div>' +
          '<div class="rm-s">' + nf(x.aquisicoes) + ' aquisições · <b>' + moeda(x.por_aquisicao, 2) +
          '</b> por aquisição</div></div>';
      }).join("");
      var leitura = fator > 1.05
        ? "No modelo atual cada aquisição rende <b>" + moeda(ult.por_aquisicao, 2) + "</b> — <b>" + nf(fator, 1) +
          "×</b> o que rendia na comissão (" + moeda(pri.por_aquisicao, 2) + "). Agora o que move a receita são as " +
          "<b>aquisições</b>, não o valor das vendas."
        : fator && fator < 0.95
          ? "No modelo atual cada aquisição rende <b>" + moeda(ult.por_aquisicao, 2) + "</b>, menos que na comissão (" +
            moeda(pri.por_aquisicao, 2) + ")."
          : "A receita por aquisição ficou parecida nos dois modelos.";
      return '<div class="row"><div class="painel"><div class="hrow"><div><h3>Remuneração da parceria</h3>' +
        '<div class="cap">O modelo mudou em ' + esc(ult.ini) + ' — a receita da Supertroco soma os períodos</div></div>' +
        '<div class="rm-tot"><span>Receita total</span><b>' + moeda(receitaDe(k), 2) + '</b></div></div>' +
        '<div class="rm">' + cards + '</div>' + barraMix(per, receitaDe(k)) +
        '<div class="mix-leg">' + per.map(function (x, i) {
          return '<span><i style="background:' + COR_PERIODO[i % 4] + '"></i>' + esc(x.regra) + ' · ' +
            nf(x.receita / (receitaDe(k) || 1) * 100, 0) + '%</span>';
        }).join("") + '</div><div class="tagbox" style="margin-top:12px">' + leitura + '</div></div></div>';
    }
    function legendaFontes(p) {
      if (p.modelo === "midia") {
        return '<div class="kleg"><span><i class="src res"></i>receita e margem</span><span><i class="src wp"></i>WhatsApp (Meta)</span></div>';
      }
      return '<div class="kleg"><span><i class="src res"></i>' +
        (p.modelo === "leads" ? "leads do parceiro" : p.modelo === "midia" ? "receita e margem" : "vendas do parceiro") + '</span>' +
        '<span><i class="src rd"></i>e-mail (RD Station)</span><span><i class="src wp"></i>WhatsApp</span></div>';
    }

    // ---------- parceiro de leads com relatorio MENSAL (ex.: Crefaz) ----------
    // O relatorio nao tem dia a dia: o CRM mostra o funil do lead ao contrato e o
    // cruza com o funil do e-mail do mesmo periodo (razao entre totais).
    function kpisFunil(aba, p) {
      var k = aba.kpis, e = aba.email, f = (e && e.funil) || {};
      var semRd = !e, aguarda = "aguardando export da RD";
      var cards = [
        kpi("res", "Leads recebidos", nf(k.leads), nf(k.leads_unicos) + " únicos (" + nf(k.pct_unicos, 1) + "%)", true),
        kpi("res", "Digitados", nf(k.digitados), nf(k.pct_digitado, 1) + "% dos leads únicos", true),
        kpi("res", "Pagos", nf(k.pagos), "adesão de " + nf(k.adesao, 1) + "% dos únicos", true),
        kpi("res", "Volume pago", moeda(k.volume, 2), "receita Supertroco" + (k.ticket_medio ? " · ticket médio " + moeda(k.ticket_medio, 2) : ""), true),
        kpi("res", "Faturamento (" + p.nome + ")", k.faturamento !== null && k.faturamento !== undefined ? moeda(k.faturamento, 2) : "—",
            k.faturamento ? "inclui propostas que fecham no mês seguinte" : "não informado no relatório", true, null, !k.faturamento),
        kpi("rd", "Leads por clique", k.leads_por_clique !== null ? nf(k.leads_por_clique, 1) + "%" : "—",
            semRd ? aguarda : nf(k.leads) + " leads ÷ " + nf(f.cliques) + " cliques", false, null, k.leads_por_clique === null),
        kpi("rd", "Volume por clique", k.volume_por_clique !== null ? moeda(k.volume_por_clique, 2) : "—",
            semRd ? aguarda : "volume pago ÷ cliques no e-mail", false, null, k.volume_por_clique === null),
        kpi("rd", "Abertura média", semRd ? "—" : nf(e.abertura, 1) + "%",
            semRd ? aguarda : nf(e.envios) + (e.envios > 1 ? " campanhas" : " campanha") + " no período", false, null, semRd),
        kpi("rd", "CTR médio", semRd ? "—" : nf(e.ctr, 2) + "%", semRd ? aguarda : "cliques ÷ entregues", false, null, semRd),
        kpi("rd", "Bounce", e && e.bounce_pct !== undefined ? nf(e.bounce_pct, 2) + "%" : "—",
            e ? nfOu(f.bounce) + " e-mails voltaram" : aguarda, false, e && e.bounce_pct > 2 ? "acima de 2% — vale higienizar a base" : null, !e)
      ];
      return kpisEnxutos(cards, p);
    }

    function passoFunil(nome, valor, taxa, texto, fonte) {
      return '<div class="fc-l" data-tip="' + esc(nf(valor) + " · " + nome + (texto ? "\n" + nf(taxa, taxa < 1 ? 2 : 1) + "% " + texto : "")) + '">' +
        '<span class="fc-n"><i class="src ' + fonte + '"></i>' + esc(nome) + '</span>' +
        '<span class="fc-v">' + nf(valor) + '</span>' +
        '<span class="fc-t"><span class="fc-f ' + fonte + '" style="width:' + Math.max(1.5, Math.min(100, taxa)).toFixed(1) + '%"></span></span>' +
        '<span class="fc-p">' + (texto ? '<b>' + nf(taxa, taxa < 1 ? 2 : 1) + '%</b> ' + esc(texto) : 'base do funil') + '</span></div>';
    }

    function blocoFunilCredito(aba, p, semLado) {
      var k = aba.kpis, e = aba.email, f = (e && e.funil) || {}, ref = k.referencia;
      var passos = (e ? '<div class="fc-sec"><i class="src rd"></i>E-mail · RD Station</div>' +
          passoFunil("Entregues", f.entregues, 100, "", "rd") +
          passoFunil("Aberturas únicas", f.aberturas, f.entregues ? f.aberturas / f.entregues * 100 : 0, "das entregas", "rd") +
          passoFunil("Cliques únicos", f.cliques, f.aberturas ? f.cliques / f.aberturas * 100 : 0, "das aberturas", "rd")
        : '<div class="aviso-inline">Sem e-mails da RD neste período: o funil começa nos leads.</div>') +
        '<div class="fc-sec"><i class="src res"></i>Relatório da ' + esc(p.nome) + '</div>' +
        passoFunil("Leads recebidos", k.leads, e && f.cliques ? k.leads / f.cliques * 100 : 100, e && f.cliques ? "dos cliques*" : "", "res") +
        passoFunil("Leads únicos", k.leads_unicos, k.pct_unicos, "dos recebidos", "res") +
        passoFunil("Digitados", k.digitados, k.pct_digitado, "dos únicos", "res") +
        passoFunil("Pagos", k.pagos, k.pct_pago_digitado, "dos digitados", "res");
      var fim = '<div class="fc-fim"><div class="rm-p"><div class="rm-h">Volume pago</div><div class="rm-v">' + moeda(k.volume, 2) +
        '</div><div class="rm-s">receita da Supertroco' + (k.ticket_medio ? ' · ticket médio <b>' + moeda(k.ticket_medio, 2) + '</b>' : '') + '</div></div>' +
        (k.faturamento ? '<div class="rm-p"><div class="rm-h">Faturamento (critério ' + esc(p.nome) + ')</div><div class="rm-v">' + moeda(k.faturamento, 2) +
          '</div><div class="rm-s">inclui propostas que fecham no mês seguinte</div></div>' : '') +
        (e && k.volume_por_clique ? '<div class="rm-p"><div class="rm-h">Cada clique no e-mail</div><div class="rm-v">' +
          moeda(k.volume_por_clique, 2) + '</div><div class="rm-s">em volume pago · ' + moeda(k.volume_por_mil, 2) +
          ' a cada mil entregues</div></div>' : '') + '</div>';
      var txt = (aba.ia && aba.ia.motor) ? '<div class="tagbox" style="margin-top:12px">' + rich(aba.ia.motor) + '</div>' : '';
      var esquerda = '<div class="painel"><div class="hrow"><div><h3>Do e-mail ao contrato</h3>' +
        '<div class="cap">Funil do período · a barra mostra quanto passou da etapa anterior</div></div></div>' +
        '<div class="fc">' + passos + '</div>' + fim + txt +
        (e ? '<div class="ar-nota" style="margin-top:10px">* razão entre os totais do período: o relatório não informa a origem de cada lead.</div>' : '') +
        '</div>';
      return semLado ? '<div class="row">' + esquerda + '</div>' : '<div class="row r-72-28">' + esquerda + blocoReferencia(aba, p) + '</div>';
    }

    function blocoReferencia(aba, p) {
      var k = aba.kpis, ref = k.referencia, obs = (p.relatorio || {}).observacao;
      var linhas = "";
      if (ref) {
        var itens = [["Digitação", "digitados ÷ únicos", k.pct_digitado, ref.pct_digitado, "%"],
                     ["Adesão", "pagos ÷ únicos", k.adesao, ref.adesao, "%"],
                     ["Pagos ÷ digitados", "", k.pct_pago_digitado, ref.pct_pago_digitado, "%"],
                     ["Ticket médio", "volume ÷ pagos", k.ticket_medio, ref.ticket_medio, "R$"]];
        linhas = itens.filter(function (x) { return x[2] !== null && x[2] !== undefined && x[3] !== null && x[3] !== undefined; })
          .map(function (x) {
            var mx = Math.max(x[2], x[3]) || 1;
            var fmt = function (v) { return x[4] === "R$" ? moeda(v, 0) : nf(v, 1) + "%"; };
            return '<div class="vs"><div class="h"><span>' + esc(x[0]) + (x[1] ? ' <span style="color:var(--muted2)">· ' + esc(x[1]) + '</span>' : '') +
              '</span><b>' + fmt(x[2]) + '</b></div>' +
              '<span class="t" data-tip="' + esc(fmt(x[2]) + "\n" + aba.nome) + '"><span class="f eng" style="width:' + Math.max(2, x[2] / mx * 100).toFixed(1) + '%"></span></span>' +
              '<span class="t ref" data-tip="' + esc(fmt(x[3]) + "\nindicadores gerais do relatório") + '"><span class="f" style="width:' +
              Math.max(2, x[3] / mx * 100).toFixed(1) + '%"></span></span>' +
              '<div class="cap" style="margin-top:5px">indicadores gerais: <b style="color:var(--ink)">' + fmt(x[3]) + '</b></div></div>';
          }).join("");
      }
      return '<div class="painel"><h3>Comparação com os indicadores gerais</h3>' +
        '<div class="cap">' + esc(aba.nome) + ' × bloco “Indicadores Gerais” do relatório da ' + esc(p.nome) +
        ' (o arquivo não informa o período desse bloco)</div>' +
        (linhas ? '<div class="versus" style="margin-top:14px">' + linhas + '</div>'
                : '<div class="vazio">O relatório não trouxe indicadores gerais.</div>') +
        (ref ? '<div class="legenda"><span><i style="background:var(--brand)"></i>' + esc(aba.nome) + '</span>' +
          '<span><i style="background:var(--muted2)"></i>Indicadores gerais · ' + nf(ref.leads) + ' leads, ' + nf(ref.pagos) + ' pagos' +
          (ref.negados !== null && ref.negados !== undefined ? ', ' + nf(ref.negados) + ' negados' : '') + '</span></div>' : '') +
        (obs ? '<div class="tagbox" style="margin-top:12px"><b>Observação da ' + esc(p.nome) + ':</b> ' + esc(obs) + '</div>' : '') +
        '</div>';
    }

    function blocoMensal(aba) {
      var m = aba.mensal || [];
      if (!m.length) return "";
      var c = function (v, fn) { return v === null || v === undefined ? '<span style="color:var(--muted2)">—</span>' : fn(v); };
      return '<div class="row"><div class="painel"><div class="hrow"><div><h3>Cruzamento mensal</h3>' +
        '<div class="cap">O que a RD entregou ao lado do que o parceiro reportou, mês a mês</div></div></div>' +
        '<div class="tw"><table class="cat"><thead><tr><th>Mês</th><th class="n">E-mails</th><th class="n">Entregues</th>' +
        '<th class="n">Bounce</th><th class="n">Aberturas</th><th class="n">Cliques</th><th class="n">Leads</th>' +
        '<th class="n">Leads/clique</th><th class="n">Digitados</th><th class="n">Pagos</th><th class="n">Volume pago</th>' +
        '<th class="n">Faturamento</th></tr></thead><tbody>' + m.map(function (x) {
          return '<tr><td>' + esc(x.nome) + (x.tem_relatorio ? '' : ' <span class="pill no">sem relatório</span>') + '</td>' +
            '<td class="n">' + nf(x.campanhas) + '</td><td class="n">' + nf(x.entregues) + '</td><td class="n">' + nf(x.bounce) +
            '</td><td class="n">' + nf(x.aberturas) + '</td><td class="n">' + nf(x.cliques) + '</td><td class="n">' + c(x.leads, nf) +
            '</td><td class="n">' + c(x.leads_por_clique, function (v) { return nf(v, 1) + "%"; }) + '</td><td class="n">' +
            c(x.digitados, nf) + '</td><td class="n">' + c(x.pagos, nf) + '</td><td class="n">' +
            c(x.volume, function (v) { return moeda(v, 2); }) + '</td><td class="n">' +
            c(x.faturamento, function (v) { return moeda(v, 2); }) + '</td></tr>';
        }).join("") + '</tbody></table></div></div></div>';
    }

    // ---------- parceiro de MIDIA (paga por disparo de WhatsApp; dados da Meta) ----------
    function kpisMidia(aba, p) {
      var k = aba.kpis, base = k.receita_base === "entregues" ? "entregues" : "disparos";
      var nBase = base === "entregues" ? k.entregues : k.disparos;
      var cards = [
        kpi("res", "Receita Supertroco", moeda(k.receita, 2), moeda(k.receita_por_disparo || 0, 2) + " × " + nf(nBase) + " " + base, true),
        kpi("wp", "Disparos", (k.estimado ? "≈ " : "") + nf(k.disparos), k.estimado ? "parte estimada pelo custo (envios antes das métricas)"
            : nf(k.dias_ativos) + (k.dias_ativos === 1 ? " dia" : " dias") + " com disparo · média " + nf(k.media_dia, 0) + "/dia", true),
        kpi("wp", "Cliques", k.estimado && !k.cliques ? "—" : nf(k.cliques),
            k.estimado && !k.cliques ? "a Meta não tem cliques dos envios feitos antes de ligar as métricas" : "CTR de " + nf(k.ctr_wpp, 2) + "% das entregues",
            true, null, k.estimado && !k.cliques),
        kpi("res", "Margem", moeda(k.margem, 2), k.margem_pct !== null && k.margem_pct !== undefined ? nf(k.margem_pct, 1) + "% da receita" : "receita − custo na Meta", true,
            k.margem < 0 ? "custo maior que a receita" : null),
        kpi("wp", "Entregues", nf(k.entregues), nf(k.tx_entrega, 1) + "% dos disparos", false),
        kpi("wp", "Custo na Meta", moeda(k.custo_meta, 2), "cobrado por mensagem entregue", false),
        kpi("wp", "Custo por mensagem", k.custo_por_entregue !== null ? moeda(k.custo_por_entregue, 3) : "—", "custo ÷ entregues", false, null, k.custo_por_entregue === null),
        kpi("wp", "Taxa de leitura", k.estimado && !k.lidas ? "—" : nf(k.tx_leitura, 1) + "%",
            k.estimado && !k.lidas ? "sem dado para os envios antes das métricas" : nf(k.lidas) + " lidas · a Meta guarda leituras por 7 dias",
            false, null, k.estimado && !k.lidas),
        kpi("wp", "Pico de disparos", k.pico ? nf(k.pico.v) : "—", k.pico ? k.pico.d + " · " + k.pico.dia.toLowerCase() : "sem disparos", false),
        kpi("wp", "Templates", nf((k.templates || []).length), (k.templates || []).join(", ") || "nenhum ainda", false)
      ];
      return kpisEnxutos(cards, p);
    }

    function blocoMargem(aba, p) {
      var k = aba.kpis, mx = Math.max(k.receita, k.custo_meta) || 1;
      var linha = function (nome, v, cls, dica) {
        return '<div class="vs" data-tip="' + esc(dica) + '"><div class="h"><span>' + esc(nome) + '</span><b>' + moeda(v, 2) + '</b></div>' +
          '<span class="t"><span class="f ' + cls + '" style="width:' + Math.max(2, Math.abs(v) / mx * 100).toFixed(1) + '%"></span></span></div>';
      };
      var txt = (aba.ia && aba.ia.motor) ? rich(aba.ia.motor)
        : k.disparos ? "Cada disparo rende <b>" + moeda(k.receita_por_disparo || 0, 2) + "</b> e custa em média <b>" +
          moeda(k.disparos ? k.custo_meta / k.disparos : 0, 3) + "</b> na Meta." : "Aguardando os primeiros disparos.";
      return '<div class="painel"><h3>Receita × custo na Meta</h3><div class="cap">' + esc(aba.periodo) +
        ' · a Meta cobra por mensagem entregue</div><div class="versus" style="margin-top:14px">' +
        linha("Receita Supertroco", k.receita, "eng", moeda(k.receita, 2) + "\n" + nf(k.disparos) + " disparos × " + moeda(k.receita_por_disparo || 0, 2)) +
        linha("Custo na Meta", k.custo_meta, "des", moeda(k.custo_meta, 2) + "\n" + nf(k.entregues) + " mensagens entregues") +
        linha("Margem", k.margem, k.margem < 0 ? "des" : "pico", moeda(k.margem, 2) + "\nreceita − custo") +
        '</div><div class="tagbox" style="margin-top:12px">' + txt + '</div></div>';
    }

    function blocoKpis(aba, p) {
      var k = aba.kpis;
      var semRd = !aba.email;
      var camp = aba.email ? aba.email.envios + " campanhas no período" : "aguardando export da RD";
      if (p.modelo === "leads" && k.fonte === "funil") return kpisFunil(aba, p);
      if (p.modelo === "midia") return kpisMidia(aba, p);
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
        return kpisEnxutos(cards, p);
      }
      var parcial = (k.dias_com_sessao !== undefined && k.dias_com_sessao < k.dias_ativos)
        ? "base parcial: " + k.dias_com_sessao + " de " + k.dias_ativos + " dias com sessão"
        : null;
      // Com base parcial o numerador e MENOR que o card "Pedidos" ao lado.
      // "310 dos 476" deixa a relacao explicita.
      var conta = k.pedidos_com_sessao === undefined ? "pedidos ÷ sessões"
        : parcial ? nf(k.pedidos_com_sessao) + " dos " + nf(k.pedidos) + " pedidos ÷ " + nf(k.sessoes) + " sessões"
                  : nf(k.pedidos_com_sessao) + " pedidos ÷ " + nf(k.sessoes) + " sessões";
      var rm = remunInfo(k);
      var semVendas = (k.dias_com_vendas !== undefined && k.dias_com_vendas < k.dias_ativos)
        ? "vendas preenchidas em " + k.dias_com_vendas + " de " + k.dias_ativos + " dias" : null;
      var c2 = [
        kpi("res", "Vendas", moeda(k.vendas), aba.periodo, true, semVendas),
        // Na aba de outubro (R$ 30 por aquisicao) a "Comissão" vira "Receita";
        // na visao geral, "Receita Supertroco" com a composicao dos dois modelos.
        kpi("res", rm.rotulo, moeda(receitaDe(k), k.remuneracao === "comissao" || !k.remuneracao ? 0 : 2), rm.sub, true, null, false,
            k.remuneracao === "misto" ? barraMix(k.periodos_remuneracao || [], receitaDe(k)) : ""),
        kpi("res", "Aquisições", nf(k.aquisicoes), "novos usuários", true),
        kpi("res", rm.cac, moeda(k.cac, 2), rm.cacSub, true),
        kpi("res", "Pedidos", nf(k.pedidos), "no período", true),
        kpi("res", "Ticket médio", moeda(k.tkm, 2), "vendas ÷ pedidos", false),
        kpi("res", "Conversão", nf(k.conversao, 2) + "%", conta, false, parcial),
        kpi("res", "Sessões", nf(k.sessoes), parcial ? "visitas em " + k.dias_com_sessao + " dos " + k.dias_ativos + " dias"
                                                      : "visitas ao site", false, parcial),
        kpi("rd", "Abertura média", k.abertura === null ? "—" : nf(k.abertura, 1) + "%", camp, false, null, k.abertura === null),
        kpi("rd", "CTR médio", k.ctr === null ? "—" : nf(k.ctr, 2) + "%", "cliques ÷ entregues", false, null, k.ctr === null)
      ];
      return kpisEnxutos(c2, p);
    }

    // ---------- resultado x disparos ----------
    function cfgResultado(p) {
      if (p.modelo === "midia") {
        return { chave: "disparos", nome: "Disparos", fmt: function (v) { return nf(v) + " disparos"; }, eixo: curto, tipo: "colunas" };
      }
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
          atual = { id: id, ini: d.d, fim: d.d, valor: 0, pedidos: 0, envios: 0, wpp: 0, isos: [], receita: 0 };
          grupos.push(atual);
        }
        atual.fim = d.d;
        atual.valor += d[chave] || 0;
        atual.pedidos += d.pedidos || 0;
        atual.receita += d.receita || 0;
        atual.isos.push(d.iso);
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
        var marco = null;
        (cfg.marcos || []).forEach(function (m) { if (x.isos.indexOf(m.iso) >= 0) marco = m; });
        var dica = cfg.fmt(x.valor) + "\n" + x.ini + " a " + x.fim +
          (cfg.chave === "vendas" ? " · " + x.pedidos + " pedidos · receita Supertroco " + moeda(x.receita, 2) : "") +
          (cfg.chave === "disparos" ? " · receita " + moeda(x.receita, 2) : "") +
          (marco ? "\nMudança de remuneração em " + marco.txt : "") +
          (x.envios ? "\n" + x.envios + " dia(s) com e-mail" : "") + (x.wpp ? "\n" + x.wpp + " dia(s) com WhatsApp" : "");
        return '<div class="wcol' + (marco ? " marcada" : "") + '" data-tip="' + esc(dica) + '">' +
          (marco ? '<span class="wtag' + (s.indexOf(x) > s.length / 2 ? " dir" : "") + '">' +
            esc(marco.txt.split(" · ").pop()) + '</span>' : '') +
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
        var venda = cfg.chave === "vendas" && d.sem_vendas ? "vendas ainda não preenchidas" : cfg.fmt(d[cfg.chave]);
        return venda + "\n" + d.d + " · " + (d.dow || "") +
          (cfg.chave === "vendas" ? " · " + d.pedidos + " pedidos · " + d.novos + " aquisições" : "") +
          (cfg.chave === "vendas" && d.receita !== undefined
            ? "\nReceita Supertroco: " + moeda(d.receita, 2) + (d.remun === "aquisicao" ? " (por aquisição)" : " (comissão)") : "") +
          (cfg.chave === "disparos" ? "\n" + nf(d.entregues) + " entregues · " + nf(d.lidas) + " lidas · " + nf(d.cliques) + " cliques" +
            "\nReceita " + moeda(d.receita, 2) + " · custo Meta " + moeda(d.custo, 2) + " · margem " + moeda(d.margem, 2) +
            ((d.templates || []).length ? "\n" + d.templates.join(", ") : "") : "") +
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
        // Dia sem venda preenchida interrompe a linha: cair a zero diria "nao vendeu".
        var trechos = [], atual = [];
        dias.forEach(function (d, i) {
          if (d.sem_vendas) { if (atual.length) trechos.push(atual); atual = []; return; }
          atual.push(i);
        });
        if (atual.length) trechos.push(atual);
        trechos.forEach(function (t) {
          var linha = "M" + t.map(function (i) { return X(i).toFixed(1) + "," + Y(dias[i][cfg.chave] || 0).toFixed(1); }).join(" L");
          var area = linha + " L" + X(t[t.length - 1]).toFixed(1) + "," + (pt + ih) + " L" + X(t[0]).toFixed(1) + "," + (pt + ih) + " Z";
          corpo += '<path d="' + area + '" fill="var(--brand)" fill-opacity=".1"/><path class="lpath" d="' + linha + '"/>';
        });
        dias.forEach(function (d, i) {
          if (d.sem_vendas) {
            corpo += '<circle class="pt-vazio" cx="' + X(i).toFixed(1) + '" cy="' + (pt + ih).toFixed(1) + '" r="3"/>';
            return;
          }
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
        // O ultimo rotulo sempre aparece; o regular colado nele sai.
        if (i === n - 1 || (i % passo === 0 && n - 1 - i > passo / 2)) {
          rot += '<text class="xlabel" x="' + X(i).toFixed(1) + '" y="' + (H - 8) + '">' + esc(d.d) + '</text>';
        }
      });
      // Marco da troca de remuneracao (ex.: 01/10 — R$ 30 por aquisicao).
      var marcos = "";
      (cfg.marcos || []).forEach(function (m) {
        var i = -1;
        dias.forEach(function (d, j) { if (d.iso === m.iso) i = j; });
        if (i < 0) return;
        var x = i === 0 ? X(0) : (X(i - 1) + X(i)) / 2;
        var direita = x > pl + iw * 0.7;
        marcos += '<line class="marco" x1="' + x.toFixed(1) + '" y1="' + (pt - 6) + '" x2="' + x.toFixed(1) +
          '" y2="' + (pt + ih) + '"/><text class="marco-t" x="' + (x + (direita ? -6 : 6)).toFixed(1) + '" y="' + (pt + 2) +
          '" text-anchor="' + (direita ? "end" : "start") + '">' + esc(m.txt) + '</text>';
      });
      return '<div class="chart"><svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' +
        esc(cfg.nome) + ' por dia">' + grade + corpo + marcos + zonas + rot + '</svg></div>';
    }

    function pintarGrafico(aba, p) {
      var g = $("grafico");
      if (!g) return;
      var cfg = cfgResultado(p);
      cfg.marcos = [];
      aba.dias.forEach(function (d, i) {
        if (i && d.remun && d.remun !== aba.dias[i - 1].remun) {
          var r = regraNaData(p, d.iso);
          cfg.marcos.push({ iso: d.iso, txt: d.d + " · " + (r ? r.descricao : "novo modelo") });
        }
      });
      var dias = p.modelo === "midia" ? aba.dias.map(function (d) { return Object.assign({}, d, { wpp: null }); }) : aba.dias;
      g.innerHTML = estado.gran === "dia" ? graficoDia(dias, cfg) : graficoSemana(dias, cfg);
    }

    function blocoResultado(aba, p, semLado) {
      if (aba.kpis && aba.kpis.fonte === "funil") return blocoFunilCredito(aba, p, semLado);
      if (!aba.dias.length) {
        if (p.modelo === "midia") {
          return '<div class="row"><div class="painel"><h3>Disparos de WhatsApp</h3><div class="vazio">Nenhum disparo dos templates ' +
            'deste parceiro ainda. Os números chegam da Meta assim que o primeiro template for enviado.</div></div></div>';
        }
        return '<div class="row"><div class="painel"><h3>' + (p.modelo === "leads" ? "Leads" : "Vendas") +
          ' × disparos</h3><div class="vazio">Sem ' + (p.modelo === "leads" ? "leads" : "vendas") +
          ' registrados neste período ainda.</div></div></div>';
      }
      if (!estado.gran) estado.gran = (p.modelo === "leads" || aba.dias.length <= 14) ? "dia" : "semana";
      var cfg = cfgResultado(p);
      var op = [["semana", "Por semana"], ["dia", "Dia a dia"]];
      return '<div class="row' + (semLado ? '' : ' r-72-28') + '"><div class="painel">' +
        '<div class="hrow"><div><h3>' + (p.modelo === "midia" ? "Disparos de WhatsApp por dia" : cfg.nome + ' × disparos') + '</h3>' +
        '<div class="cap">' + (p.modelo === "leads" ? "Leads por dia; dias com disparo marcados acima da coluna"
          : p.modelo === "midia" ? "Mensagens enviadas por dia pelos templates do parceiro (dados da Meta)"
          : "Receita do parceiro; períodos com disparo marcados em destaque") +
        '</div></div><div class="seg" id="seg-gran">' + op.map(function (o) {
          return '<button data-g="' + o[0] + '"' + (estado.gran === o[0] ? ' class="on"' : '') +
            '>' + esc(o[1]) + '</button>';
        }).join("") + '</div></div><div id="grafico"></div>' +
        '<div class="legenda"><span><i style="background:var(--brand)"></i>' + cfg.nome + '</span>' +
        (p.modelo === "midia" ? '' : '<span><i style="background:var(--accent);border-radius:50%"></i>Disparo de e-mail</span>' +
        '<span><i style="background:var(--wpp);border-radius:50%"></i>Disparo de WhatsApp</span>') +
        '<span>' + aba.dias.length + ' dias no período</span></div></div>' +
        (semLado ? '' : p.modelo === "leads" ? blocoPicos(aba) : p.modelo === "midia" ? blocoMargem(aba, p) : blocoMotor(aba)) + '</div>';
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

    // ---------- e-mail: os 4 numeros da RD e o catalogo de campanhas ----------
    function nfOu(x, c) { return x === undefined || x === null ? "—" : nf(x, c); }
    function numerosEmail(e) {
      var f = e.funil || {}, saiu = (f.entregues || 0) + (f.bounce || 0);
      return '<div class="kpis k4">' +
        kpi("rd", "Entregues", nf(f.entregues), nf(e.envios) + " campanhas · " + nf(saiu) + " e-mails saíram", true) +
        kpi("rd", "Bounce (únicos)", nfOu(f.bounce), e.bounce_pct !== undefined ? nf(e.bounce_pct, 2) + "% do que saiu" : "não veio no export",
            false, e.bounce_pct > 2 ? "acima de 2% — vale higienizar a base" : null, f.bounce === undefined) +
        kpi("rd", "Aberturas (únicas)", nf(f.aberturas), nf(e.abertura, 1) + "% das entregas", true) +
        kpi("rd", "Cliques (únicos)", nf(f.cliques), "CTR " + nf(e.ctr, 2) + "% · " +
            nf(f.aberturas ? f.cliques / f.aberturas * 100 : 0, 1) + "% das aberturas", true) + '</div>';
    }
    var catEstado = { col: "iso", dir: -1, todas: false };
    var CAT_COLS = [["iso", "Data", 0], ["nome", "Campanha", 0], ["entregues", "Entregues", 1], ["bounce", "Bounce", 1],
                    ["aberturas", "Aberturas", 1], ["cliques", "Cliques", 1], ["abertura", "Abertura", 1], ["ctr", "CTR", 1]];
    function blocoCatalogo(e) {
      if (!e || !(e.catalogo || []).length) return "";
      return '<div class="painel" style="margin-top:13px"><div class="hrow"><div><h3>Catálogo de campanhas</h3>' +
        '<div class="cap">Cada disparo do período com entregues, bounce, aberturas e cliques únicos · ' +
        'toque no título de uma coluna para ordenar</div></div>' +
        '<span class="cm mail">' + MAIL + nf(e.catalogo.length) + ' campanhas</span></div><div id="cat-email"></div></div>';
    }
    function pintarCatalogo(e) {
      var alvo = $("cat-email");
      if (!alvo || !e || !e.catalogo) return;
      var c = catEstado.col, dir = catEstado.dir;
      var lin = e.catalogo.slice().sort(function (a, b) {
        var x = c === "iso" ? a.iso + a.hora : a[c], y = c === "iso" ? b.iso + b.hora : b[c];
        if (typeof x === "string") { x = x.toLowerCase(); y = String(y).toLowerCase(); }
        return (x > y ? 1 : x < y ? -1 : 0) * dir;
      });
      var lim = catEstado.todas ? lin.length : Math.min(10, lin.length), f = e.funil || {};
      alvo.innerHTML = '<div class="tw"><table class="cat"><thead><tr>' + CAT_COLS.map(function (col) {
          var on = col[0] === c;
          return '<th' + (col[2] ? ' class="n"' : '') + '><button class="ord' + (on ? " on" : "") + '" data-col="' + col[0] +
            '" aria-label="Ordenar por ' + col[1] + '">' + col[1] + (on ? (dir > 0 ? " ↑" : " ↓") : "") + '</button></th>';
        }).join("") + '</tr></thead><tbody>' + lin.slice(0, lim).map(function (x) {
          return '<tr><td>' + esc(x.data.slice(0, 5)) + ' <span class="hr">' + esc(x.hora) + '</span></td>' +
            '<td class="cn"><span title="' + esc(x.assunto) + '">' + esc(x.nome) + '</span> <span class="pill no">' + esc(x.base) + '</span></td>' +
            '<td class="n">' + nf(x.entregues) + '</td><td class="n">' + nf(x.bounce) + '</td><td class="n">' + nf(x.aberturas) +
            '</td><td class="n">' + nf(x.cliques) + '</td><td class="n">' + nf(x.abertura, 1) + '%</td><td class="n">' +
            nf(x.ctr, 2) + '%</td></tr>';
        }).join("") + '</tbody><tfoot><tr><td colspan="2">Total · ' + nf(lin.length) + ' campanhas</td><td class="n">' +
        nf(f.entregues) + '</td><td class="n">' + nfOu(f.bounce) + '</td><td class="n">' + nf(f.aberturas) + '</td><td class="n">' +
        nf(f.cliques) + '</td><td class="n">' + nf(e.abertura, 1) + '%</td><td class="n">' + nf(e.ctr, 2) + '%</td></tr></tfoot></table></div>' +
        (lin.length > 10 ? '<div style="margin-top:10px"><button class="btn" id="cat-todas">' +
          (catEstado.todas ? "Mostrar só as 10 primeiras" : "Ver todas as " + lin.length + " campanhas") + '</button></div>' : "");
      alvo.querySelectorAll("button.ord").forEach(function (b) {
        b.addEventListener("click", function () {
          var col = b.getAttribute("data-col");
          if (col === catEstado.col) catEstado.dir = -catEstado.dir;
          else { catEstado.col = col; catEstado.dir = col === "nome" ? 1 : -1; }
          pintarCatalogo(e);
        });
      });
      var t = alvo.querySelector("#cat-todas");
      if (t) t.addEventListener("click", function () { catEstado.todas = !catEstado.todas; pintarCatalogo(e); });
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
      return numerosEmail(e) +
        '<div class="row r-3">' + cartaoSemana(e) + cartaoHorario(e) + cartaoArgolaEmail(e) + '</div>' +
        blocoCatalogo(e);
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
      var comWpp = wppNoHub();       // sem o canal antigo, so o e-mail (o WhatsApp tem area propria)
      return '<div class="row"><div class="painel"><div class="hrow"><div><h3>' + (comWpp ? 'Canais de disparo' : 'E-mail · RD Station') + '</h3>' +
        '<div class="cap">' + (comWpp ? 'Toque num canal para ver a análise completa dele' : 'Campanhas deste parceiro, pela API da RD Station') +
        '</div></div></div>' +
        '<div class="canais" role="tablist">' + cardMail + (comWpp ? cardWpp : '') + '</div>' +
        '<div class="canal-det" id="canal-det">' + (comWpp && estado.canal === "whatsapp" ? detalheWpp(aba, p) : detalheEmail(aba, p)) +
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

    function blocoCross(semToggle) {
      var janelas = [["3", "3 dias"], ["7", "7 dias"], ["30", "30 dias"],
                     ["tudo", "Tudo"], ["custom", "Personalizado"]];
      var modos = [["tabela", "Tabela"], ["cartoes", "Cartões"], ["grafico", "Gráfico"]];
      if (semToggle) estado.aberto = true;
      return '<div class="row"><div class="painel">' + (semToggle ? '<div class="cap" style="margin:0 0 12px">' +
        'Cada dia de resultado ao lado dos disparos correspondentes</div><div class="cbody" id="cbody">' : '' +
        '<div class="hrow"><div><h3>Cruzamento diário</h3>' +
        '<div class="cap">Cada dia de resultado ao lado dos disparos correspondentes</div></div>' +
        '<button class="btn" id="bt-toggle"><svg viewBox="0 0 24 24"><path d="' +
        (estado.aberto ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6") + '"/></svg>' +
        (estado.aberto ? "Ocultar" : "Mostrar") + '</button></div>' +
        '<div class="cbody" id="cbody"' + (estado.aberto ? "" : " hidden") + '>') +
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

    // Cruzamento diario do parceiro de midia: cada dia ja e de disparo (templates da Meta).
    function crossMidia(dias) {
      var s = dias.reduce(function (a, d) {
        a.disp += d.disparos; a.entr += d.entregues; a.cl += d.cliques; a.rec += d.receita; a.custo += d.custo;
        if (d.disparos) a.dias++;
        return a;
      }, { disp: 0, entr: 0, cl: 0, rec: 0, custo: 0, dias: 0 });
      var mx = Math.max.apply(null, dias.map(function (d) { return d.disparos; })) || 1;
      var resumo = '<div class="resumo"><b>' + dias.length + '</b> dias · disparos <b>' + nf(s.disp) + '</b> em <b>' + s.dias +
        '</b> dia(s) · entregues <b>' + nf(s.entr) + '</b> · cliques <b>' + nf(s.cl) + '</b> · receita <b>' + moeda(s.rec, 2) +
        '</b> · custo Meta <b>' + moeda(s.custo, 2) + '</b> · margem <b>' + moeda(s.rec - s.custo, 2) + '</b></div>';
      var corpo;
      if (estado.modo === "tabela") {
        corpo = '<div class="tw"><table><thead><tr><th>Dia</th><th>Semana</th><th class="n">Disparos</th><th class="n">Entregues</th>' +
          '<th class="n">Lidas</th><th class="n">Cliques</th><th class="n">Receita</th><th class="n">Custo Meta</th>' +
          '<th class="n">Margem</th><th>Templates</th></tr></thead><tbody>' + dias.map(function (d) {
            return '<tr class="' + (d.disparos === mx && mx > 0 ? "peak" : "") + '"><td>' + esc(d.d) + '</td><td>' + esc(d.dow) + '</td>' +
              '<td class="n">' + nf(d.disparos) + '</td><td class="n">' + nf(d.entregues) + '</td><td class="n">' + nf(d.lidas) +
              '</td><td class="n">' + nf(d.cliques) + '</td><td class="n">' + nf(d.receita, 2) + '</td><td class="n">' + nf(d.custo, 2) +
              '</td><td class="n">' + nf(d.margem, 2) + '</td><td>' + ((d.templates || []).length
                ? (d.templates || []).map(function (t) { return '<span class="pill wpp">' + esc(t) + '</span>'; }).join(" ")
                : '<span class="pill no">sem disparo</span>') + '</td></tr>';
          }).join("") + '</tbody></table></div>';
      } else if (estado.modo === "cartoes") {
        corpo = '<div class="cards">' + dias.map(function (d) {
          return '<div class="dcard ' + (d.disparos ? "hit" : "") + '"><div class="d1"><span>' + esc(d.d) + ' · ' + esc(CURTA[d.dow] || "") +
            '</span>' + (d.disparos ? '<span class="dot w"></span>' : '') + '</div><div class="dv">' + nf(d.disparos) + ' disparos</div>' +
            '<div class="d1" style="font-size:10.5px">receita ' + moeda(d.receita, 2) + '</div><div class="d2"><span>' + nf(d.entregues) +
            ' entr.</span><span>' + nf(d.cliques) + ' cliq.</span><span>' + moeda(d.custo, 2) + '</span></div></div>';
        }).join("") + '</div>';
      } else {
        corpo = '<div class="bars">' + dias.map(function (d) {
          return '<div class="brow ' + (d.disparos ? "hit" : "") + '" data-tip="' + esc(nf(d.disparos) + " disparos\n" + d.d + " · receita " +
            moeda(d.receita, 2) + "\n" + nf(d.entregues) + " entregues · " + nf(d.cliques) + " cliques") + '"><div class="bn2">' + esc(d.d) +
            '</div><div class="bt"><div class="bf" style="width:' + Math.max(1, d.disparos / mx * 100).toFixed(1) + '%"></div></div>' +
            '<div class="bv">' + nf(d.disparos) + ' disp.</div></div>';
        }).join("") + '</div>';
      }
      return resumo + corpo;
    }

    function pintarCross(aba, p) {
      var alvo = $("cross");
      if (!alvo) return;
      var dias = diasFiltrados(aba);
      if (!dias.length) {
        alvo.innerHTML = '<div class="vazio">Nenhum dia no período selecionado.</div>';
        return;
      }
      if (p.modelo === "midia") { alvo.innerHTML = crossMidia(dias); return; }
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
          a.v += d.vendas; a.c += (d.receita !== undefined ? d.receita : d.comissao); a.p += d.pedidos; a.n += d.novos;
          a.m[d.remun || "comissao"] = 1; return a;
        }, { v: 0, c: 0, p: 0, n: 0, m: {} });
        // O rotulo segue o que esta na tela: comissao, receita por aquisicao ou os dois.
        var rotRec = s.m.comissao && s.m.aquisicao ? "receita Supertroco" : s.m.aquisicao ? "receita" : "comissão";
        resumo = '<div class="resumo"><b>' + dias.length + '</b> dias · vendas <b>' +
          moeda(s.v) + '</b> · ' + rotRec + ' <b>' + moeda(s.c, 2) + '</b> · pedidos <b>' + nf(s.p) +
          '</b> · aquisições <b>' + nf(s.n) + '</b> · <b>' + disparos + '</b> dia(s) com disparo</div>';
      }
      var colRec = !leads ? (rotRec.charAt(0).toUpperCase() + rotRec.slice(1)) : "";
      var recDia = function (d) { return d.receita !== undefined ? d.receita : d.comissao; };
      var tagRec = function (d) {
        return s && s.m.comissao && s.m.aquisicao
          ? '<span class="pill ' + (d.remun === "aquisicao" ? "wpp" : "no") + '" style="margin-left:6px;padding:1px 7px">' +
            (d.remun === "aquisicao" ? "aquisição" : "comissão") + '</span>' : "";
      };
      var vendaDia = function (d, fmt) {
        return d.sem_vendas ? '<span title="vendas ainda não preenchidas na planilha" style="color:var(--muted2)">&mdash;</span>' : fmt;
      };
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
            '<th class="n">' + esc(colRec) + '</th><th class="n">Pedidos</th><th class="n">Aquisições</th>' +
            '<th class="n">Ticket</th><th class="n">Conversão</th><th>Disparos no dia</th></tr></thead><tbody>' +
            dias.map(function (d) {
              return '<tr class="' + (d.vendas === mx ? "peak" : "") + '"><td>' + esc(d.d) + tagRec(d) + '</td>' +
                '<td class="n">' + vendaDia(d, nf(d.vendas)) + '</td><td class="n">' + nf(recDia(d), 2) + '</td>' +
                '<td class="n">' + vendaDia(d, nf(d.pedidos)) + '</td><td class="n">' + nf(d.novos) + '</td>' +
                '<td class="n">' + vendaDia(d, nf(d.tkm, 2)) + '</td>' +
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
              : '<div class="dv">' + vendaDia(d, moeda(d.vendas)) + '</div>' +
                '<div class="d1" style="font-size:10.5px">' + (d.remun === "aquisicao" ? "receita " : "comissão ") +
                moeda(recDia(d), 2) + '</div>' +
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
      var sust = [].concat(ia.sustenta || []).map(function (x) { return "<li>" + rich(x) + "</li>"; }).join("");
      return '<div class="ia"><div class="hd"><span class="sp">' + ESTRELA + '</span>' +
        '<h3>Análise do agente — ' + esc(p.nome) + ' · ' + esc(aba.nome) + '</h3>' +
        '<span class="mod">Groq · gpt-oss-120b</span></div>' +
        '<p class="t">' + rich(ia.diagnostico || "") + '</p>' +
        (ia.conversao ? '<div class="box b" style="margin-bottom:15px"><b>' +
          (p.modelo === "leads" ? "Abertura, clique e leads:" : p.modelo === "midia" ? "Entrega, leitura e clique:"
            : "Conversão e abertura:") + '</b> ' +
          rich(ia.conversao) + '</div>' : '') +
        '<div class="cols"><div><h4>O que os dados sustentam</h4><ul>' + sust + '</ul></div>' +
        '<div><h4>Recomendação para o próximo ciclo</h4>' +
        '<div class="box a">' + rich(ia.recomendacao || "") + '</div></div></div></div>';
    }

    // ---------- Tracking por produto (modelo "Tracking PortoBank" da planilha do time) ----------
    // Disparos e cliques: Meta ao vivo, pelos templates de cada produto. Janela de horario:
    // MariaDB (lida no gerar_hub.py). Lead, contrato e producao: relatorio diario do parceiro.
    // Taxas: clique = cliques ÷ disparos; lead = leads ÷ cliques; conversao = contratos ÷ leads.
    var MES3 = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
    function trkDia(iso) { return iso.slice(8) + "/" + MES3[+iso.slice(5, 7) - 1]; }
    function trkPct(a, b) { if (!b) return "—"; var v = a / b * 100; return nf(v, v && v < 1 ? 2 : 1) + "%"; }
    function trkProduto(p) {
      var lista = p.tracking.produtos, id = ler("trk-" + p.id);
      return lista.filter(function (x) { return x.id === id; })[0] || lista[0];
    }
    function trkMeta(prod) {
      var d = waDados(), nomes = {}, por = {};
      if (!d) return por;
      (d.templates || []).forEach(function (t) { nomes[t.id] = t.nome; });
      (d.por_dia_template || []).forEach(function (x) {
        var nome = nomes[x.template_id] || x.template_id;
        if (prod.templates.indexOf(nome) < 0) return;
        var m = por[x.data] = por[x.data] || { disparos: 0, cliques: 0, templates: {}, estimado: false };
        m.disparos += x.enviadas || 0; m.cliques += x.cliques || 0; m.templates[nome] = 1;
        if (x.estimado) m.estimado = true;
      });
      return por;
    }
    function trkLinhas(p, prod) {
      var t = p.tracking, meta = trkMeta(prod), hoje = hojeIso(), fim = t.fim && t.fim < hoje ? t.fim : hoje, out = [];
      for (var dia = dataIso(t.inicio); isoDe(dia) <= fim; dia.setDate(dia.getDate() + 1)) {
        var iso = isoDe(dia), r = prod.dias[iso] || {}, m = meta[iso];
        // Sem metrica do template na Meta nesse dia (acontece com o CLT), os disparos vem do
        // banco (envios aceitos pela API) e o clique fica sem dado.
        var banco = !m && r.janela ? r.janela.envios_banco : 0;
        out.push({ iso: iso, dow: dowDe(iso), jan: r.janela || null, disp: m ? m.disparos : banco, cl: m ? m.cliques : null,
          doBanco: !!banco, tpls: m ? Object.keys(m.templates) : (r.janela ? r.janela.templates : []), estimado: !!(m && m.estimado),
          rel: r.acessos_st !== undefined, lead: r.acessos_st || 0, total: r.acessos_total || 0, conv: r.contratos || 0,
          prod: r.producao || 0, parcial: !!r.parcial, incompleto: !!r.incompleto });
      }
      return out;
    }
    function trkTotais(linhas) {
      return linhas.reduce(function (s, x) {
        s.disp += x.disp; s.conv += x.conv; s.prod += x.prod;
        if (x.cl !== null) { s.cl += x.cl; s.dispMeta += x.disp; }       // taxa de clique so onde ha clique medido
        if (x.doBanco) s.doBanco++;
        if (x.rel) { s.lead += x.lead; if (!x.parcial && !x.incompleto) { s.leadOk += x.lead; s.diasOk++; } }
        return s;
      }, { disp: 0, cl: 0, dispMeta: 0, doBanco: 0, lead: 0, conv: 0, prod: 0, leadOk: 0, diasOk: 0 });
    }
    // Soma de todos os produtos (cartao do parceiro no hub)
    function trkResumo(p) {
      return p.tracking.produtos.reduce(function (acc, prod) {
        var s = trkTotais(trkLinhas(p, prod));
        acc.lead += s.lead; acc.conv += s.conv; acc.prod += s.prod; acc.disp += s.disp;
        return acc;
      }, { lead: 0, conv: 0, prod: 0, disp: 0 });
    }
    function blocoTracking(p) {
      var t = p.tracking;
      if (!t || !t.produtos || !t.produtos.length) return "";
      if (!wppNoHub()) return blocoTrackingResultados(p);
      var prod = trkProduto(p), linhas = trkLinhas(p, prod), s = trkTotais(linhas), base = prod.linha_de_base;
      var vazio = '<span class="hr">—</span>';
      var passo = function (src, nome, v, sub) {
        return '<div class="trk-p"><div class="r"><i class="src ' + src + '"></i>' + esc(nome) + '</div><div class="v">' + esc(v) +
          '</div><div class="s">' + esc(sub) + '</div></div>';
      };
      var funil = '<div class="trk-fun">' + passo("wp", "Disparos", nf(s.disp), s.doBanco ? (s.dispMeta ? "Meta ao vivo + MariaDB ◦" : "MariaDB ◦ (sem métrica na Meta)") : "Meta ao vivo") +
        passo("wp", "Cliques", nf(s.cl), "taxa de clique " + trkPct(s.cl, s.dispMeta)) +
        passo("res", "Leads*", nf(s.lead), "acessos SuperTroco no relatório") +
        passo("res", "Contratos", nf(s.conv), "conversão " + trkPct(s.conv, s.lead)) +
        passo("res", "Produção", moeda(s.prod, 2), "relatório da " + p.nome) + '</div>';
      var linhaBase = base ? '<div class="trk-base">Acessos SuperTroco por dia: <b>' + nf(base.acessos_st_dia, 1) + '</b> antes do WhatsApp (' +
        ddmm(base.de) + ' a ' + ddmm(base.ate) + ')' + (s.diasOk ? ' · <b>' + nf(s.leadOk / s.diasOk, 1) + '</b> desde ' + ddmm(t.inicio) +
        ' (dias completos do relatório)' : ' · desde ' + ddmm(t.inicio) + ': ainda sem dia completo no relatório') + '</div>' : '';
      var rows = linhas.map(function (x) {
        var jan = x.jan ? '<span class="jan">' + esc(x.jan.faixas.join(" + ") || "—") + '</span><small>' +
          esc(x.jan.primeiro.replace(":", "h") + " a " + x.jan.ultimo.replace(":", "h")) + '</small>' : vazio;
        var flag = x.parcial ? '<span class="flag" data-tip="O relatório foi gerado no meio deste dia">parcial</span>'
          : x.incompleto ? '<span class="flag" data-tip="' + esc("Acessos totais do dia muito abaixo da média de antes (" + nf(x.total) +
            "): o relatório do parceiro parece incompleto") + '">incompleto?</span>' : '';
        var rel = function (v) { return x.rel ? v : vazio; };
        return '<tr class="' + (x.parcial ? "trk-parc" : "") + '"><td><b>' + esc(trkDia(x.iso)) + '</b><small>' + esc(CURTA[x.dow] || "") + '</small></td>' +
          '<td>' + jan + '</td><td>' + (x.tpls.length ? x.tpls.map(function (n) { return '<span class="pill wpp">' + esc(n) + '</span>'; }).join(" ")
            : '<span class="hr">sem disparo</span>') + '</td>' +
          '<td class="n">' + (x.estimado ? '<span class="hr" data-tip="estimado pelo custo">≈ </span>' : '') +
            (x.doBanco ? '<span class="hr" data-tip="A Meta não trouxe a métrica deste template neste dia: envios aceitos, contados no MariaDB">◦ </span>' : '') +
            nf(x.disp) + '</td>' +
          '<td class="n">' + (x.cl === null ? vazio : nf(x.cl)) + '</td><td class="n">' + (x.cl === null ? vazio : trkPct(x.cl, x.disp)) + '</td>' +
          '<td class="n">' + rel(nf(x.lead) + flag) + '</td><td class="n">' + rel(x.cl === null ? vazio : trkPct(x.lead, x.cl)) + '</td>' +
          '<td class="n">' + rel(nf(x.conv)) + '</td><td class="n">' + rel(trkPct(x.conv, x.lead)) + '</td>' +
          '<td class="n">' + rel(moeda(x.prod, 2)) + '</td></tr>';
      }).join("");
      var ate = (t.porto || {}).atualizado_ate, banco = t.banco || {};
      return '<div class="row" id="trk"><div class="painel trk"><div class="hrow"><div><h3>Tracking · ' + esc(prod.nome) + '</h3>' +
        '<div class="cap">' + brData(t.inicio) + (t.fim ? ' a ' + brData(t.fim) : '') + ' · disparos e cliques da Meta ao vivo · leads e contratos do relatório da ' +
        esc(p.nome) + (ate ? ' (até ' + ddmm(ate) + ')' : ' (ainda sem relatório)') + '</div></div>' +
        (t.produtos.length > 1 ? '<div class="seg" id="seg-trk">' + t.produtos.map(function (x) {
          return '<button data-trk="' + esc(x.id) + '"' + (x.id === prod.id ? ' class="on"' : '') + '>' + esc(x.nome) + '</button>';
        }).join("") + '</div>' : '') + '</div>' + funil + linhaBase +
        '<div class="tw"><table class="cat"><thead><tr><th>Dia</th><th>Janela dos disparos</th><th>Template</th><th class="n">Disparos</th>' +
        '<th class="n">Cliques</th><th class="n">Tx de clique</th><th class="n">Lead*</th><th class="n">Tx de lead</th><th class="n">Conversão</th>' +
        '<th class="n">Tx de conversão</th><th class="n">Produção</th></tr></thead><tbody>' + rows + '</tbody><tfoot><tr><td>Total</td><td></td><td></td>' +
        '<td class="n">' + nf(s.disp) + '</td><td class="n">' + nf(s.cl) + '</td><td class="n">' + trkPct(s.cl, s.dispMeta) + '</td>' +
        '<td class="n">' + nf(s.lead) + '</td><td class="n">' + trkPct(s.lead, s.cl) + '</td><td class="n">' + nf(s.conv) + '</td>' +
        '<td class="n">' + trkPct(s.conv, s.lead) + '</td><td class="n">' + moeda(s.prod, 2) + '</td></tr></tfoot></table></div>' +
        '<div class="trk-nota">* Lead = acessos de origem SuperTroco no relatório da ' + esc(p.nome) + ', somando todos os canais da SuperTroco ' +
        '(não só o WhatsApp). Por isso a taxa de lead (leads ÷ cliques) pode passar de 100%. Para medir só o WhatsApp, a ' + esc(p.nome) +
        ' precisa separar a origem (ex.: UTM no link do template).' + (s.doBanco ? ' ◦ Em ' + nf(s.doBanco) + (s.doBanco > 1 ? ' dias' : ' dia') +
        ' a Meta não trouxe a métrica do template: os disparos vêm do MariaDB e o clique fica sem dado.' : '') +
        ' Janela dos disparos: MariaDB' + (banco.lido_em ? ', lido em ' + esc(banco.lido_em) : '') +
        (banco.ok === false ? ' (cópia: o banco não respondeu no último gerar_hub.py)' : '') + '.</div></div></div>';
    }
    // Sem o canal no hub: os resultados do parceiro (acessos, contratos, producao) dia a dia, com a
    // janela e a contagem dos disparos so como contexto. Leitura, clique e custo: area WhatsApp.
    function blocoTrackingResultados(p) {
      var t = p.tracking, prod = trkProduto(p), linhas = trkLinhas(p, prod), s = trkTotais(linhas), base = prod.linha_de_base;
      var vazio = '<span class="hr">—</span>', ate = (t.porto || {}).atualizado_ate, banco = t.banco || {};
      var passo = function (src, nome, v, sub) {
        return '<div class="trk-p"><div class="r"><i class="src ' + src + '"></i>' + esc(nome) + '</div><div class="v">' + esc(v) +
          '</div><div class="s">' + esc(sub) + '</div></div>';
      };
      var funil = '<div class="trk-fun" style="grid-template-columns:repeat(4,minmax(0,1fr))">' +
        passo("wp", "Disparos", nf(s.disp), "do disparador, no período") +
        passo("res", "Acessos SuperTroco*", nf(s.lead), "no relatório da " + p.nome) +
        passo("res", "Contratos", nf(s.conv), "conversão " + trkPct(s.conv, s.lead)) +
        passo("res", "Produção", moeda(s.prod, 2), "relatório da " + p.nome) + '</div>';
      var linhaBase = base ? '<div class="trk-base">Acessos SuperTroco por dia: <b>' + nf(base.acessos_st_dia, 1) + '</b> antes do WhatsApp (' +
        ddmm(base.de) + ' a ' + ddmm(base.ate) + ')' + (s.diasOk ? ' · <b>' + nf(s.leadOk / s.diasOk, 1) + '</b> desde ' + ddmm(t.inicio) +
        ' (dias completos do relatório)' : ' · desde ' + ddmm(t.inicio) + ': ainda sem dia completo no relatório') + '</div>' : '';
      var rows = linhas.map(function (x) {
        var jan = x.jan ? '<span class="jan">' + esc(x.jan.faixas.join(" + ") || "—") + '</span><small>' +
          esc(x.jan.primeiro.replace(":", "h") + " a " + x.jan.ultimo.replace(":", "h")) + '</small>' : vazio;
        var flag = x.parcial ? '<span class="flag" data-tip="O relatório foi gerado no meio deste dia">parcial</span>'
          : x.incompleto ? '<span class="flag" data-tip="' + esc("Acessos totais do dia muito abaixo da média de antes (" + nf(x.total) +
            "): o relatório do parceiro parece incompleto") + '">incompleto?</span>' : '';
        var rel = function (v) { return x.rel ? v : vazio; };
        return '<tr class="' + (x.parcial ? "trk-parc" : "") + '"><td><b>' + esc(trkDia(x.iso)) + '</b><small>' + esc(CURTA[x.dow] || "") + '</small></td>' +
          '<td>' + jan + '</td><td>' + (x.tpls.length ? x.tpls.map(function (n) { return '<span class="pill">' + esc(n) + '</span>'; }).join(" ")
            : '<span class="hr">sem disparo</span>') + '</td>' +
          '<td class="n">' + (x.disp ? nf(x.disp) : vazio) + '</td>' +
          '<td class="n">' + rel(nf(x.lead) + flag) + '</td><td class="n">' + rel(nf(x.total)) + '</td>' +
          '<td class="n">' + rel(nf(x.conv)) + '</td><td class="n">' + rel(trkPct(x.conv, x.lead)) + '</td>' +
          '<td class="n">' + rel(moeda(x.prod, 2)) + '</td></tr>';
      }).join("");
      return '<div class="row" id="trk"><div class="painel trk"><div class="hrow"><div><h3>Tracking · ' + esc(prod.nome) + '</h3>' +
        '<div class="cap">' + brData(t.inicio) + (t.fim ? ' a ' + brData(t.fim) : '') + ' · acessos, contratos e produção do relatório da ' +
        esc(p.nome) + (ate ? ' (até ' + ddmm(ate) + ')' : ' (ainda sem relatório)') + '</div></div>' +
        (t.produtos.length > 1 ? '<div class="seg" id="seg-trk">' + t.produtos.map(function (x) {
          return '<button data-trk="' + esc(x.id) + '"' + (x.id === prod.id ? ' class="on"' : '') + '>' + esc(x.nome) + '</button>';
        }).join("") + '</div>' : '') + '</div>' + funil + linhaBase +
        '<div class="tw"><table class="cat"><thead><tr><th>Dia</th><th>Janela dos disparos</th><th>Template</th><th class="n">Disparos</th>' +
        '<th class="n">Acessos SuperTroco*</th><th class="n">Acessos totais</th><th class="n">Contratos</th>' +
        '<th class="n">Tx de conversão</th><th class="n">Produção</th></tr></thead><tbody>' + rows + '</tbody><tfoot><tr><td>Total</td><td></td><td></td>' +
        '<td class="n">' + nf(s.disp) + '</td><td class="n">' + nf(s.lead) + '</td><td></td><td class="n">' + nf(s.conv) + '</td>' +
        '<td class="n">' + trkPct(s.conv, s.lead) + '</td><td class="n">' + moeda(s.prod, 2) + '</td></tr></tfoot></table></div>' +
        '<div class="trk-nota">* Acessos de origem SuperTroco no relatório da ' + esc(p.nome) + ', somando todos os canais da SuperTroco ' +
        '(não só o WhatsApp). Para medir só o WhatsApp, a ' + esc(p.nome) + ' precisa separar a origem (ex.: UTM no link do template). ' +
        'Janela e disparos: dados do disparador gravados pela ponte' + (banco.lido_em ? ', de ' + esc(banco.lido_em) : '') + '.</div></div></div>';
    }
    function ligarTracking(p) {
      root.querySelectorAll("#seg-trk button").forEach(function (b) {
        b.addEventListener("click", function () {
          guardar("trk-" + p.id, b.getAttribute("data-trk"));
          var el = $("trk");
          if (el) el.outerHTML = blocoTracking(p);
          ligarTracking(p);
        });
      });
    }
    function ligarEnxuto(p) {
      var b = $("bt-kpis");
      if (b) b.addEventListener("click", function () {
        guardar("kpis-mais", ler("kpis-mais") === "1" ? "0" : "1");
        var c = $("conteudo");
        if (c) { c.outerHTML = conteudoParceiro(p); ligarParceiro(p); }
      });
      ligarTracking(p);
    }

    function conteudoParceiro(p) {
      var aba = abaDe(p.abas, estado.aba);
      // Parceiro so de WhatsApp com Tracking (Porto Bank), sem o canal no hub: so o Tracking.
      if (!wppNoHub() && p.tracking && p.tracking.produtos && p.tracking.produtos.length &&
          (p.sem_dados || p.modelo === "midia")) {
        return '<div class="conteudo" id="conteudo">' + blocoTracking(p) +
          '<div class="bi-nota">Leitura, cliques e custo de cada template ficam na área <b>WhatsApp</b> do hub.</div></div>';
      }
      if (p.sem_dados && p.modelo === "midia") {
        return '<div class="conteudo" id="conteudo"><div class="painel"><div class="vazio"><b>' + esc(p.nome) +
          ' ainda não tem disparos registrados.</b><br>Os números chegam sozinhos da Meta assim que um template ' +
          esc(waPrefixo(p.id)) + '… (ou da lista de exceções do parceiro.json) for enviado e o Worker superadds-painel estiver publicado.' +
          '</div></div>' + blocoWA(p) + '</div>';
      }
      if (p.sem_dados) {
        return '<div class="conteudo" id="conteudo"><div class="painel"><div class="vazio"><b>' + esc(p.nome) +
          ' ainda não tem dados.</b><br>Coloque a planilha de ' + (p.modelo === "leads" ? "leads" : "vendas") +
          ' e o export da RD na pasta <code>parceiros/' + esc(p.id) + '/</code> e rode o gerar_hub.py.</div></div>' +
          blocoCanais(aba, p) + '</div>';
      }
      var funil = aba.kpis && aba.kpis.fonte === "funil";
      var lado = funil ? ["Comparação com os indicadores gerais", "relatório do parceiro", blocoReferencia(aba, p)]
        : p.modelo === "leads" ? ["Onde estão os leads", "maiores dias e dia da semana", blocoPicos(aba)]
        : p.modelo === "midia" ? ["Receita × custo na Meta", "a Meta cobra por mensagem entregue", blocoMargem(aba, p)]
        : ["Motor do resultado", "abertura da base engajada × desengajada", blocoMotor(aba)];
      var secs = (p.modelo === "midia" ? secao("p-wa", "WhatsApp ao vivo", resumoWA(p.id), blocoWA(p))
          : secao("p-canais", "Canais de disparo", esc(resumoCanais(aba)), blocoCanais(aba, p))) +
        secao("p-remun", "Remuneração", "como a receita da Supertroco é calculada", p.modelo === "leads" ? "" : blocoRemuneracao(aba, p)) +
        secao("p-lado", lado[0], esc(lado[1]), lado[2] ? '<div class="row">' + lado[2] + '</div>' : "") +
        (funil ? secao("p-mensal", "Cruzamento mensal", "o que a RD entregou ao lado do relatório", blocoMensal(aba))
          : secao("p-dia", "Dia a dia", "cada dia de resultado ao lado dos disparos", blocoCross(true))) +
        secao("p-ia", "Análise do agente", "Groq · leitura feita em " + esc(D.atualizado), blocoIA(aba, p));
      return '<div class="conteudo" id="conteudo">' + blocoKpis(aba, p) + (p.tracking ? blocoTracking(p) : '') +
        blocoResultado(aba, p, true) + '<div class="secs">' + secs + '</div></div>';
    }

    function telaParceiro() {
      var p = parceiroAtual();
      if (!p) { estado.tela = "hub"; return telaHub(); }
      aplicarTema({ cores: p.cores, cores_escuro: p.cores_escuro, rampa: p.rampa });
      var aba = abaDe(p.abas, estado.aba);
      var rems = p.remuneracao || [], atual = rems[rems.length - 1];
      var sub = esc(p.segmento) + ' · ' + (!wppNoHub() && p.tracking && p.modelo === "midia"
          ? "Tracking: acessos, contratos e produção pelo relatório diário da " + esc(p.nome)
        : p.modelo === "midia"
          ? (p.valor_por_disparo ? moeda(p.valor_por_disparo, 2) + " por disparo de WhatsApp" : "mídia no WhatsApp") + " · dados da Meta (API oficial)"
        : p.modelo === "leads"
          ? (p.fonte_resultado === "funil" ? "leads e contratos pelo relatório mensal do parceiro" : "resultado medido em leads")
        : p.remuneracao_atual
          ? esc(p.remuneracao_atual) + (rems.length > 1 && atual
              ? ' desde ' + esc(ddmm(atual.desde) + "/" + atual.desde.slice(0, 4)) +
                ' <span style="color:var(--muted2)">(antes ' + esc(rems[rems.length - 2].descricao) + ')</span>' : '')
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
        esc(D.atualizado) + '</b></span>' + botaoTV() + botaoCrono() + botaoBot() + botaoTema() + '</div></div>';

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
      $("bt-bot").addEventListener("click", abrirBot);
      $("bt-tv").addEventListener("click", function () { tvAbrir(true); });
    }

    function ligarParceiro(p) {
      var aba = abaDe(p.abas, estado.aba);
      pintarGrafico(aba, p);
      pintarCross(aba, p);
      pintarCatalogo(aba.email);
      ligarArgolas();
      pintarWA();
      ligarSecoes();
      ligarEnxuto(p);

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
            if (c !== "whatsapp") pintarCatalogo(aba.email);
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
    // AREAS WHATSAPP E PERSONAS — inspiradas no Power BI "Personas SuperAdds"
    // WhatsApp: so numeros agregados (disparador, Meta e custos), aberta a todos.
    // Personas: o que vem das pessoas chega CIFRADO no hub.json (AES-GCM; chave derivada da
    // senha com PBKDF2). A senha nao esta neste arquivo nem no hub.json: so quem a digita abre,
    // e os dados abertos ficam so na memoria desta pagina.
    // =================================================================
    var AREA = { wpp: ler("area-wpp") || "disparos", ps: "comportamento", filtro: "base",
                 busca: "", fSit: "", fRot: "", fPer: "", pag: 0 };
    var PS = null;
    var PS_POR_PAGINA = 50;
    var ORDEM_ST = ["Respondeu", "Leu", "Entregue, não leu", "Sem status da Meta", "Não entregue", "Saiu"];
    var ST_COR = { "Respondeu": "var(--st-resp)", "Leu": "var(--st-leu)", "Entregue, não leu": "var(--st-nleu)",
                   "Sem status da Meta": "var(--st-sem)", "Não entregue": "var(--st-nent)", "Saiu": "var(--st-saiu)" };
    function wppNoHub() { return !!(D && D.hub && D.hub.whatsapp_meta); }    // canal antigo (Meta ao vivo)
    function wbi() { return (D && D.hub && D.hub.whatsapp_bi) || null; }
    function pctTxt(v, c) { return v === null || v === undefined ? "—" : nf(v, c === undefined ? 1 : c) + "%"; }
    function minTxt(v) { return v === null || v === undefined ? "—" : nf(v, 0) + " min"; }
    function moedaOu(v, c) { return v === null || v === undefined ? "—" : moeda(v, c); }
    function dataHora(s) {               // "2026-10-23T13:51:00-03:00" ou "2026-10-23 13:51:00"
      if (!s) return "—";
      return s.slice(8, 10) + "/" + s.slice(5, 7) + " às " + s.slice(11, 16);
    }

    // ---------- pecas de desenho (cores pelas variaveis do tema: claro e escuro) ----------
    function numerosGrandes(lista) {     // [rotulo, valor, sub, destaque, sem dado]
      return '<div class="bn">' + lista.map(function (x) {
        return '<div class="c' + (x[3] ? " destaque" : "") + '"><div class="r">' + esc(x[0]) + '</div>' +
          '<div class="v' + (x[4] ? " nd" : "") + '">' + esc(x[1]) + '</div><div class="s">' + esc(x[2] || "") + '</div></div>';
      }).join("") + '</div>';
    }
    function painel(titulo, cap, corpo, extra) {
      return '<div class="painel"><div class="hrow"><div><h3>' + esc(titulo) + '</h3>' +
        (cap ? '<div class="cap">' + cap + '</div>' : '') + '</div>' + (extra || '') + '</div>' + corpo + '</div>';
    }
    function barras(itens, fmt, cor, teto) {     // itens [{r, v, cor, sub}]; teto fixo (ex.: 100 para %)
      if (!itens.length) return '<div class="vazio">Sem dados.</div>';
      var max = teto || Math.max.apply(null, itens.map(function (x) { return x.v || 0; })) || 1;
      return '<div class="part">' + itens.map(function (x) {
        return '<div class="pl" data-tip="' + esc(fmt(x.v) + "\n" + x.r + (x.sub ? " · " + x.sub : "")) + '"><div class="h"><span>' + esc(x.r) +
          '</span><b>' + esc(fmt(x.v)) + (x.sub ? '<small>' + esc(x.sub) + '</small>' : '') + '</b></div>' +
          '<span class="t"><span class="f" style="width:' + Math.max(1.5, (x.v || 0) / max * 100).toFixed(1) + '%;background:' +
          (x.cor || cor || "var(--s1)") + '"></span></span></div>';
      }).join("") + '</div>';
    }
    function rosca(itens, total, rotTotal) {      // itens [{r, v, cor}]
      var soma = itens.reduce(function (s, x) { return s + x.v; }, 0) || 1, a = -Math.PI / 2, svg = "";
      itens.forEach(function (x) {
        var fr = x.v / soma, a1 = fr >= 0.9999 ? a + 2 * Math.PI - 0.0002 : a + fr * 2 * Math.PI;
        var folga = fr >= 0.9999 ? 0 : 0.012;      // 2px de superficie entre as fatias
        if (fr > 0) {
          svg += '<path d="' + arco(90, 90, 84, 54, a + folga, Math.max(a + folga + 0.002, a1 - folga)) + '" fill="' + x.cor +
            '" data-tip="' + esc(nf(x.v) + " · " + nf(fr * 100, 1) + "%\n" + x.r) + '"></path>';
        }
        a = a1;
      });
      return '<div class="bi-rosca"><svg viewBox="0 0 180 180" role="img" aria-label="' + esc(nf(total) + " " + rotTotal) + '">' + svg +
        '<text x="90" y="88" text-anchor="middle" class="bi-rv">' + esc(nf(total)) + '</text>' +
        '<text x="90" y="106" text-anchor="middle" class="bi-rr">' + esc(rotTotal) + '</text></svg>' +
        '<ul class="bi-leg">' + itens.map(function (x) {
          return '<li><i style="background:' + x.cor + '"></i><span>' + esc(x.r) + '</span><b>' + nf(x.v) + '</b><small>' +
            nf(x.v / soma * 100, 1) + '%</small></li>';
        }).join("") + '</ul></div>';
    }
    // Colunas por categoria: empilhadas (partes de um todo) ou lado a lado (comparacao), um eixo so.
    // opts.W = largura aproximada do painel em px, para o texto do eixo sair no tamanho certo.
    function colunas(cats, series, opts) {        // cats [rotulo], series [{nome, cor, v: []}]
      opts = opts || {};
      var W = Math.max(300, Math.min(opts.W || 720, (tela.clientWidth || 1400) - 70));   // no celular, o painel e a tela
      var fmt = opts.fmt || nf, H = 240, mE = 44, mB = 24, mT = 20, n = Math.max(1, cats.length), larg = (W - mE - 6) / n;
      var tot = cats.map(function (c, i) {
        var vs = series.map(function (s) { return s.v[i] || 0; });
        return opts.empilhado ? vs.reduce(function (a, b) { return a + b; }, 0) : Math.max.apply(null, vs);
      });
      var max = Math.max.apply(null, tot.concat([1])) * 1.08;
      var y = function (v) { return mT + (H - mT - mB) * (1 - v / max); }, g = "";
      [0, 0.5, 1].forEach(function (f) {
        var yy = y(max / 1.08 * f).toFixed(1);
        g += '<line x1="' + mE + '" x2="' + W + '" y1="' + yy + '" y2="' + yy + '" class="bi-grade"/>' +
          '<text x="' + (mE - 6) + '" y="' + (+yy + 3) + '" text-anchor="end" class="bi-eixo">' + esc(opts.eixo ? opts.eixo(max / 1.08 * f) : curto(max / 1.08 * f)) + '</text>';
      });
      cats.forEach(function (c, i) {
        var x0 = mE + i * larg + larg * 0.16, w = larg * 0.68;
        if (opts.empilhado) {
          var base = 0;
          series.forEach(function (s) {
            var v = s.v[i] || 0;
            if (!v) return;
            var y1 = y(base + v), y0 = y(base);
            g += '<rect x="' + x0.toFixed(1) + '" y="' + y1.toFixed(1) + '" width="' + w.toFixed(1) + '" height="' +
              Math.max(0.5, y0 - y1 - 2).toFixed(1) + '" fill="' + s.cor + '" data-tip="' + esc(fmt(v) + "\n" + s.nome + " · " + c) + '"/>';
            base += v;
          });
          if (tot[i]) g += '<text x="' + (x0 + w / 2).toFixed(1) + '" y="' + (y(tot[i]) - 6).toFixed(1) + '" text-anchor="middle" class="bi-val">' + esc(fmt(tot[i])) + '</text>';
        } else {
          var wb = w / series.length;
          series.forEach(function (s, j) {
            var v = s.v[i] || 0, yy = y(v);
            g += '<rect x="' + (x0 + j * wb + 1).toFixed(1) + '" y="' + yy.toFixed(1) + '" width="' + Math.max(1, wb - 2).toFixed(1) +
              '" height="' + Math.max(0, H - mB - yy).toFixed(1) + '" rx="3" fill="' + s.cor + '" data-tip="' + esc(fmt(v) + "\n" + s.nome + " · " + c) + '"/>';
          });
        }
        g += '<text x="' + (x0 + w / 2).toFixed(1) + '" y="' + (H - 7) + '" text-anchor="middle" class="bi-eixo">' + esc(c) + '</text>';
      });
      return '<div class="bi-col"><svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(opts.rotulo || "gráfico") + '">' + g + '</svg>' +
        (series.length > 1 ? '<div class="legenda">' + series.map(function (s) {
          return '<span><i style="background:' + s.cor + '"></i>' + esc(s.nome) + '</span>';
        }).join("") + '</div>' : '') + '</div>';
    }
    function tabela(cab, linhas, rodapeLinha, classe) {    // cab [[titulo, numerico]]; celulas ja escapadas
      var td = function (l) {
        return l.map(function (v, i) { return '<td' + (cab[i] && cab[i][1] ? ' class="n"' : '') + '>' + v + '</td>'; }).join("");
      };
      return '<div class="tw"><table class="cat bi-t' + (classe ? " " + classe : "") + '"><thead><tr>' + cab.map(function (c) {
        return '<th' + (c[1] ? ' class="n"' : '') + '>' + esc(c[0]) + '</th>';
      }).join("") + '</tr></thead><tbody>' + linhas.map(function (l) { return '<tr>' + td(l) + '</tr>'; }).join("") + '</tbody>' +
        (rodapeLinha ? '<tfoot><tr>' + td(rodapeLinha) + '</tr></tfoot>' : '') + '</table></div>';
    }

    // ---------- navegacao das areas ----------
    function botoesArea(ativo) {
      return (wbi() ? '<button class="nv' + (ativo === "wpp" ? " on" : "") + '" data-area="wpp">' + WPP + 'WhatsApp</button>' : '') +
        (D.hub.restrito ? '<button class="nv' + (ativo === "personas" ? " on" : "") + '" data-area="personas">' +
          (PS ? ABERTO : CADEADO) + 'Personas</button>' : '');
    }
    function ligarBotoesArea() {
      root.querySelectorAll(".nav [data-area]").forEach(function (b) {
        b.addEventListener("click", function () { abrirArea(b.getAttribute("data-area")); });
      });
    }
    function navArea(ativo) {
      return '<div class="nav"><div class="nav-bts">' +
        '<button class="nv" data-ir="geral">' + GRADE + 'Visão geral</button>' +
        '<button class="nv" data-ir="meses">' + CAL + 'Visão mês a mês' + CHEV + '</button>' +
        botoesArea(ativo) + '</div></div>';
    }
    function ligarNavArea() {
      root.querySelectorAll(".nav [data-ir]").forEach(function (b) {
        b.addEventListener("click", function () {
          estado.tela = "hub"; estado.aba = "geral"; estado.mesesAbertos = b.getAttribute("data-ir") === "meses";
          guardar("tela", "hub");
          trocar(telaHub);
        });
      });
      ligarBotoesArea();
    }
    function abrirArea(id) {
      if (estado.tela === id) return;
      estado.tela = id; estado.parceiro = null;
      guardar("tela", id);
      trocar(id === "wpp" ? telaWpp : telaPersonas);
    }
    function trocarArea(montar, ligar) {
      trocarConteudo(function () { var c = $("conteudo"); if (c) c.outerHTML = montar(); ligar(); });
    }

    // ---------- area WhatsApp ----------
    var WPP_ABAS = [["disparos", "Disparos"], ["meta", "Disparador × Meta"], ["financeiro", "Financeiro"]];
    function telaWpp() {
      aplicarTema(null);
      var w = wbi();
      tela.innerHTML = topoHub(w ? brData(w.periodo.de) + " a " + brData(w.periodo.ate) : "WhatsApp") +
        navArea("wpp") + conteudoWpp() + rodape();
      ligarTopoHub(); ligarNavArea(); ligarWpp();
    }
    function conteudoWpp() {
      var w = wbi();
      if (!w || !w.disparos) {
        return '<div class="conteudo" id="conteudo"><div class="painel"><div class="vazio">A área WhatsApp aparece quando a ponte ' +
          'gravar os dados do estudo no SharePoint e o gerar_hub.py rodar de novo.</div></div></div>';
      }
      if ((AREA.wpp === "meta" || AREA.wpp === "financeiro") && !w.meta) AREA.wpp = "disparos";
      var fonte = AREA.wpp === "disparos" ? "Disparador · dados do estudo de " + dataHora(w.dados_de)
        : "Disparador + Meta (API oficial)" + (w.meta && w.meta.atualizado ? " · Meta de " + dataHora(w.meta.atualizado) : "");
      return '<div class="conteudo" id="conteudo"><div class="bi-cab"><div class="seg" id="seg-wpp" role="tablist">' +
        WPP_ABAS.filter(function (a) { return a[0] === "disparos" || w.meta; }).map(function (a) {
          return '<button role="tab" data-wpp="' + a[0] + '" aria-selected="' + (AREA.wpp === a[0]) + '"' +
            (AREA.wpp === a[0] ? ' class="on"' : '') + '>' + esc(a[1]) + '</button>';
        }).join("") + '</div><span class="bi-fonte">' + esc(fonte) + '</span></div>' +
        (AREA.wpp === "meta" ? wppMeta(w) : AREA.wpp === "financeiro" ? wppFinanceiro(w) : wppDisparos(w)) + '</div>';
    }
    function ligarWpp() {
      root.querySelectorAll("#seg-wpp button").forEach(function (b) {
        b.addEventListener("click", function () {
          if (AREA.wpp === b.getAttribute("data-wpp")) return;
          AREA.wpp = b.getAttribute("data-wpp");
          guardar("area-wpp", AREA.wpp);
          trocarArea(conteudoWpp, ligarWpp);
        });
      });
    }
    function wppDisparos(w) {
      var d = w.disparos, k = d.kpis;
      var nums = numerosGrandes([
        ["Enviadas", nf(k.enviadas), "aceitas pela API do disparador", true],
        ["Entregues", nf(k.entregues), pctTxt(k.taxa_entrega) + " das enviadas", true],
        ["Leram", nf(k.leram), pctTxt(k.taxa_leitura) + " das entregues", true],
        ["Tempo típico até ler", minTxt(k.tipico_min), "metade leu até aqui · média de " + minTxt(k.media_min), true],
        ["Não entregues", nf(k.nao_entregues), "o motivo está no quadro abaixo", false],
        ["Responderam", nf(k.responderam), "respostas registradas no estudo", false, !k.responderam],
        ["Sem status da Meta", nf(k.sem_status), "a Meta ainda não confirmou a entrega", false, !k.sem_status],
        ["Período", ddmm(w.periodo.de) + " a " + ddmm(w.periodo.ate), "dias com envio no estudo", false]]);
      var status = d.por_status.map(function (s) { return { r: s.status, v: s.n, cor: ST_COR[s.status] || "var(--s1)" }; });
      var series = ORDEM_ST.filter(function (s) { return d.por_dia.some(function (x) { return x[s]; }); }).map(function (s) {
        return { nome: s, cor: ST_COR[s], v: d.por_dia.map(function (x) { return x[s] || 0; }) };
      });
      return nums +
        '<div class="row r-2">' +
          painel("Mensagens por dia e status", "dia do envio", colunas(d.por_dia.map(function (x) { return ddmm(x.data); }), series,
            { empilhado: true, W: 740, rotulo: "Mensagens por dia e status" })) +
          painel("Como reagiram às mensagens", "cada mensagem pelo status mais avançado", rosca(status, k.enviadas, "enviadas")) + '</div>' +
        '<div class="row bi-3">' +
          painel("Por que não foi entregue", "erros devolvidos pela Meta", barras(d.motivos.map(function (m) { return { r: m.motivo, v: m.n }; }), nf, "var(--st-nent)")) +
          painel("Leitura pela hora do envio", "lidas ÷ entregues", barras(d.por_hora.filter(function (h) { return h.entregues; }).map(function (h) {
            return { r: h.chave, v: h.taxa_leitura || 0, sub: nf(h.entregues) + " entregues" };
          }), function (v) { return pctTxt(v, 0); }, "var(--s1)", 100)) +
          painel("Por template", "", tabela([["Template"], ["Enviadas", 1], ["Leitura", 1], ["Típico", 1]],
            d.por_template.map(function (t) { return [esc(t.chave), nf(t.enviadas), pctTxt(t.taxa_leitura), minTxt(t.tipico_min)]; }))) + '</div>' +
        '<div class="row">' + painel("Por loja", "loja onde a compra disparou o envio",
          tabela([["Loja"], ["Enviadas", 1], ["Entregues", 1], ["Leram", 1], ["Leitura", 1], ["Típico até ler", 1]],
            d.por_loja.map(function (t) { return [esc(t.chave), nf(t.enviadas), nf(t.entregues), nf(t.leram), pctTxt(t.taxa_leitura), minTxt(t.tipico_min)]; }),
            [ "<b>Total</b>", nf(k.enviadas), nf(k.entregues), nf(k.leram), pctTxt(k.taxa_leitura), minTxt(k.tipico_min)])) + '</div>';
    }
    function wppMeta(w) {
      var m = w.meta, k = m.kpis, c = m.conta;
      var nums = numerosGrandes([
        ["Aceitas pelo disparador", nf(k.aceitas), "o que a API recebeu", true],
        ["Enviadas pela Meta", nf(k.enviadas), "o que a Meta contou como enviado", true],
        ["Entregues (Meta)", nf(k.entregues), pctTxt(k.enviadas ? k.entregues / k.enviadas * 100 : null) + " das enviadas", true],
        ["Lidas (Meta)", nf(k.lidas), pctTxt(k.taxa_leitura) + " das entregues", true],
        ["Cliques únicos", nf(k.cliques_unicos), pctTxt(k.taxa_clique, 2) + " das entregues", false],
        ["Respostas", nf(k.respostas), "no webhook, últimos 30 dias", false],
        ["Pedidos de saída", nf(k.saidas), "Parar promoções, SAIR", false, !k.saidas],
        ["Aceitas − enviadas", nf(k.aceitas - k.enviadas), "a Meta não enviou (motivo abaixo)", false]]);
      var tile = function (r, v, alerta) {
        return '<div><div class="r">' + esc(r) + '</div><div class="v' + (alerta ? " alerta-v" : "") + '">' + esc(v) + '</div></div>';
      };
      var saude = '<div class="bi-saude">' + tile("Qualidade do número", c.qualidade, c.qualidade === "Baixa") +
        tile("Envio pela conta", c.envio, c.envio !== "Liberado") + tile("Verificação da empresa", c.verificacao, c.verificacao !== "Verificada") +
        tile("Limite de 24h", nf(c.usados) + " de " + nf(c.limite), c.limite && c.usados >= c.limite * 0.9) + '</div>' +
        (c.travas ? '<div class="bi-travas">' + c.travas.split(" | ").map(esc).join("<br>") + '</div>' : '');
      return nums +
        '<div class="row r-2">' +
          painel("Por dia: disparador × Meta", "aceitas pela API · enviadas e entregues segundo a Meta",
            colunas(m.por_dia.map(function (x) { return ddmm(x.data); }), [
              { nome: "Aceitas (disparador)", cor: "var(--s1)", v: m.por_dia.map(function (x) { return x.aceitas; }) },
              { nome: "Enviadas (Meta)", cor: "var(--s2)", v: m.por_dia.map(function (x) { return x.enviadas; }) },
              { nome: "Entregues (Meta)", cor: "var(--s3)", v: m.por_dia.map(function (x) { return x.entregues; }) }], { W: 740, rotulo: "Por dia" })) +
          painel("Saúde da conta na Meta", "WhatsApp Business · " + esc(dataHora(m.atualizado)), saude) + '</div>' +
        '<div class="row">' +
          painel("Por template", "", tabela([["Template"], ["Anunciante"], ["Aceitas", 1], ["Enviadas (Meta)", 1], ["Diferença", 1],
            ["Entregues", 1], ["Lidas", 1], ["Cliques únicos", 1], ["Tx de clique", 1]],
            m.por_template.map(function (t) {
              return [esc(t.template), esc(t.anunciante), t.aceitas ? nf(t.aceitas) : '<span class="hr">—</span>', nf(t.enviadas),
                t.aceitas ? nf(t.aceitas - t.enviadas) : '<span class="hr">—</span>', nf(t.entregues), nf(t.lidas), nf(t.cliques_unicos), pctTxt(t.taxa_clique, 2)];
            })) + '<div class="bi-nota">O disparador conta tudo o que a API aceitou; a Meta conta e cobra só o que entrega. A diferença são ' +
            'as mensagens que a Meta recusou (número sem WhatsApp, marketing segurado, limite de spam). Os números da Meta do dia corrente são ' +
            'estimados e podem mudar até o dia seguinte. Templates sem envio do disparador (testes, modelos novos) aparecem só com os números da Meta.</div>') +
        '</div><div class="row">' +
          painel("Erros que a Meta devolveu", "webhook, últimos 30 dias", barras(m.erros.map(function (e) { return { r: e.erro, v: e.total }; }), nf, "var(--st-nent)")) + '</div>';
    }
    function wppFinanceiro(w) {
      var f = w.financeiro, k = f.kpis;
      var nums = numerosGrandes([
        ["Custo na Meta", moedaOu(k.custo_meta, 2), "sem impostos, pela API", true],
        ["Impostos", moedaOu(k.impostos, 2), k.impostos_pct ? nf(k.impostos_pct, 2) + "% sobre o custo" : "em 0% até o contador confirmar", true, !k.impostos_pct],
        ["Custo final", moedaOu(k.custo_final, 2), "custo na Meta + impostos", true],
        ["Custo por mensagem entregue", moedaOu(k.por_entregue, 4), "a Meta cobra o que entrega", true],
        ["Custo por disparo", moedaOu(k.por_disparo, 4), "custo final ÷ aceitas pelo disparador", false],
        ["Preço da Meta (marketing)", moedaOu(k.preco_marketing, 4), "por mensagem, sem impostos", false],
        ["Fora do disparador", moedaOu(k.fora_disparador, 2), "testes e envios fora do estudo", false],
        ["Gasto da conta", moedaOu(k.gasto_conta, 2), "o que a Meta cobrou em 30 dias", false]]);
      var reais = function (v) { return moeda(v, 2); };
      return nums +
        '<div class="row r-2">' +
          painel("Custo final por dia", "custo na Meta + impostos", colunas(f.por_dia.map(function (x) { return ddmm(x.data); }),
            [{ nome: "Custo final", cor: "var(--s1)", v: f.por_dia.map(function (x) { return x.custo_final; }) }],
            { fmt: reais, W: 740, eixo: function (v) { return "R$ " + nf(v, 0); }, rotulo: "Custo final por dia" })) +
          painel("Impostos aplicados", "o contador confirma o % de cada um",
            tabela([["Imposto"], ["%", 1]], f.impostos.map(function (i) { return [esc(i.imposto), nf(i.pct, 2) + "%"]; }),
              ["<b>Total</b>", nf(k.impostos_pct, 2) + "%"]) +
            '<div class="bi-nota">A Meta informa o custo sem impostos. Os percentuais ficam no SharePoint, em ' +
            '<b>Bases Dashboards › SuperAdds › financeiro › parametros.xlsx</b> (aba Impostos); o hub recalcula na próxima geração.</div>') + '</div>' +
        '<div class="row r-2">' +
          painel("Custo final por template", "", barras(f.por_template.map(function (t) { return { r: t.template, v: t.custo_final }; }), reais, "var(--s1)")) +
          painel("Custo final por varejista", "rateado pelas entregas de cada dia e template", barras(f.por_varejista.map(function (t) {
            return { r: t.varejista, v: t.custo_final };
          }), reais, "var(--s1)")) + '</div>' +
        '<div class="row">' +
          painel("Por anunciante", "", tabela([["Anunciante"], ["Enviadas (Meta)", 1], ["Entregues", 1], ["Custo na Meta", 1], ["Impostos", 1],
            ["Custo final", 1], ["Por entregue", 1]], f.por_anunciante.map(function (a) {
              return [esc(a.anunciante), nf(a.enviadas), nf(a.entregues), moeda(a.custo_meta, 2), moeda(a.impostos, 2), moeda(a.custo_final, 2),
                moedaOu(a.por_entregue, 4)];
            }))) + '</div>';
    }

    // ---------- area Personas (com senha) ----------
    function telaPersonas() {
      aplicarTema(null);
      tela.innerHTML = topoHub("área protegida") + navArea("personas") + (PS ? conteudoPersonas() : senhaPersonas()) + rodape();
      ligarTopoHub(); ligarNavArea();
      if (PS) ligarPersonas(); else ligarSenhaPersonas();
    }
    function senhaPersonas() {
      var r = D.hub.restrito, aviso = "";
      if (!r) aviso = "A área Personas ainda não foi publicada neste hub.";
      else if (!window.crypto || !crypto.subtle || typeof DecompressionStream === "undefined") {
        aviso = "Este navegador não consegue abrir a área protegida. Use uma versão atual do Chrome, Edge, Safari ou Firefox, com a página em https.";
      }
      if (aviso) return '<div class="conteudo" id="conteudo"><div class="painel"><div class="vazio">' + esc(aviso) + '</div></div></div>';
      return '<div class="conteudo" id="conteudo"><div class="painel bi-senha"><div class="cadeado">' + CADEADO + '</div>' +
        '<h3>Área protegida</h3><div class="cap">Comportamento e Pessoas mostram dados derivados de cada pessoa, só com pseudônimo. ' +
        'Eles chegam cifrados e só abrem com a senha.</div>' +
        '<form id="ps-form" autocomplete="off"><input type="password" id="ps-senha" aria-label="Senha" placeholder="Senha">' +
        '<button class="btn-pri" type="submit" id="ps-ok">' + ABERTO + 'Abrir</button></form>' +
        '<div class="msg-erro" id="ps-msg" aria-live="polite"></div></div></div>';
    }
    function decifrar(senha) {
      var r = D.hub.restrito, enc = new TextEncoder();
      var b64 = function (s) {
        var bin = atob(s), u = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
        return u;
      };
      return crypto.subtle.importKey("raw", enc.encode(senha), "PBKDF2", false, ["deriveKey"])
        .then(function (base) {
          return crypto.subtle.deriveKey({ name: "PBKDF2", salt: b64(r.sal), iterations: r.iter, hash: "SHA-256" },
            base, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
        })
        .then(function (chave) { return crypto.subtle.decrypt({ name: "AES-GCM", iv: b64(r.iv) }, chave, b64(r.dados)); })
        .then(function (buf) {
          if (r.comp !== "gzip") return new TextDecoder().decode(buf);
          return new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream("gzip"))).text();
        })
        .then(function (txt) { return JSON.parse(txt); });
    }
    function ligarSenhaPersonas() {
      var f = $("ps-form");
      if (!f) return;
      var inp = $("ps-senha");
      inp.focus();
      f.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var msg = $("ps-msg"), bt = $("ps-ok");
        if (!inp.value) { msg.textContent = "Digite a senha."; return; }
        bt.disabled = true;
        msg.textContent = "Abrindo…";
        msg.style.color = "var(--muted)";
        decifrar(inp.value).then(function (dados) {
          PS = dados;
          inp.value = "";
          root.querySelectorAll('.nav [data-area="personas"]').forEach(function (b) { b.innerHTML = ABERTO + "Personas"; });
          trocarArea(conteudoPersonas, ligarPersonas);
        }).catch(function () {
          bt.disabled = false;
          msg.style.color = "";
          msg.textContent = "Senha incorreta. Tente de novo.";
          inp.value = "";
          inp.focus();
        });
      });
    }
    function filtroAtual() {
      return PS.filtros.filter(function (x) { return x.id === AREA.filtro; })[0] || PS.filtros[0];
    }
    function conteudoPersonas() {
      var abas = [["comportamento", "Comportamento"], ["pessoas", "Pessoas"]];
      return '<div class="conteudo" id="conteudo"><div class="bi-cab"><div class="seg" id="seg-ps" role="tablist">' +
        abas.map(function (a) {
          return '<button role="tab" data-ps="' + a[0] + '" aria-selected="' + (AREA.ps === a[0]) + '"' +
            (AREA.ps === a[0] ? ' class="on"' : '') + '>' + esc(a[1]) + '</button>';
        }).join("") + '</div>' + (AREA.ps === "comportamento" ? seletorFiltro() : '') +
        '<span class="bi-fonte">dados do estudo · pseudônimos, sem nome, telefone ou e-mail</span></div>' +
        (AREA.ps === "pessoas" ? psPessoas() : psComportamento()) + '</div>';
    }
    function seletorFiltro() {
      var grupos = [];
      PS.filtros.forEach(function (f) { if (grupos.indexOf(f.grupo) < 0) grupos.push(f.grupo); });
      return '<label class="bi-filtro">Ver<select id="ps-filtro">' + grupos.map(function (g) {
        var ops = PS.filtros.filter(function (f) { return f.grupo === g; }).map(function (f) {
          return '<option value="' + esc(f.id) + '"' + (f.id === AREA.filtro ? " selected" : "") + '>' + esc(f.nome) +
            ' (' + nf(f.kpis.pessoas) + ')</option>';
        }).join("");
        return g === "Toda a base" ? ops : '<optgroup label="' + esc(g) + '">' + ops + '</optgroup>';
      }).join("") + '</select></label>';
    }
    function lista(xs) { return xs.map(function (x) { return { r: x.rotulo, v: x.n }; }); }
    function rotinaBarras(itens) {
      var max = Math.max.apply(null, itens.map(function (x) { return x.padrao + x.pista + x.sem_dados; }).concat([1]));
      var seg = function (v, cor, nome, r) {
        return v ? '<span class="f" style="width:' + (v / max * 100).toFixed(1) + '%;background:' + cor + '" data-tip="' +
          esc(nf(v) + "\n" + r + " · " + nome) + '"></span>' : '';
      };
      return '<div class="part">' + itens.map(function (x) {
        var t = x.padrao + x.pista + x.sem_dados;
        return '<div class="pl"><div class="h"><span>' + esc(x.rotina) + '</span><b>' + nf(t) + '</b></div><span class="t bi-pilha">' +
          seg(x.padrao, "var(--cf-padrao)", "padrão", x.rotina) + seg(x.pista, "var(--cf-pista)", "pista", x.rotina) +
          seg(x.sem_dados, "var(--cf-sem)", "sem dados", x.rotina) + '</span></div>';
      }).join("") + '</div><div class="legenda" style="margin-top:10px"><span><i style="background:var(--cf-padrao)"></i>padrão (confirmada)</span>' +
        '<span><i style="background:var(--cf-pista)"></i>pista (a confirmar)</span><span><i style="background:var(--cf-sem)"></i>sem dados</span></div>';
    }
    function matriz(t) {
      var max = 1;
      Object.keys(t.n).forEach(function (k) { max = Math.max(max, t.n[k]); });
      var temL = t.linhas.filter(function (l) { return t.colunas.some(function (c) { return t.n[l + "|" + c]; }); });
      var temC = t.colunas.filter(function (c) { return t.linhas.some(function (l) { return t.n[l + "|" + c]; }); });
      return '<div class="tw"><table class="cat bi-mat"><thead><tr><th>Lê ↓ · compra →</th>' +
        temC.map(function (c) { return '<th class="n">' + esc(c) + '</th>'; }).join("") + '</tr></thead><tbody>' +
        temL.map(function (l) {
          return '<tr><td>' + esc(l) + '</td>' + temC.map(function (c) {
            var v = t.n[l + "|" + c] || 0;
            return '<td class="n" style="background:color-mix(in srgb, var(--s1) ' + Math.round(v / max * 45) + '%, transparent)">' +
              (v ? nf(v) : '<span class="hr">·</span>') + '</td>';
          }).join("") + '</tr>';
        }).join("") + '</tbody></table></div>';
    }
    function psComportamento() {
      var f = filtroAtual(), k = f.kpis, pf = f.perfil;
      var nums = numerosGrandes([
        ["Pessoas", nf(k.pessoas), f.id === "base" ? "toda a base que recebeu mensagens" : f.grupo + ": " + f.nome, true],
        ["Taxa de leitura", pctTxt(k.taxa_leitura), nf(k.enviadas) + " mensagens enviadas", true],
        ["Tempo típico até ler", minTxt(k.tipico_min), "metade de quem leu, leu até aqui", true],
        ["Ticket típico", k.ticket ? moeda(k.ticket, 2) : "—", nf(k.compras_semana, 1) + " compras por semana, em média", true]]);
      var ret = '<div class="row"><div class="painel bi-retrato"><div class="hrow"><div><h3>Retrato · ' +
        esc(f.id === "base" ? "toda a base" : f.nome) + '</h3><div class="cap">Escrito a partir dos dados do estudo: disparos, cadastro ' +
        'e compras dos últimos 90 dias. Muda com o filtro.</div></div></div>' +
        f.retrato.map(function (s) {
          return '<div class="bi-sec"><h4>' + esc(s[0]) + '</h4>' + (Array.isArray(s[1])
            ? '<ul>' + s[1].map(function (x) { return '<li>' + esc(x) + '</li>'; }).join("") + '</ul>' : '<p>' + esc(s[1]) + '</p>') + '</div>';
        }).join("") + '</div></div>';
      return nums + ret +
        '<div class="row bi-3">' + painel("Faixa etária", "", barras(lista(pf.faixa_etaria), nf, "var(--s1)")) +
          painel("Gênero", "", barras(lista(pf.genero), nf, "var(--s1)")) +
          painel("Classe estimada", "pela renda do bureau (estimativa)", barras(lista(pf.classe), nf, "var(--s1)")) + '</div>' +
        '<div class="row r-2">' + painel("Personalidade de rotina", "quando a pessoa fica longe ou perto do celular", rotinaBarras(pf.rotina)) +
          painel("Melhor janela para enviar", "respeita o horário do disparador (9h–19h)", barras(lista(pf.janelas), nf, "var(--s1)")) + '</div>' +
        fluxoPainel(f.fluxo) +
        '<div class="row r-2">' + painel("Turno em que lê × turno em que compra", "pessoas", matriz(pf.turnos)) +
          painel("Situação e persona", "pessoas", '<h4 class="bi-sub">Situação</h4>' + barras(lista(pf.situacao), nf, "var(--s1)") +
            '<h4 class="bi-sub">Persona</h4>' + barras(lista(pf.persona), nf, "var(--s1)")) + '</div>';
    }
    // Movimento no caixa (todos os clientes das lojas, consultas de CPF no PDV) x hora em que as
    // mensagens foram lidas: as duas em % do dia, no mesmo eixo.
    function fluxoPainel(fl) {
      if (!fl) return "";
      var pct = function (v) { return pctTxt(v, 1); };
      var nota = nf(fl.lojas) + (fl.lojas === 1 ? " loja" : " lojas") + " · " + brData(fl.de) + " a " + brData(fl.ate) +
        " · " + nf(fl.consultas) + " consultas no caixa · " + nf(fl.leituras) + " leituras";
      return '<div class="row r-2">' +
        painel("Movimento no caixa × leitura das mensagens", "% do dia em cada hora · caixa: todos os clientes das lojas (consultas de CPF no PDV)",
          colunas(fl.por_hora.map(function (x) { return x.h; }), [
            { nome: "Movimento no caixa", cor: "var(--s1)", v: fl.por_hora.map(function (x) { return x.caixa || 0; }) },
            { nome: "Leitura das mensagens", cor: "var(--s2)", v: fl.por_hora.map(function (x) { return x.leitura || 0; }) }],
            { W: 740, fmt: pct, eixo: function (v) { return nf(v, 0) + "%"; }, rotulo: "Movimento no caixa e leitura por hora" }) +
          '<div class="bi-nota">' + esc(nota) + '</div>') +
        painel("Movimento por dia da semana", "consultas no caixa por dia, em média",
          barras(fl.por_dia.map(function (x) { return { r: x.rotulo, v: x.n }; }), nf, "var(--s1)")) + '</div>';
    }
    function psFiltradas() {
      var b = AREA.busca.trim().toLowerCase();
      return PS.pessoas.filter(function (p) {
        return (!b || p.codigo.toLowerCase().indexOf(b) === 0) && (!AREA.fSit || p.situacao === AREA.fSit) &&
          (!AREA.fRot || p.rotina === AREA.fRot) && (!AREA.fPer || p.persona === AREA.fPer);
      });
    }
    function opcoes(campo, atual) {
      var vs = [];
      PS.pessoas.forEach(function (p) { if (p[campo] && vs.indexOf(p[campo]) < 0) vs.push(p[campo]); });
      vs.sort();
      return '<option value="">Todas</option>' + vs.map(function (v) {
        return '<option value="' + esc(v) + '"' + (v === atual ? " selected" : "") + '>' + esc(v) + '</option>';
      }).join("");
    }
    function psPessoas() {
      var todas = psFiltradas(), n = todas.length, pags = Math.max(1, Math.ceil(n / PS_POR_PAGINA));
      AREA.pag = Math.min(AREA.pag, pags - 1);
      var pag = todas.slice(AREA.pag * PS_POR_PAGINA, (AREA.pag + 1) * PS_POR_PAGINA);
      var hr = '<span class="hr">—</span>';
      var filtros = '<div class="bi-fps"><input type="search" id="ps-busca" placeholder="Código da pessoa" value="' + esc(AREA.busca) + '" aria-label="Buscar pelo código">' +
        '<label>Situação<select id="ps-sit">' + opcoes("situacao", AREA.fSit) + '</select></label>' +
        '<label>Rotina<select id="ps-rot">' + opcoes("rotina", AREA.fRot) + '</select></label>' +
        '<label>Persona<select id="ps-per">' + opcoes("persona", AREA.fPer) + '</select></label>' +
        '<span class="bi-n">' + nf(n) + (n === 1 ? ' pessoa' : ' pessoas') + '</span></div>';
      var linhas = pag.map(function (p) {
        return ['<b>' + esc(p.codigo) + '</b>', esc(p.situacao), esc(p.persona),
          esc(p.rotina) + (p.confianca ? ' <span class="hr">' + esc(p.confianca) + '</span>' : ''), p.janela ? esc(p.janela) : hr,
          esc(p.canal), '<span class="bi-pq">' + esc(p.porque) + '</span>', p.faixa_etaria ? esc(p.faixa_etaria) : hr,
          p.genero ? esc(p.genero) : hr, p.loja ? esc(p.loja) : hr, p.ticket ? moeda(p.ticket, 2) : hr,
          p.compras_90d === null ? hr : nf(p.compras_90d), p.tipico_min === null ? hr : nf(p.tipico_min) + " min"];
      });
      var nav = pags > 1 ? '<div class="bi-pag"><button class="btn mini" id="ps-ant"' + (AREA.pag ? '' : ' disabled') + '>Anterior</button>' +
        '<span>página ' + (AREA.pag + 1) + ' de ' + pags + '</span><button class="btn mini" id="ps-prox"' +
        (AREA.pag < pags - 1 ? '' : ' disabled') + '>Próxima</button></div>' : '';
      return '<div class="row">' + painel("Pessoas", "Uma linha por pessoa, só com o pseudônimo (8 primeiros caracteres). Sem nome, telefone, e-mail ou documento.",
        filtros + tabela([["Código"], ["Situação"], ["Persona"], ["Rotina"], ["Melhor janela"], ["Próximo canal"], ["Por quê"], ["Idade"],
          ["Gênero"], ["Loja habitual"], ["Ticket médio", 1], ["Compras 90 dias", 1], ["Típico até ler", 1]], linhas, null, "largo") + nav) + '</div>';
    }
    function ligarPersonas(focoBusca) {
      var redesenharPs = function (foco) {
        var c = $("conteudo");
        if (c) c.outerHTML = conteudoPersonas();
        ligarPersonas(foco);
      };
      root.querySelectorAll("#seg-ps button").forEach(function (b) {
        b.addEventListener("click", function () {
          if (AREA.ps === b.getAttribute("data-ps")) return;
          AREA.ps = b.getAttribute("data-ps");
          trocarArea(conteudoPersonas, ligarPersonas);
        });
      });
      var f = $("ps-filtro");
      if (f) f.addEventListener("change", function () { AREA.filtro = f.value; redesenharPs(); });
      var busca = $("ps-busca");
      if (busca) {
        busca.addEventListener("input", function () { AREA.busca = busca.value; AREA.pag = 0; redesenharPs(true); });
        if (focoBusca) { busca.focus(); busca.setSelectionRange(busca.value.length, busca.value.length); }
      }
      [["ps-sit", "fSit"], ["ps-rot", "fRot"], ["ps-per", "fPer"]].forEach(function (x) {
        var s = $(x[0]);
        if (s) s.addEventListener("change", function () { AREA[x[1]] = s.value; AREA.pag = 0; redesenharPs(); });
      });
      var ant = $("ps-ant"), prox = $("ps-prox");
      if (ant) ant.addEventListener("click", function () { AREA.pag--; redesenharPs(); });
      if (prox) prox.addEventListener("click", function () { AREA.pag++; redesenharPs(); });
    }

    // =================================================================
    // MODO EXIBICAO — telao da empresa: slides em tela cheia, girando sozinhos,
    // com os numeros grandes. Os dados continuam ao vivo (Meta a cada 3 min) e o
    // hub.json e relido a cada 10 min. Atalho: abrir a pagina com #tv no fim do link.
    // =================================================================
    var TV = { on: false, i: 0, seg: +(ler("tv-seg") || 15) || 15, pausa: false, timer: null, relogio: null,
               ocioso: null, wake: null, hub: null, slides: [], el: null, overflow: "", pedirCheia: false };
    var MONITOR = '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12.5" rx="2"/><path d="M8.5 20.5h7M12 16.5v4"/></svg>';
    var EXPANDIR = '<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';
    var PAUSA = '<svg viewBox="0 0 24 24"><path d="M8.5 5v14M15.5 5v14"/></svg>';
    var PLAY = '<svg viewBox="0 0 24 24"><path d="M7 5l12 7-12 7z" fill="currentColor"/></svg>';
    function botaoTV() {
      return '<button class="btn" id="bt-tv" title="Modo exibição: slides em tela cheia para o telão">' + MONITOR + 'Modo exibição</button>';
    }
    function tvCard(rot, val, sub, forte) {
      return '<div class="tv-c' + (forte ? " forte" : "") + '"><div class="r">' + esc(rot) + '</div><div class="v">' + esc(val) + '</div>' +
        (sub ? '<div class="s">' + esc(sub) + '</div>' : '') + '</div>';
    }
    // Colunas simples; com muitas colunas so alguns rotulos e o maior valor aparecem.
    function tvBarras(itens, fmt) {
      var n = itens.length, mx = Math.max.apply(null, itens.map(function (x) { return x.v; })) || 1;
      var passo = n > 12 ? Math.ceil(n / 8) : 1;
      return '<div class="tv-barras">' + itens.map(function (x, i) {
        var mostra = n <= 12 || x.v === mx || i === n - 1;
        return '<div class="tv-b"><span class="tv-bv">' + (mostra ? esc(fmt(x.v)) : '') + '</span><span class="tv-bb" style="height:' +
          Math.max(1.5, x.v / mx * 100).toFixed(1) + '%"></span><span class="tv-bl">' + (i % passo === 0 || i === n - 1 ? esc(x.rot) : '') + '</span></div>';
      }).join("") + '</div>';
    }
    // Receita dos ultimos meses, empilhada por parceiro (mesmas cores do grafico do hub).
    function tvMeses() {
      var S = serieRec();
      if (!S || !S.meses.length) return "";
      var ms = S.meses.slice(-6), mx = Math.max.apply(null, ms.map(function (m) { return m.total || 0; })) || 1;
      return '<div class="tv-barras">' + ms.map(function (m) {
        var tot = m.total || 0;
        var segs = S.parceiros.map(function (pi) {
          var v = m.valores[pi.id] || 0;
          return v && tot ? '<i style="height:' + (v / tot * 100).toFixed(2) + '%;background:' + esc(pi.cor_escuro || pi.cor) + '"></i>' : '';
        }).join("");
        return '<div class="tv-b"><span class="tv-bv">' + esc(moedaCurta(tot)) + '</span><span class="tv-pilha" style="height:' +
          Math.max(1.5, tot / mx * 100).toFixed(1) + '%">' + segs + '</span><span class="tv-bl">' + esc(m.curto + (m.parcial ? " *" : "")) + '</span></div>';
      }).join("") + '</div><div class="tv-leg">' + S.parceiros.map(function (pi) {
        return '<span><i style="background:' + esc(pi.cor_escuro || pi.cor) + '"></i>' + esc(pi.nome) + '</span>';
      }).join("") + '<span>* mês em andamento</span></div>';
    }
    function tvModelo(p) {
      return p.modelo === "midia" ? (p.valor_por_disparo ? moeda(p.valor_por_disparo, 2) + " por disparo de WhatsApp" : "mídia no WhatsApp")
        : p.modelo === "leads" ? "resultado em leads" : (p.remuneracao_atual || "vendas");
    }
    // Os 4 numeros de cada parceiro: os mesmos da frente da pagina dele.
    function tvNumeros(p, a) {
      var k = a.kpis;
      if (p.modelo === "midia") return [
        ["Receita Supertroco", moeda(k.receita, 2), nf(k.disparos) + " disparos × " + moeda(k.receita_por_disparo || 0, 2)],
        ["Disparos", nf(k.disparos), nf(k.tx_entrega, 1) + "% entregues"],
        ["Cliques", nf(k.cliques), "CTR de " + nf(k.ctr_wpp, 2) + "% das entregues"],
        ["Margem", moeda(k.margem, 2), "receita − custo na Meta"]];
      if (p.modelo === "leads" && k.fonte === "funil") return [
        ["Volume pago", moeda(k.volume), "receita Supertroco"],
        ["Leads recebidos", nf(k.leads), nf(k.leads_unicos) + " únicos"],
        ["Digitados", nf(k.digitados), nf(k.pct_digitado, 1) + "% dos únicos"],
        ["Pagos", nf(k.pagos), "adesão de " + nf(k.adesao, 1) + "%"]];
      if (p.modelo === "leads") return [
        ["Leads", nf(k.leads), a.periodo], ["Média por dia", nf(k.media_dia, 1), "leads por dia"],
        ["Pico diário", k.pico ? nf(k.pico.v) : "—", k.pico ? k.pico.d + " · " + k.pico.dia.toLowerCase() : ""],
        ["Dias com lead", nf(k.dias_com_lead) + " de " + nf(k.dias_ativos), "dias com pelo menos 1 lead"]];
      var rm = remunInfo(k);
      return [[rm.rotulo, moeda(receitaDe(k)), rm.sub], ["Vendas", moeda(k.vendas), "geradas para o parceiro"],
        ["Aquisições", nf(k.aquisicoes), "novos usuários"], [rm.cac, moeda(k.cac, 2), rm.cacSub]];
    }
    function tvSerie(p, a) {
      if (a.kpis.fonte === "funil") {
        var m = (a.mensal || []).filter(function (x) { return x.leads !== null && x.leads !== undefined; }).slice(0, 6).reverse();
        return m.length ? '<div class="tv-k">Leads por mês</div>' +
          tvBarras(m.map(function (x) { return { rot: x.nome.slice(0, 3), v: x.leads || 0 }; }), nf) : "";
      }
      var chave = p.modelo === "midia" ? "disparos" : p.modelo === "leads" ? "leads" : "vendas";
      var dias = (a.dias || []).slice(-30);
      if (!dias.length) return "";
      return '<div class="tv-k">' + (chave === "vendas" ? "Vendas por dia" : chave === "leads" ? "Leads por dia" : "Disparos por dia") +
        ' · últimos ' + dias.length + ' dias</div>' +
        tvBarras(dias.map(function (d) { return { rot: d.d, v: d[chave] || 0 }; }), chave === "vendas" ? curto : nf);
    }

    function tvSlides() {
      var out = [], g = D.hub.abas[0], k = g.kpis, mesId = hojeIso().slice(0, 7);
      var mesA = D.hub.abas.filter(function (a) { return a.id === mesId; })[0];
      var porP = (k.receita_por_parceiro || []).filter(function (x) { return x.receita > 0; });
      out.push({ tit: "Receita Supertroco", html:
        '<div class="tv-k">Receita Supertroco · toda a parceria</div><div class="tv-hero">' + esc(moeda(k.receita)) + '</div>' +
        '<div class="tv-sub">' + esc(g.periodo) + ' · soma de todos os parceiros, cada um pela sua regra</div>' +
        '<div class="tv-grid">' + tvCard("Neste mês", mesA ? moeda(mesA.kpis.receita) : "—",
          mesA ? mesA.nome + (mesA.parcial && mesA.ate ? " · até " + mesA.ate : "") : "sem dados no mês", true) +
        porP.slice(0, 3).map(function (x) { return tvCard(x.nome, moeda(x.receita), x.regra || ""); }).join("") + '</div>' + tvMeses() });

      var wb = wbi();
      if (!wppNoHub() && wb && wb.disparos) {
        var kd = wb.disparos.kpis, mk = (wb.meta || {}).kpis || {}, fk = (wb.financeiro || {}).kpis || {};
        out.push({ tit: "WhatsApp", cor: "#1BAF7A", lite: "#5FD6A6", html:
          '<div class="tv-k">WhatsApp · disparador e Meta · ' + esc(brData(wb.periodo.de)) + ' a ' + esc(brData(wb.periodo.ate)) + '</div>' +
          '<div class="tv-hero">' + esc(pctTxt(kd.taxa_leitura, 0)) + '</div>' +
          '<div class="tv-sub">das mensagens entregues foram lidas · metade em até ' + esc(minTxt(kd.tipico_min)) + '</div>' +
          '<div class="tv-grid">' + tvCard("Enviadas", nf(kd.enviadas), "aceitas pelo disparador", true) +
          tvCard("Entregues", nf(kd.entregues), pctTxt(kd.taxa_entrega) + " das enviadas") +
          tvCard("Cliques únicos", nf(mk.cliques_unicos || 0), "nos botões dos templates (Meta)") +
          tvCard("Custo por entregue", fk.por_entregue ? moeda(fk.por_entregue, 4) : "—", "custo final na Meta") + '</div>' });
      }

      var d = waDados();
      if (d) {
        var hoje = hojeIso(), d7 = new Date();
        d7.setDate(d7.getDate() - 6);
        var agH = waAgregar(d, null, hoje), ag7 = waAgregar(d, null, isoDe(d7)), lim = d.limite_24h || {}, num_ = d.numero || {};
        var importantes = waAvisos(d, null).filter(function (x) { return x.g === "alta"; });
        var th = agH.tot, t7 = ag7.tot;
        out.push({ tit: "WhatsApp ao vivo", cor: "#1BAF7A", lite: "#5FD6A6", html:
          '<div class="tv-k">WhatsApp oficial · Meta ' + (WA.vivo ? "ao vivo" : "· cópia de " + esc(waHora(d.atualizado))) + '</div>' +
          '<div class="tv-wa"><div class="tv-lim"><div class="tv-k">Limite de 24h da conta</div>' +
          '<div class="tv-hero">' + (lim.limite ? nf(lim.usados) + '<small> / ' + nf(lim.limite) + '</small>' : '—') + '</div>' +
          '<div class="tv-meter"><i style="width:' + Math.min(100, Math.max(0, lim.pct || 0)) + '%"></i></div>' +
          '<div class="tv-sub">pessoas únicas nas últimas 24h' + (lim.limite ? ' · restam ' + nf(lim.restantes || 0) : '') + '</div></div>' +
          '<div class="tv-grid g3">' +
          tvCard("Enviadas hoje", nf(th.enviadas), "entregues " + nf(th.enviadas ? th.entregues / th.enviadas * 100 : 0, 1) + "%", true) +
          tvCard("Lidas hoje", nf(th.lidas), "leituras de hoje, de envios de qualquer dia") +
          tvCard("Cliques hoje", nf(th.cliques), "nos botões dos templates") +
          tvCard("Enviadas · 7 dias", nf(t7.enviadas), nf(t7.cliques) + " cliques") +
          tvCard("Gasto na Meta · 7 dias", waMoeda(ag7.gasto.custo, 2, (d.conta || {}).moeda), nf(ag7.gasto.volume) + " mensagens cobradas") +
          tvCard("Qualidade do número", WA_QUAL[num_.qualidade] || "—", num_.numero || "") + '</div></div>' +
          (importantes.length ? '<div class="tv-av">' + importantes.slice(0, 2).map(function (x) {
            return '<div><b>' + esc(x.t) + '</b>' + (x.det ? '<span>' + esc(x.det) + '</span>' : '') + '</div>';
          }).join("") + '</div>' : '') });
      }

      D.parceiros.forEach(function (p) {
        if (p.sem_dados) return;
        var a = abaDe(p.abas, "geral");
        out.push({ tit: p.nome, cor: p.cores.brand, lite: p.cores.brand_lite, html:
          '<div class="tv-pc"><span class="tv-ini" style="background:' + esc(p.cores.brand) + '">' + esc(p.nome.charAt(0)) + '</span>' +
          '<div><div class="tv-k">' + esc(p.segmento) + ' · ' + esc(tvModelo(p)) + '</div><div class="tv-nome">' + esc(p.nome) + '</div></div></div>' +
          '<div class="tv-grid">' + tvNumeros(p, a).map(function (c, i) { return tvCard(c[0], c[1], c[2], i === 0); }).join("") + '</div>' +
          tvSerie(p, a) });
      });

      D.parceiros.forEach(function (p) {
        if (!p.tracking || !p.tracking.produtos || !p.tracking.produtos.length) return;
        out.push({ tit: "Tracking · " + p.nome, cor: p.cores.brand, lite: p.cores.brand_lite, html:
          '<div class="tv-k">' + esc(p.nome) + ' · do disparo ao contrato, por produto, desde ' + esc(brData(p.tracking.inicio)) + '</div>' +
          '<div class="tv-trk">' + p.tracking.produtos.map(function (prod) {
            var s = trkTotais(trkLinhas(p, prod));
            return '<div><div class="tv-nome" style="font-size:clamp(20px,2vw,40px)">' + esc(prod.nome) + '</div><div class="tv-fun">' +
              (wppNoHub()
                ? tvCard("Disparos", nf(s.disp), s.doBanco ? (s.dispMeta ? "Meta ao vivo + MariaDB" : "MariaDB (sem métrica na Meta)") : "Meta ao vivo", true) +
                  tvCard("Cliques", nf(s.cl), "taxa de clique " + trkPct(s.cl, s.dispMeta))
                : tvCard("Disparos", nf(s.disp), "do disparador", true)) +
              tvCard("Leads*", nf(s.lead), "acessos SuperTroco") + tvCard("Contratos", nf(s.conv), "conversão " + trkPct(s.conv, s.lead)) +
              tvCard("Produção", moeda(s.prod, 2), "relatório da " + p.nome) + '</div></div>';
          }).join("") + '</div><div class="tv-sub">* Leads = acessos de origem SuperTroco no relatório da ' + esc(p.nome) +
          ', de todos os canais da SuperTroco</div>' });
      });

      if (k.campanhas) {
        out.push({ tit: "E-mail · RD Station", cor: "#2A78D6", lite: "#7FB2EE", html:
          '<div class="tv-k">E-mail · RD Station · ' + esc(g.periodo) + '</div>' +
          '<div class="tv-grid">' + tvCard("Campanhas", nf(k.campanhas), "todos os parceiros", true) +
          tvCard("E-mails entregues", mil(k.entregues), "") + tvCard("Abertura média", nf(k.abertura, 1) + "%", "aberturas únicas ÷ entregues") +
          tvCard("CTR médio", nf(k.ctr, 2) + "%", "cliques ÷ entregues") + '</div>' +
          '<div class="tv-lista">' + (g.parceiros || []).filter(function (r) { return r.email; }).map(function (r) {
            return '<div><b>' + esc(r.nome) + '</b><span>' + nf(r.email.campanhas) + ' campanhas · ' + mil(r.email.entregues) +
              ' entregues · abertura ' + nf(r.email.abertura, 1) + '% · CTR ' + nf(r.email.ctr, 2) + '%</span></div>';
          }).join("") + '</div>' });
      }
      return out;
    }

    function tvAbrir(cheia) {
      if (TV.on) return;
      TV.on = true; TV.i = 0; TV.pausa = false; TV.pedirCheia = !cheia;
      var el = document.createElement("div");
      el.className = "tv"; el.id = "tv"; el.tabIndex = -1;
      el.setAttribute("role", "region"); el.setAttribute("aria-label", "Modo exibição");
      el.innerHTML = '<div class="tv-top"><span class="tv-marca">' + TREVO + 'Hub de Parceiros · Supertroco</span>' +
        '<span class="tv-tit" id="tv-tit"></span><span class="tv-dir"><span class="tv-live" id="tv-live"></span>' +
        '<span class="tv-hora" id="tv-hora"></span></span></div><div class="tv-palco" id="tv-palco"></div>' +
        (cheia ? '' : '<div class="tv-dica" id="tv-dica">Clique na tela para entrar em tela cheia</div>') +
        '<div class="tv-ctrl" id="tv-ctrl"><button data-tv="ant" title="Anterior (←)">' + VOLTA + '</button>' +
        '<button data-tv="pausa" id="tv-pausa" title="Pausar ou continuar (espaço)">' + PAUSA + '</button>' +
        '<button data-tv="prox" title="Próximo (→)">' + SETA + '</button><span class="tv-dots" id="tv-dots"></span>' +
        '<span class="tv-vel">' + [10, 15, 30].map(function (n) {
          return '<button data-tv-seg="' + n + '"' + (TV.seg === n ? ' class="on"' : '') + ' title="' + n + ' segundos por slide">' + n + 's</button>';
        }).join("") + '</span><button data-tv="cheia" title="Tela cheia">' + EXPANDIR + '</button>' +
        '<button data-tv="sair" title="Sair (Esc)">' + XIS + 'Sair</button></div><div class="tv-prog"><i id="tv-barra"></i></div>';
      app.appendChild(el);
      TV.el = el;
      TV.overflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = "hidden";
      el.addEventListener("click", tvClique);
      el.addEventListener("mousemove", tvAcordar);
      document.addEventListener("keydown", tvTecla);
      if (!tvAbrir.ligado) {
        tvAbrir.ligado = true;
        document.addEventListener("visibilitychange", function () { if (TV.on && !document.hidden) tvWake(true); });
      }
      TV.slides = tvSlides();
      tvIr(0);
      tvRelogio();
      tvAcordar();
      tvWake(true);
      if (cheia) tvTelaCheia();
      clearInterval(TV.hub);
      TV.hub = setInterval(tvRecarregarHub, 600000);
      el.focus();
    }
    function tvFechar() {
      if (!TV.on) return;
      TV.on = false;
      clearTimeout(TV.timer); clearInterval(TV.relogio); clearTimeout(TV.ocioso); clearInterval(TV.hub);
      document.removeEventListener("keydown", tvTecla);
      if (document.fullscreenElement && document.exitFullscreen) { try { document.exitFullscreen(); } catch (e) { /* ja saiu */ } }
      tvWake(false);
      if (TV.el) { TV.el.remove(); TV.el = null; }
      document.documentElement.style.overflow = TV.overflow || "";
      if (location.hash === "#tv" || location.hash === "#telao") {
        try { history.replaceState(null, "", location.pathname + location.search); } catch (e) { /* sem historico */ }
      }
    }
    function tvAtualizar() {
      if (!TV.on) return;
      TV.slides = tvSlides();
      if (TV.i >= TV.slides.length) TV.i = 0;
      tvPintar(false);
      tvDots();
    }
    function tvIr(i) {
      var n = TV.slides.length;
      if (!n) return;
      TV.i = (i + n) % n;
      tvPintar(true);
      tvDots();
      tvAgendar();
    }
    function tvPintar(anima) {
      var s = TV.slides[TV.i], palco = $("tv-palco");
      if (!s || !palco) return;
      TV.el.style.setProperty("--tvc", s.cor || "var(--brand)");
      TV.el.style.setProperty("--tvl", s.lite || "var(--brand-lite)");
      palco.innerHTML = '<div class="tv-slide' + (anima ? "" : " fixo") + '">' + s.html + '</div>';
      $("tv-tit").textContent = s.tit;
      var live = $("tv-live");
      if (live) {
        live.className = "tv-live" + (WA.vivo ? "" : " copia");
        live.innerHTML = '<i></i>' + (WA.vivo ? "ao vivo · Meta " + esc(waHora(WA.vivo.atualizado).slice(6)) : "dados de " + esc(D.atualizado));
      }
    }
    function tvDots() {
      var el = $("tv-dots");
      if (el) el.innerHTML = TV.slides.map(function (s, i) { return '<i' + (i === TV.i ? ' class="on"' : '') + ' title="' + esc(s.tit) + '"></i>'; }).join("");
    }
    function tvAgendar() {
      clearTimeout(TV.timer);
      var barra = $("tv-barra");
      if (barra) { barra.style.transition = "none"; barra.style.width = "0%"; void barra.offsetWidth; }
      if (TV.pausa || !TV.on) return;
      if (barra) { barra.style.transition = "width " + TV.seg + "s linear"; barra.style.width = "100%"; }
      TV.timer = setTimeout(function () { tvIr(TV.i + 1); }, TV.seg * 1000);
    }
    function tvPausar(v) {
      TV.pausa = v;
      var b = $("tv-pausa");
      if (b) b.innerHTML = v ? PLAY : PAUSA;
      tvAgendar();
    }
    function tvClique(ev) {
      var dica = $("tv-dica");
      if (dica) dica.remove();
      var b = ev.target && ev.target.closest ? ev.target.closest("button") : null;
      if (!b) {
        if (TV.pedirCheia && !document.fullscreenElement) { TV.pedirCheia = false; tvTelaCheia(); }
        return;
      }
      var a = b.getAttribute("data-tv"), sg = b.getAttribute("data-tv-seg");
      if (sg) {
        TV.seg = +sg; guardar("tv-seg", sg);
        root.querySelectorAll(".tv-vel button").forEach(function (x) { x.classList.toggle("on", x === b); });
        tvAgendar();
        return;
      }
      if (a === "ant") tvIr(TV.i - 1);
      else if (a === "prox") tvIr(TV.i + 1);
      else if (a === "pausa") tvPausar(!TV.pausa);
      else if (a === "cheia") tvTelaCheia();
      else if (a === "sair") tvFechar();
    }
    function tvTecla(ev) {
      if (!TV.on) return;
      if (ev.key === "ArrowRight") { tvIr(TV.i + 1); ev.preventDefault(); }
      else if (ev.key === "ArrowLeft") { tvIr(TV.i - 1); ev.preventDefault(); }
      else if (ev.key === " ") { tvPausar(!TV.pausa); ev.preventDefault(); }
      else if (ev.key === "Escape" && !document.fullscreenElement) tvFechar();
      tvAcordar();
    }
    function tvAcordar() {
      if (!TV.el) return;
      TV.el.classList.remove("ocioso");
      clearTimeout(TV.ocioso);
      TV.ocioso = setTimeout(function () { if (TV.el) TV.el.classList.add("ocioso"); }, 3500);
    }
    function tvTelaCheia() {
      var el = TV.el;
      if (!el) return;
      if (document.fullscreenElement) { if (document.exitFullscreen) document.exitFullscreen(); return; }
      var f = el.requestFullscreen || el.webkitRequestFullscreen;
      if (!f) return;
      try { var r = f.call(el); if (r && r.catch) r.catch(function () { /* o navegador recusou */ }); } catch (e) { /* sem permissao */ }
    }
    function tvRelogio() {
      var f = function () {
        var h = $("tv-hora"), d = new Date();
        if (h) h.textContent = p2(d.getDate()) + "/" + p2(d.getMonth() + 1) + " · " + p2(d.getHours()) + ":" + p2(d.getMinutes());
      };
      f();
      clearInterval(TV.relogio);
      TV.relogio = setInterval(f, 15000);
    }
    // A tela do telao nao apaga sozinha enquanto o modo estiver ligado (se o navegador deixar).
    function tvWake(ligar) {
      try {
        if (ligar && navigator.wakeLock && !TV.wake) {
          navigator.wakeLock.request("screen").then(function (w) {
            TV.wake = w;
            w.addEventListener("release", function () { TV.wake = null; });
          }).catch(function () { /* recusado */ });
        } else if (!ligar && TV.wake) { TV.wake.release(); TV.wake = null; }
      } catch (e) { /* sem suporte */ }
    }
    function tvRecarregarHub() {
      if (window.__hubDados) return;                  // previa local: nao ha o que reler
      baixar(HUB_URL).catch(function () { return baixar(HUB_URL_FALLBACK); }).then(function (dados) {
        if (!dados || !dados.hub || !dados.parceiros) return;
        if (JSON.stringify(dados) === JSON.stringify(D0)) return;
        D0 = clone(dados);
        aplicarVivo();
        redesenhar();
      }).catch(function () { /* tenta de novo no proximo ciclo */ });
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


    // =================================================================
    // MODULO DO BOT DE WHATSAPP
    // =================================================================
    // Le o status_bot.json publicado pelo proprio disparador. E somente
    // leitura: o bot roda num servidor interno, atras da VPN, e esta
    // pagina e estatica e publica — ela nao tem como mandar comando
    // nenhum para la. Pausar, reenfileirar e editar mensagem ficam no
    // painel local do bot.

    var botCache = null;

    function abrirBot() {
      if (sessao("bot") === "1") { telaBot(); } else { telaSenhaBot(); }
    }

    function telaSenhaBot() {
      abrirModal(cabecalhoModal("Disparador de WhatsApp", "Área protegida", "", CADEADO) +
        '<div class="mcorpo centro"><div class="cadeado">' + CADEADO + '</div>' +
        '<h4>Área protegida</h4><div class="exp">Digite a senha de 4 dígitos para ver a situação do bot.</div>' +
        '<form id="f-pinb" autocomplete="off"><div class="pin" id="pinb">' +
        [0, 1, 2, 3].map(function (i) {
          return '<input type="password" inputmode="numeric" maxlength="1" pattern="[0-9]*" aria-label="Dígito ' + (i + 1) + '" data-i="' + i + '">';
        }).join("") + '</div><div class="msg-erro" id="pinb-msg" aria-live="polite"></div>' +
        '<button class="btn-pri" type="submit">' + ABERTO + 'Liberar</button></form></div>', "estreito");
      var ins = modal.querySelectorAll(".pin input");
      ins[0].focus();
      ins.forEach(function (inp, i) {
        inp.addEventListener("input", function () {
          inp.value = inp.value.replace(/\D/g, "").slice(-1);
          if (inp.value && i < 3) ins[i + 1].focus();
          if (i === 3 && inp.value) conferirBot();
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
          if (t.length === 4) conferirBot(); else ins[t.length].focus();
        });
      });
      modal.querySelector("#f-pinb").addEventListener("submit", function (ev) { ev.preventDefault(); conferirBot(); });
      function conferirBot() {
        var pin = Array.prototype.map.call(ins, function (x) { return x.value; }).join("");
        var msg = modal.querySelector("#pinb-msg"), caixa = modal.querySelector("#pinb");
        if (pin.length < 4) { msg.textContent = "Digite os 4 dígitos."; return; }
        if (hash("bot|" + pin) === BOT_HASH) {
          sessao("bot", "1");
          var b = $("bt-bot");
          if (b) b.innerHTML = WPP + "Bot";
          telaBot();
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

    function telaBot() {
      abrirModal(cabecalhoModal("Disparador de WhatsApp", "Carregando...", "", WPP) +
        '<div class="mcorpo"><div class="bot-carregando">Buscando a situação do bot...</div></div>', "medio");
      buscarBot(function (erro, dados) {
        if (erro) { pintarBotErro(erro); return; }
        botCache = dados;
        pintarBot(dados);
      });
    }

    function buscarBot(pronto) {
      // O arquivo muda a cada poucos minutos; o parametro evita cache de CDN.
      var url = BOT_STATUS_URL + "?t=" + Date.now();
      fetch(url, { cache: "no-store" })
        .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
        .then(function (d) { pronto(null, d); })
        .catch(function () {
          fetch(BOT_STATUS_FALLBACK)
            .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
            .then(function (d) { pronto(null, d); })
            .catch(function (e) { pronto(e); });
        });
    }

    function pintarBotErro(e) {
      var corpo = '<div class="mcorpo">' +
        '<div class="bot-aviso er"><div><b>Não foi possível ler a situação do bot.</b><br>' +
        'O arquivo <code>status_bot.json</code> ainda não foi publicado, ou o bot está fora do ar.<br>' +
        '<span style="opacity:.75">' + esc(e && e.message || e) + '</span></div></div>' +
        '<div class="bot-nota">O bot publica esse arquivo a cada poucos minutos quando está rodando ' +
        'com a publicação ligada. Se ele acabou de ser configurado, aguarde o primeiro envio.</div></div>';
      abrirModal(cabecalhoModal("Disparador de WhatsApp", "Sem dados", "", WPP) + corpo, "medio");
    }

    function botIdade(iso) {
      if (!iso) return { txt: "—", min: Infinity };
      var min = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
      if (min < 1) return { txt: "agora", min: min };
      if (min < 60) return { txt: "há " + min + " min", min: min };
      var h = Math.floor(min / 60);
      if (h < 24) return { txt: "há " + h + "h", min: min };
      return { txt: "há " + Math.floor(h / 24) + "d", min: min };
    }

    function botHora(iso) {
      if (!iso) return "—";
      var d = new Date(iso);
      return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    }

    function pintarBot(d) {
      var idade = botIdade(d.gerado_em);
      var cx = d.conexao || {}, mt = d.motor || {}, hj = d.hoje || {}, fl = d.fila || {};

      // Status velho significa bot parado, mesmo que o arquivo diga "rodando".
      var desatualizado = idade.min > 20;
      var vivo = mt.rodando && cx.estado === "conectado" && !desatualizado;

      var classe = vivo ? (mt.pausado ? "alerta" : "vivo") : "morto";
      var rotulo = desatualizado ? "sem sinal" :
        (!mt.rodando ? "motor parado" :
          (mt.pausado ? "pausado" :
            (cx.estado === "conectado" ? "no ar" : esc(cx.estado || "desconhecido"))));

      var topo = '<div class="bot-topo">' +
        '<span class="bot-sit"><span class="bot-ponto ' + classe + '"></span>' + rotulo + '</span>' +
        (cx.numero ? '<span class="chip">' + esc(cx.numero) + '</span>' : '') +
        '<span class="chip">Atualizado <b style="margin-left:4px">' + idade.txt + '</b></span>' +
        '</div>';

      var avisos = "";

      if (desatualizado) {
        avisos += '<div class="bot-aviso er"><div><b>Sem sinal do bot.</b> ' +
          'A última atualização foi ' + idade.txt + ' (' + botHora(d.gerado_em) + '). ' +
          'Provavelmente o processo está parado no servidor.</div></div>';
      }
      if (cx.precisa_parear) {
        avisos += '<div class="bot-aviso at"><div><b>Precisa parear o aparelho.</b> ' +
          'O QR Code aparece no painel local do bot.</div></div>';
      }
      if (cx.numero_autorizado === false) {
        avisos += '<div class="bot-aviso er"><div><b>Número pareado não é o autorizado.</b> ' +
          'O bot está recusando todos os disparos.</div></div>';
      }
      if (!desatualizado && d.report && d.report.situacao === "atenção") {
        avisos += '<div class="bot-aviso at"><div><b>Atenção:</b> ' +
          (d.report.problemas || []).map(esc).join(" · ") + '</div></div>';
      }
      if (!avisos && vivo) {
        avisos = '<div class="bot-aviso ok"><div><b>Tudo certo.</b> ' +
          'O bot está conectado e disparando dentro da janela configurada.</div></div>';
      }

      var teto = hj.teto || 0;
      var pct = teto ? Math.min(100, Math.round((hj.enviados || 0) / teto * 100)) : 0;

      var cels =
        cel("Enviados hoje", hj.enviados || 0,
            teto ? pct + "% de " + teto : "sem teto", (hj.enviados ? "bom" : ""),
            '<div class="bot-barra"><i style="width:' + pct + '%"></i></div>') +
        cel("Na fila", fl.pendente || 0, "aguardando envio", "") +
        cel("Falhas hoje", hj.falhas || 0, (fl.falhou || 0) + " aguardando decisão", hj.falhas ? "ruim" : "") +
        cel("Inválidos hoje", hj.invalidos || 0, "fora do WhatsApp", hj.invalidos ? "meio" : "") +
        cel("Total enviado", fl.enviado || 0, "desde o início", "") +
        cel("Último disparo", botIdade(d.ultimo_disparo_em).txt, botHora(d.ultimo_disparo_em), "");

      var dias = (d.historico_dias || []).slice(0, 14).reverse();
      var maximo = Math.max.apply(null, dias.map(function (x) { return x.enviados || 0; }).concat([1]));

      var grafico = dias.length ? '<div class="bot-sec"><h5>Últimos dias</h5><div class="bot-dias">' +
        dias.map(function (x) {
          var alt = Math.round((x.enviados || 0) / maximo * 62);
          var dd = x.dia.slice(8, 10) + "/" + x.dia.slice(5, 7);
          return '<div class="bot-dia" title="' + esc(x.dia) + ': ' + (x.enviados || 0) + ' enviado(s)">' +
            '<div class="cl' + (x.enviados ? '' : ' zero') + '" style="height:' + Math.max(3, alt) + 'px"></div>' +
            '<div class="dt">' + dd + '</div></div>';
        }).join("") + '</div></div>' : "";

      var cad = d.cadencia || {};
      var janela = '<div class="bot-sec"><h5>Cadência configurada</h5>' +
        '<div class="bot-meta"><span>Janela ' + esc(cad.janela || "—") + '</span>' +
        '<span>Intervalo ' + ((cad.intervalo_s || []).join("–") || "—") + 's</span>' +
        '<span>Teto ' + (hj.teto || "—") + '/dia</span>' +
        '<span>' + (cad.aquecimento_ativo ? "Aquecimento ligado" : "Sem aquecimento") + '</span></div></div>';

      var m = (d.modelos || [])[0];
      var mensagem = m ? '<div class="bot-sec"><h5>Mensagem ativa</h5>' +
        '<div class="bot-msg">' + esc(m.corpo).replace(/\*([^*\n]+)\*/g, "<b>$1</b>") + '</div>' +
        '<div class="bot-meta"><span>' + esc(m.nome) + ' v' + m.versao + '</span>' +
        '<span>' + m.caracteres + ' caracteres</span>' +
        '<span>' + (m.tem_imagem ? "com imagem: " + esc(m.imagem) : "sem imagem") + '</span></div></div>' : "";

      var corpo = '<div class="mcorpo">' + topo + avisos +
        '<div class="bot-grade">' + cels + '</div>' + grafico + janela + mensagem +
        '<div class="bot-nota">Este painel é somente leitura. O bot roda num servidor interno, ' +
        'atrás da VPN, e esta página é pública e estática — ela não envia comando nenhum para lá. ' +
        'Pausar, reenfileirar falhas e editar a mensagem são feitos no painel local do bot.</div>' +
        blocoPainelLocal() +
        '</div>';

      var atualizar = '<button class="tbtn" id="bot-recarregar" title="Atualizar">' + SETA + '</button>';

      abrirModal(cabecalhoModal("Disparador de WhatsApp", "Atualizado " + idade.txt, atualizar, WPP) + corpo, "medio");

      var bt = modal.querySelector("#bot-recarregar");
      if (bt) bt.addEventListener("click", telaBot);
      ligarPainelLocal();
    }

    // -----------------------------------------------------------------
    // Atalho para o painel de controle do bot
    // -----------------------------------------------------------------
    // O endereco e interno e so funciona
    // para quem esta na VPN. Ele fica no localStorage de cada pessoa,
    // e NAO neste arquivo: o painel_hub.js e publico, e publicar um IP
    // interno aqui entregaria a topologia da rede a qualquer visitante.
    // Custo: cada pessoa informa o endereco uma vez, no proprio navegador.

    function enderecoPainel() {
      var v = ler("bot-painel");
      return v && /^https?:\/\//i.test(v) ? v : null;
    }

    function blocoPainelLocal() {
      var end = enderecoPainel();
      if (!end) {
        return '<div class="bot-painel"><div class="bot-cfg">' +
          '<input id="bot-end" type="url" placeholder="http://servidor-interno:porta" ' +
          'aria-label="Endereço do painel de controle" autocomplete="off">' +
          '<button class="lk" id="bot-salvar-end">Salvar</button>' +
          '<div class="err" id="bot-end-err"></div>' +
          '<div class="dica">Informe o endereço do painel de controle do bot para criar um atalho. ' +
          'Ele fica guardado só neste navegador — não vai para a página publicada.</div>' +
          '</div></div>';
      }
      return '<div class="bot-painel">' +
        '<button class="lk" id="bot-abrir">' + ABRIR_EXT + 'Abrir painel de controle</button>' +
        '<span class="end">' + esc(end) + '</span>' +
        '<button class="mini" id="bot-trocar-end">alterar</button>' +
        '</div>';
    }

    function ligarPainelLocal() {
      var abrir = modal.querySelector("#bot-abrir");
      if (abrir) {
        abrir.addEventListener("click", function () {
          var end = enderecoPainel();
          if (end) window.open(end, "_blank", "noopener,noreferrer");
        });
      }
      var trocar = modal.querySelector("#bot-trocar-end");
      if (trocar) {
        trocar.addEventListener("click", function () {
          guardar("bot-painel", "");
          if (botCache) pintarBot(botCache); else telaBot();
        });
      }
      var salvar = modal.querySelector("#bot-salvar-end");
      if (salvar) {
        var campo = modal.querySelector("#bot-end");
        var err = modal.querySelector("#bot-end-err");
        var confirmar = function () {
          var v = (campo.value || "").trim();
          if (!v) { err.textContent = "Digite o endereço."; return; }
          if (!/^https?:\/\//i.test(v)) v = "http://" + v;
          var u;
          try { u = new URL(v); } catch (e) { err.textContent = "Endereço inválido."; return; }
          if (u.protocol !== "http:" && u.protocol !== "https:") {
            err.textContent = "Use http:// ou https://.";
            return;
          }
          guardar("bot-painel", u.origin);
          if (botCache) pintarBot(botCache); else telaBot();
        };
        salvar.addEventListener("click", confirmar);
        campo.addEventListener("keydown", function (ev) {
          if (ev.key === "Enter") { ev.preventDefault(); confirmar(); }
        });
        campo.focus();
      }
    }

    function cel(rot, val, sub, classe, extra) {
      return '<div class="bot-cel ' + (classe || "") + '"><div class="r">' + esc(rot) + '</div>' +
        '<div class="v">' + esc(val) + '</div>' +
        '<div class="s">' + esc(sub || "") + '</div>' + (extra || "") + '</div>';
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
      D0 = clone(dados);
      inicializarVistos();
      var modo = ler("modo"); if (modo) estado.modo = modo;
      var gran = ler("gran"); if (gran) estado.gran = gran;
      var jan = ler("janela"); if (jan && jan !== "custom") estado.janela = jan;
      var canal = ler("canal"); if (canal === "whatsapp" || canal === "email") estado.canal = canal;
      if (estado.canal === "whatsapp" && !wppNoHub()) estado.canal = "email";
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

      var salva = ler("tela"), montou = false;
      var montar = function () {
        if (montou) return;
        montou = true; PRONTO = true;
        // #whatsapp e #personas abrem direto a area (link para mandar a alguem)
        if (location.hash === "#whatsapp" && wbi()) salva = "wpp";
        else if (location.hash === "#personas" && D.hub.restrito) salva = "personas";
        if (salva === "wpp" && wbi()) {
          estado.tela = "wpp"; telaWpp();
        } else if (salva === "personas" && D.hub.restrito) {
          estado.tela = "personas"; telaPersonas();
        } else if (salva && salva !== "hub" && D.parceiros.some(function (p) { return p.id === salva; })) {
          estado.tela = "parceiro"; estado.parceiro = salva;
          telaParceiro();
        } else {
          telaHub();
        }
        requestAnimationFrame(function () { tela.classList.add("on"); });
        if (location.hash === "#tv" || location.hash === "#telao") tvAbrir(false);
      };
      // WhatsApp oficial: os numeros da Meta so aparecem ao vivo. A tela espera o Worker
      // (ate 6 s); sem resposta, abre com a copia do hub.json e troca quando ele responder.
      // Depois, busca de novo a cada 3 minutos com a aba visivel.
      if (waCfg() && waCfg().url) {
        WA.aoCarregar = montar;
        setTimeout(function () { if (!montou) { WA.aoCarregar = null; montar(); } }, 6000);
        waCarregar();
      } else {
        montar();
      }
      waRelogio();
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
