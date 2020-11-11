const express = require('express');
const app = express();
const bodyParser = require('body-parser'); //요청값 처리 라이브러리
app.use(bodyParser.urlencoded({extended: true})) // 요청값



const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mrcau:998877@cluster0.gxgfo.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri);

let db;
let collection;
client.connect(err => {
  err&& console.log(err);
  db=client.db('todoapp');
  collection = client.db("todoapp").collection("post");
  app.listen(8080,()=>{console.log('hi8080')});

});


app.get('/list',(req,res) => {
  res.sendFile(__dirname+'/list.html')
})

app.get('/write',(req,res) => {
  res.sendFile(__dirname+'/write.html')
})

app.get('/',(req,res) => {
  res.sendFile(__dirname+'/index.html');})
let id=0;
app.post('/add', function(req, res){
    collection.insertOne({_id:id,제목:req.body.title,날짜:req.body.date},() => {
      console.log(req.body);
      res.send('전송완료');
      id++;

    })
  });