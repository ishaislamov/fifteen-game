"use strict";

var containerNode = document.getElementById('fifteen');
var itemNodes = Array.from(containerNode.querySelectorAll('.item'));
var countItems = 16;

if (itemNodes.length !== 16) {
  throw new Error("\u0414\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u0440\u043E\u0432\u043D\u043E ".concat(countItems, " items in HTML"));
} // 1. Position numbers


itemNodes[countItems - 1].style.display = 'none';
var matrix = getMatrix(itemNodes.map(function (item) {
  return Number(item.dataset.matrixId);
}));
setPositionItems(matrix); // 2. Shuffle

document.getElementById('shuffle').addEventListener('click', function () {
  var flatMatrix = matrix.flat();
  var shuffledArray = shuffleArray(flatMatrix);
  matrix = getMatrix(shuffledArray);
  setPositionItems(matrix);
}); // 3. Change position by click

var blankNumber = 16;
containerNode.addEventListener('click', function (event) {
  var buttonNode = event.target.closest('button');

  if (!buttonNode) {
    return;
  }

  var buttonNumber = Number(buttonNode.dataset.matrixId);
  var buttonCoords = findCoordinationByNumber(buttonNumber, matrix);
  var blankCoords = findCoordinationByNumber(blankNumber, matrix);
  var isValid = isValidForSwap(buttonCoords, blankCoords);

  if (isValid) {
    swap(blankCoords, buttonCoords, matrix);
    setPositionItems(matrix);
  }
}); // 4. Change position by arrows

window.addEventListener('keydown', function (event) {
  if (!event.key.includes('Arrow')) {
    return;
  }

  var blankCoords = findCoordinationByNumber(blankNumber, matrix);
  var buttonCoords = {
    x: blankCoords.x,
    y: blankCoords.y
  };
  var direction = event.key.split('Arrow')[1].toLowerCase();
  var maxIndexMatrix = matrix.length;

  switch (direction) {
    case 'up':
      buttonCoords.y += 1;
      break;

    case 'down':
      buttonCoords.y -= 1;
      break;

    case 'left':
      buttonCoords.x += 1;
      break;

    case 'right':
      buttonCoords.x -= 1;
      break;
  }

  if (buttonCoords.y >= maxIndexMatrix || buttonCoords.y < 0 || buttonCoords.x >= maxIndexMatrix || buttonCoords.x < 0) {
    return;
  }

  swap(blankCoords, buttonCoords, matrix);
  setPositionItems(matrix);
}); // Helpers 

function getMatrix(arr) {
  var matrix = [[], [], [], []];
  var y = 0;
  var x = 0;

  for (var i = 0; i < arr.length; i++) {
    if (x >= 4) {
      y++;
      x = 0;
    }

    matrix[y][x] = arr[i];
    x++;
  }

  return matrix;
}

function setPositionItems(matrix) {
  for (var y = 0; y < matrix.length; y++) {
    for (var x = 0; x < matrix[y].length; x++) {
      var value = matrix[y][x];
      var node = itemNodes[value - 1];
      setNodeStyles(node, x, y);
    }
  }
}

function setNodeStyles(node, x, y) {
  var shiftPs = 100;
  node.style.transform = "translate3D(".concat(x * shiftPs, "%, ").concat(y * shiftPs, "%, 0)");
}

function shuffleArray(arr) {
  return arr.map(function (value) {
    return {
      value: value,
      sort: Math.random()
    };
  }).sort(function (a, b) {
    return a.sort - b.sort;
  }).map(function (_ref) {
    var value = _ref.value;
    return value;
  });
}

function findCoordinationByNumber(number, matrix) {
  for (var y = 0; y < matrix.length; y++) {
    for (var x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] === number) {
        return {
          x: x,
          y: y
        };
      }
    }
  }

  return null;
}

function isValidForSwap(coords1, coords2) {
  var diffX = Math.abs(coords1.x - coords2.x);
  var diffY = Math.abs(coords1.y - coords2.y);
  return (diffX === 1 || diffY === 1) && (coords1.x === coords2.x || coords1.y === coords2.y);
}

function swap(coords1, coords2, matrix) {
  var coords1Number = matrix[coords1.y][coords1.x];
  matrix[coords1.y][coords1.x] = matrix[coords2.y][coords2.x];
  matrix[coords2.y][coords2.x] = coords1Number;

  if (isWon(matrix)) {
    addWonClass();
  }
}

var winFlatArray = new Array(16).fill(0).map(function (_item, index) {
  return index + 1;
});

function isWon(matrix) {
  var flatMatrix = matrix.flat();

  for (var i = 0; i < winFlatArray.length; i++) {
    if (flatMatrix[i] !== winFlatArray[i]) {
      return false;
    }
  }

  return true;
}

var wonClass = 'fifteenWon';

function addWonClass() {
  setTimeout(function () {
    containerNode.classList.add(wonClass);
    setTimeout(function () {
      containerNode.classList.remove(wonClass);
    }, 1000);
  }, 200);
}