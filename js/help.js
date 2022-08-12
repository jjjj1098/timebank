require('dotenv').config();
const express = require('express');
const nunjucks = require('nunjucks');
const app = express();
const port = process.env.SERVER_PORT || 3000; 
const mysql = require('mysql');
const bodyParser = require('body-parser');
const {response} = require('express');
const response = require('express');
// const router = express.Router();

nunjucks.configure('views', {
    express:app
});

// app.use("/",function(req,res,next) {
// 	res.writeHead("200", {"Content-Type":"text/html;charset=utf-8"});
// 	res.end('http://localhost:3000/writedone'); 
// 	//res.write로 길게 안쓰고 res.end에 간결하게 보내줌 			
// });

// app.set("port",process.env.PORT || 3000);
//var http = require('http');
//var server = http.createServer(app).listen(80);
//console.log("server is running...")

//mysql 접속 정보
//var mysql = require('mysql');
const request = require('request');

// app.use('/', router)
app.use(bodyParser.urlencoded({extended:false}));
app.set('view engine', 'html');
app.use(express.static('public'));
app.use(bodyParser.json());

let connection = mysql.createConnection({
  //host: '127.0.0.1',
  host: 'localhost',
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
  connection.query("select idx, name, age, gender, title, content, address, date_format(today, '%H:%m %m-%d-%Y ') as today, hit from board", (error,results)=>{
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

//<<<<<<< HEAD
app.post('http://localhost:3000/writedone',function(request,response){
//=======
app.post('https://yatimebank.netlify.app/writedone',function(request,response){
//>>>>>>> 222f32d79851fb0ca989b846cc927aa8053bb8f1
    const name = request.body.name;
    const age = request.body.age;
    const gender = request.body.gender;
    const title = request.body.title;
    const content = request.body.content;
    const address = request.body.address;
    console.log(request.body);

    const sql = "INSERT INTO HELP (name, age, gender,title, content, address) VALUES (?,?,?,?,?,?)";
    const params = [name, age, gender, title, content, address];
    connection.query(sql,params,function(err,result){
         if(err){
           console.log(err);
        }else{
//<<<<<<< HEAD
         console.log(result);
       }
    });
    response.write("<h1>글 작성이 완료되었습니다.</h1>");
     response.write("<br/><br/><a href='view.html'>작성글 보러가기</a>"); 
     response.end(); 
  });
//=======
          console.log(result);
          response.end(); 
});
      
//>>>>>>> 222f32d79851fb0ca989b846cc927aa8053bb8f1
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