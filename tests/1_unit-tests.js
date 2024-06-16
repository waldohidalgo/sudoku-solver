const chai = require("chai");
const assert = chai.assert;

const SudokuSolver = require("../controllers/sudoku-solver.js");

let solver;

suite("Unit Tests", () => {
  solver = new SudokuSolver();
  const onePuzzleValid =
    "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
  const onePuzzleSolved =
    "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
  const onePuzzleInvalidCharacter =
    "p.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
  const onePuzzleNot81Characters =
    "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.7";

  // Logic handles a valid puzzle string of 81 characters

  test("Logic handles a valid puzzle string of 81 characters", (done) => {
    assert.equal(solver.validate(onePuzzleValid)[0], true);
    done();
  });

  // Logic handles a puzzle string with invalid characters (not 1-9 or .)

  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", (done) => {
    assert.equal(solver.validate(onePuzzleInvalidCharacter)[0], false);
    done();
  });

  // Logic handles a puzzle string that is not 81 characters in length

  test("Logic handles a puzzle string that is not 81 characters in length", (done) => {
    assert.equal(solver.validate(onePuzzleNot81Characters)[0], false);
    done();
  });

  // Logic handles a valid row placement

  test("Logic handles a valid row placement", (done) => {
    const matrix = solver.puzzleMatrix(onePuzzleValid);
    assert.equal(solver.checkRowPlacement(matrix, 0, 1, 3), true);
    done();
  });

  // Logic handles an invalid row placement

  test("Logic handles an invalid row placement", (done) => {
    const matrix = solver.puzzleMatrix(onePuzzleValid);
    assert.equal(solver.checkRowPlacement(matrix, 0, 1, "2"), false);
    done();
  });

  //Logic handles a valid column placement

  test("Logic handles a valid column placement", (done) => {
    const matrix = solver.puzzleMatrix(onePuzzleValid);
    assert.equal(solver.checkColPlacement(matrix, 0, 1, "4"), true);
    done();
  });

  // Logic handles an invalid column placement

  test("Logic handles an invalid column placement", (done) => {
    const matrix = solver.puzzleMatrix(onePuzzleValid);
    assert.equal(solver.checkColPlacement(matrix, 0, 1, "9"), false);
    done();
  });

  // Logic handles a valid region (3x3 grid) placement

  test("Logic handles a valid region (3x3 grid) placement", (done) => {
    const matrix = solver.puzzleMatrix(onePuzzleValid);
    assert.equal(solver.checkRegionPlacement(matrix, 0, 1, "3"), true);
    done();
  });

  // Logic handles an invalid region (3x3 grid) placement

  test("Logic handles an invalid region (3x3 grid) placement", (done) => {
    const matrix = solver.puzzleMatrix(onePuzzleValid);
    assert.equal(solver.checkRegionPlacement(matrix, 0, 1, "1"), false);
    done();
  });

  // Valid puzzle strings pass the solver

  test("Valid puzzle strings pass the solver", (done) => {
    const isValid = solver.validate(onePuzzleValid)[0];
    const matrix = solver.puzzleMatrix(onePuzzleValid);
    const isSolvedValidMatrix = isValid && solver.solve(matrix);
    assert.equal(isSolvedValidMatrix, true);

    done();
  });

  // Invalid puzzle strings fail the solver

  test("Invalid puzzle strings fail the solver", (done) => {
    const isValid = solver.validate(onePuzzleInvalidCharacter)[0];
    const matrix = solver.puzzleMatrix(onePuzzleInvalidCharacter);
    const isSolvedValidMatrix = isValid && solver.solve(matrix);
    assert.equal(isSolvedValidMatrix, false);
    done();
  });

  // Solver returns the expected solution for an incomplete puzzle

  test("Solver returns the expected solution for an incomplete puzzle", (done) => {
    const matrix = solver.puzzleMatrix(onePuzzleValid);
    const isSolved = solver.solve(matrix);
    assert.deepEqual(
      matrix.map((row) => row.join("")).join(""),
      onePuzzleSolved
    );
    done();
  });
});
