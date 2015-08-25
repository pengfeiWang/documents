var pool = require('../libs/connection');
function department ( callback ) {
	var data;
	pool.acquire( function ( err, db ) {
		if ( err ) {
			callback(err, null)
		} else {
			db.collection('department', function ( err, col ) {
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
module.exports = department;