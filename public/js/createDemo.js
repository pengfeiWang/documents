function createDemoHandle ( str ) {
	var msg = '<iframe src="/static/create-demo.html" frameborder="0" width="100%" height="100%"></iframe>'
	window.parent.$.msgbox({
		title: '创建DEMO',
		type: 'confirm',
		customClass:{
			userClass : 'create-demo-msg'
		},
		callBack: {
			preInput: function () {
				var content = this.content;
				var ifr = content.querySelectorAll('iframe')[0];
				var msgBox = this.msgBox;

				var msgH = msgBox.getBoundingClientRect();
				var msgH2 = msgBox.offsetHeight;
				
				ifr.height = msgH2 + 'px';

				$.on(window, 'resize', function () {
					ifr.height = msgBox.offsetHeight + 'px';
					// var ifrSub =  ifr.contentDocument;
					// console.log(ifr)

				});
			},
			okFn: function () {
				var content = this.content;
				var ifr = content.querySelectorAll('iframe')[0];
				var a = 0;

				var parentEditor = window.editor;
				var thisEditor = ifr.contentWindow.editor;
				var thisEditorVal = thisEditor.getValue();

				var strStart = '```demo\n';
				var strEnd = '\n```\n';

				parentEditor.insert( strStart + thisEditorVal + strEnd )

			}
		},
		msg: msg
	})
}