require('dotenv').config();
const express = require('express');
const nunjucks = require('nunjucks');
const app = express();
const port = process.env.SERVER_PORT || 3000; 
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { response } = require('express');

nunjucks.configure('views', {
    express:app,
});

//var http = require('http');
//var server = http.createServer(app).listen(80);
//console.log("server is running...")

//mysql 접속 정보
//var mysql = require('mysql');
//var request = require('request');

app.use(bodyParser.urlencoded({extended:false}));
app.set('view engine', 'html');
app.use(express.static('public'));

let connection = mysql.createConnection({
  host: '127.0.0.1',
  user:'root',
  password: '10301030',
  database: 'helplist',
});

//mysql 접속하기
connection.connect();

app.get('/',(request,response)=>{
  response.render('index.html')
});

app.get('/list',(request,response)=>{ //methos가 get일 때, uri값이 list일 때 아래 함수를 실행
  connection.query("select idx, name, age, gender, title, content, date_format(today, '%H:%m %m-%d-%Y ') as today, hit from board", (error,results)=>{
    if(error){
        console.log(error);
    }else{
        console.log(results);
        response.render('list.html',{
            help_db:results,
        })
    }
})
})

app.post('/writedone',function(request,response){
    var name=request.body.name;
    var age=request.body.age;
    var gender=request.body.gender;
    var title=request.body.title;
    var content=request.body.content;
  
    var sql = "INSERT INTO HELP (name, age, gender,title, content,today) VALUES (?,?,?,?,?,?)";
    var params = [name, age, gender, title, content, now()];
    connection.query(sql,params,function(err){
        if(error){
          console.log(error);
        }else{
          console.log(results);
          res.redirect('/board');
          response.end();
        }
        connection.end();
    });
});
//------------------ V I E W -------------------//

app.get('/list_view',(request,response)=>{
  let idx = request.query.idx;
  console.log(request.query);
  
  connection.query("select * from help where idx='${idx}'",(error,results)=>{
      if(error){
          console.log(error)
      }else{
          console.log(results)
          response.render('list_view.html',{
              view_db:results[0],
          });
      };
  });

  connection.query(`update help set hit=hit+1 where idx='${idx}'`);
  
})
app.get('/modify',(request,response)=>{

  let idx=request.query.idx;

  connection.query(`select * from help where idx=${idx}`,(error,results)=>{
      if(error){
          console.log(error)
      }else{
          console.log(results);
          response.render('list_modify.html',{
              modify_db:results[0],
          });
      };
  });
});

app.post('/modifydone',(request,response)=>{
  let idx = request.body.idx;
  console.log(request.body);
  let name=request.body.name;
  let age=request.body.age;
  let gender=request.body.gender;
  let title=request.body.title;
  let content=request.body.content;
  let sql = "update help set name='${name}', age='${age}', gender='${gender}', title='${title}', content='${content}', today=now() where idx='${idx}'";

  connection.query(sql,(error,results)=> {
      if(error){
          console.log(error);
      }else{
          console.log(results);
          response.redirect('list.html');
      };
  });
});

app.get('/delete',(request,response)=>{
    
  let idx=request.query.idx;
  let sql=`delete from help where idx='${idx}'`;
  connection.query(sql,(error,results)=>{
      if(error){
          console.log(error);
      }else{
          response.redirect('list.html');
      };
  });
});

app.listen(3000,()=>{
  console.log('server start port : 3000')
});