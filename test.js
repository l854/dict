m = require('mongodb').MongoClient;
m.connect('mongodb://localhost:27017/',{useUnifiedTopology:true},
   function(err,db){
      if(err) throw err;
      var dbn=db.db('test');
      dbn.collection('key').findOneAndUpdate(
         {'key':'quintessence'},
         {$inc:{'visit':1}},
         {'visit':1},
         function(err,t){
            //if(t) console.log(t);
         });
      dbn.collection('key').findOne(
         {'key':'quintessence'},{'visit':1},
         function(err,t){
            if(t) console.log(t);
         });
      console.log('started');
   });
