angular.module('app.controllers', ['ui.router'])

.controller('mainTabsCtrl', function($scope, $timeout, $auth, $location, $ionicHistory, $ionicPopup, $ionicLoading) {
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $timeout(function() {
        $ionicLoading.hide();

        $scope.isAuthenticated = function() {
            return $auth.isAuthenticated();
        };
        $scope.test = function() {
            $ionicHistory.goBack();
        };
    }, 2000);
})

.controller('loginCtrl', function($scope, $auth, $location) {
    $scope.login = function() {
        $scope.user = {};
        $auth.login($scope.user)
            .then(function(response) {
                alert('Login Success');
                $location.path('/#');
            })
            .catch(function(err) {
                console.log(err);
                alert('Problem');
            });
    };
})

.controller('homeCtrl', function($scope, $timeout, $http, Account, $auth, $ionicPopup, $ionicModal, $location, $ionicLoading, IonicClosePopupService) {
    $scope.noEmailorUsername = false;
    $scope.noUsername = false;
    $scope.user = {};

    $scope.getProfile = function() {
        Account.getProfile()
            .then(function(response) {
                $scope.user = response.data;
                console.log(response.data);

            });
    };

    $scope.isAuthenticated = function() {
        return $auth.isAuthenticated();
    };

    $scope.link = function(provider) {
        $auth.link(provider)
            .then(function() {
                $ionicPopup.alert({
                    title: 'Success',
                    content: 'You have successfully linked an account'
                });
            })
            .catch(function() {
                $ionicPopup.alert({
                    title: 'Error',
                    content: 'We could not link the account'
                });
            });
    };

    $scope.unlink = function(provider) {
        $auth.unlink(provider)
            .then(function() {
                $ionicPopup.alert({
                    title: 'Success',
                    content: 'You have successfully unlinked your account'
                });
                $scope.getProfile();
            })
            .catch(function() {
                $ionicPopup.alert({
                    title: 'Error',
                    content: 'We could not unlink the account at this time'
                });
            });
    };

    $ionicModal.fromTemplateUrl('modalLogin.html', {
        id: '1',
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal1 = modal;
    });
    $ionicModal.fromTemplateUrl('modalRegister.html', {
        id: '2',
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal2 = modal;
    });
    $scope.openModal = function(index) {
        if (index == 1) {
            $scope.modal1.show();
        } else {
            $scope.modal2.show();
        }
    };
    $scope.closeModal = function(index) {
        if (index == 1) {
            $scope.modal1.hide();
        } else {
            $scope.modal2.hide();
        }
    };
    $scope.login = function() {
        if (!$scope.user.email) {
            $ionicPopup.alert({
                title: 'Error',
                content: 'Must enter a valid email address!'
            });
        } else if (!$scope.user.password) {
            $ionicPopup.alert({
                title: 'Error',
                content: 'Must enter a valid password!'
            });
        } else {
            $auth.login($scope.user)
                .then(function(response) {
                    $scope.closeModal(1);
                })
                .catch(function(err) {
                    $ionicPopup.alert({
                        title: 'Error',
                        content: 'Invalid credentials'
                    });
                });
        }
    };
    $scope.register = function() {
        if (!$scope.user.email) {
            $ionicPopup.alert({
                title: 'Error',
                content: 'Must enter a valid email address!'
            });
        } else if (!$scope.user.password) {
            $ionicPopup.alert({
                title: 'Error',
                content: 'Must enter a valid password!'
            });
        } else if (!$scope.user.displayName) {
            $ionicPopup.alert({
                title: 'Error',
                content: 'Must enter a valid username!'
            });
        } else {
            $auth.signup($scope.user)
                .then(function(response) {
                    $auth.setToken(response);
                    $scope.closeModal(2);
                })
                .catch(function(response) {
                    $ionicPopup.alert({
                        title: 'Error',
                        content: 'Invalid credentials'
                    });
                });
        }
    };

    $scope.$on('$destroy', function() {
        $scope.modal1.remove();
        $scope.modal2.remove();
    });

    if ($auth.isAuthenticated() === true) {
        $scope.getProfile();
    }

})



.controller('contestLobbyCtrl', function($scope, $ionicModal, $ionicTabsDelegate, $auth, $ionicPopup, Contests, $stateParams, $ionicLoading, $timeout, IonicClosePopupService) {

        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        $timeout(function() {
            $ionicLoading.hide();

            $scope.activeTag = "all";
            $scope.selectedTag = "all";
            $scope.tags = [{
                name: "MLB",
                count: 0
            }, {
                name: "NBA",
                count: 0
            }, {
                name: "NFL",
                count: 0
            }, {
                name: "NCAAF",
                count: 0
            }, {
                name: "NCAAM",
                count: 0
            }];
            $scope.getAll = function() {
                $scope.contests = [];
                $scope.selectedContest = [];
                var currentTime = moment();
                var unixCurrentTime = currentTime.unix() * 1000;
                Contests.getAll()
                    .then(function(response) {
                        $scope.allContests = response.data;
                        angular.forEach($scope.allContests, function(contest) {

                            unixContestStartDate = Date.parse(contest.start);
                            if (contest.isChecked === false && unixContestStartDate > unixCurrentTime) {
                                $scope.contests.push(contest);
                            }
                        });
                        angular.forEach($scope.contests, function(contest) {
                            if (contest.tags.indexOf("MLB") != -1) {
                                $scope.tags[0].count++;
                            }
                        });
                    })
                    .catch(function() {
                        $ionicPopup.alert({
                            title: 'Error',
                            content: 'Could not retrieve the contest list at this time'
                        });
                    });
            };
            $scope.isAuthenticated = function() {
                return $auth.isAuthenticated();
            };

            $scope.setTag = function(tag) {
                $scope.selectedTag = tag;
            };
            $scope.getTag = function(tag) {
                $scope.activeTag = tag;
            };
            $ionicModal.fromTemplateUrl('modalLogin.html', {
                id: '1',
                scope: $scope,
                backdropClickToClose: false,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal1 = modal;
            });
            $ionicModal.fromTemplateUrl('modalRegister.html', {
                id: '2',
                scope: $scope,
                backdropClickToClose: false,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal2 = modal;
            });
            $scope.openModal = function(index) {
                if (index == 1) {
                    $scope.modal1.show();
                } else {
                    $scope.modal2.show();
                }
            };
            $scope.closeModal = function(index) {
                if (index == 1) {
                    $scope.modal1.hide();
                } else {
                    $scope.modal2.hide();
                }
            };
            $scope.login = function() {
                $scope.user = {};
                if (!$scope.user.email) {
                    $ionicPopup.alert({
                        title: 'Error',
                        content: 'Must enter a valid email address!'
                    });
                } else if (!$scope.user.password) {
                    $ionicPopup.alert({
                        title: 'Error',
                        content: 'Must enter a valid password!'
                    });
                } else {
                    $auth.login($scope.user)
                        .then(function(response) {
                            $scope.closeModal(1);
                            $ionicPopup.alert({
                                title: 'Success',
                                content: 'You have been successfully logged in!'
                            });
                        })
                        .catch(function(err) {
                            $ionicPopup.alert({
                                title: 'Error',
                                content: 'Invalid credentials'
                            });
                        });
                }
            };
            $scope.register = function() {
                $scope.user = {};
                if (!$scope.user.email) {
                    $ionicPopup.alert({
                        title: 'Error',
                        content: 'Must enter a valid email address!'
                    });
                } else if (!$scope.user.password) {
                    $ionicPopup.alert({
                        title: 'Error',
                        content: 'Must enter a valid password!'
                    });
                } else if (!$scope.displayName) {
                    $ionicPopup.alert({
                        title: 'Error',
                        content: 'Must enter a valid username!'
                    });
                } else {
                    $auth.signup($scope.user)
                        .then(function(response) {
                            $auth.setToken(response);
                            $scope.closeModal(2);
                            $ionicPopup.alert({
                                title: 'Success',
                                content: 'You have been successfully registered!'
                            });
                        })
                        .catch(function(response) {
                            $ionicPopup.alert({
                                title: 'Error',
                                content: 'Invalid credentials'
                            });
                        });
                }
            };
                var filterBarInstance;

    function getItems () {
      var items = [];
      for (var x = 1; x < 2000; x++) {
        items.push({text: 'This is item number ' + x + ' which is an ' + (x % 2 === 0 ? 'EVEN' : 'ODD') + ' number.'});
      }
      $scope.items = items;
    }

    getItems();

    $scope.showFilterBar = function () {
      filterBarInstance = $ionicFilterBar.show({
        items: $scope.items,
        update: function (filteredItems, filterText) {
          $scope.items = filteredItems;
          if (filterText) {
            console.log(filterText);
          }
        }
      });
    };

    $scope.refreshItems = function () {
      if (filterBarInstance) {
        filterBarInstance();
        filterBarInstance = null;
      }

      $timeout(function () {
        getItems();
        $scope.$broadcast('scroll.refreshComplete');
      }, 1000);
    };

            $scope.$on('$destroy', function() {
                $scope.modal1.remove();
                $scope.modal2.remove();
            });

            $scope.getAll();

        }, 2000);
    })
    .filter('FilterContests', function() {
        return function(contests, selectedTag) {
            if (!contests) {
                return;
            }
            if (selectedTag === "all") {
                return contests;
            }
            var filteredContests = [];
            var empty = "No contests within the specified range.";

            for (var i = 0; i < contests.length; i++) {
                var contest = contests[i];

                if (!selectedTag || contest.tags.indexOf(selectedTag) != -1) {
                    filteredContests.push(contest);
                }
            }
            return filteredContests;
        };
    })

.controller('leaderboardCtrl', function($scope, $ionicLoading, $auth, $ionicModal, $ionicPopup, Contests, $window, moment, Account, $timeout) {
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $timeout(function() {
        $ionicLoading.hide();

        $scope.sortType = 'rank';
        $scope.sortReverse = false;
        $scope.users = [];
            Account.getAll().then(function(response) {
                var users = response;
                users.forEach(function(user) {
                    $scope.users.push(user);
                });
            });
        $scope.isAuthenticated = function() {
            return $auth.isAuthenticated();
        };
        $scope.checkEmail = function(user) {
            if (user.email !== null) {
                return true;
            }
            return false;
        };
        $scope.openModal = function(user) {
            $scope.user = user;
            $scope.modal.show();
        };
        $ionicModal.fromTemplateUrl('modal.html', {
            scope: $scope,
            animation: 'road-runner'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.numberOfItemsToDisplay = 3;
        $scope.addMoreItems = function(done) {
            if($scope.users.length > $scope.numberOfItemsToDisplay) {
                $scope.numberOfItemsToDisplay += 3;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }
        }

    }, 2000);
})

.controller('profileCtrl', function($scope, $auth, $ionicPopup, Account, Contests, $ionicLoading, $timeout) {
    $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
    });

    $timeout(function() {
        $ionicLoading.hide();
        $scope.showUpdateProfile = false;
        $scope.userPicks = [];

        $scope.getProfile = function() {
            Account.getProfile().then(function(response) {
                $scope.user = response.data;
                console.log(response.data);
                $scope.user.mlb.percentage = ((($scope.user.mlb.correct / $scope.user.mlb.total) || 0).toFixed(2)) * 100;
                $scope.user.nfl.percentage = ((($scope.user.nfl.correct / $scope.user.nfl.total) || 0).toFixed(2)) * 100;
                $scope.user.nba.percentage = ((($scope.user.nba.correct / $scope.user.nba.total) || 0).toFixed(2)) * 100;
                $scope.user.ncaaf.percentage = ((($scope.user.ncaaf.correct / $scope.user.ncaaf.total) || 0).toFixed(2)) * 100;
                $scope.user.ncaam.percentage = ((($scope.user.ncaam.correct / $scope.user.ncaam.total) || 0).toFixed(2)) * 100;

                angular.forEach($scope.user.picks, function(pick) {
                    Contests.getPick(pick).then(function(response) {
                        var temp = response.data;
                        temp.selectedTeams = JSON.stringify(temp.selectedTeams).replace("[", "").replace(/["']/g, "").replace("]", "").replace(/[,]/g, ", ");
                        $scope.userPicks.push(response.data);
                    });
                });
                console.log($scope.userPicks);
            });
        };
        $scope.updateProfile = function() {
            Account.updateProfile($scope.user)
                .then(function() {
                    $ionicPopup.alert({
                        title: 'Success',
                        content: 'Your changes have been submitted'
                    });
                })
                .catch(function() {
                    $ionicPopup.alert({
                        title: 'Error',
                        content: 'Could not submit your profile changes at this time'
                    });
                });
        };
        $scope.link = function(provider) {
            $auth.link(provider)
                .then(function() {
                    $ionicPopup.alert({
                        title: 'Success',
                        content: 'You have successfully linked your account'
                    });
                    $scope.getProfile();
                });
            $ionicPopup.alert({
                title: 'Error',
                content: 'We could not link the account at this time'
            });
        };
        $scope.unlink = function(provider) {
            $auth.unlink(provider)
                .then(function() {
                    $ionicPopup.alert({
                        title: 'Success',
                        content: 'You have successfully unlinked your account'
                    });
                    $scope.getProfile();
                })
                .catch(function() {
                    $ionicPopup.alert({
                        title: 'Error',
                        content: 'We could not unlink the account at this time'
                    });
                    $scope.getProfile();
                });

        };
        $scope.getProfile();
    }, 2000);

})

.controller('logoutCtrl', function($location, $auth, $ionicPopup) {
    if (!$auth.isAuthenticated()) {
        return;
    }
    $auth.logout()
        .then(function() {
            $location.path('page1/home');
        });

})

.controller('contestCtrl', function($scope, $auth, $ionicPopup, Contests, $window, moment, Account, contest, $timeout, $ionicLoading, $ionicModal, IonicClosePopupService) {
    $scope.contest = contest;
    $scope.selectedTeams = [];
    $scope.currentPicks = [];
    $scope.tempWinners = [];
    $scope.winners = [];
    $scope.tempUserPicks = [];
    $scope.ended = false;
    $scope.madePicks = false;
    $scope.contestStarted = false;
    $scope.showContestLeaderboard = false;
    $scope.editUserPicks = false;
    $scope.thereArePicks = false;
    $scope.showPost = false;

    var sendMessage = false;
    var tempUser = $auth.getPayload();
    var count = 0;
    var currentTime = moment();
    var endTime = moment($scope.contest.end);
    var startTime = moment($scope.contest.start);

    $ionicModal.fromTemplateUrl('modalContestLeaderboard.html', {
        id: '1',
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal1 = modal;
    });
    $ionicModal.fromTemplateUrl('modalComments.html', {
        id: '2',
        scope: $scope,
        backdropClickToClose: false,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal2 = modal;
    });
    $scope.openModal = function(index, post) {
        if (index == 1) {
            if ($scope.contestStarted === true) {
                $scope.modal1.show();
            } else {
                $ionicPopup.alert({
                    title: 'Error',
                    content: 'Must wait until the contest beings to view the leaderboard'
                });
            }
        } else {
            Contests.getPost($scope.contest._id, post._id).then(function(res) {
                $scope.post = res;
            });
            $scope.modal2.show();
        }
    };
    $scope.closeModal = function(index) {
        if (index == 1) {
            $scope.modal1.hide();
        } else {
            $scope.modal2.hide();
        }
    };

    $scope.showDeletePost = function(post) {
        if (post.user._id == tempUser.sub) {
            return true;
        }
        return false;
    };
    $scope.showDeleteComment = function(comment) {
        if (comment.user._id == tempUser.sub) {
            return true;
        }
        return false;
    };
    $scope.addPost = function(message) {
        Contests.createPost($scope.contest, {
            contest: $scope.contest,
            title: message,
            user: tempUser.sub
        }).then(function(response) {
            post = response.data;
            $window.location.reload();
        });

        $scope.shouldShowAddNewPostForm = false;
    };

    $scope.addComment = function(message, post) {
        Contests.addComment($scope.contest, post._id, {
            message: message,
            user: tempUser.sub
        }).then(function(response) {
            comment = response.data;
            $window.location.reload();
        });
    };

    $scope.deletePost = function(post) {
        Contests.deletePost($scope.contest, post)
            .success(function() {
                $scope.contest.posts.splice($scope.contest.posts.indexOf(post), 1);
                $ionicPopup.alert({
                    title: 'Success',
                    content: 'You have successfully deleted your post!'
                });
            });
    };
    $scope.deleteComment = function(post, comment) {
        Contests.deleteComment($scope.contest, post, comment)
            .success(function() {
                post.comments.splice(post.comments.indexOf(post), 1);
                $ionicPopup.alert({
                    title: 'Success',
                    content: 'You have successfully deleted your post!'
                });
            });
    };

    $scope.incrementPostUpvotes = function(post) {
        Contests.upvotePost($scope.contest, post);
        if (post.usersWhoUpvoted.indexOf(tempUser.sub) == -1) {
            post.upvotes++;
            post.usersWhoUpvoted.push(tempUser.sub);
            Contests.upvotePost($scope.contest, post);
        } else {
            $ionicPopup.alert({
                title: 'Error',
                content: 'You have already upvoted this post!'
            });
        }
    };
    $scope.incrementCommentUpvotes = function(post, comment) {
        console.log(comment);
        console.log(post);
        Contests.upvoteComment($scope.contest, post, comment);
        if (comment.usersWhoUpvoted.indexOf(tempUser.sub) == -1) {
            comment.upvotes++;
            comment.usersWhoUpvoted.push(tempUser.sub);
            Contests.upvoteComment($scope.contest, post, comment);
        } else {
            $ionicPopup.alert({
                title: 'Error',
                content: 'You have already upvoted this comment!'
            });
        }
    };

    $scope.getPostUpvoteColor = function(post) {
        if (post.upvoteHover || isUpvotedByCurrentUser(post)) {
            return 'text-danger';
        } else {
            return 'text-muted';
        }
    };

    $scope.getPostDownvoteColor = function(post) {
        if (post.downvoteHover || isDownvotedByCurrentUser(post)) {
            return 'text-danger';
        } else {
            return 'text-muted';
        }
    };

    $scope.isPostUpvotedByCurrentUser = function(post) {
        return post.usersWhoUpvoted.indexOf(tempUser.sub) != -1;
    };

    $scope.showAddNewPostForm = function() {
        $scope.shouldShowAddNewPostForm = true;
    };

    $scope.getProfile = function() {
        Account.getProfile()
            .then(function(response) {
                $scope.user = response.data;
            })
            .
        catch(function() {
            $ionicPopup.alert({
                title: 'Error',
                content: 'Could not obtain the user information'
            });
        });
    };

    $scope.isAuthenticated = function() {
        return $auth.isAuthenticated();
    };

    $scope.submitPicks = function(isValid) {
        if (isValid) {
            $scope.buttonDisabled = true;
            angular.forEach($scope.contest.matchups, function(matchup) {
                $scope.selectedTeams.push(matchup.selectedTeam);
            });
            Contests.createEntry(contest._id, {
                contest: $scope.contest,
                user: tempUser.sub,
                selectedTeams: $scope.selectedTeams,
            }).then(function(pick) {

                $scope.contest.picks.push(pick.data);
                $window.location.reload();
            });
            $ionicPopup.alert({
                title: 'Success',
                content: 'You have successfully submitted your picks!'
            });
        } else {
            $ionicPopup.alert({
                title: 'Error',
                content: 'Must make a selection for each matchup'
            });
        }
    };

    $scope.checkPicks = function() {
        if (currentTime.isAfter(endTime) && $scope.contest.isChecked === false) {
            $state.go('/contestLobby');
        } else if (currentTime.isAfter(endTime) && $scope.contest.isChecked === true) {
            // Sort the array of picks for the contest in descending order
            $scope.contest.picks.sort(function(a, b) {
                return parseFloat(b.contestPoints) - parseFloat(a.contestPoints);
            });
        }
    };

    $scope.deletePicks = function() {
        angular.forEach($scope.contest.picks, function(pick) {
            if (pick.user._id == tempUser.sub) {
                Contests.deletePicks(contest._id, pick);
                $scope.madePicks = false;
                $window.location.reload();
                $ionicPopup.alert({
                    title: 'Success',
                    content: 'You have deleted your pick entry'
                });
            }
        });
    };

    $scope.checkPickSet = function(teamName) {
        for (var i = 0; i < $scope.currentPicks.length; i++) {
            if ($scope.currentPicks[i] == teamName) {
                return true;
            }
        }
        return false;
    };

    $scope.checkWinnerSet = function(teamName) {
        for (var i = 0; i < $scope.winners.length; i++) {
            if ($scope.winners[i] == teamName) {
                return true;
            }
        }
        return false;
    };

    $scope.editPicks = function() {
        $scope.editUserPicks = true;
        $scope.buttonDisabled = false;
    };
    $scope.cancel = function() {
        $scope.editUserPicks = false;
    };

    $scope.submitEditPicks = function() {
        angular.forEach($scope.contest.matchups, function(matchup) {
            if (matchup.selectedTeam !== '') {
                $scope.selectedTeams.push(matchup.selectedTeam);
            }
        });
        if ($scope.selectedTeams.length == $scope.contest.matchups.length) {
            angular.forEach($scope.contest.picks, function(pick) {
                if (pick.user._id == tempUser.sub) {
                    Contests.changePicks(contest, pick, {
                        pickSet: $scope.selectedTeams
                    });
                }
            });
            $window.location.reload();
            $ionicPopup.alert({
                title: 'Success',
                content: 'You have successfully edited your pick entry!'
            });
        } else {
            $ionicPopup.alert({
                title: 'Error',
                content: 'Must make a selection for each matchup'
            });
                        console.log('alert');
        }
    };

    $scope.tempFormatEnded = function() {
        angular.forEach($scope.contest.picks, function(pick) {
            pick.selectedTeams = JSON.stringify(pick.selectedTeams).replace("[", "").replace(/["']/g, "").replace("]", "").replace(/[,]/g, ", ");
        });
    };

    // Check if current time is after end time
    if (currentTime.isAfter(endTime)) {
        $scope.ended = true;
        $scope.isNotEnded = false;
        if ($scope.contest.isChecked === true && $scope.contest.picks.length > 0) {
            // Trim the selectedTeams for each user within the contest leaderboard
            angular.forEach($scope.contest.picks, function(pick) {
                pick.selectedTeams = JSON.stringify(pick.selectedTeams).replace("[", "").replace(/["']/g, "").replace("]", "").replace(/[,]/g, ", ");
            });
            // Get the winners list even though the calculations have already been made (viewing purposes)
            Contests.getWinners().success(function(data) {
                $scope.tempWinners = data.contests;
                angular.forEach($scope.tempWinners, function(tempWinner) {
                    if (tempWinner.id == $scope.contest.id) {
                        angular.forEach(tempWinner.winners, function(winner) {
                            $scope.winners.push(winner);
                        });
                    }
                });
            });
        }
    }

    if ($scope.ended !== true) {
        angular.forEach($scope.contest.picks, function(pick) {
            if (pick.user._id == tempUser.sub) {
                $scope.madePicks = true;
                angular.forEach(pick.selectedTeams, function(selectedTeam) {
                    $scope.currentPicks.push(selectedTeam);
                });
            }
        });
    }

    if (currentTime.isAfter(startTime)) {
        $scope.madePicks = true;
        $scope.buttonDisabled = true;
        $scope.showContestLeaderboard = true;
        $scope.makeAvailable = true;
        $scope.contestStarted = true;
    }

    if (currentTime.isAfter(startTime) && currentTime.isBefore(endTime)) {
        $scope.isNotEnded = true;
        angular.forEach($scope.contest.picks, function(pick) {
          pick.selectedTeams = JSON.stringify(pick.selectedTeams).replace("[", "").replace(/["']/g, "").replace("]", "").replace(/[,]/g, ", ");
        });
    }

    if ($scope.contest.picks.length > 0) {
        $scope.thereArePicks = true;
        angular.forEach($scope.contest.picks, function(pick) {

            angular.forEach($scope.contest.matchups, function(matchup) {
                if (pick.selectedTeams.indexOf(matchup.homeTeam) != -1) {
                    matchup.percentPickedHome++;
                }
                if (pick.selectedTeams.indexOf(matchup.awayTeam) != -1) {
                    matchup.percentPickedAway++;
                }
            });
        });

        angular.forEach($scope.contest.matchups, function(matchup) {
            matchup.percentPickedHome = ((matchup.percentPickedHome / $scope.contest.picks.length) * 100).toFixed(1);
            matchup.percentPickedAway = ((matchup.percentPickedAway / $scope.contest.picks.length) * 100).toFixed(1);
        });
    }

    if ($auth.isAuthenticated()) {
        $scope.getProfile();
    }

    var incrementValue = 0;
    var checkValue = [];

    $scope.incrementProgress = function(id) {
        if (checkValue.length !== 0) {
            for (var i = 0; i < checkValue.length; i++) {
                if (id == checkValue[i]) {
                    return;
                }
            }
        }
        checkValue.push(id);

        incrementValue++;
        var percent = ((incrementValue / $scope.contest.numberOfMatchups) * 100);
        $('.progress-bar').css({
            width: percent + '%'
        });
        $('.progress-bar').text("Pick " + incrementValue + " of " + $scope.contest.numberOfMatchups + " Made!");
    };
});