/* Central SuperAdds · Cérebro (IA) · montado em 31/10/2026 02:09 (central/montar.py). Não edite aqui: edite ui/ e paginas/. */
(function () {
"use strict";
var CFG = {"pagina": "ia", "titulo": "Cérebro (IA)", "alvo": "central-superadds", "porteiro": "https://superadds-central.mkt-7c4.workers.dev", "dados": ["https://raw.githubusercontent.com/SupertrocoWeb/painel/main/central/ia.json", "https://cdn.jsdelivr.net/gh/SupertrocoWeb/painel@main/central/ia.json"], "paginas": [{"id": "inicio", "nome": "Início", "icone": "casa", "url": "https://supertroco-4.rds.land/inicio"}, {"id": "personas", "nome": "Personas", "icone": "pessoas", "url": "https://retail-media.superadds.com.br/super-adds-personas", "abas": [{"id": "comportamento", "nome": "Comportamento"}, {"id": "rotina", "nome": "Rotina"}, {"id": "pessoas", "nome": "Pessoas"}]}, {"id": "financeiro", "nome": "Financeiro", "icone": "carteira", "url": "https://retail-media.superadds.com.br/superadds-financeiro"}, {"id": "estrategia", "nome": "Estratégia", "icone": "alvo", "url": "https://retail-media.superadds.com.br/superadds-estrategias"}, {"id": "ia", "nome": "Cérebro (IA)", "icone": "ia", "url": "https://retail-media.superadds.com.br/superadds-ia-brain"}, {"id": "dev", "nome": "Desenvolvedor", "icone": "codigo", "url": "https://retail-media.superadds.com.br/superadds-for-devs"}, {"id": "orcamento", "nome": "Orçamento", "icone": "calc", "url": "https://retail-media.superadds.com.br/superadds-base"}]};
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

/* ia.js — Cérebro SuperAdds: a página só da IA.
   O raciocínio de hoje em cadeias ("dia · loja · horário · quem · produto, porque... porque..."), as sugestões de mudança,
   os padrões e as hipóteses testadas, o mercado (com o dado como juiz), o que dá e o que não dá para prever, os dias
   parecidos com hoje, a auditoria do Claude e o diário de cada decisão da IA.
   Dados: central/ia.json (cerebro.py, na rotina das 2h; a auditoria do Claude entra pelo /cerebro no VS Code). */

var SA_IA = { alvo: "lida", hf: {} };

var IA_FORCA = { confirmado: "confirmado", medido: "medido", "em teste": "em teste", contexto: "contexto", refutado: "não se repetiu" };
var IA_REV = { aprovada: ["Aprovada pelo revisor", "bom"], rebaixada: ["Rebaixada pelo revisor", "atencao"], reprovada: ["Reprovada", "critico"],
               "sem revisão": ["Sem revisão", "neutro"] };
var IA_CONF = { alta: ["Confiança alta", "bom"], "média": ["Confiança média", "atencao"], baixa: ["Confiança baixa", "neutro"] };
var IA_HIP = { vivo: ["Viva", "bom"], "em teste": ["Em teste", "atencao"], descartado: ["Descartada", "critico"] };
var IA_PAD = { confirmado: ["Confirmado", "bom"], "em teste": ["Em teste", "atencao"], "não se repetiu": ["Não se repetiu", "critico"] };
var IA_FONTE = { descoberta: "achada nos dados", analista: "analista (Groq)", claude: "auditoria do Claude" };
var IA_TIPO = { horario: "Horário", loja: "Loja", template: "Template", mensagem: "Mensagem", teste: "Teste A/B" };
var IA_PAPEL = { analista: "Analista", revisor: "Revisor", "notícias: triagem": "Notícias · triagem", "notícias: visão do mercado": "Notícias · visão",
                 "estratégia do dia": "Estratégia do dia", "personas": "Personas" };

function iaCap(s) { s = String(s || ""); return s.charAt(0).toUpperCase() + s.slice(1); }

var IA_ACAO = { manter: ["Manter", "bom"], testar: ["Teste A/B", "atencao"], trocar: ["Trocar", "bom"] };
var IA_TESTE = { "aguardando o disparador": ["Aguardando o disparador", "atencao"], rodando: ["Rodando", "bom"], "desafiante venceu": ["Desafiante venceu", "bom"],
                 "campeão venceu": ["Campeão venceu", "neutro"], empate: ["Empate", "neutro"] };
var IA_ATIVOS = ["aguardando o disparador", "rodando"];

// As ordens por horário, com os horários de mesma ordem juntos (o consignado tem um teste só, o dia todo)
function iaGrupos(ordens) {
  var g = [];
  (ordens || []).forEach(function (o) {
    var k = [o.produto, o.produto === "Consórcio imobiliário" ? o.janela : "", o.acao, o.teste || "",
             o.templates.map(function (t) { return t.template + ":" + t.peso; }).join("|")].join("#");
    var x = g.filter(function (y) { return y._k === k; })[0];
    if (x) x.janelas.push(o.janela); else g.push(Object.assign({}, o, { _k: k, janelas: [o.janela] }));
  });
  g.forEach(function (x) { x.quando = x.janelas.length === 4 ? "todos os horários" : x.janelas.length > 1 ? x.janelas.join(" e ") : x.janela + " (" + x.horario + ")"; });
  return g;
}

function iaOrdemTxt(ui, o) {
  var esc = ui.esc;
  if (o.templates.length === 1) return "<b>" + esc(o.templates[0].template) + "</b> em 100%";
  return o.templates.map(function (t) { return t.peso + "% <b>" + esc(t.template) + "</b>" + (t.papel === "desafiante" ? " <small>(desafiante)</small>" : ""); }).join(" + ");
}

function iaHojeTxt(ui, o) {
  var h = o.hoje || [];
  return h.length ? h.slice(0, 2).map(function (x) { return ui.fmt.pct(x.pct, 0) + " " + ui.esc(x.template); }).join(" · ") : "sem envio desse produto";
}

function iaTempos(ui, d) {
  var esc = ui.esc, f = ui.fmt, dec = d.decisao || {}, pl = dec.placar || {}, o = (pl.dias || []).slice(-1)[0], pa = dec.plano_amanha || {},
      of = dec.oficial_hoje || {}, ja = dec.jeito_atual || {}, pv = pa.previsao || {};
  var li = function (x) { return "<li>" + x + "</li>"; };
  // Já fizemos (ontem)
  var ontem = '<div class="cartao tempo"><div class="cab-t"><span class="rot">Já fizemos</span><b>Ontem · ' + esc(o ? f.dataLonga(o.dia) + " (" + o.dia_semana + ")" : "—") + "</b></div>";
  if (o) {
    ontem += '<div class="grande">' + esc(f.pct(o.leitura)) + "<small>de leitura</small></div>" +
      '<div class="cap">' + esc(f.num(o.envios) + " envios · " + f.num(o.lidas) + " lidas" + (o.fechado ? "" : " · a leitura fecha às 7h")) + "</div><ul>" +
      li("Eu previa <b>" + esc(f.pct(o.previsto)) + "</b> (de " + esc(f.pct(o.faixa[0]) + " a " + f.pct(o.faixa[1])) + ") " +
         ui.tag(o.dentro ? "Dentro da faixa" : "Fora da faixa", o.dentro ? "bom" : "critico") +
         (o.fonte === "reconstruída" ? '<br><small class="cap">previsão reconstruída: o Cérebro ainda não existia nesse dia; refeita só com os dias de antes</small>' : "")) +
      li("Por horário: <b>" + o.acertos + " de " + o.avaliadas + "</b> previsões certas") +
      li(o.mudancas_pedidas ? "O plano pediu <b>" + o.mudancas_pedidas + " mudança(s)</b> de template; o disparador fez <b>" + o.mudancas_feitas + "</b> " +
         ui.tag(o.mudancas_feitas === o.mudancas_pedidas ? "Plano seguido" : o.mudancas_feitas ? "Plano seguido em parte" : "Plano não seguido",
                o.mudancas_feitas === o.mudancas_pedidas ? "bom" : "atencao") : "O plano não pediu mudança de template") + "</ul>";
  } else ontem += '<p class="cap">Ainda sem dia com envio para conferir.</p>';
  ontem += "</div>";

  // Estamos fazendo (hoje)
  var t0 = (ja.templates || [])[0] || {}, t1 = (ja.templates || [])[1];
  var hoje = '<div class="cartao tempo"><div class="cab-t"><span class="rot">Estamos fazendo</span><b>Hoje · ' + esc(f.dataLonga(dec.hoje) || "—") + "</b></div>" +
    '<div class="grande">' + esc(f.pct(t0.pct, 0)) + '<small>com o mesmo template</small></div><div class="cap">' + esc((t0.template || "—") + (t1 ? " · " + f.pct(t1.pct, 0) + " " + t1.template : "")) + "</div><ul>" +
    li("O disparador manda cerca de <b>" + esc(f.num(ja.ritmo_hora)) + " por hora</b>, das " + esc(((ja.por_hora || [])[0] || {}).hora + "h às " + ((ja.por_hora || []).slice(-1)[0] || {}).hora + "h") +
       " <small class=\"cap\">(o jeito de " + esc(f.data(ja.dia)) + ", o último dia com dado)</small>");
  if (of.antigo) {
    hoje += li("O plano em vigor (" + esc(of.motor || "—") + ") destaca <b>" + esc((of.destaque || []).join(" e ") || "—") + "</b> em " + of.lojas_destaque + " lojas e pede " +
      (of.pedidos || []).length + " teste(s) em lojas soltas, um template diferente em cada");
  } else if (of.ordens) {
    var mud = of.ordens.filter(function (x) { return x.muda; }).length;
    hoje += li("O plano em vigor (" + esc(of.motor || "Cérebro") + ") pede <b>" + mud + " mudança(s)</b> de template por horário");
  }
  var naoFez = o && o.mudancas_pedidas && o.mudancas_feitas < o.mudancas_pedidas;
  hoje += li("Bate com o plano? " + (naoFez ? ui.tag("Ainda não", "atencao") + " os testes pedidos não saíram: o disparador segue com o template de sempre" :
                                         ui.tag("Sim", "bom") + " nada pendente do plano de ontem")) + "</ul></div>";

  // Vamos fazer (amanhã)
  var gs = iaGrupos(pa.ordens);
  var amanha = '<div class="cartao tempo amanha"><div class="cab-t"><span class="rot">Vamos fazer</span><b>Amanhã · ' + esc(f.dataLonga(pa.dia) + " (" + (pa.dia_semana || "") + ")") + "</b></div>" +
    '<div class="grande">' + esc(f.pct(pv.leitura)) + '<small>de leitura esperada</small></div><div class="cap">' +
    esc(pv.faixa ? "faixa de " + f.pct(pv.faixa[0]) + " a " + f.pct(pv.faixa[1]) + " · ~" + f.num(pv.lidas) + " lidas em ~" + f.num(pv.envios) + " envios · ~" + f.num(pv.interesse) + " interesses" : "sem previsão") +
    "</div><ul>" + gs.map(function (g) {
      var a = IA_ACAO[g.acao] || [g.acao, "neutro"];
      return li(ui.tag(a[0], a[1]) + " <b>" + esc(g.produto_nome + " · " + g.quando) + "</b><br>" + iaOrdemTxt(ui, g));
    }).join("") + "</ul>" +
    ((pa.calendario || {}).feriado ? ui.aviso("Amanhã é feriado (" + esc(pa.calendario.feriado) + "): o resultado vale, mas não entra nas conclusões de dia da semana.", "info") : "") + "</div>";
  return '<div class="grade g3 tempos" style="margin-bottom:16px">' + ontem + hoje + amanha + "</div>";
}

function iaOrdens(ui, d) {
  var esc = ui.esc, f = ui.fmt, dec = d.decisao || {}, pa = dec.plano_amanha || {}, gs = iaGrupos(pa.ordens);
  var porque = function (g) {
    if (g.acao === "manter") return "lê " + (g.previsao === "acima" ? "acima" : "perto") + " da média (" + (g.contra_media > 0 ? "+" : "") + f.num(g.contra_media, 1) + " pts): não se mexe no que funciona";
    if (g.acao === "trocar") return "o desafiante venceu o teste deste horário";
    if (g.produto !== "Consórcio imobiliário") return "pouco volume: um teste só, o dia todo, para juntar base mais rápido";
    return "lê " + (g.previsao === "abaixo" ? "abaixo da" : "na") + " média (" + (g.contra_media > 0 ? "+" : "") + f.num(g.contra_media, 1) + " pts): o teste " + g.teste + " procura um template melhor";
  };
  var corpo = ui.tabela([
    { t: "Produto · horário", k: function (g) { return "<b>" + esc(g.produto_nome) + "</b> · " + esc(g.quando); }, esq: true, html: true },
    { t: "O disparador hoje", k: function (g) { return iaHojeTxt(ui, g); }, esq: true, html: true },
    { t: "Amanhã", k: function (g) { var a = IA_ACAO[g.acao] || [g.acao, "neutro"]; return ui.tag(a[0], a[1]) + '<div style="margin-top:4px">' + iaOrdemTxt(ui, g) + "</div>"; }, esq: true, html: true },
    { t: "Muda?", k: function (g) { return g.muda ? ui.tag("Muda", "atencao") : ui.tag("Igual", "neutro"); }, html: true },
    { t: "Leitura esperada", k: function (g) { return g.produto === "Consórcio imobiliário" ? f.pct(g.leitura_esperada) : "—"; } },
    { t: "Por quê", k: porque, esq: true }
  ], gs, { min: 1000, vazio: "Sem ordens nesta rodada." });

  var testes = (dec.testes || []).filter(function (t) { return IA_ATIVOS.indexOf(t.status) >= 0; });
  if (testes.length) {
    corpo += ui.secao("Testes A/B", "critério escrito antes; com 1.000 entregues de cada lado (ou 300+ e 95% de certeza), o que ler mais fica") +
      '<div class="grade g3">' + testes.map(function (t) {
        var futuro = t.planejado_em > dec.dados_ate && !t.desafiante_n, st = futuro ? ["Começa " + f.data(t.planejado_em), "neutro"] : IA_TESTE[t.status] || [t.status, "neutro"];
        var onde = t.janelas.length === 4 ? "todos os horários" : t.janelas.join(" e ");
        var n = function (v) { return f.num(v); }, uso = function () { return ui.uso.apply(null, arguments).replace(/do limite/g, "do alvo"); };
        var frase = t.status === "rodando"
          ? "O desafiante lê " + f.pct(t.desafiante_leitura) + " contra " + f.pct(t.campeao_leitura) + " do campeão · certeza de ser melhor: " + f.pct(t.p_melhor, 0) + "."
          : futuro ? "No ritmo de ~" + n(t.entregues_dia) + " entregues por dia nesse horário, a resposta sai em ~" + (t.dias_para_resposta || "?") + " dia(s), se o disparador seguir a ordem."
          : "O desafiante ainda não saiu: aguardando o disparador desde " + f.data(t.planejado_em) + ".";
        return '<div class="cartao"><div class="topo"><div><h3>' + esc(t.id + " · " + (t.produto === "Consórcio imobiliário" ? "consórcio" : "consignado CLT") + " · " + onde) + "</h3>" +
          '<div class="cap">' + esc(t.campeao + " × " + t.desafiante + (t.formato ? " (" + t.formato + ")" : "")) + "</div></div>" + ui.tag(st[0], st[1]) + "</div>" +
          uso("Campeão · entregues", t.campeao_n || 0, 1000, n, t.campeao_leitura != null ? "lê " + f.pct(t.campeao_leitura) : "") +
          uso("Desafiante · entregues", t.desafiante_n || 0, 1000, n, t.desafiante_leitura != null ? "lê " + f.pct(t.desafiante_leitura) : "") +
          '<p class="cap" style="margin-top:8px;font-size:12.5px">' + esc(frase) + "</p></div>";
      }).join("") + "</div>";
  }
  var pv = dec.para_voce || [];
  if (pv.length) {
    corpo += ui.secao("Decisões que dependem de você", "o motor não muda isso sozinho") +
      '<div class="lista-ia">' + pv.map(function (x) { return "<div><h5>" + esc(x.titulo) + "</h5><p>" + esc(x.texto) + "</p></div>"; }).join("") + "</div>";
  }
  var nota = '<p class="cap" style="margin-top:12px;font-size:12px">As ordens também ficam em arquivo (SharePoint › SuperAdds › estrategia › cerebro › ordens), ' +
    "um por dia, no formato que o disparador poderá ler sozinho: horário, produto e o peso de cada template. O envio nunca para e o total do dia não muda.</p>";
  return ui.retratil({ id: "ia-ordens", aberto: true, titulo: "As ordens de amanhã, horário a horário", icone: "seta",
    sub: esc("o que o disparador faz hoje × o que eu faria amanhã, os testes A/B e o que depende de você"),
    direita: ui.mini("mudam", String(gs.filter(function (g) { return g.muda; }).length)) + ui.mini("testes", String(testes.length)), corpo: corpo + nota });
}

function iaPlacar(ui, d) {
  var esc = ui.esc, f = ui.fmt, dec = d.decisao || {}, pl = dec.placar || {}, ds = dec.disputa || {};
  var corpo = '<div class="grade g4" style="margin-bottom:14px">' +
    ui.tile("Leitura do dia na faixa", esc(pl.dias_avaliados ? pl.dentro + " de " + pl.dias_avaliados : "—") + "<small>dias</small>", "a faixa cobre 8 de cada 10 erros dos dias de antes", "var(--s1)") +
    ui.tile("Por horário", esc(f.pct(pl.pct_horarios, 0)), esc(pl.acertos + " de " + pl.avaliadas + " previsões certas (acima ou abaixo da média do dia)"), "var(--s3)") +
    ui.tile("Erro médio do dia", esc(pl.erro_medio != null ? f.num(pl.erro_medio, 1) : "—") + "<small>pontos</small>", "entre a leitura prevista e a real", "var(--s4)") +
    ui.tile("Mudanças feitas", esc((pl.mudancas_feitas || 0) + " de " + (pl.mudancas_pedidas || 0)), "o que os planos pediram e o disparador fez", "var(--s7)") + "</div>";
  corpo += ui.tabela([
    { t: "Dia", k: function (x) { return f.dataLonga(x.dia) + " · " + x.dia_semana; }, esq: true },
    { t: "Previsto", k: function (x) { return f.pct(x.previsto) + " (" + f.pct(x.faixa[0], 0) + "–" + f.pct(x.faixa[1], 0) + ")"; } },
    { t: "Aconteceu", k: function (x) { return f.pct(x.leitura) + (x.fechado ? "" : " (aberta)"); } },
    { t: "Na faixa?", k: function (x) { return x.dentro ? ui.tag("Dentro", "bom") : ui.tag("Fora", "critico"); }, html: true },
    { t: "Por horário", k: function (x) { return x.avaliadas ? x.acertos + " de " + x.avaliadas : "—"; } },
    { t: "Mudanças feitas", k: function (x) { return x.mudancas_pedidas ? x.mudancas_feitas + " de " + x.mudancas_pedidas : "—"; } },
    { t: "Previsão", k: function (x) { return x.fonte === "guardada" ? "guardada antes do dia" : "reconstruída"; } }
  ], (pl.dias || []).slice().reverse(), { min: 860, vazio: "Ainda sem dias para conferir." });
  var pr = ds.previsores || {};
  corpo += ui.secao("Disputa de previsores", ds.regra || "") + ui.tabela([
    { t: "Previsor", k: "nome", esq: true },
    { t: "Acerto", k: "pct", f: function (v) { return f.pct(v); } },
    { t: "Previsões", k: "previsoes", f: function (v) { return f.num(v); } },
    { t: "Erro médio", k: "erro", f: function (v) { return v == null ? "—" : f.num(v, 1) + " pts"; } },
    { t: "Situação", k: function (x) { return x.situacao === "campeão" ? ui.tag("Campeão", "bom") : ui.tag("Desafiante", "neutro"); }, html: true }
  ], Object.keys(pr).map(function (k) { return pr[k]; }), { min: 1 }) +
    '<p class="cap" style="margin-top:10px;font-size:12.5px">Os 14 dias antes de hoje, cada um previsto só com os dias de antes dele. Prever por loja não acerta mais que por horário: ' +
    "as ordens são por horário, em todas as lojas, e a loja entra só pelos clientes no caixa.</p>";
  return ui.retratil({ id: "ia-placar", aberto: false, titulo: "Placar: o que eu previ e pedi × o que aconteceu", icone: "recibo",
    sub: esc("os últimos dias, a previsão (guardada antes do dia ou reconstruída) contra o real, e se o disparador fez o que o plano pediu"),
    direita: ui.mini("na faixa", pl.dias_avaliados ? pl.dentro + "/" + pl.dias_avaliados : "—") + ui.mini("por horário", f.pct(pl.pct_horarios, 0)), corpo: corpo });
}

// Etiqueta de evidência (E12): passando o mouse, o texto e a força dela
function iaChip(ui, d, id) {
  var e = (d.evidencias || {})[id];
  if (!e) return "";
  var forca = IA_FORCA[e.forca] || e.forca;
  var dica = "<b>" + ui.esc(id + " · " + forca) + '</b><div class="txt">' + ui.esc(e.texto) + "</div>";
  return '<span class="ev" data-dica="' + ui.esc(dica) + '">' + ui.esc(id) + "<small>" + ui.esc(forca) + "</small></span>";
}

function iaCadeia(ui, d, c) {
  var esc = ui.esc, rv = c.revisao || {}, conf = IA_CONF[c.confianca], rev = IA_REV[rv.veredito], q = [];
  q.push("<span>" + ui.icone("calendario") + esc(c.dia_semana || "—") + "</span>");
  if (c.janela) q.push("<span>" + ui.icone("relogio") + esc(c.janela + (c.horario ? " (" + c.horario + ")" : "")) + "</span>");
  if (c.loja) q.push("<span>" + ui.icone("loja") + esc(c.loja === "todas" ? "todas as lojas" : c.loja) + "</span>");
  if (c.produto) q.push("<span>" + ui.icone("alvo") + esc(c.produto) + (c.template ? " · " + esc(c.template) : "") + "</span>");
  var tags = (conf ? ui.tag(conf[0], conf[1]) : "") + (rev ? ui.tag(rev[0], rev[1]) : "") + (c.fonte === "calculada" ? ui.tag("Raciocínio calculado", "neutro") : "");
  var elos = (c.elos || []).map(function (e) {
    var cls = e.forca === "contexto" ? "ctx" : e.forca === "em teste" ? "fraco" : "";
    return "<li" + (cls ? ' class="' + cls + '"' : "") + ">" + esc(e.texto) + iaChip(ui, d, e.evidencia) + "</li>";
  }).join("");
  var pv = c.previsao || {}, pe = [];
  if (c.quem) pe.push("Quem: <b>" + esc(c.quem) + "</b>");
  if (pv.valor != null) pe.push("Previsão: <b>" + esc((pv.metrica || "leitura") + " " + (pv.direcao || "acima") + " de " + ui.fmt.pct(pv.valor, 1)) + "</b>");
  if (c.como_medir) pe.push("Como medir: " + esc(c.como_medir));
  var quemRev = rv.por === "código" ? "Conferência do código" : "Revisor" + (d.modelos && d.modelos.revisor ? " (" + d.modelos.revisor + ")" : "");
  return '<div class="cadeia"><div class="cab-c"><div style="min-width:0"><div class="quando">' + q.join("") + "</div><h4>" + esc(c.conclusao || "(sem conclusão válida)") + "</h4></div>" +
    '<div class="tags">' + tags + "</div></div>" + (elos ? '<ul class="elos">' + elos + "</ul>" : "") +
    (pe.length ? '<div class="pe">' + pe.map(function (x) { return "<span>" + x + "</span>"; }).join("") + "</div>" : "") +
    (rv.motivo ? '<div class="revisao">' + ui.icone("info") + "<span><b>" + esc(quemRev) + ":</b> " + esc(rv.motivo) +
      (rv.risco && rv.risco !== "nenhum" ? " · risco: " + esc(rv.risco) : "") + "</span></div>" : "") + "</div>";
}

function iaTopo(ui, d) {
  var esc = ui.esc, f = ui.fmt, r = d.regime || {}, l = r.leitura || {}, cal = d.calendario || {}, pv = (d.previsibilidade || {}).lida || {}, m = d.mercado || {};
  var marcos = (cal.marcos || []).filter(function (x) { return x.tipo !== "adiantamento" && x.tipo !== "salário"; }).slice(0, 2)
    .map(function (x) { return x.texto.split(":")[0] + " em " + x.em_dias + " dia(s)"; });
  var visao = (m.visao || []).map(function (v) { return v.produto + ": " + v.vies; });
  return '<div class="grade g4" style="margin-bottom:16px">' +
    ui.tile("Campanha", esc(r.rotulo || "—"), esc(l.frase || "ainda sem dias fechados suficientes"), "var(--s1)") +
    ui.tile("Calendário", esc(iaCap(cal.fase_mes) + " do mês"), esc("salário CLT até " + f.data(cal.proximo_salario) + " (em " + cal.dias_ate_salario + " dia(s))" +
      (marcos.length ? " · " + marcos.join(" · ") : "")), "var(--s3)") +
    ui.tile("Mercado", esc(m.total != null ? f.num((m.itens || []).length) + " de " + f.num(m.total) : "—") + "<small>manchetes</small>",
      esc(m.driver || (visao.length ? visao.join(" · ") : "sem leitura do mercado nesta rodada")), "var(--s7)") +
    ui.tile("Prever envio a envio", esc(pv.auc != null ? "AUC " + f.num(pv.auc, 2) : "—"), esc(pv.veredito || "pouca base"), "var(--s4)") + "</div>";
}

function iaRaciocinio(ui, d) {
  var esc = ui.esc, cad = d.cadeias || [], rep = d.reprovadas || [], corpo = "";
  if (d.resumo) {
    corpo += '<div class="cartao" style="box-shadow:none;background:var(--sup2);margin-bottom:14px"><div class="topo"><div><h3>' + (d.alvo ? "Amanhã, hoje e ontem" : "Leitura do dia") +
      '</h3><div class="cap">' + esc("escrito pelo analista (" + ((d.modelos || {}).analista || "IA") + ") só com as evidências numeradas") + "</div></div></div>" +
      '<p style="font-size:15px;line-height:1.55">' + esc(d.resumo) + "</p>" +
      (d.comentario_revisor ? '<p class="cap" style="margin-top:8px;font-size:12.5px"><b>O revisor sobre o conjunto:</b> ' + esc(d.comentario_revisor) + "</p>" : "") + "</div>";
  }
  if (/calculado/.test(d.motor || "")) {
    corpo += ui.aviso("Hoje vale o <b>raciocínio calculado</b>" + esc((d.motor || "").replace(/^raciocínio calculado/, "")) +
      ": as cadeias abaixo vêm direto dos números, sem texto da IA.", "info");
  }
  corpo += '<div class="cadeias">' + (cad.length ? cad.map(function (c) { return iaCadeia(ui, d, c); }).join("")
    : '<div class="cartao"><p class="cap">Nenhuma cadeia passou na conferência hoje.</p></div>') + "</div>";
  if (rep.length) {
    corpo += '<div style="margin-top:14px">' + ui.retratil({ id: "ia-reprovadas", leve: true, titulo: "Reprovadas (" + rep.length + ")",
      sub: "o que a conferência do código ou o revisor barrou, e por quê", corpo: '<div class="cadeias">' + rep.map(function (c) { return iaCadeia(ui, d, c); }).join("") + "</div>" }) + "</div>";
  }
  return ui.retratil({ id: "ia-raciocinio", aberto: true, titulo: d.alvo ? "Por quê: o raciocínio de cada ordem de amanhã" : "Raciocínio de hoje", icone: "ia",
    sub: esc("dia · horário · quem · produto · a ordem, e o porquê de cada elo. Passe o mouse no E1, E2… para ver a evidência"),
    direita: ui.mini("cadeias", String(cad.length)) + ui.mini("reprovadas", String(rep.length)), corpo: corpo });
}

function iaSugestoes(ui, d) {
  var esc = ui.esc, s = d.sugestoes || [], aud = (d.auditoria || {}).mudancas_sugeridas || [];
  var item = function (x, rotulo, doClaude) {
    var sit = doClaude ? ui.tag("Auditoria do Claude", "neutro") : x.situacao === "pronta" ? ui.tag("Base confirmada", "bom") : ui.tag("Fantasma: observar antes", "atencao");
    var rv = x.revisao && IA_REV[x.revisao.veredito] ? ui.tag(IA_REV[x.revisao.veredito][0], IA_REV[x.revisao.veredito][1]) : "";
    return '<div class="item-plano"><span class="n">' + esc(rotulo) + "</span><div><h4>" + esc(x.titulo) + "</h4>" +
      '<p class="porque" style="margin-top:6px"><b>O que fazer:</b> ' + esc(x.acao) + "</p>" +
      '<p class="porque" style="margin-top:4px"><b>Por quê:</b> ' + esc(x.porque) + (x.evidencias || []).map(function (e) { return iaChip(ui, d, e); }).join("") + "</p>" +
      (x.revisao && x.revisao.motivo ? '<p class="cap" style="font-size:12px;margin-top:6px">Revisor: ' + esc(x.revisao.motivo) + "</p>" : "") +
      '</div><div class="lado-d">' + (x.tipo ? ui.tag(IA_TIPO[x.tipo] || x.tipo, "neutro") : "") + sit + rv + "</div></div>";
  };
  var corpo = ui.aviso("<b>Fantasma primeiro:</b> nenhuma sugestão muda o disparo sozinha. As de <b>base confirmada</b> estão prontas para um teste; as <b>fantasmas</b> ficam em " +
    "observação até as hipóteses delas se confirmarem nos próximos dias. O envio nunca para: o que muda é o template, a mensagem e onde a equipe olha.", "info") +
    '<div class="plano">' + (s.length ? s.map(function (x) { return item(x, x.id, false); }).join("") : '<div class="cartao"><p class="cap">Nenhuma sugestão passou na conferência hoje.</p></div>') +
    aud.map(function (x, i) { return item(x, "C" + (i + 1), true); }).join("") + "</div>";
  return ui.retratil({ id: "ia-sugestoes", aberto: true, titulo: "Sugestões de mudança", icone: "seta",
    sub: esc("como orquestrar os disparos: template, mensagem, testes A/B nos horários fracos"),
    direita: ui.mini("do analista", String(s.length)) + ui.mini("do Claude", String(aud.length)), corpo: corpo });
}

function iaCalor(ui, d) {
  var esc = ui.esc, f = ui.fmt, c = d.calor || {};
  if (!c.linhas || !c.linhas.length) return "";
  var todas = [];
  c.linhas.forEach(function (l) { l.celulas.forEach(function (x) { if (x) todas.push(x.leitura); }); });
  var lo = Math.min.apply(null, todas), hi = Math.max.apply(null, todas);
  var tab = '<div class="tabela-caixa"><table class="t compacta"><thead><tr><th style="text-align:left">Dia \\ horário</th>' +
    c.janelas.map(function (j) { return "<th>" + esc(j.nome) + "<br><small>" + esc(j.horario) + "</small></th>"; }).join("") + "</tr></thead><tbody>" +
    c.linhas.map(function (l) {
      return '<tr><td style="text-align:left">' + esc(l.dia_semana) + "</td>" + l.celulas.map(function (x, k) {
        if (!x) return '<td style="color:var(--mudo)">—</td>';
        var dif = x.leitura - c.media;
        return '<td class="calor" style="--int:' + (hi > lo ? (x.leitura - lo) / (hi - lo) : 0.5).toFixed(3) + '" data-dica="' +
          esc("<b>" + esc(l.dia_semana + " · " + c.janelas[k].nome) + "</b>" + ui.linhaDica("Leitura", f.pct(x.leitura)) +
              ui.linhaDica("Contra a média", (dif > 0 ? "+" : "") + f.num(dif, 1) + " pts") + ui.linhaDica("Entregues", f.num(x.n))) + '">' + esc(f.pct(x.leitura, 0)) + "</td>";
      }).join("") + "</tr>";
    }).join("") + "</tbody></table></div>";
  return '<div class="cartao" style="margin-top:14px"><div class="topo"><div><h3>Mapa da semana: leitura por dia e horário</h3><div class="cap">' +
    esc("últimos 28 dias fechados · média " + f.pct(c.media) + " · quanto mais forte o azul, mais leitura · só grupos com 30+ entregues") + "</div></div></div>" + tab + "</div>";
}

function iaPadroes(ui, d) {
  var esc = ui.esc, f = ui.fmt, P = (d.padroes || {})[SA_IA.alvo] || { padroes: [] };
  var pts = function (v) { return v == null ? "—" : (v > 0 ? "+" : "") + f.num(v, 1) + " pts"; };
  var info = P.descoberta ? "Achados de " + f.dataLonga(P.descoberta.de) + " a " + f.dataLonga(P.descoberta.ate) + " e conferidos de " + f.dataLonga(P.holdout.de) +
    " a " + f.dataLonga(P.holdout.ate) + ", dias que não foram usados para achar (holdout). " + f.num(P.testados) + " grupos testados; só aparecem os que passam na " +
    "correção para muitos testes de uma vez (Benjamini-Hochberg, " + f.num(100 * (P.fdr || 0.1)) + "%) e têm " + f.num(P.min_n) + "+ entregues." : (P.nota || "Pouca base.");
  var corpo = ui.abas([{ id: "lida", nome: "Leitura" }, { id: "interesse", nome: "Interesse (respondeu)" }], SA_IA.alvo, "ia-alvo") +
    '<p class="cap" style="font-size:12.5px;margin-bottom:12px;max-width:980px">' + esc(info) + "</p>" +
    ui.tabela([
      { t: "Grupo", k: function (x) { return iaCap(x.texto); }, esq: true },
      { t: "O grupo", k: "taxa", f: function (v) { return f.pct(v); } },
      { t: "O resto", k: "resto", f: function (v) { return f.pct(v); } },
      { t: "Diferença", k: "diferenca", f: pts },
      { t: "Entregues", k: "n", f: function (v) { return f.num(v); } },
      { t: "Nos dias de conferência", k: function (x) { var h = x.holdout || {}; return h.diferenca == null ? "sem base" : pts(h.diferenca) + " (" + f.num(h.n) + ")"; } },
      { t: "Situação", k: function (x) { var t = IA_PAD[x.status] || [x.status, "neutro"]; return ui.tag(t[0], t[1]); }, html: true }
    ], P.padroes || [], { min: 900, altura: 440, vazio: "Nenhum grupo passou na correção para muitos testes." });

  // Hipóteses registradas (pré-registro): julgadas só com os dias depois do registro
  var hs = (d.hipoteses || []).filter(function (h) {
    return (!SA_IA.hf.status || h.status === SA_IA.hf.status) && (!SA_IA.hf.fonte || h.fonte === SA_IA.hf.fonte) && (!SA_IA.hf.alvo || h.alvo === SA_IA.hf.alvo);
  });
  var opc = function (lista, nomes) { return lista.map(function (v) { return { v: v, n: nomes[v] ? (nomes[v][0] || nomes[v]) : v }; }); };
  var cont = { vivo: 0, "em teste": 0, descartado: 0 };
  (d.hipoteses || []).forEach(function (h) { cont[h.status] = (cont[h.status] || 0) + 1; });
  corpo += '<div class="secao" style="margin-top:22px"><h2>Hipóteses registradas</h2><span>cada uma entra com data e critério; só os dias DEPOIS do registro a julgam</span></div>' +
    ui.filtros([{ id: "status", nome: "Situação", opcoes: opc(["vivo", "em teste", "descartado"], IA_HIP) },
                { id: "fonte", nome: "Quem propôs", opcoes: opc(["descoberta", "analista", "claude"], IA_FONTE) },
                { id: "alvo", nome: "Mede", opcoes: [{ v: "lida", n: "leitura" }, { v: "interesse", n: "interesse" }] }], SA_IA.hf) +
    ui.tabela([
      { t: "", k: "id" },
      { t: "Hipótese", k: function (h) { return esc(iaCap(h.texto)) + '<div class="cap" style="font-size:11.5px;margin-top:2px">' + esc(h.criterio || "") + "</div>"; }, esq: true, html: true },
      { t: "Registrada", k: function (h) { return f.data(h.criada_em) + " · " + (IA_FONTE[h.fonte] || h.fonte); } },
      { t: "Quando registrada", k: function (h) { var n = h.na_criacao; return n ? f.pct(n.taxa) + " contra " + f.pct(n.resto) : "—"; } },
      { t: "Depois do registro", k: function (h) { var x = h.futuro || {}; return x.n ? f.pct(x.taxa) + " contra " + f.pct(x.resto) + " (" + f.num(x.n) + ")" : "ainda sem dias"; } },
      { t: "Situação", k: function (h) { var t = IA_HIP[h.status] || [h.status, "neutro"]; return ui.tag(t[0], t[1]) + '<div class="cap" style="font-size:11.5px;margin-top:4px;white-space:normal">' + esc(h.motivo || "") + "</div>"; }, html: true }
    ], hs, { min: 980, altura: 460, vazio: "Nenhuma hipótese com estes filtros." });
  corpo += iaCalor(ui, d);
  return ui.retratil({ id: "ia-padroes", aberto: false, titulo: "Padrões e hipóteses", icone: "pulso",
    sub: esc("o que os dados mostram, conferido em dias que não foram usados para achar"),
    direita: ui.mini("vivas", String(cont.vivo || 0)) + ui.mini("em teste", String(cont["em teste"] || 0)) + ui.mini("descartadas", String(cont.descartado || 0)), corpo: corpo });
}

function iaMercado(ui, d) {
  var esc = ui.esc, f = ui.fmt, m = d.mercado || {}, cl = (d.auditoria || {}).mercado || [];
  var vies = { "favorável": ["Favorável", "bom"], "desfavorável": ["Desfavorável", "atencao"], neutro: ["Neutro", "neutro"] };
  var dado = { "o dado confirma": ["O dado confirma", "bom"], "o dado contradiz": ["O dado contradiz", "critico"], "o dado ainda não mostra": ["O dado ainda não mostra", "neutro"],
               "pouca base": ["Pouca base para conferir", "neutro"] };
  var corpo = ui.aviso("<b>A IA não manda sozinha: o dado é o juiz.</b> A IA só classifica manchetes reais (não pode inventar notícia). Uma visão do mercado só vale como " +
    "confirmada se a leitura ou o interesse do produto se mexeram no mesmo sentido nos últimos dias.", "info");
  if ((m.visao || []).length) {
    corpo += '<div class="lista-ia" style="margin-bottom:16px">' + m.visao.map(function (v) {
      var a = vies[v.vies] || [v.vies, "neutro"], b = dado[v.dado] || [v.dado || "—", "neutro"];
      return "<div><h5><span>" + esc(v.produto === "geral" ? "Consumo em geral" : v.produto) + '</span><span style="display:flex;gap:6px;flex-wrap:wrap">' + ui.tag(a[0], a[1]) + ui.tag(b[0], b[1]) + "</span></h5>" +
        "<p>" + esc(v.motivo) + (v.dado_txt ? " <b>Nos dados:</b> " + esc(v.dado_txt) + "." : "") + "</p></div>";
    }).join("") + "</div>";
  }
  var efeito = { "mais procura": ["Mais procura", "bom"], "menos procura": ["Menos procura", "atencao"], neutro: ["Neutro", "neutro"] };
  var linhas = (m.itens || []).concat(cl.map(function (x) { return { titulo: x.titulo, link: x.url, fonte: x.fonte + " (Claude)", data: x.data, produto: x.produto, efeito: x.efeito }; }));
  corpo += ui.tabela([
    { t: "Data", k: function (n) { return f.data(n.data); } },
    { t: "Manchete", k: function (n) { return n.link ? '<a class="link-ext" href="' + esc(n.link) + '" target="_blank" rel="noopener">' + esc(n.titulo) + "</a>" : esc(n.titulo); }, esq: true, html: true },
    { t: "Fonte", k: "fonte", esq: true },
    { t: "Produto", k: function (n) { return n.produto === "geral" ? "geral" : n.produto || "—"; }, esq: true },
    { t: "Efeito", k: function (n) { var e = efeito[n.efeito]; return e ? ui.tag(e[0], e[1]) : "—"; }, html: true },
    { t: "Por quê", k: function (n) { return n.porque || ""; }, esq: true }
  ], linhas, { min: 980, altura: 420, vazio: "Sem manchetes nesta rodada." });
  return ui.retratil({ id: "ia-mercado", aberto: false, titulo: "Mercado", icone: "nuvem",
    sub: esc((m.consultado_em ? "Google Notícias, últimos 7 dias, consultado em " + f.dataLonga(m.consultado_em) + " " + m.consultado_em.slice(11, 16) : "sem consulta nesta rodada") +
             (m.driver ? " · " + m.driver : "")),
    direita: ui.mini("relevantes", f.num((m.itens || []).length)) + ui.mini("lidas", f.num(m.total || 0)), corpo: corpo });
}

function iaPrever(ui, d) {
  var esc = ui.esc, f = ui.fmt, pv = d.previsibilidade || {};
  var cartao = function (p, cor) {
    if (!p) return "";
    var dias = p.dias || [];
    return '<div class="cartao"><div class="topo"><div><h3>' + esc(iaCap(p.nome)) + "</h3><div class=\"cap\">" + esc(p.veredito || "") + "</div></div></div>" +
      '<div class="grade g3" style="gap:10px;margin-bottom:12px">' +
      ui.tile("AUC (0,5 = acaso)", esc(p.auc != null ? f.num(p.auc, 2) : "—"), esc(p.faixa ? "95%: " + f.num(p.faixa[0], 2) + " a " + f.num(p.faixa[1], 2) : ""), cor) +
      ui.tile("Só quando e onde", esc(p.auc_so_momento != null ? f.num(p.auc_so_momento, 2) : "—"), "hora, dia, loja e template", cor) +
      ui.tile("20% mais apostados", esc(f.pct(p.topo20)), esc("contra " + f.pct(p.resto80) + " do resto"), cor) + "</div>" +
      (dias.length ? ui.colunas({ rotulos: dias.map(function (x) { return f.data(x.dia); }), meia: true, altura: 190, rotulo: "AUC por dia testado",
        series: [{ nome: "AUC", cor: cor, valores: dias.map(function (x) { return x.auc == null ? 0 : x.auc * 100; }) }],
        eixo: function (v) { return f.num(v / 100, 1); },
        dica: function (i) { var x = dias[i]; return "<b>" + esc(f.dataLonga(x.dia) + " · " + x.dia_semana) + "</b>" + ui.linhaDica("AUC", x.auc == null ? "sem casos" : f.num(x.auc, 2)) +
          ui.linhaDica("Entregues testados", f.num(x.entregues)) + ui.linhaDica("Treinado com", x.treino_dias + " dias antes"); } }) +
        '<div class="legenda"><span>Cada coluna: o modelo treinado só com os dias de antes, testado naquele dia. 0,5 = cara ou coroa.</span></div>' : "") +
      ((p.pesos || []).length ? '<h3 style="font-size:13px;margin:14px 0 8px">O que mais pesa (queda da AUC sem a informação)</h3>' +
        ui.barras(p.pesos.slice(0, 6).map(function (x) { return { nome: x.nome, valor: Math.max(0, x.peso), cor: cor }; }), function (v) { return f.num(v, 2) + " pts"; }) : "") + "</div>";
  };
  var fora = ((pv.lida || {}).fora || []).map(function (x) { return "<b>" + esc(x.nome) + "</b>: " + esc(x.motivo); }).join("<br>");
  var corpo = ui.aviso("<b>Sem previsão envio a envio não quer dizer sem estratégia.</b> Como no quant2h (AUC ≈ 0,52, sem vantagem por operação), aqui o ganho vem dos " +
    "<b>grupos</b> (horário, loja, forma de pagamento) e da disciplina de testar e medir, não de adivinhar quem vai ler. O modelo é testado dia a dia, só com o passado (walk-forward)." +
    (fora ? "<br><br><b>Fora do modelo (vazamento):</b><br>" + fora : ""), "info") +
    '<div class="grade g2">' + cartao(pv.lida, "var(--s1)") + cartao(pv.interesse, "var(--s3)") + "</div>";
  return ui.retratil({ id: "ia-prever", aberto: false, titulo: "Dá para prever?", icone: "alvo",
    sub: esc("o teste honesto: um modelo de árvores aprende com os dias de antes e tenta acertar o dia seguinte"),
    direita: ui.mini("AUC leitura", (pv.lida || {}).auc != null ? f.num(pv.lida.auc, 2) : "—"), corpo: corpo });
}

function iaMemoria(ui, d) {
  var esc = ui.esc, f = ui.fmt, m = d.memoria || {}, a = (d.assertividade || []).filter(function (x) { return x.assertividade != null; });
  var corpo = '<div class="grade g2"><div class="cartao"><div class="topo"><div><h3>Dias parecidos com ' + (d.alvo ? "amanhã" : "hoje") + '</h3><div class="cap">' +
    esc("dia da semana, dia do mês, mistura de pagamento e produto e volume") + "</div></div></div>" +
    (m.vizinhos && m.vizinhos.length ? ui.tabela([
      { t: "Dia", k: function (v) { return f.dataLonga(v.dia) + " · " + v.dia_semana; }, esq: true },
      { t: "Leitura", k: "leitura", f: function (v) { return f.pct(v); } },
      { t: "Interesse", k: "interesse", f: function (v) { return f.pct(v, 2); } },
      { t: "Envios", k: "envios", f: function (v) { return f.num(v); } }
    ], m.vizinhos, { min: 1 }) + '<p class="cap" style="margin-top:10px;font-size:12.5px">' + esc("A memória espera leitura de " + f.pct(m.espera) + (d.alvo ? " amanhã." : " hoje.") +
      (m.erro_memoria != null ? " Testada dia a dia, ela erra em média " + f.num(m.erro_memoria, 1) + " pontos; a média dos 7 dias anteriores erra " + f.num(m.erro_simples, 1) +
        (m.erro_memoria < m.erro_simples ? ": por enquanto a memória ganha." : ": por enquanto o jeito simples ganha.") : "")) + "</p>"
      : '<p class="cap">' + esc(m.nota || "Pouca base.") + "</p>") + "</div>" +
    '<div class="cartao"><div class="topo"><div><h3>Assertividade dos planos de estratégia</h3><div class="cap">previsões certas ÷ avaliadas, por dia (recibos)</div></div></div>' +
    (a.length ? ui.colunas({ rotulos: a.map(function (x) { return f.data(x.dia); }), meia: true, altura: 200, rotulo: "Assertividade por dia",
      series: [{ nome: "Assertividade", cor: "var(--s1)", valores: a.map(function (x) { return x.assertividade; }) }], eixo: function (v) { return f.num(v) + "%"; },
      dica: function (i) { var x = a[i]; return "<b>" + esc(f.dataLonga(x.dia)) + "</b>" + ui.linhaDica("Assertividade", f.pct(x.assertividade, 0)) +
        ui.linhaDica("Previsões", f.num(x.previsoes)) + (x.reconstruido ? ui.linhaDica("Plano", "reconstruído") : ""); } }) +
      '<div class="legenda"><span>Perto de 50% é o mesmo que cara ou coroa. O Cérebro entra nos planos a partir de hoje: compare daqui para a frente.</span></div>'
      : '<p class="cap">Ainda sem recibos com previsões avaliadas.</p>') + "</div></div>";
  return ui.retratil({ id: "ia-memoria", aberto: false, titulo: "Memória e acerto", icone: "calendario",
    sub: esc("os dias mais parecidos com hoje e quanto os planos têm acertado"), corpo: corpo });
}

function iaAuditoria(ui, d) {
  var esc = ui.esc, f = ui.fmt, a = d.auditoria, c = d.calibragem || {};
  var calib = '<dl class="kv"><dt>Grupo mínimo</dt><dd>' + esc(f.num(c.min_n_padrao)) + " entregues</dd><dt>Correção (muitos testes)</dt><dd>" + esc(f.num(100 * (c.fdr || 0))) +
    "%</dd><dt>Dias de conferência</dt><dd>" + esc(String(c.dias_holdout)) + "</dd><dt>Lista negra</dt><dd>" +
    ((c.lista_negra || []).map(function (b) { return "<b>" + esc(b.dim + (b.valor ? " = " + b.valor : "")) + "</b>: " + esc(b.motivo || ""); }).join("<br>") || "—") +
    "</dd><dt>Pedidos ao analista</dt><dd>" + ((c.foco || []).map(esc).join("<br>") || "—") + "</dd>" +
    (c.atualizado_em ? "<dt>Ajustada em</dt><dd>" + esc(f.dataLonga(c.atualizado_em) + " " + c.atualizado_em.slice(11, 16) + (c.por ? " · " + c.por : "")) + "</dd>" : "") + "</dl>";
  var como = "<b>Como rodar a auditoria:</b> no VS Code, com o Claude aberto na pasta <b>SUPERADDS\\central</b>, digite <b>/cerebro</b>. Ele lê o dossiê desta rodada, audita como " +
    "pesquisador, grava a auditoria e você publica com o seu ok. Não precisa ficar ligado: é quando você quiser.";
  var corpo;
  if (!a) {
    corpo = ui.aviso("Ainda não há auditoria do Claude. " + como, "info") + '<div class="cartao" style="margin-top:14px"><div class="topo"><div><h3>Calibragem atual</h3>' +
      '<div class="cap">o que o auditor pode ajustar, sempre dentro de limites</div></div></div>' + calib + "</div>";
  } else {
    corpo = '<div class="cartao" style="box-shadow:none;background:var(--sup2);margin-bottom:14px"><div class="topo"><div><h3>Resumo da auditoria</h3><div class="cap">' +
      esc((a.modelo || "Claude") + " · " + f.dataLonga(a.feito_em) + " " + String(a.feito_em || "").slice(11, 16) + " · sobre a rodada de " + f.dataLonga(a.rodada)) + "</div></div></div>" +
      '<p style="font-size:14.5px;line-height:1.6">' + esc(a.resumo || "") + "</p></div>";
    var blocos = [];
    if ((a.vieses || []).length) blocos.push('<div class="cartao"><div class="topo"><div><h3>Vieses e cuidados</h3></div></div><div class="lista-ia">' +
      a.vieses.map(function (v) { return "<div><h5>" + esc(v.titulo) + "</h5><p>" + esc(v.explicacao) + "</p></div>"; }).join("") + "</div></div>");
    if ((a.vereditos || []).length || a.hipoteses_novas) blocos.push('<div class="cartao"><div class="topo"><div><h3>Hipóteses julgadas</h3><div class="cap">' +
      esc((a.hipoteses_novas || 0) + " hipótese(s) nova(s) registrada(s) pela auditoria") + "</div></div></div>" +
      ui.tabela([{ t: "", k: "id" }, { t: "Hipótese", k: "texto", esq: true }, { t: "Veredito", k: "veredito" }, { t: "Por quê", k: "porque", esq: true }], a.vereditos || [],
        { vazio: "Nenhum veredito nesta auditoria." }) + "</div>");
    if ((a.perguntas || []).length) blocos.push('<div class="cartao"><div class="topo"><div><h3>Perguntas em aberto</h3><div class="cap">o que os dados ainda não respondem</div></div></div>' +
      '<div class="ia"><ul>' + a.perguntas.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul></div></div>");
    blocos.push('<div class="cartao"><div class="topo"><div><h3>Calibragem</h3><div class="cap">o que o auditor ajustou, sempre dentro de limites</div></div></div>' + calib + "</div>");
    corpo += '<div class="grade g2">' + blocos.join("") + "</div>" + '<p class="cap" style="margin-top:12px;font-size:12px">' + como + "</p>";
  }
  return ui.retratil({ id: "ia-auditoria", aberto: !a ? false : true, titulo: "Auditoria do Claude", icone: "check",
    sub: esc(a ? "o cientista: audita vieses, julga hipóteses e recalibra · " + f.dataLonga(a.feito_em) : "o cientista, à mão, quando você pedir (/cerebro no VS Code)"),
    direita: a ? ui.mini("vereditos", String((a.vereditos || []).length)) : "", corpo: corpo });
}

function iaDiario(ui, d) {
  var esc = ui.esc, f = ui.fmt, ds = d.decisoes || [];
  var corpo = '<p class="cap" style="font-size:12.5px;margin-bottom:10px;max-width:980px">' + esc("Toda pergunta a uma IA passa por uma porta só: temperatura 0 (a mesma pergunta dá a " +
    "mesma resposta), resposta em JSON conferida pelo código e um registro de cada decisão neste PC (o pedido completo fica lá; aqui, o resumo). Só vão números somados: nenhum dado de pessoa.") + "</p>" +
    ui.tabela([
      { t: "Quando", k: function (x) { return f.data(x.quando) + " " + String(x.quando || "").slice(11, 16); } },
      { t: "Papel", k: function (x) { return IA_PAPEL[x.papel] || x.papel; }, esq: true },
      { t: "Modelo", k: "modelo", esq: true },
      { t: "Tempo", k: function (x) { return x.ms == null ? "—" : f.num(x.ms / 1000, 1) + " s"; } },
      { t: "Tokens", k: function (x) { return x.tokens == null ? "—" : f.num(x.tokens); } },
      { t: "Resultado", k: function (x) { return x.ok ? ui.tag("Respondeu", "bom") : ui.tag("Falhou", "critico") + '<div class="cap" style="font-size:11px;white-space:normal">' + esc(x.erro || "") + "</div>"; }, html: true },
      { t: "Resposta (início)", k: function (x) { return x.resposta ? x.resposta.slice(0, 160) + (x.resposta.length > 160 ? "…" : "") : "—"; }, esq: true }
    ], ds, { min: 1000, altura: 420, vazio: "Nenhuma decisão registrada nos últimos 7 dias." });
  var ok = ds.filter(function (x) { return x.ok; }).length;
  return ui.retratil({ id: "ia-diario", aberto: false, titulo: "Diário de decisões da IA", icone: "recibo",
    sub: esc("cada chamada dos últimos 7 dias: quem, qual modelo, quanto tempo e se deu certo"),
    direita: ui.mini("chamadas", f.num(ds.length)) + ui.mini("falharam", f.num(ds.length - ok)), corpo: corpo });
}

function iaComo(ui) {
  var corpo = '<div class="camadas">' +
    "<div><h5>1. Contas (sem IA)</h5><ul><li>Clima da campanha: os 3 últimos dias fechados contra os 7 de antes.</li><li>Calendário: 5º dia útil (salário CLT), 13º, " +
    "Black Friday, feriados de SP.</li><li>Teste honesto de previsão, padrões com conferência em dias novos e correção para muitos testes.</li>" +
    "<li>Dias parecidos com hoje e quem recebe em cada loja e horário.</li></ul></div>" +
    "<div><h5>2. Agentes de IA (Groq)</h5><ul><li><b>Notícias:</b> manchetes reais, classificadas; o dado confirma ou não.</li><li><b>Analista:</b> monta as cadeias " +
    "de raciocínio só com evidências numeradas.</li><li><b>Revisor:</b> outro modelo, cético: aprova, rebaixa ou reprova.</li><li>O código confere tudo: número " +
    "sem fonte cai; a confiança vem da força das evidências.</li></ul></div>" +
    "<div><h5>3. Cientista (Claude, à mão)</h5><ul><li>Lê o dossiê, procura vieses, julga hipóteses e propõe novas, já com critério.</li><li>Recalibra dentro de " +
    "limites (grupo mínimo, correção, lista negra).</li><li>Humano no loop: roda quando você pede, e publicar depende do seu ok.</li></ul></div></div>" +
    '<div class="ia" style="margin-top:16px"><p><b>Os princípios</b> (do quant2h): estudar antes de construir; nada de confiar em resultado dentro da amostra; ' +
    "honestidade acima de tudo (o que não funciona aparece aqui também); fantasma primeiro (nenhuma mudança vale antes de provar); e o envio nunca para: " +
    "o que muda é template, mensagem e teste.</p></div>";
  return ui.retratil({ id: "ia-como", aberto: false, titulo: "Como o Cérebro pensa", icone: "info", sub: "as três camadas e as regras que nenhuma IA passa por cima", corpo: corpo });
}

SA.pagina({
  acao: function (a, v) {
    if (a === "ia-alvo") { SA_IA.alvo = v; return; }
    if (a.indexOf("filtro:") === 0) { SA_IA.hf[a.slice(7)] = v; return; }
  },
  render: function (d, ui) {
    var esc = ui.esc, f = ui.fmt, a = d.auditoria;
    var h = (d.decisao ? iaTempos(ui, d) + iaOrdens(ui, d) + '<div style="margin-top:14px">' + iaRaciocinio(ui, d) + "</div>" +
             '<div style="margin-top:14px">' + iaPlacar(ui, d) + "</div>" + '<div style="margin-top:14px">' + iaTopo(ui, d) + "</div>"
                        : iaTopo(ui, d) + iaRaciocinio(ui, d)) + '<div style="margin-top:14px">' + iaSugestoes(ui, d) + "</div>" +
      '<div style="margin-top:14px">' + iaPadroes(ui, d) + "</div>" + '<div style="margin-top:14px">' + iaMercado(ui, d) + "</div>" +
      '<div style="margin-top:14px">' + iaPrever(ui, d) + "</div>" + '<div style="margin-top:14px">' + iaMemoria(ui, d) + "</div>" +
      '<div style="margin-top:14px">' + iaAuditoria(ui, d) + "</div>" + '<div style="margin-top:14px">' + iaDiario(ui, d) + "</div>" +
      '<div style="margin-top:14px">' + iaComo(ui) + "</div>";
    var dia = new Date((d.alvo || d.dia) + "T12:00:00"), ate = (d.decisao || {}).dados_ate;
    return {
      faixa: {
        trilha: "Cérebro SuperAdds",
        titulo: d.alvo ? "O que vamos fazer amanhã" : "O raciocínio de hoje",
        sub: esc(dia.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })) + (ate ? " · com os dados até " + esc(f.dataLonga(ate)) : "") +
             " · o que já fizemos, o que estamos fazendo e o que vamos fazer, com o dado como juiz",
        pilulas: [esc(/calculado/.test(d.motor || "") ? "Raciocínio calculado" : "Groq: analista + revisor"), esc((d.regime || {}).rotulo || ""),
                  a ? "Auditoria do Claude de " + esc(f.dataLonga(a.feito_em)) : "Sem auditoria do Claude ainda",
                  "Rodada de " + esc(f.dataLonga(d.gerado_em) + " " + String(d.gerado_em || "").slice(11, 16))]
      },
      html: h
    };
  }
});

})();
