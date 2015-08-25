(function(w){
	if( !w.hlig ) {
		window.hlig = function ( pre ) {
			for( var i = 0, len = pre.length; i < len; i++ ) {
				(function ( index ) {
					var code = pre[ index ].getElementsByTagName('code'); 
					if(code.length){
						var i = 0;
						for( ; i < code.length; i++ ) {
							code[i]&&hljs.highlightBlock(code[i]);
						}
					}
				})(i); 
			}		
		}		
	}
})(window);
