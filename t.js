var http=require('http')
http.get('http://cn.bing.com/dict/search?q=orange',(r)=>{
   var h=''
   r.on('data',(d)=>{h+=d;});
   r.on('end',()=>{
      x=/<script.*?>(.*?)<\/script>/g
      x1=/<div class="sen_en">(.*?)<\/div>/g
      x2=/<div class="sen_cn">(.*?)<\/div>/g
      ky=/<div class="li_sen" id="newLeId">(.*?)<\/div><\/div><div id="crossid"/
      se=ky.exec(h);
      var c1,c2;
      while((c1=x1.exec(h)) && (c2=x2.exec(h))){
         en=c1[1].replace(/<.*?>/g,'');
         zh=c2[1].replace(/<.*?>/g,'');
         console.log('------');
      }
   });
});
