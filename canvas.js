var canvas = document.querySelector('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

var ctx = canvas.getContext('2d')

// create the mouse object
var mouse = {
  x: undefined,
  y: undefined,
}

// constants
const maxRadius = 70
const growthRate = 1.8
const shrinkRate = 0.3
var clicks = 0

var colorArray = [
  '#fa3',
  '#5fb',
  '#f22',
  '#37f',
  '#ff2',
  '#f7d',
  '#bbb',
  '#5f5',
]

// assign event to mouse object
window.addEventListener('mousemove', function (event) {
  mouse.x = event.x
  mouse.y = event.y
})

// window.onresize = () => {}
window.addEventListener('resize', function () {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
})

// constructor function
function Circle(x, y, dx, dy, radius) {
  this.x = x
  this.y = y
  this.dx = dx
  this.dy = dy
  this.radius = radius
  this.minRadius = radius
  this.color = colorArray[Math.floor(Math.random() * colorArray.length)]

  // change colors
  canvas.addEventListener('click', () => {
    clicks++
    this.color = 'transparent'
  })

  this.draw = function () {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    ctx.stroke()
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.closePath()
  }

  this.copyRight = () => {
    this.update() // so that it moves

    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    ctx.stroke()
    ctx.fillStyle = 'white'
    ctx.fill()

    ctx.font = `${this.radius / 5}px Arial`
    ctx.fillStyle = 'blue'
    ctx.fillText('', this.x - this.radius / 1.8, this.y - this.radius / 4)
    ctx.font = `${this.radius / 3.3}px Arial`
    ctx.fillStyle = 'black'
    ctx.fillText('', this.x - this.radius / 1.12, this.y + this.radius / 9)
    ctx.closePath()
  }

  this.update = function () {
    this.draw()

    if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
      this.dx = -this.dx
    }

    if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
      this.dy = -this.dy
    }

    this.x += this.dx
    this.y += this.dy

    // interactivity
    if (
      mouse.x - this.x < 100 &&
      mouse.x - this.x > -100 &&
      mouse.y - this.y < 100 &&
      mouse.y - this.y > -100
    ) {
      if (this.radius < maxRadius) {
        this.radius += growthRate
      }
    } else if (this.radius > this.minRadius) {
      this.radius -= shrinkRate
    }
  }
}

var ballArray = []

for (var i = 0; i < 330; i++) {
  var radius, x, y, dx, dy
  radius = Math.random() * 4 + 1
  x = Math.random() * (innerWidth - radius * 2) + radius
  y = Math.random() * (innerHeight - radius * 2) + radius
  dx = (Math.random() - 0.5) * 2
  dy = (Math.random() - 0.5) * 2

  ballArray.push(new Circle(x, y, dx, dy, radius))
}

var blackBall = new Circle(
  Math.random() * (innerWidth - radius * 2) + radius,
  Math.random() * (innerHeight - radius * 2) + radius,
  (Math.random() - 0.5) * 2,
  (Math.random() - 0.5) * 2,
  Math.random() * 4 + 1
)

function animate() {
  requestAnimationFrame(animate)
  ctx.clearRect(0, 0, innerWidth, innerHeight)

  for (var i = 0; i < ballArray.length; i++) {
    ballArray[i].update()
  }

  blackBall.copyRight()
}
animate()
