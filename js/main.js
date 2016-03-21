var app = angular.module('pathFind2016', ['mm.foundation']);

app.controller('CanvasCtrl', function($scope) {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    function Node(x, y) {
        this.x = x;
        this.y = y;
        this.siblings = [];
    }
    Node.prototype.addSibling = function(i) {
        this.siblings.push(i);
    }

    $scope.data = [
        new Node(50, 150),
        new Node(100, 150),
        new Node(200, 150),
        new Node(100, 100),
        new Node(200, 100),
        new Node(200, 300),
        new Node(100, 250),
        new Node(200, 250),
    ];

    $scope.data[0].addSibling(1);
    $scope.data[1].addSibling(2);
    $scope.data[3].addSibling(1);
    $scope.data[4].addSibling(2);
    $scope.data[5].addSibling(2);
    $scope.data[6].addSibling(1);
    $scope.data[7].addSibling(1);
    $scope.data[7].addSibling(6);
    $scope.data[4].addSibling(3);

    function drawNode(node) {
        context.beginPath();
        context.arc(node.x, node.y, 5, 0, 2*Math.PI, false);
        context.fillStyle = "#ccddff";
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = "#666666";
        context.stroke();
    }

    function drawConnection(node1, node2, color, width) {
        context.beginPath();
        context.moveTo(node1.x, node1.y);
        context.lineTo(node2.x, node2.y);
        context.strokeStyle = color;
        context.lineWidth = width;
        context.stroke();
    }

    function draw(data) {
        data.forEach(function (node) {
            for(var i=0; i<node.siblings.length; i++) {
                drawConnection(node, data[node.siblings[i]], "black", 20);
            }
        });
        data.forEach(function (node) {
            for(var i=0; i<node.siblings.length; i++) {
                drawConnection(node, data[node.siblings[i]], "#bbccdd", 16);
            }
        });
        data.forEach(drawNode);
    }

    canvas.width = 800;
    canvas.height = 600;
    context.globalAlpha = 1.0;
    context.beginPath();
    draw($scope.data);
});