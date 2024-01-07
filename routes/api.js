"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let string = "";
  let regex = /^[1-9.]+$/;

  app.route("/api/check").post((req, res) => {
    const { puzzle } = req.body;
    const { coordinate } = req.body;
    const { value } = req.body;
    const rowObj = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7, I: 8 };

    if (
      value == null ||
      value == "" ||
      coordinate == null ||
      coordinate == "" ||
      puzzle == null ||
      puzzle == ""
    ) {
      res.send({ error: "Required field(s) missing" });
    } else if (puzzle.length !== 81) {
      res.send({ error: "Expected puzzle to be 81 characters long" });
    } else if (!regex.test(puzzle)) {
      res.send({ error: "Invalid characters in puzzle" });
    } else if (
      coordinate.slice(1) > 9 ||
      coordinate.slice(1) < 1 ||
      coordinate.slice(0, 1) > "I"
    ) {
      res.send({ error: "Invalid coordinate" });
    } else if (value > 9 || value < 1 || isNaN(parseInt(value))) {
      res.send({ error: "Invalid value" });
    } else {
      let solver = new SudokuSolver(puzzle);
      const row = coordinate.slice(0, 1);
      const col = coordinate.slice(1) - 1;
      // console.log(col);
      const conflict = [];
      let valid = true;

      // console.log(solver.checkRowPlacement(puzzle, rowObj[row], col, value));
      if (!solver.checkRowPlacement(solver.grid, rowObj[row], col, value)) {
        // console.log(row);
        valid = false;
        conflict.push("row");
      }
      if (!solver.checkColPlacement(solver.grid, rowObj[row], col, value)) {
        valid = false;
        conflict.push("column");
      }
      if (!solver.checkRegionPlacement(solver.grid, rowObj[row], col, value)) {
        valid = false;
        conflict.push("region");
      }
      // console.log(valid === false ? { valid, conflict } : { valid });
      valid === false ? res.send({ valid, conflict }) : res.send({ valid });
    }
  });

  app.route("/api/solve").post((req, res) => {
    string = req.body.puzzle;
    let solver = new SudokuSolver(string);

    if (string == null || string == "") {
      res.send({ error: "Required field missing" });
    } else if (string.length !== 81) {
      res.send({ error: "Expected puzzle to be 81 characters long" });
    } else if (!regex.test(string)) {
      res.send({ error: "Invalid characters in puzzle" });
    } else {
      let sol = solver.solve(solver.grid);
      // console.log("Grid: ", sol);
      if (sol.solved === false) {
        res.send({ error: "Puzzle cannot be solved" });
      } else {
        res.send({ solution: sol.grid.flat().join("") });
      }
    }
  });
};
