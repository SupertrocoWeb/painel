/* Central SuperAdds · Orçamento · montado em 29/10/2026 16:35 (central/montar.py). Não edite aqui: edite ui/ e paginas/. */
(function () {
"use strict";
var CFG = {"pagina": "orcamento", "titulo": "Orçamento", "alvo": "central-superadds", "porteiro": "https://superadds-central.mkt-7c4.workers.dev", "dados": ["https://raw.githubusercontent.com/SupertrocoWeb/painel/main/central/orcamento.json", "https://cdn.jsdelivr.net/gh/SupertrocoWeb/painel@main/central/orcamento.json"], "paginas": [{"id": "inicio", "nome": "Início", "icone": "casa", "url": ""}, {"id": "personas", "nome": "Personas", "icone": "pessoas", "url": "", "abas": [{"id": "comportamento", "nome": "Comportamento"}, {"id": "rotina", "nome": "Rotina"}, {"id": "pessoas", "nome": "Pessoas"}]}, {"id": "financeiro", "nome": "Financeiro", "icone": "carteira", "url": ""}, {"id": "estrategia", "nome": "Estratégia", "icone": "alvo", "url": ""}, {"id": "dev", "nome": "Desenvolvedor", "icone": "codigo", "url": ""}, {"id": "orcamento", "nome": "Orçamento", "icone": "calc", "url": "https://retail-media.superadds.com.br/superadds-base"}]};
var CSS = "/* kit.css — visual da Central SuperAdds (todas as páginas). Embutido em cada página pelo montar.py.\n   Escuro por padrão (como a referência), com opção clara. As cores de série são a paleta validada\n   (claro x escuro); as de situação nunca aparecem sem ícone e texto. */\n:host{all:initial;display:block}\n*{box-sizing:border-box;margin:0;padding:0}\n[hidden]{display:none !important}\n\n.sa{\n  --plano:#0f1821; --sup:#172330; --sup2:#1e2c3b; --lateral:#080d12; --borda:rgba(255,255,255,.07);\n  --tinta:#eef3f6; --tinta2:#b6c3ce; --mudo:#8696a5; --grade:#243444; --eixo:#35485c; --trilho:#2b3d50;\n  --marca:#22c3c1; --marca2:#5fe0dc; --marca-tinta:#04211f; --marca-suave:rgba(34,195,193,.12);\n  --faixa:linear-gradient(100deg,#0d8a68 0%,#12a3a0 42%,#1b78c9 100%);\n  --s1:#3987e5; --s2:#d95926; --s3:#199e70; --s4:#c98500; --s5:#d55181; --s6:#008300; --s7:#9085e9; --s8:#e66767;\n  --bom:#0ca30c; --atencao:#fab219; --serio:#ec835a; --critico:#d03b3b; --sobe:#0ca30c;\n  --aviso-fundo:rgba(250,178,25,.10); --aviso-borda:rgba(250,178,25,.35); --aviso-tinta:#f6cf7a;\n  --info-fundo:rgba(57,135,229,.10); --info-borda:rgba(57,135,229,.35); --info-tinta:#a9c9f3;\n  --bom-tinta:#7ad97a; --bom-fundo:rgba(12,163,12,.14); --bom-borda:rgba(12,163,12,.5);\n  --atencao-tinta:#f6cf7a; --atencao-fundo:rgba(250,178,25,.12); --atencao-borda:rgba(250,178,25,.5);\n  --critico-tinta:#ffa3a3; --critico-fundo:rgba(208,59,59,.16); --critico-borda:rgba(208,59,59,.55);\n  --sombra:0 1px 2px rgba(0,0,0,.3),0 8px 24px rgba(0,0,0,.25);\n  --disp:'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',sans-serif;\n  --corpo:'Inter',system-ui,-apple-system,'Segoe UI',sans-serif;\n  color-scheme:dark;\n  position:fixed;inset:0;z-index:2147480000;overflow:hidden;\n  display:grid;grid-template-columns:232px minmax(0,1fr);\n  background:var(--plano);color:var(--tinta);font-family:var(--corpo);font-size:14px;line-height:1.5;\n  -webkit-font-smoothing:antialiased;text-align:left;\n}\n.sa.claro{\n  --plano:#f1f4f7; --sup:#fcfcfb; --sup2:#f3f6f8; --lateral:#0b1620; --borda:rgba(11,11,11,.09);\n  --tinta:#0b0b0b; --tinta2:#52514e; --mudo:#6c6b66; --grade:#e3e6e9; --eixo:#c3c2b7; --trilho:#e3e6e9;\n  --marca:#0f9c9a; --marca2:#15b8b6; --marca-tinta:#ffffff; --marca-suave:rgba(15,156,154,.10);\n  --s1:#2a78d6; --s2:#eb6834; --s3:#1baf7a; --s4:#eda100; --s5:#e87ba4; --s6:#008300; --s7:#6250d6; --s8:#e34948;\n  --sobe:#006300;\n  --aviso-fundo:#fdf6e7; --aviso-borda:#f1e1bd; --aviso-tinta:#7a5208;\n  --info-fundo:#eef5fd; --info-borda:#cfe1f8; --info-tinta:#1d4f8f;\n  --bom-tinta:#006300; --bom-fundo:#e9f6e9; --bom-borda:#b4dfb4;\n  --atencao-tinta:#7a5208; --atencao-fundo:#fdf6e7; --atencao-borda:#ecd7a6;\n  --critico-tinta:#a61f1f; --critico-fundo:#fdeeee; --critico-borda:#efbcbc;\n  --sombra:0 1px 2px rgba(16,24,40,.05),0 6px 18px rgba(16,24,40,.06);\n  color-scheme:light;\n}\nbutton,input,select{font:inherit;color:inherit}\nbutton{cursor:pointer}\n:focus-visible{outline:2px solid var(--marca);outline-offset:2px}\na{color:inherit;text-decoration:none}\n.num{font-variant-numeric:tabular-nums}\n\n/* ------------------------------------------------------------- barra lateral */\n.lado{background:var(--lateral);color:#dfe8ee;display:flex;flex-direction:column;min-height:0;overflow-y:auto;\n  border-right:1px solid rgba(255,255,255,.05)}\n.logo{display:flex;align-items:center;gap:11px;padding:22px 20px 26px}\n.logo .sig{width:36px;height:36px;border-radius:10px;background:var(--faixa);display:grid;place-items:center;flex:0 0 auto}\n.logo .sig svg{width:20px;height:20px;stroke:#fff;fill:none;stroke-width:2.2}\n.logo b{font-family:var(--disp);font-weight:800;font-size:15px;letter-spacing:-.01em;display:block;line-height:1.15}\n.logo small{font-size:11px;color:#8ea0ae;display:block}\n.nav{display:flex;flex-direction:column;gap:2px;padding:0 10px}\n.nav a{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:10px;color:#aebdc8;font-size:13.5px;\n  font-weight:500;transition:background .15s,color .15s;position:relative}\n.nav a svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.9;flex:0 0 auto}\n.nav a:hover{background:rgba(255,255,255,.05);color:#fff}\n.nav a.ativa{background:rgba(34,195,193,.14);color:#fff}\n.nav a.ativa::before{content:\"\";position:absolute;left:-10px;top:8px;bottom:8px;width:3px;border-radius:0 3px 3px 0;background:#22c3c1}\n.nav a span{white-space:nowrap}\n.nav a.sub{padding:6px 12px 6px 42px;font-size:12.5px;color:#8ea0ae}\n.nav a.sub.ativa{background:transparent;color:#5fe0dc}\n.nav a.sub.ativa::before{top:6px;bottom:6px}\n.nav a.sub[aria-disabled]{opacity:.6}\n.nav a .em-breve{margin-left:auto;font-size:9.5px;color:#7d8f9d;border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:0 6px;line-height:16px}\n.lado .rodape{margin-top:auto;padding:16px 14px 18px;display:flex;flex-direction:column;gap:8px;font-size:12px;color:#8ea0ae}\n.lado .rodape .linha{display:flex;align-items:center;gap:8px}\n.lado .rodape button{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:#cfdbe3;border-radius:9px;\n  padding:7px 10px;font-size:12px;display:flex;align-items:center;gap:8px;width:100%}\n.lado .rodape button:hover{background:rgba(255,255,255,.09);color:#fff}\n.lado .rodape svg{width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2}\n.relogio{display:flex;align-items:center;gap:7px}\n.relogio i{width:7px;height:7px;border-radius:50%;background:#22c3c1;display:inline-block}\n\n/* ------------------------------------------------------------- conteúdo */\n.corpo{overflow-y:auto;min-width:0;min-height:0;scroll-behavior:smooth}\n.faixa{background:var(--faixa);color:#fff;padding:26px 34px 30px;position:relative;overflow:hidden}\n.faixa::after{content:\"\";position:absolute;right:-80px;top:-120px;width:420px;height:420px;border-radius:50%;\n  background:radial-gradient(closest-side,rgba(255,255,255,.16),transparent);pointer-events:none}\n.faixa .trilha{font-size:12px;opacity:.85;margin-bottom:6px}\n.faixa h1{font-family:var(--disp);font-weight:800;font-size:26px;letter-spacing:-.02em;line-height:1.15}\n.faixa .sub{font-size:13.5px;opacity:.92;margin-top:5px;max-width:760px}\n.faixa .meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px;position:relative;z-index:1}\n.faixa .pilula{background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.22);border-radius:999px;padding:4px 11px;\n  font-size:12px;display:inline-flex;align-items:center;gap:6px;backdrop-filter:blur(4px)}\n.miolo{padding:24px 34px 48px;max-width:1500px}\n\n.secao{display:flex;align-items:baseline;gap:10px;margin:30px 0 12px}\n.secao:first-child{margin-top:0}\n.secao h2{font-family:var(--disp);font-weight:800;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--tinta2)}\n.secao span{font-size:12px;color:var(--mudo)}\n\n.grade{display:grid;gap:14px}\n.g2{grid-template-columns:repeat(2,minmax(0,1fr))}\n.g3{grid-template-columns:repeat(3,minmax(0,1fr))}\n.g4{grid-template-columns:repeat(4,minmax(0,1fr))}\n.g5{grid-template-columns:repeat(5,minmax(0,1fr))}\n.g-12{grid-template-columns:minmax(0,1fr) minmax(0,2fr)}\n.g-21{grid-template-columns:minmax(0,2fr) minmax(0,1fr)}\n\n.cartao{background:var(--sup);border:1px solid var(--borda);border-radius:14px;padding:18px 20px;box-shadow:var(--sombra);min-width:0}\n.cartao .topo{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:12px}\n.cartao h3{font-family:var(--disp);font-weight:700;font-size:14.5px;letter-spacing:-.005em}\n.cartao .cap{font-size:12px;color:var(--mudo);margin-top:2px;line-height:1.45}\n.cartao .acao{font-size:12px;color:var(--marca);font-weight:600;white-space:nowrap;display:inline-flex;align-items:center;gap:4px}\n.cartao .acao:hover{text-decoration:underline}\n\n/* número em destaque com barra de cor embaixo (como na referência) */\n.tile{background:var(--sup);border:1px solid var(--borda);border-radius:14px;padding:16px 18px 18px;box-shadow:var(--sombra);\n  position:relative;overflow:hidden;min-width:0}\n.tile::after{content:\"\";position:absolute;left:0;right:0;bottom:0;height:4px;background:var(--barra,var(--marca))}\n.tile .rot{font-size:12px;color:var(--tinta2);font-weight:500}\n.tile .val{font-family:var(--disp);font-weight:700;font-size:26px;letter-spacing:-.02em;line-height:1.15;margin-top:6px}\n.tile .val small{font-size:14px;font-weight:600;color:var(--tinta2);margin-left:4px}\n.tile .nota{font-size:12px;color:var(--mudo);margin-top:6px;line-height:1.4}\n.tile .nota b{color:var(--tinta2);font-weight:600}\n\n.aviso{display:flex;gap:10px;align-items:flex-start;border:1px solid var(--aviso-borda);background:var(--aviso-fundo);color:var(--aviso-tinta);\n  border-radius:12px;padding:11px 14px;font-size:13px;margin-bottom:14px}\n.aviso.info{border-color:var(--info-borda);background:var(--info-fundo);color:var(--info-tinta)}\n.aviso svg{width:17px;height:17px;flex:0 0 auto;stroke:currentColor;fill:none;stroke-width:2;margin-top:1px}\n\n/* legenda */\n.legenda{display:flex;flex-wrap:wrap;gap:6px 16px;font-size:12px;color:var(--tinta2);margin-top:10px}\n.legenda span{display:inline-flex;align-items:center;gap:6px}\n.legenda i{width:10px;height:10px;border-radius:3px;display:inline-block}\n\n/* gráficos */\nsvg.graf{display:block;width:100%;height:auto;overflow:visible}\nsvg.graf text{font-family:var(--corpo);fill:var(--mudo);font-size:11px}\nsvg.graf .grade-l{stroke:var(--grade);stroke-width:1}\nsvg.graf .base{stroke:var(--eixo);stroke-width:1}\nsvg.graf .alvo{cursor:pointer;fill:transparent}\nsvg.graf .realce{fill:var(--tinta);opacity:0;transition:opacity .12s}\nsvg.graf g.col:hover .realce{opacity:.06}\n\n/* mostrador */\n.mostrador{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:18px;align-items:center}\n.mostrador .lado-t .grande{font-family:var(--disp);font-weight:800;font-size:31px;letter-spacing:-.025em;line-height:1.05}\n.mostrador .lado-t .rot{font-size:13px;color:var(--tinta2);margin-top:4px}\n.mostrador .pares{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:18px}\n.mostrador .par{border-left:3px solid var(--cor,var(--marca));padding-left:10px}\n.mostrador .par b{font-family:var(--disp);font-size:16px;font-weight:700;display:block;line-height:1.2;white-space:nowrap}\n.mostrador svg.graf{max-width:270px;margin:0 auto}\n.rosca svg.graf{max-width:180px;margin:0 auto}\n.mostrador .par span{font-size:12px;color:var(--mudo)}\n.saldo .rot{font-size:12px;color:var(--tinta2);font-weight:500}\n.saldo .val{font-family:var(--disp);font-weight:700;font-size:26px;letter-spacing:-.02em;line-height:1.15;margin-top:4px}\n.saldo .val small{font-size:13px;font-weight:600;color:var(--tinta2);margin-left:6px}\n.trilho{height:8px;border-radius:999px;background:var(--trilho);margin-top:16px;position:relative;overflow:visible}\n.trilho .cheio{position:absolute;left:0;top:0;bottom:0;border-radius:999px;background:var(--marca)}\n.trilho .marco{position:absolute;top:-5px;bottom:-5px;width:2px;background:var(--tinta);border-radius:2px}\n.trilho-leg{display:flex;justify-content:space-between;font-size:11.5px;color:var(--mudo);margin-top:8px}\n\n/* rosca */\n.rosca{display:grid;grid-template-columns:160px minmax(0,1fr);gap:22px;align-items:center}\n.rosca ul{list-style:none;display:flex;flex-direction:column;gap:12px}\n.rosca li{display:grid;grid-template-columns:12px minmax(0,1fr) auto;gap:10px;align-items:baseline}\n.rosca li i{width:12px;height:12px;border-radius:3px;display:inline-block;transform:translateY(1px)}\n.rosca li b{font-weight:600}\n.rosca li .v{font-variant-numeric:tabular-nums;font-weight:600;text-align:right}\n.rosca li small{display:block;color:var(--mudo);font-size:11.5px}\n\n/* barras horizontais */\n.barras{display:flex;flex-direction:column;gap:12px}\n.barra .linha{display:flex;justify-content:space-between;gap:10px;font-size:13px;margin-bottom:5px}\n.barra .linha span{color:var(--tinta2)}\n.barra .linha b{font-variant-numeric:tabular-nums;font-weight:600}\n.barra .linha b small{color:var(--mudo);font-weight:500;margin-left:6px}\n.barra .t{height:10px;border-radius:0 4px 4px 0;background:var(--grade);position:relative}\n.barra .t i{position:absolute;left:0;top:0;bottom:0;border-radius:0 4px 4px 0;display:block}\n\n/* tabela */\n.tabela-caixa{overflow-x:auto;border:1px solid var(--borda);border-radius:12px}\ntable.t{width:100%;border-collapse:collapse;font-size:12.5px;font-variant-numeric:tabular-nums;min-width:760px}\ntable.t th{position:sticky;top:0;background:var(--sup2);color:var(--tinta2);font-weight:600;text-align:right;padding:9px 12px;\n  border-bottom:1px solid var(--borda);white-space:nowrap;font-size:11.5px;letter-spacing:.01em}\ntable.t td{padding:8px 12px;border-bottom:1px solid var(--borda);text-align:right;white-space:nowrap}\ntable.t th:first-child,table.t td:first-child{text-align:left}\ntable.t tr:last-child td{border-bottom:0}\ntable.t tr:hover td{background:var(--marca-suave)}\ntable.t tfoot td{font-weight:700;background:var(--sup2)}\n.ok{color:var(--sobe);display:inline-flex;align-items:center;gap:4px}\n.ok svg,.dif svg{width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2.4}\n.dif{color:var(--serio);display:inline-flex;align-items:center;gap:4px}\n\n/* atalhos */\n.atalho{display:flex;gap:14px;align-items:flex-start;transition:border-color .15s,transform .15s}\n.atalho:hover{border-color:var(--marca);transform:translateY(-1px)}\n.atalho .ic{width:40px;height:40px;border-radius:11px;background:var(--marca-suave);color:var(--marca);display:grid;place-items:center;flex:0 0 auto}\n.atalho .ic svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:1.9}\n.atalho b{font-family:var(--disp);font-size:14.5px;display:block}\n.atalho p{font-size:12.5px;color:var(--mudo);margin-top:3px;line-height:1.45}\n\n/* abas numa linha */\n.abas{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px}\n.abas button{background:var(--sup);border:1px solid var(--borda);color:var(--tinta2);border-radius:999px;padding:7px 14px;font-size:13px;\n  font-weight:600;display:inline-flex;align-items:center;gap:7px;transition:background .15s,border-color .15s,color .15s}\n.abas button:hover{border-color:var(--marca);color:var(--tinta)}\n.abas button.on{background:var(--marca);border-color:var(--marca);color:var(--marca-tinta)}\n.abas button i{width:9px;height:9px;border-radius:50%;display:inline-block}\n.abas button small{font-weight:500;opacity:.75;font-size:11.5px}\n.abas.parceiros{background:var(--sup);border:1px solid var(--borda);border-radius:14px;padding:6px;gap:4px;box-shadow:var(--sombra)}\n.abas.parceiros button{border:0;background:transparent;border-radius:10px;padding:9px 16px;font-size:13.5px;white-space:nowrap;flex:0 0 auto}\n.abas.parceiros button.on{background:var(--marca);color:var(--marca-tinta)}\n.abas.meses button{padding:5px 12px;font-size:12px}\n\n/* \"o que você quer ver hoje?\" */\n.pergunta{font-family:var(--disp);font-weight:800;font-size:18px;letter-spacing:-.01em;margin:0 0 12px}\n.escolhas{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:22px}\n.escolha{background:var(--sup);border:1px solid var(--borda);border-radius:14px;padding:14px 16px;text-align:left;box-shadow:var(--sombra);\n  display:flex;gap:12px;align-items:flex-start;transition:border-color .15s,transform .15s;color:var(--tinta);position:relative}\n.escolha:hover{border-color:var(--marca);transform:translateY(-1px)}\n.escolha.on{border-color:var(--marca);box-shadow:0 0 0 1px var(--marca),var(--sombra)}\n.escolha .ic{width:36px;height:36px;border-radius:10px;background:var(--marca-suave);color:var(--marca);display:grid;place-items:center;flex:0 0 auto}\n.escolha .ic svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.9}\n.escolha b{font-family:var(--disp);font-size:14px;display:block}\n.escolha span{font-size:12px;color:var(--mudo);display:block;margin-top:2px;line-height:1.4}\n.escolha em{font-style:normal;font-family:var(--disp);font-weight:700;font-size:15px;color:var(--tinta);display:block;margin-top:6px}\n\n/* selos (sempre com texto) */\n.selo{display:inline-flex;align-items:center;gap:5px;border-radius:999px;padding:2px 9px;font-size:11.5px;font-weight:600;\n  border:1px solid var(--borda);color:var(--tinta2);background:var(--sup2);white-space:nowrap}\n.selo svg{width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2.4}\n.selo.bom{color:var(--sobe);border-color:currentColor;background:transparent}\n.selo.ruim{color:var(--serio);border-color:currentColor;background:transparent}\n.selo.marca{color:var(--marca);border-color:currentColor;background:transparent}\n\n/* listas do plano e do recibo */\n.plano{display:flex;flex-direction:column;gap:10px}\n.item-plano{display:grid;grid-template-columns:34px minmax(0,1fr) auto;gap:12px;align-items:start;padding:14px 16px;border:1px solid var(--borda);\n  border-radius:12px;background:var(--sup)}\n.item-plano .n{width:30px;height:30px;border-radius:9px;background:var(--marca-suave);color:var(--marca);display:grid;place-items:center;font-weight:800;font-family:var(--disp)}\n.item-plano .n svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2.4}\n.item-plano h4{font-family:var(--disp);font-size:14.5px;font-weight:700}\n.item-plano .onde{font-size:12.5px;color:var(--tinta2);margin-top:2px;display:flex;flex-wrap:wrap;gap:6px 12px}\n.item-plano .porque{font-size:13px;color:var(--tinta);margin-top:8px;line-height:1.5}\n.item-plano .lado-d{text-align:right;display:flex;flex-direction:column;gap:6px;align-items:flex-end}\n.item-plano .lado-d b{font-family:var(--disp);font-size:20px}\n.item-plano .lado-d small{font-size:11.5px;color:var(--mudo)}\n.recibo{font-family:ui-monospace,'Cascadia Mono',Consolas,monospace;font-size:12px;line-height:1.55;background:var(--sup2);border:1px dashed var(--eixo);\n  border-radius:12px;padding:16px 18px;white-space:pre;overflow:auto;max-height:520px;color:var(--tinta)}\n\n/* desenvolvedor */\n.kv{display:grid;grid-template-columns:minmax(120px,auto) minmax(0,1fr);gap:7px 16px;font-size:13px}\n.kv dt{color:var(--mudo)}\n.kv dd{color:var(--tinta);font-variant-numeric:tabular-nums;word-break:break-word}\n.kv dd code,.cod{font-family:ui-monospace,'Cascadia Mono',Consolas,monospace;font-size:12px;background:var(--sup2);border:1px solid var(--borda);\n  border-radius:6px;padding:1px 6px}\npre.codigo{font-family:ui-monospace,'Cascadia Mono',Consolas,monospace;font-size:11.5px;line-height:1.5;background:#0a1016;color:#d6e2ea;\n  border:1px solid var(--borda);border-radius:10px;padding:12px 14px;overflow:auto;max-height:340px;white-space:pre-wrap;word-break:break-word}\n.form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}\n.form label{display:flex;flex-direction:column;gap:5px;font-size:12px;color:var(--tinta2);font-weight:600}\n.form input,.form select{background:var(--sup2);border:1px solid var(--borda);border-radius:9px;padding:9px 11px;font-size:13px;color:var(--tinta);min-width:0}\n.form .larga{grid-column:1 / -1}\n.botao{background:var(--marca);color:var(--marca-tinta);border:0;border-radius:10px;padding:9px 16px;font-weight:700;font-size:13px;\n  display:inline-flex;align-items:center;gap:7px;white-space:nowrap;flex:0 0 auto}\n.botao.sec{background:var(--sup2);color:var(--tinta);border:1px solid var(--borda)}\n.botao:hover{filter:brightness(1.07)}\n.botao[disabled]{opacity:.55;cursor:wait}\n.botao svg{width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2}\n.consultas{display:flex;flex-direction:column;gap:8px}\n.consulta{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:10px;align-items:center;padding:9px 12px;border:1px solid var(--borda);border-radius:10px;background:var(--sup2)}\n.consulta .m{font-family:ui-monospace,Consolas,monospace;font-size:11px;font-weight:700;color:var(--marca);border:1px solid currentColor;border-radius:5px;padding:0 5px}\n.consulta .u{font-family:ui-monospace,Consolas,monospace;font-size:12px;color:var(--tinta2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.estado-vivo{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--tinta2)}\n.estado-vivo i{width:8px;height:8px;border-radius:50%;background:var(--mudo);display:inline-block}\n.estado-vivo.ok i{background:var(--bom)}\n.estado-vivo.falha i{background:var(--critico)}\n.linha-tempo{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}\n.linha-tempo span{font-size:12px;border:1px solid var(--borda);border-radius:999px;padding:3px 10px;color:var(--mudo)}\n.linha-tempo span.feito{color:var(--sobe);border-color:currentColor}\n\n/* bloco retrátil */\n.retratil{background:var(--sup);border:1px solid var(--borda);border-radius:14px;box-shadow:var(--sombra);margin-bottom:12px;min-width:0}\n.retratil > .cab{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:12px;align-items:center;width:100%;padding:14px 18px;\n  background:transparent;border:0;border-radius:14px;text-align:left;color:var(--tinta)}\n.retratil > .cab:hover{background:var(--marca-suave)}\n.retratil > .cab:focus-visible{outline:2px solid var(--marca);outline-offset:-2px}\n.retratil .seta{width:26px;height:26px;border-radius:8px;background:var(--sup2);display:grid;place-items:center;color:var(--tinta2)}\n.retratil .seta svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2.2;transition:transform .15s}\n.retratil.aberto > .cab .seta svg{transform:rotate(90deg)}\n.retratil .tit{display:flex;align-items:center;gap:10px;min-width:0}\n.retratil .tit .ic{width:34px;height:34px;border-radius:10px;background:var(--marca-suave);color:var(--marca);display:grid;place-items:center;flex:0 0 auto}\n.retratil .tit .ic svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.9}\n.retratil.leve .tit .ic{width:28px;height:28px;border-radius:8px}\n.retratil.leve .tit .ic svg{width:15px;height:15px}\n.retratil .tit b{font-family:var(--disp);font-weight:700;font-size:15px;display:block;line-height:1.25}\n.retratil .tit small{display:block;font-size:12px;color:var(--mudo);margin-top:2px;line-height:1.4}\n.retratil .dir{display:flex;gap:18px;align-items:center;justify-content:flex-end;flex-wrap:wrap}\n.retratil > .conteudo{padding:16px 18px 18px;border-top:1px solid var(--borda)}\n.retratil:not(.aberto) > .conteudo{display:none}\n.retratil.leve{box-shadow:none;background:var(--sup2);margin-bottom:8px;border-radius:12px}\n.retratil.leve > .cab{padding:10px 14px;border-radius:12px}\n.retratil.leve > .cab .seta{background:var(--sup)}\n.retratil.leve .tit b{font-size:13.5px}\n.retratil.leve > .conteudo{padding:12px 14px 14px}\n.mini{display:flex;flex-direction:column;align-items:flex-end;line-height:1.2}\n.mini b{font-family:var(--disp);font-weight:700;font-size:15px;font-variant-numeric:tabular-nums;white-space:nowrap}\n.mini small{font-size:11px;color:var(--mudo);white-space:nowrap}\n\n/* etiqueta de situação (sempre com ícone e texto) */\n.tag{display:inline-flex;align-items:center;gap:5px;border-radius:999px;padding:2px 9px 2px 7px;font-size:11.5px;font-weight:600;\n  white-space:nowrap;border:1px solid var(--borda);color:var(--tinta2);background:var(--sup2);line-height:1.5}\n.tag svg{width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2.4;flex:0 0 auto}\n.tag.bom{color:var(--bom-tinta);background:var(--bom-fundo);border-color:var(--bom-borda)}\n.tag.atencao{color:var(--atencao-tinta);background:var(--atencao-fundo);border-color:var(--atencao-borda)}\n.tag.critico{color:var(--critico-tinta);background:var(--critico-fundo);border-color:var(--critico-borda)}\n.tags{display:flex;flex-wrap:wrap;gap:6px}\n\n/* uso de limites */\n.uso{display:flex;flex-direction:column;gap:6px;padding:11px 0;border-bottom:1px solid var(--borda)}\n.uso:last-child{border-bottom:0}\n.uso .linha{display:flex;justify-content:space-between;gap:10px;font-size:13px}\n.uso .linha span{color:var(--tinta2)}\n.uso .linha small{color:var(--mudo);font-weight:500}\n.uso .linha b{font-variant-numeric:tabular-nums;font-weight:700;white-space:nowrap}\n.uso .t{height:8px;border-radius:999px;background:var(--trilho);overflow:hidden}\n.uso .t i{display:block;height:100%;border-radius:999px;background:var(--marca)}\n.uso .pct{font-size:11px;color:var(--mudo)}\n\n/* filtros numa linha */\n.filtros{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-end;margin-bottom:16px}\n.filtros label{display:flex;flex-direction:column;gap:4px;font-size:11.5px;color:var(--mudo);font-weight:600;flex:1 1 150px;min-width:140px;max-width:250px}\n.filtros select,.filtros input{background:var(--sup);border:1px solid var(--borda);border-radius:9px;padding:8px 10px;font-size:13px;color:var(--tinta);\n  min-width:0;width:100%}\n.filtros select:hover,.filtros input:hover{border-color:var(--marca)}\n.filtros .botao{flex:0 0 auto}\n\n/* calendário */\n.cal .cab-cal{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:10px}\n.cal .cab-cal b{font-family:var(--disp);font-size:15px;font-weight:700}\n.cal .navs{display:flex;gap:6px}\n.cal .navs button{width:30px;height:30px;border-radius:9px;border:1px solid var(--borda);background:var(--sup2);display:grid;place-items:center;color:var(--tinta)}\n.cal .navs button[disabled]{opacity:.35;cursor:default}\n.cal .navs svg{width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2.2}\n.cal .sem,.cal .grade-cal{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}\n.cal .sem{font-size:11px;color:var(--mudo);text-align:center;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em}\n.cal .d{min-height:64px;border-radius:10px;border:1px solid var(--borda);padding:6px 8px;display:flex;flex-direction:column;justify-content:space-between;\n  text-align:left;color:var(--tinta);background:color-mix(in srgb,var(--s1) calc(var(--int,0) * 55%),var(--sup2));min-width:0}\n.cal .d.vazio{background:transparent;border-color:transparent}\n.cal .d.sem-dado{background:transparent;border-style:dashed;opacity:.6}\n.cal button.d:hover{border-color:var(--marca)}\n.cal .d.on{border-color:var(--marca);box-shadow:0 0 0 2px var(--marca)}\n.cal .d .n{font-size:11px;font-weight:600;color:var(--tinta2)}\n.cal .d .v{font-family:var(--disp);font-weight:700;font-size:12.5px;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-.01em}\n\ntable.t.compacta{min-width:0}\ntable.t.compacta th,table.t.compacta td{padding:7px 8px}\n\n/* mapa de calor em tabela */\ntable.t td.calor{background:color-mix(in srgb,var(--s1) calc(var(--int,0) * 60%),transparent)}\n\n/* paginação de tabela */\n.paginacao{display:flex;gap:8px;align-items:center;justify-content:space-between;margin-top:10px;font-size:12.5px;color:var(--mudo);flex-wrap:wrap}\n.paginacao .navs{display:flex;gap:6px}\n\n/* texto da IA */\n.ia{border-left:3px solid var(--marca);padding:2px 0 2px 14px}\n.ia li{margin:6px 0 0 18px;font-size:13.5px;line-height:1.55}\n.ia p{font-size:13.5px;line-height:1.6}\n.retrato dt{font-family:var(--disp);font-weight:700;font-size:13px;color:var(--tinta2);margin-top:14px}\n.retrato dt:first-child{margin-top:0}\n.retrato dd{font-size:14px;line-height:1.65;margin-top:3px}\n\n/* dica ao passar o mouse */\n.dica{position:fixed;z-index:10;pointer-events:none;background:#0b1219;color:#eef3f6;border:1px solid rgba(255,255,255,.12);\n  border-radius:10px;padding:9px 11px;font-size:12px;line-height:1.5;box-shadow:0 8px 24px rgba(0,0,0,.35);max-width:280px;\n  opacity:0;transition:opacity .1s}\n.dica.on{opacity:1}\n.dica b{display:block;font-weight:700;margin-bottom:3px}\n.dica .l{display:flex;justify-content:space-between;gap:16px;font-variant-numeric:tabular-nums}\n.dica .l span{color:#aab8c4;display:inline-flex;align-items:center;gap:6px}\n.dica .l i{width:8px;height:8px;border-radius:2px;display:inline-block}\n\n/* porteiro */\n.porta{grid-column:1 / -1;display:grid;place-items:center;background:var(--faixa);padding:16px;overflow-y:auto}\n.porta .caixa{width:100%;max-width:400px;background:rgba(8,13,18,.86);color:#eef3f6;border:1px solid rgba(255,255,255,.1);\n  border-radius:18px;padding:30px 28px;box-shadow:0 20px 60px rgba(0,0,0,.35);backdrop-filter:blur(8px)}\n.porta .logo{padding:0 0 18px}\n.porta h2{font-family:var(--disp);font-weight:800;font-size:20px;letter-spacing:-.01em}\n.porta p{font-size:13px;color:#a9b8c4;margin-top:6px}\n.porta form{display:flex;flex-direction:column;gap:10px;margin-top:18px}\n.porta input{font-size:16px;padding:12px 14px;border-radius:11px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);\n  color:#fff;letter-spacing:.12em}\n.porta input::placeholder{letter-spacing:0;color:#7f909e}\n.porta button{background:#22c3c1;color:#04211f;border:0;border-radius:11px;padding:12px;font-weight:700;font-size:14px}\n.porta button:hover{filter:brightness(1.08)}\n.porta button[disabled]{opacity:.6;cursor:wait}\n.porta .msg{min-height:20px;font-size:12.5px;color:#ffb199}\n.porta .pe{font-size:11.5px;color:#7f909e;margin-top:16px;line-height:1.5}\n.carregando{padding:80px 34px;color:var(--mudo);font-size:13px}\n\n/* celular e telas estreitas */\n@media (max-width:1180px){ .g5{grid-template-columns:repeat(3,minmax(0,1fr))} .g4{grid-template-columns:repeat(2,minmax(0,1fr))} }\n@media (max-width:900px){\n  .sa{grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr)}\n  .lado{flex-direction:row;align-items:center;overflow-x:auto;overflow-y:hidden;border-right:0;border-bottom:1px solid rgba(255,255,255,.06)}\n  .lado .logo{padding:10px 12px}\n  .lado .logo div{display:none}\n  .nav{flex-direction:row;padding:0 4px;gap:0}\n  .nav a{padding:9px 10px;font-size:12.5px;white-space:nowrap;gap:7px}\n  .nav a.ativa::before{left:10px;right:10px;top:auto;bottom:0;width:auto;height:3px;border-radius:3px 3px 0 0}\n  .nav a .em-breve{display:none}\n  .nav a.sub{display:none}\n  .lado .rodape{margin:0 0 0 auto;flex-direction:row;padding:6px 10px;align-items:center}\n  .lado .rodape .relogio span,.lado .rodape button span{display:none}\n  .lado .rodape button{width:auto}\n  .faixa{padding:20px 16px 22px}\n  .faixa h1{font-size:22px}\n  .miolo{padding:16px 16px 40px}\n  .g2,.g3,.g-12,.g-21{grid-template-columns:minmax(0,1fr)}\n  .g4,.g5{grid-template-columns:repeat(2,minmax(0,1fr))}\n  .mostrador{grid-template-columns:minmax(0,1fr)}\n  .rosca{grid-template-columns:minmax(0,1fr);justify-items:center}\n  .rosca ul{width:100%}\n  .tile .val{font-size:22px}\n  .escolhas{grid-template-columns:repeat(2,minmax(0,1fr))}\n  .item-plano{grid-template-columns:30px minmax(0,1fr)}\n  .item-plano .lado-d{grid-column:2;align-items:flex-start;text-align:left;flex-direction:row;flex-wrap:wrap}\n  .form{grid-template-columns:minmax(0,1fr)}\n  .abas.parceiros{flex-wrap:nowrap;overflow-x:auto}\n  .retratil > .cab{grid-template-columns:auto minmax(0,1fr);padding:12px 14px}\n  .retratil > .cab .dir{grid-column:1 / -1;justify-content:flex-start;gap:14px}\n  .mini{align-items:flex-start}\n  .retratil > .conteudo{padding:14px 12px 14px}\n  .cal .sem,.cal .grade-cal{gap:4px}\n  .cal .d{min-height:50px;padding:4px 5px}\n  .cal .d .v{font-size:10.5px}\n  .filtros label{flex:1 1 140px;max-width:none}\n}\n@media (prefers-reduced-motion:reduce){ *{transition:none !important;scroll-behavior:auto !important} }\n";
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
    telefone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>'
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
              abas: abas, tabela: tabela, chamarDev: chamarDev, baixarArquivo: baixarArquivo, lembrar: lembrar,
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

window.__orcamentoCentral = true;
/* =====================================================================
   painel_orcamento.js — Orçamento de público SuperAdds (LP da RD Station)
   ---------------------------------------------------------------------
   O anunciante passa o público (gênero, idade, região, renda) e quanto
   quer investir; a página responde quem são, onde estão, quantos são,
   em que lojas e varejistas, quantas mensagens o investimento paga e,
   no termômetro, quantas devem virar leitura.

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
  /* dentro da Central SuperAdds: sem fundo nem margem próprios, cores da Central */
  .app.embutido{min-height:0;background:transparent;--bg:transparent;--card:#fcfcfb;--soft:#f3f6f8}
  .app.embutido.escuro{--card:#172330;--soft:#1e2c3b;--line:rgba(255,255,255,.07);--deep:#0f3a40}
  .app.embutido .wrap{padding:0;max-width:none}
  .app.embutido .topo{padding:0 0 14px}
  .app.embutido .marca{display:none}
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
  .bn.b3{grid-template-columns:repeat(3,minmax(0,1fr))}

  /* termômetro (como um teste de velocidade) */
  .hero{display:grid;grid-template-columns:minmax(300px,400px) minmax(0,1fr);gap:13px;margin-top:13px;align-items:start}
  .hero .lado{display:flex;flex-direction:column;gap:13px;min-width:0}
  .tm{display:flex;flex-direction:column;align-items:center;text-align:center}
  .tm .hrow{align-self:stretch;text-align:left;margin-bottom:4px}
  .tm svg{width:100%;max-width:340px;height:auto;display:block}
  .tm .ver{display:inline-flex;align-items:center;gap:7px;font-size:12.5px;font-weight:600;border-radius:999px;padding:5px 13px;
    border:1px solid var(--line);background:var(--soft);color:var(--ink2)}
  .tm .ver.bom{color:var(--pos)}
  .tm .ver.baixo{color:var(--warn-ink);background:var(--warn-bg);border-color:var(--warn-line)}
  .tm .base{font-size:11px;color:var(--muted);margin-top:7px;line-height:1.45;max-width:320px}
  .leit{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;align-self:stretch;margin-top:14px;
    border-top:1px solid var(--line);padding-top:12px}
  .leit .r{font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);font-weight:600}
  .leit .v{font-family:var(--disp);font-weight:800;font-size:20px;margin-top:2px;font-variant-numeric:tabular-nums}
  .leit .s{font-size:10.5px;color:var(--muted2)}

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
  @media (max-width:1100px){.pedido{grid-template-columns:repeat(2,minmax(0,1fr))}.r-3{grid-template-columns:minmax(0,1fr)}
    .hero{grid-template-columns:minmax(0,1fr)}}
  @media (max-width:900px){.r-2{grid-template-columns:minmax(0,1fr)}.bn,.bn.b3{grid-template-columns:repeat(2,minmax(0,1fr))}
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

  // opt (só pela Central): {alvo, dados, tema} — os dados já chegam abertos pelo porteiro, sem senha própria
  function boot(opt) {
    opt = opt && opt.alvo ? opt : {};
    var slot = opt.alvo || document.getElementById("orcamento-supertroco");
    var host = document.createElement("div");
    if (slot) { slot.appendChild(host); } else { document.body.appendChild(host); }
    var root = host.attachShadow({ mode: "open" });
    root.innerHTML = "<style>" + CSS + "</style>" +
      '<div class="app' + (opt.dados ? " embutido" : "") + '"><div class="wrap" id="tela"><div class="carregando">Carregando&hellip;</div></div>' +
      '<div class="tip" id="tip"></div><div class="toast" id="toast" role="status"></div></div>';
    var $ = function (id) { return root.getElementById(id); };
    var app = root.querySelector(".app"), tela = $("tela"), tip = $("tip"), toast = $("toast");

    var PAC = null, D = null, X = null;
    var PED = { anunciante: "", gen: [true, true, false, false], idDe: 0, idAte: 9, ufs: {}, cidades: [], rendaDe: 0,
                rendaAte: 5, base: false, verba: "" };
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
    // valor digitado do jeito brasileiro: "20.000", "1.500,50", "R$ 20 mil", "20k"
    function lerValor(bruto) {
      var mult = /\d\s*(mil|k)\b/i.test(String(bruto || "")) ? 1000 : 1;
      var s = String(bruto || "").replace(/[^\d.,]/g, "");
      if (!s) return 0;
      if (s.indexOf(",") >= 0) s = s.replace(/\./g, "").replace(",", ".");
      else if (!/^\d+\.\d{1,2}$/.test(s)) s = s.replace(/\./g, "");      // ponto de milhar
      var v = parseFloat(s) * mult;
      return isFinite(v) && v > 0 ? v : 0;
    }
    function guardar(c, v) { try { localStorage.setItem("orc-" + c, v); } catch (e) { /* privado */ } }
    function ler(c) { try { return localStorage.getItem("orc-" + c); } catch (e) { return null; } }
    function avisar(t) { toast.textContent = t; toast.classList.add("on"); setTimeout(function () { toast.classList.remove("on"); }, 2600); }

    // ---------- tema ----------
    var tema = opt.tema || ler("tema") || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "escuro" : "claro");
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
        (opt.dados ? "" : '<button class="tbtn" id="bt-tema" aria-label="Trocar tema">' + (tema === "escuro" ? SOL : LUA) + '</button>') + '</div></div>';
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
      // investimento -> mensagens que ele paga (uma por contato, no máximo o público todo)
      R.custoUnit = D.custo.unitario || 0;
      R.verba = lerValor(PED.verba);
      R.possiveis = R.verba && R.custoUnit ? Math.floor(R.verba / R.custoUnit + 1e-9) : 0;
      R.mensagens = R.verba && R.custoUnit ? Math.min(R.possiveis, R.total) : R.total;
      R.excede = !!R.verba && R.possiveis > R.total;
      R.custo = R.mensagens * R.custoUnit;
      R.sobra = R.excede ? R.verba - R.custo : 0;
      R.cobertura = R.total ? R.mensagens / R.total : 0;
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
      var pico = 0, picoDia = 1, melhorMedia = -1, porDia = [0, 0, 0, 0, 0, 0, 0, 0];
      for (var h = 0; h < 24; h++) if (H[h] > H[pico]) pico = h;
      for (var d = 1; d <= 7; d++) {
        var media = X.diasNoCaixa[d] ? Dd[d] / X.diasNoCaixa[d] : Dd[d];
        porDia[d] = media;
        if (media > melhorMedia) { melhorMedia = media; picoDia = d; }
      }
      return {
        usaPerfil: usaPerfil, enviosPerfil: perf.envios, envios: cmp.envios,
        sucesso: cmp.envios ? cmp.lidas / cmp.envios : 0,            // o termômetro: lidas ÷ enviadas
        refSucesso: geral.envios ? geral.lidas / geral.envios : 0,   // a marca: média de todas as campanhas
        porDia: porDia,
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
    function barras(itens, total, cor, unidade) {
      if (!itens.length) return '<div class="vazio">Nenhuma pessoa com este pedido.</div>';
      var max = Math.max.apply(null, itens.map(function (x) { return x.v; })) || 1;
      return '<div class="part">' + itens.map(function (x) {
        var share = total ? x.v / total : 0;
        return '<div class="pl" data-tip="' + esc(nf(x.v) + " " + (unidade || "pessoas") + " · " + pct(share) + "\n" + x.r) + '"><div class="h"><span>' + esc(x.r) +
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

    // ---------- termômetro: mostrador de 240°, como um teste de velocidade ----------
    var TM_CX = 170, TM_CY = 148, TM_R = 108, TM = { atual: 0, raf: 0 };
    var COR_TM = { trilho: "var(--track)", valor: "var(--s1)", tinta: "var(--ink)", suave: "var(--muted)", fundo: "var(--card)" };
    function tmPonto(a, r) { var rad = a * Math.PI / 180; return [TM_CX + r * Math.sin(rad), TM_CY - r * Math.cos(rad)]; }
    function tmAngulo(v) { return -120 + 240 * Math.max(0, Math.min(1, v)); }
    function termometroSvg(v, ref, c) {
      var f = function (n) { return n.toFixed(1); }, p0 = tmPonto(-120, TM_R), p1 = tmPonto(120, TM_R);
      var arco = "M " + f(p0[0]) + " " + f(p0[1]) + " A " + TM_R + " " + TM_R + " 0 1 1 " + f(p1[0]) + " " + f(p1[1]);
      var fonte = "font-family=\"Inter,system-ui,sans-serif\"", g = "";
      g += '<path d="' + arco + '" fill="none" stroke="' + c.trilho + '" stroke-width="16" stroke-linecap="round"/>';
      g += '<path id="tm-arco" d="' + arco + '" pathLength="100" fill="none" stroke="' + c.valor + '" stroke-width="16" stroke-linecap="round"' +
        ' stroke-dasharray="' + (Math.max(0, Math.min(1, v)) * 100).toFixed(2) + ' 100"' + (v > 0.002 ? '' : ' opacity="0"') + '/>';
      for (var t = 0; t <= 10; t++) {                                  // marcas a cada 10%, número a cada 20%
        var a = -120 + 24 * t, q0 = tmPonto(a, TM_R - 13), q1 = tmPonto(a, TM_R - (t % 2 ? 17 : 21));
        g += '<line x1="' + f(q0[0]) + '" y1="' + f(q0[1]) + '" x2="' + f(q1[0]) + '" y2="' + f(q1[1]) + '" stroke="' + c.suave +
          '" stroke-width="1.5" opacity=".55"/>';
        if (t % 2 === 0) {
          var q = tmPonto(a, TM_R - 34);
          g += '<text x="' + f(q[0]) + '" y="' + f(q[1] + 4) + '" text-anchor="middle" font-size="11" ' + fonte + ' fill="' + c.suave + '">' + (t * 10) + '</text>';
        }
      }
      if (ref > 0) {                                                   // a média de todas as campanhas
        var ar = tmAngulo(ref), m0 = tmPonto(ar, TM_R - 12), m1 = tmPonto(ar, TM_R + 12), ml = tmPonto(ar, TM_R + 24);
        var lado = Math.sin(ar * Math.PI / 180), anc = lado > 0.3 ? "start" : lado < -0.3 ? "end" : "middle";
        g += '<g data-tip="' + esc("Média das campanhas: " + pct(ref) + " das mensagens lidas") + '">' +
          '<line x1="' + f(m0[0]) + '" y1="' + f(m0[1]) + '" x2="' + f(m1[0]) + '" y2="' + f(m1[1]) + '" stroke="' + c.tinta +
          '" stroke-width="3" stroke-linecap="round"/><text x="' + f(ml[0]) + '" y="' + f(ml[1] + 4) + '" text-anchor="' + anc +
          '" font-size="11" font-weight="600" ' + fonte + ' fill="' + c.tinta + '">média ' + pct(ref, 0) + '</text></g>';
      }
      g += '<g id="tm-agulha" transform="rotate(' + tmAngulo(v).toFixed(2) + ' ' + TM_CX + ' ' + TM_CY + ')">' +
        '<path d="M ' + (TM_CX - 5.5) + ' ' + (TM_CY + 2) + ' L ' + TM_CX + ' ' + (TM_CY - TM_R + 32) + ' L ' + (TM_CX + 5.5) + ' ' + (TM_CY + 2) +
        ' Z" fill="' + c.tinta + '"/><circle cx="' + TM_CX + '" cy="' + TM_CY + '" r="10" fill="' + c.tinta + '"/>' +
        '<circle cx="' + TM_CX + '" cy="' + TM_CY + '" r="4" fill="' + c.fundo + '"/></g>';
      g += '<text id="tm-num" x="' + TM_CX + '" y="' + (TM_CY + 78) + '" text-anchor="middle" font-size="38" font-weight="800" ' +
        'font-family="\'Plus Jakarta Sans\',system-ui,sans-serif" fill="' + c.tinta + '">' + pct(v) + '</text>' +
        '<text x="' + TM_CX + '" y="' + (TM_CY + 100) + '" text-anchor="middle" font-size="12" ' + fonte + ' fill="' + c.suave +
        '">das mensagens viram leitura</text>';
      return '<svg viewBox="0 0 340 ' + (TM_CY + 110) + '" role="img" aria-label="Termômetro de sucesso: ' + esc(pct(v)) +
        ' das mensagens viram leitura">' + g + '</svg>';
    }
    function veredito(P) {
      var dif = (P.sucesso - P.refSucesso) * 100;
      if (!P.usaPerfil) return { cls: "", ic: "●", t: "Taxa média das campanhas",
        base: "O perfil pedido tem só " + nf(P.enviosPerfil) + " envios com cadastro conhecido: o termômetro usa a taxa de todas as campanhas (" + nf(P.envios) + " envios)." };
      var base = "Pelo próprio perfil, em " + nf(P.envios) + " envios da campanha Ayumi/Porto.";
      if (P.sucesso >= P.refSucesso * 1.1) return { cls: "bom", ic: "▲", t: nf(dif, 1) + " pontos acima da média", base: base };
      if (P.sucesso <= P.refSucesso * 0.9) return { cls: "baixo", ic: "▼", t: nf(-dif, 1) + " pontos abaixo da média", base: base };
      return { cls: "", ic: "●", t: "Na média das campanhas", base: base };
    }
    function painelTermometro(R) {
      var P = R.plus, vd = veredito(P);
      var leit = function (r, v, s) { return '<div><div class="r">' + esc(r) + '</div><div class="v">' + esc(v) + '</div><div class="s">' + esc(s) + '</div></div>'; };
      return '<div class="painel tm"><div class="hrow"><div><h3>Termômetro de sucesso</h3><div class="cap">quantas mensagens devem virar leitura, ' +
        'pelo que já enviamos (Plus · ADS - 01)</div></div></div>' +
        termometroSvg(TM.atual, P.refSucesso, COR_TM) +
        '<span class="ver ' + vd.cls + '"><span aria-hidden="true">' + vd.ic + '</span>' + esc(vd.t) + '</span>' +
        '<div class="base">' + esc(vd.base) + '</div>' +
        '<div class="leit">' + leit("Entrega", pct(P.taxaEntrega, 0), "das mensagens") + leit("Leitura", pct(P.taxaLeitura, 0), "das entregues") +
          leit("Até ler", P.tipico ? nf(P.tipico, 0) + " min" : "—", "tempo típico") + '</div></div>';
    }
    // o ponteiro corre do valor anterior até o novo (a primeira vez, do zero)
    function animarTermometro(alvo) {
      var arco = $("tm-arco"), agulha = $("tm-agulha"), num = $("tm-num");
      if (!arco) return;
      cancelAnimationFrame(TM.raf);
      var de = TM.atual, t0 = null, dur = de === 0 ? 1600 : 800;
      var pinta = function (v) {
        TM.atual = v;
        arco.setAttribute("stroke-dasharray", (v * 100).toFixed(2) + " 100");
        arco.setAttribute("opacity", v > 0.002 ? "1" : "0");
        agulha.setAttribute("transform", "rotate(" + tmAngulo(v).toFixed(2) + " " + TM_CX + " " + TM_CY + ")");
        num.textContent = pct(v);
      };
      var calmo = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (calmo || Math.abs(alvo - de) < 0.0005) { pinta(alvo); return; }
      var passo = function (ts) {
        if (t0 === null) t0 = ts;
        var k = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        pinta(de + (alvo - de) * e);
        if (k < 1) TM.raf = requestAnimationFrame(passo);
      };
      TM.raf = requestAnimationFrame(passo);
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
        '<label class="campo"><span class="rot">Quanto quer investir (R$)</span><input type="text" inputmode="decimal" id="f-verba" maxlength="20" placeholder="Ex.: 20.000" value="' + esc(PED.verba) + '"></label>' +
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
      $("f-verba").addEventListener("input", function (e) { PED.verba = e.target.value; mudou(false); });
      $("f-verba").addEventListener("blur", function (e) {           // ao sair do campo, mostra no formato R$ (20.000 ou 1.500,50)
        var v = lerValor(e.target.value);
        PED.verba = e.target.value = v ? nf(v, v % 1 ? 2 : 0) : "";
        guardar("pedido", JSON.stringify(PED));
      });
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
                rendaDe: 0, rendaAte: D.dic.renda.length - 1, base: false, verba: "" };
        mostrarTodas = false; mudou(true);
      });
    }

    var ULTIMO = null;
    function desenhar() {
      var R = calcular(), dic = D.dic;
      ULTIMO = R;
      var P = R.plus;
      var nums = numeros([
        ["Contatos catalogados", nf(R.total), R.verba && !R.excede && R.total ? "o investimento alcança " + pct(R.cobertura) + " deles" :
          PED.base ? "base enriquecida, com e sem compra desde 2025" : "compradores da base enriquecida", true],
        R.verba ? ["Mensagens com o investimento", nf(R.possiveis), R.excede ? "o público tem " + nf(R.total) + ": cabem só " + nf(R.mensagens) :
            moeda(R.verba, R.verba % 1 ? 2 : 0) + " ÷ " + moeda(R.custoUnit, 4) + " por mensagem", false, R.excede]
          : ["Mensagens com o investimento", "—", "informe quanto quer investir", false],
        [R.verba ? "Investimento usado" : "Custo para atingir todos", moeda(R.custo, 2), R.excede ? "sobram " + moeda(R.sobra, 2) + " de " + moeda(R.verba, 2) :
          nf(R.mensagens) + " mensagens × " + moeda(R.custoUnit, 4) + " (Meta + impostos)", true],
        ["Lojas", nf(R.lojas), "onde esse público compra", false],
        ["Varejistas", nf(R.nVarejistas), "redes dessas lojas", false],
        ["Custo por leitura", R.lidas ? moeda(R.custo / R.lidas, 2) : "—", "≈ " + nf(R.lidas) + " leituras esperadas", false]]).replace('class="bn"', 'class="bn b3"');

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
        etapa("Mensagens", nf(R.mensagens), !R.verba ? "todo o público catalogado" : R.excede ? "todo o público (o investimento sobra)" : "o que o investimento paga") +
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
      var semana = [];
      for (var d = 1; d <= 7; d++) semana.push({ r: DIAS[d], v: P.porDia[d] });
      var totSemana = semana.reduce(function (a, b) { return a + b.v; }, 0);

      $("resultado").innerHTML =
        '<div class="sec">Quantos são e quanto custa</div>' +
        '<div class="hero">' + painelTermometro(R) + '<div class="lado">' + nums +
          (R.excede ? '<div class="aviso" style="margin-top:0">Com ' + moeda(R.verba) + ' dá para enviar ' + nf(R.possiveis) +
            ' mensagens, mas este público tem ' + nf(R.total) + ' contatos: o orçamento usa ' + moeda(R.custo) + ' e sobram ' + moeda(R.sobra) +
            '. Para usar todo o investimento, abra a faixa etária, a renda ou a região.</div>' : '') +
          painel("O que esperar das mensagens", "a partir do que já enviamos", funil) + '</div></div>' +
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
        '<div class="sec">Quando abordar <small>Plus · ADS - 01 Ayumi Porto</small></div><div class="row r-2">' +
          painel("Quando esse público está na loja", "movimento no caixa por hora (% do dia) · em destaque, o pico", caixa) +
          painel("Por dia da semana", "consultas no caixa, em média por dia", barras(semana, totSemana, null, "consultas por dia")) + '</div>';
      var bl = $("bt-lojas");
      if (bl) bl.addEventListener("click", function () { mostrarTodas = !mostrarTodas; desenhar(); });
      animarTermometro(R.total ? P.sucesso : 0);
    }
    function etapa(r, v, s) { return '<div class="etapa"><div class="r">' + esc(r) + '</div><div class="v">' + esc(v) + '</div><div class="s">' + esc(s) + '</div></div>'; }
    function notas() {
      var c = D.custo, i = D.info;
      return '<div class="nota"><b>Como ler.</b> Contatos catalogados = pessoas da base enriquecida do MKT 63 com compra desde 01/01/2025 ' +
        '(o mesmo critério do painel: ' + nf(i.compradores) + ' de ' + nf(i.base) + ' na base). Renda estimada pelo bureau, em faixas de salário mínimo (R$ ' +
        nf(i.renda_sm) + '). O MKT 63 tem o troco de cada compra, não o valor: por isso o filtro é a renda, e o ticket aparece só no Plus (lojas Ayumi). ' +
        '<b>Custo</b> = só o nosso: preço Meta de marketing (' + moeda(c.preco_meta, 4) + ' por mensagem) + impostos (' + nf(c.impostos_pct, 2) +
        '%, conforme o parametros.xlsx). <b>Mensagens com o investimento</b> = investimento ÷ custo por mensagem, uma por contato, ' +
        'no máximo o público todo. <b>Termômetro</b> = mensagens lidas ÷ mensagens enviadas na campanha Ayumi/Porto; a marca no mostrador é a média ' +
        'de todas as campanhas. <b>Plus</b> = campanhas e caixa do ADS - 01; o perfil só aparece para quem tem cadastro no app, ' +
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
        "Contatos catalogados: " + nf(R.total) + "\n" +
        (R.verba ? "Investimento: " + moeda(R.verba) + " = " + nf(R.possiveis) + " mensagens" +
          (R.excede ? " (o público tem " + nf(R.total) + ": usa " + moeda(R.custo) + ", sobram " + moeda(R.sobra) + ")" : " (alcança " + pct(R.cobertura) + " do público)") + "\n" : "") +
        "Onde estão: " + nf(R.lojas) + " lojas de " + nf(R.nVarejistas) + " varejistas (" + vars.slice(0, 6).join(", ") + (vars.length > 6 ? "…" : "") + ")\n" +
        "Principais lojas: " + lojas.join("; ") + "\n" +
        (R.verba ? "Investimento usado: " : "Custo para atingir todos: ") + moeda(R.custo) + " (" + nf(R.mensagens) + " mensagens × " + moeda(R.custoUnit, 4) + ", Meta + impostos)\n" +
        "Termômetro de sucesso: " + pct(P.sucesso) + " das mensagens viram leitura (" + veredito(P).t.toLowerCase() +
          (P.usaPerfil ? (veredito(P).cls ? " de " : ", de ") + pct(P.refSucesso) : "") + ")\n" +
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
        '.tm{display:flex;gap:24px;align-items:center;flex-wrap:wrap}.tm svg{width:260px;height:auto}.tm .ver{font-weight:700;font-size:15px}' +
        '.tm .base{color:#5F7C83;margin-top:4px;max-width:420px}' +
        '@media print{body{margin:14mm}}</style></head><body>' +
        '<h1>Orçamento de público' + (PED.anunciante ? " — " + esc(PED.anunciante) : "") + '</h1><div class="sub">SuperAdds · ' + hoje + '</div>' +
        '<h2>Pedido</h2><table>' + linha("Público", esc(descricaoPedido())) + (R.verba ? linha("Investimento", moeda(R.verba)) : "") + '</table>' +
        '<h2>Termômetro de sucesso</h2><div class="tm">' +
        termometroSvg(P.sucesso, P.refSucesso, { trilho: "#E9F0F1", valor: "#2a78d6", tinta: "#123A41", suave: "#5F7C83", fundo: "#fff" }) +
        '<div><div class="ver">' + veredito(P).ic + " " + esc(veredito(P).t) + '</div><div class="base">' + esc(veredito(P).base) +
        ' Entrega ' + pct(P.taxaEntrega, 0) + ' das mensagens; leitura ' + pct(P.taxaLeitura, 0) + ' das entregues' +
        (P.tipico ? '; tempo típico até ler ' + nf(P.tipico, 0) + ' min' : '') + '.</div></div></div>' +
        '<h2>Quantos são e quanto custa</h2><table>' +
        linha("Contatos catalogados", '<span class="big">' + nf(R.total) + '</span>') +
        (R.verba ? linha("Mensagens com o investimento", nf(R.possiveis) + (R.excede ? " · o público tem " + nf(R.total) + ": o orçamento usa " + moeda(R.custo) +
          " e sobram " + moeda(R.sobra) : " · alcança " + pct(R.cobertura) + " do público")) : "") +
        linha("Mensagens no orçamento", nf(R.mensagens)) +
        linha(R.verba ? "Investimento usado" : "Custo para atingir todos", '<span class="big">' + moeda(R.custo) + '</span> (' + moeda(R.custoUnit, 4) + ' por mensagem: Meta + impostos)') +
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
    if (opt.dados) {
      D = opt.dados;
      preparar();
      telaOrcamento();
      return;
    }
    baixar(ORC_URL).catch(function () { return baixar(ORC_URL_FALLBACK); }).then(function (pac) {
      PAC = pac;
      telaSenha();
    }).catch(function (e) {
      tela.innerHTML = '<div class="carregando">Não foi possível carregar o orçamento (' + esc(e.message) + ').</div>';
    });
  }

  window.__orcamentoBoot = boot;
  if (window.__orcamentoCentral) { return; }        // a Central chama o boot com os dados abertos
  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", function () { boot(); }); }
  else { boot(); }
})();

/* orcamento.js — o Orçamento de público dentro da Central: a mesma tela de sempre (orcamento/painel_orcamento.js,
   embutida no código desta página pelo montar.py), com a senha do porteiro e a barra lateral.
   Dados: central/orcamento.json (o mesmo pacote do gerar_orcamento.py, cifrado com a chave do porteiro). */

SA.pagina({
  render: function (d, ui) {
    var i = d.info || {}, f = ui.fmt;
    return {
      faixa: {
        trilha: "Orçamento de público",
        titulo: "Quem são, onde estão e quanto custa falar com eles",
        sub: "digite o público e o investimento: a página responde na hora",
        pilulas: ["MKT 63 de " + ui.esc(i.mkt63_atualizado ? new Date(i.mkt63_atualizado).toLocaleDateString("pt-BR") : "—"),
                  "ADS-01 de " + ui.esc(i.ads01_atualizado ? new Date(i.ads01_atualizado).toLocaleDateString("pt-BR") : "—"),
                  f.compacto(i.compradores) + " compradores na base"]
      },
      html: '<div id="orc-alvo"></div>'
    };
  },
  depois: function (raiz, d) {
    var alvo = raiz.querySelector("#orc-alvo");
    if (alvo && window.__orcamentoBoot) {
      window.__orcamentoBoot({ alvo: alvo, dados: d, tema: raiz.classList.contains("claro") ? "claro" : "escuro" });
    }
  }
});

})();
