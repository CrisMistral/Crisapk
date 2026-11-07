import json,re,sys,urllib.parse
import os; S=os.path.dirname(os.path.abspath(__file__))+'/'
import os
APP=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','filosofas','app.js')  # datos de las fichas
s=open(APP).read()
D=json.loads(re.search(r'const D=(\[[\s\S]*?\n\]);',s).group(1))
W=json.loads(re.search(r'const WIKI=(\{.*?\});',s).group(1))
W.update({"Gerda Walther":"de:Gerda Walther","Karaikkal Ammaiyar":"Karaikkal Ammaiyar","Janet Wolff":"en:Janet Wolff","Sulabha":"en:Sulabha","Elizabeth Spelman":"en:Elizabeth V. Spelman","Jane Bennett":"en:Jane Bennett (political theorist)"})
E=json.load(open(S+'estado.json'))
hechas=set(E['revisadas'])
EUR=re.compile(r'Europa',re.I)
def prio(r):
    b=r[1] if isinstance(r[1],int) else 2000
    return (0 if b<1450 else 1 if b<1800 else 2, b)
pend=[r for r in D if r[0] not in hechas]
pend.sort(key=prio)
n=int(sys.argv[1]) if len(sys.argv)>1 else 20
for r in pend[:n]:
    t=W.get(r[0])
    if t:
        m=re.match(r'^(en|de|fr):(.*)$',t);l,x=(m.group(1),m.group(2)) if m else ('es',t)
        u=f'https://{l}.wikipedia.org/wiki/'+urllib.parse.quote(x.replace(' ','_'))
    else: u='(sin artículo: buscar en es/en.wikipedia)'
    fe=f"{r[1]}–{'' if r[2] is None else r[2]}"+(' (año de su obra clave)' if r[3]==2 else ' (aprox.)' if r[3]==1 else '')
    print(f"- {r[0]} | {fe} | {r[4]} | {r[5]} | «{r[7]}» | {u}")
print('pendientes',len(pend),file=sys.stderr)
