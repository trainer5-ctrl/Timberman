class Lumberjack {
    constructor(props) {
        this.canvas = props.el;
        this.canvas.width = window.innerWidth > props.maxWidth ? props.maxWidth : window.innerWidth;
        this.canvas.height = props.maxHeight;
        this.ctx = this.canvas.getContext('2d');

        // 🎮 GAME STATE
        this.gameState = "PLAY"; // PLAY | GAME_OVER

        this.score = 0;
        this.scoreEl = document.getElementById("score");

        this.highScore = localStorage.getItem('highScore') || 0;

        this.btnLeft = props.btnLeft;
        this.btnRight = props.btnRight;

        // 🎨 BACKGROUND IMAGE (LOAD SEKALI)
        this.bgImage = new Image();
        this.bgImage.src = "images/bg.png";

        this.landImage = new Image();
        this.landImage.src = "images/land.png";

        // 🔊 AUDIO (PRELOAD)
        this.cutSound = new Audio("audio/cut.wav");
        this.cutSound.playbackRate = 2;

        // 📱 TELEGRAM USER
        this.playerName = "Guest Player"; 
        const tg = window.Telegram.WebApp;

        if (tg) {
            tg.ready();
            tg.expand();

            if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
                const user = tg.initDataUnsafe.user;
                this.playerName = user.username 
                    ? "@" + user.username 
                    : `${user.first_name} ${user.last_name || ""}`.trim();
            }
        }

        this.listener();
    }

    init() {
        this.person = new Person(this.canvas);
        this.tree = new Tree(this.canvas, this.canvas.width / 2, this.canvas.height - 350);

        this.updateScoreUI();
    }

    // 🎨 BACKGROUND LEBIH BAGUS (GRADIENT + IMAGE)
    drawBackground() {
        let gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, "#87CEEB");
        gradient.addColorStop(1, "#e0f7ff");

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // gambar background jika ada
        if (this.bgImage.complete) {
            this.ctx.drawImage(this.bgImage, 0, 0, this.canvas.width, this.canvas.height);
        }

        // tanah
        if (this.landImage.complete) {
            this.ctx.drawImage(this.landImage, 0, this.canvas.height - 300, this.canvas.width, 350);
        }
    }

    drawHUD() {
        this.ctx.fillStyle = "#fff";
        this.ctx.font = "bold 24px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText("Score: " + this.score, this.canvas.width / 2, 40);
    }

    drawGameOver() {
        this.ctx.fillStyle = "rgba(0,0,0,0.6)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "#fff";
        this.ctx.font = "bold 40px Arial";
        this.ctx.textAlign = "center";

        this.ctx.fillText("GAME OVER", this.canvas.width / 2, this.canvas.height / 2 - 40);
        this.ctx.font = "20px Arial";
        this.ctx.fillText(`Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillText(`Player: ${this.playerName}`, this.canvas.width / 2, this.canvas.height / 2 + 30);
    }

    draw() {
        this.drawBackground();

        if (this.gameState === "PLAY") {
            this.tree.draw();

            if (this.person) {
                this.person.update();
            }

            this.person.draw();
            this.drawHUD();
        }

        if (this.gameState === "GAME_OVER") {
            this.drawGameOver();
        }
    }

    render() {
        this.draw();
        requestAnimationFrame(() => this.render());
    }

    updateScoreUI() {
        if (this.scoreEl) {
            this.scoreEl.innerText = this.score;

            this.scoreEl.style.transform = "scale(1.2)";
            setTimeout(() => {
                this.scoreEl.style.transform = "scale(1)";
            }, 100);
        }
    }

    move(direction) {
        if (this.gameState !== "PLAY") return;

        // animasi lompat
        if (this.person) {
            this.person.startJump();
        }

        this.person.characterPosition = direction;

        this.tree.trees.shift();
        this.tree.createNewTrunk();

        // 🔊 AUDIO REUSE
        this.cutSound.currentTime = 0;
        this.cutSound.play().catch(() => {});

        this.score++;
        this.updateScoreUI();

        let currentBranch = this.tree.trees[0].value;

        if (currentBranch === direction) {
            this.gameOver();
        }
    }

    gameOver() {
        this.gameState = "GAME_OVER";

        if (this.score > this.highScore) {
            localStorage.setItem('highScore', this.score);
        }

        // 📳 haptic
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
        }
    }

    listener() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'a' || e.key === 'ArrowLeft') this.move('left');
            if (e.key === 'd' || e.key === 'ArrowRight') this.move('right');
        });

        this.btnLeft.onclick = () => this.move('left');
        this.btnRight.onclick = () => this.move('right');
    }
}
