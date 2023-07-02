//P5 connect 4 code
const CONNECT = 4
//Written entirely by Robert Papagna
const Width = 650
const Height = 600
const rows = 7
const cols = 8
const bgColor = 140
const windowColor = 220
const posX = Width/(cols+1)
const posY = Height/(rows+1)
const topPadding = 20 //DO NOT CHANGE
let colorBoard
let colorEmpty
let colorP1
let colorP2
let p1
let p2
let turn = 1
var score = 1

function P2Ai() {
  //do some ai stuff
  var bestCol = 5

  // Possible Inf loop
  var check = 0
  var inf = 0
  while (lowestRowInCol(bestCol) == 0) {
    if (inf > 5) {
      turn = 0
      break
    }
    if (check == 0) {
      if (bestCol == 1) {
        check = 1
        inf++
      }
      else
        bestCol--    
    }
    if (check == 1) {
      if (bestCol == 7) {
        check = 0
        inf++
      }
      else bestCol++
    }
  }
  p2.x = getPlacement(0, bestCol)[0]
  fill(colorP2)
  p2.drop(mouseToCol(p2.x))
  checkWinState()
}

function checkArray3(a1, a2) {
  if (a1[0] == a2[0] && a1[1] == a2[1] && a1[2] == a2[2])
    return 1
  return 0
}

function lowestRowInCol(col) {
  for (var x = 1; x < rows; x++) {
    var space = get((col * posX) + posX/2, (x * posY) + posY + topPadding/2)
    if (space[0] == windowColor && space[1] == windowColor && space[2] == windowColor)
      continue
    break
  }
  return x-1
}

function mouseToCol(mx) {
  const section = posX
  for (x = 1; x < cols; x++) {
    if (mx <= section * (x + 1))
      break
  }
  return (x == cols ? x - 1 : x)
}

function getPlacement(row, col) {
  var x = (posX * col) + (posX/2)
  var y = 0
  if (row)
    y = (posY * row) + (posY / 2) + topPadding
  return [x, y]
}

function gameOver() {
  textAlign(CENTER)
  textSize(Width/20)
  stroke(0)
  strokeWeight(3)
  fill(score == 1 ? colorP1 : colorP2) //based on winner
  text((score == 1 ? "p1" : "ai") + " Wins! press Space to restart", Width/2, Height/2)
}

function restart() {
  turn = 1
  drawMainWindow()
}

function winner(space) {
  if (abs(space) != CONNECT)
    return 0
  score = space / CONNECT
  turn = 0
  return 1
}

function checkWinState() {
  let board = Array(rows - 1)
  let y, x, i, space
  for (i = 0; i < rows - 1; i++)
      board[i] = Array(cols - 1);
  for (y = 1; y < rows; y++) {
    for (x = 1; x < cols; x++) {
      space = get((x * posX) + posX/2, (y * posY) + posY)
      if (checkArray3(space, colorP1.levels))
        board[y - 1][x - 1] = 1
      else if (checkArray3(space, colorP2.levels))
        board[y - 1][x - 1] = 2
      else
        board[y - 1][x - 1] = 0
    }
  }
  //check vertical
  for(x = 0; x < cols - 1; x++) {
    for(y = 0; y < rows - CONNECT; y++) {
      space = 0
      for (i = 0; i < CONNECT; i++) {
        if (board[y + i][x] == 1)
          space++
        else if (board[y + i][x] == 2)
          space--
      }
      if (winner(space))
        return
    }
  }
  //check horizontal
  for (y = 0; y < rows - 1; y++) {
    for (x = 0; x < cols - CONNECT; x++) {
      space = 0
      for (i = 0; i < CONNECT; i++) {
        if (board[y][x + i] == 1)
          space++
        else if (board[y][x + i] == 2)
          space--
      }
      if (winner(space))
        return
    }
  }
  //check positive diag
  for (y = rows - CONNECT; y < rows - 1; y++) {
    for (x = 0; x < cols - CONNECT; x++) {
      space = 0
      for (i = 0; i < CONNECT; i++) {
        if (board[y - i][x + i] == 1)
          space++
        else if (board[y - i][x + i] == 2)
          space--
      }
      if (winner(space))
        return
    }
  }
  //check negative diag
  for (y = 0; y < rows - CONNECT; y++) {
    for (x = 0; x < cols - CONNECT; x++) {
      space = 0
      for (i = 0; i < CONNECT; i++) {
        if (board[y + i][x + i] == 1)
          space++
        else if (board[y + i][x + i] == 2)
          space--
      }
      if (winner(space))
        return
    }
  }
  return turn++
}

class Piece {
  constructor(color, col) {
    this.color = color
    this.x = getPlacement(0, col)[0]
    this.y = (posY) - (posY / 2) + (topPadding / 2)
  }

  moveStartPos() {
    //remove old 
    strokeWeight(7)
    stroke(bgColor)
    fill(bgColor)
    ellipse(this.x, this.y, posX, posY)

    this.x = getPlacement(0, mouseToCol(mouseX))[0]
    strokeWeight(6)
    stroke(colorBoard)
    fill(this.color)
    ellipse(this.x, this.y, posX, posY)
  }
  
  drop(col) {
    var row = lowestRowInCol(col)
    if (!row)
      return 0
    ellipse(this.x, this.y + (posY * row) + topPadding/2, posX, posY)
    return 1
  }
}

function defineColors() {
  colorBoard = color(77,77,255)
  colorEmpty = color(windowColor)
  colorP1 = color(255,51,0)
  colorP2 = color(225,219,77)
}

function drawMainWindow() {
  stroke(colorBoard)
  strokeWeight(6)
  for (var i = 1; i < cols; i++) {
    for (var j = 1; j < rows; j++) {
      fill(colorBoard)
      rect(posX*i, (posY * j)+topPadding, posX, posY)
      fill(colorEmpty)
      ellipse(posX*i + posX /2, (posY * j)+ posY/2 + topPadding, posX, posY)
    }
  }
}

function setup() {
  createCanvas(Width, Height);
  background(bgColor);
  
  defineColors()
  drawMainWindow()
  
  p1 = new Piece(colorP1, 1)
  p2 = new Piece(colorP2, 1)
  fill(p1.color)
  ellipse(p1.x, p1.y, posX, posY)
  // frameRate(1)
}

function draw() {
  if (turn == 0)
    gameOver()
  else {
    if (turn % 2 == 1)
      p1.moveStartPos()
    else
      P2Ai()
  }
}

function mouseClicked(){
  if (turn % 2 == 1)
    if (p1.drop(mouseToCol(mouseX))) {
      checkWinState()
    }
}
  
function keyPressed() {
  if (turn)
    return
  if (keyCode == 32) //space
    restart()
}
