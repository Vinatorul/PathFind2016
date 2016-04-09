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
        new Node(205, 150),
        new Node(105, 85),
        new Node(200, 90),
        new Node(200, 300),
        new Node(100, 250),
        new Node(200, 250),
        new Node(280, 255),
        new Node(240, 155),
        new Node(275, 95),
        new Node(274, 75),
        new Node(350, 260),
    ];

    $scope.path = [];

    function connect(ind1, ind2) {
        $scope.data[ind1].addSibling(ind2);
        $scope.data[ind2].addSibling(ind1);
    } 

    function drawNode(node, bgcolor, color) {
        context.beginPath();
        context.arc(node.x, node.y, 9, 0, 2*Math.PI, false);
        context.fillStyle = color;
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = bgcolor;
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

    function draw(data, path) {
        console.log(path);
        for(var i=0; i<data.length; i++) {
            for(var j=0; j<data[i].siblings.length; j++) {
                if (data[i].siblings[j] > i) {
                    var color = "#000000" 
                    drawConnection(data[i], data[data[i].siblings[j]], color, 20);
                }
            }
        }
        data.forEach(function (node) {
            drawNode(node, "#000000", "#bbccdd");
        });
        for(var i=0; i<data.length; i++) {
            for(var j=0; j<data[i].siblings.length; j++) {
                if (data[i].siblings[j] > i) {
                    var color = "#bbccdd" 
                    drawConnection(data[i], data[data[i].siblings[j]], color, 16);
                }
            }
        }

        for(var i=0; i<data.length; i++) {
            for(var j=0; j<data[i].siblings.length; j++) {
                if ((data[i].siblings[j] > i) && (path.indexOf(i) >= 0) && (path.indexOf(data[i].siblings[j]) >= 0)) {
                    drawConnection(data[i], data[data[i].siblings[j]], "#FF0000", 20);
                }
            }
        }
        for(var i=0; i<data.length; i++) {
            if (path.indexOf(i) >= 0) {
                drawNode(data[i], "#FF0000", "#FF0000");
            }
        }
        for(var i=0; i<data.length; i++) {
            for(var j=0; j<data[i].siblings.length; j++) {
                if ((data[i].siblings[j] > i) && (path.indexOf(i) >= 0) && (path.indexOf(data[i].siblings[j]) >= 0)) {
                    drawConnection(data[i], data[data[i].siblings[j]], "#FF0000", 16);
                }
            }
        }
    }

    function getLength(data, i, j) {
        return Math.sqrt((data[i].x - data[j].x)*(data[i].x - data[j].x) +
            (data[i].y - data[j].y)*(data[i].y - data[j].y));
    }

    function findPath(data, start, end) {
        var queue = [];
        var nodes = [];
        data.forEach(function (elem) {nodes.push({len: -1, parent: -1})});
        queue.push(start);
        nodes[start].len = 0;
        while (queue.length > 0) {
            var i = queue.shift();
            data[i].siblings.forEach(
                function(j) {
                    var len = getLength(data, i, j);
                    console.log(j);
                    if ((nodes[j].len < 0) || (nodes[j].len > len + nodes[i].len)) {
                        queue.push(j);
                        nodes[j].len = nodes[i].len + len;
                        nodes[j].parent = i;
                        console.log(i + " " + j);
                    }
                }
            );
        }
        console.log(nodes[end].len);
        var path = [];
        var parent = nodes[end].parent;
        while (parent != -1) {
            path.push(parent);
            parent = nodes[parent].parent;
            console.log(parent);
        }   
        return path;
    }

    connect(0, 1);
    connect(1, 2);
    connect(1, 3);
    connect(2, 4);
    connect(2, 5);
    connect(1, 6);
    connect(6, 7);
    connect(3, 4);
    connect(4, 10);
    connect(2, 9);
    connect(8, 10);
    connect(7, 8);
    connect(10, 11);
    connect(8, 12);

    $scope.path = findPath($scope.data, 0, 12);

    canvas.width = 800;
    canvas.height = 600;
    context.globalAlpha = 1.0;
    context.beginPath();
    draw($scope.data, $scope.path);
});