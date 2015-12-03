"use strict"

class Shape{
  draw(){}
  inside(x,y){}
  fill(color){}
  translate(x,y){}
  drawBoundingBox(){}
}

class Line extends Shape{

  constructor(x1, y1, x2, y2, color) {
    super()
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2
    this.color = color
  }

  draw(){
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext('2d');

    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = hexToRgb(this.color);
    context.moveTo(this.x1, this.y1)
    context.lineTo(this.x2, this.y2);
    context.stroke();
    context.closePath();
    if(document.debug){
      this.drawBoundingBox();
    }
  }

  drawBoundingBox(){
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext('2d');

    context.lineWidth = 1;
    context.strokeStyle = 'rgb(55,255,55)';
    context.strokeRect(this.x1, this.y1, (this.x2 - this.x1), (this.y2 - this.y1));
  }

}

class Rect extends Shape{
  constructor(x1,y1,x2,y2,color){
    super()
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2
    this.color = color
  }

  draw(){
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext('2d');

    context.lineWidth = 2;
    context.strokeStyle = hexToRgb(this.color);
    context.strokeRect(this.x1, this.y1, (this.x2 - this.x1), (this.y2 - this.y1));

  }

}

class Circle extends Shape{
  constructor(x,y,radius,color){
    super()
    this.x1 = x
    this.y1 = y
    this.radius = radius
    this.color = color
  }

  draw(){
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext('2d');

    context.lineWidth = 2;
    context.strokeStyle = hexToRgb(this.color);

    let x = this.x1;
    let y = this.y1;
    let r = this.radius;

    context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI, false);
    context.stroke();
    context.closePath();
    if(document.debug){
      this.drawBoundingBox();
    }
  }

  drawBoundingBox(){
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext('2d');

    var x = this.x1 - (this.radius);
    var y = this.y1 - (this.radius);
    var d = this.radius * 2;

    context.lineWidth = 1;
    context.strokeStyle = 'rgb(55,255,55)';
    context.strokeRect(x,y,d,d);
  }

}

class Polygon extends Shape{

  constructor(x1, y1, color) {
    super()
    this.points = [{x:x1, y:y1}]
    this.color = color
    this.threshold = 10
  }

  addPoint(x,y){
    var point = {x:x, y:y}
    this.points.push(point)
  }

  getLastPoint(x,y){
    var point = this.points[this.points.length -1]
    return point
  }

  getColor(){
    return this.color
  }

  canClose(x,y){
    console.log("closeTest");
    let diffX = Math.abs(this.points[0].x - x)
    let diffY = Math.abs(this.points[0].y - y)
    console.log(diffX + " " + diffY)
    if(diffX < this.threshold && diffY < this.threshold){
      console.log("Hit!")
      return true;
    }
    console.log("Not a Hit!")
    return false;
  }

  close(){
    let xn = this.points[0].x
    let yn = this.points[0].y
    this.addPoint(xn, yn)
    console.log(this)
  }

  draw(){
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext('2d');

    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = hexToRgb(this.color);
    context.moveTo(this.points[0].x, this.points[0].y)
    for(let i in this.points){
      if(i == 0) continue;
      context.lineTo(this.points[i].x, this.points[i].y);
      context.stroke();
    }
    context.closePath();
    if(document.debug){
      this.drawBoundingBox();
    }
  }

  drawBoundingBox(){}

}

function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? "rgb(" +  parseInt(result[1], 16) + "," + parseInt(result[2], 16) + "," + parseInt(result[3], 16) + ")" : "rgb(0,0,0)";
}
