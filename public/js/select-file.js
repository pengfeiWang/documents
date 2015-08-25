	var doc         = document,
		filedir     = doc.getElementById('filedir'),
		file        = doc.getElementById('file')
		toolNavUser = doc.getElementById('tool-nav-user');


	filedir.addEventListener('change', function () {
		console.log(this.value);
		var v = this.value;
		$.ajax({
			url:'http://127.0.0.1:3000/',
			type: 'post',
			data: {
				dir: v
			},
			success: function ( data ) {

			}
		})
	}, false);

