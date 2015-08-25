var pool = require('../libs/connection');

function User( user ){
	this.name     = user.name;
	this.password = user.password;
	this.email    = user.email;
};
module.exports = User;

User.prototype.save = function( callback ) { //存储用户信息
	//要存入数据库的用户信息文档
	var user = {
		name     : this.name,
		password : this.password,
		email    : this.email
	};

	pool.acquire( function ( err, db ) {
		if ( err ) {
			callback(err, null)
		} else {
			db.collection('users', function ( err, col ) {
				if ( err ) {
					callback(err, null)
				}
				// 查找用户名 name 值为 name文档
				col.insert( user, {safe: true}, function( err, doc ) {
					// db.close();
					callback( err, doc );
					pool.release(db);
				});
			});
		};
	});
};

User.get = function( name, callback ) {//读取用户信息
	//读取 users
	pool.acquire( function ( err, db ) {
		if ( err ) {
			callback(err, null)
		} else {
			db.collection('users', function ( err, col ) {
				if ( err ) {
					callback(err, null)
				}
				// 查找用户名 name 值为 name文档
				col.findOne({ name: name  }, function( err, doc ) {
					// db.close();
					callback( err, doc );
					pool.release(db);
				});
			});
		};
	});
}