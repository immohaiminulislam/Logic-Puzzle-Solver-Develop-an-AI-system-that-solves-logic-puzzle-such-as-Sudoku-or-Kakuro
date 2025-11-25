// Sudoku UI Handler
let currentPuzzle = null;
let currentSolver = null;

document.addEventListener('DOMContentLoaded', () => {
    initializeGrid();
    setupEventListeners();
});

function initializeGrid() {
    const grid = document.getElementById('sudoku-grid');
    grid.innerHTML = '';

    for (let i = 0; i < 81; i++) {
        const cell = document.createElement('div');
        cell.className = 'sudoku-cell';
        cell.dataset.index = i;
        cell.addEventListener('click', handleCellClick);
        grid.appendChild(cell);
    }
}

function setupEventListeners() {
    document.getElementById('generate').addEventListener('click', generatePuzzle);
    document.getElementById('solve').addEventListener('click', solvePuzzle);
    document.getElementById('reset').addEventListener('click', resetPuzzle);
}

function generatePuzzle() {
    const difficulty = document.getElementById('difficulty').value;
    currentPuzzle = generateSudokuPuzzle(difficulty);
    displayPuzzle(currentPuzzle);
    updateStatus('Puzzle generated');
}

function displayPuzzle(puzzle) {
    const cells = document.querySelectorAll('.sudoku-cell');
    puzzle.flat().forEach((value, index) => {
        const cell = cells[index];
        cell.textContent = value || '';
        cell.className = 'sudoku-cell' + (value ? ' given' : '');
    });
}

function handleCellClick(e) {
    const cell = e.target;
    if (cell.classList.contains('given')) return;

    const value = prompt('Enter value (1-9):');
    if (value && /^[1-9]$/.test(value)) {
        cell.textContent = value;
        cell.classList.add('filled');
    }
}

async function solvePuzzle() {
    if (!currentPuzzle) {
        alert('Generate a puzzle first!');
        return;
    }

    updateStatus('Solving...');
    document.getElementById('nodes').textContent = '0';

    currentSolver = new SudokuSolver(currentPuzzle);

    setTimeout(() => {
        const result = currentSolver.solve();

        if (result.solution) {
            const solvedGrid = currentSolver.solutionToGrid(result.solution);
            displaySolution(solvedGrid);
            updateStatus('Solved!');
            document.getElementById('time').textContent = result.time.toFixed(2) + 's';
            document.getElementById('nodes').textContent = result.nodes;
        } else {
            updateStatus('No solution found');
        }
    }, 100);
}

function displaySolution(grid) {
    const cells = document.querySelectorAll('.sudoku-cell');
    grid.flat().forEach((value, index) => {
        const cell = cells[index];
        if (!cell.classList.contains('given')) {
            cell.textContent = value;
            cell.classList.add('success');
        }
    });
}

function resetPuzzle() {
    initializeGrid();
    currentPuzzle = null;
    updateStatus('Ready');
    document.getElementById('time').textContent = '0.00s';
    document.getElementById('nodes').textContent = '0';
}

function updateStatus(text) {
    document.getElementById('status').textContent = text;
}