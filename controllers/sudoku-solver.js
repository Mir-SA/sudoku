const puzzleStrings = require("./puzzle-strings");

class SudokuSolver {
  constructor(puzzleString) {
    this.grid = this.validate(puzzleString);
  }

  validate(puzzleString) {
    let grid = [];

    for (let i = 0; i < 9; i++) {
      grid[i] = [];
      for (let j = 0; j < 9; j++) {
        let index = i * 9 + j;
        grid[i][j] =
          puzzleString[index] === "." ? 0 : parseInt(puzzleString[index], 10);
      }
    }
    return grid;
  }

  checkRowPlacement(grid, row, col, value) {
    // let grid = this.validate(puzzleString);

    // console.log('Value: ', grid[row][col-1])
    if (grid[row][col] === parseInt(value)) {
      return true;
    } else {
      for (let i = 0; i < 9; i++) {
        // console.log(grid[row][i]);
        if (grid[row][i] === parseInt(value)) return false;
      }
      return true;
    }
  }

  checkColPlacement(grid, row, col, value) {
    // let grid = this.validate(puzzleString);

    if (grid[row][col - 1] === parseInt(value)) {
      return true;
    } else {
      for (let i = 0; i < 9; i++) {
        // console.log(grid[i][col-1]);
        if (grid[i][col] === parseInt(value)) return false;
        // if (grid[row][i] === value || grid[col][i] === value) return false;
      }
      return true;
    }
  }

  checkRegionPlacement(grid, row, col, value) {
    // let grid = this.validate(puzzleString);
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    // console.log(startRow, startCol, value);
    // console.log("Value: ", row, col);
    if (grid[row][col] === parseInt(value)) return true;
    else {
      for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
          if (grid[i][j] === parseInt(value)) return false;
        }
      }
      return true;
    }
  }

  solve(grid) {
    if (this.solveSudoku(grid)) {
      return {
        solved: true,
        grid: grid,
      };
    } else {
      return {
        solved: false,
        grid: null,
      };
    }
  }

  solveSudoku(grid) {
    // let grid = this.validate(puzzleString);
    // console.log(grid);

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (parseInt(grid[row][col]) === 0) {
          for (let num = 1; num <= 9; num++) {
            if (
              this.checkRowPlacement(grid, row, col, num) &&
              this.checkColPlacement(grid, row, col, num) &&
              this.checkRegionPlacement(grid, row, col, num)
            ) {
              grid[row][col] = num;
              if (this.solveSudoku(grid)) return true;
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }
}

module.exports = SudokuSolver;
