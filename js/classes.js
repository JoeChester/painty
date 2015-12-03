"use strict"

class Shape{
  draw(){}
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

function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? "rgb(" +  parseInt(result[1], 16) + "," + parseInt(result[2], 16) + "," + parseInt(result[3], 16) + ")" : "rgb(0,0,0)";
}
