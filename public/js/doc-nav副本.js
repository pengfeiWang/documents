document.addEventListener('DOMContentLoaded', function () {
	var doc 	    = document,
		toolNavUser = doc.getElementById('tool-nav-user'),
		nav         = doc.getElementById('tool-nav'),
		a           = nav.getElementsByTagName('a'),
		li          = nav.getElementsByTagName('li'),
		selectDep   = toolNavUser.querySelectorAll('.select-dep')[ 0 ],
		selectPro   = toolNavUser.querySelectorAll('.select-pro')[ 0 ],
		createProject = doc.getElementById('create-project');

		function reset ( parent ) {
		}
		function addIframeSrc () {}
		function add ( oLi, parent ) {
			var o = parent || nav;
			var nodeO = o.childNodes;
			for (var i = 0, len = nodeO.length; i < len; i++ ) {
				nodeO[ i ].classList.remove('active');
			}
			parent&&parent.classList.add('active');
			oLi.classList.add('active');
		}
		var loginStr = [
			,'<div class="msgbox-login">'
			,'	<div class="">'
			,'		用户名: <input type="text" name="user" class="msgbox-login-user name">'
			,'	</div>'
			,'	<div class="">'
			,'		密　码: <input type="password" name="password" class="msgbox-login-password pass">'
			,'	</div>'
			,'</div>'
		].join('');
		var regStr = [
			,'<div class="msgbox-login">'
			,'	<div class="">'
			,'		用户名: <input type="text" name="user" class="msgbox-login-user user" required>'
			,'	</div>'
			,'	<div class="">'
			,'		密　码: <input type="password" name="password" class="msgbox-login-password password" required>'
			,'	</div>'
			,'	<div class="">'
			,'		邮　箱: <input type="mail" name="email" class="msgbox-login-email email">'
			,'	</div>'
			,'</div>'
		].join('');

	function formVerify ( obj ) {
		var okBtn     = obj.okBtn,
			content   = obj.content,
			user      = content.querySelectorAll('.msgbox-login-user')[0],
			pass      = content.querySelectorAll('.msgbox-login-password')[0],
			email      = content.querySelectorAll('.msgbox-login-email')[0],
			tmp       = [];

		okBtn.disabled = true;
		okBtn.classList.add('disabled');

		$.each([user, pass], function ( v, i ) {
			tmp.push(0);
			(function cl(idx, elem) {
				$.on(elem, 'input', function ( e ) {
					if ( this.value ) {
						tmp[idx] = 1
					}
					if( /^1+$/g.test( tmp.join('') ) ) {
						okBtn.classList.remove('disabled');
						okBtn.removeAttribute('disabled');
					}
				});
			})(v, i);
		});
	}
	function eventPressed ( list ) {
		if( !list || !list.nodeType || list.nodeType !== 1 || list.nodeType !== 9 || /Mobild/.test(navigator.userAgent) ) return;
		
		$.on(list, 'mousedown', function () {

		})

	}

	function loadDepartment () {
		var selectDepartment = [
			,'<div class="select-form">'
			,'	<div class="sub">'
			,'		<div class="sub-inner-box">'
			,'			<div class="list-group">'
			,' 				{%~it:c:i%}'
			,'				<a href="javascript:;" class="list-group-item" data-catname="{%=c.catname%}">{%=c.name%}</a>'
			,'   			{%~%}'
			,'			</div>'
			,'		</div>'
			,'		<div class="sub-inner-box">'
			,'			<div class="list-group">'
			,' 				{%~it:c:i%}'
			,'				<a href="javascript:;" class="list-group-item" data-catname="{%=c.catname%}">{%=c.name%}</a>'
			,'   			{%~%}'
			,' 				{%~it:c:i%}'
			,'				<a href="javascript:;" class="list-group-item" data-catname="{%=c.catname%}">{%=c.name%}</a>'
			,'   			{%~%}'			
			,'			</div>'
			,'		</div>'
			,'	</div>'
			,'</div>'
		].join('');

		var projectStr;
		var department = function ( str ) {
			$.msgbox({
				title: '选择部门', 
				msg: str,
				type: 'confirm',
				callBack:{
					preInput: function ( ) {
						var body = this.content;
						var subInnerBox = body.querySelectorAll('.sub-inner-box')[0];
						var list = body.querySelectorAll('.select-form')[0];
						var index;
						var tmp = [];


						$.on(list, $.touch_EV.start_EV, function ( e ) {


							
						});
						// this.content.style['maxWidth'] = 'initial'
						// this.content.style['marginRight'] = this.content.style['marginLeft'] = '50px';
						// this.content.style['height'] = '400px'
					},
					okFn: function ( ) {}
				}
			})
		}


	}
	toolNavUser.addEventListener('click', function ( e ) {
		var target = e.target;
		// var msg = $.msgbox();
		
		if( target.classList.contains('login') ) {
			$.msgbox({ 
				title: '用户登录', 
				msg: loginStr,
				type: 'confirm',
				callBack:{
					preInput: function () {
						formVerify( this );
					},

					okFn: function ( ) {
						
						var okBtn     = this.okBtn,
							content   = this.content,
							user      = content.querySelectorAll('.msgbox-login-user')[0],
							pass      = content.querySelectorAll('.msgbox-login-password')[0];
						$.mask.show( true );	
						$.ajax({
							url: '/login',
							type: 'post',
							data: {
								name     : user.value,
								password : pass.value,
							},
							success: function ( data ) {
								if ( data.status == 0 ) {
									$.mask.show( {tipText:'<span style="color:#ff0000">错误:</span>'+ data.msg} );
								} else {
									$.mask.show({tipText: '登陆成功', autoHide: 2000});
								}
							}
						})	
					}
				}
			});

		} else if( target.classList.contains('register') ) {

			$.msgbox({ 
				title: '用户注册', 
				msg: regStr,
				type: 'confirm',
				callBack:{
					preInput: function ( ) {
						formVerify( this );
					},
					okFn: function ( ) {
						var content = this.content,
							user    = content.querySelectorAll('.msgbox-login-user')[0],
							pass    = content.querySelectorAll('.msgbox-login-password')[0],
							email   = content.querySelectorAll('.msgbox-login-email')[0],
							data    = {};

						$.mask.show( true );

						$.ajax({
							url: '/reg',
							type: 'post',
							data: {
								name     : user.value,
								password : pass.value,
								email    : email.value
							},
							success: function ( data ) {
								if( data.status == 1 ) {
									$.mask.show( {tipText:'注册成功', autoHide: 2000} );
								}
							}
						});
					}
				}
			});

		} else if( target.classList.contains('select-project') ) {
			// loadDepartment();
		} else if( target.classList.contains('create-doc') ) {
			

		} else if( target.classList.contains('edit-doc') ) {
			

		}
	}, false);	

	
	$.on(selectDep, 'change', function ( e ) {
		var v = this.value
		if( v ) {
			$.ajax({
				url: '/project',
				type: 'post',
				data: {
					department: v
				},
				success: function ( data ) {
					var i = 0;
					var oData = data.result;
					
					if ( !data.status ) {
						$.msgbox({
							msg: '暂无项目, 是否立即创建',
							type: 'confirm',
							callBack: {
								okFn: function () {
									window.location = 'http://127.0.0.1:3000/create'
								}
							}
						})
					}
				}
			})			
		}
	})

	$.on(selectPro, 'change', function () {

	})
	


	nav.addEventListener('click', function ( e ) {
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
			
			// addIframeSrc(li.children[0].href);
			if( parent.id ) {
				add( li );
			} else {
				add( li, parent );
			}
		}
	}, false);


	if ( createProject ) {
		createProject.addEventListener('submit', function ( e ){
			e.preventDefault();
			console.log( e )
		}, false);
	}
}, false);