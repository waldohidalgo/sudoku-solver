const puzzlesAndSolutions = require("./puzzle-strings.js");
class SudokuSolver {
  puzzleMatrix(puzzleString) {
    const matrix = [];
    for (let i = 0; i < 9; i++) {
      matrix.push(puzzleString.slice(i * 9, i * 9 + 9).split(""));
    }
    return matrix;
  }

  validate(puzzleString) {
    const isString = typeof puzzleString === "string";

    if (!isString) return [false, "Puzzle must be a string"];

    const checkValidValues = /^[1-9\.]+$/g.test(puzzleString);

    if (!checkValidValues) {
      return [false, "Invalid characters in puzzle"];
    }

    const checkLength = puzzleString.length === 81;
    if (!checkLength) {
      return [false, "Expected puzzle to be 81 characters long"];
    }
    const matrix = this.puzzleMatrix(puzzleString);
    // chequea si todos los valores son distintos de . y son validos con las restricciones de filas, columnas y regiones

    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        const value = matrix[row][column];
        if (value === ".") continue;
        matrix[row][column] = ".";
        if (
          !this.checkRowPlacement(matrix, row, column, value) ||
          !this.checkColPlacement(matrix, row, column, value) ||
          !this.checkRegionPlacement(matrix, row, column, value)
        ) {
          return [false, "Puzzle cannot be solved"];
        }
        matrix[row][column] = value;
      }
    }
    return [true, "Puzzle is valid"];
  }

  checkRowPlacement(matrix, row, column, value) {
    // row : integer, column: integer, value: string
    for (let i = 0; i < 9; i++) {
      if (matrix[row][i] === value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(matrix, row, column, value) {
    for (let i = 0; i < 9; i++) {
      if (matrix[i][column] === value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(matrix, row, column, value) {
    const startRow = row - (row % 3);
    const startCol = column - (column % 3);

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (matrix[startRow + i][startCol + j] === value) {
          return false;
        }
      }
    }
    return true;
  }

  solve(matrix) {
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        if (matrix[row][column] === ".") {
          for (let value = 1; value <= 9; value++) {
            if (
              this.checkRowPlacement(matrix, row, column, `${value}`) &&
              this.checkColPlacement(matrix, row, column, `${value}`) &&
              this.checkRegionPlacement(matrix, row, column, `${value}`)
            ) {
              matrix[row][column] = `${value}`;
              if (this.solve(matrix)) {
                return true;
              } else {
                matrix[row][column] = ".";
              }
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  mapToRowColumn(coordinateAlphabetNumber) {
    const coordinateUpperCase = coordinateAlphabetNumber.toUpperCase();
    const row = coordinateUpperCase.charCodeAt(0) - 65;
    const column = parseInt(coordinateUpperCase.slice(1)) - 1;
    return [row, column];
  }

  validCoordinate(coordinate) {
    const coordinateAlphabetNumber = coordinate.toUpperCase();
    return /^[A-I]{1}[1-9]{1}$/g.test(coordinateAlphabetNumber);
  }
  validValue(value) {
    return /^[1-9]{1}$/.test(value);
  }
}

// const puzzle =
//   "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
// const sudokuSolver = new SudokuSolver();

// if (sudokuSolver.validate(puzzle)) {
//   const matrix = sudokuSolver.puzzleMatrix(puzzle);
//   if (sudokuSolver.solve(matrix)) {
//     console.log(matrix.map((row) => row.join("")).join(""));
//   } else {
//     console.log("Puzzle cannot be solved");
//   }
// }

module.exports = SudokuSolver;
