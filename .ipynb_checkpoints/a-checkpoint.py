{
 "cells": [
  {
   "cell_type": "code",
   "execution_count": 1,
   "metadata": {},
   "outputs": [],
   "source": [
    "import requests\n",
    "import re\n",
    "import pymongo"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 2,
   "metadata": {},
   "outputs": [],
   "source": [
    "cli = pymongo.MongoClient('mongodb://localhost:27017')\n",
    "coll = cli.test.txt\n",
    "coky = cli.test.key"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 3,
   "metadata": {},
   "outputs": [],
   "source": [
    "def fetchSentences(w):\n",
    "    x1=re.compile('<div class=\"sen_en\">(.*?)</div>')\n",
    "    x2=re.compile('<div class=\"sen_cn\">(.*?)</div>')\n",
    "    k=0\n",
    "    b1=x1.search(t)\n",
    "    b2=x2.search(t)\n",
    "    while b1 and b2:\n",
    "        k=max(b1.end(1),b2.end(1))\n",
    "        c1=re.sub('<.*?>','',b1.group(1))\n",
    "        c2=re.sub('<.*?>','',b2.group(1))\n",
    "        coll.insert_one({'key':w,'en':c1,'zh':c2,'visit':0})\n",
    "        b1=x1.search(t,k+1)\n",
    "        b2=x2.search(t,k+1)\n"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 9,
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "docility 'NoneType' object has no attribute 'group'\n",
      "be indulged by 'NoneType' object has no attribute 'group'\n",
      "uncongenial 'NoneType' object has no attribute 'group'\n",
      "be tinctured with 'NoneType' object has no attribute 'group'\n",
      "go about 'NoneType' object has no attribute 'group'\n",
      "instrumentality 'NoneType' object has no attribute 'group'\n",
      "haunts 'NoneType' object has no attribute 'group'\n",
      "at any 'NoneType' object has no attribute 'group'\n",
      "not a little 'NoneType' object has no attribute 'group'\n",
      "inflict on 'NoneType' object has no attribute 'group'\n",
      "quivered 'NoneType' object has no attribute 'group'\n",
      "quenched 'NoneType' object has no attribute 'group'\n",
      "quelled 'NoneType' object has no attribute 'group'\n",
      "transgression 'NoneType' object has no attribute 'group'\n",
      "serenity 'NoneType' object has no attribute 'group'\n",
      "reclusive 'NoneType' object has no attribute 'group'\n",
      "prudently 'NoneType' object has no attribute 'group'\n",
      "hysterically 'NoneType' object has no attribute 'group'\n",
      "deprived of 'NoneType' object has no attribute 'group'\n",
      "ascribe 'NoneType' object has no attribute 'group'\n",
      "tremors 'NoneType' object has no attribute 'group'\n",
      "tumors 'NoneType' object has no attribute 'group'\n",
      "abstains 'NoneType' object has no attribute 'group'\n",
      "rouses 'NoneType' object has no attribute 'group'\n",
      "cattails 'NoneType' object has no attribute 'group'\n",
      "tamarack 'NoneType' object has no attribute 'group'\n",
      "invertebrates 'NoneType' object has no attribute 'group'\n",
      "crustaceans 'NoneType' object has no attribute 'group'\n",
      "mollusks 'NoneType' object has no attribute 'group'\n",
      "larvae 'NoneType' object has no attribute 'group'\n",
      "muskrats 'NoneType' object has no attribute 'group'\n",
      "otters 'NoneType' object has no attribute 'group'\n",
      "seatrout 'NoneType' object has no attribute 'group'\n",
      "egrets 'NoneType' object has no attribute 'group'\n",
      "stagnated 'NoneType' object has no attribute 'group'\n"
     ]
    }
   ],
   "source": [
    "f = open('words','r')\n",
    "ws = f.readlines()\n",
    "f.close()\n",
    "#ws = ['conspicuous','allusion','sagacious']\n",
    "for w in ws:\n",
    "    try:\n",
    "        w=w[0:-1]\n",
    "        r=requests.get('https://cn.bing.com/dict/search?q='+w+'&go=Search&qs=ds&form=Z9LH5')\n",
    "        t=r.text\n",
    "        x=re.search('<div class=\"li_sen\" id=\"newLeId\">(.*?)</div></div><div id=\"crossid\"',t).group(1)\n",
    "        coky.insert_one({'key':w,'se_lis':'<div class=\"li_sen\" id=\"newLeId\">'+x+'</div>','visit':0})\n",
    "        fetchSentences(w)\n",
    "    except Exception as ex:\n",
    "        print(w,ex)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 5,
   "metadata": {},
   "outputs": [],
   "source": [
    "\n"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 6,
   "metadata": {},
   "outputs": [
    {
     "data": {
      "text/plain": [
       "<pymongo.results.InsertOneResult at 0x7f264f1611c8>"
      ]
     },
     "execution_count": 6,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    "import pymongo\n",
    "cli = pymongo.MongoClient('mongodb://localhost:27017/test')\n",
    "db = cli.test\n",
    "coll = db.st\n",
    "student = {\n",
    "    'id':123,\n",
    "    'name':'good'\n",
    "}\n",
    "coll.insert_one(student)"
   ]
  },
  {
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "342326195902051011   006686  1991.07  1998.09"
   ]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3",
   "language": "python",
   "name": "python3"
  },
  "language_info": {
   "codemirror_mode": {
    "name": "ipython",
    "version": 3
   },
   "file_extension": ".py",
   "mimetype": "text/x-python",
   "name": "python",
   "nbconvert_exporter": "python",
   "pygments_lexer": "ipython3",
   "version": "3.6.0"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 2
}
