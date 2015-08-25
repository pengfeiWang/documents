var pool               = require('../libs/connection');
var markdown           = require('markdown').markdown;
var marked             = require('marked');
var ObjectID           = require('mongodb').ObjectID;
var docsCollectionName = 'docs';

var renderer = new marked.Renderer();

renderer.heading = function (text, level) {
  var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
  return '<h' + level + ' id="'+text.replace(/\s+/g,'-')+'">'+ text + '</h' + level + '>';
}
renderer.link = function(href, title, text) {
  if (this.options.sanitize) {
	try {
	  var prot = decodeURIComponent(unescape(href))
		.replace(/[^\w:]/g, '')
		.toLowerCase();
	} catch (e) {
	  return '';
	}
	if (prot.indexOf('javascript:') === 0) {
	  return '';
	}
  }
  var out = '<a href="' + href + '"';
  if (title) {
	out += ' title="' + title + '"';
  }
  out += ' target="_blank">' + text + '</a>';
  return out;
};
renderer.code = function(code, lang, escaped) {
	
	code = code.replace(/\</g, '&lt;').replace(/\>/g,'&gt;');
	if (!lang) {
		return '<pre><code>'
		+ code
		+ '\n</code></pre>';
	}

	if( /demo/i.test(lang) ) {
		var title = '查看DEMO请点击';
		var arr = [];
		if(/\:/.test(lang)) {
			arr = lang.split(':');
			title = arr[1]

		}
		return '<a href="javascript:;" data-code="'
			+ escape(code, true)
			+ '">'
			+ title
			+ '\n</a>\n';
	} else {
		return '<pre><code class="'
			+ this.options.langPrefix
			+ escape(lang, true)
			+ '">'
			+ code
			+ '\n</code></pre>\n';
	}

};
function dataOBJ ( obj, callback ) {
	var getObj = {};

	if( obj.hasOwnProperty('projectId') && !!obj.projectId ) {
		getObj.projectId = obj.projectId;
		
	}
	// console.log( obj.content )
	getObj.content = obj.content;
	getObj.source = obj.content;
	getObj.createUser = obj.user;
	getObj.upUser = '';
	getObj.upTime = {};
	getObj.time = getDate();
	// console.log( getObj.content )
	return getObj;
}
function getDate ( n ) {
	var date = n ? new Date( n ) : new Date() ;
	var DAY = {
		0: "星期日",
		1: "星期一",
		2: "星期二",
		3: "星期三",
		4: "星期四",
		5: "星期五",
		6: "星期六"
	}
	var datePreix = function datePreix( num ) {
		return num <= 9 ? '0'+num : num;
	}
	//存储各种时间格式，方便以后扩展
	var time = {
		time    : date.getTime(),
		year    : date.getFullYear(),
		month   : datePreix( date.getMonth()+1 ),
		date    : datePreix( date.getDate() ),
		hours   : datePreix( date.getHours() ),
		minutes : datePreix( date.getMinutes() ),
		seconds : datePreix( date.getSeconds() ),
		day     : DAY[date.getDay()]
	}
	return time;	
}

/*

projectId
文档只能属于项目


 */
function docsModel ( callback ) {
	var data;
	pool.acquire( function ( err, db ) {
		if ( err ) {
			callback(err, null)
		} else {
			db.collection(docsCollectionName, function ( err, col ) {
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
	// return data;
}
docsModel.save = function ( obj, callback ) {
	var getObj = dataOBJ( obj, callback )

	if ( !getObj.content ) {
		callback('内容不能为空', null);
		return;
	}
	docsModel.getOne( {projectId: getObj.projectId}, function ( err, doc ) {
		if( err ) {
			callback(err, null)
		} else if (!err && !!doc ) {
			callback( true, docs );
		} else {
			pool.acquire( function ( err, db ) {
				if ( err ) {
					callback(err, null)
				} else {
					db.collection(docsCollectionName, function ( err, col ) {
						if ( err ) {
							callback(err, null);
							pool.release(db);
							return;
						}
						getObj.content = marked( getObj.content, {renderer: renderer} );
						getObj.time = getDate();
						col.insert({
							projectId : getObj.projectId,
							source    : getObj.source,
							content   : getObj.content,
							user      : getObj.createUser,
							time      : getObj.time
						}, {safe: true}, function ( err, docs ) {
							if ( err ) {
								callback(err, null);//失败！返回 null
								pool.release(db);
								return;
							}
							callback( err, docs );
							// data = docs;
							pool.release(db);
						});
					});
				}
			});
		}
	});
};
docsModel.get = function ( obj, callback ) {
	pool.acquire( function ( err, db ) {
		db.collection(docsCollectionName, function ( err, col ) {
			col.find(obj)
				.sort({time:-1})
				.toArray( function ( err, docs ) {
					if( err ) {
						callback( err, null );
						pool.release(db);
						return;
					}
					callback( err, docs );
					pool.release(db);
				});
		});
	});
};
docsModel.getOne = function ( obj, callback ) {
	var getObj = dataOBJ( obj, callback )
	if( !getObj.projectId ){
		callback('未找到文档', null);
		return
	}
	pool.acquire( function ( err, db ) {
		if ( err ) {
			callback(err, null)
		} else {
			db.collection(docsCollectionName, function ( err, col ) {
				if ( err ) {
					callback(err, null);
					pool.release(db);
					return;
				}
				col.findOne({projectId: getObj.projectId}, function ( err, doc ) {
					if ( err ) {
						callback(err, null);//失败！返回 null
						pool.release(db);
						return;
					}
					callback( err, doc );
					// data = docs;
					pool.release(db);
				});
			});
		};
	});	
};
docsModel.update = function ( obj, callback ) {
	var getObj = dataOBJ( obj, callback )

	if ( !getObj.content ) {
		callback('内容不能为空', null);
		return;
	}	
	
	docsModel.getOne( {projectId: getObj.projectId}, function ( err, doc ) {
		if( err ) {
			callback(err, null)
		} else if ( !doc ) {
			docsModel.save( obj, callback )
		} else {
			pool.acquire( function ( err, db ) {
				if ( err ) {
					callback(err, null)
				} else {
					db.collection(docsCollectionName, function ( err, col ) {
						if ( err ) {
							callback(err, null);
							pool.release(db);
							return;
						}
						getObj.content = marked( getObj.content, {renderer: renderer} );
						getObj.upTime = getDate();
						col.update({
							projectId: getObj.projectId
						}, {
							$set: {
								source  : getObj.source,
								content : getObj.content,
								upUser  : getObj.createUser,
								upTime  : getObj.upTime
							}
						}, function ( err ) {
							if ( err ) {
								callback(err, null);//失败！返回 null
								pool.release(db);
								return;
							}
							col.findOne({
								projectId: getObj.projectId
							}, function (err, doc) {
								if (err) {
									pool.release(db);
									return callback(err);
								}
								callback( err, doc );
								pool.release(db);
							});
						});
					});
				}
			});
		}
	});
};
docsModel.create = function ( ) {

};
module.exports = docsModel;