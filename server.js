const express = require('express');
const app = express();
app.set('view engine', 'ejs');//view engine 으로 ejs(서버데이터 사용가능) 로 쓰겠습니다.
app.use('/public', express.static('public')); // public 폴더를 쓰겠다는 선언
//몽고DB 라이브러리
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mrcau:998877@cluster0.gxgfo.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// PUT,DELETE 사용 미들웨어
const methodOverride = require('method-override')
app.use(methodOverride('_method'));
//요청값 처리 라이브러리
const bodyParser = require('body-parser'); 
app.use(bodyParser.urlencoded({ extended: true })); // 요청값
//로그인 기능 미들웨어
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
app.use(session({secret: '비밀코드', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
//이미지 업로드 세팅
let multer = require('multer'); multer //설치한거 갖다쓰겠습니다~ 라는 뜻
var storage = multer.diskStorage({
  destination : function(req, file, cb){
    cb(null, './public/img')
  },
  filename : function(req, file, cb){
    cb(null, file.originalname )
  }
});
var upload = multer({storage : storage});

//DB변수 세팅
let db;
let post;
let ic;
let counter;
let num;
client.connect(err => {
  err && console.log(err);
  db = client.db('todoapp');
  post = client.db("todoapp").collection("post");
  counter = client.db("todoapp").collection("counter");
  app.listen(8080, () => { console.log('hi8080') });
});


app.get('/list', (req, res) => {
  post.find().toArray((err, result) => {
    res.render('list.ejs',{result:result});
  });
})

app.get('/write', (req, res) => {
  res.render('write.ejs');
})

app.get('/', (req, res) => {
  res.render('index.ejs');
})

app.post('/add', upload.single('load'),function (req, res) {
  counter.findOne({ name: 'counting' }, (err, result) => {
    num = result.totalNumber;

    post.insertOne({ _id: num + 1, 제목: req.body.title, 날짜: req.body.date }, (err, result) => {
      counter.updateOne({ name: 'counting' }, { $inc: { totalNumber: 1 } }, (err, result) => {
        err && console.log(err);
        res.redirect('/list');
      });
    });
  });
});

app.put('/edit',(req,res) => {
  const upID= parseInt(req.body.id);
  post.updateOne({_id:upID},{$set:{제목:req.body.title,날짜:req.body.date}},() => {
    console.log('수정완료');
		res.redirect('/list');
  })
})

app.get('/edit/:id', (req, res) => {
  const editItem = parseInt(req.params.id);
  post.findOne({ _id: editItem }, (err, result) => {
    res.render('edit.ejs', { result: result })
    err && res.send('게시물 없습니다');
  })
})

app.delete('/delete', (req, res) => {
  console.log(req.body);
  const deletItem = parseInt(req.body._id);

  post.deleteOne({ _id: deletItem }, (err, result) => {
    err && console.log(err);
    console.log(deletItem);
    console.log('삭제완료');
    res.status(200).send({ message: '성공했습니다' });
  })
})

  app.get('/detail/:id',(req,res) => {
    post.findOne({_id :parseInt(req.params.id)},(err,result) => {
      res.render('detail.ejs',{result:result});
      console.log(result);
      err && console.log(err);
    })
  })
