app.filter('fomatSize', function() {
	return function(size, fmSize) {
		if(size) {
			return _.floor(_.divide(_.divide(size, 1024), 1024), 2).toString() + fmSize;
		}else {
			return "NA";
		}
	}
});