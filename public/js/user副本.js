(function (){
	var doc = document,
		toolNavUser   = doc.getElementById('tool-nav-user');

	var loginStr = [
		,'<div class="msgbox-login">'
		,'	<div class="">'
		,'		用户名: <input type="text" name="user" class="msgbox-login-user name" required>'
		,'	</div>'
		,'	<div class="">'
		,'		密　码: <input type="password" name="password" class="msgbox-login-password pass" required>'
		,'	</div>'
		,'</div>'
	].join('');
	var regStr = [
		,'<div class="msgbox-login">'
		,'	<div class="">'
		,'		用户名: <input type="text" name="user" class="msgbox-login-user" required>'
		,'	</div>'
		,'	<div class="">'
		,'		密　码: <input type="password" name="password" class="msgbox-login-password" required>'
		,'	</div>'
		,'	<div class="">'
		,'		邮　箱: <input type="mail" name="email" class="msgbox-login-email">'
		,'	</div>'
		,'</div>'
	].join('');
	function formVerify ( obj ) {
		var okBtn     = obj.okBtn,
			content   = obj.content,
			user      = content.querySelectorAll('.msgbox-login-user')[0],
			pass      = content.querySelectorAll('.msgbox-login-password')[0],
			email     = content.querySelectorAll('.msgbox-login-email')[0],
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
	function loginHandle () {
		$.ui.msgbox({ 
			title: '用户登录', 
			msg: loginStr,
			type: 'confirm',
			callBack:{
				preInput: function () {},
				okFn: function ( ) {
					var okBtn     = this.okBtn,
						content   = this.content,
						user      = content.querySelectorAll('.msgbox-login-user')[0],
						pass      = content.querySelectorAll('.msgbox-login-password')[0];
					$.ui.mask.show( true );	
					$.ajax({
						url: '/login',
						type: 'post',
						data: {
							name     : user.value,
							password : pass.value,
						},
						success: function ( data ) {
							if ( data.status == 0 ) {
								$.ui.mask.show( {tipText:'<span style="color:#fff;">错误:</span>'+ data.msg, autoHide: 3000} );
							} else {
								// document.documentElement.setAttribute('data-user', data.result[0]._id.toString())
								$.ui.mask.show({
									tipText: '登陆成功', 
									autoHide: 2000,
									showCallBack: function () {
										// var logIn =   $('.login-btn-style'),
										// 	log   =   $('.permission-out');
										// logIn[0].removeAttribute('hidden');
										// log[0].setAttribute('hidden', 'true');
										window.location.reload();
									}
								});
							}
						}
					})	
				}
				,cancelFn: function () {
					window.location.reload();
				}
			}
		});
	}
	function registerHandle() {
		$.ui.msgbox({ 
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

					$.ui.mask.show( true );

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
								// document.documentElement.setAttribute('data-user', data.result[0]._id.toString())
								$.ui.mask.show( {
									tipText:'注册成功', 
									autoHide: 2000,
									showCallBack: function () {
										// var logIn =   $('.login-btn-style'),
										// log   =   $('.permission-out');
										// logIn[0].removeAttribute('hidden');
										// log[0].setAttribute('hidden', 'true');
										window.location.reload();
									}
								});
							} else {
								$.ui.mask.show( {tipText:'<span style="color:#ff0000">错误:</span>'+ data.msg, autoHide: 3000} );
							}
						}
					});
				}
				,cancelFn: function () {
					window.location.reload();
				}
			}
		});		
	}
	window.registerHandle = registerHandle;
	window.loginHandle    = loginHandle;

	// 顶部 登陆 注册 用户 按钮事件
	toolNavUser.addEventListener('click', function ( e ) {
		var target = e.target;
		// var msg = $.ui.msgbox();
		if( target.classList.contains('login') ) {
			loginHandle();
		} else if( target.classList.contains('register') ) {
			registerHandle();
		} else if( target.classList.contains('btn-logout') ) {
			$.ajax({
				url: '/logout',
				type: 'get',
				dataType: 'json',
				success: function ( data ) {
					if( data.status ) {
						window.location.reload()
					}
				}
			})
		}
	}, false);
})();