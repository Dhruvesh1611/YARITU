class Snake {
    constructor() {
        this.reset();
    }

    reset() {
        this.position = [{ x: 10, y: 10 }];
        this.direction = { x: 0, y: 0 };
        this.nextDirection = { x: 0, y: 0 };
        this.grew = false;
    }

    move() {
        this.direction = this.nextDirection;
        const head = this.position[0];
        const newHead = {
            x: head.x + this.direction.x,
            y: head.y + this.direction.y
        };
        this.position.unshift(newHead);
        if (!this.grew) {
            this.position.pop();
        }
        this.grew = false;
    }

    grow() {
        this.grew = true;
    }

    setDirection(direction) {
        const oppositeDirection = {
            x: -this.direction.x,
            y: -this.direction.y
        };
        if (direction.x !== oppositeDirection.x || direction.y !== oppositeDirection.y) {
            this.nextDirection = direction;
        }
    }

    checkCollision(width, height) {
        const head = this.position[0];
        if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) {
            return true;
        }
        for (let i = 1; i < this.position.length; i++) {
            if (head.x === this.position[i].x && head.y === this.position[i].y) {
                return true;
            }
        }
        return false;
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.width = this.canvas.width / this.gridSize;
        this.height = this.canvas.height / this.gridSize;
        this.snake = new Snake();
        this.food = this.generateFood();
        this.score = 0;
        this.gameOver = false;
        this.setupEventListeners();
    }

    generateFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * this.width),
                y: Math.floor(Math.random() * this.height)
            };
        } while (this.snake.position.some(segment => 
            segment.x === food.x && segment.y === food.y));
        return food;
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            const directions = {
                'ArrowUp': { x: 0, y: -1 },
                'ArrowDown': { x: 0, y: 1 },
                'ArrowLeft': { x: -1, y: 0 },
                'ArrowRight': { x: 1, y: 0 }
            };
            if (directions[e.key]) {
                this.snake.setDirection(directions[e.key]);
            }
        });

        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restart();
        });
    }

    update() {
        if (this.gameOver) return;

        this.snake.move();

        if (this.snake.checkCollision(this.width, this.height)) {
            this.endGame();
            return;
        }

        const head = this.snake.position[0];
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            document.getElementById('score').textContent = `Score: ${this.score}`;
            this.snake.grow();
            this.food = this.generateFood();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snake
        this.ctx.fillStyle = '#27ae60';
        this.snake.position.forEach(segment => {
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 1,
                this.gridSize - 1
            );
        });

        // Draw food
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fillRect(
            this.food.x * this.gridSize,
            this.food.y * this.gridSize,
            this.gridSize - 1,
            this.gridSize - 1
        );
    }

    endGame() {
        this.gameOver = true;
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('game-over').style.display = 'block';
    }

    restart() {
        this.snake.reset();
        this.food = this.generateFood();
        this.score = 0;
        this.gameOver = false;
        document.getElementById('score').textContent = 'Score: 0';
        document.getElementById('game-over').style.display = 'none';
    }

    gameLoop() {
        this.update();
        this.draw();
        setTimeout(() => requestAnimationFrame(() => this.gameLoop()), 100);
    }
}

const game = new Game();
game.gameLoop();
