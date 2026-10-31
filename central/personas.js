/* Central SuperAdds · Personas · montado em 30/10/2026 22:03 (central/montar.py). Não edite aqui: edite ui/ e paginas/. */
(function () {
"use strict";
var CFG = {"pagina": "personas", "titulo": "Personas", "alvo": "central-superadds", "porteiro": "https://superadds-central.mkt-7c4.workers.dev", "dados": ["https://raw.githubusercontent.com/SupertrocoWeb/painel/main/central/personas.json", "https://cdn.jsdelivr.net/gh/SupertrocoWeb/painel@main/central/personas.json"], "paginas": [{"id": "inicio", "nome": "Início", "icone": "casa", "url": "https://supertroco-4.rds.land/inicio"}, {"id": "personas", "nome": "Personas", "icone": "pessoas", "url": "https://retail-media.superadds.com.br/super-adds-personas", "abas": [{"id": "comportamento", "nome": "Comportamento"}, {"id": "rotina", "nome": "Rotina"}, {"id": "pessoas", "nome": "Pessoas"}]}, {"id": "financeiro", "nome": "Financeiro", "icone": "carteira", "url": "https://retail-media.superadds.com.br/superadds-financeiro"}, {"id": "estrategia", "nome": "Estratégia", "icone": "alvo", "url": "https://retail-media.superadds.com.br/superadds-estrategias"}, {"id": "ia", "nome": "Cérebro (IA)", "icone": "ia", "url": "https://retail-media.superadds.com.br/superadds-ia-brain"}, {"id": "dev", "nome": "Desenvolvedor", "icone": "codigo", "url": "https://retail-media.superadds.com.br/superadds-for-devs"}, {"id": "orcamento", "nome": "Orçamento", "icone": "calc", "url": "https://retail-media.superadds.com.br/superadds-base"}]};
var CSS = "/* kit.css — visual da Central SuperAdds (todas as páginas). Embutido em cada página pelo montar.py.\n   Escuro por padrão (como a referência), com opção clara. As cores de série são a paleta validada\n   (claro x escuro); as de situação nunca aparecem sem ícone e texto. */\n:host{all:initial;display:block}\n*{box-sizing:border-box;margin:0;padding:0}\n[hidden]{display:none !important}\n\n.sa{\n  --plano:#0f1821; --sup:#172330; --sup2:#1e2c3b; --lateral:#080d12; --borda:rgba(255,255,255,.07);\n  --tinta:#eef3f6; --tinta2:#b6c3ce; --mudo:#8696a5; --grade:#243444; --eixo:#35485c; --trilho:#2b3d50;\n  --marca:#22c3c1; --marca2:#5fe0dc; --marca-tinta:#04211f; --marca-suave:rgba(34,195,193,.12);\n  --faixa:linear-gradient(100deg,#0d8a68 0%,#12a3a0 42%,#1b78c9 100%);\n  --s1:#3987e5; --s2:#d95926; --s3:#199e70; --s4:#c98500; --s5:#d55181; --s6:#008300; --s7:#9085e9; --s8:#e66767;\n  --bom:#0ca30c; --atencao:#fab219; --serio:#ec835a; --critico:#d03b3b; --sobe:#0ca30c;\n  --aviso-fundo:rgba(250,178,25,.10); --aviso-borda:rgba(250,178,25,.35); --aviso-tinta:#f6cf7a;\n  --info-fundo:rgba(57,135,229,.10); --info-borda:rgba(57,135,229,.35); --info-tinta:#a9c9f3;\n  --bom-tinta:#7ad97a; --bom-fundo:rgba(12,163,12,.14); --bom-borda:rgba(12,163,12,.5);\n  --atencao-tinta:#f6cf7a; --atencao-fundo:rgba(250,178,25,.12); --atencao-borda:rgba(250,178,25,.5);\n  --critico-tinta:#ffa3a3; --critico-fundo:rgba(208,59,59,.16); --critico-borda:rgba(208,59,59,.55);\n  --sombra:0 1px 2px rgba(0,0,0,.3),0 8px 24px rgba(0,0,0,.25);\n  --disp:'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',sans-serif;\n  --corpo:'Inter',system-ui,-apple-system,'Segoe UI',sans-serif;\n  color-scheme:dark;\n  position:fixed;inset:0;z-index:2147480000;overflow:hidden;\n  display:grid;grid-template-columns:232px minmax(0,1fr);\n  background:var(--plano);color:var(--tinta);font-family:var(--corpo);font-size:14px;line-height:1.5;\n  -webkit-font-smoothing:antialiased;text-align:left;\n}\n.sa.claro{\n  --plano:#f1f4f7; --sup:#fcfcfb; --sup2:#f3f6f8; --lateral:#0b1620; --borda:rgba(11,11,11,.09);\n  --tinta:#0b0b0b; --tinta2:#52514e; --mudo:#6c6b66; --grade:#e3e6e9; --eixo:#c3c2b7; --trilho:#e3e6e9;\n  --marca:#0f9c9a; --marca2:#15b8b6; --marca-tinta:#ffffff; --marca-suave:rgba(15,156,154,.10);\n  --s1:#2a78d6; --s2:#eb6834; --s3:#1baf7a; --s4:#eda100; --s5:#e87ba4; --s6:#008300; --s7:#6250d6; --s8:#e34948;\n  --sobe:#006300;\n  --aviso-fundo:#fdf6e7; --aviso-borda:#f1e1bd; --aviso-tinta:#7a5208;\n  --info-fundo:#eef5fd; --info-borda:#cfe1f8; --info-tinta:#1d4f8f;\n  --bom-tinta:#006300; --bom-fundo:#e9f6e9; --bom-borda:#b4dfb4;\n  --atencao-tinta:#7a5208; --atencao-fundo:#fdf6e7; --atencao-borda:#ecd7a6;\n  --critico-tinta:#a61f1f; --critico-fundo:#fdeeee; --critico-borda:#efbcbc;\n  --sombra:0 1px 2px rgba(16,24,40,.05),0 6px 18px rgba(16,24,40,.06);\n  color-scheme:light;\n}\nbutton,input,select{font:inherit;color:inherit}\nbutton{cursor:pointer}\n:focus-visible{outline:2px solid var(--marca);outline-offset:2px}\na{color:inherit;text-decoration:none}\n.num{font-variant-numeric:tabular-nums}\n\n/* ------------------------------------------------------------- barra lateral */\n.lado{background:var(--lateral);color:#dfe8ee;display:flex;flex-direction:column;min-height:0;overflow-y:auto;\n  border-right:1px solid rgba(255,255,255,.05)}\n.logo{display:flex;align-items:center;gap:11px;padding:22px 20px 26px}\n.logo .sig{width:36px;height:36px;border-radius:10px;background:var(--faixa);display:grid;place-items:center;flex:0 0 auto}\n.logo .sig svg{width:20px;height:20px;stroke:#fff;fill:none;stroke-width:2.2}\n.logo b{font-family:var(--disp);font-weight:800;font-size:15px;letter-spacing:-.01em;display:block;line-height:1.15}\n.logo small{font-size:11px;color:#8ea0ae;display:block}\n.nav{display:flex;flex-direction:column;gap:2px;padding:0 10px}\n.nav a{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:10px;color:#aebdc8;font-size:13.5px;\n  font-weight:500;transition:background .15s,color .15s;position:relative}\n.nav a svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.9;flex:0 0 auto}\n.nav a:hover{background:rgba(255,255,255,.05);color:#fff}\n.nav a.ativa{background:rgba(34,195,193,.14);color:#fff}\n.nav a.ativa::before{content:\"\";position:absolute;left:-10px;top:8px;bottom:8px;width:3px;border-radius:0 3px 3px 0;background:#22c3c1}\n.nav a span{white-space:nowrap}\n.nav a.sub{padding:6px 12px 6px 42px;font-size:12.5px;color:#8ea0ae}\n.nav a.sub.ativa{background:transparent;color:#5fe0dc}\n.nav a.sub.ativa::before{top:6px;bottom:6px}\n.nav a.sub[aria-disabled]{opacity:.6}\n.nav a .em-breve{margin-left:auto;font-size:9.5px;color:#7d8f9d;border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:0 6px;line-height:16px}\n.lado .rodape{margin-top:auto;padding:16px 14px 18px;display:flex;flex-direction:column;gap:8px;font-size:12px;color:#8ea0ae}\n.lado .rodape .linha{display:flex;align-items:center;gap:8px}\n.lado .rodape button{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:#cfdbe3;border-radius:9px;\n  padding:7px 10px;font-size:12px;display:flex;align-items:center;gap:8px;width:100%}\n.lado .rodape button:hover{background:rgba(255,255,255,.09);color:#fff}\n.lado .rodape svg{width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2}\n.relogio{display:flex;align-items:center;gap:7px}\n.relogio i{width:7px;height:7px;border-radius:50%;background:#22c3c1;display:inline-block}\n\n/* ------------------------------------------------------------- conteúdo */\n.corpo{overflow-y:auto;min-width:0;min-height:0;scroll-behavior:smooth}\n.faixa{background:var(--faixa);color:#fff;padding:26px 34px 30px;position:relative;overflow:hidden}\n.faixa::after{content:\"\";position:absolute;right:-80px;top:-120px;width:420px;height:420px;border-radius:50%;\n  background:radial-gradient(closest-side,rgba(255,255,255,.16),transparent);pointer-events:none}\n.faixa .trilha{font-size:12px;opacity:.85;margin-bottom:6px}\n.faixa h1{font-family:var(--disp);font-weight:800;font-size:26px;letter-spacing:-.02em;line-height:1.15}\n.faixa .sub{font-size:13.5px;opacity:.92;margin-top:5px;max-width:760px}\n.faixa .meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px;position:relative;z-index:1}\n.faixa .pilula{background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.22);border-radius:999px;padding:4px 11px;\n  font-size:12px;display:inline-flex;align-items:center;gap:6px;backdrop-filter:blur(4px)}\n.miolo{padding:24px 34px 48px;max-width:1500px}\n\n.secao{display:flex;align-items:baseline;gap:10px;margin:30px 0 12px}\n.secao:first-child{margin-top:0}\n.secao h2{font-family:var(--disp);font-weight:800;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--tinta2)}\n.secao span{font-size:12px;color:var(--mudo)}\n\n.grade{display:grid;gap:14px}\n.g2{grid-template-columns:repeat(2,minmax(0,1fr))}\n.g3{grid-template-columns:repeat(3,minmax(0,1fr))}\n.g4{grid-template-columns:repeat(4,minmax(0,1fr))}\n.g5{grid-template-columns:repeat(5,minmax(0,1fr))}\n.g-12{grid-template-columns:minmax(0,1fr) minmax(0,2fr)}\n.g-21{grid-template-columns:minmax(0,2fr) minmax(0,1fr)}\n\n.cartao{background:var(--sup);border:1px solid var(--borda);border-radius:14px;padding:18px 20px;box-shadow:var(--sombra);min-width:0}\n.cartao .topo{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:12px}\n.cartao h3{font-family:var(--disp);font-weight:700;font-size:14.5px;letter-spacing:-.005em}\n.cartao .cap{font-size:12px;color:var(--mudo);margin-top:2px;line-height:1.45}\n.cartao .acao{font-size:12px;color:var(--marca);font-weight:600;white-space:nowrap;display:inline-flex;align-items:center;gap:4px}\n.cartao .acao:hover{text-decoration:underline}\n\n/* número em destaque com barra de cor embaixo (como na referência) */\n.tile{background:var(--sup);border:1px solid var(--borda);border-radius:14px;padding:16px 18px 18px;box-shadow:var(--sombra);\n  position:relative;overflow:hidden;min-width:0}\n.tile::after{content:\"\";position:absolute;left:0;right:0;bottom:0;height:4px;background:var(--barra,var(--marca))}\n.tile .rot{font-size:12px;color:var(--tinta2);font-weight:500}\n.tile .val{font-family:var(--disp);font-weight:700;font-size:26px;letter-spacing:-.02em;line-height:1.15;margin-top:6px}\n.tile .val small{font-size:14px;font-weight:600;color:var(--tinta2);margin-left:4px}\n.tile .nota{font-size:12px;color:var(--mudo);margin-top:6px;line-height:1.4}\n.tile .nota b{color:var(--tinta2);font-weight:600}\n\n.aviso{display:flex;gap:10px;align-items:flex-start;border:1px solid var(--aviso-borda);background:var(--aviso-fundo);color:var(--aviso-tinta);\n  border-radius:12px;padding:11px 14px;font-size:13px;margin-bottom:14px}\n.aviso.info{border-color:var(--info-borda);background:var(--info-fundo);color:var(--info-tinta)}\n.aviso svg{width:17px;height:17px;flex:0 0 auto;stroke:currentColor;fill:none;stroke-width:2;margin-top:1px}\n\n/* legenda */\n.legenda{display:flex;flex-wrap:wrap;gap:6px 16px;font-size:12px;color:var(--tinta2);margin-top:10px}\n.legenda span{display:inline-flex;align-items:center;gap:6px}\n.legenda i{width:10px;height:10px;border-radius:3px;display:inline-block}\n\n/* gráficos */\nsvg.graf{display:block;width:100%;height:auto;overflow:visible}\nsvg.graf text{font-family:var(--corpo);fill:var(--mudo);font-size:11px}\nsvg.graf .grade-l{stroke:var(--grade);stroke-width:1}\nsvg.graf .base{stroke:var(--eixo);stroke-width:1}\nsvg.graf .alvo{cursor:pointer;fill:transparent}\nsvg.graf .realce{fill:var(--tinta);opacity:0;transition:opacity .12s}\nsvg.graf g.col:hover .realce{opacity:.06}\n\n/* mostrador */\n.mostrador{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:18px;align-items:center}\n.mostrador .lado-t .grande{font-family:var(--disp);font-weight:800;font-size:31px;letter-spacing:-.025em;line-height:1.05}\n.mostrador .lado-t .rot{font-size:13px;color:var(--tinta2);margin-top:4px}\n.mostrador .pares{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:18px}\n.mostrador .par{border-left:3px solid var(--cor,var(--marca));padding-left:10px}\n.mostrador .par b{font-family:var(--disp);font-size:16px;font-weight:700;display:block;line-height:1.2;white-space:nowrap}\n.mostrador svg.graf{max-width:270px;margin:0 auto}\n.rosca svg.graf{max-width:180px;margin:0 auto}\n.mostrador .par span{font-size:12px;color:var(--mudo)}\n.saldo .rot{font-size:12px;color:var(--tinta2);font-weight:500}\n.saldo .val{font-family:var(--disp);font-weight:700;font-size:26px;letter-spacing:-.02em;line-height:1.15;margin-top:4px}\n.saldo .val small{font-size:13px;font-weight:600;color:var(--tinta2);margin-left:6px}\n.trilho{height:8px;border-radius:999px;background:var(--trilho);margin-top:16px;position:relative;overflow:visible}\n.trilho .cheio{position:absolute;left:0;top:0;bottom:0;border-radius:999px;background:var(--marca)}\n.trilho .marco{position:absolute;top:-5px;bottom:-5px;width:2px;background:var(--tinta);border-radius:2px}\n.trilho-leg{display:flex;justify-content:space-between;font-size:11.5px;color:var(--mudo);margin-top:8px}\n\n/* rosca */\n.rosca{display:grid;grid-template-columns:160px minmax(0,1fr);gap:22px;align-items:center}\n.rosca ul{list-style:none;display:flex;flex-direction:column;gap:12px}\n.rosca li{display:grid;grid-template-columns:12px minmax(0,1fr) auto;gap:10px;align-items:baseline}\n.rosca li i{width:12px;height:12px;border-radius:3px;display:inline-block;transform:translateY(1px)}\n.rosca li b{font-weight:600}\n.rosca li .v{font-variant-numeric:tabular-nums;font-weight:600;text-align:right}\n.rosca li small{display:block;color:var(--mudo);font-size:11.5px}\n\n/* barras horizontais */\n.barras{display:flex;flex-direction:column;gap:12px}\n.barra .linha{display:flex;justify-content:space-between;gap:10px;font-size:13px;margin-bottom:5px}\n.barra .linha span{color:var(--tinta2)}\n.barra .linha b{font-variant-numeric:tabular-nums;font-weight:600}\n.barra .linha b small{color:var(--mudo);font-weight:500;margin-left:6px}\n.barra .t{height:10px;border-radius:0 4px 4px 0;background:var(--grade);position:relative}\n.barra .t i{position:absolute;left:0;top:0;bottom:0;border-radius:0 4px 4px 0;display:block}\n\n/* tabela */\n.tabela-caixa{overflow-x:auto;border:1px solid var(--borda);border-radius:12px}\ntable.t{width:100%;border-collapse:collapse;font-size:12.5px;font-variant-numeric:tabular-nums;min-width:760px}\ntable.t th{position:sticky;top:0;background:var(--sup2);color:var(--tinta2);font-weight:600;text-align:right;padding:9px 12px;\n  border-bottom:1px solid var(--borda);white-space:nowrap;font-size:11.5px;letter-spacing:.01em}\ntable.t td{padding:8px 12px;border-bottom:1px solid var(--borda);text-align:right;white-space:nowrap}\ntable.t th:first-child,table.t td:first-child{text-align:left}\ntable.t tr:last-child td{border-bottom:0}\ntable.t tr:hover td{background:var(--marca-suave)}\ntable.t tfoot td{font-weight:700;background:var(--sup2)}\n.ok{color:var(--sobe);display:inline-flex;align-items:center;gap:4px}\n.ok svg,.dif svg{width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2.4}\n.dif{color:var(--serio);display:inline-flex;align-items:center;gap:4px}\n\n/* atalhos */\n.atalho{display:flex;gap:14px;align-items:flex-start;transition:border-color .15s,transform .15s}\n.atalho:hover{border-color:var(--marca);transform:translateY(-1px)}\n.atalho .ic{width:40px;height:40px;border-radius:11px;background:var(--marca-suave);color:var(--marca);display:grid;place-items:center;flex:0 0 auto}\n.atalho .ic svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:1.9}\n.atalho b{font-family:var(--disp);font-size:14.5px;display:block}\n.atalho p{font-size:12.5px;color:var(--mudo);margin-top:3px;line-height:1.45}\n\n/* abas numa linha */\n.abas{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px}\n.abas button{background:var(--sup);border:1px solid var(--borda);color:var(--tinta2);border-radius:999px;padding:7px 14px;font-size:13px;\n  font-weight:600;display:inline-flex;align-items:center;gap:7px;transition:background .15s,border-color .15s,color .15s}\n.abas button:hover{border-color:var(--marca);color:var(--tinta)}\n.abas button.on{background:var(--marca);border-color:var(--marca);color:var(--marca-tinta)}\n.abas button i{width:9px;height:9px;border-radius:50%;display:inline-block}\n.abas button small{font-weight:500;opacity:.75;font-size:11.5px}\n.abas.parceiros{background:var(--sup);border:1px solid var(--borda);border-radius:14px;padding:6px;gap:4px;box-shadow:var(--sombra)}\n.abas.parceiros button{border:0;background:transparent;border-radius:10px;padding:9px 16px;font-size:13.5px;white-space:nowrap;flex:0 0 auto}\n.abas.parceiros button.on{background:var(--marca);color:var(--marca-tinta)}\n.abas.meses button{padding:5px 12px;font-size:12px}\n\n/* \"o que você quer ver hoje?\" */\n.pergunta{font-family:var(--disp);font-weight:800;font-size:18px;letter-spacing:-.01em;margin:0 0 12px}\n.escolhas{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:22px}\n.escolha{background:var(--sup);border:1px solid var(--borda);border-radius:14px;padding:14px 16px;text-align:left;box-shadow:var(--sombra);\n  display:flex;gap:12px;align-items:flex-start;transition:border-color .15s,transform .15s;color:var(--tinta);position:relative}\n.escolha:hover{border-color:var(--marca);transform:translateY(-1px)}\n.escolha.on{border-color:var(--marca);box-shadow:0 0 0 1px var(--marca),var(--sombra)}\n.escolha .ic{width:36px;height:36px;border-radius:10px;background:var(--marca-suave);color:var(--marca);display:grid;place-items:center;flex:0 0 auto}\n.escolha .ic svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.9}\n.escolha b{font-family:var(--disp);font-size:14px;display:block}\n.escolha span{font-size:12px;color:var(--mudo);display:block;margin-top:2px;line-height:1.4}\n.escolha em{font-style:normal;font-family:var(--disp);font-weight:700;font-size:15px;color:var(--tinta);display:block;margin-top:6px}\n\n/* selos (sempre com texto) */\n.selo{display:inline-flex;align-items:center;gap:5px;border-radius:999px;padding:2px 9px;font-size:11.5px;font-weight:600;\n  border:1px solid var(--borda);color:var(--tinta2);background:var(--sup2);white-space:nowrap}\n.selo svg{width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2.4}\n.selo.bom{color:var(--sobe);border-color:currentColor;background:transparent}\n.selo.ruim{color:var(--serio);border-color:currentColor;background:transparent}\n.selo.marca{color:var(--marca);border-color:currentColor;background:transparent}\n\n/* listas do plano e do recibo */\n.plano{display:flex;flex-direction:column;gap:10px}\n.item-plano{display:grid;grid-template-columns:34px minmax(0,1fr) auto;gap:12px;align-items:start;padding:14px 16px;border:1px solid var(--borda);\n  border-radius:12px;background:var(--sup)}\n.item-plano .n{width:30px;height:30px;border-radius:9px;background:var(--marca-suave);color:var(--marca);display:grid;place-items:center;font-weight:800;font-family:var(--disp)}\n.item-plano .n svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2.4}\n.item-plano h4{font-family:var(--disp);font-size:14.5px;font-weight:700}\n.item-plano .onde{font-size:12.5px;color:var(--tinta2);margin-top:2px;display:flex;flex-wrap:wrap;gap:6px 12px}\n.item-plano .porque{font-size:13px;color:var(--tinta);margin-top:8px;line-height:1.5}\n.item-plano .lado-d{text-align:right;display:flex;flex-direction:column;gap:6px;align-items:flex-end}\n.item-plano .lado-d b{font-family:var(--disp);font-size:20px}\n.item-plano .lado-d small{font-size:11.5px;color:var(--mudo)}\n.recibo{font-family:ui-monospace,'Cascadia Mono',Consolas,monospace;font-size:12px;line-height:1.55;background:var(--sup2);border:1px dashed var(--eixo);\n  border-radius:12px;padding:16px 18px;white-space:pre;overflow:auto;max-height:520px;color:var(--tinta)}\n\n/* desenvolvedor */\n.kv{display:grid;grid-template-columns:minmax(120px,auto) minmax(0,1fr);gap:7px 16px;font-size:13px}\n.kv dt{color:var(--mudo)}\n.kv dd{color:var(--tinta);font-variant-numeric:tabular-nums;word-break:break-word}\n.kv dd code,.cod{font-family:ui-monospace,'Cascadia Mono',Consolas,monospace;font-size:12px;background:var(--sup2);border:1px solid var(--borda);\n  border-radius:6px;padding:1px 6px}\npre.codigo{font-family:ui-monospace,'Cascadia Mono',Consolas,monospace;font-size:11.5px;line-height:1.5;background:#0a1016;color:#d6e2ea;\n  border:1px solid var(--borda);border-radius:10px;padding:12px 14px;overflow:auto;max-height:340px;white-space:pre-wrap;word-break:break-word}\n.form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}\n.form label{display:flex;flex-direction:column;gap:5px;font-size:12px;color:var(--tinta2);font-weight:600}\n.form input,.form select{background:var(--sup2);border:1px solid var(--borda);border-radius:9px;padding:9px 11px;font-size:13px;color:var(--tinta);min-width:0}\n.form .larga{grid-column:1 / -1}\n.botao{background:var(--marca);color:var(--marca-tinta);border:0;border-radius:10px;padding:9px 16px;font-weight:700;font-size:13px;\n  display:inline-flex;align-items:center;gap:7px;white-space:nowrap;flex:0 0 auto}\n.botao.sec{background:var(--sup2);color:var(--tinta);border:1px solid var(--borda)}\n.botao:hover{filter:brightness(1.07)}\n.botao[disabled]{opacity:.55;cursor:wait}\n.botao svg{width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2}\n.consultas{display:flex;flex-direction:column;gap:8px}\n.consulta{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:10px;align-items:center;padding:9px 12px;border:1px solid var(--borda);border-radius:10px;background:var(--sup2)}\n.consulta .m{font-family:ui-monospace,Consolas,monospace;font-size:11px;font-weight:700;color:var(--marca);border:1px solid currentColor;border-radius:5px;padding:0 5px}\n.consulta .u{font-family:ui-monospace,Consolas,monospace;font-size:12px;color:var(--tinta2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.estado-vivo{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--tinta2)}\n.estado-vivo i{width:8px;height:8px;border-radius:50%;background:var(--mudo);display:inline-block}\n.estado-vivo.ok i{background:var(--bom)}\n.estado-vivo.falha i{background:var(--critico)}\n.linha-tempo{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}\n.linha-tempo span{font-size:12px;border:1px solid var(--borda);border-radius:999px;padding:3px 10px;color:var(--mudo)}\n.linha-tempo span.feito{color:var(--sobe);border-color:currentColor}\n\n/* bloco retrátil */\n.retratil{background:var(--sup);border:1px solid var(--borda);border-radius:14px;box-shadow:var(--sombra);margin-bottom:12px;min-width:0}\n.retratil > .cab{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:12px;align-items:center;width:100%;padding:14px 18px;\n  background:transparent;border:0;border-radius:14px;text-align:left;color:var(--tinta)}\n.retratil > .cab:hover{background:var(--marca-suave)}\n.retratil > .cab:focus-visible{outline:2px solid var(--marca);outline-offset:-2px}\n.retratil .seta{width:26px;height:26px;border-radius:8px;background:var(--sup2);display:grid;place-items:center;color:var(--tinta2)}\n.retratil .seta svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2.2;transition:transform .15s}\n.retratil.aberto > .cab .seta svg{transform:rotate(90deg)}\n.retratil .tit{display:flex;align-items:center;gap:10px;min-width:0}\n.retratil .tit .ic{width:34px;height:34px;border-radius:10px;background:var(--marca-suave);color:var(--marca);display:grid;place-items:center;flex:0 0 auto}\n.retratil .tit .ic svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.9}\n.retratil.leve .tit .ic{width:28px;height:28px;border-radius:8px}\n.retratil.leve .tit .ic svg{width:15px;height:15px}\n.retratil .tit b{font-family:var(--disp);font-weight:700;font-size:15px;display:block;line-height:1.25}\n.retratil .tit small{display:block;font-size:12px;color:var(--mudo);margin-top:2px;line-height:1.4}\n.retratil .dir{display:flex;gap:18px;align-items:center;justify-content:flex-end;flex-wrap:wrap}\n.retratil > .conteudo{padding:16px 18px 18px;border-top:1px solid var(--borda)}\n.retratil:not(.aberto) > .conteudo{display:none}\n.retratil.leve{box-shadow:none;background:var(--sup2);margin-bottom:8px;border-radius:12px}\n.retratil.leve > .cab{padding:10px 14px;border-radius:12px}\n.retratil.leve > .cab .seta{background:var(--sup)}\n.retratil.leve .tit b{font-size:13.5px}\n.retratil.leve > .conteudo{padding:12px 14px 14px}\n.mini{display:flex;flex-direction:column;align-items:flex-end;line-height:1.2}\n.mini b{font-family:var(--disp);font-weight:700;font-size:15px;font-variant-numeric:tabular-nums;white-space:nowrap}\n.mini small{font-size:11px;color:var(--mudo);white-space:nowrap}\n\n/* etiqueta de situação (sempre com ícone e texto) */\n.tag{display:inline-flex;align-items:center;gap:5px;border-radius:999px;padding:2px 9px 2px 7px;font-size:11.5px;font-weight:600;\n  white-space:nowrap;border:1px solid var(--borda);color:var(--tinta2);background:var(--sup2);line-height:1.5}\n.tag svg{width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2.4;flex:0 0 auto}\n.tag.bom{color:var(--bom-tinta);background:var(--bom-fundo);border-color:var(--bom-borda)}\n.tag.atencao{color:var(--atencao-tinta);background:var(--atencao-fundo);border-color:var(--atencao-borda)}\n.tag.critico{color:var(--critico-tinta);background:var(--critico-fundo);border-color:var(--critico-borda)}\n.tags{display:flex;flex-wrap:wrap;gap:6px}\n\n/* uso de limites */\n.uso{display:flex;flex-direction:column;gap:6px;padding:11px 0;border-bottom:1px solid var(--borda)}\n.uso:last-child{border-bottom:0}\n.uso .linha{display:flex;justify-content:space-between;gap:10px;font-size:13px}\n.uso .linha span{color:var(--tinta2)}\n.uso .linha small{color:var(--mudo);font-weight:500}\n.uso .linha b{font-variant-numeric:tabular-nums;font-weight:700;white-space:nowrap}\n.uso .t{height:8px;border-radius:999px;background:var(--trilho);overflow:hidden}\n.uso .t i{display:block;height:100%;border-radius:999px;background:var(--marca)}\n.uso .pct{font-size:11px;color:var(--mudo)}\n\n/* filtros numa linha */\n.filtros{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-end;margin-bottom:16px}\n.filtros label{display:flex;flex-direction:column;gap:4px;font-size:11.5px;color:var(--mudo);font-weight:600;flex:1 1 150px;min-width:140px;max-width:250px}\n.filtros select,.filtros input{background:var(--sup);border:1px solid var(--borda);border-radius:9px;padding:8px 10px;font-size:13px;color:var(--tinta);\n  min-width:0;width:100%}\n.filtros select:hover,.filtros input:hover{border-color:var(--marca)}\n.filtros .botao{flex:0 0 auto}\n\n/* calendário */\n.cal .cab-cal{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:10px}\n.cal .cab-cal b{font-family:var(--disp);font-size:15px;font-weight:700}\n.cal .navs{display:flex;gap:6px}\n.cal .navs button{width:30px;height:30px;border-radius:9px;border:1px solid var(--borda);background:var(--sup2);display:grid;place-items:center;color:var(--tinta)}\n.cal .navs button[disabled]{opacity:.35;cursor:default}\n.cal .navs svg{width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2.2}\n.cal .sem,.cal .grade-cal{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}\n.cal .sem{font-size:11px;color:var(--mudo);text-align:center;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em}\n.cal .d{min-height:64px;border-radius:10px;border:1px solid var(--borda);padding:6px 8px;display:flex;flex-direction:column;justify-content:space-between;\n  text-align:left;color:var(--tinta);background:color-mix(in srgb,var(--s1) calc(var(--int,0) * 55%),var(--sup2));min-width:0}\n.cal .d.vazio{background:transparent;border-color:transparent}\n.cal .d.sem-dado{background:transparent;border-style:dashed;opacity:.6}\n.cal button.d:hover{border-color:var(--marca)}\n.cal .d.on{border-color:var(--marca);box-shadow:0 0 0 2px var(--marca)}\n.cal .d .n{font-size:11px;font-weight:600;color:var(--tinta2)}\n.cal .d .v{font-family:var(--disp);font-weight:700;font-size:12.5px;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-.01em}\n\ntable.t.compacta{min-width:0}\ntable.t.compacta th,table.t.compacta td{padding:7px 8px}\n\n/* mapa de calor em tabela */\ntable.t td.calor{background:color-mix(in srgb,var(--s1) calc(var(--int,0) * 60%),transparent)}\n\n/* paginação de tabela */\n.paginacao{display:flex;gap:8px;align-items:center;justify-content:space-between;margin-top:10px;font-size:12.5px;color:var(--mudo);flex-wrap:wrap}\n.paginacao .navs{display:flex;gap:6px}\n\n/* texto da IA */\n.ia{border-left:3px solid var(--marca);padding:2px 0 2px 14px}\n.ia li{margin:6px 0 0 18px;font-size:13.5px;line-height:1.55}\n.ia p{font-size:13.5px;line-height:1.6}\n.retrato dt{font-family:var(--disp);font-weight:700;font-size:13px;color:var(--tinta2);margin-top:14px}\n.retrato dt:first-child{margin-top:0}\n.retrato dd{font-size:14px;line-height:1.65;margin-top:3px}\n\n/* Cérebro: cadeias de raciocínio (o porquê em elos) */\n.cadeias{display:flex;flex-direction:column;gap:12px}\n.cadeia{border:1px solid var(--borda);border-radius:14px;background:var(--sup);padding:16px 18px;box-shadow:var(--sombra);min-width:0}\n.cadeia .cab-c{display:flex;justify-content:space-between;gap:10px 16px;align-items:flex-start}\n.cadeia .quando{font-size:12px;color:var(--tinta2);font-weight:600;display:flex;gap:4px 14px;flex-wrap:wrap}\n.cadeia .quando span{display:inline-flex;align-items:center;gap:5px}\n.cadeia .quando svg{width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2}\n.cadeia h4{font-family:var(--disp);font-size:15px;font-weight:700;line-height:1.45;margin-top:6px;max-width:900px}\n.cadeia .tags{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;flex:0 0 auto;max-width:300px}\n.elos{list-style:none;margin:12px 0 0;padding:0 0 0 2px}\n.elos li{position:relative;padding:0 0 10px 22px;font-size:13.5px;line-height:1.55}\n.elos li::before{content:\"\";position:absolute;left:4px;top:6px;width:9px;height:9px;border-radius:50%;background:var(--marca)}\n.elos li::after{content:\"\";position:absolute;left:8px;top:17px;bottom:0;width:1px;background:var(--eixo)}\n.elos li:last-child{padding-bottom:2px}\n.elos li:last-child::after{display:none}\n.elos li.ctx{color:var(--tinta2)}\n.elos li.ctx::before{background:var(--sup);border:1.5px solid var(--mudo);width:8px;height:8px}\n.elos li.fraco::before{background:var(--sup);border:1.5px solid var(--marca);width:8px;height:8px}\n.ev{display:inline-flex;align-items:center;margin-left:6px;font-size:11px;font-weight:700;color:var(--marca);border:1px solid currentColor;\n  border-radius:6px;padding:0 5px;cursor:help;vertical-align:1px;white-space:nowrap}\n.ev small{font-weight:500;color:var(--mudo);margin-left:4px}\n.cadeia .pe{display:flex;flex-wrap:wrap;gap:6px 20px;font-size:12.5px;color:var(--tinta2);border-top:1px dashed var(--eixo);margin-top:10px;padding-top:10px}\n.cadeia .pe b{color:var(--tinta);font-weight:600}\n.revisao{font-size:12.5px;color:var(--tinta2);margin-top:10px;display:flex;gap:8px;align-items:flex-start;background:var(--sup2);border-radius:10px;padding:8px 10px}\n.revisao svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2;flex:0 0 auto;margin-top:2px}\n.lista-ia{display:flex;flex-direction:column;gap:10px}\n.lista-ia > div{border:1px solid var(--borda);border-radius:12px;padding:12px 14px;background:var(--sup2)}\n.lista-ia h5{font-family:var(--disp);font-size:13.5px;font-weight:700;display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:space-between}\n.lista-ia p{font-size:13px;line-height:1.55;margin-top:4px;color:var(--tinta2)}\n.lista-ia p b{color:var(--tinta)}\n.camadas{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}\n.camadas > div{border:1px solid var(--borda);border-radius:12px;padding:14px;background:var(--sup2)}\n.camadas h5{font-family:var(--disp);font-size:13.5px;font-weight:700;margin-bottom:6px}\n.camadas p,.camadas li{font-size:12.5px;line-height:1.55;color:var(--tinta2)}\n.camadas ul{margin:0;padding-left:16px}\n/* Cérebro: os três tempos (já fizemos · estamos fazendo · vamos fazer) */\n.tempo{display:flex;flex-direction:column}\n.tempo .cab-t{display:flex;flex-direction:column;gap:2px;margin-bottom:10px}\n.tempo .cab-t .rot{font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:var(--mudo);font-weight:700}\n.tempo .cab-t b{font-family:var(--disp);font-size:15.5px;font-weight:700}\n.tempo .grande{font-family:var(--disp);font-weight:700;font-size:30px;letter-spacing:-.02em;line-height:1.1}\n.tempo .grande small{font-size:13px;font-weight:600;color:var(--tinta2);margin-left:6px;letter-spacing:0}\n.tempo ul{list-style:none;margin:12px 0 0;padding:0;display:flex;flex-direction:column;gap:9px}\n.tempo li{font-size:13px;line-height:1.5;padding-top:9px;border-top:1px solid var(--borda);overflow-wrap:anywhere}\n.tempo li .tag{margin-left:2px;vertical-align:middle}\n.tempo li small{font-size:11.5px}\n.tempo .aviso{margin-top:12px}\n.tempo.amanha{border-color:var(--marca);box-shadow:0 0 0 1px var(--marca),var(--sombra)}\n.tempo.amanha .cab-t .rot{color:var(--marca)}\na.link-ext{color:var(--tinta);text-decoration:underline;text-decoration-color:var(--eixo);text-underline-offset:2px}\na.link-ext:hover{text-decoration-color:var(--marca)}\n.dica .txt{white-space:normal;color:#d7e1e8}\n\n/* dica ao passar o mouse */\n.dica{position:fixed;z-index:10;pointer-events:none;background:#0b1219;color:#eef3f6;border:1px solid rgba(255,255,255,.12);\n  border-radius:10px;padding:9px 11px;font-size:12px;line-height:1.5;box-shadow:0 8px 24px rgba(0,0,0,.35);max-width:280px;\n  opacity:0;transition:opacity .1s}\n.dica.on{opacity:1}\n.dica b{display:block;font-weight:700;margin-bottom:3px}\n.dica .l{display:flex;justify-content:space-between;gap:16px;font-variant-numeric:tabular-nums}\n.dica .l span{color:#aab8c4;display:inline-flex;align-items:center;gap:6px}\n.dica .l i{width:8px;height:8px;border-radius:2px;display:inline-block}\n\n/* porteiro */\n.porta{grid-column:1 / -1;display:grid;place-items:center;background:var(--faixa);padding:16px;overflow-y:auto}\n.porta .caixa{width:100%;max-width:400px;background:rgba(8,13,18,.86);color:#eef3f6;border:1px solid rgba(255,255,255,.1);\n  border-radius:18px;padding:30px 28px;box-shadow:0 20px 60px rgba(0,0,0,.35);backdrop-filter:blur(8px)}\n.porta .logo{padding:0 0 18px}\n.porta h2{font-family:var(--disp);font-weight:800;font-size:20px;letter-spacing:-.01em}\n.porta p{font-size:13px;color:#a9b8c4;margin-top:6px}\n.porta form{display:flex;flex-direction:column;gap:10px;margin-top:18px}\n.porta input{font-size:16px;padding:12px 14px;border-radius:11px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);\n  color:#fff;letter-spacing:.12em}\n.porta input::placeholder{letter-spacing:0;color:#7f909e}\n.porta button{background:#22c3c1;color:#04211f;border:0;border-radius:11px;padding:12px;font-weight:700;font-size:14px}\n.porta button:hover{filter:brightness(1.08)}\n.porta button[disabled]{opacity:.6;cursor:wait}\n.porta .msg{min-height:20px;font-size:12.5px;color:#ffb199}\n.porta .pe{font-size:11.5px;color:#7f909e;margin-top:16px;line-height:1.5}\n.carregando{padding:80px 34px;color:var(--mudo);font-size:13px}\n\n/* celular e telas estreitas */\n@media (max-width:1180px){ .g5{grid-template-columns:repeat(3,minmax(0,1fr))} .g4{grid-template-columns:repeat(2,minmax(0,1fr))} }\n@media (max-width:900px){\n  .sa{grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr)}\n  .lado{flex-direction:row;align-items:center;overflow-x:auto;overflow-y:hidden;border-right:0;border-bottom:1px solid rgba(255,255,255,.06)}\n  .lado .logo{padding:10px 12px}\n  .lado .logo div{display:none}\n  .nav{flex-direction:row;padding:0 4px;gap:0}\n  .nav a{padding:9px 10px;font-size:12.5px;white-space:nowrap;gap:7px}\n  .nav a.ativa::before{left:10px;right:10px;top:auto;bottom:0;width:auto;height:3px;border-radius:3px 3px 0 0}\n  .nav a .em-breve{display:none}\n  .nav a.sub{display:none}\n  .lado .rodape{margin:0 0 0 auto;flex-direction:row;padding:6px 10px;align-items:center}\n  .lado .rodape .relogio span,.lado .rodape button span{display:none}\n  .lado .rodape button{width:auto}\n  .faixa{padding:20px 16px 22px}\n  .faixa h1{font-size:22px}\n  .miolo{padding:16px 16px 40px}\n  .g2,.g3,.g-12,.g-21{grid-template-columns:minmax(0,1fr)}\n  .g4,.g5{grid-template-columns:repeat(2,minmax(0,1fr))}\n  .mostrador{grid-template-columns:minmax(0,1fr)}\n  .rosca{grid-template-columns:minmax(0,1fr);justify-items:center}\n  .rosca ul{width:100%}\n  .tile .val{font-size:22px}\n  .escolhas{grid-template-columns:repeat(2,minmax(0,1fr))}\n  .item-plano{grid-template-columns:30px minmax(0,1fr)}\n  .item-plano .lado-d{grid-column:2;align-items:flex-start;text-align:left;flex-direction:row;flex-wrap:wrap}\n  .form{grid-template-columns:minmax(0,1fr)}\n  .abas.parceiros{flex-wrap:nowrap;overflow-x:auto}\n  .retratil > .cab{grid-template-columns:auto minmax(0,1fr);padding:12px 14px}\n  .retratil > .cab .dir{grid-column:1 / -1;justify-content:flex-start;gap:14px}\n  .mini{align-items:flex-start}\n  .cadeia .cab-c{flex-direction:column}\n  .cadeia .tags{justify-content:flex-start;max-width:none}\n  .camadas{grid-template-columns:minmax(0,1fr)}\n  .retratil > .conteudo{padding:14px 12px 14px}\n  .cal .sem,.cal .grade-cal{gap:4px}\n  .cal .d{min-height:50px;padding:4px 5px}\n  .cal .d .v{font-size:10.5px}\n  .filtros label{flex:1 1 140px;max-width:none}\n}\n@media (prefers-reduced-motion:reduce){ *{transition:none !important;scroll-behavior:auto !important} }\n";
/* kit.js — o que todas as páginas da Central SuperAdds dividem: porteiro (senha), sessão de 30 min,
   leitura dos dados cifrados, barra lateral, faixa, tema claro/escuro, gráficos e dica ao passar o
   mouse. O montar.py junta este arquivo, o kit.css e a página num arquivo só, dentro de uma função
   (as variáveis CFG e CSS vêm dele). A página chama SA.pagina({...}) e o resto acontece aqui. */

var SA = {};
(function () {
  var P = window.__SA_PREVIA || null;               // só a prévia local define isto
  if (P) { for (var k in P) { CFG[k] = P[k]; } }

  var enc = new TextEncoder();
  var estado = { sessao: null, expira: 0, chaves: null, relogio: null, def: null, dados: null };
  var raiz, sombra, dica;

  // ------------------------------------------------------------ utilidades
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function nf(casas) { return new Intl.NumberFormat("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas }); }
  var fmt = {
    num: function (v, c) { return v == null || isNaN(v) ? "—" : nf(c || 0).format(v); },
    reais: function (v, c) { return v == null || isNaN(v) ? "—" : "R$ " + nf(c == null ? 2 : c).format(v); },
    pct: function (v, c) { return v == null || isNaN(v) ? "—" : nf(c == null ? 1 : c).format(v) + "%"; },
    compacto: function (v) {
      if (v == null || isNaN(v)) return "—";
      var a = Math.abs(v), um = function (x) { return nf(1).format(x).replace(/,0$/, ""); };
      if (a >= 1e9) return um(v / 1e9) + " bi";
      if (a >= 1e6) return um(v / 1e6) + " mi";
      if (a >= 1e4) return um(v / 1e3) + " mil";
      return nf(0).format(v);
    },
    reaisCompacto: function (v) { return v == null || isNaN(v) ? "—" : "R$ " + fmt.compacto(v); },
    data: function (iso) { if (!iso) return "—"; var p = String(iso).slice(0, 10).split("-"); return p[2] + "/" + p[1]; },
    dataLonga: function (iso) { if (!iso) return "—"; var p = String(iso).slice(0, 10).split("-"); return p[2] + "/" + p[1] + "/" + p[0]; },
    semana: function (iso) {
      var d = new Date(String(iso).slice(0, 10) + "T12:00:00");
      return ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"][d.getDay()];
    }
  };

  var ICONES = {
    casa: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    carteira: '<rect x="3" y="6" width="18" height="14" rx="2.5"/><path d="M3 10h18"/><path d="M16 15h2"/><path d="M6 6l9-3 1.5 3"/>',
    alvo: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
    codigo: '<path d="M8 8l-4 4 4 4"/><path d="M16 8l4 4-4 4"/><path d="M13.5 5l-3 14"/>',
    calc: '<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M8 7h8"/><path d="M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>',
    sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    lua: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    cadeado: '<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    sair: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 16l-4-4 4-4"/><path d="M6 12h10"/>',
    alerta: '<path d="M12 3l9.5 17h-19z"/><path d="M12 10v4"/><path d="M12 17h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
    seta: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
    pulso: '<path d="M3 12h4l2-6 4 12 2-6h6"/>',
    loja: '<path d="M4 9l1.5-5h13L20 9"/><path d="M4 9h16v2a3 3 0 0 1-5.3 1.9A3 3 0 0 1 12 14a3 3 0 0 1-2.7-1.1A3 3 0 0 1 4 11z"/><path d="M5.5 13.5V20h13v-6.5"/>',
    caixa: '<path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5L12 12l8.5-4.5"/><path d="M12 12v9"/>',
    recibo: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
    baixar: '<path d="M12 4v11"/><path d="M7 10l5 5 5-5"/><path d="M5 20h14"/>',
    play: '<path d="M7 5l12 7-12 7z"/>',
    nuvem: '<path d="M7 18a4.5 4.5 0 0 1-.5-9A6 6 0 0 1 18 8.5a4.5 4.5 0 0 1-.5 9.5z"/>',
    raio: '<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>',
    xis: '<path d="M6 6l12 12M18 6L6 18"/>',
    abre: '<path d="M9 6l6 6-6 6"/>',
    volta: '<path d="M15 6l-6 6 6 6"/>',
    calendario: '<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    relogio: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    pessoas: '<circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9.5" r="2.5"/><path d="M15.5 14.2A4.5 4.5 0 0 1 21 18.5"/>',
    busca: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    telefone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
    ia: '<path d="M11 3.5l1.9 5 5 1.9-5 1.9-1.9 5-1.9-5-5-1.9 5-1.9z"/><path d="M18.5 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>'
  };
  function icone(nome) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (ICONES[nome] || "") + "</svg>"; }

  function b64(s) { var b = atob(s), u = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; }

  function tema() { try { return localStorage.getItem("sa-tema") || "escuro"; } catch (e) { return "escuro"; } }
  function trocarTema() {
    var novo = raiz.classList.contains("claro") ? "escuro" : "claro";
    try { localStorage.setItem("sa-tema", novo); } catch (e) { /* sem armazenamento: vale só agora */ }
    raiz.classList.toggle("claro", novo === "claro");
    var b = sombra.querySelector("[data-tema]");
    if (b) b.innerHTML = icone(novo === "claro" ? "lua" : "sol") + "<span>" + (novo === "claro" ? "Tema escuro" : "Tema claro") + "</span>";
    if (estado.def && estado.dados) desenhar();
  }

  // ------------------------------------------------------------ montagem na LP
  function montar() {
    if (!document.getElementById("sa-fontes")) {
      var lk = document.createElement("link");
      lk.id = "sa-fontes"; lk.rel = "stylesheet";
      lk.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap";
      document.head.appendChild(lk);
    }
    var alvo = document.getElementById(CFG.alvo) || document.getElementById("central-superadds");
    if (!alvo) { alvo = document.createElement("div"); alvo.id = "central-superadds"; document.body.appendChild(alvo); }
    sombra = alvo.shadowRoot || alvo.attachShadow({ mode: "open" });
    sombra.innerHTML = "<style>" + CSS + "</style><div class=\"sa\"></div>";
    raiz = sombra.querySelector(".sa");
    raiz.classList.toggle("claro", tema() === "claro");
    try { document.documentElement.style.overflow = "hidden"; } catch (e) { /* a LP segue rolando */ }
    sombra.addEventListener("mousemove", moverDica);
    sombra.addEventListener("mouseleave", esconderDica, true);
    sombra.addEventListener("click", clique);
    sombra.addEventListener("change", mudou);
    sombra.addEventListener("input", digitou);
    document.addEventListener("visibilitychange", conferirRelogio);
    var largura = estreitoAgora(), espera;
    window.addEventListener("resize", function () {          // gráficos têm desenho próprio no celular
      clearTimeout(espera);
      espera = setTimeout(function () { if (estreitoAgora() !== largura) { largura = estreitoAgora(); if (estado.dados) desenhar(); } }, 200);
    });
  }

  // ------------------------------------------------------------ porteiro
  function porta(msg) {
    pararRelogio();
    estado.sessao = null; estado.chaves = null; estado.dados = null; estado.expira = 0;
    raiz.innerHTML =
      '<div class="porta"><div class="caixa">' +
      '<div class="logo"><span class="sig">' + icone("pulso") + '</span><div><b>Central SuperAdds</b><small>' + esc(CFG.titulo) + '</small></div></div>' +
      '<h2>Digite a senha</h2><p>' + esc(msg || "Os números desta página são só da equipe.") + '</p>' +
      '<form autocomplete="off"><input type="password" name="senha" placeholder="Senha" aria-label="Senha" autocomplete="current-password" required>' +
      '<div class="msg" role="status" aria-live="polite"></div><button type="submit">Entrar</button></form>' +
      '<div class="pe">A senha vale por 30 minutos. Ao recarregar a página ela é pedida de novo.</div>' +
      "</div></div>";
    var f = raiz.querySelector("form");
    var campo = f.querySelector("input");
    setTimeout(function () { try { campo.focus(); } catch (e) { /* */ } }, 50);
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      entrar(campo.value, f);
    });
  }

  function chamar(rota, corpo) {
    return fetch(CFG.porteiro + rota, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(corpo) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { status: r.status, j: j }; }); });
  }

  function entrar(senha, f) {
    var msg = f.querySelector(".msg"), bt = f.querySelector("button");
    bt.disabled = true; msg.textContent = "Conferindo…";
    chamar("/entrar", { senha: senha }).then(function (r) {
      bt.disabled = false;
      if (r.status === 200) { guardar(r.j); carregar(); return; }
      f.querySelector("input").value = "";
      var j = r.j || {};
      if (r.status === 401) {
        msg.textContent = "Senha incorreta." + (j.restam > 0 ? " Restam " + j.restam + (j.restam === 1 ? " tentativa." : " tentativas.") : "");
      } else if (r.status === 429) {
        msg.textContent = "Muitas tentativas erradas. Tente de novo em " + (j.espera_min || 15) + " min.";
      } else if (r.status === 423) {
        msg.textContent = "Acesso travado por excesso de tentativas. Tente de novo em " + (j.espera_min || 60) + " min.";
      } else if (r.status === 503) {
        msg.textContent = "O porteiro ainda não foi configurado na Cloudflare.";
      } else {
        msg.textContent = "O porteiro não respondeu. Tente de novo.";
      }
    }).catch(function () {
      bt.disabled = false;
      msg.textContent = "Sem conexão com o porteiro. Confira a internet e tente de novo.";
    });
  }

  function guardar(j) {
    if (j.sessao) estado.sessao = j.sessao;
    estado.expira = Number(j.expira) || 0;
    estado.chaves = j.chaves || {};
  }

  // Troca de página dentro da Central: a sessão vem no fim do endereço (#s=...) e sai dele na hora.
  // #aba=... abre a página já numa aba (itens da barra lateral como Comportamento, Rotina e Pessoas).
  function sessaoDoEndereco() {
    var h = location.hash || "", m = /(?:^#|&)s=([^&]+)/.exec(h), a = /(?:^#|&)aba=([a-z0-9_-]+)/.exec(h);
    if (a) estado.abaInicial = a[1];
    if (!m && !a) return null;
    try { history.replaceState(null, "", location.pathname + location.search); } catch (e) { location.hash = ""; }
    return m ? decodeURIComponent(m[1]) : null;
  }

  // ------------------------------------------------------------ relógio da sessão
  function restante() { return estado.expira - Date.now() / 1000; }
  function conferirRelogio() {
    if (!estado.sessao) return;
    var s = restante();
    if (s <= 0) { porta("Sua sessão de 30 minutos terminou. Digite a senha de novo."); return; }
    var el = sombra.querySelector("[data-relogio]");
    if (el) el.textContent = "Sessão: " + Math.max(1, Math.ceil(s / 60)) + " min";
  }
  function pararRelogio() { if (estado.relogio) { clearInterval(estado.relogio); estado.relogio = null; } }

  // ------------------------------------------------------------ dados
  function baixar(i) {
    if (i >= CFG.dados.length) return Promise.reject(new Error("dados"));
    return fetch(CFG.dados[i], { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .catch(function () { return baixar(i + 1); });
  }

  function abrir(pacote, chave) {
    return crypto.subtle.importKey("raw", b64(chave), "AES-GCM", false, ["decrypt"]).then(function (k) {
      return crypto.subtle.decrypt({ name: "AES-GCM", iv: b64(pacote.iv), additionalData: enc.encode(pacote.kid) }, k, b64(pacote.dados));
    }).then(function (bruto) {
      var fluxo = new Blob([bruto]).stream().pipeThrough(new DecompressionStream("gzip"));
      return new Response(fluxo).text();
    }).then(JSON.parse);
  }

  function chaveDe(pacote) {
    var c = estado.chaves && estado.chaves[CFG.pagina];
    return c && c[pacote.kid];
  }

  // Arquivo extra da página (ex.: recibos/2026-10-28.json), cifrado com a mesma chave; só é baixado quando pedido
  function lerCopia(caminho) {
    var fontes = CFG.dados.map(function (u) { return u.replace(/[^\/]*$/, "") + caminho; });
    var tenta = function (i) {
      if (i >= fontes.length) return Promise.reject(new Error("sem cópia"));
      return fetch(fontes[i], { cache: "no-store" }).then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
        .catch(function () { return tenta(i + 1); });
    };
    return tenta(0).then(function (pacote) {
      var chave = chaveDe(pacote);
      if (!chave) throw new Error("chave");
      return abrir(pacote, chave);
    });
  }

  function carregar(tentou) {
    raiz.innerHTML = '<div class="porta"><div class="caixa"><div class="logo"><span class="sig">' + icone("pulso") +
      '</span><div><b>Central SuperAdds</b><small>Abrindo ' + esc(CFG.titulo) + '…</small></div></div></div></div>';
    pararRelogio();
    estado.relogio = setInterval(conferirRelogio, 10000);
    baixar(0).then(function (pacote) {
      var chave = chaveDe(pacote);
      if (!chave) {
        if (tentou) throw new Error("chave");
        // Publicação nova chegando: busca as chaves de novo uma vez
        return new Promise(function (ok) { setTimeout(ok, 4000); })
          .then(function () { return chamar("/sessao", { sessao: estado.sessao }); })
          .then(function (r) { if (r.status !== 200) throw new Error("sessao"); guardar(r.j); return carregar(true); });
      }
      return abrir(pacote, chave).then(function (d) {
        estado.dados = d; estado.atualizado = pacote.atualizado;
        desenhar();
      });
    }).catch(function (e) {
      if (e && e.message === "sessao") { porta("Sua sessão terminou. Digite a senha de novo."); return; }
      try { console.error(e); if (P && P.registro) fetch(P.registro, { method: "POST", body: String(e && e.stack || e) }); } catch (x) { /* */ }
      raiz.innerHTML = '<div class="porta"><div class="caixa"><h2>Não deu para abrir os dados</h2><p>' +
        (e && e.message === "chave" ? "Os dados acabaram de ser atualizados. Recarregue a página em 1 minuto."
                                    : "Confira a internet e recarregue a página.") + "</p></div></div>";
    });
  }

  // ------------------------------------------------------------ casca: barra lateral + faixa
  function link(p) {
    var ativa = p.id === CFG.pagina;
    if (!p.url) return '<a aria-disabled="true">' + icone(p.icone) + "<span>" + esc(p.nome) + '</span><span class="em-breve">em breve</span></a>' +
      (p.abas || []).map(function (a) { return '<a class="sub" aria-disabled="true"><span>' + esc(a.nome) + "</span></a>"; }).join("");
    return '<a href="' + esc(p.url) + '" data-central="1"' + (ativa ? ' class="ativa" aria-current="page"' : "") + ">" +
      icone(p.icone) + "<span>" + esc(p.nome) + "</span></a>" +
      (p.abas || []).map(function (a) {
        var on = ativa && estado.abaAtual === a.id;
        return '<a class="sub' + (on ? " ativa" : "") + '" href="' + esc(p.url) + "#aba=" + esc(a.id) + '" data-central="1" data-pagina="' + esc(p.id) +
          '" data-aba="' + esc(a.id) + '"' + (on ? ' aria-current="page"' : "") + "><span>" + esc(a.nome) + "</span></a>";
      }).join("");
  }

  function desenhar(manter) {
    var def = estado.def, d = estado.dados;
    var antes = manter && raiz.querySelector(".corpo") ? raiz.querySelector(".corpo").scrollTop : 0;
    var ativo = sombra.activeElement, foco = null;          // a busca continua com o cursor depois de redesenhar
    if (ativo && ativo.getAttribute && ativo.getAttribute("data-digitar")) {
      foco = { acao: ativo.getAttribute("data-digitar"), ini: ativo.selectionStart, fim: ativo.selectionEnd };
    }
    var r = def.render(d, api);
    var f = r.faixa || {};
    estado.abaAtual = r.aba || null;
    var claro = raiz.classList.contains("claro");
    raiz.innerHTML =
      '<aside class="lado"><div class="logo"><span class="sig">' + icone("pulso") + '</span><div><b>SuperAdds</b><small>Central</small></div></div>' +
      '<nav class="nav" aria-label="Páginas">' + CFG.paginas.map(link).join("") + "</nav>" +
      '<div class="rodape"><div class="linha relogio"><i></i><span data-relogio></span></div>' +
      '<button type="button" data-tema>' + icone(claro ? "lua" : "sol") + "<span>" + (claro ? "Tema escuro" : "Tema claro") + "</span></button>" +
      '<button type="button" data-sair>' + icone("cadeado") + "<span>Bloquear</span></button></div></aside>" +
      '<main class="corpo"><header class="faixa">' +
      (f.trilha ? '<div class="trilha">' + esc(f.trilha) + "</div>" : "") +
      "<h1>" + esc(f.titulo || CFG.titulo) + "</h1>" + (f.sub ? '<div class="sub">' + f.sub + "</div>" : "") +
      (f.pilulas && f.pilulas.length ? '<div class="meta">' + f.pilulas.map(function (p) { return '<span class="pilula">' + p + "</span>"; }).join("") + "</div>" : "") +
      '</header><div class="miolo">' + r.html + "</div></main>" +
      '<div class="dica" role="tooltip"></div>';
    dica = raiz.querySelector(".dica");
    if (antes) raiz.querySelector(".corpo").scrollTop = antes;
    if (foco) {
      var campo = raiz.querySelector('[data-digitar="' + foco.acao + '"]');
      if (campo) { campo.focus(); try { campo.setSelectionRange(foco.ini, foco.fim); } catch (e) { /* */ } }
    }
    conferirRelogio();
    if (def.depois) def.depois(raiz, d, api);
  }

  // Filtros (select) e busca: a página muda o estado em def.acao e a tela se redesenha
  function mudou(ev) {
    var el = ev.target;
    var acao = el && el.getAttribute && el.getAttribute("data-mudar");
    if (!acao || !estado.def || !estado.def.acao) return;
    if (estado.def.acao(acao, el.value, api, el) !== false) desenhar(true);
  }
  var esperaDigitar;
  function digitou(ev) {
    var el = ev.target;
    var acao = el && el.getAttribute && el.getAttribute("data-digitar");
    if (!acao || !estado.def || !estado.def.acao) return;
    clearTimeout(esperaDigitar);
    esperaDigitar = setTimeout(function () {
      if (estado.def.acao(acao, el.value, api, el) !== false) desenhar(true);
    }, 250);
  }

  // Bloco que abre e fecha sem redesenhar a página; o estado fica guardado neste navegador
  function abertos() {
    if (!estado.abertos) {
      try { estado.abertos = JSON.parse(localStorage.getItem("sa-" + CFG.pagina + "-abertos") || "{}"); } catch (e) { estado.abertos = {}; }
    }
    return estado.abertos;
  }
  function aberto(id, padrao) { var a = abertos(); return id in a ? a[id] : Boolean(padrao); }
  function alternar(bt) {
    var bloco = bt.closest(".retratil"), id = bt.getAttribute("data-retratil");
    var on = !bloco.classList.contains("aberto");
    bloco.classList.toggle("aberto", on);
    bt.setAttribute("aria-expanded", String(on));
    abertos()[id] = on;
    try { localStorage.setItem("sa-" + CFG.pagina + "-abertos", JSON.stringify(estado.abertos)); } catch (e) { /* só nesta visita */ }
  }

  function clique(ev) {
    var rt = ev.target.closest && ev.target.closest("[data-retratil]");
    if (rt) { ev.preventDefault(); alternar(rt); return; }
    var a = ev.target.closest && ev.target.closest("a[data-central]");
    if (a && estado.sessao) {
      ev.preventDefault();
      var u = a.getAttribute("href").split("#")[0], aba = a.getAttribute("data-aba");
      if (aba && a.getAttribute("data-pagina") === CFG.pagina) {          // mesma página: só troca a aba
        if (estado.def.acao && estado.def.acao("aba", aba, api, a) !== false) desenhar();
        return;
      }
      if (a.classList.contains("ativa")) return;
      location.href = u + "#s=" + encodeURIComponent(estado.sessao) + (aba ? "&aba=" + encodeURIComponent(aba) : "");
      return;
    }
    if (ev.target.closest && ev.target.closest("[data-tema]")) { trocarTema(); return; }
    if (ev.target.closest && ev.target.closest("[data-sair]")) { porta("Página bloqueada. Digite a senha para voltar."); return; }
    var ac = ev.target.closest && ev.target.closest("[data-acao]");
    if (ac && estado.def && estado.def.acao) {          // troca de aba/visão: a página muda o estado e redesenha
      ev.preventDefault();
      if (estado.def.acao(ac.getAttribute("data-acao"), ac.getAttribute("data-valor"), api, ac) !== false) desenhar(true);
      return;
    }
    var alvo = ev.target.closest && ev.target.closest("[data-dica]");
    if (alvo) mostrarDica(alvo, ev);          // toque no celular
  }

  // ------------------------------------------------------------ dica ao passar o mouse
  function mostrarDica(alvo, ev) {
    if (!dica) return;
    dica.innerHTML = alvo.getAttribute("data-dica");
    dica.classList.add("on");
    var w = dica.offsetWidth, h = dica.offsetHeight;
    var x = ev.clientX + 14, y = ev.clientY + 14;
    if (x + w > window.innerWidth - 8) x = ev.clientX - w - 14;
    if (y + h > window.innerHeight - 8) y = ev.clientY - h - 14;
    dica.style.left = Math.max(8, x) + "px"; dica.style.top = Math.max(8, y) + "px";
  }
  function moverDica(ev) {
    var alvo = ev.target.closest && ev.target.closest("[data-dica]");
    if (alvo) mostrarDica(alvo, ev); else esconderDica();
  }
  function esconderDica() { if (dica) dica.classList.remove("on"); }

  function linhaDica(rot, val, cor) {
    return '<div class="l"><span>' + (cor ? '<i style="background:' + cor + '"></i>' : "") + esc(rot) + "</span><b>" + esc(val) + "</b></div>";
  }

  // ------------------------------------------------------------ gráficos
  function cor(n) { return "var(--s" + n + ")"; }
  function estreitoAgora() { return (window.innerWidth || 1000) < 700; }

  // Mostrador em arco (270°) com marcas, como o da referência. pct e marco de 0 a 100.
  function arco(opt) {
    var cx = 120, cy = 118, r = 92, ini = -135, vao = 270;
    function pt(rr, a) { var t = a * Math.PI / 180; return [cx + rr * Math.sin(t), cy - rr * Math.cos(t)]; }
    function caminho(rr, a0, a1) {
      var p0 = pt(rr, a0), p1 = pt(rr, a1);
      return "M" + p0[0].toFixed(2) + " " + p0[1].toFixed(2) + " A" + rr + " " + rr + " 0 " + (a1 - a0 > 180 ? 1 : 0) + " 1 " + p1[0].toFixed(2) + " " + p1[1].toFixed(2);
    }
    var pct = Math.max(0, Math.min(100, opt.pct || 0));
    var s = '<svg class="graf" viewBox="0 0 240 210" role="img" aria-label="' + esc(opt.rotulo) + '">';
    for (var i = 0; i <= 40; i++) {
      var a = ini + vao * i / 40, maior = i % 10 === 0;
      var p0 = pt(r + 10, a), p1 = pt(r + (maior ? 19 : 15), a);
      s += '<line x1="' + p0[0].toFixed(1) + '" y1="' + p0[1].toFixed(1) + '" x2="' + p1[0].toFixed(1) + '" y2="' + p1[1].toFixed(1) +
           '" stroke="var(--eixo)" stroke-width="' + (maior ? 1.6 : 1) + '"/>';
      if (maior) {
        var pl = pt(r + 30, a);
        s += '<text x="' + pl[0].toFixed(1) + '" y="' + (pl[1] + 3.5).toFixed(1) + '" text-anchor="middle">' + (i * 2.5) + "%</text>";
      }
    }
    s += '<path d="' + caminho(r, ini, ini + vao) + '" fill="none" stroke="var(--trilho)" stroke-width="12" stroke-linecap="round"/>';
    if (pct > 0) {
      s += '<path d="' + caminho(r, ini, ini + vao * pct / 100) + '" fill="none" stroke="' + (opt.cor || "var(--marca)") +
           '" stroke-width="12" stroke-linecap="round" data-dica="' + esc(opt.dica || "") + '"/>';
    }
    if (opt.marco != null) {
      var am = ini + vao * Math.max(0, Math.min(100, opt.marco)) / 100, m0 = pt(r - 14, am), m1 = pt(r + 8, am);
      s += '<line x1="' + m0[0].toFixed(1) + '" y1="' + m0[1].toFixed(1) + '" x2="' + m1[0].toFixed(1) + '" y2="' + m1[1].toFixed(1) +
           '" stroke="var(--tinta)" stroke-width="2.5" stroke-linecap="round" data-dica="' + esc(opt.dicaMarco || "") + '"/>';
    }
    s += '<text x="' + cx + '" y="' + (cy - 2) + '" text-anchor="middle" style="font:800 30px var(--disp);fill:var(--tinta)">' + esc(opt.centro) + "</text>";
    s += '<text x="' + cx + '" y="' + (cy + 20) + '" text-anchor="middle" style="font:500 12px var(--corpo);fill:var(--tinta2)">' + esc(opt.sob) + "</text>";
    return s + "</svg>";
  }

  // Rosca: até 4 fatias, com fresta de 2px entre elas e o total no meio.
  function rosca(fatias, centro, sob, formato) {
    var total = fatias.reduce(function (a, f) { return a + Math.max(0, f.valor); }, 0) || 1;
    var cx = 90, cy = 90, r = 68, e = 22, fresta = 2 / r * 180 / Math.PI;
    function pt(rr, a) { var t = a * Math.PI / 180; return [cx + rr * Math.sin(t), cy - rr * Math.cos(t)]; }
    var s = '<svg class="graf" viewBox="0 0 180 180" role="img" aria-label="' + esc(centro + " " + sob) + '">';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="var(--trilho)" stroke-width="' + e + '"/>';
    var a = 0, visiveis = fatias.filter(function (f) { return f.valor > 0; });
    visiveis.forEach(function (f) {
      var vao = 360 * f.valor / total, a0 = a + (visiveis.length > 1 ? fresta / 2 : 0), a1 = a + vao - (visiveis.length > 1 ? fresta / 2 : 0);
      a += vao;
      if (a1 <= a0) a1 = a0 + 0.6;
      var dica = "<b>" + esc(f.nome) + "</b>" + linhaDica("Valor", formato(f.valor)) + linhaDica("Parte", fmt.pct(100 * f.valor / total));
      if (vao >= 359.9) {
        s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + f.cor + '" stroke-width="' + e + '" data-dica="' + esc(dica) + '"/>';
        return;
      }
      var p0 = pt(r, a0), p1 = pt(r, a1);
      s += '<path d="M' + p0[0].toFixed(2) + " " + p0[1].toFixed(2) + " A" + r + " " + r + " 0 " + (a1 - a0 > 180 ? 1 : 0) + " 1 " +
           p1[0].toFixed(2) + " " + p1[1].toFixed(2) + '" fill="none" stroke="' + f.cor + '" stroke-width="' + e + '" data-dica="' + esc(dica) + '"/>';
    });
    s += '<text x="90" y="88" text-anchor="middle" style="font:800 19px var(--disp);fill:var(--tinta)">' + esc(centro) + "</text>";
    s += '<text x="90" y="106" text-anchor="middle" style="font:500 11px var(--corpo);fill:var(--mudo)">' + esc(sob) + "</text>";
    return s + "</svg>";
  }

  function passo(max) {
    if (max <= 0) return 1;
    var bruto = max / 4, mag = Math.pow(10, Math.floor(Math.log10(bruto))), n = bruto / mag;
    return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * mag;
  }

  // Colunas (empilhadas ou não) com um eixo só, topo arredondado de 4px e fresta de 2px entre as partes.
  function colunas(opt) {
    // opt.meia: o gráfico fica em meio cartão (desenha mais estreito para o texto não encolher)
    var estreito = estreitoAgora(), W = estreito ? 400 : opt.meia ? 480 : 860, H = opt.altura || (estreito ? 220 : 250), esq = estreito || opt.meia ? 44 : 54, dir = 8, topo = 12, base = 30;
    var n = opt.rotulos.length, larg = (W - esq - dir) / Math.max(1, n);
    var totais = opt.rotulos.map(function (_, i) {
      return opt.series.reduce(function (a, s) { return a + (opt.empilhar ? Math.max(0, s.valores[i] || 0) : 0); }, 0) ||
             Math.max.apply(null, opt.series.map(function (s) { return s.valores[i] || 0; }));
    });
    var p = passo(Math.max.apply(null, totais.concat([0]))), max = Math.max(p, Math.ceil(Math.max.apply(null, totais.concat([0])) / p) * p);
    var y = function (v) { return topo + (H - topo - base) * (1 - v / max); };
    var s = '<svg class="graf" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(opt.rotulo || "") + '">';
    for (var v = 0; v <= max + 1e-9; v += p) {
      s += '<line class="' + (v === 0 ? "base" : "grade-l") + '" x1="' + esq + '" x2="' + (W - dir) + '" y1="' + y(v).toFixed(1) + '" y2="' + y(v).toFixed(1) + '"/>';
      s += '<text x="' + (esq - 8) + '" y="' + (y(v) + 4).toFixed(1) + '" text-anchor="end">' + esc((opt.eixo || fmt.compacto)(v)) + "</text>";
    }
    var bw = Math.max(3, Math.min(34, larg * 0.62)), cada = Math.max(1, Math.ceil(n / (estreito || opt.meia ? 6 : opt.maxRotulos || 12)));
    if (opt.agrupar) bw = Math.max(6, Math.min(56, larg * 0.78));
    opt.rotulos.forEach(function (rot, i) {
      var x = esq + larg * i + (larg - bw) / 2, acum = 0, partes = "";
      var vis = opt.series.map(function (sr, k) { return { k: k, v: Math.max(0, sr.valores[i] || 0) }; }).filter(function (q) { return q.v > 0; });
      if (opt.agrupar) {                                    // lado a lado, com fresta de 2px entre as séries
        var ns = opt.series.length, bi = (bw - 2 * (ns - 1)) / ns;
        vis.forEach(function (q) {
          var xi = x + q.k * (bi + 2), y1 = y(q.v), h = y(0) - y1, rr = Math.min(4, h, bi / 2);
          if (h <= 0) return;
          partes += '<path d="M' + xi.toFixed(1) + " " + y(0).toFixed(1) + " V" + (y1 + rr).toFixed(1) + " Q" + xi.toFixed(1) + " " + y1.toFixed(1) + " " +
            (xi + rr).toFixed(1) + " " + y1.toFixed(1) + " H" + (xi + bi - rr).toFixed(1) + " Q" + (xi + bi).toFixed(1) + " " + y1.toFixed(1) + " " +
            (xi + bi).toFixed(1) + " " + (y1 + rr).toFixed(1) + " V" + y(0).toFixed(1) + ' Z" fill="' + opt.series[q.k].cor + '"/>';
        });
        vis = [];
      }
      vis.forEach(function (q, j) {
        var sr = opt.series[q.k], y0 = y(acum), y1 = y(acum + q.v), h = y0 - y1 - (j > 0 ? 2 : 0);
        acum += q.v;
        if (h <= 0) return;
        var ultimo = j === vis.length - 1, rr = ultimo ? Math.min(4, h, bw / 2) : 0;
        partes += '<path d="M' + x.toFixed(1) + " " + (y1 + h).toFixed(1) + " V" + (y1 + rr).toFixed(1) +
          (rr ? " Q" + x.toFixed(1) + " " + y1.toFixed(1) + " " + (x + rr).toFixed(1) + " " + y1.toFixed(1) : "") +
          " H" + (x + bw - rr).toFixed(1) +
          (rr ? " Q" + (x + bw).toFixed(1) + " " + y1.toFixed(1) + " " + (x + bw).toFixed(1) + " " + (y1 + rr).toFixed(1) : "") +
          " V" + (y1 + h).toFixed(1) + ' Z" fill="' + sr.cor + '"/>';
      });
      s += '<g class="col"><rect class="realce" x="' + (esq + larg * i).toFixed(1) + '" y="' + topo + '" width="' + larg.toFixed(1) + '" height="' + (H - topo - base) + '"/>' +
           partes + '<rect class="alvo" x="' + (esq + larg * i).toFixed(1) + '" y="' + topo + '" width="' + larg.toFixed(1) + '" height="' + (H - topo - base) +
           '" data-dica="' + esc(opt.dica ? opt.dica(i) : rot) + '"/></g>';
      if (i % cada === 0) {
        s += '<text x="' + (esq + larg * i + larg / 2).toFixed(1) + '" y="' + (H - base + 18) + '" text-anchor="middle">' + esc(rot) + "</text>";
      }
    });
    return s + "</svg>";
  }

  // Barras horizontais com rótulo e valor escritos (sem depender da cor).
  function barras(itens, formato) {
    var max = Math.max.apply(null, itens.map(function (i) { return i.valor; }).concat([1e-9]));
    return '<div class="barras">' + itens.map(function (it) {
      return '<div class="barra" data-dica="' + esc("<b>" + esc(it.nome) + "</b>" + linhaDica("Valor", formato(it.valor)) + (it.dica || "")) + '">' +
        '<div class="linha"><span>' + esc(it.nome) + "</span><b>" + esc(formato(it.valor)) + (it.nota ? "<small>" + esc(it.nota) + "</small>" : "") + "</b></div>" +
        '<div class="t"><i style="width:' + Math.max(0.5, 100 * it.valor / max).toFixed(2) + "%;background:" + (it.cor || "var(--marca)") + '"></i></div></div>';
    }).join("") + "</div>";
  }

  function tile(rot, val, nota, barra) {
    return '<div class="tile"' + (barra ? ' style="--barra:' + barra + '"' : "") + '><div class="rot">' + esc(rot) + '</div><div class="val">' + val +
      "</div>" + (nota ? '<div class="nota">' + nota + "</div>" : "") + "</div>";
  }

  function aviso(texto, tipo) {
    return '<div class="aviso' + (tipo === "info" ? " info" : "") + '">' + icone(tipo === "info" ? "info" : "alerta") + "<div>" + texto + "</div></div>";
  }

  function secao(titulo, nota) { return '<div class="secao"><h2>' + esc(titulo) + "</h2>" + (nota ? "<span>" + esc(nota) + "</span>" : "") + "</div>"; }

  // Abas numa linha (role tab); cada uma chama def.acao(acao, id).
  function abas(lista, atual, acao, classe) {
    return '<div class="abas' + (classe ? " " + classe : "") + '" role="tablist">' + lista.map(function (a) {
      var sel = a.id === atual;
      return '<button type="button" role="tab" aria-selected="' + sel + '" class="' + (sel ? "on" : "") + '" data-acao="' + esc(acao) +
        '" data-valor="' + esc(a.id) + '">' + (a.cor ? '<i style="background:' + a.cor + '"></i>' : "") + esc(a.nome) +
        (a.nota ? "<small>" + esc(a.nota) + "</small>" : "") + "</button>";
    }).join("") + "</div>";
  }

  // Tabela: colunas [{t: título, k: chave ou função, f: formato, esq: true}], linhas = objetos.
  function tabela(colunas, linhas, opt) {
    opt = opt || {};
    var val = function (c, l) { return typeof c.k === "function" ? c.k(l) : l[c.k]; };
    return '<div class="tabela-caixa"' + (opt.altura ? ' style="max-height:' + opt.altura + 'px"' : "") + '><table class="t"' +
      (opt.min ? ' style="min-width:' + opt.min + 'px"' : "") + "><thead><tr>" +
      colunas.map(function (c) { return "<th" + (c.esq ? ' style="text-align:left"' : "") + ">" + esc(c.t) + "</th>"; }).join("") + "</tr></thead><tbody>" +
      (linhas.length ? linhas.map(function (l) {
        return "<tr>" + colunas.map(function (c) {
          var v = val(c, l);
          return "<td" + (c.esq ? ' style="text-align:left;white-space:normal"' : "") + ">" + (c.html ? v : esc(c.f ? c.f(v) : v == null ? "—" : v)) + "</td>";
        }).join("") + "</tr>";
      }).join("") : '<tr><td colspan="' + colunas.length + '" style="text-align:left;color:var(--mudo)">' + esc(opt.vazio || "Sem dados no período.") + "</td></tr>") +
      "</tbody>" + (opt.rodape ? "<tfoot><tr>" + opt.rodape.map(function (x) { return "<td>" + esc(x == null ? "" : x) + "</td>"; }).join("") + "</tr></tfoot>" : "") +
      "</table></div>";
  }

  // Bloco retrátil: {id, titulo, sub, direita (html), corpo (html), aberto (padrão), leve (dentro de cartão)}
  function retratil(o) {
    var on = aberto(o.id, o.aberto);
    return '<section class="retratil' + (o.leve ? " leve" : "") + (on ? " aberto" : "") + '">' +
      '<button type="button" class="cab" data-retratil="' + esc(o.id) + '" aria-expanded="' + on + '">' +
      '<span class="seta">' + icone("abre") + "</span><span class=\"tit\">" + (o.icone ? '<span class="ic">' + icone(o.icone) + "</span>" : "") +
      (o.antes || "") + "<span><b>" + esc(o.titulo) + "</b>" +
      (o.sub ? "<small>" + o.sub + "</small>" : "") + "</span></span>" +
      (o.direita ? '<span class="dir">' + o.direita + "</span>" : "") + "</button>" +
      '<div class="conteudo">' + o.corpo + "</div></section>";
  }

  // Número pequeno para o cabeçalho de um bloco retrátil
  function mini(rot, val) { return '<span class="mini"><b>' + esc(val) + "</b><small>" + esc(rot) + "</small></span>"; }

  // Etiqueta de situação: sempre com ícone e texto (a cor nunca vem sozinha). tipo: bom | atencao | critico | neutro
  function tag(texto, tipo) {
    var ic = { bom: "check", atencao: "relogio", critico: "xis" }[tipo] || "info";
    return '<span class="tag ' + (tipo || "neutro") + '">' + icone(ic) + esc(texto) + "</span>";
  }

  // Uso de um limite (Cloudflare): rótulo, usado / limite e a barra
  function uso(rot, usado, limite, formato, nota) {
    var pct = limite ? Math.min(100, 100 * (usado || 0) / limite) : 0;
    return '<div class="uso"><div class="linha"><span>' + esc(rot) + (nota ? "<small> · " + esc(nota) + "</small>" : "") + "</span><b>" +
      esc(usado == null ? "—" : formato(usado)) + (limite ? "<small> / " + esc(formato(limite)) + "</small>" : "") + "</b></div>" +
      (limite && usado != null ? '<div class="t" role="img" aria-label="' + esc(fmt.pct(pct, 1) + " do limite") + '"><i style="width:' + Math.max(pct > 0 ? 0.8 : 0, pct).toFixed(2) + '%"></i></div>' +
        '<small class="pct">' + esc(fmt.pct(pct, pct < 1 ? 2 : 1)) + " do limite</small>" : "") + "</div>";
  }

  // Filtros numa linha: lista [{id, nome, opcoes:[{v, n}]}], valores {id: v}; cada select chama def.acao("filtro:" + id, valor)
  function filtros(lista, valores, extra) {
    return '<div class="filtros">' + lista.map(function (f) {
      var atual = valores[f.id] || "";
      return "<label>" + esc(f.nome) + '<select data-mudar="filtro:' + esc(f.id) + '"><option value="">Todos</option>' +
        f.opcoes.map(function (o) {
          return '<option value="' + esc(o.v) + '"' + (atual !== "" && String(o.v) === String(atual) ? " selected" : "") + ">" + esc(o.n == null ? o.v : o.n) + "</option>";
        }).join("") + "</select></label>";
    }).join("") + (extra || "") + "</div>";
  }

  // Calendário de um mês: {mes: "AAAA-MM", meses: [...] (com dado), dias: {iso: {valor, dica, int (0-1)}}, sel, acao, acaoMes}
  var MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  function calendario(o) {
    var p = o.mes.split("-"), ano = Number(p[0]), m = Number(p[1]) - 1;
    var i = o.meses.indexOf(o.mes), ant = i > 0 ? o.meses[i - 1] : null, prox = i >= 0 && i < o.meses.length - 1 ? o.meses[i + 1] : null;
    var primeiro = new Date(ano, m, 1).getDay(), total = new Date(ano, m + 1, 0).getDate();
    var s = '<div class="cal"><div class="cab-cal"><b>' + MESES[m].charAt(0).toUpperCase() + MESES[m].slice(1) + " de " + ano + '</b><span class="navs">' +
      '<button type="button" aria-label="Mês anterior"' + (ant ? ' data-acao="' + esc(o.acaoMes) + '" data-valor="' + ant + '"' : " disabled") + ">" + icone("volta") + "</button>" +
      '<button type="button" aria-label="Próximo mês"' + (prox ? ' data-acao="' + esc(o.acaoMes) + '" data-valor="' + prox + '"' : " disabled") + ">" + icone("abre") + "</button></span></div>" +
      '<div class="sem">' + ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"].map(function (d) { return "<span>" + d + "</span>"; }).join("") + "</div>" +
      '<div class="grade-cal">';
    for (var k = 0; k < primeiro; k++) s += '<span class="d vazio"></span>';
    for (var dia = 1; dia <= total; dia++) {
      var iso = o.mes + "-" + (dia < 10 ? "0" : "") + dia, x = o.dias[iso];
      if (!x) { s += '<span class="d sem-dado"><span class="n">' + dia + "</span></span>"; continue; }
      s += '<button type="button" class="d' + (o.sel === iso ? " on" : "") + '" style="--int:' + Math.max(0, Math.min(1, x.int || 0)).toFixed(3) + '" data-acao="' +
        esc(o.acao) + '" data-valor="' + iso + '"' + (x.dica ? ' data-dica="' + esc(x.dica) + '"' : "") + ' aria-label="' + esc(dia + " de " + MESES[m] + ": " + x.valor) + '">' +
        '<span class="n">' + dia + '</span><span class="v">' + esc(x.valor) + "</span></button>";
    }
    return s + "</div></div>";
  }

  // Chamada ao vivo no porteiro (página Desenvolvedor), com a sessão.
  function chamarDev(rota, corpo) {
    var op = { method: corpo === undefined ? "GET" : "POST", headers: { authorization: "Bearer " + (estado.sessao || "") } };
    if (corpo !== undefined) { op.headers["content-type"] = "application/json"; op.body = JSON.stringify(corpo); }
    return fetch(CFG.porteiro + rota, op).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (r.status === 401) { porta("Sua sessão terminou. Digite a senha de novo."); throw new Error("sessao"); }
        return { status: r.status, j: j };
      });
    });
  }

  function baixarArquivo(nome, texto, tipo) {
    var url = URL.createObjectURL(new Blob([texto], { type: tipo || "text/plain;charset=utf-8" }));
    var a = document.createElement("a");
    a.href = url; a.download = nome; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 500);
  }

  function lembrar(chave, valor) {
    var k = "sa-" + CFG.pagina + "-" + chave;
    try { if (valor === undefined) return localStorage.getItem(k); localStorage.setItem(k, valor); } catch (e) { /* só nesta visita */ }
    return valor;
  }

  var api = { esc: esc, fmt: fmt, icone: icone, cor: cor, arco: arco, rosca: rosca, colunas: colunas, barras: barras, tile: tile,
              aviso: aviso, secao: secao, linhaDica: linhaDica, cfg: function () { return CFG; },
              url: function (id) { var p = CFG.paginas.filter(function (x) { return x.id === id; })[0]; return p && p.url; },
              abas: abas, tabela: tabela, chamarDev: chamarDev, lerCopia: lerCopia, baixarArquivo: baixarArquivo, lembrar: lembrar,
              retratil: retratil, aberto: aberto, mini: mini, tag: tag, uso: uso, filtros: filtros, calendario: calendario,
              redesenhar: function () { desenhar(true); }, previa: function () { return Boolean(P); },
              abaInicial: function () { var a = estado.abaInicial; estado.abaInicial = null; return a; },
              atualizado: function () { return estado.atualizado; } };

  // ------------------------------------------------------------ entrada
  SA.pagina = function (def) {
    if (window["__sa_" + CFG.pagina]) return;
    window["__sa_" + CFG.pagina] = true;
    estado.def = def;
    var iniciar = function () {
      montar();
      var s = sessaoDoEndereco();
      if (!s) { porta(); return; }
      chamar("/sessao", { sessao: s }).then(function (r) {
        if (r.status === 200) { estado.sessao = s; guardar(r.j); carregar(); }
        else porta("Sua sessão terminou. Digite a senha de novo.");
      }).catch(function () { porta(); });
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar); else iniciar();
  };
  SA.api = api;
})();

/* personas.js — Personas: Comportamento, Rotina e Pessoas, as mesmas páginas do ADS-02, com os mesmos filtros.
   Os números são refeitos aqui no navegador, a partir das linhas que o estudo grava no SharePoint às 7h (Power BI:
   ADS-01 + MKT 63, sem DBeaver). O retrato por extenso segue as medidas do ADS-02; a leitura da IA (Groq) é da base
   inteira. Por pessoa só existe o código (pseudônimo). Dados: central/personas.json (personas.py), cifrado. */

var PER = { aba: null, f: {}, busca: "", pag: 0 };
var PER_FILTROS = [{ id: "varejista", nome: "Varejista" }, { id: "loja", nome: "Loja habitual" }, { id: "persona", nome: "Persona" },
                   { id: "rotina", nome: "Rotina" }, { id: "faixa_etaria", nome: "Faixa etária" }, { id: "situacao", nome: "Situação" }];
var PER_VAZIO = { faixa_etaria: "Sem cadastro", genero: "Sem cadastro", classe: "Sem renda no cadastro", renda: "Sem renda no cadastro",
                  janela: "Ainda sem janela", turno_le: "Não leu", turno_compra: "Sem padrão", confianca: "Sem dados", loja: "Sem loja",
                  varejista: "Sem varejista", persona: "Sem persona", situacao: "Sem situação" };
var PER_ORDEM = { faixa_etaria: ["18–24", "25–34", "35–44", "45–54", "55–64", "65+", ""], classe: ["A", "B", "C", "D/E", ""],
                  renda: ["até R$ 1,5 mil", "R$ 1,5–3 mil", "R$ 3–5 mil", "R$ 5–10 mil", "R$ 10 mil+", ""],
                  turno: ["madrugada", "manhã", "almoço", "tarde", "noite", ""], confianca: ["padrão", "pista", ""] };
var PER_TURNO = { "manhã": "de manhã", tarde: "à tarde", "almoço": "no almoço", noite: "à noite", madrugada: "de madrugada" };
var PER_DIA = { segunda: "às segundas", "terça": "às terças", quarta: "às quartas", quinta: "às quintas", sexta: "às sextas",
                "sábado": "aos sábados", domingo: "aos domingos" };
var POR_PAGINA = 50;
var PER_SEM = "(vazio)";            // valor do filtro para "sem cadastro", "sem janela" etc. ("" é "Todos")

function perRot(d, campo, i) { var v = d.dic[campo === "loja_envio" ? "loja_envio" : campo][i]; return v === "" ? (PER_VAZIO[campo] || "—") : v; }
function perCurta(loja) { return String(loja || "").replace(/^AYUMI - /, ""); }
function mediana(xs) { if (!xs.length) return null; var s = xs.slice().sort(function (a, b) { return a - b; }), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; }
function media(xs) { return xs.length ? xs.reduce(function (a, b) { return a + b; }, 0) / xs.length : null; }
function pctTxt(ui, a, b) { return b ? ui.fmt.pct(100 * a / b, 0) : "—"; }

// Pessoas que passam nos filtros (índices) e o resumo dos envios delas
function perSelecao(d) {
  var P = d.pessoas, n = P.cod.length, sel = [], marca = new Uint8Array(n);
  var alvo = {};
  PER_FILTROS.forEach(function (f) {
    var v = PER.f[f.id];
    if (v !== undefined && v !== "") alvo[f.id] = d.dic[f.id].indexOf(v === PER_SEM ? "" : v);
  });
  for (var i = 0; i < n; i++) {
    var ok = true;
    for (var k in alvo) { if (P[k][i] !== alvo[k]) { ok = false; break; } }
    if (ok) { sel.push(i); marca[i] = 1; }
  }
  return { idx: sel, marca: marca };
}

function perEnvios(d, marca) {
  var E = d.envios, st = d.dic.status, r = { enviadas: 0, entregues: 0, leram: 0, responderam: 0, naoEnt: 0, falhas: {}, nFalhas: 0, mins: [],
    porHora: {}, leituraHora: new Array(24).fill(0), alcancadas: 0 };
  var viu = new Uint8Array(d.pessoas.cod.length);
  for (var j = 0; j < E.p.length; j++) {
    if (!marca[E.p[j]]) continue;
    var s = st[E.status[j]], h = Math.floor(E.hm[j] / 60), ent = s !== "Não entregue" && s !== "Sem status da Meta", leu = s === "Leu" || s === "Respondeu";
    if (!viu[E.p[j]]) { viu[E.p[j]] = 1; r.alcancadas++; }
    r.enviadas++;
    if (ent) r.entregues++;
    if (leu) r.leram++;
    if (s === "Respondeu") r.responderam++;
    if (s === "Não entregue") r.naoEnt++;
    var fa = d.dic.falha[E.falha[j]];
    if (fa) { r.falhas[fa] = (r.falhas[fa] || 0) + 1; r.nFalhas++; }
    var m = E.min_ler[j];
    if (m != null) r.mins.push(m);
    var ph = r.porHora[h] || (r.porHora[h] = { ent: 0, leu: 0, mins: [] });
    if (ent) ph.ent++;
    if (leu) ph.leu++;
    if (m != null) ph.mins.push(m);
    if (leu && m != null) r.leituraHora[Math.floor((E.hm[j] + m) / 60) % 24]++;
  }
  return r;
}

function contar(d, idx, campo) {
  var c = {}, col = d.pessoas[campo];
  idx.forEach(function (i) { c[col[i]] = (c[col[i]] || 0) + 1; });
  return c;
}
// Valor mais comum (ignorando o vazio): [rótulo, pessoas]
function topo(d, idx, campo) {
  var c = contar(d, idx, campo), melhor = null;
  for (var k in c) { if (d.dic[campo][k] === "") continue; if (!melhor || c[k] > melhor[1]) melhor = [d.dic[campo][k], c[k]]; }
  return melhor;
}
function nums(d, idx, campo) { var col = d.pessoas[campo], out = []; idx.forEach(function (i) { if (col[i] != null) out.push(col[i]); }); return out; }

// O caixa das lojas que essas pessoas frequentam (todos os clientes da loja, não só quem recebeu mensagem)
function perCaixa(d, idx) {
  var lojas = {}, cx = d.caixa.lojas, horas = new Array(24).fill(0), semana = {}, dias = 0, nl = 0;
  idx.forEach(function (i) { var l = d.dic.loja[d.pessoas.loja[i]]; if (l && cx[l]) lojas[l] = 1; });
  Object.keys(lojas).forEach(function (l) {
    nl++; dias = Math.max(dias, cx[l].dias);
    cx[l].horas.forEach(function (v, h) { horas[h] += v; });
    for (var s in cx[l].semana) semana[s] = (semana[s] || 0) + cx[l].semana[s];
  });
  var tot = horas.reduce(function (a, b) { return a + b; }, 0);
  if (!tot) return null;
  var hp = horas.indexOf(Math.max.apply(null, horas)), diaPico = null;
  for (var s2 in semana) if (!diaPico || semana[s2] > semana[diaPico]) diaPico = s2;
  return { hp: hp, pPico: horas[hp] / tot, nLojas: nl, dias: dias, diaPico: diaPico, horas: horas, tot: tot };
}

// ---------------------------------------------------------------- retrato por extenso (as medidas do ADS-02)
function perRetrato(ui, d, idx, ev, cx) {
  var f = ui.fmt, n = ev.alcancadas || idx.length;
  if (!idx.length) return { quem: "Nenhuma pessoa com estes filtros.", compras: "", reacao: "", rotina: "", acao: "" };
  var cg = contar(d, idx, "genero"), vazioG = d.dic.genero.indexOf(""), comCad = idx.length - (cg[vazioG] || 0);
  var tg = topo(d, idx, "genero"), ti = topo(d, idx, "faixa_etaria"), cIdade = idx.length - (contar(d, idx, "faixa_etaria")[d.dic.faixa_etaria.indexOf("")] || 0);
  var cRenda = idx.length - (contar(d, idx, "classe")[d.dic.classe.indexOf("")] || 0), tc = topo(d, idx, "classe"), tr = topo(d, idx, "renda");
  var cid = topo(d, idx, "cidade_compra");
  var quem = f.num(n) + " pessoas receberam mensagens" + (cid ? ", a maioria compra em " + cid[0] : "") + ". " +
    (!comCad ? "Ainda não há cadastro com gênero e idade dessas pessoas. " :
      "Entre as " + f.num(comCad) + " com cadastro (" + pctTxt(ui, comCad, idx.length) + " da base), " + pctTxt(ui, tg[1], comCad) + " são " +
      (tg[0] === "Mulher" ? "mulheres" : "homens") + (ti ? " e a faixa de idade mais comum é " + ti[0] + " anos (" + pctTxt(ui, ti[1], cIdade) + ")" : "") + ". ") +
    (cRenda && tc ? "Pela renda do bureau, a classe estimada mais comum é " + tc[0] + " (" + pctTxt(ui, tc[1], cRenda) + " de quem tem renda)" +
      (tr ? ", na faixa de " + tr[0] : "") + "." : "");

  var freq = media(nums(d, idx, "compras_semana")), ticket = mediana(nums(d, idx, "ticket")), gasto = mediana(nums(d, idx, "gasto_mes"));
  var fds = media(nums(d, idx, "fds_pct")), th = topo(d, idx, "hora_compra"), td = topo(d, idx, "dia_compra"), tp = topo(d, idx, "pagamento"), tl = topo(d, idx, "loja");
  var compras = freq == null ? "Ainda não há compras dessas pessoas nos últimos 90 dias." :
    "Nos últimos 90 dias, compraram em média " + f.num(freq, 1) + " vezes por semana, com ticket típico de " + f.reais(ticket) +
    " e gasto típico de " + f.reais(gasto, 0) + " por mês. " +
    (th ? "O mais comum é comprar " + (PER_TURNO[th[0]] || th[0]) + " (" + pctTxt(ui, th[1], idx.length) + " das pessoas)" + (td ? " e " + (PER_DIA[td[0]] || td[0]) : "") + "; " : "") +
    (fds != null ? "em média, " + f.pct(fds, 0) + " das compras de cada pessoa são no fim de semana. " : "") +
    (tp ? "Pagam mais com " + tp[0] + " (" + pctTxt(ui, tp[1], idx.length) + "). " : "") + (tl ? "Loja mais frequente: " + perCurta(tl[0]) + "." : "");

  var reacao;
  if (!ev.enviadas) reacao = "Nenhuma mensagem com estes filtros.";
  else {
    var horas = Object.keys(ev.porHora).filter(function (h) { return ev.porHora[h].ent >= 30; }).map(function (h) {
      return { h: Number(h), tx: ev.porHora[h].leu / ev.porHora[h].ent };
    }).sort(function (a, b) { return b.tx - a.tx; });
    var motivo = null;
    for (var m in ev.falhas) if (!motivo || ev.falhas[m] > ev.falhas[motivo]) motivo = m;
    reacao = f.num(ev.enviadas) + " mensagens enviadas: " + pctTxt(ui, ev.entregues, ev.enviadas) + " entregues e " + pctTxt(ui, ev.leram, ev.entregues) +
      " das entregues lidas. " + (ev.mins.length ? "Metade de quem leu, leu em até " + f.num(mediana(ev.mins)) + " minutos (a média, puxada por quem demora, é de " +
      f.num(media(ev.mins)) + " min). " : "") +
      (horas.length >= 2 ? "Pela hora do envio, a leitura foi maior às " + (horas[0].h < 10 ? "0" : "") + horas[0].h + "h (" + f.pct(100 * horas[0].tx, 0) +
        ") e menor às " + (horas[horas.length - 1].h < 10 ? "0" : "") + horas[horas.length - 1].h + "h (" + f.pct(100 * horas[horas.length - 1].tx, 0) + "). " : "") +
      (ev.naoEnt ? f.num(ev.naoEnt) + " não foram entregues (" + pctTxt(ui, ev.naoEnt, ev.enviadas) + ")" +
        (motivo ? ", " + pctTxt(ui, ev.falhas[motivo], ev.nFalhas) + " delas por " + motivo : "") + ". " : "") +
      (ev.responderam ? f.num(ev.responderam) + " responderam." : "Nenhuma resposta registrada ainda.");
  }

  var cr = contar(d, idx, "rotina"), R = d.dic.rotina, de = function (nome) { var k = R.indexOf(nome); return k < 0 ? 0 : cr[k] || 0; };
  var ident = idx.length - de("Rotina indefinida"), padrao = contar(d, idx, "confianca")[d.dic.confianca.indexOf("padrão")] || 0;
  var tle = topo(d, idx, "turno_le"), tj = topo(d, idx, "janela");
  var comJanela = idx.length - (contar(d, idx, "janela")[d.dic.janela.indexOf("")] || 0);
  var caixa = cx ? " No caixa " + (cx.nLojas === 1 ? "da loja" : "das lojas que essas pessoas frequentam") + " (todos os clientes, " + cx.dias +
    " dias), o movimento é maior às " + (cx.hp < 10 ? "0" : "") + cx.hp + "h (" + f.pct(100 * cx.pPico, 0) + " das consultas do dia)" +
    (cx.diaPico ? " e " + (PER_DIA[cx.diaPico] || cx.diaPico) : "") + "." : "";
  var rotina = !ident ? "Ainda não há rotina identificada para estas pessoas: é preciso uma leitura ou compras suficientes." + caixa :
    "Das " + f.num(ident) + " pessoas com rotina identificada, " + pctTxt(ui, de("Disponível de dia"), ident) + " estão disponíveis de dia, " +
    pctTxt(ui, de("Rotina de trabalho"), ident) + " têm rotina de trabalho (longe do celular no expediente) e " + pctTxt(ui, de("Rotina mista"), ident) +
    " têm rotina mista. " + f.num(padrao) + " já são padrão confirmado; as demais ainda são pista e se confirmam com envios em outros horários. " +
    (tle ? "Quem lê, lê mais " + (PER_TURNO[tle[0]] || tle[0]) + ". " : "") +
    (tj ? "Melhor janela mais comum: " + tj[0] + " (" + pctTxt(ui, tj[1], comJanela) + " de quem já tem janela)." : "") + caixa;

  var ca = contar(d, idx, "acao"), A = d.dic.acao, ac = function (nome) { var k = A.indexOf(nome); return k < 0 ? 0 : ca[k] || 0; };
  var trab = de("Rotina de trabalho"), lote = cx ? Math.max(9, Math.min(18, cx.hp - 1)) : null, itens = [];
  if (ac("amarelo_teste")) itens.push(f.num(ac("amarelo_teste")) + " leem e não agem: no mesmo WhatsApp, testar outra oferta mudando só um degrau (oferta ou apelo), para descobrir o porquê.");
  if (ac("sem_whatsapp")) itens.push(f.num(ac("sem_whatsapp")) + " números não têm WhatsApp: mesma oferta por SMS, só com opt-in.");
  if (trab) itens.push(f.num(trab) + " têm rotina de trabalho: mandar no lote das 18h–19h.");
  if (cx && cx.hp >= 10) itens.push("O caixa enche às " + (cx.hp < 10 ? "0" : "") + cx.hp + "h: testar o lote das " + lote + "h–" + (lote + 1) + "h, para a oferta chegar pouco antes da ida à loja.");
  if (ac("sem_dados")) itens.push(f.num(ac("sem_dados")) + " ainda sem reação fechada: seguir a melhor aposta" + (tj ? ", de preferência " + tj[0].charAt(0).toLowerCase() + tj[0].slice(1) : "") + ".");
  return { quem: quem, compras: compras, reacao: reacao, rotina: rotina, acao: itens };
}

// ---------------------------------------------------------------- pedaços da tela
function perIA(ui, d, aba) {
  var x = (d.ia || {})[aba], esc = ui.esc;
  if (!x) return '<div class="cartao"><div class="topo"><div><h3>O que a IA viu</h3><div class="cap">a IA não respondeu hoje: os números acima valem</div></div></div></div>';
  var filtrado = Object.keys(PER.f).some(function (k) { return PER.f[k]; });
  return '<div class="cartao"><div class="topo"><div><h3>O que a IA viu</h3><div class="cap">leitura da base inteira, sem filtros · Groq, ' + esc(d.ia_em || "") +
    (filtrado ? " · os números acima seguem os seus filtros" : "") + '</div></div><span class="selo marca">' + ui.icone("raio") + "IA</span></div>" +
    '<div class="ia"><ul>' + x.pontos.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul>" +
    (x.acao ? '<p style="margin-top:12px"><b>Sugestão:</b> ' + esc(x.acao) + "</p>" : "") + "</div></div>";
}

function perDist(ui, d, idx, campo, ordem, cor, limite) {
  var c = contar(d, idx, campo), lista = d.dic[campo].map(function (v, k) { return { v: v, k: k, n: c[k] || 0 }; }).filter(function (x) { return x.n; });
  if (ordem) lista.sort(function (a, b) { return ordem.indexOf(a.v) - ordem.indexOf(b.v); }); else lista.sort(function (a, b) { return b.n - a.n; });
  var tot = idx.length, resto = limite && lista.length > limite ? lista.slice(limite) : [];
  if (resto.length) lista = lista.slice(0, limite);
  var itens = lista.map(function (x) {
    return { nome: x.v === "" ? PER_VAZIO[campo] || "—" : campo === "loja" ? perCurta(x.v) : x.v, valor: x.n, cor: cor || ui.cor(1), nota: pctTxt(ui, x.n, tot) };
  });
  if (resto.length) {
    var n = resto.reduce(function (a, x) { return a + x.n; }, 0);
    itens.push({ nome: "Outras " + resto.length + " (" + resto.slice(0, 3).map(function (x) { return x.v; }).join("; ") + "…)", valor: n, cor: ui.cor(7), nota: pctTxt(ui, n, tot) });
  }
  return ui.barras(itens, function (v) { return ui.fmt.num(v); });
}

function perCartao(titulo, cap, corpo) {
  return '<div class="cartao"><div class="topo"><div><h3>' + titulo + "</h3>" + (cap ? '<div class="cap">' + cap + "</div>" : "") + "</div></div>" + corpo + "</div>";
}

function perComportamento(ui, d, s, ev, cx) {
  var f = ui.fmt, esc = ui.esc, idx = s.idx, r = perRetrato(ui, d, idx, ev, cx), h = "";
  var tick = mediana(nums(d, idx, "ticket")), freq = media(nums(d, idx, "compras_semana"));
  h += '<div class="grade g5">' +
    ui.tile("Pessoas alcançadas", esc(f.num(ev.alcancadas)), f.num(idx.length) + " no filtro", "var(--s1)") +
    ui.tile("Taxa de leitura", esc(ev.entregues ? f.pct(100 * ev.leram / ev.entregues) : "—"), "<b>" + f.num(ev.leram) + "</b> leram de " + f.num(ev.entregues) + " entregues", "var(--s1)") +
    ui.tile("Típico até ler", esc(ev.mins.length ? f.num(mediana(ev.mins)) + " min" : "—"), "metade lê até aqui", "var(--s3)") +
    ui.tile("Ticket típico", esc(f.reais(tick)), "mediana do ticket médio", "var(--s2)") +
    ui.tile("Compras por semana", esc(freq == null ? "—" : f.num(freq, 1)), "média nos últimos 90 dias", "var(--s2)") + "</div>";
  h += ui.secao("Retrato por extenso", "calculado dos dados, como no ADS-02 · muda com os filtros");
  h += '<div class="cartao"><dl class="retrato"><dt>Quem são</dt><dd>' + esc(r.quem) + "</dd><dt>Como compram</dt><dd>" + esc(r.compras) +
    "</dd><dt>Como reagem</dt><dd>" + esc(r.reacao) + "</dd><dt>Rotina</dt><dd>" + esc(r.rotina) + "</dd><dt>O que fazer</dt><dd>" +
    (r.acao.length ? "<ul style=\"margin-left:18px\">" + r.acao.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" : "Nenhuma ação sugerida para estes filtros.") +
    "</dd></dl></div>";
  h += ui.secao("Quem é a base");
  h += '<div class="grade g3">' + perCartao("Situação de cada pessoa", "", perDist(ui, d, idx, "situacao")) +
    perCartao("Persona", "", perDist(ui, d, idx, "persona")) + perCartao("Loja habitual", "", perDist(ui, d, idx, "loja")) + "</div>";
  h += '<div class="grade g4" style="margin-top:14px">' + perCartao("Faixa etária", "", perDist(ui, d, idx, "faixa_etaria", PER_ORDEM.faixa_etaria)) +
    perCartao("Gênero", "", perDist(ui, d, idx, "genero")) +
    perCartao("Classe estimada", "pela renda do bureau", perDist(ui, d, idx, "classe", PER_ORDEM.classe)) +
    perCartao("Faixa de renda", "", perDist(ui, d, idx, "renda", PER_ORDEM.renda)) + "</div>";
  h += '<div style="margin-top:14px">' + perIA(ui, d, "comportamento") + "</div>";
  return h;
}

function perRotina(ui, d, s, ev, cx) {
  var f = ui.fmt, esc = ui.esc, idx = s.idx, r = perRetrato(ui, d, idx, ev, cx), h = "";
  h += '<div class="grade g4">' +
    ui.tile("Pessoas alcançadas", esc(f.num(ev.alcancadas)), "", "var(--s1)") +
    ui.tile("Leram", esc(f.num(ev.leram)), pctTxt(ui, ev.leram, ev.entregues) + " das entregues", "var(--s1)") +
    ui.tile("Típico até ler", esc(ev.mins.length ? f.num(mediana(ev.mins)) + " min" : "—"), "metade lê até aqui", "var(--s3)") +
    ui.tile("Média até ler", esc(ev.mins.length ? f.num(media(ev.mins)) + " min" : "—"), "puxada por quem demora", "var(--s3)") + "</div>";
  h += '<div class="cartao" style="margin-top:14px"><p style="font-size:14px;line-height:1.65">' + esc(r.rotina) + "</p></div>";

  // personalidade de rotina × confiança
  var R = d.dic.rotina.slice(), C = PER_ORDEM.confianca, cores = [ui.cor(3), ui.cor(1), ui.cor(7)];
  var tab = {}, P = d.pessoas;
  idx.forEach(function (i) { var k = P.rotina[i] + "|" + d.dic.confianca[P.confianca[i]]; tab[k] = (tab[k] || 0) + 1; });
  var rot = R.map(function (nome, k) { return { nome: nome, k: k, tot: C.reduce(function (a, c) { return a + (tab[k + "|" + c] || 0); }, 0) }; })
    .filter(function (x) { return x.tot; }).sort(function (a, b) { return b.tot - a.tot; });
  var nomesConf = { "padrão": "padrão (confirmada)", pista: "pista (a confirmar)", "": "sem dados" };
  h += '<div class="grade g2" style="margin-top:14px">' + perCartao("Personalidade de rotina", "padrão = confirmada; pista = a confirmar",
    ui.colunas({ rotulo: "Rotina por confiança", rotulos: rot.map(function (x) { return x.nome.replace("Rotina ", ""); }), empilhar: true, altura: 250, meia: true,
      series: C.map(function (c, j) { return { nome: nomesConf[c], cor: cores[j], valores: rot.map(function (x) { return tab[x.k + "|" + c] || 0; }) }; }),
      dica: function (i) {
        return "<b>" + esc(rot[i].nome) + "</b>" + C.map(function (c, j) { return ui.linhaDica(nomesConf[c], f.num(tab[rot[i].k + "|" + c] || 0), cores[j]); }).join("") +
          ui.linhaDica("Total", f.num(rot[i].tot));
      } }) +
    '<div class="legenda">' + C.map(function (c, j) { return '<span><i style="background:' + cores[j] + '"></i>' + nomesConf[c] + "</span>"; }).join("") + "</div>") +
    perCartao("Melhor janela para enviar", "calculada pelo estudo para cada pessoa", perDist(ui, d, idx.filter(function (i) { return d.dic.janela[P.janela[i]] !== ""; }), "janela", null, null, 7) +
      '<p class="cap" style="margin-top:10px">' + f.num(idx.filter(function (i) { return d.dic.janela[P.janela[i]] === ""; }).length) + " pessoas ainda sem janela.</p>") + "</div>";

  // turno em que lê × turno em que compra
  var T = PER_ORDEM.turno, cruz = {}, maxc = 0;
  idx.forEach(function (i) {
    var k = d.dic.turno_le[P.turno_le[i]] + "|" + d.dic.turno_compra[P.turno_compra[i]];
    cruz[k] = (cruz[k] || 0) + 1; if (cruz[k] > maxc) maxc = cruz[k];
  });
  var nomeT = function (t, campo) { return t === "" ? PER_VAZIO[campo] : t; };
  var calor = '<div class="tabela-caixa"><table class="t compacta"><thead><tr><th style="text-align:left">Lê \\ compra</th>' +
    T.map(function (t) { return "<th>" + esc(nomeT(t, "turno_compra")) + "</th>"; }).join("") + "</tr></thead><tbody>" +
    T.map(function (a) {
      return '<tr><td style="text-align:left">' + esc(nomeT(a, "turno_le")) + "</td>" + T.map(function (b) {
        var v = cruz[a + "|" + b] || 0;
        return '<td class="calor" style="--int:' + (maxc ? (v / maxc).toFixed(3) : 0) + '" data-dica="' + esc("<b>Lê " + nomeT(a, "turno_le") + " · compra " + nomeT(b, "turno_compra") + "</b>" +
          ui.linhaDica("Pessoas", f.num(v))) + '">' + (v ? f.num(v) : "·") + "</td>";
      }).join("") + "</tr>";
    }).join("") + "</tbody></table></div>";

  var horas = [], tip = [];
  for (var hh = 0; hh < 24; hh++) { var ph = ev.porHora[hh]; if (ph && ph.mins.length >= 5) { horas.push(hh); tip.push(mediana(ph.mins)); } }
  h += '<div class="grade g2" style="margin-top:14px">' + perCartao("Turno em que lê × turno em que compra", "pessoas · quanto mais forte o azul, mais gente", calor) +
    perCartao("Tempo típico até ler, pela hora do envio", "mediana em minutos · horas com 5+ leituras",
      horas.length ? ui.colunas({ rotulo: "Tempo típico até ler por hora", rotulos: horas.map(function (x) { return x + "h"; }), altura: 250, meia: true,
        series: [{ nome: "Minutos", cor: ui.cor(1), valores: tip }], eixo: function (v) { return f.num(v) + " min"; },
        dica: function (i) { return "<b>Envio às " + horas[i] + "h</b>" + ui.linhaDica("Típico até ler", f.num(tip[i]) + " min") +
          ui.linhaDica("Leram", f.num(ev.porHora[horas[i]].leu)); } }) : '<p class="cap">Sem leituras com estes filtros.</p>') + "</div>";

  // caixa × leitura por hora
  if (cx) {
    var totLe = ev.leituraHora.reduce(function (a, b) { return a + b; }, 0), H = [];
    for (var q = 6; q <= 23; q++) H.push(q);
    var s1 = H.map(function (x) { return 100 * cx.horas[x] / cx.tot; }), s2 = H.map(function (x) { return totLe ? 100 * ev.leituraHora[x] / totLe : 0; });
    h += '<div class="cartao" style="margin-top:14px"><div class="topo"><div><h3>Hora do movimento no caixa × hora em que as mensagens são lidas</h3><div class="cap">% do dia · caixa de ' +
      cx.nLojas + (cx.nLojas === 1 ? " loja" : " lojas") + " (todos os clientes) · leituras de quem está no filtro</div></div></div>" +
      ui.colunas({ rotulo: "Caixa x leitura por hora", rotulos: H.map(function (x) { return x + "h"; }), agrupar: true, altura: 240,
        series: [{ nome: "Movimento no caixa", cor: ui.cor(1), valores: s1 }, { nome: "Leituras", cor: ui.cor(2), valores: s2 }],
        eixo: function (v) { return f.num(v) + "%"; },
        dica: function (i) { return "<b>" + H[i] + "h</b>" + ui.linhaDica("Movimento no caixa", f.pct(s1[i]), ui.cor(1)) + ui.linhaDica("Leituras", f.pct(s2[i]), ui.cor(2)); } }) +
      '<div class="legenda"><span><i style="background:' + ui.cor(1) + '"></i>Movimento no caixa (% do dia)</span><span><i style="background:' + ui.cor(2) +
      '"></i>Leituras na hora (% do dia)</span></div></div>';
  }
  h += '<div style="margin-top:14px">' + perIA(ui, d, "rotina") + "</div>";
  return h;
}

var PER_COLS = [
  { t: "Código da pessoa", k: function (d, i) { return d.pessoas.cod[i]; }, esq: true, cod: true },
  { t: "Situação", k: function (d, i) { return perRot(d, "situacao", d.pessoas.situacao[i]); }, esq: true },
  { t: "Persona", k: function (d, i) { return perRot(d, "persona", d.pessoas.persona[i]); }, esq: true },
  { t: "Rotina", k: function (d, i) { return perRot(d, "rotina", d.pessoas.rotina[i]); }, esq: true },
  { t: "Melhor janela para enviar", k: function (d, i) { return perRot(d, "janela", d.pessoas.janela[i]); }, esq: true, quebra: true },
  { t: "Próximo canal", k: function (d, i) { return perRot(d, "canal", d.pessoas.canal[i]); } },
  { t: "Por quê", k: function (d, i) { return perRot(d, "motivo", d.pessoas.motivo[i]); }, esq: true, longo: true },
  { t: "Faixa etária", k: function (d, i) { return perRot(d, "faixa_etaria", d.pessoas.faixa_etaria[i]); } },
  { t: "Gênero", k: function (d, i) { return perRot(d, "genero", d.pessoas.genero[i]); } },
  { t: "Classe estimada", k: function (d, i) { return perRot(d, "classe", d.pessoas.classe[i]); } },
  { t: "Loja habitual", k: function (d, i) { return perCurta(perRot(d, "loja", d.pessoas.loja[i])); }, esq: true },
  { t: "Ticket médio", k: function (d, i) { return d.pessoas.ticket[i]; }, n: "reais" },
  { t: "Compras (90 dias)", k: function (d, i) { return d.pessoas.compras90[i]; }, n: "num" },
  { t: "Tempo típico até ler (min)", k: function (d, i) { return d.pessoas.tempo_tipico[i]; }, n: "num" }
];

function perLinhas(d, s) {
  var b = PER.busca.trim().toLowerCase();
  return b ? s.idx.filter(function (i) { return d.pessoas.cod[i].toLowerCase().indexOf(b) >= 0; }) : s.idx;
}

function perPessoas(ui, d, s) {
  var f = ui.fmt, esc = ui.esc, linhas = perLinhas(d, s), h = "";
  var paginas = Math.max(1, Math.ceil(linhas.length / POR_PAGINA));
  if (PER.pag >= paginas) PER.pag = paginas - 1;
  var trecho = linhas.slice(PER.pag * POR_PAGINA, (PER.pag + 1) * POR_PAGINA);
  var val = function (c, i) {
    var v = c.k(d, i);
    if (c.n === "reais") return v == null ? "—" : f.reais(v);
    if (c.n === "num") return v == null ? "—" : f.num(v, v % 1 ? 1 : 0);
    return v;
  };
  h += '<div class="filtros" style="margin-bottom:10px"><label style="max-width:320px">Buscar pelo código<input type="search" data-digitar="busca" value="' + esc(PER.busca) +
    '" placeholder="parte do código" autocomplete="off"></label><span class="cap" style="flex:1 1 auto;align-self:center;color:var(--mudo);font-size:12.5px">' +
    f.num(linhas.length) + " pessoas" + (linhas.length !== s.idx.length ? " (de " + f.num(s.idx.length) + " no filtro)" : "") + '</span>' +
    '<button type="button" class="botao sec" data-acao="baixar-csv">' + ui.icone("baixar") + "Baixar CSV</button></div>";
  h += '<div class="tabela-caixa"><table class="t" style="min-width:1700px"><thead><tr>' + PER_COLS.map(function (c) {
    return "<th" + (c.esq ? ' style="text-align:left"' : "") + ">" + esc(c.t) + "</th>";
  }).join("") + "</tr></thead><tbody>" + (trecho.length ? trecho.map(function (i) {
    return "<tr>" + PER_COLS.map(function (c) {
      var v = val(c, i);
      return "<td" + (c.esq ? ' style="text-align:left;' + (c.longo ? "max-width:340px;overflow:hidden;text-overflow:ellipsis" : c.quebra ? "white-space:normal;min-width:220px" : "") + '"' : "") +
        (c.longo && v ? ' data-dica="' + esc("<b>Por quê</b>" + esc(v)) + '"' : "") + ">" +
        (c.cod ? '<span class="cod">' + esc(v) + "</span>" : esc(v == null || v === "" ? "—" : v)) + "</td>";
    }).join("") + "</tr>";
  }).join("") : '<tr><td colspan="' + PER_COLS.length + '" style="text-align:left;color:var(--mudo)">Nenhuma pessoa com estes filtros.</td></tr>') + "</tbody></table></div>";
  h += '<div class="paginacao"><span>Página ' + (PER.pag + 1) + " de " + paginas + " · " + POR_PAGINA + ' por página</span><span class="navs">' +
    '<button type="button" class="botao sec" data-acao="pag" data-valor="' + (PER.pag - 1) + '"' + (PER.pag ? "" : " disabled") + ">" + ui.icone("volta") + "Anterior</button>" +
    '<button type="button" class="botao sec" data-acao="pag" data-valor="' + (PER.pag + 1) + '"' + (PER.pag < paginas - 1 ? "" : " disabled") + ">Próxima" + ui.icone("abre") + "</button></span></div>";
  h += '<p class="cap" style="margin-top:10px;font-size:12px;color:var(--mudo)">Uma linha por pessoa, só com o código (pseudônimo): nome, CPF e telefone não saem do estudo. ' +
    "O mesmo quadro da página Pessoas do ADS-02.</p>";
  h += '<div style="margin-top:14px">' + perIA(ui, d, "pessoas") + "</div>";
  return h;
}

function perCSV(d, s) {
  var linhas = perLinhas(d, s), q = function (v) { v = v == null ? "" : String(v); return /[;"\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
  return "﻿" + PER_COLS.map(function (c) { return q(c.t); }).join(";") + "\n" + linhas.map(function (i) {
    return PER_COLS.map(function (c) { var v = c.k(d, i); return q(typeof v === "number" ? String(v).replace(".", ",") : v); }).join(";");
  }).join("\n") + "\n";
}

function perOpcoes(d, campo) {
  var c = {}, col = d.pessoas[campo];
  for (var i = 0; i < col.length; i++) c[col[i]] = (c[col[i]] || 0) + 1;
  var lista = d.dic[campo].map(function (v, k) { return { v: v, n: c[k] || 0 }; }).filter(function (x) { return x.n; });
  if (PER_ORDEM[campo]) lista.sort(function (a, b) { return PER_ORDEM[campo].indexOf(a.v) - PER_ORDEM[campo].indexOf(b.v); });
  else lista.sort(function (a, b) { return b.n - a.n; });
  return lista.map(function (x) {
    return { v: x.v === "" ? PER_SEM : x.v, n: (x.v === "" ? PER_VAZIO[campo] || "—" : campo === "loja" ? perCurta(x.v) : x.v) + " (" + x.n.toLocaleString("pt-BR") + ")" };
  });
}

SA.pagina({
  acao: function (a, v, ui) {
    if (a === "aba") { PER.aba = v; ui.lembrar("aba", v); return; }
    if (a.indexOf("filtro:") === 0) { PER.f[a.slice(7)] = v; PER.pag = 0; return; }
    if (a === "limpar") { PER.f = {}; PER.busca = ""; PER.pag = 0; return; }
    if (a === "busca") { PER.busca = v; PER.pag = 0; return; }
    if (a === "pag") { PER.pag = Math.max(0, Number(v) || 0); return; }
    if (a === "baixar-csv") {
      var s = perSelecao(PER.dados);
      ui.baixarArquivo("personas_" + new Date().toISOString().slice(0, 10) + ".csv", perCSV(PER.dados, s), "text/csv;charset=utf-8");
      return false;
    }
  },
  render: function (d, ui) {
    PER.dados = d;
    var f = ui.fmt, esc = ui.esc;
    var pedida = ui.abaInicial();                    // veio pela barra lateral (Comportamento, Rotina ou Pessoas)
    if (pedida) PER.aba = pedida;
    if (!PER.aba) PER.aba = ui.lembrar("aba") || "comportamento";
    var s = perSelecao(d), ev = perEnvios(d, s.marca), cx = perCaixa(d, s.idx);
    var abas = [{ id: "comportamento", nome: "Comportamento" }, { id: "rotina", nome: "Rotina" }, { id: "pessoas", nome: "Pessoas" }];
    var algum = Object.keys(PER.f).some(function (k) { return PER.f[k]; });
    var h = ui.abas(abas, PER.aba, "aba", "parceiros") +
      ui.filtros(PER_FILTROS.map(function (x) { return { id: x.id, nome: x.nome, opcoes: perOpcoes(d, x.id) }; }), PER.f,
                 algum ? '<button type="button" class="botao sec" data-acao="limpar">' + ui.icone("xis") + "Limpar filtros</button>" : "");
    h += PER.aba === "rotina" ? perRotina(ui, d, s, ev, cx) : PER.aba === "pessoas" ? perPessoas(ui, d, s) : perComportamento(ui, d, s, ev, cx);
    var nome = { comportamento: "Comportamento", rotina: "Rotina", pessoas: "Pessoas" }[PER.aba];
    return {
      aba: PER.aba,
      faixa: {
        trilha: "Personas · " + nome,
        titulo: { comportamento: "Comportamento: quem é a base", rotina: "Rotina: semana, horário e dia", pessoas: "Pessoas" }[PER.aba],
        sub: "Quem recebeu as mensagens, como reage e quando · cruzamento do ADS-01 com o MKT 63 pelo Power BI, sem DBeaver",
        pilulas: [esc(f.num(d.pessoas.cod.length)) + " pessoas", "Envios de " + esc(f.dataLonga(d.periodo.de)) + " a " + esc(f.dataLonga(d.periodo.ate)),
                  "Estudo de " + esc(d.estudo_em), d.ia_em ? "Leitura da IA de " + esc(d.ia_em) : "Sem leitura da IA hoje"]
      },
      html: h
    };
  }
});

})();
