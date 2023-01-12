const canvas = document.querySelector('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const ctx = canvas.getContext('2d')

// constants
const maxRadius = 70
const growthRate = 1.8
const shrinkRate = 0.3

// generate random hexadecimal color
function randomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

// create the mouse object
const mouse = {
  x: undefined,
  y: undefined,
}

function handleMouseMove(event) {
  if (
    event.x > canvas.width - 10 ||
    event.y > canvas.height - 10 ||
    event.x < 10 ||
    event.y < 10
  ) {
    mouse.x = undefined
    mouse.y = undefined
  } else {
    mouse.x = event.x
    mouse.y = event.y
  }
}

function handleCanvasClick(event) {
  if (times > 0) times--

  ballArray.forEach((ball) => {
    ball.color = randomColor()
  })
}

// event listeners
let times = 20
canvas.addEventListener('click', handleCanvasClick)

canvas.addEventListener('mousemove', handleMouseMove)

window.addEventListener('resize', function () {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
})

class Circle {
  constructor(x, y, dx, dy, radius) {
    this.x = x
    this.y = y
    this.dx = dx
    this.dy = dy
    this.radius = radius
    this.minRadius = radius
    this.color = randomColor()
  }

  draw() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    ctx.stroke()
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.closePath()
  }

  update() {
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

class WhiteCircle extends Circle {
  constructor(x, y, dx, dy, radius) {
    super(x, y, dx, dy, radius)
  }

  content() {
    this.update() // so that it moves

    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    ctx.stroke()
    ctx.fillStyle = 'white'
    ctx.fill()

    ctx.font = `${this.radius / 5}px Arial`
    ctx.fillStyle = 'purple'
    ctx.fillText(
      `click ${times} times!`,
      this.x - this.radius / 1.7,
      this.y + this.radius / 12
    )
    ctx.font = `${this.radius / 3.3}px Arial`
    ctx.fillStyle = 'black'
    ctx.fillText('', this.x - this.radius / 1.12, this.y + this.radius / 9)
    ctx.closePath()
  }
}

let ballArray = []

for (let i = 0; i < 330; i++) {
  var radius, x, y, dx, dy
  radius = Math.random() * 4 + 1
  x = Math.random() * (innerWidth - radius * 2) + radius
  y = Math.random() * (innerHeight - radius * 2) + radius
  dx = (Math.random() - 0.5) * 2
  dy = (Math.random() - 0.5) * 2

  ballArray.push(new Circle(x, y, dx, dy, radius))
}

var whiteCircle = new WhiteCircle(
  Math.random() * (innerWidth - radius * 2) + radius,
  Math.random() * (innerHeight - radius * 2) + radius,
  (Math.random() - 0.5) * 2,
  (Math.random() - 0.5) * 2,
  20
  //Math.random() * 4 + 1
)

function animate() {
  requestAnimationFrame(animate)
  if (times !== 0) {
    ctx.clearRect(0, 0, innerWidth, innerHeight)
  } else {
    canvas.removeEventListener('mousemove', handleMouseMove)
    canvas.removeEventListener('click', handleCanvasClick)
    mouse.x = undefined
    mouse.y = undefined
  }

  for (var i = 0; i < ballArray.length; i++) {
    ballArray[i].update()
  }

  if (times !== 0) {
    whiteCircle.content()
  }
}
animate()
