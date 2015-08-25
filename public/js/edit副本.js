(function (){
	function editJs ( edit, mode ){
		var editor = ace.edit("inp");
		var preview = document.getElementById('preview');
		
		var btnUpImg = document.getElementById('up-img');
		var btnCreateDemo = document.getElementById('create-demo');


		var m = "ace/mode/" + (mode ? mode : 'markdown');
	
		editor.getSession().setMode( m );
		if( mode ) {
			editor.setTheme("ace/theme/monokai");
		} else {
			editor.setTheme("ace/theme/dreamweaver");
		}
		

		editor.setAutoScrollEditorIntoView(true);
		// editor.renderer.setFadeFoldWidgets(true);
		editor.renderer.setShowGutter(!0);
		// editor.getSession().setUseWrapMode(true);
		// editor.setShowFoldWidgets(!0)
		if( mode == 'html' ) {
			editor.setOption("enableEmmet", true);
		}
		// 
		editor.setOption("maxLines", 6000);
		editor.setOption("minLines", 50);


		editor.getSession().setUseWrapMode(!0);
		editor.setShowPrintMargin(!1);
		if( edit == 'edit' ) {
			var tmpSource = document.getElementById('tmp-source');
			editor.getSession().setValue( tmpSource.value );
		}


		window.editor = editor;
		editor.resize(true);

		var renderer = new marked.Renderer();
		renderer.heading = function (text, level) {
		  var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
		  return '<h' + level + ' id="'+text.replace(/\s+/g,'-')+'">'+ text + '</h' + level + '>';
		}

		renderer.link = function(href, title, text) {
			if (this.options.sanitize) {
				try {
					var prot = decodeURIComponent(unescape(href))
						.replace(/[^\w:]/g, '')
						.toLowerCase();
				} catch (e) {
					return '';
				}
				if (prot.indexOf('javascript:') === 0) {
					return '';
				}
			}
			var out = '<a href="' + href + '"';
			if (title) {
				out += ' title="' + title + '"';
			}
			out += ' target="_blank">' + text + '</a>';
			return out;
		};

		renderer.code = function(code, lang, escaped) {
			
			code = code.replace(/\</g, '&lt;').replace(/\>/g,'&gt;');
			if (!lang) {
				return '<pre><code>'
				+ code
				+ '\n</code></pre>';
			}
			
			if( /demo/i.test(lang) ) {
				var title = '查看DEMO请点击';
				var arr = [];
				if(/\:/.test(lang)) {
					arr = lang.split(':');
					title = arr[1];
				}
				return '<a href="javascript:;" data-code="'
					+ escape(code, true)
					+ '">'
					+ title
					+ '\n</a>\n';
			} else {
				return '<pre><code class="'
					+ this.options.langPrefix
					+ escape(lang, true)
					+ '">'
					+ code
					+ '\n</code></pre>\n';
			}

		};
		var bol = false;
		var appWrap;
		if(mode) {			
				var preV =  document.getElementById('preview');
				var subIfr = preV.getElementsByTagName('iframe')[0];
				subIfr.onload = function () {
					editor.on("change", function( e ){
						var html = editor.getSession().getValue();
						subIfr.contentDocument.getElementById('appWrap').innerHTML = html;
					});
				}
		} else {
			editor.on("change", function( e ){
				var html = marked( editor.getSession().getValue(), { renderer: renderer });
				preview.innerHTML = html;
				var pre = preview.getElementsByTagName('pre');
				window.sideHand();
				if( pre && hlig )  {
					hlig( pre );
				}
			});
		}
		editor._signal('change');
		window.sideHand();
		if ( btnCreateDemo && createDemoHandle ) {
			$.on(btnCreateDemo, 'click', function (e) {
				e.preventDefault();
				createDemoHandle()
			});
		}
	};
	window.editJs = editJs;
})();

