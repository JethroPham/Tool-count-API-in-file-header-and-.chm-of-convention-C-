app.filter('fmNameAPIs', function() {
	return function(apis) {
		if(apis) {
			return apis + "()";
		}else {
			return "NA";
		}
	}
});