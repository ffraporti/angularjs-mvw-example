var DesafioApp = angular.module("DesafioApp", []);

DesafioApp.controller("DesafioCtrl", function($scope, $http){
	$scope.appconstants = {
		SOURCE_URL: "http://jsonplaceholder.typicode.com/comments"
	};

	$scope.variables = {
		postsLoading: true,
		postsLoadError: false,
		postsNotFoundError: false,
		posts: {},
		hiddenPostsList: {},
		idToSearch: ""
	};
	
	/*
	** Loads all the posts from source URL
	*/
	$scope.getPosts = function() {
		$http.get($scope.appconstants.SOURCE_URL).then( function(response) {
			
			if( response.status == 200 ) {
				$scope.variables.postsLoadError = false;

				response.data.forEach(function(post) {

					if(!$scope.variables.posts[post.postId]) {
						$scope.variables.posts[post.postId] = {
							id: post.postId,
							activeContent: false,
							comments: []
						};
					}

					$scope.variables.posts[post.postId].comments.push(post);

				});

				$scope.variables.postsLoading = false;
			} else {
				$scope.variables.postsLoading = false;
				$scope.variables.postsLoadError = true;
			}
		});
	}

	$scope.onPostClick = function(post) {
		post.activeContent = !post.activeContent;
	}

	$scope.onUpdateClick = function() {
		$scope.getPosts();
		$scope.variables.postsLoading = true;
		$scope.variables.postsLoadError = false;
		$scope.variables.posts = {};
		$scope.variables.hiddenPostsList = {};
		$scope.variables.idToSearch = "";
	}

	/**
	* Simple search of Ids, this method reorganizes what is shown on the list
	**/
	$scope.onSearchKeyUp = function() {
		
		if($scope.variables.idToSearch.length > 0) {
			for(var postId in $scope.variables.posts) {
				if(postId != $scope.variables.idToSearch) {
					$scope.variables.hiddenPostsList[postId] = $scope.variables.posts[postId];
					$scope.variables.posts[postId] = null;
					delete $scope.variables.posts[postId];
				}
			}
			for(var postId in $scope.variables.hiddenPostsList) {
				if(postId == $scope.variables.idToSearch) {
					$scope.variables.posts[postId] = $scope.variables.hiddenPostsList[postId];
					$scope.variables.hiddenPostsList[postId] = null;
					delete $scope.variables.hiddenPostsList[postId];
				}
			}			
		} else {
			for(var postId in $scope.variables.hiddenPostsList) {
				$scope.variables.posts[postId] = $scope.variables.hiddenPostsList[postId];
				$scope.variables.hiddenPostsList[postId] = null;
				delete $scope.variables.hiddenPostsList[postId];
			}
		}

		if( Object.keys($scope.variables.posts).length == 0 )
			$scope.variables.postsNotFoundError = true;
		else
			$scope.variables.postsNotFoundError = false;
	}

	/**
	**	Initialize data
	**/
	$scope.getPosts();
});