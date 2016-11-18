angular.module('app.services', ['ngResource'])

.factory('Contests', function($http) {

    return {
        getAll: function() {
            return $http.get("http://192.168.1.13:3198/contests");
        },
        get: function(id) {
            return $http.get("http://192.168.1.13:3198/contests/" + id).then(function(res) {
                return res.data;
            });
        },
        createEntry: function(id, pick) {
            return $http.post("http://192.168.1.13:3198/contests/" + id + "/picks", pick);
        },
        deletePicks: function(id, pick) {
            return $http.delete("http://192.168.1.13:3198/contests/" + id + "/picks/" + pick._id);
        },
        getWinners: function(id) {
            return $http.get("http://192.168.1.13:3198/contests/contestWinners.json");
        },
        getPick: function(id) {
            return $http.get("http://192.168.1.13:3198/picks/" + id);
        },
        changePicks: function(contest, pick, pickSet) {
            return $http.put("http://192.168.1.13:3198/contests/" + contest._id + "/picks/" + pick._id + "/edit", pickSet);
        },
        createPost: function(contest, post) {
            return $http.post("http://192.168.1.13:3198/contests/" + contest._id + "/posts", post);
        },
        deletePost: function(contest, post) {
            return $http.delete("http://192.168.1.13:3198/contests/" + contest._id + "/posts/" + post._id);
        },
        upvotePost: function(contest, post) {
            return $http.put("http://192.168.1.13:3198/contests/" + contest._id + "/posts/" + post._id + "/upvotePost");
        },
        downvotePost: function(contest, post) {
            return $http.put("http://192.168.1.13:3198/contests/" + contest._id + "/posts/" + post._id + "/downvotePost");
        },
        addComment: function(contest, id, comment) {
            return $http.post("http://192.168.1.13:3198/contests/" + contest._id + "/posts/" + id + "/comments", comment);
        },
        upvoteComment: function(contest, post, comment) {
            return $http.put("http://192.168.1.13:3198/contests/" + contest._id + "/posts/" + post._id + "/comments/" + comment._id + "/upvoteComment");
        },
        downvoteComment: function(contest, post, comment) {
            return $http.put("http://192.168.1.13:3198/contests/" + contest._id + "/posts/" + post._id + "/comments/" + comment._id + "/downvoteComment");
        },
        deleteComment: function(contest, post, comment) {
            return $http.delete("http://192.168.1.13:3198/contests/" + contest._id + "/posts/" + post._id + "/comments/" + comment._id);
        },
        getPost: function(contestId, postId) {
            return $http.get("http://192.168.1.13:3198/contests/" + contestId + "/posts/" + postId).then(function(res) {
                return res.data;
            });
        }

    };
})

.factory('Account', function($http, $auth) {
    return {
        getProfile: function() {
            return $http.get('http://192.168.1.13:3198/api/me');
        },
        updateProfile: function(profileData) {
            return $http.put('http://192.168.1.13:3198/api/me', profileData);
        },
        updatePicture: function(picture) {
            return $http.put('http://192.168.1.13:3198/api/me/editPicture', picture);
        },
        getAll: function() {
            return $http.get('http://192.168.1.13:3198/api/all').then(function(response) {
                var pickPoints = 0;
                var userData = response.data;
                angular.forEach(userData, function(user) {
                    angular.forEach(user.picks, function(pick) {
                        pickPoints += ((pick.contestTotal - pick.contestRank) / (pick.contestTotal)) * 10;
                    })
                    user.totalPoints = (pickPoints + (user.timesFirstPlaceRanking * 0.75) + (user.timesSecondPlaceRanking * 0.190) + (user.timesThirdPlaceRanking * 0.25) || 0).toFixed(2);

                    user.mlb.percentage = (((user.mlb.correct / user.mlb.total) || 0).toFixed(1)) * 100;
                    user.nfl.percentage = (((user.nfl.correct / user.nfl.total) || 0).toFixed(1)) * 100;
                    user.nba.percentage = (((user.nba.correct / user.nba.total) || 0).toFixed(1)) * 100;
                    user.ncaaf.percentage = (((user.ncaaf.correct / user.ncaaf.total) || 0).toFixed(1)) * 100;
                    user.ncaam.percentage = (((user.ncaam.correct / user.ncaam.total) || 0).toFixed(1)) * 100;

                    pickPoints = 0;
                });
                userData.sort(function(a, b) {
                    return parseFloat(b.totalPoints) - parseFloat(a.totalPoints);
                });
                var integer = 0;
                angular.forEach(userData, function(user) {
                    integer++;
                    user.rank = integer;
                });
                return userData;
            });
        },

        getTop: function() {
            return $http.get('http://192.168.1.19:3198/api/all').then(function(response) {
                var pickPoints = 0;
                var userData = response.data;
                angular.forEach(userData, function(user) {
                    angular.forEach(user.picks, function(pick) {
                        pickPoints += ((pick.contestTotal - pick.contestRank) / (pick.contestTotal)) * 10;
                    })
                    user.totalPoints = (pickPoints + (user.timesFirstPlaceRanking * 0.75) + (user.timesSecondPlaceRanking * 0.190) + (user.timesThirdPlaceRanking * 0.25) || 0).toFixed(2);
                    pickPoints = 0;
                });
                var integer = 0;
                angular.forEach(userData, function(user) {
                    integer++;
                    user.rank = integer;
                });
                var result = [];
                for (var i = 0; i <= 4; i++) {
                    if (userData[i] != null) {
                        result.push(userData[i]);
                    }
                }
                return result;
            });
        }
    }
});