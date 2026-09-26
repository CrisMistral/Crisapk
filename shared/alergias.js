/* Alergias escritas a mano → alérgenos conocidos.
   La persona escribe lo que quiera («celiaca, lactosa y kiwi»); aquí se
   reconoce en español, inglés o francés. Lo que no se reconoce se devuelve
   como palabra suelta y se trata igual que «no quiero que aparezca». */
(function(){
  const SYN=[ // el orden importa: cacahuete antes que frutos secos («peanuts» contiene «nuts»)
    ['cacahuete','🥜',{es:'Cacahuete',en:'Peanut',fr:'Arachide'},/cacahuet|\bmani\b|peanut|arachide/],
    ['gluten','🌾',{es:'Gluten',en:'Gluten',fr:'Gluten'},/gluten|celiac|celiaqu|coeliac|coeliaq|trigo|wheat|\bble\b/],
    ['lacteos','🥛',{es:'Lácteos',en:'Dairy',fr:'Produits laitiers'},/lact|leche|lacteo|dairy|milk|\blait|laitier|queso|cheese|fromage/],
    ['huevo','🥚',{es:'Huevo',en:'Egg',fr:'Œuf'},/huevo|\beggs?\b|\boeufs?\b/],
    ['frutos','🌰',{es:'Frutos secos',en:'Tree nuts',fr:'Fruits à coque'},/fruto.? seco|nuez|nuece|almendra|avellana|anacardo|pistach|\bnuts?\b|walnut|almond|hazelnut|cashew|\bnoix|amande|noisette|fruits? a coque/],
    ['pescado','🐟',{es:'Pescado',en:'Fish',fr:'Poisson'},/pescado|\bfish|poisson/],
    ['marisco','🦐',{es:'Marisco',en:'Shellfish',fr:'Fruits de mer'},/marisco|crustace|molusc|gamba|langostino|shellfish|shrimp|prawn|fruits de mer/],
    ['soja','🫘',{es:'Soja',en:'Soy',fr:'Soja'},/soja|\bsoy|tofu/],
    ['sesamo','⚪',{es:'Sésamo',en:'Sesame',fr:'Sésame'},/sesam/],
    ['apio','🥬',{es:'Apio',en:'Celery',fr:'Céleri'},/\bapio\b|celery|celeri/],
    ['mostaza','🟡',{es:'Mostaza',en:'Mustard',fr:'Moutarde'},/mostaza|mustard|moutarde/]];
  const fold=s=>String(s||'').toLowerCase().replace(/\u0153/g,'oe').replace(/\u00e6/g,'ae').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  /* Trocea lo escrito: «sin carne, setas y picante» → ['carne','setas','picante'] */
  function tokens(text){
    const out=[];
    fold(text).split(/[,;\/\n·]+|\s+(?:y|e|and|et|o|or|ou)\s+/).forEach(raw=>{
      const tok=raw.replace(/^(soy |je suis |i am |i'm )/,'').replace(/^(sin|no|pas de|sans|without|alergi[ac]o?s? (a|al|a la|a los|a las)|allergi[ce]s? (a|to|au|aux)?|intoleran\w* (a|al|a la|to|au)?|al|a la|el|la|los|las)\s+/,'')
        .replace(/^(a|al|a la|a los|a las)\s+/,'').replace(/^(soy |je suis |i am |i'm )/,'').trim();
      if(tok.length>=3&&out.indexOf(tok)<0)out.push(tok);
    });
    return out;
  }
  function parse(text){
    const ids=[],words=[];
    tokens(text).forEach(tok=>{
      const hit=SYN.find(x=>x[3].test(tok));
      if(hit){if(ids.indexOf(hit[0])<0)ids.push(hit[0]);}
      else if(words.indexOf(tok)<0)words.push(tok);
    });
    return {ids,words};
  }
  function label(id,lang){const x=SYN.find(y=>y[0]===id);return x?x[1]+' '+(x[2][lang]||x[2].es):id;}
  function fromIds(ids,lang){return (ids||[]).map(id=>{const x=SYN.find(y=>y[0]===id);return x?(x[2][lang]||x[2].es):id;}).join(', ');}
  window.QUICO_ALLERGY={parse,tokens,label,fromIds,fold};
})();
