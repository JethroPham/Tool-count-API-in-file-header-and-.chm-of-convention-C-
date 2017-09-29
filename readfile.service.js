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
				dfd.reject("The error occurrent when read file");
			}
		}
		reader.readAsText(file);
		return dfd.promise;
	}
	
	function processData(data, fileName) {
		var result = [];
		var str = "";
		var funcs = fileName == "h" ? data.replace(/(?:((["'])(?:(?:\\\\)|\\\2|(?!\\\2)\\|(?!\2).|[\n\r])*\2)|(\/\*(?:(?!\*\/).|[\n\r])*\*\/)|(\/\/[^\n\r]*(?:[\n\r]+|$))|((?:=|:)\s*(?:\/(?:(?:(?!\\*\/).)|\\\\|\\\/|[^\\]\[(?:\\\\|\\\]|[^]])+\])+\/))|((?:\/(?:(?:(?!\\*\/).)|\\\\|\\\/|[^\\]\[(?:\\\\|\\\]|[^]])+\])+\/)[gimy]?\.(?:exec|test|match|search|replace|split)\()|(\.(?:exec|test|match|search|replace|split)\((?:\/(?:(?:(?!\\*\/).)|\\\\|\\\/|[^\\]\[(?:\\\\|\\\]|[^]])+\])+\/))|(<!--(?:(?!-->).)*-->))/g,'').replace(/\n+/g, '\n').split("\n").filter(function(e) {return e.indexOf("(") > 0 || e.indexOf(")") > 0}) : $(data).text().replace(/(?:((["'])(?:(?:\\\\)|\\\2|(?!\\\2)\\|(?!\2).|[\n\r])*\2)|(\/\*(?:(?!\*\/).|[\n\r])*\*\/)|(\/\/[^\n\r]*(?:[\n\r]+|$))|((?:=|:)\s*(?:\/(?:(?:(?!\\*\/).)|\\\\|\\\/|[^\\]\[(?:\\\\|\\\]|[^]])+\])+\/))|((?:\/(?:(?:(?!\\*\/).)|\\\\|\\\/|[^\\]\[(?:\\\\|\\\]|[^]])+\])+\/)[gimy]?\.(?:exec|test|match|search|replace|split)\()|(\.(?:exec|test|match|search|replace|split)\((?:\/(?:(?:(?!\\*\/).)|\\\\|\\\/|[^\\]\[(?:\\\\|\\\]|[^]])+\])+\/))|(<!--(?:(?!-->).)*-->))/g,'').replace(/\n+/g, '\n').split("\n").filter(function(e) {return e.indexOf("(") > 0 || e.indexOf(")") > 0});
		
		for(var i = 0; i < funcs.length; i ++) {
			if(!countParentheses(funcs[i])) {
				str = funcs[i] + funcs[i+1];
				funcs.splice(1,1);
				if(!countParentheses(str)) {
					str+=funcs[i+1];
					funcs.splice(1,1);
				}
			}else if(countParentheses(funcs[i])){
				str = funcs[i];
			}
			var removeSpace = _.trim(str.replace(/[\{\}]/g, "").replace(/\s\s+/g, ' '));
			var customizeStr = removeSpace.slice(0, _.findLastIndex(removeSpace, function(os) {return os == ")"}) + 1);
			if(!(_.get(customizeStr.match(/#pragma/g), "length") > 0)) {
				result.push(customizeStr);
			}			
		}
		return _.uniq(result);
	}
	
	/*function executeString(funcs) {
		var str = ""
		var alls = [];
		for(var i = 0; i < funcs.length; i ++) {
			if(!countParentheses(funcs[i])) {
				str = funcs[i] + funcs[i+1];
				funcs.splice(1,1);
				if(!countParentheses(str)) {
					str+=funcs[i+1];
					funcs.splice(1,1);
					// if(!countParentheses(str)) {
						// str+=funcs[i+3];
						// if(!countParentheses(str)) {
							// str+=funcs[i+4];
						// }
					// }
				}
			}else {
				str = funcs[i];
			}
			alls.push(str);
		}
		return alls;
	}*/
	
	function countParentheses(strs) {
		var _return = false;
		var iObject = {};
		var pOpen = 0, pClose = 0;
		_.forEach(strs, function(str) {
			if(str === "(") {
				pOpen +=1;
			}else if(str === ")") {
				pClose +=1;
			}
		})
		_return = pOpen == pClose && pOpen !=0;
		return _return;
	}
	
	//backup 01/09/2017
	// function processData(data) {
		// var result = [];
		// var allfuncs = [];
		// var funcs = data.replace(/(?:((["'])(?:(?:\\\\)|\\\2|(?!\\\2)\\|(?!\2).|[\n\r])*\2)|(\/\*(?:(?!\*\/).|[\n\r])*\*\/)|(\/\/[^\n\r]*(?:[\n\r]+|$))|((?:=|:)\s*(?:\/(?:(?:(?!\\*\/).)|\\\\|\\\/|[^\\]\[(?:\\\\|\\\]|[^]])+\])+\/))|((?:\/(?:(?:(?!\\*\/).)|\\\\|\\\/|[^\\]\[(?:\\\\|\\\]|[^]])+\])+\/)[gimy]?\.(?:exec|test|match|search|replace|split)\()|(\.(?:exec|test|match|search|replace|split)\((?:\/(?:(?:(?!\\*\/).)|\\\\|\\\/|[^\\]\[(?:\\\\|\\\]|[^]])+\])+\/))|(<!--(?:(?!-->).)*-->))/g,"").replace(/[{}\r?\n|\r]/g,' ').replace(/\s\s+/g, '$').replace(/\w+\s+\(.*?\)/g, "").replace(/;/g, '').split("$").filter(function(e) {return _.get(e.match(/\((.*?)\)/g), "length") > 0});
		// _.forEach(funcs,function(func) {
			// allfuncs.push(_.last(func.replace(/ *\([^)]*\) */g, "").split(" ")));
		// });
		
		// var clstructs = data.replace(/(?:((["'])(?:(?:\\\\)|\\\2|(?!\\\2)\\|(?!\2).|[\n\r])*\2)|(\/\*(?:(?!\*\/).|[\n\r])*\*\/)|(\/\/[^\n\r]*(?:[\n\r]+|$))|((?:=|:)\s*(?:\/(?:(?:(?!\\*\/).)|\\\\|\\\/|[^\\]\[(?:\\\\|\\\]|[^]])+\])+\/))|((?:\/(?:(?:(?!\\*\/).)|\\\\|\\\/|[^\\]\[(?:\\\\|\\\]|[^]])+\])+\/)[gimy]?\.(?:exec|test|match|search|replace|split)\()|(\.(?:exec|test|match|search|replace|split)\((?:\/(?:(?:(?!\\*\/).)|\\\\|\\\/|[^\\]\[(?:\\\\|\\\]|[^]])+\])+\/))|(<!--(?:(?!-->).)*-->))/g,"").replace(/[{}\r?\n|\r]/g,' ').replace(/\s\s+/g, '$').replace(/\w+\s+\(.*?\)/g, "").replace(/;/g, '').split("$").filter(function(e) {return  _.get(e.match(/class | struct/g), "length") > 0})
		// var allct = [];
		// _.forEach(clstructs, function(ct) {
			// allct.push(_.last(ct.split(" ")));
		// });
		// var filter = [];
		// _.forEach(funcs, function(fun) {
			// if(_.get(fun.match(/operator/g), "length") == null && _.get(fun.match(/~/g), "length") == null && _.get(fun.match(/#if/g), "length") == null && _.get(fun.match(/#define/g), "length") == null && fun !=fun.toUpperCase() && _.get(fun.match(/#pragma/g), "length") == null) {
				// filter.push(fun.slice(0, fun.indexOf("(")));
			// }
		// });
		
		// result = _.pullAll(_.union(_.uniq(allct), _.uniq(filter)), _.uniq(allct))
		
		// return result;
	// }
	return _return;
});
