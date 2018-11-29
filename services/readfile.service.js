app.factory('readFileData', function($q) {
	var _return = {};
	_return.mergeWithBothFile = function(file) {
		var dfd = $q.defer();
		var obj ={};
		_.set(obj, "name", _.get(file, "name"));
		reader = new FileReader();
		reader.onloadend = function(e){
			if(e) {
				_.set(obj, "contents",processData(e.target.result, _.last(obj.name.split("."))));
				dfd.resolve(obj);
			}else {
				dfd.reject("The error occur when read file");
			}
		}
		reader.readAsText(file);
		return dfd.promise;
	}
	
	//regression to get data valid.
	function regression(data) {
		if(data.length < 1){
			return "";
		}else if(data.length >= 1){
			return  _.trim(_.head(data) + regression(_.drop(data)));
		}
	}
	
	function processData(data, fileName) {
		var funcs = fileName == "h" ? data.replace(/(?:((["'])(?:(?:\\\\)|\\\2|(?!\\\2)\\|(?!\2).|[\n\r])*\2)|(\/\*(?:(?!\*\/).|[\n\r])*\*\/)|(\/\/[^\n\r]*(?:[\n\r]+|$))|((?:=|:)\s*(?:\/(?:(?:(?!\\*\/).)|\\\\|\\\/|[^\\]\[(?:\\\\|\\\]|[^]])+\])+\/))|((?:\/(?:(?:(?!\\*\/).)|\\\\|\\\/|[^\\]\[(?:\\\\|\\\]|[^]])+\])+\/)[gimy]?\.(?:exec|test|match|search|replace|split)\()|(\.(?:exec|test|match|search|replace|split)\((?:\/(?:(?:(?!\\*\/).)|\\\\|\\\/|[^\\]\[(?:\\\\|\\\]|[^]])+\])+\/))|(<!--(?:(?!-->).)*-->))/g,'').replace(/\n+/g, '\n').split("\n").filter(function(e) {return (e.indexOf("(") > 0 || e.indexOf(")") > 0) && !_.get(e.match(/#pragma/g), "length") > 0 && !_.get(e.match(/#define/g), "length") > 0 && !_.get(e.match(/#if defined/g), "length") > 0 && !_.get(e.match(/#if !defined/g), "length") > 0 && !_.get(e.match(/return/g), "length") > 0}) : strip_tags(getTextPreTag(data)).indexOf("(") >= 1 ? _.tail(strip_tags(getTextPreTag(data), "").split("\n")) : "";
		return regression(funcs).split(";");
	}
	
	function strip_tags (input, allowed) {
	  allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
	  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
	  return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
		return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
	  });
	}
	
	function getTextPreTag(rets) {
		var start = rets.indexOf("<pre");
		var end = rets.indexOf("</pre");
		return rets.substring(start, end).replace(/&nbsp;/g,' ').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');	//conver Special characters in html to char C++ &, *, > <....
	}
	return _return;
});
