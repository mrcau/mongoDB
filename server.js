const express = require('express');
const app = express();

app.listen(8080,()=>{
  console.log('hi8080');
});

app.get('/pet',(req,res) => {
  res.send('하이페이지');
})

app.get('/babo',(req,res) => {
  res.send('바보바보')
})

app.get('/chun',(req,res) => {
  res.send('천재천재')
})

app.get('/gut',(req,res) => {
  res.send('굿~! 굿~!')
})

app.get('/haha',(req,res) => {
  res.send('하하하하하하하핳하')
})


app.get('/',(req,res) => {
  res.sendFile(__dirname+'/index.html');})