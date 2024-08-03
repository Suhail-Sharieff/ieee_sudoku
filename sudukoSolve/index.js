
document.addEventListener("DOMContentLoaded", function() {
    const sudokuGrid = document.getElementById("sudoku-grid");
    const solveBtn = document.getElementById("solve-btn");
    const resetBtn = document.getElementById("reset-btn");

    // Generate the Sudoku grid
    for (let i = 0; i < 81; i++) {
        const cell = document.createElement("input");
        cell.type = "text";
        cell.className = "cell";
        cell.maxLength = 1;
        sudokuGrid.appendChild(cell);
    }

    solveBtn.addEventListener("click", solveSudoku);
    resetBtn.addEventListener("click", resetSudoku);
});

async function solveSudoku() {
    const puzzle = readSudokuGrid();
    const solved = await solveWithSmartAlgorithm(puzzle);
    if (solved) {
        alert("Sudoku solved successfully!");
    } else {
        alert("Could not solve Sudoku puzzle. Please check input.");
    }
}

function resetSudoku() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        cell.value = '';
    });
}

async function solveWithSmartAlgorithm(puzzle) {
    const emptyCell = findEmptyCellWithMRV(puzzle);
    if (!emptyCell) {
        return true; // Puzzle solved
    }

    const [row, col] = emptyCell;
    const possibleValues = getPossibleValues(puzzle, row, col);

    for (const num of possibleValues) {
        puzzle[row * 9 + col] = num;
        updateSudokuGrid(puzzle);
        await sleep(100); // Delay for animation

        if (await solveWithSmartAlgorithm(puzzle)) {
            return true;
        }

        puzzle[row * 9 + col] = 0; // Backtrack
        updateSudokuGrid(puzzle);
        await sleep(100); // Delay for animation
    }

    return false; // No valid number found
}

function readSudokuGrid() {
    const puzzle = [];
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell, index) => {
        const value = parseInt(cell.value) || 0;
        puzzle.push(value);
    });
    return puzzle;
}

function updateSudokuGrid(puzzle) {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell, index) => {
        cell.value = puzzle[index] === 0 ? '' : puzzle[index];
    });
}

function findEmptyCellWithMRV(puzzle) {
    let minPossibleValues = 10;
    let minCell = null;

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (puzzle[row * 9 + col] === 0) {
                const possibleValues = getPossibleValues(puzzle, row, col);
                const numPossibleValues = possibleValues.size;

                if (numPossibleValues < minPossibleValues) {
                    minPossibleValues = numPossibleValues;
                    minCell = [row, col];
                }
            }
        }
    }

    return minCell;
}

function getPossibleValues(puzzle, row, col) {
    const possibleValues = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    // Remove values in the same row and column
    for (let i = 0; i < 9; i++) {
        possibleValues.delete(puzzle[row * 9 + i]);
        possibleValues.delete(puzzle[i * 9 + col]);
    }

    // Remove values
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            possibleValues.delete(puzzle[i * 9 + j]);
        }
    }

    return possibleValues;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}