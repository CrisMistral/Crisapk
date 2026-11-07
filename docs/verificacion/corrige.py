"""Aplica correcciones a fichas: corrige.py cambios.json  → {nombre:{campo:valor}} (campos: nac, muerte, aprox, lugar, corriente, desc)"""
import json,re,sys
p='/home/user/Crisapk/filosofas/index.html';s=open(p).read()
C=json.load(open(sys.argv[1]))
idx={'nac':1,'muerte':2,'aprox':3,'lugar':4,'corriente':5,'tags':6,'desc':7,'peso':8}
for n,cambios in C.items():
    m=re.search(r'^\["'+re.escape(n)+r'", .*\],?$',s,re.M)
    assert m,n
    line=m.group(0);coma=line.endswith(',')
    r=json.loads(line.rstrip(','))
    for k,v in cambios.items(): r[idx[k]]=v
    nl=json.dumps(r,ensure_ascii=False)+(',' if coma else '')
    s=s.replace(line,nl);print('ok',n)
open(p,'w').write(s)
