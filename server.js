const express = require('express');
const app = express();
const bodyParser = require('body-parser'); //요청값 처리 라이브러리
app.use(bodyParser.urlencoded({extended: true})) // 요청값
app.set('view engine','ejs');//view engine 으로 ejs(서버데이터 사용가능) 로 쓰겠습니다.
app.use('/public', express.static('public')); // public 폴더를 쓰겠다는 선언

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mrcau:998877@cluster0.gxgfo.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri,{ useNewUrlParser: true, useUnifiedTopology: true });

let db;
let post;
let ic;
let counter;
let num ;
client.connect(err => {
  err && console.log(err);
  db=client.db('todoapp');
  post = client.db("todoapp").collection("post");
  counter = client.db("todoapp").collection("counter");
  app.listen(8080,()=>{console.log('hi8080')});
});


app.get('/list',(req,res) => {
  post.find().toArray((err,result) => {
    console.log('list는 : '+ result);
    res.render('list.ejs',{result:result});
  });
})

app.get('/write',(req,res) => {
  res.render('write.ejs');
})

app.get('/',(req,res) => {
  res.render('index.ejs');})

app.post('/add', function(req, res){
    // counter.find().toArray((err,result) => {num = result[0].totalNumber;});
    counter.findOne({name:'counting'},(err,result) => {
      num = result.totalNumber;
      console.log(num);     
      
        post.insertOne({_id:num + 1,제목:req.body.title,날짜:req.body.date},(err,result) => {
        console.log('요청값은? '+ req.body);

          counter.updateOne({name:'counting'},{ $inc: {totalNumber:1} },(err,result) => {
          err && console.log(err);
          res.render('list.ejs');
         });         
      });
    });
  });

  
  
  app.delete('/delete',(req,res) => {
    console.log(req.body);
    const deletItem = parseInt(req.body._id);
    
    post.deleteOne({_id:deletItem},(err,result) => {
      err && console.log(err);
      console.log(deletItem);
      console.log('삭제완료');
      res.status(200).send({message:'성공했습니다'});
    })
  })

  app.get('/detail/:id',(req,res) => {
    post.findOne({_id :parseInt(req.params.id)},(err,result) => {
      res.render('detail.ejs',{idData:result});
      console.log(result);
      err && console.log(err);
    })
  })