var express = require('express');
var http=require('http')
var path = require('path')
var app = express();
var mc = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
var url = "mongodb://localhost:27017/"
app.use(express.static(path.join(__dirname,'public')))
mc.connect(url, {useUnifiedTopology:true},function(err, db){
	if (err) throw err;
	var dbn=db.db("test");
   app.get('/upload', function(req, res){
      var d=req.query.dt;
      var ckey=dbn.collection("key");
      var ctxt=dbn.collection("txt");
      ckey.find({'key':d}).count().then(c=>{
         if(c>0){
            ckey.findOne({'key':d},(er,r)=>{
               try{
                  res.send(r.se_lis);
               } catch(err){
                  res.send(err.message);
               }
            });
         } else {
            http.get('http://cn.bing.com/dict/search?q='+d,(r)=>{
               var h=''
               r.on('data',(d)=>{h+=d;});
               r.on('end',()=>{
                  try{
                     x=/<script.*?>(.*?)<\/script>/g
                     x1=/<div class="sen_en">(.*?)<\/div>/g
                     x2=/<div class="sen_cn">(.*?)<\/div>/g
                     ky=/<div class="li_sen" id="newLeId">(.*?)<\/div><\/div><div id="crossid"/
                     se=ky.exec(h);
                     ckey.insertOne({'key':d,
                     'se_lis':'<div class="li_sen" id="newLeId">'+se+'</div>',
                     'visit':0});
                     var c1,c2;
                     while((c1=x1.exec(h)) && (c2=x2.exec(h))){
                        en=c1[1].replace(/<.*?>/g,'');
                        zh=c2[1].replace(/<.*?>/g,'');
                        ctxt.insertOne({'key':d,'en':en,'zh':zh,'visit':0});
                     }
                     res.send(se);
                  } catch(err){
                     console.log('UPLOAD ERR: '+err.message);
                     res.send(err.message);
                  }
               });
            });
         }
      });
   });
	app.get('/pick', function(req, res){
		dbn.collection("key")
		.find().sort({"visit":1}).limit(1)
		.each(function(err,t){
			if (err) throw err;
			res.end(JSON.stringify(t));
		});
	});
	app.get('/set', function(req, res){
      var dt = new Date();
      try {
         cs=JSON.parse(req.query.s);
         ks=[]
         for(let c of cs){
            c.time=dt.getTime();
            ks.push(c.key);
         }
         dbn.collection('work').insertMany(cs);
         dbn.collection('key').updateMany(
            {'key':{$in:ks}},
            {$inc:{'visit':-10000}}
         );
         res.end('');
      } catch(err) {
         console.log('SET: '+err.message);
         res.end('');
      }
   });
   app.get('/list', function(req, res){
      try {
         dbn.collection('key')
         .find({}).project({key:1}).toArray(function(err, t){
            res.end(JSON.stringify(t));
         });
         dbn.collection('key').updateMany(
            {'visit':{$lt:0}},
            {$inc:{'visit':10000}}
         );
      } catch(err) {
         console.log('LIST: '+err.message);
         res.end('');
      }
   });
   app.get('/read', function(req, res){
      try {
         dbn.collection('key').find({'visit':{$lt:0}}).toArray(function(err,t){
            res.end(JSON.stringify(t));
         });
      } catch(err) {
         console.log('READ: '+err.message);
         res.end('');
      }
   });
	app.get('/next', function(req,res){
		var q=req.query.q;
		var n=req.query.v;
		var id = ObjectId(q);
		var ckey = dbn.collection("key");
      try {
         ckey.updateOne({"_id":id},{$inc:{"visit":parseInt(n)}});
         console.log(q+'='+n);
      } catch(err) {
         console.log('nextERR: '+err.message);
      }
      finally{
         res.end('');
      }
   });
	app.get('/ex', function(req, res){
		var q=req.query.q;
		try{
         dbn.collection('txt').findOneAndUpdate(
         {'key':q},
         {$inc:{'visit':1}},
         {sort:{'visit':1}},
         function(err,t){
            if(t)
               res.end(JSON.stringify(t.value));
            else
               res.end("{'key':'null','se_lis':'error'}");
         });
      } catch(err){
         console.log('ERR:'+err.message);
         res.end("{'key':'null','se_lis':'"+err.message+"'}");
      }
	});
});
var server = app.listen(8081, function(){
	console.log('server started');
});
