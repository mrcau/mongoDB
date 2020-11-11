const express = require('express');
const app = express();
const bodyParser = require('body-parser'); //요청값 처리 라이브러리
app.use(bodyParser.urlencoded({extended: true})) // 요청값
app.set('view engine','ejs');//view engine 으로 ejs(서버데이터 사용가능) 로 쓰겠습니다.


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mrcau:998877@cluster0.gxgfo.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri,{ useNewUrlParser: true, useUnifiedTopology: true });

let db;
let post;
client.connect(err => {
  err&& console.log(err);
  db=client.db('todoapp');
  post = client.db("todoapp").collection("post");
  app.listen(8080,()=>{console.log('hi8080')});

});


app.get('/list',(req,res) => {
  post.find().toArray((err,result) => {
    console.log(result);
    res.render('list.ejs',{result:result});
  });
})

app.get('/write',(req,res) => {
  res.sendFile(__dirname+'/write.html')
})

app.get('/',(req,res) => {
  res.sendFile(__dirname+'/index.html');})

app.post('/add', function(req, res){
    post.insertOne({_id:id,제목:req.body.title,날짜:req.body.date},() => {
      console.log(req.body);
      res.send('전송완료');
      id++;

    })
  });