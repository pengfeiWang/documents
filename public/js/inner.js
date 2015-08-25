(function () {
	var preview = document.getElementById('preview');
	if( window.sideHand )	{
		window.sideHand();
	}
	hljs.initHighlightingOnLoad();
	var pre = preview.getElementsByTagName('pre');
	if( pre && window.hlig)  {
		window.hlig(pre);
	}	
})(window);