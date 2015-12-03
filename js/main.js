"use strict"

console.log("Painty v.0.1.0")

var mode = 'line'
var color = "#FFFFFF"

var canvas

var shapes = []
var temp = null

var currentPoint = {}
var currentPolygon = null

var selectedShape = null

function main(){
  attachMouseHandlers()
}

function clearCanvas(){
  var promise = new Promise((resolve, reject) =>{
    canvas = document.getElementById("canvas")
    var context = canvas.getContext('2d')
    // clear canvas
    context.fillStyle = 'rgb(255,255,255)'
    context.fillRect(0, 0, canvas.width, canvas.height)
      resolve(canvas)
  });
  return promise
}

function changeMode(source, newmode){
  mode = newmode
  $('#modeButton').html(source.innerHTML)
  color = $('#colorInput').val()
  closeCurrentPolygon()
  updateCanvas()
}

function attachMouseHandlers(canvas){
  canvas = document.getElementById("canvas")
  canvas.addEventListener('mousedown', evt => {
    mousedown(evt.layerX, evt.layerY);
  }, false)
  canvas.addEventListener('mousemove', evt => {
    mousemove(evt.layerX, evt.layerY)
  }, false)
  canvas.addEventListener('mouseup', evt => {
    mouseup(evt.layerX, evt.layerY)
  }, false)

}

function mousedown(x,y){

  color = $('#colorInput').val()

  if(mode == 'fill'){
    /* search shapes from back to forth,
    so upper shapes will selected first */
    var i = shapes.length - 1
    do{
      if(shapes[i].inside(x,y)){
        selectedShape = shapes[i]
        selectedShape.fill(color)
        updateCanvas()
        return
      }
      i--
    } while (i >= 0)
    return
  }

  if(currentPoint.x1 == undefined && mode != 'polygon'){
    currentPoint.x1 = x
    currentPoint.y1 = y
    updateCanvas()
    return
  }

  var shape = null
  switch(mode){
    case 'line':
      shape = new Line(currentPoint.x1, currentPoint.y1, x, y, color)
      break
    case 'rect':
      shape = new Rect(currentPoint.x1, currentPoint.y1, x, y, color)
      break
    case 'circle':
      let radius = Math.sqrt(Math.pow(currentPoint.x1 - x, 2) + Math.pow(currentPoint.y1 - y,2))
      shape = new Circle(currentPoint.x1, currentPoint.y1, radius, color)
      break
    case 'polygon':
      if(currentPolygon == null){
        currentPolygon = new Polygon(x,y,color)
      } else {
        if(currentPolygon.canClose(x,y)){
          closeCurrentPolygon()
          break
        }
        currentPolygon.addPoint(x,y);
      }
      break
  }
  if(shape != null){
    shapes.push(shape)
  }
  currentPoint = {}
  temp = null
  updateCanvas()
}

function mousemove(x,y){

  if(currentPoint.x1 == undefined && mode != 'polygon'){
    return
  }

  var shape = null
  switch(mode){
    case 'line':
      shape= new Line(currentPoint.x1, currentPoint.y1, x, y, color)
      break
    case 'rect':
      shape = new Rect(currentPoint.x1, currentPoint.y1, x, y, color)
      break
    case 'circle':
      let radius = Math.sqrt(Math.pow(currentPoint.x1 - x, 2) + Math.pow(currentPoint.y1 - y,2))
      shape = new Circle(currentPoint.x1, currentPoint.y1, radius, color)
      break
    case 'polygon':
      //Rubberband creation of Polygon via simple temp line
      if(currentPolygon != null && currentPolygon != undefined){
        let lastPoint = currentPolygon.getLastPoint()
        let lastColor = currentPolygon.getColor()
        shape= new Line(lastPoint.x, lastPoint.y, x, y, lastColor, true)
      }
      break
  }
  color = $('#colorInput').val()
  temp = shape
  updateCanvas()
}

function closeCurrentPolygon(){
  if(currentPolygon != null){
    currentPolygon.close()
    let poly = currentPolygon
    shapes.push(poly)
    currentPolygon = null
  }
}

function mouseup(x,y){
  if(currentPoint.x1 == undefined){
    return
  }
  //if the mouse has moved since it was clicked, handle mouseup as click
  if(currentPoint.x1 != x && currentPoint.y1 != y){
    mousedown(x,y)
  }
}

function updateCanvas(){
  clearCanvas().then(canvas => {
    for(var i in shapes){
      if(shapes[i] != null){
        shapes[i].draw()
      }
    }
    if(temp != null){
      temp.draw()
    }
    if(currentPolygon != null){
      currentPolygon.draw()
    }
  });
}

function newImage(){
  shapes = []
  temp = null
  currentPolygon = null
  updateCanvas()
}
