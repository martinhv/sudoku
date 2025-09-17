import { SudokuGrid } from '../types';

const GRID_SIZE = 9;

const shuffle = <T,>(array: T[]): T[] => {
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
};

const isSafe = (grid: SudokuGrid, row: number, col: number, num: number): boolean => {
  for (let x = 0; x < GRID_SIZE; x++) {
    if (grid[row][x] === num || grid[x][col] === num) {
      return false;
    }
  }

  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[i + startRow][j + startCol] === num) {
        return false;
      }
    }
  }

  return true;
};

const solveSudoku = (grid: SudokuGrid): boolean => {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === null) {
        const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of numbers) {
          if (isSafe(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) {
              return true;
            }
            grid[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
};

const countSolutions = (grid: SudokuGrid): number => {
    let count = 0;

    const solve = () => {
        if (count > 1) return; // Optimization: stop if more than one solution is found
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                if (grid[row][col] === null) {
                    for (let num = 1; num <= 9; num++) {
                        if (isSafe(grid, row, col, num)) {
                            grid[row][col] = num;
                            solve();
                            grid[row][col] = null; // backtrack
                        }
                    }
                    return;
                }
            }
        }
        count++;
    };

    solve();
    return count;
}


export const generateSudoku = (cellsToRemove: number): { puzzle: SudokuGrid, solution: SudokuGrid } => {
  const emptyGrid: SudokuGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
  solveSudoku(emptyGrid);
  const solution = JSON.parse(JSON.stringify(emptyGrid));

  const puzzle = JSON.parse(JSON.stringify(solution));
  
  const cells = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      cells.push([i, j]);
    }
  }
  shuffle(cells);

  let removedCount = 0;
  // Make sure we don't remove too many cells, which can make generation very slow
  const maxToRemove = Math.min(cellsToRemove, 60);

  for (const [row, col] of cells) {
    if (removedCount >= maxToRemove) {
      break;
    }

    const backup = puzzle[row][col];
    puzzle[row][col] = null;

    const tempPuzzle = JSON.parse(JSON.stringify(puzzle));
    if (countSolutions(tempPuzzle) !== 1) {
      puzzle[row][col] = backup; // Put it back if solution is not unique
    } else {
      removedCount++;
    }
  }

  return { puzzle, solution };
};

export const solve = (grid: SudokuGrid): SudokuGrid | null => {
  const gridCopy: SudokuGrid = JSON.parse(JSON.stringify(grid));
  if (solveSudoku(gridCopy)) {
    return gridCopy;
  }
  return null;
};
