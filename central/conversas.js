/* Central SuperAdds · Conversas · montado em 10/11/2026 10:23 (central/montar.py). Não edite aqui: edite ui/ e paginas/. */
(function () {
"use strict";
var CFG = {"pagina": "conversas", "titulo": "Conversas", "alvo": "central-superadds", "porteiro": "https://superadds-central.mkt-7c4.workers.dev", "dados": ["https://raw.githubusercontent.com/SupertrocoWeb/painel/main/central/conversas.json", "https://cdn.jsdelivr.net/gh/SupertrocoWeb/painel@main/central/conversas.json"], "sessao_continua": false, "paginas": [{"id": "inicio", "nome": "Início", "icone": "casa", "url": "https://supertroco-4.rds.land/inicio"}, {"id": "conversas", "nome": "Conversas", "icone": "conversa", "url": "https://retail-media.superadds.com.br/superadds-conversas"}, {"id": "personas", "nome": "Personas", "icone": "pessoas", "url": "https://retail-media.superadds.com.br/super-adds-personas", "abas": [{"id": "visao", "nome": "Visão geral"}, {"id": "comportamento", "nome": "Comportamento"}, {"id": "rotina", "nome": "Rotina"}, {"id": "pessoas", "nome": "Pessoas"}, {"id": "conversas", "nome": "Conversas"}]}, {"id": "financeiro", "nome": "Financeiro", "icone": "carteira", "url": "https://retail-media.superadds.com.br/superadds-financeiro"}, {"id": "estrategia", "nome": "Estratégia", "icone": "alvo", "url": "https://retail-media.superadds.com.br/superadds-estrategias"}, {"id": "ia", "nome": "Cérebro (IA)", "icone": "ia", "url": "https://retail-media.superadds.com.br/superadds-ia-brain", "abas": [{"id": "visao", "nome": "Visão geral"}, {"id": "por-dentro", "nome": "Por dentro"}]}, {"id": "dev", "nome": "Desenvolvedor", "icone": "codigo", "url": "https://retail-media.superadds.com.br/superadds-for-devs"}, {"id": "orcamento", "nome": "Orçamento", "icone": "calc", "url": "https://retail-media.superadds.com.br/superadds-base"}]};
var CSS = "/* kit.css — visual da Central SuperAdds (todas as páginas). Embutido em cada página pelo montar.py.\n   Escuro por padrão (como a referência), com opção clara. As cores de série são a paleta validada\n   (claro x escuro); as de situação nunca aparecem sem ícone e texto. */\n:host{all:initial;display:block}\n*{box-sizing:border-box;margin:0;padding:0}\n[hidden]{display:none !important}\n\n.sa{\n  --plano:#0f1821; --sup:#172330; --sup2:#1e2c3b; --lateral:#080d12; --borda:rgba(255,255,255,.07);\n  --tinta:#eef3f6; --tinta2:#b6c3ce; --mudo:#8696a5; --grade:#243444; --eixo:#35485c; --trilho:#2b3d50;\n  --marca:#22c3c1; --marca2:#5fe0dc; --marca-tinta:#04211f; --marca-suave:rgba(34,195,193,.12);\n  --faixa:linear-gradient(100deg,#0d8a68 0%,#12a3a0 42%,#1b78c9 100%);\n  --s1:#3987e5; --s2:#d95926; --s3:#199e70; --s4:#c98500; --s5:#d55181; --s6:#008300; --s7:#9085e9; --s8:#e66767;\n  --bom:#0ca30c; --atencao:#fab219; --serio:#ec835a; --critico:#d03b3b; --sobe:#0ca30c;\n  --aviso-fundo:rgba(250,178,25,.10); --aviso-borda:rgba(250,178,25,.35); --aviso-tinta:#f6cf7a;\n  --info-fundo:rgba(57,135,229,.10); --info-borda:rgba(57,135,229,.35); --info-tinta:#a9c9f3;\n  --bom-tinta:#7ad97a; --bom-fundo:rgba(12,163,12,.14); --bom-borda:rgba(12,163,12,.5);\n  --atencao-tinta:#f6cf7a; --atencao-fundo:rgba(250,178,25,.12); --atencao-borda:rgba(250,178,25,.5);\n  --critico-tinta:#ffa3a3; --critico-fundo:rgba(208,59,59,.16); --critico-borda:rgba(208,59,59,.55);\n  --sombra:0 1px 2px rgba(0,0,0,.3),0 8px 24px rgba(0,0,0,.25);\n  --disp:'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',sans-serif;\n  --corpo:'Inter',system-ui,-apple-system,'Segoe UI',sans-serif;\n  color-scheme:dark;\n  position:fixed;inset:0;z-index:2147480000;overflow:hidden;\n  display:grid;grid-template-columns:232px minmax(0,1fr);\n  background:var(--plano);color:var(--tinta);font-family:var(--corpo);font-size:14px;line-height:1.5;\n  -webkit-font-smoothing:antialiased;text-align:left;\n}\n.sa.claro{\n  --plano:#f1f4f7; --sup:#fcfcfb; --sup2:#f3f6f8; --lateral:#0b1620; --borda:rgba(11,11,11,.09);\n  --tinta:#0b0b0b; --tinta2:#52514e; --mudo:#6c6b66; --grade:#e3e6e9; --eixo:#c3c2b7; --trilho:#e3e6e9;\n  --marca:#0f9c9a; --marca2:#15b8b6; --marca-tinta:#ffffff; --marca-suave:rgba(15,156,154,.10);\n  --s1:#2a78d6; --s2:#eb6834; --s3:#1baf7a; --s4:#eda100; --s5:#e87ba4; --s6:#008300; --s7:#6250d6; --s8:#e34948;\n  --sobe:#006300;\n  --aviso-fundo:#fdf6e7; --aviso-borda:#f1e1bd; --aviso-tinta:#7a5208;\n  --info-fundo:#eef5fd; --info-borda:#cfe1f8; --info-tinta:#1d4f8f;\n  --bom-tinta:#006300; --bom-fundo:#e9f6e9; --bom-borda:#b4dfb4;\n  --atencao-tinta:#7a5208; --atencao-fundo:#fdf6e7; --atencao-borda:#ecd7a6;\n  --critico-tinta:#a61f1f; --critico-fundo:#fdeeee; --critico-borda:#efbcbc;\n  --sombra:0 1px 2px rgba(16,24,40,.05),0 6px 18px rgba(16,24,40,.06);\n  color-scheme:light;\n}\nbutton,input,select{font:inherit;color:inherit}\nbutton{cursor:pointer}\n:focus-visible{outline:2px solid var(--marca);outline-offset:2px}\na{color:inherit;text-decoration:none}\n.num{font-variant-numeric:tabular-nums}\n\n/* ------------------------------------------------------------- barra lateral */\n.lado{background:var(--lateral);color:#dfe8ee;display:flex;flex-direction:column;min-height:0;overflow-y:auto;\n  border-right:1px solid rgba(255,255,255,.05)}\n.logo{display:flex;align-items:center;gap:11px;padding:22px 20px 26px}\n.logo .sig{width:36px;height:36px;border-radius:10px;background:var(--faixa);display:grid;place-items:center;flex:0 0 auto}\n.logo .sig svg{width:20px;height:20px;stroke:#fff;fill:none;stroke-width:2.2}\n.logo b{font-family:var(--disp);font-weight:800;font-size:15px;letter-spacing:-.01em;display:block;line-height:1.15}\n.logo small{font-size:11px;color:#8ea0ae;display:block}\n.nav{display:flex;flex-direction:column;gap:2px;padding:0 10px}\n.nav a{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:10px;color:#aebdc8;font-size:13.5px;\n  font-weight:500;transition:background .15s,color .15s;position:relative}\n.nav a svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.9;flex:0 0 auto}\n.nav a:hover{background:rgba(255,255,255,.05);color:#fff}\n.nav a.ativa{background:rgba(34,195,193,.14);color:#fff}\n.nav a.ativa::before{content:\"\";position:absolute;left:-10px;top:8px;bottom:8px;width:3px;border-radius:0 3px 3px 0;background:#22c3c1}\n.nav a span{white-space:nowrap}\n.nav a.sub{padding:6px 12px 6px 42px;font-size:12.5px;color:#8ea0ae}\n.nav a.sub.ativa{background:transparent;color:#5fe0dc}\n.nav a.sub.ativa::before{top:6px;bottom:6px}\n.nav a.sub[aria-disabled]{opacity:.6}\n.nav a .em-breve{margin-left:auto;font-size:9.5px;color:#7d8f9d;border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:0 6px;line-height:16px}\n.lado .rodape{margin-top:auto;padding:16px 14px 18px;display:flex;flex-direction:column;gap:8px;font-size:12px;color:#8ea0ae}\n.lado .rodape .linha{display:flex;align-items:center;gap:8px}\n.lado .rodape button{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:#cfdbe3;border-radius:9px;\n  padding:7px 10px;font-size:12px;display:flex;align-items:center;gap:8px;width:100%}\n.lado .rodape button:hover{background:rgba(255,255,255,.09);color:#fff}\n.lado .rodape svg{width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2}\n.relogio{display:flex;align-items:center;gap:7px}\n.relogio i{width:7px;height:7px;border-radius:50%;background:#22c3c1;display:inline-block}\n\n/* ------------------------------------------------------------- conteúdo */\n.corpo{overflow-y:auto;overflow-x:hidden;min-width:0;min-height:0;scroll-behavior:smooth}   /* tabela larga rola dentro da caixa dela */\n/* O conteúdo vai até 1760px e fica no centro (telas grandes); a faixa alinha o texto com ele */\n.faixa{background:var(--faixa);color:#fff;padding:26px max(34px, calc((100% - 1760px) / 2 + 34px)) 30px;position:relative;overflow:hidden}\n.faixa::after{content:\"\";position:absolute;right:-80px;top:-120px;width:420px;height:420px;border-radius:50%;\n  background:radial-gradient(closest-side,rgba(255,255,255,.16),transparent);pointer-events:none}\n.faixa .trilha{font-size:12px;opacity:.85;margin-bottom:6px}\n.faixa h1{font-family:var(--disp);font-weight:800;font-size:26px;letter-spacing:-.02em;line-height:1.15}\n.faixa .sub{font-size:13.5px;opacity:.92;margin-top:5px;max-width:760px}\n.faixa .meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px;position:relative;z-index:1}\n.faixa .pilula{background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.22);border-radius:999px;padding:4px 11px;\n  font-size:12px;display:inline-flex;align-items:center;gap:6px;backdrop-filter:blur(4px)}\n.miolo{padding:24px 34px 48px;max-width:1760px;margin:0 auto;overflow-wrap:anywhere}   /* nome comprido de template quebra em vez de vazar */\n\n.secao{display:flex;align-items:baseline;gap:10px;margin:30px 0 12px}\n.secao:first-child{margin-top:0}\n.secao h2{font-family:var(--disp);font-weight:800;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--tinta2)}\n.secao span{font-size:12px;color:var(--mudo)}\n\n/* Grades que se ajustam ao espaço que TÊM (não à tela): no máximo N colunas, e menos quando o lugar aperta — assim\n   os quadros dentro de um cartão estreito descem para a linha de baixo em vez de ficarem espremidos */\n.grade{display:grid;gap:14px}\n.g2{grid-template-columns:repeat(auto-fit,minmax(min(100%,max(260px,calc((100% - 14px) / 2))),1fr))}\n.g3{grid-template-columns:repeat(auto-fit,minmax(min(100%,max(220px,calc((100% - 28px) / 3))),1fr))}\n.g4{grid-template-columns:repeat(auto-fit,minmax(min(100%,max(160px,calc((100% - 42px) / 4))),1fr))}\n.g5{grid-template-columns:repeat(auto-fit,minmax(min(100%,max(150px,calc((100% - 56px) / 5))),1fr))}\n.g-12{grid-template-columns:minmax(0,1fr) minmax(0,2fr)}\n.g-21{grid-template-columns:minmax(0,2fr) minmax(0,1fr)}\n\n.cartao{background:var(--sup);border:1px solid var(--borda);border-radius:14px;padding:18px 20px;box-shadow:var(--sombra);min-width:0}\n.cartao .topo{display:flex;align-items:flex-start;justify-content:space-between;gap:8px 10px;margin-bottom:12px;flex-wrap:wrap}\n.cartao .topo > div:first-child{flex:1 1 180px;min-width:0}\n.cartao h3{font-family:var(--disp);font-weight:700;font-size:14.5px;letter-spacing:-.005em}\n.cartao .cap{font-size:12px;color:var(--mudo);margin-top:2px;line-height:1.45}\n.cartao .acao{font-size:12px;color:var(--marca);font-weight:600;white-space:nowrap;display:inline-flex;align-items:center;gap:4px}\n.cartao .acao:hover{text-decoration:underline}\n\n/* número em destaque com barra de cor embaixo (como na referência) */\n.tile{background:var(--sup);border:1px solid var(--borda);border-radius:14px;padding:16px 18px 18px;box-shadow:var(--sombra);\n  position:relative;overflow:hidden;min-width:0}\n.tile::after{content:\"\";position:absolute;left:0;right:0;bottom:0;height:4px;background:var(--barra,var(--marca))}\n.tile .rot{font-size:12px;color:var(--tinta2);font-weight:500}\n.tile .val{font-family:var(--disp);font-weight:700;font-size:26px;letter-spacing:-.02em;line-height:1.15;margin-top:6px}\n.tile{container-type:inline-size}\n@container (max-width:190px){ .tile .val{font-size:21px} }\n.tile .val small{font-size:14px;font-weight:600;color:var(--tinta2);margin-left:4px}\n.tile .nota{font-size:12px;color:var(--mudo);margin-top:6px;line-height:1.4}\n.tile .nota b{color:var(--tinta2);font-weight:600}\n\n.aviso{display:flex;gap:10px;align-items:flex-start;border:1px solid var(--aviso-borda);background:var(--aviso-fundo);color:var(--aviso-tinta);\n  border-radius:12px;padding:11px 14px;font-size:13px;margin-bottom:14px}\n.aviso.info{border-color:var(--info-borda);background:var(--info-fundo);color:var(--info-tinta)}\n.aviso svg{width:17px;height:17px;flex:0 0 auto;stroke:currentColor;fill:none;stroke-width:2;margin-top:1px}\n\n/* legenda */\n.legenda{display:flex;flex-wrap:wrap;gap:6px 16px;font-size:12px;color:var(--tinta2);margin-top:10px}\n.legenda span{display:inline-flex;align-items:center;gap:6px}\n.legenda i{width:10px;height:10px;border-radius:3px;display:inline-block}\n\n/* gráficos */\nsvg.graf{display:block;width:100%;height:auto;overflow:visible}\nsvg.graf text{font-family:var(--corpo);fill:var(--mudo);font-size:11px}\nsvg.graf .grade-l{stroke:var(--grade);stroke-width:1}\nsvg.graf .base{stroke:var(--eixo);stroke-width:1}\nsvg.graf .alvo{cursor:pointer;fill:transparent}\nsvg.graf .realce{fill:var(--tinta);opacity:0;transition:opacity .12s}\nsvg.graf g.col:hover .realce{opacity:.06}\n\n/* mostrador */\n.mostrador{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:18px;align-items:center}\n.mostrador .lado-t .grande{font-family:var(--disp);font-weight:800;font-size:31px;letter-spacing:-.025em;line-height:1.05}\n.mostrador .lado-t .rot{font-size:13px;color:var(--tinta2);margin-top:4px}\n.mostrador .pares{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:18px}\n.mostrador .par{border-left:3px solid var(--cor,var(--marca));padding-left:10px}\n.mostrador .par b{font-family:var(--disp);font-size:16px;font-weight:700;display:block;line-height:1.2;white-space:nowrap}\n.mostrador svg.graf{max-width:270px;margin:0 auto}\n.rosca svg.graf{max-width:180px;margin:0 auto}\n.mostrador .par span{font-size:12px;color:var(--mudo)}\n.saldo .rot{font-size:12px;color:var(--tinta2);font-weight:500}\n.saldo .val{font-family:var(--disp);font-weight:700;font-size:26px;letter-spacing:-.02em;line-height:1.15;margin-top:4px}\n.saldo .val small{font-size:13px;font-weight:600;color:var(--tinta2);margin-left:6px}\n.trilho{height:8px;border-radius:999px;background:var(--trilho);margin-top:16px;position:relative;overflow:visible}\n.trilho .cheio{position:absolute;left:0;top:0;bottom:0;border-radius:999px;background:var(--marca)}\n.trilho .marco{position:absolute;top:-5px;bottom:-5px;width:2px;background:var(--tinta);border-radius:2px}\n.trilho-leg{display:flex;justify-content:space-between;font-size:11.5px;color:var(--mudo);margin-top:8px}\n\n/* rosca */\n.rosca{display:grid;grid-template-columns:160px minmax(0,1fr);gap:22px;align-items:center}\n.rosca ul{list-style:none;display:flex;flex-direction:column;gap:12px}\n.rosca li{display:grid;grid-template-columns:12px minmax(0,1fr) auto;gap:10px;align-items:baseline}\n.rosca li i{width:12px;height:12px;border-radius:3px;display:inline-block;transform:translateY(1px)}\n.rosca li b{font-weight:600}\n.rosca li .v{font-variant-numeric:tabular-nums;font-weight:600;text-align:right}\n.rosca li small{display:block;color:var(--mudo);font-size:11.5px}\n\n/* barras horizontais */\n.barras{display:flex;flex-direction:column;gap:12px}\n.barra .linha{display:flex;justify-content:space-between;gap:10px;font-size:13px;margin-bottom:5px}\n.barra .linha span{color:var(--tinta2)}\n.barra .linha b{font-variant-numeric:tabular-nums;font-weight:600}\n.barra .linha b small{color:var(--mudo);font-weight:500;margin-left:6px}\n.barra .t{height:10px;border-radius:0 4px 4px 0;background:var(--grade);position:relative}\n.barra .t i{position:absolute;left:0;top:0;bottom:0;border-radius:0 4px 4px 0;display:block}\n\n/* tabela */\n.tabela-caixa{overflow-x:auto;border:1px solid var(--borda);border-radius:12px}\ntable.t{width:100%;border-collapse:collapse;font-size:12.5px;font-variant-numeric:tabular-nums;min-width:760px}\ntable.t th{position:sticky;top:0;background:var(--sup2);color:var(--tinta2);font-weight:600;text-align:right;padding:9px 12px;\n  border-bottom:1px solid var(--borda);white-space:nowrap;font-size:11.5px;letter-spacing:.01em}\ntable.t td{padding:8px 12px;border-bottom:1px solid var(--borda);text-align:right;white-space:nowrap}\ntable.t th:first-child,table.t td:first-child{text-align:left}\ntable.t tr:last-child td{border-bottom:0}\ntable.t tr:hover td{background:var(--marca-suave)}\ntable.t tfoot td{font-weight:700;background:var(--sup2)}\n.ok{color:var(--sobe);display:inline-flex;align-items:center;gap:4px}\n.ok svg,.dif svg{width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2.4}\n.dif{color:var(--serio);display:inline-flex;align-items:center;gap:4px}\n\n/* atalhos */\n.atalho{display:flex;gap:14px;align-items:flex-start;transition:border-color .15s,transform .15s}\n.atalho:hover{border-color:var(--marca);transform:translateY(-1px)}\n.atalho .ic{width:40px;height:40px;border-radius:11px;background:var(--marca-suave);color:var(--marca);display:grid;place-items:center;flex:0 0 auto}\n.atalho .ic svg{width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:1.9}\n.atalho b{font-family:var(--disp);font-size:14.5px;display:block}\n.atalho p{font-size:12.5px;color:var(--mudo);margin-top:3px;line-height:1.45}\n\n/* abas numa linha */\n.abas{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;min-width:0;max-width:100%}\n.abas button{background:var(--sup);border:1px solid var(--borda);color:var(--tinta2);border-radius:999px;padding:7px 14px;font-size:13px;\n  font-weight:600;display:inline-flex;align-items:center;gap:7px;transition:background .15s,border-color .15s,color .15s}\n.abas button:hover{border-color:var(--marca);color:var(--tinta)}\n.abas button.on{background:var(--marca);border-color:var(--marca);color:var(--marca-tinta)}\n.abas button i{width:9px;height:9px;border-radius:50%;display:inline-block}\n.abas button small{font-weight:500;opacity:.75;font-size:11.5px}\n.abas.parceiros{background:var(--sup);border:1px solid var(--borda);border-radius:14px;padding:6px;gap:4px;box-shadow:var(--sombra)}\n.abas.parceiros button{border:0;background:transparent;border-radius:10px;padding:9px 16px;font-size:13.5px;white-space:nowrap;flex:0 0 auto}\n.abas.parceiros button.on{background:var(--marca);color:var(--marca-tinta)}\n.abas.meses button{padding:5px 12px;font-size:12px}\n\n/* \"o que você quer ver hoje?\" */\n.pergunta{font-family:var(--disp);font-weight:800;font-size:18px;letter-spacing:-.01em;margin:0 0 12px}\n.escolhas{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-bottom:22px}\n.escolha{background:var(--sup);border:1px solid var(--borda);border-radius:14px;padding:14px 16px;text-align:left;box-shadow:var(--sombra);\n  display:flex;gap:12px;align-items:flex-start;transition:border-color .15s,transform .15s;color:var(--tinta);position:relative}\n.escolha:hover{border-color:var(--marca);transform:translateY(-1px)}\n.escolha.on{border-color:var(--marca);box-shadow:0 0 0 1px var(--marca),var(--sombra)}\n.escolha .ic{width:36px;height:36px;border-radius:10px;background:var(--marca-suave);color:var(--marca);display:grid;place-items:center;flex:0 0 auto}\n.escolha .ic svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.9}\n.escolha b{font-family:var(--disp);font-size:14px;display:block}\n.escolha span{font-size:12px;color:var(--mudo);display:block;margin-top:2px;line-height:1.4}\n.escolha em{font-style:normal;font-family:var(--disp);font-weight:700;font-size:15px;color:var(--tinta);display:block;margin-top:6px}\n\n/* selos (sempre com texto) */\n.selo{display:inline-flex;align-items:center;gap:5px;border-radius:999px;padding:2px 9px;font-size:11.5px;font-weight:600;\n  border:1px solid var(--borda);color:var(--tinta2);background:var(--sup2);white-space:nowrap}\n.selo svg{width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2.4}\n.selo.bom{color:var(--sobe);border-color:currentColor;background:transparent}\n.selo.ruim{color:var(--serio);border-color:currentColor;background:transparent}\n.selo.marca{color:var(--marca);border-color:currentColor;background:transparent}\n\n/* listas do plano e do recibo */\n.plano{display:flex;flex-direction:column;gap:10px}\n.item-plano{display:grid;grid-template-columns:34px minmax(0,1fr) auto;gap:12px;align-items:start;padding:14px 16px;border:1px solid var(--borda);\n  border-radius:12px;background:var(--sup)}\n.item-plano .n{width:30px;height:30px;border-radius:9px;background:var(--marca-suave);color:var(--marca);display:grid;place-items:center;font-weight:800;font-family:var(--disp)}\n.item-plano .n svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2.4}\n.item-plano h4{font-family:var(--disp);font-size:14.5px;font-weight:700}\n.item-plano .onde{font-size:12.5px;color:var(--tinta2);margin-top:2px;display:flex;flex-wrap:wrap;gap:6px 12px}\n.item-plano .porque{font-size:13px;color:var(--tinta);margin-top:8px;line-height:1.5}\n.item-plano .lado-d{text-align:right;display:flex;flex-direction:column;gap:6px;align-items:flex-end}\n.item-plano .lado-d b{font-family:var(--disp);font-size:20px}\n.item-plano .lado-d small{font-size:11.5px;color:var(--mudo)}\n.recibo{font-family:ui-monospace,'Cascadia Mono',Consolas,monospace;font-size:12px;line-height:1.55;background:var(--sup2);border:1px dashed var(--eixo);\n  border-radius:12px;padding:16px 18px;white-space:pre;overflow:auto;max-height:520px;color:var(--tinta)}\n\n/* desenvolvedor */\n.kv{display:grid;grid-template-columns:minmax(120px,auto) minmax(0,1fr);gap:7px 16px;font-size:13px}\n.kv dt{color:var(--mudo)}\n.kv dd{color:var(--tinta);font-variant-numeric:tabular-nums;word-break:break-word}\n.kv dd code,.cod{font-family:ui-monospace,'Cascadia Mono',Consolas,monospace;font-size:12px;background:var(--sup2);border:1px solid var(--borda);\n  border-radius:6px;padding:1px 6px}\npre.codigo{font-family:ui-monospace,'Cascadia Mono',Consolas,monospace;font-size:11.5px;line-height:1.5;background:#0a1016;color:#d6e2ea;\n  border:1px solid var(--borda);border-radius:10px;padding:12px 14px;overflow:auto;max-height:340px;white-space:pre-wrap;word-break:break-word}\n.form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}\n.form label{display:flex;flex-direction:column;gap:5px;font-size:12px;color:var(--tinta2);font-weight:600}\n.form input,.form select{background:var(--sup2);border:1px solid var(--borda);border-radius:9px;padding:9px 11px;font-size:13px;color:var(--tinta);min-width:0}\n.form .larga{grid-column:1 / -1}\n.botao{background:var(--marca);color:var(--marca-tinta);border:0;border-radius:10px;padding:9px 16px;font-weight:700;font-size:13px;\n  display:inline-flex;align-items:center;gap:7px;white-space:nowrap;flex:0 0 auto}\n.botao.sec{background:var(--sup2);color:var(--tinta);border:1px solid var(--borda)}\n.botao:hover{filter:brightness(1.07)}\n.botao[disabled]{opacity:.55;cursor:wait}\n.botao svg{width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2}\n.consultas{display:flex;flex-direction:column;gap:8px}\n.consulta{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:10px;align-items:center;padding:9px 12px;border:1px solid var(--borda);border-radius:10px;background:var(--sup2)}\n.consulta .m{font-family:ui-monospace,Consolas,monospace;font-size:11px;font-weight:700;color:var(--marca);border:1px solid currentColor;border-radius:5px;padding:0 5px}\n.consulta .u{font-family:ui-monospace,Consolas,monospace;font-size:12px;color:var(--tinta2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.estado-vivo{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--tinta2)}\n.estado-vivo i{width:8px;height:8px;border-radius:50%;background:var(--mudo);display:inline-block}\n.estado-vivo.ok i{background:var(--bom)}\n.estado-vivo.falha i{background:var(--critico)}\n.linha-tempo{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}\n.linha-tempo span{font-size:12px;border:1px solid var(--borda);border-radius:999px;padding:3px 10px;color:var(--mudo)}\n.linha-tempo span.feito{color:var(--sobe);border-color:currentColor}\n\n/* bloco retrátil */\n.retratil{background:var(--sup);border:1px solid var(--borda);border-radius:14px;box-shadow:var(--sombra);margin-bottom:12px;min-width:0}\n.retratil > .cab{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:12px;align-items:center;width:100%;padding:14px 18px;\n  background:transparent;border:0;border-radius:14px;text-align:left;color:var(--tinta)}\n.retratil > .cab:hover{background:var(--marca-suave)}\n.retratil > .cab:focus-visible{outline:2px solid var(--marca);outline-offset:-2px}\n.retratil .seta{width:26px;height:26px;border-radius:8px;background:var(--sup2);display:grid;place-items:center;color:var(--tinta2)}\n.retratil .seta svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2.2;transition:transform .15s}\n.retratil.aberto > .cab .seta svg{transform:rotate(90deg)}\n.retratil .tit{display:flex;align-items:center;gap:10px;min-width:0}\n.retratil .tit .ic{width:34px;height:34px;border-radius:10px;background:var(--marca-suave);color:var(--marca);display:grid;place-items:center;flex:0 0 auto}\n.retratil .tit .ic svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.9}\n.retratil.leve .tit .ic{width:28px;height:28px;border-radius:8px}\n.retratil.leve .tit .ic svg{width:15px;height:15px}\n.retratil .tit b{font-family:var(--disp);font-weight:700;font-size:15px;display:block;line-height:1.25}\n.retratil .tit small{display:block;font-size:12px;color:var(--mudo);margin-top:2px;line-height:1.4}\n.retratil .dir{display:flex;gap:18px;align-items:center;justify-content:flex-end;flex-wrap:wrap}\n.retratil > .conteudo{padding:16px 18px 18px;border-top:1px solid var(--borda)}\n.retratil:not(.aberto) > .conteudo{display:none}\n.retratil.leve{box-shadow:none;background:var(--sup2);margin-bottom:8px;border-radius:12px}\n.retratil.leve > .cab{padding:10px 14px;border-radius:12px}\n.retratil.leve > .cab .seta{background:var(--sup)}\n.retratil.leve .tit b{font-size:13.5px}\n.retratil.leve > .conteudo{padding:12px 14px 14px}\n.mini{display:flex;flex-direction:column;align-items:flex-end;line-height:1.2}\n.mini b{font-family:var(--disp);font-weight:700;font-size:15px;font-variant-numeric:tabular-nums;white-space:nowrap}\n.mini small{font-size:11px;color:var(--mudo);white-space:nowrap}\n\n/* etiqueta de situação (sempre com ícone e texto) */\n.tag{display:inline-flex;align-items:center;gap:5px;border-radius:999px;padding:2px 9px 2px 7px;font-size:11.5px;font-weight:600;\n  white-space:nowrap;border:1px solid var(--borda);color:var(--tinta2);background:var(--sup2);line-height:1.5}\n.tag svg{width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2.4;flex:0 0 auto}\n.tag.bom{color:var(--bom-tinta);background:var(--bom-fundo);border-color:var(--bom-borda)}\n.tag.atencao{color:var(--atencao-tinta);background:var(--atencao-fundo);border-color:var(--atencao-borda)}\n.tag.critico{color:var(--critico-tinta);background:var(--critico-fundo);border-color:var(--critico-borda)}\n.tags{display:flex;flex-wrap:wrap;gap:6px}\n\n/* uso de limites */\n.uso{display:flex;flex-direction:column;gap:6px;padding:11px 0;border-bottom:1px solid var(--borda)}\n.uso:last-child{border-bottom:0}\n.uso .linha{display:flex;justify-content:space-between;gap:2px 10px;font-size:13px;flex-wrap:wrap}\n.uso .linha span{color:var(--tinta2);min-width:0}\n.uso .linha small{color:var(--mudo);font-weight:500}\n.uso .linha b{font-variant-numeric:tabular-nums;font-weight:700;white-space:nowrap}\n.uso .t{height:8px;border-radius:999px;background:var(--trilho);overflow:hidden}\n.uso .t i{display:block;height:100%;border-radius:999px;background:var(--marca)}\n.uso .pct{font-size:11px;color:var(--mudo)}\n\n/* filtros numa linha */\n.filtros{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-end;margin-bottom:16px}\n.filtros label{display:flex;flex-direction:column;gap:4px;font-size:11.5px;color:var(--mudo);font-weight:600;flex:1 1 150px;min-width:140px;max-width:250px}\n.filtros select,.filtros input{background:var(--sup);border:1px solid var(--borda);border-radius:9px;padding:8px 10px;font-size:13px;color:var(--tinta);\n  min-width:0;width:100%}\n.filtros select:hover,.filtros input:hover{border-color:var(--marca)}\n.filtros .botao{flex:0 0 auto}\n\n/* calendário */\n.cal .cab-cal{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:10px}\n.cal .cab-cal b{font-family:var(--disp);font-size:15px;font-weight:700}\n.cal .navs{display:flex;gap:6px}\n.cal .navs button{width:30px;height:30px;border-radius:9px;border:1px solid var(--borda);background:var(--sup2);display:grid;place-items:center;color:var(--tinta)}\n.cal .navs button[disabled]{opacity:.35;cursor:default}\n.cal .navs svg{width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2.2}\n.cal .sem,.cal .grade-cal{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}\n.cal .sem{font-size:11px;color:var(--mudo);text-align:center;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em}\n.cal .d{min-height:64px;border-radius:10px;border:1px solid var(--borda);padding:6px 8px;display:flex;flex-direction:column;justify-content:space-between;\n  text-align:left;color:var(--tinta);background:color-mix(in srgb,var(--s1) calc(var(--int,0) * 55%),var(--sup2));min-width:0}\n.cal .d.vazio{background:transparent;border-color:transparent}\n.cal .d.sem-dado{background:transparent;border-style:dashed;opacity:.6}\n.cal button.d:hover{border-color:var(--marca)}\n.cal .d.on{border-color:var(--marca);box-shadow:0 0 0 2px var(--marca)}\n.cal .d .n{font-size:11px;font-weight:600;color:var(--tinta2)}\n.cal .d .v{font-family:var(--disp);font-weight:700;font-size:12.5px;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-.01em}\n\ntable.t.compacta{min-width:0}\ntable.t.compacta th,table.t.compacta td{padding:7px 8px}\n\n/* mapa de calor em tabela */\ntable.t td.calor{background:color-mix(in srgb,var(--s1) calc(var(--int,0) * 60%),transparent)}\n\n/* paginação de tabela */\n.paginacao{display:flex;gap:8px;align-items:center;justify-content:space-between;margin-top:10px;font-size:12.5px;color:var(--mudo);flex-wrap:wrap}\n.paginacao .navs{display:flex;gap:6px}\n\n/* texto da IA */\n.ia{border-left:3px solid var(--marca);padding:2px 0 2px 14px}\n.ia li{margin:6px 0 0 18px;font-size:13.5px;line-height:1.55}\n.ia p{font-size:13.5px;line-height:1.6}\n.retrato dt{font-family:var(--disp);font-weight:700;font-size:13px;color:var(--tinta2);margin-top:14px}\n.retrato dt:first-child{margin-top:0}\n.retrato dd{font-size:14px;line-height:1.65;margin-top:3px}\n\n/* Cérebro: cadeias de raciocínio (o porquê em elos) */\n.cadeias{display:flex;flex-direction:column;gap:12px}\n.cadeia{border:1px solid var(--borda);border-radius:14px;background:var(--sup);padding:16px 18px;box-shadow:var(--sombra);min-width:0}\n.cadeia .cab-c{display:flex;justify-content:space-between;gap:10px 16px;align-items:flex-start}\n.cadeia .quando{font-size:12px;color:var(--tinta2);font-weight:600;display:flex;gap:4px 14px;flex-wrap:wrap}\n.cadeia .quando span{display:inline-flex;align-items:center;gap:5px}\n.cadeia .quando svg{width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2}\n.cadeia h4{font-family:var(--disp);font-size:15px;font-weight:700;line-height:1.45;margin-top:6px;max-width:900px}\n.cadeia .tags{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;flex:0 0 auto;max-width:300px}\n.elos{list-style:none;margin:12px 0 0;padding:0 0 0 2px}\n.elos li{position:relative;padding:0 0 10px 22px;font-size:13.5px;line-height:1.55}\n.elos li::before{content:\"\";position:absolute;left:4px;top:6px;width:9px;height:9px;border-radius:50%;background:var(--marca)}\n.elos li::after{content:\"\";position:absolute;left:8px;top:17px;bottom:0;width:1px;background:var(--eixo)}\n.elos li:last-child{padding-bottom:2px}\n.elos li:last-child::after{display:none}\n.elos li.ctx{color:var(--tinta2)}\n.elos li.ctx::before{background:var(--sup);border:1.5px solid var(--mudo);width:8px;height:8px}\n.elos li.fraco::before{background:var(--sup);border:1.5px solid var(--marca);width:8px;height:8px}\n.ev{display:inline-flex;align-items:center;margin-left:6px;font-size:11px;font-weight:700;color:var(--marca);border:1px solid currentColor;\n  border-radius:6px;padding:0 5px;cursor:help;vertical-align:1px;white-space:nowrap}\n.ev small{font-weight:500;color:var(--mudo);margin-left:4px}\n.cadeia .pe{display:flex;flex-wrap:wrap;gap:6px 20px;font-size:12.5px;color:var(--tinta2);border-top:1px dashed var(--eixo);margin-top:10px;padding-top:10px}\n.cadeia .pe b{color:var(--tinta);font-weight:600}\n.revisao{font-size:12.5px;color:var(--tinta2);margin-top:10px;display:flex;gap:8px;align-items:flex-start;background:var(--sup2);border-radius:10px;padding:8px 10px}\n.revisao svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2;flex:0 0 auto;margin-top:2px}\n.lista-ia{display:flex;flex-direction:column;gap:10px}\n.lista-ia > div{border:1px solid var(--borda);border-radius:12px;padding:12px 14px;background:var(--sup2)}\n.lista-ia h5{font-family:var(--disp);font-size:13.5px;font-weight:700;display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:space-between}\n.lista-ia p{font-size:13px;line-height:1.55;margin-top:4px;color:var(--tinta2)}\n.lista-ia p b{color:var(--tinta)}\n.camadas{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}\n.camadas > div{border:1px solid var(--borda);border-radius:12px;padding:14px;background:var(--sup2)}\n.camadas h5{font-family:var(--disp);font-size:13.5px;font-weight:700;margin-bottom:6px}\n.camadas p,.camadas li{font-size:12.5px;line-height:1.55;color:var(--tinta2)}\n.camadas ul{margin:0;padding-left:16px}\n/* Cérebro: os três tempos (já fizemos · estamos fazendo · vamos fazer) */\n.tempo{display:flex;flex-direction:column}\n.tempo .cab-t{display:flex;flex-direction:column;gap:2px;margin-bottom:10px}\n.tempo .cab-t .rot{font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:var(--mudo);font-weight:700}\n.tempo .cab-t b{font-family:var(--disp);font-size:15.5px;font-weight:700}\n.tempo .grande{font-family:var(--disp);font-weight:700;font-size:30px;letter-spacing:-.02em;line-height:1.1}\n.tempo .grande small{font-size:13px;font-weight:600;color:var(--tinta2);margin-left:6px;letter-spacing:0}\n.tempo ul{list-style:none;margin:12px 0 0;padding:0;display:flex;flex-direction:column;gap:9px}\n.tempo li{font-size:13px;line-height:1.5;padding-top:9px;border-top:1px solid var(--borda);overflow-wrap:anywhere}\n.tempo li .tag{margin-left:2px;vertical-align:middle}\n.tempo li small{font-size:11.5px}\n.tempo .aviso{margin-top:12px}\n.tempo.amanha{border-color:var(--marca);box-shadow:0 0 0 1px var(--marca),var(--sombra)}\n.tempo.amanha .cab-t .rot{color:var(--marca)}\n/* Início: Ao vivo · Meta */\n.aovivo{margin-bottom:16px}\n.av-cab{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:12px}\n.av-cab b{font-family:var(--disp);font-size:14.5px;font-weight:700}\n.av-cab .cap{font-size:12px;color:var(--mudo)}\n.av-cab .av-status{margin-left:auto}\n.aovivo .pulso{position:relative;display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--marca);flex:0 0 auto}\n.aovivo .pulso::after{content:\"\";position:absolute;inset:-5px;border-radius:50%;border:2px solid var(--marca);opacity:0;animation:av-pulso 1.6s ease-out infinite}\n.aovivo.parado .pulso{background:var(--mudo)}\n.aovivo.parado .pulso::after{animation:none}\n@keyframes av-pulso{0%{transform:scale(.5);opacity:.9}100%{transform:scale(1.6);opacity:0}}\n.aovivo{container-type:inline-size}\n.av-grade{display:grid;grid-template-columns:minmax(0,1.1fr) repeat(3,minmax(0,1fr)) minmax(0,1.4fr);gap:12px}\n.av-bloco{background:var(--sup2);border:1px solid var(--borda);border-radius:12px;padding:12px 14px;min-width:0;display:flex;flex-direction:column}\n.av-bloco .rot{font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--mudo);font-weight:700}\n.av-bloco .num{font-family:var(--disp);font-size:26px;font-weight:700;letter-spacing:-.02em;font-variant-numeric:tabular-nums;margin:4px 0 2px;line-height:1.15}\n.av-bloco .num small{font-size:12px;font-weight:600;color:var(--tinta2);margin-left:4px;letter-spacing:0}\n.av-bloco .cap{font-size:12px;color:var(--mudo);line-height:1.45}\n.av-bloco .uso{margin-top:6px}\n.av-horas{display:grid;grid-template-columns:repeat(15,minmax(0,1fr));gap:2px;align-items:end;height:46px;margin-top:10px}\n.av-horas .c{position:relative;height:100%;display:flex;align-items:flex-end;justify-content:center;cursor:default}\n.av-horas .o{position:absolute;bottom:0;left:8%;right:8%;background:var(--trilho);border-radius:3px 3px 0 0}\n.av-horas .h{position:relative;width:52%;background:var(--marca);border-radius:3px 3px 0 0;min-height:1px}\n.av-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}\n.av-tres{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:8px}\n.av-tres div{display:flex;flex-direction:column;min-width:0}\n.av-tres b{font-family:var(--disp);font-size:24px;font-weight:700;letter-spacing:-.02em;font-variant-numeric:tabular-nums;line-height:1.15}\n.av-tres small{font-size:11.5px;color:var(--mudo);margin-top:2px}\n.av-erros-cab{font-size:11.5px;color:var(--tinta2);font-weight:600;margin-top:12px}\n.av-erros-cab small{color:var(--mudo);font-weight:500}\n.av-erros{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}\n.av-erro{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--borda);border-radius:999px;padding:3px 10px;font-size:12px;\n  background:var(--sup);color:var(--tinta2);cursor:help;font-variant-numeric:tabular-nums}\n.av-erro b{color:var(--tinta);font-weight:700}\n.av-erro .novo{font-style:normal;font-size:10.5px;font-weight:700;color:var(--atencao-tinta)}\n.av-alertas{display:flex;flex-direction:column;gap:6px;margin-top:12px}\n.av-alertas .linha{display:flex;gap:8px;align-items:flex-start;font-size:13px;line-height:1.5}\n.av-alertas .linha .tag{flex:0 0 auto;margin-top:1px}\n/* a faixa ao vivo se arruma pelo próprio espaço (não pela tela) */\n@container (max-width:1060px){ .av-grade{grid-template-columns:repeat(3,minmax(0,1fr))} }\n@container (max-width:700px){ .av-grade{grid-template-columns:repeat(2,minmax(0,1fr))} .av-cab .av-status{margin-left:0} }\n@container (max-width:460px){ .av-grade{grid-template-columns:minmax(0,1fr)} }\n/* Cérebro: rede neural (o que observa → como pensa → o que entrega) */\n.rede{position:relative}\n.rede-svg{width:100%;max-width:1180px;height:auto;display:block;margin:0 auto}\n.rede-svg .cab{font:700 11px var(--corpo);letter-spacing:.09em;text-transform:uppercase;fill:var(--mudo)}\n.rede-svg .lig{fill:none;stroke:var(--trilho)}\n.rede-svg .fluxo{fill:none;stroke-width:2.4;stroke-linecap:round;stroke-dasharray:2 24;opacity:.9;animation:rede-fluir 2.6s linear infinite}\n.rede-svg .no{cursor:default}\n.rede-svg .no.c0{color:var(--s1)}\n.rede-svg .no.c1{color:var(--s7)}\n.rede-svg .no.c2{color:var(--s3)}\n.rede-svg .no .halo{fill:currentColor;opacity:.10}\n.rede-svg .no.c1 .halo{animation:rede-brilho 3.2s ease-in-out infinite}\n.rede-svg .no .nucleo{fill:var(--sup);stroke-width:2.2;transition:stroke-width .12s}\n.rede-svg .no:hover .nucleo{stroke-width:3.4}\n.rede-svg .nome{font:600 13px var(--corpo);fill:var(--tinta)}\n.rede-svg .valor{font:500 11.5px var(--corpo);fill:var(--tinta2)}\n@keyframes rede-fluir{to{stroke-dashoffset:-52}}\n@keyframes rede-brilho{0%,100%{opacity:.07}50%{opacity:.24}}\n.rede-lista{display:none}\n.rede-lista h5{font-family:var(--disp);font-size:13px;font-weight:700;margin-bottom:6px;display:flex;align-items:center;gap:7px}\n.rede-lista h5 i{width:10px;height:10px;border-radius:50%;display:inline-block}\n.rede-lista ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:5px}\n.rede-lista li{display:flex;justify-content:space-between;gap:10px;font-size:12.5px;border-top:1px solid var(--borda);padding-top:5px}\n.rede-lista li span{color:var(--tinta2);text-align:right}\n@media (max-width:640px){ .rede-svg{display:none} .rede-lista{display:grid;gap:14px} }\n/* previsto × aconteceu (faixa prevista e o real) */\nsvg.graf .faixa-p{fill:var(--marca-suave);stroke:var(--marca);stroke-width:1}\nsvg.graf .previsto{stroke:var(--marca);stroke-width:2.2;stroke-linecap:round}\nsvg.graf .real.dentro{fill:var(--tinta);stroke:var(--sup);stroke-width:2}\nsvg.graf .real.fora{fill:var(--sup);stroke:var(--critico);stroke-width:2.6}\n.legenda i.lg-faixa{background:var(--marca-suave);border:1px solid var(--marca)}\n.legenda i.lg-prev{height:3px;border-radius:2px;background:var(--marca)}\n.legenda i.lg-dentro{border-radius:50%;background:var(--tinta)}\n.legenda i.lg-fora{border-radius:50%;background:transparent;border:2.5px solid var(--critico);width:11px;height:11px}\n/* Cérebro, Visão geral: aprendizados, linha do tempo, evolução */\n.sub-h{font-family:var(--disp);font-size:13px;font-weight:700;margin:16px 0 8px;color:var(--tinta)}\n.lista-simples{margin:0;padding-left:18px;display:flex;flex-direction:column;gap:6px;font-size:13px;line-height:1.55;color:var(--tinta2)}\n.vit-frase{font-family:var(--disp);font-size:17px;font-weight:600;line-height:1.45;max-width:880px;color:var(--tinta)}\n.aprendi{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}\n.aprendi .item{border:1px solid var(--borda);border-radius:12px;padding:13px 14px;background:var(--sup2);display:flex;flex-direction:column;gap:8px;min-width:0}\n.aprendi .item > .tag{align-self:flex-start}\n.aprendi .item p{font-size:13.5px;line-height:1.5;color:var(--tinta);overflow-wrap:anywhere}\n.aprendi .item .rodape{display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:11.5px;color:var(--mudo);flex-wrap:wrap}\n.aprendi .forca{height:4px;border-radius:3px;background:var(--trilho);overflow:hidden}\n.aprendi .forca i{display:block;height:100%;background:var(--marca);border-radius:3px}\n.linha-tempo{list-style:none;margin:0;padding:0 0 0 14px;border-left:2px solid var(--trilho);display:flex;flex-direction:column;gap:12px}\n.linha-tempo li{position:relative;font-size:13px;line-height:1.5}\n.linha-tempo li::before{content:\"\";position:absolute;left:-20px;top:5px;width:10px;height:10px;border-radius:50%;background:var(--sup);border:2px solid var(--marca)}\n.linha-tempo li small{display:block;font-size:11.5px;color:var(--mudo);font-weight:600}\n/* Estratégia: ontem (o que o Cérebro acertou e errou) */\n.ontem-num{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:2px 0 10px}\n.ontem-num > div{background:var(--sup2);border:1px solid var(--borda);border-radius:12px;padding:10px 12px;display:flex;flex-direction:column;gap:2px;min-width:0}\n.ontem-num small{font-size:10.5px;color:var(--mudo);text-transform:uppercase;letter-spacing:.07em;font-weight:700}\n.ontem-num b{font-family:var(--disp);font-size:24px;font-weight:700;letter-spacing:-.02em;font-variant-numeric:tabular-nums}\n.ontem-num span{font-size:12px;color:var(--tinta2)}\n.lista-check{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:9px}\n.lista-check li{display:flex;align-items:flex-start;gap:9px;font-size:13px;line-height:1.5;padding-top:9px;border-top:1px solid var(--borda);overflow-wrap:anywhere}\n.lista-check li:first-child{border-top:0;padding-top:0}\n.lista-check li .tag{flex:0 0 auto;margin-top:1px}\n.semana-ontem{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:8px}\n.dia-ontem{border:1px solid var(--borda);border-radius:12px;padding:10px;background:var(--sup2);display:flex;flex-direction:column;gap:5px;align-items:flex-start;min-width:0}\n.dia-ontem small{font-size:11.5px;color:var(--tinta2);font-weight:600;text-transform:capitalize}\n.dia-ontem span{font-size:11.5px;color:var(--mudo);font-variant-numeric:tabular-nums}\n.dia-ontem.hoje{border-color:var(--marca);box-shadow:0 0 0 1px var(--marca)}\na.link-ext{color:var(--tinta);text-decoration:underline;text-decoration-color:var(--eixo);text-underline-offset:2px}\na.link-ext:hover{text-decoration-color:var(--marca)}\n.dica .txt{white-space:normal;color:#d7e1e8}\n\n/* dica ao passar o mouse */\n.dica{position:fixed;z-index:10;pointer-events:none;background:#0b1219;color:#eef3f6;border:1px solid rgba(255,255,255,.12);\n  border-radius:10px;padding:9px 11px;font-size:12px;line-height:1.5;box-shadow:0 8px 24px rgba(0,0,0,.35);max-width:280px;\n  opacity:0;transition:opacity .1s}\n.dica.on{opacity:1}\n.dica b{display:block;font-weight:700;margin-bottom:3px}\n.dica .l{display:flex;justify-content:space-between;gap:16px;font-variant-numeric:tabular-nums}\n.dica .l span{color:#aab8c4;display:inline-flex;align-items:center;gap:6px}\n.dica .l i{width:8px;height:8px;border-radius:2px;display:inline-block}\n\n/* porteiro */\n.porta{grid-column:1 / -1;display:grid;place-items:center;background:var(--faixa);padding:16px;overflow-y:auto}\n.porta .caixa{width:100%;max-width:400px;background:rgba(8,13,18,.86);color:#eef3f6;border:1px solid rgba(255,255,255,.1);\n  border-radius:18px;padding:30px 28px;box-shadow:0 20px 60px rgba(0,0,0,.35);backdrop-filter:blur(8px)}\n.porta .logo{padding:0 0 18px}\n.porta h2{font-family:var(--disp);font-weight:800;font-size:20px;letter-spacing:-.01em}\n.porta p{font-size:13px;color:#a9b8c4;margin-top:6px}\n.porta form{display:flex;flex-direction:column;gap:10px;margin-top:18px}\n.porta input{font-size:16px;padding:12px 14px;border-radius:11px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);\n  color:#fff;letter-spacing:.12em}\n.porta input::placeholder{letter-spacing:0;color:#7f909e}\n.porta button{background:#22c3c1;color:#04211f;border:0;border-radius:11px;padding:12px;font-weight:700;font-size:14px}\n.porta button:hover{filter:brightness(1.08)}\n.porta button[disabled]{opacity:.6;cursor:wait}\n.porta .msg{min-height:20px;font-size:12.5px;color:#ffb199}\n.porta .pe{font-size:11.5px;color:#7f909e;margin-top:16px;line-height:1.5}\n.carregando{padding:80px 34px;color:var(--mudo);font-size:13px}\n\n/* celular e telas estreitas */\n/* Notebook pequeno e tablet deitado: a barra lateral vira uma coluna só de ícones (o nome aparece ao passar o mouse) */\n@media (min-width:901px) and (max-width:1180px){\n  .sa{grid-template-columns:68px minmax(0,1fr)}\n  .logo{padding:18px 0 22px;justify-content:center}\n  .logo > div{display:none}\n  .nav{padding:0 8px}\n  .nav a{justify-content:center;padding:11px 0}\n  .nav a span,.nav a .em-breve,.nav a.sub{display:none}\n  .nav a.ativa::before{left:-8px}\n  .lado .rodape{padding:12px 8px 14px}\n  .lado .rodape .relogio span,.lado .rodape button span{display:none}\n  .lado .rodape .relogio{justify-content:center}\n  .lado .rodape button{justify-content:center;padding:8px 0}\n  .miolo{padding:20px 24px 40px}\n  .faixa{padding:22px 24px 26px}\n}\n@media (max-width:900px){\n  .sa{grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr)}\n  .lado{flex-direction:row;align-items:center;overflow-x:auto;overflow-y:hidden;border-right:0;border-bottom:1px solid rgba(255,255,255,.06)}\n  .lado .logo{padding:10px 12px}\n  .lado .logo div{display:none}\n  .nav{flex-direction:row;padding:0 4px;gap:0}\n  .nav a{padding:9px 10px;font-size:12.5px;white-space:nowrap;gap:7px}\n  .nav a.ativa::before{left:10px;right:10px;top:auto;bottom:0;width:auto;height:3px;border-radius:3px 3px 0 0}\n  .nav a .em-breve{display:none}\n  .nav a.sub{display:none}\n  .lado .rodape{margin:0 0 0 auto;flex-direction:row;padding:6px 10px;align-items:center}\n  .lado .rodape .relogio span,.lado .rodape button span{display:none}\n  .lado .rodape button{width:auto}\n  .faixa{padding:20px 16px 22px}\n  .faixa h1{font-size:22px}\n  .miolo{padding:16px 16px 40px}\n  .g-12,.g-21{grid-template-columns:minmax(0,1fr)}\n  .mostrador{grid-template-columns:minmax(0,1fr)}\n  .rosca{grid-template-columns:minmax(0,1fr);justify-items:center}\n  .rosca ul{width:100%}\n  .tile .val{font-size:22px}\n  .escolhas{grid-template-columns:repeat(2,minmax(0,1fr))}\n  .item-plano{grid-template-columns:30px minmax(0,1fr)}\n  .item-plano .lado-d{grid-column:2;align-items:flex-start;text-align:left;flex-direction:row;flex-wrap:wrap}\n  .form{grid-template-columns:minmax(0,1fr)}\n  .abas.parceiros{flex-wrap:nowrap;overflow-x:auto}\n  .retratil > .cab{grid-template-columns:auto minmax(0,1fr);padding:12px 14px}\n  .retratil > .cab .dir{grid-column:1 / -1;justify-content:flex-start;gap:8px 14px;flex-wrap:wrap}\n  .mini{align-items:flex-start}\n  .cadeia .cab-c{flex-direction:column}\n  .cadeia .tags{justify-content:flex-start;max-width:none}\n  .camadas{grid-template-columns:minmax(0,1fr)}\n  .retratil > .conteudo{padding:14px 12px 14px}\n  .cal .sem,.cal .grade-cal{gap:4px}\n  .cal .d{min-height:50px;padding:4px 5px}\n  .cal .d .v{font-size:10.5px}\n  .filtros label{flex:1 1 140px;max-width:none}\n}\n@media (max-width:900px){ .aprendi{grid-template-columns:minmax(0,1fr)} .ontem-num b{font-size:21px} }\n\n/* ------------------------------------------------------------- Conversas (paginas/conversas.js): visual de WhatsApp Web, cores da Central */\n.wa{container-type:inline-size;height:clamp(480px,calc(100vh - 250px),940px)}\n.wa-grade{display:grid;grid-template-columns:minmax(290px,370px) minmax(0,1fr);height:100%;background:var(--sup);border:1px solid var(--borda);\n  border-radius:14px;box-shadow:var(--sombra);overflow:hidden}\n.wa svg{stroke:currentColor;fill:none;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}\n.wa .tag svg{stroke-width:2.4}\n.wa mark{background:color-mix(in srgb,var(--atencao) 38%,transparent);color:inherit;border-radius:3px;padding:0 1px}\n/* lista */\n.wa-lista{display:flex;flex-direction:column;min-height:0;min-width:0;border-right:1px solid var(--borda)}\n.wa-cab{padding:16px 16px 12px;display:flex;flex-direction:column;gap:10px;border-bottom:1px solid var(--borda)}\n.wa-cab-l1{display:flex;align-items:center;justify-content:space-between;gap:8px}\n.wa-cab-l1 h2{font-family:var(--disp);font-size:18px;font-weight:800;letter-spacing:-.01em}\n.wa-resumo{font-size:12px;color:var(--mudo);margin-top:3px;display:flex;flex-wrap:wrap;gap:6px;align-items:center}\n.wa-vivo{display:inline-flex;align-items:center;gap:7px;font-size:11.5px;color:var(--mudo);white-space:nowrap}\n.wa-vivo .pulso{position:relative;display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--marca)}\n.wa-vivo .pulso::after{content:\"\";position:absolute;inset:-4px;border-radius:50%;border:2px solid var(--marca);opacity:0;animation:av-pulso 1.6s ease-out infinite}\n.wa-vivo.parado .pulso{background:var(--mudo)}\n.wa-vivo.parado .pulso::after{animation:none}\n.wa-busca{display:flex;align-items:center;gap:8px;background:var(--sup2);border:1px solid var(--borda);border-radius:10px;padding:8px 11px;\n  transition:border-color .15s,box-shadow .15s}\n.wa-busca:focus-within{border-color:var(--marca);box-shadow:0 0 0 3px var(--marca-suave)}\n.wa-busca svg{width:16px;height:16px;color:var(--mudo);flex:0 0 auto}\n.wa-busca input{flex:1;min-width:0;background:transparent;border:0;outline:0;color:var(--tinta);font:inherit;font-size:13px}\n.wa-busca input::placeholder{color:var(--mudo)}\n.wa-chips{display:flex;gap:6px;flex-wrap:wrap}\n.wa-chip{border:1px solid var(--borda);background:var(--sup2);color:var(--tinta2);border-radius:999px;padding:4px 11px;font:inherit;font-size:12px;\n  font-weight:600;cursor:pointer;display:inline-flex;gap:6px;align-items:center;transition:background .15s,border-color .15s,color .15s}\n.wa-chip:hover{color:var(--tinta);border-color:var(--eixo)}\n.wa-chip.on{background:var(--marca-suave);border-color:var(--marca);color:var(--tinta)}\n.wa-chip small{font-weight:700;color:var(--mudo);font-variant-numeric:tabular-nums}\n.wa-chip:focus-visible,.wa-voltar:focus-visible,.wa-fim:focus-visible{outline:2px solid var(--marca);outline-offset:2px}\n.wa-itens{flex:1;overflow-y:auto;min-height:0;overscroll-behavior:contain}\n.wa-item{display:flex;gap:12px;align-items:center;width:100%;text-align:left;padding:11px 16px;border:0;border-bottom:1px solid var(--borda);\n  background:transparent;color:inherit;cursor:pointer;font:inherit;position:relative;transition:background .12s}\n.wa-item:hover{background:var(--sup2)}\n.wa-item.on{background:var(--marca-suave)}\n.wa-item.on::before{content:\"\";position:absolute;left:0;top:10px;bottom:10px;width:3px;border-radius:0 3px 3px 0;background:var(--marca)}\n.wa-item:focus-visible{outline:2px solid var(--marca);outline-offset:-2px}\n.wa-av{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;flex:0 0 auto;font-family:var(--disp);font-weight:700;font-size:15px;\n  color:var(--av);background:color-mix(in srgb,var(--av) 18%,var(--sup2));border:1px solid color-mix(in srgb,var(--av) 35%,transparent)}\n.wa-av svg{width:20px;height:20px}\n.wa-it-meio{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}\n.wa-it-l1,.wa-it-l2{display:flex;align-items:center;gap:8px;min-width:0}\n.wa-it-l1 b{flex:1;min-width:0;font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.wa-it-l1 time{font-size:11.5px;color:var(--mudo);flex:0 0 auto;font-variant-numeric:tabular-nums}\n.wa-item.nova .wa-it-l1 time{color:var(--marca);font-weight:700}\n.wa-item.nova .wa-prev{color:var(--tinta2)}\n.wa-prev{flex:1;min-width:0;font-size:12.5px;color:var(--mudo);display:flex;align-items:center;gap:5px}\n.wa-prev span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}\n.wa-prev svg{width:14px;height:14px;flex:0 0 auto}\n.wa-final{font-size:11px;color:var(--mudo);font-variant-numeric:tabular-nums;opacity:.85}\n.wa-novas{min-width:20px;height:20px;padding:0 6px;border-radius:999px;background:var(--marca);color:var(--marca-tinta);font-size:11px;font-weight:700;\n  display:grid;place-items:center;flex:0 0 auto;font-variant-numeric:tabular-nums}\n.wa-item .tag{font-size:10.5px;padding:1px 7px 1px 5px;flex:0 0 auto}\n.wa-lista-vazia{padding:40px 22px;text-align:center;color:var(--mudo);font-size:13px;line-height:1.5}\n/* conversa */\n.wa-chat{display:flex;flex-direction:column;min-height:0;min-width:0;position:relative;background:var(--plano)}\n.wa-chat-topo{display:flex;align-items:center;gap:12px;padding:11px 18px;background:var(--sup);border-bottom:1px solid var(--borda);min-height:68px}\n.wa-chat-topo .quem{flex:1;min-width:0}\n.wa-chat-topo .quem b{display:block;font-size:14.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.wa-chat-topo .quem small{display:block;font-size:12px;color:var(--mudo);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.wa-chat-tags{flex:0 0 auto}\n.wa-voltar{display:none;width:34px;height:34px;border-radius:50%;border:1px solid var(--borda);background:var(--sup2);color:var(--tinta2);\n  place-items:center;cursor:pointer;flex:0 0 auto}\n.wa-voltar svg{width:18px;height:18px}\n.wa-msgs{flex:1;overflow-y:auto;min-height:0;padding:16px 6% 14px;display:flex;flex-direction:column;overscroll-behavior:contain;\n  background-color:var(--plano);background-image:radial-gradient(color-mix(in srgb,var(--tinta) 7%,transparent) 1px,transparent 1.4px);background-size:22px 22px}\n.wa-dia{align-self:center;margin:14px 0 6px;position:sticky;top:0;z-index:1}\n.wa-dia span{display:inline-block;font-size:11.5px;font-weight:600;color:var(--tinta2);background:var(--sup);border:1px solid var(--borda);\n  border-radius:8px;padding:4px 11px;box-shadow:0 1px 2px rgba(0,0,0,.08)}\n.wa-b{position:relative;max-width:min(540px,76%);padding:7px 10px 6px;border-radius:10px;font-size:13.5px;line-height:1.45;margin-top:8px;\n  box-shadow:0 1px 1px rgba(0,0,0,.10);overflow-wrap:anywhere}\n.wa-b.seq{margin-top:2px}\n.wa-b.in{align-self:flex-start;background:var(--sup);border:1px solid var(--borda);border-top-left-radius:3px}\n.wa-b.out{align-self:flex-end;background:color-mix(in srgb,var(--marca) 20%,var(--sup));border:1px solid color-mix(in srgb,var(--marca) 32%,transparent);\n  border-top-right-radius:3px}\n.wa-b.in.seq{border-top-left-radius:10px}\n.wa-b.out.seq{border-top-right-radius:10px}\n.wa-b[data-dica]{cursor:help}\n.wa-txt{white-space:pre-wrap}\n.wa-vazia{color:var(--mudo)}\n.wa-h{float:right;margin:7px 0 -3px 14px;font-size:10.5px;color:var(--mudo);display:inline-flex;align-items:center;gap:3px;font-variant-numeric:tabular-nums;line-height:1}\n.wa-h svg{width:16px;height:16px;stroke-width:2.1}\n.wa-h .lida{color:var(--s1);display:inline-flex}\n.wa-h span{display:inline-flex}\n.wa-midia{display:inline-flex;align-items:center;gap:9px;color:var(--tinta2);font-weight:600}\n.wa-midia .ic{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:var(--marca-suave);color:var(--marca);flex:0 0 auto}\n.wa-midia .ic svg{width:17px;height:17px}\n.wa-midia .i{display:inline-flex;color:var(--mudo)}\n.wa-midia .i svg{width:14px;height:14px;stroke-width:2.2}\n.wa-b.midia .wa-txt{margin-top:6px}\n.wa-botao,.wa-nossa{display:flex;align-items:center;gap:5px;font-size:10.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--mudo);margin-bottom:3px}\n.wa-botao svg,.wa-nossa svg{width:13px;height:13px}\n.wa-nossa{color:color-mix(in srgb,var(--marca) 65%,var(--tinta));margin-bottom:0}\n.wa-b .tag{margin-top:5px}\n.wa-fim{position:absolute;right:20px;bottom:64px;width:38px;height:38px;border-radius:50%;border:1px solid var(--borda);background:var(--sup);color:var(--tinta2);\n  box-shadow:var(--sombra);display:none;place-items:center;cursor:pointer;z-index:2}\n.wa-chat.longe .wa-fim{display:grid}\n.wa-fim svg{width:18px;height:18px}\n.wa-rodape{display:flex;align-items:center;gap:10px;padding:12px 18px;background:var(--sup);border-top:1px solid var(--borda);font-size:12.5px;color:var(--mudo)}\n.wa-rodape svg{width:16px;height:16px;flex:0 0 auto}\n.wa-rodape .i{margin-left:auto;display:inline-flex;cursor:help;padding:2px}\n.wa-vazio{margin:auto;max-width:420px;text-align:center;padding:30px;color:var(--mudo);font-size:13px;line-height:1.55;display:flex;flex-direction:column;\n  align-items:center;gap:10px}\n.wa-vazio .ic{width:66px;height:66px;border-radius:50%;display:grid;place-items:center;background:var(--marca-suave);color:var(--marca)}\n.wa-vazio .ic svg{width:30px;height:30px}\n.wa-vazio b{font-family:var(--disp);font-size:17px;color:var(--tinta)}\n.wa-carregando{margin:auto;color:var(--mudo);font-size:13px}\n@container (max-width:760px){\n  .wa-grade{grid-template-columns:minmax(0,1fr)}\n  .wa-lista{border-right:0}\n  .wa-chat{display:none}\n  .wa.com-conversa .wa-lista{display:none}\n  .wa.com-conversa .wa-chat{display:flex}\n  .wa-voltar{display:grid}\n  .wa-msgs{padding:12px 12px}\n  .wa-b{max-width:88%}\n  .wa-chat-topo{padding:10px 12px;gap:10px}\n  .wa-chat-tags .tag{font-size:10.5px}\n  .wa-rodape{padding:10px 12px;font-size:11.5px}\n}\n@media (max-width:900px){ .wa{height:calc(100vh - 210px);min-height:440px} }\n/* ---------------------------------------------------------------- Personas › Conversas (deduções da IA) */\n.cv-deds{align-items:start}\n.cv-ded p{font-size:14px;line-height:1.6;margin-top:10px}\n.cv-dl{margin-top:12px;display:grid;grid-template-columns:minmax(120px,170px) 1fr;gap:6px 14px;font-size:13px}\n.cv-dl dt{color:var(--mudo);font-weight:600}\n.cv-dl dd{color:var(--tinta2);line-height:1.5}\n.cv-teste,.cv-quem{margin-top:14px;padding:12px 14px;border-radius:12px;background:var(--sup2);border:1px solid var(--borda)}\n.cv-teste>b,.cv-quem>b{font-family:var(--disp);font-size:13px}\n.cv-teste>small{display:block;color:var(--mudo);font-size:12px;margin-top:2px}\n.cv-teste ul,.cv-quem ul{list-style:none;margin-top:8px;display:grid;gap:8px}\n.cv-teste li,.cv-quem li{display:grid;grid-template-columns:auto 1fr;gap:2px 10px;align-items:start;font-size:13px}\n.cv-teste li small,.cv-quem li small{grid-column:2;color:var(--mudo);font-size:12px;font-variant-numeric:tabular-nums}\n.cv-teste .tag,.cv-quem .tag{font-size:11px}\n.cv-nota{margin-top:10px;font-size:12.5px;color:var(--mudo);line-height:1.5}\n.cv-lista{list-style:none;display:grid;gap:10px}\n.cv-lista li{display:flex;gap:10px;align-items:flex-start;font-size:13.5px;line-height:1.5}\n.cv-lista li>svg{width:16px;height:16px;flex:0 0 auto;margin-top:2px;color:var(--marca);stroke:currentColor;fill:none;stroke-width:2.2}\n.cv-lista li span{display:flex;flex-direction:column;gap:2px}\n.cv-lista li small{color:var(--mudo);font-size:12.5px}\n.cv-lista .tag{flex:0 0 auto}\n.tile .rot svg{width:13px;height:13px;vertical-align:-2px;color:var(--mudo);stroke:currentColor;fill:none;stroke-width:2.2}\n.tile[data-dica]{cursor:help}\n@container (max-width:560px){ .cv-dl{grid-template-columns:1fr;gap:2px} .cv-dl dd{margin-bottom:6px} }\n/* Conversas: a etiqueta da dedução na bolha e no topo */\n.wa-ded{display:inline-flex;align-items:center;gap:4px;margin:0 0 4px;padding:2px 8px 2px 6px;border-radius:999px;font-size:10.5px;font-weight:600;\n  background:var(--marca-suave);color:var(--marca);cursor:help;max-width:100%}\n.wa-ded svg{width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2.2;flex:0 0 auto}\n.wa-ded span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n@media (prefers-reduced-motion:reduce){ *{transition:none !important;scroll-behavior:auto !important}\n  .rede-svg .fluxo,.rede-svg .halo,.aovivo .pulso::after,.wa-vivo .pulso::after{animation:none !important} }\n";
/* kit.js — o que todas as páginas da Central SuperAdds dividem: porteiro (senha), sessão de 30 min (contínua na Início),
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
    ia: '<path d="M11 3.5l1.9 5 5 1.9-5 1.9-1.9 5-1.9-5-5-1.9 5-1.9z"/><path d="M18.5 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',
    conversa: '<path d="M4 5.5h16v10.5H10l-4.5 3.5V16H4z"/><path d="M8 9.5h8M8 12.5h5"/>'
  };
  function icone(nome) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (ICONES[nome] || "") + "</svg>"; }

  function b64(s) { var b = atob(s), u = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; }

  function tema() { try { return localStorage.getItem("sa-tema") || "escuro"; } catch (e) { return "escuro"; } }
  function trocarTema() {
    var novo = raiz.classList.contains("claro") ? "escuro" : "claro";
    try { localStorage.setItem("sa-tema", novo); } catch (e) { /* sem armazenamento: vale só agora */ }
    raiz.classList.toggle("claro", novo === "claro");
    var b = sombra.querySelector("[data-tema]");
    if (b) {
      b.innerHTML = icone(novo === "claro" ? "lua" : "sol") + "<span>" + (novo === "claro" ? "Tema escuro" : "Tema claro") + "</span>";
      b.title = novo === "claro" ? "Tema escuro" : "Tema claro";
    }
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
      '<div class="pe">' + (CFG.sessao_continua ? "Nesta página a senha não expira enquanto ela ficar aberta. Ao recarregar a página ela é pedida de novo."
                                                 : "A senha vale por 30 minutos. Ao recarregar a página ela é pedida de novo.") + "</div>" +
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
  // Páginas com sessao_continua no config.json (a Início): antes de a sessão acabar, o porteiro dá outra, e a senha não expira
  // com a página aberta. Se o porteiro não souber renovar (versão antiga), volta a contar os minutos como as outras.
  function conferirRelogio() {
    if (!estado.sessao) return;
    var s = restante();
    if (CFG.sessao_continua && estado.renova !== false && s > 0 && s < 300) renovar();
    if (s <= 0) { porta("Sua sessão de 30 minutos terminou. Digite a senha de novo."); return; }
    var el = sombra.querySelector("[data-relogio]");
    if (el) el.textContent = CFG.sessao_continua && estado.renova !== false ? "Sessão aberta" : "Sessão: " + Math.max(1, Math.ceil(s / 60)) + " min";
  }
  function renovar() {
    if (estado.renovando || Date.now() - (estado.renovadoEm || 0) < 60000) return;
    estado.renovando = true;
    chamar("/sessao", { sessao: estado.sessao, renovar: true }).then(function (r) {
      estado.renovando = false;
      if (r.status !== 200) return;
      if (r.j.sessao) { guardar(r.j); estado.renovadoEm = Date.now(); estado.renova = true; } else estado.renova = false;
      conferirRelogio();
    }).catch(function () { estado.renovando = false; });
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
    return '<a href="' + esc(p.url) + '" data-central="1" title="' + esc(p.nome) + '" aria-label="' + esc(p.nome) + '"' +
      (ativa ? ' class="ativa" aria-current="page"' : "") + ">" +
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
      '<button type="button" data-tema title="' + (claro ? "Tema escuro" : "Tema claro") + '">' + icone(claro ? "lua" : "sol") + "<span>" +
      (claro ? "Tema escuro" : "Tema claro") + "</span></button>" +
      '<button type="button" data-sair title="Bloquear">' + icone("cadeado") + "<span>Bloquear</span></button></div></aside>" +
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

  // Rede neural (Cérebro): o que ele observa → como ele pensa → o que ele entrega. Cada nó mostra o número real; a espessura
  // da ligação é a ordem de grandeza do dado que passa por ela; os pulsos andam pelas ligações (param com movimento reduzido).
  // No celular vira uma lista em três blocos (o desenho ficaria pequeno demais para ler).
  function rede(r) {
    var W = 940, H = 540, X = [190, 470, 750], cols = [[], [], []], pos = {};
    var titulos = r.titulos || ["O que ele observa", "Como ele pensa", "O que ele entrega"], cores = ["var(--s1)", "var(--s7)", "var(--s3)"];
    (r.nos || []).forEach(function (n) { cols[n.col].push(n); });
    cols.forEach(function (c, i) {
      var passo = (H - 82) / c.length;                   // embaixo sobra lugar para o nome e o número do último nó do meio
      c.forEach(function (n, j) { pos[n.id] = { x: X[i], y: Math.round(52 + passo * (j + 0.5)), n: n, col: i }; });
    });
    var valor = function (n) {
      return n.valor == null ? "—" : String(n.unidade || "").indexOf("%") === 0 ? fmt.pct(n.valor) : fmt.compacto(n.valor);
    };
    var maxPeso = Math.max.apply(null, (r.ligacoes || []).map(function (l) { return l.peso || 0; }).concat([1]));
    var s = '<svg class="rede-svg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc("Rede: " + titulos.map(function (t, i) {
      return t + ": " + cols[i].map(function (n) { return n.nome + " " + valor(n); }).join(", ");
    }).join(". ")) + '">';
    titulos.forEach(function (t, i) { s += '<text class="cab" x="' + X[i] + '" y="20" text-anchor="middle">' + esc(t) + "</text>"; });
    (r.ligacoes || []).forEach(function (l, i) {
      var a = pos[l.de], b = pos[l.para];
      if (!a || !b) return;
      var x1 = a.x + 18, x2 = b.x - 18, mx = (x1 + x2) / 2;
      var d = "M" + x1 + " " + a.y + " C" + mx + " " + a.y + " " + mx + " " + b.y + " " + x2 + " " + b.y;
      s += '<path class="lig" d="' + d + '" stroke-width="' + (0.8 + 2.4 * (l.peso || 0) / maxPeso).toFixed(2) + '"/>' +
           '<path class="fluxo" d="' + d + '" style="stroke:' + cores[a.col] + ";animation-delay:-" + ((i * 0.41) % 2.6).toFixed(2) + 's"/>';
    });
    Object.keys(pos).forEach(function (k) {
      var p = pos[k], n = p.n, v = valor(n);
      var dica = "<b>" + esc(n.nome) + "</b>" + linhaDica(n.unidade || "", v) + (n.dica ? '<div class="txt">' + esc(n.dica) + "</div>" : "");
      var tx = p.col === 0 ? p.x - 28 : p.col === 2 ? p.x + 28 : p.x, ty = p.col === 1 ? p.y + 33 : p.y - 2;
      var anc = p.col === 0 ? "end" : p.col === 2 ? "start" : "middle";
      s += '<g class="no c' + p.col + '" data-dica="' + esc(dica) + '"><circle class="halo" cx="' + p.x + '" cy="' + p.y + '" r="25"/>' +
           '<circle class="nucleo" cx="' + p.x + '" cy="' + p.y + '" r="15" style="stroke:' + cores[p.col] + '"/>' +
           '<circle cx="' + p.x + '" cy="' + p.y + '" r="4.5" style="fill:' + cores[p.col] + '"/>' +
           '<text class="nome" x="' + tx + '" y="' + ty + '" text-anchor="' + anc + '">' + esc(n.nome) + "</text>" +
           '<text class="valor" x="' + tx + '" y="' + (ty + 15) + '" text-anchor="' + anc + '">' + esc(v + " " + (String(n.unidade || "").indexOf("%") === 0 ? n.unidade.slice(1).trim() : n.unidade || "")) + "</text></g>";
    });
    s += "</svg>";
    var lista = '<div class="rede-lista">' + titulos.map(function (t, i) {
      return '<div><h5><i style="background:' + cores[i] + '"></i>' + esc(t) + "</h5><ul>" + cols[i].map(function (n) {
        return "<li><b>" + esc(n.nome) + "</b><span>" + esc(valor(n) + " " + (String(n.unidade || "").indexOf("%") === 0 ? n.unidade.slice(1).trim() : n.unidade || "")) + "</span></li>";
      }).join("") + "</ul></div>";
    }).join("") + "</div>";
    return '<div class="rede">' + s + lista + "</div>";
  }

  // Previsto × aconteceu, dia a dia: a faixa prevista (barra) e o real (círculo cheio = dentro da faixa; anel = fora).
  function faixas(dias, opt) {
    opt = opt || {};
    var estreito = estreitoAgora(), W = estreito ? 400 : 860, H = estreito ? 220 : 240, esq = 44, dir = 10, topo = 12, base = 30;
    var vals = [];
    dias.forEach(function (d) { [d.de, d.ate, d.leitura].forEach(function (v) { if (v != null) vals.push(v); }); });
    if (!vals.length) return "";
    var lo = Math.floor((Math.min.apply(null, vals) - 2) / 5) * 5, hi = Math.ceil((Math.max.apply(null, vals) + 2) / 5) * 5;
    var y = function (v) { return topo + (H - topo - base) * (hi - v) / (hi - lo); };
    var n = dias.length, larg = (W - esq - dir) / Math.max(1, n), bw = Math.max(6, Math.min(22, larg * 0.45));
    var cada = Math.max(1, Math.ceil(n / (estreito ? 6 : 14)));
    var s = '<svg class="graf faixas" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + esc(opt.rotulo || "Previsto × aconteceu") + '">';
    for (var v = lo; v <= hi + 1e-9; v += 5) {
      s += '<line class="grade-l" x1="' + esq + '" x2="' + (W - dir) + '" y1="' + y(v).toFixed(1) + '" y2="' + y(v).toFixed(1) + '"/>' +
           '<text x="' + (esq - 8) + '" y="' + (y(v) + 4).toFixed(1) + '" text-anchor="end">' + v + "%</text>";
    }
    dias.forEach(function (d, i) {
      var cx = esq + larg * i + larg / 2, g = '<g class="col"><rect class="realce" x="' + (esq + larg * i).toFixed(1) + '" y="' + topo + '" width="' + larg.toFixed(1) +
        '" height="' + (H - topo - base) + '"/>';
      if (d.de != null && d.ate != null) {
        g += '<rect class="faixa-p" x="' + (cx - bw / 2).toFixed(1) + '" y="' + y(d.ate).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' +
             Math.max(2, y(d.de) - y(d.ate)).toFixed(1) + '" rx="4"/>';
      }
      if (d.previsto != null) {
        g += '<line class="previsto" x1="' + (cx - bw / 2 - 3).toFixed(1) + '" x2="' + (cx + bw / 2 + 3).toFixed(1) + '" y1="' + y(d.previsto).toFixed(1) +
             '" y2="' + y(d.previsto).toFixed(1) + '"/>';
      }
      if (d.leitura != null) {
        g += d.dentro ? '<circle class="real dentro" cx="' + cx.toFixed(1) + '" cy="' + y(d.leitura).toFixed(1) + '" r="5.5"/>'
                      : '<circle class="real fora" cx="' + cx.toFixed(1) + '" cy="' + y(d.leitura).toFixed(1) + '" r="5.5"/>';
      }
      var dica = "<b>" + esc(fmt.dataLonga(d.dia) + (d.dia_semana ? " · " + d.dia_semana : "")) + "</b>" + linhaDica("Previsto", fmt.pct(d.previsto)) +
        linhaDica("Faixa", fmt.pct(d.de) + " a " + fmt.pct(d.ate)) + linhaDica("Aconteceu", fmt.pct(d.leitura)) +
        linhaDica("Resultado", d.dentro ? "dentro da faixa" : "fora da faixa") + (d.acerto != null ? linhaDica("Horários certos", fmt.pct(d.acerto, 0)) : "");
      g += '<rect class="alvo" x="' + (esq + larg * i).toFixed(1) + '" y="' + topo + '" width="' + larg.toFixed(1) + '" height="' + (H - topo - base) +
           '" data-dica="' + esc(dica) + '"/></g>';
      s += g;
      if (i % cada === 0 || i === n - 1) {
        s += '<text x="' + cx.toFixed(1) + '" y="' + (H - base + 18) + '" text-anchor="middle">' + esc(String(d.dia).slice(8, 10) + "/" + String(d.dia).slice(5, 7)) + "</text>";
      }
    });
    return s + "</svg>" + '<div class="legenda" style="margin-top:8px"><span><i class="lg-faixa"></i>Faixa prevista antes do disparo</span>' +
      '<span><i class="lg-prev"></i>Previsto</span><span><i class="lg-dentro"></i>Aconteceu, dentro da faixa</span><span><i class="lg-fora"></i>Aconteceu, fora da faixa</span></div>';
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

  var api = { esc: esc, fmt: fmt, icone: icone, cor: cor, arco: arco, rosca: rosca, colunas: colunas, barras: barras, tile: tile, rede: rede, faixas: faixas,
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

/* conversas.js — Conversas: o que as pessoas mandam ao número do disparo, num visual de WhatsApp Web, só para ler.
   As mensagens vêm ao vivo do superadds-central (/dev/conversas e /dev/conversa?id=), que lê o banco do webhook: nada vai
   para o GitHub. O número aparece só com o final. Áudio, foto, vídeo e arquivo aparecem só como "a pessoa mandou".
   A Central nunca marca mensagem como lida na Meta: quem escreveu não fica sabendo. "Novas" vale só para este navegador. */

var CV = { lista: null, erro: null, quando: 0, carregando: false, sel: null, conversas: {}, erros: {}, busca: "", buscaIds: null, filtro: "todas",
           timer: null, relogio: null, raiz: null, ui: null, base: null, vistos: null, rolarFim: false, teclado: false };
var CV_ATUALIZA_MS = 20000;

var CV_IC = {
  audio: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0"/><path d="M12 17.5V21"/>',
  imagem: '<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><circle cx="9" cy="10" r="1.6"/><path d="M20.5 16l-5-5-8 8"/>',
  video: '<rect x="3" y="6" width="13" height="12" rx="2.5"/><path d="M16 10.5l5-3v9l-5-3z"/>',
  documento: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/><path d="M10 13h6M10 16.5h6"/>',
  figurinha: '<path d="M20 12a8 8 0 1 1-8-8h8z"/><path d="M9 10h.01M15 10h.01"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0"/>',
  local: '<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  contato: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>',
  reacao: '<circle cx="12" cy="12" r="8.5"/><path d="M9 10h.01M15 10h.01"/><path d="M8.5 14a4.5 4.5 0 0 0 7 0"/>',
  toque: '<path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11"/><path d="M12 10.5a1.5 1.5 0 0 1 3 0v1a1.5 1.5 0 0 1 3 0v3.5a6 6 0 0 1-6 6h-.5a6 6 0 0 1-5.2-3l-2-3.5a1.5 1.5 0 0 1 2.6-1.5L9 15"/>',
  campanha: '<path d="M4 10v4h3l6 4V6L7 10z"/><path d="M16.5 9a4 4 0 0 1 0 6"/>',
  conversa: '<path d="M4 5.5h16v10.5H10l-4.5 3.5V16H4z"/><path d="M8 9.5h8M8 12.5h5"/>',
  um: '<path d="M5 12.5l4 4L18.5 7"/>',
  dois: '<path d="M2.5 12.5l4 4L16 7"/><path d="M9.5 15.5l1 1L20 7"/>',
  baixo: '<path d="M6 9l6 6 6-6"/>'
};
function cvIc(n) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (CV_IC[n] || "") + "</svg>"; }

// O que a Central não mostra, e por quê (aparece ao passar o mouse na mensagem)
var CV_PRIVACIDADE = "Por privacidade, a Central não baixa áudios, fotos, vídeos nem arquivos: mostra só que a pessoa enviou. O conteúdo fica apenas no WhatsApp dela.";
var CV_MIDIA = {
  audio: ["audio", "Áudio"], voice: ["audio", "Áudio"], image: ["imagem", "Foto"], video: ["video", "Vídeo"], document: ["documento", "Documento"],
  sticker: ["figurinha", "Figurinha", "Por privacidade, a Central não baixa figurinhas: mostra só que a pessoa enviou uma."],
  location: ["local", "Localização", "Por privacidade, a Central não guarda localização: mostra só que a pessoa enviou uma."],
  contacts: ["contato", "Contato", "Por privacidade, a Central não guarda contatos compartilhados: mostra só que a pessoa enviou um."],
  reaction: ["reacao", "Reação", "A pessoa reagiu a uma mensagem com um emoji. O webhook guarda só que houve a reação, não qual foi."],
  unsupported: ["info", "Mensagem não suportada", "A Meta não entrega este tipo de mensagem pela API (por exemplo, enquete ou visualização única)."],
  order: ["documento", "Pedido", "Um pedido do catálogo do WhatsApp. A Central não guarda os itens."],
  system: ["info", "Aviso do WhatsApp", "Aviso automático do WhatsApp, como troca de número."]
};
var CV_SAIU = {
  pediu_saida: ["Pediu para sair", "critico", "Respondeu pedindo para sair e não recebe mais marketing. O webhook mandou a confirmação automática."],
  meta_131050: ["Parou o marketing", "atencao", "A pessoa desligou as mensagens de marketing da empresa no próprio WhatsApp (erro 131050 da Meta)."]
};

// ------------------------------------------------------------------ datas (no horário deste computador)
var CV_SEMANA = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
function cv2(n) { return ("0" + n).slice(-2); }
function cvHora(iso) { var d = new Date(iso); return isNaN(d) ? "" : cv2(d.getHours()) + ":" + cv2(d.getMinutes()); }
function cvDiaN(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); }
function cvDiasAtras(iso) { return Math.round((cvDiaN(new Date()) - cvDiaN(new Date(iso))) / 864e5); }
function cvQuando(iso) {
  if (!iso) return "";
  var n = cvDiasAtras(iso), d = new Date(iso);
  if (n <= 0) return cvHora(iso);
  if (n === 1) return "Ontem";
  if (n < 7) return CV_SEMANA[d.getDay()];
  return cv2(d.getDate()) + "/" + cv2(d.getMonth() + 1) + "/" + String(d.getFullYear()).slice(2);
}
function cvData(iso) { var d = new Date(iso); return cv2(d.getDate()) + "/" + cv2(d.getMonth() + 1) + "/" + d.getFullYear(); }
function cvDia(iso) {
  var n = cvDiasAtras(iso), d = new Date(iso);
  if (n <= 0) return "Hoje";
  if (n === 1) return "Ontem";
  if (n < 7) return CV_SEMANA[d.getDay()].charAt(0).toUpperCase() + CV_SEMANA[d.getDay()].slice(1);
  return cvData(iso);
}
function cvIdade() {
  var s = Math.round((Date.now() - CV.quando) / 1000);
  return "atualizado há " + (s < 60 ? s + " s" : Math.round(s / 60) + " min");
}

// ------------------------------------------------------------------ quem é cada um (só o final do número)
function cvFinal(c) { return "••••-" + (c.final || "????"); }
function cvNome(c) { return c.nome || "Contato " + cvFinal(c); }
function cvIniciais(c) {
  var p = String(c.nome || "").replace(/[^A-Za-zÀ-ÿ\s]/g, " ").trim().split(/\s+/).filter(Boolean);
  return p.length ? (p[0].charAt(0) + (p.length > 1 ? p[p.length - 1].charAt(0) : "")).toUpperCase() : "";
}
function cvAvatar(c, ui) {
  var cores = [1, 3, 5, 7, 4, 2], ini = cvIniciais(c);
  return '<span class="wa-av" style="--av:' + ui.cor(cores[(c.id || 0) % cores.length]) + '" aria-hidden="true">' + (ini ? ui.esc(ini) : cvIc("contato")) + "</span>";
}
function cvSaiu(c, ui, compacto) {
  var s = c.saiu && CV_SAIU[c.saiu.motivo];
  if (!s) return "";
  var dica = "<b>" + ui.esc(s[0]) + "</b><div class=\"txt\">" + ui.esc(s[2]) + "</div>" + (c.saiu.quando ? ui.linhaDica("Desde", cvDia(c.saiu.quando) + " às " + cvHora(c.saiu.quando)) : "");
  return '<span data-dica="' + ui.esc(dica) + '">' + ui.tag(compacto ? "Saiu" : s[0], s[1]) + "</span>";
}

// ------------------------------------------------------------------ "novas": só neste navegador, nada vai para a Meta
function cvVistos(ui) {
  if (!CV.vistos) { try { CV.vistos = JSON.parse(ui.lembrar("vistos") || "{}"); } catch (e) { CV.vistos = {}; } }
  return CV.vistos;
}
function cvNovas(c, ui) {
  var ate = Math.max(CV.base || 0, cvVistos(ui)[c.id] || 0);
  return (c.ids || []).filter(function (i) { return i > ate; }).length;
}
function cvMarcarVisto(c, ui) {
  if (!c) return;
  var v = cvVistos(ui), max = Math.max.apply(null, [0].concat(c.ids || []));
  if ((v[c.id] || 0) >= max) return;
  v[c.id] = max;
  ui.lembrar("vistos", JSON.stringify(v));
}
function cvContato(id) { return ((CV.lista && CV.lista.contatos) || []).filter(function (c) { return String(c.id) === String(id); })[0] || null; }

// ------------------------------------------------------------------ a lista (esquerda)
function cvFiltrados(ui) {
  var t = CV.busca.trim().toLowerCase(), so = t.replace(/\D/g, "");
  return ((CV.lista && CV.lista.contatos) || []).filter(function (c) {
    if (CV.filtro === "novas" && !cvNovas(c, ui)) return false;
    if (CV.filtro === "sairam" && !c.saiu) return false;
    if (!t) return true;
    return String(c.nome || "").toLowerCase().indexOf(t) >= 0 || String((c.ultima || {}).texto || "").toLowerCase().indexOf(t) >= 0 ||
      (so.length >= 2 && String(c.final || "").indexOf(so) >= 0) || Boolean(CV.buscaIds && CV.buscaIds[c.id]);
  });
}
// A busca também olha as mensagens antigas: o porteiro procura no banco e devolve as conversas que têm o termo
function cvBuscar(termo) {
  CV.buscaIds = null;
  if (termo.trim().length < 3 || !CV.ui) return;
  CV.ui.chamarDev("/dev/conversas-busca?q=" + encodeURIComponent(termo.trim())).then(function (r) {
    if (CV.busca !== termo || !r || r.status !== 200 || !r.j || !r.j.ids) return;
    var ids = {};
    r.j.ids.forEach(function (i) { ids[i] = true; });
    CV.buscaIds = ids;
    cvPintar();
  }).catch(function () { /* fica só a busca na lista */ });
}
function cvMarcar(texto, ui) {
  var t = CV.busca.trim(), s = String(texto || "");
  if (!t) return ui.esc(s);
  var i = s.toLowerCase().indexOf(t.toLowerCase());
  return i < 0 ? ui.esc(s) : ui.esc(s.slice(0, i)) + "<mark>" + ui.esc(s.slice(i, i + t.length)) + "</mark>" + ui.esc(s.slice(i + t.length));
}
function cvPrevia(u, ui) {
  var m = CV_MIDIA[u.tipo];
  if (u.tipo === "button" || u.tipo === "interactive") return cvIc("toque") + "<span>" + cvMarcar(u.texto || "Tocou num botão", ui) + "</span>";
  if (m) return cvIc(m[0]) + "<span>" + (u.texto ? cvMarcar(u.texto, ui) : ui.esc(m[1])) + "</span>";
  return "<span>" + (u.texto ? cvMarcar(u.texto, ui) : "Mensagem sem texto") + "</span>";
}
function cvChips(ui) {
  var cs = (CV.lista && CV.lista.contatos) || [];
  var n = { todas: cs.length, novas: cs.filter(function (c) { return cvNovas(c, ui); }).length, sairam: cs.filter(function (c) { return c.saiu; }).length };
  var dicas = { novas: "<b>Novas</b><div class=\"txt\">Conversas com mensagens que você ainda não abriu neste navegador. Só aqui: nada disso vai para a Meta.</div>",
                sairam: "<b>Pediram para sair</b><div class=\"txt\">Quem pediu para sair ou desligou o marketing da empresa no WhatsApp.</div>" };
  return [["todas", "Todas"], ["novas", "Novas"], ["sairam", "Pediram para sair"]].map(function (o) {
    return '<button type="button" class="wa-chip' + (CV.filtro === o[0] ? " on" : "") + '" data-acao="filtro" data-valor="' + o[0] + '" aria-pressed="' +
      (CV.filtro === o[0]) + '"' + (dicas[o[0]] ? ' data-dica="' + ui.esc(dicas[o[0]]) + '"' : "") + ">" + ui.esc(o[1]) + "<small>" + ui.fmt.num(n[o[0]]) + "</small></button>";
  }).join("");
}
function cvCabInfo(ui) {
  var l = CV.lista, f = ui.fmt;
  var vivo = '<span class="wa-vivo' + (CV.erro ? " parado" : "") + '"><i class="pulso"></i><span data-wa-idade>' +
    ui.esc(CV.quando ? cvIdade() : CV.erro ? "sem leitura" : "lendo agora…") + "</span></span>";
  var resumo = l ? f.num(l.contatos.length) + (l.contatos.length === 1 ? " conversa" : " conversas") + " em " + l.janela_dias + " dias · " +
    f.num(l.hoje.mensagens) + (l.hoje.mensagens === 1 ? " mensagem hoje" : " mensagens hoje") : "";
  return '<div class="wa-cab-l1"><h2>Conversas</h2>' + vivo + "</div>" +
    '<div class="wa-resumo">' + ui.esc(resumo) + (l && l.exemplo ? " " + ui.tag("Exemplo (prévia)", "neutro") : "") + "</div>";
}
function cvItens(ui) {
  if (!CV.lista) {
    var msg = CV.erro === "versao" ? "A página Conversas precisa da versão 1.9.0 do superadds-central: cole o código novo no painel da Cloudflare (LEIA-ME do Worker)."
      : CV.erro ? "Não deu para ler as conversas agora: " + CV.erro + ". Tento de novo em 20 s." : "Lendo as conversas…";
    return '<div class="wa-lista-vazia">' + ui.esc(msg) + "</div>";
  }
  var cs = cvFiltrados(ui);
  if (!cs.length) {
    return '<div class="wa-lista-vazia">' + ui.esc(CV.lista.contatos.length ? "Nenhuma conversa com esse filtro." :
      "Ninguém escreveu para o número nos últimos " + CV.lista.janela_dias + " dias.") + "</div>";
  }
  return cs.map(function (c) {
    var novas = cvNovas(c, ui), on = String(c.id) === String(CV.sel), u = c.ultima || {};
    return '<button type="button" class="wa-item' + (on ? " on" : "") + (novas ? " nova" : "") + '" data-acao="abrir" data-valor="' + c.id + '"' +
      (on ? ' aria-current="true"' : "") + ' aria-label="' + ui.esc(cvNome(c) + ", " + (novas ? novas + " mensagens novas, " : "") + "última às " + cvQuando(u.quando)) + '">' +
      cvAvatar(c, ui) + '<span class="wa-it-meio"><span class="wa-it-l1"><b>' + cvMarcar(cvNome(c), ui) + "</b><time>" + ui.esc(cvQuando(u.quando)) + "</time></span>" +
      '<span class="wa-it-l2"><span class="wa-prev">' + cvPrevia(u, ui) + "</span>" + cvSaiu(c, ui, true) +
      (novas ? '<span class="wa-novas">' + (novas > 99 ? "99+" : novas) + "</span>" : "") + "</span>" +
      '<span class="wa-final">' + ui.esc(cvFinal(c)) + " · " + ui.fmt.num(c.n) + (c.n === 1 ? " mensagem" : " mensagens") + "</span></span></button>";
  }).join("");
}

// ------------------------------------------------------------------ as deduções da IA (Personas › Conversas) que se confirmaram
// d.rotulos: {deducoes: [...], m: {id da mensagem: [ids]}, c: {id da última mensagem do contato: [ids]}}. Os nomes são da IA.
function cvDeds(lista) {
  var R = CV.rot;
  if (!R || !lista) return [];
  if (!R._por) { R._por = {}; (R.deducoes || []).forEach(function (x) { R._por[x.id] = x; }); }
  return lista.map(function (id) { return R._por[id]; }).filter(Boolean);
}
function cvEtiqueta(x, ui) {
  var dica = "<b>" + ui.esc(x.nome) + "</b><div class=\"txt\">" + ui.esc(x.o_que_significa || "") + "</div>" +
    '<div class="txt" style="margin-top:4px;opacity:.85">Como o sistema reconhece: ' + ui.esc(x.definicao_em_palavras || "") + "</div>" +
    '<div class="txt" style="margin-top:4px;opacity:.85">Dedução da IA · ' + ui.esc(x.status === "valendo" ? "valendo (confirmada duas vezes)" : "confirmada na metade de prova") +
    ". Detalhes em Personas › Conversas.</div>";
  return '<span class="wa-ded" data-dica="' + ui.esc(dica) + '">' + ui.icone("ia") + "<span>" + ui.esc(x.nome) + "</span></span>";
}
function cvEtiquetasMsg(m, ui) {
  var ds = cvDeds(CV.rot && CV.rot.m && CV.rot.m[String(m.id)]);
  return ds.length ? "<div>" + ds.map(function (x) { return cvEtiqueta(x, ui); }).join(" ") + "</div>" : "";
}
function cvEtiquetasContato(c, ui) {
  var R = CV.rot, ids = (c && c.ids) || [];
  if (!R || !R.c) return "";
  for (var i = ids.length - 1; i >= 0; i--) {
    var ds = cvDeds(R.c[String(ids[i])]);
    if (ds.length) return ds.map(function (x) { return cvEtiqueta(x, ui); }).join("");
  }
  return "";
}

// ------------------------------------------------------------------ a conversa (direita)
function cvBolhaPessoa(m, ui, seq) {
  var md = CV_MIDIA[m.tipo], h = '<span class="wa-h">' + ui.esc(cvHora(m.quando)) + "</span>", et = cvEtiquetasMsg(m, ui);
  if (md) {
    var dica = "<b>" + ui.esc(md[1]) + "</b><div class=\"txt\">" + ui.esc(md[2] || CV_PRIVACIDADE) + "</div>";
    return '<div class="wa-b in midia' + seq + '" data-dica="' + ui.esc(dica) + '">' + et + '<span class="wa-midia"><span class="ic">' + cvIc(md[0]) + "</span>" +
      ui.esc(md[1]) + '<span class="i" aria-label="Por que não aparece">' + ui.icone("info") + "</span></span>" +
      (m.texto ? '<div class="wa-txt">' + ui.esc(m.texto) + "</div>" : "") + h + "</div>";
  }
  if (m.tipo === "button" || m.tipo === "interactive") {
    return '<div class="wa-b in' + seq + '">' + et + '<span class="wa-botao">' + cvIc("toque") + "Tocou no botão</span><div class=\"wa-txt\">" +
      ui.esc(m.texto || "—") + "</div>" + h + "</div>";
  }
  return '<div class="wa-b in' + seq + '">' + et + '<div class="wa-txt">' + (m.texto ? ui.esc(m.texto) : '<i class="wa-vazia">Mensagem sem texto</i>') + "</div>" + h + "</div>";
}
var CV_CATEGORIA = { marketing: "Mensagem da campanha", utility: "Mensagem de utilidade", authentication: "Código de acesso", service: "Resposta automática" };
var CV_SITUACAO = { sent: "Enviada", delivered: "Entregue", read: "Lida pela pessoa", failed: "Não entregue" };
function cvBolhaNossa(m, ui, seq) {
  var nome = CV_CATEGORIA[m.categoria] || "Mensagem enviada", t = m.tempos || {};
  var dica = "<b>" + ui.esc(nome) + "</b>" + ["sent", "delivered", "read", "failed"].filter(function (s) { return t[s]; }).map(function (s) {
    return ui.linhaDica(CV_SITUACAO[s], cvDia(t[s]) + " · " + cvHora(t[s]));
  }).join("") + (m.erro ? '<div class="txt" style="margin-top:4px">Erro ' + ui.esc(String(m.erro.codigo)) + ": " + ui.esc(m.erro.explicacao) + "</div>" : "") +
    '<div class="txt" style="margin-top:4px;opacity:.8">O texto do template não fica no banco do webhook: aqui aparece só que a mensagem foi enviada e o que aconteceu com ela.</div>';
  var tique = m.situacao === "failed" ? "" : '<span class="' + (m.situacao === "read" ? "lida" : "") + '">' + cvIc(m.situacao === "sent" ? "um" : "dois") + "</span>";
  return '<div class="wa-b out' + seq + '" data-dica="' + ui.esc(dica) + '"><span class="wa-nossa">' + cvIc("campanha") + ui.esc(nome) + "</span>" +
    (m.situacao === "failed" ? ui.tag("Não entregue", "critico") : "") + '<span class="wa-h">' + ui.esc(cvHora(m.quando)) + tique + "</span></div>";
}
function cvMensagens(cv, ui) {
  var todas = (cv.mensagens || []).concat(cv.enviadas || []).filter(function (m) { return m.quando; })
    .sort(function (a, b) { return a.quando < b.quando ? -1 : a.quando > b.quando ? 1 : 0; });
  if (!todas.length) return '<div class="wa-vazio"><p>Sem mensagens nos últimos dias.</p></div>';
  var h = "", dia = null, ant = null;
  todas.forEach(function (m) {
    var d = new Date(m.quando).toDateString();
    if (d !== dia) { h += '<div class="wa-dia"><span>' + ui.esc(cvDia(m.quando)) + "</span></div>"; dia = d; ant = null; }
    var seq = ant && ant.de === m.de && new Date(m.quando) - new Date(ant.quando) < 3 * 60000 ? " seq" : "";
    h += m.de === "nos" ? cvBolhaNossa(m, ui, seq) : cvBolhaPessoa(m, ui, seq);
    ant = m;
  });
  return h;
}
function cvChat(ui) {
  var c = cvContato(CV.sel);
  if (!CV.sel || !c) {
    return '<div class="wa-vazio"><span class="ic">' + cvIc("conversa") + "</span><b>Escolha uma conversa</b>" +
      "<p>As mensagens aparecem como no WhatsApp Web, só para ler. O número aparece só com o final, e a Central não marca nada como lido: quem escreveu não fica sabendo.</p></div>";
  }
  var cv = CV.conversas[c.id], f = ui.fmt;
  var primeira = cv && cv.mensagens && cv.mensagens[0];
  var corpo = cv ? cvMensagens(cv, ui) : CV.erros[c.id] ? '<div class="wa-vazio"><p>' + ui.esc("Não deu para abrir a conversa: " + CV.erros[c.id] + ".") + "</p></div>"
    : '<div class="wa-carregando">Abrindo a conversa…</div>';
  var leitura = "<b>Só leitura</b><div class=\"txt\">A Meta só mostra os dois tracinhos azuis para a pessoa quando o sistema avisa que leu. A Central nunca faz isso: " +
    "ela só lê o banco do nosso webhook, e a conversa não muda nada no WhatsApp de quem escreveu.</div>";
  return '<header class="wa-chat-topo"><button type="button" class="wa-voltar" data-acao="voltar" aria-label="Voltar para a lista">' + ui.icone("volta") + "</button>" +
    cvAvatar(c, ui) + '<div class="quem"><b>' + ui.esc(cvNome(c)) + "</b><small>" + ui.esc(cvFinal(c) + " · " + f.num(c.n) + (c.n === 1 ? " mensagem" : " mensagens") +
    (primeira ? " · escreveu pela 1ª vez " + (cvDiasAtras(primeira.quando) <= 1 ? cvDia(primeira.quando).toLowerCase() : "em " + cvData(primeira.quando)) : "")) + "</small></div>" +
    '<span class="wa-chat-tags">' + cvEtiquetasContato(c, ui) + cvSaiu(c, ui, false) + "</span></header>" +
    '<div class="wa-msgs" data-wa-msgs role="log" aria-label="' + ui.esc("Mensagens de " + cvNome(c)) + '">' + corpo + "</div>" +
    '<button type="button" class="wa-fim" data-acao="fim" aria-label="Ir para a última mensagem">' + cvIc("baixo") + "</button>" +
    '<footer class="wa-rodape">' + ui.icone("cadeado") + "<span>Somente leitura · quem escreveu não fica sabendo que a mensagem foi vista aqui</span>" +
    '<span class="i" data-dica="' + ui.esc(leitura) + '" aria-label="Por que só leitura">' + ui.icone("info") + "</span></footer>";
}

// ------------------------------------------------------------------ pintar só o que mudou (a busca não perde o cursor)
function cvPintar() {
  var r = CV.raiz, ui = CV.ui;
  var wa = r && r.querySelector("[data-wa]");
  if (!wa || !ui) return;
  wa.classList.toggle("com-conversa", Boolean(CV.sel));
  var itens = wa.querySelector("[data-wa-itens]"), topo = itens ? itens.scrollTop : 0;
  var msgs = wa.querySelector("[data-wa-msgs]"), noFim = !msgs || msgs.scrollHeight - msgs.scrollTop - msgs.clientHeight < 60, antes = msgs ? msgs.scrollTop : 0;
  wa.querySelector("[data-wa-info]").innerHTML = cvCabInfo(ui);
  wa.querySelector("[data-wa-chips]").innerHTML = cvChips(ui);
  if (itens) { itens.innerHTML = cvItens(ui); itens.scrollTop = topo; }
  var chat = wa.querySelector("[data-wa-chat]");
  var mesma = chat.getAttribute("data-conversa") === String(CV.sel || "");
  chat.innerHTML = cvChat(ui);
  chat.setAttribute("data-conversa", String(CV.sel || ""));
  cvRolagem(CV.rolarFim || !mesma || noFim ? null : antes);
  CV.rolarFim = false;
}
function cvRolagem(posicao) {
  var chat = CV.raiz && CV.raiz.querySelector("[data-wa-chat]"), msgs = chat && chat.querySelector("[data-wa-msgs]");
  if (!msgs) return;
  msgs.scrollTop = posicao == null ? msgs.scrollHeight : posicao;
  var ver = function () { chat.classList.toggle("longe", msgs.scrollHeight - msgs.scrollTop - msgs.clientHeight > 240); };
  msgs.onscroll = ver;
  ver();
}

// ------------------------------------------------------------------ leitura ao vivo (20 s com a página à vista)
function cvTratar(r, alvo) {
  if (r && r.status === 200 && r.j && !r.j.erro) return r.j;
  // Worker antigo: a rota não existe ("nao_encontrado")
  if (alvo) alvo.erro = r && r.status === 404 && (!r.j || r.j.erro === "nao_encontrado") ? "versao" : (r && r.j && r.j.erro) || "HTTP " + (r && r.status);
  return null;
}
function cvCarregar() {
  var ui = CV.ui;
  if (!ui || CV.carregando) return;
  CV.carregando = true;
  var sel = CV.sel, pedidos = [ui.chamarDev("/dev/conversas")];
  if (sel) pedidos.push(ui.chamarDev("/dev/conversa?id=" + encodeURIComponent(sel)));
  Promise.all(pedidos.map(function (p) { return p.catch(function (e) { return { falhou: e }; }); })).then(function (rs) {
    CV.carregando = false;
    if (rs.some(function (r) { return r.falhou && r.falhou.message === "sessao"; })) { cvParar(); return; }
    var l = rs[0].falhou ? null : cvTratar(rs[0], CV);
    if (rs[0].falhou) CV.erro = "sem resposta do superadds-central";
    if (l) {
      CV.lista = l; CV.erro = null; CV.quando = Date.now();
      if (CV.base == null) {                        // 1ª visita neste navegador: o que já estava lá não conta como novo
        var base = Number(ui.lembrar("base"));
        if (!base) { base = Math.max.apply(null, [0].concat(l.contatos.map(function (c) { return Math.max.apply(null, [0].concat(c.ids || [])); }))); ui.lembrar("base", String(base)); }
        CV.base = base;
      }
      if (CV.sel) cvMarcarVisto(cvContato(CV.sel), ui);
    }
    if (sel && rs[1] && !rs[1].falhou) {
      var cv = cvTratar(rs[1], null);
      if (cv) { CV.conversas[sel] = cv; delete CV.erros[sel]; }
    }
    cvPintar();
  });
}
function cvAbrir(id) {
  var ui = CV.ui;
  CV.sel = id; CV.rolarFim = true;
  cvMarcarVisto(cvContato(id), ui);
  cvPintar();
  if (CV.conversas[id]) return;
  ui.chamarDev("/dev/conversa?id=" + encodeURIComponent(id)).then(function (r) {
    var cv = cvTratar(r, null);
    if (cv) { CV.conversas[id] = cv; delete CV.erros[id]; }
    else CV.erros[id] = r && r.j && r.j.erro || "HTTP " + (r && r.status);
    if (String(CV.sel) === String(id)) { CV.rolarFim = true; cvPintar(); }
  }).catch(function (e) {
    if (e && e.message === "sessao") { cvParar(); return; }
    CV.erros[id] = "sem resposta do superadds-central";
    cvPintar();
  });
}
function cvParar() {
  if (CV.timer) clearInterval(CV.timer);
  if (CV.relogio) clearInterval(CV.relogio);
  CV.timer = CV.relogio = null;
}
function cvLigar() {
  if (CV.timer) return;
  cvCarregar();
  CV.timer = setInterval(function () { if (!document.hidden) cvCarregar(); }, CV_ATUALIZA_MS);
  CV.relogio = setInterval(function () {
    var el = CV.raiz && CV.raiz.querySelector("[data-wa-idade]");
    if (el && CV.quando) el.textContent = cvIdade();
  }, 5000);
}
// Teclado: setas sobem e descem na lista, Esc fecha a conversa
function cvTeclado(ev) {
  if (!CV.raiz || !CV.raiz.querySelector("[data-wa]")) return;
  var t = ev.target, digitando = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA");
  if (ev.key === "Escape" && CV.sel) { CV.sel = null; cvPintar(); return; }
  if (digitando || (ev.key !== "ArrowDown" && ev.key !== "ArrowUp")) return;
  var cs = cvFiltrados(CV.ui);
  if (!cs.length) return;
  var i = cs.map(function (c) { return String(c.id); }).indexOf(String(CV.sel));
  var j = ev.key === "ArrowDown" ? Math.min(cs.length - 1, i + 1) : Math.max(0, i < 0 ? 0 : i - 1);
  ev.preventDefault();
  cvAbrir(cs[j].id);
  var el = CV.raiz.querySelector('.wa-item[data-valor="' + cs[j].id + '"]');
  if (el) { el.focus(); if (el.scrollIntoView) el.scrollIntoView({ block: "nearest" }); }
}

SA.pagina({
  acao: function (a, v, ui) {
    if (a === "abrir") { cvAbrir(v); return false; }
    if (a === "voltar") { CV.sel = null; cvPintar(); return false; }
    if (a === "filtro") { CV.filtro = v; ui.lembrar("filtro", v); cvPintar(); return false; }
    if (a === "busca") { CV.busca = v || ""; cvBuscar(CV.busca); cvPintar(); return false; }
    if (a === "fim") { cvRolagem(null); return false; }
  },
  depois: function (raiz, d, ui) {
    CV.raiz = raiz; CV.ui = ui;
    if (!CV.teclado) { raiz.addEventListener("keydown", cvTeclado); CV.teclado = true; }
    cvRolagem(null);
    cvLigar();
  },
  render: function (d, ui) {
    CV.ui = ui;
    if (!CV.rot || CV.rot.gerado_em !== ((d.rotulos || {}).gerado_em)) CV.rot = d.rotulos || null;
    if (!CV.filtro || CV.filtro === "todas") CV.filtro = ui.lembrar("filtro") || "todas";
    var h = '<div class="wa' + (CV.sel ? " com-conversa" : "") + '" data-wa><div class="wa-grade">' +
      '<section class="wa-lista" aria-label="Conversas"><header class="wa-cab"><div data-wa-info>' + cvCabInfo(ui) + "</div>" +
      '<label class="wa-busca">' + ui.icone("busca") + '<input type="search" data-digitar="busca" value="' + ui.esc(CV.busca) +
      '" placeholder="Buscar por nome, final do número ou mensagem" aria-label="Buscar conversa" autocomplete="off"></label>' +
      '<div class="wa-chips" data-wa-chips role="group" aria-label="Filtrar conversas">' + cvChips(ui) + "</div></header>" +
      '<div class="wa-itens" data-wa-itens>' + cvItens(ui) + "</div></section>" +
      '<section class="wa-chat" data-wa-chat data-conversa="' + ui.esc(String(CV.sel || "")) + '" aria-label="Conversa aberta">' + cvChat(ui) + "</section></div></div>";
    return {
      html: h,
      faixa: { trilha: "Central SuperAdds · WhatsApp", titulo: "Conversas",
               sub: "O que as pessoas mandam ao número da campanha, ao vivo. Só para ler: quem escreveu não fica sabendo que a mensagem foi vista.",
               pilulas: ["Número só com o final", "Últimos 90 dias", "Não marca como lida"] }
    };
  }
});

})();
