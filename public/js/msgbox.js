(function ( $ ) {
	var globalOps = {
		title: '提示信息',
		msg: '消息提示',
		type: 'alert',
		txt: {
			okTxt: '确认',
			cancelTxt: '取消'
		},
		elem: elem,
		customClass: {
			okClass: '',
			cancelClass: '',
			showAnmateClass: 'bounce-in',
			hideAnmateClass: 'bounce-out'
		},
		callBack: {
			okFn: okFn,
			cancelFn: cancelFn
		}
	}
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
	okFn = function ( ) {},
	cancelFn = function ( ) {},
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
			content = tmpElem.cloneNode(false);
			content.classList.add('msgbox-content');

			root.appendChild(container);
			container.appendChild(content);

			document.documentElement.appendChild(root);
		} else {
			container = root.querySelectorAll('.msgbox-container')[0];
			content = root.querySelectorAll('.msgbox-content')[0];
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
				
				if ( obj.callBack.okFn ) {
					obj.callBack.okFn.call( obj, arguments );
				}
				hide( obj );
			});				
		}


		if ( obj.elem.cancelBtn ) {
			$.one(obj.elem.cancelBtn, 'click', function ( e ) {
				e.stopPropagation();
				
				if ( obj.callBack.cancelFn ) {
					obj.callBack.cancelFn.call( obj, arguments );
				}
				hide( obj );
			});				
		}
	},
	show = function ( obj ) {
		if( window.getComputedStyle(obj.elem.root)['display'] == 'none' ) {
			$.mask.show(function () {
				obj.elem.root.style.display = 'block';
				if( obj.customClass.showAnimateClass ) {
					$(obj.elem.root).classCss3Animate(obj.customClass.showAnimateClass, function (){
						this.classList.remove(obj.customClass.showAnimateClass)
					});
				}
			});
		}
	},
	hide = function ( obj ) {
		if( window.getComputedStyle(obj.elem.root)['display'] !== 'none' ) {
			if( obj.customClass.hideAnimateClass ) {
				$(obj.elem.root).classCss3Animate(obj.customClass.hideAnimateClass, function (){
					obj.elem.root.style.display = 'none';
					$.mask.hide();
					this.classList.remove(obj.customClass.hideAnimateClass)
				})
			} else {
				$.mask.hide(function () {
					obj.elem.root.style.display = 'none'
				});
			}
		}
	},
	insertHTML = function ( obj ) {
		obj.bool = bool;
		var str = [
			'<div class="msgbox-body">'
			,'	<div class="msgbox-title">'
			,' 		<span class="inner-bg">'
			,'		<span class="inner"><span class="inner2"></span></span>'
			,'		</span>'
			,'		<span class="msg-title-txt">{%=it.title%}</span>'
			,'	</div>'
			,'	<div class="msgbox-msg">'
			,'		{%=it.msg%}'
			,'	</div>'
			,'	<div class="msgbox-buttons">'
			,'	{%?it.bool.cancelBool%}'
			,'		<button type="buttom" data-msgbox-btn="cancel" class="btn btn-sm btn-default {%=it.customClass.cancelClass%}">{%=it.txt.cancelTxt%}</button>'
			,'	{%?%}'
			,'	{%?it.bool.okBool%}'
			,'		<button type="buttom" data-msgbox-btn="ok" class="btn btn-sm btn-warning {%=it.customClass.okClass%}">'
			,'			<span class="btn-txt">{%=it.txt.okTxt%}</span>'
			,'			<div class="loading-spinner-outer">'
			,'				<div class="loading-spinner">'
			,'					<span class="loading-top"></span>'
			,'					<span class="loading-right"></span>'
			,'					<span class="loading-bottom"></span>'
			,'					<span class="loading-left"></span>'
			,'				</div>'
			,'			</div>'
			,'		</button>'
			,'	{%?%}'
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
		$.on(obj.elem.container, evStart, function ( e ) {
			obj.elem.root.classList.add('txt-select-off');
		});
		$.on(obj.elem.container, evEnd, function ( e ) {
			obj.elem.root.classList.remove('txt-select-off');
			if ( e.target == obj.elem.container ) {
				hide( obj );
			}
		});
	}
	$.msgbox = function ( options ) {
		
		var obj = {
			title: '提示信息',
			msg: '消息提示',
			type: 'alert',
			txt: {
				okTxt: '确认',
				cancelTxt: '取消'
			},
			elem: elem,
			customClass: {
				okClass: '',
				cancelClass: '',
				showAnmateClass: 'bounce-in',
				hideAnmateClass: 'bounce-out'
			},
			callBack: {
				okFn: okFn,
				cancelFn: cancelFn
			}
		}
		var options = $.extend( obj, options );
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
	};
})( $$$ );