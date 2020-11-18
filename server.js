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
//환경변수 env파일 사용
//require('dotenv'),config()
//몽고DB설정
let db;
let post;
let ic;
let counter;
let num;
let login;
client.connect(err => {
  err && console.log(err);
  db = client.db('todoapp');
  post = client.db("todoapp").collection("post");
  counter = client.db("todoapp").collection("counter");
  login = client.db("todoapp").collection("login");
  app.listen(8080, () => { console.log('hi8080') });
});

//리스트페이지 요청 처리
app.get('/list', (req, res) => {
  post.find().toArray((err, result) => {
    console.log('list는 : ' + result);
    res.render('list.ejs',{result:result});
  });
})

//글쓰기 페이지 요청처리
app.get('/write', (req, res) => {
  res.render('write.ejs');
})

//홈페이지 요청처리
app.get('/', (req, res) => {
  res.render('index.ejs');
})

//글추가 요청 처리
app.post('/add', function (req, res) {
  // counter.find().toArray((err,result) => {num = result[0].totalNumber;});
  counter.findOne({ name: 'counting' }, (err, result) => {
    num = result.totalNumber;
    console.log(num);

    post.insertOne({ _id: num + 1, 제목: req.body.title, 날짜: req.body.date }, (err, result) => {
      console.log('요청값은? ' + req.body);

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

  app.get('/login',(req,res) => {
    res.render('login.ejs');
  })

  app.post('/login',passport.authenticate('local',{
    failureRedirect:'/fail' //로그인 실패시 이동 경로
  }),(req,res) => {
    res.redirect('/')
  })

  app.get('/mypage',Login,(req,res) => {
    console.log(req.user);
    res.render('mypage.ejs',{사용자:req.user})
  })

  function Login(req,res,next){
    if(req.user){
      next()
      }else{
        res.send('로그인을 해주세요.')
      }

  }

  //인증방식
  passport.use(new LocalStrategy({
    usernameField: 'id', //사용자가 제출한 아이디가 어디 적혔는지 <input>의 name 속성값
    passwordField: 'pw', //사용자가 제출한 비번이 어디 적혔는지 <input>의 name 속성값
    session: true,  //요기는 세션을 만들건지
    passReqToCallback: false, //아이디/비번말고 다른 정보검사가 필요한지(파라미터.body출력)
  }, function (id, pw, done) {
    console.log(id, pw);
    login.findOne({id:id}, function (err, result) {
      if (err) return done(err)
  
      if (!result) return done(null, false, { message: '존재하지않는 아이디요' })
      if (pw == result.pw) {
        return done(null, result)
      } else {
        return done(null, false, { message: '비번틀렸어요' })
      }
    })
  }));

  //로그인 성고시 세션 데이터 만들어 유지하기
  passport.serializeUser(function (user, done) {
    done(null, user.id)
  }); // 세션만들어 저장
  
  passport.deserializeUser(function (id, done) {
    //DB에서 위에 있는 user.id 로 유저를 찾은뒤에 유저 정보를 밑{}안에 넣음
    login.findOne({id:id},(err,result) => {
      done(null,result)
    })
    
  }); // 세션있으면 어떤 사람인지 해석