app.filter('fomatDate', function() {
	return function(date, formatDate) {
		if(date) {
			return moment().format(formatDate);
		}else {
			return "N/A";
		}
	}
});