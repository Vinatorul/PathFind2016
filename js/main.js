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
        new Node(100, 140),
        new Node(210, 150),
        new Node(105, 90),
        new Node(200, 105),
        new Node(200, 300),
        new Node(100, 250),
        new Node(200, 250),
    ];

    function connect(ind1, ind2) {
        $scope.data[ind1].addSibling(ind2);
        $scope.data[ind2].addSibling(ind1);
    } 

    function drawNode(node) {
        context.beginPath();
        context.arc(node.x, node.y, 9, 0, 2*Math.PI, false);
        context.fillStyle = "#bbccdd";
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = "#black";
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
        for(var i=0; i<data.length; i++) {
            for(var j=0; j<data[i].siblings.length; j++) {
                if (data[i].siblings[j] > i) {
                    drawConnection(data[i], data[data[i].siblings[j]], "#black", 20);
                }
            }
        }
        data.forEach(drawNode);
        for(var i=0; i<data.length; i++) {
            for(var j=0; j<data[i].siblings.length; j++) {
                if (data[i].siblings[j] > i) {
                    drawConnection(data[i], data[data[i].siblings[j]], "#bbccdd", 16);
                }
            }
        }
    }

    connect(0, 1);
    connect(1, 2);
    connect(1, 3);
    connect(2, 4);
    connect(2, 5);
    connect(1, 6);
    connect(6, 7);
    connect(3, 4);

    canvas.width = 800;
    canvas.height = 600;
    context.globalAlpha = 1.0;
    context.beginPath();
    draw($scope.data);
});