document.addEventListener('DOMContentLoaded', function () {
	var doc 	      = document,
		tool 		  = doc.querySelectorAll('.tool')[ 0 ],
		toolSide      = doc.getElementById('tool-side'),
		toolNavUser   = doc.getElementById('tool-nav-user'),
		toolNav       = doc.getElementById('tool-nav'),
		selectDep     = toolNavUser.querySelectorAll('.select-dep')[ 0 ],
		selectPro     = toolNavUser.querySelectorAll('.select-pro')[ 0 ],
		addCategory   = doc.getElementById('add-category'),
		editOk        = doc.getElementById('edit-ok'),
		createDoc     = doc.getElementById('create-doc'),
		editDoc       = doc.getElementById('edit-doc'),
		editCancel    = doc.getElementById('edit-cancel'),
		dataUsrBool   = !!doc.documentElement.getAttribute('data-user');


// navigator.geolocation.getCurrentPosition(function(position){
//     alert(position.coords.latitude+'---'+position.coords.longitude)

// })
// selectPro.disabled = true;
// selectPro.options[0].selected = true;

	function keyEvt (e) {
		if( e.keyCode === 8 ) {
			e.preventDefault();
			return;
		}
	}

	if( window.location.pathname == '/' ){
		editDoc&&editDoc.setAttribute('hidden',true);
		selectPro.disabled = true;
		selectDep.options[0].selected = selectPro.options[0].selected = true;
	}
	function getIfr( id ) {
		var ifr = $('#ifr')[0];
		return id ? ifr.contentWindow.editor : ifr;
	}
	function getLoginUserBool () {
		return doc.documentElement.getAttribute('data-user');
	}
	function reloadTip ( msg, url ) {
		$.ui.mask.show({
			tipText: msg, 
			autoHide: 2000,
			showCallBack: function () {
				if(url){
					window.location.href = url;
					return;
				}
				window.location.reload();
			}
		});
	}

	function createDocument () {

	}
	function rditDocument () {

	}

	// 选择部门
	$.on(selectDep, 'change', function ( e ) {
		var t = this;
		var v = t.value;
		var ifr = getIfr();
		var inp = getIfr('inp');
		selectPro.options[0].selected = true;

		// window.location.href = '/';
		var str = [
			'<option value="">选择文档</option>'
			,'{%~it:c:i%}'
			,'<option value="{%=c._id%}" {%?c.selected%}selected{%?%}>{%=c.name%}</option>'
			,'{%~%}'
		].join('');

		// ifr.src = '/static/inner.html';

		// createDoc.setAttribute('hidden', true);
		// editCancel.setAttribute('hidden', true);
		// editOk.setAttribute('hidden', true);
		// editDoc.setAttribute('hidden', true);

		if( v ) {
			selectPro.removeAttribute('disabled');
			$.ajax({
				url: '/project',
				type: 'post',
				data: {
					departmentId: v
				},
				success: function ( data ) {
					var i = 0;
					var oData = data.result;
					var s = [
						'<div>输入文档名称: <input type="text" name="pro"></div>'
					].join('');		
					if ( !data.status ) {
						$.ui.msgbox({
							msg: '暂无文档, 是否立即创建',
							type: 'confirm',
							callBack: {
								okFn: function () {
									if( data.userName ) {
										$.ui.msgbox({
											title: '创建文档',
											msg: s,
											type: 'confirm',
											callBack: {
												preInput: function ( ) {
													var okBtn     = this.okBtn,
														content   = this.content;
														
													okBtn.disabled = true;
													okBtn.classList.add('disabled');
														
													var inp = content.querySelectorAll('input')[ 0 ];
													this.inp = inp;
													$.on(inp, 'input', function () {
														if( this.value ){
															okBtn.removeAttribute('disabled');
															okBtn.classList.remove('disabled');
														} else {
															okBtn.disabled = true;
															okBtn.classList.add('disabled');
														}
													});
												},
												okFn: function () {
													var doc = this.inp.value;
													var ifr = getIfr();
													var str = '<option>选择文档</option><option value="'+ doc +'" selected>' + doc + '</option>';
													selectPro.innerHTML = str;
													t.disabled = selectPro.disabled = true;

													// $.ajax({
													// 	url: '/status',
													// 	type: 'post',
													// 	data: {},
													// 	dataType: 'json',
													// 	success: function () {

													// 	}
													// })

													createDoc.setAttribute('hidden', true);
													editDoc.setAttribute('hidden', true);

													editCancel.removeAttribute('hidden');
													editOk.removeAttribute('hidden');

													toolSide.setAttribute('hidden', true);
													toolNav = document.getElementById('tool-nav');

													toolNav.innerHTML = '';
													// ifr.src = '/static/inner.html';
													ifr.src = '/static/create.html';

													document.documentElement.setAttribute('data-create-doc', true);

												},
												cancelFn: function () {
													window.location.reload();
												}
											}
										});
									} else {
										$.ui.msgbox({
											msg: '未登录用户不能创建文档',
											type: 'alert',
											callBack: {
												okFn: function () {
													selectPro.options[0].selected = true;
													selectPro.disabled = true;
													t.options[0].selected = true;
													document.documentElement.removeAttribute('data-create-doc');
												}
											}
										})
									}
								},
								cancelFn: function () {
									window.location.reload();
									return;
								}
							}
						})
					} else {						
						var htmlStr = $.doT( str, oData );
						selectPro.removeAttribute('disabled');
						selectPro.innerHTML = htmlStr;
					}
				}
			})			
		} else {
			window.location.reload();
			return;
		}
	});
	// 选择项目
	$.on(selectPro, 'change', function () {
		var dep = selectDep.value;
		var projectId = this.value;
		var ifr = getIfr();
		var inp = getIfr('inp');

		createDoc&&createDoc.setAttribute('hidden', true);
		editCancel&&editCancel.setAttribute('hidden', true);
		editOk&&editOk.setAttribute('hidden', true);
		

		if( dataUsrBool )  {
			editDoc.removeAttribute('hidden');
		}

		if( !dep ) {
			$.ui.msgbox({
				msg:'请选择部门'
			});
			return;
		}
		if( !projectId ) {
			$.ui.msgbox({
				msg: '请选择文档'
			});
			return;
		}


		if ( !!dep && !!projectId ) {
			window.location.href = window.location.origin +'/'+ projectId;	
		}
	});
	
	// 编辑取消按钮 创建取消按钮
	if( editCancel ) {
		$.on( editCancel, $.touch_EV.start_EV, function () {
			var ifr = getIfr();
			var inp = getIfr('inp');

			//  '/static/inner.html'

			var pathname = window.location.pathname;
			var create = document.documentElement.getAttribute('data-create-doc');
			// var edit = document.documentElement.getAttribute('data-editor-doc');

			window.removeEventListener('keydown', keyEvt);
			if( create ) {
				window.location.reload();
			}
			// if ( edit ) {
			// 	window.location.reload();
			// }
			tool.style.display = 'block';

			ifr.src = pathname == '/' ? '/static/inner.html' : '/view' + window.location.pathname  ;

			editDoc.removeAttribute('hidden');
			editCancel.setAttribute('hidden', true);
			editOk.setAttribute('hidden', true);

			selectDep.removeAttribute('disabled');
			selectPro.removeAttribute('disabled');

			document.documentElement.removeAttribute('data-create-doc');
			// document.documentElement.removeAttribute('data-editor-doc');
		});
	}
	// 编辑按钮
	if ( editDoc ) {

		$.on( editDoc, $.touch_EV.start_EV, function () {

			var ifr = getIfr();
			var inp = getIfr('inp');
			
			$.ajax({
				url: '/edit',
				type: 'post',
				data: {projectId: selectPro.value},
				dataType: 'json',
				success: function ( data ) {
					if( data.status ) {
						ifr.src = '/edit' + window.location.pathname;
						window.addEventListener('keydown', keyEvt, false);
						editCancel.removeAttribute('hidden');
						editOk.removeAttribute('hidden');
						editDoc.setAttribute('hidden', true);
						createDoc.setAttribute('hidden', true);
						selectDep.disabled = selectPro.disabled = true;
					} else {
						$.ui.mask.show({tipText:'<span style="color:#fff;">错误:</span>'+ data.msg, autoHide: 3000} );
					}
				}
			});
		});
	}
	// 编辑确认按钮
	if( editOk ) {
		$.on( editOk, $.touch_EV.start_EV, function () {
			var ifr = getIfr();
			var inp = getIfr('inp');
			var create = document.documentElement.getAttribute('data-create-doc');
			var category = document.documentElement.getAttribute('data-doc-category');
			var dep = selectDep.value;
			var doc = selectPro.value;
			var doContent = ifr.contentWindow.editor.session.getValue();

			if( create ) {
				// 创建文档
				$.ajax({
					url  : '/create-project/',
					type : 'post',
					timeout: 2000,
					data : {
						departmentId : dep,
						name         : doc,
						content      : doContent
					},
					success : function ( data ) {
						if ( data.status ) {
							reloadTip(data.msg, data.url);
						} else {
							$.ui.mask.show({
								tipText: data.msg, 
								autoHide: 2000,
								showCallBack: function () {
									window.location.reload();
								}
							});
						}
					}
				});	
			} else {
				// 编辑
				$.ajax({
					url  : '/view/' + doc,
					type : 'post',
					data : {
						projectId : doc, // 项目id
						content   : doContent
					},
					success : function ( data ) {
						if ( data.status ) {
							reloadTip(data.msg, data.url);
						} else {
							$.ui.mask.show({
								tipText: data.msg, 
								autoHide: 2000,
								showCallBack: function () {
									window.location.reload();
								}
							});
						}
					}
				});				
			}
		});
	}
	// 创建文档
	if ( createDoc ) {

		$.on(createDoc, $.touch_EV.start_EV, function () {
			// var slideOld = tool.style.display;
			var depNode = selectDep.innerHTML;
			var s = '<div style="padding-left:5px;"><select>' + depNode + '</select></div>';
			var s2 = [
				'<div style="">'
				,'    <div style="display:flex;align-items:center; margin: 0 0 8px">'
				,'        <div>选择部门:</div>'
				,'        <div>' + s + '</div>'
				,'    </div>'
				,'    <div style="display:flex;align-items:center">'
				,'        <div>文档名称:</div>'
				,'        <div style="padding-left:5px"><input type="text" required /></div>'
				,'    </div>'
				,'</div>'
			].join('');
			// console.log( slideOld )
			// createDoc.setAttribute('hidden', true);
			// tool.style.display = 'none';

			$.ui.msgbox({
				title    : '创建文档',
				type     : 'confirm',
				msg      : s2,
				callBack : {
					preInput: function () {
						var contNode   = this.content;
						var selectNode = contNode.querySelectorAll('select')[0];
						var inputNode  = contNode.querySelectorAll('input')[0];
						var okBtn      = this.okBtn;

						okBtn.disabled = true;
						okBtn.classList.add('disabled');
							
						this.inp = inputNode;
						this.slt = selectNode;

						$.on(inputNode, 'input', function () {
							if( this.value && selectNode.value ){
								okBtn.removeAttribute('disabled');
								okBtn.classList.remove('disabled');
							} else {
								okBtn.disabled = true;
								okBtn.classList.add('disabled');
							}
						});
						$.on(selectNode, 'change', function () {
							if( this.value && inputNode.value ){
								okBtn.removeAttribute('disabled');
								okBtn.classList.remove('disabled');
							} else {
								okBtn.disabled = true;
								okBtn.classList.add('disabled');
							}
						});
					},
					okFn: function () {

						for( var i = 0, len = selectDep.options.length; i < len; i++ ) {
							if( selectDep.options[ i ].value == this.slt.value ) {
								selectDep.options[ i ].selected = true
							}
						}

						var str = '<option>选择文档</option><option value="'+ this.inp.value +'" selected>' + this.inp.value + '</option>';
						selectPro.innerHTML = str;
						
						selectDep.disabled = selectPro.disabled = true;

						createDoc.setAttribute('hidden', true);
						editDoc.setAttribute('hidden', true);

						editCancel.removeAttribute('hidden');
						editOk.removeAttribute('hidden');


						// toolSide.setAttribute('hidden', true);

						toolNav = document.getElementById('tool-nav');
						toolNav.innerHTML = '';

						getIfr().src = '/static/create.html';
						document.documentElement.setAttribute('data-create-doc', true);

					},
					cancelFn: function () {
						// window.location.reload();
					}
				}
			});
		});
	}
	
	
}, false);