var pool = require('../libs/connection');
var ObjectID = require('mongodb').ObjectID;
var projectCollectionName = 'project';


function project ( dep, callback ) {
	var data;

	pool.acquire( function ( err, db ) {
		if ( err ) {
			callback(err, null)
		} else {
			db.collection(projectCollectionName, function ( err, col ) {
				if ( err ) {
					callback(err, null)
				}

				col.find({ departmentId: dep }).toArray(function ( err, docs ) {
					if ( err ) {
						callback(err, null);//失败！返回 null
						return;
					}
					callback( err, docs );
					// data = docs;
					pool.release(db);
				});
			});
		};
	});
	// return data;
}
project.save = function ( obj, callback ) {
	
	var insertData = {
		departmentId : obj.departmentId,
		name         : obj.name,
		createUser   : obj.user
	}	
	var pushData = {
		departmentId : obj.departmentId,
		name         : obj.name
	}
	project.getOne(pushData, function ( err, doc ) {
		if( err ) {
			callback(err, null);
			return;
		} else if (!err && doc ) {
			callback( '文档已存在', doc );
			return;
		} else {
			pool.acquire( function ( err, db ) {
				if ( err ) {
					callback(err, null);
					return;
				} else {
					db.collection(projectCollectionName, function ( err, col ) {
						if ( err ) {
							callback(err, null);//失败！返回 null
							return;
						}
						col.insert(insertData, {safe: true}, function ( err, docs ) {
							if ( err ) {
								callback(err, null);//失败！返回 null
								return;
							}
							callback( err, docs );
							// data = docs;
							pool.release( db );
						});
					});
				}
			});
		}
	});
};
project.getOne = function ( obj, callback ) {
	pool.acquire( function ( err, db ) {
		if ( err ) {
			callback(err, null)
		} else {
			db.collection(projectCollectionName, function ( err, col ) {
				if ( err ) {
					callback(err, null)
				}
				
				col.findOne(obj, function ( err, docs ) {
					if ( err ) {
						callback(err, null);//失败！返回 null
						return;
					}
					callback( err, docs );
					// data = docs;
					pool.release(db);
				});
			});
		};
	});	
};
module.exports = project;