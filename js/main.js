var app = angular.module('pathFind2016', ['mm.foundation']);

app.controller('CanvasCtrl', function($scope) {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    context.globalAlpha = 1.0;
    context.beginPath();
});