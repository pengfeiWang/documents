/*! ============================================= 
    project: shouxinMFW  
    version: 0.1.1 
    update: 2015-02-09 
    author: pengfeiWang 
==================================================  */
if (!window.$$$ || typeof($$$) !== "function") { 
	var $$$ = (function (window, undefined) {
		"use strict";
		var document     = window.document,
			objPrototype = Object.prototype,
			oToString    = objPrototype.toString,
			emptyArray   = [],
			indexOf      = emptyArray.indexOf,
			slice        = emptyArray.slice,
			splice       = emptyArray.splice,
			concat       = emptyArray.concat,
			classCache   = {},
			rword        = /[^, ]+/g,
			rnospaces    = /\S+/g,
			fragment     = document.createDocumentFragment(),
			isWin8       = ( typeof( MSApp ) === 'object' ),
			cssNumber    = {
				'columncount': !0,
				'fontweight': !0,
				'lineheight': !0,
				'column-count': !0,
				'font-weight': !0,
				'line-height': !0,
				'opacity': !0,
				'orphans': !0,
				'widows': !0,
				'zIndex': !0,
				'z-index': !0,
				'zoom': !0
			};	
		function _addPx( prop, val ) {
			return (typeof(val) === 'number') && !cssNumber[ prop.toLowerCase() ] ? val + 'px' : val;
		}
		function _valHtml ( attr, val ) {
			var i = 0, len = this.length;
			if( val ) {
				for ( ; i < len; i++ ) {
					this[ i ][ attr ] = val;
				}
				return this;
			} else {
				return this[ 0 ][ attr ];
			}
		}
		/**
		 * 数组去重
		 * @param  {[type]} arr [description]
		 * @return {[type]}     [description]
		 */
		function _unique ( arr ) {
			// for ( var i = 0, len = arr.length; i < len; i++ ) {
			// 	if ( arr.indexOf(arr[ i ]) !== i ) {
			// 		arr.splice(i, 1);
			// 		i--;
			// 	}
			// }
			// return arr;
			// console.log( arr )

			// var n = {},r=[]; //n为hash表，r为临时数组
			// for(var i = 0; i < arr.length; i++) //遍历当前数组
			// {
			// 	if ( !n[ i ] ) //如果hash表中没有当前项
			// 	{
			// 		n[ i ] = true; //存入hash表
			// 		r.push( arr[ i ] ); //把当前数组的当前项push到临时数组里面
			// 	}
			// 	console.log( n, '---n' )
			// }
			// return r;

			var n = [];
			for ( var i = 0, len = arr.length; i < len; i++ ) {
				if (n.indexOf(arr[i]) == -1) n.push(arr[i]);
			}
			return n;


		}
		/**
		 * 元素碎片
		 * @param  {[type]} elem   [description]
		 * @param  {[type]} target [description]
		 * @param  {[type]} insert [description]
		 * @return {[type]}        [description]
		 */
		function _insertFragments ( elem, target, insert ) {
			if( !elem ) return;
			var frag = fragment.cloneNode(false);
			var reg = /^(script)$/i;
			var len = elem.length;
			if( elem.nodeType == 11 ) {
				elem = elem.children;
			}
			if( elem ) {
				if( typeof elem == 'string' ) {
					frag.innerHTML = elem;
				} else {
					for ( var i = 0; i < len; i++ ) {
						if ( elem[ i ].nodeType === 1 ) {
							frag.appendChild( elem[ i ] );
						}						
					}	
				}
				if( target ) {
					target.appendChild( frag );
				} else {
					return frag;
				}
			}
			frag = null;
		}
		/**
		 * 处理选择的元素 对象
		 * @param  {[type]} nodes [description]
		 * @param  {[type]} obj   [description]
		 * @param  {[type]} reg   [description]
		 * @return {[type]}       [description]
		 */
		function _shimNodes ( nodes, obj, reg ) {
			if ( !nodes ) {
				return obj;
			}
			
			if ( nodes.nodeType ) {
				obj[ obj.length++ ] = nodes;
				return obj;
			}

			if( reg !== undefined ) {
				for (var i = 0, len = nodes.length; i < len; i++) {
					if( reg.test( nodes[ i ].className ) ) {
						obj[ obj.length++ ] = nodes[ i ];
					}
				}
			} else {
				for (var i = 0, len = nodes.length; i < len; i++) {

					obj[ obj.length++ ] = nodes[ i ];
				}
			}

			return obj;
		}
		/**
		 * 选择元素 对象 .... 
		 * @param  {[type]} selector [description]
		 * @param  {[type]} context  [description]
		 * @return {[type]}          [description]
		 */
		function _selector ( selector, context ) {
			var doc = ( $.isIns( context ) ? context[0] :  context ) || document,
				tmp, tag, arr, regExp;

			var _this = this;

			if( /^\d+/.test( selector ) ) {
				return
			}
			if( $.isWindow( _this ) || $.isEmptyObject( _this ) ) {
				_this = { length: 0 };
			} 
			if ( typeof selector == 'string' ) { 
				selector = selector.trim();
				if ( selector[0] === '<' 
					&& selector[ selector.length-1 ] === '>' 
					&& selector.length >= 3 && selector.indexOf('>') ===  selector.length - 1 ) {

					var tmp = document.createElement('div');
					if ( isWin8 ) {
						
						MSApp.execUnsafeLocalFunction(function () {
							tmp.innerHTML = selector.trim();
						});
						
					} else {

						tmp.innerHTML = selector.trim();
					}

					return _shimNodes(tmp.childNodes, _this);

				} else {
					switch ( selector[0] ) {
						case '#':

							var tag = document.getElementById( selector.substring(1) );

						break;

						case '.':

							var tag = doc.getElementsByTagName('*'),
								regExp = new RegExp('(^|\\s)'+ selector.substring( 1 ) +'(\\s|$)');
						break;

						default:
							var tag = doc.getElementsByTagName( selector );
					}
					return	_shimNodes( tag, _this, regExp );
				}
			} else {
				
				if ( $.isIns( selector ) && context == undefined ) {
					
					return selector;

				} else if ( $.isFunction( selector ) ) {

					return $( document ).ready( selector );

				} else if ( $.isArray( selector ) && selector.length !== undefined) {

					return	_shimNodes( selector, _this );

				} else if ( $.isHTMLCollection( selector ) && selector.length > 0  ) {
					$.each(selector, function (i, n) {
						_this[ _this.length++ ] = n;
					});

				} else if ( ( $.isDocument( selector ) || $.isWindow( window ) ) 
							&& context == undefined ) {

					_this[ _this.length++ ] = selector;
					return _this;
				}  else if ( selector.nodeType == 11 ) {
					$.each(selector.children, function (i, n) {
						_this[ _this.length++ ] = n;
					});
					return _this;
				} else if ( selector.nodeType == 1 ) {
						_this[ _this.length++ ] = selector;
					
					return _this;
				}

			}
		}
		/**
		 * 上一个 下一个 首尾元素选择方法, 便于循环
		 * @type {Object}
		 */
		var getNodeMap = {
			prev: function ( elem ) {
				return elem['previousElementSibling'];
			},
			next: function ( elem ) {
				return elem['nextElementSibling'];
			},
			first: function ( elem ) {
				return elem['firstElementChild'];
			},
			last: function ( elem ) {
				return elem['lastElementChild'];
			}
		};
		/**
		 * 构造函数
		 * [$$ description] 
		 * @param  {[type]} selector [description]
		 * @param  {[type]} context  [description]
		 * @return {[type]}          [description]
		 */
		var $$ = function ( selector, context ) {
			if ( !selector ) {

				return this;
			}

			return _selector.call( this, selector, context );
		};
		var $ = function( selector, context ) {

			return new $$( selector, context );
		};
		$.uuid = function() {
            var S4 = function() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            };
            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        };
		$.cache = {
			eventCache    : {},
			guid          : 1,
			Name          : '_mobile',
			elemOldStatus : {},
			getGid        : function ( elem ) {
				return elem[ '__$gid' + $.cache.Name ] || ( elem[ '__$gid' + $.cache.Name ] = $.cache.guid++ )
			}
		};			
		$.isIns = function ( obj ) {
			return (obj instanceof $$);
		};
		/**
		 * 数组去重
		 * @type {[type]}
		 */
		$.unique = _unique;
		$.isFunction = function ( obj ) {

			return oToString.call( obj ) === '[object Function]';
		};
		/**
		 * 是否纯数组
		 * @type {Boolean}
		 */
		$.isArray = Array.isArray;
		/**
		 * 判断是否存在某个值
		 * @param  {[type]} arr [description]
		 * @param  {[type]} key [description]
		 * @return 
		 */
		$.inArray = function ( arr, key ) {
			if( !$.isArray( arr ) ) {
				return false;
			}
			return arr.indexOf( key ) > -1 ? true : false;
		};
		/**
		 * 转数组 必须 {0:'aaa', 1:'bbb', length:2 }
		 */
		$.toArray = function ( obj ) {
			if( $.isArray( obj ) ) return obj;
			return slice.call( this );
		}
		/**
		 * 是否 window
		 * @param  {[type]}  obj [description]
		 * @return {Boolean}     [description]
		 */
		$.isWindow = function ( obj ) {
			return obj != null && obj == obj.window;
		};
		/**
		 * 是否 document
		 * @param  {[type]}  obj [description]
		 * @return {Boolean}     [description]
		 */
		$.isDocument = function ( obj ) {
			return !!obj && obj.nodeType == obj.DOCUMENT_NODE;			
		};
		$.isHTMLCollection = function ( obj ) {
			return (oToString.call( obj ) === '[object HTMLCollection]' || oToString.call( obj ) === '[object NodeList]');
		}
		/**
		 * 是否 对象
		 * @param  {[type]}  obj [description]
		 * @return {Boolean}     [description]
		 */
		$.isObject = function ( obj ) {
			return oToString.call( obj ) === '[object Object]';
		};
		/**
		 * 是否对象字面量
		 * @param  {[type]}  obj [description]
		 * @return {Boolean}     [description]
		 */
		$.isPlainObject = function ( obj ){

			return obj && typeof obj === 'object' && Object.getPrototypeOf( obj ) ===  objPrototype;
		};
		/**
		 * 是否空对象
		 * @param  {[type]}  obj [description]
		 * @return {Boolean}     [description]
		 */
		$.isEmptyObject = function ( obj ) {
			var name;
			if( !$.isObject( obj ) ) return true;
			for ( name in obj ) {
				return false;
			}
			return true;
		};
		/**
		 * 代理函数
		 * @param  {[type]} f    [description]
		 * @param  {[type]} c    [description]
		 * @param  {[type]} args [description]
		 * @return {[type]}      [description]
		 */
		$.proxy = function(f, c, args) {
            return function() {
                if (args) return f.apply(c, args);
                return f.apply(c, arguments);
            };
        };
		/**
		 * 序列化
		 * @param  {[type]} a [description]
		 * @return {[type]}   [description]
		 */
		$.param = function ( a ) {
			
			var prefix,
				s = [],
				r20 = /%20/g,
				add = function( key, value ) {
					value = $.isFunction( value ) ? value() : ( value == null ? '' : value );
					s[ s.length ] = encodeURIComponent( key ) + '=' + encodeURIComponent( value );
				};
			if ( $.isArray( a ) ) {
				for(var i = 0, len = a.length; i < len; i++)
				{	
					add( i, a[ i ] );
				}
			} else {					
				for ( prefix in a ) {
					$.buildParams( prefix, a[ prefix ],  add );
				}
			}
			return s.join( '&' ).replace( r20, '+' );
		};
		$.buildParams = function ( prefix, obj, add ) {
			var name,
				rbracket = /\[\]$/;
			if ( $.isArray( obj ) ) {
				for(var i = 0, len = obj.length; i < len; i++ )
				{
					if ( rbracket.test( prefix ) ) {
						add( prefix, obj[ i ] );
					} else {
						$.buildParams( prefix + '[' + ( typeof obj[i] === 'object' ? i : '' ) + ']', obj[i],  add );
					}
				}
			} else if ( $.isObject( obj ) ) {
				for ( name in obj ) {
					$.buildParams( prefix + '[' + name + ']', obj[ name ],  add );
				}
			} else {
				add( prefix, obj );
			}
		};
		/* 返回表单 下的所有有效对象 */
		$.frmField = function( frm ) {
			if( !frm || !frm.nodeType || frm.nodeType != 1 ) return;
			var tmp =[];
			//传入的是form的话 frm.elements 直接取
			var fr = function(){
				var elem = frm.elements;
				for( var i = 0, len = elem.length; i < len; i++) {
					if( elem[ i ].name ){
						tmp.push( elem[ i ] );
					}
				}
			}
			//传入的非form需要挨个类型取
			var tag = function(){
				$.each(['input', 'select', 'textarea'], function ( i, a ) {
					var tags = _selector.call( null, a, frm );
					$.each( tags, function ( name, node ) {
						if( node.name ) {
							tmp.push( node );
						}
					});
				});					
			}
			frm.tagName.toLowerCase() == 'form' ? fr() : tag();
			return tmp;
		};
		/**
		 * form 数据转成对象, action-url , method-type
		 *
		 * 	return {
		 * 		url: form.action
		 * 		method:form.method
		 * 		data: field data = {
		 * 			...
		 * 		}
		 *  }
		 */
		$.serialize = function( frm ) {

			if( !frm || !frm.nodeType || frm.nodeType != 1 ) return;

			var ele = $.frmField( frm ),
				i = 0,
				rbracket = /\[\]$/,
				name = '',
				o = {},
				field = null,
				optLen,
				option,
				handOpt = function(obj){
					var v = '';
					var tmp = [];
					var name = obj.name;
					for( var j = 0, optLen = obj.options.length; j < optLen; j++ ) {
						option = obj.options[ j ];
						if( option.selected ){
							
							v = (option.hasAttribute( 'value' ) ? option.value : option.text )
							
							tmp.push( v );
						}
					}
					if( tmp.length == 1 ) {
						tmp = tmp.join();
					}
					return tmp;
				};

			o[ 'data' ]= {};
			o[ 'url' ] = frm.action;
			o[ 'type' ]= frm.method;

			for( var i = 0, len = ele.length; i < len; i++) {
				field = ele[ i ];
				switch( field.type ) {
					case 'select-one':
					case 'select-multiple':
						name = field.name;
						o[ 'data' ][ name ] = handOpt( field );
						break;
					case undefined:
					case 'file':
					case 'submit':
					case 'reset':
					case 'button':
						break;
					case 'radio':
					case 'checkbox':
						if( !field.checked ) {
							break
						}
					default:
						if( rbracket.test( field.name ) ) {
							name = field.name.replace(/\[|\]/g, '');
							if(  !o[ 'data' ][ name ] ){
								o[ 'data' ][ name ] = [];
							}
							o[ 'data' ][ name ].push( field.value );
						} else {
							o[ 'data' ][ field.name ] = field.value;
						}
				}
			}
			return o;
		};	
		$.each = function ( obj, callback ) {
			if( !obj ) return obj;

			var isArray = $.isArray( obj ),
				isInstance = $.isIns( obj ),
				val,
				i = 0;

			if ( isArray || isInstance ) {
				for ( var i = 0, len = obj.length; i < len; i++ ) {
					val = callback.call(obj[ i ], i, obj[ i ] );
					if( val === false ) {
						break;
					}
				}
			} else {

				for (var i in obj ) {
					if ( i == 'length' ) continue;
					if ( obj.hasOwnProperty( i ) ) {
						val = callback.call(obj[ i ], i, obj[ i ] );
						if( val === false ) {
							break;
						}
					}
				}
			}
		};
		$.add = function ( first, second ) {
			var len = +second.length,
			j = 0,
			i = first.length;

			for ( ; j < len; j++ ) {
				first[ i++ ] = second[ j ];
			}

			first.length = i;

			return first;
		};
		$.extend = function(target) {
			if ( target == undefined ) {
				target = this;
			}
			if ( arguments.length == 1) {
				for ( var key in target )  {
					this[ key ] = target[ key ];
				}
				return this;
			} else {
				$.each( slice.call( arguments, 1 ), function ( name, val ) {
					for ( var key in val ) {
						target[ key ] = val[ key ];
					}
				});
			}
			return target;
		};
		$.fn = $$.prototype = {
			namespace: 'pengfeiWang',
			constructor: $$,
			indexOf: indexOf,
			splice: splice,
			length: 0,
			ready: function ( callback ) {
				if ( document.readyState === 'complete' || document.readyState === 'loaded' ) {
					callback();
				} else {
					document.addEventListener( 'DOMContentLoaded', callback, false );
				}
				return this;
			},
			each: function ( callback ) {

				$.each(this, callback);
				return this;
			},
			filter: function ( selector ) {
				var len = this.length, 
					isObject = $.isObject( selector ),
					nodeType = selector.nodeType;

				if ( !len ) {
					return this;
				}

				if ( selector == undefined ) {
					return this;
				}

				
				if( !isObject && nodeType !== 1 ) {
					selector = $( selector )
				}
				var elems = [],
					selectorLen = selector.length;
				var hd = function ( obj ) {
					
					for( var j = 0; j < selectorLen; j++ ) {

						if ( !selector[ j ] || obj == selector[ j ] ) continue;
						if( val !== selector[ j ] ) {
							elems.push( obj );
						}
					}
				}	
				for ( var i = 0; i < len; i++ ) {
					var val = this[ i ];
					if( selectorLen ) {
						hd( val );
					} else {
						if( val !== selector ) {
							elems.push( val );
						}
					}
				}
				return $( _unique( elems ) );
			},
			/* ==============================
				获取文档 返回 dom, num 为null 返回原生dom元素数组集合
			================================ */
			get: function ( num ) {
				num = num == undefined ? null : num;
				var len = this.length;
				if ( num < 0 ) {
					num += len;
				}
				if( num === null ) {
					var elems = [];
					for(var i = 0; i < len; i++) {
						elems.push( this[ i ] );
					}
					return elems;
				}
				return ( this[ num ] ) ? this[ num ] : undefined;
			},
			find: function( selector ) {
				var len = this.length;
				if ( !len || !selector ) {
					return this;
				}
				var elems = [],
					tmpElems;

				for ( var i = 0; i < len; i++ ) {

					elems =  concat.apply(elems,  slice.call( _selector.call( null, selector, this[ i ] ) ) );

					// for ( var j = 0; j < tmpElems.length; j++ ) {
					// 	elems.push( tmpElems[ j ] );
					// }
				}
				return $( _unique( elems ) );
			},
			parent: function () {
				var len = this.length;
				if( !len ) {
					return this;
				}
				var elems = [] ;
				
				for( var i = 0; i < len; i++ ) {
					elems.push( this[ i ].parentNode );
				}
				
				return $( _unique( elems ) );
			},
			children: function ( elem ) {
				var len = this.length;
				if( !len ) {
					return this;
				}

				var tmp = [];
				if ( elem )	{
					
					for ( var i = 0; i < len; i++ ) {
						tmp =  concat.apply(tmp,  slice.call( _selector.call( null, elem, this[ i ] ) ) );

						// tmp = tmp.concat( slice.call( _selector.call(null, elem, this[ i ]) ) );
					}
				} else {
					for ( var i = 0; i < len; i++ ) {
						tmp = concat.apply(tmp, slice.call( this[ i ].children ) )
						// tmp = tmp.concat( slice.call( this[ i ].children ) )
					}
				}
				return $( _unique( tmp ) );
			},
			eq: function ( num ) {
				return $( this[ num ] );
			},
			/* ==============================
				文档操作
			================================ */
			append: function ( elems ) {
				if ( !elems || elems.length == undefined && elems.length === 0 ) {
					return this;
				}

				var len = this.length;

				if( typeof elems == 'string' ) {
					for( var i = 0; i < len; i++ ) {

						_insertFragments( elems, this[ i ] )
					}
				} else {
					for( var i = 0; i < len; i++ ) {

						_insertFragments( _selector.call( null, elems ), this[ i ] )
					}
				}
				

				return this;
			},
			before: function ( elems, after ) {
				var len = this.length;
				if( !len ) {
					return this;
				}
				
				if( !elems ) {
					return this;
				}
				
				elems = _insertFragments( _selector.call( null, elems ) );

				if ( elems ) {
					for ( var i = 0; i < len; i++) {

						after ? this[ i ].parentNode.insertBefore( elems, this[ i ].nextSibling ) :
								this[ i ].parentNode.insertBefore( elems, this[ i ] )
					}
				}
				return this;
			},
			after: function ( elems ) {
				this.before( elems, 1 );
				return this;
			},
			remove: function ( elems ) {
				var len = this.length; 

				if( !len ) return;

				var i = 0;
				
				if ( elems ) {
					if( typeof elems === 'string' ) {
						for ( ; i < len; i++ ) {
							$( elems, this[i] ).remove();
						}	
					} 
				} else {
					var i = len;
					while ( i > 0 ) {
						i--;
						this[ i ].parentNode.removeChild( this[ i ] );
					}
					
				}
				return this;
			},
			/* ==============================
				css操作 设置 获取
			================================ */
			css: function ( attr, value ) {
				var len = this.length;
				
				if ( !len ) {
					return this;
				}

				var isDoc = $.isDocument( this[ 0 ] ),
					isAttr = (typeof attr === 'string'),
					isIn = ( value === undefined && isAttr ),
					strAttr;

				if(  isDoc || $.isWindow( this[ 0 ] ) ) {

					strAttr = attr.charAt(0).toUpperCase() + attr.slice(1);
					
					// if( isDoc ) {
					// 	var doc = this[ 0 ].documentElement;
					// 	var docSize = Math.max(
					// 		this[ 0 ].body[ "scroll" + strAttr ], 
					// 		doc[ "scroll" + strAttr ],
					// 		this[ 0 ].body[ "offset" + strAttr ], 
					// 		doc[ "offset" + strAttr ],
					// 		doc[ "client" + strAttr ]
					// 	);
					// }
					if ( value !== undefined ) {
						return this;
					}
					return isDoc ? this[ 0 ].documentElement[ 'offset' + strAttr ] : window[ 'inner' + strAttr ];
				}
						
				if ( isIn ) {
					
					var o = this[ 0 ], 
					style = o.style[ attr ];

					return style ? style : window.getComputedStyle( o, null )[ attr ];
					
				} else {
					if( $.isObject( attr ) && !$.isEmptyObject( attr ) ) {
						for (var i = 0; i < len; i++) {
							for ( var n in attr ) {
								this[ i ].style[ n ] = _addPx( n, attr[ n ] );
							}
						}
					} else {
						for (var i = 0; i < len; i++) {
							
							this[ i ].style[ attr ] = _addPx( attr, value );
							
						}
					}
				}
				return this;
			},
			offset: function() {
				var obj;
				if (this.length === 0) {
					return this;
				}
					
				if ( $.isWindow( this[ 0 ] ) ) {
					return {
						left: 0,
						top: 0,
						right: 0,
						bottom: 0,
						width: window.innerWidth,
						height: window.innerHeight
					};
				} else {
					obj = this[0].getBoundingClientRect();
				}
					
				return {
					left: obj.left + window.pageXOffset,
					top: obj.top + window.pageYOffset,
					right: obj.right + window.pageXOffset,
					bottom: obj.bottom + window.pageYOffset,
					width: this.css( 'width' ),
					height: this.css( 'height' ), 
					outerWidth: obj.right - obj.left,
					outerHeight: obj.bottom - obj.top
				};
			},
			/* ==============================
				class验证
			================================ */
			hasClass: function ( cls ) {
				var i = 0,
					len = this.length
				for ( ; i < len; i++ ) {
					return this[ i ].nodeType === 1 && this[ i ].classList.contains( cls );
				}
			},
			/* ==============================
				属性 html value 操作
			================================ */
			attr: function ( name, val ) {
				var i = 0, 
					len = this.length,
					agsLen = arguments.length,
					nType = (typeof name === 'string'),
					me = this;

				var o = {
					name: false,
					type: false
				}
					
				if ( nType && agsLen === 1 )	{ // 获取

					return this[ 0 ].getAttribute( name );

				} else if ( nType && agsLen === 2 && val !== undefined ) { //设置单个属性

					for ( ; i < len; i++ ) {
						if ( o[name] !== false ) {
							this[ i ].setAttribute( name, val );
						}
						
					}
				} else if ( $.isObject( name ) && !$.isEmptyObject( name ) && $.isPlainObject( name ) && agsLen === 1 ) { // 设置多个属性
					
					for ( ; i < len; i++ ) {
						for ( var n in name ) {
							this[ i ].setAttribute( n , name[ n ] )	
						}
					}
				}
				
				return this;
			},
			removeAttr: function ( name ) {
				var i = 0, j = 0,
					len = this.length,
					nName = name.match( rword ),
					nLen = nName.length;

				var o = {
					name: false,
					type: false
				}
				
				for ( ; i < len; i++ ) {
					if ( this[ i ].nodeType === 1 ) {
						for ( ; j < nLen; j++  ) {
							if ( o[ nName[ j ] ] !== false ) {
								this[ i ].removeAttribute( nName[ j ] );
							}
						}
					}
				}					

				return this;
			},
			hasAttr: function ( name ) {
				var i = 0,
					len = this.length;

				for ( ; i < len; i++ ) {
					if( this[ i ].nodeType == 1 && this[ i ].hasAttribute( name ) ) {
						return true
					}
				}

				return false;
			},
			/* ==============================
				instanceof 合并
			================================ */
			add: function ( second ) {
				return $.add( this, second );
			}
		};
		$.each(['width', 'height'], function ( i, attr ) {
			$.fn[ attr ] = function ( value ) {
				if ( value === undefined ) {
					return this.css( attr );
				} else {
					this.css( attr, value )
				}
				return this;
			}
		});
		$.each(['outerWidth', 'outerHeight'], function ( i, attr ) {
			$.fn[ attr ] = function () {
				return this.offset()[ attr ]+'px';
			}
		});
		/* ==============================
			val html方法, 设置  获取 value html 
		================================ */
		$.each({val:'value', html:'innerHTML'}, function ( name, attr ){

			$.fn[ name ] = function ( value ) {
				var i = 0, 
					len = this.length;
				if( value !== undefined ) {
					for ( ; i < len; i++ ) {
						this[ i ][ attr ] = value;
					}
					return this;
				} else {
					return this[ 0 ][ attr ];
				}
			}
		});
		/**
		 * $() 实例对象
		 * $('.bbb').prev(), 返回 bbb 的上一个元素
		 * $().next() 
		 * 
		 * $('.bbb').first() 返回大儿子
		 * $().last() 
		 *
		 * return $();
		 */
		$.each( getNodeMap, function ( name, val ) {
			$.fn[ name ] = function () {
				if ( this.length === 0 ) {
					return this;
				}
				var v = val( this[ 0 ] );
				return v ? $( v ) : this;
			}
		});
		/* ==============================
				样式 添加  删除
		================================ */
		/**
		 * $().addClass('aaa bbb');
		 * $().removeClass('aaa bbb'); 
		 * @param  { string } cls 'aaa bbb'
		 * @return $();
		 */
		'add remove'.replace(rword, function( method ){
			$.fn[ method + 'Class' ] = function ( cls ) {
				var me = this;
				if ( cls && typeof cls === 'string' ) {
					if( cls.charAt(0) == '.' ) {
						cls = cls.substr( 1 );
					}
					for ( var i = 0; i < this.length; i++ ) {
						cls.replace(rnospaces, function ( c ) {
							me[ i ].classList[ method ]( c )
						});
					}
				}
				return this;
			}
		});
		/* ==============================
			显示 隐藏, 需要保存节点display默认属性
		================================ */
		var showHideHandleAttr = function ( elem ) {
			var id  = $.cache.getGid( elem )
			var set;
			if( !$.cache.elemOldStatus[ id ] ) {
				set = $.cache.elemOldStatus[ id ] = $.cache.elemOldStatus[ id ] ? $.cache.elemOldStatus[ id ] : [];
				set[ 0 ] = $(elem).css('display');
			}
			return id;
		};
		$.fn.show = function ( fn ) {
			var len = this.length;
			if( !len ) {
				return this;
			}
			var id, val, nv ;
			for ( var i = 0; i < len; i++ ) {
				id = showHideHandleAttr( this[ i ] );
				val = $.cache.elemOldStatus[ id ][ 0 ];
				
				if( val == 'none' ) {
					switch( this[ i ].tagName.toLowerCase() ) {
						case 'span':
						case 'a':
						case 'em':
						case 'i':
						case 'b':
						case 'strong':
							nv = 'inline';
						break;
						default:
							nv = 'block';
					}
				} else if ( val == 'inline' || val == 'inline-block' || val == 'flex' || val == '-webkit-flex' || val == '-moz-flex' || val == '-ms-flex' ) {
					nv = val;
				} else {
					nv = 'block';
				}

				this[ i ].style.display = nv;
				if ( fn &&  this[ i ].style !== 'none' ) {
					fn.call(this[ i ]);
				}
			}

			return this;
		};
		$.fn.hide = function ( fn ) {
			var len = this.length;
			if( !len ) {
				return this;
			}
			var id;
			for ( var i = 0; i < len; i++ ) {
				id = showHideHandleAttr( this[ i ] );
				this[ i ].style.display = 'none';
				
				if ( fn &&  this[ i ].style === 'none' ) {
					fn.call(this[ i ]);
				}
			}
			return this;
		};
		
		return $;
	})(window);
	'$' in window || ( window.$ = $$$ );
}
(function ( $, window, userAgent ) {
	"use strict";
	$.os = (function (){
		// console.log( userAgent )
		var o = {};
		// var matchAgent = userAgent.match(/shouxiner[\s\S]+$/);
		// var userAgentToShouxinerVersion = matchAgent ? matchAgent[0] : null;

			   o.webkit  =  userAgent.match(/WebKit\/([\d.]+)/) ? true : false;
			  o.android  =  userAgent.match(/(Android)\s+([\d.]+)/) || userAgent.match(/Silk-Accelerated/) ? true : false;
		   o.androidICS  =  o.android && userAgent.match(/(Android)\s4/) ? true : false;
				 o.ipad  =  userAgent.match(/(iPad).*OS\s([\d_]+)/) ? true : false;
			   o.iphone  =  !o.ipad && userAgent.match(/(iPhone\sOS)\s([\d_]+)/) ? true : false;
				 o.ios7  =  (o.ipad||o.iphone)&&userAgent.match(/7_/) ? true : false;
				 // o.iosVersion = (o.ipad||o.iphone) ? 
				o.webos  =  userAgent.match(/(webOS|hpwOS)[\s\/]([\d.]+)/) ? true : false;
			 o.touchpad  =  o.webos && userAgent.match(/TouchPad/) ? true : false;
				  o.ios  =  o.ipad || o.iphone;
			 o.playbook  =  userAgent.match(/PlayBook/) ? true : false;
		 o.blackberry10  =  userAgent.match(/BB10/) ? true : false;
		   o.blackberry  =  o.playbook || o.blackberry10|| userAgent.match(/BlackBerry/) ? true : false;
			   o.chrome  =  userAgent.match(/Chrome/) ? true : false;
				o.opera  =  userAgent.match(/Opera/) ? true : false;
			   o.fennec  =  userAgent.match(/fennec/i) ? true : userAgent.match(/Firefox/) ? true : false;
				   o.ie  =  userAgent.match(/MSIE 10.0/i)||userAgent.match(/Trident\/7/i) ? true : false;
			  o.ieTouch  =  o.ie && userAgent.toLowerCase().match(/touch/i) ? true : false;
				o.tizen  =  userAgent.match(/Tizen/i)?true:false;
		o.supportsTouch  =  ((window.DocumentTouch && document instanceof window.DocumentTouch) || "ontouchstart" in window);
			   o.kindle  =  userAgent.match(/Silk-Accelerated/)?true:false;

					if ( o.android && !o.webkit ) {
						o.android = false;
					}
		return o;
	})();
})( $$$ , window, navigator.userAgent);
//==================================================
// avalon.mobile 1.3.1 2014.6.12，mobile 注意： 只能用于IE10及高版本的标准浏览器
//==================================================
(function($, DOC) {
    var prefix = "ms-"
    var expose = Date.now()
    var subscribers = "$" + expose
    var window = this || (0, eval)('this')
    var otherRequire = window.require
    var otherDefine = window.define
    var stopRepeatAssign = false
    var rword = /[^, ]+/g //切割字符串为一个个小块，以空格或豆号分开它们，结合replace实现字符串的forEach
    var rcomplextype = /^(?:object|array)$/
    var rwindow = /^\[object (Window|DOMWindow|global)\]$/
    var oproto = Object.prototype
    var ohasOwn = oproto.hasOwnProperty
    var serialize = oproto.toString
    var ap = Array.prototype
    var aslice = ap.slice
    var Registry = {} //将函数曝光到此对象上，方便访问器收集依赖
    var head = DOC.head //HEAD元素
    var root = DOC.documentElement
    var hyperspace = DOC.createDocumentFragment()
    var cinerator = DOC.createElement("div")
    var class2type = {}
    "Boolean Number String Function Array Date RegExp Object Error".replace(rword, function(name) {
        class2type["[object " + name + "]"] = name.toLowerCase()
    })

    function noop() {
    }

    function log(a) {
        if (avalon.config.debug) {
            console.log(a)
        }
    }

    /*********************************************************************
     *                 命名空间与工具函数                                 *
     **********************************************************************/
    window.avalon = function(el) { //创建jQuery式的无new 实例化结构
        return new avalon.init(el)
    }
    avalon.init = function(el) {
        this[0] = this.element = el
    }
    avalon.fn = avalon.prototype = avalon.init.prototype

    /*取得目标类型*/
    function getType(obj) { //
        if (obj == null) {
            return String(obj)
        }
        // 早期的webkit内核浏览器实现了已废弃的ecma262v4标准，可以将正则字面量当作函数使用，因此typeof在判定正则时会返回function
        return typeof obj === "object" || typeof obj === "function" ?
                class2type[serialize.call(obj)] || "object" :
                typeof obj
    }
    avalon.type = getType
    avalon.isWindow = function(obj) {
        return rwindow.test(serialize.call(obj))
    }

    /*判定是否是一个朴素的javascript对象（Object），不是DOM对象，不是BOM对象，不是自定义类的实例*/

    avalon.isPlainObject = function(obj) {
        return !!obj && typeof obj === "object" && Object.getPrototypeOf(obj) === oproto
    }

    avalon.mix = avalon.fn.mix = function() {
        var options, name, src, copy, copyIsArray, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false

        // 如果第一个参数为布尔,判定是否深拷贝
        if (typeof target === "boolean") {
            deep = target
            target = arguments[1] || {}
            i++
        }

        //确保接受方为一个复杂的数据类型
        if (typeof target !== "object" && getType(target) !== "function") {
            target = {}
        }

        //如果只有一个参数，那么新成员添加于mix所在的对象上
        if (i === length) {
            target = this
            i--
        }

        for (; i < length; i++) {
            //只处理非空参数
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name]
                    copy = options[name]

                    // 防止环引用
                    if (target === copy) {
                        continue
                    }
                    if (deep && copy && (avalon.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false
                            clone = src && Array.isArray(src) ? src : []

                        } else {
                            clone = src && avalon.isPlainObject(src) ? src : {}
                        }

                        target[name] = avalon.mix(deep, clone, copy)
                    } else if (copy !== void 0) {
                        target[name] = copy
                    }
                }
            }
        }
        return target
    }

    function resetNumber(a, n, end) { //用于模拟slice, splice的效果
        if ((a === +a) && !(a % 1)) { //如果是整数
            if (a < 0) { //范围调整为 [-a, a]
                a = a * -1 >= n ? 0 : a + n
            } else {
                a = a > n ? n : a
            }
        } else {
            a = end ? n : 0
        }
        return a
    }

    function oneObject(array, val) {
        if (typeof array === "string") {
            array = array.match(rword) || []
        }
        var result = {},
                value = val !== void 0 ? val : 1
        for (var i = 0, n = array.length; i < n; i++) {
            result[array[i]] = value
        }
        return result
    }
    avalon.mix({
        rword: rword,
        subscribers: subscribers,
        version: 1.31,
        ui: {},
        models: {},
        log: log,
        noop: noop,
        error: function(str, e) { //如果不用Error对象封装一下，str在控制台下可能会乱码
            throw new (e || Error)(str)
        },
        oneObject: oneObject,
        /* avalon.range(10)
         => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
         avalon.range(1, 11)
         => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
         avalon.range(0, 30, 5)
         => [0, 5, 10, 15, 20, 25]
         avalon.range(0, -10, -1)
         => [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
         avalon.range(0)
         => []*/
        range: function(start, end, step) { // 用于生成整数数组
            step || (step = 1)
            if (end == null) {
                end = start || 0
                start = 0
            }
            var index = -1,
                    length = Math.max(0, Math.ceil((end - start) / step)),
                    result = Array(length)
            while (++index < length) {
                result[index] = start
                start += step
            }
            return result
        },
        slice: function(nodes, start, end) {
            return aslice.call(nodes, start, end)
        },
        contains: function(a, b) {
            return a.contains(b)
        },
        eventHooks: {},
        bind: function(el, type, fn, phase) {
            var hooks = avalon.eventHooks
            var hook = hooks[type]
            if (typeof hook === "object") {
                type = hook.type
                if (hook.deel) {
                    fn = hook.deel(el, fn)
                }
            }
            el.addEventListener(type, fn, !!phase)
            return fn
        },
        unbind: function(el, type, fn, phase) {
            var hooks = avalon.eventHooks
            var hook = hooks[type]
            if (typeof hook === "object") {
                type = hook.type
            }
            el.removeEventListener(type, fn || noop, !!phase)
        },
        fire: function(el, name) {
            var event = DOC.createEvent("Events")
            event.initEvent(name, true, true)
            el.dispatchEvent(event)
        },
        css: function(node, name, value) {
            if (node instanceof avalon) {
                node = node[0]
            }
            var prop = /[_-]/.test(name) ? camelize(name) : name
            name = avalon.cssName(prop) || prop
            if (value === void 0 || typeof value === "boolean") { //获取样式
                var fn = cssHooks[prop + ":get"] || cssHooks["@:get"]
                var val = fn(node, name)
                return value === true ? parseFloat(val) || 0 : val
            } else if (value === "") { //请除样式
                node.style[name] = ""
            } else { //设置样式
                if (value == null || value !== value) {
                    return
                }
                if (isFinite(value) && !avalon.cssNumber[prop]) {
                    value += "px"
                }
                fn = cssHooks[prop + ":set"] || cssHooks["@:set"]
                fn(node, name, value)
            }
        },
        each: function(obj, fn) {
            if (obj) { //排除null, undefined
                var i = 0
                if (isArrayLike(obj)) {
                    for (var n = obj.length; i < n; i++) {
                        fn(i, obj[i])
                    }
                } else {
                    for (i in obj) {
                        if (obj.hasOwnProperty(i)) {
                            fn(i, obj[i])
                        }
                    }
                }
            }
        },
        getWidgetData: function(elem, prefix) {
            var raw = avalon(elem).data()
            var result = {}
            for (var i in raw) {
                if (i.indexOf(prefix) === 0) {
                    result[i.replace(prefix, "").replace(/\w/, function(a) {
                        return a.toLowerCase()
                    })] = raw[i]
                }
            }
            return result
        },
        parseJSON: JSON.parse,
        Array: {
            /*只有当前数组不存在此元素时只添加它*/
            ensure: function(target, item) {
                if (target.indexOf(item) === -1) {
                    target.push(item)
                }
                return target
            },
            /*移除数组中指定位置的元素，返回布尔表示成功与否*/
            removeAt: function(target, index) {
                return !!target.splice(index, 1).length
            },
            /*移除数组中第一个匹配传参的那个元素，返回布尔表示成功与否*/
            remove: function(target, item) {
                var index = target.indexOf(item)
                if (~index)
                    return avalon.Array.removeAt(target, index)
                return false
            }
        }
    })
    /*生成UUID http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript*/
    function generateID() {
        return "avalon" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    }

    /*判定是否类数组，如节点集合，纯数组，arguments与拥有非负整数的length属性的纯JS对象*/
    function isArrayLike(obj) {
        if (obj && typeof obj === "object") {
            var n = obj.length,
                    str = serialize.call(obj)
            if (/(Array|List|Collection|Map|Arguments)\]$/.test(str)) {
                return true
            } else if (str === "[object Object]" && (+n === n && !(n % 1) && n >= 0)) {
                return true //由于ecma262v5能修改对象属性的enumerable，因此不能用propertyIsEnumerable来判定了
            }
        }
        return false
    }
    avalon.isArrayLike = isArrayLike
    /*视浏览器情况采用最快的异步回调*/
    avalon.nextTick = window.setImmediate ? setImmediate.bind(window) : function(callback) {
        setTimeout(callback, 0)
    }
    if (!root.contains) { //safari5+是把contains方法放在Element.prototype上而不是Node.prototype
        Node.prototype.contains = function(arg) {
            return !!(this.compareDocumentPosition(arg) & 16)
        }
    }

    /*********************************************************************
     *                           modelFactory                              *
     **********************************************************************/
    var VMODELS = avalon.vmodels = {}
    avalon.define = function(id, factory) {
        if (VMODELS[id]) {
            log("warning: " + id + " 已经存在于avalon.vmodels中")
        }
        var scope = {
            $watch: noop
        }
        factory(scope) //得到所有定义
        var model = modelFactory(scope) //偷天换日，将scope换为model
        stopRepeatAssign = true
        factory(model)
        stopRepeatAssign = false
        model.$id = id
        return VMODELS[id] = model
    }

    function modelFactory(scope, model) {
        if (Array.isArray(scope)) {
            var arr = scope.concat() //原数组的作为新生成的监控数组的$model而存在
            scope.length = 0
            var collection = Collection(scope)
            collection.push.apply(collection, arr)
            return collection
        }
        if (typeof scope.nodeType === "number") {
            return scope
        }
        var vmodel = {} //要返回的对象
        model = model || {} //放置$model上的属性
        var accessingProperties = {} //监控属性
        var normalProperties = {} //普通属性
        var computedProperties = [] //计算属性
        var watchProperties = arguments[2] || {} //强制要监听的属性
        var skipArray = scope.$skipArray //要忽略监控的属性
        for (var i = 0, name; name = skipProperties[i++]; ) {
            delete scope[name]
            normalProperties[name] = true
        }
        if (Array.isArray(skipArray)) {
            for (var i = 0, name; name = skipArray[i++]; ) {
                normalProperties[name] = true
            }
        }
        for (var i in scope) {
            loopModel(i, scope[i], model, normalProperties, accessingProperties, computedProperties, watchProperties)
        }
        vmodel = Object.defineProperties(vmodel, descriptorFactory(accessingProperties)) //生成一个空的ViewModel
        for (var name in normalProperties) {
            vmodel[name] = normalProperties[name]
        }
        watchProperties.vmodel = vmodel
        vmodel.$model = model
        vmodel.$events = {}
        vmodel.$id = generateID()
        vmodel.$accessors = accessingProperties
        vmodel[subscribers] = []
        for (var i in Observable) {
            vmodel[i] = Observable[i]
        }
        Object.defineProperty(vmodel, "hasOwnProperty", {
            value: function(name) {
                return name in vmodel.$model
            },
            writable: false,
            enumerable: false,
            configurable: true
        })
        for (var i = 0, fn; fn = computedProperties[i++]; ) { //最后强逼计算属性 计算自己的值
            Registry[expose] = fn
            fn()
            collectSubscribers(fn)
            delete Registry[expose]
        }
        return vmodel
    }
    var skipProperties = String("$id,$watch,$unwatch,$fire,$events,$model,$skipArray,$accessors," + subscribers).match(rword)

    var isEqual = Object.is || function(v1, v2) {
        if (v1 === 0 && v2 === 0) {
            return 1 / v1 === 1 / v2
        } else if (v1 !== v1) {
            return v2 !== v2
        } else {
            return v1 === v2;
        }
    }

    function safeFire(a, b, c, d) {
        if (a.$events) {
            Observable.$fire.call(a, b, c, d)
        }
    }

    function descriptorFactory(obj) {
        var descriptors = {}
        for (var i in obj) {
            descriptors[i] = {
                get: obj[i],
                set: obj[i],
                enumerable: true,
                configurable: true
            }
        }
        return descriptors
    }

    function loopModel(name, val, model, normalProperties, accessingProperties, computedProperties, watchProperties) {
        model[name] = val
        if (normalProperties[name] || (val && val.nodeType)) { //如果是元素节点或在全局的skipProperties里或在当前的$skipArray里
            return normalProperties[name] = val
        }
        if (name[0] === "$" && !watchProperties[name]) { //如果是$开头，并且不在watchProperties里
            return normalProperties[name] = val
        }
        var valueType = getType(val)
        if (valueType === "function") { //如果是函数，也不用监控
            return normalProperties[name] = val
        }
        var accessor, oldArgs
        if (valueType === "object" && typeof val.get === "function" && Object.keys(val).length <= 2) {
            var setter = val.set,
                    getter = val.get
            accessor = function(newValue) { //创建计算属性，因变量，基本上由其他监控属性触发其改变
                var vmodel = watchProperties.vmodel
                var value = model[name],
                        preValue = value
                if (arguments.length) {
                    if (stopRepeatAssign) {
                        return
                    }
                    if (typeof setter === "function") {
                        var backup = vmodel.$events[name]
                        vmodel.$events[name] = [] //清空回调，防止内部冒泡而触发多次$fire
                        setter.call(vmodel, newValue)
                        vmodel.$events[name] = backup
                    }
                    if (!isEqual(oldArgs, newValue)) {
                        oldArgs = newValue
                        newValue = model[name] = getter.call(vmodel) //同步$model
                        withProxyCount && updateWithProxy(vmodel.$id, name, newValue) //同步循环绑定中的代理VM
                        notifySubscribers(accessor) //通知顶层改变
                        safeFire(vmodel, name, newValue, preValue) //触发$watch回调
                    }
                } else {
                    if (avalon.openComputedCollect) { // 收集视图刷新函数
                        collectSubscribers(accessor)
                    }
                    newValue = model[name] = getter.call(vmodel)
                    if (!isEqual(value, newValue)) {
                        oldArgs = void 0
                        safeFire(vmodel, name, newValue, preValue)
                    }
                    return newValue
                }
            }
            computedProperties.push(accessor)
        } else if (rcomplextype.test(valueType)) {
            accessor = function(newValue) { //子ViewModel或监控数组
                var realAccessor = accessor.$vmodel,
                        preValue = realAccessor.$model
                if (arguments.length) {
                    if (stopRepeatAssign) {
                        return
                    }
                    if (!isEqual(preValue, newValue)) {
                        newValue = accessor.$vmodel = updateVModel(realAccessor, newValue, valueType)
                        var fn = rebindings[newValue.$id]
                        fn && fn() //更新视图
                        var parent = watchProperties.vmodel
                        model[name] = newValue.$model //同步$model
                        notifySubscribers(realAccessor) //通知顶层改变
                        safeFire(parent, name, model[name], preValue) //触发$watch回调
                    }
                } else {
                    collectSubscribers(realAccessor) //收集视图函数
                    return realAccessor
                }
            }
            accessor.$vmodel = val.$model ? val : modelFactory(val, val)
            model[name] = accessor.$vmodel.$model
        } else {
            accessor = function(newValue) { //简单的数据类型
                var preValue = model[name]
                if (arguments.length) {
                    if (!isEqual(preValue, newValue)) {
                        model[name] = newValue //同步$model
                        var vmodel = watchProperties.vmodel
                        withProxyCount && updateWithProxy(vmodel.$id, name, newValue) //同步循环绑定中的代理VM
                        notifySubscribers(accessor) //通知顶层改变
                        safeFire(vmodel, name, newValue, preValue) //触发$watch回调
                    }
                } else {
                    collectSubscribers(accessor) //收集视图函数
                    return preValue
                }
            }
            model[name] = val
        }
        accessor[subscribers] = [] //订阅者数组
        accessingProperties[name] = accessor
    }
    //with绑定生成的代理对象储存池
    var withProxyPool = {}
    var withProxyCount = 0
    var rebindings = {}

    function updateWithProxy($id, name, val) {
        var pool = withProxyPool[$id]
        if (pool && pool[name]) {
            pool[name].$val = val
        }
    }

    function updateVModel(a, b, valueType) {
        //a为原来的VM， b为新数组或新对象
        if (valueType === "array") {
            if (!Array.isArray(b)) {
                return a //fix https://github.com/RubyLouvre/avalon/issues/261
            }
            var bb = b.concat()
            a.clear()
            a.push.apply(a, bb)
            return a
        } else {
            var iterators = a[subscribers] || []
            if (withProxyPool[a.$id]) {
                withProxyCount--
                delete withProxyPool[a.$id]
            }
            var ret = modelFactory(b)
            rebindings[ret.$id] = function(data) {
                while (data = iterators.shift()) {
                    (function(el) {
                        if (el.type) {
                            avalon.nextTick(function() {
                                el.rollback && el.rollback()
                                bindingHandlers[el.type](el, el.vmodels)
                            })
                        }
                    })(data)
                }
                delete rebindings[ret.$id]
            }
            return ret
        }
    }

    /*********************************************************************
     *                       配置模块                                   *
     **********************************************************************/

    function kernel(settings) {
        for (var p in settings) {
            if (!ohasOwn.call(settings, p))
                continue
            var val = settings[p]
            if (typeof kernel.plugins[p] === "function") {
                kernel.plugins[p](val)
            } else if (typeof kernel[p] === "object") {
                avalon.mix(kernel[p], val)
            } else {
                kernel[p] = val
            }
        }
        return this
    }
    var openTag, closeTag, rexpr, rexprg, rbind, rregexp = /[-.*+?^${}()|[\]\/\\]/g
    /*将字符串安全格式化为正则表达式的源码 http://stevenlevithan.com/regex/xregexp/*/
    function escapeRegExp(target) {
        return (target + "").replace(rregexp, "\\$&")
    }
    var plugins = {
        loader: function(builtin) {
            window.define = builtin ? innerRequire.define : otherDefine
            window.require = builtin ? innerRequire : otherRequire
        },
        interpolate: function(array) {
            openTag = array[0]
            closeTag = array[1]
            if (openTag === closeTag) {
                avalon.error("openTag!==closeTag", SyntaxError)
            } else if (array + "" === "<!--,-->") {
                kernel.commentInterpolate = true
            } else {
                var test = openTag + "test" + closeTag
                cinerator.innerHTML = test
                if (cinerator.innerHTML !== test && cinerator.innerHTML.indexOf("&lt;") >= 0) {
                    avalon.error("此定界符不合法", SyntaxError)
                }
                cinerator.innerHTML = ""
            }
            var o = escapeRegExp(openTag),
                    c = escapeRegExp(closeTag)
            rexpr = new RegExp(o + "(.*?)" + c)
            rexprg = new RegExp(o + "(.*?)" + c, "g")
            rbind = new RegExp(o + ".*?" + c + "|\\sms-")
        }
    }
    kernel.debug = false
    kernel.plugins = plugins
    kernel.plugins['interpolate'](["{{", "}}"])
    kernel.paths = {}
    kernel.shim = {}
    kernel.maxRepeatSize = 100
    avalon.config = kernel

    /*********************************************************************
     *                           DOM API的高级封装                        *
     **********************************************************************/

    if (window.SVGElement && !("innerHTML" in
            document.createElementNS("'http://www.w3.org/2000/svg", "svg"))) {
        Object.defineProperty(SVGElement.prototype, "outerHTML", {
            get: function() {
                return new XMLSerializer().serializeToString(this)
            }
        })
        Object.defineProperty(SVGElement.prototype, "innerHTML", {
            get: function() {
                var s = this.outerHTML
                var ropen = new RegExp("<" + this.nodeName + '\\b(?:(["\'])[^"]*?(\\1)|[^>])*>', "i")
                var rclose = new RegExp("<\/" + this.nodeName + ">$", "i")
                return  s.replace(ropen, "").replace(rclose, "")
            }
        })
    }
    /*转换为连字符线风格*/
    function hyphen(target) {
        return target.replace(/([a-z\d])([A-Z]+)/g, "$1-$2").toLowerCase()
    }
    /*转换为驼峰风格*/
    function camelize(target) {
        if (target.indexOf("-") < 0 && target.indexOf("_") < 0) {
            return target //提前判断，提高getStyle等的效率
        }
        return target.replace(/[-_][^-_]/g, function(match) {
            return match.charAt(1).toUpperCase()
        })
    }

    var rnospaces = /\S+/g

    avalon.fn.mix({
        hasClass: function(cls) {
            var el = this[0] || {} //IE10+, chrome8+, firefox3.6+, safari5.1+,opera11.5+支持classList,chrome24+,firefox26+支持classList2.0
            return el.nodeType === 1 && el.classList.contains(cls)
        },
        toggleClass: function(value, stateVal) {
            var state = stateVal,
                    className, i = 0
            var classNames = value.match(rnospaces) || []
            var isBool = typeof stateVal === "boolean"
            var node = this[0] || {}, classList
            if (classList = node.classList) {
                while ((className = classNames[i++])) {
                    state = isBool ? state : !classList.contains(className)
                    classList[state ? "add" : "remove"](className)
                }
            }
            return this
        },
        attr: function(name, value) {
            if (arguments.length === 2) {
                this[0].setAttribute(name, value)
                return this
            } else {
                return this[0].getAttribute(name)
            }
        },
        data: function(name, value) {
            name = "data-" + hyphen(name || "")
            switch (arguments.length) {
                case 2:
                    this.attr(name, value)
                    return this
                case 1:
                    var val = this.attr(name)
                    return parseData(val)
                case 0:
                    var ret = {}
                    ap.forEach.call(this[0].attributes, function(attr) {
                        if (attr) {
                            name = attr.name
                            if (!name.indexOf("data-")) {
                                name = camelize(name.slice(5))
                                ret[name] = parseData(attr.value)
                            }
                        }
                    })
                    return ret
            }
        },
        removeData: function(name) {
            name = "data-" + hyphen(name)
            this[0].removeAttribute(name)
            return this
        },
        css: function(name, value) {
            if (avalon.isPlainObject(name)) {
                for (var i in name) {
                    avalon.css(this, i, name[i])
                }
            } else {
                var ret = avalon.css(this, name, value)
            }
            return ret !== void 0 ? ret : this
        },
        position: function() {
            var offsetParent, offset,
                    elem = this[0],
                    parentOffset = {
                        top: 0,
                        left: 0
                    };
            if (!elem) {
                return
            }
            if (this.css("position") === "fixed") {
                offset = elem.getBoundingClientRect()
            } else {
                offsetParent = this.offsetParent() //得到真正的offsetParent
                offset = this.offset() // 得到正确的offsetParent
                if (offsetParent[0].tagName !== "HTML") {
                    parentOffset = offsetParent.offset()
                }
                parentOffset.top += avalon.css(offsetParent[0], "borderTopWidth", true)
                parentOffset.left += avalon.css(offsetParent[0], "borderLeftWidth", true)
            }
            return {
                top: offset.top - parentOffset.top - avalon.css(elem, "marginTop", true),
                left: offset.left - parentOffset.left - avalon.css(elem, "marginLeft", true)
            }
        },
        offsetParent: function() {
            var offsetParent = this[0].offsetParent || root
            while (offsetParent && (offsetParent.tagName !== "HTML") && avalon.css(offsetParent, "position") === "static") {
                offsetParent = offsetParent.offsetParent
            }
            return avalon(offsetParent || root)
        },
        bind: function(type, fn, phase) {
            if (this[0]) { //此方法不会链
                return avalon.bind(this[0], type, fn, phase)
            }
        },
        unbind: function(type, fn, phase) {
            if (this[0]) {
                avalon.unbind(this[0], type, fn, phase)
            }
            return this
        },
        val: function(value) {
            var node = this[0]
            if (node && node.nodeType === 1) {
                var get = arguments.length === 0
                var access = get ? ":get" : ":set"
                var fn = valHooks[getValType(node) + access]
                if (fn) {
                    var val = fn(node, value)
                } else if (get) {
                    return (node.value || "").replace(/\r/g, "")
                } else {
                    node.value = value
                }
            }
            return get ? val : this
        }
    })

    "add,remove".replace(rword, function(method) {
        avalon.fn[method + "Class"] = function(cls) {
            var el = this[0]
            //https://developer.mozilla.org/zh-CN/docs/Mozilla/Firefox/Releases/26
            if (cls && typeof cls === "string" && el && el.nodeType == 1) {
                cls.replace(rnospaces, function(c) {
                    el.classList[method](c)
                })
            }
            return this
        }
    })

    if (root.dataset) {
        avalon.data = function(name, val) {
            var dataset = this[0].dataset
            switch (arguments.length) {
                case 2:
                    dataset[name] = val
                    return this
                case 1:
                    val = dataset[name]
                    return parseData(val)
                case 0:
                    var ret = {}
                    for (var name in dataset) {
                        ret[name] = parseData(dataset[name])
                    }
                    return ret
            }
        }
    }
    var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/

    function parseData(data) {
        try {
            data = data === "true" ? true :
                    data === "false" ? false :
                    data === "null" ? null : +data + "" === data ? +data : rbrace.test(data) ? JSON.parse(data) : data
        } catch (e) {
        }
        return data
    }
    avalon.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(method, prop) {
        avalon.fn[method] = function(val) {
            var node = this[0] || {}, win = getWindow(node),
                    top = method === "scrollTop"
            if (!arguments.length) {
                return win ? win[prop] : node[method]
            } else {
                if (win) {
                    win.scrollTo(!top ? val : avalon(win).scrollLeft(), top ? val : avalon(win).scrollTop())
                } else {
                    node[method] = val
                }
            }
        }
    })


    function getWindow(node) {
        return node.window && node.document ? node : node.nodeType === 9 ? node.defaultView : false
    }
    //=============================css相关==================================
    var cssHooks = avalon.cssHooks = {}
    var prefixes = ["", "-webkit-", "-o-", "-moz-", "-ms-"]
    var cssMap = {
        "float": "cssFloat",
        background: "backgroundColor"
    }
    avalon.cssNumber = oneObject("columnCount,order,fillOpacity,fontWeight,lineHeight,opacity,orphans,widows,zIndex,zoom")

    avalon.cssName = function(name, host, camelCase) {
        if (cssMap[name]) {
            return cssMap[name]
        }
        host = host || root.style
        for (var i = 0, n = prefixes.length; i < n; i++) {
            camelCase = camelize(prefixes[i] + name)
            if (camelCase in host) {
                return (cssMap[name] = camelCase)
            }
        }
        return null
    }
    cssHooks["@:set"] = function(node, name, value) {
        node.style[name] = value
    }

    cssHooks["@:get"] = function(node, name) {
        if (!node || !node.style) {
            throw new Error("getComputedStyle要求传入一个节点 " + node)
        }
        var ret, styles = getComputedStyle(node, null)
        if (styles) {
            ret = styles.getPropertyValue(name)
            if (ret === "") {
                ret = node.style[name] //其他浏览器需要我们手动取内联样式
            }
        }
        return ret
    }
    cssHooks["opacity:get"] = function(node) {
        var ret = cssHooks["@:get"](node, "opacity")
        return ret === "" ? "1" : ret
    }

    "top,left".replace(rword, function(name) {
        cssHooks[name + ":get"] = function(node) {
            var computed = cssHooks["@:get"](node, name)
            return /px$/.test(computed) ? computed :
                    avalon(node).position()[name] + "px"
        }
    })
    var cssShow = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }
    var rdisplayswap = /^(none|table(?!-c[ea]).+)/

    function showHidden(node, array) {
        //http://www.cnblogs.com/rubylouvre/archive/2012/10/27/2742529.html
        if (node.offsetWidth <= 0) { //opera.offsetWidth可能小于0
            var styles = getComputedStyle(node, null)
            if (rdisplayswap.test(styles["display"])) {
                var obj = {
                    node: node
                }
                for (var name in cssShow) {
                    obj[name] = styles[name]
                    node.style[name] = cssShow[name]
                }
                array.push(obj)
            }
            var parent = node.parentNode
            if (parent && parent.nodeType == 1) {
                showHidden(parent, array)
            }
        }
    }

    "Width,Height".replace(rword, function(name) {
        var method = name.toLowerCase(),
                clientProp = "client" + name,
                scrollProp = "scroll" + name,
                offsetProp = "offset" + name
        cssHooks[method + ":get"] = function(node, which, override) {
            var boxSizing = "content-box"
            if (typeof override === "string") {
                boxSizing = override
            }
            which = name === "Width" ? ["Left", "Right"] : ["Top", "Bottom"]
            switch (boxSizing) {
                case "content-box":
                    return node["client" + name] - avalon.css(node, "padding" + which[0], true) -
                            avalon.css(node, "padding" + which[1], true)
                case "padding-box":
                    return node["client" + name]
                case "border-box":
                    return node["offset" + name]
                case "margin-box":
                    return node["offset" + name] + avalon.css(node, "margin" + which[0], true) +
                            avalon.css(node, "margin" + which[1], true)
            }
        }
        cssHooks[method + "&get"] = function(node) {
            var hidden = [];
            showHidden(node, hidden);
            var val = cssHooks[method + ":get"](node)
            for (var i = 0, obj; obj = hidden[i++]; ) {
                node = obj.node
                for (var n in obj) {
                    if (typeof obj[n] === "string") {
                        node.style[n] = obj[n]
                    }
                }
            }
            return val;
        }
        avalon.fn[method] = function(value) {
            var node = this[0]
            if (arguments.length === 0) {
                if (node.setTimeout) { //取得窗口尺寸,IE9后可以用node.innerWidth /innerHeight代替
                    //https://developer.mozilla.org/en-US/docs/Web/API/window.innerHeight
                    return node["inner" + name]
                }
                if (node.nodeType === 9) { //取得页面尺寸
                    var doc = node.documentElement
                    //FF chrome    html.scrollHeight< body.scrollHeight
                    //IE 标准模式 : html.scrollHeight> body.scrollHeight
                    //IE 怪异模式 : html.scrollHeight 最大等于可视窗口多一点？
                    return Math.max(node.body[scrollProp], doc[scrollProp], node.body[offsetProp], doc[offsetProp], doc[clientProp])
                }
                return cssHooks[method + "&get"](node)
            } else {
                return this.css(method, value)
            }
        }
        avalon.fn["inner" + name] = function() {
            return cssHooks[method + ":get"](this[0], void 0, "padding-box")
        }
        avalon.fn["outer" + name] = function(includeMargin) {
            return cssHooks[method + ":get"](this[0], void 0, includeMargin === true ? "margin-box" : "border-box")
        }
    })
    avalon.fn.offset = function() { //取得距离页面左右角的坐标
        var node = this[0], box = {
            left: 0,
            top: 0
        }
        if (!node || !node.tagName || !node.ownerDocument) {
            return box
        }
        var doc = node.ownerDocument,
                root = doc.documentElement,
                win = doc.defaultView
        if (!root.contains(node)) {
            return box
        }
        if (node.getBoundingClientRect !== void 0) {
            box = node.getBoundingClientRect()
        }
        return {
            top: box.top + win.pageYOffset - root.clientTop,
            left: box.left + win.pageXOffset - root.clientLeft
        }
    }
    //=============================val相关=======================

    function getValType(el) {
        var ret = el.tagName.toLowerCase()
        return ret === "input" && /checkbox|radio/.test(el.type) ? "checked" : ret
    }
    var valHooks = {
        "select:get": function(node, value) {
            var option, options = node.options,
                    index = node.selectedIndex,
                    one = node.type === "select-one" || index < 0,
                    values = one ? null : [],
                    max = one ? index + 1 : options.length,
                    i = index < 0 ? max : one ? index : 0
            for (; i < max; i++) {
                option = options[i]
                //旧式IE在reset后不会改变selected，需要改用i === index判定
                //我们过滤所有disabled的option元素，但在safari5下，如果设置select为disable，那么其所有孩子都disable
                //因此当一个元素为disable，需要检测其是否显式设置了disable及其父节点的disable情况
                if ((option.selected || i === index) && !option.disabled) {
                    value = option.value
                    if (one) {
                        return value
                    }
                    //收集所有selected值组成数组返回
                    values.push(value)
                }
            }
            return values
        },
        "select:set": function(node, values, optionSet) {
            values = [].concat(values) //强制转换为数组
            for (var i = 0, el; el = node.options[i++]; ) {
                if ((el.selected = values.indexOf(el.value) >= 0)) {
                    optionSet = true
                }
            }
            if (!optionSet) {
                node.selectedIndex = -1
            }
        }
    }

    /************************************************************************
     *                                parseHTML                                 *
     ****************************************************************************/
    var rtagName = /<([\w:]+)/,
            //取得其tagName
            rxhtml = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
            scriptTypes = oneObject("text/javascript", "text/ecmascript", "application/ecmascript", "application/javascript", "text/vbscript"),
            //需要处理套嵌关系的标签
            rnest = /<(?:tb|td|tf|th|tr|col|opt|leg|cap|area)/
    //parseHTML的辅助变量
    var tagHooks = new function() {
        avalon.mix(this, {
            option: DOC.createElement("select"),
            thead: DOC.createElement("table"),
            td: DOC.createElement("tr"),
            area: DOC.createElement("map"),
            tr: DOC.createElement("tbody"),
            col: DOC.createElement("colgroup"),
            legend: DOC.createElement("fieldset"),
            "*": DOC.createElement("div")
        })
        this.optgroup = this.option
        this.tbody = this.tfoot = this.colgroup = this.caption = this.thead
        this.th = this.td
    }

    avalon.clearHTML = function(node) {
        node.textContent = ""
        return node
    }
    var script = DOC.createElement("script")
    avalon.parseHTML = function(html) {
        if (typeof html !== "string") {
            html = html + ""
        }
        html = html.replace(rxhtml, "<$1></$2>").trim()
        if (deleteRange.createContextualFragment && !rnest.test(html) && !/<script/i.test(html)) {
            var range = DOC.createRange()
            range.selectNodeContents(root)
            return range.createContextualFragment(html)
        }
        var fragment = hyperspace.cloneNode(false)
        var tag = (rtagName.exec(html) || ["", ""])[1].toLowerCase()
        if (!(tag in tagHooks)) {
            tag = "*"
        }
        var parent = tagHooks[tag]
        parent.innerHTML = html
        var els = parent.getElementsByTagName("script"),
                firstChild, neo
        if (els.length) { //使用innerHTML生成的script节点不会发出请求与执行text属性
            for (var i = 0, el; el = els[i++]; ) {
                if (!el.type || scriptTypes[el.type]) { //如果script节点的MIME能让其执行脚本
                    neo = script.cloneNode(false) //FF不能省略参数
                    ap.forEach.call(el.attributes, function(attr) {
                        if (attr) {
                            neo[attr.name] = attr.value //复制其属性
                        }
                    })
                    neo.text = el.text //必须指定,因为无法在attributes中遍历出来
                    el.parentNode.replaceChild(neo, el) //替换节点
                }
            }
        }
        while (firstChild = parent.firstChild) { // 将wrapper上的节点转移到文档碎片上！
            fragment.appendChild(firstChild)
        }
        return fragment
    }
    avalon.innerHTML = function(node, html) {
        if (!/<script/i.test(html) && !rnest.test(html)) {
            node.innerHTML = html
        } else {
            var a = this.parseHTML(html)
            this.clearHTML(node).appendChild(a)
        }
    }
    /*********************************************************************
     *                           Observable                                 *
     **********************************************************************/
    var Observable = {
        $watch: function(type, callback) {
            if (typeof callback === "function") {
                var callbacks = this.$events[type]
                if (callbacks) {
                    callbacks.push(callback)
                } else {
                    this.$events[type] = [callback]
                }
            } else { //重新开始监听此VM的第一重简单属性的变动
                this.$events = this.$watch.backup
            }
            return this
        },
        $unwatch: function(type, callback) {
            var n = arguments.length
            if (n === 0) { //让此VM的所有$watch回调无效化
                this.$watch.backup = this.$events
                this.$events = {}
            } else if (n === 1) {
                this.$events[type] = []
            } else {
                var callbacks = this.$events[type] || []
                var i = callbacks.length
                while (~--i < 0) {
                    if (callbacks[i] === callback) {
                        return callbacks.splice(i, 1)
                    }
                }
            }
            return this
        },
        $fire: function(type) {
            var callbacks = this.$events[type] || [] //防止影响原数组
            var all = this.$events.$all || []
            var args = aslice.call(arguments, 1)
            for (var i = 0, callback; callback = callbacks[i++]; ) {
                callback.apply(this, args)
            }
            for (var i = 0, callback; callback = all[i++]; ) {
                callback.apply(this, arguments)
            }
        }
    }

    /*********************************************************************
     *                         依赖收集与触发                             *
     **********************************************************************/

    function registerSubscriber(data, val) {
        Registry[expose] = data //暴光此函数,方便collectSubscribers收集
        avalon.openComputedCollect = true
        var fn = data.evaluator
        if (fn) { //如果是求值函数
            if (data.type === "duplex") {
                data.handler()
            } else {
                try {
                    data.handler(fn.apply(0, data.args), data.element, data)
                } catch (e) {
                    delete data.evaluator
                    if (data.nodeType === 3) {
                        if (kernel.commentInterpolate) {
                            data.element.replaceChild(DOC.createComment(data.value), data.node)
                        } else {
                            data.node.data = openTag + data.value + closeTag
                        }
                    }
                    log("warning:evaluator of [" + data.value + "] throws error!")
                }
            }
        } else { //如果是计算属性的accessor
            data()
        }
        avalon.openComputedCollect = false
        delete Registry[expose]
    }
    /*收集依赖于这个访问器的订阅者*/
    function collectSubscribers(accessor) {
        if (Registry[expose]) {
            var list = accessor[subscribers]
            list && avalon.Array.ensure(list, Registry[expose]) //只有数组不存在此元素才push进去
        }
    }
    /*通知依赖于这个访问器的订阅者更新自身*/
    function notifySubscribers(accessor) {
        var list = accessor[subscribers]
        if (list && list.length) {
            var args = aslice.call(arguments, 1)
            for (var i = list.length, fn; fn = list[--i]; ) {
                var el = fn.element
                if (el && !ifSanctuary.contains(el) && (!root.contains(el))) {
                    list.splice(i, 1)
                    log("debug: remove " + fn.name)
                } else if (typeof fn === "function") {
                    fn.apply(0, args) //强制重新计算自身
                } else if (fn.getter) {
                    fn.handler.apply(fn, args) //强制重新计算自身
                } else {
                    fn.handler(fn.evaluator.apply(0, fn.args || []), el, fn)
                }
            }
        }
    }


    /*********************************************************************
     *                            扫描系统                                *
     **********************************************************************/
    avalon.scan = function(elem, vmodel) {
        elem = elem || root
        var vmodels = vmodel ? [].concat(vmodel) : []
        scanTag(elem, vmodels)
    }

    //http://www.w3.org/TR/html5/syntax.html#void-elements
    var stopScan = oneObject("area,base,basefont,br,col,command,embed,hr,img,input,link,meta,param,source,track,wbr,noscript,noscript,script,style,textarea".toUpperCase())

    /*确保元素的内容被完全扫描渲染完毕才调用回调*/
    function checkScan(elem, callback) {
        var innerHTML = NaN,
                id = setInterval(function() {
                    var currHTML = elem.innerHTML
                    if (currHTML === innerHTML) {
                        clearInterval(id)
                        callback()
                    } else {
                        innerHTML = currHTML
                    }
                }, 15)
    }


    function scanTag(elem, vmodels, node) {
        //扫描顺序  ms-skip(0) --> ms-important(1) --> ms-controller(2) --> ms-if(10) --> ms-repeat(100) 
        //--> ms-if-loop(110) --> ms-attr(970) ...--> ms-each(1400)-->ms-with(1500)--〉ms-duplex(2000)垫后        
        var a = elem.getAttribute(prefix + "skip")
        var b = elem.getAttributeNode(prefix + "important")
        var c = elem.getAttributeNode(prefix + "controller")
        if (typeof a === "string") {
            return
        } else if (node = b || c) {
            var newVmodel = VMODELS[node.value]
            if (!newVmodel) {
                return
            }
            //ms-important不包含父VM，ms-controller相反
            vmodels = node === b ? [newVmodel] : [newVmodel].concat(vmodels)
            elem.removeAttribute(node.name) //removeAttributeNode不会刷新[ms-controller]样式规则
            elem.classList.remove(node.name)
        }
        scanAttr(elem, vmodels) //扫描特性节点
    }

    function scanNodes(parent, vmodels) {
        var node = parent.firstChild
        while (node) {
            var nextNode = node.nextSibling
            var nodeType = node.nodeType
            if (nodeType === 1) {
                scanTag(node, vmodels) //扫描元素节点
            } else if (nodeType === 3 && rexpr.test(node.data)) {
                scanText(node, vmodels) //扫描文本节点
            } else if (kernel.commentInterpolate && nodeType === 8 && !rexpr.test(node.nodeValue)) {
                scanText(node, vmodels) //扫描注释节点
            }
            node = nextNode
        }
    }

    function scanText(textNode, vmodels) {
        var bindings = []
        if (textNode.nodeType === 8) {
            var leach = []
            var value = trimFilter(textNode.nodeValue, leach)
            var token = {
                expr: true,
                value: value
            }
            if (leach.length) {
                token.filters = leach
            }
            var tokens = [token]
        } else {
            tokens = scanExpr(textNode.data)
        }
        if (tokens.length) {
            for (var i = 0, token; token = tokens[i++]; ) {
                var node = DOC.createTextNode(token.value) //将文本转换为文本节点，并替换原来的文本节点
                if (token.expr) {
                    var filters = token.filters
                    var binding = {
                        type: "text",
                        node: node,
                        nodeType: 3,
                        value: token.value,
                        filters: filters
                    }
                    if (filters && filters.indexOf("html") !== -1) {
                        avalon.Array.remove(filters, "html")
                        binding.type = "html"
                        binding.replaceNodes = [node]
                        if (!filters.length) {
                            delete bindings.filters
                        }
                    }
                    bindings.push(binding) //收集带有插值表达式的文本
                }
                hyperspace.appendChild(node)
            }
            textNode.parentNode.replaceChild(hyperspace, textNode)
            if (bindings.length)
                executeBindings(bindings, vmodels)
        }
    }

    var rmsAttr = /ms-(\w+)-?(.*)/
    var priorityMap = {
        "if": 10,
        "repeat": 90,
        "widget": 110,
        "each": 1400,
        "with": 1500,
        "duplex": 2000,
        "on": 3000
    }

    var ons = oneObject("dblclick,mouseout,click,input,mouseover,mouseenter,mouseleave,mousemove,mousedown,mouseup,keypress,keydown,keyup,blur,focus,change,animationend")

    function scanAttr(elem, vmodels) {
        var attributes = elem.attributes
        var bindings = [],
                msData = {},
                match
        for (var i = 0, attr; attr = attributes[i++]; ) {
            if (attr.specified) {
                if (match = attr.name.match(rmsAttr)) {
                    //如果是以指定前缀命名的
                    var type = match[1]
                    var param = match[2] || ""
                    msData[attr.name] = attr.value
                    if (ons[type]) {
                        param = type
                        type = "on"
                    }
                    if (typeof bindingHandlers[type] === "function") {
                        var binding = {
                            type: type,
                            param: param,
                            element: elem,
                            name: match[0],
                            value: attr.value,
                            priority: type in priorityMap ? priorityMap[type] : type.charCodeAt(0) * 10 + (Number(param) || 0)
                        }
                        if (type === "if" && param === "loop") {
                            binding.priority += 100
                        }
                        if (vmodels.length) {
                            bindings.push(binding)
                            if (type === "widget") {
                                elem.msData = elem.msData || msData
                            }
                        }
                    }
                }
            }
        }
        if (msData["ms-checked"] && msData["ms-duplex"]) {
            log("warning!一个元素上不能同时定义ms-checked与ms-duplex")
        }
        bindings.sort(function(a, b) {
            return a.priority - b.priority
        })
        var firstBinding = bindings[0] || {}
        switch (firstBinding.type) {
            case "if":
            case "repeat":
            case "widget":
                executeBindings([firstBinding], vmodels)
                break
            default:
                executeBindings(bindings, vmodels)
                if (!stopScan[elem.tagName] && rbind.test(elem.innerHTML + elem.textContent)) {
                    scanNodes(elem, vmodels) //扫描子孙元素
                }
                break;
        }
        if (elem.patchRepeat) {
            elem.patchRepeat()
            elem.patchRepeat = null
        }
    }

    function executeBindings(bindings, vmodels) {
        for (var i = 0, data; data = bindings[i++]; ) {
            data.vmodels = vmodels
            bindingHandlers[data.type](data, vmodels)
            if (data.evaluator && data.name) { //移除数据绑定，防止被二次解析
                //chrome使用removeAttributeNode移除不存在的特性节点时会报错 https://github.com/RubyLouvre/avalon/issues/99
                data.element.removeAttribute(data.name)
            }
        }
        bindings.length = 0
    }

    var rfilters = /\|\s*(\w+)\s*(\([^)]*\))?/g,
            r11a = /\|\|/g,
            r11b = /U2hvcnRDaXJjdWl0/g,
            rlt = /&lt;/g,
            rgt = /&gt;/g
    function trimFilter(value, leach) {
        if (value.indexOf("|") > 0) { // 抽取过滤器 先替换掉所有短路与
            value = value.replace(r11a, "U2hvcnRDaXJjdWl0") //btoa("ShortCircuit")
            value = value.replace(rfilters, function(c, d, e) {
                leach.push(d + (e || ""))
                return ""
            })
            value = value.replace(r11b, "||") //还原短路与
        }
        return value
    }

    function scanExpr(str) {
        var tokens = [],
                value, start = 0,
                stop

        do {
            stop = str.indexOf(openTag, start)
            if (stop === -1) {
                break
            }
            value = str.slice(start, stop)
            if (value) { // {{ 左边的文本
                tokens.push({
                    value: value,
                    expr: false
                })
            }
            start = stop + openTag.length
            stop = str.indexOf(closeTag, start)
            if (stop === -1) {
                break
            }
            value = str.slice(start, stop)
            if (value) { //处理{{ }}插值表达式
                var leach = []
                value = trimFilter(value, leach)
                tokens.push({
                    value: value,
                    expr: true,
                    filters: leach.length ? leach : void 0
                })
            }
            start = stop + closeTag.length
        } while (1)
        value = str.slice(start)
        if (value) { //}} 右边的文本
            tokens.push({
                value: value,
                expr: false
            })
        }

        return tokens
    }
    /*********************************************************************
     *                          编译模块                                   *
     **********************************************************************/
    var keywords =
            // 关键字
            "break,case,catch,continue,debugger,default,delete,do,else,false" + ",finally,for,function,if,in,instanceof,new,null,return,switch,this" + ",throw,true,try,typeof,var,void,while,with"

            // 保留字
            + ",abstract,boolean,byte,char,class,const,double,enum,export,extends" + ",final,float,goto,implements,import,int,interface,long,native" + ",package,private,protected,public,short,static,super,synchronized" + ",throws,transient,volatile"

            // ECMA 5 - use strict
            + ",arguments,let,yield"

            + ",undefined"
    var rrexpstr = /\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|[\s\t\n]*\.[\s\t\n]*[$\w\.]+/g
    var rsplit = /[^\w$]+/g
    var rkeywords = new RegExp(["\\b" + keywords.replace(/,/g, '\\b|\\b') + "\\b"].join('|'), 'g')
    var rnumber = /\b\d[^,]*/g
    var rcomma = /^,+|,+$/g
    var cacheVars = createCache(512)
    var getVariables = function(code) {
        code = "," + code.trim()
        if (cacheVars[code]) {
            return cacheVars[code]
        }
        var match = code
                .replace(rrexpstr, "")
                .replace(rsplit, ",")
                .replace(rkeywords, "")
                .replace(rnumber, "")
                .replace(rcomma, "")
                .split(/^$|,+/)
        var vars = [],
                unique = {}
        for (var i = 0; i < match.length; ++i) {
            var variable = match[i]
            if (!unique[variable]) {
                unique[variable] = vars.push(variable)
            }
        }
        return cacheVars(code, vars)
    }
    /*添加赋值语句*/
    function addAssign(vars, scope, name, duplex) {
        var ret = [],
                prefix = " = " + name + "."
        for (var i = vars.length, prop; prop = vars[--i]; ) {
            if (scope.hasOwnProperty(prop)) {
                ret.push(prop + prefix + prop)
                if (duplex === "duplex") {
                    vars.get = name + "." + prop
                }
                vars.splice(i, 1)
            }
        }
        return ret

    }

    function uniqVmodels(arr) {
        var uniq = {}
        return arr.filter(function(el) {
            if (!uniq[el.$id]) {
                uniq[el.$id] = 1
                return true
            }
        })
    }

    /*创建具有一定容量的缓存体*/
    function createCache(maxLength) {
        var keys = []

        function cache(key, value) {
            if (keys.push(key) > maxLength) {
                delete cache[keys.shift()]
            }
            return cache[key] = value;
        }
        return cache;
    }
    var cacheExprs = createCache(256)
    //根据一段文本与一堆VM，转换为对应的求值函数及匹配的VM(解释器模式)
    var rduplex = /\w\[.*\]|\w\.\w/
    var rproxy = /(\$proxy\$[a-z]+)\d+$/

    function parseExpr(code, scopes, data, four) {
        var dataType = data.type
        var filters = dataType === "html" || dataType === "text" ? data.filters : ""
        var exprId = scopes.map(function(el) {
            return el.$id.replace(rproxy, "$1")
        }) + code + dataType + filters
        var vars = getVariables(code).concat(),
                assigns = [],
                names = [],
                args = [],
                prefix = ""
        //args 是一个对象数组， names 是将要生成的求值函数的参数
        scopes = uniqVmodels(scopes)
        for (var i = 0, sn = scopes.length; i < sn; i++) {
            if (vars.length) {
                var name = "vm" + expose + "_" + i
                names.push(name)
                args.push(scopes[i])
                assigns.push.apply(assigns, addAssign(vars, scopes[i], name, four))
            }
        }
        if (!assigns.length && four === "duplex") {
            return
        }
        //---------------args----------------
        if (filters) {
            args.push(avalon.filters)
        }
        data.args = args
        //---------------cache----------------
        var fn = cacheExprs[exprId] //直接从缓存，免得重复生成
        if (fn) {
            data.evaluator = fn
            return
        }
        var prefix = assigns.join(", ")
        if (prefix) {
            prefix = "var " + prefix
        }
        if (filters) { //文本绑定，双工绑定才有过滤器
            code = "\nvar ret" + expose + " = " + code
            var textBuffer = [],
                    fargs
            textBuffer.push(code, "\r\n")
            for (var i = 0, fname; fname = data.filters[i++]; ) {
                var start = fname.indexOf("(")
                if (start !== -1) {
                    fargs = fname.slice(start + 1, fname.lastIndexOf(")")).trim()
                    fargs = "," + fargs
                    fname = fname.slice(0, start).trim()
                } else {
                    fargs = ""
                }
                textBuffer.push(" if(filters", expose, ".", fname, "){\n\ttry{\nret", expose,
                        " = filters", expose, ".", fname, "(ret", expose, fargs, ")\n\t}catch(e){} \n}\n")
            }
            code = textBuffer.join("")
            code += "\nreturn ret" + expose
            names.push("filters" + expose)
        } else if (dataType === "duplex") { //双工绑定
            var _body = "'use strict';\nreturn function(vvv){\n\t" +
                    prefix +
                    ";\n\tif(!arguments.length){\n\t\treturn " +
                    code +
                    "\n\t}\n\t" + (!rduplex.test(code) ? vars.get : code) +
                    "= vvv;\n} "
            try {
                fn = Function.apply(noop, names.concat(_body))
                data.evaluator = cacheExprs(exprId, fn)
            } catch (e) {
                log("debug: parse error," + e.message)
            }
            return
        } else if (dataType === "on") { //事件绑定
            code = code.replace("(", ".call(this,")
            if (four === "$event") {
                names.push(four)
            }
            code = "\nreturn " + code + ";" //IE全家 Function("return ")出错，需要Function("return ;")
            var lastIndex = code.lastIndexOf("\nreturn")
            var header = code.slice(0, lastIndex)
            var footer = code.slice(lastIndex)
            code = header + "\nif(avalon.openComputedCollect) return ;" + footer
        } else { //其他绑定
            code = "\nreturn " + code + ";" //IE全家 Function("return ")出错，需要Function("return ;")
        }
        try {
            fn = Function.apply(noop, names.concat("'use strict';\n" + prefix + code))
            data.evaluator = cacheExprs(exprId, fn)
        } catch (e) {
            log("debug: parse error," + e.message)
        } finally {
            vars = textBuffer = names = null //释放内存
        }
    }

    /*parseExpr的智能引用代理*/
    function parseExprProxy(code, scopes, data, tokens) {
        if (Array.isArray(tokens)) {
            var array = tokens.map(function(token) {
                var tmpl = {}
                return token.expr ? parseExpr(token.value, scopes, tmpl) || tmpl : token.value
            })
            data.evaluator = function() {
                var ret = ""
                for (var i = 0, el; el = array[i++]; ) {
                    ret += typeof el === "string" ? el : el.evaluator.apply(0, el.args)
                }
                return ret
            }
            data.args = []
        } else {
            parseExpr(code, scopes, data, tokens)
        }
        if (data.evaluator) {
            data.handler = bindingExecutors[data.handlerName || data.type]
            data.evaluator.toString = function() {
                return data.type + " binding to eval(" + code + ")"
            }
            //方便调试
            //这里非常重要,我们通过判定视图刷新函数的element是否在DOM树决定
            //将它移出订阅者列表
            registerSubscriber(data)
        }
    }
    avalon.parseExprProxy = parseExprProxy
    /*********************************************************************
     *绑定模块（实现“操作数据即操作DOM”的关键，将DOM操作放逐出前端开发人员的视野，让它交由框架自行处理，开发人员专致于业务本身） *                                 *
     **********************************************************************/
    var cacheDisplay = oneObject("a,abbr,b,span,strong,em,font,i,kbd", "inline")
    avalon.mix(cacheDisplay, oneObject("div,h1,h2,h3,h4,h5,h6,section,p", "block"))

    /*用于取得此类标签的默认display值*/
    function parseDisplay(nodeName, val) {
        nodeName = nodeName.toLowerCase()
        if (!cacheDisplay[nodeName]) {
            var node = DOC.createElement(nodeName)
            root.appendChild(node)
            val = getComputedStyle(node, null).display
            root.removeChild(node)
            cacheDisplay[nodeName] = val
        }
        return cacheDisplay[nodeName]
    }
    avalon.parseDisplay = parseDisplay
    var supportDisplay = (function(td) {
        return getComputedStyle(td, null).display == "table-cell"
    })(DOC.createElement("td"))
    var rdash = /\(([^)]*)\)/
    // head.insertAdjacentHTML("afterBegin", '<style id="avalonStyle">.avalonHide{ display: none!important }</style>')
    var getBindingCallback = function(elem, name, vmodels) {
        var callback = elem.getAttribute(name)
        if (callback) {
            for (var i = 0, vm; vm = vmodels[i++]; ) {
                if (vm.hasOwnProperty(callback) && typeof vm[callback] === "function") {
                    return vm[callback]
                }
            }
        }
    }
    var cacheTmpls = avalon.templateCache = {}
    var ifSanctuary = DOC.createElement("div")
    var rwhitespace = /^\s+$/
    //这里的函数每当VM发生改变后，都会被执行（操作方为notifySubscribers）
    var bindingExecutors = avalon.bindingExecutors = {
        "attr": function(val, elem, data) {
            var method = data.type,
                    attrName = data.param

            function scanTemplate(text) {
                if (loaded) {
                    text = loaded.apply(elem, [text].concat(vmodels))
                }
                avalon.innerHTML(elem, text)
                scanNodes(elem, vmodels)
                rendered && checkScan(elem, function() {
                    rendered.call(elem)
                })
            }

            if (method === "css") {
                avalon(elem).css(attrName, val)
            } else if (method === "attr") {
                // ms-attr-class="xxx" vm.xxx="aaa bbb ccc"将元素的className设置为aaa bbb ccc
                // ms-attr-class="xxx" vm.xxx=false  清空元素的所有类名
                // ms-attr-name="yyy"  vm.yyy="ooo" 为元素设置name属性
                var toRemove = (val === false) || (val === null) || (val === void 0)
                if (toRemove) {
                    elem.removeAttribute(attrName)
                } else {
                    elem.setAttribute(attrName, val)
                }
            } else if (method === "include" && val) {
                var vmodels = data.vmodels
                var rendered = getBindingCallback(elem, "data-include-rendered", vmodels)
                var loaded = getBindingCallback(elem, "data-include-loaded", vmodels)

                if (data.param === "src") {
                    if (cacheTmpls[val]) {
                        scanTemplate(cacheTmpls[val])
                    } else {
                        var xhr = new window.XMLHttpRequest
                        xhr.onload = function() {
                            var s = xhr.status
                            if (s >= 200 && s < 300 || s === 304) {
                                scanTemplate(cacheTmpls[val] = xhr.responseText)
                            }
                        }
                        xhr.open("GET", val, true)
                        xhr.withCredentials = true
                        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
                        xhr.send(null)
                    }
                } else {
                    //IE系列与够新的标准浏览器支持通过ID取得元素（firefox14+）
                    //http://tjvantoll.com/2012/07/19/dom-element-references-as-global-variables/
                    var el = val && val.nodeType == 1 ? val : DOC.getElementById(val)
                    avalon.nextTick(function() {
                        scanTemplate(el.innerText || el.innerHTML)
                    })
                }
            } else {
                elem[method] = val
            }
        },
        "class": function(val, elem, data) {
            var $elem = avalon(elem),
                    method = data.type
            if (method === "class" && data.param) { //如果是旧风格
                $elem.toggleClass(data.param, !!val)
            } else {
                var toggle = data._evaluator ? !!data._evaluator.apply(elem, data._args) : true
                var className = data._class || val
                switch (method) {
                    case "class":
                        if (toggle && data.oldClass) {
                            $elem.removeClass(data.oldClass)
                        }
                        $elem.toggleClass(className, toggle)
                        data.oldClass = className
                        break;
                    case "hover":
                    case "active":
                        if (!data.init) {
                            if (method === "hover") { //在移出移入时切换类名
                                var event1 = "mouseenter",
                                        event2 = "mouseleave"
                            } else { //在聚焦失焦中切换类名
                                elem.tabIndex = elem.tabIndex || -1
                                event1 = "mousedown", event2 = "mouseup"
                                $elem.bind("mouseleave", function() {
                                    toggle && $elem.removeClass(className)
                                })
                            }
                            $elem.bind(event1, function() {
                                toggle && $elem.addClass(className)
                            })
                            $elem.bind(event2, function() {
                                toggle && $elem.removeClass(className)
                            })
                            data.init = 1
                        }
                        break;
                }
            }
        },
        "data": function(val, elem, data) {
            var key = "data-" + data.param
            if (val && typeof val === "object") {
                elem[key] = val
            } else {
                elem.setAttribute(key, String(val))
            }
        },
        "checked": function(val, elem, data) {
            var name = data.type;
            if (name === "enabled") {
                elem.disabled = !val
            } else {
                var propName = name === "readonly" ? "readOnly" : name
                elem[propName] = !!val
            }
        },
        "repeat": function(method, pos, el) {
            if (method) {
                var data = this
                var group = data.group
                var pp = data.startRepeat && data.startRepeat.parentNode
                if (pp) { //fix  #300 #307
                    data.parent = pp
                }
                var parent = data.parent
                var proxies = data.proxies
                var transation = hyperspace.cloneNode(false)
                var spans = []
                var lastFn = {}
                if (method === "del" || method === "move") {
                    var locatedNode = getLocatedNode(parent, data, pos)
                }
                switch (method) {
                    case "add":
                        //在pos位置后添加el数组（pos为数字，el为数组）
                        var arr = el
                        var last = data.getter().length - 1
                        for (var i = 0, n = arr.length; i < n; i++) {
                            var ii = i + pos
                            var proxy = getEachProxy(ii, arr[i], data, last)
                            proxies.splice(ii, 0, proxy)
                            lastFn = shimController(data, transation, spans, proxy)
                        }
                        locatedNode = getLocatedNode(parent, data, pos)
                        lastFn.node = locatedNode
                        lastFn.parent = parent
                        parent.insertBefore(transation, locatedNode)
                        for (var i = 0, node; node = spans[i++]; ) {
                            scanTag(node, data.vmodels)
                        }
                        spans = null
                        break
                    case "del": //将pos后的el个元素删掉(pos, el都是数字)
                        var removed = proxies.splice(pos, el)
                        for (var i = 0, proxy; proxy = removed[i++]; ) {
                            recycleEachProxy(proxy)
                        }
                        expelFromSanctuary(removeView(locatedNode, group, el))
                        break
                    case "index": //将proxies中的第pos个起的所有元素重新索引（pos为数字，el用作循环变量）
                        var last = proxies.length - 1
                        for (; el = proxies[pos]; pos++) {
                            el.$index = pos
                            el.$first = pos === 0
                            el.$last = pos === last
                        }
                        break
                    case "clear":
                        if (data.startRepeat) {
                            while (true) {
                                var node = data.startRepeat.nextSibling
                                if (node && node !== data.endRepeat) {
                                    transation.appendChild(node)
                                } else {
                                    break
                                }
                            }
                        } else {
                            transation = parent
                        }
                        expelFromSanctuary(transation)
                        proxies.length = 0
                        break
                    case "move": //将proxies中的第pos个元素移动el位置上(pos, el都是数字)
                        var t = proxies.splice(pos, 1)[0]
                        if (t) {
                            proxies.splice(el, 0, t)
                            transation = removeView(locatedNode, group)
                            locatedNode = getLocatedNode(parent, data, el)
                            parent.insertBefore(transation, locatedNode)
                        }
                        break
                    case "set": //将proxies中的第pos个元素的VM设置为el（pos为数字，el任意）
                        var proxy = proxies[pos]
                        if (proxy) {
                            proxy[proxy.$itemName] = el
                        }
                        break
                    case "append": //将pos的键值对从el中取出（pos为一个普通对象，el为预先生成好的代理VM对象池）
                        var pool = el
                        var callback = getBindingCallback(data.callbackElement, "data-with-sorted", data.vmodels)
                        var keys = []
                        for (var key in pos) { //得到所有键名
                            if (pos.hasOwnProperty(key)) {
                                keys.push(key)
                            }
                        }
                        if (callback) { //如果有回调，则让它们排序
                            var keys2 = callback.call(parent, keys)
                            if (keys2 && Array.isArray(keys2) && keys2.length) {
                                keys = keys2
                            }
                        }
                        for (var i = 0, key; key = keys[i++]; ) {
                            lastFn = shimController(data, transation, spans, pool[key])
                        }
                        lastFn.parent = parent
                        lastFn.node = data.endRepeat || null
                        parent.insertBefore(transation, lastFn.node)
                        for (var i = 0, el; el = spans[i++]; ) {
                            scanTag(el, data.vmodels)
                        }
                        spans = null
                        break
                }
                iteratorCallback.call(data, arguments)
            }
        },
        "html": function(val, elem, data) {
            val = val == null ? "" : val
            if (!elem) {
                elem = data.element = data.node.parentNode
            }
            if (data.replaceNodes) {
                var fragment, nodes
                if (val.nodeType === 11) {
                    fragment = val
                } else if (val.nodeType === 1 || val.item) {
                    nodes = val.nodeType === 1 ? val.childNodes : val.item ? val : []
                    fragment = hyperspace.cloneNode(true)
                    while (nodes[0]) {
                        fragment.appendChild(nodes[0])
                    }
                } else {
                    fragment = avalon.parseHTML(val)
                }
                var replaceNodes = avalon.slice(fragment.childNodes)
                elem.insertBefore(fragment, data.replaceNodes[0] || null)
                for (var i = 0, node; node = data.replaceNodes[i++]; ) {
                    elem.removeChild(node)
                }
                data.replaceNodes = replaceNodes
            } else {
                avalon.innerHTML(elem, val)
            }
            avalon.nextTick(function() {
                scanNodes(elem, data.vmodels)
            })
        },
        "if": function(val, elem, data) {
            var placehoder = data.placehoder
            if (val) { //插回DOM树
                if (!data.msInDocument) {
                    data.msInDocument = true
                    try {
                        placehoder.parentNode.replaceChild(elem, placehoder)
                    } catch (e) {
                        log("debug: ms-if " + e.message)
                    }
                }
                if (rbind.test(elem.outerHTML.replace(rlt, "<").replace(rgt, ">"))) {
                    scanAttr(elem, data.vmodels)
                }
            } else { //移出DOM树，放进ifSanctuary DIV中，并用注释节点占据原位置
                if (data.msInDocument) {
                    data.msInDocument = false
                    elem.parentNode.replaceChild(placehoder, elem)
                    placehoder.elem = elem
                    ifSanctuary.appendChild(elem)
                }
            }
        },
        "on": function(callback, elem, data) {
            var fn = data.evaluator
            var args = data.args
            var vmodels = data.vmodels
            if (!data.hasArgs) {
                callback = function(e) {
                    return fn.apply(0, args).call(this, e)
                }
            } else {
                callback = function(e) {
                    return fn.apply(this, args.concat(e))
                }
            }
            elem.$vmodel = vmodels[0]
            elem.$vmodels = vmodels
            data.param = data.param.replace(/-\d+$/, "") // ms-on-mousemove-10
            if (typeof data.specialBind === "function") {
                data.specialBind(elem, callback)
            } else {
                var removeFn = avalon.bind(elem, data.param, callback)
            }
            data.rollback = function() {
                if (typeof data.specialUnbind === "function") {
                    data.specialUnbind()
                } else {
                    avalon.unbind(elem, data.param, removeFn)
                }
            }
            data.evaluator = data.handler = noop
        },
        "text": function(val, elem, data) {
            val = val == null ? "" : val //不在页面上显示undefined null
            var node = data.node
            if (data.nodeType === 3) { //绑定在文本节点上
                try {//IE对游离于DOM树外的节点赋值会报错
                    node.data = val
                } catch (e) {
                }
            } else { //绑定在特性节点上
                if (!elem) {
                    elem = data.element = node.parentNode
                }
                elem.textContent = val
            }
        },
        "visible": function(val, elem, data) {
            elem.style.display = val ? data.display : "none"
        },
        "widget": noop
    }
    //这里的函数只会在第一次被扫描后被执行一次，并放进行对应VM属性的subscribers数组内（操作方为registerSubscriber）
    var bindingHandlers = avalon.bindingHandlers = {
        //这是一个字符串属性绑定的范本, 方便你在title, alt,  src, href, include, css添加插值表达式
        //<a ms-href="{{url.hostname}}/{{url.pathname}}.html">
        "attr": function(data, vmodels) {
            var text = data.value.trim(),
                    simple = true
            if (text.indexOf(openTag) > -1 && text.indexOf(closeTag) > 2) {
                simple = false
                if (rexpr.test(text) && RegExp.rightContext === "" && RegExp.leftContext === "") {
                    simple = true
                    text = RegExp.$1
                }
            }
            data.handlerName = "attr" //handleName用于处理多种绑定共用同一种bindingExecutor的情况
            parseExprProxy(text, vmodels, data, (simple ? null : scanExpr(data.value)))
        },
        //根据VM的属性值或表达式的值切换类名，ms-class="xxx yyy zzz:flag" 
        //http://www.cnblogs.com/rubylouvre/archive/2012/12/17/2818540.html
        "class": function(data, vmodels) {
            var oldStyle = data.param,
                    text = data.value,
                    rightExpr
            data.handlerName = "class"
            if (!oldStyle || isFinite(oldStyle)) {
                data.param = "" //去掉数字
                var noExpr = text.replace(rexprg, function(a) {
                    return Math.pow(10, a.length - 1) //将插值表达式插入10的N-1次方来占位
                })
                var colonIndex = noExpr.indexOf(":") //取得第一个冒号的位置
                if (colonIndex === -1) { // 比如 ms-class="aaa bbb ccc" 的情况
                    var className = text
                } else { // 比如 ms-class-1="ui-state-active:checked" 的情况 
                    className = text.slice(0, colonIndex)
                    rightExpr = text.slice(colonIndex + 1)
                    parseExpr(rightExpr, vmodels, data) //决定是添加还是删除
                    if (!data.evaluator) {
                        log("debug: ms-class '" + (rightExpr || "").trim() + "' 不存在于VM中")
                        return false
                    } else {
                        data._evaluator = data.evaluator
                        data._args = data.args
                    }
                }
                var hasExpr = rexpr.test(className) //比如ms-class="width{{w}}"的情况
                if (!hasExpr) {
                    data._class = className
                }
                parseExprProxy("", vmodels, data, (hasExpr ? scanExpr(className) : null))
            } else if (data.type === "class") {
                parseExprProxy(text, vmodels, data)
            }
        },
        "checked": function(data, vmodels) {
            data.handlerName = "checked"
            parseExprProxy(data.value, vmodels, data)
        },
        "duplex": function(data, vmodels) {
            var elem = data.element,
                    tagName = elem.tagName
            if (typeof duplexBinding[tagName] === "function") {
                data.changed = getBindingCallback(elem, "data-duplex-changed", vmodels) || noop
                //由于情况特殊，不再经过parseExprProxy
                parseExpr(data.value, vmodels, data, "duplex")
                if (data.evaluator && data.args) {
                    var form = elem.form
                    if (form && form.msValidate) {
                        form.msValidate(elem)
                    }
                    data.bound = function(type, callback) {
                        elem.addEventListener(type, callback)
                        var old = data.rollback
                        data.rollback = function() {
                            elem.removeEventListener(type, callback)
                            old && old()
                        }
                    }
                    duplexBinding[elem.tagName](elem, data.evaluator.apply(null, data.args), data)
                }
            }
        },
        "repeat": function(data, vmodels) {
            var type = data.type,
                    list
            parseExpr(data.value, vmodels, data)
            if (type !== "repeat") {
                // log("warning:建议使用ms-repeat代替ms-each, ms-with, ms-repeat只占用一个标签并且性能更好")
            }
            var elem = data.callbackElement = data.parent = data.element //用于判定当前元素是否位于DOM树
            data.getter = function() {
                return this.evaluator.apply(0, this.args || [])
            }
            data.proxies = []
            var freturn = true
            try {
                list = data.getter()
                if (rcomplextype.test(getType(list))) {
                    freturn = false
                }
            } catch (e) {
            }
            var template = hyperspace.cloneNode(false)
            if (type === "repeat") {
                var startRepeat = DOC.createComment("repeat-start")
                var endRepeat = DOC.createComment("repeat-end")
                data.element = data.parent = elem.parentNode
                data.startRepeat = startRepeat
                data.endRepeat = endRepeat
                elem.removeAttribute(data.name)
                data.parent.replaceChild(endRepeat, elem)
                data.parent.insertBefore(startRepeat, endRepeat)
                template.appendChild(elem)
            } else {
                var node
                while (node = elem.firstChild) {
                    if (node.nodeType === 3 && rwhitespace.test(node.data)) {
                        elem.removeChild(node)
                    } else {
                        template.appendChild(node)
                    }
                }
            }
            data.template = template
            data.rollback = function() {
                bindingExecutors.repeat.call(data, "clear")
                var endRepeat = data.endRepeat
                var parent = data.parent
                parent.insertBefore(data.template, endRepeat || null)
                if (endRepeat) {
                    parent.removeChild(endRepeat)
                    parent.removeChild(data.startRepeat)
                    data.element = data.callbackElement
                }
            }
            var arr = data.value.split(".") || []
            if (arr.length > 1) {
                arr.pop()
                var n = arr[0]
                for (var i = 0, v; v = vmodels[i++]; ) {
                    if (v && v.hasOwnProperty(n) && v[n][subscribers]) {
                        v[n][subscribers].push(data)
                        break
                    }
                }
            }
            if (freturn) {
                return
            }
            data.callbackName = "data-" + type + "-rendered"
            data.handler = bindingExecutors.repeat
            data.$outer = {}
            var check0 = "$key",
                    check1 = "$val"
            if (Array.isArray(list)) {
                check0 = "$first"
                check1 = "$last"
            }
            for (var i = 0, p; p = vmodels[i++]; ) {
                if (p.hasOwnProperty(check0) && p.hasOwnProperty(check1)) {
                    data.$outer = p
                    break
                }
            }
            node = template.firstChild
            data.fastRepeat = !!node && node.nodeType === 1 && template.lastChild === node && !node.attributes["ms-controller"] && !node.attributes["ms-important"]
            list[subscribers] && list[subscribers].push(data)
            if (!Array.isArray(list) && type !== "each") {
                var pool = withProxyPool[list.$id]
                if (!pool) {
                    withProxyCount++
                    pool = withProxyPool[list.$id] = {}
                    for (var key in list) {
                        if (list.hasOwnProperty(key) && key !== "hasOwnProperty") {
                            (function(k, v) {
                                pool[k] = createWithProxy(k, v, {})
                                pool[k].$watch("$val", function(val) {
                                    list[k] = val //#303
                                })
                            })(key, list[key])
                        }
                    }
                }
                data.handler("append", list, pool)
            } else {
                data.handler("add", 0, list)
            }
        },
        "html": function(data, vmodels) {
            parseExprProxy(data.value, vmodels, data)
        },
        "if": function(data, vmodels) {
            var elem = data.element
            elem.removeAttribute(data.name)
            if (!data.placehoder) {
                data.msInDocument = data.placehoder = DOC.createComment("if")
            }
            data.vmodels = vmodels
            parseExprProxy(data.value, vmodels, data)
        },
        "on": function(data, vmodels) {
            var value = data.value,
                    four = "$event"
            if (value.indexOf("(") > 0 && value.indexOf(")") > -1) {
                var matched = (value.match(rdash) || ["", ""])[1].trim()
                if (matched === "" || matched === "$event") { // aaa() aaa($event)当成aaa处理
                    four = void 0
                    value = value.replace(rdash, "")
                }
            } else {
                four = void 0
            }
            data.hasArgs = four
            parseExprProxy(value, vmodels, data, four)
        },
        "visible": function(data, vmodels) {
            var elem = data.element
            if (!supportDisplay && !root.contains(elem)) { //fuck firfox 全家！
                var display = parseDisplay(elem.tagName)
            }
            display = display || avalon(elem).css("display")
            data.display = display === "none" ? parseDisplay(elem.tagName) : display
            parseExprProxy(data.value, vmodels, data)
        },
        "widget": function(data, vmodels) {
            var args = data.value.match(rword)
            var elem = data.element
            var widget = args[0]
            if (args[1] === "$" || !args[1]) {
                args[1] = widget + setTimeout("1")
            }
            data.value = args.join(",")
            var constructor = avalon.ui[widget]
            if (typeof constructor === "function") { //ms-widget="tabs,tabsAAA,optname"
                vmodels = elem.vmodels || vmodels
                var optName = args[2] || widget //尝试获得配置项的名字，没有则取widget的名字
                for (var i = 0, v; v = vmodels[i++]; ) {
                    if (v.hasOwnProperty(optName) && typeof v[optName] === "object") {
                        var nearestVM = v
                        break
                    }
                }
                if (nearestVM) {
                    var vmOptions = nearestVM[optName]
                    vmOptions = vmOptions.$model || vmOptions
                    var id = vmOptions[widget + "Id"]
                    if (typeof id === "string") {
                        args[1] = id
                    }
                }
                var widgetData = avalon.getWidgetData(elem, args[0]) //抽取data-tooltip-text、data-tooltip-attr属性，组成一个配置对象
                data[widget + "Id"] = args[1]
                data[widget + "Options"] = avalon.mix({}, constructor.defaults, vmOptions || {}, widgetData)
                elem.removeAttribute("ms-widget")
                var vmodel = constructor(elem, data, vmodels) || {} //防止组件不返回VM
                data.evaluator = noop
                elem.msData["ms-widget-id"] = vmodel.$id || ""
                if (vmodel.hasOwnProperty("$init")) {
                    vmodel.$init()
                }
                if (vmodel.hasOwnProperty("$remove")) {
                    var offTree = function() {
                        vmodel.$remove()
                        elem.msData = {}
                        delete VMODELS[vmodel.$id]
                    }
                    if (supportMutationEvents) {
                        elem.addEventListener("DOMNodeRemoved", function(e) {
                            if (e.target === this && !this.msRetain) {
                                offTree()
                            }
                        })
                    } else {
                        elem.offTree = offTree
                        launchImpl(elem)
                    }
                }
            } else if (vmodels.length) { //如果该组件还没有加载，那么保存当前的vmodels
                elem.vmodels = vmodels
            }
        }

    }
    var supportMutationEvents = DOC.implementation.hasFeature("MutationEvents", "2.0")

    //============================   class preperty binding  =======================
    "hover,active".replace(rword, function(method) {
        bindingHandlers[method] = bindingHandlers["class"]
    })
    "with,each".replace(rword, function(name) {
        bindingHandlers[name] = bindingHandlers.repeat
    })
    //============================= boolean preperty binding =======================
    "disabled,enabled,readonly,selected".replace(rword, function(name) {
        bindingHandlers[name] = bindingHandlers.checked
    })
    bindingHandlers.data = bindingHandlers.text = bindingHandlers.html
    //============================= string preperty binding =======================
    //与href绑定器 用法差不多的其他字符串属性的绑定器
    //建议不要直接在src属性上修改，这样会发出无效的请求，请使用ms-src
    "title,alt,src,value,css,include,href".replace(rword, function(name) {
        bindingHandlers[name] = bindingHandlers.attr
    })
    //============================= model binding =======================
    //将模型中的字段与input, textarea的value值关联在一起
    var duplexBinding = bindingHandlers.duplex
    //如果一个input标签添加了model绑定。那么它对应的字段将与元素的value连结在一起
    //字段变，value就变；value变，字段也跟着变。默认是绑定input事件，
    duplexBinding.INPUT = function(element, evaluator, data) {
        var fixType = data.param,
                bound = data.bound,
                type = element.type,
                $elem = avalon(element),
                firstTigger = false,
                composing = false,
                callback = function(value) {
                    firstTigger = true
                    data.changed.call(this, value)
                },
                compositionStart = function() {
                    composing = true
                },
                compositionEnd = function() {
                    composing = false
                },
                //当value变化时改变model的值
                updateVModel = function() {
                    if (composing)
                        return
                    var val = element.oldValue = element.value
                    if ($elem.data("duplex-observe") !== false) {
                        evaluator(val)
                        callback.call(element, val)
                    }
                }

        //当model变化时,它就会改变value的值
        data.handler = function() {
            var curValue = evaluator()
            if (curValue !== element.value) {
                element.value = curValue
            }
        }
        if (type === "checkbox" && fixType === "radio") {
            type = "radio"
        }
        if (type === "radio") {
            data.handler = function() {
                element.oldChecked = element.checked = /bool|text/.test(fixType) ? evaluator() + "" === element.value : !!evaluator()
            }
            updateVModel = function() {
                if ($elem.data("duplex-observe") !== false) {
                    var val = element.value
                    if (fixType === "text") {
                        evaluator(val)
                    } else if (fixType === "bool") {
                        val = val === "true"
                        evaluator(val)
                    } else {
                        val = !element.oldChecked
                        evaluator(val)
                        element.checked = val
                    }
                    callback.call(element, val)
                }
            }
            bound(fixType ? "change" : "mousedown", updateVModel)
        } else if (type === "checkbox") {
            updateVModel = function() {
                if ($elem.data("duplex-observe") !== false) {
                    var method = element.checked ? "ensure" : "remove"
                    var array = evaluator()
                    if (Array.isArray(array)) {
                        avalon.Array[method](array, element.value)
                    } else {
                        avalon.error("ms-duplex位于checkbox时要求对应一个数组")
                    }
                    callback.call(element, array)
                }
            }
            data.handler = function() {
                var array = [].concat(evaluator()) //强制转换为数组
                element.checked = array.indexOf(element.value) >= 0
            }
            bound("change", updateVModel)
        } else {
            var event = element.attributes["data-duplex-event"] || element.attributes["data-event"] || {}
            event = event.value
            if (event === "change") {
                bound("change", updateVModel)
            } else {
                bound("input", updateVModel)
                bound("compositionstart", compositionStart)
                bound("compositionend", compositionEnd)
            }
        }
        element.oldValue = element.value
        element.onTree = onTree
        launch(element)
        registerSubscriber(data)
        var timer = setTimeout(function() {
            if (!firstTigger) {
                callback.call(element, element.value)
            }
            clearTimeout(timer)
        }, 31)
    }
    var TimerID, ribbon = [],
            launch = noop

    function onTree() { //disabled状态下改动不触发inout事件
        if (!this.disabled && this.oldValue !== this.value) {
            avalon.fire(this, "input")
        }
    }

    function ticker() {
        for (var n = ribbon.length - 1; n >= 0; n--) {
            var el = ribbon[n]
            if (avalon.contains(root, el)) {
                el.onTree && el.onTree()
            } else if (!el.msRetain) {
                el.offTree && el.offTree()
                ribbon.splice(n, 1)
            }
        }
        if (!ribbon.length) {
            clearInterval(TimerID)
        }
    }

    function launchImpl(el) {
        if (ribbon.push(el) === 1) {
            TimerID = setInterval(ticker, 30)
        }
    }

    function newSetter(newValue) {
        oldSetter.call(this, newValue)
        if (newValue !== this.oldValue) {
            avalon.fire(this, "input")
        }
    }
    try {
        var inputProto = HTMLInputElement.prototype
        var oldSetter = Object.getOwnPropertyDescriptor(inputProto, "value").set //屏蔽chrome, safari,opera
        Object.defineProperty(inputProto, "value", {
            set: newSetter
        })
    } catch (e) {
        launch = launchImpl
    }
    duplexBinding.SELECT = function(element, evaluator, data) {
        var $elem = avalon(element)

        function updateVModel() {
            if ($elem.data("duplex-observe") !== false) {
                var val = $elem.val() //字符串或字符串数组
                if (val + "" !== element.oldValue) {
                    evaluator(val)
                    element.oldValue = val + ""
                }
                data.changed.call(element, val)
            }
        }
        data.handler = function() {
            var curValue = evaluator()
            curValue = curValue && curValue.$model || curValue
            curValue = Array.isArray(curValue) ? curValue.map(String) : curValue + ""
            if (curValue + "" !== element.oldValue) {
                $elem.val(curValue)
                element.oldValue = curValue + ""
            }
        }
        data.bound("change", updateVModel)
        var innerHTML = NaN
        var id = setInterval(function() {
            var currHTML = element.innerHTML
            if (currHTML === innerHTML) {
                clearInterval(id)
                //先等到select里的option元素被扫描后，才根据model设置selected属性  
                registerSubscriber(data)
            } else {
                innerHTML = currHTML
            }
        }, 20)
    }
    duplexBinding.TEXTAREA = duplexBinding.INPUT
    //========================= event binding ====================
    var eventHooks = avalon.eventHooks
    //针对firefox, chrome修正mouseenter, mouseleave(chrome30+)
    if (!("onmouseenter" in root)) {
        avalon.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout"
        }, function(origType, fixType) {
            eventHooks[origType] = {
                type: fixType,
                deel: function(elem, fn) {
                    return function(e) {
                        var t = e.relatedTarget
                        if (!t || (t !== elem && !(elem.compareDocumentPosition(t) & 16))) {
                            delete e.type
                            e.type = origType
                            return fn.call(elem, e)
                        }
                    }
                }
            }
        })
    }
    //针对IE9+, w3c修正animationend
    avalon.each({
        AnimationEvent: "animationend",
        WebKitAnimationEvent: "webkitAnimationEnd"
    }, function(construct, fixType) {
        if (window[construct] && !eventHooks.animationend) {
            eventHooks.animationend = {
                type: fixType
            }
        }
    })
    if (document.onmousewheel === void 0) {
        /* IE6-11 chrome mousewheel wheelDetla 下 -120 上 120
         firefox DOMMouseScroll detail 下3 上-3
         firefox wheel detlaY 下3 上-3
         IE9-11 wheel deltaY 下40 上-40
         chrome wheel deltaY 下100 上-100 */
        eventHooks.mousewheel = {
            type: "DOMMouseScroll",
            deel: function(elem, fn) {
                return function(e) {
                    e.wheelDelta = e.detail > 0 ? -120 : 120
                    Object.defineProperty(e, "type", {
                        value: "mousewheel"
                    })
                    fn.call(elem, e)
                }
            }
        }
    }
    /*********************************************************************
     *          监控数组（与ms-each, ms-repeat配合使用）                     *
     **********************************************************************/

    function Collection(model) {
        var array = []
        array.$id = generateID()
        array[subscribers] = []
        array.$model = model
        array.$events = {}
        array._ = modelFactory({
            length: model.length
        })
        array._.$watch("length", function(a, b) {
            array.$fire("length", a, b)
        })
        for (var i in Observable) {
            array[i] = Observable[i]
        }
        avalon.mix(array, CollectionPrototype)
        return array
    }


    var _splice = ap.splice
    var CollectionPrototype = {
        _splice: _splice,
        _add: function(arr, pos) {
            var oldLength = this.length
            pos = typeof pos === "number" ? pos : oldLength
            var added = []
            for (var i = 0, n = arr.length; i < n; i++) {
                added[i] = convert(arr[i])
            }
            _splice.apply(this, [pos, 0].concat(added))
            notifySubscribers(this, "add", pos, added)
            if (!this._stopFireLength) {
                return this._.length = this.length
            }
        },
        _del: function(pos, n) {
            var ret = this._splice(pos, n)
            if (ret.length) {
                notifySubscribers(this, "del", pos, n)
                if (!this._stopFireLength) {
                    this._.length = this.length
                }
            }
            return ret
        },
        push: function() {
            ap.push.apply(this.$model, arguments)
            var n = this._add(arguments)
            notifySubscribers(this, "index", n > 2 ? n - 2 : 0)
            return n
        },
        pushArray: function(array) {
            return this.push.apply(this, array)
        },
        unshift: function() {
            ap.unshift.apply(this.$model, arguments)
            var ret = this._add(arguments, 0) //返回长度
            notifySubscribers(this, "index", arguments.length)
            return ret
        },
        shift: function() {
            var el = this.$model.shift()
            this._del(0, 1)
            notifySubscribers(this, "index", 0)
            return el //返回被移除的元素
        },
        pop: function() {
            var el = this.$model.pop()
            this._del(this.length - 1, 1)
            return el //返回被移除的元素
        },
        splice: function(a, b) {
            // 必须存在第一个参数，需要大于-1, 为添加或删除元素的基点
            a = resetNumber(a, this.length)
            var removed = _splice.apply(this.$model, arguments),
                    ret = []
            this._stopFireLength = true //确保在这个方法中 , $watch("length",fn)只触发一次
            if (removed.length) {
                ret = this._del(a, removed.length)
                if (arguments.length <= 2) { //如果没有执行添加操作，需要手动resetIndex
                    notifySubscribers(this, "index", 0)
                }
            }
            if (arguments.length > 2) {
                this._add(aslice.call(arguments, 2), a)
            }
            this._stopFireLength = false
            this._.length = this.length
            return ret //返回被移除的元素
        },
        contains: function(el) { //判定是否包含
            return this.indexOf(el) !== -1
        },
        size: function() { //取得数组长度，这个函数可以同步视图，length不能
            return this._.length
        },
        remove: function(el) { //移除第一个等于给定值的元素
            return this.removeAt(this.indexOf(el))
        },
        removeAt: function(index) { //移除指定索引上的元素
            return index >= 0 ? this.splice(index, 1) : []
        },
        clear: function() {
            this.$model.length = this.length = this._.length = 0 //清空数组
            notifySubscribers(this, "clear", 0)
            return this
        },
        removeAll: function(all) { //移除N个元素
            if (Array.isArray(all)) {
                all.forEach(function(el) {
                    this.remove(el)
                }, this)
            } else if (typeof all === "function") {
                for (var i = this.length - 1; i >= 0; i--) {
                    var el = this[i]
                    if (all(el, i)) {
                        this.splice(i, 1)
                    }
                }
            } else {
                this.clear()
            }
        },
        ensure: function(el) {
            if (!this.contains(el)) { //只有不存在才push
                this.push(el)
            }
            return this
        },
        set: function(index, val) {
            if (index >= 0) {
                var valueType = getType(val)
                if (val && val.$model) {
                    val = val.$model
                }
                var target = this[index]
                if (valueType === "object") {
                    for (var i in val) {
                        if (target.hasOwnProperty(i)) {
                            target[i] = val[i]
                        }
                    }
                } else if (valueType === "array") {
                    target.clear().push.apply(target, val)
                } else if (target !== val) {
                    this[index] = val
                    this.$model[index] = val
                    notifySubscribers(this, "set", index, val)
                }
            }
            return this
        }
    }
    "sort,reverse".replace(rword, function(method) {
        CollectionPrototype[method] = function() {
            var aaa = this.$model,
                    bbb = aaa.slice(0),
                    sorted = false
            ap[method].apply(aaa, arguments) //先移动model
            for (var i = 0, n = bbb.length; i < n; i++) {
                var a = aaa[i],
                        b = bbb[i]
                if (!isEqual(a, b)) {
                    sorted = true
                    var index = bbb.indexOf(a, i)
                    var remove = this._splice(index, 1)[0]
                    var remove2 = bbb.splice(index, 1)[0]
                    this._splice(i, 0, remove)
                    bbb.splice(i, 0, remove2)
                    notifySubscribers(this, "move", index, i)
                }
            }
            bbb = void 0
            if (sorted) {
                notifySubscribers(this, "index", 0)
            }
            return this
        }
    })

    function convert(val) {
        var type = getType(val)
        if (rcomplextype.test(type)) {
            val = val.$id ? val : modelFactory(val, val)
        }
        return val
    }

    //============ each/repeat/with binding 用到的辅助函数与对象 ======================
    /*得到某一元素节点或文档碎片对象下的所有注释节点*/
    var queryComments = function(parent) {
        var tw = DOC.createTreeWalker(parent, NodeFilter.SHOW_COMMENT, null, null),
                comment, ret = []
        while (comment = tw.nextNode()) {
            ret.push(comment)
        }
        return ret
    }
    var deleteRange = DOC.createRange()

    /*将通过ms-if移出DOM树放进ifSanctuary的元素节点移出来，以便垃圾回收*/

    function expelFromSanctuary(parent) {
        var comments = queryComments(parent)
        for (var i = 0, comment; comment = comments[i++]; ) {
            if (comment.nodeValue == "ms-if") {
                cinerator.appendChild(comment.elem)
            }
        }
        while (comment = parent.firstChild) {
            cinerator.appendChild(comment)
        }
        cinerator.innerHTML = ""
    }

    function iteratorCallback(args) {
        var callback = getBindingCallback(this.callbackElement, this.callbackName, this.vmodels)
        if (callback) {
            var parent = this.parent
            checkScan(parent, function() {
                callback.apply(parent, args)
            })
        }
    }

    //为ms-each, ms-with, ms-repeat要循环的元素外包一个msloop临时节点，ms-controller的值为代理VM的$id
    function shimController(data, transation, spans, proxy) {
        var tview = data.template.cloneNode(true)
        var id = proxy.$id
        var span = tview.firstChild
        if (!data.fastRepeat) {
            span = DOC.createElement("msloop")
            span.style.display = "none"
            span.appendChild(tview)
        }
        span.setAttribute("ms-controller", id)
        spans.push(span)
        transation.appendChild(span)
        proxy.$outer = data.$outer
        VMODELS[id] = proxy

        function fn() {
            delete VMODELS[id]
            data.group = 1
            if (!data.fastRepeat) {
                data.group = span.childNodes.length
                span.parentNode.removeChild(span)
                while (span.firstChild) {
                    transation.appendChild(span.firstChild)
                }
                if (fn.node !== void 0) {
                    fn.parent.insertBefore(transation, fn.node)
                }
            }
        }
        return span.patchRepeat = fn
    }
    // 取得用于定位的节点。在绑定了ms-each, ms-with属性的元素里，它的整个innerHTML都会视为一个子模板先行移出DOM树，
    // 然后如果它的元素有多少个（ms-each）或键值对有多少双（ms-with），就将它复制多少份(多少为N)，再经过扫描后，重新插入该元素中。
    // 这时该元素的孩子将分为N等分，每等份的第一个节点就是这个用于定位的节点，
    // 方便我们根据它算出整个等分的节点们，然后整体移除或移动它们。

    function getLocatedNode(parent, data, pos) {
        if (data.startRepeat) {
            var ret = data.startRepeat,
                    end = data.endRepeat
            pos += 1
            for (var i = 0; i < pos; i++) {
                ret = ret.nextSibling
                if (ret == end)
                    return end
            }
            return ret
        } else {
            return parent.childNodes[data.group * pos] || null
        }
    }

    function removeView(node, group, n) {
        var length = group * (n || 1)
        var view = hyperspace //.cloneNode(false)//???
        while (--length >= 0) {
            var nextSibling = node.nextSibling
            view.appendChild(node)
            node = nextSibling
            if (!node) {
                break
            }
        }
        return view
    }


    // 为ms-each, ms-repeat创建一个代理对象，通过它们能使用一些额外的属性与功能（$index,$first,$last,$remove,$key,$val,$outer）
    var watchEachOne = oneObject("$index,$first,$last")

    function createWithProxy(key, val, $outer) {
        var proxy = modelFactory({
            $key: key,
            $outer: $outer,
            $val: val
        }, 0, {
            $val: 1,
            $key: 1
        })
        proxy.$id = "$proxy$with" + Math.random()
        return proxy
    }
    var eachProxyPool = []
    function getEachProxy(index, item, data, last) {
        var param = data.param || "el", proxy
        var source = {
            $remove: function() {
                return data.getter().removeAt(proxy.$index)
            },
            $itemName: param,
            $index: index,
            $outer: data.$outer,
            $first: index === 0,
            $last: index === last
        }
        source[param] = item
        for (var i = 0, n = eachProxyPool.length; i < n; i++) {
            var proxy = eachProxyPool[i]
            if (proxy.hasOwnProperty(param)) {
                for (var i in source) {
                    proxy[i] = source[i]
                }
                eachProxyPool.splice(i, 1)
                return proxy
            }
        }
        var type = avalon.type(item)
        if (type === "object" || type === "function") {
            source.$skipArray = [param]
        }
        proxy = modelFactory(source, 0, watchEachOne)
        proxy.$id = "$proxy$" + data.type + Math.random()
        return proxy
    }
    function recycleEachProxy(proxy) {
        var obj = proxy.$accessors, name = proxy.$itemName;
        ["$index", "$last", "$first"].forEach(function(prop) {
            obj[prop][subscribers].length = 0
        })
        if (proxy[name][subscribers]) {
            proxy[name][subscribers].length = 0;
        }
        if (eachProxyPool.unshift(proxy) > kernel.maxRepeatSize) {
            eachProxyPool.pop()
        }
    }
    /*********************************************************************
     *                  文本绑定里默认可用的过滤器                        *
     **********************************************************************/
    var rscripts = /<script[^>]*>([\S\s]*?)<\/script\s*>/gim
    var raimg = /^<(a|img)\s/i
    var ron = /\s+(on[^=\s]+)(?:=("[^"]*"|'[^']*'|[^\s>]+))?/g
    var ropen = /<\w+\b(?:(["'])[^"]*?(\1)|[^>])*>/ig
    var rjavascripturl = /\s+(src|href)(?:=("javascript[^"]*"|'javascript[^']*'))?/ig
    var rsurrogate = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g
    var rnoalphanumeric = /([^\#-~| |!])/g;

    var filters = avalon.filters = {
        uppercase: function(str) {
            return str.toUpperCase()
        },
        lowercase: function(str) {
            return str.toLowerCase()
        },
        truncate: function(target, length, truncation) {
            //length，新字符串长度，truncation，新字符串的结尾的字段,返回新字符串
            length = length || 30
            truncation = truncation === void(0) ? "..." : truncation
            return target.length > length ? target.slice(0, length - truncation.length) + truncation : String(target)
        },
        sanitize: window.toStaticHTML ? toStaticHTML.bind(window) : function(str) {
            return str.replace(rscripts, "").replace(ropen, function(a, b) {
                if (raimg.test(a)) {
                    a = a.replace(rjavascripturl, "")//移除javascript伪协议
                }
                return a.replace(ron, " ").replace(/\s+/g, " ")//移除onXXX事件
            })
        },
        camelize: camelize,
        escape: function(html) {
            //将字符串经过 html 转义得到适合在页面中显示的内容, 例如替换 < 为 &lt 
            return String(html).
                    replace(/&/g, '&amp;').
                    replace(rsurrogate, function(value) {
                        var hi = value.charCodeAt(0)
                        var low = value.charCodeAt(1)
                        return '&#' + (((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000) + ';'
                    }).
                    replace(rnoalphanumeric, function(value) {
                        return '&#' + value.charCodeAt(0) + ';'
                    }).
                    replace(/</g, '&lt;').
                    replace(/>/g, '&gt;')
        },
        currency: function(number, symbol) {
            symbol = symbol || "￥"
            return symbol + avalon.filters.number(number)
        },
        number: function(number, decimals, dec_point, thousands_sep) {
            //与PHP的number_format完全兼容
            //number    必需，要格式化的数字
            //decimals  可选，规定多少个小数位。
            //dec_point 可选，规定用作小数点的字符串（默认为 . ）。
            //thousands_sep 可选，规定用作千位分隔符的字符串（默认为 , ），如果设置了该参数，那么所有其他参数都是必需的。
            // http://kevin.vanzonneveld.net
            number = (number + "").replace(/[^0-9+\-Ee.]/g, "")
            var n = !isFinite(+number) ? 0 : +number,
                    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
                    sep = thousands_sep || ",",
                    dec = dec_point || ".",
                    s = "",
                    toFixedFix = function(n, prec) {
                        var k = Math.pow(10, prec)
                        return "" + Math.round(n * k) / k
                    }
            // Fix for IE parseFloat(0.55).toFixed(0) = 0 
            s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split('.')
            if (s[0].length > 3) {
                s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
            }
            if ((s[1] || "").length < prec) {
                s[1] = s[1] || ""
                s[1] += new Array(prec - s[1].length + 1).join("0")
            }
            return s.join(dec)
        }
    }
    /*
     'yyyy': 4 digit representation of year (e.g. AD 1 => 0001, AD 2010 => 2010)
     'yy': 2 digit representation of year, padded (00-99). (e.g. AD 2001 => 01, AD 2010 => 10)
     'y': 1 digit representation of year, e.g. (AD 1 => 1, AD 199 => 199)
     'MMMM': Month in year (January-December)
     'MMM': Month in year (Jan-Dec)
     'MM': Month in year, padded (01-12)
     'M': Month in year (1-12)
     'dd': Day in month, padded (01-31)
     'd': Day in month (1-31)
     'EEEE': Day in Week,(Sunday-Saturday)
     'EEE': Day in Week, (Sun-Sat)
     'HH': Hour in day, padded (00-23)
     'H': Hour in day (0-23)
     'hh': Hour in am/pm, padded (01-12)
     'h': Hour in am/pm, (1-12)
     'mm': Minute in hour, padded (00-59)
     'm': Minute in hour (0-59)
     'ss': Second in minute, padded (00-59)
     's': Second in minute (0-59)
     'a': am/pm marker
     'Z': 4 digit (+sign) representation of the timezone offset (-1200-+1200)
     format string can also be one of the following predefined localizable formats:
     
     'medium': equivalent to 'MMM d, y h:mm:ss a' for en_US locale (e.g. Sep 3, 2010 12:05:08 pm)
     'short': equivalent to 'M/d/yy h:mm a' for en_US locale (e.g. 9/3/10 12:05 pm)
     'fullDate': equivalent to 'EEEE, MMMM d,y' for en_US locale (e.g. Friday, September 3, 2010)
     'longDate': equivalent to 'MMMM d, y' for en_US locale (e.g. September 3, 2010
     'mediumDate': equivalent to 'MMM d, y' for en_US locale (e.g. Sep 3, 2010)
     'shortDate': equivalent to 'M/d/yy' for en_US locale (e.g. 9/3/10)
     'mediumTime': equivalent to 'h:mm:ss a' for en_US locale (e.g. 12:05:08 pm)
     'shortTime': equivalent to 'h:mm a' for en_US locale (e.g. 12:05 pm)
     */
    new function() {
        function toInt(str) {
            return parseInt(str, 10)
        }

        function padNumber(num, digits, trim) {
            var neg = ""
            if (num < 0) {
                neg = "-"
                num = -num
            }
            num = "" + num
            while (num.length < digits)
                num = "0" + num
            if (trim)
                num = num.substr(num.length - digits)
            return neg + num
        }

        function dateGetter(name, size, offset, trim) {
            return function(date) {
                var value = date["get" + name]()
                if (offset > 0 || value > -offset)
                    value += offset
                if (value === 0 && offset === -12) {
                    value = 12
                }
                return padNumber(value, size, trim)
            }
        }

        function dateStrGetter(name, shortForm) {
            return function(date, formats) {
                var value = date["get" + name]()
                var get = (shortForm ? ("SHORT" + name) : name).toUpperCase()
                return formats[get][value]
            }
        }

        function timeZoneGetter(date) {
            var zone = -1 * date.getTimezoneOffset()
            var paddedZone = (zone >= 0) ? "+" : ""
            paddedZone += padNumber(Math[zone > 0 ? "floor" : "ceil"](zone / 60), 2) + padNumber(Math.abs(zone % 60), 2)
            return paddedZone
        }
        //取得上午下午

        function ampmGetter(date, formats) {
            return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1]
        }
        var DATE_FORMATS = {
            yyyy: dateGetter("FullYear", 4),
            yy: dateGetter("FullYear", 2, 0, true),
            y: dateGetter("FullYear", 1),
            MMMM: dateStrGetter("Month"),
            MMM: dateStrGetter("Month", true),
            MM: dateGetter("Month", 2, 1),
            M: dateGetter("Month", 1, 1),
            dd: dateGetter("Date", 2),
            d: dateGetter("Date", 1),
            HH: dateGetter("Hours", 2),
            H: dateGetter("Hours", 1),
            hh: dateGetter("Hours", 2, -12),
            h: dateGetter("Hours", 1, -12),
            mm: dateGetter("Minutes", 2),
            m: dateGetter("Minutes", 1),
            ss: dateGetter("Seconds", 2),
            s: dateGetter("Seconds", 1),
            sss: dateGetter("Milliseconds", 3),
            EEEE: dateStrGetter("Day"),
            EEE: dateStrGetter("Day", true),
            a: ampmGetter,
            Z: timeZoneGetter
        }
        var DATE_FORMATS_SPLIT = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/,
                NUMBER_STRING = /^\d+$/
        var R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/
        // 1        2       3         4          5          6          7          8  9     10      11

        function jsonStringToDate(string) {
            var match
            if (match = string.match(R_ISO8601_STR)) {
                var date = new Date(0),
                        tzHour = 0,
                        tzMin = 0,
                        dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear,
                        timeSetter = match[8] ? date.setUTCHours : date.setHours
                if (match[9]) {
                    tzHour = toInt(match[9] + match[10])
                    tzMin = toInt(match[9] + match[11])
                }
                dateSetter.call(date, toInt(match[1]), toInt(match[2]) - 1, toInt(match[3]))
                var h = toInt(match[4] || 0) - tzHour
                var m = toInt(match[5] || 0) - tzMin
                var s = toInt(match[6] || 0)
                var ms = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000)
                timeSetter.call(date, h, m, s, ms)
                return date
            }
            return string
        }
        var rfixFFDate = /^(\d+)-(\d+)-(\d{4})$/
        var rfixIEDate = /^(\d+)\s+(\d+),(\d{4})$/
        filters.date = function(date, format) {
            var locate = filters.date.locate,
                    text = "",
                    parts = [],
                    fn, match
            format = format || "mediumDate"
            format = locate[format] || format
            if (typeof date === "string") {
                if (NUMBER_STRING.test(date)) {
                    date = toInt(date)
                } else {
                    var trimDate = date.trim()
                    if (trimDate.match(rfixFFDate) || trimDate.match(rfixIEDate)) {
                        date = RegExp.$3 + "/" + RegExp.$1 + "/" + RegExp.$2
                    }
                    date = jsonStringToDate(date)
                }
                date = new Date(date)
            }
            if (typeof date === "number") {
                date = new Date(date)
            }
            if (getType(date) !== "date") {
                return
            }
            while (format) {
                match = DATE_FORMATS_SPLIT.exec(format)
                if (match) {
                    parts = parts.concat(match.slice(1))
                    format = parts.pop()
                } else {
                    parts.push(format)
                    format = null
                }
            }
            parts.forEach(function(value) {
                fn = DATE_FORMATS[value]
                text += fn ? fn(date, locate) : value.replace(/(^'|'$)/g, "").replace(/''/g, "'")
            })
            return text
        }
        var locate = {
            AMPMS: {
                0: "上午",
                1: "下午"
            },
            DAY: {
                0: "星期日",
                1: "星期一",
                2: "星期二",
                3: "星期三",
                4: "星期四",
                5: "星期五",
                6: "星期六"
            },
            MONTH: {
                0: "1月",
                1: "2月",
                2: "3月",
                3: "4月",
                4: "5月",
                5: "6月",
                6: "7月",
                7: "8月",
                8: "9月",
                9: "10月",
                10: "11月",
                11: "12月"
            },
            SHORTDAY: {
                "0": "周日",
                "1": "周一",
                "2": "周二",
                "3": "周三",
                "4": "周四",
                "5": "周五",
                "6": "周六"
            },
            fullDate: "y年M月d日EEEE",
            longDate: "y年M月d日",
            medium: "yyyy-M-d ah:mm:ss",
            mediumDate: "yyyy-M-d",
            mediumTime: "ah:mm:ss",
            "short": "yy-M-d ah:mm",
            shortDate: "yy-M-d",
            shortTime: "ah:mm"
        }
        locate.SHORTMONTH = locate.MONTH
        filters.date.locate = locate
    }
    /*********************************************************************
     *                      AMD Loader                                   *
     **********************************************************************/

    var innerRequire
    var modules = avalon.modules = {
        "ready!": {
            exports: avalon
        },
        "avalon": {
            exports: avalon,
            state: 2
        }
    }

    new function() {
        var loadings = [] //正在加载中的模块列表
        var factorys = [] //储存需要绑定ID与factory对应关系的模块（标准浏览器下，先parse的script节点会先onload）
        var basepath

        function cleanUrl(url) {
            return (url || "").replace(/[?#].*/, "")
        }
        plugins.js = function(url, shim) {
            var id = cleanUrl(url)
            if (!modules[id]) { //如果之前没有加载过
                modules[id] = {
                    id: id,
                    exports: {}
                }
                if (shim) { //shim机制
                    innerRequire(shim.deps || "", function() {
                        loadJS(url, id, function() {
                            modules[id].state = 2
                            if (shim.exports)
                                modules[id].exports = typeof shim.exports === "function" ?
                                        shim.exports() : window[shim.exports]
                            innerRequire.checkDeps()
                        })
                    })
                } else {
                    loadJS(url, id)
                }
            }
            return id
        }
        plugins.css = function(url) {
            var id = url.replace(/(#.+|\W)/g, "") ////用于处理掉href中的hash与所有特殊符号
            if (!DOC.getElementById(id)) {
                var node = DOC.createElement("link")
                node.rel = "stylesheet"
                node.href = url
                node.id = id
                head.insertBefore(node, head.firstChild)
            }
        }
        plugins.css.ext = ".css"
        plugins.js.ext = ".js"

        plugins.text = function(url) {
            var xhr = new XMLHttpRequest
            var id = url.replace(/[?#].*/, "")
            modules[id] = {}
            xhr.onload = function() {
                modules[id].state = 2
                modules[id].exports = xhr.responseText
                innerRequire.checkDeps()
            }
            xhr.onerror = function() {
                avalon.error(url + " 对应资源不存在或没有开启 CORS")
            }
            xhr.open("GET", url, true)
            xhr.withCredentials = true
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
            xhr.send()
            return id
        }
        //http://www.html5rocks.com/zh/tutorials/webcomponents/imports/
        if ('import' in DOC.createElement("link")) {
            plugins.text = function(url) {
                var id = url.replace(/[?#].*/, "")
                modules[id] = {}
                var link = DOC.createElement("link")
                link.rel = "import"
                link.href = url
                link.onload = function() {
                    modules[id].state = 2
                    var content = this["import"]
                    if (content) {
                        modules[id].exports = content.documentElement.outerHTML
                        avalon.require.checkDeps()
                    }
                    onerror(0, content)
                }

                function onerror(a, b) {
                    b && avalon.error(url + "对应资源不存在或没有开启 CORS")
                    setTimeout(function() {
                        head.removeChild(link)
                    })
                }
                link.onerror = onerror
                head.appendChild(link)
                return id
            }
        }

        var cur = getCurrentScript(true)
        if (!cur) { //处理window safari的Error没有stack的问题
            cur = avalon.slice(document.scripts).pop().src
        }
        var url = cleanUrl(cur)
        basepath = kernel.base = url.slice(0, url.lastIndexOf("/") + 1)

        function getCurrentScript(base) {
            // 参考 https://github.com/samyk/jiagra/blob/master/jiagra.js
            var stack
            try {
                a.b.c() //强制报错,以便捕获e.stack
            } catch (e) { //safari的错误对象只有line,sourceId,sourceURL
                stack = e.stack
            }
            if (stack) {
                /**e.stack最后一行在所有支持的浏览器大致如下:
                 *chrome23:
                 * at http://113.93.50.63/data.js:4:1
                 *firefox17:
                 *@http://113.93.50.63/query.js:4
                 *opera12:http://www.oldapps.com/opera.php?system=Windows_XP
                 *@http://113.93.50.63/data.js:4
                 *IE10:
                 *  at Global code (http://113.93.50.63/data.js:4:1)
                 *  //firefox4+ 可以用document.currentScript
                 */
                stack = stack.split(/[@ ]/g).pop() //取得最后一行,最后一个空格或@之后的部分
                stack = stack[0] === "(" ? stack.slice(1, -1) : stack.replace(/\s/, "") //去掉换行符
                return stack.replace(/(:\d+)?:\d+$/i, "") //去掉行号与或许存在的出错字符起始位置
            }
            var nodes = (base ? DOC : head).getElementsByTagName("script") //只在head标签中寻找
            for (var i = nodes.length, node; node = nodes[--i]; ) {
                if ((base || node.className === subscribers) && node.readyState === "interactive") {
                    return node.className = node.src
                }
            }
        }

        function checkCycle(deps, nick) {
            //检测是否存在循环依赖
            for (var id in deps) {
                if (deps[id] === "司徒正美" && modules[id].state !== 2 && (id === nick || checkCycle(modules[id].deps, nick))) {
                    return true
                }
            }
        }

        function checkDeps() {
            //检测此JS模块的依赖是否都已安装完毕,是则安装自身
            loop: for (var i = loadings.length, id; id = loadings[--i]; ) {
                var obj = modules[id],
                        deps = obj.deps
                for (var key in deps) {
                    if (ohasOwn.call(deps, key) && modules[key].state !== 2) {
                        continue loop
                    }
                }
                //如果deps是空对象或者其依赖的模块的状态都是2
                if (obj.state !== 2) {
                    loadings.splice(i, 1) //必须先移除再安装，防止在IE下DOM树建完后手动刷新页面，会多次执行它
                    fireFactory(obj.id, obj.args, obj.factory)
                    checkDeps() //如果成功,则再执行一次,以防有些模块就差本模块没有安装好
                }
            }
        }


        function checkFail(node, onError) {
            var id = cleanUrl(node.src) //检测是否死链
            node.onload = node.onerror = null
            if (onError) {
                setTimeout(function() {
                    head.removeChild(node)
                })
                log("debug: 加载 " + id + " 失败" + onError + " " + (!modules[id].state))
            } else {
                return true
            }
        }
        var rdeuce = /\/\w+\/\.\./

        function loadResources(url, parent, ret, shim) {
            //1. 特别处理mass|ready标识符
            if (url === "ready!" || (modules[url] && modules[url].state === 2)) {
                return url
            }
            //2.  处理text!  css! 等资源
            var plugin
            url = url.replace(/^\w+!/, function(a) {
                plugin = a.slice(0, -1)
                return ""
            })
            plugin = plugin || "js"
            plugin = plugins[plugin] || noop
            //3. 转化为完整路径
            if (typeof kernel.shim[url] === "object") {
                shim = kernel.shim[url]
            }
            if (kernel.paths[url]) { //别名机制
                url = kernel.paths[url]
            }
            //4. 补全路径
            if (/^(\w+)(\d)?:.*/.test(url)) {
                ret = url
            } else {
                parent = parent.substr(0, parent.lastIndexOf('/'))
                var tmp = url.charAt(0)
                if (tmp !== "." && tmp !== "/") { //相对于根路径
                    ret = basepath + url
                } else if (url.slice(0, 2) === "./") { //相对于兄弟路径
                    ret = parent + url.slice(1)
                } else if (url.slice(0, 2) === "..") { //相对于父路径
                    ret = parent + "/" + url
                    while (rdeuce.test(ret)) {
                        ret = ret.replace(rdeuce, "")
                    }
                } else if (tmp === "/") {
                    ret = parent + url //相对于兄弟路径
                } else {
                    avalon.error("不符合模块标识规则: " + url)
                }
            }
            //5. 补全扩展名
            url = cleanUrl(ret)
            var ext = plugin.ext
            if (ext) {
                if (url.slice(0 - ext.length) !== ext) {
                    ret += ext
                }
            }
            //6. 缓存处理
            if (kernel.nocache) {
                ret += (ret.indexOf("?") === -1 ? "?" : "&") + Date.now()
            }
            return plugin(ret, shim)
        }

        function loadJS(url, id, callback) {
            //通过script节点加载目标模块
            var node = DOC.createElement("script")
            node.className = subscribers //让getCurrentScript只处理类名为subscribers的script节点
            node.onload = function() {
                var factory = factorys.pop()
                factory && factory.delay(id)
                if (callback) {
                    callback()
                }
                log("debug: 已成功加载 " + url)
            }

            node.onerror = function() {
                checkFail(node, true)
            }
            node.src = url //插入到head的第一个节点前，防止IE6下head标签没闭合前使用appendChild抛错
            head.appendChild(node) //chrome下第二个参数不能为null
            log("debug: 正准备加载 " + url) //更重要的是IE6下可以收窄getCurrentScript的寻找范围
        }

        innerRequire = avalon.require = function(list, factory, parent) {
            // 用于检测它的依赖是否都为2
            var deps = {},
                    // 用于保存依赖模块的返回值
                    args = [],
                    // 需要安装的模块数
                    dn = 0,
                    // 已安装完的模块数
                    cn = 0,
                    id = parent || "callback" + setTimeout("1")
            parent = parent || basepath
            String(list).replace(rword, function(el) {
                var url = loadResources(el, parent)
                if (url) {
                    dn++

                    if (modules[url] && modules[url].state === 2) {
                        cn++
                    }
                    if (!deps[url]) {
                        args.push(url)
                        deps[url] = "司徒正美" //去重
                    }
                }
            })
            modules[id] = {//创建一个对象,记录模块的加载情况与其他信息
                id: id,
                factory: factory,
                deps: deps,
                args: args,
                state: 1
            }
            if (dn === cn) { //如果需要安装的等于已安装好的
                fireFactory(id, args, factory) //安装到框架中
            } else {
                //放到检测列队中,等待checkDeps处理
                loadings.unshift(id)
            }
            checkDeps()
        }

        /**
         * 定义模块
         * @param {String} id ? 模块ID
         * @param {Array} deps ? 依赖列表
         * @param {Function} factory 模块工厂
         * @api public
         */
        innerRequire.define = function(id, deps, factory) { //模块名,依赖列表,模块本身
            var args = avalon.slice(arguments)

            if (typeof id === "string") {
                var _id = args.shift()
            }
            if (typeof args[0] === "function") {
                args.unshift([])
            } //上线合并后能直接得到模块ID,否则寻找当前正在解析中的script节点的src作为模块ID
            //现在除了safari外，我们都能直接通过getCurrentScript一步到位得到当前执行的script节点，
            //safari可通过onload+delay闭包组合解决
            var name = modules[_id] && modules[_id].state >= 1 ? _id : cleanUrl(getCurrentScript())
            if (!modules[name] && _id) {
                modules[name] = {
                    id: name,
                    factory: factory,
                    state: 1
                }
            }
            factory = args[1]
            factory.id = _id //用于调试
            factory.delay = function(d) {
                args.push(d)
                var isCycle = true
                try {
                    isCycle = checkCycle(modules[d].deps, d)
                } catch (e) {
                }
                if (isCycle) {
                    avalon.error(d + "模块与之前的模块存在循环依赖，请不要直接用script标签引入" + d + "模块")
                }
                delete factory.delay //释放内存
                innerRequire.apply(null, args) //0,1,2 --> 1,2,0
            }

            if (name) {
                factory.delay(name, args)
            } else { //先进先出
                factorys.push(factory)
            }
        }
        innerRequire.define.amd = modules

        function fireFactory(id, deps, factory) {
            for (var i = 0, array = [], d; d = deps[i++]; ) {
                array.push(modules[d].exports)
            }
            var module = Object(modules[id]),
                    ret = factory.apply(window, array)
            module.state = 2
            if (ret !== void 0) {
                modules[id].exports = ret
            }
            return ret
        }
        innerRequire.config = kernel
        innerRequire.checkDeps = checkDeps
    }
    /*********************************************************************
     *                           Touch  Event                           *
     **********************************************************************/
    var IE11touch = navigator.pointerEnabled
    var IE9_10touch = navigator.msPointerEnabled
    // if ("ontouchstart" in window || IE9_10touch || IE11touch) {
    //     (function() {
    //         var touchProxy = {}, touchTimeout, tapTimeout, swipeTimeout, holdTimeout,
    //                 now, firstTouch, _isPointerType, delta, deltaX = 0,
    //                 deltaY = 0,
    //                 touchNames = []

    //         function swipeDirection(x1, x2, y1, y2) {
    //             return Math.abs(x1 - x2) >=
    //                     Math.abs(y1 - y2) ? (x1 - x2 > 0 ? "left" : "right") : (y1 - y2 > 0 ? "up" : "down")
    //         }

    //         function longTap() {
    //             if (touchProxy.last) {
    //                 touchProxy.fire("hold")
    //                 touchProxy = {}
    //             }
    //         }

    //         function cancelHold() {
    //             clearTimeout(holdTimeout)
    //         }

    //         function cancelAll() {
    //             clearTimeout(touchTimeout)
    //             clearTimeout(tapTimeout)
    //             clearTimeout(swipeTimeout)
    //             clearTimeout(holdTimeout)
    //             touchProxy = {}
    //         }

    //         if (IE11touch) { //IE11 与 W3C
    //             touchNames = ["pointerdown", "pointermove", "pointerup", "pointercancel"]
    //         } else if (IE9_10touch) { //IE9-10
    //             touchNames = ["MSPointerDown", "MSPointerMove", "MSPointerUp", "MSPointerCancel"]
    //         } else {
    //             touchNames = ["touchstart", "touchmove", "touchend", "touchcancel"]
    //         }

    //         function isPrimaryTouch(event) { //是否纯净的触摸事件，非mousemove等模拟的事件，也不是手势事件
    //             return (event.pointerType === "touch" ||
    //                     event.pointerType === event.MSPOINTER_TYPE_TOUCH) && event.isPrimary
    //         }

    //         function isPointerEventType(e, type) { //是否最新发布的PointerEvent
    //             return (e.type === "pointer" + type ||
    //                     e.type.toLowerCase() === "mspointer" + type)
    //         }

    //         DOC.addEventListener(touchNames[0], function(e) {
    //             if ((_isPointerType = isPointerEventType(e, "down")) && !isPrimaryTouch(e))
    //                 return
    //             firstTouch = _isPointerType ? e : e.touches[0]
    //             if (e.touches && e.touches.length === 1 && touchProxy.x2) {
    //                 touchProxy.x2 = touchProxy.y2 = void 0
    //             }
    //             now = Date.now()
    //             delta = now - (touchProxy.last || now)
    //             var el = firstTouch.target
    //             touchProxy.el = "tagName" in el ? el : el.parentNode
    //             clearTimeout(touchTimeout)
    //             touchProxy.x1 = firstTouch.pageX
    //             touchProxy.y1 = firstTouch.pageY
    //             touchProxy.fire = function(name) {
    //                 avalon.fire(this.el, name)
    //             }
    //             if (delta > 0 && delta <= 250) { //双击
    //                 touchProxy.isDoubleTap = true
    //             }
    //             touchProxy.last = now
    //             holdTimeout = setTimeout(longTap, 750)
    //         })
    //         DOC.addEventListener(touchNames[1], function(e) {
    //             if ((_isPointerType = isPointerEventType(e, "move")) && !isPrimaryTouch(e))
    //                 return
    //             firstTouch = _isPointerType ? e : e.touches[0]
    //             cancelHold()
    //             touchProxy.x2 = firstTouch.pageX
    //             touchProxy.y2 = firstTouch.pageY
    //             deltaX += Math.abs(touchProxy.x1 - touchProxy.x2)
    //             deltaY += Math.abs(touchProxy.y1 - touchProxy.y2)
    //         })

    //         DOC.addEventListener(touchNames[2], function(e) {
    //             if ((_isPointerType = isPointerEventType(e, "up")) && !isPrimaryTouch(e))
    //                 return
    //             cancelHold()
    //             // swipe
    //             if ((touchProxy.x2 && Math.abs(touchProxy.x1 - touchProxy.x2) > 30) ||
    //                     (touchProxy.y2 && Math.abs(touchProxy.y1 - touchProxy.y2) > 30)) {
    //                 //如果是滑动，根据最初与最后的位置判定其滑动方向
    //                 swipeTimeout = setTimeout(function() {
    //                     touchProxy.fire("swipe")
    //                     touchProxy.fire("swipe" + (swipeDirection(touchProxy.x1, touchProxy.x2, touchProxy.y1, touchProxy.y2)))
    //                     touchProxy = {}
    //                 }, 0)
    //                 // normal tap 
    //             } else if ("last" in touchProxy) {
    //                 if (deltaX < 30 && deltaY < 30) { //如果移动的距离太小
    //                     tapTimeout = setTimeout(function() {
    //                         touchProxy.fire("tap")
    //                         if (touchProxy.isDoubleTap) {
    //                             touchProxy.fire('doubletap')
    //                             touchProxy = {}
    //                         } else {
    //                             touchTimeout = setTimeout(function() {
    //                                 touchProxy.fire('singletap')
    //                                 touchProxy = {}
    //                             }, 250)
    //                         }
    //                     }, 0)
    //                 } else {
    //                     touchProxy = {}
    //                 }
    //             }
    //             deltaX = deltaY = 0
    //         })

    //         DOC.addEventListener(touchNames[3], cancelAll)
    //     })()
    //     //http://quojs.tapquo.com/ http://code.baidu.com/
    //     //'swipe', 'swipeleft', 'swiperight', 'swipeup', 'swipedown',  'doubletap', 'tap', 'singletap', 'hold'
    // }
    /*********************************************************************
     *                    DOMReady                                         *
     **********************************************************************/
    $.av = avalon;
    function fireReady() {
        modules["ready!"].state = 2
        innerRequire.checkDeps()
        fireReady = noop //隋性函数，防止IE9二次调用_checkDeps
    }

    if (DOC.readyState === "complete") {
        setTimeout(fireReady) //如果在domReady之外加载
    } else {
        DOC.addEventListener("DOMContentLoaded", fireReady)
        window.addEventListener("load", fireReady)
    }
    avalon.ready = function(fn) {
        innerRequire("ready!", fn)
    }
    avalon.config({
        loader: false
    })
    var msSelector = "[ms-controller],[ms-important]"
    avalon.ready(function() {
        var elems = DOC.querySelectorAll(msSelector),
                nodes = []
        for (var i = 0, elem; elem = elems[i++]; ) {
            if (!elem.__root__) {
                var array = elem.querySelectorAll(msSelector)
                for (var j = 0, el; el = array[j++]; ) {
                    el.__root__ = true
                }
                nodes.push(elem)
            }
        }
        for (var i = 0, elem; elem = nodes[i++]; ) {
            avalon.scan(elem)
        }
    });

})($$$, document);
;(function ( $ ){
	$.ajax = function ( ops ){
		var timeIsOut = false;
		var options = $.extend({}, {
			type: 'POST',
			url:'',
			dataType: 'JSON',
			data:{},
			timeout: 0,
			success: function(){},
			error: function(){}
		}, ops )

		if(!options.url)return;
		if(/\#/.test(options.url)) options.url = options.url.replace(/\#[\s\S]+$/, '');
		//1.创建ajax对象
		var xhr = new XMLHttpRequest();

		function isEmpty(obj) 
		{ 
			for (var name in obj)  
			{ 
				return false; 
			} 
			return true; 
		}; 

		function json2str(json) {
			var strArr = [];

			for (var i in json) {
				if(i == 'method' || i == 'timeout' || i == 'async' || i == 'ajaxUrl' || i == 'url') {
					continue;
				} else {
					return $.param(options.data);
				}
			}
		}

		var data = isEmpty(options.data) ? '' : json2str(options.data);
		var str = options.url + (options.url.indexOf('?')==-1 ? '?' : '&') + (/POST/i.test(options.type) ? ('noCache=' + (+new Date)) : (!!data ? data + '&noCache=' + (+new Date) : data + 'noCache=' + (+new Date)) );
		var timerID = null;
		xhr.open(options.type, str);
		//超时检测
		options.timeout = typeof options.timeout === 'boolean' ? ( options.timeout === true ? 5000 : false) : (typeof options.timeout === 'string' || typeof options.timeout === 'number' ? ( parseInt(options.timeout, 10) == 0 || parseInt(options.timeout, 10) <= 5000 ? false : parseInt(options.timeout, 10) ) : parseInt(options.timeout, 10) );

		if( !!options.timeout ) {
			timerID = setTimeout(function() {
				if (xhr.readyState != 4) {
					timeIsOut = true;
					xhr.abort();
					var confirmBol = confirm('请求超时\n点击确定自动刷新本页\n点击取消手动刷新')
					if(confirmBol)
					{
						window.location.reload();
					}
					clearTimeout(timerID);
				}
			}, options.timeout );
		}

		xhr.onreadystatechange=function () {
			//try {
				if (xhr.readyState==4) {
					if(!timeIsOut && xhr.status == 200  ) {
						if( options.success ) {
							var data = xhr.responseText;
							if( /JSON/i.test(options.dataType) ) {
								if( typeof xhr.responseText=='string' && xhr.responseText!='' ) {
									// try {
										data = JSON.parse(data);
										options.success(data);
										// console.log(data)
									// } catch(e) { 
										// console.log(data)
										// window.console ? console.log('服务器返回JSON错误'): alert('服务器返回JSON错误')  
									// }
								}
							} else {
								// console.log(data.length)
								options.success(data);
							}
						}
					}
					else {
						if( options.error ) {
							options.error( xhr )
						}
					}
				}
			//} catch(e) { window.console && console.log(e) }
		};
		if ( /post/i.test(options.type) ) {
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			xhr.send(data);
		} else {
			xhr.send(null);
		}		
	}
})( $$$ );
/* ==============================
	js template
	{%=it.data%}
================================ */
(function ( $, window  ) {
/*! 
doT.js
2011, Laura Doktorova, https://github.com/olado/doT
Licensed under the MIT license.
templateSettings: {
	evaluate:    /\{\{([\s\S]+?(\}?)+)\}\}/g,
	interpolate: /\{\{=([\s\S]+?)\}\}/g,
	encode:      /\{\{!([\s\S]+?)\}\}/g,
	use:         /\{\{#([\s\S]+?)\}\}/g,
	useParams:   /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
	define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
	defineParams:/^\s*([\w$]+):([\s\S]+)/,
	conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
	iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
	varname:	'it',
	strip:		true,
	append:		true,
	selfcontained: false
}
*/
"use strict";
var doT = {
	version: '1.0.1',
	templateSettings:{evaluate:/\{\%([\s\S]+?)\%\}/g,interpolate:/\{\%=([\s\S]+?)\%\}/g,encode:/\{\%!([\s\S]+?)\%\}/g,use:/\{\%#([\s\S]+?)\%\}/g,define:/\{\%##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\%\}/g,conditional:/\{\%\?(\?)?\s*([\s\S]*?)\s*\%\}/g,iterate:/\{\%~\s*(?:\%\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\%\})/g,varname:"it",strip:true,append:true,selfcontained:false},
	template: undefined, //fn, compile template
	compile:  undefined  //fn, for express
}, global;
/*!if (typeof module !== 'undefined' && module.exports) {
	module.exports = doT;
} else if (typeof define === 'function' && define.amd) {
	define(function(){return doT;});
} else {
	global = (function(){ return this || (0,eval)('this'); }());
	global.doT = doT;
}*/

function encodeHTMLSource() {
	var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },
		matchHTML = /&(?!#?\w+;)|<|>|"|'|\//g;
	return function() {
		return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : this;
	};
}
String.prototype.encodeHTML = encodeHTMLSource();

var startend = {
	append: { start: "'+(",      end: ")+'",      endencode: "||'').toString().encodeHTML()+'" },
	split:  { start: "';out+=(", end: ");out+='", endencode: "||'').toString().encodeHTML();out+='"}
}, skip = /$^/;

function resolveDefs(c, block, def) {
	return ((typeof block === 'string') ? block : block.toString())
	.replace(c.define || skip, function(m, code, assign, value) {
		if (code.indexOf('def.') === 0) {
			code = code.substring(4);
		}
		if (!(code in def)) {
			if (assign === ':') {
				if (c.defineParams) value.replace(c.defineParams, function(m, param, v) {
					def[code] = {arg: param, text: v};
				});
				if (!(code in def)) def[code]= value;
			} else {
				new Function("def", "def['"+code+"']=" + value)(def);
			}
		}
		return '';
	})
	.replace(c.use || skip, function(m, code) {
		if (c.useParams) code = code.replace(c.useParams, function(m, s, d, param) {
			if (def[d] && def[d].arg && param) {
				var rw = (d+":"+param).replace(/'|\\/g, '_');
				def.__exp = def.__exp || {};
				def.__exp[rw] = def[d].text.replace(new RegExp("(^|[^\\w$])" + def[d].arg + "([^\\w$])", "g"), "$1" + param + "$2");
				return s + "def.__exp['"+rw+"']";
			}
		});
		var v = new Function("def", "return " + code)(def);
		return v ? resolveDefs(c, v, def) : v;
	});
}

function unescape(code) {
	return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, ' ');
}

doT.template = function(tmpl, c, def) {
	c = c || doT.templateSettings;
	var cse = c.append ? startend.append : startend.split, needhtmlencode, sid = 0, indv,
		str  = (c.use || c.define) ? resolveDefs(c, tmpl, def || {}) : tmpl;

	str = ("var out='" + (c.strip ? str.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g,' ')
				.replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,''): str)
		.replace(/'|\\/g, '\\$&')
		.replace(c.interpolate || skip, function(m, code) {
			return cse.start + unescape(code) + cse.end;
		})
		.replace(c.encode || skip, function(m, code) {
			needhtmlencode = true;
			return cse.start + unescape(code) + cse.endencode;
		})
		.replace(c.conditional || skip, function(m, elsecase, code) {
			return elsecase ?
				(code ? "';}else if(" + unescape(code) + "){out+='" : "';}else{out+='") :
				(code ? "';if(" + unescape(code) + "){out+='" : "';}out+='");
		})
		.replace(c.iterate || skip, function(m, iterate, vname, iname) {
			if (!iterate) return "';} } out+='";
			sid+=1; indv=iname || "i"+sid; iterate=unescape(iterate);
			return "';var arr"+sid+"="+iterate+";if(arr"+sid+"){var "+vname+","+indv+"=-1,l"+sid+"=arr"+sid+".length-1;while("+indv+"<l"+sid+"){"
				+vname+"=arr"+sid+"["+indv+"+=1];out+='";
		})
		.replace(c.evaluate || skip, function(m, code) {
			return "';" + unescape(code) + "out+='";
		})
		+ "';return out;")
		.replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/\r/g, '\\r')
		.replace(/(\s|;|\}|^|\{)out\+='';/g, '$1').replace(/\+''/g, '')
		.replace(/(\s|;|\}|^|\{)out\+=''\+/g,'$1out+=');

	if (needhtmlencode && c.selfcontained) {
		str = "String.prototype.encodeHTML=(" + encodeHTMLSource.toString() + "());" + str;
	}
	try {
		return new Function(c.varname, str);
	} catch (e) {
		if (typeof console !== 'undefined') console.log("Could not create a template function: " + str);
		throw e;
	}
};
doT.compile = function(tmpl, def) {
	return doT.template(tmpl, null, def);
};
$.doT = function ( tmpl, data ) {
	if( tmpl && data ) {
		return doT.template(tmpl).apply(null, [data])
	}
}
})($$$, window);
(function ($, window, document, Math) {
var rAF = window.requestAnimationFrame	||
	window.webkitRequestAnimationFrame	||
	window.mozRequestAnimationFrame		||
	window.oRequestAnimationFrame		||
	window.msRequestAnimationFrame		||
	function (callback) { window.setTimeout(callback, 1000 / 60); };

	var userAgent = window.navigator.userAgent;
	var matchAgent = userAgent.match(/shouxiner[\s\S]+$/);
	var userAgentToShouxiner = matchAgent ? matchAgent[1] : null;
	var isOsIos = ( $.os.ios || $.os.ios7 || $.os.iphone ) || (userAgentToShouxiner ? (/ios/i.test(userAgentToShouxiner)) : false );
	var isOsAndroid = ( $.os.android || $.os.androidICS ) || ( userAgentToShouxiner ? (/android/i.test(userAgentToShouxiner)) : false );


var utils = (function () {
	var me = {};

	var _elementStyle = document.createElement('div').style;
	var _vendor = (function () {
		var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
			transform,
			i = 0,
			l = vendors.length;

		for ( ; i < l; i++ ) {
			transform = vendors[i] + 'ransform';
			if ( transform in _elementStyle ) return vendors[i].substr(0, vendors[i].length-1);
		}

		return false;
	})();

	function _prefixStyle (style) {
		if ( _vendor === false ) return false;
		if ( _vendor === '' ) return style;
		return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
	}

	me.getTime = Date.now || function getTime () { return new Date().getTime(); };

	me.extend = function (target, obj) {
		for ( var i in obj ) {
			target[i] = obj[i];
		}
	};

	me.addEvent = function (el, type, fn, capture) {
		el.addEventListener(type, fn, !!capture);
	};

	me.removeEvent = function (el, type, fn, capture) {
		el.removeEventListener(type, fn, !!capture);
	};

	me.prefixPointerEvent = function (pointerEvent) {
		return window.MSPointerEvent ? 
			'MSPointer' + pointerEvent.charAt(9).toUpperCase() + pointerEvent.substr(10):
			pointerEvent;
	};

	me.momentum = function (current, start, time, lowerMargin, wrapperSize, deceleration) {
		var distance = current - start,
			speed = Math.abs(distance) / time,
			destination,
			duration;

		deceleration = deceleration === undefined ? 0.0006 : deceleration;

		destination = current + ( speed * speed ) / ( 2 * deceleration ) * ( distance < 0 ? -1 : 1 );
		duration = speed / deceleration;

		if ( destination < lowerMargin ) {
			destination = wrapperSize ? lowerMargin - ( wrapperSize / 2.5 * ( speed / 8 ) ) : lowerMargin;
			distance = Math.abs(destination - current);
			duration = distance / speed;
		} else if ( destination > 0 ) {
			destination = wrapperSize ? wrapperSize / 2.5 * ( speed / 8 ) : 0;
			distance = Math.abs(current) + destination;
			duration = distance / speed;
		}

		return {
			destination: Math.round(destination),
			duration: duration
		};
	};

	var _transform = _prefixStyle('transform');

	me.extend(me, {
		hasTransform: _transform !== false,
		hasPerspective: _prefixStyle('perspective') in _elementStyle,
		hasTouch: 'ontouchstart' in window,
		hasPointer: window.PointerEvent || window.MSPointerEvent, // IE10 is prefixed
		hasTransition: _prefixStyle('transition') in _elementStyle
	});

	// This should find all Android browsers lower than build 535.19 (both stock browser and webview)
	me.isBadAndroid = /Android /.test(window.navigator.appVersion) && !(/Chrome\/\d/.test(window.navigator.appVersion));

	me.extend(me.style = {}, {
		transform: _transform,
		transitionTimingFunction: _prefixStyle('transitionTimingFunction'),
		transitionDuration: _prefixStyle('transitionDuration'),
		transitionDelay: _prefixStyle('transitionDelay'),
		transformOrigin: _prefixStyle('transformOrigin')
	});

	me.hasClass = function (e, c) {
		var re = new RegExp("(^|\\s)" + c + "(\\s|$)");
		return re.test(e.className);
	};

	me.addClass = function (e, c) {
		if ( me.hasClass(e, c) ) {
			return;
		}

		var newclass = e.className.split(' ');
		newclass.push(c);
		e.className = newclass.join(' ');
	};

	me.removeClass = function (e, c) {
		if ( !me.hasClass(e, c) ) {
			return;
		}

		var re = new RegExp("(^|\\s)" + c + "(\\s|$)", 'g');
		e.className = e.className.replace(re, ' ');
	};

	me.offset = function (el) {
		var left = -el.offsetLeft,
			top = -el.offsetTop;

		// jshint -W084
		while (el = el.offsetParent) {
			left -= el.offsetLeft;
			top -= el.offsetTop;
		}
		// jshint +W084

		return {
			left: left,
			top: top
		};
	};

	me.preventDefaultException = function (el, exceptions) {
		for ( var i in exceptions ) {
			if ( exceptions[i].test(el[i]) ) {
				return true;
			}
		}

		return false;
	};

	me.extend(me.eventType = {}, {
		touchstart: 1,
		touchmove: 1,
		touchend: 1,

		mousedown: 2,
		mousemove: 2,
		mouseup: 2,

		pointerdown: 3,
		pointermove: 3,
		pointerup: 3,

		MSPointerDown: 3,
		MSPointerMove: 3,
		MSPointerUp: 3
	});

	me.extend(me.ease = {}, {
		quadratic: {
			style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
			fn: function (k) {
				return k * ( 2 - k );
			}
		},
		circular: {
			style: 'cubic-bezier(0.1, 0.57, 0.1, 1)',	// Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
			fn: function (k) {
				return Math.sqrt( 1 - ( --k * k ) );
			}
		},
		back: {
			style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
			fn: function (k) {
				var b = 4;
				return ( k = k - 1 ) * k * ( ( b + 1 ) * k + b ) + 1;
			}
		},
		bounce: {
			style: '',
			fn: function (k) {
				if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {
					return 7.5625 * k * k;
				} else if ( k < ( 2 / 2.75 ) ) {
					return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
				} else if ( k < ( 2.5 / 2.75 ) ) {
					return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
				} else {
					return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
				}
			}
		},
		elastic: {
			style: '',
			fn: function (k) {
				var f = 0.22,
					e = 0.4;

				if ( k === 0 ) { return 0; }
				if ( k == 1 ) { return 1; }

				return ( e * Math.pow( 2, - 10 * k ) * Math.sin( ( k - f / 4 ) * ( 2 * Math.PI ) / f ) + 1 );
			}
		}
	});

	me.tap = function (e, eventName) {
		var ev = document.createEvent('Event');
		ev.initEvent(eventName, true, true);
		ev.pageX = e.pageX;
		ev.pageY = e.pageY;
		e.target.dispatchEvent(ev);
	};

	me.click = function (e) {
		var target = e.target,
			ev;


		if ( !(/(SELECT|INPUT|TEXTAREA)/i).test(target.tagName) ) {
			ev = document.createEvent('MouseEvents');
			ev.initMouseEvent('click', true, true, e.view, 1,
				target.screenX, target.screenY, target.clientX, target.clientY,
				e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
				0, null);

			ev._constructed = true;
			target.dispatchEvent(ev);
		}
	};

	return me;
})();

function IScroll (el, options) {
	this.wrapper = typeof el == 'string' ? document.querySelector(el) : el;
	this.scroller = this.wrapper.children[0];
	this.scrollerStyle = this.scroller.style;

	this.options = {

		resizeScrollbars: true,

		mouseWheelSpeed: 20,

		snapThreshold: 0.334,


		startX: 0,
		startY: 0,
		scrollY: true,

		
		topOffset:0,
		bottomOffset:0,

		directionLockThreshold: 5,
		momentum: true,

		bounce: true,
		bounceTime: 600,
		bounceEasing: '',

		preventDefault: true,
		preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ },

		HWCompositing: true,
		useTransition: true,
		useTransform: true
	};

	for ( var i in options ) {
		this.options[i] = options[i];
	}

	// Normalize options
	this.translateZ = this.options.HWCompositing && utils.hasPerspective ? ' translateZ(0)' : '';

	this.options.useTransition = utils.hasTransition && this.options.useTransition;
	this.options.useTransform = utils.hasTransform && this.options.useTransform;

	this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough;
	this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;

	// If you want eventPassthrough I have to lock one of the axes
	this.options.scrollY = this.options.eventPassthrough == 'vertical' ? false : this.options.scrollY;
	this.options.scrollX = this.options.eventPassthrough == 'horizontal' ? false : this.options.scrollX;

	// With eventPassthrough we also need lockDirection mechanism
	this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
	this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;

	this.options.bounceEasing = typeof this.options.bounceEasing == 'string' ? utils.ease[this.options.bounceEasing] || utils.ease.circular : this.options.bounceEasing;

	this.options.resizePolling = this.options.resizePolling === undefined ? 60 : this.options.resizePolling;

	if ( this.options.tap === true ) {
		this.options.tap = 'tap';
	}

	if ( this.options.shrinkScrollbars == 'scale' ) {
		this.options.useTransition = false;
	}

	this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1;

	if ( this.options.probeType == 3 ) {
		this.options.useTransition = false;	
	}
// INSERT POINT: NORMALIZATION

	// Some defaults	
	this.x = 0
	this.y = 0;//this.options.topOffset ? this.options.topOffset : 0;
	this.directionX = 0;
	this.directionY = 0;
	this._events = {};

	// INSERT POINT: DEFAULTS

	this._init();
	this.refresh();

	this.scrollTo(this.options.startX, (this.options.topOffset ? this.options.startY + this.options.topOffset : this.options.startY ) );
	this.enable();
}

IScroll.prototype = {
	version: '5.1.2',

	_init: function () {
		this._initEvents();

		if ( this.options.scrollbars || this.options.indicators ) {
			this._initIndicators();
		}

		if ( this.options.mouseWheel ) {
			this._initWheel();
		}

		if ( this.options.snap ) {
			this._initSnap();
		}

		if ( this.options.keyBindings ) {
			this._initKeys();
		}

		// INSERT POINT: _init

	},

	destroy: function () {
		this._initEvents(true);

		this._execEvent('destroy');
	},

	_transitionEnd: function (e) {
		if ( e.target != this.scroller || !this.isInTransition ) {
			return;
		}

		this._transitionTime();
		if ( !this.resetPosition(this.options.bounceTime) ) {
			this.isInTransition = false;
			this._execEvent('scrollEnd');
		}
	},

	_start: function (e) {
		// React to left mouse button only
		if ( utils.eventType[e.type] != 1 ) {
			if ( e.button !== 0 ) {
				return;
			}
		}

		if ( !this.enabled || (this.initiated && utils.eventType[e.type] !== this.initiated) ) {
			return;
		}
		if ( this.options.preventDefault && !utils.isBadAndroid && !utils.preventDefaultException(e.target, this.options.preventDefaultException) /*&& !e.target.classList.contains('select-on')*/ ) {
			e.preventDefault();
		}

		var point = e.touches ? e.touches[0] : e,
			pos;

		this.initiated	= utils.eventType[e.type];
		this.moved		= false;
		this.distX		= 0;
		this.distY		= 0;
		this.directionX = 0;
		this.directionY = 0;
		this.directionLocked = 0;

		this._transitionTime();

		this.startTime = utils.getTime();

		if ( this.options.useTransition && this.isInTransition ) {
			this.isInTransition = false;
			pos = this.getComputedPosition();
			this._translate(Math.round(pos.x), Math.round(pos.y));
			this._execEvent('scrollEnd');
		} else if ( !this.options.useTransition && this.isAnimating ) {
			this.isAnimating = false;
			this._execEvent('scrollEnd');
		}

		this.startX    = this.x;
		this.startY    = this.y;
		this.absStartX = this.x;
		this.absStartY = this.y;
		this.pointX    = point.pageX;
		this.pointY    = point.pageY;

		this._execEvent('beforeScrollStart');
	},

	_move: function (e) {
		if ( !this.enabled || utils.eventType[e.type] !== this.initiated ) {
			return;
		}

		if ( this.options.preventDefault ) {	// increases performance on Android? TODO: check!
			e.preventDefault();
		}

		var point		= e.touches ? e.touches[0] : e,
			deltaX		= point.pageX - this.pointX,
			deltaY		= point.pageY - this.pointY,
			timestamp	= utils.getTime(),
			newX, newY,
			absDistX, absDistY;

		this.pointX		= point.pageX;
		this.pointY		= point.pageY;

		this.distX		+= deltaX;
		this.distY		+= deltaY;
		absDistX		= Math.abs(this.distX);
		absDistY		= Math.abs(this.distY);

		// We need to move at least 10 pixels for the scrolling to initiate
		if ( timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10) ) {
			return;
		}

		// If you are scrolling in one direction lock the other
		if ( !this.directionLocked && !this.options.freeScroll ) {
			if ( absDistX > absDistY + this.options.directionLockThreshold ) {
				this.directionLocked = 'h';		// lock horizontally
			} else if ( absDistY >= absDistX + this.options.directionLockThreshold ) {
				this.directionLocked = 'v';		// lock vertically
			} else {
				this.directionLocked = 'n';		// no lock
			}
		}

		if ( this.directionLocked == 'h' ) {
			if ( this.options.eventPassthrough == 'vertical' ) {
				e.preventDefault();
			} else if ( this.options.eventPassthrough == 'horizontal' ) {
				this.initiated = false;
				return;
			}

			deltaY = 0;
		} else if ( this.directionLocked == 'v' ) {
			if ( this.options.eventPassthrough == 'horizontal' ) {
				e.preventDefault();
			} else if ( this.options.eventPassthrough == 'vertical' ) {
				this.initiated = false;
				return;
			}

			deltaX = 0;
		}

		deltaX = this.hasHorizontalScroll ? deltaX : 0;
		deltaY = this.hasVerticalScroll ? deltaY : 0;

		newX = this.x + deltaX;
		newY = this.y + deltaY;

		// Slow down if outside of the boundaries
		if ( newX > 0 || newX < this.maxScrollX ) {
			newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
		}
		if ( newY > 0 || newY < this.maxScrollY ) {
			newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
		}

		this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
		this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

		if ( !this.moved ) {
			this._execEvent('scrollStart');
		}

		this.moved = true;

		this._translate(newX, newY);

		/* REPLACE START: _move */

		if ( timestamp - this.startTime > 300 ) {
			this.startTime = timestamp;
			this.startX = this.x;
			this.startY = this.y;

			if ( this.options.probeType == 1 ) {
				this._execEvent('scroll');
			}
		}
		if ( this.options.probeType > 1 ) {
			this._execEvent('scroll');
		}
		/* REPLACE END: _move */

	},

	_end: function (e) {
		if ( !this.enabled || utils.eventType[e.type] !== this.initiated ) {
			return;
		}

		if ( this.options.preventDefault && !utils.preventDefaultException(e.target, this.options.preventDefaultException) ) {
			e.preventDefault();
		}

		var point = e.changedTouches ? e.changedTouches[0] : e,
			momentumX,
			momentumY,
			duration = utils.getTime() - this.startTime,
			newX = Math.round(this.x),
			newY = Math.round(this.y),
			distanceX = Math.abs(newX - this.startX),
			distanceY = Math.abs(newY - this.startY),
			time = 0,
			easing = '';

		this.isInTransition = 0;
		this.initiated = 0;
		this.endTime = utils.getTime();

		// reset if we are outside of the boundaries
		if ( this.resetPosition(this.options.bounceTime) ) {
			return;
		}

		this.scrollTo(newX, newY);	// ensures that the last position is rounded

		// we scrolled less than 10 pixels
		if ( !this.moved ) {
			if ( this.options.tap ) {
				utils.tap(e, this.options.tap);
			}

			if ( this.options.click ) {
				utils.click(e);
			}

			this._execEvent('scrollCancel');
			return;
		}

		if ( this._events.flick && duration < 200 && distanceX < 100 && distanceY < 100 ) {
			this._execEvent('flick');
			return;
		}

		// start momentum animation if needed
		if ( this.options.momentum && duration < 300 ) {
			momentumX = this.hasHorizontalScroll ? utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : { destination: newX, duration: 0 };
			momentumY = this.hasVerticalScroll ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : { destination: newY, duration: 0 };
			newX = momentumX.destination;
			newY = momentumY.destination;
			time = Math.max(momentumX.duration, momentumY.duration);
			this.isInTransition = 1;
		}


		if ( this.options.snap ) {
			var snap = this._nearestSnap(newX, newY);
			this.currentPage = snap;
			time = this.options.snapSpeed || Math.max(
					Math.max(
						Math.min(Math.abs(newX - snap.x), 1000),
						Math.min(Math.abs(newY - snap.y), 1000)
					), 300);
			newX = snap.x;
			newY = snap.y;

			this.directionX = 0;
			this.directionY = 0;
			easing = this.options.bounceEasing;
		}

		// INSERT POINT: _end

		if ( newX != this.x || newY != this.y ) {
			// change easing function when scroller goes out of the boundaries
			if ( newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY ) {
				easing = utils.ease.quadratic;
			}

			this.scrollTo(newX, newY, time, easing);
			return;
		}

		this._execEvent('scrollEnd');
	},

	_resize: function () {
		var that = this;

		clearTimeout(this.resizeTimeout);

		this.resizeTimeout = setTimeout(function () {
			that.refresh();
		}, this.options.resizePolling);
	},

	resetPosition: function (time) {
		var x = this.x,
			y = this.y;//(this.options.topOffset ? this.y+this.options.topOffset : this.y );


		time = time || 0;

		if ( !this.hasHorizontalScroll || this.x > 0 ) {
			x = 0;
		} else if ( this.x < this.maxScrollX ) {
			x = this.maxScrollX;
		}

		if ( !this.hasVerticalScroll || ( this.options.topOffset ?  this.y > this.options.topOffset : this.y > 0) ) {
			y = (this.options.topOffset?this.options.topOffset:0);
		} else if ( this.y < this.maxScrollY ) {
			y = this.maxScrollY;
		}

		if ( x == this.x && y == this.y ) {
			return false;
		}
		this.scrollTo(x, y, time, this.options.bounceEasing);

		return true;
	},

	disable: function () {
		this.enabled = false;
	},

	enable: function () {
		this.enabled = true;
	},

	refresh: function () {
		var rf = this.wrapper.offsetHeight;		// Force reflow
		
		var topBot = (this.options.bottomOffset ?  this.options.bottomOffset : 0 )
		this.wrapperWidth	= this.wrapper.clientWidth;
		this.wrapperHeight	= this.wrapper.clientHeight;
		
		/* REPLACE START: refresh */
		this.scrollerWidth	= this.scroller.offsetWidth;
		this.scrollerHeight	= this.scroller.offsetHeight;


		this.maxScrollX		= this.wrapperWidth - this.scrollerWidth;
		// this.maxScrollY		= this.wrapperHeight - this.scrollerHeight; //topBot ? (dis > 0 ? dis+topBot : dis+topBot ) : dis;

		if( this.scrollerHeight >  this.wrapperHeight ) {
		

			this.maxScrollY		= this.wrapperHeight - (this.scrollerHeight+topBot);
		} else {
			
			this.maxScrollY		= this.wrapperHeight - this.scrollerHeight;
		}
		/* REPLACE END: refresh */

		this.hasHorizontalScroll	= this.options.scrollX && this.maxScrollX < 0;
		this.hasVerticalScroll		= this.options.scrollY && this.maxScrollY < 0;

		if ( !this.hasHorizontalScroll ) {
			this.maxScrollX = 0;
			this.scrollerWidth = this.wrapperWidth;
		}

		if ( !this.hasVerticalScroll ) {
			this.maxScrollY = 0;
			this.scrollerHeight = this.wrapperHeight;
		}

		this.endTime = 0;
		this.directionX = 0;
		this.directionY = 0;

		this.wrapperOffset = utils.offset(this.wrapper);

		this._execEvent('refresh');

		this.resetPosition();

		// INSERT POINT: _refresh

	},

	on: function (type, fn) {
		if ( !this._events[type] ) {
			this._events[type] = [];
		}

		this._events[type].push(fn);
	},

	off: function (type, fn) {
		if ( !this._events[type] ) {
			return;
		}

		var index = this._events[type].indexOf(fn);

		if ( index > -1 ) {
			this._events[type].splice(index, 1);
		}
	},

	_execEvent: function (type) {
		if ( !this._events[type] ) {
			return;
		}

		var i = 0,
			l = this._events[type].length;

		if ( !l ) {
			return;
		}

		for ( ; i < l; i++ ) {
			this._events[type][i].apply(this, [].slice.call(arguments, 1));
		}
	},

	scrollBy: function (x, y, time, easing) {
		x = this.x + x;
		y = this.y + y;
		time = time || 0;

		this.scrollTo(x, y, time, easing);
	},

	scrollTo: function (x, y, time, easing) {
		easing = easing || utils.ease.circular;

		this.isInTransition = this.options.useTransition && time > 0;

		if ( !time || (this.options.useTransition && easing.style) ) {

			this._transitionTimingFunction(easing.style);
			this._transitionTime(time);
			this._translate(x, y);

		} else {
			this._animate(x, y, time, easing.fn);
		}
	},

	scrollToElement: function (el, time, offsetX, offsetY, easing) {
		el = el.nodeType ? el : this.scroller.querySelector(el);

		if ( !el ) {
			return;
		}

		var pos = utils.offset(el);

		pos.left -= this.wrapperOffset.left;
		pos.top  -= this.wrapperOffset.top;

		// if offsetX/Y are true we center the element to the screen
		if ( offsetX === true ) {
			offsetX = Math.round(el.offsetWidth / 2 - this.wrapper.offsetWidth / 2);
		}
		if ( offsetY === true ) {
			offsetY = Math.round(el.offsetHeight / 2 - this.wrapper.offsetHeight / 2);
		}

		pos.left -= offsetX || 0;
		pos.top  -= offsetY || 0;

		pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left;
		pos.top  = pos.top  > 0 ? 0 : pos.top  < this.maxScrollY ? this.maxScrollY : pos.top;

		time = time === undefined || time === null || time === 'auto' ? Math.max(Math.abs(this.x-pos.left), Math.abs(this.y-pos.top)) : time;

		this.scrollTo(pos.left, pos.top, time, easing);
	},

	_transitionTime: function (time) {
		time = time || 0;

		this.scrollerStyle[utils.style.transitionDuration] = time + 'ms';

		if ( !time && utils.isBadAndroid ) {
			this.scrollerStyle[utils.style.transitionDuration] = '0.001s';
		}


		if ( this.indicators ) {
			for ( var i = this.indicators.length; i--; ) {
				this.indicators[i].transitionTime(time);
			}
		}


		// INSERT POINT: _transitionTime

	},

	_transitionTimingFunction: function (easing) {
		this.scrollerStyle[utils.style.transitionTimingFunction] = easing;


		if ( this.indicators ) {
			for ( var i = this.indicators.length; i--; ) {
				this.indicators[i].transitionTimingFunction(easing);
			}
		}


		// INSERT POINT: _transitionTimingFunction

	},

	_translate: function (x, y) {
		if ( this.options.useTransform ) {

			/* REPLACE START: _translate */
			
			// this.scrollerStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;
			if( isOsIos ) {
				this.scrollerStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;
			} else {
				this.scrollerStyle['top'] = y + 'px';
				this.scrollerStyle['left'] =  x + 'px';
			}


			/* REPLACE END: _translate */

		} else {
			x = Math.round(x);
			y = Math.round(y);
			this.scrollerStyle.left = x + 'px';
			this.scrollerStyle.top = y + 'px';
		}

		this.x = x;
		this.y = y;


		if ( this.indicators ) {
			for ( var i = this.indicators.length; i--; ) {
				this.indicators[i].updatePosition();
			}
		}


	// INSERT POINT: _translate

	},

	_initEvents: function (remove) {
		var eventType = remove ? utils.removeEvent : utils.addEvent,
			target = this.options.bindToWrapper ? this.wrapper : window;

		eventType(window, 'orientationchange', this);
		eventType(window, 'resize', this);

		if ( this.options.click ) {
			eventType(this.wrapper, 'click', this, true);
		}

		if ( !this.options.disableMouse ) {
			eventType(this.wrapper, 'mousedown', this);
			eventType(target, 'mousemove', this);
			eventType(target, 'mousecancel', this);
			eventType(target, 'mouseup', this);
		}

		if ( utils.hasPointer && !this.options.disablePointer ) {
			eventType(this.wrapper, utils.prefixPointerEvent('pointerdown'), this);
			eventType(target, utils.prefixPointerEvent('pointermove'), this);
			eventType(target, utils.prefixPointerEvent('pointercancel'), this);
			eventType(target, utils.prefixPointerEvent('pointerup'), this);
		}

		if ( utils.hasTouch && !this.options.disableTouch ) {
			eventType(this.wrapper, 'touchstart', this);
			eventType(target, 'touchmove', this);
			eventType(target, 'touchcancel', this);
			eventType(target, 'touchend', this);
		}

		eventType(this.scroller, 'transitionend', this);
		eventType(this.scroller, 'webkitTransitionEnd', this);
		eventType(this.scroller, 'oTransitionEnd', this);
		eventType(this.scroller, 'MSTransitionEnd', this);
	},

	getComputedPosition: function () {
		var matrix = window.getComputedStyle(this.scroller, null),
			x, y;

		if ( this.options.useTransform ) {
			matrix = matrix[utils.style.transform].split(')')[0].split(', ');
			x = +(matrix[12] || matrix[4]);
			y = +(matrix[13] || matrix[5]);
		} else {
			x = +matrix.left.replace(/[^-\d.]/g, '');
			y = +matrix.top.replace(/[^-\d.]/g, '');
		}

		return { x: x, y: y };
	},

	_initIndicators: function () {
		var interactive = this.options.interactiveScrollbars,
			customStyle = typeof this.options.scrollbars != 'string',
			indicators = [],
			indicator;

		var that = this;

		this.indicators = [];

		if ( this.options.scrollbars ) {
			// Vertical scrollbar
			if ( this.options.scrollY ) {
				indicator = {
					el: createDefaultScrollbar('v', interactive, this.options.scrollbars),
					interactive: interactive,
					defaultScrollbars: true,
					customStyle: customStyle,
					resize: this.options.resizeScrollbars,
					shrink: this.options.shrinkScrollbars,
					fade: this.options.fadeScrollbars,
					listenX: false
				};

				this.wrapper.appendChild(indicator.el);
				indicators.push(indicator);
			}

			// Horizontal scrollbar
			if ( this.options.scrollX ) {
				indicator = {
					el: createDefaultScrollbar('h', interactive, this.options.scrollbars),
					interactive: interactive,
					defaultScrollbars: true,
					customStyle: customStyle,
					resize: this.options.resizeScrollbars,
					shrink: this.options.shrinkScrollbars,
					fade: this.options.fadeScrollbars,
					listenY: false
				};

				this.wrapper.appendChild(indicator.el);
				indicators.push(indicator);
			}
		}

		if ( this.options.indicators ) {
			// TODO: check concat compatibility
			indicators = indicators.concat(this.options.indicators);
		}

		for ( var i = indicators.length; i--; ) {
			this.indicators.push( new Indicator(this, indicators[i]) );
		}

		// TODO: check if we can use array.map (wide compatibility and performance issues)
		function _indicatorsMap (fn) {
			if( !that.indicators ) return
			for ( var i = that.indicators.length; i--; ) {
				fn.call(that.indicators[i]);
			}
		}

		if ( this.options.fadeScrollbars ) {
			this.on('scrollEnd', function () {
				_indicatorsMap(function () {
					this.fade();
				});
			});

			this.on('scrollCancel', function () {
				_indicatorsMap(function () {
					this.fade();
				});
			});

			this.on('scrollStart', function () {
				_indicatorsMap(function () {
					this.fade(1);
				});
			});

			this.on('beforeScrollStart', function () {
				_indicatorsMap(function () {
					this.fade(1, true);
				});
			});
		}


		this.on('refresh', function () {
			_indicatorsMap(function () {
				this.refresh();
			});
		});

		this.on('destroy', function () {
			_indicatorsMap(function () {
				this.destroy();
			});

			delete this.indicators;
		});
	},

	_initWheel: function () {
		utils.addEvent(this.wrapper, 'wheel', this);
		utils.addEvent(this.wrapper, 'mousewheel', this);
		utils.addEvent(this.wrapper, 'DOMMouseScroll', this);

		this.on('destroy', function () {
			utils.removeEvent(this.wrapper, 'wheel', this);
			utils.removeEvent(this.wrapper, 'mousewheel', this);
			utils.removeEvent(this.wrapper, 'DOMMouseScroll', this);
		});
	},

	_wheel: function (e) {
		if ( !this.enabled ) {
			return;
		}
		e.preventDefault();
		e.stopPropagation();

		var wheelDeltaX, wheelDeltaY,
			newX, newY,
			that = this;

		if ( this.wheelTimeout === undefined ) {
			that._execEvent('scrollStart');
		}

		// Execute the scrollEnd event after 400ms the wheel stopped scrolling
		clearTimeout(this.wheelTimeout);
		this.wheelTimeout = setTimeout(function () {
			that._execEvent('scrollEnd');
			that.wheelTimeout = undefined;
		}, 400);



		if ( 'deltaX' in e ) {
			wheelDeltaX = -e.deltaX;
			wheelDeltaY = -e.deltaY;
		} else if ( 'wheelDeltaX' in e ) {
			wheelDeltaX = e.wheelDeltaX / 120 * this.options.mouseWheelSpeed;
			wheelDeltaY = e.wheelDeltaY / 120 * this.options.mouseWheelSpeed;
		} else if ( 'wheelDelta' in e ) {
			wheelDeltaX = wheelDeltaY = e.wheelDelta / 120 * this.options.mouseWheelSpeed;
		} else if ( 'detail' in e ) {
			wheelDeltaX = wheelDeltaY = -e.detail / 3 * this.options.mouseWheelSpeed;
		} else {
			return;
		}


		wheelDeltaX *= this.options.invertWheelDirection;
		wheelDeltaY *= this.options.invertWheelDirection;

		if ( !this.hasVerticalScroll ) {
			wheelDeltaX = wheelDeltaY;
			wheelDeltaY = 0;
		}

		if ( this.options.snap ) {
			newX = this.currentPage.pageX;
			newY = this.currentPage.pageY;

			if ( wheelDeltaX > 0 ) {
				newX--;
			} else if ( wheelDeltaX < 0 ) {
				newX++;
			}

			if ( wheelDeltaY > 0 ) {
				newY--;
			} else if ( wheelDeltaY < 0 ) {
				newY++;
			}

			this.goToPage(newX, newY);

			return;
		}

		newX = this.x + Math.round(this.hasHorizontalScroll ? wheelDeltaX : 0);
		newY = this.y + Math.round(this.hasVerticalScroll ? wheelDeltaY : 0);

		if ( newX > 0 ) {
			newX = 0;
		} else if ( newX < this.maxScrollX ) {
			newX = this.maxScrollX;
		}

		// if( this.options.topOffset ) {
		// 	if( newY > 0 ) {
		// 		newY = this.options.topOffset
		// 	} else if ( newY < this.maxScrollY ) {
		// 		newY = this.maxScrollY;
		// 	}
		// } else {
			if ( newY > 0 ) {
				newY = 0;
			} else if ( newY < this.maxScrollY ) {
				newY = this.maxScrollY;
			}
		// }

		
		this.scrollTo(newX, newY, 0);
		if ( this.options.probeType > 1 ) {
			this._execEvent('scroll');
		}
		// INSERT POINT: _wheel
	},

	_initSnap: function () {
		this.currentPage = {};

		if ( typeof this.options.snap == 'string' ) {
			this.options.snap = this.scroller.querySelectorAll(this.options.snap);
		}

		this.on('refresh', function () {
			var i = 0, l,
				m = 0, n,
				cx, cy,
				x = 0, y,
				stepX = this.options.snapStepX || this.wrapperWidth,
				stepY = this.options.snapStepY || this.wrapperHeight,
				el;

			this.pages = [];

			if ( !this.wrapperWidth || !this.wrapperHeight || !this.scrollerWidth || !this.scrollerHeight ) {
				return;
			}

			if ( this.options.snap === true ) {
				cx = Math.round( stepX / 2 );
				cy = Math.round( stepY / 2 );

				while ( x > -this.scrollerWidth ) {
					this.pages[i] = [];
					l = 0;
					y = 0;

					while ( y > -this.scrollerHeight ) {
						this.pages[i][l] = {
							x: Math.max(x, this.maxScrollX),
							y: Math.max(y, this.maxScrollY),
							width: stepX,
							height: stepY,
							cx: x - cx,
							cy: y - cy
						};

						y -= stepY;
						l++;
					}

					x -= stepX;
					i++;
				}
			} else {
				el = this.options.snap;
				l = el.length;
				n = -1;

				for ( ; i < l; i++ ) {
					if ( i === 0 || el[i].offsetLeft <= el[i-1].offsetLeft ) {
						m = 0;
						n++;
					}

					if ( !this.pages[m] ) {
						this.pages[m] = [];
					}

					x = Math.max(-el[i].offsetLeft, this.maxScrollX);
					y = Math.max(-el[i].offsetTop, this.maxScrollY);
					cx = x - Math.round(el[i].offsetWidth / 2);
					cy = y - Math.round(el[i].offsetHeight / 2);

					this.pages[m][n] = {
						x: x,
						y: y,
						width: el[i].offsetWidth,
						height: el[i].offsetHeight,
						cx: cx,
						cy: cy
					};

					if ( x > this.maxScrollX ) {
						m++;
					}
				}
			}

			this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0);

			// Update snap threshold if needed
			if ( this.options.snapThreshold % 1 === 0 ) {
				this.snapThresholdX = this.options.snapThreshold;
				this.snapThresholdY = this.options.snapThreshold;
			} else {
				this.snapThresholdX = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold);
				this.snapThresholdY = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold);
			}
		});

		this.on('flick', function () {
			var time = this.options.snapSpeed || Math.max(
					Math.max(
						Math.min(Math.abs(this.x - this.startX), 1000),
						Math.min(Math.abs(this.y - this.startY), 1000)
					), 300);

			this.goToPage(
				this.currentPage.pageX + this.directionX,
				this.currentPage.pageY + this.directionY,
				time
			);
		});
	},

	_nearestSnap: function (x, y) {
		if ( !this.pages.length ) {
			return { x: 0, y: 0, pageX: 0, pageY: 0 };
		}

		var i = 0,
			l = this.pages.length,
			m = 0;

		// Check if we exceeded the snap threshold
		if ( Math.abs(x - this.absStartX) < this.snapThresholdX &&
			Math.abs(y - this.absStartY) < this.snapThresholdY ) {
			return this.currentPage;
		}

		if ( x > 0 ) {
			x = 0;
		} else if ( x < this.maxScrollX ) {
			x = this.maxScrollX;
		}

		if ( y > 0 ) {
			y = 0;
		} else if ( y < this.maxScrollY ) {
			y = this.maxScrollY;
		}

		for ( ; i < l; i++ ) {
			if ( x >= this.pages[i][0].cx ) {
				x = this.pages[i][0].x;
				break;
			}
		}

		l = this.pages[i].length;

		for ( ; m < l; m++ ) {
			if ( y >= this.pages[0][m].cy ) {
				y = this.pages[0][m].y;
				break;
			}
		}

		if ( i == this.currentPage.pageX ) {
			i += this.directionX;

			if ( i < 0 ) {
				i = 0;
			} else if ( i >= this.pages.length ) {
				i = this.pages.length - 1;
			}

			x = this.pages[i][0].x;
		}

		if ( m == this.currentPage.pageY ) {
			m += this.directionY;

			if ( m < 0 ) {
				m = 0;
			} else if ( m >= this.pages[0].length ) {
				m = this.pages[0].length - 1;
			}

			y = this.pages[0][m].y;
		}

		return {
			x: x,
			y: y,
			pageX: i,
			pageY: m
		};
	},

	goToPage: function (x, y, time, easing) {
		easing = easing || this.options.bounceEasing;

		if ( x >= this.pages.length ) {
			x = this.pages.length - 1;
		} else if ( x < 0 ) {
			x = 0;
		}

		if ( y >= this.pages[x].length ) {
			y = this.pages[x].length - 1;
		} else if ( y < 0 ) {
			y = 0;
		}

		var posX = this.pages[x][y].x,
			posY = this.pages[x][y].y;

		time = time === undefined ? this.options.snapSpeed || Math.max(
			Math.max(
				Math.min(Math.abs(posX - this.x), 1000),
				Math.min(Math.abs(posY - this.y), 1000)
			), 300) : time;

		this.currentPage = {
			x: posX,
			y: posY,
			pageX: x,
			pageY: y
		};

		this.scrollTo(posX, posY, time, easing);
	},

	next: function (time, easing) {
		var x = this.currentPage.pageX,
			y = this.currentPage.pageY;

		x++;

		if ( x >= this.pages.length && this.hasVerticalScroll ) {
			x = 0;
			y++;
		}

		this.goToPage(x, y, time, easing);
	},

	prev: function (time, easing) {
		var x = this.currentPage.pageX,
			y = this.currentPage.pageY;

		x--;

		if ( x < 0 && this.hasVerticalScroll ) {
			x = 0;
			y--;
		}

		this.goToPage(x, y, time, easing);
	},

	_initKeys: function (e) {
		// default key bindings
		var keys = {
			pageUp: 33,
			pageDown: 34,
			end: 35,
			home: 36,
			left: 37,
			up: 38,
			right: 39,
			down: 40
		};
		var i;

		// if you give me characters I give you keycode
		if ( typeof this.options.keyBindings == 'object' ) {
			for ( i in this.options.keyBindings ) {
				if ( typeof this.options.keyBindings[i] == 'string' ) {
					this.options.keyBindings[i] = this.options.keyBindings[i].toUpperCase().charCodeAt(0);
				}
			}
		} else {
			this.options.keyBindings = {};
		}

		for ( i in keys ) {
			this.options.keyBindings[i] = this.options.keyBindings[i] || keys[i];
		}

		utils.addEvent(window, 'keydown', this);

		this.on('destroy', function () {
			utils.removeEvent(window, 'keydown', this);
		});
	},

	_key: function (e) {
		if ( !this.enabled ) {
			return;
		}

		var snap = this.options.snap,	// we are using this alot, better to cache it
			newX = snap ? this.currentPage.pageX : this.x,
			newY = snap ? this.currentPage.pageY : this.y,
			now = utils.getTime(),
			prevTime = this.keyTime || 0,
			acceleration = 0.250,
			pos;

		if ( this.options.useTransition && this.isInTransition ) {
			pos = this.getComputedPosition();

			this._translate(Math.round(pos.x), Math.round(pos.y));
			this.isInTransition = false;
		}

		this.keyAcceleration = now - prevTime < 200 ? Math.min(this.keyAcceleration + acceleration, 50) : 0;

		switch ( e.keyCode ) {
			case this.options.keyBindings.pageUp:
				if ( this.hasHorizontalScroll && !this.hasVerticalScroll ) {
					newX += snap ? 1 : this.wrapperWidth;
				} else {
					newY += snap ? 1 : this.wrapperHeight;
				}
				break;
			case this.options.keyBindings.pageDown:
				if ( this.hasHorizontalScroll && !this.hasVerticalScroll ) {
					newX -= snap ? 1 : this.wrapperWidth;
				} else {
					newY -= snap ? 1 : this.wrapperHeight;
				}
				break;
			case this.options.keyBindings.end:
				newX = snap ? this.pages.length-1 : this.maxScrollX;
				newY = snap ? this.pages[0].length-1 : this.maxScrollY;
				break;
			case this.options.keyBindings.home:
				newX = 0;
				newY = 0;
				break;
			case this.options.keyBindings.left:
				newX += snap ? -1 : 5 + this.keyAcceleration>>0;
				break;
			case this.options.keyBindings.up:
				newY += snap ? 1 : 5 + this.keyAcceleration>>0;
				break;
			case this.options.keyBindings.right:
				newX -= snap ? -1 : 5 + this.keyAcceleration>>0;
				break;
			case this.options.keyBindings.down:
				newY -= snap ? 1 : 5 + this.keyAcceleration>>0;
				break;
			default:
				return;
		}

		if ( snap ) {
			this.goToPage(newX, newY);
			return;
		}

		if ( newX > 0 ) {
			newX = 0;
			this.keyAcceleration = 0;
		} else if ( newX < this.maxScrollX ) {
			newX = this.maxScrollX;
			this.keyAcceleration = 0;
		}

		if ( newY > 0 ) {
			newY = 0;
			this.keyAcceleration = 0;
		} else if ( newY < this.maxScrollY ) {
			newY = this.maxScrollY;
			this.keyAcceleration = 0;
		}

		this.scrollTo(newX, newY, 0);

		this.keyTime = now;
	},

	_animate: function (destX, destY, duration, easingFn) {
		var that = this,
			startX = this.x,
			startY = this.y,
			startTime = utils.getTime(),
			destTime = startTime + duration;

		function step () {
			var now = utils.getTime(),
				newX, newY,
				easing;

			if ( now >= destTime ) {
				that.isAnimating = false;
				that._translate(destX, destY);

				if ( !that.resetPosition(that.options.bounceTime) ) {
					that._execEvent('scrollEnd');
				}

				return;
			}

			now = ( now - startTime ) / duration;
			easing = easingFn(now);
			newX = ( destX - startX ) * easing + startX;
			newY = ( destY - startY ) * easing + startY;
			that._translate(newX, newY);

			if ( that.isAnimating ) {
				rAF(step);
			}
		}
		if ( that.options.probeType == 3 ) {
			that._execEvent('scroll');
		}
		this.isAnimating = true;
		step();
	},
	handleEvent: function (e) {
		switch ( e.type ) {
			case 'touchstart':
			case 'pointerdown':
			case 'MSPointerDown':
			case 'mousedown':
				this._start(e);
				break;
			case 'touchmove':
			case 'pointermove':
			case 'MSPointerMove':
			case 'mousemove':
				this._move(e);
				break;
			case 'touchend':
			case 'pointerup':
			case 'MSPointerUp':
			case 'mouseup':
			case 'touchcancel':
			case 'pointercancel':
			case 'MSPointerCancel':
			case 'mousecancel':
				this._end(e);
				break;
			case 'orientationchange':
			case 'resize':
				this._resize();
				break;
			case 'transitionend':
			case 'webkitTransitionEnd':
			case 'oTransitionEnd':
			case 'MSTransitionEnd':
				this._transitionEnd(e);
				break;
			case 'wheel':
			case 'DOMMouseScroll':
			case 'mousewheel':
				this._wheel(e);
				break;
			case 'keydown':
				this._key(e);
				break;
			case 'click':
				if ( !e._constructed ) {
					e.preventDefault();
					e.stopPropagation();
				}
				break;
		}
	}
};
function createDefaultScrollbar (direction, interactive, type) {
	var scrollbar = document.createElement('div'),
		indicator = document.createElement('div');

	if ( type === true ) {
		scrollbar.style.cssText = 'position:absolute;z-index:9999';
		indicator.style.cssText = '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border-radius:2px';
	}

	indicator.className = 'iScrollIndicator';

	if ( direction == 'h' ) {
		if ( type === true ) {
			scrollbar.style.cssText += ';height:2px;left:2px;right:2px;bottom:0';
			indicator.style.height = '100%';
		}
		scrollbar.className = 'iScrollHorizontalScrollbar';
	} else {
		if ( type === true ) {
			scrollbar.style.cssText += ';width:2px;bottom:2px;top:2px;right:1px';
			indicator.style.width = '100%';
		}
		scrollbar.className = 'iScrollVerticalScrollbar';
	}

	scrollbar.style.cssText += ';overflow:hidden';

	if ( !interactive ) {
		scrollbar.style.pointerEvents = 'none';
	}

	scrollbar.appendChild(indicator);

	return scrollbar;
}

function Indicator (scroller, options) {
	this.wrapper = typeof options.el == 'string' ? document.querySelector(options.el) : options.el;
	this.wrapperStyle = this.wrapper.style;
	this.indicator = this.wrapper.children[0];
	this.indicatorStyle = this.indicator.style;
	this.scroller = scroller;

	this.options = {
		listenX: true,
		listenY: true,
		interactive: false,
		resize: true,
		defaultScrollbars: false,
		shrink: false,
		fade: false,
		speedRatioX: 0,
		speedRatioY: 0,
		topOffset: scroller.options.topOffset ? scroller.options.topOffset : 0,
		bottomOffset: scroller.options.bottomOffset ? scroller.options.bottomOffset : 0
	};

	for ( var i in options ) {
		this.options[i] = options[i];
	}

	this.sizeRatioX = 1;
	this.sizeRatioY = 1;
	this.maxPosX = 0;
	this.maxPosY = 0;

	if ( this.options.interactive ) {
		if ( !this.options.disableTouch ) {
			utils.addEvent(this.indicator, 'touchstart', this);
			utils.addEvent(window, 'touchend', this);
		}
		if ( !this.options.disablePointer ) {
			utils.addEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
			utils.addEvent(window, utils.prefixPointerEvent('pointerup'), this);
		}
		if ( !this.options.disableMouse ) {
			utils.addEvent(this.indicator, 'mousedown', this);
			utils.addEvent(window, 'mouseup', this);
		}
	}

	if ( this.options.fade ) {
		this.wrapperStyle[utils.style.transform] = this.scroller.translateZ;
		this.wrapperStyle[utils.style.transitionDuration] = utils.isBadAndroid ? '0.001s' : '0ms';
		this.wrapperStyle.opacity = '0';
	}
}

Indicator.prototype = {
	handleEvent: function (e) {
		switch ( e.type ) {
			case 'touchstart':
			case 'pointerdown':
			case 'MSPointerDown':
			case 'mousedown':
				this._start(e);
				break;
			case 'touchmove':
			case 'pointermove':
			case 'MSPointerMove':
			case 'mousemove':
				this._move(e);
				break;
			case 'touchend':
			case 'pointerup':
			case 'MSPointerUp':
			case 'mouseup':
			case 'touchcancel':
			case 'pointercancel':
			case 'MSPointerCancel':
			case 'mousecancel':
				this._end(e);
				break;
		}
	},

	destroy: function () {
		if ( this.options.interactive ) {
			utils.removeEvent(this.indicator, 'touchstart', this);
			utils.removeEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
			utils.removeEvent(this.indicator, 'mousedown', this);

			utils.removeEvent(window, 'touchmove', this);
			utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
			utils.removeEvent(window, 'mousemove', this);

			utils.removeEvent(window, 'touchend', this);
			utils.removeEvent(window, utils.prefixPointerEvent('pointerup'), this);
			utils.removeEvent(window, 'mouseup', this);
		}

		if ( this.options.defaultScrollbars ) {
			this.wrapper.parentNode.removeChild(this.wrapper);
		}
	},

	_start: function (e) {
		var point = e.touches ? e.touches[0] : e;

		e.preventDefault();
		e.stopPropagation();

		this.transitionTime();

		this.initiated = true;
		this.moved = false;
		this.lastPointX	= point.pageX;
		this.lastPointY	= point.pageY;

		this.startTime	= utils.getTime();


		if ( !this.options.disableTouch ) {
			utils.addEvent(window, 'touchmove', this);
		}
		if ( !this.options.disablePointer ) {
			utils.addEvent(window, utils.prefixPointerEvent('pointermove'), this);
		}
		if ( !this.options.disableMouse ) {
			utils.addEvent(window, 'mousemove', this);
		}

		this.scroller._execEvent('beforeScrollStart');
	},

	_move: function (e) {
		var point = e.touches ? e.touches[0] : e,
			deltaX, deltaY,
			newX, newY,
			timestamp = utils.getTime();

		if ( !this.moved ) {
			this.scroller._execEvent('scrollStart');
		}

		this.moved = true;

		deltaX = point.pageX - this.lastPointX;
		this.lastPointX = point.pageX;

		deltaY = point.pageY - this.lastPointY;
		this.lastPointY = point.pageY;

		newX = this.x + deltaX;
		newY = this.y + deltaY;


		this._pos(newX, newY);
		if ( this.scroller.options.probeType == 1 && timestamp - this.startTime > 300 ) {
			this.startTime = timestamp;
			this.scroller._execEvent('scroll');
		} else if ( this.scroller.options.probeType > 1 ) {
			this.scroller._execEvent('scroll');
		}
		// INSERT POINT: indicator._move

		e.preventDefault();
		e.stopPropagation();
	},

	_end: function (e) {
		if ( !this.initiated ) {
			return;
		}

		this.initiated = false;

		e.preventDefault();
		e.stopPropagation();

		utils.removeEvent(window, 'touchmove', this);
		utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
		utils.removeEvent(window, 'mousemove', this);

		if ( this.scroller.options.snap ) {
			var snap = this.scroller._nearestSnap(this.scroller.x, this.scroller.y);

			var time = this.options.snapSpeed || Math.max(
					Math.max(
						Math.min(Math.abs(this.scroller.x - snap.x), 1000),
						Math.min(Math.abs(this.scroller.y - snap.y), 1000)
					), 300);

			if ( this.scroller.x != snap.x || this.scroller.y != snap.y ) {
				this.scroller.directionX = 0;
				this.scroller.directionY = 0;
				this.scroller.currentPage = snap;
				this.scroller.scrollTo(snap.x, snap.y, time, this.scroller.options.bounceEasing);
			}
		}

		if ( this.moved ) {
			this.scroller._execEvent('scrollEnd');
		}
	},

	transitionTime: function (time) {
		time = time || 0;
		this.indicatorStyle[utils.style.transitionDuration] = time + 'ms';

		if ( !time && utils.isBadAndroid ) {
			this.indicatorStyle[utils.style.transitionDuration] = '0.001s';
		}
	},

	transitionTimingFunction: function (easing) {
		this.indicatorStyle[utils.style.transitionTimingFunction] = easing;
	},

	refresh: function () {
		this.transitionTime();

		if ( this.options.listenX && !this.options.listenY ) {
			this.indicatorStyle.display = this.scroller.hasHorizontalScroll ? 'block' : 'none';
		} else if ( this.options.listenY && !this.options.listenX ) {
			this.indicatorStyle.display = this.scroller.hasVerticalScroll ? 'block' : 'none';
		} else {
			this.indicatorStyle.display = this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? 'block' : 'none';
		}

		if ( this.scroller.hasHorizontalScroll && this.scroller.hasVerticalScroll ) {
			utils.addClass(this.wrapper, 'iScrollBothScrollbars');
			utils.removeClass(this.wrapper, 'iScrollLoneScrollbar');

			if ( this.options.defaultScrollbars && this.options.customStyle ) {
				if ( this.options.listenX ) {
					this.wrapper.style.right = '8px';
				} else {
					this.wrapper.style.bottom = '8px';
				}
			}
		} else {
			utils.removeClass(this.wrapper, 'iScrollBothScrollbars');
			utils.addClass(this.wrapper, 'iScrollLoneScrollbar');

			if ( this.options.defaultScrollbars && this.options.customStyle ) {
				if ( this.options.listenX ) {
					this.wrapper.style.right = '2px';
				} else {
					this.wrapper.style.bottom = '2px';
				}
			}
		}

		var r = this.wrapper.offsetHeight;	// force refresh

		if ( this.options.listenX ) {
			this.wrapperWidth = this.wrapper.clientWidth;
			if ( this.options.resize ) {
				this.indicatorWidth = Math.max(Math.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8);
				this.indicatorStyle.width = this.indicatorWidth + 'px';
			} else {
				this.indicatorWidth = this.indicator.clientWidth;
			}

			this.maxPosX = this.wrapperWidth - this.indicatorWidth;

			if ( this.options.shrink == 'clip' ) {
				this.minBoundaryX = -this.indicatorWidth + 8;
				this.maxBoundaryX = this.wrapperWidth - 8;
			} else {
				this.minBoundaryX = 0;
				this.maxBoundaryX = this.maxPosX;
			}

			this.sizeRatioX = this.options.speedRatioX || (this.scroller.maxScrollX && (this.maxPosX / this.scroller.maxScrollX));	
		}
		var top, bottom;
		if ( this.options.listenY ) {
			this.wrapperHeight = this.wrapper.clientHeight;

			if(this.options.topOffset){
				top = this.options.topOffset
			} else {
				top = 0
			}
			if( this.options.bottomOffset ) {
				bottom = this.options.bottomOffset
			} else {
				bottom = 0;
			}
			

			if ( this.options.resize ) {
				this.indicatorHeight = Math.max(Math.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)  ) - ( bottom + top) , 8);
				this.indicatorStyle.height = this.indicatorHeight + 'px';
			} else {
				this.indicatorHeight = this.indicator.clientHeight;
			}

			this.maxPosY = this.wrapperHeight - this.indicatorHeight;

			if ( this.options.shrink == 'clip' ) {
				this.minBoundaryY = -this.indicatorHeight + 8;
				this.maxBoundaryY = this.wrapperHeight - 8;
			} else {
				this.minBoundaryY = top ? top : 0 ;
				this.maxBoundaryY = this.maxPosY;

			}

			this.maxPosY = this.wrapperHeight - this.indicatorHeight;
			this.sizeRatioY = this.options.speedRatioY || (this.scroller.maxScrollY && (this.maxPosY / this.scroller.maxScrollY));

		}

		this.updatePosition();
	},

	updatePosition: function () {
		var x = this.options.listenX && Math.round(this.sizeRatioX * this.scroller.x) || 0,
			y = this.options.listenY && Math.round(this.sizeRatioY * this.scroller.y) || 0;

		if ( !this.options.ignoreBoundaries ) {
			if ( x < this.minBoundaryX ) {
				if ( this.options.shrink == 'scale' ) {
					this.width = Math.max(this.indicatorWidth + x, 8);
					this.indicatorStyle.width = this.width + 'px';
				}
				x = this.minBoundaryX;
			} else if ( x > this.maxBoundaryX ) {
				if ( this.options.shrink == 'scale' ) {
					this.width = Math.max(this.indicatorWidth - (x - this.maxPosX), 8);
					this.indicatorStyle.width = this.width + 'px';
					x = this.maxPosX + this.indicatorWidth - this.width;
				} else {
					x = this.maxBoundaryX;
				}
			} else if ( this.options.shrink == 'scale' && this.width != this.indicatorWidth ) {
				this.width = this.indicatorWidth;
				this.indicatorStyle.width = this.width + 'px';
			}
		


			if ( y < this.minBoundaryY ) {

				if ( this.options.shrink == 'scale' ) {
					this.height = Math.max(this.indicatorHeight + y * 3, 8);
					this.indicatorStyle.height = this.height + 'px';
				}
				y = this.options.topOffset ? this.options.topOffset : this.minBoundaryY;


			} else if ( y > this.maxBoundaryY ) {
				if ( this.options.shrink == 'scale' ) {
					this.height = Math.max(this.indicatorHeight - (y - this.maxPosY) * 3, 8);
					this.indicatorStyle.height = this.height + 'px';
					y = this.maxPosY + this.indicatorHeight - this.height;
				} else {

					y = this.maxBoundaryY;
				}
			} else if ( this.options.shrink == 'scale' && this.height != this.indicatorHeight ) {
				this.height = this.indicatorHeight;
				this.indicatorStyle.height = this.height + 'px';
			}
		}

		this.x = x;
		this.y = y;

		if ( this.scroller.options.useTransform ) {
			this.indicatorStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.scroller.translateZ;
		} else {
			this.indicatorStyle.left = x + 'px';
			this.indicatorStyle.top = y + 'px';
		}
	},

	_pos: function (x, y) {
		if ( x < 0 ) {
			x = 0;
		} else if ( x > this.maxPosX ) {
			x = this.maxPosX;
		}

		if ( y < 0 ) {
			y = 0;
		} else if ( y > this.maxPosY ) {
			y = this.maxPosY;
		}

		x = this.options.listenX ? Math.round(x / this.sizeRatioX) : this.scroller.x;
		y = this.options.listenY ? Math.round(y / this.sizeRatioY) : this.scroller.y;

		this.scroller.scrollTo(x, y);
	},

	fade: function (val, hold) {
		if ( hold && !this.visible ) {
			return;
		}

		clearTimeout(this.fadeTimeout);
		this.fadeTimeout = null;

		var time = val ? 250 : 500,
			delay = val ? 0 : 300;

		val = val ? '1' : '0';

		this.wrapperStyle[utils.style.transitionDuration] = time + 'ms';

		this.fadeTimeout = setTimeout((function (val) {
			this.wrapperStyle.opacity = val;
			this.visible = +val;
		}).bind(this, val), delay);
	}
};

IScroll.utils = utils;

if ( typeof module != 'undefined' && module.exports ) {
	module.exports = IScroll;
} else {
	window.IScroll = IScroll;
}


	$.iScrollUtils = utils;
	$.iScroll = function ( obj, options ) {
		return new IScroll( $.isIns( obj ) ? obj[ i ] : obj, options )
	}

})($$$, window, document, Math);
;(function ($) {

var rAF = window.requestAnimationFrame	||
	window.webkitRequestAnimationFrame	||
	window.mozRequestAnimationFrame		||
	window.oRequestAnimationFrame		||
	window.msRequestAnimationFrame		||
	function (callback) { window.setTimeout(callback, 1000 / 60); };


/*
 * 工具类
 */
var utils = (function () {

	var me = {};

	var _elementStyle = document.createElement('div').style;

	var _vendor = (function () {
		var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
			transform,
			i = 0,
			l = vendors.length;

		for ( ; i < l; i++ ) {
			transform = vendors[i] + 'ransform';
			if ( transform in _elementStyle ) return vendors[i].substr(0, vendors[i].length-1);
		}
		return false;
	})();

	function _prefixStyle (style) {
		if ( _vendor === false ) return false;
		if ( _vendor === '' ) return style;
		return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
	}


	me.getTime = Date.now || function getTime () { return new Date().getTime(); };


	me.extend = function (target, obj) {
		for ( var i in obj ) {
			target[i] = obj[i];
		}
	};


	me.addEvent = function (el, type, fn, capture) {
		el.addEventListener(type, fn, !!capture);	
	};


	me.removeEvent = function (el, type, fn, capture) {
		el.removeEventListener(type, fn, !!capture);
	};


	me.prefixPointerEvent = function (pointerEvent) {
		return window.MSPointerEvent ? 
			'MSPointer' + pointerEvent.charAt(9).toUpperCase() + pointerEvent.substr(10):
			pointerEvent;
	};


	/**
     * 根据一定时间内的滑动距离计算出最终停止距离和时间。
     * @param current：当前滑动位置
     * @param start：touchStart 时候记录的开始位置，但是在touchmove时候可能被重写
     * @param time：touchstart 到手指离开时候经历的时间，同样可能被touchmove重写
     * @param lowerMargin：可移动的最大距离，这个一般为计算得出 this.wrapperHeight - this.scrollerHeight
     * @param wrapperSize：如果有边界距离的话就是可拖动，不然碰到0的时候便停止
     * @param deceleration：匀减速
     * @returns {{destination: number, duration: number}}
     */
	me.momentum = function (current, start, time, lowerMargin, wrapperSize, deceleration) {
		var distance = current - start,
			speed = Math.abs(distance) / time,
			destination,
			duration;

		deceleration = deceleration === undefined ? 0.0006 : deceleration;

		destination = current + ( speed * speed ) / ( 2 * deceleration ) * ( distance < 0 ? -1 : 1 );
		duration = speed / deceleration;

		if ( destination < lowerMargin ) {
			destination = wrapperSize ? lowerMargin - ( wrapperSize / 2.5 * ( speed / 8 ) ) : lowerMargin;
			distance = Math.abs(destination - current);
			duration = distance / speed;
		} else if ( destination > 0 ) {
			destination = wrapperSize ? wrapperSize / 2.5 * ( speed / 8 ) : 0;
			distance = Math.abs(current) + destination;
			duration = distance / speed;
		}

		return {
			destination: Math.round(destination),
			duration: duration
		};
	};

	var _transform = _prefixStyle('transform');

	me.extend(me, {
		hasTransform: _transform !== false,
		hasPerspective: _prefixStyle('perspective') in _elementStyle,
		hasTouch: 'ontouchstart' in window,
		hasPointer: window.PointerEvent || window.MSPointerEvent, // IE10 is prefixed
		hasTransition: _prefixStyle('transition') in _elementStyle
	});

	// This should find all Android browsers lower than build 535.19 (both stock browser and webview)
	me.isBadAndroid = /Android /.test(window.navigator.appVersion) && !(/Chrome\/\d/.test(window.navigator.appVersion));

	me.extend(me.style = {}, {
		transform: _transform,
		transitionTimingFunction: _prefixStyle('transitionTimingFunction'),
		transitionDuration: _prefixStyle('transitionDuration'),
		transitionDelay: _prefixStyle('transitionDelay'),
		transformOrigin: _prefixStyle('transformOrigin'),
		transitionProperty: _prefixStyle('transitionProperty')
	});


	me.offset = function (el) {
		var left = -el.offsetLeft,
			top = -el.offsetTop;

		while (el = el.offsetParent) {
			left -= el.offsetLeft;
			top -= el.offsetTop;
		}
		return {
			left: left,
			top: top
		};
	};


	/* 
	 * 配合 config 里面的 preventDefaultException 属性
	 * 不对匹配到的 element 使用 e.preventDefault()
	 * 默认阻止所有事件的冒泡，包括 click 或 tap
	 */
	me.preventDefaultException = function (el, exceptions) {
		for ( var i in exceptions ) {
			if ( exceptions[i].test(el[i]) ) {
				return true;
			}
		}
		return false;
	};


	me.extend(me.eventType = {}, {
		touchstart: 1,
		touchmove: 1,
		touchend: 1,

		mousedown: 2,
		mousemove: 2,
		mouseup: 2,

		pointerdown: 3,
		pointermove: 3,
		pointerup: 3,

		MSPointerDown: 3,
		MSPointerMove: 3,
		MSPointerUp: 3
	});


	me.extend(me.ease = {}, {
		quadratic: {
			style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
			fn: function (k) {
				return k * ( 2 - k );
			}
		},
		circular: {
			style: 'cubic-bezier(0.1, 0.57, 0.1, 1)',	// Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
			fn: function (k) {
				return Math.sqrt( 1 - ( --k * k ) );
			}
		},
		back: {
			style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
			fn: function (k) {
				var b = 4;
				return ( k = k - 1 ) * k * ( ( b + 1 ) * k + b ) + 1;
			}
		},
		bounce: {
			style: '',
			fn: function (k) {
				if ( ( k /= 1 ) < ( 1 / 2.75 ) ) {
					return 7.5625 * k * k;
				} else if ( k < ( 2 / 2.75 ) ) {
					return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
				} else if ( k < ( 2.5 / 2.75 ) ) {
					return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
				} else {
					return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
				}
			}
		},
		elastic: {
			style: '',
			fn: function (k) {
				var f = 0.22,
					e = 0.4;

				if ( k === 0 ) { return 0; }
				if ( k == 1 ) { return 1; }

				return ( e * Math.pow( 2, - 10 * k ) * Math.sin( ( k - f / 4 ) * ( 2 * Math.PI ) / f ) + 1 );
			}
		}
	});

	me.tap = function (e, eventName) {
		var ev = document.createEvent('Event');
		ev.initEvent(eventName, true, true);
		ev.pageX = e.pageX;
		ev.pageY = e.pageY;
		e.target.dispatchEvent(ev);
	};

	me.click = function (e) {
		var target = e.target,
			ev;
		if ( !(/(SELECT|INPUT|TEXTAREA)/i).test(target.tagName) ) {
			ev = document.createEvent('MouseEvents');
			ev.initMouseEvent('click', true, true, e.view, 1,
				target.screenX, target.screenY, target.clientX, target.clientY,
				e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
				0, null);

			ev._constructed = true;
			target.dispatchEvent(ev);
		}
	};

	return me;
})();



/*
 * 构造函数
 */
function Scroll(el, options) {

	this.wrapper = typeof el == 'string' ? $(el)[0] : el;

	this.options = {
		startX: 0,					// 初始化 X 坐标
		startY: 0,					// 初始化 Y 坐标
		scrollY: true,				// 竖向滚动
		scrollX: false,				// 默认非水平
		directionLockThreshold: 5,	// 确定滚动方向的阈值
		momentum: true,				// 是否开启惯性滚动

		duration: 300,				// transition 过渡时间

		bounce: true,				// 是否有反弹动画
		bounceTime: 600,			// 反弹动画时间
		bounceEasing: '',			// 反弹动画类型：'circular'(default), 'quadratic', 'back', 'bounce', 'elastic'

		preventDefault: true,		// 是否阻止默认滚动事件（和冒泡有区别）
		eventPassthrough: true,		// 穿透，是否触发原生滑动（取值 true、false、vertical、horizental）

		freeScroll: false,			// 任意方向的滚动。若 scrollX 和 scrollY 同时开启，则相当于 freeScroll

	    bindToWrapper : true,		// 事件是否绑定到 wrapper 元素上，否则大部分绑定到 window（若存在嵌套，则绑定在元素上最好）
    	resizePolling : 60,			// resize 时候隔 60ms 就执行 refresh 方法重新获取位置信息(事件节流)
    	
    	disableMouse : false,		// 是否禁用鼠标
	    disableTouch : false,		// 是否禁用touch事件
	    disablePointer : false,		// 是否禁用win系统的pointer事件

		tap: true,					// 是否模拟 tap 事件
		click: false,				// 是否模拟点击事件（false 则使用原生click事件）

		preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ }, // 当遇到正则内的元素则不阻止冒泡

		HWCompositing: true, 		// Hardware acceleration
		useTransition: true,		// Transition || requestAnimationFrame
		useTransform: true			// Translate || Left/Top
	};


	for ( var i in options ) {
		this.options[i] = options[i];
	}


	// scroller
	// ==================================

	if (!this.options.role && this.options.scrollX === false) {
		this.options.eventPassthrough = 'horizontal';	// 竖直滚动的 scroller 不拦截横向原生滚动
	}

	// slide
	// ==================================

	if (this.options.role === 'slider') {

		this.options.scrollX = true;
		this.options.scrollY = false;
		this.options.momentum = false;

		this.scroller = $('.ui-slider-content')[0];
		$(this.scroller.children[0]).addClass('current');

		this.currentPage = 0;
		this.count = this.scroller.children.length;

		this.scroller.style.width = this.count+"00%";

		this.itemWidth = this.scroller.children[0].clientWidth;
		this.scrollWidth = this.itemWidth * this.count;

		

		if (this.options.indicator) {
			var temp = '<ul class="ui-slider-indicators">';

			for (var i=1; i<=this.count; i++) {
				if (i===1) {
					temp += '<li class="current">'+i+'</li>';
				}
				else {
					temp += '<li>'+i+'</li>';
				}
			}
			temp += '</ul>';
			$(this.wrapper).append(temp);
			this.indicator = $('.ui-slider-indicators')[0];
		}
	}


	// tab
	// ==================================

	else if (this.options.role === 'tab') {

		this.options.scrollX = true;
		this.options.scrollY = false;
		this.options.momentum = false;

		this.scroller = $('.ui-tab-content')[0];
		this.nav = $('.ui-tab-nav')[0];

		$(this.scroller.children[0]).addClass('current');
		$(this.nav.children[0]).addClass('current');

		this.currentPage = 0;
		this.count = this.scroller.children.length;

		this.scroller.style.width = this.count+"00%";

		this.itemWidth = this.scroller.children[0].clientWidth;
		this.scrollWidth = this.itemWidth * this.count;


	}
	else {
		this.scroller = this.wrapper.children[0];
	}
	this.scrollerStyle = this.scroller.style;


	this.translateZ = utils.hasPerspective && this.options.HWCompositing ? ' translateZ(0)' : '';
	this.options.useTransition = utils.hasTransition && this.options.useTransition;
	this.options.useTransform = utils.hasTransform && this.options.useTransform;
	this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough;
	this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;
	// If you want eventPassthrough I have to lock one of the axes
	this.options.scrollX = this.options.eventPassthrough == 'horizontal' ? false : this.options.scrollX;
	this.options.scrollY = this.options.eventPassthrough == 'vertical' ? false : this.options.scrollY;
	// With eventPassthrough we also need lockDirection mechanism
	this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
	this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;
	this.options.bounceEasing = typeof this.options.bounceEasing == 'string' ? utils.ease[this.options.bounceEasing] || utils.ease.circular : this.options.bounceEasing;
	this.options.resizePolling = this.options.resizePolling === undefined ? 60 : this.options.resizePolling;

	if (this.options.tap === true) {
		this.options.tap = 'tap';
	}
	if (this.options.useTransform === false) {
		this.scroller.style.position = 'relative';
	}

	// Some defaults
	this.x = 0;
	this.y = 0;
	this.directionX = 0;
	this.directionY = 0;
	this._events = {};

	this._init();	// 绑定各种事件
	this.refresh();

	this.scrollTo(this.options.startX, this.options.startY);
	this.enable();

	// 自动播放
	if (this.options.autoplay) {
		var context = this;
		this.options.interval = this.options.interval || 2000;
		this.options.flag = setTimeout(function(){
			context._autoplay.apply(context)
		}, context.options.interval);
	}
}



Scroll.prototype = {

	_init: function () {
		this._initEvents();
	},

	_initEvents: function (remove) {
		var eventType = remove ? utils.removeEvent : utils.addEvent,
			target = this.options.bindToWrapper ? this.wrapper : window;

		/*
		 * 给 addEventListener 传递 this
		 * 程序会自动找到 handleEvent 方法作为回调函数
		 */
		eventType(window, 'orientationchange', this);
		eventType(window, 'resize', this);

		if ( this.options.click ) {
			eventType(this.wrapper, 'click', this, true);
		}

		if ( !this.options.disableMouse ) {
			eventType(this.wrapper, 'mousedown', this);
			eventType(target, 'mousemove', this);
			eventType(target, 'mousecancel', this);
			eventType(target, 'mouseup', this);
		}

		if ( utils.hasPointer && !this.options.disablePointer ) {
			eventType(this.wrapper, utils.prefixPointerEvent('pointerdown'), this);
			eventType(target, utils.prefixPointerEvent('pointermove'), this);
			eventType(target, utils.prefixPointerEvent('pointercancel'), this);
			eventType(target, utils.prefixPointerEvent('pointerup'), this);
		}

		if ( utils.hasTouch && !this.options.disableTouch ) {
			eventType(this.wrapper, 'touchstart', this);
			eventType(target, 'touchmove', this);
			eventType(target, 'touchcancel', this);
			eventType(target, 'touchend', this);
		}

		eventType(this.scroller, 'transitionend', this);
		eventType(this.scroller, 'webkitTransitionEnd', this);
		eventType(this.scroller, 'oTransitionEnd', this);
		eventType(this.scroller, 'MSTransitionEnd', this);

		// tab
		// =============================
		if (this.options.role === 'tab') {
			eventType(this.nav, 'touchend', this);
			eventType(this.nav, 'mouseup', this);
			eventType(this.nav, 'pointerup', this);
		}
	},

	
	refresh: function () {
		var rf = this.wrapper.offsetHeight;	// Force reflow

		// http://jsfiddle.net/y8Y32/25/
		// clientWidth = content + padding
		this.wrapperWidth	= this.wrapper.clientWidth;
		this.wrapperHeight	= this.wrapper.clientHeight;


		// 添加 wrapper 的 padding 值到 scroller 身上，更符合使用预期
		var matrix = window.getComputedStyle(this.wrapper, null); 
		var pt = matrix['padding-top'].replace(/[^-\d.]/g, ''),
			pb = matrix['padding-bottom'].replace(/[^-\d.]/g, ''),
			pl = matrix['padding-left'].replace(/[^-\d.]/g, ''),
			pr = matrix['padding-right'].replace(/[^-\d.]/g, '');

		var matrix2 = window.getComputedStyle(this.scroller, null);
		var	mt2 = matrix2['margin-top'].replace(/[^-\d.]/g, ''),
			mb2 = matrix2['margin-bottom'].replace(/[^-\d.]/g, ''),
			ml2 = matrix2['margin-left'].replace(/[^-\d.]/g, ''),
			mr2 = matrix2['margin-right'].replace(/[^-\d.]/g, '');


		// offsetWidth = content + padding + border
		this.scrollerWidth	= this.scroller.offsetWidth+parseInt(pl)+parseInt(pr)+parseInt(ml2)+parseInt(mr2);
		this.scrollerHeight	= this.scroller.offsetHeight+parseInt(pt)+parseInt(pb)+parseInt(mt2)+parseInt(mb2);


		// slide
		// ==================================
		if (this.options.role === 'slider' || this.options.role === 'tab') {
			this.scrollerWidth = this.scrollWidth;
		}

		this.maxScrollX		= this.wrapperWidth - this.scrollerWidth;
		this.maxScrollY		= this.wrapperHeight - this.scrollerHeight;

		this.hasHorizontalScroll	= this.options.scrollX && this.maxScrollX < 0;
		this.hasVerticalScroll		= this.options.scrollY && this.maxScrollY < 0;

		if ( !this.hasHorizontalScroll ) {
			this.maxScrollX = 0;
			this.scrollerWidth = this.wrapperWidth;
		}

		if ( !this.hasVerticalScroll ) {
			this.maxScrollY = 0;
			this.scrollerHeight = this.wrapperHeight;
		}

		this.endTime = 0;
		this.directionX = 0;
		this.directionY = 0;

		this.wrapperOffset = utils.offset(this.wrapper);
		this.resetPosition();
	},
	
	
	handleEvent: function (e) {
		switch ( e.type ) {
			case 'touchstart':
			case 'pointerdown':
			case 'MSPointerDown':
			case 'mousedown':
				this._start(e);
				break;
			case 'touchmove':
			case 'pointermove':
			case 'MSPointerMove':
			case 'mousemove':
				this._move(e);
				break;
			case 'touchend':
			case 'pointerup':
			case 'MSPointerUp':
			case 'mouseup':
			case 'touchcancel':
			case 'pointercancel':
			case 'MSPointerCancel':
			case 'mousecancel':
				this._end(e);
				break;
			case 'orientationchange':
			case 'resize':
				this._resize();
				break;
			case 'transitionend':
			case 'webkitTransitionEnd':
			case 'oTransitionEnd':
			case 'MSTransitionEnd':
				this._transitionEnd(e);
				break;
			case 'wheel':
			case 'DOMMouseScroll':
			case 'mousewheel':
				this._wheel(e);
				break;
			case 'keydown':
				this._key(e);
				break;
			case 'click':
				if ( !e._constructed ) {
					e.preventDefault();
					e.stopPropagation();
				}
				break;
		}
	},



	_start: function (e) {

		if ( utils.eventType[e.type] != 1 ) {	// 如果是鼠标点击，则只响应鼠标左键
			if ( e.button !== 0 ) {
				return;
			}
		}

		if ( !this.enabled || (this.initiated && utils.eventType[e.type] !== this.initiated) ) {
			return;
		}

		// 如果 preventDefault === true 且 不是落后的安卓版本 且 不是需要过滤的 target 就阻止默认的行为
		if ( this.options.preventDefault && !utils.isBadAndroid && !utils.preventDefaultException(e.target, this.options.preventDefaultException) ) {
			e.preventDefault();
		}

		var point = e.touches ? e.touches[0] : e,	// 检验是触摸事件对象还是鼠标事件对象
			pos;

		this.initiated	= utils.eventType[e.type];	// 初始化事件类型（1：触摸，2：鼠标，3：pointer）
		this.moved		= false;
		this.distX		= 0;
		this.distY		= 0;
		this.directionX = 0;
		this.directionY = 0;
		this.directionLocked = 0;

		this._transitionTime();
		this.startTime = utils.getTime();

		// 定住正在滑动的 scroller，slider/tab 不这么做
		if ( this.options.useTransition && this.isInTransition && this.options.role !== 'slider' && this.options.role !== 'tab') {
			this.isInTransition = false;
			pos = this.getComputedPosition();
			this._translate(Math.round(pos.x), Math.round(pos.y));
		}
		// 场景：（没有使用 Transition 属性）
		else if ( !this.options.useTransition && this.isAnimating ) {
			this.isAnimating = false;
		}

		this.startX    = this.x;
		this.startY    = this.y;
		this.absStartX = this.x;
		this.absStartY = this.y;
		this.pointX    = point.pageX;
		this.pointY    = point.pageY;

		// throttle
		// ======================
		if (this.options.autoplay) {
			var context = this;

			clearTimeout(this.options.flag);
			this.options.flag = setTimeout(function() {
				context._autoplay.apply(context);
			}, context.options.interval);
		}

		event.stopPropagation();
	},



	_move: function (e) {

		if ( !this.enabled || utils.eventType[e.type] !== this.initiated ) {	// 如果事件类型和 touchstart 初始化的事件类型不一致，退出
			return;
		}
		if ( this.options.preventDefault ) {	// 这么做才能确保 Android 下 touchend 能被正常触发（需测试）
			e.preventDefault();
		}
		var point		= e.touches ? e.touches[0] : e,
			deltaX		= point.pageX - this.pointX,
			deltaY		= point.pageY - this.pointY,
			timestamp	= utils.getTime(),
			newX, newY,
			absDistX, absDistY;

		this.pointX		= point.pageX;
		this.pointY		= point.pageY;

		this.distX		+= deltaX;
		this.distY		+= deltaY;
		absDistX		= Math.abs(this.distX);
		absDistY		= Math.abs(this.distY);
		

		// 如果在很长的时间内只移动了少于 10 像素的距离，那么不会触发惯性滚动
		if ( timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10) ) {
			return;
		}

		// 屏蔽滚动方向的另外一个方向（可配置）
		if ( !this.directionLocked && !this.options.freeScroll ) {
			if ( absDistX > absDistY + this.options.directionLockThreshold ) {
				this.directionLocked = 'h';		// lock horizontally
			} else if ( absDistY >= absDistX + this.options.directionLockThreshold ) {
				this.directionLocked = 'v';		// lock vertically
			} else {
				this.directionLocked = 'n';		// no lock
			}
		}
		if ( this.directionLocked == 'h' ) {
			// slider/tab 外层高度自适应
			if (this.options.role === 'tab') {
				$(this.scroller).children('li').height('auto');	
			}
			if ( this.options.eventPassthrough == 'vertical' ) {
				e.preventDefault();
			} else if ( this.options.eventPassthrough == 'horizontal' ) {
				this.initiated = false;
				return;
			}
			deltaY = 0;	// 不断重置垂直偏移量为 0
		}
		else if ( this.directionLocked == 'v' ) {
			if ( this.options.eventPassthrough == 'horizontal' ) {
				e.preventDefault();
			} else if ( this.options.eventPassthrough == 'vertical' ) {
				this.initiated = false;
				return;
			}
			deltaX = 0;	// 不断重置水平偏移量为 0
		}

		deltaX = this.hasHorizontalScroll ? deltaX : 0;
		deltaY = this.hasVerticalScroll ? deltaY : 0;
		
		newX = this.x + deltaX;
		newY = this.y + deltaY;

		// Slow down if outside of the boundaries
		if ( newX > 0 || newX < this.maxScrollX ) {
			newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
		}
		if ( newY > 0 || newY < this.maxScrollY ) {
			newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
		}

		this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
		this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

		this.moved = true;	// 滚动开始
		this._translate(newX, newY);

		if ( timestamp - this.startTime > 300 ) {	// 每 300 毫秒重置一次初始值
			this.startTime = timestamp;
			this.startX = this.x;
			this.startY = this.y;
		}
	},



	_end: function (e) {

		if ( !this.enabled || utils.eventType[e.type] !== this.initiated ) {
			return;
		}

		if ( this.options.preventDefault && !utils.preventDefaultException(e.target, this.options.preventDefaultException) ) {
			e.preventDefault();
		}

		var point = e.changedTouches ? e.changedTouches[0] : e,	// 移开屏幕的那个触摸点，只会包含在 changedTouches 列表中，而不会包含在 touches 或 targetTouches 列表中
			momentumX,
			momentumY,
			duration = utils.getTime() - this.startTime,
			newX = Math.round(this.x),
			newY = Math.round(this.y),
			distanceX = Math.abs(newX - this.startX),
			distanceY = Math.abs(newY - this.startY),
			time = 0,
			easing = '';

		this.isInTransition = 0;
		this.initiated = 0;
		this.endTime = utils.getTime();
	

		if ( this.resetPosition(this.options.bounceTime) ) {	// reset if we are outside of the boundaries
			if (this.options.role === 'tab') {
				$(this.scroller.children[this.currentPage]).siblings('li').height(0);	
			}
			return;
		}

		this.scrollTo(newX, newY);	// ensures that the last position is rounded

		if (!this.moved) {	// we scrolled less than 10 pixels
			if (this.options.tap && utils.eventType[e.type] === 1) {
				utils.tap(e, this.options.tap);
			}
			if ( this.options.click) {
				utils.click(e);
			}
		}

		// 300ms 内的滑动要启动惯性滚动
		if ( this.options.momentum && duration < 300 ) {
			momentumX = this.hasHorizontalScroll ? utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : { destination: newX, duration: 0 };
			momentumY = this.hasVerticalScroll ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : { destination: newY, duration: 0 };
			newX = momentumX.destination;
			newY = momentumY.destination;
			time = Math.max(momentumX.duration, momentumY.duration);
			this.isInTransition = 1;
		}

		if ( newX != this.x || newY != this.y ) {
			// change easing function when scroller goes out of the boundaries
			if ( newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY ) {
				easing = utils.ease.quadratic;
			}
			this.scrollTo(newX, newY, time, easing);
			return;
		}


		// tab
		// ==========================
		if (this.options.role === 'tab' && $(event.target).closest('ul').hasClass('ui-tab-nav')) {
			$(this.nav).children().removeClass('current');
			$(event.target).addClass('current');
			var tempCurrentPage = this.currentPage;
			this.currentPage = $(event.target).index();

			$(this.scroller).children().height('auto');	// tab 外层高度自适应
			this._execEvent('beforeScrollStart', tempCurrentPage, this.currentPage);
		}



		// slider & tab
		// ==============================
		if (this.options.role === 'slider' || this.options.role === 'tab') {

			if (distanceX < 30) {
				this.scrollTo(-this.itemWidth*this.currentPage, 0, this.options.bounceTime, this.options.bounceEasing);
			}
			else if (newX-this.startX<0) {	// 向前
				this._execEvent('beforeScrollStart', this.currentPage, this.currentPage+1);
				this.scrollTo(-this.itemWidth*++this.currentPage, 0, this.options.bounceTime, this.options.bounceEasing);
			}
			else if (newX-this.startX>=0) {	// 向后
				this._execEvent('beforeScrollStart', this.currentPage, this.currentPage-1);
				this.scrollTo(-this.itemWidth*--this.currentPage, 0, this.options.bounceTime, this.options.bounceEasing);
			}

			// tab 外层高度自适应
			if (this.options.role === 'tab') {
				$(this.scroller.children[this.currentPage]).siblings('li').height(0);
			}

			if (this.indicator && distanceX >= 30) {
				$(this.indicator).children().removeClass('current');
				$(this.indicator.children[this.currentPage]).addClass('current');
			}
			else if (this.nav && distanceX >= 30) {
				$(this.nav).children().removeClass('current');
				$(this.nav.children[this.currentPage]).addClass('current');
			}

			$(this.scroller).children().removeClass('current');
			$(this.scroller.children[this.currentPage]).addClass('current');
		}
	},


	_resize: function () {
		var that = this;
		clearTimeout(this.resizeTimeout);
		this.resizeTimeout = setTimeout(function () {
			that.refresh();
		}, this.options.resizePolling);
	},


	_transitionEnd: function (e) {
		if ( e.target != this.scroller || !this.isInTransition ) {
			return;
		}
		this._transitionTime();

		if ( !this.resetPosition(this.options.bounceTime) ) {
			this.isInTransition = false;
			this._execEvent('scrollEnd', this.currentPage);
		}
	},


	destroy: function () {
		this._initEvents(true);		// 去除事件绑定
	},


	resetPosition: function (time) {
		var x = this.x,
			y = this.y;

		time = time || 0;

		if ( !this.hasHorizontalScroll || this.x > 0 ) {
			x = 0;
		} else if ( this.x < this.maxScrollX ) {
			x = this.maxScrollX;
		}

		if ( !this.hasVerticalScroll || this.y > 0 ) {
			y = 0;
		} else if ( this.y < this.maxScrollY ) {
			y = this.maxScrollY;
		}

		if ( x == this.x && y == this.y ) {
			return false;
		}
		this.scrollTo(x, y, time, this.options.bounceEasing);
		return true;
	},



	disable: function () {
		this.enabled = false;
	},

	enable: function () {
		this.enabled = true;
	},



	on: function (type, fn) {
		if ( !this._events[type] ) {
			this._events[type] = [];
		}
		this._events[type].push(fn);
	},
	off: function (type, fn) {
		if ( !this._events[type] ) {
			return;
		}

		var index = this._events[type].indexOf(fn);

		if ( index > -1 ) {
			this._events[type].splice(index, 1);
		}
	},


	_execEvent: function (type) {
		if ( !this._events[type] ) {
			return;
		}
		var i = 0,
			l = this._events[type].length;

		if ( !l ) {
			return;
		}
		for ( ; i < l; i++ ) {
			this._events[type][i].apply(this, [].slice.call(arguments, 1));
		}
	},


	scrollTo: function (x, y, time, easing) {
		easing = easing || utils.ease.circular;

		this.isInTransition = this.options.useTransition && time > 0;

		if ( !time || (this.options.useTransition && easing.style) ) {

			if (this.options.role === 'slider' || this.options.role === 'tab') {	// 不添加判断会影响 left/top 的过渡
				time = this.options.duration;
				this.scrollerStyle[utils.style.transitionProperty] = utils.style.transform;	
			}
			this.scrollerStyle[utils.style.transitionTimingFunction] = easing.style;
			this._transitionTime(time);
			this._translate(x, y);
		} else {
			this._animate(x, y, time, easing.fn);
		}
	},


	scrollToElement: function (el, time, offsetX, offsetY, easing) {
		el = el.nodeType ? el : this.scroller.querySelector(el);

		if ( !el ) {
			return;
		}
		var pos = utils.offset(el);
		pos.left -= this.wrapperOffset.left;
		pos.top  -= this.wrapperOffset.top;

		// if offsetX/Y are true we center the element to the screen
		// 若 offsetX/Y 都是 true，则会滚动到元素在屏幕中间的位置
		if ( offsetX === true ) {
			offsetX = Math.round(el.offsetWidth / 2 - this.wrapper.offsetWidth / 2);
		}
		if ( offsetY === true ) {
			offsetY = Math.round(el.offsetHeight / 2 - this.wrapper.offsetHeight / 2);
		}
		pos.left -= offsetX || 0;
		pos.top  -= offsetY || 0;
		pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left;
		pos.top  = pos.top  > 0 ? 0 : pos.top  < this.maxScrollY ? this.maxScrollY : pos.top;

		time = time === undefined || time === null || time === 'auto' ? Math.max(Math.abs(this.x-pos.left), Math.abs(this.y-pos.top)) : time;

		this.scrollTo(pos.left, pos.top, time, easing);
	},


	_transitionTime: function (time) {
		time = time || 0;
		this.scrollerStyle[utils.style.transitionDuration] = time + 'ms';

		if ( !time && utils.isBadAndroid ) {
			this.scrollerStyle[utils.style.transitionDuration] = '0.001s';
		}
	},


	_translate: function (x, y) {
		if ( this.options.useTransform ) {
			this.scrollerStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;
		} else {
			x = Math.round(x);
			y = Math.round(y);
			this.scrollerStyle.left = x + 'px';
			this.scrollerStyle.top = y + 'px';
		}
		this.x = x;
		this.y = y;
	},


	getComputedPosition: function () {
		var matrix = window.getComputedStyle(this.scroller, null),
			x, y;

		if ( this.options.useTransform ) {
			matrix = matrix[utils.style.transform].split(')')[0].split(', ');
			x = +(matrix[12] || matrix[4]);
			y = +(matrix[13] || matrix[5]);
		} else {
			x = +matrix.left.replace(/[^-\d.]/g, '');
			y = +matrix.top.replace(/[^-\d.]/g, '');
		}

		return { x: x, y: y };
	},

	
	_animate: function (destX, destY, duration, easingFn) {	// 当浏览器不支持 transition 时提供的退化方案 requestAnimationFrame
		var that = this,
			startX = this.x,
			startY = this.y,
			startTime = utils.getTime(),
			destTime = startTime + duration;

		function step () {
			var now = utils.getTime(),
				newX, newY,
				easing;

			if ( now >= destTime ) {
				that.isAnimating = false;
				that._translate(destX, destY);

				if ( !that.resetPosition(that.options.bounceTime) ) {
					that._execEvent('scrollEnd', this.currentPage);
				}
				return;
			}

			now = ( now - startTime ) / duration;
			easing = easingFn(now);
			newX = ( destX - startX ) * easing + startX;
			newY = ( destY - startY ) * easing + startY;
			that._translate(newX, newY);

			if ( that.isAnimating ) {
				rAF(step);
			}
		}
		this.isAnimating = true;
		step();
	},


	_autoplay: function() {
		var self = this,
			curPage = self.currentPage;
		
		self.currentPage = self.currentPage >= self.count-1 ? 0 : ++self.currentPage;
		self._execEvent('beforeScrollStart', curPage, self.currentPage);	// 对于自动播放的 slider/tab，这个时机就是 beforeScrollStart

		// tab 外层高度自适应
		if (this.options.role === 'tab') {
			$(this.scroller).children().height('auto');
			document.body.scrollTop = 0;
		}
		self.scrollTo(-self.itemWidth*self.currentPage, 0, self.options.bounceTime, self.options.bounceEasing);

		if (self.indicator) {
			$(self.indicator).children().removeClass('current');
			$(self.indicator.children[self.currentPage]).addClass('current');
			$(self.scroller).children().removeClass('current');
			$(self.scroller.children[self.currentPage]).addClass('current');
		}
		else if (self.nav) {
			$(self.nav).children().removeClass('current');
			$(self.nav.children[self.currentPage]).addClass('current');
			$(self.scroller).children().removeClass('current');
			$(self.scroller.children[self.currentPage]).addClass('current');
		}

		self.options.flag = setTimeout(function() {
			self._autoplay.apply(self);
		}, self.options.interval);
	}


};

// Scroll.utils = utils;
// window.fz = window.fz || {};
// window.frozen = window.frozen || {};
// window.fz.Scroll = window.frozen.Scroll = Scroll;


$.testiScroll = function ( obj, options ) {
	return new Scroll( $.isIns( obj ) ? obj[ i ] : obj, options )
}

/*
 * 兼容 RequireJS 和 Sea.js
 */
// if (typeof define === "function") {
// 	define(function(require, exports, module) {
// 		module.exports = Scroll;
// 	})
// }

})( $$$ );




(function($, window, undefined){
	"use strict";
	var doc = document,
		style = doc.documentElement.style;
	$.cssPrefix = (function () {
		var items=[ 'webkit', 'Moz', 'ms', 'O' ];
		
		return {
			hasTouch         : 'ontouchstart' in window,
			cssTransformStart: !$.os.opera ? '3d(' : '(',
			cssTransformEnd  : !$.os.opera ? ',0)' : ', )',
			prefix           : (function (){
				var prefix;
				for( var j = 0; j < items.length; j++ ) {
					if(style[ items[ j ] + 'Transform' ] === '' ) {
						prefix = items[ j ];
					}
				}
				return prefix;
			})()
		};
	})();	
	$.getCssMatrix = function(ele) {
		if ( $.isIns( ele ) ) {
			ele = ele.get(0)
		};

		var matrixFn = window.WebKitCSSMatrix || window.MSCSSMatrix;

		if (ele === undefined) {
			if (matrixFn) {
				return new matrixFn();
			}
			else {
				return {
					a: 0,
					b: 0,
					c: 0,
					d: 0,
					e: 0,
					f: 0
				};
			}
		}

		var computedStyle = window.getComputedStyle(ele);

		var transform = computedStyle.webkitTransform ||
						computedStyle.transform ||
						computedStyle[$.cssPrefix.prefix + "Transform"];

		if (matrixFn)
			return new matrixFn(transform);
		else if (transform) {
			//fake css matrix
			var mat = transform.replace(/[^0-9\-.,]/g, "").split(",");
			return {
				a: +mat[0],
				b: +mat[1],
				c: +mat[2],
				d: +mat[3],
				e: +mat[4],
				f: +mat[5]
			};
		}
		else {
			return {
				a: 0,
				b: 0,
				c: 0,
				d: 0,
				e: 0,
				f: 0
			};
		}
	};	
	
	$.transEnd_EV = (function () {
		if ( $.isEmptyObject( $.cssPrefix ) ) return false;

		var transitionEnd = {
				''		: 'transitionend',
				'webkit': 'webkitTransitionEnd',
				'Moz'	: 'transitionend',
				'O'		: 'otransitionend',
				'ms'	: 'MSTransitionEnd'
			};

		return transitionEnd[ $.cssPrefix.prefix ];
	})();
	$.animateEnd_EV = (function () {
		if ( $.isEmptyObject( $.cssPrefix ) ) return false;
		var animateEnd = {
				''		: 'animationEnd',
				'webkit': 'webkitAnimationEnd',
				'Moz'	: 'animationend',
				'O'		: 'oanimationend',
				'ms'	: 'animationend'
			};

		return animateEnd[ $.cssPrefix.prefix ];
	})();
	$.touch_EV = (function () {
		return {
			resize_EV : 'onorientationchange' in window ? 'orientationchange' : 'resize',
			start_EV  : $.cssPrefix.hasTouch ? 'touchstart' : 'mousedown',
			move_EV   : $.cssPrefix.hasTouch ? 'touchmove' : 'mousemove',
			end_EV    : $.cssPrefix.hasTouch ? 'touchend' : 'mouseup',
			cancel_EV : $.cssPrefix.hasTouch ? 'touchcancel' : 'mouseup'
		}
	})();
})( $$$ , window );
/* ==============================
	event 
================================ */
(function ( $ ) {
	var rword = /[^, ]+/g;
	function createEvent ( ev, props ) {
		var event = document.createEvent("Events"),
			bubbles = true;
		if (props) {
			for ( var name in props ) {
				if ( name === "bubbles" ) { 
					bubbles = !!props[name];
				} else {  
					event[name] = props[name];
				}
			}
		}
		event.initEvent(ev, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null);
		return event;
	}
	$.on = function ( obj, ev, fn, capture ) {
		if ( !obj ) {
			return;
		}

		if ( ( obj.nodeType && ( obj.nodeType === 1 || obj.nodeType == 9 ) ) || $.isWindow( obj ) ) {

			ev = ev.match( rword );
			var id = $.cache.getGid( obj ), 
				i = 0, j = 0, k = 0,
				len = ev.length;

			var set = $.cache.eventCache[ id ] = $.cache.eventCache[ id ] ? $.cache.eventCache[ id ] : {};
			// var set = eventCache[ id ];
			
			for (; i < len; i++ ) {

				if( !set[ ev[ i ] ] ) {

					set[ ev[ i ] ] = [];
					set[ ev[ i ] ].push( fn );

					obj.addEventListener( ev[ i ], fn, !!capture );

				} else if ( $.isArray( set[ ev[ i ] ] ) && !( $.inArray( set[ ev[ i ] ], fn ) ) ) {

					set[ ev[ i ] ].push( fn );
					
					obj.addEventListener( ev[ i ], fn, !!capture );
				}
			}
		}
	};
	$.one = function ( obj, ev, fn, capture ) {
		if ( !obj ) {
			return;
		}

		var proxy = function () {
			// var i = 0, nev = ev.match( rword ), len = nev.length;
			fn.apply(obj, arguments);

			$.off(obj, ev, proxy, capture);
		}
		$.on( obj, ev, proxy, capture )
	};
	$.off = function ( obj, ev, fn, capture ) {
		if ( !obj ) {
			return;
		}
		if ( ( obj.nodeType && ( obj.nodeType === 1 || obj.nodeType == 9 ) ) || $.isWindow( obj ) ) {
			var id = $.cache.getGid( obj );
			var ageLen = arguments.length;
			var chache = $.cache.eventCache[ id ];
			var handleEvent = function ( hdlEvt, hdlFn ) {

				var evt = hdlEvt ? chache[ hdlEvt ] : false;
				var callBackFn = hdlFn === undefined ? fn : false;
				var eLen  = 0;
				if(  evt ) {
					eLen = evt.length;
					if ( callBackFn ) {

						for ( var i = 0; i < eLen; i++ ) {
							if( evt[ i ] == callBackFn ) {
								obj.removeEventListener( hdlEvt, fn, !!capture );
								evt.splice( i, 1 );
							}
						}
						
					} else if ( callBackFn === false ) {

						for ( var i = 0; i < eLen; i++ ) {
							obj.removeEventListener( hdlEvt, evt[ i ], !!capture );
							evt.splice( i, 1 );
						}
					}				
				} else {
					for ( var i in chache ) {
						var evt = chache[ i ],
							eLen = evt.length;
						for ( var j = 0; j < eLen; j++ ) {
							obj.removeEventListener( i, evt[ j ], !!capture );
							evt.splice( j, 1 );
						}					
					}
				}
			}


			if ( !chache || $.isFunction( ev ) ) return;

			

			ev = ev ? ev.match(rword) : [] ;

			if ( ageLen >= 3 ) {

				for ( var i = 0, len = ev.length; i < len; i++ ) {
					handleEvent( ev[ i ] )
				}

			} else if ( ageLen == 2 ) {

				for ( var i = 0, len = ev.length; i < len; i++ ) {
					handleEvent( ev[ i ], false );
				}
				
			} else {
				
				handleEvent();
			}
		}
	};
	$.trigger = function( obj, ev, data ) {
		if ( !obj || !ev ) return;
		var sEv, i = 0, j, evt;
		if ( typeof ev !== 'string' && $.isObject( ev ) ) {
			for ( j in ev ){
				sEv = ' '+ev[ j ];
			}
		} else {
			sEv = ev;
		}
		sEv = sEv.match( rword );
		for ( var len = sEv.length; i < len; i++ ) {

			evt = createEvent( sEv[ i ] );
			if ( data ) {
				evt.data = data;
			}
			obj.dispatchEvent( evt );
		}
		return obj;
	};
	$.each(['on', 'one', 'off'], function ( key, name ) {

		$.fn[ name ] = function ( ev, fn ) {
			var len = this.length;
			if ( !len ) {
				return this;
			}
			for ( var i = 0; i < len; i++ ) {

				$[ name ]( this[ i ], ev, fn );
			}
			return this;
		}
	});

	$.fn.trigger = function ( ev, data ) {
		var len = this.length;
		if ( !len || !ev ) {
			return this;
		}
		for ( var i = 0; i < len; i++ ) {

			$.trigger( this[ i ], ev, data );
		}
		return this;
	}
})( $$$ );
(function ( $ ) {
	"use strict";
	var touch = {},
		touchTimeout;

	function parentIfText ( node ) {
		return 'tagName' in node ? node : node.parentNode;
	}

	function swipeDirection( x1, x2, y1, y2 ) {
		var xDelta = Math.abs( x1 - x2 ), yDelta = Math.abs( y1 - y2 );
		if ( xDelta >= yDelta ) {
			return ( x1 - x2 > 0 ? 'Left' : 'Right' );
		} else {
			return ( y1 - y2 > 0 ? 'Up' : 'Down' );
		}
	}

	var longTapDelay = 750;
	function longTap () {
		if ( touch.last && ( Date.now() - touch.last >= longTapDelay ) ) {
			touch.el.trigger( 'longTap' );
			touch = {};
		}
	}
	var longTapTimer;
	$(document).ready(function() {
		var prevEl;
		$(document.body).on('touchstart', function ( e ) {
			if ( e.originalEvent ) {
				e = e.originalEvent;
			}
			if ( !e.touches || e.touches.length === 0 ) return;

			var now = Date.now(), delta = now - (touch.last || now);
			
			if ( !e.touches || e.touches.length === 0 ) return;

			touch.el = $( parentIfText( e.touches[ 0 ].target ) );
			
			touchTimeout && clearTimeout( touchTimeout );

			touch.x1 = e.touches[ 0 ].pageX;
			touch.y1 = e.touches[ 0 ].pageY;
			touch.x2 = touch.y2 = 0;

			if ( delta > 0 && delta <= 250 ) {
				touch.isDoubleTap  = true;
			}
			
			touch.last = now;
			longTapTimer = setTimeout( longTap, longTapDelay );

			if ( !touch.el.attr('data-pressed') ) {
				
				touch.el.addClass('pressed');
			}

			if (prevEl && !prevEl.attr('data-pressed') && prevEl[0] !== touch.el[0]) {
				prevEl.removeClass('pressed');
			}
			prevEl = touch.el;
		}).on('touchmove', function ( e ) {
			if( e.originalEvent ) {
				e = e.originalEvent;
			}

			touch.x2 = e.touches[ 0 ].pageX;
			touch.y2 = e.touches[ 0 ].pageY;
			clearTimeout( longTapTimer );

		}).on('touchend', function ( e ) {
			if( e.originalEvent ) {
				e = e.originalEvent;
			}

			if ( !touch.el ) return;
			
			if ( !touch.el.attr('data-pressed') ) {
				touch.el.removeClass('pressed');	
			}

			if ( touch.isDoubleTap ) {
				touch.el.trigger('doubleTap');
				touch = {};

			} else if ( touch.x2 > 0 || touch.y2 > 0 ) {
				( Math.abs(touch.x1 - touch.x2) > 30 || Math.abs(touch.y1 - touch.y2) > 30 ) &&
				touch.el.trigger('swipe') &&
				touch.el.trigger('swipe' + ( swipeDirection( touch.x1, touch.x2, touch.y1, touch.y2 ) ));
				touch.x1 = touch.x2 = touch.y1 = touch.y2 = touch.last = 0;
			} else if ( 'last' in touch ) {
				touch.el.trigger('tap');
				touchTimeout = setTimeout(function() {
					touchTimeout = null;
					if ( touch.el )
						touch.el.trigger('singleTap');
					touch = {};
				}, 250);
			}
		}).on('touchcancel', function() {
			if( touch.el && !touch.el.attr('data-pressed') ) {
				touch.el.removeClass('pressed');
			}

			touch = {};
			clearTimeout(longTapTimer);
		});
	});
	
	$.each(['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'singleTap', 'longTap'], function (i, m) {
		$.fn[ m ] = function(callback) {
			return this.on(m, callback);
		};
	});

})( $$$ );
/*
  $("#animate").css3Animate({
		width: "100px",
		height: "100px",
		x: "20%",
		y: "30%",
		time: "1000ms",
		opacity: .5,
		callback: function () {
			//execute when finished
		}
	});

	//Chain animations
	$("#animate").css3Animate({
		x: 20,
		y: 30,
		time: "300ms",
		callback: function () {
			$("#animate").css3Animate({
				x: 20,
				y: 30,
				time: "500ms",
				previous: true,
				callback: function () {

				}
			});
		}
	});
 */
(function($) {
	"use strict";
	var cache = [];
	// Like setTimeout(fn, 0); but much faster
	var timeouts = [];
	var contexts = [];
	var params = [];
	/**
	 * This adds a command to execute in the JS stack, but is faster then setTimeout
	   ```
	   $.asap(function,context,args)
	   ```
	 * @param {Function} fn function
	 * @param {Object} context
	 * @param {Array} args arguments
	 */
	var asap = function(fn, context, args) {
		if (!$.isFunction(fn)) throw '$.asap - argument is not a valid function';
		timeouts.push(fn);
		contexts.push(context ? context : {});
		params.push(args ? args : []);
		//post a message to ourselves so we know we have to execute a function from the stack
		window.postMessage($.fn.namespace + '-asap', '*');
	};
	window.addEventListener('message', function(event) {
		if (event.source === window && event.data === $.fn.namespace + '-asap') {
			event.stopPropagation();
			if (timeouts.length > 0) {
				(timeouts.shift()).apply(contexts.shift(), params.shift());
			}
		}
	}, true);

	var objId = function( obj ) {
		if ( !obj.css3AnimateId ) {
			obj.css3AnimateId = $.uuid();
		}
		return obj.css3AnimateId;
	};
	var getEl = function(elID) {
		if ( typeof elID === 'string' || elID instanceof String ) {
			return document.getElementById( elID );
		} else if ( $.isIns( elID ) ) {
			return elID[0];
		} else {
			return elID;
		}
	};	
	var numOnly = function numOnly( val ) {
		if ( val === undefined || val === '' ) {
			return 0;
		}
		if ( isNaN( parseFloat(val) ) ) {
			if ( val.replace ) {
				val = val.replace(/[^0-9.-]/g, '');
			} else {
				return 0;
			}
		}
		return parseFloat( val );
	};
	var getCSS3Animate = function( obj, options ) {
		var tmp, id, el = getEl( obj );
		//first one
		id = objId( el );
		if ( cache[ id ] ) {
			cache[ id ].animate( options );
			tmp = cache[ id ];
		} else {
			tmp = css3Animate( el, options );
			cache[ id ] = tmp;
		}
		return tmp;
	};
	$.fn.css3Animate = function( opts ) {
		//保留旧的回调
		if ( !opts.complete && opts.callback ) {
			opts.complete = opts.callback;
		}

		var tmp = getCSS3Animate( this[ 0 ], opts );
		opts.complete = null;
		opts.sucess = null;
		opts.failure = null;
		for ( var i = 1; i < this.length; i++ ) {
			tmp.link( this[ i ], opts );
		}
		return tmp;
	};


	// $.css3AnimateQueue = function() {
	// 	return new css3Animate.queue();
	// };
	


	var translateOpen  = $.cssPrefix.cssTransformStart;
	var translateClose = $.cssPrefix.cssTransformEnd;
	var transitionEnd  = $.transEnd_EV;

	var css3Animate = (function() {

		var css3Animate = function( elID, options ) {
			if ( !(this instanceof css3Animate) ) {
				return new css3Animate(elID, options);
			}

			//start
			this.callbacksStack    = [];
			this.activeEvent       = null;
			this.countStack        = 0;
			this.isActive          = false;
			this.el                = elID;
			this.linkFinishedProxy = $.proxy(this.linkFinished, this);

			if (!this.el) {
				return
			};

			this.animate( options );
			//debugger;
			var that = this;
			$(this.el).on('destroy', function() {
				var id = that.el.css3AnimateId;
				that.callbacksStack = [];
				if ( cache[ id ] ) {
					delete cache[id];
				}
			});
		};
		css3Animate.prototype = {
			animate: function(options) {
				//取消当前对象活动动画
				if ( this.isActive ) {
					this.cancel();
				}

				this.isActive = true;

				if (!options) {
					
					return;
				}

				var classMode = !!options.addClass;
				var scale, time;
				var timeNum = numOnly(options.time);
				// if ( classMode ) {

				// 	if (options.removeClass) {
				// 		$(this.el).replaceClass(options.removeClass, options.addClass);
				// 	} else {
				// 		$(this.el).addClass(options.addClass);
				// 	}

				// } else {
				// 

					if ( timeNum === 0 ) {
						options.time = 0;
					}
					if ( !options.y ) {
						options.y = 0;
					}
					if ( !options.x ) {
						options.x = 0;
					}
					if ( options.previous ) {
						var cssMatrix = new $.getCssMatrix( this.el );
						options.y += numOnly( cssMatrix.f );
						options.x += numOnly( cssMatrix.e );
					}
					if ( !options.origin ) {
						options.origin = '0% 0%';
					}

					if ( !options.scale ) {
						options.scale = '1';
					}

					if ( !options.rotateY ) {
						options.rotateY = '0';
					}
					if ( !options.rotateX ) {
						options.rotateX = '0';
					}
					if ( !options.skewY ) {
						options.skewY = '0';
					}
					if ( !options.skewX ) {
						options.skewX = '0';
					}


					if (!options.timingFunction) {
						options.timingFunction = 'linear';
					}

					//check for percent or numbers
					if ( typeof( options.x ) === 'number' || (options.x.indexOf('%') === -1 && 
							options.x.toLowerCase().indexOf('px') === -1 && 
							options.x.toLowerCase().indexOf('deg') === -1)) {
						options.x = parseInt(options.x, 10) + 'px';
					}
					if ( typeof(options.y) === 'number' || (options.y.indexOf('%') === -1 && 
						options.y.toLowerCase().indexOf('px') === -1 && 
						options.y.toLowerCase().indexOf('deg') === -1)) {
						options.y = parseInt(options.y, 10) + 'px';
					}

					var trans = 'translate' + translateOpen + (options.x) + ',' + (options.y) + translateClose + ' scale(' + parseFloat(options.scale) + ') rotate(' + options.rotateX + ')';
					if ( !$.os.opera ) {
						trans += ' rotateY(' + options.rotateY + ')';
					}
						
					trans += ' skew(' + options.skewX + ',' + options.skewY + ')';
					this.el.style[ $.cssPrefix.prefix + 'Transform' ] = trans;
					this.el.style[ $.cssPrefix.prefix + 'BackfaceVisibility' ] = 'hidden';

					var properties = $.cssPrefix.prefix + 'Transform';
					if ( options.opacity !== undefined ) {
						this.el.style.opacity = options.opacity;
						properties += ', opacity';
					}
					if ( options.width ) {
						this.el.style.width = options.width;
						properties = 'all';
					}
					if ( options.height ) {
						this.el.style.height = options.height;
						properties = 'all';
					}
					this.el.style[ $.cssPrefix.prefix + 'TransitionProperty' ] = 'all';

					if ( ('' + options.time).indexOf('s') === -1 ) {
						scale = 'ms';
						time = options.time + scale;
					} else if ( options.time.indexOf('ms') !== -1 ) {
						scale = 'ms';
						time = options.time;
					} else {
						scale = 's';
						time = options.time + scale;
					}
					if ( options.delay ) {
						this.el.style[ $.cssPrefix.prefix + 'TransitionDelay' ] = options.delay;
					}

					this.el.style[ $.cssPrefix.prefix + 'TransitionDuration' ]       = time;
					this.el.style[ $.cssPrefix.prefix + 'TransitionTimingFunction' ] = options.timingFunction;
					this.el.style[ $.cssPrefix.prefix + 'TransformOrigin' ]          = options.origin;

				//}

				//添加回调堆栈

				this.callbacksStack.push({
					complete: options.complete,
					success: options.success,
					failure: options.failure
				});
				this.countStack++;

				var that = this,
					duration;
				var style = window.getComputedStyle( this.el );
				// if (classMode) {
				// 	//get the duration
				// 	duration = style[$.cssPrefix.prefix + "TransitionDuration"];
				// 	timeNum = numOnly(duration);
				// 	options.time = timeNum;
				// 	if (duration.indexOf("ms") !== -1) {
				// 		scale = "ms";
				// 	} else {
				// 		scale = "s";
				// 		options.time *= 1000;
				// 	}
				// }

				if ( timeNum === 0 || (scale === 'ms' && timeNum < 5) || style.display === 'none') {
					asap( $.proxy(this.finishAnimation, this, [false]) );
					
				} else {
					this.activeEvent = function ( event ) {
						clearTimeout( that.timeout );
						that.finishAnimation( event );
						that.el.removeEventListener( transitionEnd, that.activeEvent, false );
					};
					that.timeout = setTimeout(this.activeEvent, numOnly(options.time) + 50);
					this.el.addEventListener(transitionEnd, this.activeEvent, false);
				}
			},
			addCallbackHook: function ( callback ) {
				if ( callback ) {
					this.callbacksStack.push(callback);
				}

				this.countStack++;
				
				return this.linkFinishedProxy;
			},
			linkFinished: function ( canceled ) {
				if ( canceled ) {
					this.cancel();
				}
				else this.finishAnimation();
			},
			finishAnimation: function ( event ) {
				if ( event && event.preventDefault ) {
					event.preventDefault();
				}
				if (!this.isActive) return;

				this.countStack--;

				if (this.countStack === 0) this.fireCallbacks(false);
			},
			fireCallbacks: function( canceled ) {
				this.clearEvents();
				var callbacks = this.callbacksStack;
				this.cleanup();
				for ( var i = 0; i < callbacks.length; i++ ) {
					var complete = callbacks[ i ].complete;
					var success = callbacks[ i ].success;
					var failure = callbacks[ i ].failure;
					//fire callbacks
					if ( typeof(complete) === 'function' ) {
						complete( canceled );
					}
					//success/failure
					if ( canceled && typeof(failure) === 'function') {
						failure();
					} else if (typeof(success) === 'function') {
						success();
					}
				}
			},
			cancel: function () {
				if (!this.isActive) return;
				this.fireCallbacks(true);
			},
			cleanup: function() {
				this.callbacksStack = [];
				this.isActive = false;
				this.countStack = 0;
			},
			clearEvents: function () {
				if (this.activeEvent) {

					this.el.removeEventListener(transitionEnd, this.activeEvent, false);
				}
				this.activeEvent = null;
			},
			link: function ( elID, opts ) {
				var callbacks = {
					complete: opts.complete,
					success: opts.success,
					failure: opts.failure
				};
				opts.complete = this.addCallbackHook(callbacks);
				opts.success = null;
				opts.failure = null;

				getCSS3Animate(elID, opts);

				opts.complete = callbacks.complete;
				opts.success  = callbacks.success;
				opts.failure  = callbacks.failure;
				return this;
			}
		};

		return css3Animate;
	})();

	// css3Animate.queue = function() {
	// 	return {
	// 		elements: [],
	// 		push: function ( el ) {
	// 			this.elements.push(el);
	// 		},
	// 		pop: function () {
	// 			return this.elements.pop();
	// 		},
	// 		run: function () {
	// 			var that = this;
	// 			if ( this.elements.length === 0 ) return;
	// 			if ( typeof(this.elements[0]) === 'function' ) {
	// 				var func = this.shift();
	// 				func();
	// 			}
	// 			if ( this.elements.length === 0 ) return;
	// 			var params = this.shift();
	// 			if ( this.elements.length > 0 ) {
	// 				params.complete = function(canceled) {
	// 					if ( !canceled ) that.run();
	// 				};
	// 			}
	// 			css3Animate( document.getElementById(params.id), params );
	// 		},
	// 		shift: function() {
	// 			return this.elements.shift();
	// 		}
	// 	};
	// };
})( $$$ );
(function ( $ ) {

	$.classCss3Animate = function css3Animate ( elem, cls, callBack ) {
		var oElem = $(elem);
		if ( !elem.nodeType || elem.nodeType !== 1 || oElem.attr('data-pressed') ) {
			oElem = null;
			return;
		}
		
		var args = arguments, len = args.length;

		if ( len == 2 && (typeof args[ 1 ] !== 'string' || $.isFunction( args[ 1 ] )) ) {
			callBack = args[ 1 ];
			cls = null;
		}

		var attr = oElem.attr('data-animate'),
			cls = cls || attr,
			oldClass = oElem.attr('data-animate-old');

		if( cls === oldClass ) {
			return;
		}

		if( oldClass && oElem.hasClass( oldClass ) ) {
			oElem.removeClass( oldClass );
		}
		
		oElem.attr('data-animate-old', cls );

		oElem.attr('data-pressed', 'true').addClass( cls ).one($.animateEnd_EV, function (){
			oElem.removeAttr('data-pressed');
			callBack&&callBack.call(this);
		});	


	}
	$.fn.classCss3Animate = function ( cls, callBack ) { 
		var len = this.length;
		if( !len ) {
			return this;
		}
		if ( arguments.length == 1 && (typeof cls !== 'string' || $.isFunction( cls )) ) {
			callBack = cls;
			cls = null;
		}
		this.each(function (i, v) {
			$.classCss3Animate( this, cls, (callBack && function (){
				callBack.call(this)
			}));
		});
		return this;
	}
})( $$$ );
(function ( $ ) {
	$.ui = {}
})( $$$ );
(function ( $ ) {
	var emptyfn = function () {};
	var globalOps = {
		loading: false,
		autoHide: '',
		customClass: '',
		tipText: '',

		status: 'hide',
		showCallBack: emptyfn,
		hideCallBack: emptyfn
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
			// root.style.zIndex = 9998;
			root.classList.add('mask');
			document.documentElement.appendChild( root );
		} else {
			root.className = '';
			root.classList.add('mask');
		}
		if( len ) {
			for( var i = 0; i < len; i++ ) {
				root.classList.add(cls[i]);
			}
		}

		root.innerHTML = '';
		obj.root = root;
		
		return createLoading( obj )
		

	};
	var createLoading = function ( obj ) {
			/*
			<div class="logo-loading-box">
				<div class="wave">
					<div class="inner"></div>
				</div>
				<div class="logo"></div>
			</div>


			'<div class="mask-loading">'
			,'	<div class="mask-loading-conatiner">'
			,'{%?it.tipText||it.loading%}'
			,'		<div class="mask-loading-inner">'
			,'      	<div class="mask-inner-body">'
			,' 				{%?it.loading%}'
			,'				<div class="loading-spinner-outer">'
			,'					<div class="loading-spinner">'
			,'						<span class="loading-top"></span>'
			,'						<span class="loading-right"></span>'
			,'						<span class="loading-bottom"></span>'
			,'						<span class="loading-left"></span>'
			,'					</div>'
			,'				</div>'
			,' 				{%?%}'
			,'				{%?it.tipText%}<div class="mask-tip-txt">{%=it.tipText%}</div>{%?%}'
			,'			</div>'
			,'		</div>'
			,'{%?%}'
			,'	</div>'
			,'</div>'
			 */

		var str = [
			'<div class="mask-loading">'
			,'	<div class="mask-loading-conatiner">'
			,'{%?it.tipText||it.loading%}'
			,'		<div class="mask-loading-inner">'
			,'      	<div class="mask-inner-body">'
			,' 				{%?it.loading%}'
			,'					{%?it.loading=="shouxinerLoading"%}'
			,'						<div class="logo-loading-box">'
			,'							<div class="wave">'
			,'								<div class="inner"></div>'
			,'							</div>'
			,'							<div class="logo"></div>'
			,'						</div>'
			,'					{%??%}'
			,'				        <div class="loading-spinner-outer">'
			,'							<div class="loading-spinner">'
			,'								<span class="loading-top"></span>'
			,'								<span class="loading-right"></span>'
			,'								<span class="loading-bottom"></span>'
			,'								<span class="loading-left"></span>'
			,'							</div>'
			,'						</div>'
			,'					{%?%}'
			,' 				{%?%}'
			,'				{%?it.tipText%}<div class="mask-tip-txt">{%=it.tipText%}</div>{%?%}'
			,'			</div>'
			,'		</div>'
			,'{%?%}'
			,'	</div>'
			,'</div>'
		].join('');
		obj.root.innerHTML = $.doT(str, obj);
		obj.loadingElem = obj.root.querySelectorAll('.mask-loading')[0];

		return obj;
	};
	var show = function ( obj ) {
		var time_outer, time = obj.autoHide ? ( typeof obj.autoHide == 'number' ? obj.autoHide : parseInt(obj.autoHide, 10) ) : 0 ;
		if( window.getComputedStyle(obj.root)['display'] == 'none' ) {
			obj.root.style.display = 'block';
		}
		if( (obj.loading || obj.tipText ) && obj.loadingElem) {

			obj.loadingElem.style.display = 'block';
		}
		if( obj.autoHide ) {

			time_outer = setTimeout(function () {
				obj.loadingElem.style[ $.cssPrefix.prefix + 'TransitionDuration' ] = '300ms';
				obj.loadingElem.style[ $.cssPrefix.prefix + 'Transform' ] = 'translateY(-100%)';
			}, obj.autoHide);
			

			$.one(obj.loadingElem, $.transEnd_EV, function () {
				clearTimeout( time_outer );
				obj.root.style.display = 'none';
				obj.showCallBack();
			});

		} else {
			obj.showCallBack();
		}
	};
	var hide = function ( obj ) {
		if( window.getComputedStyle(obj.root)['display'] !== 'none' ) {
			obj.root.style.display = 'none';
		}
		if( obj.loadingElem ) {
			obj.loadingElem.style.display = 'none';
		}
		obj.hideCallBack();
	};

	$.ui.mask = function ( options ) {
		var obj = $.extend( {}, globalOps, options );
		obj = createRoot( obj );
		if( obj.status ) {
			show( obj )
		} else {
			hide( obj  )
		}
	};
	$.ui.mask.show = function ( options, callback ) {
		var tmpOps = {
			loading: false,
			status: true,
			showCallBack: emptyfn
		}
			if( typeof options == 'function' ) {
				callback = options
				tmpOps = {
					loading: false,
					status: true,
					showCallBack: callback
				};
			} else {
				if( options === null ) {
					tmpOps.loading = !!options;	
				} else {
					switch ( typeof options ) {
						case 'boolean':
						case 'string':
						case 'number':
						case 'undefined':
							tmpOps.loading = !!options;
							break;
						case 'object':
							tmpOps = $.extend( tmpOps, options );
							break;
					}					
				}
			}
		var ops = $.extend( {}, globalOps, tmpOps);
		ops.status = true;
		this( ops );
	};
	$.ui.mask.hide = function ( options, callback ) {

		var tmpOps = {
			loading: false,
			status: false,
			hideCallBack: emptyfn
		}
			if( typeof options == 'function' ) {
				callback = options
				tmpOps = {
					loading: false,
					status: false,
					hideCallBack: callback
				};
			} else {
				if( options === null ) {
					tmpOps.loading = !!options;	
				} else {
					switch ( typeof options ) {
						case 'boolean':
						case 'string':
						case 'number':
						case 'undefined':
							tmpOps.loading = !!options;
							break;
						case 'object':
							tmpOps = $.extend( tmpOps, options );
							break;
					}					
				}
			}
		var ops = $.extend( {}, globalOps, tmpOps);
		ops.status = false;
		this( ops );

	}
})( $$$ );
(function ( $ ) {
	var preInput = function ( ) {},
	okFn = function ( ) {},
	cancelFn = function ( ) {},
	globalOps = {
		title: '提示信息',
		msg: '消息提示',
		type: 'alert',
		txt: {
			okTxt: '确认',
			cancelTxt: '取消'
		},
		elem: elem,
		customClass: {
			userClass: '',
			okClass: '',
			cancelClass: '',
			showAnimateClass: 'bounce-in',
			hideAnimateClass: 'bounce-out'
		},
		maskClass:'',
		callBack: {
			preInput: preInput,
			okFn: okFn,
			cancelFn: cancelFn
		}
	};
	var bool = {
		cancelBool: false,
		okBool: true
	},
	elem = {
		root: null,
		container: null,
		content: null,
		bodyBox: null,
		titleBox: null,
		msgBox: null,
		okBtn: null,
		cancelBtn: null
	},
	callBackAll = function ( obj ) {
		if ( obj.callBack.okFn ) {
			obj.callBack.okFn.call( obj.elem );
		}
		if ( obj.callBack.cancelFn ) {
			obj.callBack.cancelFn.call( obj.elem );
		}
	},
	
	createRoot = function ( ops ) {
		var root  = document.getElementById('msgbox');
		
		// var cls = ops.customClass.match(/\S+/g) || [];
		// var len = cls.length;


		var container
		var content
		if ( !root ) {
			var tmpEle = document.createElement('div');
			//创建msgbox根节点
			root = tmpEle.cloneNode(false);
			root.id = 'msgbox';
			root.style.zIndex = 9999;
			root.classList.add('msgbox');
			//创建根容器
			container = tmpEle.cloneNode(false);
			container.classList.add('msgbox-container');
			
			//创建内容容器
			content = tmpEle.cloneNode(false);
			content.classList.add('msgbox-content');

			root.appendChild(container);
			container.appendChild(content);

			document.documentElement.appendChild(root);
		} else {
			container = root.querySelectorAll('.msgbox-container')[0];
			content = root.querySelectorAll('.msgbox-content')[0];
		}
		if( ops.customClass.userClass ) {

			root.className = '';
			root.classList.add('msgbox')
			root.classList.add(ops.customClass.userClass)
		}
		elem.root      = root;
		elem.container = container;
		elem.content        = content;
		return elem;
	},
	windowBoxHander = function ( obj ) {
		show( obj );
		var ev = $.touch_EV.start_EV;

		if ( obj.elem.okBtn ) {
			$.one(obj.elem.okBtn, 'click', function ( e ) {
				e.stopPropagation();
				hide( obj, true );
			});
		}
		if ( obj.elem.cancelBtn ) {
			$.one(obj.elem.cancelBtn, 'click', function ( e ) {
				e.stopPropagation();
				hide( obj, false );
			});				
		}
	},
	show = function ( obj, bool ) {
		if( window.getComputedStyle(obj.elem.root)['display'] == 'none' ) {

			$.ui.mask.show(function () {
				obj.elem.root.style.display = 'block';
				if( obj.customClass.showAnimateClass ) {
					$(obj.elem.root).classCss3Animate(obj.customClass.showAnimateClass, function (){
						this.classList.remove(obj.customClass.showAnimateClass)
					});
				}
			});
		}
		if( obj.callBack.preInput ) {
			obj.callBack.preInput.call( obj.elem );
		}
	},
	hide = function ( obj, bool ) {
		if( window.getComputedStyle(obj.elem.root)['display'] !== 'none' ) {
			if( obj.customClass.hideAnimateClass ) {
				$(obj.elem.root).classCss3Animate(obj.customClass.hideAnimateClass, function (){
					obj.elem.root.style.display = 'none';
					if( bool === true ) {
						$.ui.mask.hide(function () {
							if ( obj.callBack.okFn ) {
								obj.callBack.okFn.call( obj.elem );
							}
						});
					} else if ( bool === false ) {
						$.ui.mask.hide(function () {
							if ( obj.callBack.cancelFn ) {
								obj.callBack.cancelFn.call( obj.elem );
							}
						});
					} else {
						$.ui.mask.hide()
					}
					this.classList.remove(obj.customClass.hideAnimateClass);
				});
			} else {
				$.ui.mask.hide(function () {
					obj.elem.root.style.display = 'none';
					if( bool === true ) {
						if ( obj.callBack.okFn ) {
							obj.callBack.okFn.call( obj.elem );
						}
					} else if ( bool === false ) {
						if ( obj.callBack.cancelFn ) {
							obj.callBack.cancelFn.call( obj.elem );
						}
					} else {
						$.ui.mask.hide()
					}
				});
			}
		}
	},
	insertHTML = function ( obj ) {
		obj.bool = bool;
		var str = [
			'<div class="msgbox-body">'
			,' <span class="inner-bg">'
			,' 	<span class="inner"><span class="inner2"></span></span>'
			,' </span>'
			,' <div class="msgbox-body-inner">'
			,'		<div class="msgbox-title">'
			,'			<span class="msg-title-txt">{%=it.title%}</span>'
			,'		</div>'
			,'		<div class="msgbox-msg">'
			,'			{%=it.msg%}'
			,'		</div>'
			,'		<div class="msgbox-buttons">'
			,'			{%?it.bool.cancelBool%}'
			,'				<button type="buttom" data-msgbox-btn="cancel" class="btn btn-sm btn-default {%?it.customClass.cancelClass%}{%=it.customClass.cancelClass%}{%?%}">{%=it.txt.cancelTxt%}</button>'
			,'			{%?%}'
			,'			{%?it.bool.okBool%}'
			,'				<button type="buttom" data-msgbox-btn="ok" class="btn btn-sm btn-warning {%?it.customClass.okClass%}{%=it.customClass.okClass%}{%?%}">'
			,'					<span class="btn-txt">{%=it.txt.okTxt%}</span>'
			,'					<div class="loading-spinner-outer">'
			,'						<div class="loading-spinner">'
			,'							<span class="loading-top"></span>'
			,'							<span class="loading-right"></span>'
			,'							<span class="loading-bottom"></span>'
			,'							<span class="loading-left"></span>'
			,'						</div>'
			,'					</div>'
			,'				</button>'
			,'			{%?%}'
			,'		</div>'
			,'	</div>'
			,'</div>'
		].join('');

		obj.elem.content.innerHTML = $.doT(str, obj);

		obj.elem.bodyBox           = obj.elem.content.querySelectorAll('.msgbox-body')[0];
		obj.elem.titleBox          = obj.elem.content.querySelectorAll('.msgbox-title')[0];
		obj.elem.msgBox            = obj.elem.content.querySelectorAll('.msgbox-msg')[0];

		var button = obj.elem.content.querySelectorAll('.msgbox-buttons')[0].getElementsByTagName('button');

		for( var i = 0, len = button.length; i < len; i++ ) {
			var attr = button[ i ].getAttribute('data-msgbox-btn');
			if( attr ) {
				if( attr == 'ok' ) {
					obj.elem.okBtn = button[ i ];
				}
				if( attr == 'cancel' ) {
					obj.elem.cancelBtn = button[ i ];
				}
			}
		}
		delete obj.bool;
		return obj;
	},
	containerEvt = function ( obj ) {
		var evStart = $.touch_EV.start_EV;
		var evEnd = $.touch_EV.end_EV;
		$.one(obj.elem.container, evStart, function ( e ) {
			if ( e.target == obj.elem.container ) {
				obj.elem.root.classList.add('txt-select-off');
			}
		});
		$.one(obj.elem.container, evEnd, function ( e ) {
			obj.elem.root.classList.remove('txt-select-off');
			if ( e.target == obj.elem.container ) {
				hide( obj );
				if( obj.callBack.cancelFn ) {
					obj.callBack.cancelFn.call( obj.elem );
				}
			}
		});
		var keyEventFn = function ( e ) {
			if( e.keyCode === 27 ) {
				obj.elem.root.classList.remove('txt-select-off');
				hide( obj );
				if( obj.callBack.cancelFn ) {
					obj.callBack.cancelFn.call( obj.elem );
				}
				keyEvent( true )
			}
		}
		var keyEvent = function ( arg ) {
			var winTop = window.top;
			var allIfr = winTop.document.getElementsByTagName('iframe');
			var len = allIfr.length;
			var i = 0;
			if( arg ) {
				if( len ) {
					for( ; i < len; i++ ) {
						$.off( allIfr[ i ].contentWindow, 'keyup', keyEventFn);
					}
					$.off( window, 'keyup', keyEventFn);
				} else {
					$.off( window, 'keyup', keyEventFn);
				}
			} else {
				if( len ) {
					for( ; i < len; i++ ) {
						$.on( allIfr[ i ].contentWindow, 'keyup', keyEventFn);
					}
					$.on( window, 'keyup', keyEventFn);
				} else {
					$.on( window, 'keyup', keyEventFn);
				}
			}

		}
		keyEvent();
	};
	$.ui.msgbox = function ( options ) {

		var options = $.extend({}, globalOps, options );

		options.elem = createRoot( options );

		containerEvt( options );

		if( options.type == 'alert' ) {

			bool.cancelBool = false;
			bool.okBool = true;

			windowBoxHander( insertHTML( options ) );

		} else if ( options.type == 'confirm' ) {

			bool.cancelBool = true;
			bool.okBool = true;

			windowBoxHander( insertHTML( options ) );
		}
		containerEvt( options );
		return this;
	};
})( $$$ );