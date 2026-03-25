class Lumberjack {
    constructor(props) {
        this.canvas = props.el;
        this.canvas.width = window.innerWidth > props.maxWidth ? props.maxWidth : window.innerWidth;
        this.canvas.height = props.maxHeight;
        this.ctx = this.canvas.getContext('2d');

        this.backgroundTop = '#87CEEB'; // gradasi langit biru
        this.backgroundBottom = '#d3f7ff';
        this.score = 0;

        // UI
        this.scoreEl = document.getElementById("score");
        this.highScore = localStorage.getItem('highScore') || 0;

        this.btnLeft = props.btnLeft;
        this.btnRight = props.btnRight;

        // Load image tanah
        this.landImage = new Image();
        this.landImage.src = "images/land.png";

        // TELEGRAM USER
        this.playerName = "Guest Player"; 
        const tg = window.Telegram?.WebApp;

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
        this.tree.init();
        this.updateScoreUI();
    }

    // Gambar background dengan gradasi
    drawBackground() {
        const grad = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        grad.addColorStop(0, this.backgroundTop);
        grad.addColorStop(1, this.backgroundBottom);
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // gambar tanah jika sudah load
        if (this.landImage && this.landImage.complete && this.landImage.naturalWidth !== 0) {
            this.ctx.drawImage(
                this.landImage,
                0,
                this.canvas.height - 300,
                this.canvas.width,
                350
            );
        }

        // efek bayangan tanah
        this.ctx.fillStyle = 'rgba(0,0,0,0.1)';
        this.ctx.fillRect(0, this.canvas.height - 50, this.canvas.width, 50);
    }

    draw() {
        this.drawBackground();

        // gambar pohon dengan bayangan batang
        if (this.tree) {
            this.ctx.save();
            this.ctx.shadowColor = "rgba(0,0,0,0.3)";
            this.ctx.shadowBlur = 10;
            this.ctx.shadowOffsetX = 5;
            this.ctx.shadowOffsetY = 5;
            this.tree.draw();
            this.ctx.restore();
        }

        // gambar karakter
        if (this.person) {
            this.person.update(); 
            this.person.draw();
        }
    }

    render() {
        this.draw();
        requestAnimationFrame(() => this.render());
    }

    // Update UI score
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
        if (!this.person) return;

        // animasi lompat
        this.person.startJump();

        // arah karakter
        this.person.characterPosition = direction;

        // update tree
        this.tree.trees.shift();
        this.tree.createNewTrunk();

        // suara potong kayu
        let audio = new Audio("audio/cut.wav");
        audio.playbackRate = 2;
        audio.play().catch(() => {});

        // tambah score
        this.score++;
        this.updateScoreUI();

        let currentBranch = this.tree.trees[0].value;

        // GAME OVER
        if (currentBranch === direction) {
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
            }

            setTimeout(() => {
                if (this.score > this.highScore) {
                    localStorage.setItem('highScore', this.score);
                }

                alert(`GAME OVER!\n\nPlayer: ${this.playerName}\nScore: ${this.score}`);
                window.location.reload();
            }, 50);
        }
    }

    listener() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'a' || e.key === 'ArrowLeft') this.move('left');
            if (e.key === 'd' || e.key === 'ArrowRight') this.move('right');
        });

        if (this.btnLeft) this.btnLeft.onclick = () => this.move('left');
        if (this.btnRight) this.btnRight.onclick = () => this.move('right');
    }
}
