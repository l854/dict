import requests
import re
import pymongo
cli = pymongo.MongoClient('mongodb://localhost:27017')
coll = cli.test.txt
coky = cli.test.key
def fetchSentences(w):
    x1=re.compile('<div class="sen_en">(.*?)</div>')
    x2=re.compile('<div class="sen_cn">(.*?)</div>')
    k=0
    b1=x1.search(t)
    b2=x2.search(t)
    while b1 and b2:
        k=max(b1.end(1),b2.end(1))
        c1=re.sub('<.*?>','',b1.group(1))
        c2=re.sub('<.*?>','',b2.group(1))
        coll.insert_one({'key':w,'en':c1,'zh':c2,'visit':0})
        b1=x1.search(t,k+1)
        b2=x2.search(t,k+1)
f = open('words','r')
ws = f.readlines()
f.close()
#ws = ['conspicuous','allusion','sagacious']
for w in ws:
    try:
        w=w[0:-1]
        r=requests.get('https://cn.bing.com/dict/search?q='+w+'&go=Search&qs=ds&form=Z9LH5')
        t=r.text
        x=re.search('<div class="li_sen" id="newLeId">(.*?)</div></div><div id="crossid"',t).group(1)
        coky.insert_one({'key':w,'se_lis':'<div class="li_sen" id="newLeId">'+x+'</div>','visit':0})
        fetchSentences(w)
    except Exception as ex:
        print(w,ex)
