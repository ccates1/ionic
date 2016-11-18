angular.module('app.routes', ['ui.router', 'ngMessages', 'satellizer', 'angularMoment', 'ngMaterial'])

.config(function($ionicConfigProvider, $stateProvider, $urlRouterProvider, $authProvider, $ionicConfigProvider) {
  $ionicConfigProvider.views.maxCache(0);
  $stateProvider
  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    controller: 'mainTabsCtrl',
    abstract:true
  })

  .state('tabsController.home', {
    url: '/home',
    views: {
      'tab1': {
        templateUrl: 'templates/home.html'
      }
    }
  })

  .state('tabsController.contestLobby', {
    url: '/contestLobby',
    views: {
      'tab2': {
        templateUrl: 'templates/contestLobby.html',
        controller: 'contestLobbyCtrl'
      }
    }
  })

  .state('tabsController.leaderboard', {
    url: '/leaderboard',
    views: {
      'tab3': {
        templateUrl: 'templates/leaderboard.html',
        controller: 'leaderboardCtrl'
      }
    }
  })

  .state('tabsController.profile', {
    url: '/profile',
    views: {
      'tab4': {
        templateUrl: 'templates/profile.html',
        controller: 'profileCtrl'
      }
    }
  })

  .state('logout', {
    url: '/logout',
    template: null,
    controller: 'logoutCtrl'
  })

  .state('tabsController.contest', {
    url: '/contests/{id}',
    views: {
      'tab2':{
        templateUrl: 'templates/contests.html',
        controller: 'contestCtrl'
      }
    },
    resolve: {
      contest: [
        '$stateParams', 'Contests',
        function($stateParams, Contests) {
          return Contests.get($stateParams.id);
        }]
    }
  })

  .state('tabsController.contest.post', {
    url: '/posts/:postId',
    templateUrl: 'templates/contestPost.html',
    controller: 'postCtrl',
    resolve: {
      post: [
        '$stateParams', 'Contests', 'contest',
        function($stateParams, Contests, contest) {
          return Contests.getPost(contest._id, $stateParams.postId);
        }
      ]
    }
  });
  $urlRouterProvider.otherwise('/page1/home')
});
