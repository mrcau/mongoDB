const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}))



const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mrcau:998877@cluster0.gxgfo.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

let db;
client.connect(err => {
   err&& console.log(err);
  
  db=client.db('todoapp');
  const collection = client.db("todoapp").collection("post");
  collection.insertOne({_id:4, 이름:'kim', 나이:44}, (err,rst) => {
    console.log('save');
  });

  app.listen(8080,()=>{
    console.log('hi8080');
  });
});


app.get('/babo',(req,res) => {
  res.send('바보바보')
})

app.get('/write',(req,res) => {
  res.sendFile(__dirname+'/write.html')
})

app.get('/',(req,res) => {
  res.sendFile(__dirname+'/index.html');})

app.post('/add', function(req, res){
    console.log(req.body.title);
    res.send('전송완료')
  });