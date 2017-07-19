//module dependencies
var express = require('express'); //從local取得express
var routes = require('./routes'); //等同於"./routes/index.js"，指定路徑返回內容，相當於MVC中的Controller
var http = require('http');
var path = require('path');
var app = express();
var partials = require('express-partials');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/microblog');

// Allow router to access db
app.use(function(req,res,next){
    req.db = db;
    next();
});

//預設port號 3000，所以執行的URL為 http://localhost:3000
app.set('port', process.env.PORT || 3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(partials());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());//解析client端請求，通常是透過POST發送的內容
app.use(express.cookieParser('123456789'));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

//routes
app.get('/', routes.index);
app.get('/u/:user', routes.user);
app.post('/post', routes.post);
app.get('/reg', routes.reg);
app.post('/reg', routes.doReg);
app.get('/login', routes.login);
app.post('/login', routes.doLogin);
app.get('/logout', routes.logout );

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render( 'error', {
    title : 'Error',
    loginStatus : false
  });
});

http.createServer(app).listen(app.get('port'), function( req, res ){ 
	console.log('Express server listening on port ' + app.get('port'));
});
