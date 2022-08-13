require('dotenv').config();
const express = require('express');
const nunjucks = require('nunjucks');
const app = express();
// const port = process.env.SERVER_PORT || 3000; 
const mysql = require('mysql');
const bodyParser = require('body-parser');
// const {response} = require('express');
// const error = require('response');
//const response = require('express');
// var router = express.Router();
var path = require('path');

nunjucks.configure('views', {
    express:app,
    watch: true,
});

var http = require('http');
//var server = http.createServer(app).listen(80);
//console.log("server is running...")

//mysql 접속 정보
//var mysql = require('mysql');
//const request = require('request');

// app.use('/', router)
app.use(bodyParser.urlencoded({extended:false}));
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));

let connection = mysql.createConnection({
  //host: '127.0.0.1',
  host: 'localhost',
  user:'root',
  port:'3306',
  password: '10301030',
  database: 'helplist',
});

//mysql 접속하기
connection.connect();

app.get('/',function(request,response){
  response.render('index.html');
})

app.get('/board',function(request,response){ //methos가 get일 때, uri값이 list일 때 아래 함수를 실행
//   connection.query("select idx, name, age, gender, title, content, address, date_format(today, '%H:%m %m-%d-%Y ') as today, hit from board", (error,results)=>{
    connection.query("select *, @idx:=@idx+1 as idx2, date_format(today, '%H:%m %m-%d-%Y ') as today, hit from board, (select @idx:=0)A", (error,results)=>{
    if(error){
        console.log(error);
    }else{
        console.log(results);
        response.render('board.html',{
            help_db:results
        })
    }
})
})

app.post('/writedone',function(request,response){
    const name = request.body.name;
    const age = request.body.age;
    const gender = request.body.gender;
    const title = request.body.title;
    const content = request.body.content;
    const address = request.body.address;
    console.log(request.body);

    const sql = "INSERT INTO HELP (name, age, gender,title, content, address) VALUES (?,?,?,?,?,?)";
    const params = [name, age, gender, title, content, address];
    connection.query(sql,params,(error)=>{
         if(error){
           console.log(error);
        }else{
         //console.log(result);
         //response.end();
         response.writeHead(302, {location:'http://127.0.0.1:3000/view.html'});
         response.end();
       }
    })
    //console.log(window.test);
    // if (window.location='http://localhost:3000/writedone'){
    // window.location.href='http://localhost:3000/view';
    // } 
    //return response.redirect("/view"); 
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
  let address = request.body.address;
  let sql = "update help set name='${name}', age='${age}', gender='${gender}', title='${title}', content='${content}', address='${address}', today=now() where idx='${idx}'";

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

// module.exports=app;