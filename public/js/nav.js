(function () {
	var doc     = document,
		toolSide = doc.getElementById('tool-side'),
		nav      = doc.getElementById('tool-nav'),
		a        = doc.getElementsByTagName('a'),
		li       = nav.getElementsByTagName('li');
	
	var ifr = doc.getElementById('ifr');
	
	function reset ( parent ) {
	}
	function addIframeSrc () {}
	function add ( oLi, parent ) {
		var nav = doc.getElementById('tool-nav');
		var o = parent || nav;
		var nodeO = o.childNodes;

		
			for (var i = 0, len = nodeO.length; i < len; i++ ) {
				if( nodeO[ i ].nodeType == 1  ) {
					nodeO[ i ].classList.remove('active');
				}
			}			
		

		// window.location.href = oLi.querySelectorAll('a')[ 0 ].href;
		parent&&parent.classList.add('active');
		oLi.classList.add('active');
		if( parent ) {
			ifr.contentWindow.location.hash = oLi.querySelectorAll('a')[0].name;
		}
		
	}
	
	// 侧导航事件
	toolSide.addEventListener('click', function ( e ) {
		e.preventDefault();

		var target = e.target, 
			sml = target.tagName.toLowerCase(),
			li, 
			a,
			parent,
			sub,
			href,
			node;

		if ( sml == 'li' || sml == 'a' ) {
			parent = target.parentNode;
			while ( parent.tagName.toLowerCase() !== 'ul' ) {
				parent = parent.parentNode;
			}
			reset(parent);
			if( sml == 'li' ) {
				li = target;
			} else {
				li = target.parentNode;
			}
			if( parent.id ) {
				add( li );
			} else {
				add( li, parent );
			}
		}
		return false
	}, false);
})();