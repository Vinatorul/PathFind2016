var app = angular.module('pathFind2016', ['mm.foundation']);

app.controller('CanvasCtrl', function($scope) {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var start = -1;
    var end = -1;
    const asphalt = 1;
    const dirt = 2;
    const closed = 3;
    const asphaltColor = "#fff86b";
    const dirtColor = "#8f7f42";
    const closedColor = "#000000";

    function Node(x, y) {
        this.x = x;
        this.y = y;
        this.siblings = [];
    }
    Node.prototype.addSibling = function(i, type) {
        this.siblings.push({ind: i, type: type});
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
        new Node(274, 45),
        new Node(350, 260),
    ];

    $scope.path = [];
    $scope.paramType = 1;

    $scope.road = {
        type: 1
    }

    function connect(ind1, ind2, type) {
        $scope.data[ind1].addSibling(ind2, type);
        $scope.data[ind2].addSibling(ind1, type);
    } 

    function drawNode(node, bgcolor, color, width) {
        context.beginPath();
        context.arc(node.x, node.y, width, 0, 2*Math.PI, false);
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
        for(var i=0; i<data.length; i++) {
            for(var j=0; j<data[i].siblings.length; j++) {
                if (data[i].siblings[j].ind > i) {
                    var color = "#000000" 
                    drawConnection(data[i], data[data[i].siblings[j].ind], color, 20);
                }
            }
        }
        data.forEach(function (node) {
            var color = "";
            for(var i=0; i<node.siblings.length; i++) { 
                switch (node.siblings[i].type) {
                    case asphalt: 
                        color = asphaltColor;
                    break;
                    case dirt:
                        color = dirtColor;
                    break;
                    case closed:
                        color = closedColor;
                    break;
                }
            }
            drawNode(node, "#000000", color, 9);
        });
        for(var i=0; i<data.length; i++) {
            for(var j=0; j<data[i].siblings.length; j++) {
                if (data[i].siblings[j].ind > i) {
                    var color = "";
                    switch (data[i].siblings[j].type) {
                        case asphalt: 
                            color = asphaltColor;
                        break;
                        case dirt:
                            color = dirtColor;
                        break;
                        case closed:
                            color = closedColor;
                        break;
                    }
                    
                    drawConnection(data[i], data[data[i].siblings[j].ind], color, 16);
                }
            }
        }

        for (var i=0; i < path.length - 1; i++) {
            drawConnection(data[path[i]], data[path[i+1]], "#000000", 20);
        }
        for (var i=0; i < path.length; i++) {
            drawNode(data[path[i]], "#000000", "#FF0000", 9);
        }
        for (var i=0; i < path.length - 1; i++) {
            drawConnection(data[path[i]], data[path[i+1]], "#FF0000", 16);
        }

        for(var i=0; i<data.length; i++) {
            var color = "#000000";
            if (i == start) {
                color = "#0000FF";
            }
            if (i == end) {
                color = "#00FF00";
            }
            drawNode(data[i], color, color, 5);
        }
    }

    function getLength(data, i, j) {
        var coeff = 1;
        for(var k=0; k<data[i].siblings.length; k++) {
            if (data[i].siblings[k].ind == j) {
                switch(data[i].siblings[k].type) {
                    case asphalt: 
                        coeff = 1;
                        break;
                    case dirt:
                        coeff = 10;
                        break;
                    case closed:
                        coeff = 1000;
                    break;
                }
                break;
            }
        }
        return coeff*Math.sqrt((data[i].x - data[j].x)*(data[i].x - data[j].x) +
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
                function(s) {
                    var j = s.ind;
                    var len = getLength(data, i, j);
                    if ((nodes[j].len < 0) || (nodes[j].len > len + nodes[i].len)) {
                        queue.push(j);
                        nodes[j].len = nodes[i].len + len;
                        nodes[j].parent = i;
                    }
                }
            );
        }
        var path = [end];
        var parent = nodes[end].parent;
        while (parent != -1) {
            path.push(parent);
            parent = nodes[parent].parent;
        }   
        console.log(path);
        return path;
    }

    function nodeClicked(data, x, y) {
        // console.log(x + " " + y);
        for(var i=0; i<data.length; i++) {
            if ((data[i].x - 15 < x) && (data[i].x + 15 > x) &&
                (data[i].y - 15 < y) && (data[i].y + 15 > y)) {
                return i;
            }
        }
        return -1;
    }

    function rodeClicked(data, x, y) {
        for(var i=0; i<data.length; i++) {
            for(var j=0; j<data[i].siblings.length; j++) {
                var x1 = data[i].x;
                var y1 = data[i].y;
                var x2 = data[data[i].siblings[j].ind].x;               
                var y2 = data[data[i].siblings[j].ind].y;
                if ((x + 15 < Math.min(x1, x2)) || (x - 15 > Math.max(x1, x2)) || (y + 15 < Math.min(y1, y2)) || (y - 15 > Math.max(y1, y2)))
                    continue;
                var a = y2 - y1;
                var b = x1 - x2;
                var c = y1*x2 - x1*y2;
                var dist = Math.abs(a*x + b*y + c)/Math.sqrt(a*a + b*b);
                if ((dist < 15) && (dist > -15))
                    return {start:i, end:data[i].siblings[j].ind};
            }
        }
        return undefined;
    }

    $scope.procClick = function(event) {
        var rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top; 
        var node = nodeClicked($scope.data, x, y);
        if (node >= 0) {
            switch ($scope.paramType) {
                case 1: 
                    start = node;
                    break;
                case 2: 
                    end = node;
                    break; 
            }
            if ((start >= 0) && (end >= 0)) {
                console.log(start);
                console.log(end);
                $scope.path = findPath($scope.data, start, end);
                
            }
            context.clearRect(0, 0, canvas.width, canvas.height);
            draw($scope.data, $scope.path);
        }
        else {
            var rode = rodeClicked($scope.data, x, y);
            if (rode) {
                for(var i=0; i<$scope.data[rode.start].siblings.length; i++) {
                    if ($scope.data[rode.start].siblings[i].ind == rode.end) {
                        $scope.data[rode.start].siblings[i].type = $scope.road.type; 
                    }
                }
                for(var i=0; i<$scope.data[rode.end].siblings.length; i++) {
                    if ($scope.data[rode.end].siblings[i].ind == rode.start) {
                        $scope.data[rode.end].siblings[i].type = $scope.road.type; 
                    }
                }
                if ((start >= 0) && (end >= 0)) {
                    console.log(start);
                    console.log(end);
                    $scope.path = findPath($scope.data, start, end);
                    
                }
                context.clearRect(0, 0, canvas.width, canvas.height);
                draw($scope.data, $scope.path);
            }
        }
    }

    $scope.forgetPath = function() {
        start = -1;
        end = -1;
        $scope.path = [];
        context.clearRect(0, 0, canvas.width, canvas.height);
        draw($scope.data, $scope.path);
    }

    connect(0, 1, asphalt);
    connect(1, 2, asphalt);
    connect(1, 3, asphalt);
    connect(2, 4, dirt);
    connect(2, 7, asphalt);
    connect(7, 5, asphalt);
    connect(1, 6, asphalt);
    connect(6, 7, dirt);
    connect(3, 4, asphalt);
    connect(4, 10, asphalt);
    connect(2, 9, asphalt);
    connect(8, 10, asphalt);
    connect(7, 8, asphalt);
    connect(10, 11, asphalt);
    connect(8, 12, asphalt);

    context.globalAlpha = 1.0;
    context.beginPath();
    canvas.width = 400;
    canvas.height = 400;
    draw($scope.data, $scope.path);
});
