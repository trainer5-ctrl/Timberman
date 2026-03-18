class Lumberjack {
    constructor(props) {
        this.canvas = props.el;
        this.canvas.width = window.innerWidth > props.maxWidth ? props.maxWidth : window.innerWidth;
        this.canvas.height = props.maxHeight;

        this.background = '#d3f7ff';
        this.ctx = props.el.getContext('2d');

        this.cutSound = props.cutSound;
        this.tree = null;
        this.person = null;

        this.score = 0;

        this.btnLeft = props.btnLeft;
        this.btnRight = props.btnRight;

        this.highScore = localStorage.getItem('highScore') || 0;

        // ==============================
        // 🔥 TELEGRAM USER DETECTION (FIXED)
        // ==============================
        this.playerName = "Player";

        try {
            const webApp = window.Telegram?.WebApp;
            const gameProxy = window.TelegramGameProxy;

            // 1. Cek via Telegram WebApp (Mini Apps)
            if (webApp && webApp.initDataUnsafe && webApp.initDataUnsafe.user) {
                const user = webApp.initDataUnsafe.user;
                this.playerName = user.username ? "@" + user.username : `${user.first_name} ${user.last_name || ""}`.trim();
            } 
            // 2. Cek via Telegram GameProxy (GameBot)
            else if (gameProxy && gameProxy.initParams && gameProxy.initParams.user) {
                const user = JSON.parse(gameProxy.initParams.user);
                this.playerName = user.username ? "@" + user.username : `${user.first_name} ${user.last_name || ""}`.trim();
            }
        } catch (err) {
            console.error("User detection error:", err);
        }

        this.listener();
    }

    init() {
        this.person = new Person(this.canvas);
        this.tree = new Tree(this.canvas, this.canvas.width / 2, this.canvas.height - 350);

        this.drawBackground();
        this.tree.init();
    }

    drawBackground() {
        this.ctx.fillStyle = this.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        let land = new Image();
        land.src = "images/land.png";
        this.ctx.drawImage(land, 0, this.canvas.height - 300, this.canvas.width, 350);
    }

    drawScore() {
        this.ctx.fillStyle = "#333";

        // 🔥 Tampilan Nama Player
        this.ctx.font = "bold 18px Arial";
        let displayName = this.playerName.length > 15 ? this.playerName.substring(0, 13) + ".." : this.playerName;
        this.ctx.fillText("Player: " + displayName, 30, 40);

        // SCORE
        this.ctx.font = "20px Arial";
        this.ctx.fillText("Score", 30, 80);
        this.ctx.font = "bold 32px Arial";
        this.ctx.fillText(this.score, 30, 115);

        // HIGHSCORE
        this.ctx.font = "20px Arial";
        this.ctx.fillText("Highscore", 30, 165);
        this.ctx.font = "bold 32px Arial";
        this.ctx.fillText(this.highScore, 30, 200);
    }

    draw() {
        this.drawBackground();
        this.tree.draw();
        this.person.draw();
        this.drawScore();
    }

    render() {
        this.draw();
        requestAnimationFrame(() => this.render());
    }

    move(direction) {
        this.person.characterPosition = direction;
        this.tree.trees.shift();
        this.tree.createNewTrunk();

        // 🔊 SOUND
        let audio = new Audio();
        audio.src = "audio/cut.wav";
        audio.playbackRate = 2;
        audio.play();

        this.score++;

        let currentBranch = this.tree.trees[0].value;

        // 💀 COLLISION CHECK
        if (
            (currentBranch == 'left' && this.person.characterPosition == 'left') ||
            (currentBranch == 'right' && this.person.characterPosition == 'right')
        ) {
            setTimeout(() => {
                if (this.score > this.highScore) {
                    localStorage.setItem('highScore', this.score);
                }
                
                alert(`Game Over!\n\nPlayer: ${this.playerName}\nScore: ${this.score}\nHighscore: ${localStorage.getItem('highScore')}`);
                window.location.reload();
            }, 100);
        }
    }

    listener() {
        window.addEventListener('keydown', (e) => {
            if (e.key == 'a' || e.key == 'ArrowLeft') this.move('left');
            if (e.key == 'd' || e.key == 'ArrowRight') this.move('right');
        });

        this.btnLeft.addEventListener('click', () => this.move('left'));
        this.btnRight.addEventListener('click', () => this.move('right'));
    }
}
