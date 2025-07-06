document.addEventListener('DOMContentLoaded', () => {
    const gridDisplay = document.querySelector('.grid-container');
    const scoreDisplay = document.getElementById('score');
    const bestScoreDisplay = document.getElementById('best-score');
    const messageDisplay = document.querySelector('.game-message');
    const retryButton = document.querySelector('.retry-button');
    const tileContainer = document.querySelector('.tile-container');
    const size = 4;
    let grid = [];
    let score = 0;
    let bestScore = localStorage.getItem('bestScore') || 0;
    bestScoreDisplay.textContent = bestScore;

    // Game setup
    function setup() {
        grid = Array(size * size).fill(0);
        score = 0;
        scoreDisplay.textContent = 0;
        messageDisplay.style.display = 'none';
        tileContainer.innerHTML = '';
        createGrid();
        addNumber();
        addNumber();
        updateDisplay();
    }

    function createGrid() {
        gridDisplay.innerHTML = '';
        for (let i = 0; i < size * size; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            gridDisplay.appendChild(cell);
        }
    }

    setup();

    // Update display
    function updateDisplay() {
        tileContainer.innerHTML = '';
        const tileWidth = gridDisplay.querySelector('.grid-cell').offsetWidth;
        const tileMargin = 15;

        for (let i = 0; i < size * size; i++) {
            if (grid[i] !== 0) {
                const tile = document.createElement('div');
                const tileValue = grid[i];
                tile.className = 'tile tile-' + tileValue;
                tile.textContent = tileValue;

                // Adjust font size for larger numbers
                if (tileValue > 1000) {
                    tile.style.fontSize = '2rem';
                } else if (tileValue > 100) {
                    tile.style.fontSize = '2.5rem';
                } else {
                    tile.style.fontSize = '3rem';
                }
                
                tile.style.width = `${tileWidth}px`;
                tile.style.height = `${tileWidth}px`;

                const x = i % size;
                const y = Math.floor(i / size);
                tile.style.transform = `translate(${x * (tileWidth + tileMargin)}px, ${y * (tileWidth + tileMargin)}px)`;
                tileContainer.appendChild(tile);
            }
        }
    }

    // Add a new number
    function addNumber() {
        let available = [];
        for (let i = 0; i < size * size; i++) {
            if (grid[i] === 0) {
                available.push(i);
            }
        }
        if (available.length > 0) {
            let spot = available[Math.floor(Math.random() * available.length)];
            grid[spot] = Math.random() > 0.9 ? 4 : 2;
        }
    }

    // Handle key presses
    document.addEventListener('keydown', control);

    function control(e) {
        let moved = false;
        if (e.keyCode === 37) { // Left
            moved = moveLeft();
        } else if (e.keyCode === 38) { // Up
            moved = moveUp();
        } else if (e.keyCode === 39) { // Right
            moved = moveRight();
        } else if (e.keyCode === 40) { // Down
            moved = moveDown();
        }

        if (moved) {
            addNumber();
            updateDisplay();
            checkGameOver();
        }
    }

    function moveLeft() {
        let moved = false;
        for (let i = 0; i < size; i++) {
            let row = grid.slice(i * size, i * size + size);
            let newRow = transform(row);
            for (let j = 0; j < size; j++) {
                if (grid[i * size + j] !== newRow[j]) {
                    moved = true;
                }
                grid[i * size + j] = newRow[j];
            }
        }
        return moved;
    }

    function moveRight() {
        let moved = false;
        for (let i = 0; i < size; i++) {
            let row = grid.slice(i * size, i * size + size).reverse();
            let newRow = transform(row).reverse();
            for (let j = 0; j < size; j++) {
                if (grid[i * size + j] !== newRow[j]) {
                    moved = true;
                }
                grid[i * size + j] = newRow[j];
            }
        }
        return moved;
    }

    function moveUp() {
        let moved = false;
        for (let i = 0; i < size; i++) {
            let column = [];
            for (let j = 0; j < size; j++) {
                column.push(grid[i + j * size]);
            }
            let newColumn = transform(column);
            for (let j = 0; j < size; j++) {
                if (grid[i + j * size] !== newColumn[j]) {
                    moved = true;
                }
                grid[i + j * size] = newColumn[j];
            }
        }
        return moved;
    }

    function moveDown() {
        let moved = false;
        for (let i = 0; i < size; i++) {
            let column = [];
            for (let j = 0; j < size; j++) {
                column.push(grid[i + j * size]);
            }
            let newColumn = transform(column.reverse()).reverse();
            for (let j = 0; j < size; j++) {
                if (grid[i + j * size] !== newColumn[j]) {
                    moved = true;
                }
                grid[i + j * size] = newColumn[j];
            }
        }
        return moved;
    }

    function transform(line) {
        let newLine = line.filter(cell => cell !== 0);
        for (let i = 0; i < newLine.length - 1; i++) {
            if (newLine[i] === newLine[i + 1]) {
                newLine[i] *= 2;
                score += newLine[i];
                scoreDisplay.textContent = score;
                newLine.splice(i + 1, 1);
            }
        }
        while (newLine.length < size) {
            newLine.push(0);
        }
        return newLine;
    }

    // Check for game over
    function checkGameOver() {
        let movesLeft = false;
        for (let i = 0; i < size * size; i++) {
            if (grid[i] === 0) {
                movesLeft = true;
                break;
            }
            if (i % size !== size - 1 && grid[i] === grid[i + 1]) {
                movesLeft = true;
                break;
            }
            if (i < size * (size - 1) && grid[i] === grid[i + size]) {
                movesLeft = true;
                break;
            }
        }

        if (!movesLeft) {
            messageDisplay.style.display = 'flex';
            messageDisplay.querySelector('p').textContent = 'Game Over!';
            if (score > bestScore) {
                bestScore = score;
                bestScoreDisplay.textContent = bestScore;
                localStorage.setItem('bestScore', bestScore);
            }
        }
    }

    // Retry button
    retryButton.addEventListener('click', setup);

    // Handle window resize
    window.addEventListener('resize', updateDisplay);
});
