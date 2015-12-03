"use strict"

console.log("Painty v.0.0.1");

var mode = 'line';
var color = "#FFFFFF";

var canvas;

var shapes = [];
var temp = null;

var currentPoint = {};

function main(){
  attachMouseHandlers();
}

function clearCanvas(){
  var promise = new Promise((resolve, reject) =>{
    canvas = document.getElementById("canvas");
    var context = canvas.getContext('2d');
    // clear canvas
    context.fillStyle = 'rgb(255,255,255)';
    context.fillRect(0, 0, canvas.width, canvas.height);
      resolve(canvas);
  });
  return promise;
}

function changeMode(source, newmode){
  mode = newmode;
  $('#modeButton').html(source.innerHTML);
  color = $('#colorInput').val();
  console.log(color);
}

function attachMouseHandlers(canvas){
  canvas = document.getElementById("canvas");
  canvas.addEventListener('mousedown', evt => {
    mousedown(evt.layerX, evt.layerY);
  }, false);
  canvas.addEventListener('mousemove', evt => {
    mousemove(evt.layerX, evt.layerY);
  }, false);

}

function mousedown(x,y){
  if(currentPoint.x1 == undefined){
    currentPoint.x1 = x;
    currentPoint.y1 = y;
    updateCanvas();
    return;
  }
  switch(mode){
    case 'line':
      color = $('#colorInput').val();
      let line = new Line(currentPoint.x1, currentPoint.y1, x, y, color);
      shapes.push(line);
      currentPoint = {};
      temp = null;
      updateCanvas();
      break;
    case 'rect':
      color = $('#colorInput').val();
      let rect = new Rect(currentPoint.x1, currentPoint.y1, x, y, color);
      shapes.push(rect);
      currentPoint = {};
      temp = null;
      updateCanvas();
      break;
  }
}

function mousemove(x,y){
  if(currentPoint.x1 == undefined){
    return;
  }
  switch(mode){
    case 'line':
      var line = new Line(currentPoint.x1, currentPoint.y1, x, y, color);
      color = $('#colorInput').val();
      temp = line;
      updateCanvas();
      break;
    case 'rect':
      var rect = new Rect(currentPoint.x1, currentPoint.y1, x, y, color);
      color = $('#colorInput').val();
      temp = rect;
      updateCanvas();
      break;
  }
}

function updateCanvas(){
  clearCanvas().then(canvas => {
    for(var i in shapes){
      shapes[i].draw();
    }
    if(temp != null){
      temp.draw();
    }
  });
}

function newImage(){
  shapes = [];
  temp = null;
  updateCanvas();
}
