var pool = require('../libs/connection');
var ObjectID = require('mongodb').ObjectID;
var categoryCollectionName = 'category';

function categoryModule ( callback ) {
	var data;
	pool.acquire( function ( err, db ) {
		if ( err ) {
			callback(err, null);
		} else {
			db.collection( categoryCollectionName, function ( err, col ) {
				if ( err ) {
					callback(err, null);
				}
				
				col.find().toArray(function ( err, docs ) {
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
categoryModule.save = function ( obj, callback ) {
	pool.acquire( function ( err, db ) {
		if ( err ) {
			callback(err, null)
		} else {
			db.collection( categoryCollectionName, function ( err, col ) {
				if ( err ) {
					callback(err, null)
				}
				
				col.find( obj, function ( err, docs ) {
					if ( err ) {
						callback(err, null);//失败！返回 null
						return;
					}
					callback( err, docs );
					// data = docs;
					pool.release(db);
				})
			});
		};
	});
};

categoryModule.get = function ( obj, callback ) {
	
	pool.acquire( function ( err, db ) {
		if ( err ) {
			callback(err, null)
		} else {
			db.collection( categoryCollectionName, function ( err, col ) {
				if ( err ) {
					callback(err, null)
				}
				
				col.find(obj).toArray(function ( err, docs ) {
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
categoryModule.getOne = function ( obj, callback ) {
	/*
	obj.cat 分类名
	obj.pro 项目名
	obj.doc 文档名
	*/
	var getObj = {}

	if( obj.pro ) {
		getObj.project = obj.pro;
	}
	if( obj.pro ) {
		getObj.category = obj.cat;
	}
	


	pool.acquire( function ( err, db ) {
		if ( err ) {
			callback(err, null)
		} else {
			db.collection( categoryCollectionName, function ( err, col ) {
				if ( err ) {
					callback(err, null)
				}
				col.findOne(obj, function ( err, docs ) {
					if ( err ) {
						callback(err, null); // 未查询到结果 返回 null
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
categoryModule.update = function ( obj, callback ) {
	pool.acquire( function ( err, db ) {
		if ( err ) {
			callback(err, null)
		} else {
			db.collection( categoryCollectionName, function ( err, col ) {
				if ( err ) {
					callback(err, null)
				}
				
				col.find().toArray(function ( err, docs ) {
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
module.exports = categoryModule;