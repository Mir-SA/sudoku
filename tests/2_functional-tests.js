const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

let puzzle =
  "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
let invalidPuzzle =
  "155..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
let invalidCharPuzzle =
  "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37a";

const Solver = require("../controllers/sudoku-solver.js");
const solve = new Solver(puzzle);
const puzzleSolution = solve.solve(solve.grid);

chai.use(chaiHttp);

suite("Functional Tests", () => {
  test("Solve a puzzle with valid puzzle string", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle })
      .end(function (err, res) {
        assert.property(res.body, "solution");
        assert.equal(res.body.solution, puzzleSolution.grid.flat().join(""));
        done();
      });
  });
  test("Solve a puzzle with missing puzzle string", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .end(function (err, res) {
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Required field missing");
        done();
      });
  });
  test("Solve a puzzle with invalid characters", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: invalidCharPuzzle })
      .end(function (err, res) {
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });
  test("Solve a puzzle with incorrect length", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: "3.12.7.2..5...." })
      .end(function (err, res) {
        assert.property(res.body, "error");
        assert.equal(
          res.body.error,
          "Expected puzzle to be 81 characters long"
        );
        done();
      });
  });
  test("Solve a puzzle that cannot be solved", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({ puzzle: invalidPuzzle })
      .end(function (err, res) {
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Puzzle cannot be solved");
        done();
      });
  });
  test("Check a puzzle placement with all fields", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle, coordinate: "A2", value: 3 })
      .end(function (err, res) {
        assert.property(res.body, "valid");
        assert.isTrue(res.body.valid);
        done();
      });
  });
  test("Check a puzzle placement with single placement conflict", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle, coordinate: "A2", value: 8 })
      .end(function (err, res) {
        assert.property(res.body, "valid");
        assert.isFalse(res.body.valid);
        assert.isArray(res.body.conflict);
        assert.deepEqual(res.body.conflict, ["row"]);
        done();
      });
  });
  test("Check a puzzle placement with multiple placement conflicts", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle, coordinate: "A2", value: 6 })
      .end(function (err, res) {
        assert.property(res.body, "valid");
        assert.isFalse(res.body.valid);
        assert.isArray(res.body.conflict);
        assert.deepEqual(res.body.conflict, ["column", "region"]);
        done();
      });
  });
  test("Check a puzzle placement with all placement conflicts", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle, coordinate: "A2", value: 2 })
      .end(function (err, res) {
        assert.property(res.body, "valid");
        assert.isFalse(res.body.valid);
        assert.isArray(res.body.conflict);
        assert.deepEqual(res.body.conflict, ["row", "column", "region"]);
        done();
      });
  });
  test("Check a puzzle placement with missing required fields", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle, coordinate: "A2" })
      .end(function (err, res) {
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Required field(s) missing");
        done();
      });
  });
  test("Check a puzzle placement with invalid characters", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: invalidCharPuzzle, coordinate: "A2", value: 3 })
      .end(function (err, res) {
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });
  test("Check a puzzle placement with incorrect length", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle: "3.12.7.2..5....", coordinate: "A2", value: 3 })
      .end(function (err, res) {
        assert.property(res.body, "error");
        assert.equal(
          res.body.error,
          "Expected puzzle to be 81 characters long"
        );
        done();
      });
  });
  test("Check a puzzle placement with invalid placement coordinate", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle, coordinate: "A0", value: 3 })
      .end(function (err, res) {
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Invalid coordinate");
        done();
      });
  });
  test("Check a puzzle placement with invalid placement value", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({ puzzle, coordinate: "A2", value: 11 })
      .end(function (err, res) {
        assert.property(res.body, "error");
        assert.equal(res.body.error, "Invalid value");
        done();
      });
  });
});
