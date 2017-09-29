var app = angular.module('myApp', []);

app.controller('myCtrl',['$scope', '$q','readFileData','$window', function($scope,$q, $readFileData,$window) {
		$scope.data = '';
		var fileLengt =[];
		$scope.countAPIs = function(){
			if($scope.validation()) {
				$scope.isCheck = true;
				$scope.apis = [];
				return;
			}

			var promises =[];
			var files = document.getElementById('file').files;

			_.forEach(files, function(file) {
				promises.push($readFileData.mergeWithBothFile(file));
			})
			
			$q.all(promises).then(function(data) {
				var totalApis = [];
				var other = [];
				_.forEach(data, function(oFile) {
				var obj = {};
					_.set(obj, "name", _.get(oFile, "name"));
					_.set(obj, "num", _.get(_.uniq(_.get(oFile, "contents")), "length") > 0 ? _.get(_.uniq(_.get(oFile, "contents")), "length"): 0);
					_.set(obj, "contents", _.uniq(_.get(oFile, "contents")));
					totalApis.push(obj);
					other = _.concat(_.get(obj, "contents"));
				});
				$scope.apis = totalApis;
				$scope.total = other;
			})
		}
		
		$scope.setFiles = function(element) {
			$scope.$apply(function(scope) {
				_.set($scope, "apis", []);
				console.log('files:', element.files);
				scope.files = []
				_.forEach(_.get(element, "files"), function(file) {
					scope.files.push(file)
				});
				fileLengt.push(scope.files);
			});
		};
	
		$scope.getTotalAPIs = function(apis, type) {
			var total = [];
			_.forEach(apis, function(api) {
				total.push(_.get(api, "contents"));
			});
			if(type == "num") {
				results =  _.get(_.uniq(_.flatten(total)), "length");
			}else if(type == "name") {
				results = _.uniq(_.flatten(total));
			}
			return results;
		}
		
		$scope.validation = function() {
			var error = [];
			// if(!_.get($scope, "textQuery")) {
				// error.push({field: "Search API", note: "Required"});
			// }
			if(!_.get(fileLengt, "length") > 0) {
				error.push({field: "Select File(s) need count APIs", note: "Required attach file(s)"});
			}
			_.set($scope, "validates", error);
			if(_.get(error, "length") > 0) {
				return true;
			}else {
				return false;
			}
		}
		
		$scope.go = function() {
			if($scope.password == "14091993"){
				$scope.isCheckPass = true;
			}else {
				confirm("Password incorrect. Please contact the administrator for this help");
			}
		}
}]);