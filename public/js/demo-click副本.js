(function () {
	var preview = document.getElementById('preview');
	var msg = '<iframe src="/static/view-demo-inner.html" width="100%" frameborder="0"></iframe>';

	preview.addEventListener('click', function (e) {
		
		var target = e.target;
		var code = target.dataset['code'];
		if( target.tagName.toLowerCase() == 'a' &&  !!code ) {
			e.preventDefault();
			if( target.dataset['code'] ) {
				window.parent.$.ui.msgbox({
					title: '',
					customClass:{
						userClass : 'view-demo'
					},
					msg: msg,
					type:'alert',
					callBack: {
						preInput: function () {
							var ifr = this.msgBox.getElementsByTagName('iframe')[0];
							var msgBox = this.msgBox;
							var fn = function () {
								var h = parseInt( window.getComputedStyle(msgBox, false)['height'], 10 );
								var pt = parseInt( window.getComputedStyle(msgBox, false)['paddingTop'], 10 );
								var pb = parseInt( window.getComputedStyle(msgBox, false)['paddingBottom'], 10 );

								ifr.height = (h-pt-pb) + 'px';
							}
							ifr.addEventListener('load', function () {
								var html = unescape(code, true).replace(/&lt;/g, '<').replace(/&gt;/g, '>')
								ifr.contentDocument.getElementById('appWrap').innerHTML = html;
								fn();
							}, false);
							$.on(window, 'resize', function () {
								fn();
							});
						}
					}
				})
			}
		}
		// return false;
	});
})(window);