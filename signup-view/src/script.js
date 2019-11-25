var app = angular.module('myApp', []);
  app.controller('AppController', function($scope, $window) {
    
    $scope.email = '';
    $scope.username = '';
    $scope.lastName = '';
    $scope.dateOfBirth = '';
    
    $scope.IsVisible = false;
    $scope.ShowHide = function () {

    $scope.IsVisible = $scope.IsVisible ? false : true;
   }
    
     $scope.ShowConfirm = function () {
          ($window.confirm("Are you sure you want to clear the fields?"))
                      
    };
  });


app.directive("matchPassword", function () {
    return {
        restrict: 'A',
        scope:true,
        require: 'ngModel',
        link: function (scope, elem , attrs,control) {
            var checker = function () {
 
                //get the value of the first password
                var e1 = scope.$eval(attrs.ngModel); 
 
                //get the value of the other password  
                var e2 = scope.$eval(attrs.matchPassword);
                return e1 == e2;
            };
            scope.$watch(checker, function (n) {
 
                control.$setValidity("unique", n);
            });
        }
    };
});