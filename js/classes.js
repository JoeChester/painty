"use strict"

class Shape{
  draw(){}
  inside(x,y){return false}
  fill(color){
    this.fillColor = color
  }
  translate(x,y){}
  drawBoundingBox(){}
}

class Line extends Shape{

  constructor(x1, y1, x2, y2, color, polygonPreview) {
    super()
    this.x1 = x1
    this.y1 = y1
    this.x2 = x2
    this.y2 = y2
    this.color = color
  }

  draw(){
    let canvas = document.getElementById("canvas")
    let context = canvas.getContext('2d')

    context.beginPath()
    context.lineWidth = 2
    context.strokeStyle = hexToRgb(this.color)
    context.moveTo(this.x1, this.y1)
    context.lineTo(this.x2, this.y2)
    context.stroke()
    context.closePath()
    if(document.debug){
      this.drawBoundingBox()
    }
  }

  drawBoundingBox(){
    if(this.polygonPreview == true){
      return
    }
    let canvas = document.getElementById("canvas")
    let context = canvas.getContext('2d')

    context.lineWidth = 1
    context.strokeStyle = 'rgb(55,255,55)'
    context.strokeRect(this.x1, this.y1, (this.x2 - this.x1), (this.y2 - this.y1))
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
    let canvas = document.getElementById("canvas")
    let context = canvas.getContext('2d')

    context.lineWidth = 2
    context.strokeStyle = hexToRgb(this.color)
    context.strokeRect(this.x1, this.y1, (this.x2 - this.x1), (this.y2 - this.y1))
    if(this.fillColor){
      context.fillStyle = hexToRgb(this.fillColor)
      context.fillRect(this.x1, this.y1, (this.x2 - this.x1), (this.y2 - this.y1))
    }

  }

  inside(x,y){
    var xmin, xmax, ymin, ymax
    if(this.x1 < this.x2){
      xmin = this.x1
      xmax = this.x2
    } else {
      xmin = this.x2
      xmax = this.x1
    }

    if(this.y1 < this.y2){
      ymin = this.y1
      ymax = this.y2
    } else {
      ymin = this.y2
      ymax = this.y1
    }

    if(x >= xmin && x <= xmax && y >= ymin && y <= ymax){
      console.log("inside!")
      return true
    }
    return false
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
    let canvas = document.getElementById("canvas")
    let context = canvas.getContext('2d')

    context.lineWidth = 2
    context.strokeStyle = hexToRgb(this.color)

    let x = this.x1
    let y = this.y1
    let r = this.radius

    context.beginPath()
    context.arc(x, y, r, 0, 2 * Math.PI, false)
    context.stroke()
    context.closePath()

    if(this.fillColor){
      context.fillStyle = hexToRgb(this.fillColor)
      context.fill()
    }

    if(document.debug){
      this.drawBoundingBox()
    }
  }

  inside(x,y){
    let distance = Math.sqrt(Math.pow(Math.abs(this.x1 - x),2)
                  + Math.pow(Math.abs(this.y1 -y),2))
    if(distance <= this.radius){
      return true
    }
    return false
  }

  drawBoundingBox(){
    let canvas = document.getElementById("canvas")
    let context = canvas.getContext('2d')

    var x = this.x1 - (this.radius)
    var y = this.y1 - (this.radius)
    var d = this.radius * 2

    context.lineWidth = 1
    context.strokeStyle = 'rgb(55,255,55)'
    context.strokeRect(x,y,d,d)
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
    let diffX = Math.abs(this.points[0].x - x)
    let diffY = Math.abs(this.points[0].y - y)
    if(diffX < this.threshold && diffY < this.threshold){
      return true
    }
    return false
  }

  close(){
    let xn = this.points[0].x
    let yn = this.points[0].y
    this.addPoint(xn, yn)
  }

  draw(){
    let canvas = document.getElementById("canvas")
    let context = canvas.getContext('2d')

    context.beginPath()
    context.lineWidth = 2
    context.strokeStyle = hexToRgb(this.color)
    context.moveTo(this.points[0].x, this.points[0].y)
    for(let i in this.points){
      if(i == 0) continue
      context.lineTo(this.points[i].x, this.points[i].y)
      context.stroke()
    }
    context.closePath()

    if(this.fillColor){
      context.fillStyle = hexToRgb(this.fillColor)
      context.fill()
    }

    if(document.debug){
      this.drawBoundingBox()
    }
  }


  /* Copyright (c) 1970-2003, Wm. Randolph Franklin, see LICENSE.txt */
  inside(x,y){
    let i, j, c = false;
    for( i = 0, j = this.points.length-1; i < this.points.length; j = i++ ) {
      if( ( ( this.points[i].y > y ) != ( this.points[j].y > y ) ) &&
      ( x < ( this.points[j].x - this.points[i].x ) * ( y - this.points[i].y )
      / ( this.points[j].y - this.points[i].y ) + this.points[i].x ) ) {
        c = !c;
      }
    }
    return c;
  }

  drawBoundingBox(){
    let minx = this.points[0].x
    let maxx = this.points[0].x
    let miny = this.points[0].y
    let maxy = this.points[0].y

    for(var i in this.points){
      if(this.points[i].x < minx) minx = this.points[i].x
      if(this.points[i].x > maxx) maxx = this.points[i].x
      if(this.points[i].y < miny) miny = this.points[i].y
      if(this.points[i].y > maxy) maxy = this.points[i].y
    }

    let canvas = document.getElementById("canvas")
    let context = canvas.getContext('2d')

    let width = maxx - minx
    let height = maxy - miny

    context.lineWidth = 1
    context.strokeStyle = 'rgb(55,255,55)'
    context.strokeRect(minx, miny, width, height)
  }

}

function hexToRgb(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? "rgb(" +  parseInt(result[1], 16) + "," + parseInt(result[2], 16) + "," + parseInt(result[3], 16) + ")" : "rgb(0,0,0)"
}
