var express = require('express'),
	routes = require('./routes'),
	http = require('http'),
	path = require('path'),
	MongoStore = require('connect-mongo')(express),
	settings = require('./settings'),
	flash = require('connect-flash'),
	app = express(),
	ejs = require('ejs'),
	dot = require("dot-emc").__express;

// var flash = require('connect-flash');
// "socket.io": "*", //在线实时交流的一个插件
// gzip 
// app.use(express.compress());
// all environments

ejs.open = '{%';
ejs.close = '%}';

app.set('port', process.env.PORT || 3001);


// // 视图模板路径
// app.set('views', path.join(__dirname, 'views'));
// // 注册模板引擎, app.engine("后缀", require('模板引擎') );
// app.engine("def", dot);
// app.set('view engine', 'def'); // 模板文件



app.engine('.def', ejs.__express);
app.set('view engine', 'def');
app.set('views', __dirname + '/views');



// 注册模板引擎, app.engine("后缀", require('模板引擎') );
// app.engine("def", dot);
// app.set('view engine', 'def'); // 模板文件
// app.set('views', path.join(__dirname, 'views'));


app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
// 页面通知插件
// app.use(flash());
app.use(express.favicon());
// 纪录每一个请求
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
// 解析请求头里的Cookie, 并用cookie名字的键值对形式放在 req.cookies 你也可以通过传递一个secret 字符串激活签名了的cookie
app.use(express.cookieParser());
app.use(express.session({
	secret: settings.cookieSecret,
	key: settings.cookieSecret,//cookie name
	cookie: {
	maxAge: 1000 * 60 * 60 * 24 * 30
	},//30 days
	store: new MongoStore({
		db: settings.db
	})
}));

app.use(express.static(path.join(__dirname, '/public')));
app.use('/static',express.static(path.join(__dirname, '/static')));
app.use('/attachments',express.static(path.join(__dirname, '/attachments')));
app.use('/demos',express.static(path.join(__dirname, '/demos')));
// development only
if ('development' == app.get('env')) {
	app.locals.pretty = true
	app.use(express.errorHandler());
}

app.use(flash());
app.use(app.router);

app.configure('development', function(){
  app.use(express.errorHandler());
  app.locals.pretty = true;
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
routes(app);

