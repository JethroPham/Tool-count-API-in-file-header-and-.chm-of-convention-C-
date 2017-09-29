app.filter('fomatFileName', function() {
	return function(fileName) {
		if(fileName) {
			return fileName.replace(/\.[^/.]+$/, "");
		}else {
			return "NA";
		}
	}
});