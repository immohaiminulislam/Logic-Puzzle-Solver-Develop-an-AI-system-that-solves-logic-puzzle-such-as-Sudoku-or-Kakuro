// Sudoku Solver Implementation
class SudokuSolver extends CSP {
    constructor(puzzle) {
        const variables = [];
        const domains = {};

        // Create variables and domains
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const varName = `${i},${j}`;
                variables.push(varName);

                if (puzzle[i][j] !== 0) {
                    domains[varName] = [puzzle[i][j]];
                } else {
                    domains[varName] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                }
            }
        }

        const constraints = [(variable, value, assignment) => {
            const [row, col] = variable.split(',').map(Number);

            // Check row
            for (let c = 0; c < 9; c++) {
                const checkVar = `${row},${c}`;
                if (checkVar !== variable && assignment[checkVar] === value) {
                    return false;
                }
            }

            // Check column
            for (let r = 0; r < 9; r++) {
                const checkVar = `${r},${col}`;
                if (checkVar !== variable && assignment[checkVar] === value) {
                    return false;
                }
            }

            // Check 3x3 box
            const boxRow = Math.floor(row / 3) * 3;
            const boxCol = Math.floor(col / 3) * 3;
            for (let r = boxRow; r < boxRow + 3; r++) {
                for (let c = boxCol; c < boxCol + 3; c++) {
                    const checkVar = `${r},${c}`;
                    if (checkVar !== variable && assignment[checkVar] === value) {
                        return false;
                    }
                }
            }

            return true;
        }];

        super(variables, domains, constraints);
        this.puzzle = puzzle;
    }

    solutionToGrid(solution) {
        const grid = Array(9).fill().map(() => Array(9).fill(0));
        for (let variable in solution) {
            const [row, col] = variable.split(',').map(Number);
            grid[row][col] = solution[variable];
        }
        return grid;
    }
}

// Generate random Sudoku puzzle
function generateSudokuPuzzle(difficulty = 'medium') {
    const clues = {
        'easy': 40,
        'medium': 30,
        'hard': 25,
        'expert': 20
    };

    const grid = Array(9).fill().map(() => Array(9).fill(0));
    const cellCount = clues[difficulty];

    // Fill random cells
    for (let i = 0; i < cellCount; i++) {
        let row, col, value;
        do {
            row = Math.floor(Math.random() * 9);
            col = Math.floor(Math.random() * 9);
            value = Math.floor(Math.random() * 9) + 1;
        } while (grid[row][col] !== 0);

        grid[row][col] = value;
    }

    return grid;
}