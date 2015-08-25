(function () {
	function lopData (obj) {
		var doc = document;
		var winTop = window.top;
		var toolSide = winTop.document.getElementById('tool-side');
		var toolNav = winTop.document.getElementById('tool-nav');
		
		if( !toolSide ) return;

		toolSide&&toolSide.removeAttribute('hidden');
		var li = document.createElement('li');
		var a = document.createElement('a');
		var ul = document.createElement('ul');
		ul.className = 'tool-nav';
		ul.id = 'tool-nav';
		for( var i = 0, len = obj.length; i < len; i++ ) {
			var cloneA = a.cloneNode(false);
			var cloneLi = li.cloneNode(false);
			var line = obj[i];
			var lineSub = line.sub;
			var sub;
			cloneA.href = 'javascript:;';
			cloneA.name = '#'+ line.h2.id;
			cloneA.innerHTML = line.h2.id;
			cloneLi.appendChild(cloneA);
			if(  lineSub.length ) {
				sub = ul.cloneNode(false);
				sub.id = '';
				for( var j = 0, jLen = lineSub.length; j < jLen; j++ ) {
					(function () {
						var cloneA = a.cloneNode(false);
						var cloneLi = li.cloneNode(false);
						cloneA.href = 'javascript:;';
						cloneA.name = '#'+lineSub[j].id;
						cloneA.innerHTML = lineSub[j].id;
						cloneLi.appendChild(cloneA);
						sub.appendChild(cloneLi);
					})();
				}
				cloneLi.appendChild(sub);
			}
			ul.appendChild(cloneLi);
		}
		if( toolSide ) {
			toolSide.innerHTML = '';
			toolSide.appendChild(ul);			
		}

	}
	function sideHand() {
		var doc = document;
		var preview = doc.getElementById('preview');
		var child = preview.childNodes;
		var tmp = [];
		var obj = {};
		var i = 0;
		var nextElementSibling;
		for( var i = 0, len = child.length; i < len; i++ ) {
			if(child[i].nodeType == 1 && child[i].tagName.toLowerCase() == 'h2') {
				tmp.push(child[i]);
			}
		}
		for( var i = 0, len = tmp.length; i < len; i++ ) {
			(function ( key ){
				obj[ key ] = {};
				obj[ key ]['sub'] = [];
				obj[ key ]['h2'] = tmp[ key ];
				obj.length = ( key +1);
				var sub = tmp[ key ].nextElementSibling;
				while ( sub ) {
					if( sub.tagName.toLowerCase() == 'h3' ){
						obj[ key ]['sub'].push(sub)
					}
					if( sub.tagName.toLowerCase() == 'h2' ){
						break;
					}
					sub = sub.nextElementSibling;
				}
			})(i);
		}
		if( obj.length ) {
			lopData(obj)
		}
	}
	window.sideHand = sideHand;
})();