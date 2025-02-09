// https://codepen.io/rzahniser/post/maze3
// Very basic library for painting in canvas that fills window
var Painter = (function() {
    // Graph range set by the user
    var x, y, w, h;
    // Pixel size of the canvas
    var width, height;
    // Used for drawing:
    var g;
    var painter;
  
    function resize() {
      width = Math.round(g.canvas.clientWidth * window.devicePixelRatio);
      height = Math.round(g.canvas.clientHeight * window.devicePixelRatio);
      
      canvas.setAttribute("width", width);
      canvas.setAttribute("height", height);
  
      repaint();
    }
  
    window.onload = function() {
      g = document.getElementById("canvas").getContext("2d");
  
      window.onresize = resize;
      resize();
    }
    
    function doRepaint() {
      if(!g) return;
      
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.clearRect(0, 0, width, height);
      
      if(!painter) return;
      
      // Scale drawing proportionally to fit in middle of canvas
      g.translate(width/2, height/2);
      
      var scale = Math.min(Math.abs(width/w), Math.abs(height/h));
      g.scale(w < 0 ? -scale : scale, h < 0 ? -scale : scale);
      // Translate such that (0, 0) becomes (x + w/2, y + h/2);
      g.translate(-(x + w/2), -(y + h/2));
      
      painter(g);
    }
  
    function repaint() {
      if(painter && g) window.requestAnimationFrame(doRepaint);
    }
    
    return {
      setPainter: function(x1, y1, x2, y2, p) {
        x = x1;
        y = y1;
        w = x2 - x1;
        h = y2 - y1;
        painter = p;
        repaint();
      },
      repaint: repaint,
    };
  })();
  
  function Vector(x, y) {
    this.x = x;
    this.y = y;
  }
  Vector.prototype.plus = function(other) {
    return new Vector(this.x + other.x, this.y + other.y);
  };
  Vector.prototype.minus = function(other) {
    return new Vector(this.x - other.x, this.y - other.y);
  };
  Vector.prototype.times = function(scale) {
    return new Vector(this.x * scale, this.y * scale);
  };
  Vector.prototype.dot = function(other) {
    return this.x * other.x + this.y * other.y;
  };
  Vector.prototype.length = function() {
    return Math.sqrt(this.dot(this));
  };
  Vector.prototype.rotate = function(angle) {
    var sin = Math.sin(angle * Math.PI / 180);
    var cos = Math.cos(angle * Math.PI / 180);
    return new Vector(this.x * cos - this.y * sin, this.y * cos + this.x * sin);
  };
  Vector.prototype.cross = function(other) {
    return this.x * other.y - this.y * other.x;
  };
  
  var RIGHT = 0, UP = 1, LEFT = 2, DOWN = 3;
  var DIRECTION = [
    new Vector(1, 0),  // RIGHT
    new Vector(0, 1),  // UP
    new Vector(-1, 0), // LEFT
    new Vector(0, -1), // DOWN
  ];
  
  function Wall(start, direction) {
    this.start = start;
    this.extent = DIRECTION[direction];
    this.normal = DIRECTION[(direction + 3) % 4];
  }
  Wall.prototype.offset = function(x, y) {
    return this.start.plus(this.extent.times(x)).plus(this.normal.times(y));
  };
  Wall.prototype.localize = function(pos) {
    var local = pos.minus(this.start);
    return new Vector(this.extent.dot(local), this.normal.dot(local));
  };
  Wall.prototype.draw = function(g, left, right) {
    var start = rotate(this.offset(.1, -.1));
    var end = rotate(this.offset(.9, -.1));
    
    if(!this.link) {
      drawWall(g, start, end, left, right);
      return;
    }
    
    // Restrict drawing to what we can see through the opening
    if(end.y > 0) left = Math.max(left, end.x / end.y);
    if(start.y > 0) right = Math.min(right, start.x / start.y);
    if(!(right > left)) return;
    
    // Draw the short little sides of the opening
    var startIn = rotate(this.offset(.1, .1));
    var endIn = rotate(this.offset(.9, .1));
    
    drawWall(g, start, startIn, left, right);
    drawWall(g, endIn, end, left, right);
    
    if(isVisible(startIn, endIn, left, right)) this.link.draw(g, left, right);
  };
  
  function isVisible(start, end, left, right) {
    return start.cross(end) > 0 && end.x < right * end.y && start.x > left * start.y;
  }
  
  function drawWall(g, start, end, left, right) {
    if(!isVisible(start, end, left, right)) return;
    
    start = clip(start, end, right) || start;
    end = clip(start, end, left) || end;
    
    drawLine(g, project(start, -.4), project(end, -.4));
    drawLine(g, project(start, .4), project(end, .4));
  }
  
  function drawLine(g, start, end) {
    g.beginPath();
    g.moveTo(start.x, start.y);
    g.lineTo(end.x, end.y);
    g.stroke();
  }
  
  function clip(start, end, edge) {
    // x = edge * y
    // (y - start.y) * d.x = (x - start.x) * d.y;
    // (y - start.y) * d.x = (edge * y - start.x) * d.y;
    // y * (d.x - edge * d.y) = d.x * start.y - d.y * start.x;
    // y = d.cross(start) / (d.x - edge * d.y)
    var d = end.minus(start);
    var y = d.cross(start) / (d.x - edge * d.y);
    return (y > start.y) != (y > end.y) && new Vector(edge * y, y);
  }
  
  function rotate(vector) {
    return vector.minus(player).rotate(90 - angle);
  }
  
  function project(rotated, z) {
    return new Vector(rotated.x / rotated.y, (z - playerZ) / rotated.y);
  }
  
  function Cell(x, y) {
    this.walls = [
      new Wall(new Vector(x + 1, y), UP),        // Left wall
      new Wall(new Vector(x + 1, y + 1), LEFT),  // Top wall
      new Wall(new Vector(x, y + 1), DOWN),      // Right wall
      new Wall(new Vector(x, y), RIGHT),         // Bottom wall
    ];
  }
  Cell.prototype.draw = function(g, left, right) {
    for(var i = 0; i < this.walls.length; i++) {
      var wall = this.walls[i];
      wall.draw(g, left, right);
      if(!wall.link == !this.walls[(i + 3) % 4].link) {
        var rotated = rotate(wall.offset(.1, -.1));
        if(rotated.x > left * rotated.y && rotated.x < right * rotated.y) {
          drawLine(g, project(rotated, -.4), project(rotated, .4));
        }
      }
    }
  };
  Cell.prototype.link = function(direction, other) {
    this.walls[direction].link = other;
    other.walls[(direction + 2) % 4].link = this;
  };
  Cell.prototype.getConnected = function() {
    var connected = [ this ];
    for(var i = 0; i < connected.length; i++) {
      for(var j = 0; j < connected[i].walls.length; j++) {
        var to = connected[i].walls[j].link;
        if(to && connected.indexOf(to) == -1) connected.push(to);
      }
    }
    return connected;
  };
  
  function random(max) {
    return Math.floor(Math.random() * max);
  }
  
  function generateMaze(width, height) {
    var cells = new Array(width);
    for(var x = 0; x < width; x++) {
      cells[x] = new Array(height);
      for(var y = 0; y < height; y++) {
        cells[x][y] = new Cell(x, y);
      }
    }
    
    // Link cells until all is linked
    do {
      var direction = random(2);
      var d = DIRECTION[direction];
      var start = new Vector(random(width - d.x), random(height - d.y));
      var from = cells[start.x][start.y];
      var to = cells[start.x + d.x][start.y + d.y];
      var connected = from.getConnected();
      if(connected.indexOf(to) == -1) from.link(direction, to);
    } while(connected.length != width * height);
    return cells;
  }
  
  var cell = generateMaze(10, 10)[0][0];
  var player = new Vector(0.5, 0.5);
  var angle = 45;
  var playerZ = 0;
  var walkPhase = 0;
  // For animation
  var targetCell = cell;
  var direction = 0;
  var animationTimer = 0;
  
  Painter.setPainter(-1.5, .3, 1.5, -.3, function(g) {
    g.lineWidth = 0.004;
    g.lineCap = 'round';
    g.strokeStyle = 'white';
    
    cell.draw(g, -1.5, 1.5);
    
    if(animationTimer == 0) {
      if(cell == targetCell) {
        // Update where we are trying to go
        for(var i = 0; i < 4; i++) {
          targetCell = cell.walls[(i + direction) % 4].link;
          if(targetCell) {
            direction = (i + direction + 3) % 4;
            break;
          }
        }
      }
      var move = rotate(targetCell.walls[0].offset(.5, -.5));
      var a = Math.atan2(move.x, move.y);
      speed = .1 * Math.exp(-a*a);
      angle += 10 - 20 / (1 + Math.exp(-a));
    } else {
      animationTimer--;
      targetCell = cell;
      // Move player
      if(keys[RIGHT]) angle -= 10;
      if(keys[LEFT]) angle += 10;
  
      var speed = 0;
      if(keys[UP]) speed += 0.1;
      if(keys[DOWN]) speed -= 0.1;
    }
    
    player = player.plus(new Vector(speed, 0).rotate(angle));
    walkPhase += 4 * speed;
    playerZ = 0.03 * Math.sin(walkPhase);
    // Left our cell?
    for(var i = 0; i < 4; i++) {
      var wall = cell.walls[i];
      if(wall.link && wall.localize(player).y > 0) {
        cell = wall.link;
        break;
      }
    }
    // Check for collisions
    for(var i = 0; i < 4; i++) {
      var wall = cell.walls[i];
      var loc = wall.localize(player);
      if(!wall.link && loc.y >= -0.3) {
        // Collide with wall
        player = wall.offset(loc.x, -0.3);
      } else if(wall.link && cell.walls[(i + 3) % 4].link && loc.length() < 0.3) {
        // Collide with corner
        loc = loc.times(0.3 / loc.length());
        player = wall.offset(loc.x, loc.y);
      }
    }
  });
  
  window.setInterval(Painter.repaint, 50);
  
  var keyToDirection = { 37: LEFT, 38: UP, 39: RIGHT, 40: DOWN };
  var keys = {};
  
  function handleKey(e, down) {
    if(e.keyCode >= 37 && e.keyCode <= 40) {
      keys[keyToDirection[e.keyCode]] = down;
      e.preventDefault();
      // Hand over key control to the player, timing out after 5s
      animationTimer = 10000;
    }
  }
  
  var canvas = document.getElementById("canvas");
  canvas.onkeydown = function(e) {
    handleKey(e, true);
  };
  canvas.onkeyup = function(e) {
    handleKey(e, false);
  };