"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  const sudokuSolver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    if (!puzzle || !coordinate || !value) {
      res.json({ error: "Required field(s) missing" });
      return;
    }
    if (sudokuSolver.validCoordinate(coordinate) === false) {
      res.json({ error: "Invalid coordinate" });
      return;
    }
    if (sudokuSolver.validValue(value) === false) {
      res.json({ error: "Invalid value" });
      return;
    }
    const [validity, message] = sudokuSolver.validate(puzzle);

    if (validity === false && message === "Invalid characters in puzzle") {
      res.json({ error: "Invalid characters in puzzle" });
      return;
    }

    if (
      validity === false &&
      message === "Expected puzzle to be 81 characters long"
    ) {
      res.json({ error: "Expected puzzle to be 81 characters long" });
      return;
    }
    if (validity) {
      const matrix = sudokuSolver.puzzleMatrix(puzzle);
      const [row, col] = sudokuSolver.mapToRowColumn(coordinate);

      if (matrix[row][col] === value) {
        res.json({ valid: true });
        return;
      }
      // chequear si el valor ingresado en la row y column es valido para cada restriccion de fila, columna y area
      const validRow = sudokuSolver.checkRowPlacement(matrix, row, col, value);
      const validCol = sudokuSolver.checkColPlacement(matrix, row, col, value);
      const validRegion = sudokuSolver.checkRegionPlacement(
        matrix,
        row,
        col,
        value
      );
      if (validRow && validCol && validRegion) {
        res.json({ valid: true });
        return;
      }
      const arrayConflicts = [];
      if (!validRow) {
        arrayConflicts.push("row");
      }
      if (!validCol) {
        arrayConflicts.push("column");
      }
      if (!validRegion) {
        arrayConflicts.push("region");
      }
      res.json({ valid: false, conflict: arrayConflicts });
      return;
    }
  });

  app.route("/api/solve").post((req, res) => {
    const { puzzle } = req.body;

    if (puzzle === undefined || puzzle.length === 0) {
      res.json({ error: "Required field missing" });
      return;
    }

    const [validity, message] = sudokuSolver.validate(puzzle);

    if (!validity && message === "Invalid characters in puzzle") {
      res.json({ error: "Invalid characters in puzzle" });
      return;
    }
    if (!validity && message === "Expected puzzle to be 81 characters long") {
      res.json({ error: "Expected puzzle to be 81 characters long" });
      return;
    }
    if (!validity) {
      res.json({ error: "Puzzle cannot be solved" });
      return;
    }

    if (validity) {
      const matrix = sudokuSolver.puzzleMatrix(puzzle);
      if (sudokuSolver.solve(matrix)) {
        res.json({ solution: matrix.map((row) => row.join("")).join("") });
        return;
      } else {
        res.json({ error: "Puzzle cannot be solved" });
        return;
      }
    }
    res.status(500).json({ error: "Server error" });
  });
};
