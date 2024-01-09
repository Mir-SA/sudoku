const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let puzzle =
  "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
let invalidPuzzle =
  "155..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
let invalidCharPuzzle =
  "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37a";

let solve = new Solver(puzzle);
let invalidSolve = new Solver(invalidPuzzle);

suite("Unit Tests", () => {
  test("handle valid puzzle", function () {
    assert.isArray(solve.validate(puzzle));
    assert.deepEqual(solve.validate(puzzle), solve.grid);
  });
  test("handle puzzle that is not 81 char long", function () {
    assert.isObject(solve.validate("1.5..2.84..63"));
    assert.deepEqual(solve.validate("1.5..2.84..63"), {
      error: "Expected puzzle to be 81 characters long",
    });
  });
  test("handle puzzle with invalid characters", function () {
    assert.isObject(solve.validate(invalidCharPuzzle));
    assert.deepEqual(solve.validate(invalidCharPuzzle), {
      error: "Invalid characters in puzzle",
    });
  });

  test("handle valid row placement", function () {
    assert.equal(solve.checkRowPlacement(solve.grid, 0, 1, 3), true);
  });
  test("handle invalid row placement", function () {
    assert.equal(solve.checkRowPlacement(solve.grid, 0, 1, 8), false);
  });

  test("handle valid column placement", function () {
    assert.equal(solve.checkColPlacement(solve.grid, 1, 1, 8), true);
  });
  test("handle invalid column placement", function () {
    assert.equal(solve.checkColPlacement(solve.grid, 1, 1, 9), false);
  });

  test("handle valid region placement", function () {
    assert.equal(solve.checkRegionPlacement(solve.grid, 1, 1, 8), true);
  });
  test("handle invalid region placement", function () {
    assert.equal(solve.checkRegionPlacement(solve.grid, 1, 1, 2), false);
  });

  test("valid puzzle pass the solver", function () {
    assert.isObject(solve.solve(solve.grid));
    assert.deepEqual(solve.solve(solve.grid), {
      solved: true,
      grid: solve.grid,
    });
  });
  test("invalid puzzle fail the solver", function () {
    assert.isObject(invalidSolve.solve(invalidSolve.grid));
    assert.deepEqual(invalidSolve.solve(invalidSolve.grid), {
      solved: false,
      grid: null,
    });
  });
  test("return expected solution for incomplete puzzle", function () {
    assert.isObject(solve.solve(solve.grid));
    assert.deepEqual(solve.solve(solve.grid), {
      solved: true,
      grid: solve.grid,
    });
  });
});
