var path          = require('path');
var ObjectID      = require('mongodb').ObjectID;
var User          = require('../modules/user');
var department    = require('../modules/department');
var projectModel  = require('../modules/project');
var docsModel     = require('../modules/docs');
var categoryModel = require('../modules/category');
// var flash = require('connect-flash');

var fs = require('fs'),
    stdin = process.stdin,
    stdout = process.stdout;
var stats = [];
var userPath = process.cwd() + '/static';

var crypto = require('crypto');

module.exports = function(app){
	

	var userPath = process.cwd() + '/static';

	var departmentData = {};
	var projecrData = {};
	function loadDirectory ( dir, callback ) {
		fs.readdir( dir, function(err, files) {
			var i = 0, len = files.length;
			// for( ; i < len; i++ ) {
				callback&&callback(files)
				// loadFile( files[ i ] )
			// }
		});
	}
	function loadFile ( file ) {
		fs.stat( userPath + '/' + files[k], function(err, stat) {
			console.log( process.cwd()+ '/' + files[k] )
			console.log(stat.isDirectory())
		});
	}
	function result () {
		var sData = {};
		sData.status = 0;
		sData.result = [];
		sData.error  = [];
		sData.msg    = '';
		sData.url    = '';
		return sData;
	};
	function isWebkit(req) {
		var userAgent = req.headers['user-agent'];

		var browserWebkit = userAgent.match(/WebKit\/([\d.]+)/) ? true : (userAgent.match(/Firefox/) ? true : false);
		return browserWebkit;
	}
	function renderData ( req ) {

		return {
			title    : '文档系统',
			pageName : '',
			docNav   : '', // --
			depId    : '',
			proId    : '', //--
			docId    : '',
			proData  : '',
			err      : '',
			create   : '',
			data     : '',
			browser  : '',
			sideR    : false,
			session  : {},
			user     : req ? req.session.user : ''
		};
	}
	department(function ( err, docs ) {
		for( var i = 0, len = docs.length; i < len; i++ ) {
			var _id = docs[ i ][ '_id' ];
			var name = docs[ i ][ 'name' ];

			departmentData[ _id ]           = {}
			departmentData[ _id ][ '_id' ]  = _id;
			departmentData[ _id ][ 'name' ] = name;
		}
	});
	app.get('/', function ( req, res ) {
		var data = renderData( req );
		var userAgent = req.headers['user-agent'];
		var browserWebkit = userAgent.match(/WebKit\/([\d.]+)/) ? true : false;
		
		data.pageName = 'index';
		data.department = [];
		data.browser = isWebkit(req);
		for( var i in  departmentData ) {
			data.department.push( departmentData[ i ] );
		}
		data.docId = '';
		res.render('index', data);
	});
	// 注册 
	app.post('/reg', function ( req, res ) {
		//生成密码的散列值
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		var sData = result();
		var newUser = new User({
			name     : req.body.name,
			password : password,
			email    : req.body.email
		});
		//检查用户是否存在
		User.get( newUser.name, function( err, user ) {
			if ( user ) {
				req.session.user = user;
				sData.msg = '用户已存在';
				sData.error.push(
					{field:'name', value: '用户已存在'}
				);
				res.json(sData);
			} else {
				newUser.save(function(err, user){
					if( err ) {
						sData.status = 0;
						sData.error.push({err: err});
						res.json(sData);
					}
					var user = user&&user.length ? user[0]: {}
					// 用户信息存入session
					req.session.user   = user;
					sData.error.length = 0;
					sData.msg          = '注册成功!';
					sData.status       = 1;
					sData.result.push(user);
					res.json(sData);
				});
			}
		});
	});
	app.get('/logout', function (req, res) {
		if(req.headers['x-requested-with'])
		{
			if(req.session.user)
			{
				req.session.user = null;
				res.json({status:1, msg: "成功退出", url: "/"});
			} else {
				res.json({status:0, msg: "没有登陆", url: "/"});
			}
			// res.redirect('/');
		}
	});
	app.post('/login', function ( req, res ) {
		//生成密码的散列值
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		var sData = result();	
		//检查用户是否存在
		User.get( req.body.name, function( err, user ) {
			if ( user ) {
				//检查密码是否一致
				if(user.password != password) {
					sData.status = 0;
					sData.msg = '密码错误';
					sData.error.push(
						{field:'password'}
					);
				} else {
					sData.status = 1;
					sData.msg = '登陆成功';
					sData.result.push(user);
					sData.error.length = 0;
					// 用户名密码都匹配后，将用户信息存入 session
					req.session.user = user;
				}
			} else {
				sData.status = 0;
				sData.msg = '用户不存在';
				sData.error.push(
					{field:'name', value: '用户不存在'}
				);
				
			}

			res.json(sData);
		});
	});
	/**
	 * 查询 部门 下的所有文档
	 */
	app.post('/project', function ( req, res ) {
		var sData = result();
		var departmentId = req.body.departmentId;

		projectModel( departmentId, function ( err, docs ) {
			if( err ) {				
				sData.msg = err;
				sData.status = 0;
				sData.error.push(err)
			} else {
				sData.userName = req.session.user? req.session.user.name: '' ;
				if( !docs.length ) {
					sData.msg = '暂无文档';
					sData.status = 0;
				}
				else {
					sData.status = 1;
					sData.msg = '';
					sData.result = docs;
				}
			}
			// req.session.department = department;
			res.json(sData);
		});
	});
	// 获取文档 iframe 拉取内容
	app.get('/view/:id', function ( req, res ) {
		var data = renderData( req );
		data.browser = isWebkit(req);
		var id = req.params.id;
		try {
			docsModel.getOne({projectId: id}, function ( err, doc ) {
				if ( err ) {
					data.err = err;
					res.render('404', data);
					return;
				}
				if( !doc ) {
					res.render('404', {err:'没有查询到内容'});
					return;
				}
				data.data = doc;
				res.render('inner', data);
			});
		} catch ( e ) {
			// id 错误
			data.err = e;
			res.render('404', data);
		}
	});
	// 编辑 post 数据
	app.post('/view/:id', function ( req, res ) {
		var sData   = result();
		var reqData = req.body;

		var obj = {
			projectId  : reqData.projectId, // 文档, pro id
			content    : reqData.content,
			user       : req.session.user.name
		}

		docsModel.update(obj, function ( err, doc ) {
			if( err ) {
				sData.msg    = err;
				sData.status = 0;
			}
			if( !doc && err ) {
				sData.status = 0;
				sData.msg    = err;
			} else {
				sData.msg    = '修改成功';
				sData.status = 1;
				sData.result = doc;
				sData.url = '/' + doc.projectId
			}

			res.json( sData );
		});
	});
	// 编辑时 iframe 拉取内容
	app.get('/edit/:id', function ( req, res ){
		try {
			var id = ObjectID( req.params.id );
			var data = renderData( req );
			data.browser = false// isWebkit(req);
			data.name = 'edit';
			data.project = id.toString();
			
			docsModel.getOne({projectId: id.toString()}, function ( err, doc ) {
				if ( err ) {
					res.render('404', { err: err });
					return;
				}
				if( !doc ) {
					res.redirect('/create/'+id);
					return;
				}
				res.render('inner-edit', doc);	
			});
			// res.render('index', data);
		
		} catch ( e ) {
			// id 错误
			res.render('404', { err: e });
		}	
	});
	// 获取文档, 同时改变 iframe
	app.get('/:id', function ( req, res ) {
		var sessionUser = req.session.user
		var user = sessionUser ? sessionUser.name : '';


		// console.log( req.session )
		// if( req.params.id == 'create' ) {
		// 	console.log('create');

		// 	res.render('inner-create','')
		// } else {
			try {
				var id = ObjectID( req.params.id );
				var data = renderData( req );
				data.browser = isWebkit(req);
				data.pageName = 'index';
				data.docId = id.toString();
				data.department = [];
				for( var i in  departmentData ) {
					data.department.push( departmentData[ i ] );
				}


				projectModel.getOne({_id: id}, function ( err, doc ) {
					if( err ) {
						res.send(404, err);
						return;
					}
					if( !doc ) {
						res.send(404,'查询文档不存在');
						return;
					}
					data.depId = doc.departmentId;

					projectModel(doc.departmentId, function ( err, docs ){
						if( err ) {
							data.err = err;
							res.render('404', data);
						}
						var tmp = [];
						docs.forEach(function (v) {
							v.__id = v._id.toString();
							tmp.push(v)
						})
						data.proData = tmp;
						res.render('index', data)
					});
				});
				// res.render('index', data);
			} catch ( e ) {
				// id 错误
				res.send(404, e + '\n 非法操作' );
			}			
		// }
	});
	/**
	 * 创建文档 
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	app.post('/edit', function ( req, res ) {
		var sData   = result();
		var reqData = req.body;
		
		if(reqData.projectId == '5465a3733edd5583569dc29f') {
			sData.msg = '此文档不允许修改';
			sData.status = 0;
		} else {
			
			docsModel.getOne({projectId: reqData.projectId}, function ( err, doc ) {
				if ( err ) {
					data.err = err;
					res.render('404', data);
					return;
				}
				if( !doc ) {
					res.render('404', {err:'没有查询到内容'});
					return;
				}
				sData.status = 1;
				res.json( sData );
			});

			return;
		}
		res.json( sData );
	});
	app.post('/create-project', function ( req, res, next ) {

		var sData = result();
		var rData = renderData( req );
		

		var reqData      = req.body, 
			departmentId = reqData.departmentId, 
			name         = reqData['name'],
			content      = reqData.content;
		var sessionUser = req.session.user	
		var userName = sessionUser ? sessionUser.name : '';
		
		if( !userName ) {
			sData.status = 0;
			sData.msg    = '登陆后才能创建文档';
			res.json( sData );
			return;
		}
		if( !departmentId )	{
			sData.status = 0;
			sData.msg    = '选择部门';
			res.json( sData );
			return;
		}
		if( !name ) {
			sData.status = 0;
			sData.msg    = '文档名称不能为空';
			res.json( sData );
			return;
		}
		if( !content ) {
			sData.status = 0;
			sData.msg    = '填写内容';
			res.json( sData );
			return;
		}

		projectModel.save( {departmentId: departmentId, name: name, user: userName}, function ( err, docs ) {
			if( err ) {
				sData.msg    = err;
				sData.status = 0;
				res.json( sData );
				return;
			}
			if( !docs ) {
				sData.msg    = '已有同名的文档';
				sData.status = 0;
				res.json( sData );
				return;
			}

			docsModel.save({projectId: docs.ops[0]._id.toString(), content: content, user: userName }, function ( err, doc ) {
				if ( err ) {
					sData.msg    = err;
					sData.status = 0;
					res.json( sData );
					return;
				};
				sData.msg    = '创建成功';
				sData.status = 1;
				sData.url    = doc ? '/'+ doc.ops[0].projectId : ''; 
				sData.result = doc;
				res.json( sData );
			});
		});
	});
	
	
	
	app.use(function (req, res) {
		res.render('404', { url: req.url });
		return;
	});
	
}
