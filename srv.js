var express = require('express');
var path = require('path')
var app = express();
var mc = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
var url = "mongodb://localhost:27017/"
app.use(express.static(path.join(__dirname,'public')))
mc.connect(url, {useUnifiedTopology:true},function(err, db){
	if (err) throw err;
	var dbn=db.db("test");
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
         dbn.collection('work')
         .insertMany(cs);
         dbn.collection('key').updateMany(
            {'key':{$in:ks}},
            {$inc:{'visit':-10000}}
         );
         res.end('');
      } catch(err) {
         console.log('SET: '+err.message);
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
      }
   });
   app.get('/read', function(req, res){
      try {
         dbn.collection('key').find({'visit':{$lt:0}}).toArray(function(err,t){
            res.end(JSON.stringify(t));
         });
      } catch(err) {
         console.log('READ: '+err.message);
      }
   });
	app.get('/next', function(req,res){
		var q=req.query.q;
		var n=req.query.v;
		var id = ObjectId(q);
		var ckey = dbn.collection("key");
		ckey.find({"_id":id}).each(function(err, t){
			try {
				console.log(t);
				ckey.updateOne({"_id":id},{$set:{"visit":t.visit+parseInt(n)}});
			} catch(err) {
				console.log('nextERR: '+err.message);
			}
		});
	});
	app.get('/ex', function(req, res){
		var q=req.query.q;
		if(q == undefined){
			res.end('')
		}
		try{
			db.db("test").collection("txt")
			.find({"key":q}).sort({"visit":1}).limit(1)
			.each(function(err,t){
				if(err) throw err;
				try{
					db.db("test").collection("txt")
					.updateOne({"_id":ObjectId(t._id)},{$set:{'visit':t.visit+1}});
					res.end(JSON.stringify(t));
				} catch(err){
					console.log('ERR:'+err.message);
				}
			});
		}
		catch(err){
			console.log('ERR: '+err.message);
		}
	});
});
var server = app.listen(8081, function(){
	console.log('server started');
});
