// Kakuro UI Handler
let currentKakuroPuzzle = null;
let currentKakuroSolver = null;

document.addEventListener('DOMContentLoaded', () => {
    setupKakuroListeners();
});

function setupKakuroListeners() {
    document.getElementById('generate').addEventListener('click', generateKakuro);
    document.getElementById('solve').addEventListener('click', solveKakuro);
    document.getElementById('reset').addEventListener('click', resetKakuro);
}

function generateKakuro() {
    const size = parseInt(document.getElementById('grid-size').value);
    currentKakuroPuzzle = generateKakuroPuzzle(size);
    displayKakuro(currentKakuroPuzzle, size);
    updateKakuroStatus('Puzzle generated');
}

function displayKakuro(puzzle, size) {
    const grid = document.getElementById('kakuro-grid');
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${size}, 60px)`;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const cell = document.createElement('div');
            cell.className = 'kakuro-cell';
            cell.dataset.row = i;
            cell.dataset.col = j;

            if (puzzle[i][j]) {
                cell.classList.add('clue');
                cell.textContent = `${puzzle[i][j].down || ''}/${puzzle[i][j].across || ''}`;
            } else {
                cell.addEventListener('click', handleKakuroClick);
            }

            grid.appendChild(cell);
        }
    }
}

function handleKakuroClick(e) {
    const cell = e.target;
    if (cell.classList.contains('clue')) return;

    const value = prompt('Enter value (1-9):');
    if (value && /^[1-9]$/.test(value)) {
        cell.textContent = value;
        cell.classList.add('filled');
    }
}

async function solveKakuro() {
    if (!currentKakuroPuzzle) {
        alert('Generate a puzzle first!');
        return;
    }

    updateKakuroStatus('Solving...');
    const size = parseInt(document.getElementById('grid-size').value);

    currentKakuroSolver = new KakuroSolver(size, currentKakuroPuzzle);

    setTimeout(() => {
        const result = currentKakuroSolver.solve();

        if (result.solution) {
            displayKakuroSolution(result.solution);
            updateKakuroStatus('Solved!');
            document.getElementById('time').textContent = result.time.toFixed(2) + 's';
            document.getElementById('nodes').textContent = result.nodes;
        } else {
            updateKakuroStatus('No solution found');
        }
    }, 100);
}

function displayKakuroSolution(solution) {
    for (let variable in solution) {
        const [row, col] = variable.split(',').map(Number);
        const cells = document.querySelectorAll('.kakuro-cell');
        const size = parseInt(document.getElementById('grid-size').value);
        const index = row * size + col;
        const cell = cells[index];

        if (cell && !cell.classList.contains('clue')) {
            cell.textContent = solution[variable];
            cell.classList.add('success');
        }
    }
}

function resetKakuro() {
    const size = parseInt(document.getElementById('grid-size').value);
    document.getElementById('kakuro-grid').innerHTML = '';
    currentKakuroPuzzle = null;
    updateKakuroStatus('Ready');
    document.getElementById('time').textContent = '0.00s';
    document.getElementById('nodes').textContent = '0';
}

function updateKakuroStatus(text) {
    document.getElementById('status').textContent = text;
}