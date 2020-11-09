const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}))

app.listen(8080,()=>{
  console.log('hi8080');
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
    console.log(req.body);
    res.send('전송완료')
  });