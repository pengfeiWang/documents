(function ( $ ) {
	var globalOps = {
		loading: false,
		customClass: '',
		status: 'hide',
		showCallBack: function () {},
		hideCallBack: function () {}
	}
	var createRoot = function ( obj ) {
		var root = document.getElementById('mask');
		
		var cls = obj.customClass.match(/\S+/g) || [];
		var len = cls.length;
		var tmp = {};
		if( !root ) {
			root = document.createElement('div');
			root.id = 'mask';
			// root..style.cssText = 'position:absolute; top:0; right:0; bottom:0; left:0; display:none;';
			root.style.zIndex = 9998;
			root.classList.add('mask');
			document.documentElement.appendChild( root );
		}
		if( len ) {
			for( var i = 0; i < len; i++ ) {
				root.classList.add(cls[i]);
			}
		}

		root.innerHTML = '';
		tmp.root = root;
		if( obj.loading ) {
			return createLoading( tmp )
		}

		return tmp;

	};
	var createLoading = function ( obj ) {
		var str = [
			'<div class="mask-loading">'
			,'	<div class="mask-loading-conatiner">'
			,'		<div class="mask-loading-inner">'
			,'			<div class="loading-spinner-outer">'
			,'				<div class="loading-spinner">'
			,'					<span class="loading-top"></span>'
			,'					<span class="loading-right"></span>'
			,'					<span class="loading-bottom"></span>'
			,'					<span class="loading-left"></span>'
			,'				</div>'
			,'			</div>'
			,'		</div>'
			,'	</div>'
			,'</div>'
		].join('');
		obj.root.innerHTML = str;
		obj.loadingElem = obj.root.querySelectorAll('.mask-loading')[0];

		return obj;
	};
	var show = function ( elem, callback ) {
		if( window.getComputedStyle(elem.root)['display'] == 'none' ) {
			elem.root.style.display = 'block';
		}
		callback&&callback.call(this);
	};
	var hide = function ( elem, callback ) {
		if( window.getComputedStyle(elem.root)['display'] !== 'none' ) {
			elem.root.style.display = 'none';
		}
		callback&&callback.call(this);
	};

	$.mask = function ( options ) {

		var obj = $.extend( {}, globalOps, options );

		var elem = createRoot( obj );

		if( obj.status ) {
			show( elem, obj.showCallBack )
		} else {
			hide( elem, obj.hideCallBack )
		}

	};
	$.mask.show = function ( bool, callback ) {
		if( arguments.length == 1 ) {
			callback = bool;
			bool = false;
		}
		var ops = $.extend( {}, globalOps,{
			loading: !!(bool),
			status: true,
			showCallBack: callback
		});

		this( ops );
	};
	$.mask.hide = function ( bool, callback ) {
		if( arguments.length == 1 ) {
			callback = bool;
			bool = false;
		}
		var ops = $.extend( {}, globalOps, {
			loading: !!(bool),
			status: false,
			hideCallBack: callback
		});

		this( ops );
	}
})( $$$ );